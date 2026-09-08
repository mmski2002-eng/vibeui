"use client"

import { createAuthClient } from "better-auth/react"

/**
 * Клиент аутентификации. Базовый адрес не задаём: на том же домене
 * относительные запросы избавляют от расхождения между dev и production.
 */
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession } = authClient
