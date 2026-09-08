import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

/** Текущая сессия или null. Читается из куки, поэтому только на сервере. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

/**
 * Сессия или переход на вход. Middleware отсекает анонимов раньше, но
 * страницы кабинета не должны полагаться на это в одиночку: middleware
 * видит только куку, а действительность сессии знает база.
 */
export async function requireUser() {
  const session = await getSession()

  if (!session) {
    redirect("/signin")
  }

  return session.user
}
