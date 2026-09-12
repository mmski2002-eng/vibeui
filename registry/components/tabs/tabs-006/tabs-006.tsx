"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs006Item = {
  id: string
  label: string
  glyph?: "inbox" | "star" | "clock" | "trash"
  count?: number
  content?: ReactNode
}

export type Tabs006Props = {
  items?: Tabs006Item[]
  defaultId?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись списка вкладок для скринридера. */
  listLabel?: string
  /** Шаблон подписи вкладки со счётчиком: {label} и {count}. */
  countLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки почтовых папок — значок, подпись и счётчик в одной
// строке. Значки нарисованы бордюрами, а не иконочным шрифтом, поэтому файл
// остаётся самодостаточным. Число уходит в aria-label вкладки: сам счётчик
// скрыт от скринридера, иначе он читается как продолжение подписи.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее фона, а плашка счётчика — светлее её.
const STYLES = `
:where([data-vibeui-block="tabs-006"]){
--vibeui-tabs-006-bg:transparent;
--vibeui-tabs-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-tabs-006-muted:color-mix(in oklab,var(--vibeui-tabs-006-fg) 68%,transparent);
--vibeui-tabs-006-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-tabs-006-chip:light-dark(oklch(0.94 0 265),oklch(0.32 0 265));
--vibeui-tabs-006-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-tabs-006-count:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.19 25));
--vibeui-tabs-006-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-tabs-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-006"]{color-scheme:dark}
[data-vibeui-block="tabs-006"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.5rem 0.75rem 0.875rem;
background:var(--vibeui-tabs-006-bg);color:var(--vibeui-tabs-006-fg);
border:1px solid var(--vibeui-tabs-006-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-006-font);
}
[data-vibeui-block="tabs-006"] [data-part="list"]{
display:flex;gap:0.25rem;overflow-x:auto;scrollbar-width:none;
border-bottom:1px solid var(--vibeui-tabs-006-border);
}
[data-vibeui-block="tabs-006"] [data-part="list"]::-webkit-scrollbar{display:none}
[data-vibeui-block="tabs-006"] [data-part="tab"]{
position:relative;appearance:none;border:0;background:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;white-space:nowrap;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:-1px;
font:inherit;font-size:0.8125rem;font-weight:500;color:var(--vibeui-tabs-006-muted);
}
[data-vibeui-block="tabs-006"] [data-part="tab"]:hover{color:var(--vibeui-tabs-006-fg)}
[data-vibeui-block="tabs-006"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-006-accent);outline-offset:-3px;border-radius:0.375rem}
[data-vibeui-block="tabs-006"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-tabs-006-fg);font-weight:650}
[data-vibeui-block="tabs-006"] [data-part="tab"][aria-selected="true"]::after{
content:"";position:absolute;left:0.375rem;right:0.375rem;bottom:0;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-tabs-006-accent);color:oklch(from var(--vibeui-tabs-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Значки собраны из бордюров: набор иконок сюда не тянется. */
[data-vibeui-block="tabs-006"] [data-part="glyph"]{
width:0.875rem;height:0.875rem;flex:none;position:relative;
border:1.5px solid currentColor;box-sizing:border-box;
}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="inbox"]{border-radius:0.1875rem}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="inbox"]::after{
content:"";position:absolute;left:-1.5px;right:-1.5px;top:55%;height:1.5px;background:currentColor;
}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="star"]{
border:0;background:currentColor;
clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="clock"]{border-radius:999px}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="clock"]::after{
content:"";position:absolute;left:50%;top:25%;width:1.5px;height:32%;background:currentColor;
}
[data-vibeui-block="tabs-006"] [data-part="glyph"][data-glyph="trash"]{border-radius:0 0 0.1875rem 0.1875rem;border-top-width:3px}
[data-vibeui-block="tabs-006"] [data-part="count"]{
min-width:1.125rem;padding:0 0.25rem;box-sizing:border-box;
border-radius:999px;background:var(--vibeui-tabs-006-count);
font-size:0.6875rem;line-height:1.125rem;text-align:center;
font-variant-numeric:tabular-nums;color:oklch(1 0 0);
}
[data-vibeui-block="tabs-006"] [data-part="panel"]{
padding-top:0.875rem;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-006-muted);
}
[data-vibeui-block="tabs-006"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-006-accent);outline-offset:3px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs006Item[] = [
  {
    id: "inbox",
    label: "Входящие",
    glyph: "inbox",
    count: 12,
    content: "Двенадцать непрочитанных писем, три из них помечены как срочные.",
  },
  {
    id: "star",
    label: "Важное",
    glyph: "star",
    count: 3,
    content: "Письма, отмеченные звёздочкой вручную или правилом фильтра.",
  },
  {
    id: "later",
    label: "Отложенные",
    glyph: "clock",
    count: 5,
    content: "Вернутся во входящие в указанное время и снова станут заметными.",
  },
  {
    id: "trash",
    label: "Корзина",
    glyph: "trash",
    content: "Удалённое хранится тридцать дней, потом исчезает окончательно.",
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
 * Вкладки со значками и счётчиками непрочитанного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs006({
  items = DEFAULT_ITEMS,
  defaultId,
  background = "",
  accent,
  listLabel = "Папки",
  countLabel = "{label}, писем {count}",
  className,
  style,
  ...props
}: Tabs006Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-006-bg": background,
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
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items[index]

  return (
    <>
      <style href="vibeui-tabs-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-006"
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
              id={`vibeui-tabs-006-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-006-${item.id}-panel`}
              aria-label={
                item.count === undefined
                  ? undefined
                  : countLabel
                      .replace("{label}", item.label)
                      .replace("{count}", String(item.count))
              }
              tabIndex={item.id === active ? 0 : -1}
              onClick={() => setActive(item.id)}
            >
              <span
                data-part="glyph"
                data-glyph={item.glyph ?? "inbox"}
                aria-hidden="true"
              />
              {item.label}
              {item.count === undefined ? null : (
                <span data-part="count" aria-hidden="true">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {current ? (
          <div
            data-part="panel"
            role="tabpanel"
            id={`vibeui-tabs-006-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-006-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
