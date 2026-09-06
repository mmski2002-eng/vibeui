"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox011Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  clearLabel?: string
  undoLabel?: string
  /** Строка под списком о снятом значении. {value} — снятое значение. */
  droppedText?: string
  /** Строка под списком о выбранном значении. {value} — выбранное. */
  selectedText?: string
  /** Строка под списком, пока фильтр пуст. */
  emptyText?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у фильтра обязан быть выход. Значение показано фишкой
// внутри поля, крестик снимает его и оставляет фокус в поле — так подряд
// меняют фильтр, не бегая мышью. Снятое значение не пропадает совсем:
// строка снизу предлагает вернуть его одним нажатием.
const STYLES = `
:where([data-vibeui-block="combobox-011"]){
--vibeui-combobox-011-bg:transparent;
--vibeui-combobox-011-panel:light-dark(oklch(1 0 0),oklch(0.26 0 215));
--vibeui-combobox-011-fg:light-dark(oklch(0.22 0 215),oklch(0.94 0 215));
--vibeui-combobox-011-muted:color-mix(in oklab,var(--vibeui-combobox-011-fg) 68%,transparent);
--vibeui-combobox-011-border:light-dark(oklch(0.9 0 215),oklch(0.37 0 215));
--vibeui-combobox-011-field:light-dark(oklch(0.985 0 215),oklch(0.3 0 215));
--vibeui-combobox-011-active:light-dark(oklch(0.95 0 215),oklch(0.37 0.04 215));
--vibeui-combobox-011-accent:light-dark(oklch(0.52 0.12 215),oklch(0.78 0.12 215));
--vibeui-combobox-011-radius:0.625rem;
--vibeui-combobox-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-011"]{color-scheme:dark}
[data-vibeui-block="combobox-011"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-011-bg);
border:1px solid var(--vibeui-combobox-011-border);
border-radius:calc(var(--vibeui-combobox-011-radius) + 0.25rem);
color:var(--vibeui-combobox-011-fg);
font-family:var(--vibeui-combobox-011-font);
}
[data-vibeui-block="combobox-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-011"] [data-part="field"]{
display:flex;align-items:center;gap:0.35rem;
box-sizing:border-box;width:100%;min-height:2.5rem;padding:0.25rem 0.45rem;
border:1px solid var(--vibeui-combobox-011-border);
border-radius:var(--vibeui-combobox-011-radius);
background:var(--vibeui-combobox-011-field);
}
[data-vibeui-block="combobox-011"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-011"] [data-part="value"]{
display:inline-flex;align-items:center;gap:0.3rem;flex:none;max-width:60%;
height:1.7rem;padding:0 0.25rem 0 0.55rem;border-radius:999px;
background:var(--vibeui-combobox-011-active);
font-size:0.8rem;font-weight:600;
}
[data-vibeui-block="combobox-011"] [data-part="valuetext"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="combobox-011"] [data-part="clear"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.2rem;height:1.2rem;border-radius:999px;font-size:0.9rem;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-011"] [data-part="clear"]:hover{background:var(--vibeui-combobox-011-panel)}
[data-vibeui-block="combobox-011"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:1px}
[data-vibeui-block="combobox-011"] input{
flex:1 1 5rem;min-width:4rem;height:1.9rem;padding:0 0.25rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;outline:none;
}
[data-vibeui-block="combobox-011"] input::placeholder{color:var(--vibeui-combobox-011-muted)}
[data-vibeui-block="combobox-011"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:9.5rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-011-border);
border-radius:var(--vibeui-combobox-011-radius);
}
[data-vibeui-block="combobox-011"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-011"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-011-active)}
[data-vibeui-block="combobox-011"] [data-part="option"][aria-selected="true"]{font-weight:650;color:var(--vibeui-combobox-011-accent)}
[data-vibeui-block="combobox-011"] [data-part="foot"]{
display:flex;align-items:center;gap:0.4rem;min-height:1.2rem;
font-size:0.75rem;color:var(--vibeui-combobox-011-muted);
}
[data-vibeui-block="combobox-011"] [data-part="undo"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
font:inherit;font-size:0.75rem;font-weight:700;
color:var(--vibeui-combobox-011-accent);text-decoration:underline;
}
[data-vibeui-block="combobox-011"] [data-part="undo"]:focus-visible{outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:2px;border-radius:0.2rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-011"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-011"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Все проекты",
  "Витрина",
  "Личный кабинет",
  "Мобильное приложение",
  "Панель оператора",
  "Складской учёт",
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
 * Combobox с очисткой значения: фишка с крестиком снимает выбор, фокус
 * остаётся в поле, а снятое значение можно вернуть.
 */
export function Combobox011({
  label = "Проект",
  placeholder = "Найти проект",
  options = DEFAULT_OPTIONS,
  defaultValue = "Личный кабинет",
  clearLabel = "Очистить выбор",
  undoLabel = "вернуть",
  droppedText = "Снято: {value}",
  selectedText = "Выбрано: {value}",
  emptyText = "Фильтр не задан",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [dropped, setDropped] = useState("")
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setDropped("")
    setQuery("")
    setActive(0)
    onSelect?.(option)
  }

  const clear = () => {
    if (!value) return
    setDropped(value)
    setValue("")
    setQuery("")
    onSelect?.("")
    inputRef.current?.focus()
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
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      if (query) setQuery("")
      else clear()
    } else if (event.key === "Backspace" && query === "" && value) {
      event.preventDefault()
      clear()
    }
  }

  return (
    <>
      <style href="vibeui-combobox-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-011"
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
        <div data-part="field">
          {value ? (
            <span data-part="value">
              <span data-part="valuetext">{value}</span>
              <button
                type="button"
                data-part="clear"
                aria-label={`${clearLabel}: ${value}`}
                onClick={clear}
              >
                ×
              </button>
            </span>
          ) : null}
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={value ? "" : placeholder}
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
              aria-selected={option === value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(option)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
        <p data-part="foot" aria-live="polite">
          {dropped ? (
            <>
              <span>{droppedText.replace("{value}", dropped)}</span>
              <button
                type="button"
                data-part="undo"
                onClick={() => commit(dropped)}
              >
                {undoLabel}
              </button>
            </>
          ) : (
            <span>
              {value ? selectedText.replace("{value}", value) : emptyText}
            </span>
          )}
        </p>
      </div>
    </>
  )
}
