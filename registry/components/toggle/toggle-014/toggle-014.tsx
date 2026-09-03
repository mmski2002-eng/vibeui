"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle014Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "title"
> & {
  title?: string
  note?: string
  /** Заметка в закреплённом состоянии. */
  pinnedNote?: string
  defaultPressed?: boolean
  /** Имена действия кнопки: ключи pin и unpin. Компонент несёт русские. */
  actionText?: Record<string, string>
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: строка списка с кнопкой булавки. Значок поворачивается
// на 45°, как воткнутая булавка, а фон строки подсвечивается через
// data-pinned на корне — состояние читается по всей строке, не только по кнопке.
const STYLES = `
:where([data-vibeui-block="toggle-014"]){
--vibeui-toggle-014-bg:transparent;
--vibeui-toggle-014-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-014-muted:color-mix(in oklab,var(--vibeui-toggle-014-fg) 68%,transparent);
--vibeui-toggle-014-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-toggle-014-accent:light-dark(oklch(0.68 0.17 55),oklch(0.79 0.15 55));
--vibeui-toggle-014-soft:light-dark(oklch(0.96 0.03 55),oklch(0.31 0.045 55));
--vibeui-toggle-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-014"]{color-scheme:dark}
[data-vibeui-block="toggle-014"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toggle-014-border);border-radius:0.875rem;
background:var(--vibeui-toggle-014-bg);color:var(--vibeui-toggle-014-fg);
font-family:var(--vibeui-toggle-014-font);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-014"] *{box-sizing:border-box}
[data-vibeui-block="toggle-014"][data-pinned="true"]{
background:var(--vibeui-toggle-014-soft);border-color:var(--vibeui-toggle-014-accent);
}
[data-vibeui-block="toggle-014"] [data-part="text"]{flex:1;min-width:0}
[data-vibeui-block="toggle-014"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toggle-014"] [data-part="note"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-toggle-014-muted);
}
[data-vibeui-block="toggle-014"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;padding:0;
border:1px solid var(--vibeui-toggle-014-border);border-radius:0.625rem;
background:var(--vibeui-toggle-014-bg);color:var(--vibeui-toggle-014-muted);
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toggle-014"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-014-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-014"] button[aria-pressed="true"]{
color:var(--vibeui-toggle-014-accent);border-color:var(--vibeui-toggle-014-accent);
}
[data-vibeui-block="toggle-014"] svg{
width:1.125rem;height:1.125rem;
transition:transform .2s ease;
transform:rotate(0deg);
transform-origin:50% 50%;
}
[data-vibeui-block="toggle-014"] svg path{
fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;
}
/* Поворот значка — единственный визуальный признак, не завязанный на цвет:
   различим и без восприятия оттенков. */
[data-vibeui-block="toggle-014"] button[aria-pressed="true"] svg{
transform:rotate(45deg);
}
[data-vibeui-block="toggle-014"] button[aria-pressed="true"] svg path{fill:currentColor}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-014"] *{animation:none!important;transition:none!important}}
`

const ACTION_TEXT: Record<string, string> = {
  pin: "Закрепить",
  unpin: "Открепить",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Строка списка с кнопкой булавки: значок поворачивается на 45°, фон строки
 * подсвечивается. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle014({
  title = "Ежемесячный отчёт по расходам",
  note = "Обновлён вчера",
  pinnedNote = "Закреплено вверху списка",
  defaultPressed = false,
  actionText = ACTION_TEXT,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle014Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const actionKey = pressed ? "unpin" : "pin"
  const action = actionText[actionKey] ?? ACTION_TEXT[actionKey]

  const palette = {
    ...(accent ? { "--vibeui-toggle-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-014"
        data-pinned={pressed}
        className={className}
        style={palette}
      >
        <div data-part="text">
          <p data-part="title">{title}</p>
          <p data-part="note" role="status">
            {pressed ? pinnedNote : note}
          </p>
        </div>
        <button
          type="button"
          aria-pressed={pressed}
          aria-label={action}
          title={action}
          onClick={() => {
            setPressed(!pressed)
            onChange?.(!pressed)
          }}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M11.2 2.6 17.4 8.8l-2 2-1-.3-3.2 3.2 1 2.9-1.4 1.4-3.6-3.6-3.9 3.9-1-1 3.9-3.9-3.6-3.6 1.4-1.4 2.9 1 3.2-3.2-.3-1z" />
          </svg>
        </button>
      </div>
    </>
  )
}
