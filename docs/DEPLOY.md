# DEPLOY

Деплой на собственный VPS: Node.js 20+, nginx, systemd. Docker не нужен.

Приложение собирается в самодостаточный сервер (`output: "standalone"`),
слушает локальный порт, наружу его отдаёт nginx с TLS.

Фактическая установка: `vibeui.ru`, сервер `185.104.251.106` (Debian 12,
2 ядра, 2.9 ГБ), порт `127.0.0.1:3003`, юнит `vibeui.service`. На сервере
лежит только готовый релиз: `/srv/vibeui-live` — симлинк на текущий каталог в
`/srv/vibeui-releases/<метка>`, откуда работает живой процесс. Рабочей
копии и сборки на VPS нет — их место в GitHub Actions (§7).
Секреты — в `local/SECRETS.local.md` (не в git).

Сервер общий: на нём же живут `skazkidladetey.ru`, `tarovarvara.ru`,
`tarovarvara.online`, `prolatex` и десяток телеграм-ботов. Порты 3010–3097
заняты ими, 3003 отдан VibeUI. Конфиг nginx у VibeUI свой файл
(`sites-available/vibeui.ru`), чужие не трогать; перед каждым `reload` —
`nginx -t`.

Переехали сюда 08.09.2026 с `216.173.70.241` (Латвия): там было одно ядро и
964 МБ, и краулер клал сайт (`docs/HOSTING-AUDIT.md`). Старая установка
удалена целиком — юнит, конфиг nginx, релизы и сертификат.

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
записана цифрами: на прежнем VPS было одно ядро и 964 МБ памяти, `next build`
занимал там больше получаса с 592 МБ RSS и полностью забитым свопом, на
runner-е тот же build идёт около двух минут. Новый сервер вдвое мощнее, но
собирать на нём всё равно незачем: там крутится десяток чужих процессов, и
build отобрал бы у них память.

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

### Инцидент 2026-09-05: OOM на проверке типов (heap Node)

Деплой падал на шаге `npm run build`, exit 1. Симптом в логе runner-а:
`next build` компилировался успешно (~84 с), затем на `Running TypeScript`
куча Node упиралась в дефолтный ~2 ГБ и падала:
`FATAL ERROR: Ineffective mark-compacts near heap limit — JavaScript heap
out of memory`, следом `Failed to type check`. Node на runner-е — 20.x.

Причина — рост каталога: проверка типов ~1770 items (плюс отдельный
`typecheck`) перешагнула дефолтный потолок кучи Node 20. Локально не
воспроизводилось: node 24 экономнее и с прогретым кэшем укладывается в 2 ГБ.

Лечение — потолок кучи задан в `env` workflow:
`NODE_OPTIONS: --max-old-space-size=8192` (runner `ubuntu-latest` несёт 16 ГБ).
Покрывает и `next build`, и отдельный шаг `typecheck`.

Это временная мера, а не решение: при дальнейшем росте каталога память
вернётся как стена. Корневое решение — уйти от полного SSG всех items
(`dynamicParams=false` на всех item-маршрутах × 2 локали × 3 kind) к
on-demand рендеру item-страниц. Подробности и очередь — в
[ROADMAP-TO-MATURITY.md](ROADMAP-TO-MATURITY.md), Этап 7.

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

## 8. Оплата (ЮKassa)

Код оплаты в приложении есть целиком: создание платежа (`lib/yookassa.ts`,
`lib/payment-actions.ts`), вебхук `/api/payments/webhook`, продление
`/api/payments/renew`. Без настройки кнопка «Оплатить» уводит на
`/pricing/soon` — так сайт живёт бесплатно, пока касса не подключена.
Подключение — три шага на стороне сервера и кабинета ЮKassa, кода они не
касаются.

### 8.1. Ключи в `/etc/vibeui.env`

В кабинете ЮKassa: Интеграция → Ключи API. Нужны `shopId` и секретный ключ.
Для проверки сначала тестовый магазин (у него свой `shopId` и свой ключ,
платежи в нём не списывают деньги), потом боевой.

```bash
sudo tee -a /etc/vibeui.env >/dev/null <<'EOF2'
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CRON_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))">
EOF2
bash -n /etc/vibeui.env && sudo systemctl restart vibeui
```

Файл читается как shell-код (`scripts/deploy-remote.sh` делает `source`),
поэтому значения без пробелов и без кавычек. Переменные подхватываются только
после рестарта юнита.

Проверка ключей прямо с сервера, минуя приложение:

```bash
set -a; . /etc/vibeui.env; set +a
curl -s -w ' %{http_code}' -u "$YOOKASSA_SHOP_ID:$YOOKASSA_SECRET_KEY" https://api.yookassa.ru/v3/me
```

`200` — пара верная. `401 invalid_credentials` — ключ не от этого магазина
или перевыпущен: в кабинете сверить `shopId` и выпустить ключ заново
(тестовый начинается с `test_`, боевой с `live_`; боевой работает только у
активированного магазина). Приложение с такой парой уводит «Оплатить» на
`/pricing/soon`, а в `journalctl -u vibeui` лежит `[checkout] касса не
ответила ... 401`.

Оплата разовая: месяц или год, карта не сохраняется, автосписаний нет.
Чеки через ЮKassa (`receipt`) включает менеджер; пока фискализация выключена,
API отвечает 400 на `receipt`, и приложение повторяет запрос без него.

### 8.2. Вебхук в кабинете

Интеграция → HTTP-уведомления:

| Поле | Значение |
| --- | --- |
| URL | `https://vibeui.ru/api/payments/webhook` |
| События | только `payment.succeeded`: остальные обработчик игнорирует |

Обработчик принимает запросы только с адресов ЮKassa (`YOOKASSA_NETWORKS`
в `lib/yookassa.ts`); nginx уже передаёт `X-Real-IP`, отдельной настройки
не нужно. Чужому источнику маршрут отвечает 403 — это и есть признак, что
маршрут живой:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST -H 'Content-Type: application/json' \
  -d '{}' https://vibeui.ru/api/payments/webhook   # 403
```

Тело уведомления приложению не доверяет: по `object.id` оно само
запрашивает платёж у ЮKassa и только по этому ответу выдаёт Pro. Повторная
доставка того же события подписку второй раз не продлевает
(таблица `webhook_event`).

### 8.3. Таймер обслуживания подписок

Раз в час таймер переводит подписки с истёкшей датой в `expired` и чистит
лог поиска. Автосписаний нет. Юниты лежат в `deploy/`:

```bash
sudo cp deploy/vibeui-renew.service deploy/vibeui-renew.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now vibeui-renew.timer
sudo systemctl start vibeui-renew.service      # разовый прогон
journalctl -u vibeui-renew.service -n 5        # {"closed":0}
```

Ключ таймера — `CRON_SECRET` из того же `/etc/vibeui.env`. Без него
маршрут отвечает 403; права Pro при этом всё равно считаются по дате, а в
базе истёкшие подписки просто останутся `active`.

### 8.4. Тестовый платёж

1. Тестовый `shopId` и ключ в `/etc/vibeui.env`, рестарт.
2. Войти на сайт, `/pricing` → «Оплатить месяц». Должна открыться страница
   ЮKassa; тестовая карта — `5555 5555 5555 4477`, любые срок и CVC.
3. После оплаты — возврат на `/account/subscription`, тариф Pro, платёж в
   `/account/payments` со ссылкой на чек.
4. В админке `/admin/payments` платёж со статусом `succeeded`; если вебхук
   не дошёл — «Применить событие заново» запрашивает платёж у ЮKassa и
   выдаёт Pro тем же кодом.
5. Сменить ключи на боевые, рестарт, один реальный платёж на минимальную
   сумму, вернуть деньги из кабинета.

Чеки: приложение шлёт `receipt` в каждом платеже (самозанятый, без НДС).
В кабинете должна быть включена передача чеков через ЮKassa, иначе API
отвечает 400 на поле `receipt`, и «Оплатить» уводит на `/pricing/soon` с
ошибкой в `journalctl -u vibeui`.

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
