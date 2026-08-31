"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs004Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs004Props = {
  items?: Tabs004Item[]
  defaultId?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки-пилюли, где активная залита акцентом, а между
// неактивными стоят тонкие разделители — как в системном сегментированном
// переключателе. Разделитель рисуется псевдоэлементом и гаснет у соседей
// активной пилюли, иначе рядом с заливкой он выглядит грязью.
const STYLES = `
:where([data-vibeui-block="tabs-004"]){
--vibeui-tabs-004-bg:oklch(1 0 0);
--vibeui-tabs-004-track:oklch(0.96 0.003 265);
--vibeui-tabs-004-fg:oklch(0.22 0.014 265);
--vibeui-tabs-004-muted:oklch(0.52 0.014 265);
--vibeui-tabs-004-border:oklch(0.91 0.006 265);
--vibeui-tabs-004-line:oklch(0.86 0.006 265);
--vibeui-tabs-004-accent:oklch(0.55 0.2 262);
--vibeui-tabs-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tabs-004"]{
box-sizing:border-box;width:100%;max-width:26rem;padding:0.75rem;
background:var(--vibeui-tabs-004-bg);color:var(--vibeui-tabs-004-fg);
border:1px solid var(--vibeui-tabs-004-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-004-font);
}
[data-vibeui-block="tabs-004"] [data-part="list"]{
display:inline-flex;padding:0.1875rem;box-sizing:border-box;
background:var(--vibeui-tabs-004-track);border-radius:999px;
}
[data-vibeui-block="tabs-004"] [data-part="tab"]{
position:relative;appearance:none;border:0;background:none;cursor:pointer;
min-height:1.875rem;padding:0 0.875rem;border-radius:999px;
font:inherit;font-size:0.8125rem;font-weight:550;white-space:nowrap;
color:var(--vibeui-tabs-004-muted);
transition:background-color .18s ease,color .18s ease;
}
[data-vibeui-block="tabs-004"] [data-part="tab"]:hover{color:var(--vibeui-tabs-004-fg)}
[data-vibeui-block="tabs-004"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-004-accent);outline-offset:2px}
[data-vibeui-block="tabs-004"] [data-part="tab"][aria-selected="true"]{
background:var(--vibeui-tabs-004-accent);color:oklch(1 0 0);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 18%);
}
/* Разделитель между соседями; у краёв активной пилюли он не нужен. */
[data-vibeui-block="tabs-004"] [data-part="tab"] + [data-part="tab"]::before{
content:"";position:absolute;left:-0.0625rem;top:25%;bottom:25%;width:1px;
background:var(--vibeui-tabs-004-line);
}
[data-vibeui-block="tabs-004"] [data-part="tab"][aria-selected="true"]::before,
[data-vibeui-block="tabs-004"] [data-part="tab"][aria-selected="true"] + [data-part="tab"]::before{background:transparent}
[data-vibeui-block="tabs-004"] [data-part="panel"]{
margin-top:0.875rem;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-004-muted);
}
[data-vibeui-block="tabs-004"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-004-accent);outline-offset:3px;border-radius:0.5rem}
[data-vibeui-block="tabs-004"] [data-part="figure"]{
display:block;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
color:var(--vibeui-tabs-004-fg);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs004Item[] = [
  {
    id: "day",
    label: "Сутки",
    content: (
      <>
        <b data-part="figure">1 284</b>
        визита за последние 24 часа, на 8% больше вчерашнего.
      </>
    ),
  },
  {
    id: "week",
    label: "Неделя",
    content: (
      <>
        <b data-part="figure">9 470</b>
        визитов за семь дней, пик пришёлся на четверг.
      </>
    ),
  },
  {
    id: "month",
    label: "Месяц",
    content: (
      <>
        <b data-part="figure">38 902</b>
        визита за месяц, половина — из поиска.
      </>
    ),
  },
]

/**
 * Вкладки-пилюли: активная залита акцентом, соседи разделены линиями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs004({
  items = DEFAULT_ITEMS,
  defaultId,
  accent,
  className,
  style,
}: Tabs004Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-004-accent": accent } : null),
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
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items[index]

  return (
    <>
      <style href="vibeui-tabs-004" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tabs-004" className={className} style={palette}>
        <div
          data-part="list"
          role="tablist"
          aria-label="Период"
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              data-part="tab"
              role="tab"
              id={`vibeui-tabs-004-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-004-${item.id}-panel`}
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
            id={`vibeui-tabs-004-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-004-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
