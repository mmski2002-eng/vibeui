#!/usr/bin/env bash
# Применение миграций на сервере: до переключения симлинка, чтобы новая
# версия приложения не увидела старую схему.
#
# Работаем через psql, а не через мигратор drizzle: standalone-релиз несёт
# только те модули, которые Next нашёл трейсингом, и `drizzle-orm/.../migrator`
# в него не попадает — деплой падал с ERR_MODULE_NOT_FOUND. psql на сервере
# есть всегда: без него не было бы и самой базы.
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL не задан}"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c \
  'CREATE TABLE IF NOT EXISTS schema_migrations (
     name text PRIMARY KEY,
     applied_at timestamptz NOT NULL DEFAULT now()
   )'

applied=0

for file in drizzle/*.sql; do
  [ -e "$file" ] || continue
  name=$(basename "$file")

  if [ "$(psql "$DATABASE_URL" -tAc "SELECT 1 FROM schema_migrations WHERE name = '$name'")" = "1" ]; then
    continue
  fi

  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$file"
  psql "$DATABASE_URL" -q -c "INSERT INTO schema_migrations (name) VALUES ('$name')"
  echo "  применена $name"
  applied=$((applied + 1))
done

echo "✓ миграции: применено $applied"
