"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs001Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs001Props = {
  items?: Tabs001Item[]
  defaultId?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки, которые слушаются клавиатуры так же, как
// системные. Стрелки переводят выбор, Home и End прыгают к краям, а полоска
// под активной вкладкой едет за ней — по разметке WAI-ARIA tabs, а не по
// набору div'ов с onClick.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте линия становится светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="tabs-001"]){
--vibeui-tabs-001-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-tabs-001-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-tabs-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-tabs-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-tabs-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="tabs-001"]{
display:flex;flex-direction:column;width:100%;box-sizing:border-box;
font-family:var(--vibeui-tabs-001-font);color:var(--vibeui-tabs-001-fg);
}
[data-vibeui-block="tabs-001"] [data-part="list"]{
display:flex;gap:0.25rem;overflow-x:auto;
border-bottom:1px solid var(--vibeui-tabs-001-border);
scrollbar-width:none;
}
[data-vibeui-block="tabs-001"] [data-part="list"]::-webkit-scrollbar{display:none}
[data-vibeui-block="tabs-001"] [data-part="tab"]{
appearance:none;border:0;background:transparent;cursor:pointer;
position:relative;white-space:nowrap;
padding:0.625rem 0.75rem;margin-bottom:-1px;
font:inherit;font-size:0.875rem;font-weight:500;
color:var(--vibeui-tabs-001-muted);
transition:color .16s ease;
}
[data-vibeui-block="tabs-001"] [data-part="tab"]:hover{color:var(--vibeui-tabs-001-fg)}
[data-vibeui-block="tabs-001"] [data-part="tab"]:focus-visible{
outline:2px solid var(--vibeui-tabs-001-accent);outline-offset:-2px;border-radius:0.375rem;
}
[data-vibeui-block="tabs-001"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-tabs-001-fg)}
/* Полоска под активной вкладкой: у каждой своя, ширина берётся от текста. */
[data-vibeui-block="tabs-001"] [data-part="tab"]::after{
content:"";position:absolute;left:0.75rem;right:0.75rem;bottom:0;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-tabs-001-accent);
transform:scaleX(0);transform-origin:center;
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="tabs-001"] [data-part="tab"][aria-selected="true"]::after{transform:scaleX(1)}
[data-vibeui-block="tabs-001"] [data-part="panel"]{
padding:1rem 0.125rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-tabs-001-muted);
}
[data-vibeui-block="tabs-001"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-001-accent);outline-offset:4px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs001Item[] = [
  {
    id: "overview",
    label: "Обзор",
    content:
      "Сводка по проекту: адрес, дата последней публикации и размер сборки.",
  },
  {
    id: "pages",
    label: "Страницы",
    content: "Список страниц с датами изменения и статусом публикации.",
  },
  {
    id: "domains",
    label: "Домены",
    content: "Подключённые домены, сертификаты и записи DNS.",
  },
]

/**
 * Вкладки с полной клавиатурой: стрелки, Home и End.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs001({
  items = DEFAULT_ITEMS,
  defaultId,
  accent,
  className,
  style,
}: Tabs001Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  // Стрелки двигают выбор по кругу и переносят фокус: так ведут себя вкладки
  // в системных интерфейсах, и это часть паттерна tabs в WAI-ARIA.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const index = items.findIndex((item) => item.id === active)
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

  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <>
      <style href="vibeui-tabs-001" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tabs-001" className={className} style={palette}>
        <div
          data-part="list"
          role="tablist"
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              data-part="tab"
              type="button"
              role="tab"
              id={`vibeui-tabs-001-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-001-${item.id}-panel`}
              tabIndex={item.id === active ? 0 : -1}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {current ? (
          <div
            data-part="panel"
            role="tabpanel"
            id={`vibeui-tabs-001-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-001-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
