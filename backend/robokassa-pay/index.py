import json
import os
import hashlib
import time

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

PLANS = {
    "start":    {"name": "CloudVideo Старт",   "price": 490,  "cameras": 2,  "storage_days": 7},
    "pro":      {"name": "CloudVideo Про",     "price": 1290, "cameras": 8,  "storage_days": 30},
    "business": {"name": "CloudVideo Бизнес",  "price": 3900, "cameras": 32, "storage_days": 90},
}


def make_signature(*parts) -> str:
    return hashlib.md5(":".join(str(p) for p in parts).encode()).hexdigest()


def verify_token(token: str):
    """Копия логики из video-auth — проверяет токен пользователя."""
    import hmac
    SECRET = "cloudvideo_jwt_secret_2026"
    DEMO_TOKEN = "demo_token_cloudvideo"
    if token == DEMO_TOKEN:
        return {"id": 0, "email": "demo@cloudvideo.ru", "is_demo": True}
    try:
        parts = token.rsplit(":", 1)
        if len(parts) != 2:
            return None
        payload, sig = parts
        expected = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        uid_str, email, exp_str = payload.split(":", 2)
        if int(exp_str) < int(time.time()):
            return None
        return {"id": int(uid_str), "email": email, "is_demo": False}
    except Exception:
        return None


def handler(event: dict, context) -> dict:
    """Интеграция с Robokassa: создание ссылки на оплату и обработка ResultURL."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    login = os.environ.get("ROBOKASSA_LOGIN", "")
    pass1 = os.environ.get("ROBOKASSA_PASSWORD1", "")
    pass2 = os.environ.get("ROBOKASSA_PASSWORD2", "")

    # ── POST /create — создать ссылку на оплату ──
    if method == "POST" and action == "create":
        auth_header = (event.get("headers") or {}).get("X-Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        user = verify_token(token)
        if not user or user.get("is_demo"):
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Требуется авторизация"})}

        body = json.loads(event.get("body") or "{}")
        plan_id = body.get("plan_id", "")
        if plan_id not in PLANS:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный тариф"})}

        plan = PLANS[plan_id]
        inv_id = int(time.time() * 1000) % 2147483647
        amount = plan["price"]
        desc = plan["name"]

        # Сохраняем pending-заказ
        import psycopg2
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO cloud_video_orders (inv_id, user_id, plan_id, amount, status, created_at) VALUES (%s, %s, %s, %s, 'pending', NOW())",
            (inv_id, user["id"], plan_id, amount)
        )
        conn.commit()
        conn.close()

        sig = make_signature(login, f"{amount:.2f}", inv_id, pass1)
        pay_url = (
            f"https://auth.robokassa.ru/Merchant/Index.aspx"
            f"?MerchantLogin={login}"
            f"&OutSum={amount:.2f}"
            f"&InvId={inv_id}"
            f"&Description={desc}"
            f"&SignatureValue={sig}"
            f"&IsTest=0"
        )

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"pay_url": pay_url, "inv_id": inv_id})}

    # ── POST /result — ResultURL от Robokassa ──
    if method == "POST" and action == "result":
        body_raw = event.get("body") or ""
        from urllib.parse import parse_qs
        parsed = parse_qs(body_raw)
        out_sum = (parsed.get("OutSum") or ["0"])[0]
        inv_id = (parsed.get("InvId") or ["0"])[0]
        sig_received = (parsed.get("SignatureValue") or [""])[0].upper()

        sig_expected = make_signature(out_sum, inv_id, pass2).upper()
        if sig_received != sig_expected:
            return {"statusCode": 400, "headers": CORS, "body": "bad signature"}

        import psycopg2
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute("SELECT user_id, plan_id FROM cloud_video_orders WHERE inv_id = %s AND status = 'pending'", (int(inv_id),))
        row = cur.fetchone()
        if row:
            user_id, plan_id = row
            plan = PLANS.get(plan_id, {})
            cur.execute("UPDATE cloud_video_orders SET status = 'paid', paid_at = NOW() WHERE inv_id = %s", (int(inv_id),))
            if plan:
                cur.execute(
                    "UPDATE cloud_video_users SET plan = %s, cameras_limit = %s, storage_days = %s, paid_until = NOW() + INTERVAL '1 month' WHERE id = %s",
                    (plan_id, plan["cameras"], plan["storage_days"], user_id)
                )
            conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": f"OK{inv_id}"}

    # ── GET /status — проверить статус заказа ──
    if method == "GET" and action == "status":
        inv_id = params.get("inv_id", "")
        if not inv_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "inv_id required"})}

        import psycopg2
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute("SELECT status, plan_id FROM cloud_video_orders WHERE inv_id = %s", (int(inv_id),))
        row = cur.fetchone()
        conn.close()

        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Order not found"})}

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"status": row[0], "plan_id": row[1]})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}