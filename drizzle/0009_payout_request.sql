-- Заявки блогеров на вывод комиссии. Путь: блогер подаёт заявку (pending),
-- администратор согласовывает (approved), затем переводит деньги и отмечает
-- выплату (paid), приложив ссылку на чек блогера из «Мой налог» (создаётся
-- запись в partner_payout). rejected — отказ. Открытая заявка у блогера одна.

CREATE TABLE IF NOT EXISTS "payout_request" (
  "id" text PRIMARY KEY NOT NULL,
  "partner_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "amount" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "note" text,
  "receipt_url" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "approved_at" timestamp,
  "approved_by" text,
  "resolved_at" timestamp,
  "resolved_by" text
);

CREATE INDEX IF NOT EXISTS "payout_request_status_idx" ON "payout_request" ("status", "created_at");
CREATE INDEX IF NOT EXISTS "payout_request_partner_idx" ON "payout_request" ("partner_id");
