-- Партнёрская программа: реферальные ссылки только у блогеров, которых
-- приглашает администратор. Бонусных дней за приглашения больше нет.

-- Приглашение блогера. Одноразовое: claimed_by уникален.
CREATE TABLE IF NOT EXISTS "partner_invite" (
  "id" text PRIMARY KEY,
  "code" text NOT NULL UNIQUE,
  -- Имя блогера, как ввёл администратор.
  "name" text NOT NULL,
  -- Почта администратора, создавшего ссылку.
  "created_by" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "claimed_by" text UNIQUE REFERENCES "user"("id") ON DELETE SET NULL,
  "claimed_at" timestamp
);

CREATE INDEX IF NOT EXISTS "partner_invite_created_idx" ON "partner_invite" ("created_at");

-- Старые ссылки открытой программы удаляются целиком: раздавать их могли
-- все, а теперь код есть только у партнёра. Привязки user.invited_by
-- остаются как история.
DELETE FROM "referral_visit";
DELETE FROM "referral";

-- Начислений за приглашения больше не будет; уже выданные дни живут в
-- subscription и никуда не деваются.
DROP TABLE IF EXISTS "referral_reward";
