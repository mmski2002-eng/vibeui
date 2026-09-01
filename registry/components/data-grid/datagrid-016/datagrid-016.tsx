"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid016Row = {
  id: string
  campaign: string
  channel: string
  spend: number
  leads: number
  cpl: number
}

export type Datagrid016Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid016Row[]
  caption?: string
  aggregate?: "sum" | "avg" | "min" | "max"
  accent?: string
}

// Идея компонента: итог считается не по всей таблице, а по отмеченным
// строкам, и функцию свёртки выбирает читатель — сумма, среднее, минимум
// или максимум. Строка итога живёт в tfoot и меняет подпись вместе с
// выбранной функцией: «Итого» под средним значением врало бы.
const STYLES = `
:where([data-vibeui-block="datagrid-016"]){
--vibeui-datagrid-016-bg:oklch(1 0 0);
--vibeui-datagrid-016-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-016-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-016-border:oklch(0.92 0.006 285);
--vibeui-datagrid-016-head:oklch(0.975 0.003 285);
--vibeui-datagrid-016-accent:oklch(0.5 0.15 160);
--vibeui-datagrid-016-pick:oklch(0.97 0.03 160);
--vibeui-datagrid-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-016"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-016-bg);color:var(--vibeui-datagrid-016-fg);
border:1px solid var(--vibeui-datagrid-016-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-016-font);overflow:hidden;
}
[data-vibeui-block="datagrid-016"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-016"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-016-border);
}
[data-vibeui-block="datagrid-016"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-016"] [data-part="pickerLabel"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-016-muted);
}
[data-vibeui-block="datagrid-016"] select{
font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-datagrid-016-border);border-radius:0.4375rem;
background:var(--vibeui-datagrid-016-bg);
}
[data-vibeui-block="datagrid-016"] select:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:1px}
[data-vibeui-block="datagrid-016"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-016"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-016"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-016"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-016-muted);caption-side:top;
}
[data-vibeui-block="datagrid-016"] th,
[data-vibeui-block="datagrid-016"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-016-border);
}
[data-vibeui-block="datagrid-016"] thead th{background:var(--vibeui-datagrid-016-head);font-weight:600}
[data-vibeui-block="datagrid-016"] [data-part="check"]{width:2.5rem;padding-inline:0.75rem}
[data-vibeui-block="datagrid-016"] input[type="checkbox"]{
width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-datagrid-016-accent);cursor:pointer;
}
[data-vibeui-block="datagrid-016"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:2px}
[data-vibeui-block="datagrid-016"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] td,
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] th{background:var(--vibeui-datagrid-016-pick)}
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] [data-part="check"]{box-shadow:inset 3px 0 0 var(--vibeui-datagrid-016-accent)}
[data-vibeui-block="datagrid-016"] tfoot th,
[data-vibeui-block="datagrid-016"] tfoot td{
background:var(--vibeui-datagrid-016-head);font-weight:650;
border-top:2px solid var(--vibeui-datagrid-016-accent);
}
[data-vibeui-block="datagrid-016"] [data-part="none"]{font-weight:500;color:var(--vibeui-datagrid-016-muted)}
[data-vibeui-block="datagrid-016"] [data-part="channel"]{color:var(--vibeui-datagrid-016-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid016Row[] = [
  {
    id: "c1",
    campaign: "Весенний каталог",
    channel: "Поиск",
    spend: 184000,
    leads: 412,
    cpl: 447,
  },
  {
    id: "c2",
    campaign: "Ретаргетинг корзины",
    channel: "Соцсети",
    spend: 76500,
    leads: 289,
    cpl: 265,
  },
  {
    id: "c3",
    campaign: "Партнёрская рассылка",
    channel: "Почта",
    spend: 31000,
    leads: 96,
    cpl: 323,
  },
  {
    id: "c4",
    campaign: "Видеообзоры",
    channel: "Видео",
    spend: 212000,
    leads: 340,
    cpl: 624,
  },
  {
    id: "c5",
    campaign: "Локальные баннеры",
    channel: "Медийка",
    spend: 58000,
    leads: 121,
    cpl: 479,
  },
]

const AGGREGATES = {
  sum: { label: "Сумма", short: "Сумма по выделенным" },
  avg: { label: "Среднее", short: "Среднее по выделенным" },
  min: { label: "Минимум", short: "Минимум по выделенным" },
  max: { label: "Максимум", short: "Максимум по выделенным" },
} as const

function fold(values: number[], mode: keyof typeof AGGREGATES) {
  if (values.length === 0) {
    return 0
  }

  if (mode === "sum") {
    return values.reduce((total, value) => total + value, 0)
  }

  if (mode === "avg") {
    return values.reduce((total, value) => total + value, 0) / values.length
  }

  return mode === "min" ? Math.min(...values) : Math.max(...values)
}

/**
 * Сетка со строкой-итогом по выделенным строкам: функция свёртки
 * переключается на месте. Один файл, ноль зависимостей.
 */
export function Datagrid016({
  rows = DEFAULT_ROWS,
  caption = "Итог в подвале считается только по отмеченным строкам",
  aggregate = "sum",
  accent,
  className,
  style,
  ...props
}: Datagrid016Props) {
  const [picked, setPicked] = useState<string[]>(["c1", "c2"])
  const [mode, setMode] = useState<keyof typeof AGGREGATES>(aggregate)

  const selected = rows.filter((row) => picked.includes(row.id))
  const spend = fold(
    selected.map((row) => row.spend),
    mode,
  )
  const leads = fold(
    selected.map((row) => row.leads),
    mode,
  )
  const cpl = fold(
    selected.map((row) => row.cpl),
    mode,
  )

  const palette = {
    ...(accent ? { "--vibeui-datagrid-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-016"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Кампании квартала</h3>
          <label data-part="pickerLabel">
            Свёртка
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as keyof typeof AGGREGATES)
              }
            >
              {Object.entries(AGGREGATES).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица кампаний, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="check">
                  <span hidden>Выбор</span>
                </th>
                <th scope="col">Кампания</th>
                <th scope="col">Канал</th>
                <th scope="col" data-align="end">
                  Расход, ₽
                </th>
                <th scope="col" data-align="end">
                  Лидов
                </th>
                <th scope="col" data-align="end">
                  Цена лида, ₽
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const on = picked.includes(row.id)

                return (
                  <tr key={row.id} data-picked={on ? "true" : undefined}>
                    <td data-part="check">
                      <input
                        type="checkbox"
                        checked={on}
                        aria-label={`Учитывать кампанию «${row.campaign}» в итоге`}
                        onChange={() =>
                          setPicked((current) =>
                            current.includes(row.id)
                              ? current.filter((id) => id !== row.id)
                              : [...current, row.id],
                          )
                        }
                      />
                    </td>
                    <th scope="row">{row.campaign}</th>
                    <td data-part="channel">{row.channel}</td>
                    <td data-align="end">
                      {row.spend.toLocaleString("ru-RU")}
                    </td>
                    <td data-align="end">
                      {row.leads.toLocaleString("ru-RU")}
                    </td>
                    <td data-align="end">{row.cpl.toLocaleString("ru-RU")}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td data-part="check" />
                <th scope="row" colSpan={2} aria-live="polite">
                  {selected.length === 0 ? (
                    <span data-part="none">
                      Ни одна строка не отмечена — итог пуст
                    </span>
                  ) : (
                    `${AGGREGATES[mode].short}: ${selected.length}`
                  )}
                </th>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(spend).toLocaleString("ru-RU")}
                </td>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(leads).toLocaleString("ru-RU")}
                </td>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(cpl).toLocaleString("ru-RU")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
