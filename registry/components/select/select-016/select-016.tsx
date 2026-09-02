"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Select016Zone = {
  value: string
  label: string
  timeZone: string
}

export type Select016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  name?: string
  zones?: Select016Zone[]
  defaultValue?: string
  /** Локаль форматирования часов: компонент несёт русскую, проект ставит свою. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: часовой пояс сам по себе — абстракция, а текущее время
// рядом с названием города превращает выбор в проверяемый факт. Часы
// считаются от одного тика в секунду и форматируются Intl.DateTimeFormat
// с нужным timeZone — без даты рождения библиотек часовых поясов.
const STYLES = `
:where([data-vibeui-block="select-016"]){
--vibeui-select-016-surface:transparent;
--vibeui-select-016-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-016-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-016-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-select-016-border:light-dark(oklch(0.87 0.008 265),oklch(0.4 0.012 265));
--vibeui-select-016-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-016-tint:light-dark(oklch(0.55 0.19 262 / 12%),oklch(0.73 0.17 262 / 20%));
--vibeui-select-016-panel:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-select-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-select-016-mono:ui-monospace,"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
}
[data-vibeui-block="select-016"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-016-surface);
border:1px solid var(--vibeui-select-016-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-016-font);color:var(--vibeui-select-016-fg);
container-type:inline-size;
}
[data-vibeui-block="select-016"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-016"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-016"] [data-part="trigger"]{
display:flex;align-items:center;justify-content:space-between;gap:0.625rem;
box-sizing:border-box;width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-select-016-border);border-radius:0.625rem;
background:transparent;color:inherit;font:inherit;font-size:0.9375rem;font-weight:500;
text-align:left;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-016"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-016-accent)}
[data-vibeui-block="select-016"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-016-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-016-accent) 22%,transparent);
}
[data-vibeui-block="select-016"] [data-part="clock"]{
flex:none;font-family:var(--vibeui-select-016-mono);font-variant-numeric:tabular-nums;
font-size:0.8125rem;color:var(--vibeui-select-016-muted);
}
[data-vibeui-block="select-016"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-select-016-muted);
border-bottom:1.5px solid var(--vibeui-select-016-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-016"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:rotate(-135deg);
}
[data-vibeui-block="select-016"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
margin:0;padding:0.375rem;list-style:none;
max-height:16rem;overflow-y:auto;
background:var(--vibeui-select-016-panel);
border:1px solid var(--vibeui-select-016-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem oklch(0 0 0 / 16%);
}
[data-vibeui-block="select-016"] [data-part="option"]{
display:flex;align-items:center;justify-content:space-between;gap:0.625rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;cursor:pointer;
}
[data-vibeui-block="select-016"] [data-part="option"][data-active="true"]{
background:var(--vibeui-select-016-tint);
}
[data-vibeui-block="select-016"] [data-part="city"]{font-size:0.875rem;font-weight:500}
[data-vibeui-block="select-016"] [data-part="option"][aria-selected="true"] [data-part="city"]{
color:var(--vibeui-select-016-accent);
}
[data-vibeui-block="select-016"] [data-part="option"] [data-part="clock"]{font-size:0.8125rem}
@container (max-width: 14rem){
[data-vibeui-block="select-016"] [data-part="trigger"] [data-part="clock"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ZONES: Select016Zone[] = [
  { value: "moscow", label: "Москва", timeZone: "Europe/Moscow" },
  { value: "london", label: "Лондон", timeZone: "Europe/London" },
  { value: "newyork", label: "Нью-Йорк", timeZone: "America/New_York" },
  { value: "tokyo", label: "Токио", timeZone: "Asia/Tokyo" },
  { value: "sydney", label: "Сидней", timeZone: "Australia/Sydney" },
]

function formatTime(now: Date, timeZone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now)
  } catch {
    return "--:--"
  }
}

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
 * Select часового пояса: у каждого варианта — живое текущее время города,
 * тикающее раз в секунду. Один файл, ноль зависимостей, собственная
 * палитра.
 */
export function Select016({
  label = "Часовой пояс",
  name,
  zones = DEFAULT_ZONES,
  defaultValue = zones[0]?.value,
  locale = "ru-RU",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select016Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [value, setValue] = useState(defaultValue ?? DEFAULT_ZONES[0].value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      zones.findIndex((zone) => zone.value === value),
    ),
  )
  // Час на клиенте и на сервере расходится, поэтому первая отрисовка не
  // считает время вовсе — тик приходит из эффекта, уже после гидратации.
  const [now, setNow] = useState<Date | null>(null)

  const current = zones.find((zone) => zone.value === value) ?? zones[0]

  useEffect(() => {
    const tick = () => setNow(new Date())
    // Первый тик отложен в задачу, а не вызван синхронно в теле эффекта —
    // тот же приём, что и с интервалом ниже.
    const kick = window.setTimeout(tick, 0)
    const timer = window.setInterval(tick, 1000)
    return () => {
      window.clearTimeout(kick)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  useEffect(() => {
    if (open) {
      listRef.current?.focus()
    }
  }, [open])

  function choose(zone: Select016Zone) {
    setValue(zone.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, zones.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const zone = zones[activeIndex]
      if (zone) choose(zone)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-016-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-vibeui-block="select-016"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${fieldId}-label`}>
          {label}
        </span>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        <span data-part="field">
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            data-part="trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span>{current.label}</span>
            <span data-part="clock">
              {now ? formatTime(now, current.timeZone, locale) : "--:--"}
            </span>
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {open ? (
            <ul
              ref={listRef}
              data-part="panel"
              id={listId}
              role="listbox"
              aria-labelledby={`${fieldId}-label`}
              aria-activedescendant={`${listId}-${activeIndex}`}
              tabIndex={-1}
              onKeyDown={handleListKeyDown}
            >
              {zones.map((zone, index) => (
                <li
                  key={zone.value}
                  id={`${listId}-${index}`}
                  data-part="option"
                  data-active={index === activeIndex}
                  role="option"
                  aria-selected={zone.value === value}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    choose(zone)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span data-part="city">{zone.label}</span>
                  <span data-part="clock">
                    {now ? formatTime(now, zone.timeZone, locale) : "--:--"}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </div>
    </>
  )
}
