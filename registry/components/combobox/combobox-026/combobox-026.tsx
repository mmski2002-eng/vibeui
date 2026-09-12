"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox026Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  delay?: number
  minChars?: number
  emptyLabel?: string
  defaultValue?: string
  /** Подпись спиннера для скринридера. */
  loadingLabel?: string
  /** Подсказка при пустом поле. {count} — сколько символов нужно всего. */
  minCharsText?: string
  /** Подсказка при коротком запросе. {count} — сколько символов осталось. */
  remainingText?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: три честных состояния вместо одного «загрузка/готово».
// Пока запрос короче minChars, поиск даже не стартует — сеть не дёргается
// впустую. Как только длины хватает, включается настоящий debounce на
// таймере: спиннер живёт внутри поля, а не отдельным блоком, и результат
// не мигает при каждой нажатой букве.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее фона, а поле — темнее списка, это не инверсия светлой.
const STYLES = `
:where([data-vibeui-block="combobox-026"]){
--vibeui-combobox-026-bg:transparent;
--vibeui-combobox-026-fg:light-dark(oklch(0.22 0.02 355),oklch(0.94 0.01 355));
--vibeui-combobox-026-muted:color-mix(in oklab,var(--vibeui-combobox-026-fg) 68%,transparent);
--vibeui-combobox-026-border:light-dark(oklch(0.9 0.01 355),oklch(0.36 0.016 355));
--vibeui-combobox-026-field:light-dark(oklch(0.985 0.004 355),oklch(0.27 0.014 355));
--vibeui-combobox-026-active:light-dark(oklch(0.95 0 0),oklch(0.34 0 0));
--vibeui-combobox-026-accent:light-dark(oklch(0.28 0 0),oklch(0.905 0 0));
--vibeui-combobox-026-radius:0.625rem;
--vibeui-combobox-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-026"]{color-scheme:dark}
[data-vibeui-block="combobox-026"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-026-bg);
border:1px solid var(--vibeui-combobox-026-border);
border-radius:calc(var(--vibeui-combobox-026-radius) + 0.25rem);
color:var(--vibeui-combobox-026-fg);
font-family:var(--vibeui-combobox-026-font);
}
[data-vibeui-block="combobox-026"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-026"] [data-part="field"]{position:relative}
[data-vibeui-block="combobox-026"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 2rem 0 0.75rem;
border:1px solid var(--vibeui-combobox-026-border);
border-radius:var(--vibeui-combobox-026-radius);
background:var(--vibeui-combobox-026-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-026"] input::placeholder{color:var(--vibeui-combobox-026-muted)}
[data-vibeui-block="combobox-026"] input:focus-visible{outline:2px solid var(--vibeui-combobox-026-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-026"] [data-part="spinner"]{
position:absolute;right:0.65rem;top:50%;width:0.9rem;height:0.9rem;
margin-top:-0.45rem;border-radius:999px;
border:2px solid var(--vibeui-combobox-026-border);
border-top-color:var(--vibeui-combobox-026-accent);
animation:vibeui-combobox-026-spin .7s linear infinite;
}
@keyframes vibeui-combobox-026-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="combobox-026"] [data-part="note"]{margin:0;font-size:0.8125rem;color:var(--vibeui-combobox-026-muted)}
[data-vibeui-block="combobox-026"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:11rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-026-border);
border-radius:var(--vibeui-combobox-026-radius);
}
[data-vibeui-block="combobox-026"] [data-part="list"][hidden]{display:none}
[data-vibeui-block="combobox-026"] [data-part="list"][data-loading="true"]{opacity:0.5}
[data-vibeui-block="combobox-026"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-026"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-026-active)}
[data-vibeui-block="combobox-026"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-026-muted)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="combobox-026"] *{animation:none!important;transition:none!important}
[data-vibeui-block="combobox-026"] [data-part="spinner"]{border-top-color:var(--vibeui-combobox-026-border)}
}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-026"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Прага",
  "Прато",
  "Пусан",
  "Порту",
  "Претория",
  "Пномпень",
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Combobox с реальным debounce: короткий запрос не запускает поиск, долгий —
 * ждёт паузу в наборе, спиннер живёт внутри поля.
 */
export function Combobox026({
  label = "Город",
  placeholder = "Введите название",
  options = DEFAULT_OPTIONS,
  delay = 400,
  minChars = 2,
  emptyLabel = "Ничего не нашлось",
  defaultValue = "",
  loadingLabel = "Идёт поиск",
  minCharsText = "Введите минимум {count} символа для поиска",
  remainingText = "Ещё {count} симв. до начала поиска",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox026Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const needle = query.trim()
  const ready = needle.length >= minChars

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => setDebounced(needle), delay)
    return () => window.clearTimeout(timer)
  }, [needle, ready, delay])

  const loading = ready && debounced !== needle

  const matches = useMemo(() => {
    if (!ready || loading) return []
    const lower = debounced.toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(lower))
  }, [options, ready, loading, debounced])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    onSelect?.(option)
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
      setQuery("")
      setActive(0)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-026"
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
          <input
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={value || placeholder}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-busy={loading}
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
          {loading ? (
            <span data-part="spinner" role="status" aria-label={loadingLabel} />
          ) : null}
        </div>
        <p data-part="note" aria-live="polite" hidden={ready}>
          {needle.length === 0
            ? minCharsText.replace("{count}", String(minChars))
            : remainingText.replace(
                "{count}",
                String(minChars - needle.length),
              )}
        </p>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
          data-loading={loading}
          hidden={!open || !ready}
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
          {!loading && ready && matches.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
