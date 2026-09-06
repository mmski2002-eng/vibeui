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
  /** Названия типов полисов: osago, kasko, property. */
  typeText?: Record<string, string>
  /** Подписи плиток сводки: policies, expiring, expired. */
  summaryText?: Record<string, string>
  /** Подписи цифр полиса: premium, coverage. */
  figureText?: Record<string, string>
  /** Остаток срока. {days} — число дней. */
  daysLeftText?: string
  /** Просроченный срок. {days} — число дней. */
  daysAgoText?: string
  /** Подписи под отсчётом: left, expired. */
  countdownText?: Record<string, string>
  /** Скрытая подпись полосы срока. {insurer} — страховщик. */
  termLabel?: string
  /** Сноска под списком. */
  footNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-solutions-040-bg:transparent;
--vibeui-solutions-040-panel:light-dark(oklch(0.976 0 250),oklch(0.27 0 265));
--vibeui-solutions-040-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-040-muted:light-dark(oklch(0.54 0 265),oklch(0.69 0 265));
--vibeui-solutions-040-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-solutions-040-accent:light-dark(oklch(0.5 0.15 250),oklch(0.72 0.14 250));
--vibeui-solutions-040-ok:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-040-warn:light-dark(oklch(0.68 0.16 75),oklch(0.79 0.15 75));
--vibeui-solutions-040-late:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-040-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-040-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-040"]{color-scheme:dark}
[data-vibeui-block="solutions-040"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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

const TYPE_LABEL: Record<string, string> = {
  osago: "ОСАГО",
  kasko: "КАСКО",
  property: "Имущество",
}

const SUMMARY_LABEL: Record<string, string> = {
  policies: "действующих полисов",
  expiring: "требуют продления скоро",
  expired: "срок истёк",
}

const FIGURE_LABEL: Record<string, string> = {
  premium: "Премия",
  coverage: "Покрытие",
}

const COUNTDOWN_LABEL: Record<string, string> = {
  left: "до окончания",
  expired: "истёк",
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
  typeText = TYPE_LABEL,
  summaryText = SUMMARY_LABEL,
  figureText = FIGURE_LABEL,
  daysLeftText = "{days} дн.",
  daysAgoText = "{days} дн. назад",
  countdownText = COUNTDOWN_LABEL,
  termLabel = "{insurer}: срок действия полиса",
  footNote = "Обратный отсчёт и цвет полосы считаются из срока действия, а не назначаются вручную.",
  accent,
  background = "",
  className,
  style,
}: Solutions040Props) {
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const figure = (key: string) => figureText[key] ?? FIGURE_LABEL[key]
  const countdown = (key: string) => countdownText[key] ?? COUNTDOWN_LABEL[key]
  const expiring = policies.filter(
    (policy) => urgency(policy.daysLeft, expiryWarnDays) !== "ok",
  ).length
  const expired = policies.filter((policy) => policy.daysLeft < 0).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-040-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-040-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
            <span>{summary("policies")}</span>
          </p>
          <p data-part="tile">
            <b>{expiring}</b>
            <span>{summary("expiring")}</span>
          </p>
          <p data-part="tile" data-tile={expired > 0 ? "late" : undefined}>
            <b>{expired}</b>
            <span>{summary("expired")}</span>
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
                    <span data-part="type">
                      {typeText[policy.type] ?? TYPE_LABEL[policy.type]}
                    </span>
                    <span data-part="insurer">{policy.insurer}</span>
                    <span data-part="number">{policy.number}</span>
                  </div>
                  <div data-part="countdown">
                    <span data-part="days">
                      {policy.daysLeft >= 0
                        ? daysLeftText.replace(
                            "{days}",
                            String(policy.daysLeft),
                          )
                        : daysAgoText.replace(
                            "{days}",
                            String(Math.abs(policy.daysLeft)),
                          )}
                    </span>
                    <span>
                      {policy.daysLeft >= 0
                        ? countdown("left")
                        : countdown("expired")}
                    </span>
                  </div>
                </div>

                <dl data-part="figures">
                  <div>
                    <dt>{figure("premium")}</dt>
                    <dd>{policy.premium}</dd>
                  </div>
                  <div>
                    <dt>{figure("coverage")}</dt>
                    <dd>{policy.coverage}</dd>
                  </div>
                </dl>

                <div
                  data-part="term"
                  role="progressbar"
                  aria-label={termLabel.replace("{insurer}", policy.insurer)}
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

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
