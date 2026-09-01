# DEPLOY

Деплой на собственный VPS: Node.js 20+, nginx, systemd. Docker не нужен.

Приложение собирается в самодостаточный сервер (`output: "standalone"`),
слушает `127.0.0.1:3000`, наружу его отдаёт nginx с TLS.

Фактическая установка: `vibeui.ru`, сервер `216.173.70.241`, порт
`127.0.0.1:3003`, юнит `vibeui.service`. Каталогов два: `/srv/vibeui` —
рабочая копия, где идёт сборка; `/srv/vibeui-live` — симлинк на текущий
релиз в `/srv/vibeui-releases/<метка>`, откуда работает живой процесс.
Порты 3000–3002 на этом сервере заняты другими проектами.
Секреты — в `local/SECRETS.local.md` (не в git).

Ниже `<domain>` — домен, `<user>` — пользователь, от которого работает
приложение. Команды выполняются на сервере.

## 0. Подготовка

```bash
sudo apt update && sudo apt install -y git nginx
node -v            # нужен 20 или выше
```

DNS: A-запись `<domain>` должна указывать на IP сервера — иначе Let's Encrypt
не выдаст сертификат.

## 1. Код

Разделы 1–2 нужны только для первой установки сервера: обычный деплой идёт
через GitHub Actions (§7), рабочей копии и сборки на VPS больше нет.

Репозиторий приватный. На сервере используется read-only deploy key —
личный токен на сервер не кладём:

```bash
ssh-keygen -t ed25519 -N "" -C "vibeui-deploy@vps" -f /root/.ssh/vibeui_deploy
cat /root/.ssh/vibeui_deploy.pub
# добавить этот ключ: GitHub → репозиторий → Settings → Deploy keys → Add
cat >> /root/.ssh/config <<'EOF'
Host github-vibeui
  HostName github.com
  User git
  IdentityFile /root/.ssh/vibeui_deploy
  IdentitiesOnly yes
EOF
chmod 600 /root/.ssh/config

git clone git@github-vibeui:mmski2002-eng/vibeui.git /srv/vibeui
cd /srv/vibeui
npm ci
```

## 2. Сборка

**`REGISTRY_BASE_URL` нужен и на сборке, и в окружении процесса.** Значение
читается в `lib/site.ts` через `process.env`, а страницы item'ов и маршрут
`/c/<name>` рендерятся на каждый запрос — то есть берут переменную из
окружения работающего сервера, а не из сборки. Забыть её в юните — значит
получить на живом сайте «Команда установки не сконфигурирована» вместо
install-команды.

```bash
cd /srv/vibeui
export REGISTRY_BASE_URL="https://<domain>/r"
npm run build        # registry:build -> public/r/, затем next build
```

Сборка standalone не копирует статику сама — это делается вручную:

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

Проверка до nginx:

```bash
PORT=3003 HOSTNAME=127.0.0.1 node .next/standalone/server.js
curl -I http://127.0.0.1:3003/
curl -s http://127.0.0.1:3003/r/hero-001.json | head -c 80
```

Первый запрос к странице может ответить 404 (`NoFallbackError`) — это прогрев
standalone-сервера, повторный запрос отдаёт 200.

## 3. systemd

`/etc/systemd/system/vibeui.service`:

```ini
[Unit]
Description=VibeUI
After=network.target

[Service]
Type=simple
User=<user>
WorkingDirectory=/srv/vibeui-live
Environment=NODE_ENV=production
Environment=PORT=3003
Environment=HOSTNAME=127.0.0.1
Environment=REGISTRY_BASE_URL=https://<domain>/r
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now vibeui
sudo systemctl status vibeui
```

`WorkingDirectory` указывает на **симлинк**, а не на каталог сборки. systemd
разрешает его при старте юнита, поэтому переключение релиза сводится к
переносу симлинка и рестарту. Собирать в каталог, откуда сервер раздаёт
статику, нельзя: `next build` вычищает `.next` в самом начале, и живой сайт
на всё время сборки теряет `/_next/static/*` — HTML отдаётся, стили и скрипты
отваливаются с 500.

`REGISTRY_BASE_URL` в юните обязателен: страницы item'ов динамические и
читают переменную из окружения процесса при каждом запросе.

## 4. nginx

`/etc/nginx/sites-available/vibeui`:

```nginx
server {
    listen 80;
    server_name <domain>;

    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/vibeui /etc/nginx/sites-enabled/vibeui
sudo nginx -t && sudo systemctl reload nginx
```

## 5. HTTPS

Если nginx-плагина certbot нет (проверяется командой
`certbot --nginx` — ошибка «plugin does not appear to be installed»),
используется webroot: в 80-м server-блоке уже есть
`location /.well-known/acme-challenge/ { root /var/www/certbot; }`.

```bash
sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot   -d <domain> -d www.<domain> --agree-tos -m <email>
```

После выпуска сертификата 443-й server-блок дописывается вручную. Важно для
nginx 1.18: директива `http2 on;` не поддерживается, нужно
`listen 443 ssl http2;`. Шаблонов `options-ssl-nginx.conf` и `ssl-dhparams.pem`
при webroot-установке может не быть — TLS-параметры задаются явно:

```nginx
ssl_certificate /etc/letsencrypt/live/<domain>/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
```

## 6. Проверка

```bash
curl -I https://<domain>/
curl -I https://<domain>/components
curl -I https://<domain>/components/hero-001
curl -I https://<domain>/preview/hero-001
curl -s https://<domain>/r/hero-001.json | head -c 120
```

На странице компонента install-команда должна содержать `https://<domain>/r`,
слова `localhost` в production-HTML быть не должно.

## 7. Обновление

Деплой автоматический: push в `main` запускает workflow `deploy`
(`.github/workflows/deploy.yml`). Runner ставит зависимости, гоняет
`lint`, `build` и `typecheck`, пакует `standalone` + `static` + `public`
в тарбол, заливает его на сервер и запускает `scripts/deploy-remote.sh`:
распаковка в новый релиз, атомарная подмена симлинка `/srv/vibeui-live`,
рестарт юнита, чистка старых релизов. Простой — только рестарт.

Ручной запуск без коммита: вкладка Actions → workflow `deploy` → Run workflow.

Сборки на сервере больше нет и рабочей копии `/srv/vibeui` тоже. Причина
записана цифрами: на VPS одно ядро и 964 МБ памяти, `next build` там
занимал больше получаса с 592 МБ RSS и полностью забитым свопом, на
runner-е тот же build идёт около двух минут.

Почему собирает именно runner, а не машина разработчика: `standalone`
несёт `node_modules` с нативными бинарниками платформы сборки
(`@next/swc-*`), и Windows-сборка на Linux не запустится. Runner
`ubuntu-latest` совпадает с сервером.

Что нужно на стороне GitHub: секрет `DEPLOY_SSH_KEY` — приватный ключ,
чей публичный лежит в `/root/.ssh/authorized_keys` сервера. Хост и
пользователь заданы в `env` самого workflow.

Типы маршрутов (`LayoutProps` и прочее) Next генерирует в `.next/types`
во время сборки, поэтому `typecheck` в workflow стоит **после** `build`:
на чистом checkout он иначе падает на `app/layout.tsx`.

Откат — переключить симлинк на предыдущий релиз и рестартнуть; пересборка
для этого не нужна:

```bash
ls -1dt /srv/vibeui-releases/*
ln -sfn /srv/vibeui-releases/<предыдущий> /srv/vibeui-live.tmp
mv -Tf /srv/vibeui-live.tmp /srv/vibeui-live
systemctl restart vibeui
```

Релиз занимает около 190 МБ, поэтому старые чистятся сразу: на диске
20 ГБ, и десяток забытых релизов его заполнит.

После деплоя workflow сам проверяет `/components` и install-команду:

```bash
curl -s https://<domain>/c/hero-001 | grep "npx shadcn"
```

Правило, купленное падением прода: не собирать в каталог, откуда сервер
раздаёт статику. `next build` вычищает `.next` в начале, и живой сайт на
всё время сборки теряет `/_next/static/*` — HTML отдаётся, стили и скрипты
отваливаются с 500. Поэтому релизы лежат отдельными каталогами, а юнит
работает через симлинк.

## Что важно помнить

- `public/r/` — артефакт сборки, в git его нет; он создаётся `npm run build`.
  Сборка очищает каталог перед генерацией, поэтому item, убранный из
  корневого `registry.json`, перестаёт раздаваться после ближайшего деплоя —
  вручную удалять старые JSON на сервере не нужно;
- `REGISTRY_BASE_URL` задаётся дважды: на сборке (для того, что рендерится
  статически) и в юните (для страниц item'ов и `/c/<name>`, которые
  рендерятся на запрос). После смены значения нужны и пересборка, и рестарт;
- порт приложения наружу не открывать: оно слушает только localhost;
- `nginx -t` проверять **до** `systemctl reload nginx`, и не прятать код
  возврата за пайпом (`nginx -t | tail` всегда возвращает 0);
- `.env` на сервере не нужен — переменная задаётся в окружении сборки и
  в `Environment=` юнита.
