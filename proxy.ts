import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

import { PATH_HEADER } from "@/lib/session.shared"

/**
 * Разделы, у которых на vibeui.club отдаётся английская страница. В адресе
 * приставки нет: запрос внутри переписывается на файл из `app/en`, браузер
 * остаётся на `/pricing`. /c, /f, /r, /s, /i, /preview — общие, matcher их
 * не ловит.
 */
const LOCALIZABLE = new Set([
  "components",
  "blocks",
  "animations",
  "scenarios",
  "search",
  "pricing",
  "account",
  "signin",
  "signup",
  "reset",
  "report",
  "start",
  "verify",
  "legal",
])

function isAccountPath(pathname: string) {
  return pathname === "/account" || pathname.startsWith("/account/")
}

function isRetiredEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/")
}

/** Английский файл из `app/en` для публичного пути без приставки. */
function englishFile(pathname: string) {
  return pathname === "/" ? "/en" : `/en${pathname}`
}

/**
 * Прокси-слой Next (бывший middleware). Закрывает кабинет от анонимов и на
 * vibeui.club подставляет английские файлы под те же пути, что на .ru.
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

  const club = isClubHost(request)

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

      if (club) {
        return rewriteEnglish(request, passthrough)
      }

      return NextResponse.next({ request: { headers: passthrough } })
    }

    const signin = new URL("/signin", request.url)

    signin.searchParams.set("next", pathname + request.nextUrl.search)

    return NextResponse.redirect(signin)
  }

  if (club && isClubPage(pathname)) {
    return rewriteEnglish(request)
  }

  return NextResponse.next()
}

function isClubPage(pathname: string) {
  if (pathname === "/") return true

  const segment = pathname.split("/")[1] ?? ""

  return LOCALIZABLE.has(segment)
}

function rewriteEnglish(request: NextRequest, requestHeaders?: Headers) {
  const url = request.nextUrl.clone()
  url.pathname = englishFile(request.nextUrl.pathname)
  // За nginx адрес запроса https://localhost:3003. Rewrite с https стучится
  // в Node по TLS, а процесс слушает обычный http — отсюда EPROTO и 500.
  url.protocol = "http:"

  return NextResponse.rewrite(
    url,
    requestHeaders ? { request: { headers: requestHeaders } } : undefined,
  )
}

/** Пришёл ли запрос на англоязычный домен vibeui.club. */
function isClubHost(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()

  return host === "vibeui.club" || host === "www.vibeui.club"
}

export const config = {
  // Ловим все страницы, кроме ассетов, api и раздач исходников (r/f/c/s/i/
  // preview). На vibeui.club английский файл подставляется под любой раздел.
  matcher: [
    "/((?!_next|api|r/|f/|c/|s/|i/|preview/|.*\\.[^/]+$).*)",
  ],
}
