"use client"

import { Moon, Sun } from "lucide-react"
import { useState, type ReactNode } from "react"

/**
 * Подложка превью с переключателем светлой и тёмной темы в углу кадра.
 * Состояние локальное: каждая карточка переключается независимо.
 *
 * Переключатель меняет только подложку кадра, а не сам registry-компонент:
 * блоки и компоненты theme-independent, у каждого своя палитра, и оболочка
 * каталога не имеет права их перекрашивать.
 */
export function PreviewTheme({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const isDark = theme === "dark"

  return (
    <div
      data-preview-theme={theme}
      className="relative flex min-h-44 min-w-0 flex-1 flex-col"
    >
      {children}

      {/* Над растянутой ссылкой карточки: у кнопки собственный клик. */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-pressed={isDark}
        className="border-shell-border bg-shell/70 text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md border backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {isDark ? (
          <Sun className="size-3.5" aria-hidden="true" />
        ) : (
          <Moon className="size-3.5" aria-hidden="true" />
        )}
        <span className="sr-only">
          {isDark ? "Светлая подложка превью" : "Тёмная подложка превью"}
        </span>
      </button>
    </div>
  )
}
