#!/usr/bin/env bash
# Серверная половина деплоя vibeui.club на латвийском VPS. Отдельные пути и
# сервис от .ru: /srv/vibeui-club-*, /etc/vibeui-club.env, vibeui-club.service.
# Файлы релиза уже залиты rsync-ом в $REL (см. scripts/deploy-remote.sh).
set -euo pipefail

: "${REL:?путь релиза не передан (REL)}"

if [ ! -d "$REL" ]; then
  echo "каталог релиза $REL не найден — деплой остановлен" >&2
  exit 1
fi

# Миграции club-базы — до переключения симлинка.
if [ -f /etc/vibeui-club.env ]; then
  if ! bash -n /etc/vibeui-club.env; then
    echo "/etc/vibeui-club.env содержит синтаксическую ошибку — деплой остановлен" >&2
    exit 1
  fi

  set -a
  . /etc/vibeui-club.env
  set +a
  (cd "$REL" && bash scripts/migrate.sh)
fi

ln -sfn "$REL" /srv/vibeui-club-live.tmp
mv -Tf /srv/vibeui-club-live.tmp /srv/vibeui-club-live

systemctl restart vibeui-club

ls -1dt /srv/vibeui-club-releases/* | tail -n +4 | xargs -r rm -rf

echo "released club $REL"
