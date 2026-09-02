"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Autocomplete013Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  /** Источник подсказок. Отказ отдаётся отклонённым промисом. */
  search?: (query: string) => Promise<string[]>
  defaultQuery?: string
  /** Начальное состояние.  открывает карточку на отказе. */
  defaultState?: "idle" | "failed"
  retryLabel?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказки, которые честно признаются, что не пришли.
// Сеть падает, и обычная реакция — пустой список: человек читает это как
// «ничего не найдено» и переписывает запрос, хотя запрос был верный. Здесь
// отказ занимает место списка, называет себя словом и даёт кнопку повтора,
// а сам запрос остаётся в поле. Кнопка возвращает фокус в поле: после
// удачного повтора продолжать набор надо там, а не на кнопке.
const STYLES = `
:where([data-vibeui-block="autocomplete-013"]){
--vibeui-autocomplete-013-bg:transparent;
--vibeui-autocomplete-013-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-013-muted:color-mix(in oklab,var(--vibeui-autocomplete-013-fg) 68%,transparent);
--vibeui-autocomplete-013-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-013-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-013-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-013-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-013-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-013-danger:light-dark(oklch(0.52 0.19 25),oklch(0.75 0.16 25));
--vibeui-autocomplete-013-radius:0.625rem;
--vibeui-autocomplete-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-013"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-013-bg);
border:1px solid var(--vibeui-autocomplete-013-border);
border-radius:calc(var(--vibeui-autocomplete-013-radius) + 0.25rem);
color:var(--vibeui-autocomplete-013-fg);
font-family:var(--vibeui-autocomplete-013-font);
}
[data-vibeui-block="autocomplete-013"] *{box-sizing:border-box}
[data-vibeui-block="autocomplete-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-013"] input{
width:100%;height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-autocomplete-013-border);
border-radius:var(--vibeui-autocomplete-013-radius);
background:var(--vibeui-autocomplete-013-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-013"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-013-accent);outline-offset:1px;
}
[data-vibeui-block="autocomplete-013"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;
max-height:9rem;overflow-y:auto;
scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-013-border) transparent;
border:1px solid var(--vibeui-autocomplete-013-border);
border-radius:var(--vibeui-autocomplete-013-radius);
background:var(--vibeui-autocomplete-013-panel);
}
[data-vibeui-block="autocomplete-013"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-013"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-013-active)}
[data-vibeui-block="autocomplete-013"] [data-part="option"] mark{background:transparent;color:var(--vibeui-autocomplete-013-accent);font-weight:650}
/* Отказ занимает место списка: пустое место читается как «ничего не найдено»,
   и человек начинает переписывать верный запрос. */
[data-vibeui-block="autocomplete-013"] [data-part="failure"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.625rem;
border:1px solid var(--vibeui-autocomplete-013-border);
border-radius:var(--vibeui-autocomplete-013-radius);
background:var(--vibeui-autocomplete-013-panel);
font-size:0.8125rem;color:var(--vibeui-autocomplete-013-danger);
}
[data-vibeui-block="autocomplete-013"] [data-part="retry"]{
flex:none;appearance:none;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-autocomplete-013-border);
background:transparent;color:var(--vibeui-autocomplete-013-fg);
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="autocomplete-013"] [data-part="retry"]:focus-visible{
outline:2px solid var(--vibeui-autocomplete-013-accent);outline-offset:2px;
}
[data-vibeui-block="autocomplete-013"] [data-part="status"]{
font-size:0.75rem;color:var(--vibeui-autocomplete-013-muted);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-013"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-013"] *{animation:none!important;transition:none!important}}
`

const CITIES = [
  "Казань",
  "Калуга",
  "Краснодар",
  "Красноярск",
  "Курск",
  "Кемерово",
]

const STATUS_TEXT: Record<string, string> = {
  idle: "Начните вводить название",
  loading: "Ищем…",
  empty: "Ничего не нашлось",
  failed: "Подсказки не загрузились",
}

/**
 * Демонстрационный источник: первый запрос всегда падает, повтор проходит.
 * В проекте сюда приходит настоящий запрос к серверу.
 */
function demoSearch(attempt: number) {
  return (query: string) =>
    new Promise<string[]>((resolve, reject) => {
      setTimeout(() => {
        if (attempt === 0) {
          reject(new Error("network"))
          return
        }

        const needle = query.trim().toLowerCase()
        resolve(
          needle
            ? CITIES.filter((city) => city.toLowerCase().includes(needle))
            : [],
        )
      }, 240)
    })
}

function highlight(option: string, query: string) {
  if (!query) return option

  const at = option.toLowerCase().indexOf(query.toLowerCase())

  if (at < 0) return option

  return (
    <>
      {option.slice(0, at)}
      <mark>{option.slice(at, at + query.length)}</mark>
      {option.slice(at + query.length)}
    </>
  )
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
 * Подсказки с сервера, которые честно сообщают об отказе и дают повтор.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete013({
  label = "Город доставки",
  placeholder = "Начните вводить",
  search,
  defaultQuery = "ка",
  defaultState = "idle",
  retryLabel = "Повторить",
  statusText = STATUS_TEXT,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete013Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  // При defaultState="failed" первая попытка считается уже израсходованной:
  // карточка открывается после неудачи, и повтор обязан пройти.
  const attempts = useRef(defaultState === "failed" ? 1 : 0)
  // Ответ на устаревший запрос приходит после нового: без счётчика он
  // перетирает свежий список.
  const request = useRef(0)
  const [query, setQuery] = useState(defaultQuery)
  const [items, setItems] = useState<string[]>([])
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">(
    defaultState,
  )

  const run = (value: string) => {
    const ticket = request.current + 1
    request.current = ticket
    setState("loading")

    const source = search ?? demoSearch(attempts.current)
    attempts.current += 1

    source(value)
      .then((result) => {
        if (request.current !== ticket) return
        setItems(result)
        setState("ready")
      })
      .catch(() => {
        if (request.current !== ticket) return
        setItems([])
        setState("failed")
      })
  }

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const status =
    state === "loading"
      ? (statusText.loading ?? STATUS_TEXT.loading)
      : state === "ready" && items.length === 0 && query.trim()
        ? (statusText.empty ?? STATUS_TEXT.empty)
        : (statusText.idle ?? STATUS_TEXT.idle)

  return (
    <>
      <style href="vibeui-autocomplete-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            const value = event.target.value
            setQuery(value)

            if (value.trim()) {
              run(value)
              return
            }

            setItems([])
            setState("idle")
          }}
        />

        {state === "failed" ? (
          // Отказ читается вслух сразу: role="alert" не ждёт следующего фокуса.
          <div data-part="failure" role="alert">
            <span>{statusText.failed ?? STATUS_TEXT.failed}</span>
            <button
              type="button"
              data-part="retry"
              onClick={() => {
                run(query)
                // Продолжать набор надо в поле, а не на кнопке.
                inputRef.current?.focus()
              }}
            >
              {retryLabel}
            </button>
          </div>
        ) : null}

        {items.length > 0 ? (
          <ul data-part="list" role="listbox" aria-label={label}>
            {items.map((item) => (
              <li
                key={item}
                role="option"
                aria-selected="false"
                data-part="option"
                onMouseDown={(event) => {
                  event.preventDefault()
                  setQuery(item)
                  setItems([])
                  onSelect?.(item)
                }}
              >
                {highlight(item, query.trim())}
              </li>
            ))}
          </ul>
        ) : null}

        {state === "failed" || items.length > 0 ? null : (
          <span data-part="status" role="status">
            {status}
          </span>
        )}
      </div>
    </>
  )
}
