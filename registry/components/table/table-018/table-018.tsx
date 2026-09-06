import type { ComponentProps, CSSProperties } from "react"

export type Table018Status = "ok" | "warn" | "error" | "off"

export type Table018Row = {
  service: string
  region: string
  latency: string
  updated: string
  status: Table018Status
}

export type Table018Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table018Row[]
  caption?: string
  /** Плотность строк: "comfortable" — обычная, "compact" — для длинных списков. */
  density?: "comfortable" | "compact"
  /** Заголовки колонок: ключи service, status, region, latency и updated. */
  columnText?: Record<string, string>
  /** Подписи состояний: ключи ok, warn, error и off. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: состояние строки видно с края. Цветная кромка рисуется
// inset-тенью первой ячейки — обычный border-left при border-collapse
// схлопывается, — но цвет не единственный носитель смысла: рядом стоит
// подпись словом, поэтому таблица читается и в чёрно-белой печати.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-018"]){
--vibeui-table-018-bg:transparent;
--vibeui-table-018-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-018-muted:color-mix(in oklab,var(--vibeui-table-018-fg) 68%,transparent);
--vibeui-table-018-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-018-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-018-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-018-ok:light-dark(oklch(0.55 0.14 155),oklch(0.75 0.13 155));
--vibeui-table-018-warn:light-dark(oklch(0.68 0.15 75),oklch(0.82 0.14 75));
--vibeui-table-018-error:light-dark(oklch(0.55 0.19 27),oklch(0.74 0.16 27));
--vibeui-table-018-off:light-dark(oklch(0.72 0 265),oklch(0.6 0 265));
--vibeui-table-018-pad:0.5625rem;
--vibeui-table-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-018"]{color-scheme:dark}
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
background:color-mix(in oklab,var(--vibeui-table-018-edge) 12%,transparent);
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

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  service: "Сервис",
  status: "Состояние",
  region: "Регион",
  latency: "Отклик",
  updated: "Проверка",
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
 * Ветка темы для заданного фона: light-dark() смотрит на color-scheme, а не
 * на цвет подложки, поэтому светлую плашку приходится объявлять светлой.
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
 * Таблица со статусом строки на левой кромке и подписью словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table018({
  rows = DEFAULT_ROWS,
  caption = "Состояние сервисов",
  density = "comfortable",
  columnText = DEFAULT_COLUMN_TEXT,
  statusText = LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table018Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
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
                  <th scope="col">
                    {columnText.service ?? DEFAULT_COLUMN_TEXT.service}
                  </th>
                  <th scope="col">
                    {columnText.status ?? DEFAULT_COLUMN_TEXT.status}
                  </th>
                  <th scope="col">
                    {columnText.region ?? DEFAULT_COLUMN_TEXT.region}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.latency ?? DEFAULT_COLUMN_TEXT.latency}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.updated ?? DEFAULT_COLUMN_TEXT.updated}
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
                        {statusText[row.status] ?? LABELS[row.status]}
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
