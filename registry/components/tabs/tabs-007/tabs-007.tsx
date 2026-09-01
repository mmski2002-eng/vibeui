"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs007Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs007Props = {
  items?: Tabs007Item[]
  defaultId?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: много вкладок в узкой полосе. Ряд прокручивается, а по краям
// появляются тени — но только с той стороны, где содержимое ещё осталось. Это
// делает пара градиентов с разной привязкой фона: «маска» едет вместе с
// содержимым (local), «тень» стоит на месте (scroll). Ни наблюдателя, ни JS.
const STYLES = `
:where([data-vibeui-block="tabs-007"]){
--vibeui-tabs-007-bg:oklch(1 0 0);
--vibeui-tabs-007-fg:oklch(0.22 0.014 265);
--vibeui-tabs-007-muted:oklch(0.55 0.014 265);
--vibeui-tabs-007-border:oklch(0.91 0.006 265);
--vibeui-tabs-007-shade:oklch(0.35 0.03 265 / 16%);
--vibeui-tabs-007-accent:oklch(0.55 0.2 262);
--vibeui-tabs-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tabs-007"]{
box-sizing:border-box;width:100%;max-width:24rem;padding:0.5rem 0 0.875rem;
background:var(--vibeui-tabs-007-bg);color:var(--vibeui-tabs-007-fg);
border:1px solid var(--vibeui-tabs-007-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-007-font);
}
/* Тени по краям: маска на local, тень на scroll — край гаснет, когда докрутили. */
[data-vibeui-block="tabs-007"] [data-part="list"]{
display:flex;gap:0.25rem;padding:0 0.75rem;
overflow-x:auto;scrollbar-width:none;overscroll-behavior-x:contain;
border-bottom:1px solid var(--vibeui-tabs-007-border);
background-image:
linear-gradient(to right,var(--vibeui-tabs-007-bg),transparent),
linear-gradient(to left,var(--vibeui-tabs-007-bg),transparent),
linear-gradient(to right,var(--vibeui-tabs-007-shade),transparent),
linear-gradient(to left,var(--vibeui-tabs-007-shade),transparent);
background-position:left center,right center,left center,right center;
background-size:1.5rem 100%,1.5rem 100%,0.75rem 100%,0.75rem 100%;
background-repeat:no-repeat;
background-attachment:local,local,scroll,scroll;
}
[data-vibeui-block="tabs-007"] [data-part="list"]::-webkit-scrollbar{display:none}
[data-vibeui-block="tabs-007"] [data-part="tab"]{
position:relative;appearance:none;border:0;background:none;cursor:pointer;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:-1px;white-space:nowrap;
font:inherit;font-size:0.8125rem;font-weight:500;color:var(--vibeui-tabs-007-muted);
scroll-snap-align:center;
}
[data-vibeui-block="tabs-007"] [data-part="tab"]:hover{color:var(--vibeui-tabs-007-fg)}
[data-vibeui-block="tabs-007"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-007-accent);outline-offset:-3px;border-radius:0.375rem}
[data-vibeui-block="tabs-007"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-tabs-007-fg);font-weight:650}
[data-vibeui-block="tabs-007"] [data-part="tab"][aria-selected="true"]::after{
content:"";position:absolute;left:0.375rem;right:0.375rem;bottom:0;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-tabs-007-accent);
}
[data-vibeui-block="tabs-007"] [data-part="panel"]{
padding:0.875rem 0.875rem 0;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-007-muted);
}
[data-vibeui-block="tabs-007"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-007-accent);outline-offset:-3px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs007Item[] = [
  { id: "all", label: "Все", content: "Полный список городов доставки." },
  { id: "msk", label: "Москва", content: "Доставка в день заказа до 22:00." },
  { id: "spb", label: "Петербург", content: "Доставка на следующий день." },
  { id: "ekb", label: "Екатеринбург", content: "Два-три дня, курьером." },
  { id: "nsk", label: "Новосибирск", content: "Три дня, пункты выдачи." },
  { id: "kzn", label: "Казань", content: "Два дня, курьером и самовывоз." },
  { id: "sochi", label: "Сочи", content: "Три-четыре дня, только пункты." },
]

/**
 * Прокручиваемый ряд вкладок с тенями по краям.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs007({
  items = DEFAULT_ITEMS,
  defaultId,
  accent,
  className,
  style,
}: Tabs007Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const index = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  )

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

    const node =
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')[
        next
      ]

    node?.focus()
    node?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  const current = items[index]

  return (
    <>
      <style href="vibeui-tabs-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tabs-007" className={className} style={palette}>
        <div
          data-part="list"
          role="tablist"
          aria-label="Города"
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              data-part="tab"
              role="tab"
              id={`vibeui-tabs-007-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-007-${item.id}-panel`}
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
            id={`vibeui-tabs-007-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-007-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
