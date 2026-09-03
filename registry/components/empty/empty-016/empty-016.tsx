"use client"

import { useState, type CSSProperties } from "react"

export type Empty016Filter = {
  id: string
  label: string
}

export type Empty016Props = {
  title?: string
  text?: string
  filters?: Empty016Filter[]
  total?: number
  resetLabel?: string
  emptyLabel?: string
  /** Хвост объяснения: {total} подставляется числом записей без фильтров. */
  countText?: string
  /** Подпись кнопки снятия для скринридера: {label} — название условия. */
  removeLabel?: string
  /** Локаль форматирования числа записей. */
  locale?: string
  onRemoveFilter?: (id: string) => void
  onReset?: () => void
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: список опустел из-за нескольких условий сразу, и не
// всегда виноваты они все. Каждое условие можно снять по отдельности прямо
// на чипе — так человек нащупывает, какое именно мешает, — а сброс всех
// остаётся рядом как быстрый путь, когда разбираться не хочется.
const STYLES = `
:where([data-vibeui-block="empty-016"]){
--vibeui-empty-016-bg:transparent;
--vibeui-empty-016-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-empty-016-muted:color-mix(in oklab,var(--vibeui-empty-016-fg) 68%,transparent);
--vibeui-empty-016-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-empty-016-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-empty-016-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.02 265));
--vibeui-empty-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-016"]{color-scheme:dark}
[data-vibeui-block="empty-016"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-016-bg);
border:1px solid var(--vibeui-empty-016-border);border-radius:1rem;
font-family:var(--vibeui-empty-016-font);color:var(--vibeui-empty-016-fg);
}
[data-vibeui-block="empty-016"] [data-part="mark"]{
width:2.25rem;height:2.25rem;color:var(--vibeui-empty-016-accent);
}
[data-vibeui-block="empty-016"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-016"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-016-muted);
}
[data-vibeui-block="empty-016"] [data-part="chips"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;margin:0.125rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="empty-016"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.375rem 0.25rem 0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-016-accent) 10%,transparent);
color:var(--vibeui-empty-016-fg);font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-016"] [data-part="remove"]{
appearance:none;border:0;cursor:pointer;flex:none;
width:1.125rem;height:1.125rem;padding:0;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-empty-016-accent) 20%,transparent);
color:var(--vibeui-empty-016-accent);
}
[data-vibeui-block="empty-016"] [data-part="remove"] svg{width:0.625rem;height:0.625rem}
[data-vibeui-block="empty-016"] [data-part="remove"]:hover{
background:color-mix(in oklab,var(--vibeui-empty-016-accent) 32%,transparent);
}
[data-vibeui-block="empty-016"] [data-part="remove"]:focus-visible{
outline:2px solid var(--vibeui-empty-016-accent);outline-offset:2px;
}
[data-vibeui-block="empty-016"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-016-accent);color:var(--vibeui-empty-016-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-016"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-016-accent);outline-offset:2px;
}
@container (max-width: 20rem){
[data-vibeui-block="empty-016"] [data-part="action"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS: Empty016Filter[] = [
  { id: "status", label: "Статус: черновик" },
  { id: "author", label: "Автор: я" },
  { id: "period", label: "За последние 7 дней" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Пустой список после фильтров с посортовым сбросом: каждое условие
 * снимается своей кнопкой на чипе, общий сброс остаётся рядом.
 * Один файл, клиентский компонент на useState, без внешних зависимостей.
 */
export function Empty016({
  title = "Под фильтры ничего не подошло",
  text = "Уберите условие, которое мешает, или сбросьте все сразу.",
  filters = DEFAULT_FILTERS,
  total = 248,
  resetLabel = "Сбросить все",
  emptyLabel = "Условий не осталось — показываем весь список",
  countText = "Без них в списке {total} записей.",
  removeLabel = "Убрать условие: {label}",
  locale = "ru-RU",
  onRemoveFilter,
  onReset,
  background = "",
  accent,
  className,
  style,
}: Empty016Props) {
  const [active, setActive] = useState(filters)
  const palette = {
    ...(accent ? { "--vibeui-empty-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const removeFilter = (id: string) => {
    setActive((value) => value.filter((filter) => filter.id !== id))
    onRemoveFilter?.(id)
  }

  const resetAll = () => {
    setActive([])
    onReset?.()
  }

  return (
    <>
      <style href="vibeui-empty-016" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="empty"
        data-vibeui-block="empty-016"
        role="status"
        className={className}
        style={palette}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">
          {active.length > 0
            ? `${text} ${countText.replace("{total}", total.toLocaleString(locale))}`
            : emptyLabel}
        </p>
        {active.length > 0 ? (
          <ul data-part="chips">
            {active.map((filter) => (
              <li key={filter.id} data-part="chip">
                <span>{filter.label}</span>
                <button
                  type="button"
                  data-part="remove"
                  onClick={() => removeFilter(filter.id)}
                  aria-label={removeLabel.replace("{label}", filter.label)}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <line x1="5" y1="5" x2="15" y2="15" />
                    <line x1="15" y1="5" x2="5" y2="15" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {active.length > 0 ? (
          <button type="button" data-part="action" onClick={resetAll}>
            {resetLabel} · {active.length}
          </button>
        ) : null}
      </div>
    </>
  )
}
