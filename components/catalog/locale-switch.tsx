"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LOCALES, localePath, stripLocale, type Locale } from "@/lib/i18n"

const LABELS: Record<Locale, string> = { ru: "Рус", en: "Eng" }

/**
 * Переключатель языка. Ведёт на ту же страницу в другом языке, а не на
 * главную: человек читает конкретный компонент и хочет прочитать его же.
 *
 * Выбор запоминается кукой: главную язык подбирает по заголовку браузера
 * (см. proxy.ts), и без этой отметки следующий заход снова уводил бы
 * англоязычного гостя с русской версии, которую он только что выбрал сам.
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
          href={localePath(option, bare)}
          onClick={() => {
            document.cookie = `vibeui-locale=${option}; path=/; max-age=31536000; samesite=lax`
          }}
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
