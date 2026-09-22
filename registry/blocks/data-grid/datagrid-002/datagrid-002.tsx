"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid002Row = {
  id: string
  client: string
  plan: string
  seats: number
  amount: number
}

export type Datagrid002Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid002Row[]
  caption?: string
  actionLabel?: string
  /** Заголовок панели, пока ничего не выбрано. */
  heading?: string
  /** Подзаголовок с числом строк. {count} — сколько их. */
  countText?: string
  /** Счётчик выбранного. {count}, {total} и {sum} подставляются. */
  selectedText?: string
  /** Названия колонок по ключу строки: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись кнопки экспорта. */
  exportLabel?: string
  /** Подпись кнопки снятия выделения. */
  clearLabel?: string
  /** Подпись итоговой строки. */
  totalLabel?: string
  /** Подпись флажка шапки для скринридера. */
  selectAllLabel?: string
  /** Подпись флажка строки. {client} — имя клиента. */
  selectRowLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Знак валюты в суммах. */
  currency?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор строк живёт вместе с панелью массовых действий.
// Панель не появляется рывком поверх контента, а занимает то же место, что
// и обычная шапка: строки не прыгают. Счётчик выбранного объявлен
// aria-live, флажок шапки знает промежуточное состояние, а сумма по выбору
// считается на лету — ради неё выбор строк обычно и делают.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-002"]){
--vibeui-datagrid-002-bg:transparent;
--vibeui-datagrid-002-fg:light-dark(oklch(0.23 0 275),oklch(0.93 0 275));
--vibeui-datagrid-002-muted:color-mix(in oklab,var(--vibeui-datagrid-002-fg) 68%,transparent);
--vibeui-datagrid-002-border:light-dark(oklch(0.92 0 275),oklch(0.34 0 275));
--vibeui-datagrid-002-head:light-dark(oklch(0.975 0 275),oklch(0.27 0 275));
--vibeui-datagrid-002-btn:light-dark(oklch(1 0 0 / 80%),oklch(0.32 0 275 / 80%));
--vibeui-datagrid-002-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-datagrid-002-accent-soft:light-dark(oklch(0.275 0 0 / 9%),oklch(0.903 0 0 / 16%));
--vibeui-datagrid-002-on-accent:oklch(from var(--vibeui-datagrid-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-002-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-002"]{color-scheme:dark}
[data-vibeui-block="datagrid-002"]{
box-sizing:border-box;width:100%;max-width:60rem;margin:0 auto;
background:var(--vibeui-datagrid-002-bg);color:var(--vibeui-datagrid-002-fg);
border:1px solid var(--vibeui-datagrid-002-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-002-font);overflow:hidden;
}
[data-vibeui-block="datagrid-002"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-002"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-002"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-002"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-002"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-002-muted);
}
[data-vibeui-block="datagrid-002"] th,
[data-vibeui-block="datagrid-002"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-002-border);
}
[data-vibeui-block="datagrid-002"] thead th{background:var(--vibeui-datagrid-002-head);font-weight:600}
[data-vibeui-block="datagrid-002"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-002"] [data-part="pick"]{width:2.75rem;padding-right:0}
[data-vibeui-block="datagrid-002"] input[type="checkbox"]{
width:1rem;height:1rem;margin:0;cursor:pointer;accent-color:var(--vibeui-datagrid-002-accent);
}
[data-vibeui-block="datagrid-002"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:2px}
/* Выбранная строка помечена и заливкой, и полосой слева: одной заливки
   мало, когда рядом стоит наведённая мышью строка. */
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] td,
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] th{
background:var(--vibeui-datagrid-002-accent-soft);
}
[data-vibeui-block="datagrid-002"] tbody tr[data-selected="true"] [data-part="pick"]{
box-shadow:inset 3px 0 0 var(--vibeui-datagrid-002-accent);
}
[data-vibeui-block="datagrid-002"] [data-part="plan"]{color:var(--vibeui-datagrid-002-muted)}
[data-vibeui-block="datagrid-002"] tfoot td{
font-weight:650;background:var(--vibeui-datagrid-002-head);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-002"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="datagrid-002"] [data-part="bar"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
min-height:3.25rem;padding:0.625rem 0.875rem;
border-bottom:1px solid var(--vibeui-datagrid-002-border);
transition:background-color var(--vibeui-datagrid-002-dur-2) ease;}
[data-vibeui-block="datagrid-002"] [data-part="bar"][data-active="true"]{background:var(--vibeui-datagrid-002-accent-soft);}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="bar-title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="bar-note"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-002-muted);}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="count"]{font-size:0.875rem;font-weight:650;color:var(--vibeui-datagrid-002-accent);}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="actions"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-002-border);
background:var(--vibeui-datagrid-002-btn);color:var(--vibeui-datagrid-002-fg);}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="actions"] button[data-tone="primary"]{border-color:transparent;background:var(--vibeui-datagrid-002-accent);color:oklch(from var(--vibeui-datagrid-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="datagrid-002"] [data-part="bar"] [data-part="actions"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-002-accent);outline-offset:2px;}
`

const DEFAULT_ROWS: Datagrid002Row[] = [
  { id: "c-1", client: "Атлас", plan: "Команда", seats: 24, amount: 96000 },
  { id: "c-2", client: "Берег", plan: "Старт", seats: 5, amount: 12500 },
  { id: "c-3", client: "Ветка", plan: "Команда", seats: 18, amount: 72000 },
  { id: "c-4", client: "Гранат", plan: "Бизнес", seats: 60, amount: 310000 },
  { id: "c-5", client: "Дельта", plan: "Старт", seats: 3, amount: 7500 },
  { id: "c-6", client: "Ёлка", plan: "Команда", seats: 12, amount: 48000 },
]

const COLUMN_LABEL: Record<string, string> = {
  client: "Клиент",
  plan: "Тариф",
  seats: "Места",
  amount: "Сумма",
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
 * Сетка с выбором строк и панелью массовых действий: счётчик, сумма
 * по выбору и промежуточное состояние флажка шапки. Один файл.
 */
export type BarRow = {
  id: string
  client: string
  plan: string
  seats: number
  amount: number
}

const BarDEFAULT_ROWS: BarRow[] = [
  { id: "c-1", client: "Атлас", plan: "Команда", seats: 24, amount: 96000 },
  { id: "c-2", client: "Берег", plan: "Старт", seats: 5, amount: 12500 },
  { id: "c-3", client: "Ветка", plan: "Команда", seats: 18, amount: 72000 },
  { id: "c-4", client: "Гранат", plan: "Бизнес", seats: 60, amount: 310000 },
  { id: "c-5", client: "Дельта", plan: "Старт", seats: 3, amount: 7500 },
  { id: "c-6", client: "Ёлка", plan: "Команда", seats: 12, amount: 48000 },
]

type BarProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  selectedText?: string
  rows?: BarRow[]
  heading?: string
  countText?: string
  actionLabel?: string
  exportLabel?: string
  clearLabel?: string
  money?: (value: number) => string
  selected?: string[]
  setSelected?: (value: string[]) => void
  total?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function Bar({
  selectedText = "Выбрано {count} из {total} · {sum}",
  rows = BarDEFAULT_ROWS,
  heading = "Договоры на продление",
  countText = "{count} клиентов",
  actionLabel = "Выставить счёт",
  exportLabel = "Экспорт CSV",
  clearLabel = "Снять выделение",
  money = () => "",
  selected = [],
  setSelected = () => {},
  total = 0,
  accent,
  className,
  style,
  ...props
}: BarProps) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <div
      {...props} data-active={selected.length > 0}
      className={className}
      style={palette}
      >
        <div data-part="bar-text">
          {selected.length > 0 ? (
            <p data-part="count" aria-live="polite">
              {selectedText
                .replace("{count}", String(selected.length))
                .replace("{total}", String(rows.length))
                .replace("{sum}", money(total))}
            </p>
          ) : (
            <>
              <h3 data-part="bar-title">{heading}</h3>
              <p data-part="bar-note">
                {countText.replace("{count}", String(rows.length))}
              </p>
            </>
          )}
        </div>
        {selected.length > 0 ? (
          <div data-part="actions">
            <button type="button" data-tone="primary">
              {actionLabel}
            </button>
            <button type="button">{exportLabel}</button>
            <button type="button" onClick={() => setSelected([])}>
              {clearLabel}
            </button>
          </div>
        ) : null}
      </div>
  )
}

export function Datagrid002({
  rows = DEFAULT_ROWS,
  caption = "Отметьте строки, чтобы шапка превратилась в панель действий",
  actionLabel = "Выставить счёт",
  heading = "Договоры на продление",
  countText = "{count} клиентов",
  selectedText = "Выбрано {count} из {total} · {sum}",
  columnText = COLUMN_LABEL,
  exportLabel = "Экспорт CSV",
  clearLabel = "Снять выделение",
  totalLabel = "Итого по выбранным",
  selectAllLabel = "Выбрать все строки",
  selectRowLabel = "Выбрать {client}",
  scrollLabel = "Таблица договоров, прокручивается вбок",
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid002Props) {
  const [selected, setSelected] = useState<string[]>(["c-3"])

  const all = rows.length > 0 && selected.length === rows.length
  const some = selected.length > 0 && !all
  const total = rows
    .filter((row) => selected.includes(row.id))
    .reduce((sum, row) => sum + row.amount, 0)

  const toggleRow = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    )

  const money = (value: number) =>
    `${value.toLocaleString("ru-RU")} ${currency}`
  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-002"
        className={className}
        style={palette}
      >
        <Bar data-part="bar" selectedText={selectedText} rows={rows} heading={heading} countText={countText} actionLabel={actionLabel} exportLabel={exportLabel} clearLabel={clearLabel} money={money} selected={selected} setSelected={setSelected} total={total} accent={accent} />
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
                <th scope="col" data-part="pick">
                  <input
                    type="checkbox"
                    checked={all}
                    aria-label={selectAllLabel}
                    ref={(node) => {
                      if (node) node.indeterminate = some
                    }}
                    onChange={() =>
                      setSelected(all ? [] : rows.map((row) => row.id))
                    }
                  />
                </th>
                <th scope="col">{label("client")}</th>
                <th scope="col">{label("plan")}</th>
                <th scope="col" data-align="end">
                  {label("seats")}
                </th>
                <th scope="col" data-align="end">
                  {label("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const checked = selected.includes(row.id)

                return (
                  <tr key={row.id} data-selected={checked}>
                    <td data-part="pick">
                      <input
                        type="checkbox"
                        checked={checked}
                        aria-label={selectRowLabel.replace(
                          "{client}",
                          row.client,
                        )}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                    <th scope="row">{row.client}</th>
                    <td data-part="plan">{row.plan}</td>
                    <td data-align="end">{row.seats}</td>
                    <td data-align="end">{money(row.amount)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>{totalLabel}</td>
                <td data-align="end">{money(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
