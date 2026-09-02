"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup005View = {
  id: string
  label: string
}

export type Buttongroup005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  views?: Buttongroup005View[]
  defaultView?: string
  label?: string
  onChange?: (id: string) => void
  /** Заливка трека. Пусто — остаётся своя, чуть отличная от фона страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель представления — это не выбор из формы, а
// набор кнопок-тумблеров. Состояние объявляется через aria-pressed, поэтому
// скринридер читает «Сетка, нажато», а не догадывается по цвету. Radio здесь
// был бы неправдой: значение никуда не отправляется, оно меняет вид списка.
const STYLES = `
:where([data-vibeui-block="buttongroup-005"]){
--vibeui-buttongroup-005-surface:light-dark(oklch(0.97 0.004 265),oklch(0.28 0.012 265));
--vibeui-buttongroup-005-on:light-dark(oklch(1 0 0),oklch(0.4 0.014 265));
--vibeui-buttongroup-005-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.006 265));
--vibeui-buttongroup-005-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-buttongroup-005-border:light-dark(oklch(0.89 0.008 265),oklch(0.38 0.012 265));
--vibeui-buttongroup-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.75 0.15 265));
--vibeui-buttongroup-005-radius:0.5rem;
--vibeui-buttongroup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-005"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.1875rem;
padding:0.1875rem;
border:1px solid var(--vibeui-buttongroup-005-border);
border-radius:calc(var(--vibeui-buttongroup-005-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-005-surface);
font-family:var(--vibeui-buttongroup-005-font);
}
[data-vibeui-block="buttongroup-005"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-005"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.875rem;padding:0 0.625rem;
border:0;border-radius:var(--vibeui-buttongroup-005-radius);background:transparent;
color:var(--vibeui-buttongroup-005-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="buttongroup-005"] button svg{width:0.9375rem;height:0.9375rem;flex:none}
[data-vibeui-block="buttongroup-005"] button:hover{color:var(--vibeui-buttongroup-005-fg)}
[data-vibeui-block="buttongroup-005"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-005-accent);outline-offset:1px;
}
/* Нажатое состояние выбирается по самому aria-pressed: разметка и вид
   не могут разойтись, потому что источник у них один. */
[data-vibeui-block="buttongroup-005"] button[aria-pressed="true"]{
background:var(--vibeui-buttongroup-005-on);
color:var(--vibeui-buttongroup-005-fg);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="buttongroup-005"] button[aria-pressed="true"] svg{color:var(--vibeui-buttongroup-005-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VIEWS: Buttongroup005View[] = [
  { id: "list", label: "Список" },
  { id: "grid", label: "Сетка" },
  { id: "table", label: "Таблица" },
]

const ICONS: Record<string, string> = {
  list: "M6.5 4.5h9M6.5 9h9M6.5 13.5h9M3 4.5h.01M3 9h.01M3 13.5h.01",
  grid: "M3 3.5h5.5V9H3zM10.5 3.5H16V9h-5.5zM3 10.5h5.5V16H3zM10.5 10.5H16V16h-5.5z",
  table: "M2.5 4h14v10h-14zM2.5 7.5h14M7.5 7.5V14",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Переключатель представления списка с состоянием через aria-pressed.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup005({
  views = DEFAULT_VIEWS,
  defaultView = "grid",
  label = "Вид списка",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup005Props) {
  const [current, setCurrent] = useState(defaultView)

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-005"
        role="group"
        aria-label={label}
        className={className}
        style={palette}
      >
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            aria-pressed={current === view.id}
            onClick={() => {
              setCurrent(view.id)
              onChange?.(view.id)
            }}
          >
            <svg viewBox="0 0 19 18" fill="none" aria-hidden="true">
              <path
                d={ICONS[view.id] ?? ICONS.list}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {view.label}
          </button>
        ))}
      </div>
    </>
  )
}
