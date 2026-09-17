import { NextResponse, type NextRequest } from "next/server"

/**
 * Партнёрская ссылка `/?ref=<код>`. Внутренне переписываем на обработчик
 * `/i/<код>`: он кладёт куку приглашения, пишет визит и уводит на витрину.
 * Адрес в строке остаётся `/?ref=<код>` до финального редиректа обработчика.
 *
 * Переписываем, а не редиректим: посетитель не видит служебный `/i/`, а вся
 * логика приглашения остаётся в одном месте. Старые прямые `/i/<код>`-ссылки
 * при этом продолжают работать.
 */
export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref")

  if (!ref) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/i/${ref}`
  url.search = ""

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: "/",
}
