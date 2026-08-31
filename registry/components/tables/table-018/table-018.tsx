import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table018Status = "ok" | "warn" | "error" | "off"

export type Table018Row = {
  service: string
  region: string
  latency: string
  updated: string
  status: Table018Status
}

export type Table018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table018Row[]
  caption?: string
  /** Плотность строк: "comfortable" — обычная, "compact" — для длинных списков. */
  density?: "comfortable" | "compact"
  accent?: string
}

// Идея компонента: состояние строки видно с края. Цветная кромка рисуется
// inset-тенью первой ячейки — обычный border-left при border-collapse
// схлопывается, — но цвет не единственный носитель смысла: рядом стоит
// подпись словом, поэтому таблица читается и в чёрно-белой печати.
const STYLES = `
:where([data-vibeui-block="table-018"]){
--vibeui-table-018-bg:oklch(1 0 0);
--vibeui-table-018-fg:oklch(0.24 0.014 265);
--vibeui-table-018-muted:oklch(0.56 0.014 265);
--vibeui-table-018-border:oklch(0.92 0.006 265);
--vibeui-table-018-head:oklch(0.975 0.003 265);
--vibeui-table-018-accent:oklch(0.55 0.2 262);
--vibeui-table-018-ok:oklch(0.55 0.14 155);
--vibeui-table-018-warn:oklch(0.68 0.15 75);
--vibeui-table-018-error:oklch(0.55 0.19 27);
--vibeui-table-018-off:oklch(0.72 0.01 265);
--vibeui-table-018-pad:0.5625rem;
--vibeui-table-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-018"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-018-font);color:var(--vibeui-table-018-fg);
}
[data-vibeui-block="table-018"][data-density="compact"]{--vibeui-table-018-pad:0.3125rem}
[data-vibeui-block="table-018"] [data-part="shell"]{
background:var(--vibeui-table-018-bg);
border:1px solid var(--vibeui-table-018-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-018"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-018"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-018-accent);outline-offset:-2px;
}
[data-vibeui-block="table-018"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:26rem}
[data-vibeui-block="table-018"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-018"] th,
[data-vibeui-block="table-018"] td{
padding:var(--vibeui-table-018-pad) 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-018-border);
}
[data-vibeui-block="table-018"] thead th{
background:var(--vibeui-table-018-head);font-weight:600;white-space:nowrap;
}
[data-vibeui-block="table-018"] tbody th{font-weight:600}
[data-vibeui-block="table-018"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Кромка: inset-тень вместо border-left — она не участвует в схлопывании. */
[data-vibeui-block="table-018"] tbody th:first-child{
box-shadow:inset 3px 0 0 var(--vibeui-table-018-edge);
padding-left:1rem;
}
[data-vibeui-block="table-018"] [data-status="ok"]{--vibeui-table-018-edge:var(--vibeui-table-018-ok)}
[data-vibeui-block="table-018"] [data-status="warn"]{--vibeui-table-018-edge:var(--vibeui-table-018-warn)}
[data-vibeui-block="table-018"] [data-status="error"]{--vibeui-table-018-edge:var(--vibeui-table-018-error)}
[data-vibeui-block="table-018"] [data-status="off"]{--vibeui-table-018-edge:var(--vibeui-table-018-off)}
[data-vibeui-block="table-018"] [data-status="error"] th,
[data-vibeui-block="table-018"] [data-status="error"] td{
background:color-mix(in oklab,var(--vibeui-table-018-error) 5%,transparent);
}
[data-vibeui-block="table-018"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.0625rem 0.4375rem 0.0625rem 0.3125rem;border-radius:9999px;
border:1px solid color-mix(in oklab,var(--vibeui-table-018-edge) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-table-018-edge) 10%,oklch(1 0 0));
font-size:0.6875rem;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="table-018"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-table-018-edge);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-018"] *{animation:none!important;transition:none!important}}
`

const LABELS: Record<Table018Status, string> = {
  ok: "Норма",
  warn: "Внимание",
  error: "Сбой",
  off: "Отключено",
}

const DEFAULT_ROWS: Table018Row[] = [
  {
    service: "Приём платежей",
    region: "Москва",
    latency: "42 мс",
    updated: "минуту назад",
    status: "ok",
  },
  {
    service: "Почтовые уведомления",
    region: "Франкфурт",
    latency: "310 мс",
    updated: "3 минуты назад",
    status: "warn",
  },
  {
    service: "Экспорт отчётов",
    region: "Москва",
    latency: "—",
    updated: "12 минут назад",
    status: "error",
  },
  {
    service: "Импорт из CRM",
    region: "Новосибирск",
    latency: "—",
    updated: "вчера",
    status: "off",
  },
  {
    service: "Хранилище файлов",
    region: "Москва",
    latency: "58 мс",
    updated: "минуту назад",
    status: "ok",
  },
]

/**
 * Таблица со статусом строки на левой кромке и подписью словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table018({
  rows = DEFAULT_ROWS,
  caption = "Состояние сервисов",
  density = "comfortable",
  accent,
  className,
  style,
  ...props
}: Table018Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-018"
        data-density={density}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">Сервис</th>
                  <th scope="col">Состояние</th>
                  <th scope="col">Регион</th>
                  <th scope="col" data-align="end">
                    Отклик
                  </th>
                  <th scope="col" data-align="end">
                    Проверка
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.service} data-status={row.status}>
                    <th scope="row">{row.service}</th>
                    <td>
                      <span data-part="chip">
                        <span data-part="dot" aria-hidden="true" />
                        {LABELS[row.status]}
                      </span>
                    </td>
                    <td>{row.region}</td>
                    <td data-align="end">{row.latency}</td>
                    <td data-align="end">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
