import type { CSSProperties } from "react"

export type Solutions017Entry = {
  task: string
  project: string
  from: string
  to: string
  minutes: number
  billable?: boolean
  running?: boolean
}

export type Solutions017Props = {
  title?: string
  day?: string
  entries?: Solutions017Entry[]
  weekBars?: number[]
  weekDays?: string[]
  dayNorm?: number
  runningLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: учёт времени за день. Длительность записана и часами, и полосой
// от самой длинной записи: в списке одинаковых строк «1:45» и «0:15» на глаз
// не различить. Идущая прямо сейчас запись помечена мигающей точкой и рамкой —
// таймер, который забыли остановить, стоит дороже неучтённого часа. Сверху
// сумма дня против нормы, справа неделя столбиками: день без недели не
// отвечает на вопрос «догоняю или отстаю».
const STYLES = `
:where([data-vibeui-block="solutions-017"]){
--vibeui-solutions-017-bg:oklch(1 0 0);
--vibeui-solutions-017-panel:oklch(0.975 0.004 190);
--vibeui-solutions-017-fg:oklch(0.21 0.014 210);
--vibeui-solutions-017-muted:oklch(0.54 0.014 210);
--vibeui-solutions-017-border:oklch(0.9 0.006 210);
--vibeui-solutions-017-accent:oklch(0.55 0.14 195);
--vibeui-solutions-017-live:oklch(0.6 0.19 25);
--vibeui-solutions-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-017"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-017-bg);
border:1px solid var(--vibeui-solutions-017-border);border-radius:1rem;
font-family:var(--vibeui-solutions-017-sans);color:var(--vibeui-solutions-017-fg);
}
[data-vibeui-block="solutions-017"] *{box-sizing:border-box}
[data-vibeui-block="solutions-017"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-017"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-017"] [data-part="day"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-017-muted)}
[data-vibeui-block="solutions-017"] [data-part="sum"]{
margin:0;text-align:right;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;line-height:1.1;
}
[data-vibeui-block="solutions-017"] [data-part="norm"]{
display:block;font-size:0.6875rem;font-weight:500;color:var(--vibeui-solutions-017-muted);
}
[data-vibeui-block="solutions-017"] [data-part="shell"]{display:grid;gap:0.875rem;margin-top:0.875rem}
@container (min-width: 46rem){
[data-vibeui-block="solutions-017"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) 12rem;align-items:start}
}
[data-vibeui-block="solutions-017"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="solutions-017"] li{
padding:0.5rem 0.625rem;border-radius:0.75rem;
background:var(--vibeui-solutions-017-panel);
border:1px solid transparent;
}
/* Идущая запись в рамке и с точкой: забытый таймер дороже неучтённого часа. */
[data-vibeui-block="solutions-017"] [data-running="true"]{
background:color-mix(in oklab,var(--vibeui-solutions-017-live) 7%,var(--vibeui-solutions-017-bg));
border-color:color-mix(in oklab,var(--vibeui-solutions-017-live) 50%,transparent);
}
[data-vibeui-block="solutions-017"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-017"] [data-part="task"]{font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-017"] [data-part="pulse"]{
display:inline-block;width:0.4375rem;height:0.4375rem;margin-right:0.375rem;border-radius:9999px;
background:var(--vibeui-solutions-017-live);animation:vibeui-solutions-017-pulse 1.6s ease-in-out infinite;
}
@keyframes vibeui-solutions-017-pulse{50%{opacity:0.25}}
[data-vibeui-block="solutions-017"] [data-part="project"]{
display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-solutions-017-muted);
}
[data-vibeui-block="solutions-017"] [data-part="span"]{
font-family:var(--vibeui-solutions-017-mono);font-size:0.6875rem;color:var(--vibeui-solutions-017-muted);
}
[data-vibeui-block="solutions-017"] [data-part="len"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="solutions-017"] [data-billable="false"] [data-part="len"]{color:var(--vibeui-solutions-017-muted);font-weight:600}
/* Полоса от самой длинной записи: «1:45» и «0:15» на глаз не различаются. */
[data-vibeui-block="solutions-017"] [data-part="track"]{
height:0.25rem;margin-top:0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-017-fg) 8%,transparent);
}
[data-vibeui-block="solutions-017"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-solutions-017-accent);
}
[data-vibeui-block="solutions-017"] [data-billable="false"] [data-part="fill"]{
background:color-mix(in oklab,var(--vibeui-solutions-017-fg) 28%,transparent);
}
[data-vibeui-block="solutions-017"] [data-running="true"] [data-part="fill"]{background:var(--vibeui-solutions-017-live)}
[data-vibeui-block="solutions-017"] [data-part="week"]{
padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-solutions-017-panel);
border:1px solid var(--vibeui-solutions-017-border);
}
[data-vibeui-block="solutions-017"] h3{
margin:0 0 0.5rem;font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-017-muted);
}
[data-vibeui-block="solutions-017"] [data-part="bars"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:0.3125rem;align-items:end;height:5rem;
}
[data-vibeui-block="solutions-017"] [data-part="bar"]{
display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:0.25rem;
}
[data-vibeui-block="solutions-017"] [data-part="bar"] i{
display:block;border-radius:0.25rem 0.25rem 0.125rem 0.125rem;background:var(--vibeui-solutions-017-accent);
}
[data-vibeui-block="solutions-017"] [data-part="bar"] b{
text-align:center;font-size:0.5625rem;font-weight:500;color:var(--vibeui-solutions-017-muted);
}
[data-vibeui-block="solutions-017"] [data-part="weeksum"]{
margin:0.625rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-017-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-017"] [data-part="weeksum"] b{color:var(--vibeui-solutions-017-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Solutions017Entry[] = [
  {
    task: "Разбор ТЗ по личному кабинету",
    project: "Верста · внедрение",
    from: "09:15",
    to: "10:40",
    minutes: 85,
    billable: true,
  },
  {
    task: "Планёрка команды",
    project: "Внутреннее",
    from: "10:40",
    to: "11:05",
    minutes: 25,
    billable: false,
  },
  {
    task: "Правки по форме заявки",
    project: "Мера · поддержка",
    from: "11:10",
    to: "13:00",
    minutes: 110,
    billable: true,
  },
  {
    task: "Созвон с заказчиком",
    project: "Исток · внедрение",
    from: "14:00",
    to: "14:45",
    minutes: 45,
    billable: true,
  },
  {
    task: "Перенос данных, второй заход",
    project: "Исток · внедрение",
    from: "15:00",
    to: "сейчас",
    minutes: 62,
    billable: true,
    running: true,
  },
]

const DEFAULT_WEEK = [420, 465, 390, 327, 0, 0, 0]
const DEFAULT_WEEK_DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

function clock(minutes: number) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
}

/**
 * Учёт времени за день: записи с полосой длительности и неделя столбиками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions017({
  title = "Учёт времени",
  day = "Четверг, 14 марта",
  entries = DEFAULT_ENTRIES,
  weekBars = DEFAULT_WEEK,
  weekDays = DEFAULT_WEEK_DAYS,
  dayNorm = 480,
  runningLabel = "идёт сейчас",
  accent,
  className,
  style,
}: Solutions017Props) {
  const total = entries.reduce((sum, entry) => sum + entry.minutes, 0)
  const longest = Math.max(...entries.map((entry) => entry.minutes), 1)
  const weekPeak = Math.max(...weekBars, 1)
  const weekTotal = weekBars.reduce((sum, value) => sum + value, 0)

  const palette = {
    ...(accent ? { "--vibeui-solutions-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-017"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="day">
              {day} · {entries.length} записей
            </p>
          </div>
          <p data-part="sum">
            {clock(total)}
            <span data-part="norm">из {clock(dayNorm)} по норме дня</span>
          </p>
        </header>

        <div data-part="shell">
          <ul>
            {entries.map((entry) => (
              <li
                key={entry.task}
                data-running={entry.running ? "true" : "false"}
                data-billable={entry.billable === false ? "false" : "true"}
              >
                <div data-part="row">
                  <span data-part="task">
                    {entry.running ? (
                      <span data-part="pulse" aria-hidden="true" />
                    ) : null}
                    {entry.task}
                    <span data-part="project">
                      {entry.project}
                      {entry.billable === false ? " · не оплачивается" : ""}
                      {entry.running ? ` · ${runningLabel}` : ""}
                    </span>
                  </span>
                  <span data-part="len">
                    {clock(entry.minutes)}
                    <br />
                    <span data-part="span">
                      {entry.from}–{entry.to}
                    </span>
                  </span>
                </div>
                <div data-part="track">
                  <span
                    data-part="fill"
                    style={{
                      width: `${Math.round((entry.minutes / longest) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <aside data-part="week">
            <h3>Неделя</h3>
            <div
              data-part="bars"
              role="img"
              aria-label={`Часы по дням недели, всего ${clock(weekTotal)}`}
            >
              {weekBars.map((value, index) => (
                <div data-part="bar" key={weekDays[index]}>
                  <i
                    style={{
                      height: `${Math.round((value / weekPeak) * 100)}%`,
                    }}
                  />
                  <b>{weekDays[index]}</b>
                </div>
              ))}
            </div>
            <p data-part="weeksum">
              Всего за неделю <b>{clock(weekTotal)}</b>
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
