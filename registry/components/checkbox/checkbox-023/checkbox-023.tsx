"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox023Row = {
  id: string
  label: string
}

export type Checkbox023Column = {
  id: string
  label: string
}

export type Checkbox023Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "title"
> & {
  title?: string
  rows?: Checkbox023Row[]
  columns?: Checkbox023Column[]
  /** Ключи вида "rowId:colId". */
  defaultValue?: string[]
  /** Подпись угловой ячейки над названиями строк. */
  rowsLabel?: string
  /** Скрытая подпись мастера столбца. {label} — название столбца. */
  columnAllText?: string
  /** Счётчик внизу. {count} — отмечено, {total} — всего ячеек. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: права — это пересечение ресурса и действия, а не список
// с вложенностью, поэтому таблица подходит лучше дерева (checkbox-021).
// Ячейка живёт в <td>, а не в самодельной сетке: разметка <table> отдаёт
// screen reader'у связь «строка × столбец» бесплатно. Заголовок каждого
// столбца несёт свой чекбокс-мастер: отмечает всё действие сразу по всем
// ресурсам и показывает черту, когда отмечена только часть строк.
const STYLES = `
:where([data-vibeui-block="checkbox-023"]){
--vibeui-checkbox-023-bg:transparent;
--vibeui-checkbox-023-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-checkbox-023-muted:color-mix(in oklab,var(--vibeui-checkbox-023-fg) 68%,transparent);
--vibeui-checkbox-023-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-checkbox-023-head:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.011 265));
--vibeui-checkbox-023-accent:light-dark(oklch(0.52 0.15 195),oklch(0.68 0.14 195));
--vibeui-checkbox-023-on-accent:light-dark(var(--vibeui-checkbox-023-on-accent),oklch(0.19 0.03 195));
--vibeui-checkbox-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-023"]{color-scheme:dark}
[data-vibeui-block="checkbox-023"]{
display:block;width:100%;max-width:20rem;box-sizing:border-box;
padding:0.875rem;border:1px solid var(--vibeui-checkbox-023-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-023-bg);
font-family:var(--vibeui-checkbox-023-font);color:var(--vibeui-checkbox-023-fg);
}
[data-vibeui-block="checkbox-023"] [data-part="title"]{
margin:0 0 0.625rem;font-size:0.875rem;font-weight:650;
}
/* Узкие экраны шире таблицы получают собственный скролл ячеек, а не
   раздвигают страницу: у компонента внутри есть, чему тесниться. */
[data-vibeui-block="checkbox-023"] [data-part="scroll"]{
overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -0.875rem;padding:0 0.875rem;
}
[data-vibeui-block="checkbox-023"] table{border-collapse:collapse;width:100%}
[data-vibeui-block="checkbox-023"] caption,
[data-vibeui-block="checkbox-023"] [data-part="corner-label"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);
}
[data-vibeui-block="checkbox-023"] th,
[data-vibeui-block="checkbox-023"] td{padding:0;text-align:center}
[data-vibeui-block="checkbox-023"] [data-part="corner"]{width:0}
[data-vibeui-block="checkbox-023"] [data-part="col-head"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:0 0.25rem 0.5rem;cursor:pointer;
}
[data-vibeui-block="checkbox-023"] [data-part="col-head"] span{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-checkbox-023-muted);
white-space:nowrap;
}
[data-vibeui-block="checkbox-023"] [data-part="row-label"]{
padding:0.5rem 0.5rem 0.5rem 0;text-align:left;white-space:nowrap;
font-size:0.8125rem;font-weight:600;
border-top:1px solid var(--vibeui-checkbox-023-border);
}
[data-vibeui-block="checkbox-023"] [data-part="cell"]{
border-top:1px solid var(--vibeui-checkbox-023-border);
}
[data-vibeui-block="checkbox-023"] tbody tr:hover [data-part="row-label"],
[data-vibeui-block="checkbox-023"] tbody tr:hover [data-part="cell"]{
background:var(--vibeui-checkbox-023-head);
}
[data-vibeui-block="checkbox-023"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-023-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-023-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-023"] input:checked,
[data-vibeui-block="checkbox-023"] input:indeterminate{
border-color:transparent;background:var(--vibeui-checkbox-023-accent);
}
[data-vibeui-block="checkbox-023"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-023-on-accent);border-bottom:2px solid var(--vibeui-checkbox-023-on-accent);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-023"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;border-radius:1px;
background:var(--vibeui-checkbox-023-on-accent);
}
[data-vibeui-block="checkbox-023"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-023-accent);outline-offset:2px}
[data-vibeui-block="checkbox-023"] [data-part="foot"]{
margin:0.75rem 0 0;padding-top:0.625rem;
border-top:1px solid var(--vibeui-checkbox-023-border);
font-size:0.75rem;color:var(--vibeui-checkbox-023-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Checkbox023Row[] = [
  { id: "pages", label: "Страницы" },
  { id: "media", label: "Медиа" },
  { id: "team", label: "Команда" },
  { id: "billing", label: "Оплата" },
]

const DEFAULT_COLUMNS: Checkbox023Column[] = [
  { id: "view", label: "Смотреть" },
  { id: "edit", label: "Менять" },
  { id: "delete", label: "Удалять" },
]

const DEFAULT_VALUE = [
  "pages:view",
  "pages:edit",
  "media:view",
  "team:view",
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
 * Матрица прав доступа: строки — ресурсы, столбцы — действия, а мастер над
 * столбцом отмечает действие сразу для всех ресурсов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox023({
  title = "Права доступа",
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  defaultValue = DEFAULT_VALUE,
  rowsLabel = "Ресурс",
  columnAllText = "Все: {label}",
  countText = "Отмечено {count} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox023Props) {
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
    ...(accent ? { "--vibeui-checkbox-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-023-bg": background,
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
      <style href="vibeui-checkbox-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-023"
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
                      <input
                        ref={(input) => {
                          columnRefs.current.set(column.id, input)
                        }}
                        type="checkbox"
                        checked={allInColumn(column.id)}
                        aria-label={columnAllText.replace(
                          "{label}",
                          column.label,
                        )}
                        onChange={() =>
                          toggleColumn(column.id, !allInColumn(column.id))
                        }
                      />
                      <span>{column.label}</span>
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
                      <input
                        type="checkbox"
                        checked={value.has(keyOf(row.id, column.id))}
                        aria-label={`${row.label}: ${column.label}`}
                        onChange={() =>
                          toggleCell(keyOf(row.id, column.id))
                        }
                      />
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
