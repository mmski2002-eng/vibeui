# DEPLOY

Деплой на собственный VPS: Node.js 20+, nginx, systemd. Docker не нужен.

Приложение собирается в самодостаточный сервер (`output: "standalone"`),
слушает `127.0.0.1:3000`, наружу его отдаёт nginx с TLS.

Ниже `<domain>` — ваш домен, `<user>` — пользователь, от которого работает
приложение. Команды выполняются на сервере.

## 0. Подготовка

```bash
sudo apt update && sudo apt install -y git nginx
node -v            # нужен 20 или выше
```

DNS: A-запись `<domain>` должна указывать на IP сервера — иначе Let's Encrypt
не выдаст сертификат.

## 1. Код

```bash
sudo mkdir -p /srv/vibeui && sudo chown <user>:<user> /srv/vibeui
git clone https://github.com/mmski2002-eng/vibeui.git /srv/vibeui
cd /srv/vibeui
npm ci
```

Репозиторий приватный: git спросит логин и пароль. Пароль — personal access
token с правом `repo`. Токен в файлы проекта не записывать.

## 2. Сборка

**`REGISTRY_BASE_URL` нужен именно на сборке.** Страницы компонентов
статические, install-команда вшивается в HTML во время build. Без переменной
сайт честно напишет, что команда недоступна; после её изменения нужна
пересборка, перезапуск не поможет.

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
PORT=3000 HOSTNAME=127.0.0.1 node .next/standalone/server.js
curl -I http://127.0.0.1:3000/
curl -s http://127.0.0.1:3000/r/hero-001.json | head -c 80
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
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
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

`REGISTRY_BASE_URL` в юните не нужен: значение уже вшито на сборке.

## 4. nginx

`/etc/nginx/sites-available/vibeui`:

```nginx
server {
    listen 80;
    server_name <domain>;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
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

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <domain>
```

Certbot сам добавит 443-й server-блок и редирект с 80. Автопродление ставится
таймером `certbot.timer`.

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
cd /srv/vibeui
git pull
npm ci
export REGISTRY_BASE_URL="https://<domain>/r"
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
sudo systemctl restart vibeui
```

## Что важно помнить

- `public/r/` — артефакт сборки, в git его нет; он создаётся `npm run build`;
- смена `REGISTRY_BASE_URL` требует пересборки, не только рестарта;
- порт 3000 наружу не открывать: приложение слушает только localhost;
- `.env` на сервере не нужен — переменная задаётся в окружении сборки.
