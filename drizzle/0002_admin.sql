-- Кабинет администратора: жалобы, журнал действий, блокировка аккаунта и
-- лог поисковых запросов. Права администратора здесь не хранятся: список
-- почт живёт в переменной окружения ADMIN_EMAILS.

-- Обращения трёх видов одним потоком: у них общий жизненный цикл (пришло —
-- взяли — ответили — закрыли), а различает их kind.
CREATE TABLE IF NOT EXISTS "report" (
  "id" text PRIMARY KEY,
  -- component | support | legal
  "kind" text NOT NULL,
  -- new | in_progress | answered | closed | spam
  "status" text NOT NULL DEFAULT 'new',
  "subject" text NOT NULL,
  "message" text NOT NULL,
  -- Код item'а для жалоб на компонент: по нему в карточке показывается превью.
  "item_name" text,
  "user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "email" text NOT NULL,
  "locale" text NOT NULL DEFAULT 'ru',
  -- Отпечаток адреса, а не сам адрес: для ограничения частоты этого хватает,
  -- а хранить IP заявителя дольше нужного незачем.
  "ip_hash" text,
  "assignee_email" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "closed_at" timestamp
);

CREATE INDEX IF NOT EXISTS "report_status_idx" ON "report" ("status", "created_at");
CREATE INDEX IF NOT EXISTS "report_user_idx" ON "report" ("user_id");
CREATE INDEX IF NOT EXISTS "report_ip_idx" ON "report" ("ip_hash", "created_at");

-- Переписка по обращению. Ответ уходит письмом и остаётся здесь: иначе
-- история разговора живёт только в чужом почтовом ящике.
CREATE TABLE IF NOT EXISTS "report_message" (
  "id" text PRIMARY KEY,
  "report_id" text NOT NULL REFERENCES "report"("id") ON DELETE CASCADE,
  -- user | admin | note (внутренняя заметка, заявителю не видна)
  "author_type" text NOT NULL,
  "author_email" text,
  "body" text NOT NULL,
  "delivered_by_email" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "report_message_report_idx" ON "report_message" ("report_id", "created_at");

-- Журнал действий администратора. Единственный способ ответить, почему у
-- аккаунта есть Pro, которого он не оплачивал.
CREATE TABLE IF NOT EXISTS "admin_action" (
  "id" text PRIMARY KEY,
  "admin_email" text NOT NULL,
  "action" text NOT NULL,
  -- user | payment | report | token
  "target_type" text NOT NULL,
  "target_id" text NOT NULL,
  "details" jsonb,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "admin_action_created_idx" ON "admin_action" ("created_at");
CREATE INDEX IF NOT EXISTS "admin_action_target_idx" ON "admin_action" ("target_type", "target_id");

-- Блокировка и внутренняя заметка о пользователе.
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "blocked_at" timestamp;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "blocked_reason" text;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "admin_note" text;

-- Поисковые запросы. Раньше не сохранялись нигде, а «искали и не нашли» —
-- самый прямой сигнал, чего в каталоге не хватает. Строки старше полугода
-- удаляет ночная задача: запрос может содержать что угодно.
CREATE TABLE IF NOT EXISTS "search_query" (
  "id" text PRIMARY KEY,
  "query" text NOT NULL,
  "locale" text NOT NULL DEFAULT 'ru',
  "kind" text,
  "results" integer NOT NULL DEFAULT 0,
  "user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "search_query_created_idx" ON "search_query" ("created_at");
CREATE INDEX IF NOT EXISTS "search_query_results_idx" ON "search_query" ("results", "created_at");
