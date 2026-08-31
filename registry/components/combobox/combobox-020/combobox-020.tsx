"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox020Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  headChars?: number
  tailChars?: number
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: в узкой колонке — сайдбар, ячейка таблицы, боковая
// панель — длинные значения обрезаются, и обрезать их надо по-разному.
// В списке читают с начала, поэтому строки гаснут многоточием справа.
// А у выбранного значения важен хвост: имя файла, окончание пути, номер
// версии, — поэтому оно режется по середине и сохраняет оба конца.
const STYLES = `
:where([data-vibeui-block="combobox-020"]){
--vibeui-combobox-020-bg:oklch(1 0 0);
--vibeui-combobox-020-fg:oklch(0.22 0.014 175);
--vibeui-combobox-020-muted:oklch(0.55 0.014 175);
--vibeui-combobox-020-border:oklch(0.9 0.008 175);
--vibeui-combobox-020-field:oklch(0.985 0.004 175);
--vibeui-combobox-020-soft:oklch(0.96 0.008 175);
--vibeui-combobox-020-accent:oklch(0.47 0.1 175);
--vibeui-combobox-020-accentsoft:oklch(0.93 0.045 175);
--vibeui-combobox-020-radius:0.55rem;
--vibeui-combobox-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-combobox-020-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="combobox-020"]{
display:flex;flex-direction:column;gap:0.35rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-combobox-020-bg);
border:1px solid var(--vibeui-combobox-020-border);
border-radius:calc(var(--vibeui-combobox-020-radius) + 0.25rem);
color:var(--vibeui-combobox-020-fg);
font-family:var(--vibeui-combobox-020-font);
}
[data-vibeui-block="combobox-020"] label{font-size:0.75rem;font-weight:600}
[data-vibeui-block="combobox-020"] input{
box-sizing:border-box;width:100%;height:2.2rem;padding:0 0.5rem;
border:1px solid var(--vibeui-combobox-020-border);
border-radius:var(--vibeui-combobox-020-radius);
background:var(--vibeui-combobox-020-field);
color:inherit;font:inherit;font-size:0.8125rem;
text-overflow:ellipsis;
}
[data-vibeui-block="combobox-020"] input::placeholder{color:var(--vibeui-combobox-020-muted)}
[data-vibeui-block="combobox-020"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-020-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-020"] [data-part="value"]{
display:flex;align-items:center;gap:0.3rem;
box-sizing:border-box;width:100%;min-height:2rem;padding:0.3rem 0.5rem;
border-radius:var(--vibeui-combobox-020-radius);
background:var(--vibeui-combobox-020-accentsoft);
font-family:var(--vibeui-combobox-020-mono);font-size:0.75rem;
}
[data-vibeui-block="combobox-020"] [data-part="short"]{
min-width:0;white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="combobox-020"] [data-part="list"]{
margin:0;padding:0.15rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:11rem;overflow-y:auto;overflow-x:hidden;
border:1px solid var(--vibeui-combobox-020-border);
border-radius:var(--vibeui-combobox-020-radius);
}
[data-vibeui-block="combobox-020"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:block;box-sizing:border-box;padding:0.35rem 0.45rem;
border:0;border-radius:0.4rem;background:transparent;color:inherit;text-align:left;
font-family:var(--vibeui-combobox-020-mono);font-size:0.75rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-020"] [data-part="option"]:hover{background:var(--vibeui-combobox-020-soft)}
[data-vibeui-block="combobox-020"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-020-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-020"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-020-accent);color:var(--vibeui-combobox-020-bg);
}
[data-vibeui-block="combobox-020"] [data-part="full"]{
margin:0;font-size:0.68rem;line-height:1.35;color:var(--vibeui-combobox-020-muted);
overflow-wrap:anywhere;
}
[data-vibeui-block="combobox-020"] [data-part="empty"]{
margin:0;padding:0.5rem 0.45rem;font-size:0.75rem;color:var(--vibeui-combobox-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-020"] *{animation:none!important;transition:none!important}}
`

const BRANCHES = [
  "feature/checkout-address-validation",
  "feature/payment-provider-migration",
  "release/2026.04.1-hotfix-invoices",
  "bugfix/cart-total-rounding-error",
  "chore/update-typescript-and-eslint",
  "experiment/new-onboarding-funnel-v3",
]

/** Обрезка по середине: сохраняет начало и хвост, а не только начало. */
function shorten(text: string, head: number, tail: number) {
  if (text.length <= head + tail + 1) return text

  return `${text.slice(0, head)}…${tail > 0 ? text.slice(-tail) : ""}`
}

/**
 * Выбор в узкой колонке: список режется справа, значение — по середине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox020({
  label = "Ветка",
  placeholder = "Фильтр",
  options = BRANCHES,
  defaultValue = "release/2026.04.1-hotfix-invoices",
  headChars = 14,
  tailChars = 10,
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox020Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

  const palette = {
    ...(accent ? { "--vibeui-combobox-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-020"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <p data-part="value">
          <span data-part="short" title={value}>
            {value ? shorten(value, headChars, tailChars) : "не выбрана"}
          </span>
        </p>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">Нет совпадений</p>
            </li>
          ) : (
            matches.map((option) => (
              <li key={option} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={option === value}
                  aria-label={option}
                  title={option}
                  onClick={() => {
                    setValue(option)
                    onSelect?.(option)
                  }}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
        <p data-part="full" aria-live="polite">
          {value || "Ветка не выбрана"}
        </p>
      </div>
    </>
  )
}
