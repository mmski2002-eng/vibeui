"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox006Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultRecent?: string[]
  recentLabel?: string
  allLabel?: string
  /** Подпись кнопки, стирающей блок недавних. */
  clearLabel?: string
  /** Текст, когда фильтр не нашёл ни одной строки. */
  emptyLabel?: string
  recentLimit?: number
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: человек выбирает одно и то же. Последние выбранные
// поднимаются в отдельный блок сверху, а из общего списка при этом убираются,
// чтобы одна и та же строка не встречалась дважды и не ломала счёт стрелками.
const STYLES = `
:where([data-vibeui-block="combobox-006"]){
--vibeui-combobox-006-bg:transparent;
--vibeui-combobox-006-fg:light-dark(oklch(0.24 0.02 70),oklch(0.94 0.008 70));
--vibeui-combobox-006-muted:color-mix(in oklab,var(--vibeui-combobox-006-fg) 68%,transparent);
--vibeui-combobox-006-border:light-dark(oklch(0.9 0.012 70),oklch(0.38 0.016 70));
--vibeui-combobox-006-field:light-dark(oklch(0.985 0.006 70),oklch(0.3 0.014 70));
--vibeui-combobox-006-active:light-dark(oklch(0.95 0 0),oklch(0.37 0 0));
--vibeui-combobox-006-accent:light-dark(oklch(0.295 0 0),oklch(0.914 0 0));
--vibeui-combobox-006-radius:0.625rem;
--vibeui-combobox-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-006"]{color-scheme:dark}
[data-vibeui-block="combobox-006"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-006-bg);
border:1px solid var(--vibeui-combobox-006-border);
border-radius:calc(var(--vibeui-combobox-006-radius) + 0.25rem);
color:var(--vibeui-combobox-006-fg);
font-family:var(--vibeui-combobox-006-font);
}
[data-vibeui-block="combobox-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-006"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-006-border);
border-radius:var(--vibeui-combobox-006-radius);
background:var(--vibeui-combobox-006-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-006"] input::placeholder{color:var(--vibeui-combobox-006-muted)}
[data-vibeui-block="combobox-006"] input:focus-visible{outline:2px solid var(--vibeui-combobox-006-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-006"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-006-border);
border-radius:var(--vibeui-combobox-006-radius);
}
[data-vibeui-block="combobox-006"] [data-part="section"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.3rem 0.5rem 0.2rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-combobox-006-muted);
}
[data-vibeui-block="combobox-006"] [data-part="clear"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0.1rem 0.2rem;
border-radius:0.3rem;font:inherit;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;
color:var(--vibeui-combobox-006-accent);text-transform:none;
}
[data-vibeui-block="combobox-006"] [data-part="clear"]:hover{background:var(--vibeui-combobox-006-active)}
[data-vibeui-block="combobox-006"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-combobox-006-accent);outline-offset:1px}
[data-vibeui-block="combobox-006"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-006"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-006-active)}
[data-vibeui-block="combobox-006"] [data-part="clock"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.05rem;height:1.05rem;border-radius:999px;
border:1.5px solid var(--vibeui-combobox-006-accent);position:relative;
}
[data-vibeui-block="combobox-006"] [data-part="clock"]::before{
content:"";position:absolute;left:50%;top:50%;width:0.28rem;height:1.5px;
background:var(--vibeui-combobox-006-accent);transform-origin:left center;transform:translate(0,-50%);color:oklch(from var(--vibeui-combobox-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="combobox-006"] [data-part="clock"]::after{
content:"";position:absolute;left:50%;top:50%;width:1.5px;height:0.22rem;
background:var(--vibeui-combobox-006-accent);transform-origin:top center;transform:translate(-50%,-100%);color:oklch(from var(--vibeui-combobox-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="combobox-006"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-006-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-006"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-006"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Санкт-Петербург",
  "Москва",
  "Новосибирск",
  "Казань",
  "Екатеринбург",
  "Нижний Новгород",
  "Самара",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
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
 * Combobox с недавними значениями: последние выборы поднимаются наверх
 * отдельным блоком, который можно очистить.
 */
export function Combobox006({
  label = "Город доставки",
  placeholder = "Найти город",
  options = DEFAULT_OPTIONS,
  defaultRecent = ["Казань", "Москва"],
  recentLabel = "Недавние",
  allLabel = "Все города",
  clearLabel = "очистить",
  emptyLabel = "Ничего не нашлось",
  recentLimit = 3,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox006Props) {
  const id = useId()
  const [recent, setRecent] = useState(defaultRecent)
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const { recentRows, restRows, flat } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const match = (option: string) =>
      !needle || option.toLowerCase().includes(needle)
    const top = recent.filter(match)
    const rest = options.filter(
      (option) => match(option) && !recent.includes(option),
    )

    return { recentRows: top, restRows: rest, flat: [...top, ...rest] }
  }, [options, query, recent])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    setRecent((previous) =>
      [option, ...previous.filter((entry) => entry !== option)].slice(
        0,
        recentLimit,
      ),
    )
    onSelect?.(option)
  }

  const move = (delta: number) => {
    if (!flat.length) return
    const next = (active + delta + flat.length) % flat.length
    setActive(next)
    listRef.current
      ?.querySelectorAll('[role="option"]')
      [next]?.scrollIntoView({ block: "nearest" })
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
      if (flat[active]) commit(flat[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const renderOption = (option: string, index: number, isRecent: boolean) => (
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
      {isRecent ? <span data-part="clock" aria-hidden="true" /> : null}
      {option}
    </li>
  )

  return (
    <>
      <style href="vibeui-combobox-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-006"
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
            flat[active] ? `${id}-option-${active}` : undefined
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
          {recentRows.length ? (
            <li data-part="section" role="presentation">
              {recentLabel}
              <button
                type="button"
                data-part="clear"
                onClick={() => {
                  setRecent([])
                  setActive(0)
                }}
              >
                {clearLabel}
              </button>
            </li>
          ) : null}
          {recentRows.map((option, index) => renderOption(option, index, true))}
          {restRows.length ? (
            <li data-part="section" role="presentation">
              {allLabel}
            </li>
          ) : null}
          {restRows.map((option, index) =>
            renderOption(option, recentRows.length + index, false),
          )}
          {flat.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
