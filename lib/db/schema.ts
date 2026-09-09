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
 * связи между подпиской, платежами и рефералами читаются только рядом.
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
    payload: jsonb("payload"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("payment_user_idx").on(table.userId)],
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

/** Реферальный код пользователя: один на аккаунт, живёт вечно. */
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
 * Начисленные дни Pro. Одна строка на платёж: повторная обработка того же
 * платежа не начислит дни дважды.
 */
export const referralReward = pgTable(
  "referral_reward",
  {
    id: text("id").primaryKey(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    invitedId: text("invited_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    paymentId: text("payment_id").notNull().unique(),
    daysGranted: integer("days_granted").notNull(),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
  },
  (table) => [index("referral_reward_inviter_idx").on(table.inviterId)],
)
