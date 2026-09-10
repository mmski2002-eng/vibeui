/**
 * Куда можно вернуть человека после входа, подтверждения почты или оплаты.
 *
 * Адрес приходит из query, то есть от кого угодно: письмо со ссылкой
 * `?next=https://чужой-сайт` превратило бы наш вход в удобный трамплин для
 * фишинга. Поэтому принимается только путь внутри сайта — без схемы, без
 * хоста и без `//`, с которого браузер начинает считать адрес внешним.
 */
const FALLBACK = "/account"

export function safeNext(
  value: string | null | undefined,
  fallback = FALLBACK,
) {
  if (!value) return fallback

  const path = value.trim()

  if (!path.startsWith("/")) return fallback
  // `//host` и `/\host` браузер считает внешним адресом, хотя строка и
  // начинается со слеша.
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback
  // Пробел и управляющие символы браузеры вырезают уже после проверки, так
  // что "/ /evil" прошло бы дальше как "//evil".
  if (/[\u0000-\u0020\u007f]/.test(path)) return fallback

  return path
}

/** Тот же адрес, пригодный для подстановки в query. */
export function nextParam(value: string | null | undefined) {
  const path = safeNext(value, "")

  return path ? `?next=${encodeURIComponent(path)}` : ""
}
