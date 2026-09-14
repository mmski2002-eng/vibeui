import type { Locale } from "@/lib/i18n"

export type NumberKind = "int" | "rub" | "percent"

const TAG: Record<Locale, string> = { ru: "ru-RU", en: "en-GB" }

/** Число для плиток и графиков: целое, рубли или проценты. */
export function formatNumber(
  value: number,
  kind: NumberKind = "int",
  locale: Locale = "ru",
) {
  const whole = Math.round(value).toLocaleString(TAG[locale])

  if (kind === "rub") return locale === "en" ? `${whole} RUB` : `${whole} ₽`
  if (kind === "percent") return `${whole}%`

  return whole
}

export function formatDay(value: Date, locale: Locale = "ru") {
  return value.toLocaleDateString(TAG[locale], {
    day: "numeric",
    month: "short",
  })
}

export function formatDate(value: Date, locale: Locale = "ru") {
  return value.toLocaleDateString(TAG[locale])
}

export function formatDateTime(value: Date, locale: Locale = "ru") {
  return value.toLocaleString(TAG[locale], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Короткая подпись дня для оси графика: «14 сен» без точки и года. */
export function formatAxisDay(iso: string, locale: Locale = "ru") {
  const [year, month, day] = iso.split("-").map(Number)

  return new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString(TAG[locale], {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
    .replace(".", "")
}
