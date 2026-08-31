"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  PointerEvent,
} from "react"

export type Datagrid009Row = {
  file: string
  owner: string
  changed: string
  size: string
}

export type Datagrid009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid009Row[]
  caption?: string
  minWidth?: number
  accent?: string
}

type Key = "file" | "owner" | "changed" | "size"

// Идея компонента: ширину колонки тянут за разделитель между заголовками.
// Разделитель — это role="separator" с aria-valuenow и стрелками на
// клавиатуре: тянуть мышью умеют все сетки, а вот выставить ширину без мыши
// обычно нельзя. Ширины живут в colgroup при table-layout:fixed, поэтому
// перетаскивание не пересчитывает всю таблицу на каждое движение.
const STYLES = `
:where([data-vibeui-block="datagrid-009"]){
--vibeui-datagrid-009-bg:oklch(1 0 0);
--vibeui-datagrid-009-fg:oklch(0.23 0.012 240);
--vibeui-datagrid-009-muted:oklch(0.55 0.012 240);
--vibeui-datagrid-009-border:oklch(0.92 0.006 240);
--vibeui-datagrid-009-head:oklch(0.975 0.003 240);
--vibeui-datagrid-009-accent:oklch(0.55 0.16 250);
--vibeui-datagrid-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-009"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-009-bg);color:var(--vibeui-datagrid-009-fg);
border:1px solid var(--vibeui-datagrid-009-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-009-font);overflow:hidden;
}
[data-vibeui-block="datagrid-009"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-009"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-009-border);
}
[data-vibeui-block="datagrid-009"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-009"] [data-part="bar"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-009-border);
background:var(--vibeui-datagrid-009-bg);color:var(--vibeui-datagrid-009-fg);
}
[data-vibeui-block="datagrid-009"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-009-accent);outline-offset:2px}
[data-vibeui-block="datagrid-009"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-009"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-009-accent);outline-offset:-2px}
/* fixed: без него браузер пересчитывает ширины по содержимому и перетянутая
   колонка возвращается на место. */
[data-vibeui-block="datagrid-009"] table{
table-layout:fixed;border-collapse:collapse;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-009"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-009-muted);
}
[data-vibeui-block="datagrid-009"] th,
[data-vibeui-block="datagrid-009"] td{
padding:0.4375rem 0.875rem;text-align:left;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-009-border);
}
[data-vibeui-block="datagrid-009"] thead th{
position:relative;background:var(--vibeui-datagrid-009-head);font-weight:600;
}
/* Разделитель шире своей полоски: 12 px по горизонтали — минимальная
   попадаемая цель мышью. */
[data-vibeui-block="datagrid-009"] [data-part="grip"]{
position:absolute;top:0;right:-6px;bottom:0;width:12px;
padding:0;border:0;background:none;cursor:col-resize;touch-action:none;z-index:1;
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="datagrid-009"] [data-part="grip"]::before{
content:"";width:2px;height:60%;border-radius:1px;background:var(--vibeui-datagrid-009-border);
transition:background-color .14s ease;
}
[data-vibeui-block="datagrid-009"] [data-part="grip"]:hover::before,
[data-vibeui-block="datagrid-009"] [data-part="grip"][data-dragging="true"]::before{
background:var(--vibeui-datagrid-009-accent);
}
[data-vibeui-block="datagrid-009"] [data-part="grip"]:focus-visible{outline:2px solid var(--vibeui-datagrid-009-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-009"] [data-part="name"]{font-weight:500}
[data-vibeui-block="datagrid-009"] [data-part="muted"]{color:var(--vibeui-datagrid-009-muted)}
[data-vibeui-block="datagrid-009"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid009Row[] = [
  {
    file: "Отчёт по воронке, март.xlsx",
    owner: "Лебедь",
    changed: "12 марта, 14:02",
    size: "1,8 МБ",
  },
  {
    file: "Макет каталога v7.fig",
    owner: "Орлова",
    changed: "11 марта, 09:41",
    size: "24,3 МБ",
  },
  {
    file: "Договор Гранат.pdf",
    owner: "Гнедин",
    changed: "9 марта, 18:20",
    size: "412 КБ",
  },
  {
    file: "Разметка событий.md",
    owner: "Савва",
    changed: "6 марта, 11:05",
    size: "18 КБ",
  },
  {
    file: "Прайс-лист, апрель.csv",
    owner: "Ким",
    changed: "2 марта, 08:12",
    size: "96 КБ",
  },
]

const COLUMNS: { key: Key; title: string; width: number; numeric?: boolean }[] =
  [
    { key: "file", title: "Файл", width: 260 },
    { key: "owner", title: "Владелец", width: 130 },
    { key: "changed", title: "Изменён", width: 160 },
    { key: "size", title: "Размер", width: 100, numeric: true },
  ]

const START: Record<Key, number> = {
  file: 260,
  owner: 130,
  changed: 160,
  size: 100,
}

/**
 * Сетка с изменением ширины колонок: разделитель тянется мышью и
 * настраивается стрелками с клавиатуры. Один файл, ноль зависимостей.
 */
export function Datagrid009({
  rows = DEFAULT_ROWS,
  caption = "Потяните разделитель между заголовками или наведите на него фокус и жмите стрелки",
  minWidth = 96,
  accent,
  className,
  style,
  ...props
}: Datagrid009Props) {
  const [widths, setWidths] = useState<Record<Key, number>>(START)
  const [dragging, setDragging] = useState<Key | null>(null)
  const drag = useRef<{ key: Key; x: number; width: number } | null>(null)

  const clamp = (value: number) => Math.max(minWidth, Math.min(520, value))

  const resize = (key: Key, next: number) =>
    setWidths((current) => ({ ...current, [key]: clamp(next) }))

  const onDown = (event: PointerEvent<HTMLButtonElement>, key: Key) => {
    drag.current = { key, x: event.clientX, width: widths[key] }
    setDragging(key)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = drag.current
    if (!state) return
    resize(state.key, state.width + (event.clientX - state.x))
  }

  const onUp = () => {
    drag.current = null
    setDragging(null)
  }

  const total = COLUMNS.reduce((sum, column) => sum + widths[column.key], 0)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-009"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Файлы проекта</h3>
          <button type="button" onClick={() => setWidths(START)}>
            Вернуть ширины
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица файлов, прокручивается вбок"
          tabIndex={0}
        >
          <table style={{ width: `${total}px`, minWidth: "100%" }}>
            <caption>{caption}</caption>
            <colgroup>
              {COLUMNS.map((column) => (
                <col
                  key={column.key}
                  style={{ width: `${widths[column.key]}px` }}
                />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((column, index) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-align={column.numeric ? "end" : undefined}
                  >
                    {column.title}
                    {index < COLUMNS.length - 1 ? (
                      <button
                        type="button"
                        data-part="grip"
                        data-dragging={dragging === column.key}
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Ширина колонки «${column.title}»`}
                        aria-valuenow={widths[column.key]}
                        aria-valuemin={minWidth}
                        aria-valuemax={520}
                        onPointerDown={(event) => onDown(event, column.key)}
                        onPointerMove={onMove}
                        onPointerUp={onUp}
                        onPointerCancel={onUp}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowLeft") {
                            event.preventDefault()
                            resize(column.key, widths[column.key] - 16)
                          }
                          if (event.key === "ArrowRight") {
                            event.preventDefault()
                            resize(column.key, widths[column.key] + 16)
                          }
                        }}
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.file}>
                  <th scope="row" data-part="name" title={row.file}>
                    {row.file}
                  </th>
                  <td data-part="muted">{row.owner}</td>
                  <td data-part="muted">{row.changed}</td>
                  <td data-align="end">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
