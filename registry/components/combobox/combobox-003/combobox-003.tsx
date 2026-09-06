"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox003Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultSelected?: string[]
  emptyLabel?: string
  maxSelected?: number
  /** Счётчик выбранного. {count} — сколько отмечено, {max} — предел. */
  counterText?: string
  /** Подпись крестика на фишке. {option} — название фишки. */
  removeLabel?: string
  onChange?: (values: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор из закрытого списка. В отличие от
// тег-пикера выбранное НЕ исчезает из списка — оно остаётся с галочкой и
// aria-selected="true", потому что человек должен видеть, что уже отмечено,
// и снимать выбор там же, где ставил.
const STYLES = `
:where([data-vibeui-block="combobox-003"]){
--vibeui-combobox-003-bg:transparent;
--vibeui-combobox-003-panel:light-dark(oklch(1 0 0),oklch(0.27 0 300));
--vibeui-combobox-003-fg:light-dark(oklch(0.22 0 300),oklch(0.94 0 300));
--vibeui-combobox-003-muted:color-mix(in oklab,var(--vibeui-combobox-003-fg) 68%,transparent);
--vibeui-combobox-003-border:light-dark(oklch(0.9 0 300),oklch(0.38 0 300));
--vibeui-combobox-003-field:light-dark(oklch(0.985 0 300),oklch(0.3 0 300));
--vibeui-combobox-003-active:light-dark(oklch(0.95 0 300),oklch(0.36 0.04 300));
--vibeui-combobox-003-accent:light-dark(oklch(0.53 0.19 300),oklch(0.75 0.16 300));
--vibeui-combobox-003-onaccent:light-dark(oklch(1 0 0),oklch(0.2 0 300));
--vibeui-combobox-003-chip:light-dark(oklch(0.95 0.04 300),oklch(0.37 0.05 300));
--vibeui-combobox-003-radius:0.625rem;
--vibeui-combobox-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-003"]{color-scheme:dark}
[data-vibeui-block="combobox-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-003-bg);
border:1px solid var(--vibeui-combobox-003-border);
border-radius:calc(var(--vibeui-combobox-003-radius) + 0.25rem);
color:var(--vibeui-combobox-003-fg);
font-family:var(--vibeui-combobox-003-font);
}
[data-vibeui-block="combobox-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="combobox-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-003"] [data-part="counter"]{font-size:0.75rem;color:var(--vibeui-combobox-003-muted)}
[data-vibeui-block="combobox-003"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem;
box-sizing:border-box;width:100%;min-height:2.5rem;padding:0.3rem 0.45rem;
border:1px solid var(--vibeui-combobox-003-border);
border-radius:var(--vibeui-combobox-003-radius);
background:var(--vibeui-combobox-003-field);
}
[data-vibeui-block="combobox-003"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-combobox-003-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.6rem;padding:0 0.2rem 0 0.5rem;border-radius:999px;
background:var(--vibeui-combobox-003-chip);
font-size:0.78rem;font-weight:600;
}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.1rem;height:1.1rem;border-radius:999px;font-size:0.85rem;line-height:1;
}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]:hover{background:var(--vibeui-combobox-003-panel)}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]:focus-visible{outline:2px solid var(--vibeui-combobox-003-accent);outline-offset:1px}
[data-vibeui-block="combobox-003"] input{
flex:1 1 6rem;min-width:5rem;height:1.8rem;padding:0 0.25rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;outline:none;
}
[data-vibeui-block="combobox-003"] input::placeholder{color:var(--vibeui-combobox-003-muted)}
[data-vibeui-block="combobox-003"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-003-border);
border-radius:var(--vibeui-combobox-003-radius);
}
[data-vibeui-block="combobox-003"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-003"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-003-active)}
[data-vibeui-block="combobox-003"] [data-part="box"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;border-radius:0.3rem;font-size:0.7rem;line-height:1;
border:1.5px solid var(--vibeui-combobox-003-border);
}
[data-vibeui-block="combobox-003"] [data-part="option"][aria-selected="true"] [data-part="box"]{
background:var(--vibeui-combobox-003-accent);border-color:var(--vibeui-combobox-003-accent);color:var(--vibeui-combobox-003-onaccent);
}
[data-vibeui-block="combobox-003"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-003"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-003"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Аналитика",
  "Бэкенд",
  "Дизайн",
  "Документация",
  "Инфраструктура",
  "Мобильные",
  "Поддержка",
  "Фронтенд",
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
 * Combobox с множественным выбором фишками: выбранное остаётся в списке
 * с отметкой, Backspace в пустом поле снимает последнюю фишку.
 */
export function Combobox003({
  label = "Команды",
  placeholder = "Добавить команду",
  options = DEFAULT_OPTIONS,
  defaultSelected = ["Дизайн", "Фронтенд"],
  emptyLabel = "Ничего не нашлось",
  maxSelected = 5,
  counterText = "{count} из {max}",
  removeLabel = "Убрать {option}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox003Props) {
  const id = useId()
  const [selected, setSelected] = useState(defaultSelected)
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
    ...(accent ? { "--vibeui-combobox-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      apply(selected.filter((entry) => entry !== option))
      return
    }
    if (selected.length >= maxSelected) return
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
      <style href="vibeui-combobox-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-003"
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
            {counterText
              .replace("{count}", String(selected.length))
              .replace("{max}", String(maxSelected))}
          </span>
        </div>
        <div data-part="field">
          {selected.map((entry) => (
            <span key={entry} data-part="chip">
              {entry}
              <button
                type="button"
                data-part="chipclose"
                aria-label={removeLabel.replace("{option}", entry)}
                onClick={() => toggle(entry)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={selected.length >= maxSelected ? "" : placeholder}
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
