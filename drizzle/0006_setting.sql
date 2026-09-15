-- Настройки, которые администратор меняет из кабинета без релиза. Пока
-- только цены тарифов: ключ — имя настройки, значение — строка.
CREATE TABLE IF NOT EXISTS "setting" (
  "key" text PRIMARY KEY,
  "value" text NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT now()
);
