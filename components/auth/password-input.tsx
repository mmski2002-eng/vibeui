"use client"

import { useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"

import type { Locale } from "@/lib/i18n"

const LABELS = {
  ru: { show: "Показать пароль", hide: "Скрыть пароль" },
  en: { show: "Show password", hide: "Hide password" },
} satisfies Record<Locale, { show: string; hide: string }>

/**
 * Поле пароля с кнопкой «показать».
 *
 * Без неё длинный пароль набирают вслепую и ошибаются — а потом идут
 * восстанавливать доступ. Вставка из менеджера паролей не блокируется:
 * запрет вставки не защищает ни от чего, кроме сильных паролей.
 */
export function PasswordInput({
  locale = "ru",
  className,
  ...props
}: ComponentProps<"input"> & { locale?: Locale }) {
  const t = LABELS[locale]
  const [shown, setShown] = useState(false)

  return (
    <span className="relative block">
      <input
        {...props}
        type={shown ? "text" : "password"}
        className={`${className ?? ""} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShown((was) => !was)}
        aria-pressed={shown}
        title={shown ? t.hide : t.show}
        className="text-shell-muted hover:text-shell-fg focus-visible:ring-shell-ring absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {shown ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">{shown ? t.hide : t.show}</span>
      </button>
    </span>
  )
}
