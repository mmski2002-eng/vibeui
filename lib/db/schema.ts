import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Схема базы. Первые четыре таблицы — контракт Better Auth, их состав задан
 * библиотекой; остальные наши. Держим всё в одном файле: таблиц немного, а
 * связи между подпиской, платежами и партнёрами читаются только рядом.
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  /** Кто пригласил. Ставится один раз при регистрации и не меняется. */
  invitedBy: text("invited_by"),
  /** Дата и версия принятой политики: согласие нужно уметь доказать. */
  consentAt: timestamp("consent_at"),
  consentVersion: text("consent_version"),
  /**
   * Язык, на котором человек зарегистрировался. Нужен письмам: они уходят
   * из фоновых задач, где ни запроса, ни его заголовков уже нет.
   */
  locale: text("locale").notNull().default("ru"),
  /** Блокировка администратором: вход и выдача исходников закрываются. */
  blockedAt: timestamp("blocked_at"),
  blockedReason: text("blocked_reason"),
  /** Внутренняя заметка поддержки. Пользователю не показывается. */
  adminNote: text("admin_note"),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("session_user_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("account_user_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

/**
 * Подписка. Одна активная на пользователя; история хранится в `payment`,
 * поэтому старые строки не копим — продление двигает `currentPeriodEnd`.
 */
export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    plan: text("plan").notNull(),
    /** active | past_due | canceled | expired */
    status: text("status").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    /** Токен способа оплаты ЮKassa: по нему идут автосписания. */
    paymentMethodId: text("payment_method_id"),
    /** Сколько неудачных списаний подряд: после третьего — expired. */
    failedAttempts: integer("failed_attempts").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("subscription_user_idx").on(table.userId),
    index("subscription_period_idx").on(table.status, table.currentPeriodEnd),
  ],
)

/** Платёж. `payload` держим целиком: при разборе спора это единственная правда. */
export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    yookassaId: text("yookassa_id").notNull().unique(),
    amount: text("amount").notNull(),
    currency: text("currency").notNull().default("RUB"),
    status: text("status").notNull(),
    paidAt: timestamp("paid_at"),
    receiptStatus: text("receipt_status"),
    /** Ссылка на чек из «Мой налог»: администратор вносит руками. */
    receiptUrl: text("receipt_url"),
    payload: jsonb("payload"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    /** Цена без скидки, если платёж шёл по промокоду. */
    listAmount: text("list_amount"),
    promoCode: text("promo_code"),
    promoPercent: integer("promo_percent"),
    /** Чей промокод: по нему считается доля блогера. */
    partnerId: text("partner_id").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("payment_user_idx").on(table.userId),
    index("payment_partner_idx").on(table.partnerId, table.paidAt),
  ],
)

/**
 * События вебхука. ЮKassa повторяет доставку, пока не получит 200, поэтому
 * запись сюда — единственная защита от двойного продления подписки.
 */
export const webhookEvent = pgTable("webhook_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
  payload: jsonb("payload"),
})

/**
 * Ключ для shadcn CLI. Хранится хешем: утечка дампа не должна давать доступ
 * к чужой подписке. `prefix` — первые символы, чтобы человек узнал свой ключ
 * в списке.
 */
export const registryToken = pgTable(
  "registry_token",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    prefix: text("prefix").notNull(),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("registry_token_user_idx").on(table.userId)],
)

/**
 * Расход бесплатного лимита: строка на пару «месяц + компонент». Повторное
 * копирование того же item'а в том же месяце ничего не списывает — иначе
 * кнопку начинают бояться нажимать.
 */
export const usage = pgTable(
  "usage",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Календарный месяц, YYYY-MM: по нему же чистятся старые периоды. */
    period: text("period").notNull(),
    itemName: text("item_name").notNull(),
    firstUsedAt: timestamp("first_used_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.period, table.itemName] }),
    index("usage_period_idx").on(table.period),
  ],
)

export const favorite = pgTable(
  "favorite",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemName: text("item_name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.itemName] })],
)

/**
 * Стартовые лайки: число, с которого начинается счётчик у сердца, пока
 * настоящих добавлений мало. Заполняется миграцией случайно, к пользователям
 * не привязано; витрина показывает сумму с `favorite`.
 */
export const favoriteSeed = pgTable("favorite_seed", {
  itemName: text("item_name").primaryKey(),
  likes: integer("likes").notNull().default(0),
})

/**
 * Приглашение блогера. Создаёт администратор под имя; ссылка одноразовая:
 * кто по ней зарегистрировался, тот и партнёр, второго не бывает.
 */
export const partnerInvite = pgTable(
  "partner_invite",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    claimedBy: text("claimed_by")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),
    claimedAt: timestamp("claimed_at"),
    /** Промокод блогера — его ник в нижнем регистре. Скидка на первый платёж. */
    promoCode: text("promo_code").unique(),
    /** Свой процент; null — общий из настройки `promo.percent`. */
    promoPercent: integer("promo_percent"),
    promoActive: boolean("promo_active").notNull().default(true),
    /** ИНН самозанятого блогера: по нему выплата закрывается его чеком. */
    payoutInn: text("payout_inn"),
    /** Реквизиты выплаты: номер карты или телефон для СБП. Заполняет блогер. */
    payoutDetails: text("payout_details"),
    /** Ссылка на чек из «Мой налог» — блогер прикладывает её к выплате. */
    payoutReceipt: text("payout_receipt"),
  },
  (table) => [index("partner_invite_created_idx").on(table.createdAt)],
)

/**
 * Выплата комиссии блогеру. Реестр учёта: сами деньги уходят вне платформы
 * (перевод/СБП), а сюда администратор вносит факт выплаты. «К выплате» —
 * это заработанная комиссия минус сумма этих записей.
 */
export const partnerPayout = pgTable(
  "partner_payout",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Рубли без копеек, как у платежа. */
    amount: text("amount").notNull(),
    note: text("note"),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("partner_payout_partner_idx").on(table.partnerId, table.createdAt),
  ],
)

/**
 * Заявка блогера на вывод комиссии. Путь: блогер подаёт заявку (`pending`),
 * администратор её `approved` (согласовывает), затем переводит деньги и
 * отмечает `paid`, приложив ссылку на чек блогера из «Мой налог» (создаётся
 * запись partner_payout). `rejected` — отказ. Открытая заявка у блогера одна.
 */
export const payoutRequest = pgTable(
  "payout_request",
  {
    id: text("id").primaryKey(),
    partnerId: text("partner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    /** pending | approved | paid | rejected. */
    status: text("status").notNull().default("pending"),
    note: text("note"),
    /** Ссылка на чек блогера из «Мой налог», прикладывается при выплате. */
    receiptUrl: text("receipt_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    approvedAt: timestamp("approved_at"),
    approvedBy: text("approved_by"),
    resolvedAt: timestamp("resolved_at"),
    resolvedBy: text("resolved_by"),
  },
  (table) => [
    index("payout_request_status_idx").on(table.status, table.createdAt),
    index("payout_request_partner_idx").on(table.partnerId),
  ],
)

/**
 * Реферальный код партнёра: один на аккаунт, живёт вечно. Заводится в
 * момент, когда блогер регистрируется по приглашению; у остальных его нет.
 */
export const referral = pgTable("referral", {
  code: text("code").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

/** Переход по ссылке до регистрации: нужен для счётчика в кабинете. */
export const referralVisit = pgTable(
  "referral_visit",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    visitorId: text("visitor_id").notNull(),
    landedAt: timestamp("landed_at").notNull().defaultNow(),
  },
  (table) => [index("referral_visit_code_idx").on(table.code)],
)

/**
 * Обращения: проблема с компонентом, вопрос в поддержку и претензия по
 * правам. Один поток с полем `kind`, а не три таблицы: жизненный цикл у них
 * общий — пришло, взяли, ответили, закрыли.
 */
export const report = pgTable(
  "report",
  {
    id: text("id").primaryKey(),
    /** component | support | legal */
    kind: text("kind").notNull(),
    /** new | in_progress | answered | closed | spam */
    status: text("status").notNull().default("new"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    /** Код item'а для жалобы на компонент: в карточке рядом живое превью. */
    itemName: text("item_name"),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    email: text("email").notNull(),
    locale: text("locale").notNull().default("ru"),
    /** Отпечаток адреса для ограничения частоты: сам адрес не храним. */
    ipHash: text("ip_hash"),
    assigneeEmail: text("assignee_email"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    closedAt: timestamp("closed_at"),
  },
  (table) => [
    index("report_status_idx").on(table.status, table.createdAt),
    index("report_user_idx").on(table.userId),
    index("report_ip_idx").on(table.ipHash, table.createdAt),
  ],
)

/** Переписка по обращению. Ответ уходит письмом и остаётся здесь. */
export const reportMessage = pgTable(
  "report_message",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => report.id, { onDelete: "cascade" }),
    /** user | admin | note — заметка видна только администратору. */
    authorType: text("author_type").notNull(),
    authorEmail: text("author_email"),
    body: text("body").notNull(),
    deliveredByEmail: boolean("delivered_by_email").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("report_message_report_idx").on(table.reportId, table.createdAt),
  ],
)

/**
 * Журнал действий администратора. Без него нельзя ответить, почему у
 * аккаунта есть Pro, за который никто не платил.
 */
export const adminAction = pgTable(
  "admin_action",
  {
    id: text("id").primaryKey(),
    adminEmail: text("admin_email").notNull(),
    action: text("action").notNull(),
    /** user | payment | report | token */
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    details: jsonb("details"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("admin_action_created_idx").on(table.createdAt),
    index("admin_action_target_idx").on(table.targetType, table.targetId),
  ],
)

/**
 * Поисковые запросы. Нужны ровно для одного вопроса: чего в каталоге ищут и
 * не находят. Строки старше полугода удаляет ночная задача — запрос может
 * содержать что угодно, включая случайно вставленный чужой текст.
 */
export const searchQuery = pgTable(
  "search_query",
  {
    id: text("id").primaryKey(),
    query: text("query").notNull(),
    locale: text("locale").notNull().default("ru"),
    kind: text("kind"),
    results: integer("results").notNull().default(0),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("search_query_created_idx").on(table.createdAt),
    index("search_query_results_idx").on(table.results, table.createdAt),
  ],
)

/**
 * Настройки сайта, которые администратор меняет без релиза. Ключ — имя
 * настройки (`price.monthly`), значение — строка: настроек единицы, и
 * типизировать их колонками рано.
 */
export const setting = pgTable("setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
