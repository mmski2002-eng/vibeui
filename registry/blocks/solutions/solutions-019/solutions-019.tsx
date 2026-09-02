import type { CSSProperties } from "react"

export type Solutions019Stage = {
  name: string
  count: number
}

export type Solutions019Candidate = {
  name: string
  role: string
  stage: string
  daysOnStage: number
  recruiter: string
  source?: string
}

export type Solutions019Props = {
  title?: string
  vacancy?: string
  stages?: Solutions019Stage[]
  candidates?: Solutions019Candidate[]
  slaDays?: number
  stuckLabel?: string
  /** Норматив в шапке, {days} — число дней. */
  slaText?: string
  /** Заголовок списка кандидатов. */
  candidatesTitle?: string
  /** Пометка срока в норме. */
  onStageLabel?: string
  /** Срок на этапе, {days} — число дней. */
  daysText?: string
  /** Подпись рекрутёра, {name} — его имя. */
  recruiterText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: воронка найма. Между ступенями подписана конверсия шага, а не
// доля от первой: рекрутёру важно, где именно теряются люди, а не общий
// процент дошедших. Список кандидатов держит срок на этапе и сравнивает его с
// SLA: кандидат, который висит две недели, уходит к конкуренту молча, поэтому
// просроченные строки помечены полосой и словом. Ступени идут лентой с
// прокруткой — сжатая ступень теряет и число, и подпись.
const STYLES = `
:where([data-vibeui-block="solutions-019"]){
--vibeui-solutions-019-bg:transparent;
--vibeui-solutions-019-panel:light-dark(oklch(0.975 0.004 300),oklch(0.27 0.012 300));
--vibeui-solutions-019-fg:light-dark(oklch(0.21 0.014 300),oklch(0.94 0.005 300));
--vibeui-solutions-019-muted:light-dark(oklch(0.54 0.014 300),oklch(0.7 0.012 300));
--vibeui-solutions-019-border:light-dark(oklch(0.9 0.006 300),oklch(0.36 0.012 300));
--vibeui-solutions-019-accent:light-dark(oklch(0.53 0.17 305),oklch(0.74 0.15 305));
--vibeui-solutions-019-stuck:light-dark(oklch(0.6 0.18 40),oklch(0.76 0.15 40));
--vibeui-solutions-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-019"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-019-bg);
border:1px solid var(--vibeui-solutions-019-border);border-radius:1rem;
font-family:var(--vibeui-solutions-019-sans);color:var(--vibeui-solutions-019-fg);
}
[data-vibeui-block="solutions-019"] *{box-sizing:border-box}
[data-vibeui-block="solutions-019"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-019"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-019"] [data-part="vacancy"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-019-muted)}
/* Ступени лентой с прокруткой: сжатая ступень теряет и число, и подпись. */
[data-vibeui-block="solutions-019"] [data-part="funnel"]{
display:flex;align-items:stretch;gap:0;overflow-x:auto;scrollbar-width:thin;padding-bottom:0.375rem;
}
[data-vibeui-block="solutions-019"] [data-part="step"]{
flex:1 0 7.5rem;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-019-panel);
border:1px solid var(--vibeui-solutions-019-border);
}
[data-vibeui-block="solutions-019"] [data-part="step"] b{
display:block;font-size:1.375rem;font-weight:700;line-height:1;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-019"] [data-part="step"] span{
display:block;margin-top:0.1875rem;font-size:0.6875rem;color:var(--vibeui-solutions-019-muted);
}
[data-vibeui-block="solutions-019"] [data-part="step"] i{
display:block;height:0.25rem;margin-top:0.4375rem;border-radius:9999px;
background:var(--vibeui-solutions-019-accent);
}
/* Конверсия шага, а не доля от первой ступени: важно, где теряются люди. */
[data-vibeui-block="solutions-019"] [data-part="gap"]{
flex:0 0 3.25rem;display:flex;flex-direction:column;align-items:center;justify-content:center;
font-size:0.625rem;font-weight:650;color:var(--vibeui-solutions-019-muted);
}
[data-vibeui-block="solutions-019"] [data-part="gap"] em{font-style:normal;font-size:0.875rem;opacity:0.5}
[data-vibeui-block="solutions-019"] h3{
margin:1rem 0 0.5rem;font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-019-muted);
}
[data-vibeui-block="solutions-019"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="solutions-019"] li{
display:grid;gap:0.25rem 0.75rem;padding:0.5625rem 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-solutions-019-border);
}
@container (min-width: 40rem){
[data-vibeui-block="solutions-019"] li{grid-template-columns:minmax(0,1.3fr) 9rem 8rem;align-items:center}
}
/* Просроченный этап помечен полосой и словом: молчащий кандидат уходит. */
[data-vibeui-block="solutions-019"] [data-stuck="true"]{
border-left:3px solid var(--vibeui-solutions-019-stuck);
background:color-mix(in oklab,var(--vibeui-solutions-019-stuck) 6%,var(--vibeui-solutions-019-bg));
}
[data-vibeui-block="solutions-019"] [data-part="who"]{display:block;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-019"] [data-part="role"]{
display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-solutions-019-muted);
}
[data-vibeui-block="solutions-019"] [data-part="stage"]{
display:inline-block;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-019-panel);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="solutions-019"] [data-part="days"]{
display:block;margin-top:0.1875rem;font-size:0.6875rem;color:var(--vibeui-solutions-019-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-019"] [data-stuck="true"] [data-part="days"]{color:var(--vibeui-solutions-019-stuck);font-weight:650}
[data-vibeui-block="solutions-019"] [data-part="recruiter"]{font-size:0.6875rem;color:var(--vibeui-solutions-019-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Solutions019Stage[] = [
  { name: "Отклики", count: 184 },
  { name: "Скрининг", count: 62 },
  { name: "Интервью", count: 24 },
  { name: "Тест", count: 11 },
  { name: "Оффер", count: 4 },
]

const DEFAULT_CANDIDATES: Solutions019Candidate[] = [
  {
    name: "Алексей Ремизов",
    role: "Frontend-разработчик",
    stage: "Тест",
    daysOnStage: 12,
    recruiter: "Дина С.",
    source: "hh.ru",
  },
  {
    name: "Ольга Панфилова",
    role: "Frontend-разработчик",
    stage: "Интервью",
    daysOnStage: 3,
    recruiter: "Дина С.",
    source: "рекомендация",
  },
  {
    name: "Кирилл Ваулин",
    role: "QA-инженер",
    stage: "Оффер",
    daysOnStage: 2,
    recruiter: "Марина К.",
    source: "Telegram-канал",
  },
  {
    name: "Наталья Гурьева",
    role: "QA-инженер",
    stage: "Скрининг",
    daysOnStage: 9,
    recruiter: "Марина К.",
    source: "hh.ru",
  },
  {
    name: "Пётр Аникин",
    role: "Frontend-разработчик",
    stage: "Интервью",
    daysOnStage: 14,
    recruiter: "Дина С.",
    source: "холодный поиск",
  },
]

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

/**
 * Воронка найма: конверсия между ступенями и кандидаты со сроком на этапе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions019({
  title = "Наём",
  vacancy = "Две вакансии в разработке · март",
  stages = DEFAULT_STAGES,
  candidates = DEFAULT_CANDIDATES,
  slaDays = 7,
  stuckLabel = "висит",
  slaText = "Норматив этапа — {days} дней",
  candidatesTitle = "Кандидаты в работе",
  onStageLabel = "на этапе",
  daysText = "{days} дн.",
  recruiterText = "рекрутёр {name}",
  accent,
  background = "",
  className,
  style,
}: Solutions019Props) {
  const top = stages[0]?.count ?? 1

  const palette = {
    ...(accent ? { "--vibeui-solutions-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-019"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="vacancy">{vacancy}</p>
          </div>
          <p data-part="vacancy">
            {slaText.replace("{days}", String(slaDays))}
          </p>
        </header>

        <div data-part="funnel">
          {stages.flatMap((stage, index) => {
            const previous = stages[index - 1]
            const step = previous
              ? Math.round((stage.count / previous.count) * 100)
              : 100

            const cell = (
              <div data-part="step" key={stage.name}>
                <b>{stage.count}</b>
                <span>{stage.name}</span>
                <i style={{ width: `${(stage.count / top) * 100}%` }} />
              </div>
            )

            if (!previous) return [cell]

            return [
              <div data-part="gap" key={`${stage.name}-gap`}>
                <em aria-hidden="true">→</em>
                {step}%
              </div>,
              cell,
            ]
          })}
        </div>

        <h3>{candidatesTitle}</h3>
        <ul>
          {candidates.map((candidate) => (
            <li
              key={candidate.name}
              data-stuck={candidate.daysOnStage > slaDays ? "true" : "false"}
            >
              <div>
                <span data-part="who">{candidate.name}</span>
                <span data-part="role">
                  {candidate.role}
                  {candidate.source ? ` · ${candidate.source}` : ""}
                </span>
              </div>
              <div>
                <span data-part="stage">{candidate.stage}</span>
                <span data-part="days">
                  {candidate.daysOnStage > slaDays
                    ? `${stuckLabel} `
                    : `${onStageLabel} `}
                  {daysText.replace("{days}", String(candidate.daysOnStage))}
                </span>
              </div>
              <span data-part="recruiter">
                {recruiterText.replace("{name}", candidate.recruiter)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
