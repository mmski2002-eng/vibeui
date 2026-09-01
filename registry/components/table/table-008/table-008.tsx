import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table008Row = {
  time: string
  method: string
  path: string
  code: number
  ms: number
}

export type Table008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table008Row[]
  caption?: string
  accent?: string
}

// Идея компонента: плотная таблица логов. Моноширинный шрифт и табличные цифры
// выравнивают адреса и коды в столбик, поэтому отличие в одном символе видно
// без чтения. Код ответа помечен точкой, а не только цветом: строки просматривают
// глазами по краю, и красный текст в потоке серого теряется.
const STYLES = `
:where([data-vibeui-block="table-008"]){
--vibeui-table-008-bg:oklch(1 0 0);
--vibeui-table-008-fg:oklch(0.24 0.014 265);
--vibeui-table-008-muted:oklch(0.56 0.014 265);
--vibeui-table-008-border:oklch(0.93 0.005 265);
--vibeui-table-008-head:oklch(0.975 0.003 265);
--vibeui-table-008-ok:oklch(0.62 0.15 152);
--vibeui-table-008-warn:oklch(0.72 0.15 75);
--vibeui-table-008-fail:oklch(0.58 0.19 25);
--vibeui-table-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-table-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-008"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-008-bg);
border:1px solid var(--vibeui-table-008-border);border-radius:0.875rem;
font-family:var(--vibeui-table-008-font);color:var(--vibeui-table-008-fg);
}
[data-vibeui-block="table-008"] table{width:100%;border-collapse:collapse}
[data-vibeui-block="table-008"] caption{padding:0.625rem 0.75rem;text-align:left;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="table-008"] th,
[data-vibeui-block="table-008"] td{
padding:0.25rem 0.75rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-table-008-border);
}
[data-vibeui-block="table-008"] thead th{
background:var(--vibeui-table-008-head);
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-table-008-muted);
}
/* Моноширинные ячейки: адреса и коды сравнивают посимвольно. */
[data-vibeui-block="table-008"] tbody td{
font-family:var(--vibeui-table-008-mono);font-size:0.75rem;line-height:1.7;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="table-008"] [data-align="end"]{text-align:right}
[data-vibeui-block="table-008"] [data-part="time"],
[data-vibeui-block="table-008"] [data-part="ms"]{color:var(--vibeui-table-008-muted)}
[data-vibeui-block="table-008"] [data-part="method"]{font-weight:700}
/* Точка у кода: цвет в потоке серого теряется, форма — нет. */
[data-vibeui-block="table-008"] [data-part="code"]{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="table-008"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-table-008-ok);
}
[data-vibeui-block="table-008"] [data-tone="warn"] [data-part="dot"]{background:var(--vibeui-table-008-warn)}
[data-vibeui-block="table-008"] [data-tone="fail"] [data-part="dot"]{background:var(--vibeui-table-008-fail);border-radius:0.125rem}
[data-vibeui-block="table-008"] [data-tone="fail"] [data-part="code"]{color:var(--vibeui-table-008-fail);font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table008Row[] = [
  {
    time: "10:42:11",
    method: "GET",
    path: "/r/button-001.json",
    code: 200,
    ms: 34,
  },
  {
    time: "10:42:09",
    method: "GET",
    path: "/components/card-004",
    code: 200,
    ms: 128,
  },
  {
    time: "10:41:58",
    method: "POST",
    path: "/api/registry/build",
    code: 202,
    ms: 940,
  },
  {
    time: "10:41:40",
    method: "GET",
    path: "/r/table-404.json",
    code: 404,
    ms: 12,
  },
  { time: "10:41:22", method: "GET", path: "/c/hero-001", code: 200, ms: 51 },
]

function tone(code: number) {
  if (code >= 400) return "fail"
  if (code >= 300) return "warn"
  return "ok"
}

/**
 * Плотная таблица логов: моноширинные колонки и код ответа с точкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table008({
  rows = DEFAULT_ROWS,
  caption = "Последние запросы",
  accent,
  className,
  style,
  ...props
}: Table008Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-008-ok": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-008"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Время</th>
              <th scope="col">Метод</th>
              <th scope="col">Адрес</th>
              <th scope="col">Код</th>
              <th scope="col" data-align="end">
                мс
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.time}-${row.path}`} data-tone={tone(row.code)}>
                <td data-part="time">{row.time}</td>
                <td data-part="method">{row.method}</td>
                <td>{row.path}</td>
                <td>
                  <span data-part="code">
                    <span data-part="dot" aria-hidden="true" />
                    {row.code}
                  </span>
                </td>
                <td data-part="ms" data-align="end">
                  {row.ms}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
