#!/usr/bin/env bash
# Серверная половина деплоя: распаковать присланный релиз и переключить на
# него симлинк. Сборки здесь нет — она осталась в GitHub Actions.
set -euo pipefail

TARBALL=/tmp/vibeui-release.tar.gz
REL="/srv/vibeui-releases/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$REL"
tar -xzf "$TARBALL" -C "$REL"
rm -f "$TARBALL"

# Подмена симлинка атомарна: полусостояния не бывает.
ln -sfn "$REL" /srv/vibeui-live.tmp
mv -Tf /srv/vibeui-live.tmp /srv/vibeui-live

systemctl restart vibeui

# Держим два последних релиза: релиз ~190 МБ, на диске 20 ГБ.
ls -1dt /srv/vibeui-releases/* | tail -n +3 | xargs -r rm -rf

echo "released $REL"
