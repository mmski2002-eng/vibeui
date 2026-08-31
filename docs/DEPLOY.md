# DEPLOY

Деплой на собственный VPS: Node.js 20+, nginx, systemd. Docker не нужен.

Приложение собирается в самодостаточный сервер (`output: "standalone"`),
слушает `127.0.0.1:3000`, наружу его отдаёт nginx с TLS.

Фактическая установка: `vibeui.ru`, сервер `216.173.70.241`, каталог
`/srv/vibeui`, порт `127.0.0.1:3003`, юнит `vibeui.service`.
Порты 3000–3002 на этом сервере заняты другими проектами.
Секреты — в `SECRETS.local.md` (не в git).

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
WorkingDirectory=/srv/vibeui/.next/standalone
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

```bash
set -e                       # без него рестарт случится и на упавшей сборке
cd /srv/vibeui
git checkout -- registry.json   # файл генерируется сборкой и мешает git pull
git pull
npm ci
export REGISTRY_BASE_URL="https://<domain>/r"
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
sudo systemctl restart vibeui
```

Три правила, купленные падением прода:

- команды соединять через `set -e` или `&&`, но не через пайп в `grep`/`head`:
  код возврата пайпа — это код **последней** команды, поэтому упавшая сборка
  так не ловится, а сервис перезапускается на пустом `.next`;
- не убивать зависшую сборку через `pkill -f "next build"`: шаблон совпадает
  с собственной командной строкой ssh и убивает сам скрипт. Правильно —
  `pgrep -f "[n]ext build" | xargs -r kill`;
- «Another next build process is already running» означает застрявший lock:
  лечится `rm -rf .next` перед сборкой, иначе сборки молча не будет.

После обновления проверять не только код ответа, но и install-команду:

```bash
curl -s https://<domain>/c/hero-001 | grep "npx shadcn"
```

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
