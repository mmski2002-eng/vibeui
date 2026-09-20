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

## Мультидомен и оплата (заведено 2026-09-20)

Два домена — один проект, один VPS, один деплой. НЕ форкать код в два.

- `vibeui.ru` — русская аудитория, локаль `ru`, оплата **только ЮKassa**
  (крипта в РФ для внутренних расчётов запрещена). Регистратор — российский
  (не Porkbun), DNS у него; здесь его NS не трогать.
- `vibeui.club` — англоязычная аудитория, локаль `en`, оплата **ЮKassa +
  крипта + карта (в планах)**. Регистратор — Porkbun (акк `escape20021987`).
- `.ru`-домен от `.club` отделён намеренно: RU-домен отпугивает англоязычных.

### DNS / инфраструктура `.club` (СДЕЛАНО)
- Домен `vibeui.club` заведён в Cloudflare (free, акк `Mmski2002@gmail.com`).
- Записи в Cloudflare:
  - `A vibeui.club → 185.104.251.106` (Proxied);
  - `CNAME www → vibeui.club` (Proxied);
  - дефолтные парковочные записи Porkbun удалены.
- Nameservers в Porkbun переключены на Cloudflare:
  `cesar.ns.cloudflare.com`, `miki.ns.cloudflare.com` (распространение ≤48ч).
- SSL/TLS в Cloudflare = **Full** (не strict): proxied→origin принимает любой
  серт, пока на origin нет отдельного серта под `.club`.
- Origin `.club` = тот же RU-VPS `185.104.251.106`, что и `.ru`. Cloudflare
  проксированием прячет RU-IP и даёт CDN/эдж-TLS англоязычным.

### Устройство сервера (общий VPS, Debian, root)
- На машине несколько чужих сайтов (prolatex, skazkidladetey, tarovarvara×2) —
  **не трогать**. Наше — только `vibeui*`.
- `vibeui.ru` = сервис **`vibeui.service`**, Next standalone на **порту 3003**,
  `WorkingDirectory=/srv/vibeui-live` (симлинк на `/srv/vibeui-releases/<ts>`),
  env `/etc/vibeui.env` (DATABASE_URL, BETTER_AUTH_*, SMTP_*, ADMIN_EMAILS,
  YOOKASSA_*). **Почта и админка на `.ru` уже работают в проде.**
- Схема «один код + детект по хосту»: `.club` обслуживает **тот же процесс**
  на :3003. Добавлен nginx-блок `/etc/nginx/sites-available/vibeui.club`
  (`server_name vibeui.club www` → `proxy_pass 127.0.0.1:3003`, `Host $host`),
  серт переиспользован от `vibeui.ru` (CF Full принимает). Блок `vibeui.ru`
  НЕ менялся. Проверено: `curl` origin с Host `vibeui.club` = 200, `.ru` = 200.
- Доступ: root по паролю из `СЕКРЕТЫ.md` (в `.gitignore`) через OpenSSH
  `SSH_ASKPASS_REQUIRE=force`. Правки nginx — только `nginx -t` → reload, с
  откатом симлинка при ошибке.

### Реализовано в коде (2026-09-20, НЕ задеплоено)

Схема «один код + детект по хосту». Правки аддитивные, поведение `.ru` не
менялось; проверено на dev (`/pricing` RU и `/en/pricing` c `Host: vibeui.club`).

- **Локаль по хосту** — в [proxy.ts](proxy.ts) (в Next 16 это `proxy.ts`, НЕ
  `middleware.ts` — два файла ронят старт!). На `.club` главная `/` → `/en`;
  URL с `/en` видимый (как принято на сайте). `.ru` — прежнее поведение.
- **Крипто-оплата `.club`** ([lib/nowpayments.ts](lib/nowpayments.ts),
  [app/api/payments/nowpayments/webhook/route.ts](app/api/payments/nowpayments/webhook/route.ts),
  `startCryptoCheckout` в [lib/payment-actions.ts](lib/payment-actions.ts)):
  инвойс в USD, проверка подписи IPN (HMAC-SHA512), идемпотентность через
  `webhook_event`, продление Pro как у ЮKassa. `order_id = <userId>:<planId>`.
  USD-цены — `PLAN_USD` в [lib/plans.ts](lib/plans.ts): $9/$69, Ent $18/$138.
- **Pricing по хосту** ([components/pages/pricing-page.tsx](components/pages/pricing-page.tsx),
  [components/pages/pricing/plan-cards.tsx](components/pages/pricing/plan-cards.tsx)):
  `.club` → USD, крипто-кнопка, крипто-FAQ, без промокодов; `.ru` — ЮKassa/₽.
- **Auth host-aware** ([lib/auth.ts](lib/auth.ts)): `trustedOrigins` включает
  `vibeui.club`; ссылки в письмах верификации/сброса переписываются на
  `vibeui.club`, если запрос пришёл с него (иначе кука села бы на `.ru`).
- Аккаунты — **вариант A**: свой вход на каждом домене, БД общая.

### Что нужно на деплое (push в main — только с согласия пользователя)
- В `/etc/vibeui.env` на сервере добавить `NOWPAYMENTS_API_KEY` и
  `NOWPAYMENTS_IPN_SECRET` (лежат в `СЕКРЕТЫ.md`), перезапустить `vibeui.service`.
- После DNS (≤48ч): проверить `https://vibeui.club` (en), оплату криптой
  тестовым инвойсом, письмо верификации со ссылкой на `.club`.

### Отложено (сделать отдельно, с проверкой)
- **SEO host-aware:** `canonical`/`sitemap`/`robots` сейчас захардкожены на
  `vibeui.ru` (статическая metadata, [lib/seo.ts](lib/seo.ts)). Для `.club`
  canonical ведёт на `.ru` — Google может не индексировать `.club`. Фикс —
  перевод metadata на `generateMetadata` с `headers()` (крупный рефактор ~15
  страниц), делать отдельно и тестировать. `hreflang` ru↔en уже есть.
- **Смоук-тест** `deploy.yml` на `vibeui.club` — добавить после подтверждения
  live `.club` (иначе job краснеет до распространения DNS).
- Опционально: отдельный LE origin-серт под `.club` (или оставить CF-edge).

### Безопасность
- В чат/файл попадали открытые пароли (VPS, аккаунт) — считать
  скомпрометированными, сменить. `СЕКРЕТЫ.md` — в `.gitignore`.
