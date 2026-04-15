import json
import requests
from bs4 import BeautifulSoup
import re

LK_URL = "http://lk.arttele.ru"


def handler(event, context):
    """Парсер личного кабинета MikroBill"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    cors = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    if action == 'auth':
        return handle_auth(event, cors)
    elif action == 'user_info':
        return handle_user_info(event, cors)
    elif action == 'payments':
        return handle_payments(event, cors)
    elif action == 'ping':
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'status': 'ok'})}
    else:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Unknown action'})}


def login_session(login, password):
    session = requests.Session()
    print(f"[LOGIN] Attempting login with: '{login}'")
    resp = session.post(
        f"{LK_URL}/login.php",
        data={'login': login, 'pass': password},
        timeout=15,
    )
    resp.encoding = 'utf-8'

    title = ''
    import re as _re
    title_match = _re.search(r'<title>(.*?)</title>', resp.text)
    if title_match:
        title = title_match.group(1)
    print(f"[LOGIN] Response title: '{title}', status: {resp.status_code}, url: {resp.url}")

    has_auth = 'Авторизация' in resp.text
    has_pass = 'name="pass"' in resp.text
    print(f"[LOGIN] has_auth={has_auth}, has_pass={has_pass}")

    if has_auth and has_pass:
        return None, None

    return session, resp.text


def handle_auth(event, cors):
    try:
        body = json.loads(event.get('body', '{}'))
    except Exception:
        body = {}

    login = body.get('login', '')
    password = body.get('password', '')

    if not login or not password:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Введите логин и пароль'})}

    session, html = login_session(login, password)
    if not session:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

    data = parse_main_page(html)
    data['login'] = login

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True, 'user': data}, ensure_ascii=False)}


def handle_user_info(event, cors):
    params = event.get('queryStringParameters') or {}
    login = params.get('login', '')
    password = params.get('password', '')

    if not login or not password:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Missing credentials'})}

    session, html = login_session(login, password)
    if not session:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Auth failed'})}

    data = parse_main_page(html)
    data['login'] = login

    try:
        pay_resp = session.get(f"{LK_URL}/index.php?pay", timeout=10)
        pay_resp.encoding = 'utf-8'
        data['payments'] = parse_payments_page(pay_resp.text)
    except Exception:
        data['payments'] = []

    try:
        stat_resp = session.get(f"{LK_URL}/index.php?stat", timeout=10)
        stat_resp.encoding = 'utf-8'
        data['traffic'] = parse_traffic_page(stat_resp.text)
    except Exception:
        data['traffic'] = []

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps(data, ensure_ascii=False)}


def handle_payments(event, cors):
    params = event.get('queryStringParameters') or {}
    login = params.get('login', '')
    password = params.get('password', '')

    if not login or not password:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Missing credentials'})}

    session, html = login_session(login, password)
    if not session:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Auth failed'})}

    try:
        pay_resp = session.get(f"{LK_URL}/index.php?pay", timeout=10)
        pay_resp.encoding = 'utf-8'
        payments = parse_payments_page(pay_resp.text)
    except Exception:
        payments = []

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'payments': payments}, ensure_ascii=False)}


def parse_main_page(html):
    soup = BeautifulSoup(html, 'html.parser')
    data = {
        'name': '',
        'balance': '',
        'tariff': '',
        'speed': '',
        'status': '',
        'account': '',
        'address': '',
        'phone': '',
        'email': '',
        'credit': '',
        'ip': '',
    }

    text = soup.get_text(' ', strip=True)

    for tr in soup.find_all('tr'):
        tds = tr.find_all(['td', 'th'])
        if len(tds) >= 2:
            label = tds[0].get_text(strip=True).lower()
            value = tds[1].get_text(strip=True)

            if any(w in label for w in ['баланс', 'депозит', 'deposit']):
                bal = re.search(r'(-?\d+[.,]\d{2})', value)
                if bal:
                    data['balance'] = bal.group(1).replace(',', '.')
            elif any(w in label for w in ['тариф', 'tarif']):
                data['tariff'] = value
            elif any(w in label for w in ['фио', 'абонент', 'имя', 'name']):
                data['name'] = value
            elif any(w in label for w in ['договор', 'аккаунт', 'account', 'лицевой', '№']):
                data['account'] = value
            elif any(w in label for w in ['статус', 'status']):
                data['status'] = value
            elif any(w in label for w in ['адрес', 'address']):
                data['address'] = value
            elif any(w in label for w in ['скорость', 'speed']):
                data['speed'] = value
            elif any(w in label for w in ['телефон', 'phone']):
                data['phone'] = value
            elif any(w in label for w in ['кредит', 'credit']):
                data['credit'] = value
            elif 'ip' == label.strip():
                data['ip'] = value

    for div in soup.find_all('div', class_=re.compile(r'item|row|field|info|param|line', re.I)):
        div_text = div.get_text(' ', strip=True)
        for key, patterns in [
            ('balance', ['баланс', 'депозит']),
            ('tariff', ['тариф']),
            ('name', ['фио', 'абонент']),
            ('account', ['договор', 'аккаунт', 'лицевой']),
            ('status', ['статус']),
            ('address', ['адрес']),
            ('speed', ['скорость']),
            ('phone', ['телефон']),
        ]:
            if any(p in div_text.lower() for p in patterns):
                parts = re.split(r'[:\s]{2,}', div_text, maxsplit=1)
                if len(parts) == 2 and not data[key]:
                    data[key] = parts[1].strip()

    if not data['balance']:
        bal_match = re.search(r'(?:Баланс|Депозит|Счёт|Счет)[:\s]*(-?\d+[.,]\d{2})', text, re.I)
        if bal_match:
            data['balance'] = bal_match.group(1).replace(',', '.')

    if not data['tariff']:
        tarif_match = re.search(r'(?:Тариф|Тарифный план)[:\s]*([^\n\r]+?)(?:\s{2,}|$)', text)
        if tarif_match:
            data['tariff'] = tarif_match.group(1).strip()

    if not data['speed']:
        speed_match = re.search(r'(\d+)\s*(?:Мбит|мбит|Mbps|Mbit)', text)
        if speed_match:
            data['speed'] = speed_match.group(1) + ' Мбит/с'

    if not data['status']:
        if re.search(r'(?:Активен|Активный|Active)', text, re.I):
            data['status'] = 'Активен'
        elif re.search(r'(?:Заблокирован|Blocked|Блокировка)', text, re.I):
            data['status'] = 'Заблокирован'

    if not data['name']:
        fio_match = re.search(r'(?:ФИО|Абонент)[:\s]*([А-ЯЁа-яё\s\.\-]+?)(?:\s{2,}|\n|$)', text)
        if fio_match:
            data['name'] = fio_match.group(1).strip()

    if not data['account']:
        acc_match = re.search(r'(?:Договор|Аккаунт|Лицевой счёт|Лицевой счет)[:\s]*(\S+)', text)
        if acc_match:
            data['account'] = acc_match.group(1).strip()

    if not data['ip']:
        ip_match = re.search(r'(?:IP)[:\s]*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})', text)
        if ip_match:
            data['ip'] = ip_match.group(1)

    if not data['email']:
        email_match = re.search(r'[\w\.\-]+@[\w\.\-]+\.\w+', text)
        if email_match:
            data['email'] = email_match.group(0)

    return data


def parse_payments_page(html):
    soup = BeautifulSoup(html, 'html.parser')
    payments = []

    for table in soup.find_all('table'):
        rows = table.find_all('tr')
        for row in rows[1:]:
            tds = row.find_all('td')
            if len(tds) >= 2:
                payment = {}
                for td in tds:
                    val = td.get_text(strip=True)
                    date_match = re.search(r'\d{2}[./]\d{2}[./]\d{2,4}', val)
                    sum_match = re.search(r'(-?\+?\d+[.,]\d{2})', val)

                    if date_match and 'date' not in payment:
                        payment['date'] = date_match.group(0)
                    elif sum_match and 'amount' not in payment:
                        payment['amount'] = sum_match.group(1).replace(',', '.')
                    elif val and 'comment' not in payment and not date_match and not sum_match:
                        payment['comment'] = val

                if payment.get('date') or payment.get('amount'):
                    payments.append(payment)

    return payments[:50]


def parse_traffic_page(html):
    soup = BeautifulSoup(html, 'html.parser')
    traffic = []

    for table in soup.find_all('table'):
        rows = table.find_all('tr')
        for row in rows[1:]:
            tds = row.find_all('td')
            if len(tds) >= 2:
                entry = {}
                for td in tds:
                    val = td.get_text(strip=True)
                    date_match = re.search(r'\d{2}[./]\d{2}[./]\d{2,4}', val)
                    size_match = re.search(r'([\d.,]+)\s*(ГБ|МБ|GB|MB|КБ|KB)', val, re.I)

                    if date_match and 'date' not in entry:
                        entry['date'] = date_match.group(0)
                    elif size_match:
                        if 'incoming' not in entry:
                            entry['incoming'] = val
                        elif 'outgoing' not in entry:
                            entry['outgoing'] = val

                if entry.get('date'):
                    traffic.append(entry)

    return traffic[:30]