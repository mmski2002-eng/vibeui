"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup026Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "onSubmit"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultHistory?: string[]
  maxHistory?: number
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  hint?: string
  /** Заголовок панели истории для скринридера. */
  panelLabel?: string
  /** Текст пустой истории. */
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const DEFAULT_HISTORY = ["кроссовки мужские", "куртка зимняя", "рюкзак"]

// Идея компонента: история запросов — не отдельная страница, а выпадающий
// список под тем же полем, куда попадает Enter. Список открывается по
// фокусу поля и закрывается по расфокусировке, но клик по пункту истории
// не должен «проиграть» события blur — поэтому выбор пункта происходит по
// onMouseDown с preventDefault: поле не теряет фокус раньше, чем значение
// подставится. Новый запрос уходит в начало списка, повтор не дублируется.
const STYLES = `
:where([data-vibeui-block="inputgroup-026"]){
--vibeui-inputgroup-026-surface:transparent;
--vibeui-inputgroup-026-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-inputgroup-026-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-inputgroup-026-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-026-muted:color-mix(in oklab,var(--vibeui-inputgroup-026-fg) 68%,transparent);
--vibeui-inputgroup-026-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-026-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-026-border:light-dark(oklch(0.86 0 265),oklch(0.42 0 265));
--vibeui-inputgroup-026-accent:light-dark(oklch(0.56 0.13 230),oklch(0.77 0.12 230));
--vibeui-inputgroup-026-hover:light-dark(oklch(0.95 0 230),oklch(0.32 0 230));
--vibeui-inputgroup-026-radius:0.75rem;
--vibeui-inputgroup-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-026"]{color-scheme:dark}
[data-vibeui-block="inputgroup-026"]{
position:relative;display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-026-surface);
border:1px solid var(--vibeui-inputgroup-026-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-026-font);color:var(--vibeui-inputgroup-026-fg);
}
[data-vibeui-block="inputgroup-026"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-026"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-026"] [data-part="field"]{position:relative}
[data-vibeui-block="inputgroup-026"] input{
width:100%;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-inputgroup-026-field);
border:1px solid var(--vibeui-inputgroup-026-border);border-radius:var(--vibeui-inputgroup-026-radius);
font:inherit;font-size:0.875rem;color:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Историю запросов сбрасывает наша панель — браузерный крестик у
   type="search" очистил бы только поле и сбил бы правый край сцепки. */
[data-vibeui-block="inputgroup-026"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="inputgroup-026"] input:focus{
outline:none;border-color:var(--vibeui-inputgroup-026-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-inputgroup-026-accent) 18%,transparent);
}
[data-vibeui-block="inputgroup-026"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:10;
margin:0;padding:0.375rem;list-style:none;
background:var(--vibeui-inputgroup-026-panel);
border:1px solid var(--vibeui-inputgroup-026-border);border-radius:0.625rem;
box-shadow:0 10px 24px -12px oklch(0.2 0 265 / 0.35);
}
[data-vibeui-block="inputgroup-026"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
padding:0.5rem 0.625rem;border-radius:0.5rem;border:0;background:none;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;cursor:pointer;
transition:background-color .12s ease;
}
[data-vibeui-block="inputgroup-026"] [data-part="item"]:hover,
[data-vibeui-block="inputgroup-026"] [data-part="item"]:focus-visible{
background:var(--vibeui-inputgroup-026-hover);outline:none;
}
[data-vibeui-block="inputgroup-026"] [data-part="item"] svg{
width:0.8125rem;height:0.8125rem;flex:none;color:var(--vibeui-inputgroup-026-muted);
}
[data-vibeui-block="inputgroup-026"] [data-part="empty"]{
margin:0;padding:0.5rem 0.625rem;font-size:0.8125rem;color:var(--vibeui-inputgroup-026-muted);
}
[data-vibeui-block="inputgroup-026"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-026-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-026"] *{transition:none!important}}
`

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
 * Сцепка «поле поиска + история запросов»: список под полем открывается по
 * фокусу, пункт подставляется по mousedown до потери фокуса, Enter уводит
 * текущий запрос в начало истории без дублей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup026({
  name = "search",
  label = "Поиск товаров",
  placeholder = "Что вы ищете?",
  defaultHistory = DEFAULT_HISTORY,
  maxHistory = 6,
  onChange,
  onSubmit,
  hint = "Enter сохраняет запрос в историю, клик по пункту истории подставляет его в поле.",
  panelLabel = "История запросов",
  emptyText = "История запросов пуста",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup026Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState("")
  const [history, setHistory] = useState(defaultHistory)
  const [open, setOpen] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-026-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pick = (value: string) => {
    setQuery(value)
    onChange?.(value)
    setOpen(false)
    field.current?.focus()
  }

  const submit = () => {
    const trimmed = query.trim()
    if (!trimmed) return
    setHistory((current) =>
      [trimmed, ...current.filter((item) => item !== trimmed)].slice(
        0,
        maxHistory,
      ),
    )
    onSubmit?.(trimmed)
    setOpen(false)
  }

  return (
    <>
      <style href="vibeui-inputgroup-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-026"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <input
            ref={field}
            id={id}
            name={name}
            type="search"
            placeholder={placeholder}
            autoComplete="off"
            value={query}
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            aria-describedby={`${id}-hint`}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onChange={(event) => {
              setQuery(event.target.value)
              onChange?.(event.target.value)
              setOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                submit()
              }
              if (event.key === "Escape") {
                setOpen(false)
              }
            }}
          />
          {open ? (
            <ul
              data-part="panel"
              id={`${id}-panel`}
              role="listbox"
              aria-label={panelLabel}
            >
              {history.length > 0 ? (
                history.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      data-part="item"
                      role="option"
                      aria-selected={item === query}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        pick(item)
                      }}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden="true"
                      >
                        <circle cx="8" cy="8" r="5.5" />
                        <path
                          d="M8 5.2V8l2 1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item}
                    </button>
                  </li>
                ))
              ) : (
                <li data-part="empty">{emptyText}</li>
              )}
            </ul>
          ) : null}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
