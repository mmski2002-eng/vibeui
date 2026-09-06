"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Empty012Props = {
  title?: string
  text?: string
  code?: string
  retryLabel?: string
  /** Отсчёт до следующей попытки. `{seconds}` — оставшиеся секунды. */
  countdownTemplate?: string
  /** Подпись в момент самой попытки. */
  retryingLabel?: string
  seconds?: number
  autoRetry?: boolean
  onRetry?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Тревожный цвет: знак, полоса отсчёта и обводка фокуса. */
  danger?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: ошибка загрузки, которая пробует сама. Код ответа виден
// сразу, без клика в details — для этого сценария код важен не только
// разработчику. Обратный отсчёт показывает следующую попытку, но не мешает
// нажать "Повторить сейчас" раньше — тогда отсчёт стартует заново.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-012"]){
--vibeui-empty-012-bg:transparent;
--vibeui-empty-012-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-empty-012-muted:color-mix(in oklab,var(--vibeui-empty-012-fg) 68%,transparent);
--vibeui-empty-012-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-empty-012-pill:light-dark(oklch(0.97 0 265),oklch(0.3 0 265));
--vibeui-empty-012-track:light-dark(oklch(0.94 0 265),oklch(0.33 0 265));
--vibeui-empty-012-action-fg:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-empty-012-danger:light-dark(oklch(0.55 0.19 25),oklch(0.7 0.17 25));
--vibeui-empty-012-danger-soft:light-dark(color-mix(in oklab,var(--vibeui-empty-012-danger) 14%,oklch(1 0 0)),color-mix(in oklab,var(--vibeui-empty-012-danger) 26%,oklch(0.2 0 265)));
--vibeui-empty-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-empty-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-012"]{color-scheme:dark}
[data-vibeui-block="empty-012"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-012-bg);
border:1px solid var(--vibeui-empty-012-border);border-radius:1rem;
font-family:var(--vibeui-empty-012-font);color:var(--vibeui-empty-012-fg);
}
[data-vibeui-block="empty-012"] [data-part="mark"]{
width:2.75rem;height:2.75rem;border-radius:0.875rem;
background:var(--vibeui-empty-012-danger-soft);color:var(--vibeui-empty-012-danger);
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="empty-012"] [data-part="mark"] svg{width:1.5rem;height:1.5rem}
[data-vibeui-block="empty-012"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-012"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-012-muted);
}
[data-vibeui-block="empty-012"] [data-part="code"]{
margin:0.125rem 0 0;padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-empty-012-pill);
font-family:var(--vibeui-empty-012-mono);font-size:0.75rem;font-weight:600;color:var(--vibeui-empty-012-fg);
}
[data-vibeui-block="empty-012"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-012-fg);color:var(--vibeui-empty-012-action-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-012"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-012-danger);outline-offset:2px;
}
[data-vibeui-block="empty-012"] [data-part="countdown"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-empty-012-muted);
}
[data-vibeui-block="empty-012"] [data-part="bar"]{
width:100%;height:3px;margin-top:0.375rem;border-radius:9999px;
background:var(--vibeui-empty-012-track);overflow:hidden;
}
[data-vibeui-block="empty-012"] [data-part="bar-fill"]{
height:100%;background:var(--vibeui-empty-012-danger);
transition:width 1s linear;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="empty-012"] *{animation:none!important;transition:none!important}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Ошибка загрузки с автоповтором: код ответа виден сразу, отсчёт
 * до следующей попытки, ручной повтор в любой момент.
 * Один файл, ноль внешних зависимостей.
 */
export function Empty012({
  title = "Не удалось загрузить список",
  text = "Сервер не ответил вовремя. Пробуем ещё раз автоматически — можно и вручную.",
  code = "504 Gateway Timeout",
  retryLabel = "Повторить сейчас",
  countdownTemplate = "Следующая попытка через {seconds} с",
  retryingLabel = "Повторяем…",
  seconds = 8,
  autoRetry = true,
  onRetry,
  background = "",
  danger,
  className,
  style,
}: Empty012Props) {
  const [remaining, setRemaining] = useState(seconds)
  const palette = {
    ...(danger ? { "--vibeui-empty-012-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-empty-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (!autoRetry) return
    const timer = setTimeout(() => {
      if (remaining <= 1) {
        onRetry?.()
        setRemaining(seconds)
      } else {
        setRemaining((value) => value - 1)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [autoRetry, remaining, seconds, onRetry])

  const retryNow = () => {
    onRetry?.()
    setRemaining(seconds)
  }

  return (
    <>
      <style href="vibeui-empty-012" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="empty"
        data-vibeui-block="empty-012"
        role="alert"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <p data-part="code">{code}</p>
        <button type="button" data-part="action" onClick={retryNow}>
          {retryLabel}
        </button>
        {autoRetry ? (
          <>
            <p data-part="countdown">
              {remaining > 0
                ? countdownTemplate.replace("{seconds}", String(remaining))
                : retryingLabel}
            </p>
            <span data-part="bar" aria-hidden="true">
              <span
                data-part="bar-fill"
                style={{ width: `${(remaining / seconds) * 100}%` }}
              />
            </span>
          </>
        ) : null}
      </div>
    </>
  )
}
