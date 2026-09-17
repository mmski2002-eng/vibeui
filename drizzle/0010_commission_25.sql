-- Комиссия блогера по умолчанию: 30 → 25 %. 0008 сидит значение с
-- ON CONFLICT DO NOTHING, поэтому меняем его отдельной строкой. Миграции
-- идут по порядку имени: 0008 создаёт setting, 0010 правит значение.
-- Скидку покупателю (promo.percent) не трогаем.

UPDATE "setting" SET "value" = '25', "updated_at" = now()
WHERE "key" = 'commission.percent';

INSERT INTO "setting" ("key", "value") VALUES ('commission.percent', '25')
ON CONFLICT ("key") DO NOTHING;
