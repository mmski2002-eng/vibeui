-- Комиссия блогера и реестр её выплат. Комиссия — доля от собранной по
-- промокоду суммы (настройка commission.percent, по умолчанию 30). Реквизиты
-- выплаты блогер вносит сам; факт выплаты администратор фиксирует в
-- partner_payout. «К выплате» = начислено минус сумма этих записей.

ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "payout_inn" text;
ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "payout_details" text;

CREATE TABLE IF NOT EXISTS "partner_payout" (
  "id" text PRIMARY KEY NOT NULL,
  "partner_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "amount" text NOT NULL,
  "note" text,
  "created_by" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "partner_payout_partner_idx" ON "partner_payout" ("partner_id", "created_at");

-- Комиссия блогера по умолчанию, процентов. Правится администратором рядом
-- со скидкой и ценами.
INSERT INTO "setting" ("key", "value") VALUES ('commission.percent', '30')
ON CONFLICT ("key") DO NOTHING;
