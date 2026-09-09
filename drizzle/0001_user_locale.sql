-- Язык писем. По умолчанию русский: существующие аккаунты заводились
-- только на русской версии сайта.
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "locale" text NOT NULL DEFAULT 'ru';
