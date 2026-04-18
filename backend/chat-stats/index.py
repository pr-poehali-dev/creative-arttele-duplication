import json
import os
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    """Возвращает статистику чата (попадания в кеш/вызовы ИИ) за последние 30 дней."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    expected = os.environ.get("ADMIN_TOKEN", "")
    if not expected or token != expected:
        return {
            "statusCode": 401,
            "headers": CORS,
            "body": json.dumps({"error": "Доступ запрещён"}, ensure_ascii=False),
        }

    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        return {
            "statusCode": 500,
            "headers": CORS,
            "body": json.dumps({"error": "БД недоступна"}, ensure_ascii=False),
        }

    rows_out = []
    total_cache = 0
    total_ai = 0
    try:
        with psycopg2.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT stat_date::text, cache_hits, ai_calls "
                    "FROM chat_stats "
                    "WHERE stat_date >= CURRENT_DATE - INTERVAL '30 days' "
                    "ORDER BY stat_date DESC"
                )
                for date, cache_hits, ai_calls in cur.fetchall():
                    total = cache_hits + ai_calls
                    saved_pct = (cache_hits * 100 // total) if total else 0
                    rows_out.append({
                        "date": date,
                        "cache_hits": cache_hits,
                        "ai_calls": ai_calls,
                        "total": total,
                        "saved_pct": saved_pct,
                    })
                    total_cache += cache_hits
                    total_ai += ai_calls
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS,
            "body": json.dumps({"error": str(e)[:300]}, ensure_ascii=False),
        }

    grand_total = total_cache + total_ai
    grand_saved = (total_cache * 100 // grand_total) if grand_total else 0

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "days": rows_out,
            "summary": {
                "total_messages": grand_total,
                "total_cache": total_cache,
                "total_ai": total_ai,
                "saved_pct": grand_saved,
            },
        }, ensure_ascii=False),
    }
