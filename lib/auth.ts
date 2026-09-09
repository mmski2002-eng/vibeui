import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { referral } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { letterWithLink, sendMail } from "@/lib/mail"

/** Версия документов, на которые человек согласился при регистрации. */
export const CONSENT_VERSION = "2026-09-08"

/**
 * Тексты писем. Живут рядом с отправкой, а не в общем словаре: письмо
 * читают вне сайта, и его язык определяется не текущей страницей, а тем,
 * на какой версии человек завёл аккаунт.
 */
const MAIL_COPY = {
  ru: {
    verify: {
      subject: "Подтвердите почту — VibeUI",
      heading: "Остался один шаг",
      intro:
        "Подтвердите адрес, и аккаунт заработает: избранное, история копирований и месячный лимит.",
      action: "Подтвердить почту",
      hint: "Нашли это письмо в «Спаме»? Нажмите «Не спам» и добавьте noreply@vibeui.ru в контакты — следующие письма придут во «Входящие».",
    },
    reset: {
      subject: "Новый пароль — VibeUI",
      heading: "Смена пароля",
      intro:
        "Вы запросили новый пароль для аккаунта VibeUI. Откройте страницу и задайте его.",
      action: "Задать пароль",
    },
  },
  en: {
    verify: {
      subject: "Confirm your email — VibeUI",
      heading: "One step left",
      intro:
        "Confirm your address and the account is ready: favourites, copy history and your monthly limit.",
      action: "Confirm email",
      hint: "Found this in Spam? Mark it as not spam and add noreply@vibeui.ru to your contacts — the next letters will land in your inbox.",
    },
    reset: {
      subject: "New password — VibeUI",
      heading: "Password reset",
      intro:
        "You asked for a new password for your VibeUI account. Open the page and set it.",
      action: "Set password",
    },
  },
} satisfies Record<Locale, unknown>

/**
 * Язык аккаунта. Незнакомое значение — русский: сайт начинался с него.
 *
 * Тип пользователя приходит из библиотеки и о дополнительных полях не знает,
 * поэтому проверяем наличие поля, а не объявляем его в сигнатуре: описание
 * `{ locale?: unknown }` с тем типом не пересекается вовсе.
 */
function localeOf(user: object): Locale {
  return "locale" in user && user.locale === "en" ? "en" : "ru"
}

const BASE_URL = process.env.BETTER_AUTH_URL ?? "https://vibeui.ru"

/**
 * Аутентификация. Своё здесь только письма и дополнительные поля профиля:
 * хеширование, сессии, одноразовые ссылки и ограничение попыток — работа
 * библиотеки, переписывать её вручную нечем оправдать.
 *
 * Сессии живут в базе, а не только в куке: это даёт «выйти на всех
 * устройствах» и позволяет оборвать чужой вход после смены пароля.
 */
export const auth = betterAuth({
  baseURL: BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),

  emailAndPassword: {
    enabled: true,
    // Без подтверждения адреса нельзя восстановить доступ, а к аккаунту
    // привязаны платежи: подтверждение обязательно.
    requireEmailVerification: true,
    minPasswordLength: 10,
    // Верхняя граница нужна не ради удобства: хеширование очень длинной
    // строки — способ нагрузить единственное ядро сервера.
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      const locale = localeOf(user)
      const copy = MAIL_COPY[locale].reset

      await sendMail({
        to: user.email,
        subject: copy.subject,
        ...letterWithLink({
          locale,
          heading: copy.heading,
          intro: copy.intro,
          action: copy.action,
          url,
          minutes: 30,
        }),
      })
    },
    resetPasswordTokenExpiresIn: 60 * 30,
    // Чужая сессия не должна пережить смену пароля.
    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 30,
    sendVerificationEmail: async ({ user, url }) => {
      const locale = localeOf(user)
      const copy = MAIL_COPY[locale].verify

      await sendMail({
        to: user.email,
        subject: copy.subject,
        ...letterWithLink({
          locale,
          heading: copy.heading,
          intro: copy.intro,
          action: copy.action,
          hint: copy.hint,
          url,
          minutes: 30,
        }),
      })
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    // Скользящее продление: активная сессия не обрывается на месячной границе.
    updateAge: 60 * 60 * 24,
  },

  user: {
    additionalFields: {
      invitedBy: { type: "string", required: false, input: false },
      // Язык приходит с формы регистрации: она знает, на какой версии сайта
      // человек находится, а письма уходят позже и заголовков запроса уже
      // не видят.
      locale: { type: "string", required: false, input: true },
      consentAt: { type: "date", required: false, input: false },
      consentVersion: { type: "string", required: false, input: false },
    },
  },

  advanced: {
    cookiePrefix: "vibeui",
  },

  databaseHooks: {
    user: {
      create: {
        /**
         * Привязка к пригласившему ставится один раз, в момент создания
         * аккаунта: позже её нельзя ни задать, ни переписать — иначе
         * приглашение превращается в способ дарить себе дни задним числом.
         * Здесь же фиксируется согласие: его нужно уметь доказать.
         */
        before: async (data) => {
          const store = await cookies()
          const code = store.get("vibeui_ref")?.value

          const inviter = code
            ? await db
                .select({ userId: referral.userId })
                .from(referral)
                .where(eq(referral.code, code))
                .limit(1)
            : []

          return {
            data: {
              ...data,
              invitedBy: inviter[0]?.userId ?? null,
              consentAt: new Date(),
              consentVersion: CONSENT_VERSION,
              // Форма присылает язык сама; кука — запасной источник для
              // случая, когда регистрация пришла не из нашей формы.
              locale:
                data.locale === "en" || data.locale === "ru"
                  ? data.locale
                  : store.get("vibeui-locale")?.value === "en"
                    ? "en"
                    : "ru",
            },
          }
        },
      },
    },
  },

  // Ограничение попыток: вход и восстановление — самые дешёвые цели для
  // перебора, а ядро на сервере одно.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
      "/sign-up/email": { window: 300, max: 5 },
    },
  },

  trustedOrigins: [BASE_URL],
})

export type Session = typeof auth.$Infer.Session
