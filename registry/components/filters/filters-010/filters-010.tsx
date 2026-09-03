"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters010Group = {
  title: string
  options: string[]
}

export type Filters010Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  groups?: Filters010Group[]
  defaultSelected?: string[]
  resetLabel?: string
  onChange?: (selected: string[]) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фишка — не подпись уже применённого условия, а сам
// переключатель. Нажатие включает и выключает значение на месте, без
// отдельной панели с чекбоксами; aria-pressed объявляет состояние, а не
// только цвет. Счётчик выбранного стоит в role="status", а «сбросить всё»
// появляется сразу от одной фишки — тут это единственный способ снять выбор.
const STYLES = `
:where([data-vibeui-block="filters-010"]){
--vibeui-filters-010-surface:transparent;
--vibeui-filters-010-fill:light-dark(oklch(0.975 0.004 265),oklch(0.29 0.012 265));
--vibeui-filters-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-010-muted:color-mix(in oklab,var(--vibeui-filters-010-fg) 68%,transparent);
--vibeui-filters-010-border:light-dark(oklch(0.89 0.008 265),oklch(0.4 0.014 265));
--vibeui-filters-010-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-010-accent:light-dark(oklch(0.55 0.17 300),oklch(0.76 0.14 300));
--vibeui-filters-010-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 300));
--vibeui-filters-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-010"]{color-scheme:dark}
/* Подложки по умолчанию нет: панель ложится на фон страницы. */
[data-vibeui-block="filters-010"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-010-surface);
border:1px solid var(--vibeui-filters-010-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-010-font);color:var(--vibeui-filters-010-fg);
}
[data-vibeui-block="filters-010"] *{box-sizing:border-box}
[data-vibeui-block="filters-010"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="filters-010"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-010"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-filters-010-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-010"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="filters-010"] [data-part="group"] span{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-filters-010-muted);
text-transform:uppercase;letter-spacing:0.03em;
}
[data-vibeui-block="filters-010"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
/* Сама фишка — переключатель: нажатие включает и выключает значение. */
[data-vibeui-block="filters-010"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-filters-010-border);
background:var(--vibeui-filters-010-fill);color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="filters-010"] [data-part="chip"]:hover{border-color:var(--vibeui-filters-010-accent)}
[data-vibeui-block="filters-010"] [data-part="chip"]:focus-visible{
outline:2px solid var(--vibeui-filters-010-accent);outline-offset:2px;
}
[data-vibeui-block="filters-010"] [data-part="chip"][aria-pressed="true"]{
border-color:var(--vibeui-filters-010-accent);color:var(--vibeui-filters-010-on-accent);
background:var(--vibeui-filters-010-accent);
}
[data-vibeui-block="filters-010"] [data-part="reset"]{
appearance:none;cursor:pointer;align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px dashed var(--vibeui-filters-010-border);
background:none;color:var(--vibeui-filters-010-accent);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-010"] [data-part="reset"]:hover{border-style:solid;border-color:var(--vibeui-filters-010-accent)}
[data-vibeui-block="filters-010"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-filters-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Filters010Group[] = [
  {
    title: "Категория",
    options: ["Формы", "Таблицы", "Навигация", "Карточки"],
  },
  { title: "Лицензия", options: ["MIT", "Коммерческая"] },
]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  empty: "Ничего не выбрано",
  selected: "Выбрано: {count}",
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
 * Панель фильтров-переключателей: сама фишка включает и выключает значение,
 * без отдельного списка чекбоксов. Один файл, ноль зависимостей, своя палитра.
 */
export function Filters010({
  title = "Фильтры",
  groups = DEFAULT_GROUPS,
  defaultSelected = [],
  resetLabel = "Сбросить всё",
  onChange,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters010Props) {
  const [selected, setSelected] = useState(defaultSelected)

  const palette = {
    ...(accent ? { "--vibeui-filters-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const toggle = (value: string) => {
    apply(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  return (
    <>
      <style href="vibeui-filters-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-010"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{title}</h3>
          <p data-part="count" role="status">
            {selected.length === 0
              ? label(labels, "empty")
              : label(labels, "selected", { count: String(selected.length) })}
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title} data-part="group">
            <span>{group.title}</span>
            <div data-part="chips">
              {group.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  data-part="chip"
                  aria-pressed={selected.includes(option)}
                  onClick={() => toggle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        {selected.length > 0 ? (
          <button type="button" data-part="reset" onClick={() => apply([])}>
            {resetLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
