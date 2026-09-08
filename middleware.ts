import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Кабинет закрыт для анонимов. Здесь только дешёвая проверка куки: ходить
 * в базу из middleware нельзя (edge-рантайм), а действительность сессии
 * всё равно перепроверяет сама страница.
 */
export function middleware(request: NextRequest) {
  // Префикс обязателен: он задан в конфигурации Better Auth, а по умолчанию
  // здесь ищется кука с чужим именем — и вошедшего разворачивало на вход.
  if (getSessionCookie(request, { cookiePrefix: "vibeui" })) {
    return NextResponse.next()
  }

  const signin = new URL("/signin", request.url)

  return NextResponse.redirect(signin)
}

export const config = {
  matcher: ["/account/:path*"],
}
