import type { CSSProperties } from "react"

export type Solutions011Category = {
  name: string
  spent: number
  limit: number
  note?: string
}

export type Solutions011Props = {
  title?: string
  month?: string
  currency?: string
  categories?: Solutions011Category[]
  overLabel?: string
  leftLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: расходы по категориям с лимитами. Шкала у всех категорий общая —
// от самого большого лимита, поэтому категории сравнимы между собой, а не
// каждая со своим стопроцентным лимитом. На полосе стоит засечка лимита:
// перерасход рисуется продолжением за засечкой, а не упирается в край шкалы,
// поэтому видно и факт превышения, и его размер. Сверху итог месяца и остаток
// общего бюджета — категории объясняют, куда ушло, итог отвечает «сколько ещё».
const STYLES = `
:where([data-vibeui-block="solutions-011"]){
--vibeui-solutions-011-bg:oklch(1 0 0);
--vibeui-solutions-011-panel:oklch(0.975 0.004 90);
--vibeui-solutions-011-fg:oklch(0.22 0.014 80);
--vibeui-solutions-011-muted:oklch(0.55 0.012 80);
--vibeui-solutions-011-border:oklch(0.9 0.006 80);
--vibeui-solutions-011-accent:oklch(0.58 0.13 165);
--vibeui-solutions-011-over:oklch(0.58 0.19 25);
--vibeui-solutions-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-011"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-011-bg);
border:1px solid var(--vibeui-solutions-011-border);border-radius:1rem;
font-family:var(--vibeui-solutions-011-sans);color:var(--vibeui-solutions-011-fg);
}
[data-vibeui-block="solutions-011"] *{box-sizing:border-box}
[data-vibeui-block="solutions-011"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.75rem;
padding-bottom:0.875rem;border-bottom:1px solid var(--vibeui-solutions-011-border);
}
[data-vibeui-block="solutions-011"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-011"] [data-part="month"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-011-muted)}
[data-vibeui-block="solutions-011"] [data-part="totals"]{
display:flex;gap:1.25rem;margin:0;text-align:right;
}
[data-vibeui-block="solutions-011"] [data-part="figure"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-011"] [data-part="figure"] span{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-011-muted);
}
[data-vibeui-block="solutions-011"] [data-over="true"] b{color:var(--vibeui-solutions-011-over)}
[data-vibeui-block="solutions-011"] ul{
list-style:none;margin:0.875rem 0 0;padding:0;display:grid;gap:0.75rem;
}
@container (min-width: 42rem){
[data-vibeui-block="solutions-011"] ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem 1.25rem}
}
[data-vibeui-block="solutions-011"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.3125rem;
}
[data-vibeui-block="solutions-011"] [data-part="name"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-011"] [data-part="note"]{
display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-solutions-011-muted);
}
[data-vibeui-block="solutions-011"] [data-part="value"]{
font-size:0.8125rem;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="solutions-011"] [data-part="value"] b{font-weight:700}
[data-vibeui-block="solutions-011"] [data-part="value"] span{color:var(--vibeui-solutions-011-muted)}
/* Общая шкала для всех категорий: иначе каждая полоса живёт в своём масштабе. */
[data-vibeui-block="solutions-011"] [data-part="track"]{
position:relative;height:0.625rem;border-radius:0.375rem;overflow:hidden;
background:var(--vibeui-solutions-011-panel);
border:1px solid var(--vibeui-solutions-011-border);
}
[data-vibeui-block="solutions-011"] [data-part="fill"]{
display:block;height:100%;background:var(--vibeui-solutions-011-accent);
}
/* Перерасход продолжается за засечкой лимита, а не упирается в край шкалы. */
[data-vibeui-block="solutions-011"] [data-part="excess"]{
position:absolute;top:0;height:100%;
background:var(--vibeui-solutions-011-over);
background-image:repeating-linear-gradient(45deg,oklch(1 0 0 / 30%) 0 3px,transparent 3px 6px);
}
[data-vibeui-block="solutions-011"] [data-part="mark"]{
position:absolute;top:-0.125rem;bottom:-0.125rem;width:2px;border-radius:1px;
background:var(--vibeui-solutions-011-fg);
}
[data-vibeui-block="solutions-011"] [data-part="under"]{
display:flex;justify-content:space-between;gap:0.5rem;margin-top:0.25rem;
font-size:0.6875rem;color:var(--vibeui-solutions-011-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-011"] [data-state="over"] [data-part="under"] b{color:var(--vibeui-solutions-011-over)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATEGORIES: Solutions011Category[] = [
  {
    name: "Аренда и коммунальные",
    spent: 148000,
    limit: 150000,
    note: "офис на Гоголя",
  },
  { name: "Реклама", spent: 214000, limit: 180000, note: "контекст и посевы" },
  { name: "Подрядчики", spent: 96000, limit: 140000 },
  { name: "Софт и сервисы", spent: 61500, limit: 60000, note: "18 подписок" },
  { name: "Командировки", spent: 24000, limit: 80000 },
  { name: "Обучение", spent: 12000, limit: 40000, note: "два курса" },
]

function money(value: number, currency: string) {
  return `${value.toLocaleString("ru-RU")} ${currency}`
}

/**
 * Расходы по категориям: общая шкала, засечка лимита и перерасход за ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions011({
  title = "Расходы месяца",
  month = "Март · план 650 000 ₽",
  currency = "₽",
  categories = DEFAULT_CATEGORIES,
  overLabel = "перерасход",
  leftLabel = "остаток",
  accent,
  className,
  style,
}: Solutions011Props) {
  const spent = categories.reduce((sum, item) => sum + item.spent, 0)
  const planned = categories.reduce((sum, item) => sum + item.limit, 0)
  const scale = Math.max(...categories.map((item) => item.spent), planned, 1)
  const over = spent > planned

  const palette = {
    ...(accent ? { "--vibeui-solutions-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="month">{month}</p>
          </div>
          <p data-part="totals">
            <span data-part="figure">
              <b>{money(spent, currency)}</b>
              <span>потрачено</span>
            </span>
            <span data-part="figure" data-over={over ? "true" : "false"}>
              <b>
                {over ? "−" : ""}
                {money(Math.abs(planned - spent), currency)}
              </b>
              <span>{over ? overLabel : leftLabel}</span>
            </span>
          </p>
        </header>

        <ul>
          {categories.map((item) => {
            const state = item.spent > item.limit ? "over" : "ok"
            const base = Math.min(item.spent, item.limit)
            const excess = Math.max(0, item.spent - item.limit)

            return (
              <li key={item.name} data-state={state}>
                <p data-part="row">
                  <span data-part="name">
                    {item.name}
                    {item.note ? (
                      <span data-part="note">{item.note}</span>
                    ) : null}
                  </span>
                  <span data-part="value">
                    <b>{money(item.spent, currency)}</b>{" "}
                    <span>/ {money(item.limit, currency)}</span>
                  </span>
                </p>

                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={item.spent}
                  aria-valuemin={0}
                  aria-valuemax={item.limit}
                  aria-label={`${item.name}: потрачено ${money(item.spent, currency)} при лимите ${money(item.limit, currency)}`}
                >
                  <span
                    data-part="fill"
                    style={{ width: `${(base / scale) * 100}%` }}
                  />
                  {excess > 0 ? (
                    <span
                      data-part="excess"
                      style={{
                        left: `${(item.limit / scale) * 100}%`,
                        width: `${(excess / scale) * 100}%`,
                      }}
                    />
                  ) : null}
                  <span
                    data-part="mark"
                    aria-hidden="true"
                    style={{ left: `${(item.limit / scale) * 100}%` }}
                  />
                </div>

                <p data-part="under">
                  <span>лимит {money(item.limit, currency)}</span>
                  {excess > 0 ? (
                    <b>
                      {overLabel} {money(excess, currency)}
                    </b>
                  ) : (
                    <span>
                      {leftLabel} {money(item.limit - item.spent, currency)}
                    </span>
                  )}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
