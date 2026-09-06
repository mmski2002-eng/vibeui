"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox009Status = "ok" | "warn" | "down"

export type Combobox009Item = {
  name: string
  status: Combobox009Status
  note: string
}

export type Combobox009Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  items?: Combobox009Item[]
  defaultValue?: string
  emptyLabel?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: статус у строки — не украшение, а запрет. Недоступные
// узлы помечены aria-disabled, стрелки через них перепрыгивают, Enter на них
// не срабатывает. Цвет точки дублируется подписью справа: по одному цвету
// состояние не читается ни в чёрно-белой печати, ни при дальтонизме.
const STYLES = `
:where([data-vibeui-block="combobox-009"]){
--vibeui-combobox-009-bg:transparent;
--vibeui-combobox-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-combobox-009-muted:color-mix(in oklab,var(--vibeui-combobox-009-fg) 68%,transparent);
--vibeui-combobox-009-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-combobox-009-field:light-dark(oklch(0.985 0 265),oklch(0.3 0 265));
--vibeui-combobox-009-active:light-dark(oklch(0.95 0 265),oklch(0.36 0 265));
--vibeui-combobox-009-accent:light-dark(oklch(0.52 0.15 39.8),oklch(0.76 0.14 39.8));
--vibeui-combobox-009-ok:light-dark(oklch(0.6 0.15 150),oklch(0.74 0.16 150));
--vibeui-combobox-009-warn:light-dark(oklch(0.72 0.15 80),oklch(0.82 0.15 80));
--vibeui-combobox-009-down:light-dark(oklch(0.6 0.19 25),oklch(0.7 0.19 25));
--vibeui-combobox-009-radius:0.625rem;
--vibeui-combobox-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-009"]{color-scheme:dark}
[data-vibeui-block="combobox-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-009-bg);
border:1px solid var(--vibeui-combobox-009-border);
border-radius:calc(var(--vibeui-combobox-009-radius) + 0.25rem);
color:var(--vibeui-combobox-009-fg);
font-family:var(--vibeui-combobox-009-font);
}
[data-vibeui-block="combobox-009"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-009"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-009-border);
border-radius:var(--vibeui-combobox-009-radius);
background:var(--vibeui-combobox-009-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-009"] input::placeholder{color:var(--vibeui-combobox-009-muted)}
[data-vibeui-block="combobox-009"] input:focus-visible{outline:2px solid var(--vibeui-combobox-009-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-009"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-009-border);
border-radius:var(--vibeui-combobox-009-radius);
}
[data-vibeui-block="combobox-009"] [data-part="option"]{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;
column-gap:0.55rem;padding:0.35rem 0.5rem;border-radius:0.45rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-009"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-009-active)}
[data-vibeui-block="combobox-009"] [data-part="option"][aria-disabled="true"]{cursor:not-allowed;color:var(--vibeui-combobox-009-muted)}
[data-vibeui-block="combobox-009"] [data-part="dot"]{
width:0.55rem;height:0.55rem;border-radius:999px;flex:none;
box-shadow:0 0 0 0.18rem color-mix(in oklch,currentColor 18%,transparent);
}
[data-vibeui-block="combobox-009"] [data-part="option"][data-status="ok"] [data-part="dot"]{background:var(--vibeui-combobox-009-ok);color:var(--vibeui-combobox-009-ok)}
[data-vibeui-block="combobox-009"] [data-part="option"][data-status="warn"] [data-part="dot"]{background:var(--vibeui-combobox-009-warn);color:var(--vibeui-combobox-009-warn)}
[data-vibeui-block="combobox-009"] [data-part="option"][data-status="down"] [data-part="dot"]{background:var(--vibeui-combobox-009-down);color:var(--vibeui-combobox-009-down)}
[data-vibeui-block="combobox-009"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="combobox-009"] [data-part="note"]{
font-size:0.72rem;font-weight:600;letter-spacing:0.01em;
color:var(--vibeui-combobox-009-muted);
}
[data-vibeui-block="combobox-009"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-009-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-009"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-009"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_ITEMS: Combobox009Item[] = [
  { name: "prod-eu-1", status: "ok", note: "работает" },
  { name: "prod-eu-2", status: "warn", note: "задержки" },
  { name: "prod-us-1", status: "ok", note: "работает" },
  { name: "staging-1", status: "down", note: "недоступен" },
  { name: "staging-2", status: "ok", note: "работает" },
  { name: "sandbox", status: "warn", note: "обновление" },
]

/**
 * Ветка темы для заданного фона: светлая плашка иначе досталась бы тексту
 * тёмной ветки, потому что light-dark() смотрит на color-scheme, а не на цвет.
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
 * Combobox со статусом у каждой строки: цветная точка и подпись, недоступные
 * узлы выключены и пропускаются клавиатурой.
 */
export function Combobox009({
  label = "Окружение",
  placeholder = "Найти узел",
  items = DEFAULT_ITEMS,
  defaultValue = "prod-eu-1",
  emptyLabel = "Ничего не нашлось",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox009Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => item.name.toLowerCase().includes(needle))
  }, [items, query])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (item: Combobox009Item) => {
    if (item.status === "down") return
    setValue(item.name)
    setQuery("")
    setActive(0)
    onSelect?.(item.name)
  }

  const move = (delta: number) => {
    if (!matches.length) return
    let next = active

    // Недоступные строки пропускаются, но не бесконечно: если доступных нет,
    // курсор остаётся на месте, а не зацикливается.
    for (let step = 0; step < matches.length; step += 1) {
      next = (next + delta + matches.length) % matches.length
      if (matches[next].status !== "down") break
    }

    setActive(next)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-009"
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          // Уход фокуса за пределы поля закрывает список; переход внутрь
          // (поле → кнопка очистки) оставляет его открытым. Нажатие по строке
          // списка фокус тоже уводит, но список должен дожить до выбора.
          if (pressingList.current) {
            return
          }

          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false)
          }
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
          }
        }}
        onPointerDownCapture={(event) => {
          // Гасить нажатие нельзя: часть строк выбирается на mousedown, и
          // preventDefault отменил бы сам выбор. Держим флаг и не закрываем
          // список, пока кнопка мыши не отпущена.
          if ((event.target as HTMLElement).closest('[role="listbox"]')) {
            pressingList.current = true
            return
          }

          setOpen(true)
        }}
        onPointerUpCapture={() => {
          pressingList.current = false
        }}
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={value || placeholder}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            matches[active] ? `${id}-option-${active}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          hidden={!open}
          aria-label={label}
          data-part="list"
        >
          {matches.map((item, index) => (
            <li
              key={item.name}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-status={item.status}
              data-active={index === active}
              aria-selected={item.name === value}
              aria-disabled={item.status === "down"}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(item)
              }}
            >
              <span data-part="dot" aria-hidden="true" />
              <span data-part="name">{item.name}</span>
              <span data-part="note">{item.note}</span>
            </li>
          ))}
          {matches.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
