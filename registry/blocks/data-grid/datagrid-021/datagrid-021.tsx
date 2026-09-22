"use client"

import { useState } from "react"
import { Card169 } from "@/registry/components/card/card-169/card-169"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid021Row = {
  id: string
  position: string
  unit: string
  quantity: number
  price: number
}

export type Datagrid021Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid021Row[]
  caption?: string
  editLabel?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Строка панели, когда правок нет. */
  noEditsText?: string
  /** Счётчик правок. {count} — число. */
  editsTemplate?: string
  /** Подпись кнопки сброса черновика. */
  revertAllText?: string
  /** Подпись кнопки сохранения черновика. */
  saveAllText?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись поля в ячейке. {field} и {position} — подстановки. */
  cellLabel?: string
  /** Заголовок журнала правок. */
  logText?: string
  /** Подпись кнопки отмены одной правки. */
  undoText?: string
  /** Подпись кнопки отмены для скринридера. {field} и {position}. */
  undoLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: правка идёт не по одной ячейке, а пачкой. Режим правки
// превращает все числовые ячейки в поля разом, черновик копится отдельно
// от базовых строк, а журнал изменений показывает пары «было → стало» с
// точечной отменой. Общее «Сохранить» переносит черновик в базу, общее
// «Отменить» выбрасывает его целиком — по одной ячейке ничего не уезжает.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-021"]){
--vibeui-datagrid-021-bg:transparent;
--vibeui-datagrid-021-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-021-muted:color-mix(in oklab,var(--vibeui-datagrid-021-fg) 68%,transparent);
--vibeui-datagrid-021-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-021-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-021-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-datagrid-021-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-datagrid-021-on-accent:oklch(from var(--vibeui-datagrid-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-021-dirty:light-dark(oklch(0.96 0 0),oklch(0.33 0 0));
--vibeui-datagrid-021-dirty-line:light-dark(oklch(0.305 0 0),oklch(0.899 0 0));
--vibeui-datagrid-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-021"]{color-scheme:dark}
[data-vibeui-block="datagrid-021"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-021-bg);color:var(--vibeui-datagrid-021-fg);
border:1px solid var(--vibeui-datagrid-021-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-021-font);overflow:hidden;
}
[data-vibeui-block="datagrid-021"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-021"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-021-border);
background:transparent;color:var(--vibeui-datagrid-021-fg);
}
[data-vibeui-block="datagrid-021"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-021"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:2px}
[data-vibeui-block="datagrid-021"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-021"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-021"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-021"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-021-muted);caption-side:top;
}
[data-vibeui-block="datagrid-021"] th,
[data-vibeui-block="datagrid-021"] td{
padding:0.375rem 0.875rem;text-align:left;white-space:nowrap;height:2.375rem;
border-top:1px solid var(--vibeui-datagrid-021-border);
}
[data-vibeui-block="datagrid-021"] thead th{background:var(--vibeui-datagrid-021-head);font-weight:600}
[data-vibeui-block="datagrid-021"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-021"] [data-part="input"]{
width:6rem;font:inherit;font-size:0.8125rem;text-align:right;color:inherit;
padding:0.1875rem 0.375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-datagrid-021-border);background:transparent;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="datagrid-021"] [data-part="input"]:focus-visible{outline:2px solid var(--vibeui-datagrid-021-accent);outline-offset:1px}
[data-vibeui-block="datagrid-021"] td[data-changed="true"]{background:var(--vibeui-datagrid-021-dirty)}
[data-vibeui-block="datagrid-021"] td[data-changed="true"] [data-part="input"]{border-color:var(--vibeui-datagrid-021-dirty-line)}
[data-vibeui-block="datagrid-021"] [data-part="log"]{
margin:0;padding:0.625rem 0.875rem 0.75rem;border-top:1px solid var(--vibeui-datagrid-021-border);
background:var(--vibeui-datagrid-021-panel);font-size:0.75rem;
}
[data-vibeui-block="datagrid-021"] [data-part="log"] h4{margin:0 0 0.375rem;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-datagrid-021-muted)}
[data-vibeui-block="datagrid-021"] [data-part="entry"]{
display:flex;align-items:center;gap:0.5rem;padding:0.1875rem 0;
}
[data-vibeui-block="datagrid-021"] [data-part="entry"] span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="datagrid-021"] [data-part="was"]{color:var(--vibeui-datagrid-021-muted);text-decoration:line-through;flex:none!important}
[data-vibeui-block="datagrid-021"] [data-part="now"]{font-weight:650;flex:none!important}
[data-vibeui-block="datagrid-021"] [data-part="undo"]{
padding:0.125rem 0.4375rem;font-size:0.6875rem;font-weight:550;border-radius:0.375rem;flex:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid021Row[] = [
  {
    id: "p1",
    position: "Профиль алюминиевый",
    unit: "м",
    quantity: 240,
    price: 410,
  },
  {
    id: "p2",
    position: "Уплотнитель EPDM",
    unit: "м",
    quantity: 180,
    price: 95,
  },
  {
    id: "p3",
    position: "Стеклопакет 4-16-4",
    unit: "м²",
    quantity: 62,
    price: 3400,
  },
  {
    id: "p4",
    position: "Фурнитура поворотная",
    unit: "компл.",
    quantity: 48,
    price: 1750,
  },
  {
    id: "p5",
    position: "Монтажная пена",
    unit: "балл.",
    quantity: 90,
    price: 380,
  },
]

type Draft = Record<string, number>

const FIELDS = ["quantity", "price"] as const

const COLUMN_TEXT: Record<string, string> = {
  position: "Позиция",
  unit: "Ед.",
  quantity: "Количество",
  price: "Цена",
  total: "Стоимость, ₽",
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
 * Сетка с пакетной правкой: все числовые ячейки редактируются разом,
 * журнал показывает «было → стало» с точечной отменой. Один файл.
 */
export function Datagrid021({
  rows = DEFAULT_ROWS,
  caption = "Правки копятся в черновике и уезжают одним сохранением",
  editLabel = "Режим правки",
  heading = "Спецификация заказа",
  noEditsText = "Несохранённых правок нет",
  editsTemplate = "Несохранённых правок: {count}",
  revertAllText = "Отменить всё",
  saveAllText = "Сохранить всё",
  columnText = COLUMN_TEXT,
  cellLabel = "{field}, {position}",
  logText = "Журнал правок",
  undoText = "Вернуть",
  undoLabel = "Отменить правку «{field}» в позиции «{position}»",
  scrollLabel = "Таблица спецификации, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid021Props) {
  // Сохранённые правки живут рядом с пропом, а не вместо него: смена rows
  // снаружи обязана переставить таблицу, иначе проп сработал бы один раз.
  const [saved, setSaved] = useState<Datagrid021Row[] | null>(null)
  const [seed, setSeed] = useState(rows)
  const [draft, setDraft] = useState<Draft>({})
  const [editing, setEditing] = useState(true)

  if (seed !== rows) {
    setSeed(rows)
    setSaved(null)
    setDraft({})
  }

  const base = saved ?? rows
  const entries = Object.entries(draft)
  const fieldText = (key: string) => columnText[key] ?? COLUMN_TEXT[key]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function valueOf(row: Datagrid021Row, key: "quantity" | "price") {
    const cell = `${row.id}:${key}`

    return draft[cell] ?? row[key]
  }

  return (
    <>
      <style href="vibeui-datagrid-021" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-021"
        className={className}
        style={palette}
      >
        <Card169 data-part="bar" heading={heading} noEditsText={noEditsText} editsTemplate={editsTemplate} editLabel={editLabel} revertAllText={revertAllText} rows={rows} saveAllText={saveAllText} editing={editing} entries={entries} setDraft={setDraft} setEditing={setEditing} setSaved={setSaved} valueOf={valueOf} accent={accent} />
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
                <th scope="col">
                  {columnText.position ?? COLUMN_TEXT.position}
                </th>
                <th scope="col">{columnText.unit ?? COLUMN_TEXT.unit}</th>
                {FIELDS.map((field) => (
                  <th key={field} scope="col" data-align="end">
                    {fieldText(field)}
                  </th>
                ))}
                <th scope="col" data-align="end">
                  {columnText.total ?? COLUMN_TEXT.total}
                </th>
              </tr>
            </thead>
            <tbody>
              {base.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.position}</th>
                  <td>{row.unit}</td>
                  {FIELDS.map((field) => {
                    const cell = `${row.id}:${field}`
                    const changed = draft[cell] !== undefined

                    return (
                      <td
                        key={field}
                        data-align="end"
                        data-changed={changed ? "true" : undefined}
                      >
                        {editing ? (
                          <input
                            data-part="input"
                            type="number"
                            min={0}
                            value={valueOf(row, field)}
                            aria-label={cellLabel
                              .replace("{field}", fieldText(field))
                              .replace("{position}", row.position)}
                            onChange={(event) => {
                              const next = Number(event.target.value)

                              setDraft((current) => {
                                const copy = { ...current }

                                if (Number.isNaN(next) || next === row[field]) {
                                  delete copy[cell]
                                } else {
                                  copy[cell] = next
                                }

                                return copy
                              })
                            }}
                          />
                        ) : (
                          valueOf(row, field).toLocaleString("ru-RU")
                        )}
                      </td>
                    )
                  })}
                  <td data-align="end">
                    {(
                      valueOf(row, "quantity") * valueOf(row, "price")
                    ).toLocaleString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length > 0 ? (
          <div data-part="log">
            <h4>{logText}</h4>
            {entries.map(([cell, next]) => {
              const [rowId, key] = cell.split(":")
              const row = base.find((item) => item.id === rowId)
              const field = FIELDS.find((item) => item === key)

              if (!row || !field) {
                return null
              }

              return (
                <p key={cell} data-part="entry">
                  <span>
                    {row.position} · {fieldText(field)}
                  </span>
                  <span data-part="was">
                    {row[field].toLocaleString("ru-RU")}
                  </span>
                  <span aria-hidden="true">→</span>
                  <span data-part="now">{next.toLocaleString("ru-RU")}</span>
                  <button
                    type="button"
                    data-part="undo"
                    aria-label={undoLabel
                      .replace("{field}", fieldText(field))
                      .replace("{position}", row.position)}
                    onClick={() =>
                      setDraft((current) => {
                        const copy = { ...current }
                        delete copy[cell]

                        return copy
                      })
                    }
                  >
                    {undoText}
                  </button>
                </p>
              )
            })}
          </div>
        ) : null}
      </section>
    </>
  )
}
