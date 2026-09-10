"use client"

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

/**
 * Клиент аутентификации. Базовый адрес не задаём: на том же домене
 * относительные запросы избавляют от расхождения между dev и production.
 *
 * Поля профиля объявлены здесь вручную, а не выведены из `typeof auth`:
 * серверный модуль помечен "server-only", и тащить его в клиентский бандл
 * ради одного типа не за чем. Список короткий, расходится он редко.
 */
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        locale: { type: "string", required: false, input: true },
        // Версию согласия отправляет форма регистрации: сервер сверяет её
        // перед созданием аккаунта, поэтому поле входное.
        consentVersion: { type: "string", required: false, input: true },
      },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
