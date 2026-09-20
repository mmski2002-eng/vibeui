# CLAUDE.md — VibeUI

## Главные правила
Коммит и пуш ТОЛЬКО по прмому согласованию с пользователем. На каждый коммит и пуш получать согласование. 

Экономь токены! Работай рационально. Не используй агентов без необходимости. Время не важно, лучше построить дешевле и без потери качества.
Соблюдай цветовой бренд, описан в BREND.jfif в корне проекта.
ЗАПРЕТ. Не запускать `npm run build`, `npm run lint`, `npm run typecheck`, `npm run format`, `next build`, `tsc --noEmit`, `eslint` — ни напрямую, ни в фоне, ни через агента или скрипт. Пользователь сам скажет, когда это сделать: до его прямой команды не запускать и не переспрашивать (запросы разрешения тоже не нужны — просто не запускать). Команда действует ровно на один запуск. «Проверь после правок» из этого файла означает `npm run meta:validate` и глаза в браузере, не билд. Машина слабая (i5-6200U, 2 ядра) — билд её вешает; релиз собирает CI.
Не выдавай прочитанное за факт, пока сам не проверил. Дневник и память — контекст, не истина.
Если на GitHub/npm есть зрелая открытая реализация — используй её, не пиши с нуля.
Не переписывай проект с нуля.
Работай маленькими проверяемыми изменениями. Перед правкой изучи код, выбери минимальный фикс.
После правок запускай релевантные проверки. Не заявляй успех без фактической проверки.
Если пользователь задаёт вопрос или просит «проверь», «посмотри», «почему не работает/не опубликовано» — только диагностировать и ответить причиной. Не менять код, базу, настройки, не деплоить, не перезапускать сервисы, не публиковать и не удалять без отдельной явной команды пользователя на действие.
Главное правило: задача разрабочика закон! Если оно противоречит любым инструкиям, то приоритетным считать задачу пользователя.
Артефакты на claude.ai не создавать, все отчеты только сюда в папку.
Инструкции для AI-разработчика. Читать перед любой задачей.

Быстрый актуальный контекст проекта для новой сессии:
[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md). Если сведения расходятся,
предпочитать более свежий `PROJECT_CONTEXT.md` и фактический код/`package.json`.

Контекст: [docs/PRODUCT.md](docs/PRODUCT.md) — продукт и сценарий, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — устройство кода, [docs/ROADMAP.md](docs/ROADMAP.md) — фазы и Definition of Done, [docs/SEARCH.md](docs/SEARCH.md) — поиск по каталогу и что делает item находимым, [docs/SCENARIOS.md](docs/SCENARIOS.md) — вход в каталог со стороны задачи,
[docs/SEO.md](docs/SEO.md) — индексация, метаданные, счётчики и кабинеты.

## Product

VibeUI — AI-native библиотека UI-компонентов для вайбкодинга.

Принцип: **«Выбери дизайн → отдай ИИ → получи сайт.»**

MVP доказывает ровно один сценарий:

```
catalog → component preview → Copy for AI → установка компонента AI-агентом → корректный результат
```

Если изменение не улучшает эту цепочку — оно не приоритет.

## Current scope

Входит:

- каталог компонентов;
- live preview;
- страницы компонентов;
- Copy for AI;
- shadcn-compatible registry;
- несколько демонстрационных компонентов.

Идёт работа (Phase 5, [docs/PLAN-ACCOUNT-BILLING.md](docs/PLAN-ACCOUNT-BILLING.md)):
аккаунты, подписка Pro, оплата через ЮKassa, лимит копирований и приглашения.

**Не входит** (не реализовывать, не готовить инфраструктуру заранее):
marketplace, MCP, visual builder, собственный AI, командные лицензии,
денежные выплаты партнёрам.

Данные каталога остаются статическими, из кода registry: база нужна только
аккаунтам, подписке и лимитам, каталога она не касается.

## Stack

Фактические версии — `package.json`. Обновлять этот раздел при смене мажоров.

- Next.js 16 (App Router, Turbopack) + React 19
- TypeScript 5, `strict: true`, alias `@/*` → корень
- Tailwind CSS v4 через `@tailwindcss/postcss`. Конфиг-файла нет:
  токены и тема живут в `app/globals.css` (`@theme inline`, CSS-переменные)
- shadcn/ui (CLI `shadcn`, `components.json`, style `base-nova`, baseColor `neutral`).
  Установленных primitives сейчас нет, `components/ui/` пуст. Когда
  понадобятся — `npx shadcn add` принесёт `@base-ui/react`, **не** Radix
- `clsx`, `tailwind-merge`, `tw-animate-css`
- `lucide-react` — иконки
- ESLint 9 (flat config, `eslint-config-next`) + Prettier 3 с `prettier-plugin-tailwindcss`
- Пакетный менеджер: npm
- Деплой: self-hosted VPS — Next standalone (`output: "standalone"`),
  systemd, nginx с TLS. Не Vercel, не Docker. См. `docs/DEPLOY.md`

Ничего сверх этого списка без явной необходимости и согласования.

## Commands

```bash
npm run dev           # dev-сервер
npm run build         # production build
npm run start         # запуск production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format        # Prettier --write .
npm run format:check  # Prettier --check .

npm run item -- <category>  # скаффолд нового item'а
npm run indexes            # пересобрать индексы каталога из registry.json
npm run indexes:check      # упасть, если индексы устарели
npm run meta:validate      # проверить metadata и исходники items
npm run registry:build     # shadcn build → public/r/

npx shadcn@latest add <name>   # добавить primitive из upstream shadcn
```

`npm run build` сам гоняет `indexes`, `meta:validate` и `registry:build`.

Сборка идёт на Turbopack (`next build --turbopack`): на каталоге в полторы
тысячи items это ~76 с против ~230 с на webpack. Не запускать `next build`
без флага и не заменять им `npm run build` — потеряются генерация индексов,
валидация metadata и `public/r/`.

Деплой автоматический: push в `main` → GitHub Actions собирает релиз и
заливает на VPS (`docs/DEPLOY.md` §7). На сервере сборки нет: он общий с
чужими сайтами и ботами, `next build` отобрал бы у них память. Локально
собирать релиз для сервера тоже нельзя: `standalone` тащит нативные бинарники
своей платформы.

Конвейер целиком — [docs/PIPELINE.md](docs/PIPELINE.md).

После изменений — `npm run meta:validate` и проверка глазами в браузере.
Линт и билд закрыты правилом из «Главных правил»: запускать только тогда,
когда пользователь сам об этом попросит.

## Structure

```
app/
  layout.tsx                     root layout, шрифты
  globals.css                    Tailwind v4 + тема (единственный источник токенов)
  page.tsx                       landing
  components/page.tsx            каталог
  components/[slug]/page.tsx     страница компонента
  search/page.tsx                выдача поиска (единственная динамическая страница)
  api/search/route.ts            подсказки поиска
  scenarios/[slug]/page.tsx      сценарий: задача, разложенная в секции
  r/[name]/route.ts              registry endpoint (shadcn-compatible JSON)
components/                      UI приложения (шапка, фильтры, карточки)
components/ui/                   primitives из shadcn (сейчас пусто)
registry/
  index.ts                       индекс блоков для сайта
  blocks/<category>/registry.json  metadata блоков (source of truth)
  blocks/<category>/<name>/      распространяемый блок
lib/utils.ts                     cn() и утилиты
lib/search/dictionary.ts         синонимы и стемминг поиска
lib/search/engine.ts             индекс и ранжирование (server-only)
lib/scenario.ts                  резолв сценария и промпт на целую страницу
registry/scenarios.ts            сценарии: задача → упорядоченные секции
components.json                  конфиг shadcn CLI
public/r/                        сгенерированные registry JSON

proxy.ts                         Next 16 middleware (НЕ middleware.ts!): гейтинг
                                 кабинета, выбор языка; на vibeui.club → /en
i18n: язык по пути — русский в корне, английский под /en (app/en/* — полное
      параллельное дерево тонких обёрток с locale="en"); домен решает дефолт
      (proxy.ts): vibeui.ru → ru, vibeui.club → en. Один процесс, оба домена.

# аккаунты, подписка, оплата (Phase 5)
lib/auth.ts                      Better Auth (email+пароль); trustedOrigins и
                                 ссылки писем host-aware (vibeui.ru + vibeui.club)
lib/session.ts                   сессия/requireUser
lib/db/schema.ts                 Drizzle: user/session/subscription/payment/…
lib/payment-actions.ts           startCheckout (ЮKassa, .ru) + startCryptoCheckout
                                 (NOWPayments, .club)
lib/payment-apply.ts             продление подписки (grantDays/nextPeriodEnd)
lib/yookassa.ts                  ЮKassa (рубли, только vibeui.ru)
lib/nowpayments.ts               NOWPayments (крипта USD, только vibeui.club):
                                 инвойс + проверка подписи IPN
lib/plans.ts                     тарифы; PLANS (₽) и PLAN_USD ($ для .club)
app/api/payments/webhook/route.ts            вебхук ЮKassa
app/api/payments/nowpayments/webhook/route.ts вебхук NOWPayments (крипта)
app/account/**                   личный кабинет и админка
```

Платёж выбирается по хосту: `.ru` → ЮKassa (₽), `.club` → NOWPayments (крипта,
USD). Витрина/каталог общие; различаются локаль (proxy.ts) и метод оплаты
(pricing-page.tsx по `host`). Полная схема мультидомена — ниже, раздел
«Мультидомен и оплата».

Граница: `components/ui/` — primitives сайта; `registry/blocks/` — то, что
скачивает пользователь. Не смешивать.

## Architecture principles

- максимально простая архитектура;
- не добавлять зависимости без необходимости;
- не создавать абстракции заранее — дублирование лучше преждевременного обобщения;
- Server Components по умолчанию;
- Client Components только когда реально нужна клиентская интерактивность
  (`"use client"` — как можно ниже по дереву);
- переиспользуемые UI primitives отдельно от registry blocks;
- поиск по каталогу — глобальный и серверный: он ищет по всему ассортименту
  независимо от открытого раздела, а находимость item'а определяется только
  его metadata (см. [docs/SEARCH.md](docs/SEARCH.md)). Фильтрацию карточек
  по DOM (`data-search`) не возвращать: из-за неё «тарифы» на `/components`
  не находились ничем;
- сценарии (`registry/scenarios.ts`) — вход со стороны задачи: они ссылаются
  на категории, а не на конкретные items, и ничего не устанавливают сами
  (см. [docs/SCENARIOS.md](docs/SCENARIOS.md)). Это не `kind: "template"`;
- компоненты registry переносимы: копируются в чужой проект и работают;
- каждый registry block самостоятельно декларирует свои зависимости
  (npm-пакеты + внутренние файлы) в metadata;
- registry components не обращаются к внутренним API сайта, не импортируют
  код приложения, не используют его env-переменные;
- preview и распространяемый компонент используют **один source of truth** —
  preview рендерит тот же файл из `registry/blocks/`, который получает
  пользователь. Никаких отдельных «демо-копий».

## Copy for AI

Инструкция для агента генерируется из metadata блока, не пишется вручную
для каждого компонента. Минимум содержимого:
идентификатор компонента, команда установки, список зависимостей,
что сохранить (анимации, типографика, spacing, responsive-поведение),
что можно адаптировать (контент, бренд-переменные),
запрет на замену компонента generic-пересозданием.

## Coding rules

- TypeScript strict; избегать `any` (нужен побег — `unknown` + сужение);
- функциональные React-компоненты;
- понятные имена, без сокращений;
- маленькие компоненты; большой файл — делить по смыслу, а не по размеру;
- accessibility: семантические теги, `alt`, `aria-*` где нужно,
  фокус-стили, работа с клавиатуры;
- responsive-first: mobile → desktop;
- semantic HTML вместо `div`-супа;
- никаких inline styles без необходимости (допустимо только для
  динамических значений, которые нельзя выразить классом);
- Tailwind для styling; классы объединять через `cn()`;
- комментарии только там, где код сам себя не объясняет — поясняем «почему»,
  а не «что».

## Workflow

Если работаешь с браузером через плэйврайт, открыл его и закончил - закрой. Не держи открытым когда не работаешь с ним.
Перед большой задачей:

1. изучить существующий код (registry, соседние блоки, primitives);
2. предложить короткий план и дождаться подтверждения;
3. изменить минимально необходимое;
4. после изменений — `npm run meta:validate` и проверка глазами; линт и билд
   только по прямой команде пользователя (см. «Главные правила»);
5. не исправлять посторонний код без необходимости.

Мелкая правка — делать сразу, без плана.

Новый item — по чек-листу ([docs/PIPELINE.md](docs/PIPELINE.md)):

- [ ] `npm run item -- <category>` — папка, заготовка `.tsx`, запись в
      `registry.json`; индексы генерятся, руками их не править;
- [ ] компонент написан: своя палитра `--vibeui-<name>-*`, ноль зависимостей,
      раскладка от собственной ширины, `prefers-reduced-motion`;
- [ ] metadata без `TODO`: description, tags, `ai.summary/preserve/adapt`,
      для компонентов — `ai.usage` и `controls`;
- [ ] находимость: `title` — как вещь назовёт человек, `description` содержит
      слова, которыми её ищут, `tags` — английские синонимы, `categories[0]`
      верная. Отдельного места «прописать item в поиск» нет, всё решает
      metadata ([docs/SEARCH.md](docs/SEARCH.md));
- [ ] перевод `meta.i18n.en` с тем же числом пунктов в списках;
- [ ] `npm run meta:validate` зелёный; линт и билд — только по прямой команде
      пользователя, не по своей инициативе;
- [ ] глазами: `/preview/<name>`, карточка каталога, страница item'а,
      обе подложки превью, mobile / tablet / desktop;
- [ ] поиском: `/search?q=<как это назовёт человек>` — item в выдаче есть.

Новая категория — сверх этого две правки:

- запись в `SYNONYMS` (`lib/search/dictionary.ts`), иначе категория находится
  только по своей подписи. Формат — в [docs/SEARCH.md](docs/SEARCH.md);
- шаг в подходящем сценарии (`registry/scenarios.ts`), если категория входит
  в типовую страницу. Формат — в [docs/SCENARIOS.md](docs/SCENARIOS.md).

## Git

- небольшие логические коммиты, одна причина изменения на коммит;
- никогда не удалять пользовательский код без причины;
- перед потенциально разрушительными действиями (удаление файлов,
  `reset --hard`, перезапись конфигов, миграция стека) — предупредить
  и дождаться подтверждения;
- не коммитить и не пушить без явной просьбы;
- не трогать `.env` и секреты.

## Деплой и пост-проверка

Push в `main` не только собирает и заливает релиз, но и гоняет смоук-проверку
живого сайта: `.github/workflows/deploy.yml`, шаг «Проверить живой сайт». Он
`curl`-ит конкретные адреса и `grep`-ает их вывод и коды ответа (сейчас:
`/components` = 200, страница item'а рендерится по slug, `/c/<name>` = 401 для
анонима, `robots.txt` и `sitemap.xml`). Сам деплой при этом проходит — падает
только job, но красная галка = сломанная проверка на проде.

Правило: если меняешь вывод страниц, маршруты, гейтинг или доставку — синхронно
правь этот шаг в том же коммите, чтобы ассерты остались верными. Билд и деплой
локально не гоняются (правило выше), поэтому эти `curl`-проверки сверяй глазами
перед пушем: что раньше отдавалось в HTML/по коду, а что теперь закрыто.

## Мультидомен: `.ru` и `.club` — раздельные инстансы (2026-09-20)

**Одна кодовая база, но ДВА независимых инстанса на РАЗНЫХ серверах.** НЕ форкать
код. Деплой один — push в `main` катит на оба.

- **`vibeui.ru`** — русская аудитория. **RU-VPS `185.104.251.106`** (Debian,
  общий с чужими сайтами prolatex/skazkidladetey/tarovarvara — не трогать).
  Сервис `vibeui.service` (Next standalone, :3003), `/srv/vibeui-live`, env
  `/etc/vibeui.env`. Локаль `ru`. Оплата — **только ЮKassa** (крипта в РФ для
  внутренних расчётов запрещена). Почта — свой **Postfix** (DKIM/SPF/DMARC у
  RU-регистратора). Своя Postgres. Данные в РФ (152-ФЗ). DNS `.ru` — у
  RU-регистратора (не Cloudflare), не трогать.
- **`vibeui.club`** — англоязычная аудитория. **Латвийский VPS `216.173.70.241`**
  (Ubuntu 20.04, общий с forescape.ru/pirogi73.ru — не трогать). Отдельный
  инстанс: сервис `vibeui-club.service` (:3003), `/srv/vibeui-club-live`, env
  `/etc/vibeui-club.env`, **своя Postgres `vibeui_club`** (аккаунты отдельные от
  `.ru`, не переносятся). Домен **целиком английский** (proxy уводит любой раздел
  в `/en`, переключатель языка скрыт). Оплата — **крипта NOWPayments** (USD).
  Почта — **Resend** (`noreply@vibeui.club`). Регистратор — Porkbun
  (акк `escape20021987`), NS → Cloudflare.

**Почему раздельно:** NOWPayments геоблокирует RU-IP (403 «unavailable in your
region»), поэтому крипту нельзя создать с RU-сервера → `.club` вынесен на не-RU
(Латвия). А данные `.ru` по 152-ФЗ обязаны быть в РФ → `.ru` остаётся на RU.

### DNS (Cloudflare, акк `Mmski2002@gmail.com`)
- `A vibeui.club → 216.173.70.241` (Латвия, Proxied); `CNAME www → vibeui.club`.
- Resend-записи (`resend._domainkey` TXT DKIM, CNAME `send`/`rsend`, `_dmarc`) —
  добавлены через **Cloudflare Domain Connect**.
- SSL/TLS = **Full** (origin на Латвии — self-signed в `/etc/ssl/vibeui-club/`,
  CF Full принимает).

### Серверы (root по паролю из `СЕКРЕТЫ.md` — gitignored; SSH через OpenSSH `SSH_ASKPASS_REQUIRE=force`)
- **RU** `185.104.251.106`: `vibeui.service`, `/etc/vibeui.env`
  (DATABASE_URL, BETTER_AUTH_*, SMTP_*=Postfix, ADMIN_EMAILS, YOOKASSA_*).
  nginx-сайт `vibeui.ru`. (Хвост: осиротевший nginx-блок `vibeui.club` — можно
  удалить, CF шлёт `.club` на Латвию.)
- **Латвия** `216.173.70.241`: `vibeui-club.service`, `/etc/vibeui-club.env`
  (DATABASE_URL→`vibeui_club`, свой BETTER_AUTH_SECRET, BETTER_AUTH_URL=
  `https://vibeui.club`, RESEND_API_KEY, NOWPAYMENTS_*,
  ADMIN_EMAILS=`mmski2002@gmail.com`, REGISTRY_BASE_URL). nginx-сайт
  `vibeui.club` → :3003 (self-signed TLS). Провижинился разово скриптом.
- ⚠️ **Гард Claude блокирует запись секретов/рестарт на прод-серверах по SSH** —
  такие команды выполняет пользователь сам (или добавляет Bash-правило). Read-only
  SSH (диагностика) — можно.

### Деплой (один push → оба сервера)
[deploy.yml](.github/workflows/deploy.yml): build один раз на runner → артефакт
scp и на RU (`scripts/deploy-remote.sh`, миграции `.ru`-БД), и на Латвию
(`scripts/deploy-remote-club.sh`, миграции club-БД, рестарт `vibeui-club`). Ключ
один — `DEPLOY_SSH_KEY` (pubkey `github-actions-vibeui-deploy` добавлен на оба
сервера). Шаг Латвии идёт ПОСЛЕ релиза `.ru`: если Латвия упадёт, прод `.ru` цел.

### Код (host-aware, одна база)
- **Локаль по хосту** — [proxy.ts](proxy.ts) (в Next 16 это `proxy.ts`, НЕ
  `middleware.ts` — два файла ронят старт!). На `.club` любой локализуемый раздел
  → `/en`; гейтинг кабинета — только `/account`. `.ru` — прежнее поведение.
- **Оплата по хосту** — [pricing-page.tsx](components/pages/pricing-page.tsx) /
  [plan-cards.tsx](components/pages/pricing/plan-cards.tsx): `.club` → USD+крипта
  (`startCryptoCheckout` в [lib/payment-actions.ts](lib/payment-actions.ts),
  клиент [lib/nowpayments.ts](lib/nowpayments.ts), webhook
  [.../nowpayments/webhook](app/api/payments/nowpayments/webhook/route.ts):
  подпись IPN HMAC-SHA512, идемпотентность `webhook_event`, `order_id=
  <userId>:<planId>`); `.ru` → ЮKassa/₽. USD-цены `PLAN_USD`
  ([lib/plans.ts](lib/plans.ts)): $9/$69, Ent $18/$138.
- **Почта по хосту** — [lib/mail.ts](lib/mail.ts)/[lib/auth.ts](lib/auth.ts):
  запрос с `.club` → Resend (`noreply@vibeui.club`); иначе Postfix (`.ru`).
  Ссылки в письмах верификации/сброса переписываются на хост запроса.
- **Аккаунты** — раздельные (у `.club` своя БД на Латвии).
- **Админка** — продублирована под `/en` (`app/en/account/admin/*`); права по
  `ADMIN_EMAILS`. Текст админки пока RU (не локализован).

### Legal / оплата
- Оферта ([app/legal/offer](app/legal/offer/page.tsx) +
  [app/en/legal/offer](app/en/legal/offer/page.tsx)) и политика — реальные,
  реквизиты: самозанятый Садков Е.А., ИНН 732894935375. Возврат — тем же
  способом, что оплата.

### Отложено
- Настоящий TLS (certbot) для `vibeui.club` на Латвии (сейчас self-signed+CF Full).
- SEO host-aware: `canonical`/`sitemap`/`SITE_URL` захардкожены на `vibeui.ru`
  (static metadata, [lib/seo.ts](lib/seo.ts)); `<html lang>` на `.club` серверно
  `ru`, клиент-скрипт флипает на `en`. Фикс — рефактор на `generateMetadata`.
- Полная локализация админки (ADMIN_TEXTS/компоненты — RU; маршруты уже под `/en`).
- Смоук-тест `deploy.yml` на `vibeui.club`.

### Безопасность
- В чат/файлы попадали открытые пароли (RU/Латвия VPS, аккаунты) — считать
  скомпрометированными, сменить. `СЕКРЕТЫ.md` — в `.gitignore`.
