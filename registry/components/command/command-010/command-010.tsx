"use client"

import { useEffect, useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: string[]
  delay?: number
  placeholder?: string
  accent?: string
}

// Идея компонента: палитра, которая ищет на сервере. Между вводом и ответом
// проходит время, и подменять его пустым списком нельзя — «ничего не найдено»
// и «ещё не приехало» выглядят одинаково, но означают разное. Пока запрос в
// работе, показываются скелетоны той же высоты, что и строки, поэтому список
// не прыгает; полоса под полем и role=status озвучивают загрузку.
const STYLES = `
:where([data-vibeui-block="command-010"]){
--vibeui-command-010-bg:oklch(1 0 0);
--vibeui-command-010-fg:oklch(0.23 0.014 265);
--vibeui-command-010-muted:oklch(0.57 0.014 265);
--vibeui-command-010-border:oklch(0.9 0.006 265);
--vibeui-command-010-accent:oklch(0.58 0.16 200);
--vibeui-command-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-010"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-010-bg);color:var(--vibeui-command-010-fg);
border:1px solid var(--vibeui-command-010-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-010-font);
}
[data-vibeui-block="command-010"] [data-part="field"]{position:relative;border-bottom:1px solid var(--vibeui-command-010-border)}
[data-vibeui-block="command-010"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-010"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-010-accent)}
/* Полоса-бегунок под полем: она держит место и не двигает список. */
[data-vibeui-block="command-010"] [data-part="bar"]{
position:absolute;inset:auto 0 -1px;height:2px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-command-010-accent) 18%,transparent);
}
[data-vibeui-block="command-010"] [data-part="bar"]::after{
content:"";position:absolute;inset:0 auto 0 0;width:40%;
background:var(--vibeui-command-010-accent);
animation:vibeui-command-010-slide 1s linear infinite;
}
@keyframes vibeui-command-010-slide{
from{transform:translateX(-100%)}
to{transform:translateX(350%)}
}
[data-vibeui-block="command-010"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-010"] [data-part="row"],
[data-vibeui-block="command-010"] [data-part="ghost"]{
display:flex;align-items:center;gap:0.625rem;
min-height:2rem;padding:0.4375rem 0.5625rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="command-010"] [data-part="row"]{cursor:pointer}
[data-vibeui-block="command-010"] [data-part="row"]:hover,
[data-vibeui-block="command-010"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-010-accent) 14%,transparent);
}
/* Скелетон повторяет высоту строки: после ответа список не прыгает. */
[data-vibeui-block="command-010"] [data-part="ghost"] span{
display:block;height:0.6875rem;border-radius:0.375rem;
background:linear-gradient(90deg,oklch(0.55 0.02 265 / 10%),oklch(0.55 0.02 265 / 20%),oklch(0.55 0.02 265 / 10%));
background-size:200% 100%;
animation:vibeui-command-010-pulse 1.4s ease-in-out infinite;
}
@keyframes vibeui-command-010-pulse{
0%{background-position:100% 0}
100%{background-position:-100% 0}
}
[data-vibeui-block="command-010"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-010-muted);
}
[data-vibeui-block="command-010"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-010-border);
font-size:0.6875rem;color:var(--vibeui-command-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RESULTS = [
  "Открыть каталог компонентов",
  "Открыть реестр блоков",
  "Открыть журнал сборки",
  "Открыть настройки превью",
  "Открыть документацию по конвейеру",
]

const GHOSTS = [78, 62, 88, 54]

/**
 * Палитра с индикатором загрузки: скелетоны той же высоты, что и строки,
 * плюс полоса под полем. Один файл, ноль зависимостей.
 */
export function Command010({
  items = DEFAULT_RESULTS,
  delay = 600,
  placeholder = "Поиск на сервере…",
  accent,
  className,
  style,
  ...props
}: Command010Props) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  // Загрузка включается в обработчике ввода, а не в эффекте: эффект только
  // ждёт ответ. Смена запроса перезапускает таймер — так же ведёт себя
  // обычный debounce вокруг настоящего запроса.
  useEffect(() => {
    if (!loading) return

    const timer = window.setTimeout(() => setLoading(false), delay)

    return () => window.clearTimeout(timer)
  }, [query, delay, loading])

  const needle = query.trim().toLowerCase()
  const rows =
    needle.length === 0
      ? items
      : items.filter((result) => result.toLowerCase().includes(needle))
  const current = rows[Math.min(active, rows.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (loading || rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
      setLoading(false)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-010"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label="Поиск команд"
      >
        <div data-part="field">
          <input
            type="text"
            role="combobox"
            aria-expanded={!loading && rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-busy={loading}
            aria-activedescendant={
              !loading && current
                ? `${rowId}-${rows.indexOf(current)}`
                : undefined
            }
            aria-label={placeholder}
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
              setLoading(event.target.value.trim().length > 0)
            }}
            onKeyDown={onKeyDown}
          />
          {loading ? <span data-part="bar" aria-hidden="true" /> : null}
        </div>
        {loading ? (
          <ul data-part="list" aria-hidden="true">
            {GHOSTS.map((width) => (
              <li key={width} data-part="ghost">
                <span style={{ width: `${width}%` }} />
              </li>
            ))}
          </ul>
        ) : rows.length === 0 ? (
          <p data-part="empty">Ничего не найдено. Уточните запрос.</p>
        ) : (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label="Результаты"
          >
            {rows.map((result, index) => (
              <li
                key={result}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === result}
                onClick={() => setActive(index)}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
        <p data-part="foot" role="status">
          {loading ? "Ищем на сервере…" : `Результатов: ${rows.length}`}
        </p>
      </div>
    </>
  )
}
