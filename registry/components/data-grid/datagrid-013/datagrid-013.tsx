"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid013Row = {
  id: string
  product: string
  vendor: string
  stock: number
  price: number
  updated: string
}

export type Datagrid013Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid013Row[]
  caption?: string
  menuLabel?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Счётчик показанных колонок. {shown} и {total} — числа. */
  countTemplate?: string
  /** Заголовок группы флажков в меню. */
  legendText?: string
  /** Названия колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Заголовок колонки артикула. */
  skuText?: string
  /** Подпись кнопки «показать все колонки». */
  resetText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Знак валюты в колонке цены. */
  currency?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: набор колонок выбирает читатель, а не разработчик.
// Меню видимости — не декоративный список, а группа настоящих чекбоксов
// в fieldset с legend: скринридер объявляет и группу, и каждое имя колонки.
// Последнюю видимую колонку выключить нельзя — таблица без колонок теряет
// смысл, поэтому её чекбокс блокируется, а не просто игнорируется.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-013"]){
--vibeui-datagrid-013-bg:transparent;
--vibeui-datagrid-013-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-013-muted:color-mix(in oklab,var(--vibeui-datagrid-013-fg) 68%,transparent);
--vibeui-datagrid-013-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-013-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-013-panel:light-dark(oklch(1 0 0),oklch(0.24 0 285));
--vibeui-datagrid-013-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-datagrid-013-low:light-dark(oklch(0.55 0.17 28),oklch(0.76 0.15 28));
--vibeui-datagrid-013-shadow:light-dark(oklch(0.23 0 285 / 14%),oklch(0 0 0 / 50%));
--vibeui-datagrid-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-013"]{color-scheme:dark}
[data-vibeui-block="datagrid-013"]{
box-sizing:border-box;width:100%;max-width:56rem;margin:0 auto;position:relative;
background:var(--vibeui-datagrid-013-bg);color:var(--vibeui-datagrid-013-fg);
border:1px solid var(--vibeui-datagrid-013-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-013-font);
}
[data-vibeui-block="datagrid-013"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-013"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-013-border);
}
[data-vibeui-block="datagrid-013"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-013"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-013-muted)}
[data-vibeui-block="datagrid-013"] [data-part="menu-wrap"]{position:relative}
[data-vibeui-block="datagrid-013"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-013-border);
background:transparent;color:var(--vibeui-datagrid-013-fg);
}
[data-vibeui-block="datagrid-013"] [data-part="trigger"][aria-expanded="true"]{
border-color:var(--vibeui-datagrid-013-accent);color:var(--vibeui-datagrid-013-accent);
}
[data-vibeui-block="datagrid-013"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-datagrid-013-accent);outline-offset:2px}
[data-vibeui-block="datagrid-013"] [data-part="trigger"]::after{content:"";width:0.375rem;height:0.375rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-1px) rotate(45deg)}
[data-vibeui-block="datagrid-013"] [data-part="menu"]{
position:absolute;inset-inline-end:0;inset-block-start:calc(100% + 0.375rem);z-index:5;
min-width:12rem;margin:0;padding:0.625rem 0.75rem 0.5rem;
border:1px solid var(--vibeui-datagrid-013-border);border-radius:0.75rem;
background:var(--vibeui-datagrid-013-panel);box-shadow:0 12px 28px var(--vibeui-datagrid-013-shadow);
}
[data-vibeui-block="datagrid-013"] [data-part="menu"] legend{
padding:0;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-datagrid-013-muted);
}
[data-vibeui-block="datagrid-013"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;padding:0.3125rem 0;font-size:0.8125rem;cursor:pointer;
}
[data-vibeui-block="datagrid-013"] [data-part="option"]:has(input:disabled){cursor:not-allowed;color:var(--vibeui-datagrid-013-muted)}
[data-vibeui-block="datagrid-013"] [data-part="option"] input{accent-color:var(--vibeui-datagrid-013-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="datagrid-013"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-datagrid-013-accent);outline-offset:2px}
[data-vibeui-block="datagrid-013"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;padding:0.25rem 0;margin-top:0.25rem;
border:0;border-top:1px solid var(--vibeui-datagrid-013-border);width:100%;text-align:start;
background:transparent;color:var(--vibeui-datagrid-013-accent);
}
[data-vibeui-block="datagrid-013"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-datagrid-013-accent);outline-offset:2px}
[data-vibeui-block="datagrid-013"] [data-part="scroll"]{overflow-x:auto;border-radius:0 0 0.875rem 0.875rem}
[data-vibeui-block="datagrid-013"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-013-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-013"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-013"] caption{
padding:0.625rem 0.875rem 0;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-013-muted);caption-side:top;
}
[data-vibeui-block="datagrid-013"] th,
[data-vibeui-block="datagrid-013"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-013-border);
}
[data-vibeui-block="datagrid-013"] thead th{background:var(--vibeui-datagrid-013-head);font-weight:600}
[data-vibeui-block="datagrid-013"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-013"] [data-part="sku"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;font-weight:500}
[data-vibeui-block="datagrid-013"] [data-low="true"]{color:var(--vibeui-datagrid-013-low);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-013"] *{animation:none!important;transition:none!important}}
`

type ColumnKey = "product" | "vendor" | "stock" | "price" | "updated"

const COLUMNS: { key: ColumnKey; numeric: boolean }[] = [
  { key: "product", numeric: false },
  { key: "vendor", numeric: false },
  { key: "stock", numeric: true },
  { key: "price", numeric: true },
  { key: "updated", numeric: false },
]

const COLUMN_TEXT: Record<string, string> = {
  product: "Товар",
  vendor: "Поставщик",
  stock: "Остаток",
  price: "Цена",
  updated: "Обновлено",
}

const DEFAULT_ROWS: Datagrid013Row[] = [
  {
    id: "SKU-4410",
    product: "Кресло «Тайга»",
    vendor: "Лесной цех",
    stock: 24,
    price: 18900,
    updated: "12 марта",
  },
  {
    id: "SKU-4411",
    product: "Стол «Плёс»",
    vendor: "Мебель Юга",
    stock: 3,
    price: 32400,
    updated: "11 марта",
  },
  {
    id: "SKU-4412",
    product: "Полка «Ветка»",
    vendor: "Лесной цех",
    stock: 61,
    price: 5400,
    updated: "12 марта",
  },
  {
    id: "SKU-4413",
    product: "Комод «Пойма»",
    vendor: "Север-Дом",
    stock: 8,
    price: 27600,
    updated: "9 марта",
  },
  {
    id: "SKU-4414",
    product: "Тумба «Исток»",
    vendor: "Север-Дом",
    stock: 0,
    price: 12300,
    updated: "8 марта",
  },
]

function cellValue(row: Datagrid013Row, key: ColumnKey, currency: string) {
  if (key === "price") {
    return `${row.price.toLocaleString("ru-RU")} ${currency}`
  }

  if (key === "stock") {
    return String(row.stock)
  }

  return row[key]
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
 * Сетка с меню видимости колонок: читатель сам собирает набор столбцов,
 * последняя видимая колонка защищена от выключения. Один файл, ноль зависимостей.
 */
export function Datagrid013({
  rows = DEFAULT_ROWS,
  caption = "Набор колонок настраивается в меню «Колонки»",
  menuLabel = "Колонки",
  heading = "Складские остатки",
  countTemplate = "Показано колонок: {shown} из {total}",
  legendText = "Видимость колонок",
  columnText = COLUMN_TEXT,
  skuText = "Артикул",
  resetText = "Показать все колонки",
  scrollLabel = "Таблица остатков, прокручивается вбок",
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid013Props) {
  const [hidden, setHidden] = useState<ColumnKey[]>(["updated"])
  const [open, setOpen] = useState(false)

  const visible = COLUMNS.filter((column) => !hidden.includes(column.key))
  const last = visible.length === 1

  const palette = {
    ...(accent ? { "--vibeui-datagrid-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-013"
        className={className}
        style={palette}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false)
          }
        }}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p data-part="count" aria-live="polite">
            {countTemplate
              .replace("{shown}", String(visible.length))
              .replace("{total}", String(COLUMNS.length))}
          </p>
          <div data-part="menu-wrap">
            <button
              type="button"
              data-part="trigger"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {menuLabel}
            </button>
            {open ? (
              <fieldset data-part="menu">
                <legend>{legendText}</legend>
                {COLUMNS.map((column) => {
                  const shown = !hidden.includes(column.key)

                  return (
                    <label key={column.key} data-part="option">
                      <input
                        type="checkbox"
                        checked={shown}
                        disabled={shown && last}
                        onChange={() =>
                          setHidden((current) =>
                            current.includes(column.key)
                              ? current.filter((key) => key !== column.key)
                              : [...current, column.key],
                          )
                        }
                      />
                      {columnText[column.key] ?? COLUMN_TEXT[column.key]}
                    </label>
                  )
                })}
                <button
                  type="button"
                  data-part="reset"
                  onClick={() => setHidden([])}
                >
                  {resetText}
                </button>
              </fieldset>
            ) : null}
          </div>
        </div>
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
                <th scope="col">{skuText}</th>
                {visible.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-align={column.numeric ? "end" : undefined}
                  >
                    {columnText[column.key] ?? COLUMN_TEXT[column.key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-part="sku">
                    {row.id}
                  </th>
                  {visible.map((column) => (
                    <td
                      key={column.key}
                      data-align={column.numeric ? "end" : undefined}
                      data-low={
                        column.key === "stock" && row.stock < 5
                          ? "true"
                          : undefined
                      }
                    >
                      {cellValue(row, column.key, currency)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
