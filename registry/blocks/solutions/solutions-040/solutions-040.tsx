import type { CSSProperties } from "react"

export type Solutions040Policy = {
  type: "osago" | "kasko" | "property"
  number: string
  insurer: string
  premium: string
  coverage: string
  startLabel: string
  endLabel: string
  totalDays: number
  daysLeft: number
}

export type Solutions040Props = {
  title?: string
  hint?: string
  policies?: Solutions040Policy[]
  expiryWarnDays?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: полисы карточками, а не строками таблицы, потому что у каждого
// своя полоса срока действия. Прошедшая доля полосы и цвет обратного отсчёта
// вычисляются из totalDays/daysLeft одной функцией — «скоро кончается» не
// хранится меткой отдельно от чисел, которые её обосновывают.
const STYLES = `
:where([data-vibeui-block="solutions-040"]){
--vibeui-solutions-040-bg:oklch(1 0 0);
--vibeui-solutions-040-panel:oklch(0.976 0.004 250);
--vibeui-solutions-040-fg:oklch(0.21 0.014 265);
--vibeui-solutions-040-muted:oklch(0.54 0.014 265);
--vibeui-solutions-040-border:oklch(0.9 0.006 265);
--vibeui-solutions-040-accent:oklch(0.5 0.15 250);
--vibeui-solutions-040-ok:oklch(0.55 0.14 152);
--vibeui-solutions-040-warn:oklch(0.68 0.16 75);
--vibeui-solutions-040-late:oklch(0.57 0.19 25);
--vibeui-solutions-040-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-040-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-040"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-040-bg);
border:1px solid var(--vibeui-solutions-040-border);border-radius:1rem;
font-family:var(--vibeui-solutions-040-sans);color:var(--vibeui-solutions-040-fg);
}
[data-vibeui-block="solutions-040"] *{box-sizing:border-box}
[data-vibeui-block="solutions-040"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-040"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-040"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-040-muted)}
[data-vibeui-block="solutions-040"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-040"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-040-panel);border:1px solid var(--vibeui-solutions-040-border);
}
[data-vibeui-block="solutions-040"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-040"] [data-tile="late"] b{color:var(--vibeui-solutions-040-late)}
[data-vibeui-block="solutions-040"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-040-muted);
}
[data-vibeui-block="solutions-040"] [data-part="list"]{
display:grid;gap:0.625rem;padding:0 1rem 1rem;
}
[data-vibeui-block="solutions-040"] [data-part="policy"]{
border:1px solid var(--vibeui-solutions-040-border);border-radius:0.75rem;padding:0.75rem 0.875rem;
}
[data-vibeui-block="solutions-040"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:0.5rem 0.75rem;
}
[data-vibeui-block="solutions-040"] [data-part="type"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5625rem;border-radius:9999px;
background:var(--vibeui-solutions-040-panel);border:1px solid var(--vibeui-solutions-040-border);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="solutions-040"] [data-part="number"]{
display:block;margin-top:0.25rem;font-size:0.75rem;font-family:var(--vibeui-solutions-040-mono);
color:var(--vibeui-solutions-040-muted);
}
[data-vibeui-block="solutions-040"] [data-part="insurer"]{
display:block;margin-top:0.375rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="solutions-040"] [data-part="countdown"]{
text-align:right;flex:none;
}
[data-vibeui-block="solutions-040"] [data-part="days"]{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1;
}
[data-vibeui-block="solutions-040"] [data-urgency="warn"] [data-part="days"]{color:var(--vibeui-solutions-040-warn)}
[data-vibeui-block="solutions-040"] [data-urgency="late"] [data-part="days"]{color:var(--vibeui-solutions-040-late)}
[data-vibeui-block="solutions-040"] [data-part="countdown"] span{
font-size:0.625rem;color:var(--vibeui-solutions-040-muted);
}
[data-vibeui-block="solutions-040"] [data-part="figures"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;margin:0.625rem 0;
}
[data-vibeui-block="solutions-040"] [data-part="figures"] dt{
margin:0;font-size:0.625rem;color:var(--vibeui-solutions-040-muted);
}
[data-vibeui-block="solutions-040"] [data-part="figures"] dd{
margin:0.125rem 0 0;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
/* Полоса срока: пройденная доля и цвет считаются из totalDays/daysLeft. */
[data-vibeui-block="solutions-040"] [data-part="term"]{
height:0.4375rem;border-radius:9999px;background:var(--vibeui-solutions-040-panel);
border:1px solid var(--vibeui-solutions-040-border);overflow:hidden;
}
[data-vibeui-block="solutions-040"] [data-part="elapsed"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-040-ok);
}
[data-vibeui-block="solutions-040"] [data-urgency="warn"] [data-part="elapsed"]{background:var(--vibeui-solutions-040-warn)}
[data-vibeui-block="solutions-040"] [data-urgency="late"] [data-part="elapsed"]{background:var(--vibeui-solutions-040-late)}
[data-vibeui-block="solutions-040"] [data-part="dates"]{
display:flex;justify-content:space-between;margin-top:0.25rem;
font-size:0.6875rem;color:var(--vibeui-solutions-040-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-040"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-040-muted);
border-top:1px solid var(--vibeui-solutions-040-border);
}
@container (min-width: 34rem){
[data-vibeui-block="solutions-040"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-040"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POLICIES: Solutions040Policy[] = [
  {
    type: "osago",
    number: "ХХХ 0193 442156",
    insurer: "СК «Согласие»",
    premium: "18 400 ₽",
    coverage: "400 000 ₽",
    startLabel: "12 апр 2025",
    endLabel: "11 апр 2026",
    totalDays: 365,
    daysLeft: 224,
  },
  {
    type: "kasko",
    number: "KS-2025-77401",
    insurer: "Ренессанс Страхование",
    premium: "142 000 ₽",
    coverage: "3 900 000 ₽",
    startLabel: "3 мар 2025",
    endLabel: "2 мар 2026",
    totalDays: 365,
    daysLeft: 26,
  },
  {
    type: "property",
    number: "ИМ-118820",
    insurer: "АльфаСтрахование",
    premium: "64 500 ₽",
    coverage: "12 000 000 ₽",
    startLabel: "20 мар 2025",
    endLabel: "19 мар 2026",
    totalDays: 365,
    daysLeft: -6,
  },
  {
    type: "osago",
    number: "ХХХ 0201 118820",
    insurer: "ВСК",
    premium: "21 100 ₽",
    coverage: "400 000 ₽",
    startLabel: "9 июн 2025",
    endLabel: "8 июн 2026",
    totalDays: 365,
    daysLeft: 282,
  },
]

const TYPE_LABEL: Record<Solutions040Policy["type"], string> = {
  osago: "ОСАГО",
  kasko: "КАСКО",
  property: "Имущество",
}

function urgency(daysLeft: number, expiryWarnDays: number) {
  if (daysLeft < 0) return "late" as const
  if (daysLeft <= expiryWarnDays) return "warn" as const
  return "ok" as const
}

/**
 * Полисы страхования: срок действия полосой, обратный отсчёт и его тон
 * выводятся из totalDays/daysLeft, а не приходят готовой меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions040({
  title = "Страховые полисы",
  hint = "Автопарк и имущество, 4 действующих договора",
  policies = DEFAULT_POLICIES,
  expiryWarnDays = 30,
  accent,
  className,
  style,
}: Solutions040Props) {
  const expiring = policies.filter(
    (policy) => urgency(policy.daysLeft, expiryWarnDays) !== "ok",
  ).length
  const expired = policies.filter((policy) => policy.daysLeft < 0).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-040-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-040" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-040"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{policies.length}</b>
            <span>действующих полисов</span>
          </p>
          <p data-part="tile">
            <b>{expiring}</b>
            <span>требуют продления скоро</span>
          </p>
          <p data-part="tile" data-tile={expired > 0 ? "late" : undefined}>
            <b>{expired}</b>
            <span>срок истёк</span>
          </p>
        </div>

        <div data-part="list">
          {policies.map((policy) => {
            const state = urgency(policy.daysLeft, expiryWarnDays)
            const elapsedPct = Math.min(
              100,
              Math.max(
                0,
                ((policy.totalDays - policy.daysLeft) / policy.totalDays) * 100,
              ),
            )
            return (
              <article
                data-part="policy"
                key={policy.number}
                data-urgency={state}
              >
                <div data-part="row">
                  <div>
                    <span data-part="type">{TYPE_LABEL[policy.type]}</span>
                    <span data-part="insurer">{policy.insurer}</span>
                    <span data-part="number">{policy.number}</span>
                  </div>
                  <div data-part="countdown">
                    <span data-part="days">
                      {policy.daysLeft >= 0
                        ? `${policy.daysLeft} дн.`
                        : `${Math.abs(policy.daysLeft)} дн. назад`}
                    </span>
                    <span>
                      {policy.daysLeft >= 0 ? "до окончания" : "истёк"}
                    </span>
                  </div>
                </div>

                <dl data-part="figures">
                  <div>
                    <dt>Премия</dt>
                    <dd>{policy.premium}</dd>
                  </div>
                  <div>
                    <dt>Покрытие</dt>
                    <dd>{policy.coverage}</dd>
                  </div>
                </dl>

                <div
                  data-part="term"
                  role="progressbar"
                  aria-label={`${policy.insurer}: срок действия полиса`}
                  aria-valuenow={Math.round(elapsedPct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    data-part="elapsed"
                    style={{ width: `${elapsedPct}%` }}
                  />
                </div>
                <div data-part="dates">
                  <span>{policy.startLabel}</span>
                  <span>{policy.endLabel}</span>
                </div>
              </article>
            )
          })}
        </div>

        <p data-part="foot">
          Обратный отсчёт и цвет полосы считаются из срока действия, а не
          назначаются вручную.
        </p>
      </section>
    </>
  )
}
