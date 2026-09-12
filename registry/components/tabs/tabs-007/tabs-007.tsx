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
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись списка вкладок для скринридера. */
  listLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: много вкладок в узкой полосе. Ряд прокручивается, а края
// растворяются маской — обрезанное посреди буквы «Новосибирс» читается как
// поломка, растворённое слово читается как «дальше есть ещё». Поверх маски
// лежит тень на background-attachment:scroll: она стоит на месте, пока ряд
// едет, и гаснет сама, когда докрутили до края. Ни наблюдателя, ни JS.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="tabs-007"]){
--vibeui-tabs-007-bg:transparent;
--vibeui-tabs-007-mask:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-tabs-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-tabs-007-muted:color-mix(in oklab,var(--vibeui-tabs-007-fg) 68%,transparent);
--vibeui-tabs-007-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-tabs-007-shade:light-dark(oklch(0.35 0 265 / 16%),oklch(0.08 0 265 / 45%));
--vibeui-tabs-007-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-tabs-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-007"]{color-scheme:dark}
[data-vibeui-block="tabs-007"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.5rem 0 0.875rem;
background:var(--vibeui-tabs-007-bg);color:var(--vibeui-tabs-007-fg);
border:1px solid var(--vibeui-tabs-007-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-007-font);
}
/* Тени по краям: маска на local, тень на scroll — край гаснет, когда докрутили. */
[data-vibeui-block="tabs-007"] [data-part="list"]{
display:flex;gap:0.25rem;padding:0 0.75rem;
overflow-x:auto;scrollbar-width:none;overscroll-behavior-x:contain;
border-bottom:1px solid var(--vibeui-tabs-007-border);
/* Края растворяются всегда: маска не знает про положение прокрутки, зато
   ни одна подпись не обрывается посреди буквы. */
mask-image:linear-gradient(to right,transparent 0,#000 1.25rem,#000 calc(100% - 1.75rem),transparent 100%);
background-image:
linear-gradient(to right,var(--vibeui-tabs-007-shade),transparent),
linear-gradient(to left,var(--vibeui-tabs-007-shade),transparent);
background-position:left center,right center;
background-size:0.75rem 100%,0.75rem 100%;
background-repeat:no-repeat;
background-attachment:scroll,scroll;
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
border-radius:2px 2px 0 0;background:var(--vibeui-tabs-007-accent);color:oklch(from var(--vibeui-tabs-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
 * Прокручиваемый ряд вкладок с тенями по краям.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs007({
  items = DEFAULT_ITEMS,
  defaultId,
  background = "",
  accent,
  listLabel = "Города",
  className,
  style,
  ...props
}: Tabs007Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  // Маска края обязана повторять цвет подложки: иначе градиент гасит ряд
  // не тем цветом и по краям остаётся полоса.
  const palette = {
    ...(accent ? { "--vibeui-tabs-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-007-bg": background,
          "--vibeui-tabs-007-mask": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-007"
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
