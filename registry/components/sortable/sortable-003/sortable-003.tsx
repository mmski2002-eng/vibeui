"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Sortable003Column = {
  key: string
  label: string
  numeric?: boolean
}

export type Sortable003Announcement = "moved" | "edge"

export type Sortable003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  caption?: string
  columns?: Sortable003Column[]
  rows?: Record<string, string>[]
  onChange?: (columns: Sortable003Column[]) => void
  /** Подпись ручки: {column} — колонка, {position} — номер, {total} — всего. */
  gripLabel?: string
  /** Реплики живой области: те же подстановки. */
  announcements?: Record<Sortable003Announcement, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переставляются не строки, а колонки таблицы. Порядок живёт
// одним массивом описаний колонок, и ячейки тела рисуются по нему же — поэтому
// заголовок и данные не могут разъехаться. Заголовок остаётся тегом th со
// scope="col": перетаскивание не повод превращать таблицу в набор div, иначе
// связь ячейки с колонкой теряется для скринридера. Ручка в заголовке — кнопка:
// мышью колонку тянут, с клавиатуры двигают стрелками влево и вправо, каждый
// шаг объявляется в живой области.
const STYLES = `
:where([data-vibeui-block="sortable-003"]){
--vibeui-sortable-003-bg:transparent;
--vibeui-sortable-003-head:light-dark(oklch(0.975 0.003 265),oklch(0.29 0.011 265));
--vibeui-sortable-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-sortable-003-muted:light-dark(oklch(0.56 0.014 265),oklch(0.68 0.012 265));
--vibeui-sortable-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-sortable-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-sortable-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-003"]{
position:relative;width:100%;max-width:30rem;box-sizing:border-box;
padding:0.75rem;overflow-x:auto;
background:var(--vibeui-sortable-003-bg);
border:1px solid var(--vibeui-sortable-003-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-003-font);color:var(--vibeui-sortable-003-fg);
}
[data-vibeui-block="sortable-003"] *{box-sizing:border-box}
[data-vibeui-block="sortable-003"] table{width:100%;border-collapse:collapse;font-size:0.75rem}
[data-vibeui-block="sortable-003"] caption{
caption-side:top;text-align:left;padding:0 0 0.5rem;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-sortable-003-muted);
}
[data-vibeui-block="sortable-003"] th{
padding:0;text-align:left;font-weight:650;
background:var(--vibeui-sortable-003-head);
border-bottom:1px solid var(--vibeui-sortable-003-border);
}
[data-vibeui-block="sortable-003"] th:first-child{border-top-left-radius:0.5rem}
[data-vibeui-block="sortable-003"] th:last-child{border-top-right-radius:0.5rem}
[data-vibeui-block="sortable-003"] th[data-dragging="true"]{opacity:.45}
/* Место вставки — вертикальная линия у края колонки, а не заливка ячейки. */
[data-vibeui-block="sortable-003"] th[data-over="true"]{box-shadow:inset 2px 0 0 var(--vibeui-sortable-003-accent)}
[data-vibeui-block="sortable-003"] [data-part="grip"]{
display:flex;align-items:center;gap:0.375rem;width:100%;
appearance:none;border:0;cursor:grab;background:none;
padding:0.4375rem 0.5rem;border-radius:0.375rem;
color:inherit;font:inherit;font-size:0.6875rem;font-weight:650;text-align:left;white-space:nowrap;
}
[data-vibeui-block="sortable-003"] [data-part="grip"]:focus-visible{outline:2px solid var(--vibeui-sortable-003-accent);outline-offset:-2px}
[data-vibeui-block="sortable-003"] [data-part="dots"]{
display:grid;grid-template-columns:repeat(2,2px);gap:2px;flex:none;
}
[data-vibeui-block="sortable-003"] [data-part="dots"] i{
display:block;width:2px;height:2px;border-radius:50%;
background:var(--vibeui-sortable-003-muted);
}
[data-vibeui-block="sortable-003"] td{
padding:0.4375rem 0.5rem;border-bottom:1px solid var(--vibeui-sortable-003-border);
line-height:1.3;
}
[data-vibeui-block="sortable-003"] td[data-numeric="true"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="sortable-003"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="sortable-003"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ANNOUNCEMENTS: Record<Sortable003Announcement, string> = {
  moved: "Колонка «{column}» на позиции {position} из {total}.",
  edge: "Колонка «{column}» уже с краю таблицы.",
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

const DEFAULT_COLUMNS: Sortable003Column[] = [
  { key: "sku", label: "Артикул" },
  { key: "name", label: "Название" },
  { key: "stock", label: "Остаток", numeric: true },
  { key: "price", label: "Цена", numeric: true },
]

const DEFAULT_ROWS: Record<string, string>[] = [
  { sku: "AL-118", name: "Кабель питания", stock: "412", price: "690 ₽" },
  { sku: "BR-204", name: "Кронштейн", stock: "38", price: "1 240 ₽" },
  { sku: "CM-330", name: "Модуль RS-485", stock: "7", price: "3 900 ₽" },
]

/**
 * Таблица с переставляемыми колонками: мышью — за ручку, с клавиатуры — стрелками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable003({
  caption = "Порядок колонок меняется мышью или стрелками при фокусе на заголовке",
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  onChange,
  gripLabel = "Переместить колонку «{column}», сейчас {position} из {total}",
  announcements = DEFAULT_ANNOUNCEMENTS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable003Props) {
  const [order, setOrder] = useState(columns)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const say = (
    key: Sortable003Announcement,
    column: string,
    position: number,
    total: number,
  ) =>
    (announcements[key] ?? DEFAULT_ANNOUNCEMENTS[key])
      .replace("{column}", column)
      .replace("{position}", String(position))
      .replace("{total}", String(total))

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return

    const next = [...order]
    const [column] = next.splice(from, 1)
    next.splice(to, 0, column)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(say("moved", column.label, to + 1, next.length))
  }

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, key: string) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()

    const index = order.findIndex((column) => column.key === key)
    const to = index + (event.key === "ArrowLeft" ? -1 : 1)

    if (to < 0 || to >= order.length) {
      setAnnouncement(say("edge", order[index].label, index + 1, order.length))
      return
    }

    move(index, to)
  }

  const drop = (event: DragEvent<HTMLTableCellElement>, key: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === key) return

    move(
      order.findIndex((column) => column.key === dragged),
      order.findIndex((column) => column.key === key),
    )
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sortable-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-003"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {order.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  draggable
                  data-dragging={column.key === dragged}
                  data-over={column.key === over}
                  onDragStart={() => setDragged(column.key)}
                  onDragEnd={() => {
                    setDragged(null)
                    setOver(null)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setOver(column.key)
                  }}
                  onDrop={(event) => drop(event, column.key)}
                >
                  <button
                    type="button"
                    data-part="grip"
                    aria-label={gripLabel
                      .replace("{column}", column.label)
                      .replace("{position}", String(index + 1))
                      .replace("{total}", String(order.length))}
                    onKeyDown={(event) => handleKey(event, column.key)}
                  >
                    <span data-part="dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    {column.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.sku}>
                {order.map((column) => (
                  <td key={column.key} data-numeric={Boolean(column.numeric)}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}
