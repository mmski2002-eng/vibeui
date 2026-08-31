"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox019Option = {
  name: string
  locked?: boolean
  reason?: string
}

export type Combobox019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: Combobox019Option[]
  defaultValue?: string
  requestLabel?: string
  onSelect?: (value: string) => void
  onRequest?: (value: string) => void
  accent?: string
}

// Идея компонента: вариант, на который нет прав, нельзя ни прятать, ни
// молча гасить. Спрятанный вариант заставляет человека искать несуществующее,
// а погашенный без объяснения — писать в поддержку. Поэтому строка остаётся
// в списке, рядом стоит причина и кнопка «Запросить доступ», а сам выбор
// заблокирован нативным disabled.
const STYLES = `
:where([data-vibeui-block="combobox-019"]){
--vibeui-combobox-019-bg:oklch(1 0 0);
--vibeui-combobox-019-fg:oklch(0.22 0.014 320);
--vibeui-combobox-019-muted:oklch(0.55 0.014 320);
--vibeui-combobox-019-faint:oklch(0.72 0.01 320);
--vibeui-combobox-019-border:oklch(0.9 0.008 320);
--vibeui-combobox-019-field:oklch(0.985 0.004 320);
--vibeui-combobox-019-soft:oklch(0.96 0.008 320);
--vibeui-combobox-019-accent:oklch(0.5 0.13 320);
--vibeui-combobox-019-accentsoft:oklch(0.94 0.04 320);
--vibeui-combobox-019-radius:0.625rem;
--vibeui-combobox-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-019"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-019-bg);
border:1px solid var(--vibeui-combobox-019-border);
border-radius:calc(var(--vibeui-combobox-019-radius) + 0.25rem);
color:var(--vibeui-combobox-019-fg);
font-family:var(--vibeui-combobox-019-font);
}
[data-vibeui-block="combobox-019"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-019"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-combobox-019-border);
border-radius:var(--vibeui-combobox-019-radius);
background:var(--vibeui-combobox-019-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-019"] input::placeholder{color:var(--vibeui-combobox-019-muted)}
[data-vibeui-block="combobox-019"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-019"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.15rem;
max-height:14rem;overflow:auto;
border:1px solid var(--vibeui-combobox-019-border);
border-radius:var(--vibeui-combobox-019-radius);
}
[data-vibeui-block="combobox-019"] [data-part="row"]{
display:flex;align-items:center;gap:0.3rem;
}
[data-vibeui-block="combobox-019"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;flex:1 1 auto;min-width:0;
display:flex;flex-direction:column;gap:0.1rem;
box-sizing:border-box;padding:0.35rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-019"] [data-part="option"]:hover:not(:disabled){background:var(--vibeui-combobox-019-soft)}
[data-vibeui-block="combobox-019"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-019"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-019-accentsoft);
}
[data-vibeui-block="combobox-019"] [data-part="option"]:disabled{cursor:not-allowed}
[data-vibeui-block="combobox-019"] [data-part="name"]{
display:flex;align-items:center;gap:0.3rem;
font-size:0.8125rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="option"]:disabled [data-part="name"]{color:var(--vibeui-combobox-019-faint)}
[data-vibeui-block="combobox-019"] [data-part="reason"]{
font-size:0.7rem;color:var(--vibeui-combobox-019-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="lock"]{flex:none;font-size:0.75rem}
[data-vibeui-block="combobox-019"] [data-part="ask"]{
appearance:none;cursor:pointer;font:inherit;flex:none;
padding:0.25rem 0.55rem;border-radius:999px;
border:1px solid var(--vibeui-combobox-019-border);
background:transparent;color:var(--vibeui-combobox-019-accent);
font-size:0.7rem;font-weight:700;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-019"] [data-part="ask"]:hover{background:var(--vibeui-combobox-019-accentsoft)}
[data-vibeui-block="combobox-019"] [data-part="ask"]:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:2px;
}
[data-vibeui-block="combobox-019"] [data-part="sent"]{
flex:none;font-size:0.7rem;font-weight:700;color:var(--vibeui-combobox-019-muted);white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="foot"]{
margin:0;font-size:0.78rem;color:var(--vibeui-combobox-019-muted);
}
[data-vibeui-block="combobox-019"] [data-part="foot"] b{color:var(--vibeui-combobox-019-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-019"] *{animation:none!important;transition:none!important}}
`

const SPACES: Combobox019Option[] = [
  { name: "Продуктовая аналитика" },
  { name: "Маркетинг" },
  {
    name: "Финансы и выручка",
    locked: true,
    reason: "нужен доступ финансового отдела",
  },
  { name: "Поддержка клиентов" },
  {
    name: "Персональные данные",
    locked: true,
    reason: "требуется согласование с безопасностью",
  },
  { name: "Логистика" },
]

/**
 * Выбор, где закрытые варианты видны, объяснены и допускают запрос доступа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox019({
  label = "Рабочее пространство",
  placeholder = "Найти пространство",
  options = SPACES,
  defaultValue = "Маркетинг",
  requestLabel = "Запросить",
  onSelect,
  onRequest,
  accent,
  className,
  style,
  ...props
}: Combobox019Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [asked, setAsked] = useState<string[]>([])

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) =>
      option.name.toLowerCase().includes(needle),
    )
  }, [query, options])

  const locked = matches.filter((option) => option.locked).length

  const palette = {
    ...(accent ? { "--vibeui-combobox-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-019"
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
            <li key={option.name} role="none">
              <span data-part="row" role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={option.name === value}
                  disabled={option.locked}
                  aria-label={
                    option.locked
                      ? `${option.name}: нет доступа, ${option.reason ?? ""}`
                      : option.name
                  }
                  onClick={() => {
                    setValue(option.name)
                    onSelect?.(option.name)
                  }}
                >
                  <span data-part="name">
                    {option.locked ? (
                      <span data-part="lock" aria-hidden="true">
                        🔒
                      </span>
                    ) : null}
                    {option.name}
                  </span>
                  {option.locked && option.reason ? (
                    <span data-part="reason">{option.reason}</span>
                  ) : null}
                </button>
                {option.locked ? (
                  asked.includes(option.name) ? (
                    <span data-part="sent">Запрошено</span>
                  ) : (
                    <button
                      type="button"
                      data-part="ask"
                      aria-label={`${requestLabel} доступ к «${option.name}»`}
                      onClick={() => {
                        setAsked([...asked, option.name])
                        onRequest?.(option.name)
                      }}
                    >
                      {requestLabel}
                    </button>
                  )
                ) : null}
              </span>
            </li>
          ))}
        </ul>
        <p data-part="foot" aria-live="polite">
          Выбрано: <b>{value || "ничего"}</b>
          {locked > 0 ? ` · закрыто вариантов: ${locked}` : ""}
        </p>
      </div>
    </>
  )
}
