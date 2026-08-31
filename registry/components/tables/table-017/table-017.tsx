import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table017Row = {
  name: string
  city: string
  plan: string
  renew: string
  sum: string
}

export type Table017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table017Row[]
  caption?: string
  /** Минимальная ширина карточки в узкой раскладке. */
  cardWidth?: string
  accent?: string
}

// Идея компонента: на узкой ширине тело таблицы превращается не в столбик
// строк, а в сетку карточек — при 24–34rem их помещается две в ряд. Первая
// ячейка становится шапкой карточки на всю ширину, остальные — парами
// «подпись / значение» в два столбца. Подписи лежат в разметке рядом со
// значением и просто прячутся на широкой ширине, поэтому это одна таблица
// и на телефоне, и на десктопе — без второй вёрстки списком.
const STYLES = `
:where([data-vibeui-block="table-017"]){
--vibeui-table-017-bg:oklch(1 0 0);
--vibeui-table-017-fg:oklch(0.24 0.014 265);
--vibeui-table-017-muted:oklch(0.56 0.014 265);
--vibeui-table-017-border:oklch(0.92 0.006 265);
--vibeui-table-017-head:oklch(0.975 0.003 265);
--vibeui-table-017-accent:oklch(0.55 0.2 262);
--vibeui-table-017-card:14rem;
--vibeui-table-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-017"]{
container-type:inline-size;width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-017-font);color:var(--vibeui-table-017-fg);
}
[data-vibeui-block="table-017"] [data-part="shell"]{
background:var(--vibeui-table-017-bg);
border:1px solid var(--vibeui-table-017-border);border-radius:1rem;padding:0.25rem;
}
[data-vibeui-block="table-017"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-017"] caption{
padding:0.625rem 0.75rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-017"] th,
[data-vibeui-block="table-017"] td{
padding:0.5rem 0.75rem;text-align:left;
border-top:1px solid var(--vibeui-table-017-border);
}
[data-vibeui-block="table-017"] thead th{
background:var(--vibeui-table-017-head);font-weight:600;white-space:nowrap;
}
[data-vibeui-block="table-017"] tbody th{font-weight:600}
[data-vibeui-block="table-017"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="table-017"] [data-part="label"]{display:none}
/* Узкая ширина: tbody становится сеткой карточек. Правила висят на
   потомках, потому что контейнерный запрос не действует на сам контейнер. */
@container (max-width: 34rem){
[data-vibeui-block="table-017"] [data-part="shell"] thead{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="table-017"] [data-part="shell"] tbody{
display:grid;gap:0.5rem;padding:0.5rem;
grid-template-columns:repeat(auto-fill,minmax(var(--vibeui-table-017-card),1fr));
}
[data-vibeui-block="table-017"] [data-part="shell"] tr{
display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;
border:1px solid var(--vibeui-table-017-border);border-radius:0.75rem;
padding:0.625rem 0.75rem;background:var(--vibeui-table-017-bg);
box-shadow:0 1px 2px oklch(0.24 0.014 265 / 6%);
}
[data-vibeui-block="table-017"] [data-part="shell"] th,
[data-vibeui-block="table-017"] [data-part="shell"] td{
border:0;padding:0;text-align:left;
}
[data-vibeui-block="table-017"] [data-part="shell"] tbody th{
grid-column:1 / -1;font-size:0.9375rem;line-height:1.2;
padding-bottom:0.375rem;border-bottom:1px solid var(--vibeui-table-017-border);
}
[data-vibeui-block="table-017"] [data-part="shell"] [data-part="label"]{
display:block;font-size:0.6875rem;line-height:1.2;color:var(--vibeui-table-017-muted);
}
[data-vibeui-block="table-017"] [data-part="shell"] [data-part="value"]{
display:block;font-size:0.8125rem;
}
[data-vibeui-block="table-017"] [data-part="shell"] [data-align="end"]{text-align:left}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table017Row[] = [
  {
    name: "Мария Ким",
    city: "Казань",
    plan: "Команда",
    renew: "12 сентября",
    sum: "1 200 ₽",
  },
  {
    name: "Артём Волков",
    city: "Пермь",
    plan: "Бизнес",
    renew: "3 октября",
    sum: "3 900 ₽",
  },
  {
    name: "Лиза Наумова",
    city: "Тверь",
    plan: "Старт",
    renew: "—",
    sum: "0 ₽",
  },
  {
    name: "Гоша Рыбак",
    city: "Омск",
    plan: "Команда",
    renew: "28 сентября",
    sum: "1 200 ₽",
  },
]

const COLUMNS = [
  { key: "city", title: "Город" },
  { key: "plan", title: "Тариф" },
  { key: "renew", title: "Продление" },
  { key: "sum", title: "Сумма", numeric: true },
] as const

/**
 * Таблица, которая на узкой ширине раскладывается сеткой карточек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table017({
  rows = DEFAULT_ROWS,
  caption = "Подписки клиентов",
  cardWidth,
  accent,
  className,
  style,
  ...props
}: Table017Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-017-accent": accent } : null),
    ...(cardWidth ? { "--vibeui-table-017-card": cardWidth } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-017"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Клиент</th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-align={"numeric" in column ? "end" : undefined}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  {COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      data-align={"numeric" in column ? "end" : undefined}
                    >
                      <span data-part="label" aria-hidden="true">
                        {column.title}
                      </span>
                      <span data-part="value">{row[column.key]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
