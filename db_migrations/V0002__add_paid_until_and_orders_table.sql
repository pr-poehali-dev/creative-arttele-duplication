ALTER TABLE cloud_video_users ADD COLUMN IF NOT EXISTS paid_until timestamp with time zone NULL;

CREATE TABLE IF NOT EXISTS cloud_video_orders (
    id SERIAL PRIMARY KEY,
    inv_id BIGINT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES cloud_video_users(id),
    plan_id TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_cloud_video_orders_user_id ON cloud_video_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_video_orders_inv_id ON cloud_video_orders(inv_id);