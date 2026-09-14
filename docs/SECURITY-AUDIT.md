# Security-аудит VibeUI

Дата: 2026-09-14. Метод: чтение и статический анализ (без запуска, билда, деплоя).
Стек: Next.js 16 App Router, React 19, better-auth, Drizzle + PostgreSQL, ЮKassa,
self-hosted VPS + nginx.

Цель: обход оплаты/лимита, кража исходников закрытых компонентов, доступ к чужим
данным, повышение привилегий, RCE, отказ в обслуживании.

---

## Краткое резюме

Архитектура доступа сделана грамотно: единая точка `resolveAccess`, серверная
проверка прав в каждом action и admin-роуте (спрятанная кнопка защитой не
считается), хеш токена в базе, HMAC-подпись ссылок с `timingSafeEqual`, лимит на
человека, а не на браузер. Инъекций через Drizzle нет — все фрагменты
параметризованы. Path traversal в раздаче исходника закрыт (путь берётся из карты
registry, не из URL).

Но есть **одна критичная дыра**: обработчик вебхука ЮKassa доверяет источнику по
первому значению `X-Forwarded-For`, а его при текущей конфигурации nginx может
задать сам клиент. Это даёт бесплатный Pro любому аккаунту одним POST-запросом.

Ещё системная проблема бизнес-модели: подписанные ссылки на исходник не привязаны
к пользователю и живут сутки — их можно легально нагенерировать одной подпиской и
раздать наружу.

| Severity | Кол-во |
|----------|--------|
| Critical | 1 |
| High     | 2 |
| Medium   | 4 |
| Low      | 4 |

---

## Critical

### C1. Подделка вебхука ЮKassa → бесплатный Pro любому аккаунту

> **Статус: исправлено 14.09.2026** (коммит security-фикса).
> - `applyPaymentEvent` получил флаг `verify`; вебхук вызывает его с
>   `verify: true`. Перед выдачей Pro событие сверяется с ЮKassa через
>   `fetchPayment(object.id)`, и статус/сумма/план/владелец берутся из ответа
>   платёжного сервиса, а не из тела запроса. Событие с выдуманным `id` не
>   находится → `unverified`, Pro не выдаётся.
> - `trusted()` теперь берёт реальный IP из `X-Real-IP` (`$remote_addr` от
>   nginx), а не из подделываемого `X-Forwarded-For[0]`.
> - В `webhook_event`/`payment` сохраняется проверенный объект, а не
>   присланное тело: admin-replay из payload больше не доверяет подделке.

**Путь эксплуатации:**
1. Атакующий регистрирует аккаунт, узнаёт свой `userId` (клиент его видит через
   `useSession()` — better-auth отдаёт `session.user.id`).
2. Шлёт `POST https://vibeui.ru/api/payments/webhook` с заголовком
   `X-Forwarded-For: 185.71.76.1` (любой IP из `YOOKASSA_NETWORKS`) и телом:
   ```json
   {"event":"payment.succeeded","object":{"id":"<любой-новый-id>",
    "status":"succeeded","amount":{"value":"1490.00"},
    "metadata":{"userId":"<свой-id>","plan":"yearly"},
    "payment_method":{"id":"x"}}}
   ```
3. `applyPaymentEvent` доверяет `metadata.plan` (проверка только `isPlanId`) и
   `metadata.userId` → продлевает подписку на выбранный план. Год Pro бесплатно.

**Доказательство:**
- [app/api/payments/webhook/route.ts:34-42](app/api/payments/webhook/route.ts#L34-L42) —
  `trusted()` берёт `request.headers.get("x-forwarded-for").split(",")[0]` как
  доверенный IP.
- [docs/DEPLOY.md:152](docs/DEPLOY.md#L152) — nginx настроен
  `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`. Эта переменная =
  `<входящий XFF клиента>, <remote_addr>`. То есть первый элемент — значение,
  присланное клиентом, а не реальный IP. Код берёт именно `[0]`.
- [lib/payment-apply.ts:105-160](lib/payment-apply.ts#L105-L160) — `userId`, `plan`
  и `amount` берутся из тела без сверки с реальным платежом в ЮKassa.

**Почему это работает:** проверка подлинности вебхука держится только на
IP-allowlist, а IP берётся из заголовка, который клиент контролирует. Никакой
подписи тела/HTTP Basic на URL вебхука нет.

**Фикс (любой из, лучше оба):**
- Не доверять `X-Forwarded-For[0]`. За одним обратным прокси реальный клиент — это
  `X-Real-IP` (nginx его уже ставит из `$remote_addr`) либо **последний** элемент
  `X-Forwarded-For`, а не первый. Считать источник по `X-Real-IP`.
- Добавить второй фактор, не зависящий от IP: секрет в URL вебхука
  (`/api/payments/webhook?key=…` или HTTP Basic на этом location в nginx) и/или
  сверять каждое событие через `fetchPayment(object.id)` перед выдачей Pro —
  источник правды о деньгах и так уже реализован в `lib/yookassa.ts`.
- Валидировать, что `amount`/`plan` из события соответствуют реальному платежу.

> Гипотеза, требует ручной проверки: если перед nginx стоит ещё один прокси/CDN
> (Cloudflare и т. п.), точная позиция реального IP в цепочке может отличаться —
> но при показанной в DEPLOY.md схеме (клиент → nginx → Next) дыра открыта.

---

## High

### H1. Подписанные ссылки не привязаны к пользователю → легальный слив Pro-исходников

Подпись покрывает только `имя.exp` и живёт 24 часа. Ссылку может открыть кто угодно,
без сессии и без Pro.

**Путь:** один Pro-подписчик открывает панель «Исходник» для каждого закрытого
компонента (`/api/registry-source?name=…`), получает `source` + `registryUrl` +
`docUrl` с подписью на сутки и публикует их (или один раз забирает исходники всех
Pro-компонентов). Любой аноним по этим ссылкам сутки качает закрытый код и ставит
его `npx shadcn add`.

**Доказательство:**
- [lib/registry-link.ts:29-33](lib/registry-link.ts#L29-L33) — в HMAC входит только
  `${name}.${exp}`; ни `userId`, ни привязки к сессии.
- [app/r/pro/[name]/route.ts:35-43](app/r/pro/[name]/route.ts#L35-L43),
  [app/f/[file]/route.ts:41-47](app/f/[file]/route.ts#L41-L47),
  [app/c/[slug]/route.ts:39-51](app/c/[slug]/route.ts#L39-L51) — при валидной подписи
  `resolveAccess` не вызывается вовсе.

**Оговорка:** это осознанный компромисс (агент ходит без ключа, см. комментарии в
коде). Но 24 часа + переносимость = ссылка становится «пиратской раздачей».

**Фикс:** сократить TTL (минуты, не сутки) для `/c` и `/f`; либо привязать подпись
к `userId` и проверять сессию/токен даже при подписи для `/r/pro` и `/f`; либо
одноразовость подписи (nonce в базе, гашение после первого `shadcn add`). Как
минимум — резко уменьшить TTL и вести учёт выдач для детекта аномалий.

### H2. Нет rate-limiting на раздаче исходников и на выдаче подписей

Ограничение частоты у better-auth покрывает только auth-роуты
([lib/auth.ts:267-279](lib/auth.ts#L267-L279)). Маршруты `/r/pro`, `/f`, `/c`,
`/api/registry-source`, `/api/search`, `/i/<code>` ничем не ограничены (nginx в
DEPLOY.md `limit_req` не содержит).

**Последствия:**
- Массовый скрейп открытого каталога и брутфорс имён item'ов.
- Pro-аккаунт скачивает весь закрытый ассортимент скриптом за минуты (см. H1).
- Накрутка переходов `/i/<code>` (реферальная статистика) и запись в
  `referral_visit` от анонимов.
- Спам-нагрузка на единственное ядро сервера (DoS).

**Доказательство:** отсутствие `limit_req` в
[docs/DEPLOY.md:144-163](docs/DEPLOY.md#L144-L163); в роутах раздачи нет счётчиков.

**Фикс:** `limit_req`/`limit_conn` в nginx на `/r/`, `/f/`, `/c/`, `/api/`, `/i/`;
серверный лимит выдачи подписей на пользователя в сутки.

---

## Medium

### M1. Спуфинг IP обходит анти-спам обращений и искажает fingerprint

Та же схема, что в C1: `createReport` берёт `x-forwarded-for[0]` для отпечатка,
по которому ограничивает частоту анонимных обращений.

**Доказательство:**
[lib/report-actions.ts:38-46](lib/report-actions.ts#L38-L46). Атакующий меняет XFF
→ каждый запрос выглядит новым отпечатком → лимит 3/10 мин не работает → рассылка
писем администраторам ([lib/report-actions.ts:120-150](lib/report-actions.ts#L120-L150)).

**Фикс:** брать IP из `X-Real-IP`/последнего элемента XFF (единый хелпер с C1).

### M2. Гонка создания подписки может задвоить строки

`applyPaymentEvent` и `grantDays` делают «select by userId → insert если нет».
Два параллельных события (webhook + renew, или два webhook) успеют оба увидеть
отсутствие и оба вставить: в `subscription` нет уникального ограничения на
`userId`.

**Доказательство:**
[lib/payment-apply.ts:27-56](lib/payment-apply.ts#L27-L56),
[lib/payment-apply.ts:129-160](lib/payment-apply.ts#L129-L160). `getSubscription`
берёт `limit(1)`, так что дубль замаскируется, но данные о деньгах разъедутся.

**Оговорка:** гипотеза — зависит от наличия `unique(userId)` в схеме (не проверял
`lib/db/schema.ts`). **Проверить руками.**

**Фикс:** `unique` на `subscription.userId` + `onConflictDoUpdate`, либо upsert в
одном запросе.

### M3. `X-Cron-Key` сравнивается не константным временем

[app/api/payments/renew/route.ts:25-29](app/api/payments/renew/route.ts#L25-L29) —
`key !== process.env.CRON_SECRET`. Теоретически timing-side-channel. Практически по
сети нереализуемо, но исправляется дёшево.

**Фикс:** `timingSafeEqual`, как в `verifyRegistryLink`.

### M4. Утечка PII реферала партнёру за пределами маскирования почты

`maskEmail` скрывает адрес, но `referralsOf` отдаёт партнёру `name`, точную дату
регистрации, факт и суммы оплат каждого приведённого пользователя.

**Доказательство:**
[lib/partners.ts:139-184](lib/partners.ts#L139-L184),
[components/pages/account/referrals.tsx:196-208](components/pages/account/referrals.tsx#L196-L208)
показывает `maskEmail` + `name`. Если `name` по умолчанию `Viber000001` — ок, но
пользователь может задать реальное имя, и оно уедет партнёру.

**Оговорка:** не уязвимость доступа (партнёр видит только своих), а вопрос
приватности/согласия. **Проверить с юр. точки зрения.**

---

## Low

### L1. `renew` не идемпотентен по числу списаний внутри одного запуска
Если cron дёрнут дважды подряд до обновления `currentPeriodEnd` (продление идёт
асинхронно через webhook), возможны два `chargeSaved` для одной подписки. Мягко
смягчается тем, что продление делает webhook. **Проверить руками.**
[app/api/payments/renew/route.ts:54-77](app/api/payments/renew/route.ts#L54-L77).

### L2. `updatedAt`/`lastUsedAt` пишутся на каждый запрос с Bearer
[lib/access.ts:38-44](lib/access.ts#L38-L44) — каждый `/r/pro` с токеном делает
`UPDATE`. Без rate-limit (H2) это точка амплификации записи в БД.

### L3. Секреты аналитики зашиты дефолтами в код
[components/analytics.tsx:10-11](components/analytics.tsx#L10-L11),
[app/layout.tsx:82-84](app/layout.tsx#L82-L84) — реальные ID Метрики/GA/верификаций
в качестве fallback. Не секреты в строгом смысле (они и так публичны в HTML), но
привязывают форк к чужим счётчикам. Low.

### L4. Нет security-заголовков (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
[next.config.ts](next.config.ts) пуст, в nginx-примере
([docs/DEPLOY.md:144-163](docs/DEPLOY.md#L144-L163)) заголовков нет. Открыт
clickjacking, нет HSTS, нет CSP против XSS. `dangerouslySetInnerHTML` в проекте
используется только для theme-init и JSON-LD с контролируемыми данными
([app/layout.tsx:143-146](app/layout.tsx#L143-L146),
[components/json-ld.tsx:6](components/json-ld.tsx#L6)) — сам по себе не опасен, но
CSP всё равно нужна.
**Фикс:** `headers()` в next.config или `add_header` в nginx: HSTS,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
базовая CSP.

---

## Что проверено и признано безопасным

- **SQL-инъекции:** нет. Все `sql`-фрагменты параметризованы Drizzle
  ([lib/partners.ts](lib/partners.ts), [lib/admin-stats.ts](lib/admin-stats.ts),
  [app/api/admin/payments.csv/route.ts:31-39](app/api/admin/payments.csv/route.ts#L31-L39)
  — `ilike` с плейсхолдером). `db.execute` один, с литеральной строкой
  ([lib/auth.ts:75-77](lib/auth.ts#L75-L77)).
- **Path traversal:** закрыт. Путь исходника берётся из карты registry по slug, а
  не из URL; есть проверка `..`/абсолютного пути
  ([registry/source.server.ts:30-39](registry/source.server.ts#L30-L39)).
- **Открытый редирект:** закрыт. `safeNext` отбивает `//`, `/\`, схемы, управляющие
  символы ([lib/safe-path.ts:11-28](lib/safe-path.ts#L11-L28)).
- **Гейтинг доступа:** единая `resolveAccess` для всех трёх каналов раздачи;
  без аккаунта — отказ ([lib/access.ts:58-81](lib/access.ts#L58-L81)).
- **Привилегии/IDOR:** каждый admin-action и admin-page вызывает `requireAdmin`
  (404, а не редирект); каждый пользовательский action — `requireUser` с фильтром
  по `user.id`. `favorites`, `token`, `profile` привязаны к сессии
  ([lib/account-actions.ts](lib/account-actions.ts),
  [app/api/favorites/route.ts:24-28](app/api/favorites/route.ts#L24-L28)).
- **CSV-выгрузка платежей:** за `isAdmin`
  ([app/api/admin/payments.csv/route.ts:23-25](app/api/admin/payments.csv/route.ts#L23-L25)).
- **Токены реестра:** в базе только SHA-256 хеш, показ один раз, отзыв
  ([lib/account-actions.ts:28-60](lib/account-actions.ts#L28-L60),
  [lib/token.ts](lib/token.ts)).
- **HMAC-подпись:** секрет из env, `timingSafeEqual`, проверка длины и срока
  ([lib/registry-link.ts:47-61](lib/registry-link.ts#L47-L61)). Слабое место —
  не что подделать, а что не привязано к юзеру (см. H1).
- **Статика:** `strip-preview.mjs` удаляет `content` и Pro-item'ы из `public/r`
  до публикации ([scripts/strip-preview.mjs:28-96](scripts/strip-preview.mjs#L28-L96)).
- **Сессии/CSRF:** better-auth, cookie-префикс `vibeui`, `trustedOrigins`,
  сессии в БД, гашение при блокировке и смене пароля, `requireEmailVerification`,
  ограничение длины пароля от DoS хеширования
  ([lib/auth.ts:90-282](lib/auth.ts#L90-L282)).
- **Партнёрка:** `invitedBy` ставится один раз при создании (не переписать задним
  числом), claim приглашения защищён `claimed_by IS NULL` от гонки
  ([lib/auth.ts:203-260](lib/auth.ts#L203-L260),
  [lib/partners.ts:78-93](lib/partners.ts#L78-L93)).
- **Реферальная кука:** `httpOnly`, `secure`, `sameSite: lax`
  ([app/i/[code]/route.ts:33-46](app/i/[code]/route.ts#L33-L46)).

---

## Проверить руками

1. **C1 (критично):** реально ли долетает клиентский `X-Forwarded-For` до
   `/api/payments/webhook`. Тест: `curl -X POST https://vibeui.ru/api/payments/webhook
   -H 'X-Forwarded-For: 185.71.76.1' -H 'Content-Type: application/json' -d '{...}'`
   с телом на несуществующий `userId` — если ответ `ok`, а не `forbidden`, дыра
   подтверждена (проверять на своём тестовом аккаунте, не на чужих данных).
2. Схема `subscription`: есть ли `unique(userId)` (M2). Посмотреть `lib/db/schema.ts`.
3. Есть ли перед nginx ещё прокси/CDN (влияет на позицию реального IP в XFF).
4. Реальное `nginx.conf` на VPS: наличие `limit_req`, security-заголовков, HTTP
   Basic на вебхуке (пример в DEPLOY.md может отличаться от прода).
5. `maskEmail` + реальные имена рефералов: согласуется ли с политикой приватности
   (M4).
6. TTL подписей: приемлемы ли 24 часа для `/c` и `/f` с точки зрения слива Pro (H1).
7. `renew` при двойном запуске cron (L1).

---

## Приоритет исправлений

1. **C1** — закрыть немедленно: перестать доверять `X-Forwarded-For[0]` + сверять
   событие через `fetchPayment` перед выдачей Pro.
2. **H2** — rate-limit в nginx на раздачу и API.
3. **H1** — сократить TTL подписей и/или привязать к пользователю.
4. Остальное по мере возможности.
