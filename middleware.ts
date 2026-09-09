import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

const LOCALE_COOKIE = "vibeui-locale"

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
 * Две задачи: закрыть кабинет от анонимов и встретить человека на его языке.
 *
 * Язык подбирается только на главной и только при первом заходе: дальше
 * решает выбор в переключателе (кука), потому что раздел уже открыт в
 * конкретной языковой ветке и менять её под заголовок браузера нельзя.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/") {
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

  // Префикс обязателен: он задан в конфигурации Better Auth, а по умолчанию
  // здесь ищется кука с чужим именем — и вошедшего разворачивало на вход.
  if (getSessionCookie(request, { cookiePrefix: "vibeui" })) {
    return NextResponse.next()
  }

  const signin = new URL("/signin", request.url)

  return NextResponse.redirect(signin)
}

function isCrawler(request: NextRequest) {
  return CRAWLER.test(request.headers.get("user-agent") ?? "")
}

export const config = {
  matcher: ["/account/:path*", "/"],
}
