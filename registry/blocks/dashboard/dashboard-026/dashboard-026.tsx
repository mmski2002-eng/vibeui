import type { CSSProperties } from "react"

export type Dashboard026Source = {
  name: string
  kind: string
  sessions: number
  share: number
  bounce: string
  delta: string
  trend?: "up" | "down" | "flat"
}

export type Dashboard026Props = {
  title?: string
  period?: string
  total?: string
  sources?: Dashboard026Source[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовки таблицы: source, sessions, share, bounce, change, total. */
  columnsText?: Record<string, string>
  /** Подпись под итогом в центре кольца. */
  ringLabel?: string
  /** Шаблон подписи кольца для скринридера: {list}. */
  ringAriaText?: string
  /** Локаль форматирования чисел. */
  locale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отчёт по трафику, где кольцо каналов и таблица источников
// стоят рядом и объясняют друг друга. Кольцо нарисовано conic-gradient с
// вырезом через mask — без библиотеки и без SVG. Доля источника продублирована
// заливкой ячейки: глаз сравнивает длины быстрее, чем читает проценты, а
// цифра рядом остаётся для точности. Сектор кольца подписан в легенде цифрой,
// потому что сегменты меньше пяти процентов на кольце не различаются.
const STYLES = `
:where([data-vibeui-block="dashboard-026"]){
--vibeui-dashboard-026-bg:transparent;
--vibeui-dashboard-026-panel:light-dark(oklch(0.985 0.003 265),oklch(0.27 0.012 265));
--vibeui-dashboard-026-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-026-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-026-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.011 265));
--vibeui-dashboard-026-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-026-soft:light-dark(color-mix(in oklab,var(--vibeui-dashboard-026-accent) 20%,white),color-mix(in oklab,var(--vibeui-dashboard-026-accent) 32%,black));
--vibeui-dashboard-026-up:light-dark(oklch(0.53 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-026-down:light-dark(oklch(0.55 0.18 25),oklch(0.73 0.16 25));
--vibeui-dashboard-026-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-026"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-026-bg);
color:var(--vibeui-dashboard-026-fg);
font-family:var(--vibeui-dashboard-026-sans);
border:1px solid var(--vibeui-dashboard-026-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-026"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-026"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:1.125rem;padding:1.125rem;
}
[data-vibeui-block="dashboard-026"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem;
}
[data-vibeui-block="dashboard-026"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-026"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-026-muted)}
[data-vibeui-block="dashboard-026"] [data-part="side"]{
display:grid;justify-items:center;gap:0.75rem;align-content:start;
background:var(--vibeui-dashboard-026-panel);
border:1px solid var(--vibeui-dashboard-026-border);border-radius:0.875rem;
padding:1rem;
}
/* Кольцо: conic-gradient с вырезом через mask — ни SVG, ни библиотеки. */
[data-vibeui-block="dashboard-026"] [data-part="ring"]{
position:relative;width:8.5rem;height:8.5rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-dashboard-026-ring));
-webkit-mask:radial-gradient(circle,transparent 54%,black 55%);
mask:radial-gradient(circle,transparent 54%,black 55%);
}
[data-vibeui-block="dashboard-026"] [data-part="ringtotal"]{
position:absolute;inset:0;display:grid;place-content:center;text-align:center;
}
[data-vibeui-block="dashboard-026"] [data-part="ringvalue"]{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-026"] [data-part="ringlabel"]{
display:block;font-size:0.625rem;color:var(--vibeui-dashboard-026-muted);
}
[data-vibeui-block="dashboard-026"] [data-part="legend"]{
width:100%;margin:0;padding:0;list-style:none;display:grid;gap:0.3125rem;
}
[data-vibeui-block="dashboard-026"] [data-part="legend"] li{
display:flex;align-items:center;gap:0.4375rem;font-size:0.6875rem;
}
[data-vibeui-block="dashboard-026"] [data-part="swatch"]{
width:0.625rem;height:0.625rem;border-radius:0.1875rem;flex:none;
background:oklch(var(--vibeui-dashboard-026-l) 0.13 262);
}
[data-vibeui-block="dashboard-026"] [data-part="legendshare"]{
margin-left:auto;font-variant-numeric:tabular-nums;color:var(--vibeui-dashboard-026-muted);
}
[data-vibeui-block="dashboard-026"] [data-part="tablewrap"]{overflow-x:auto}
[data-vibeui-block="dashboard-026"] table{width:100%;border-collapse:collapse;font-size:0.75rem}
[data-vibeui-block="dashboard-026"] th{
text-align:left;padding:0.375rem 0.625rem 0.375rem 0;white-space:nowrap;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-026-muted);
border-bottom:1px solid var(--vibeui-dashboard-026-border);
}
[data-vibeui-block="dashboard-026"] td{
padding:0.5rem 0.625rem 0.5rem 0;
border-bottom:1px solid var(--vibeui-dashboard-026-border);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-026"] tbody th{
font-size:0.75rem;font-weight:650;text-transform:none;letter-spacing:0;
color:inherit;padding-right:0.75rem;
}
[data-vibeui-block="dashboard-026"] [data-part="kind"]{
display:block;font-size:0.625rem;font-weight:500;color:var(--vibeui-dashboard-026-muted);
}
/* Доля залита фоном ячейки: длина сравнивается быстрее, чем читается число. */
[data-vibeui-block="dashboard-026"] [data-part="sharecell"]{
background:linear-gradient(90deg,var(--vibeui-dashboard-026-soft) var(--vibeui-dashboard-026-w),transparent 0);
background-clip:padding-box;padding-left:0.5rem;
}
[data-vibeui-block="dashboard-026"] [data-part="delta"]{font-weight:650}
[data-vibeui-block="dashboard-026"] [data-trend="up"] [data-part="delta"]{color:var(--vibeui-dashboard-026-up)}
[data-vibeui-block="dashboard-026"] [data-trend="down"] [data-part="delta"]{color:var(--vibeui-dashboard-026-down)}
[data-vibeui-block="dashboard-026"] tfoot td,
[data-vibeui-block="dashboard-026"] tfoot th{
border-bottom:0;font-weight:700;padding-top:0.5rem;
}
@container (min-width: 48rem){
[data-vibeui-block="dashboard-026"] [data-part="shell"]{grid-template-columns:1fr 15rem;padding:1.375rem}
[data-vibeui-block="dashboard-026"] [data-part="head"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SOURCES: Dashboard026Source[] = [
  {
    name: "Поиск",
    kind: "органический",
    sessions: 18420,
    share: 41,
    bounce: "38 %",
    delta: "+12 %",
    trend: "up",
  },
  {
    name: "Прямые заходы",
    kind: "по адресу",
    sessions: 9840,
    share: 22,
    bounce: "31 %",
    delta: "+3 %",
    trend: "up",
  },
  {
    name: "Реферальные",
    kind: "ссылки со статей",
    sessions: 7150,
    share: 16,
    bounce: "44 %",
    delta: "−6 %",
    trend: "down",
  },
  {
    name: "Соцсети",
    kind: "посты и рассылки",
    sessions: 5320,
    share: 12,
    bounce: "57 %",
    delta: "+21 %",
    trend: "up",
  },
  {
    name: "Реклама",
    kind: "оплаченный трафик",
    sessions: 4030,
    share: 9,
    bounce: "49 %",
    delta: "0 %",
    trend: "flat",
  },
]

const ARROW = { up: "↑", down: "↓", flat: "→" }

const DEFAULT_COLUMNS: Record<string, string> = {
  source: "Источник",
  sessions: "Сеансы",
  share: "Доля",
  bounce: "Отказы",
  change: "К прошлому периоду",
  total: "Всего",
}

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Отчёт по трафику: кольцо каналов на conic-gradient и таблица источников
 * с долей-заливкой. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard026({
  title = "Источники трафика",
  period = "1–14 марта, сравнение с прошлым периодом",
  total = "44 760",
  sources = DEFAULT_SOURCES,
  accent,
  background = "",
  columnsText = DEFAULT_COLUMNS,
  ringLabel = "сеансов",
  ringAriaText = "Доли каналов: {list}",
  locale = "ru-RU",
  className,
  style,
}: Dashboard026Props) {
  const column = (key: string) => columnsText[key] ?? DEFAULT_COLUMNS[key]
  const shades = sources.map((_, index) => 0.55 + index * 0.08)
  const ring = sources
    .map((source, index) => {
      const from = sources
        .slice(0, index)
        .reduce((sum, item) => sum + item.share, 0)
      const to = from + source.share
      return `oklch(${shades[index].toFixed(2)} 0.13 262) ${from}% ${to}%`
    })
    .join(",")

  const palette = {
    ...(accent ? { "--vibeui-dashboard-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-dashboard-026-ring": ring,
    ...style,
  } as CSSProperties

  const sessions = sources.reduce((sum, source) => sum + source.sessions, 0)

  return (
    <>
      <style href="vibeui-dashboard-026" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-026"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
          </header>

          <div data-part="tablewrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{column("source")}</th>
                  <th scope="col">{column("sessions")}</th>
                  <th scope="col">{column("share")}</th>
                  <th scope="col">{column("bounce")}</th>
                  <th scope="col">{column("change")}</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.name} data-trend={source.trend ?? "flat"}>
                    <th scope="row">
                      {source.name}
                      <span data-part="kind">{source.kind}</span>
                    </th>
                    <td>{source.sessions.toLocaleString(locale)}</td>
                    <td
                      data-part="sharecell"
                      style={
                        {
                          "--vibeui-dashboard-026-w": `${source.share}%`,
                        } as CSSProperties
                      }
                    >
                      {source.share} %
                    </td>
                    <td>{source.bounce}</td>
                    <td>
                      <span data-part="delta">
                        <span aria-hidden="true">
                          {ARROW[source.trend ?? "flat"]}
                        </span>{" "}
                        {source.delta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{column("total")}</th>
                  <td>{sessions.toLocaleString(locale)}</td>
                  <td>100 %</td>
                  <td>41 %</td>
                  <td>+7 %</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <aside data-part="side">
            <div
              data-part="ring"
              role="img"
              aria-label={ringAriaText.replace(
                "{list}",
                sources
                  .map((source) => `${source.name} ${source.share} %`)
                  .join(", "),
              )}
            >
              <span data-part="ringtotal">
                <span data-part="ringvalue">{total}</span>
                <span data-part="ringlabel">{ringLabel}</span>
              </span>
            </div>
            <ul data-part="legend">
              {sources.map((source, index) => (
                <li
                  key={source.name}
                  style={
                    {
                      "--vibeui-dashboard-026-l": shades[index].toFixed(2),
                    } as CSSProperties
                  }
                >
                  <span data-part="swatch" aria-hidden="true" />
                  {source.name}
                  <span data-part="legendshare">{source.share} %</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
