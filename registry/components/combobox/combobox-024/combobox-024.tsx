"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox024Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultSelected?: string[]
  visibleChips?: number
  emptyLabel?: string
  onChange?: (values: string[]) => void
  /** Счётчик над полем; {count} — число выбранных. */
  counterText?: string
  /** Подпись крестика на фишке; {item} — название. */
  removeText?: string
  /** Надпись кнопки, сворачивающей развёрнутый ряд фишек. */
  collapseText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фишки не растягивают поле бесконечно. Показываются
// первые visibleChips штук, а остаток сворачивается в кнопку «+N», которая
// сама разворачивает и сворачивает полный ряд — без отдельного попапа
// и без потери доступа к уже выбранному.
const STYLES = `
:where([data-vibeui-block="combobox-024"]){
--vibeui-combobox-024-bg:transparent;
--vibeui-combobox-024-fg:light-dark(oklch(0.22 0.02 120),oklch(0.94 0.008 120));
--vibeui-combobox-024-muted:color-mix(in oklab,var(--vibeui-combobox-024-fg) 68%,transparent);
--vibeui-combobox-024-border:light-dark(oklch(0.9 0.01 120),oklch(0.35 0.014 120));
--vibeui-combobox-024-field:light-dark(oklch(0.985 0.004 120),oklch(0.27 0.012 120));
--vibeui-combobox-024-active:light-dark(oklch(0.95 0.035 39.8),oklch(0.33 0.04 39.8));
--vibeui-combobox-024-accent:light-dark(oklch(0.5 0.14 39.8),oklch(0.74 0.13 39.8));
--vibeui-combobox-024-chip:light-dark(oklch(0.95 0.045 39.8),oklch(0.34 0.05 39.8));
--vibeui-combobox-024-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.02 120));
--vibeui-combobox-024-radius:0.625rem;
--vibeui-combobox-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-024"]{color-scheme:dark}
[data-vibeui-block="combobox-024"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-024-bg);
border:1px solid var(--vibeui-combobox-024-border);
border-radius:calc(var(--vibeui-combobox-024-radius) + 0.25rem);
color:var(--vibeui-combobox-024-fg);
font-family:var(--vibeui-combobox-024-font);
}
[data-vibeui-block="combobox-024"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="combobox-024"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-024"] [data-part="counter"]{font-size:0.75rem;color:var(--vibeui-combobox-024-muted)}
[data-vibeui-block="combobox-024"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem;
box-sizing:border-box;width:100%;min-height:2.5rem;padding:0.3rem 0.45rem;
border:1px solid var(--vibeui-combobox-024-border);
border-radius:var(--vibeui-combobox-024-radius);
background:var(--vibeui-combobox-024-field);
}
[data-vibeui-block="combobox-024"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-combobox-024-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-024"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.6rem;padding:0 0.2rem 0 0.5rem;border-radius:999px;
background:var(--vibeui-combobox-024-chip);
font-size:0.78rem;font-weight:600;
}
[data-vibeui-block="combobox-024"] [data-part="chipclose"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.1rem;height:1.1rem;border-radius:999px;font-size:0.85rem;line-height:1;
}
[data-vibeui-block="combobox-024"] [data-part="chipclose"]:hover{background:var(--vibeui-combobox-024-field)}
[data-vibeui-block="combobox-024"] [data-part="chipclose"]:focus-visible{outline:2px solid var(--vibeui-combobox-024-accent);outline-offset:1px}
[data-vibeui-block="combobox-024"] [data-part="more"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;height:1.6rem;padding:0 0.6rem;border-radius:999px;
border:1px dashed var(--vibeui-combobox-024-border);background:transparent;color:var(--vibeui-combobox-024-accent);
font-size:0.78rem;font-weight:700;
}
[data-vibeui-block="combobox-024"] [data-part="more"]:hover{background:var(--vibeui-combobox-024-active)}
[data-vibeui-block="combobox-024"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-combobox-024-accent);outline-offset:1px}
[data-vibeui-block="combobox-024"] input{
flex:1 1 6rem;min-width:5rem;height:1.8rem;padding:0 0.25rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;outline:none;
}
[data-vibeui-block="combobox-024"] input::placeholder{color:var(--vibeui-combobox-024-muted)}
[data-vibeui-block="combobox-024"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-024-border);
border-radius:var(--vibeui-combobox-024-radius);
}
[data-vibeui-block="combobox-024"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-024"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-024-active)}
[data-vibeui-block="combobox-024"] [data-part="box"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;border-radius:0.3rem;font-size:0.7rem;line-height:1;
border:1.5px solid var(--vibeui-combobox-024-border);
}
[data-vibeui-block="combobox-024"] [data-part="option"][aria-selected="true"] [data-part="box"]{
background:var(--vibeui-combobox-024-accent);border-color:var(--vibeui-combobox-024-accent);color:var(--vibeui-combobox-024-onaccent);
}
[data-vibeui-block="combobox-024"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-024-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-024"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-024"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Аналитика",
  "Бэкенд",
  "Дизайн",
  "Документация",
  "Инфраструктура",
  "Маркетинг",
  "Мобильные",
  "Поддержка",
  "Продукт",
  "Фронтенд",
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
 * Combobox с множественным выбором и сворачиванием фишек: сверх лимита
 * выбранное прячется за кнопку «+N», которая разворачивает полный ряд.
 */
export function Combobox024({
  label = "Команды в рассылке",
  placeholder = "Добавить команду",
  options = DEFAULT_OPTIONS,
  defaultSelected = ["Дизайн", "Фронтенд", "Бэкенд", "Аналитика"],
  visibleChips = 3,
  emptyLabel = "Ничего не нашлось",
  onChange,
  counterText = "Выбрано: {count}",
  removeText = "Убрать {item}",
  collapseText = "Свернуть",
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox024Props) {
  const id = useId()
  const [selected, setSelected] = useState(defaultSelected)
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const overflow = Math.max(0, selected.length - visibleChips)
  const shownChips =
    expanded || overflow === 0 ? selected : selected.slice(0, visibleChips)

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      apply(selected.filter((entry) => entry !== option))
      return
    }
    apply([...selected, option])
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
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
      if (matches[active]) toggle(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
    } else if (event.key === "Backspace" && query === "" && selected.length) {
      apply(selected.slice(0, -1))
    }
  }

  return (
    <>
      <style href="vibeui-combobox-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-024"
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
        <div data-part="head">
          <label htmlFor={`${id}-input`}>{label}</label>
          <span data-part="counter" aria-live="polite">
            {counterText.replace("{count}", String(selected.length))}
          </span>
        </div>
        <div data-part="field">
          {shownChips.map((entry) => (
            <span key={entry} data-part="chip">
              {entry}
              <button
                type="button"
                data-part="chipclose"
                aria-label={removeText.replace("{item}", entry)}
                onClick={() => toggle(entry)}
              >
                ×
              </button>
            </span>
          ))}
          {!expanded && overflow > 0 ? (
            <button
              type="button"
              data-part="more"
              aria-expanded={expanded}
              onClick={() => setExpanded(true)}
            >
              +{overflow}
            </button>
          ) : null}
          {expanded && overflow > 0 ? (
            <button
              type="button"
              data-part="more"
              aria-expanded={expanded}
              onClick={() => setExpanded(false)}
            >
              {collapseText}
            </button>
          ) : null}
          <input
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={selected.length ? "" : placeholder}
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
        </div>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          hidden={!open}
          aria-multiselectable="true"
          aria-label={label}
          data-part="list"
        >
          {matches.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={selected.includes(option)}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                toggle(option)
              }}
            >
              <span data-part="box" aria-hidden="true">
                {selected.includes(option) ? "✓" : ""}
              </span>
              {option}
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
