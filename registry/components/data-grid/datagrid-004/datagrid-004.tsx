import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid004Row = {
  code: string
  operation: string
  account: string
  amount: number
}

export type Datagrid004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid004Row[]
  caption?: string
  height?: number
  /** Заголовок шапки над таблицей. */
  heading?: string
  /** Счётчик записей. {count} — сколько их. */
  countText?: string
  /** Названия колонок по ключу строки: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись строки итога. */
  totalLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Знак валюты в суммах. */
  currency?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный список, у которого при вертикальной прокрутке
// на месте остаются и шапка, и строка итога. Итог внизу — это не украшение:
// на середине списка сумма нужна чаще, чем в конце. Высота окна прокрутки
// задаётся числом в rem, а не пикселями, поэтому окно растёт вместе со
// шрифтом пользователя.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-004"]){
--vibeui-datagrid-004-bg:transparent;
--vibeui-datagrid-004-fg:light-dark(oklch(0.23 0.012 160),oklch(0.93 0.006 160));
--vibeui-datagrid-004-muted:light-dark(oklch(0.54 0.012 160),oklch(0.68 0.012 160));
--vibeui-datagrid-004-border:light-dark(oklch(0.92 0.006 160),oklch(0.34 0.012 160));
--vibeui-datagrid-004-head:light-dark(oklch(0.975 0.004 160),oklch(0.27 0.012 160));
--vibeui-datagrid-004-zebra:light-dark(oklch(0.985 0.003 160),oklch(0.24 0.01 160));
--vibeui-datagrid-004-accent:light-dark(oklch(0.5 0.13 162),oklch(0.76 0.12 162));
--vibeui-datagrid-004-negative:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.15 25));
--vibeui-datagrid-004-height:16rem;
--vibeui-datagrid-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-004"]{
box-sizing:border-box;width:100%;max-width:46rem;margin:0 auto;
background:var(--vibeui-datagrid-004-bg);color:var(--vibeui-datagrid-004-fg);
border:1px solid var(--vibeui-datagrid-004-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-004-font);overflow:hidden;
}
[data-vibeui-block="datagrid-004"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;padding:0.875rem;
}
[data-vibeui-block="datagrid-004"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-004"] [data-part="hint"]{
margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-datagrid-004-muted);
}
[data-vibeui-block="datagrid-004"] [data-part="scroll"]{
max-height:var(--vibeui-datagrid-004-height);overflow:auto;
border-top:1px solid var(--vibeui-datagrid-004-border);
}
[data-vibeui-block="datagrid-004"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-004-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-004"] table{
width:100%;border-collapse:separate;border-spacing:0;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-004"] caption{
padding:0.625rem 0.875rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-004-muted);
background:var(--vibeui-datagrid-004-bg);
}
[data-vibeui-block="datagrid-004"] th,
[data-vibeui-block="datagrid-004"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-004-border);
}
/* Липкая шапка: собственный фон обязателен, иначе строки просвечивают. */
[data-vibeui-block="datagrid-004"] thead th{
position:sticky;top:0;z-index:2;font-weight:600;
background:var(--vibeui-datagrid-004-head);
}
/* Липкий итог снизу — вторая опора взгляда при прокрутке середины. */
[data-vibeui-block="datagrid-004"] tfoot td{
position:sticky;bottom:0;z-index:2;font-weight:650;
background:var(--vibeui-datagrid-004-head);
border-top:1px solid var(--vibeui-datagrid-004-border);border-bottom:0;
}
[data-vibeui-block="datagrid-004"] tbody tr:nth-child(even) td,
[data-vibeui-block="datagrid-004"] tbody tr:nth-child(even) th{background:var(--vibeui-datagrid-004-zebra)}
[data-vibeui-block="datagrid-004"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-004"] [data-part="code"]{
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
font-size:0.75rem;color:var(--vibeui-datagrid-004-muted);font-weight:500;
}
[data-vibeui-block="datagrid-004"] [data-part="account"]{color:var(--vibeui-datagrid-004-muted)}
[data-vibeui-block="datagrid-004"] [data-sign="minus"]{color:var(--vibeui-datagrid-004-negative)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid004Row[] = [
  {
    code: "OP-3041",
    operation: "Оплата хостинга",
    account: "Основной",
    amount: -18400,
  },
  {
    code: "OP-3042",
    operation: "Поступление от Атлас",
    account: "Основной",
    amount: 96000,
  },
  {
    code: "OP-3043",
    operation: "Реклама, март",
    account: "Маркетинг",
    amount: -54300,
  },
  {
    code: "OP-3044",
    operation: "Поступление от Ветка",
    account: "Основной",
    amount: 72000,
  },
  {
    code: "OP-3045",
    operation: "Аренда",
    account: "Основной",
    amount: -120000,
  },
  {
    code: "OP-3046",
    operation: "Возврат Дельта",
    account: "Основной",
    amount: -7500,
  },
  {
    code: "OP-3047",
    operation: "Поступление от Гранат",
    account: "Основной",
    amount: 310000,
  },
  {
    code: "OP-3048",
    operation: "Подписка на аналитику",
    account: "Продукт",
    amount: -12800,
  },
  {
    code: "OP-3049",
    operation: "Командировка, Казань",
    account: "Продажи",
    amount: -31200,
  },
  {
    code: "OP-3050",
    operation: "Поступление от Ёлка",
    account: "Основной",
    amount: 48000,
  },
  {
    code: "OP-3051",
    operation: "Оборудование",
    account: "Продукт",
    amount: -88000,
  },
  {
    code: "OP-3052",
    operation: "Поступление от Берег",
    account: "Основной",
    amount: 12500,
  },
  {
    code: "OP-3053",
    operation: "Юридические услуги",
    account: "Основной",
    amount: -26000,
  },
  {
    code: "OP-3054",
    operation: "Партнёрская выплата",
    account: "Маркетинг",
    amount: -14700,
  },
]

const COLUMN_LABEL: Record<string, string> = {
  code: "Код",
  operation: "Операция",
  account: "Статья",
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
 * Сетка с закреплённой шапкой и закреплённой строкой итога при
 * вертикальной прокрутке. Серверный компонент, один файл.
 */
export function Datagrid004({
  rows = DEFAULT_ROWS,
  caption = "Движение по счетам за март",
  height = 16,
  heading = "Операции",
  countText = "{count} записей",
  columnText = COLUMN_LABEL,
  totalLabel = "Итог за период",
  scrollLabel = "Список операций, прокручивается вертикально",
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid004Props) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const money = (value: number) =>
    `${value.toLocaleString("ru-RU")} ${currency}`
  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    "--vibeui-datagrid-004-height": `${height}rem`,
    ...(accent ? { "--vibeui-datagrid-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-004"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{heading}</h3>
          <p data-part="hint">
            {countText.replace("{count}", String(rows.length))}
          </p>
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
                <th scope="col">{label("code")}</th>
                <th scope="col">{label("operation")}</th>
                <th scope="col">{label("account")}</th>
                <th scope="col" data-align="end">
                  {label("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.code}>
                  <th scope="row" data-part="code">
                    {row.code}
                  </th>
                  <td>{row.operation}</td>
                  <td data-part="account">{row.account}</td>
                  <td
                    data-align="end"
                    data-sign={row.amount < 0 ? "minus" : "plus"}
                  >
                    {money(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>{totalLabel}</td>
                <td data-align="end" data-sign={total < 0 ? "minus" : "plus"}>
                  {money(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
