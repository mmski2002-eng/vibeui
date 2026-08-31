import type { CSSProperties } from "react"

export type Solutions050Tier = {
  name: string
  threshold: number
  cashback: number
  perk: string
}

export type Solutions050Batch = {
  points: number
  expires: string
  daysLeft: number
}

export type Solutions050Props = {
  title?: string
  clientName?: string
  spend?: number
  tiers?: Solutions050Tier[]
  batches?: Solutions050Batch[]
  currency?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: уровни программы лояльности. Текущий уровень и остаток до
// следующего — не пропы с готовым текстом, а вывод из накопленной суммы
// и порогов: так витрина не разъедется с фактом при смене данных. Шкала
// уровней — один градиентный трек с засечками порогов и меткой позиции
// клиента: прогресс виден геометрией, а не только числом. Баллы, которым
// скоро сгорать, помечены не только цветом даты, но и словом «скоро».
const STYLES = `
:where([data-vibeui-block="solutions-050"]){
--vibeui-solutions-050-bg:oklch(1 0 0);
--vibeui-solutions-050-panel:oklch(0.977 0.004 250);
--vibeui-solutions-050-fg:oklch(0.21 0.014 265);
--vibeui-solutions-050-muted:oklch(0.55 0.014 265);
--vibeui-solutions-050-border:oklch(0.9 0.006 265);
--vibeui-solutions-050-accent:oklch(0.55 0.16 70);
--vibeui-solutions-050-track:oklch(0.93 0.006 265);
--vibeui-solutions-050-soon:oklch(0.58 0.2 25);
--vibeui-solutions-050-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-050-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-050"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-050-bg);
border:1px solid var(--vibeui-solutions-050-border);border-radius:1rem;
font-family:var(--vibeui-solutions-050-sans);color:var(--vibeui-solutions-050-fg);
}
[data-vibeui-block="solutions-050"] *{box-sizing:border-box}
[data-vibeui-block="solutions-050"] [data-part="head"]{
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-050"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-050"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-050-muted)}
[data-vibeui-block="solutions-050"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
@container (min-width:30rem){
[data-vibeui-block="solutions-050"] [data-part="summary"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="solutions-050"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-050-panel);
border:1px solid var(--vibeui-solutions-050-border);
}
[data-vibeui-block="solutions-050"] [data-part="tile"] b{
display:block;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="solutions-050"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-050-muted);
}
/* Трек уровней: позиция клиента — прогресс-бар с засечками порогов сверху. */
[data-vibeui-block="solutions-050"] [data-part="scale"]{padding:0 1rem 0.5rem}
[data-vibeui-block="solutions-050"] [data-part="track"]{
position:relative;height:0.625rem;border-radius:9999px;
background:var(--vibeui-solutions-050-track);overflow:hidden;
}
[data-vibeui-block="solutions-050"] [data-part="fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-050-accent);
}
[data-vibeui-block="solutions-050"] [data-part="ticks"]{
position:relative;height:1.125rem;margin-top:0.25rem;
}
[data-vibeui-block="solutions-050"] [data-part="tick"]{
position:absolute;top:0;transform:translateX(-50%);
font-size:0.625rem;color:var(--vibeui-solutions-050-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-050"] [data-part="tick"][data-current="true"]{
color:var(--vibeui-solutions-050-accent);font-weight:700;
}
[data-vibeui-block="solutions-050"] [data-part="cards"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0.5rem 1rem;
}
@container (min-width:30rem){
[data-vibeui-block="solutions-050"] [data-part="cards"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="solutions-050"] [data-part="card"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-solutions-050-border);background:var(--vibeui-solutions-050-bg);
}
[data-vibeui-block="solutions-050"] [data-part="card"][data-current="true"]{
border-color:var(--vibeui-solutions-050-accent);
background:color-mix(in oklab,var(--vibeui-solutions-050-accent) 8%,var(--vibeui-solutions-050-bg));
}
[data-vibeui-block="solutions-050"] [data-part="card"] [data-part="name"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.8125rem;font-weight:700;margin:0 0 0.25rem;
}
[data-vibeui-block="solutions-050"] [data-part="badge"]{
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-solutions-050-accent);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-050"] [data-part="card"] p{
margin:0;font-size:0.75rem;color:var(--vibeui-solutions-050-muted);line-height:1.4;
}
[data-vibeui-block="solutions-050"] [data-part="card"] b{
display:block;font-size:0.75rem;font-weight:650;color:var(--vibeui-solutions-050-fg);margin-bottom:0.125rem;
}
[data-vibeui-block="solutions-050"] [data-part="burn"]{margin:0.25rem 1rem 1rem;padding:0;list-style:none}
[data-vibeui-block="solutions-050"] [data-part="burn"] li{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;font-size:0.8125rem;
border:1px solid var(--vibeui-solutions-050-border);
}
[data-vibeui-block="solutions-050"] [data-part="burn"] li + li{margin-top:0.375rem}
[data-vibeui-block="solutions-050"] [data-part="burn"] [data-soon="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-050-soon) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-050-soon) 8%,var(--vibeui-solutions-050-bg));
}
[data-vibeui-block="solutions-050"] [data-part="points"]{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="solutions-050"] [data-part="when"]{color:var(--vibeui-solutions-050-muted);font-size:0.75rem}
[data-vibeui-block="solutions-050"] [data-soon="true"] [data-part="when"]{
color:var(--vibeui-solutions-050-soon);font-weight:650;
}
[data-vibeui-block="solutions-050"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-050-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-050"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TIERS: Solutions050Tier[] = [
  { name: "Старт", threshold: 0, cashback: 3, perk: "базовый кэшбэк" },
  {
    name: "Серебро",
    threshold: 15000,
    cashback: 5,
    perk: "бесплатная доставка",
  },
  {
    name: "Золото",
    threshold: 40000,
    cashback: 7,
    perk: "ранний доступ к акциям",
  },
  {
    name: "Платина",
    threshold: 90000,
    cashback: 10,
    perk: "персональный менеджер",
  },
]

const DEFAULT_BATCHES: Solutions050Batch[] = [
  { points: 1200, expires: "15 апреля 2024", daysLeft: 12 },
  { points: 860, expires: "3 мая 2024", daysLeft: 30 },
  { points: 2400, expires: "20 июня 2024", daysLeft: 78 },
  { points: 500, expires: "2 июля 2024", daysLeft: 90 },
]

function money(value: number, currency: string) {
  return `${Math.round(value).toLocaleString("ru-RU")} ${currency}`
}

/**
 * Уровни программы лояльности: текущий уровень и остаток до следующего
 * считаются из накопленной суммы и порогов, а не приходят готовой меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions050({
  title = "Уровни программы лояльности",
  clientName = "Мария Лунёва",
  spend = 52300,
  tiers = DEFAULT_TIERS,
  batches = DEFAULT_BATCHES,
  currency = "₽",
  accent,
  className,
  style,
}: Solutions050Props) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold)
  const currentIndex = sorted.reduce(
    (found, tier, index) => (spend >= tier.threshold ? index : found),
    0,
  )
  const currentTier = sorted[currentIndex]
  const nextTier = sorted[currentIndex + 1] ?? null
  const scaleMax = sorted[sorted.length - 1].threshold || 1
  const fillPercent = Math.min(100, (spend / scaleMax) * 100)
  const toNext = nextTier ? Math.max(0, nextTier.threshold - spend) : 0

  const pointsBalance = batches.reduce((sum, batch) => sum + batch.points, 0)
  const sortedBatches = [...batches].sort((a, b) => a.daysLeft - b.daysLeft)
  const nearest = sortedBatches[0]

  const palette = {
    ...(accent ? { "--vibeui-solutions-050-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-050" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-050"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="sub">
            {clientName} · накоплено {money(spend, currency)}
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{currentTier.name}</b>
            <span>текущий уровень</span>
          </p>
          <p data-part="tile">
            <b>{nextTier ? money(toNext, currency) : "максимум"}</b>
            <span>
              {nextTier ? `до уровня «${nextTier.name}»` : "выше уровня нет"}
            </span>
          </p>
          <p data-part="tile">
            <b>{pointsBalance.toLocaleString("ru-RU")}</b>
            <span>баллов доступно</span>
          </p>
          <p data-part="tile">
            <b>{nearest.points.toLocaleString("ru-RU")}</b>
            <span>сгорают {nearest.expires}</span>
          </p>
        </div>

        <div data-part="scale">
          <div
            data-part="track"
            role="progressbar"
            aria-label={`Прогресс до уровня ${nextTier ? nextTier.name : "максимального"}`}
            aria-valuemin={0}
            aria-valuemax={scaleMax}
            aria-valuenow={Math.min(spend, scaleMax)}
          >
            <span data-part="fill" style={{ width: `${fillPercent}%` }} />
          </div>
          <div data-part="ticks">
            {sorted.map((tier, index) => (
              <span
                data-part="tick"
                data-current={index === currentIndex ? "true" : "false"}
                key={tier.name}
                style={{ left: `${(tier.threshold / scaleMax) * 100}%` }}
              >
                {tier.name}
              </span>
            ))}
          </div>
        </div>

        <div data-part="cards">
          {sorted.map((tier, index) => (
            <article
              data-part="card"
              data-current={index === currentIndex ? "true" : "false"}
              key={tier.name}
            >
              <p data-part="name">
                {tier.name}
                {index === currentIndex ? (
                  <span data-part="badge">вы здесь</span>
                ) : null}
              </p>
              <b>от {money(tier.threshold, currency)}</b>
              <p>
                кэшбэк {tier.cashback}% · {tier.perk}
              </p>
            </article>
          ))}
        </div>

        <ol data-part="burn">
          {sortedBatches.map((batch) => (
            <li
              data-soon={batch.daysLeft <= 30 ? "true" : "false"}
              key={`${batch.points}-${batch.expires}`}
            >
              <span data-part="points">
                {batch.points.toLocaleString("ru-RU")} баллов
              </span>
              <span data-part="when">
                {batch.daysLeft <= 30 ? "скоро сгорят · " : ""}
                до {batch.expires}
              </span>
            </li>
          ))}
        </ol>

        <p data-part="foot">
          Баллы сгорают партиями по дате начисления: списывайте старые партии в
          первую очередь, чтобы не терять бонус.
        </p>
      </section>
    </>
  )
}
