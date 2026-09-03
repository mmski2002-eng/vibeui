"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs003Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs003Props = {
  items?: Tabs003Item[]
  defaultId?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись списка вкладок для скринридера. */
  listLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: один общий индикатор, который переезжает под активную вкладку.
// Вкладки лежат в сетке равными колонками, поэтому позиция считается арифметикой
// в CSS — индекс и количество приходят переменными, и ничего не приходится
// измерять в JS. Такой индикатор не рассыпается при смене шрифта и при ресайзе.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="tabs-003"]){
--vibeui-tabs-003-bg:transparent;
--vibeui-tabs-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-tabs-003-muted:color-mix(in oklab,var(--vibeui-tabs-003-fg) 68%,transparent);
--vibeui-tabs-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-tabs-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-tabs-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-003"]{color-scheme:dark}
[data-vibeui-block="tabs-003"]{
box-sizing:border-box;width:100%;max-width:28rem;padding:0.25rem 0.75rem 0.75rem;
background:var(--vibeui-tabs-003-bg);color:var(--vibeui-tabs-003-fg);
border:1px solid var(--vibeui-tabs-003-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-003-font);
}
[data-vibeui-block="tabs-003"] [data-part="list"]{
position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;
border-bottom:1px solid var(--vibeui-tabs-003-border);
}
[data-vibeui-block="tabs-003"] [data-part="tab"]{
appearance:none;border:0;background:none;cursor:pointer;
padding:0.6875rem 0.5rem;border-radius:0.5rem 0.5rem 0 0;
font:inherit;font-size:0.875rem;font-weight:500;
color:var(--vibeui-tabs-003-muted);white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="tabs-003"] [data-part="tab"]:hover{color:var(--vibeui-tabs-003-fg)}
[data-vibeui-block="tabs-003"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-003-accent);outline-offset:-3px}
[data-vibeui-block="tabs-003"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-tabs-003-fg);font-weight:650}
/* Позиция индикатора — арифметика от индекса и количества вкладок. */
[data-vibeui-block="tabs-003"] [data-part="ink"]{
position:absolute;left:0;bottom:-1px;height:2px;border-radius:2px 2px 0 0;
width:calc(100% / var(--vibeui-tabs-003-count));
transform:translateX(calc(var(--vibeui-tabs-003-index) * 100%)) scaleX(0.72);
background:var(--vibeui-tabs-003-accent);
transition:transform .24s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="tabs-003"] [data-part="panel"]{
padding-top:0.875rem;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-003-muted);
}
[data-vibeui-block="tabs-003"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-003-accent);outline-offset:3px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs003Item[] = [
  {
    id: "brief",
    label: "Задача",
    content:
      "Что нужно получить, в каком объёме и к какому сроку. Один абзац без деталей реализации.",
  },
  {
    id: "team",
    label: "Команда",
    content:
      "Кто участвует, кто принимает результат и с кем сверяться по спорным местам.",
  },
  {
    id: "budget",
    label: "Бюджет",
    content:
      "Оценка по этапам с запасом на правки. Отдельной строкой — что в неё не входит.",
  },
]

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
 * Вкладки с одним переезжающим индикатором под активной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs003({
  items = DEFAULT_ITEMS,
  defaultId,
  background = "",
  accent,
  listLabel = "Разделы брифа",
  className,
  style,
  ...props
}: Tabs003Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const index = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  )

  const palette = {
    "--vibeui-tabs-003-count": `${items.length}`,
    "--vibeui-tabs-003-index": `${index}`,
    ...(accent ? { "--vibeui-tabs-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const last = items.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowLeft"
            ? (index - 1 + items.length) % items.length
            : (index + 1) % items.length

    setActive(items[next].id)
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items[index]

  return (
    <>
      <style href="vibeui-tabs-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-003"
        className={className}
        style={palette}
      >
        <div
          data-part="list"
          role="tablist"
          aria-label={listLabel}
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              data-part="tab"
              role="tab"
              id={`vibeui-tabs-003-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-003-${item.id}-panel`}
              tabIndex={item.id === active ? 0 : -1}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
          <span data-part="ink" aria-hidden="true" />
        </div>
        {current ? (
          <div
            data-part="panel"
            role="tabpanel"
            id={`vibeui-tabs-003-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-003-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
