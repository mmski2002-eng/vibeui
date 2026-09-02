import type { CSSProperties } from "react"

export type Dashboard079Route = {
  path: string
  calls: number
  p50: number
  p95: number
  p99: number
  budget: number
}

export type Dashboard079Bucket = {
  label: string
  share: number
}

export type Dashboard079Props = {
  title?: string
  period?: string
  routes?: Dashboard079Route[]
  buckets?: Dashboard079Bucket[]
  budgetNote?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовок панели маршрутов. */
  routesTitle?: string
  /** Заголовок панели распределения. */
  histTitle?: string
  /** Число вызовов: {calls}. */
  callsText?: string
  /** Расшифровка дорожки: {path}, {p50}, {p95}, {p99}, {budget}, {unit}. */
  laneAriaText?: string
  /** Подписи перцентилей по ключам p50, p95 и p99. */
  percentileText?: Record<string, string>
  /** Единица времени. */
  unitText?: string
  /** Деление оси: {value}. */
  axisText?: string
  /** Доля бакета: {share}. */
  shareText?: string
  /** Локаль форматирования чисел. */
  numberLocale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: среднее время ответа не описывает ничего — страдают те, кто
// попал в хвост. Поэтому у каждого маршрута нарисована не одна цифра, а
// отрезок от p50 до p99 с точками перцентилей: длинный хвост виден формой.
// Бюджет отмечен засечкой на той же шкале, и маршрут, чей p95 правее засечки,
// подсвечивается — вопрос «укладываемся ли» решается взглядом. Шкала общая
// для всех строк, иначе отрезки несравнимы; её предел подписан. Ниже —
// распределение запросов по бакетам времени: оно объясняет, сколько людей
// вообще живёт в этом хвосте.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-079"]){
--vibeui-dashboard-079-bg:transparent;
/* Панель и жёлоб дорожки: подложка самого блока прозрачна. */
--vibeui-dashboard-079-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-dashboard-079-inset:light-dark(oklch(0.985 0.003 265),oklch(0.22 0.012 265));
--vibeui-dashboard-079-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-079-muted:light-dark(oklch(0.54 0.014 265),oklch(0.72 0.012 265));
--vibeui-dashboard-079-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-dashboard-079-accent:light-dark(oklch(0.52 0.15 265),oklch(0.74 0.13 265));
--vibeui-dashboard-079-soft:light-dark(oklch(0.965 0.02 265),oklch(0.3 0.035 265));
--vibeui-dashboard-079-over:light-dark(oklch(0.57 0.19 25),oklch(0.74 0.16 25));
--vibeui-dashboard-079-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-079-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-079"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-079-bg);
color:var(--vibeui-dashboard-079-fg);
font-family:var(--vibeui-dashboard-079-sans);
border:1px solid var(--vibeui-dashboard-079-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-079"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-079"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-079"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-079"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-079"] h3{margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-079-muted)}
[data-vibeui-block="dashboard-079"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-079-muted)}
[data-vibeui-block="dashboard-079"] [data-part="panel"]{
padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-079-card);border:1px solid var(--vibeui-dashboard-079-border);
}
[data-vibeui-block="dashboard-079"] [data-part="rows"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-079"] [data-part="row"]{display:grid;grid-template-columns:1fr;gap:0.1875rem 0.75rem;align-items:center}
[data-vibeui-block="dashboard-079"] [data-part="path"]{
font-family:var(--vibeui-dashboard-079-mono);font-size:0.75rem;font-weight:700;
overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-079"] [data-part="path"] span{
display:block;font-family:var(--vibeui-dashboard-079-sans);font-weight:400;font-size:0.625rem;
color:var(--vibeui-dashboard-079-muted);
}
[data-vibeui-block="dashboard-079"] [data-part="lane"]{
position:relative;height:1.375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-079-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-079-border);
}
[data-vibeui-block="dashboard-079"] [data-part="span"]{
position:absolute;top:50%;height:0.3125rem;transform:translateY(-50%);border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dashboard-079-accent) 32%,var(--vibeui-dashboard-079-card));
}
[data-vibeui-block="dashboard-079"] [data-over="true"] [data-part="span"]{
background:color-mix(in oklab,var(--vibeui-dashboard-079-over) 30%,var(--vibeui-dashboard-079-card));
}
[data-vibeui-block="dashboard-079"] [data-part="p"]{
position:absolute;top:50%;transform:translate(-50%,-50%);border-radius:50%;
background:var(--vibeui-dashboard-079-accent);box-shadow:0 0 0 2px var(--vibeui-dashboard-079-card);
}
[data-vibeui-block="dashboard-079"] [data-p="50"]{width:0.5rem;height:0.5rem}
[data-vibeui-block="dashboard-079"] [data-p="95"]{width:0.625rem;height:0.625rem}
[data-vibeui-block="dashboard-079"] [data-p="99"]{width:0.4375rem;height:0.4375rem;background:var(--vibeui-dashboard-079-fg)}
[data-vibeui-block="dashboard-079"] [data-over="true"] [data-p="95"]{background:var(--vibeui-dashboard-079-over)}
/* Засечка бюджета: правее неё — нарушение договорённости о скорости. */
[data-vibeui-block="dashboard-079"] [data-part="budget"]{
position:absolute;top:-0.125rem;bottom:-0.125rem;width:0.125rem;border-radius:9999px;
background:var(--vibeui-dashboard-079-fg);opacity:0.55;
}
[data-vibeui-block="dashboard-079"] [data-part="nums"]{
margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-079-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-079"] [data-part="nums"] b{color:var(--vibeui-dashboard-079-fg);font-weight:750}
[data-vibeui-block="dashboard-079"] [data-over="true"] [data-part="bad"]{color:var(--vibeui-dashboard-079-over);font-weight:750}
[data-vibeui-block="dashboard-079"] [data-part="axis"]{
display:flex;justify-content:space-between;font-size:0.625rem;color:var(--vibeui-dashboard-079-muted);
border-top:1px solid var(--vibeui-dashboard-079-border);padding-top:0.3125rem;margin-top:0.5rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-079"] [data-part="hist"]{
display:flex;align-items:flex-end;gap:0.25rem;height:5rem;
}
[data-vibeui-block="dashboard-079"] [data-part="bar"]{
flex:1 1 0;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:0.25rem;height:100%;
}
[data-vibeui-block="dashboard-079"] [data-part="bar"] i{
display:block;width:100%;border-radius:0.25rem 0.25rem 0 0;background:var(--vibeui-dashboard-079-accent);
}
[data-vibeui-block="dashboard-079"] [data-part="bar"]:last-child i{background:var(--vibeui-dashboard-079-over)}
[data-vibeui-block="dashboard-079"] [data-part="bar"] b{font-size:0.625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-079"] [data-part="labels"]{
display:flex;gap:0.25rem;margin-top:0.3125rem;font-size:0.5625rem;color:var(--vibeui-dashboard-079-muted);
}
[data-vibeui-block="dashboard-079"] [data-part="labels"] span{flex:1 1 0;text-align:center}
[data-vibeui-block="dashboard-079"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-079-muted);max-width:66ch}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-079"] [data-part="row"]{grid-template-columns:13rem minmax(0,1fr) 12rem}
}
`

const DEFAULT_ROUTES: Dashboard079Route[] = [
  {
    path: "GET /api/deals",
    calls: 1840000,
    p50: 84,
    p95: 310,
    p99: 720,
    budget: 400,
  },
  {
    path: "POST /api/deals/bulk",
    calls: 24000,
    p50: 340,
    p95: 1480,
    p99: 2960,
    budget: 1000,
  },
  {
    path: "GET /api/reports/revenue",
    calls: 96000,
    p50: 210,
    p95: 890,
    p99: 1640,
    budget: 1000,
  },
  {
    path: "GET /api/customers/search",
    calls: 640000,
    p50: 46,
    p95: 180,
    p99: 410,
    budget: 400,
  },
  {
    path: "POST /api/import/csv",
    calls: 3200,
    p50: 620,
    p95: 2400,
    p99: 4100,
    budget: 3000,
  },
]

const DEFAULT_BUCKETS: Dashboard079Bucket[] = [
  { label: "< 100 мс", share: 54 },
  { label: "100–300", share: 27 },
  { label: "300–600", share: 11 },
  { label: "0,6–1 с", share: 5 },
  { label: "1–3 с", share: 2 },
  { label: "> 3 с", share: 1 },
]

const PERCENTILE_TEXT: Record<string, string> = {
  p50: "p50",
  p95: "p95",
  p99: "p99",
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
 * Страница производительности: у каждого маршрута отрезок от p50 до p99 с
 * точками перцентилей на общей шкале и засечкой бюджета, ниже — распределение
 * запросов по бакетам. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard079({
  title = "Производительность API",
  period = "за последние 24 часа, 2,6 млн запросов",
  routes = DEFAULT_ROUTES,
  buckets = DEFAULT_BUCKETS,
  budgetNote = "Бюджет — это обещание пользователю, а не среднее по больнице: маршрут считается нарушившим, когда за границу выходит p95, а не среднее время.",
  accent,
  background = "",
  routesTitle = "Маршруты: разброс времени ответа",
  histTitle = "Сколько запросов сколько ждало",
  callsText = "{calls} вызовов",
  laneAriaText = "{path}: p50 {p50} {unit}, p95 {p95} {unit}, p99 {p99} {unit}, бюджет {budget} {unit}",
  percentileText = PERCENTILE_TEXT,
  unitText = "мс",
  axisText = "{value} мс",
  shareText = "{share} %",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard079Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-079-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-079-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const percentiles = { ...PERCENTILE_TEXT, ...percentileText }
  const scale = Math.max(...routes.map((route) => route.p99)) * 1.05
  const at = (value: number) => Math.min(100, (value / scale) * 100)
  const peak = Math.max(...buckets.map((bucket) => bucket.share))

  return (
    <>
      <style href="vibeui-dashboard-079" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-079"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
          </div>

          <div data-part="panel">
            <h3>{routesTitle}</h3>
            <ul data-part="rows">
              {routes.map((route) => {
                const over = route.p95 > route.budget

                return (
                  <li key={route.path} data-part="row" data-over={over}>
                    <p data-part="path">
                      {route.path}
                      <span>
                        {callsText.replace(
                          "{calls}",
                          route.calls.toLocaleString(numberLocale),
                        )}
                      </span>
                    </p>

                    <div
                      data-part="lane"
                      role="img"
                      aria-label={laneAriaText
                        .replace("{path}", route.path)
                        .replace("{p50}", String(route.p50))
                        .replace("{p95}", String(route.p95))
                        .replace("{p99}", String(route.p99))
                        .replace("{budget}", String(route.budget))
                        .replaceAll("{unit}", unitText)}
                    >
                      <span
                        data-part="span"
                        style={{
                          left: `${at(route.p50)}%`,
                          width: `${at(route.p99) - at(route.p50)}%`,
                        }}
                      />
                      <span
                        data-part="p"
                        data-p="50"
                        style={{ left: `${at(route.p50)}%` }}
                      />
                      <span
                        data-part="p"
                        data-p="95"
                        style={{ left: `${at(route.p95)}%` }}
                      />
                      <span
                        data-part="p"
                        data-p="99"
                        style={{ left: `${at(route.p99)}%` }}
                      />
                      <span
                        data-part="budget"
                        style={{ left: `${at(route.budget)}%` }}
                      />
                    </div>

                    <p data-part="nums">
                      <span>
                        {percentiles.p50} <b>{route.p50}</b>
                      </span>
                      <span data-part="bad">
                        {percentiles.p95} <b>{route.p95}</b>
                      </span>
                      <span>
                        {percentiles.p99} <b>{route.p99}</b> {unitText}
                      </span>
                    </p>
                  </li>
                )
              })}
            </ul>

            <div data-part="axis">
              <span>{axisText.replace("{value}", "0")}</span>
              <span>
                {axisText.replace("{value}", String(Math.round(scale / 2)))}
              </span>
              <span>
                {axisText.replace("{value}", String(Math.round(scale)))}
              </span>
            </div>
          </div>

          <div data-part="panel">
            <h3>{histTitle}</h3>
            <div data-part="hist">
              {buckets.map((bucket) => (
                <div key={bucket.label} data-part="bar">
                  <b>{shareText.replace("{share}", String(bucket.share))}</b>
                  <i style={{ height: `${(bucket.share / peak) * 100}%` }} />
                </div>
              ))}
            </div>
            <div data-part="labels">
              {buckets.map((bucket) => (
                <span key={bucket.label}>{bucket.label}</span>
              ))}
            </div>
          </div>

          <p data-part="note">{budgetNote}</p>
        </div>
      </section>
    </>
  )
}
