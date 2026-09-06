"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent, ReactNode } from "react"

export type Tabs008Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs008Props = {
  items?: Tabs008Item[]
  visible?: number
  defaultId?: string
  moreLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись списка вкладок для скринридера. */
  listLabel?: string
  /** Подпись выпадающего списка скрытых вкладок. */
  menuLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладок больше, чем помещается, и лишние уходят в «ещё».
// Главное правило такой свёртки: выбранная вкладка обязана быть видимой, поэтому
// выбранная из списка занимает последнее видимое место, а вытесненная уходит в
// список. Иначе после выбора активная вкладка исчезает, и непонятно, где ты.
//
// Тема берётся из color-scheme окружения через light-dark(). Подложка списка
// «ещё» — отдельная переменная: список висит над содержимым и обязан быть
// непрозрачным, даже когда у самого компонента подложки нет.
const STYLES = `
:where([data-vibeui-block="tabs-008"]){
--vibeui-tabs-008-bg:transparent;
--vibeui-tabs-008-menu:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-tabs-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-tabs-008-muted:color-mix(in oklab,var(--vibeui-tabs-008-fg) 68%,transparent);
--vibeui-tabs-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-tabs-008-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 13%));
--vibeui-tabs-008-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));
--vibeui-tabs-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-008"]{color-scheme:dark}
[data-vibeui-block="tabs-008"]{
box-sizing:border-box;width:100%;max-width:28rem;padding:0.5rem 0.75rem 0.875rem;
background:var(--vibeui-tabs-008-bg);color:var(--vibeui-tabs-008-fg);
border:1px solid var(--vibeui-tabs-008-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-008-font);
}
[data-vibeui-block="tabs-008"] [data-part="row"]{
display:flex;align-items:flex-end;gap:0.25rem;
border-bottom:1px solid var(--vibeui-tabs-008-border);
}
[data-vibeui-block="tabs-008"] [data-part="list"]{display:flex;gap:0.25rem;min-width:0}
[data-vibeui-block="tabs-008"] [data-part="tab"]{
position:relative;appearance:none;border:0;background:none;cursor:pointer;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:-1px;
font:inherit;font-size:0.8125rem;font-weight:500;color:var(--vibeui-tabs-008-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:8rem;
}
[data-vibeui-block="tabs-008"] [data-part="tab"]:hover{color:var(--vibeui-tabs-008-fg)}
[data-vibeui-block="tabs-008"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-008-accent);outline-offset:-3px;border-radius:0.375rem}
[data-vibeui-block="tabs-008"] [data-part="tab"][aria-selected="true"]{color:var(--vibeui-tabs-008-fg);font-weight:650}
[data-vibeui-block="tabs-008"] [data-part="tab"][aria-selected="true"]::after{
content:"";position:absolute;left:0.375rem;right:0.375rem;bottom:0;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-tabs-008-accent);
}
[data-vibeui-block="tabs-008"] [data-part="slot"]{position:relative;margin-left:auto}
[data-vibeui-block="tabs-008"] [data-part="more"]{
appearance:none;border:0;background:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.4375rem 0.5rem;margin-bottom:0.125rem;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:var(--vibeui-tabs-008-muted);
}
[data-vibeui-block="tabs-008"] [data-part="more"]:hover{background:var(--vibeui-tabs-008-hover);color:var(--vibeui-tabs-008-fg)}
[data-vibeui-block="tabs-008"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-tabs-008-accent);outline-offset:-2px}
[data-vibeui-block="tabs-008"] [data-part="badge"]{
min-width:1.0625rem;padding:0 0.25rem;box-sizing:border-box;border-radius:999px;
background:var(--vibeui-tabs-008-hover);
font-size:0.6875rem;line-height:1.0625rem;text-align:center;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tabs-008"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.25rem);right:0;z-index:30;
min-width:10rem;margin:0;padding:0.25rem;box-sizing:border-box;list-style:none;
background:var(--vibeui-tabs-008-menu);
border:1px solid var(--vibeui-tabs-008-border);border-radius:0.625rem;
box-shadow:0 18px 36px -20px oklch(0.2 0 265 / 45%);
}
[data-vibeui-block="tabs-008"] [data-part="pick"]{
display:block;width:100%;padding:0.4375rem 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="tabs-008"] [data-part="pick"]:hover{background:var(--vibeui-tabs-008-hover)}
[data-vibeui-block="tabs-008"] [data-part="pick"]:focus-visible{outline:2px solid var(--vibeui-tabs-008-accent);outline-offset:-2px}
[data-vibeui-block="tabs-008"] [data-part="panel"]{
padding-top:0.875rem;font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-008-muted);
}
[data-vibeui-block="tabs-008"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-008-accent);outline-offset:3px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs008Item[] = [
  { id: "summary", label: "Сводка", content: "Ключевые цифры за период." },
  { id: "sources", label: "Источники", content: "Откуда приходят посетители." },
  { id: "pages", label: "Страницы", content: "Самые посещаемые адреса." },
  {
    id: "devices",
    label: "Устройства",
    content: "Доли телефонов и десктопов.",
  },
  { id: "geo", label: "География", content: "Города и страны посетителей." },
  { id: "funnels", label: "Воронки", content: "Шаги до целевого действия." },
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
 * Вкладки со свёрткой лишних в список «ещё».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs008({
  items = DEFAULT_ITEMS,
  visible = 3,
  defaultId,
  moreLabel = "Ещё",
  background = "",
  accent,
  listLabel = "Отчёты",
  menuLabel = "Скрытые вкладки",
  className,
  style,
  ...props
}: Tabs008Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const [promoted, setPromoted] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLButtonElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)

  // Список «ещё» перекрывает содержимое, поэтому обязан уходить по Escape и по
  // клику мимо. Фокус возвращается на кнопку: иначе после закрытия он остаётся
  // на исчезнувшем пункте и следующий Tab начинает обход с начала страницы.
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        moreRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!slotRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-tabs-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-008-bg": background,
          "--vibeui-tabs-008-menu": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Видимый ряд: первые visible вкладок, где последнее место отдано вкладке,
  // выбранной из списка «ещё». Так активная вкладка всегда на виду.
  const head = items.slice(0, visible)
  const shown = promoted
    ? [
        ...head.slice(0, visible - 1),
        items.find((item) => item.id === promoted) ?? head[visible - 1],
      ]
    : head
  const rest = items.filter((item) => !shown.includes(item))

  const index = Math.max(
    0,
    shown.findIndex((item) => item.id === active),
  )

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const last = shown.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowLeft"
            ? (index - 1 + shown.length) % shown.length
            : (index + 1) % shown.length

    setActive(shown[next].id)
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <>
      <style href="vibeui-tabs-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-008"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <div
            data-part="list"
            role="tablist"
            aria-label={listLabel}
            ref={listRef}
            onKeyDown={onKeyDown}
          >
            {shown.map((item) => (
              <button
                key={item.id}
                type="button"
                data-part="tab"
                role="tab"
                id={`vibeui-tabs-008-${item.id}-tab`}
                aria-selected={item.id === active}
                aria-controls="vibeui-tabs-008-panel"
                tabIndex={item.id === active ? 0 : -1}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {rest.length > 0 ? (
            <span data-part="slot" ref={slotRef}>
              <button
                type="button"
                data-part="more"
                ref={moreRef}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
              >
                {moreLabel}
                <span data-part="badge" aria-hidden="true">
                  {rest.length}
                </span>
              </button>
              {open ? (
                <ul data-part="menu" aria-label={menuLabel}>
                  {rest.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-part="pick"
                        onClick={() => {
                          setPromoted(item.id)
                          setActive(item.id)
                          setOpen(false)
                          moreRef.current?.focus()
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </span>
          ) : null}
        </div>
        {current ? (
          <div
            data-part="panel"
            role="tabpanel"
            id="vibeui-tabs-008-panel"
            aria-labelledby={`vibeui-tabs-008-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </div>
        ) : null}
      </div>
    </>
  )
}
