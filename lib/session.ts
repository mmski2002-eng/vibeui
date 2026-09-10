import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { localePath, type Locale } from "@/lib/i18n"
import { nextParam } from "@/lib/safe-path"
import { PATH_HEADER } from "@/lib/session.shared"

export { PATH_HEADER }

/** Текущая сессия или null. Читается из куки, поэтому только на сервере. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

/**
 * Сессия или переход на вход. Middleware отсекает анонимов раньше, но
 * страницы кабинета не должны полагаться на это в одиночку: proxy.ts
 * видит только куку, а действительность сессии знает база.
 *
 * Адрес текущей страницы уезжает в `?next=`: человек, у которого истекла
 * сессия, после входа возвращается туда, куда шёл, а не на общий обзор.
 */
export async function requireUser(locale: Locale = "ru") {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    const here = requestHeaders.get(PATH_HEADER)

    redirect(`${localePath(locale, "/signin")}${nextParam(here)}`)
  }

  return session.user
}
