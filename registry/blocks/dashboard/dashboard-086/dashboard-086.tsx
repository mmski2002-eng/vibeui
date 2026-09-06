import type { CSSProperties } from "react"

export type Dashboard086Branch = {
  name: string
  city: string
  revenue: number
  checks: number
  average: number
  nps: number
}

export type Dashboard086Metric = {
  key: "revenue" | "checks" | "average" | "nps"
  label: string
  unit: string
}

export type Dashboard086Props = {
  title?: string
  period?: string
  branches?: Dashboard086Branch[]
  metric?: Dashboard086Metric["key"]
  metrics?: Dashboard086Metric[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись перед числом среднего по сети. */
  meanLabel?: string
  /** Пояснение после среднего. */
  meanNote?: string
  /** Пометки лучшего и худшего филиала. */
  bestLabel?: string
  worstLabel?: string
  /** Разница со средним. Подставляется {delta}. */
  deltaText?: string
  /** Подпись полосы для читалки. {name}, {value}, {unit}, {delta}. */
  rowLabelText?: string
  /** Подпись центра шкалы под списком. */
  meanTick?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: филиалы сравнивают не с планом, а друг с другом, и вопрос звучит
// как «кто выбивается». Поэтому вместо столбиков от нуля здесь отклонение от
// среднего: ось стоит по центру, полоса уходит влево или вправо, и аутсайдер
// виден мгновенно. Само значение остаётся в таблице рядом — отклонение без
// абсолютной величины не даёт масштаба. Среднее подписано в шапке, иначе центр
// шкалы ничего не значит. Метрику переключают вкладками: в одной таблице
// смешивать рубли, штуки и баллы нельзя — шкала отклонений станет бессмысленной.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-086"]){
--vibeui-dashboard-086-bg:transparent;
/* Карточка списка и жёлоб оси: подложка самого блока прозрачна. */
--vibeui-dashboard-086-card:light-dark(oklch(1 0 0),oklch(0.26 0 220));
--vibeui-dashboard-086-inset:light-dark(oklch(0.985 0 220),oklch(0.22 0 220));
--vibeui-dashboard-086-fg:light-dark(oklch(0.21 0 220),oklch(0.94 0 220));
--vibeui-dashboard-086-muted:light-dark(oklch(0.54 0 220),oklch(0.72 0 220));
--vibeui-dashboard-086-border:light-dark(oklch(0.91 0 220),oklch(0.36 0 220));
--vibeui-dashboard-086-accent:light-dark(oklch(0.55 0.14 39.8),oklch(0.74 0.13 39.8));
--vibeui-dashboard-086-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-086-soft:light-dark(oklch(0.965 0 220),oklch(0.3 0 220));
--vibeui-dashboard-086-up:light-dark(oklch(0.58 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-086-down:light-dark(oklch(0.57 0.19 25),oklch(0.72 0.16 25));
--vibeui-dashboard-086-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-086"]{color-scheme:dark}
[data-vibeui-block="dashboard-086"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-086-bg);
color:var(--vibeui-dashboard-086-fg);
font-family:var(--vibeui-dashboard-086-sans);
border:1px solid var(--vibeui-dashboard-086-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-086"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-086"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-086"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-086"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-086"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-086-muted)}
[data-vibeui-block="dashboard-086"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:0.3125rem}
[data-vibeui-block="dashboard-086"] [data-part="tab"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.3125rem 0.6875rem;border-radius:9999px;background:var(--vibeui-dashboard-086-card);
color:inherit;border:1px solid var(--vibeui-dashboard-086-border);
}
[data-vibeui-block="dashboard-086"] [data-part="tab"][aria-pressed="true"]{
background:var(--vibeui-dashboard-086-accent);color:var(--vibeui-dashboard-086-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-086"] [data-part="mean"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-086-muted);
}
[data-vibeui-block="dashboard-086"] [data-part="mean"] b{color:var(--vibeui-dashboard-086-fg);font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-086"] [data-part="rows"]{
list-style:none;margin:0;padding:0.8125rem;display:flex;flex-direction:column;gap:0.4375rem;
border-radius:0.875rem;background:var(--vibeui-dashboard-086-card);
border:1px solid var(--vibeui-dashboard-086-border);
}
[data-vibeui-block="dashboard-086"] [data-part="row"]{display:grid;grid-template-columns:1fr;gap:0.1875rem 0.75rem;align-items:center}
[data-vibeui-block="dashboard-086"] [data-part="who"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem;min-width:0}
[data-vibeui-block="dashboard-086"] [data-part="who"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-086"] [data-part="who"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-086-muted)}
[data-vibeui-block="dashboard-086"] [data-part="mark"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
}
[data-vibeui-block="dashboard-086"] [data-part="mark"][data-kind="best"]{
color:var(--vibeui-dashboard-086-up);background:color-mix(in oklab,var(--vibeui-dashboard-086-up) 14%,light-dark(white,black));
}
[data-vibeui-block="dashboard-086"] [data-part="mark"][data-kind="worst"]{
color:var(--vibeui-dashboard-086-down);background:color-mix(in oklab,var(--vibeui-dashboard-086-down) 14%,light-dark(white,black));
}
/* Ось по центру: полоса растёт влево при отставании и вправо при опережении. */
[data-vibeui-block="dashboard-086"] [data-part="axis"]{
position:relative;height:1.25rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-086-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-086-border);
}
[data-vibeui-block="dashboard-086"] [data-part="axis"]::before{
content:"";position:absolute;left:50%;top:0;bottom:0;width:1px;
background:var(--vibeui-dashboard-086-border);
}
[data-vibeui-block="dashboard-086"] [data-part="dev"]{
position:absolute;top:0.3125rem;bottom:0.3125rem;border-radius:0.1875rem;
background:var(--vibeui-dashboard-086-up);
}
[data-vibeui-block="dashboard-086"] [data-part="dev"][data-neg="true"]{background:var(--vibeui-dashboard-086-down)}
[data-vibeui-block="dashboard-086"] [data-part="value"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;margin:0;font-size:0.6875rem;
font-variant-numeric:tabular-nums;color:var(--vibeui-dashboard-086-muted);white-space:nowrap;
}
[data-vibeui-block="dashboard-086"] [data-part="value"] b{color:var(--vibeui-dashboard-086-fg);font-weight:750;font-size:0.75rem}
[data-vibeui-block="dashboard-086"] [data-part="delta"]{font-weight:750}
[data-vibeui-block="dashboard-086"] [data-part="delta"][data-neg="true"]{color:var(--vibeui-dashboard-086-down)}
[data-vibeui-block="dashboard-086"] [data-part="delta"][data-neg="false"]{color:var(--vibeui-dashboard-086-up)}
[data-vibeui-block="dashboard-086"] [data-part="scale"]{
display:flex;justify-content:space-between;font-size:0.5625rem;color:var(--vibeui-dashboard-086-muted);
border-top:1px solid var(--vibeui-dashboard-086-border);padding-top:0.25rem;margin-top:0.125rem;
}
[data-vibeui-block="dashboard-086"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-086-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-086"] [data-part="row"]{grid-template-columns:12rem minmax(0,1fr) 13rem}
}
`

const DEFAULT_BRANCHES: Dashboard086Branch[] = [
  {
    name: "Тюмень, центральный",
    city: "Тюмень",
    revenue: 9.4,
    checks: 1840,
    average: 5.1,
    nps: 62,
  },
  {
    name: "Екатеринбург",
    city: "Свердловская обл.",
    revenue: 12.8,
    checks: 2410,
    average: 5.3,
    nps: 58,
  },
  {
    name: "Челябинск",
    city: "Челябинская обл.",
    revenue: 6.1,
    checks: 1520,
    average: 4.0,
    nps: 41,
  },
  {
    name: "Курган",
    city: "Курганская обл.",
    revenue: 3.2,
    checks: 780,
    average: 4.1,
    nps: 66,
  },
  {
    name: "Сургут",
    city: "ХМАО",
    revenue: 8.7,
    checks: 1210,
    average: 7.2,
    nps: 54,
  },
]

const DEFAULT_METRICS: Dashboard086Metric[] = [
  { key: "revenue", label: "Выручка", unit: "млн ₽" },
  { key: "checks", label: "Заказов", unit: "шт." },
  { key: "average", label: "Средний чек", unit: "тыс. ₽" },
  { key: "nps", label: "Оценка клиентов", unit: "NPS" },
]

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
 * Экран сравнения филиалов: вместо столбиков от нуля — отклонение от среднего с
 * осью по центру, абсолютное значение рядом, метрика переключается вкладками.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard086({
  title = "Сравнение филиалов",
  period = "май 2025, данные закрытого месяца",
  branches = DEFAULT_BRANCHES,
  metric = "revenue",
  metrics = DEFAULT_METRICS,
  accent,
  background = "",
  meanLabel = "Среднее по сети:",
  meanNote = "Полоса показывает отклонение филиала от этого среднего.",
  bestLabel = "лучший",
  worstLabel = "худший",
  deltaText = "{delta} к среднему",
  rowLabelText = "{name}: {value} {unit}, отклонение от среднего {delta}",
  meanTick = "среднее",
  className,
  style,
}: Dashboard086Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-086-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-086-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

  const active = metrics.find((entry) => entry.key === metric) ?? metrics[0]
  const values = branches.map((branch) => branch[active.key])
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const spread = Math.max(...values.map((value) => Math.abs(value - mean))) || 1
  const best = Math.max(...values)
  const worst = Math.min(...values)

  return (
    <>
      <style href="vibeui-dashboard-086" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-086"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
          </div>

          <div data-part="tabs">
            {metrics.map((entry) => (
              <button
                key={entry.key}
                type="button"
                data-part="tab"
                aria-pressed={entry.key === active.key}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <p data-part="mean">
            {meanLabel} <b>{mean.toFixed(1)}</b> {active.unit}. {meanNote}
          </p>

          <ul data-part="rows">
            {branches.map((branch) => {
              const value = branch[active.key]
              const delta = value - mean
              const width = (Math.abs(delta) / spread) * 50

              return (
                <li key={branch.name} data-part="row">
                  <p data-part="who">
                    <b>{branch.name}</b>
                    <span>{branch.city}</span>
                    {value === best ? (
                      <span data-part="mark" data-kind="best">
                        {bestLabel}
                      </span>
                    ) : null}
                    {value === worst ? (
                      <span data-part="mark" data-kind="worst">
                        {worstLabel}
                      </span>
                    ) : null}
                  </p>

                  <div
                    data-part="axis"
                    role="img"
                    aria-label={fill(rowLabelText, {
                      name: branch.name,
                      value: String(value),
                      unit: active.unit,
                      delta: delta.toFixed(1),
                    })}
                  >
                    <span
                      data-part="dev"
                      data-neg={delta < 0}
                      style={{
                        left: delta < 0 ? `${50 - width}%` : "50%",
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <p data-part="value">
                    <b>
                      {value} {active.unit}
                    </b>
                    <span data-part="delta" data-neg={delta < 0}>
                      {fill(deltaText, {
                        delta: `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`,
                      })}
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>

          <div data-part="scale">
            <span>−{spread.toFixed(1)}</span>
            <span>{meanTick}</span>
            <span>+{spread.toFixed(1)}</span>
          </div>
        </div>
      </section>
    </>
  )
}
