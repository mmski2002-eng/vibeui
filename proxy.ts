import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

import { CLUB_ORIGIN, MERGED_CATEGORIES } from "@/lib/club-routes"
import { PATH_HEADER } from "@/lib/session.shared"

function isAccountPath(pathname: string) {
  return pathname === "/account" || pathname.startsWith("/account/")
}

function isRetiredEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/")
}

/**
 * Публичные разделы, чьи `/en/...` успели попасть в поиск. Кабинет, вход и
 * поиск сюда не входят: ссылок на них из выдачи нет, редирект им не нужен.
 */
const EN_REDIRECT_SECTIONS = [
  "components",
  "blocks",
  "animations",
  "scenarios",
  "pricing",
  "start",
]

/**
 * Удалённые страницы, у которых нет равноценной замены: им честный 404 сразу,
 * а не 301 на адрес, который всё равно не существует. Список — из 404 в
 * Search Console на 2026-10-16.
 */
const EN_GONE = new Set([
  "/blocks/ai-005",
  "/blocks/auth-016",
  "/blocks/dashboard-031",
  "/blocks/dashboard-047",
  "/blocks/features-001",
  "/components/avatar-033",
  "/components/textarea",
  "/components/textarea-001",
  "/scenarios/service-landing",
])

/**
 * Старый `/en/...` → тот же раздел на vibeui.club. Слитая категория ведёт
 * сразу на родителя, без второго прыжка. Чужой раздел — null (404).
 */
function clubPathFor(pathname: string): string | null {
  const segments = pathname.split("/").slice(2).filter(Boolean)

  if (segments.length === 0) return "/"
  if (!EN_REDIRECT_SECTIONS.includes(segments[0])) return null
  if (EN_GONE.has(`/${segments.join("/")}`)) return null

  const parent =
    segments.length === 2
      ? MERGED_CATEGORIES[segments[0]]?.[segments[1]]
      : undefined

  if (parent) segments[1] = parent

  return `/${segments.join("/")}`
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

  // Старый адрес с приставкой: английский переехал на vibeui.club без неё, а
  // /en/* успели собрать клики в Google. Rewrite на пустой путь в Next 16
  // отдаёт 500, поэтому ответ 404 для чужих разделов собираем здесь.
  if (isRetiredEnglishPath(pathname)) {
    const target = clubPathFor(pathname)

    if (!target) return new NextResponse(null, { status: 404 })

    return NextResponse.redirect(
      `${CLUB_ORIGIN}${target}${request.nextUrl.search}`,
      301,
    )
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
