import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { referral } from "@/lib/db/schema"
import { letterWithLink, sendMail } from "@/lib/mail"

/** Версия документов, на которые человек согласился при регистрации. */
export const CONSENT_VERSION = "2026-09-08"

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
      await sendMail({
        to: user.email,
        subject: "Восстановление пароля VibeUI",
        text: letterWithLink(
          "Чтобы задать новый пароль, откройте ссылку:",
          url,
          "30 минут",
        ),
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
      await sendMail({
        to: user.email,
        subject: "Подтверждение почты VibeUI",
        text: letterWithLink(
          "Подтвердите адрес, чтобы закончить регистрацию:",
          url,
          "30 минут",
        ),
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
