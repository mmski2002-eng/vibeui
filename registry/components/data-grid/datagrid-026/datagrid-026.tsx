"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid026Row = {
  id: string
  model: string
  price: number
  power: number
  weight: number
  warranty: number
}

export type Datagrid026Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid026Row[]
  caption?: string
  showDelta?: boolean
  accent?: string
}

// Идея компонента: одна строка назначается эталоном и закрепляется прямо
// под шапкой, а остальные показывают отклонение от неё. Эталон выбирается
// радиокнопкой — это выбор одного из многих, флажок здесь соврал бы.
// Отклонение подписано знаком, а не только цветом: цвет один при
// дальтонизме не читается, а «дешевле» и «дороже» тут противоположны.
const STYLES = `
:where([data-vibeui-block="datagrid-026"]){
--vibeui-datagrid-026-bg:oklch(1 0 0);
--vibeui-datagrid-026-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-026-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-026-border:oklch(0.92 0.006 285);
--vibeui-datagrid-026-head:oklch(0.975 0.003 285);
--vibeui-datagrid-026-accent:oklch(0.5 0.16 30);
--vibeui-datagrid-026-pin:oklch(0.97 0.03 30);
--vibeui-datagrid-026-up:oklch(0.53 0.17 27);
--vibeui-datagrid-026-down:oklch(0.48 0.13 155);
--vibeui-datagrid-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-026"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-026-bg);color:var(--vibeui-datagrid-026-fg);
border:1px solid var(--vibeui-datagrid-026-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-026-font);overflow:hidden;
}
[data-vibeui-block="datagrid-026"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-026"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-026-border);
}
[data-vibeui-block="datagrid-026"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-026"] [data-part="mode"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-026-muted);cursor:pointer;
}
[data-vibeui-block="datagrid-026"] [data-part="mode"] input{accent-color:var(--vibeui-datagrid-026-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="datagrid-026"] [data-part="mode"] input:focus-visible{outline:2px solid var(--vibeui-datagrid-026-accent);outline-offset:2px}
[data-vibeui-block="datagrid-026"] [data-part="scroll"]{overflow:auto;max-height:22rem}
[data-vibeui-block="datagrid-026"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-026-accent);outline-offset:-2px}
/* Липкие строки требуют separate: со схлопнутыми границами они теряют линию. */
[data-vibeui-block="datagrid-026"] table{width:100%;border-collapse:separate;border-spacing:0;font-size:0.8125rem}
[data-vibeui-block="datagrid-026"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-026-muted);caption-side:top;
}
[data-vibeui-block="datagrid-026"] th,
[data-vibeui-block="datagrid-026"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-026-border);background:var(--vibeui-datagrid-026-bg);
}
[data-vibeui-block="datagrid-026"] thead th{
position:sticky;top:0;z-index:3;background:var(--vibeui-datagrid-026-head);font-weight:600;
}
[data-vibeui-block="datagrid-026"] [data-part="pinned"] th,
[data-vibeui-block="datagrid-026"] [data-part="pinned"] td{
position:sticky;top:2.0625rem;z-index:2;background:var(--vibeui-datagrid-026-pin);
border-bottom:2px solid var(--vibeui-datagrid-026-accent);
}
[data-vibeui-block="datagrid-026"] [data-part="pick"]{width:2.25rem;padding-inline:0.75rem}
[data-vibeui-block="datagrid-026"] input[type="radio"]{
width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-datagrid-026-accent);cursor:pointer;
}
[data-vibeui-block="datagrid-026"] input[type="radio"]:focus-visible{outline:2px solid var(--vibeui-datagrid-026-accent);outline-offset:2px}
[data-vibeui-block="datagrid-026"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-026"] [data-part="delta"]{
display:block;font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="datagrid-026"] [data-dir="up"]{color:var(--vibeui-datagrid-026-up)}
[data-vibeui-block="datagrid-026"] [data-dir="down"]{color:var(--vibeui-datagrid-026-down)}
[data-vibeui-block="datagrid-026"] [data-dir="same"]{color:var(--vibeui-datagrid-026-muted)}
[data-vibeui-block="datagrid-026"] [data-part="badge"]{
display:inline-block;margin-inline-start:0.375rem;padding:0.0625rem 0.375rem;border-radius:999px;
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
background:var(--vibeui-datagrid-026-accent);color:oklch(1 0 0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid026Row[] = [
  {
    id: "m1",
    model: "Аргон 120",
    price: 84900,
    power: 1.2,
    weight: 14.2,
    warranty: 24,
  },
  {
    id: "m2",
    model: "Аргон 180",
    price: 112400,
    power: 1.8,
    weight: 17.6,
    warranty: 24,
  },
  {
    id: "m3",
    model: "Вихрь Про",
    price: 96500,
    power: 1.5,
    weight: 12.9,
    warranty: 36,
  },
  {
    id: "m4",
    model: "Норд 200",
    price: 138000,
    power: 2.0,
    weight: 21.4,
    warranty: 12,
  },
  {
    id: "m5",
    model: "Кама Лайт",
    price: 61200,
    power: 0.9,
    weight: 9.8,
    warranty: 18,
  },
]

const COLUMNS = [
  { key: "price" as const, label: "Цена, ₽", digits: 0 },
  { key: "power" as const, label: "Мощность, кВт", digits: 1 },
  { key: "weight" as const, label: "Масса, кг", digits: 1 },
  { key: "warranty" as const, label: "Гарантия, мес.", digits: 0 },
]

function format(value: number, digits: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * Сетка с закреплённой строкой сравнения: выбранный эталон липнет под
 * шапкой, остальные строки показывают отклонение. Один файл.
 */
export function Datagrid026({
  rows = DEFAULT_ROWS,
  caption = "Выберите эталон радиокнопкой — остальные строки покажут отклонение",
  showDelta = true,
  accent,
  className,
  style,
  ...props
}: Datagrid026Props) {
  const [referenceId, setReferenceId] = useState(rows[2]?.id ?? rows[0].id)
  const [deltas, setDeltas] = useState(showDelta)

  const reference = rows.find((row) => row.id === referenceId) ?? rows[0]
  const others = rows.filter((row) => row.id !== reference.id)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  function renderRow(row: Datagrid026Row, pinned: boolean) {
    return (
      <tr key={row.id} data-part={pinned ? "pinned" : undefined}>
        <td data-part="pick">
          <input
            type="radio"
            name="vibeui-datagrid-026-reference"
            checked={row.id === reference.id}
            aria-label={`Сделать «${row.model}» эталоном сравнения`}
            onChange={() => setReferenceId(row.id)}
          />
        </td>
        <th scope="row">
          {row.model}
          {pinned ? <span data-part="badge">эталон</span> : null}
        </th>
        {COLUMNS.map((column) => {
          const value = row[column.key]
          const diff = value - reference[column.key]
          const dir = diff > 0 ? "up" : diff < 0 ? "down" : "same"

          return (
            <td key={column.key} data-align="end">
              {format(value, column.digits)}
              {!pinned && deltas ? (
                <span data-part="delta" data-dir={dir}>
                  {diff === 0
                    ? "как эталон"
                    : `${diff > 0 ? "+" : "−"}${format(Math.abs(diff), column.digits)}`}
                </span>
              ) : null}
            </td>
          )
        })}
      </tr>
    )
  }

  return (
    <>
      <style href="vibeui-datagrid-026" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-026"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Сравнение моделей</h3>
          <label data-part="mode">
            <input
              type="checkbox"
              checked={deltas}
              onChange={(event) => setDeltas(event.target.checked)}
            />
            Показывать отклонение
          </label>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица моделей, прокручивается"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="pick">
                  <span hidden>Эталон</span>
                </th>
                <th scope="col">Модель</th>
                {COLUMNS.map((column) => (
                  <th key={column.key} scope="col" data-align="end">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow(reference, true)}
              {others.map((row) => renderRow(row, false))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
