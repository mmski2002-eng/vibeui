"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type {
  ComponentProps,
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
  ComponentProps<"div">,
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
--vibeui-sortable-003-head:light-dark(oklch(0.975 0 265),oklch(0.29 0 265));
--vibeui-sortable-003-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-003-muted:color-mix(in oklab,var(--vibeui-sortable-003-fg) 68%,transparent);
--vibeui-sortable-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-sortable-003-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-sortable-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-003"]{color-scheme:dark}
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
[data-vibeui-block="sortable-003"] th[data-dragging="true"]{opacity:.45;outline:1px dashed var(--vibeui-sortable-003-accent);outline-offset:-1px}
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
  const cells = useRef(new Map<string, HTMLTableCellElement>())
  const rects = useRef(new Map<string, { left: number; top: number }>())

  // FLIP: после каждого рендера сравниваем прежнее и новое положение элементов
  // и проигрываем сдвиг с прежнего места. Перестановка видна как движение,
  // а не как мгновенная подмена.
  useLayoutEffect(() => {
    const next = new Map<string, { left: number; top: number }>()
    // Положение считается относительно самого компонента, а не окна.
    // getBoundingClientRect меряет от края экрана: стоило странице
    // прокрутиться или карточке съехать в сетке между двумя рендерами, как
    // FLIP принимал это за переезд строк и проигрывал прыжок на всю
    // величину сдвига — по нажатию на что угодно внутри компонента.
    const first = cells.current.values().next().value
    const base = first?.closest("[data-vibeui-block]")?.getBoundingClientRect()
    cells.current.forEach((node, key) => {
      const box = node.getBoundingClientRect()
      next.set(key, {
        left: box.left - (base?.left ?? 0),
        top: box.top - (base?.top ?? 0),
      })
    })
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!calm) {
      cells.current.forEach((node, key) => {
        const before = rects.current.get(key)
        const after = next.get(key)
        if (!before || !after) return
        const dx = before.left - after.left
        const dy = before.top - after.top
        if (!dx && !dy) return
        node.animate(
          [{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }],
          { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" },
        )
      })
    }
    rects.current = next
  })

  // Живая перестановка: элемент встаёт на место того, над которым висит
  // курсор, ещё до отпускания — остальные раздвигаются, а не накладываются.
  // Перестановка ждёт, пока курсор пройдёт середину цели. Иначе ровно на
  // границе двух строк список дрожал: перестановка подводила под курсор
  // соседнюю строку, та просила перестановку обратно, и так по кругу.
  const crossed = (event: DragEvent<HTMLElement>, forward: boolean) => {
    const box = event.currentTarget.getBoundingClientRect()
    const self = cells.current.get(dragged ?? "")?.getBoundingClientRect()
    // Ось берётся из взаимного положения, а не из раскладки: так одна и та же
    // проверка годится и списку строк, и ряду колонок, и сетке плиток.
    const vertical =
      !self || Math.abs(box.top - self.top) >= Math.abs(box.left - self.left)
    const middle = vertical ? box.top + box.height / 2 : box.left + box.width / 2

    return forward
      ? (vertical ? event.clientY : event.clientX) >= middle
      : (vertical ? event.clientY : event.clientX) <= middle
  }

  const hover = (target: string, event: DragEvent<HTMLElement>) => {
    if (!dragged || dragged === target) return
    const from = order.findIndex((column) => column.key === dragged)
    const to = order.findIndex((column) => column.key === target)
    if (from < 0 || to < 0 || from === to) return
    if (!crossed(event, to > from)) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, order[from])
    setOrder(next)
  }
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

  const drop = (event: DragEvent<HTMLTableCellElement>) => {
    event.preventDefault()
    setOver(null)
    if (dragged) {
      const index = order.findIndex((column) => column.key === dragged)
      onChange?.(order)
      setAnnouncement(say("moved", order[index]?.label ?? "", index + 1, order.length))
    }
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
        data-slot="sortable"
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
                  ref={(node) => {
                    if (node) cells.current.set(column.key, node)
                    else cells.current.delete(column.key)
                  }}
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
                    hover(column.key, event)
                  }}
                  onDrop={drop}
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
                  <td
                    key={column.key}
                    ref={(node) => {
                      const cell = `${column.key}:${row.sku}`
                      if (node) cells.current.set(cell, node)
                      else cells.current.delete(cell)
                    }}
                    data-numeric={Boolean(column.numeric)}
                  >
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
