#!/usr/bin/env bash
# Серверная половина деплоя: распаковать присланный релиз и переключить на
# него симлинк. Сборки здесь нет — она осталась в GitHub Actions.
set -euo pipefail

TARBALL=/tmp/vibeui-release.tar.gz
REL="/srv/vibeui-releases/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$REL"
tar -xzf "$TARBALL" -C "$REL"
rm -f "$TARBALL"

# Схема базы приводится в порядок до переключения: новая версия не должна
# увидеть старую схему, а старая — новую.
if [ -f /etc/vibeui.env ]; then
  # Файл читается как shell-код, поэтому значение с пробелами или скобками
  # без кавычек роняет весь деплой. Проверяем до подстановки и говорим об
  # этом прямо: один раз строка SMTP_FROM уже стоила красной сборки.
  if ! bash -n /etc/vibeui.env; then
    echo "/etc/vibeui.env содержит синтаксическую ошибку — деплой остановлен" >&2
    exit 1
  fi

  set -a
  . /etc/vibeui.env
  set +a
  (cd "$REL" && node scripts/migrate.mjs)
fi

# Подмена симлинка атомарна: полусостояния не бывает.
ln -sfn "$REL" /srv/vibeui-live.tmp
mv -Tf /srv/vibeui-live.tmp /srv/vibeui-live

systemctl restart vibeui

# Держим два последних релиза: релиз ~190 МБ, на диске 20 ГБ.
ls -1dt /srv/vibeui-releases/* | tail -n +3 | xargs -r rm -rf

echo "released $REL"
