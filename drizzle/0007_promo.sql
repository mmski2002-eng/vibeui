-- Промокоды блогеров: ник партнёра даёт скидку на первый платёж, платёж
-- запоминает код, партнёра, процент и цену без скидки — по этому потом
-- считается доля блогера. Код живёт в partner_invite: второго источника
-- правды о партнёре не заводим.

ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "promo_code" text UNIQUE;
ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "promo_percent" integer;
ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "promo_active" boolean NOT NULL DEFAULT true;

ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "list_amount" text;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "promo_code" text;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "promo_percent" integer;
ALTER TABLE "payment" ADD COLUMN IF NOT EXISTS "partner_id" text REFERENCES "user"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "payment_partner_idx" ON "payment" ("partner_id", "paid_at");

-- Скидка по умолчанию, процентов. Правится администратором рядом с ценами.
INSERT INTO "setting" ("key", "value") VALUES ('promo.percent', '30')
ON CONFLICT ("key") DO NOTHING;
