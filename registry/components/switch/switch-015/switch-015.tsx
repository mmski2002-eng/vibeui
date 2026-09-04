"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Switch015Row = {
  id: string
  label: string
}

export type Switch015Column = {
  id: string
  label: string
}

export type Switch015Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "title"
> & {
  title?: string
  rows?: Switch015Row[]
  columns?: Switch015Column[]
  /** Ключи вида "rowId:colId". */
  defaultValue?: string[]
  /** Подпись угловой ячейки над названиями строк. */
  rowsLabel?: string
  /** Скрытая подпись мастера столбца. {label} — название столбца. */
  columnAllText?: string
  /** Счётчик внизу. {count} — включено, {total} — всего ячеек. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: канал уведомления — это пересечение события и способа
// доставки, поэтому таблица подходит лучше плоского списка (switch-003)
// или одной группы (switch-012). Каждый столбец — канал (почта, push,
// SMS) — несёт свой переключатель-мастер: включает канал для всех событий
// разом и встаёт в промежуточное положение, когда включена только часть.
const STYLES = `
:where([data-vibeui-block="switch-015"]){
--vibeui-switch-015-bg:transparent;
--vibeui-switch-015-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-015-muted:color-mix(in oklab,var(--vibeui-switch-015-fg) 68%,transparent);
--vibeui-switch-015-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-015-head:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.011 265));
--vibeui-switch-015-track:light-dark(oklch(0.88 0.008 265),oklch(0.43 0.014 265));
--vibeui-switch-015-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-015-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.16 262));
--vibeui-switch-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-015"]{color-scheme:dark}
[data-vibeui-block="switch-015"]{
display:block;width:100%;max-width:20rem;box-sizing:border-box;
padding:0.875rem;border:1px solid var(--vibeui-switch-015-border);border-radius:0.875rem;
background:var(--vibeui-switch-015-bg);
font-family:var(--vibeui-switch-015-font);color:var(--vibeui-switch-015-fg);
}
[data-vibeui-block="switch-015"] [data-part="title"]{
margin:0 0 0.625rem;font-size:0.875rem;font-weight:650;
}
/* Узкие экраны шире таблицы получают собственный скролл ячеек, а не
   раздвигают страницу: у компонента внутри есть, чему тесниться. */
[data-vibeui-block="switch-015"] [data-part="scroll"]{
overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -0.875rem;padding:0 0.875rem;
}
[data-vibeui-block="switch-015"] table{border-collapse:collapse;width:100%}
[data-vibeui-block="switch-015"] caption,
[data-vibeui-block="switch-015"] [data-part="corner-label"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);
}
[data-vibeui-block="switch-015"] th,
[data-vibeui-block="switch-015"] td{padding:0;text-align:center}
[data-vibeui-block="switch-015"] [data-part="corner"]{width:0}
[data-vibeui-block="switch-015"] [data-part="col-head"]{
display:flex;flex-direction:column;align-items:center;gap:0.3125rem;
padding:0 0.25rem 0.5rem;cursor:pointer;
}
[data-vibeui-block="switch-015"] [data-part="col-head"] span{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-switch-015-muted);
white-space:nowrap;
}
[data-vibeui-block="switch-015"] [data-part="row-label"]{
padding:0.5rem 0.5rem 0.5rem 0;text-align:left;white-space:nowrap;
font-size:0.8125rem;font-weight:600;
border-top:1px solid var(--vibeui-switch-015-border);
}
[data-vibeui-block="switch-015"] [data-part="cell"]{
border-top:1px solid var(--vibeui-switch-015-border);
}
[data-vibeui-block="switch-015"] tbody tr:hover [data-part="row-label"],
[data-vibeui-block="switch-015"] tbody tr:hover [data-part="cell"]{
background:var(--vibeui-switch-015-head);
}
[data-vibeui-block="switch-015"] [data-part="track"]{
position:relative;display:inline-flex;flex:none;margin:0 auto;
}
[data-vibeui-block="switch-015"] input{
appearance:none;-webkit-appearance:none;margin:0;cursor:pointer;
width:2rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-switch-015-track);
transition:background-color .18s ease;
}
[data-vibeui-block="switch-015"] input:checked,
[data-vibeui-block="switch-015"] input:indeterminate{background:var(--vibeui-switch-015-accent)}
[data-vibeui-block="switch-015"] input:focus-visible{outline:2px solid var(--vibeui-switch-015-accent);outline-offset:2px}
[data-vibeui-block="switch-015"] [data-part="thumb"]{
position:absolute;left:0.15625rem;top:0.15625rem;
width:0.8125rem;height:0.8125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-015-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-015"] input:checked + [data-part="thumb"]{transform:translateX(0.875rem)}
/* Бегунок мастера столбца в промежуточном положении — по центру дорожки:
   ни «включено», ни «выключено», а честное «частично». */
[data-vibeui-block="switch-015"] input:indeterminate + [data-part="thumb"]{transform:translateX(0.4375rem)}
[data-vibeui-block="switch-015"] [data-part="foot"]{
margin:0.75rem 0 0;padding-top:0.625rem;
border-top:1px solid var(--vibeui-switch-015-border);
font-size:0.75rem;color:var(--vibeui-switch-015-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Switch015Row[] = [
  { id: "orders", label: "Заказы" },
  { id: "comments", label: "Комментарии" },
  { id: "mentions", label: "Упоминания" },
  { id: "digest", label: "Дайджест" },
]

const DEFAULT_COLUMNS: Switch015Column[] = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push" },
  { id: "sms", label: "SMS" },
]

const DEFAULT_VALUE = [
  "orders:email",
  "orders:push",
  "comments:push",
  "mentions:email",
  "mentions:push",
]

function keyOf(rowId: string, columnId: string): string {
  return `${rowId}:${columnId}`
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
 * Матрица каналов уведомлений: строки — события, столбцы — каналы, а
 * мастер над столбцом включает канал сразу для всех событий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch015({
  title = "Каналы уведомлений",
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  defaultValue = DEFAULT_VALUE,
  rowsLabel = "Событие",
  columnAllText = "Все: {label}",
  countText = "Включено {count} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch015Props) {
  const [value, setValue] = useState<Set<string>>(() => new Set(defaultValue))
  const columnRefs = useRef(new Map<string, HTMLInputElement | null>())

  const countInColumn = (columnId: string) =>
    rows.filter((row) => value.has(keyOf(row.id, columnId))).length
  const allInColumn = (columnId: string) =>
    rows.length > 0 && countInColumn(columnId) === rows.length
  const someInColumn = (columnId: string) => {
    const count = countInColumn(columnId)
    return count > 0 && count < rows.length
  }

  // indeterminate живёт только в DOM: атрибутом его не выставить, поэтому
  // синхронизируем каждый мастер столбца после любого изменения значения.
  useEffect(() => {
    columns.forEach((column) => {
      const input = columnRefs.current.get(column.id)
      if (input) {
        input.indeterminate = someInColumn(column.id)
      }
    })
  })

  const palette = {
    ...(accent ? { "--vibeui-switch-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: Set<string>) => {
    setValue(next)
    onChange?.([...next])
  }

  const toggleCell = (key: string) => {
    const next = new Set(value)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    update(next)
  }

  const toggleColumn = (columnId: string, checked: boolean) => {
    const next = new Set(value)
    rows.forEach((row) => {
      const key = keyOf(row.id, columnId)
      if (checked) {
        next.add(key)
      } else {
        next.delete(key)
      }
    })
    update(next)
  }

  const total = rows.length * columns.length

  return (
    <>
      <style href="vibeui-switch-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="switch"
        data-vibeui-block="switch-015"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <div data-part="scroll">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th data-part="corner" scope="col">
                  <span data-part="corner-label">{rowsLabel}</span>
                </th>
                {columns.map((column) => (
                  <th key={column.id} scope="col">
                    <label data-part="col-head">
                      <span>{column.label}</span>
                      <span data-part="track">
                        <input
                          ref={(input) => {
                            columnRefs.current.set(column.id, input)
                          }}
                          type="checkbox"
                          role="switch"
                          checked={allInColumn(column.id)}
                          aria-label={columnAllText.replace(
                            "{label}",
                            column.label,
                          )}
                          onChange={() =>
                            toggleColumn(column.id, !allInColumn(column.id))
                          }
                        />
                        <span data-part="thumb" aria-hidden="true" />
                      </span>
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th data-part="row-label" scope="row">
                    {row.label}
                  </th>
                  {columns.map((column) => (
                    <td key={column.id} data-part="cell">
                      <span data-part="track">
                        <input
                          type="checkbox"
                          role="switch"
                          checked={value.has(keyOf(row.id, column.id))}
                          aria-label={`${row.label}: ${column.label}`}
                          onChange={() =>
                            toggleCell(keyOf(row.id, column.id))
                          }
                        />
                        <span data-part="thumb" aria-hidden="true" />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="foot" role="status">
          {countText
            .replace("{count}", String(value.size))
            .replace("{total}", String(total))}
        </p>
      </div>
    </>
  )
}
