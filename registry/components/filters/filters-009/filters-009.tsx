"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters009Option = {
  value: string
  count: number
}

export type Filters009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  options?: Filters009Option[]
  baseCount?: number
  onApply?: (values: string[]) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтры с кнопкой, а не мгновенные. Мгновенное применение
// хорошо на списке из ста строк и мучительно на тяжёлом отчёте: каждый щелчок
// уходит в запрос, а собрать отбор из четырёх условий — это четыре ожидания.
// Здесь щелчки меняют черновик, кнопка сообщает, сколько записей останется, и
// пока черновик отличается от применённого, панель честно говорит об этом.
const STYLES = `
:where([data-vibeui-block="filters-009"]){
--vibeui-filters-009-surface:transparent;
--vibeui-filters-009-box:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-filters-009-fill:light-dark(oklch(0.975 0.004 265),oklch(0.3 0.012 265));
--vibeui-filters-009-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-009-muted:color-mix(in oklab,var(--vibeui-filters-009-fg) 68%,transparent);
--vibeui-filters-009-border:light-dark(oklch(0.89 0.008 265),oklch(0.4 0.014 265));
--vibeui-filters-009-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-009-accent:light-dark(oklch(0.5 0.17 145),oklch(0.76 0.14 145));
--vibeui-filters-009-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 145));
--vibeui-filters-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-009"]{color-scheme:dark}
/* Подложки по умолчанию нет: панель ложится на фон страницы. */
[data-vibeui-block="filters-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-009-surface);
border:1px solid var(--vibeui-filters-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-009-font);color:var(--vibeui-filters-009-fg);
}
[data-vibeui-block="filters-009"] *{box-sizing:border-box}
[data-vibeui-block="filters-009"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-009"] ul{
display:flex;flex-direction:column;gap:0.0625rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="filters-009"] label{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.3125rem 0.375rem;border-radius:0.4375rem;font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="filters-009"] label:hover{background:var(--vibeui-filters-009-fill)}
[data-vibeui-block="filters-009"] input{
appearance:none;flex:none;margin:0;cursor:pointer;position:relative;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-filters-009-border);background:var(--vibeui-filters-009-box);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-009"] input:checked{
background:var(--vibeui-filters-009-accent);border-color:var(--vibeui-filters-009-accent);
}
[data-vibeui-block="filters-009"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid var(--vibeui-filters-009-on-accent);
border-bottom:2px solid var(--vibeui-filters-009-on-accent);
}
[data-vibeui-block="filters-009"] input:focus-visible{outline:2px solid var(--vibeui-filters-009-accent);outline-offset:2px}
[data-vibeui-block="filters-009"] [data-part="value"]{flex:1;min-width:0}
[data-vibeui-block="filters-009"] [data-part="count"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-filters-009-muted);
font-variant-numeric:tabular-nums;
}
/* Кнопка называет результат: «Применить» не говорит, во что это обойдётся. */
[data-vibeui-block="filters-009"] [data-part="apply"]{
appearance:none;cursor:pointer;width:100%;
height:2.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-filters-009-accent);color:var(--vibeui-filters-009-on-accent);
font:inherit;font-size:0.8125rem;font-weight:700;
font-variant-numeric:tabular-nums;
transition:opacity .16s ease;
}
[data-vibeui-block="filters-009"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-filters-009-accent);outline-offset:2px}
[data-vibeui-block="filters-009"] [data-part="apply"]:disabled{cursor:default;opacity:.4}
[data-vibeui-block="filters-009"] [data-part="state"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-filters-009-muted);
}
[data-vibeui-block="filters-009"][data-dirty="true"] [data-part="state"]{
color:var(--vibeui-filters-009-accent);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Filters009Option[] = [
  { value: "Оплачен", count: 184 },
  { value: "В сборке", count: 76 },
  { value: "Доставляется", count: 51 },
  { value: "Возврат", count: 12 },
]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  dirty: "Черновик изменён — отбор ещё не применён.",
  applied: "Применено условий: {count}",
  apply: "Показать {count}",
}

function label(
  labels: Record<string, string>,
  key: string,
  values?: Record<string, string>,
): string {
  const template = labels[key] ?? DEFAULT_LABELS[key] ?? ""

  if (!values) {
    return template
  }

  return template.replace(
    /\{(\w+)\}/g,
    (match, name: string) => values[name] ?? match,
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
 * Фильтры с отложенным применением: кнопка сообщает, сколько записей останется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters009({
  title = "Статус заказа",
  options = DEFAULT_OPTIONS,
  baseCount = 412,
  onApply,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters009Props) {
  const [draft, setDraft] = useState<string[]>([])
  const [applied, setApplied] = useState<string[]>([])

  const palette = {
    ...(accent ? { "--vibeui-filters-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Предсказанное число берётся из тех же счётчиков, что стоят у значений:
  // кнопка не имеет права обещать то, чего не видно в списке.
  const predicted = draft.length
    ? options
        .filter((option) => draft.includes(option.value))
        .reduce((sum, option) => sum + option.count, 0)
    : baseCount

  const dirty = draft.join("|") !== applied.join("|")

  const toggle = (value: string) =>
    setDraft((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )

  return (
    <>
      <style href="vibeui-filters-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-009"
        data-dirty={dirty ? "true" : undefined}
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <label>
                <input
                  type="checkbox"
                  checked={draft.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <span data-part="value">{option.value}</span>
                <span data-part="count">{option.count}</span>
              </label>
            </li>
          ))}
        </ul>
        <p data-part="state" role="status">
          {dirty
            ? label(labels, "dirty")
            : label(labels, "applied", { count: String(applied.length) })}
        </p>
        <button
          type="button"
          data-part="apply"
          disabled={!dirty}
          onClick={() => {
            setApplied(draft)
            onApply?.(draft)
          }}
        >
          {label(labels, "apply", { count: String(predicted) })}
        </button>
      </div>
    </>
  )
}
