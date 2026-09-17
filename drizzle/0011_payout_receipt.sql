-- Ссылка на чек из «Мой налог»: блогер прикладывает её к выплате комиссии.
-- Профильное поле рядом с ИНН и реквизитами СБП.

ALTER TABLE "partner_invite" ADD COLUMN IF NOT EXISTS "payout_receipt" text;
