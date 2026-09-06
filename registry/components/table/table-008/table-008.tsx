import type { ComponentProps, CSSProperties } from "react"

export type Table008Row = {
  time: string
  method: string
  path: string
  code: number
  ms: number
}

export type Table008Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table008Row[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: плотная таблица логов. Моноширинный шрифт и табличные цифры
// выравнивают адреса и коды в столбик, поэтому отличие в одном символе видно
// без чтения. Код ответа помечен точкой, а не только цветом: строки просматривают
// глазами по краю, и красный текст в потоке серого теряется.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-008"]){
--vibeui-table-008-bg:transparent;
--vibeui-table-008-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-008-muted:color-mix(in oklab,var(--vibeui-table-008-fg) 68%,transparent);
--vibeui-table-008-border:light-dark(oklch(0.93 0 265),oklch(0.36 0 265));
--vibeui-table-008-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-008-ok:light-dark(oklch(0.62 0.15 152),oklch(0.76 0.14 152));
--vibeui-table-008-warn:light-dark(oklch(0.72 0.15 75),oklch(0.82 0.14 75));
--vibeui-table-008-fail:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-table-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-table-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-008"]{color-scheme:dark}
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

const COLUMN_TEXT: Record<string, string> = {
  time: "Время",
  method: "Метод",
  path: "Адрес",
  code: "Код",
  ms: "мс",
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
  columnText = COLUMN_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table008Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-008-ok": accent } : null),
    ...(background
      ? {
          "--vibeui-table-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-008"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{columnText.time ?? COLUMN_TEXT.time}</th>
              <th scope="col">{columnText.method ?? COLUMN_TEXT.method}</th>
              <th scope="col">{columnText.path ?? COLUMN_TEXT.path}</th>
              <th scope="col">{columnText.code ?? COLUMN_TEXT.code}</th>
              <th scope="col" data-align="end">
                {columnText.ms ?? COLUMN_TEXT.ms}
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
