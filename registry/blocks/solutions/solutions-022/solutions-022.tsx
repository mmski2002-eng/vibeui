import type { CSSProperties } from "react"

export type Solutions022Visit = {
  time: string
  duration: string
  patient: string
  age: string
  reason: string
  room: string
  state: "done" | "now" | "waiting" | "cancelled"
  first?: boolean
  gapBefore?: string
}

export type Solutions022Props = {
  title?: string
  doctor?: string
  day?: string
  visits?: Solutions022Visit[]
  gapLabel?: string
  /** Счётчик в шапке, {count} — сколько пациентов ждёт. */
  waitingText?: string
  /** Подписи статусов: ключи done, now, waiting, cancelled. */
  stateText?: Record<string, string>
  /** Пометка первичного пациента. */
  firstLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: приём врача на день. Время слева отдельной колонкой и одной
// шириной — записи сравнивают по столбцу, а не читают в строке. Окно между
// приёмами показано явной строкой: пустое место в списке читается как ошибка
// загрузки, а не как свободные тридцать минут. Отменённый приём остаётся в
// списке зачёркнутым — исчезнувшая запись выглядит как потеря данных, и в
// регистратуре начинают звонить. Первичный пациент помечен словом: приём
// первичного длиннее, и это меняет план дня.
const STYLES = `
:where([data-vibeui-block="solutions-022"]){
--vibeui-solutions-022-bg:transparent;
--vibeui-solutions-022-panel:light-dark(oklch(0.975 0.005 195),oklch(0.27 0.012 210));
--vibeui-solutions-022-fg:light-dark(oklch(0.21 0.014 210),oklch(0.94 0.005 210));
--vibeui-solutions-022-muted:light-dark(oklch(0.53 0.013 210),oklch(0.7 0.012 210));
--vibeui-solutions-022-border:light-dark(oklch(0.9 0.006 210),oklch(0.36 0.012 210));
--vibeui-solutions-022-accent:light-dark(oklch(0.52 0.13 195),oklch(0.74 0.12 195));
--vibeui-solutions-022-now:light-dark(oklch(0.55 0.15 150),oklch(0.74 0.14 150));
--vibeui-solutions-022-off:light-dark(oklch(0.6 0.16 30),oklch(0.76 0.14 30));
--vibeui-solutions-022-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-022-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-022"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-022-bg);
border:1px solid var(--vibeui-solutions-022-border);border-radius:1rem;
font-family:var(--vibeui-solutions-022-sans);color:var(--vibeui-solutions-022-fg);
}
[data-vibeui-block="solutions-022"] *{box-sizing:border-box}
[data-vibeui-block="solutions-022"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding-bottom:0.75rem;border-bottom:1px solid var(--vibeui-solutions-022-border);
}
[data-vibeui-block="solutions-022"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-022"] [data-part="who"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-022-muted)}
[data-vibeui-block="solutions-022"] ol{list-style:none;margin:0.5rem 0 0;padding:0}
[data-vibeui-block="solutions-022"] li{
display:grid;grid-template-columns:4.25rem minmax(0,1fr);gap:0.75rem;
padding:0.5625rem 0;border-bottom:1px solid var(--vibeui-solutions-022-border);
}
@container (min-width: 42rem){
[data-vibeui-block="solutions-022"] li{grid-template-columns:5rem minmax(0,1fr) 8rem;align-items:center}
}
/* Время отдельной колонкой одной ширины: записи сравнивают по столбцу. */
[data-vibeui-block="solutions-022"] [data-part="when"]{
font-family:var(--vibeui-solutions-022-mono);font-size:0.875rem;font-weight:650;line-height:1.2;
}
[data-vibeui-block="solutions-022"] [data-part="len"]{
display:block;font-family:var(--vibeui-solutions-022-sans);font-size:0.625rem;font-weight:500;
color:var(--vibeui-solutions-022-muted);
}
[data-vibeui-block="solutions-022"] [data-part="patient"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-022"] [data-part="age"]{font-weight:400;color:var(--vibeui-solutions-022-muted)}
[data-vibeui-block="solutions-022"] [data-part="reason"]{
display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-solutions-022-muted);line-height:1.4;
}
[data-vibeui-block="solutions-022"] [data-part="first"]{
display:inline-block;margin-left:0.375rem;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-022-panel);
font-size:0.5625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-solutions-022-accent);vertical-align:0.0625rem;
}
[data-vibeui-block="solutions-022"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-022-muted);
}
[data-vibeui-block="solutions-022"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-022-fg) 25%,transparent);
}
[data-vibeui-block="solutions-022"] [data-state="now"] [data-part="state"]{color:var(--vibeui-solutions-022-now)}
[data-vibeui-block="solutions-022"] [data-state="now"] [data-part="dot"]{
background:var(--vibeui-solutions-022-now);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-solutions-022-now) 22%,transparent);
}
[data-vibeui-block="solutions-022"] [data-state="now"]{
background:color-mix(in oklab,var(--vibeui-solutions-022-now) 7%,var(--vibeui-solutions-022-bg));
border-radius:0.625rem;padding-left:0.5rem;padding-right:0.5rem;
}
[data-vibeui-block="solutions-022"] [data-state="done"] [data-part="dot"]{background:var(--vibeui-solutions-022-accent)}
/* Отменённый приём остаётся зачёркнутым: пропавшая строка читается как сбой. */
[data-vibeui-block="solutions-022"] [data-state="cancelled"] [data-part="patient"]{
text-decoration:line-through;color:var(--vibeui-solutions-022-muted);
}
[data-vibeui-block="solutions-022"] [data-state="cancelled"] [data-part="state"]{color:var(--vibeui-solutions-022-off)}
[data-vibeui-block="solutions-022"] [data-state="cancelled"] [data-part="dot"]{
background:none;border-radius:0.125rem;box-shadow:inset 0 0 0 2px var(--vibeui-solutions-022-off);
}
/* Окно между приёмами названо словами: пустое место читается как ошибка. */
[data-vibeui-block="solutions-022"] [data-part="gap"]{
grid-column:1 / -1;display:flex;align-items:center;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-solutions-022-muted);
}
[data-vibeui-block="solutions-022"] [data-part="gap"]::after{
content:"";flex:1;height:1px;
background:repeating-linear-gradient(90deg,var(--vibeui-solutions-022-border) 0 4px,transparent 4px 8px);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VISITS: Solutions022Visit[] = [
  {
    time: "09:00",
    duration: "30 мин",
    patient: "Гаврилова А. П.",
    age: "34 года",
    reason: "Контроль после лечения",
    room: "Кабинет 212",
    state: "done",
  },
  {
    time: "09:30",
    duration: "45 мин",
    patient: "Тарасов С. И.",
    age: "51 год",
    reason: "Жалобы на давление, первичный осмотр",
    room: "Кабинет 212",
    state: "done",
    first: true,
  },
  {
    time: "10:30",
    duration: "30 мин",
    patient: "Лунёва М. В.",
    age: "28 лет",
    reason: "Расшифровка анализов",
    room: "Кабинет 212",
    state: "now",
  },
  {
    time: "11:00",
    duration: "30 мин",
    patient: "Панин И. Г.",
    age: "44 года",
    reason: "Продление рецепта",
    room: "Кабинет 212",
    state: "cancelled",
  },
  {
    time: "11:30",
    duration: "45 мин",
    patient: "Соколова Д. А.",
    age: "37 лет",
    reason: "Первичная консультация по направлению",
    room: "Кабинет 212",
    state: "waiting",
    first: true,
  },
  {
    time: "13:00",
    duration: "30 мин",
    patient: "Ремизов А. К.",
    age: "62 года",
    reason: "Плановый осмотр",
    room: "Кабинет 212",
    state: "waiting",
    gapBefore: "12:15 — 13:00 · перерыв",
  },
]

const DEFAULT_STATE_TEXT: Record<string, string> = {
  done: "принят",
  now: "идёт приём",
  waiting: "ожидает",
  cancelled: "отменён",
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

/**
 * Расписание приёма врача: время колонкой, окна названы, отменённые видны.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions022({
  title = "Приём на сегодня",
  doctor = "Иванцова Е. Л. · терапевт",
  day = "Четверг, 14 марта · кабинет 212",
  visits = DEFAULT_VISITS,
  gapLabel = "окно",
  waitingText = "Ожидают приёма: {count}",
  stateText = DEFAULT_STATE_TEXT,
  firstLabel = "первичный",
  accent,
  background = "",
  className,
  style,
}: Solutions022Props) {
  const waiting = visits.filter((visit) => visit.state === "waiting").length

  const palette = {
    ...(accent ? { "--vibeui-solutions-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-022" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-022"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="who">
              {doctor} · {day}
            </p>
          </div>
          <p data-part="who">
            {waitingText.replace("{count}", String(waiting))}
          </p>
        </header>

        <ol>
          {visits.map((visit) => {
            return (
              <li key={visit.time} data-state={visit.state}>
                {visit.gapBefore ? (
                  <span data-part="gap">
                    {gapLabel} {visit.gapBefore}
                  </span>
                ) : null}
                <span data-part="when">
                  {visit.time}
                  <span data-part="len">{visit.duration}</span>
                </span>
                <span>
                  <span data-part="patient">
                    {visit.patient} <span data-part="age">{visit.age}</span>
                    {visit.first ? (
                      <span data-part="first">{firstLabel}</span>
                    ) : null}
                  </span>
                  <span data-part="reason">{visit.reason}</span>
                </span>
                <span data-part="state">
                  <span data-part="dot" aria-hidden="true" />
                  {stateText[visit.state] ?? DEFAULT_STATE_TEXT[visit.state]}
                </span>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
