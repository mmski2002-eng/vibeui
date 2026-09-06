"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup039Props = Omit<ComponentProps<"div">, "children"> & {
  cancelLabel?: string
  dangerLabel?: string
  delay?: number
  warning?: string
  label?: string
  /** Объявление отсчёта; {seconds} подставляется числом оставшихся секунд. */
  waitingText?: string
  readyText?: string
  /** Пусто — заливки нет, карточка ложится на фон страницы. */
  background?: string
  danger?: string
  accent?: string
}

// Идея компонента: опасная кнопка, которая несколько секунд остаётся
// недоступной. Это защита не от злого умысла, а от инерции: диалог удаления
// открывается там же, где стояла безопасная кнопка, и палец успевает нажать
// раньше, чем глаз прочитал заголовок. Оставшееся время показано кольцом на
// conic-gradient с маской — кольцо рисуется одним элементом, без SVG. Число
// секунд продублировано текстом и объявлено через aria-live, потому что
// кольцо для скринридера не существует. Атрибут disabled настоящий: кнопка
// действительно не нажимается и не ловит Enter.
const STYLES = `
:where([data-vibeui-block="buttongroup-039"]){
--vibeui-buttongroup-039-surface:transparent;
--vibeui-buttongroup-039-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-039-muted:color-mix(in oklab,var(--vibeui-buttongroup-039-fg) 68%,transparent);
--vibeui-buttongroup-039-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-039-hover:light-dark(oklch(0.97 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-039-danger:light-dark(oklch(0.53 0.19 27),oklch(0.62 0.18 27));
--vibeui-buttongroup-039-on-danger:light-dark(oklch(0.99 0.006 27),oklch(0.98 0.008 27));
--vibeui-buttongroup-039-locked:light-dark(oklch(0.97 0.01 27),oklch(0.3 0.03 27));
--vibeui-buttongroup-039-locked-fg:light-dark(oklch(0.62 0.08 27),oklch(0.63 0.06 27));
--vibeui-buttongroup-039-rest:light-dark(oklch(0.86 0.02 27),oklch(0.45 0.04 27));
--vibeui-buttongroup-039-accent:light-dark(oklch(0.5 0.15 39.8),oklch(0.72 0.15 39.8));
--vibeui-buttongroup-039-radius:0.625rem;
--vibeui-buttongroup-039-progress:0;
--vibeui-buttongroup-039-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-039"]{color-scheme:dark}
[data-vibeui-block="buttongroup-039"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;padding:0.875rem;
border:1px solid var(--vibeui-buttongroup-039-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-039-surface);
font-family:var(--vibeui-buttongroup-039-font);
}
[data-vibeui-block="buttongroup-039"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-039"] [data-part="warning"]{
margin:0;color:var(--vibeui-buttongroup-039-fg);
font-size:0.8125rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="buttongroup-039"] [data-part="track"]{display:flex;gap:0.5rem}
[data-vibeui-block="buttongroup-039"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
flex:1 1 0;min-width:0;height:2.25rem;padding:0 0.75rem;
border:1px solid var(--vibeui-buttongroup-039-border);
border-radius:var(--vibeui-buttongroup-039-radius);
background:var(--vibeui-buttongroup-039-surface);
color:var(--vibeui-buttongroup-039-fg);
font-size:0.8125rem;font-weight:650;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-039"] button:hover:not(:disabled){background:var(--vibeui-buttongroup-039-hover)}
[data-vibeui-block="buttongroup-039"] [data-part="danger"]{
border-color:var(--vibeui-buttongroup-039-danger);
background:var(--vibeui-buttongroup-039-danger);
color:var(--vibeui-buttongroup-039-on-danger);
}
[data-vibeui-block="buttongroup-039"] [data-part="danger"]:hover:not(:disabled){background:color-mix(in oklab,var(--vibeui-buttongroup-039-danger) 88%,black)}
[data-vibeui-block="buttongroup-039"] [data-part="danger"]:disabled{
cursor:not-allowed;
border-color:var(--vibeui-buttongroup-039-border);
background:var(--vibeui-buttongroup-039-locked);
color:var(--vibeui-buttongroup-039-locked-fg);
}
[data-vibeui-block="buttongroup-039"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-039-accent);outline-offset:2px;
}
/* Кольцо обратного отсчёта: conic-gradient плюс маска, без SVG. */
[data-vibeui-block="buttongroup-039"] [data-part="ring"]{
flex:none;width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:conic-gradient(currentColor calc(var(--vibeui-buttongroup-039-progress) * 1turn),var(--vibeui-buttongroup-039-rest) 0);
mask:radial-gradient(circle,transparent 54%,#000 56%);
transition:background .3s linear;
}
[data-vibeui-block="buttongroup-039"] [data-part="left"]{
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-039"] [data-part="status"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-039"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Опасное действие, которое становится доступным только через несколько секунд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup039({
  cancelLabel = "Отмена",
  dangerLabel = "Удалить проект",
  delay = 5,
  warning = "Проект и все его сборки будут удалены без возможности вернуть.",
  label = "Подтверждение удаления",
  waitingText = "Удаление станет доступно через {seconds} с",
  readyText = "Удаление доступно",
  background = "",
  danger,
  accent,
  className,
  style,
  ...props
}: Buttongroup039Props) {
  // В состоянии живут прошедшие секунды, а остаток считается от них: тогда
  // смена delay действует сразу, и сбрасывать состояние эффектом не нужно.
  const [elapsed, setElapsed] = useState(0)
  const left = Math.max(0, delay - elapsed)

  useEffect(() => {
    if (left <= 0) {
      return
    }

    const timer = window.setTimeout(
      () => setElapsed((value) => value + 1),
      1000,
    )

    return () => window.clearTimeout(timer)
  }, [left])

  const palette = {
    "--vibeui-buttongroup-039-progress": delay > 0 ? (delay - left) / delay : 1,
    ...(accent ? { "--vibeui-buttongroup-039-accent": accent } : null),
    ...(danger ? { "--vibeui-buttongroup-039-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-039-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-039" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-039"
        className={className}
        style={palette}
      >
        <p data-part="warning">{warning}</p>
        <div data-part="track" role="group" aria-label={label}>
          <button type="button">{cancelLabel}</button>
          <button type="button" data-part="danger" disabled={left > 0}>
            {left > 0 ? (
              <span data-part="ring" aria-hidden="true" />
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />
              </svg>
            )}
            {dangerLabel}
            {left > 0 ? <span data-part="left">&nbsp;({left})</span> : null}
          </button>
        </div>
        <p data-part="status" role="status">
          {left > 0
            ? waitingText.replace("{seconds}", String(left))
            : readyText}
        </p>
      </div>
    </>
  )
}
