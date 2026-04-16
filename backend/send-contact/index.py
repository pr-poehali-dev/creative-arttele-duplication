import json
import os
import smtplib
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SYSTEM_PROMPTS = {
    "site": (
        "Ты — дружелюбный консультант интернет-провайдера АртТелеком Юг. "
        "Работаешь на юге России (посёлки Оазис, Новый, Отрадный, Натухай, Энем и др.), "
        "предлагаешь домашний и бизнес-интернет, цифровое ТВ, IP-телефонию, "
        "видеонаблюдение и защиту от угроз. Скорости до 2.5 Гбит/с, подключение за 24 часа, 0 ₽ за подключение. "
        "Тарифы для дома: Лайт, Базовый, Комфорт, Старт, Оптима, Премиум, Ультра, Максимум, Гигабит+. "
        "Отвечай кратко, по-русски, по делу. Если клиент хочет подключиться или вопрос сложный — "
        "вежливо попроси оставить имя и телефон, скажи что передашь менеджеру. "
        "Не придумывай цены и детали, которых не знаешь."
    ),
    "dashboard": (
        "Ты — помощник в личном кабинете абонента АртТелеком Юг. У тебя есть данные абонента в контексте. "
        "Отвечай на вопросы про тариф, баланс, оплату, скорость, неполадки, смену тарифа. "
        "Говори кратко, по-русски, на «вы». Если баланс отрицательный — напомни пополнить. "
        "Если интернет не работает — дай базовые советы (перезагрузить роутер, проверить кабель), "
        "и предложи оставить заявку в поддержку, если не помогло."
    ),
    "ticket": (
        "Ты — менеджер поддержки провайдера АртТелеком Юг. Абонент только что оставил заявку на сайте. "
        "Напиши короткое (2-3 предложения) тёплое сообщение от первого лица: поблагодари за обращение, "
        "скажи что принял заявку и свяжешься в течение 15 минут, если нужны уточнения — задай 1 вопрос. "
        "Без воды, по-русски, на «вы»."
    ),
}


def call_vsegpt(messages: list, max_tokens: int = 500) -> str:
    api_key = os.environ.get("GPT_API") or os.environ.get("VSEGPT_API_KEY")
    if not api_key:
        print("[AI] GPT_API / VSEGPT_API_KEY отсутствует")
        return ""
    print(f"[AI] Ключ найден, длина={len(api_key)}, префикс={api_key[:10]}")
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": max_tokens,
    }
    req = urllib.request.Request(
        "https://api.vsegpt.ru/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            raw = resp.read().decode("utf-8")
            result = json.loads(raw)
        content = result["choices"][0]["message"]["content"].strip()
        print(f"[AI] Ответ получен, длина={len(content)}")
        return content
    except urllib.error.HTTPError as e:
        body_text = ""
        try:
            body_text = e.read().decode("utf-8", errors="ignore")
        except Exception:
            pass
        print(f"[AI] HTTPError {e.code}: {body_text[:500]}")
        return ""
    except Exception as e:
        print(f"[AI] Exception: {type(e).__name__}: {str(e)[:300]}")
        return ""


def send_telegram(text: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=json.dumps({
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        }).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=10).read()
    except Exception:
        pass


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
}


def handle_chat(body: dict) -> dict:
    mode = body.get("mode", "site")
    system = SYSTEM_PROMPTS["dashboard"] if mode == "dashboard" else SYSTEM_PROMPTS["site"]

    ctx = body.get("context", {}) or {}
    if mode == "dashboard" and ctx:
        system += (
            f"\n\nДанные абонента:\n"
            f"Имя: {ctx.get('name', '—')}\n"
            f"Логин: {ctx.get('login', '—')}\n"
            f"Тариф: {ctx.get('tariff', '—')}\n"
            f"Скорость: {ctx.get('speed', '—')}\n"
            f"Баланс: {ctx.get('balance', '—')} ₽\n"
            f"Статус: {ctx.get('status', '—')}\n"
            f"Адрес: {ctx.get('address', '—')}\n"
            f"Работает до: {ctx.get('work_until', '—')}"
        )

    messages = [{"role": "system", "content": system}]
    history = body.get("history", []) or []
    messages.extend(history)

    reply = call_vsegpt(messages)
    if not reply:
        return {
            "statusCode": 502,
            "headers": CORS,
            "body": json.dumps({"error": "ИИ временно недоступен"}, ensure_ascii=False),
        }
    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"reply": reply}, ensure_ascii=False),
    }


def handle_ticket(body: dict) -> dict:
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    topic = body.get("topic", "").strip()
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "Имя и телефон обязательны"}, ensure_ascii=False),
        }

    ai_text = call_vsegpt([
        {"role": "system", "content": SYSTEM_PROMPTS["ticket"]},
        {"role": "user", "content": f"Имя: {name}\nТелефон: {phone}\nТема: {topic or '—'}\nСообщение: {message or '—'}"},
    ], max_tokens=300)

    tg_text = (
        f"<b>🔔 Новая заявка с сайта</b>\n"
        f"<b>Имя:</b> {name}\n"
        f"<b>Телефон:</b> {phone}\n"
        f"<b>Тема:</b> {topic or '—'}\n"
        f"<b>Сообщение:</b> {message or '—'}"
    )
    if ai_text:
        tg_text += f"\n\n<i>🤖 Автоответ ИИ клиенту:</i>\n{ai_text}"
    send_telegram(tg_text)

    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASS")
    email_to = os.environ.get("EMAIL_TO") or os.environ.get("NOTIFICATION_EMAIL")

    if smtp_user and smtp_pass and email_to:
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        subject = f"Новая заявка с сайта АртТелеком Юг: {topic or 'Без темы'}"
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
          <h2 style="color: #111827; margin-bottom: 4px;">Новая заявка с сайта</h2>
          <p style="color: #6b7280; margin-top: 0; font-size: 14px;">АртТелеком Юг — провайдер связи</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Имя:</td><td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Телефон:</td><td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;"><a href="tel:{phone}" style="color: #0ea5e9;">{phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Тема:</td><td style="padding: 8px 0; color: #111827; font-size: 14px;">{topic or '—'}</td></tr>
          </table>
          {"<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;'><p style='color: #374151; font-size: 14px; white-space: pre-wrap;'>" + message + "</p>" if message else ""}
          {"<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;'><p style='color: #6b7280; font-size: 13px;'><b>🤖 Автоответ ИИ клиенту:</b></p><p style='color: #374151; font-size: 14px;'>" + ai_text + "</p>" if ai_text else ""}
        </div>
        """
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = email_to
        msg.attach(MIMEText(html, "html", "utf-8"))
        try:
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, email_to, msg.as_string())
        except Exception:
            pass

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"ok": True, "reply": ai_text}, ensure_ascii=False),
    }


def handler(event: dict, context) -> dict:
    """АртТелеком Юг: заявки (mode=ticket) + ИИ-чат на сайте и в ЛК (mode=site|dashboard)."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    mode = body.get("mode", "ticket")

    if mode in ("site", "dashboard"):
        return handle_chat(body)
    return handle_ticket(body)