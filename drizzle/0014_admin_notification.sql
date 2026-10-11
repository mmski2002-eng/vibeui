-- Уведомления владельцу в Telegram. RU-сервер до Telegram не достучится,
-- поэтому сайт только складывает строки, а отправляет их worker агентов.
CREATE TABLE IF NOT EXISTS "admin_notification" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "delivered_at" timestamp
);
CREATE INDEX IF NOT EXISTS "admin_notification_pending_idx" ON "admin_notification" ("created_at") WHERE "delivered_at" IS NULL;
