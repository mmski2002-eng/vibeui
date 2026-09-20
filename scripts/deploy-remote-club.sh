#!/usr/bin/env bash
# Серверная половина деплоя vibeui.club на латвийском VPS. Отдельные пути и
# сервис от .ru: /srv/vibeui-club-*, /etc/vibeui-club.env, vibeui-club.service.
set -euo pipefail

TARBALL=/tmp/vibeui-club-release.tar.gz
REL="/srv/vibeui-club-releases/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$REL"
tar -xzf "$TARBALL" -C "$REL"
rm -f "$TARBALL"

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

ls -1dt /srv/vibeui-club-releases/* | tail -n +3 | xargs -r rm -rf

echo "released club $REL"
