"use client"

import { useEffect, useRef, useState } from "react"

import { useStartProgress } from "@/components/pages/start/progress"
import { START_TEXTS } from "@/components/pages/start/texts"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Лента шагов, прилипающая под шапку. Подсвечивает раздел, который сейчас
 * в кадре, и считает отметки чек-листа; полоса сверху — сколько страницы
 * прочитано. Ссылки обычные якорные: без JS всё равно работают.
 */
export function StartNav({ locale }: { locale: Locale }) {
  // Словарь берётся здесь, а не пропсом: функцию-счётчик через границу
  // серверного и клиентского компонента не передать.
  const {
    levels,
    navLabel: label,
    progress: progressLabel,
  } = START_TEXTS[locale]
  const { done, total } = useStartProgress()
  const [active, setActive] = useState<string | null>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sections = levels
      .map((level) => document.getElementById(level.anchor))
      .filter((element): element is HTMLElement => element !== null)

    let frame = 0
    const paint = () => {
      frame = 0
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const ratio =
        scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0

      bar.current?.style.setProperty("transform", `scaleX(${ratio})`)

      // Активен последний раздел, чей заголовок поднялся выше 40 % экрана:
      // там глаз уже читает его. IntersectionObserver здесь хуже —
      // короткий последний раздел не попадал бы в его окно.
      const line = window.innerHeight * 0.4
      const current = sections.filter(
        (section) => section.getBoundingClientRect().top <= line,
      )

      setActive(current.at(-1)?.id ?? null)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [levels])

  return (
    <nav
      aria-label={label}
      className="border-shell-border bg-shell/85 sticky top-(--catalog-header-height) z-20 -mx-4 mb-4 border-b backdrop-blur-md lg:-mx-6"
    >
      <span
        aria-hidden="true"
        className="bg-shell-accent absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 motion-reduce:transition-none"
        ref={bar}
      />
      <div className="flex [scrollbar-width:none] items-center gap-1 overflow-x-auto px-4 py-2 lg:px-6">
        {levels.map((level, index) => {
          const current = active === level.anchor

          return (
            <a
              key={level.anchor}
              href={`#${level.anchor}`}
              aria-current={current ? "location" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-(--motion-base)",
                current
                  ? "bg-shell-accent-soft text-shell-accent-text"
                  : "text-shell-muted hover:text-shell-fg",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[11px] tabular-nums transition-colors duration-(--motion-base)",
                  current
                    ? "border-shell-accent bg-shell-accent text-shell-accent-fg"
                    : "border-shell-border",
                )}
              >
                {index + 1}
              </span>
              {level.title}
            </a>
          )
        })}
        <span
          role="status"
          className="text-shell-muted ml-auto shrink-0 pl-3 text-xs tabular-nums"
        >
          {progressLabel(done.size, total)}
        </span>
      </div>
    </nav>
  )
}
