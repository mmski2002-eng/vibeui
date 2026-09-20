import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

import { PATH_HEADER } from "@/lib/session.shared"

const LOCALE_COOKIE = "vibeui-locale"

/**
 * Разделы с английским вариантом под /en. На vibeui.club (только английский)
 * любой из них в корне уводим в /en. /c, /f, /r, /s, /i, /preview — общие, у
 * них /en-варианта нет, их не трогаем (их и matcher не ловит).
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
  return (
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/en/account" ||
    pathname.startsWith("/en/account/")
  )
}

// Краулерам язык не подбираем: у страниц есть hreflang и sitemap, а увод
// бота с русской главной на английскую путает индексацию обеих.
const CRAWLER =
  /bot|crawler|spider|crawling|yandex|google|bing|duckduck|baidu|slurp|facebookexternalhit|telegram|whatsapp|twitter/i

/**
 * Английский ли язык человеку ближе русского. Читаем Accept-Language сами:
 * порядок в заголовке уже отражает предпочтение, а вес (`q=`) уточняет его.
 */
function prefersEnglish(header: string | null) {
  if (!header) return false

  let ru = 0
  let en = 0

  for (const part of header.split(",")) {
    const [tag, ...params] = part.trim().split(";")
    const language = tag.toLowerCase().split("-")[0]

    if (language !== "ru" && language !== "en") continue

    const q = params
      .map((param) => param.trim())
      .find((param) => param.startsWith("q="))
    const weight = q ? Number.parseFloat(q.slice(2)) : 1

    if (Number.isNaN(weight)) continue

    if (language === "ru") ru = Math.max(ru, weight)
    else en = Math.max(en, weight)
  }

  return en > ru
}

/**
 * Прокси-слой Next (бывший middleware). Две задачи: закрыть кабинет от
 * анонимов и встретить человека на его языке.
 *
 * Язык подбирается только на главной и только при первом заходе: дальше
 * решает выбор в переключателе (кука), потому что раздел уже открыт в
 * конкретной языковой ветке и менять её под заголовок браузера нельзя.
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

  // vibeui.club — только английская версия. Любой локализуемый раздел в корне
  // (не под /en) уводим в /en-ветку: домен целиком английский, переключателя
  // языка нет. Для vibeui.ru и прочих хостов этот блок не срабатывает.
  if (club && !pathname.startsWith("/en")) {
    const segment = pathname.split("/")[1] ?? ""

    if (pathname === "/" || LOCALIZABLE.has(segment)) {
      const url = request.nextUrl.clone()
      url.pathname = pathname === "/" ? "/en" : `/en${pathname}`

      const redirect = NextResponse.redirect(url)
      redirect.headers.set("Vary", "Accept-Language, Cookie")

      return redirect
    }
  }

  // Язык главной по Accept-Language — только не на club (там всё английское).
  if (pathname === "/" && !club) {
    const chosen = request.cookies.get(LOCALE_COOKIE)?.value

    if (chosen === "en" || (!chosen && !isCrawler(request) && prefersEnglish(request.headers.get("accept-language")))) {
      const target = new URL("/en", request.url)
      const redirect = NextResponse.redirect(target)

      // Ответ зависит от заголовка — иначе кеш отдал бы английскую главную
      // русскоязычному гостю.
      redirect.headers.set("Vary", "Accept-Language, Cookie")

      return redirect
    }

    const response = NextResponse.next()
    response.headers.set("Vary", "Accept-Language, Cookie")

    return response
  }

  // Гейтинг кабинета — только для /account и /en/account. Остальные страницы
  // (каталог, тарифы, legal) публичны: matcher теперь шире, поэтому проверку
  // сессии держим строго на кабинете, иначе аноним не открыл бы витрину.
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

    // Английский кабинет разворачивает на английский вход.
    const english = pathname.startsWith("/en/")
    const signin = new URL(english ? "/en/signin" : "/signin", request.url)

    signin.searchParams.set("next", pathname + request.nextUrl.search)

    return NextResponse.redirect(signin)
  }

  return NextResponse.next()
}

function isCrawler(request: NextRequest) {
  return CRAWLER.test(request.headers.get("user-agent") ?? "")
}

/** Пришёл ли запрос на англоязычный домен vibeui.club. */
function isClubHost(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase()

  return host === "vibeui.club" || host === "www.vibeui.club"
}

export const config = {
  // Ловим все страницы, кроме ассетов, api и раздач исходников (r/f/c/s/i/
  // preview). На vibeui.club нужно переписывать в /en любой раздел, а не
  // только главную; гейтинг кабинета внутри ограничен isAccountPath.
  matcher: [
    "/((?!_next|api|r/|f/|c/|s/|i/|preview/|.*\\.[^/]+$).*)",
  ],
}
