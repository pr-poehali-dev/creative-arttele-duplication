import json
import os
import re
import requests
from bs4 import BeautifulSoup

KASSA_URL = "https://lk.arttele.ru/kassa"


def handler(event, context):
    """API личного кабинета АртТелеком через MikroBill"""
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
    elif action == 'ping':
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'status': 'ok'})}
    else:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Unknown action'})}


def kassa_session():
    s = requests.Session()
    s.post(
        KASSA_URL + '/index.php',
        data={
            'chaiserlogin': os.environ.get('KASSA_LOGIN', ''),
            'chaiserpassword': os.environ.get('KASSA_PASS', ''),
        },
        timeout=10,
    )
    return s


def kassa_find_user(session, login):
    r = session.get(
        KASSA_URL + '/api.php?action=finduser2&value=' + requests.utils.quote(login),
        timeout=10,
    )
    r.encoding = 'utf-8'
    text = r.text.strip()
    if not text or '||' not in text:
        return None
    parts = text.split('||')
    return {
        'uid': parts[0] if len(parts) > 0 else '',
        'name': parts[1] if len(parts) > 1 else '',
        'tariff': parts[2] if len(parts) > 2 else '',
        'balance': parts[3] if len(parts) > 3 else '',
        'ip': parts[4] if len(parts) > 4 else '',
        'active': parts[5] if len(parts) > 5 else '',
    }


def kassa_get_user_info(session, login):
    r = session.get(
        KASSA_URL + '/api.php?action=GET_USER_INFO&value=' + requests.utils.quote(login) + '&value2=1',
        timeout=10,
    )
    r.encoding = 'utf-8'
    soup = BeautifulSoup(r.text, 'html.parser')

    data = {}
    for tr in soup.find_all('tr'):
        tds = tr.find_all('td')
        i = 0
        while i < len(tds) - 1:
            label = tds[i].get_text(strip=True).rstrip(':').lower()
            value = tds[i + 1].get_text(strip=True)
            if label and value:
                data[label] = value
            i += 2

    return data


def kassa_get_payments(session, login):
    r = session.get(
        KASSA_URL + '/usrstat.php?client=' + requests.utils.quote(login),
        timeout=10,
    )
    r.encoding = 'utf-8'
    soup = BeautifulSoup(r.text, 'html.parser')

    payments = []
    for table in soup.find_all('table'):
        header_row = table.find('tr')
        if not header_row:
            continue
        headers = [th.get_text(strip=True).lower() for th in header_row.find_all(['th', 'td'])]
        if not any('дата' in h or 'сумма' in h or 'платеж' in h or 'оплат' in h for h in headers):
            continue
        for tr in table.find_all('tr')[1:]:
            cells = [td.get_text(strip=True) for td in tr.find_all('td')]
            if len(cells) >= 2:
                payment = {}
                for j, cell in enumerate(cells):
                    date_match = re.search(r'\d{2}[./]\d{2}[./]\d{2,4}', cell)
                    sum_match = re.search(r'(-?\+?\d+[.,]?\d*)', cell)
                    if date_match and 'date' not in payment:
                        payment['date'] = date_match.group(0)
                    elif sum_match and 'amount' not in payment and j > 0:
                        payment['amount'] = sum_match.group(1).replace(',', '.')
                    elif cell and 'comment' not in payment and not date_match:
                        payment['comment'] = cell
                if payment.get('date') or payment.get('amount'):
                    payments.append(payment)

    return payments[:50]


def build_user_data(login, found, info):
    speed = ''
    tariff = found.get('tariff', '') or info.get('тариф', '')
    speed_match = re.search(r'(\d+)', tariff)
    if speed_match:
        speed = speed_match.group(1) + ' Мбит/с'

    is_active = found.get('active', '') == '1'

    balance_raw = found.get('balance', '') or info.get('баланс', '')
    balance = re.search(r'(-?\d+[.,]?\d*)', balance_raw)
    balance_val = balance.group(1).replace(',', '.') if balance else '0'

    return {
        'login': login,
        'name': info.get('фио', found.get('name', '')),
        'balance': balance_val,
        'tariff': tariff,
        'speed': speed,
        'status': 'Активен' if is_active else 'Заблокирован',
        'account': info.get('договор', ''),
        'address': info.get('адрес', ''),
        'phone': info.get('телефон', ''),
        'email': info.get('e-mail', ''),
        'ip': found.get('ip', '') or info.get('ip', ''),
        'mac': info.get('mac', ''),
        'group': info.get('группа', ''),
        'credit': info.get('обещ. плат.', ''),
        'work_until': info.get('работает до', ''),
    }


def handle_auth(event, cors):
    raw = event.get('body') or '{}'
    if isinstance(raw, dict):
        body = raw
    else:
        try:
            body = json.loads(str(raw))
            if not isinstance(body, dict):
                body = {}
        except Exception:
            body = {}

    login = (body.get('login', '') or '').strip()
    password = (body.get('password', '') or '').strip()

    if not login or not password:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Введите логин и пароль'})}

    session = kassa_session()

    found = kassa_find_user(session, login)
    if not found:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Абонент не найден'})}

    lk_session = requests.Session()
    lk_resp = lk_session.post(
        'http://lk.arttele.ru/login.php',
        data={'login': login, 'pass': password, 'go': ''},
        allow_redirects=False,
        timeout=15,
    )
    if lk_resp.status_code in (301, 302):
        redirect_url = lk_resp.headers.get('Location', '')
        lk_resp = lk_session.post(
            redirect_url,
            data={'login': login, 'pass': password, 'go': ''},
            timeout=15,
        )
    lk_resp.encoding = 'utf-8'
    if 'name="pass"' in lk_resp.text:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

    info = kassa_get_user_info(session, login)
    user = build_user_data(login, found, info)

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True, 'user': user}, ensure_ascii=False)}


def handle_user_info(event, cors):
    params = event.get('queryStringParameters') or {}
    login = params.get('login', '').strip()
    password = params.get('password', '').strip()

    if not login or not password:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Missing credentials'})}

    lk_session = requests.Session()
    lk_resp = lk_session.post(
        'http://lk.arttele.ru/login.php',
        data={'login': login, 'pass': password, 'go': ''},
        allow_redirects=False,
        timeout=15,
    )
    if lk_resp.status_code in (301, 302):
        redirect_url = lk_resp.headers.get('Location', '')
        lk_resp = lk_session.post(
            redirect_url,
            data={'login': login, 'pass': password, 'go': ''},
            timeout=15,
        )
    lk_resp.encoding = 'utf-8'
    if 'name="pass"' in lk_resp.text:
        return {'statusCode': 401, 'headers': cors, 'body': json.dumps({'error': 'Auth failed'})}

    session = kassa_session()
    found = kassa_find_user(session, login)
    if not found:
        return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'User not found'})}

    info = kassa_get_user_info(session, login)
    user = build_user_data(login, found, info)
    user['payments'] = kassa_get_payments(session, login)

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps(user, ensure_ascii=False)}