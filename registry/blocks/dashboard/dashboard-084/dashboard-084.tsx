import type { CSSProperties } from "react"

export type Dashboard084Person = {
  name: string
  short: string
  phone: string
}

export type Dashboard084Day = {
  date: number
  weekday: string
  person: string
  kind: "day" | "night" | "off"
  today?: boolean
  swap?: string
}

export type Dashboard084Props = {
  title?: string
  month?: string
  people?: Dashboard084Person[]
  days?: Dashboard084Day[]
  onCallNow?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: в календаре дежурств первый вопрос — «кто дежурит прямо сейчас»,
// и ответ не должен требовать поиска сегодняшней клетки. Поэтому текущая смена
// вынесена в шапку строкой с именем и телефоном, а сетка нужна для второго
// вопроса — «кто будет в четверг». Оттенок человека считается хешем имени, а не
// назначается вручную: список дежурных меняется, а раскраска должна оставаться
// стабильной. Ночная смена помечена не только тоном, но и полосой у нижнего
// края клетки: цвета в календаре быстро сливаются. Обмен смены подписан прямо
// в клетке — договорённость, которой нет в календаре, не существует.
const STYLES = `
:where([data-vibeui-block="dashboard-084"]){
--vibeui-dashboard-084-bg:oklch(0.985 0.003 260);
--vibeui-dashboard-084-card:oklch(1 0 0);
--vibeui-dashboard-084-fg:oklch(0.21 0.014 260);
--vibeui-dashboard-084-muted:oklch(0.54 0.014 260);
--vibeui-dashboard-084-border:oklch(0.91 0.006 260);
--vibeui-dashboard-084-accent:oklch(0.52 0.15 260);
--vibeui-dashboard-084-soft:oklch(0.965 0.02 260);
--vibeui-dashboard-084-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-084"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-084-bg);
color:var(--vibeui-dashboard-084-fg);
font-family:var(--vibeui-dashboard-084-sans);
border:1px solid var(--vibeui-dashboard-084-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-084"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-084"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-084"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-084"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-084"] [data-part="month"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-084-muted)}
[data-vibeui-block="dashboard-084"] [data-part="now"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
padding:0.6875rem 0.8125rem;border-radius:0.875rem;font-size:0.8125rem;
background:var(--vibeui-dashboard-084-soft);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-084-accent) 25%,white);
}
[data-vibeui-block="dashboard-084"] [data-part="now"] b{font-size:0.9375rem;font-weight:750}
[data-vibeui-block="dashboard-084"] [data-part="now"] span{color:var(--vibeui-dashboard-084-muted);font-size:0.75rem}
[data-vibeui-block="dashboard-084"] [data-part="call"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.375rem 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-084-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-084"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:0.25rem;
}
[data-vibeui-block="dashboard-084"] [data-part="wd"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-084-muted);text-align:center;padding-bottom:0.125rem;
}
[data-vibeui-block="dashboard-084"] [data-part="cell"]{
position:relative;display:flex;flex-direction:column;gap:0.125rem;min-height:3.75rem;
padding:0.3125rem 0.375rem;border-radius:0.5625rem;overflow:hidden;
background:var(--vibeui-dashboard-084-card);border:1px solid var(--vibeui-dashboard-084-border);
}
[data-vibeui-block="dashboard-084"] [data-part="cell"][data-today="true"]{
border-color:var(--vibeui-dashboard-084-fg);border-width:2px;
}
[data-vibeui-block="dashboard-084"] [data-part="cell"][data-kind="off"]{background:var(--vibeui-dashboard-084-bg)}
[data-vibeui-block="dashboard-084"] [data-part="date"]{font-size:0.6875rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-084"] [data-part="who"]{
font-size:0.625rem;font-weight:700;line-height:1.25;overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-084"] [data-part="chip"]{
display:inline-block;padding:0.0625rem 0.25rem;border-radius:0.25rem;
background:color-mix(in oklab,var(--vibeui-dashboard-084-hue) 16%,white);
color:color-mix(in oklab,var(--vibeui-dashboard-084-hue) 82%,black);
}
/* Ночная смена: полоса у нижнего края, а не только другой оттенок. */
[data-vibeui-block="dashboard-084"] [data-part="cell"][data-kind="night"]::after{
content:"";position:absolute;left:0;right:0;bottom:0;height:0.25rem;
background:repeating-linear-gradient(90deg,var(--vibeui-dashboard-084-fg) 0 0.25rem,transparent 0.25rem 0.5rem);
opacity:0.55;
}
[data-vibeui-block="dashboard-084"] [data-part="swap"]{
font-size:0.5625rem;color:var(--vibeui-dashboard-084-muted);line-height:1.2;
}
[data-vibeui-block="dashboard-084"] [data-part="legend"]{
list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-084-muted);
}
[data-vibeui-block="dashboard-084"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-084"] [data-part="legend"] i{
width:0.6875rem;height:0.6875rem;border-radius:0.1875rem;display:inline-block;
}
[data-vibeui-block="dashboard-084"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-084-accent);outline-offset:2px;
}
`

const DEFAULT_PEOPLE: Dashboard084Person[] = [
  { name: "Павел Дорохов", short: "Павел", phone: "+7 912 445-19-02" },
  { name: "Марина Тюрина", short: "Марина", phone: "+7 912 118-40-77" },
  { name: "Егор Савельев", short: "Егор", phone: "+7 963 220-11-58" },
  { name: "Ирина Кузнецова", short: "Ирина", phone: "+7 905 774-63-10" },
]

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

const DEFAULT_DAYS: Dashboard084Day[] = [
  { date: 9, weekday: "пн", person: "Павел", kind: "day" },
  { date: 10, weekday: "вт", person: "Павел", kind: "day" },
  { date: 11, weekday: "ср", person: "Марина", kind: "day" },
  { date: 12, weekday: "чт", person: "Марина", kind: "night" },
  {
    date: 13,
    weekday: "пт",
    person: "Егор",
    kind: "day",
    swap: "обмен с Мариной",
  },
  { date: 14, weekday: "сб", person: "Егор", kind: "night", today: true },
  { date: 15, weekday: "вс", person: "Егор", kind: "night" },
  { date: 16, weekday: "пн", person: "Ирина", kind: "day" },
  { date: 17, weekday: "вт", person: "Ирина", kind: "day" },
  { date: 18, weekday: "ср", person: "Павел", kind: "day" },
  { date: 19, weekday: "чт", person: "Павел", kind: "night" },
  { date: 20, weekday: "пт", person: "Марина", kind: "day" },
  { date: 21, weekday: "сб", person: "—", kind: "off" },
  { date: 22, weekday: "вс", person: "—", kind: "off" },
]

/** Оттенок дежурного считается из имени: список меняется, раскраска — нет. */
function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

/**
 * Экран календаря дежурств: текущая смена вынесена в шапку с телефоном, сетка
 * дней раскрашена по хешу имени, ночные смены помечены полосой, обмен смены
 * подписан в клетке. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard084({
  title = "Дежурства",
  month = "9–22 июня · смена сдаётся в 10:00",
  people = DEFAULT_PEOPLE,
  days = DEFAULT_DAYS,
  onCallNow = "Егор",
  accent,
  className,
  style,
}: Dashboard084Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-084-accent": accent } : null),
    ...style,
  } as CSSProperties

  const current = people.find((person) => person.short === onCallNow)

  return (
    <>
      <style href="vibeui-dashboard-084" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-084"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="month">{month}</p>
          </div>

          <div data-part="now">
            <span>Сейчас дежурит</span>
            <b>{current?.name ?? onCallNow}</b>
            <span>{current?.phone}</span>
            <span>ночная смена, до 10:00 завтра</span>
            <button type="button" data-part="call">
              Позвонить дежурному
            </button>
          </div>

          <div data-part="grid">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} data-part="wd">
                {weekday}
              </div>
            ))}
            {days.map((day) => (
              <div
                key={day.date}
                data-part="cell"
                data-kind={day.kind}
                data-today={day.today}
                style={
                  {
                    "--vibeui-dashboard-084-hue": `oklch(0.62 0.15 ${hue(day.person)})`,
                  } as CSSProperties
                }
              >
                <span data-part="date">{day.date}</span>
                <span data-part="who">
                  {day.kind === "off" ? (
                    <span>без дежурного</span>
                  ) : (
                    <span data-part="chip">{day.person}</span>
                  )}
                </span>
                {day.kind === "night" ? (
                  <span data-part="swap">ночь</span>
                ) : null}
                {day.swap ? <span data-part="swap">{day.swap}</span> : null}
              </div>
            ))}
          </div>

          <ul data-part="legend">
            {people.map((person) => (
              <li key={person.name}>
                <i
                  style={{
                    background: `oklch(0.62 0.15 ${hue(person.short)})`,
                  }}
                />
                {person.name}
              </li>
            ))}
            <li>полоса снизу — ночная смена</li>
            <li>жирная рамка — сегодня</li>
          </ul>
        </div>
      </section>
    </>
  )
}
