"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command011Props = Omit<ComponentProps<"div">, "children"> & {
  items?: string[]
  /** Источник результатов. Отказ отдаётся отклонённым промисом. */
  search?: (query: string) => Promise<string[]>
  defaultQuery?: string
  /** Начальное состояние. "failed" открывает карточку сразу на отказе —
   *  так витрина каталога показывает главную идею компонента без клика. */
  defaultState?: "idle" | "ready" | "failed"
  placeholder?: string
  label?: string
  listLabel?: string
  retryLabel?: string
  /** Ответ, когда запрос дал пустой результат. */
  emptyText?: string
  /** Строка подвала во время ожидания ответа. */
  loadingText?: string
  /** Сообщение об отказе рядом с кнопкой повтора. */
  failedText?: string
  onRun?: (value: string) => void
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: командная палитра, у которой сервер умеет отвечать не
// только пустым списком, но и отказом. Обычная реакция на сетевую ошибку —
// пустой список, и человек читает это как «команд не нашлось», хотя запрос
// был верный. Здесь отказ занимает место списка, называет себя словом через
// role="alert" и держит кнопку повтора рядом, а не отдельным экраном; сам
// запрос остаётся в поле. Пустая выборка после удачного ответа — отдельное
// состояние со своим текстом, чтобы «ничего не нашлось» не путалось с
// «сервер не ответил».
//
// Тема берётся из color-scheme окружения через light-dark(): у отказа свой
// оттенок опасности в каждой ветке, а не зеркальный.
const STYLES = `
:where([data-vibeui-block="command-011"]){
--vibeui-command-011-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-command-011-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-command-011-muted:color-mix(in oklab,var(--vibeui-command-011-fg) 68%,transparent);
--vibeui-command-011-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-command-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.76 0.14 265));
--vibeui-command-011-active:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.86 0.03 265 / 14%));
--vibeui-command-011-danger:light-dark(oklch(0.52 0.19 25),oklch(0.76 0.16 25));
--vibeui-command-011-danger-bg:color-mix(in oklab,var(--vibeui-command-011-danger) 12%,transparent);
--vibeui-command-011-shadow:light-dark(oklch(0.2 0.03 265 / 60%),oklch(0.04 0.015 265 / 70%));
--vibeui-command-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-011"]{color-scheme:dark}
[data-vibeui-block="command-011"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-011-bg);color:var(--vibeui-command-011-fg);
border:1px solid var(--vibeui-command-011-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-011-shadow);
font-family:var(--vibeui-command-011-font);
}
[data-vibeui-block="command-011"] *{box-sizing:border-box}
[data-vibeui-block="command-011"] [data-part="field"]{border-bottom:1px solid var(--vibeui-command-011-border)}
[data-vibeui-block="command-011"] input{
width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-011"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-011-accent)}
[data-vibeui-block="command-011"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:13rem;overflow-y:auto;
}
[data-vibeui-block="command-011"] [data-part="row"]{
display:flex;align-items:center;min-height:2rem;padding:0.4375rem 0.5625rem;
border-radius:0.5rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="command-011"] [data-part="row"]:hover,
[data-vibeui-block="command-011"] [data-part="row"][aria-selected="true"]{background:var(--vibeui-command-011-active)}
/* Отказ занимает место списка: пустое место читается как «ничего не нашлось»,
   и человек начинает переписывать верный запрос. */
[data-vibeui-block="command-011"] [data-part="failure"]{
display:flex;align-items:center;justify-content:space-between;gap:0.625rem;
margin:0.3125rem;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-command-011-danger-bg);color:var(--vibeui-command-011-danger);
font-size:0.8125rem;
}
[data-vibeui-block="command-011"] [data-part="retry"]{
flex:none;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.75rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-command-011-danger);
background:transparent;color:inherit;font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="command-011"] [data-part="retry"]:focus-visible{
outline:2px solid var(--vibeui-command-011-danger);outline-offset:2px;
}
[data-vibeui-block="command-011"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-011-muted);
}
[data-vibeui-block="command-011"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-011-border);
font-size:0.6875rem;color:var(--vibeui-command-011-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Открыть каталог компонентов",
  "Открыть реестр блоков",
  "Развернуть журнал сборки",
  "Открыть настройки превью",
  "Показать документацию по конвейеру",
]

/**
 * Демонстрационный источник: первый запрос по каждой строке падает,
 * повтор проходит. В проекте сюда приходит настоящий запрос к серверу.
 */
function demoSearch(items: string[], attempt: number) {
  return (query: string) =>
    new Promise<string[]>((resolve, reject) => {
      setTimeout(() => {
        if (attempt === 0) {
          reject(new Error("network"))
          return
        }

        const needle = query.trim().toLowerCase()
        resolve(items.filter((item) => item.toLowerCase().includes(needle)))
      }, 260)
    })
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
 * Командная палитра с честным отказом: сетевая ошибка называет себя словом
 * и держит кнопку повтора рядом со списком. Один файл, ноль зависимостей.
 */
export function Command011({
  items = DEFAULT_ITEMS,
  search,
  defaultQuery = "откр",
  defaultState = "failed",
  placeholder = "Команда или переход…",
  label = "Поиск команд",
  listLabel = "Результаты",
  retryLabel = "Повторить",
  emptyText = "Ничего не нашлось. Уточните запрос.",
  loadingText = "Ищем…",
  failedText = "Команды не загрузились",
  onRun,
  background = "",
  accent,
  className,
  style,
  ...props
}: Command011Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  // Ответ на устаревший запрос приходит после нового: без счётчика он
  // перетирает свежий список.
  const request = useRef(0)
  // Демо-источник помнит попытку по каждому запросу отдельно: повтор одной
  // строки не должен ронять уже удавшуюся другую. При defaultState="failed"
  // первая попытка по стартовому запросу считается уже израсходованной —
  // карточка открывается после неудачи, и повтор обязан пройти.
  const attempts = useRef<Record<string, number>>(
    defaultState === "failed" ? { [defaultQuery]: 1 } : {},
  )
  const [query, setQuery] = useState(defaultQuery)
  const [rows, setRows] = useState<string[]>(
    defaultState === "ready"
      ? items.filter((item) =>
          item.toLowerCase().includes(defaultQuery.trim().toLowerCase()),
        )
      : [],
  )
  const [active, setActive] = useState(0)
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">(
    defaultState,
  )
  const listId = useId()
  const rowId = useId()

  const run = (value: string) => {
    const ticket = request.current + 1
    request.current = ticket
    setState("loading")

    const attempt = attempts.current[value] ?? 0
    const source = search ?? demoSearch(items, attempt)
    attempts.current[value] = attempt + 1

    source(value)
      .then((result) => {
        if (request.current !== ticket) return
        setRows(result)
        setActive(0)
        setState("ready")
      })
      .catch(() => {
        if (request.current !== ticket) return
        setRows([])
        setState("failed")
      })
  }

  const current = rows[Math.min(active, rows.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (state !== "ready" || rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      if (state === "ready" && current) {
        onRun?.(current)
      }
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setRows([])
      setState("idle")
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="command"
        data-vibeui-block="command-011"
        className={className}
        style={palette}
        role="dialog"
        aria-label={label}
      >
        <div data-part="field">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={state === "ready" && rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-busy={state === "loading"}
            aria-activedescendant={
              state === "ready" && current
                ? `${rowId}-${rows.indexOf(current)}`
                : undefined
            }
            aria-label={placeholder}
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              const value = event.target.value
              setQuery(value)

              if (value.trim()) {
                run(value)
                return
              }

              setRows([])
              setState("idle")
            }}
            onKeyDown={onKeyDown}
          />
        </div>

        {state === "failed" ? (
          // Отказ читается вслух сразу: role="alert" не ждёт следующего фокуса.
          <div data-part="failure" role="alert">
            <span>{failedText}</span>
            <button
              type="button"
              data-part="retry"
              onClick={() => {
                run(query)
                inputRef.current?.focus()
              }}
            >
              {retryLabel}
            </button>
          </div>
        ) : null}

        {state === "ready" && rows.length === 0 ? (
          <p data-part="empty">{emptyText}</p>
        ) : null}

        {state === "ready" && rows.length > 0 ? (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label={listLabel}
          >
            {rows.map((row, index) => (
              <li
                key={row}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === row}
                onClick={() => {
                  setActive(index)
                  onRun?.(row)
                }}
              >
                {row}
              </li>
            ))}
          </ul>
        ) : null}

        <p data-part="foot" role="status">
          {state === "loading" ? loadingText : ""}
        </p>
      </div>
    </>
  )
}
