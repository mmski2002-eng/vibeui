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
  accent?: string
}

// Идея компонента: длинный список, у которого при вертикальной прокрутке
// на месте остаются и шапка, и строка итога. Итог внизу — это не украшение:
// на середине списка сумма нужна чаще, чем в конце. Высота окна прокрутки
// задаётся числом в rem, а не пикселями, поэтому окно растёт вместе со
// шрифтом пользователя.
const STYLES = `
:where([data-vibeui-block="datagrid-004"]){
--vibeui-datagrid-004-bg:oklch(1 0 0);
--vibeui-datagrid-004-fg:oklch(0.23 0.012 160);
--vibeui-datagrid-004-muted:oklch(0.54 0.012 160);
--vibeui-datagrid-004-border:oklch(0.92 0.006 160);
--vibeui-datagrid-004-head:oklch(0.975 0.004 160);
--vibeui-datagrid-004-zebra:oklch(0.985 0.003 160);
--vibeui-datagrid-004-accent:oklch(0.5 0.13 162);
--vibeui-datagrid-004-negative:oklch(0.55 0.19 25);
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

/**
 * Сетка с закреплённой шапкой и закреплённой строкой итога при
 * вертикальной прокрутке. Серверный компонент, один файл.
 */
export function Datagrid004({
  rows = DEFAULT_ROWS,
  caption = "Движение по счетам за март",
  height = 16,
  accent,
  className,
  style,
  ...props
}: Datagrid004Props) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0)

  const palette = {
    "--vibeui-datagrid-004-height": `${height}rem`,
    ...(accent ? { "--vibeui-datagrid-004-accent": accent } : null),
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
          <h3 data-part="title">Операции</h3>
          <p data-part="hint">{rows.length} записей</p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Список операций, прокручивается вертикально"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Код</th>
                <th scope="col">Операция</th>
                <th scope="col">Статья</th>
                <th scope="col" data-align="end">
                  Сумма
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
                    {row.amount.toLocaleString("ru-RU")} ₽
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Итог за период</td>
                <td data-align="end" data-sign={total < 0 ? "minus" : "plus"}>
                  {total.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
