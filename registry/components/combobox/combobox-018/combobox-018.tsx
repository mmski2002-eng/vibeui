"use client"

import { useEffect, useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  /** Остаток на складе по каждому варианту: проверка «спрашивает» его. */
  stock?: Record<string, number>
  delay?: number
  defaultValue?: string
  onSelect?: (value: string, available: boolean) => void
  accent?: string
}

// Идея компонента: вариант может быть в списке и всё равно не подойти —
// склад пуст, домен занят, лицензия кончилась. Поэтому выбор здесь не
// финал, а начало проверки: после нажатия строка статуса уходит в
// «проверяем», а потом отвечает числом или отказом. Пока идёт проверка,
// значение уже выбрано — форму не блокируем, но и «готово» не говорим.
const STYLES = `
:where([data-vibeui-block="combobox-018"]){
--vibeui-combobox-018-bg:oklch(1 0 0);
--vibeui-combobox-018-fg:oklch(0.22 0.014 240);
--vibeui-combobox-018-muted:oklch(0.55 0.014 240);
--vibeui-combobox-018-border:oklch(0.9 0.008 240);
--vibeui-combobox-018-field:oklch(0.985 0.004 240);
--vibeui-combobox-018-soft:oklch(0.96 0.008 240);
--vibeui-combobox-018-accent:oklch(0.5 0.13 240);
--vibeui-combobox-018-accentsoft:oklch(0.94 0.04 240);
--vibeui-combobox-018-ok:oklch(0.5 0.11 150);
--vibeui-combobox-018-bad:oklch(0.55 0.18 25);
--vibeui-combobox-018-radius:0.625rem;
--vibeui-combobox-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-018"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-018-bg);
border:1px solid var(--vibeui-combobox-018-border);
border-radius:calc(var(--vibeui-combobox-018-radius) + 0.25rem);
color:var(--vibeui-combobox-018-fg);
font-family:var(--vibeui-combobox-018-font);
}
[data-vibeui-block="combobox-018"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-018"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-combobox-018-border);
border-radius:var(--vibeui-combobox-018-radius);
background:var(--vibeui-combobox-018-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-018"] input::placeholder{color:var(--vibeui-combobox-018-muted)}
[data-vibeui-block="combobox-018"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-018-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-018"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12rem;overflow:auto;
border:1px solid var(--vibeui-combobox-018-border);
border-radius:var(--vibeui-combobox-018-radius);
}
[data-vibeui-block="combobox-018"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-018"] [data-part="option"]:hover{background:var(--vibeui-combobox-018-soft)}
[data-vibeui-block="combobox-018"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-018-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-018"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-018-accentsoft);font-weight:600;
}
[data-vibeui-block="combobox-018"] [data-part="status"]{
display:flex;align-items:center;gap:0.4rem;margin:0;min-height:1.4rem;
font-size:0.8rem;color:var(--vibeui-combobox-018-muted);
}
[data-vibeui-block="combobox-018"] [data-part="status"][data-state="ok"]{color:var(--vibeui-combobox-018-ok)}
[data-vibeui-block="combobox-018"] [data-part="status"][data-state="bad"]{color:var(--vibeui-combobox-018-bad)}
[data-vibeui-block="combobox-018"] [data-part="spin"]{
flex:none;width:0.85rem;height:0.85rem;border-radius:50%;
border:2px solid var(--vibeui-combobox-018-border);
border-top-color:var(--vibeui-combobox-018-accent);
animation:vibeui-combobox-018-spin .7s linear infinite;
}
[data-vibeui-block="combobox-018"] [data-part="dot"]{
flex:none;width:0.55rem;height:0.55rem;border-radius:50%;background:currentColor;
}
@keyframes vibeui-combobox-018-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-018"] *{animation:none!important;transition:none!important}}
`

const WAREHOUSES = [
  "Склад Москва · South Gate",
  "Склад Санкт-Петербург · Пулково",
  "Склад Казань · Технополис",
  "Склад Екатеринбург · Кольцово",
  "Склад Новосибирск · Толмачёво",
]

const STOCK: Record<string, number> = {
  "Склад Москва · South Gate": 42,
  "Склад Санкт-Петербург · Пулково": 7,
  "Склад Казань · Технополис": 0,
  "Склад Екатеринбург · Кольцово": 15,
  "Склад Новосибирск · Толмачёво": 0,
}

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
}

/**
 * Выбор с асинхронной проверкой значения после нажатия.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox018({
  label = "Склад отгрузки",
  placeholder = "Найти склад",
  options = WAREHOUSES,
  stock = STOCK,
  delay = 700,
  defaultValue = "Склад Казань · Технополис",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox018Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [checked, setChecked] = useState<{
    value: string
    status: "ok" | "bad"
  } | null>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

  // Проверка живёт в эффекте с очисткой: быстрый перебор вариантов не должен
  // оставлять хвост из старых ответов, побеждает последний выбор. В состоянии
  // лежит только ответ вместе со значением, для которого он получен, —
  // «проверяется» и «пусто» выводятся из пропсов, а не досылаются эффектом.
  useEffect(() => {
    if (!value) return

    const timer = setTimeout(() => {
      const left = stock[value] ?? 0

      setChecked({ value, status: left > 0 ? "ok" : "bad" })
      onSelect?.(value, left > 0)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, stock, onSelect])

  const state = !value
    ? "idle"
    : checked?.value === value
      ? checked.status
      : "checking"

  const left = stock[value] ?? 0

  const palette = {
    ...(accent ? { "--vibeui-combobox-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-018"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-status`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.map((option) => (
            <li key={option} role="none">
              <button
                type="button"
                role="option"
                data-part="option"
                aria-selected={option === value}
                onClick={() => setValue(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        <p
          id={`${id}-status`}
          data-part="status"
          data-state={state}
          aria-live="polite"
        >
          {state === "checking" ? (
            <>
              <span data-part="spin" aria-hidden="true" />
              Проверяем остаток на складе…
            </>
          ) : state === "ok" ? (
            <>
              <span data-part="dot" aria-hidden="true" />
              На складе {left} {pluralize(left, ["штука", "штуки", "штук"])}
            </>
          ) : state === "bad" ? (
            <>
              <span data-part="dot" aria-hidden="true" />
              Нет в наличии — выберите другой склад
            </>
          ) : (
            "Выберите склад, чтобы проверить остаток"
          )}
        </p>
      </div>
    </>
  )
}
