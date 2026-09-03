"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select031Option = {
  value: string
  label: string
}

export type Select031Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  options?: Select031Option[]
  defaultValue?: string
  storageKey?: string
  /** Метка чипа с прошлым выбором: компонент несёт русскую. */
  recentText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: последний выбор сохраняется в localStorage и при
// следующем визите предлагается чипом «Недавнее» рядом с полем — вместо
// того чтобы молча подставлять его как значение по умолчанию. Пользователь
// сам решает, повторить выбор или начать заново, а серверный рендер не
// зависит от localStorage и остаётся предсказуемым.
const STYLES = `
:where([data-vibeui-block="select-031"]){
--vibeui-select-031-surface:transparent;
--vibeui-select-031-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-031-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-select-031-muted:color-mix(in oklab,var(--vibeui-select-031-fg) 68%,transparent);
--vibeui-select-031-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-select-031-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-031-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-031-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.012 265));
--vibeui-select-031-tint:color-mix(in oklab,var(--vibeui-select-031-accent) 12%,transparent);
--vibeui-select-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-031"]{color-scheme:dark}
[data-vibeui-block="select-031"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-031-surface);
border:1px solid var(--vibeui-select-031-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-031-font);color:var(--vibeui-select-031-fg);
container-type:inline-size;
}
[data-vibeui-block="select-031"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-031"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-031"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-031-border);border-radius:0.625rem;
background:var(--vibeui-select-031-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-031"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-031-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-031-accent) 22%,transparent);
}
[data-vibeui-block="select-031"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-031-muted);
border-bottom:1.5px solid var(--vibeui-select-031-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-031"] [data-part="recent"]{
display:inline-flex;align-items:center;gap:0.375rem;align-self:flex-start;
padding:0.25rem 0.625rem 0.25rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-select-031-border);background:var(--vibeui-select-031-tint);
color:var(--vibeui-select-031-accent);font:inherit;font-size:0.75rem;font-weight:600;
cursor:pointer;transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-031"] [data-part="recent"]:focus-visible{
outline:none;border-color:var(--vibeui-select-031-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-031-accent) 22%,transparent);
}
[data-vibeui-block="select-031"] [data-part="recent-tag"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-select-031-accent);color:var(--vibeui-select-031-on-accent);
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="select-031"] [data-part="recent-label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Узкая колонка: чип занимает всю ширину, иначе длинное название варианта
   вылезает за подложку — обрезать его есть куда только на всю строку. */
@container (max-width: 15rem){
[data-vibeui-block="select-031"] select{padding:0 2rem 0 0.625rem}
[data-vibeui-block="select-031"] [data-part="arrow"]{right:0.75rem}
[data-vibeui-block="select-031"] [data-part="recent"]{align-self:stretch}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select031Option[] = [
  { value: "card", label: "Картой онлайн" },
  { value: "invoice", label: "По счёту" },
  { value: "cash", label: "Наличными курьеру" },
  { value: "crypto", label: "Криптовалютой" },
]

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
 * Select, который помнит последний выбор в localStorage и предлагает его
 * чипом «Недавнее» — применить можно одним кликом, а не заново листать
 * список. Один файл, ноль зависимостей, клиентский компонент.
 */
export function Select031({
  label = "Способ оплаты",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  storageKey = "vibeui-select-031-recent",
  recentText = "Недавнее",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select031Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "")
  const [recent, setRecent] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey)
        if (stored && options.some((option) => option.value === stored)) {
          setRecent(stored)
        }
      } catch {
        // localStorage недоступен (приватный режим, ограничения браузера) — просто не показываем чип
      }
    }, 0)
    return () => window.clearTimeout(timer)
  }, [storageKey, options])

  function commitValue(nextValue: string) {
    setValue(nextValue)
    try {
      window.localStorage.setItem(storageKey, nextValue)
    } catch {
      // сохранить не удалось — чип «Недавнее» просто не появится в следующий раз
    }
  }

  const recentOption = recent
    ? options.find((option) => option.value === recent)
    : undefined

  const palette = {
    ...(accent ? { "--vibeui-select-031-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-031-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-031" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-031"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={(event) => commitValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {recentOption && recentOption.value !== value ? (
          <button
            type="button"
            data-part="recent"
            onClick={() => commitValue(recentOption.value)}
          >
            <span data-part="recent-tag">{recentText}</span>
            <span data-part="recent-label">{recentOption.label}</span>
          </button>
        ) : null}
      </div>
    </>
  )
}
