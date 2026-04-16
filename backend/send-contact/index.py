import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта АртТелеком Юг на почту владельца."""

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
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    topic = body.get("topic", "").strip()
    message = body.get("message", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Имя и телефон обязательны"}, ensure_ascii=False),
        }

    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ["SMTP_USER"]
    smtp_pass = os.environ["SMTP_PASS"]
    email_to = os.environ["EMAIL_TO"]

    subject = f"Новая заявка с сайта АртТелеком Юг: {topic or 'Без темы'}"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
      <h2 style="color: #111827; margin-bottom: 4px;">Новая заявка с сайта</h2>
      <p style="color: #6b7280; margin-top: 0; font-size: 14px;">АртТелеком Юг — провайдер связи</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Имя:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Телефон:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
            <a href="tel:{phone}" style="color: #0ea5e9;">{phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Тема:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">{topic or '—'}</td>
        </tr>
      </table>
      {"<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;'><p style='color: #374151; font-size: 14px; white-space: pre-wrap;'>" + message + "</p>" if message else ""}
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = email_to
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, email_to, msg.as_string())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}, ensure_ascii=False),
    }