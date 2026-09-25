"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LOCALES, stripLocale, type Locale } from "@/lib/i18n"

const LABELS: Record<Locale, string> = { ru: "Рус", en: "Eng" }
const ORIGIN: Record<Locale, string> = {
  ru: "https://vibeui.ru",
  en: "https://vibeui.club",
}

/**
 * Переключатель языка. Та же страница на другом домене: русский на
 * vibeui.ru, английский на vibeui.club. Приставки в пути нет.
 */
export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const bare = stripLocale(pathname)

  return (
    <div
      role="group"
      aria-label="Язык · Language"
      className="border-shell-border bg-shell-panel flex items-center rounded-full border p-0.5"
    >
      {LOCALES.map((option) => (
        <Link
          key={option}
          href={`${ORIGIN[option]}${bare === "/" ? "" : bare}`}
          aria-current={option === locale ? "true" : undefined}
          className={
            // Одна пилюля с двумя состояниями, а не две соседние кнопки.
            // Активный язык виден за счёт ступени между панелью пилюли и
            // elevated — с тех пор как панель ушла ближе к фону, разница
            // читается без цветной подсветки.
            "focus-visible:ring-shell-ring rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
            (option === locale
              ? "bg-shell-elevated text-shell-fg"
              : "text-shell-muted hover:text-shell-fg")
          }
        >
          {LABELS[option]}
        </Link>
      ))}
    </div>
  )
}
