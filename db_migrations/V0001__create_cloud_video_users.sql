CREATE TABLE IF NOT EXISTS cloud_video_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'pro',
  cameras_limit INT NOT NULL DEFAULT 8,
  storage_days INT NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_until TIMESTAMPTZ
);

INSERT INTO cloud_video_users (email, password_hash, name, plan, cameras_limit, storage_days, trial_until)
VALUES (
  'demo@cloudvideo.ru',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLxbPLzTOSiGBSa',
  'Демо Пользователь',
  'pro',
  8,
  30,
  NOW() + INTERVAL '30 days'
) ON CONFLICT DO NOTHING;
