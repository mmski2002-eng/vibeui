import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

import { PATH_HEADER } from "@/lib/session.shared"

function isAccountPath(pathname: string) {
  return pathname === "/account" || pathname.startsWith("/account/")
}

function isRetiredEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/")
}

/**
 * Прокси-слой Next (бывший middleware). Закрывает кабинет от анонимов.
 * Английские файлы на vibeui.club подставляет next.config (beforeFiles),
 * не этот слой: абсолютный rewrite уходил вторым запросом на /en и получал 404.
 * `/en/...` публичным адресом не является.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Партнёрская ссылка `/?ref=<код>`: уводим на обработчик `/i/<код>`, он
  // кладёт куку приглашения, пишет визит и возвращает на витрину. Redirect, а
  // не rewrite: rewrite на route-handler в Next 16 отдаёт 500. Прямые
  // `/i/`-ссылки продолжают работать.
  const ref = request.nextUrl.searchParams.get("ref")
  if (ref) {
    return NextResponse.redirect(new URL(`/i/${ref}`, request.url))
  }

  // Старый адрес с приставкой. Редиректа нет. Rewrite на пустой путь в Next 16
  // отдаёт 500, поэтому ответ 404 собираем здесь.
  if (isRetiredEnglishPath(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  // Гейтинг кабинета — только для /account. Остальные страницы публичны:
  // matcher шире, поэтому проверку сессии держим строго на кабинете.
  if (isAccountPath(pathname)) {
    // Префикс обязателен: он задан в конфигурации Better Auth, а по умолчанию
    // здесь ищется кука с чужим именем — и вошедшего разворачивало на вход.
    if (getSessionCookie(request, { cookiePrefix: "vibeui" })) {
      // Адрес нужен серверным страницам: сессия могла умереть в базе, и тогда
      // человека всё равно развернёт на вход — с сохранённым «куда он шёл».
      const passthrough = new Headers(request.headers)
      passthrough.set(PATH_HEADER, pathname + request.nextUrl.search)

      return NextResponse.next({ request: { headers: passthrough } })
    }

    const signin = new URL("/signin", request.url)

    signin.searchParams.set("next", pathname + request.nextUrl.search)

    return NextResponse.redirect(signin)
  }

  return NextResponse.next()
}

export const config = {
  // Ловим все страницы, кроме ассетов, api и раздач исходников (r/f/c/s/i/
  // preview). На vibeui.club английский файл подставляется под любой раздел.
  matcher: [
    "/((?!_next|api|r/|f/|c/|s/|i/|preview/|.*\\.[^/]+$).*)",
  ],
}
