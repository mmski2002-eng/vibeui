"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup049Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  hiddenColumns?: string[]
  triggerLabel?: string
  label?: string
  /** Счётчик в шапке: {visible} — показано, {total} — всего колонок. */
  countText?: string
  /** Объяснение к заблокированному флажку последней колонки. */
  lastColumnHint?: string
  onChange?: (visible: string[]) => void
  /** Пусто — заливки нет, кнопка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор видимых колонок таблицы. Раскрытие держит
// details/summary — состояние, клавиатура и объявление «свёрнуто» приходят
// от браузера, а счётчик в шапке обновляется из состояния React. Последняя
// оставшаяся колонка блокируется: таблица без колонок — не результат,
// который пользователь хотел, а тупик, из которого он не выберется мышью.
// Заблокированный флажок получает disabled и объяснение через title, а не
// просто перестаёт реагировать: молчащий элемент читается как поломка.
const STYLES = `
:where([data-vibeui-block="buttongroup-049"]){
--vibeui-buttongroup-049-surface:transparent;
--vibeui-buttongroup-049-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-049-muted:color-mix(in oklab,var(--vibeui-buttongroup-049-fg) 68%,transparent);
--vibeui-buttongroup-049-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-049-hover:light-dark(oklch(0.97 0 265),oklch(0.33 0 265));
/* Поповер перекрывает содержимое под собой, поэтому его подложка непрозрачна
   всегда — она не наследует прозрачный фон кнопки. */
--vibeui-buttongroup-049-panel:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-buttongroup-049-shadow:light-dark(oklch(0.2 0 265 / 16%),oklch(0 0 0 / 45%));
--vibeui-buttongroup-049-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-buttongroup-049-radius:0.625rem;
--vibeui-buttongroup-049-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-049"]{color-scheme:dark}
[data-vibeui-block="buttongroup-049"]{
box-sizing:border-box;display:inline-block;position:relative;
font-family:var(--vibeui-buttongroup-049-font);
}
[data-vibeui-block="buttongroup-049"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-049"] summary{
list-style:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.75rem;
border:1px solid var(--vibeui-buttongroup-049-border);
border-radius:var(--vibeui-buttongroup-049-radius);
background:var(--vibeui-buttongroup-049-surface);
color:var(--vibeui-buttongroup-049-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-049"] summary::marker{content:""}
[data-vibeui-block="buttongroup-049"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="buttongroup-049"] summary:hover{background:var(--vibeui-buttongroup-049-hover)}
[data-vibeui-block="buttongroup-049"] summary:focus-visible{
outline:2px solid var(--vibeui-buttongroup-049-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-049"] [data-part="count"]{
color:var(--vibeui-buttongroup-049-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-049"] summary svg{
width:0.875rem;height:0.875rem;
stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;
transition:rotate .18s ease;
}
[data-vibeui-block="buttongroup-049"] details[open] summary svg{rotate:180deg}
[data-vibeui-block="buttongroup-049"] [data-part="panel"]{
position:absolute;z-index:5;top:calc(100% + 0.375rem);left:0;
min-width:13rem;padding:0.375rem;
border:1px solid var(--vibeui-buttongroup-049-border);
border-radius:0.75rem;
background:var(--vibeui-buttongroup-049-panel);
box-shadow:0 8px 24px var(--vibeui-buttongroup-049-shadow);
}
[data-vibeui-block="buttongroup-049"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-buttongroup-049-fg);
font-size:0.8125rem;line-height:1.2;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="buttongroup-049"] [data-part="row"]:hover{background:var(--vibeui-buttongroup-049-hover)}
[data-vibeui-block="buttongroup-049"] [data-part="row"]:has(input:disabled){
color:var(--vibeui-buttongroup-049-muted);cursor:not-allowed;
}
[data-vibeui-block="buttongroup-049"] [data-part="row"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-049-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-049"] input{
width:1rem;height:1rem;margin:0;flex:none;accent-color:var(--vibeui-buttongroup-049-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-049"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = [
  "Название",
  "Ответственный",
  "Статус",
  "Срок",
  "Приоритет",
  "Обновлено",
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Выбор видимых колонок в details, где последнюю колонку снять нельзя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup049({
  columns = DEFAULT_COLUMNS,
  hiddenColumns = ["Приоритет", "Обновлено"],
  triggerLabel = "Колонки",
  label = "Видимые колонки таблицы",
  countText = "{visible} из {total}",
  lastColumnHint = "Хотя бы одна колонка должна остаться",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup049Props) {
  const [visible, setVisible] = useState<string[]>(
    columns.filter((column) => !hiddenColumns.includes(column)),
  )

  const toggle = (column: string) => {
    const next = visible.includes(column)
      ? visible.filter((value) => value !== column)
      : [...visible, column]

    setVisible(next)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-049-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-049-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-049" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-049"
        className={className}
        style={palette}
      >
        <details>
          <summary>
            {triggerLabel}
            <span data-part="count">
              {countText
                .replace("{visible}", String(visible.length))
                .replace("{total}", String(columns.length))}
            </span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div data-part="panel" role="group" aria-label={label}>
            {columns.map((column) => {
              const checked = visible.includes(column)
              const last = checked && visible.length === 1

              return (
                <label
                  key={column}
                  data-part="row"
                  title={last ? lastColumnHint : undefined}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={last}
                    onChange={() => toggle(column)}
                  />
                  <span>{column}</span>
                </label>
              )
            })}
          </div>
        </details>
      </div>
    </>
  )
}
