# Журнал работы над агентами

Ход работы между сессиями. Свежие записи сверху. Факты сверены с кодом на дату записи.

## 2026-10-09 — партнёры: связка агент ↔ сайт

### Как устроено (проверено по коду)
- Партнёр на сайте = пользователь, принявший приглашение (`partner_invite.claimed_by`).
  Принятие — `claimInvite` (`lib/partners.ts`): реф-код + 30 дней Pro.
- Агент создаёт приглашение: `POST /api/internal/invites` (`app/api/internal/invites/route.ts`),
  Bearer `AGENTS_API_KEY`. Слово `for_<ник>` = реф-код и промокод. Тег в имени `[agent:<creatorId>]`.
- `GET /api/internal/invites` — общая воронка по всем агентским приглашениям (админка агента).
- База общая для `.ru` и `.club`.

### Решения
- Маршруты `/api/internal/partners/*` НЕ делаем: старый контракт агента
  (createPartner/issuePromo/grantAccess) заменён схемой «приглашение + регистрация блогера».
- Таблицы агента `partners`, `publications`, `referral_metrics` остаются (их читают админка и монитор публикаций).
  Таблица `partner_offers` остаётся в БД, из кода убрана.

### План
1. [x] Убран мёртвый код: `createPartnerJob`, задача `create_partner`, класс `VibeUiClient`, чтение `partner_offers`, env `VIBEUI_INTERNAL_API_URL`.
2. [x] Сайт: `GET /api/internal/invites?creatorId=<uuid>` → `{code, claimed, claimedAt, visits, registrations, payments, commissionPercent, revenue[]}`; 404 если приглашения нет, 400 на кривой id.
3. [x] Агент: `fetchCreatorStats` + `marketRevenue` (`src/vibeui-client.ts`); `syncPartnerStatsJob` по `creatorId`;
   worker раз в 6 ч ставит задачу на каждого блогера с `referral_url` (ключ — на день). Принял приглашение →
   upsert `partners`, строка `referral_metrics` (выручка в валюте рынка, всё — в `raw_data`), статус `partner_created`.
   Do-not-contact блогеры тоже синкаются: чтение статистики им ничего не шлёт.
4. [x] README агента обновлён.

### Проверка (2026-10-09)
- `npm test` в `agents/`: до 29/29, после 33/33 (+3 в `tests/vibeui-client.test.ts`, +1 из параллельной чужой правки `tests/email.test.ts`). Все модули грузятся через tsx.
- Маршрут на dev: 401 без ключа, 400 на кривой id. Живой БД локально нет (`.env.local` → 5433 не поднят,
  пароль к PG на 5432 не подходит), поэтому SQL маршрута и SQL задачи проверены в PGlite: маршрут — на
  минимальных таблицах сайта, задача — на всех миграциях агента (повтор не дублирует `partners`).
- Не проверено вживую: связка с прод-сайтом. После деплоя — ручной `curl` на `/api/internal/invites?creatorId=`
  с боевым ключом и запуск worker.
- Билд/тайпчек не гонялись (запрет из CLAUDE.md) — типы проверит CI.

### Дальше
- После пуша: проверить на проде маршрут и что в `partners` появляются блогеры.
- Решение владельца по экономике (`policy/*` с `enabled: false`), ОРД — блокеры выплат RU.
- Хвост на Латвии: `VIBEUI_INTERNAL_API_URL` в env агента больше не читается, можно удалить.
