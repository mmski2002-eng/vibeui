"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid005Row = {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

export type Datagrid005Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid005Row[]
  caption?: string
  hint?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Названия колонок: sku, name, price, stock. */
  columnText?: Record<string, string>
  /** Счётчик несохранённого. {count} — сколько ячеек изменено. */
  statusText?: string
  /** Подпись кнопки отмены правок. */
  cancelLabel?: string
  /** Подпись кнопки сохранения. */
  saveLabel?: string
  /** Подпись ячейки-кнопки. {column}, {row} и {value} подставляются. */
  editLabel?: string
  /** Подпись поля ввода. {column} и {row} подставляются. */
  fieldLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Field = "name" | "price" | "stock"

// Идея компонента: правка значения прямо в ячейке. Ячейка в покое — кнопка,
// а не div с onClick: только так правка открывается с клавиатуры. Enter
// подтверждает, Escape возвращает прежнее значение, потерянный фокус
// сохраняет. Изменённые ячейки помечены до нажатия «Сохранить», поэтому
// видно, что именно уедет на сервер.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-005"]){
--vibeui-datagrid-005-bg:transparent;
--vibeui-datagrid-005-fg:light-dark(oklch(0.23 0.014 60),oklch(0.93 0.006 60));
--vibeui-datagrid-005-muted:color-mix(in oklab,var(--vibeui-datagrid-005-fg) 68%,transparent);
--vibeui-datagrid-005-border:light-dark(oklch(0.92 0.006 60),oklch(0.34 0.012 60));
--vibeui-datagrid-005-head:light-dark(oklch(0.975 0.004 60),oklch(0.27 0.012 60));
--vibeui-datagrid-005-field:light-dark(oklch(1 0 0),oklch(0.23 0.012 60));
--vibeui-datagrid-005-accent:light-dark(oklch(0.295 0 0),oklch(0.91 0 0));
--vibeui-datagrid-005-on-accent:oklch(from var(--vibeui-datagrid-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-005-dirty:light-dark(oklch(0.295 0 0 / 12%),oklch(0.91 0 0 / 18%));
--vibeui-datagrid-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-005-dur-1:130ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-005"]{color-scheme:dark}
[data-vibeui-block="datagrid-005"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-005-bg);color:var(--vibeui-datagrid-005-fg);
border:1px solid var(--vibeui-datagrid-005-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-005-font);overflow:hidden;
}
[data-vibeui-block="datagrid-005"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-005"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-005"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-005-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-005"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-005"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-005-muted);
}
[data-vibeui-block="datagrid-005"] th,
[data-vibeui-block="datagrid-005"] td{
text-align:left;white-space:nowrap;padding:0;
border-top:1px solid var(--vibeui-datagrid-005-border);
}
[data-vibeui-block="datagrid-005"] thead th{
padding:0.5rem 0.875rem;background:var(--vibeui-datagrid-005-head);font-weight:600;
}
[data-vibeui-block="datagrid-005"] [data-part="static"]{
display:block;padding:0.4375rem 0.875rem;color:var(--vibeui-datagrid-005-muted);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;
}
/* Ячейка в покое — кнопка на всю ширину: правка обязана открываться
   с клавиатуры, а не только двойным щелчком. */
[data-vibeui-block="datagrid-005"] [data-part="cell"]{
display:flex;align-items:center;gap:0.375rem;width:100%;
appearance:none;border:0;background:none;cursor:text;font:inherit;
padding:0.4375rem 0.875rem;color:inherit;text-align:left;
border-radius:0;transition:background-color var(--vibeui-datagrid-005-dur-1) ease;
}
[data-vibeui-block="datagrid-005"] td[data-align="end"] [data-part="cell"]{justify-content:flex-end}
[data-vibeui-block="datagrid-005"] [data-part="cell"]:hover{background:var(--vibeui-datagrid-005-head)}
[data-vibeui-block="datagrid-005"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-datagrid-005-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-005"] [data-part="pen"]{
color:var(--vibeui-datagrid-005-muted);font-size:0.6875rem;opacity:0;
}
[data-vibeui-block="datagrid-005"] [data-part="cell"]:hover [data-part="pen"],
[data-vibeui-block="datagrid-005"] [data-part="cell"]:focus-visible [data-part="pen"]{opacity:1}
[data-vibeui-block="datagrid-005"] td[data-dirty="true"]{background:var(--vibeui-datagrid-005-dirty)}
[data-vibeui-block="datagrid-005"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-datagrid-005-accent);flex:none;color:oklch(from var(--vibeui-datagrid-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="datagrid-005"] input{
width:100%;font:inherit;font-size:0.8125rem;color:inherit;
padding:0.375rem 0.8125rem;margin:0;
border:2px solid var(--vibeui-datagrid-005-accent);border-radius:0.375rem;
background:var(--vibeui-datagrid-005-field);
}
[data-vibeui-block="datagrid-005"] td[data-align="end"] input{text-align:right}
[data-vibeui-block="datagrid-005"] input:focus{outline:none}
[data-vibeui-block="datagrid-005"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-005"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="datagrid-005"] [data-part="bar"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-005-border);}
[data-vibeui-block="datagrid-005"] [data-part="bar"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="datagrid-005"] [data-part="bar"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-005"] [data-part="bar"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-005-muted);}
[data-vibeui-block="datagrid-005"] [data-part="bar"] [data-part="status"]{margin:0;font-size:0.75rem;font-weight:600;color:var(--vibeui-datagrid-005-accent);}
[data-vibeui-block="datagrid-005"] [data-part="bar"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-005-border);
background:var(--vibeui-datagrid-005-field);color:var(--vibeui-datagrid-005-fg);}
[data-vibeui-block="datagrid-005"] [data-part="bar"] button[data-tone="primary"]{border-color:transparent;background:var(--vibeui-datagrid-005-accent);color:oklch(from var(--vibeui-datagrid-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="datagrid-005"] [data-part="bar"] button:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-005"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-005-accent);outline-offset:2px}
`

const DEFAULT_ROWS: Datagrid005Row[] = [
  { id: "p1", name: "Кресло Ostro", sku: "FUR-1042", price: 18900, stock: 42 },
  { id: "p2", name: "Лампа Pillar", sku: "LGT-0318", price: 6400, stock: 7 },
  { id: "p3", name: "Стол Grano", sku: "FUR-1188", price: 32500, stock: 15 },
  { id: "p4", name: "Полка Rift", sku: "STG-0455", price: 11200, stock: 23 },
  { id: "p5", name: "Ковёр Dune", sku: "TXT-0902", price: 24700, stock: 4 },
]

const COLUMNS: { key: Field; numeric?: boolean }[] = [
  { key: "name" },
  { key: "price", numeric: true },
  { key: "stock", numeric: true },
]

const COLUMN_LABEL: Record<string, string> = {
  sku: "Артикул",
  name: "Позиция",
  price: "Цена, ₽",
  stock: "Остаток",
}

function show(field: Field, raw: string) {
  if (field === "price") {
    const value = Number(raw)
    return Number.isFinite(value) ? value.toLocaleString("ru-RU") : raw
  }
  return raw
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
 * Сетка с правкой ячейки на месте: Enter подтверждает, Escape отменяет,
 * изменённые ячейки помечены до сохранения. Один файл, ноль зависимостей.
 */
type BarProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  statusText?: string
  hint?: string
  cancelLabel?: string
  saveLabel?: string
  dirty?: readonly [string, string][]
  save?: () => void
  setEditing?: (value: string | null) => void
  setEdits?: (value: Record<string, string>) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

function Bar({
  heading = "Прайс-лист",
  statusText = "Не сохранено: {count}",
  hint = "Цена и остаток редактируются",
  cancelLabel = "Отменить",
  saveLabel = "Сохранить",
  dirty = [],
  save = () => {},
  setEditing = () => {},
  setEdits = () => {},
  accent,
  className,
  style,
  ...props
}: BarProps) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <div
      {...props}
      className={className}
      style={palette}
      >
        <div data-part="bar-text">
          <h3 data-part="title">{heading}</h3>
          {dirty.length > 0 ? (
            <p data-part="status" aria-live="polite">
              {statusText.replace("{count}", String(dirty.length))}
            </p>
          ) : (
            <p data-part="hint">{hint}</p>
          )}
        </div>
        <button
          type="button"
          disabled={dirty.length === 0}
          onClick={() => {
            setEdits({})
            setEditing(null)
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          data-tone="primary"
          disabled={dirty.length === 0}
          onClick={save}
        >
          {saveLabel}
        </button>
      </div>
  )
}

export function Datagrid005({
  rows = DEFAULT_ROWS,
  caption = "Нажмите на ячейку или дойдите до неё табом и нажмите Enter",
  hint = "Цена и остаток редактируются",
  heading = "Прайс-лист",
  columnText = COLUMN_LABEL,
  statusText = "Не сохранено: {count}",
  cancelLabel = "Отменить",
  saveLabel = "Сохранить",
  editLabel = "Изменить: {column}, {row}, сейчас {value}",
  fieldLabel = "{column}, {row}",
  scrollLabel = "Таблица прайс-листа, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid005Props) {
  const [base, setBase] = useState(rows)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState("")

  const original = (row: Datagrid005Row, field: Field) => String(row[field])
  const current = (row: Datagrid005Row, field: Field) =>
    edits[`${row.id}.${field}`] ?? original(row, field)

  const dirty = Object.entries(edits).filter(([key, value]) => {
    const [id, field] = key.split(".") as [string, Field]
    const row = base.find((entry) => entry.id === id)
    return row ? value !== original(row, field) : false
  })

  const open = (row: Datagrid005Row, field: Field) => {
    setEditing(`${row.id}.${field}`)
    setDraft(current(row, field))
  }

  const commit = () => {
    if (!editing) return
    const trimmed = draft.trim()
    if (trimmed !== "") {
      setEdits((all) => ({ ...all, [editing]: trimmed }))
    }
    setEditing(null)
  }

  const save = () => {
    setBase((all) =>
      all.map((row) => {
        const next = { ...row }
        for (const column of COLUMNS) {
          const field = column.key
          const value = edits[`${row.id}.${field}`]
          if (value === undefined) continue
          if (field === "name") next.name = value
          else next[field] = Number(value) || 0
        }
        return next
      }),
    )
    setEdits({})
    setEditing(null)
  }

  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-005"
        className={className}
        style={palette}
      >
        <Bar data-part="bar" heading={heading} statusText={statusText} hint={hint} cancelLabel={cancelLabel} saveLabel={saveLabel} dirty={dirty} save={save} setEditing={setEditing} setEdits={setEdits} accent={accent} />
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">{label("sku")}</th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-align={column.numeric ? "end" : undefined}
                  >
                    {label(column.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {base.map((row) => (
                <tr key={row.id}>
                  <th scope="row">
                    <span data-part="static">{row.sku}</span>
                  </th>
                  {COLUMNS.map((column) => {
                    const key = `${row.id}.${column.key}`
                    const value = current(row, column.key)
                    const changed = value !== original(row, column.key)

                    return (
                      <td
                        key={column.key}
                        data-align={column.numeric ? "end" : undefined}
                        data-dirty={changed}
                      >
                        {editing === key ? (
                          <input
                            autoFocus
                            value={draft}
                            inputMode={column.numeric ? "numeric" : "text"}
                            aria-label={fieldLabel
                              .replace("{column}", label(column.key))
                              .replace("{row}", row.name)}
                            onChange={(event) => setDraft(event.target.value)}
                            onBlur={commit}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                commit()
                              }
                              if (event.key === "Escape") {
                                event.preventDefault()
                                setEditing(null)
                              }
                            }}
                          />
                        ) : (
                          <button
                            type="button"
                            data-part="cell"
                            aria-label={editLabel
                              .replace("{column}", label(column.key))
                              .replace("{row}", row.name)
                              .replace("{value}", value)}
                            onClick={() => open(row, column.key)}
                          >
                            {changed ? (
                              <span data-part="dot" aria-hidden="true" />
                            ) : null}
                            {show(column.key, value)}
                            <span data-part="pen" aria-hidden="true">
                              ✎
                            </span>
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
