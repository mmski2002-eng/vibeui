import type { CSSProperties } from "react"

export type Solutions038Sheet = {
  driver: string
  vehicle: string
  route: string
  departure: string
  arrival: string
  odometerStart: number
  odometerEnd: number
  medExam: boolean
  techControl: boolean
}

export type Solutions038Props = {
  title?: string
  shift?: string
  sheets?: Solutions038Sheet[]
  /** Подписи плиток сводки: sheets, mileage, incomplete. */
  summaryText?: Record<string, string>
  /** Подписи одометра: start, end, mileage. */
  odometerText?: Record<string, string>
  /** Названия отметок: medExam, techControl. */
  markText?: Record<string, string>
  /** Состояния отметки: done, missing. */
  markStateText?: Record<string, string>
  /** Время выезда. {time} — часы и минуты. */
  departureText?: string
  /** Время возврата. {time} — часы и минуты. */
  arrivalText?: string
  /** Пробег. {km} — километры. */
  mileageText?: string
  /** Сноска под списком. */
  footNote?: string
  /** Локаль форматирования чисел. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: путевые листы за смену лентой карточек, а не таблицей — у
// каждого листа своя временная шкала, и строкой это не читается. Полоса
// суток под маршрутом показывает выезд и возврат позицией и длиной отрезка,
// а не парой чисел, которые надо мысленно вычитать. Пробег по одометру
// считается разницей показаний, а не переносится отдельным полем, которое
// может разойтись с реальными цифрами счётчика.
const STYLES = `
:where([data-vibeui-block="solutions-038"]){
--vibeui-solutions-038-bg:transparent;
--vibeui-solutions-038-panel:light-dark(oklch(0.976 0 250),oklch(0.27 0 265));
--vibeui-solutions-038-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-038-muted:light-dark(oklch(0.54 0 265),oklch(0.69 0 265));
--vibeui-solutions-038-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-solutions-038-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.72 0.14 39.8));
--vibeui-solutions-038-ok:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-038-warn:light-dark(oklch(0.6 0.19 45),oklch(0.74 0.16 45));
--vibeui-solutions-038-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-038-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-038"]{color-scheme:dark}
[data-vibeui-block="solutions-038"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-038-bg);
border:1px solid var(--vibeui-solutions-038-border);border-radius:1rem;
font-family:var(--vibeui-solutions-038-sans);color:var(--vibeui-solutions-038-fg);
}
[data-vibeui-block="solutions-038"] *{box-sizing:border-box}
[data-vibeui-block="solutions-038"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-038"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-038"] [data-part="shift"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-038-muted)}
[data-vibeui-block="solutions-038"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-038"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-038-panel);border:1px solid var(--vibeui-solutions-038-border);
}
[data-vibeui-block="solutions-038"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-038"] [data-tile="warn"] b{color:var(--vibeui-solutions-038-warn)}
[data-vibeui-block="solutions-038"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-038-muted);
}
[data-vibeui-block="solutions-038"] [data-part="list"]{
list-style:none;margin:0;padding:0 1rem 1rem;display:grid;gap:0.625rem;
}
[data-vibeui-block="solutions-038"] [data-part="sheet"]{
border:1px solid var(--vibeui-solutions-038-border);border-radius:0.75rem;padding:0.75rem 0.875rem;
}
[data-vibeui-block="solutions-038"] [data-part="sheethead"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem 0.75rem;
}
[data-vibeui-block="solutions-038"] [data-part="driver"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-038"] [data-part="vehicle"]{
font-size:0.75rem;color:var(--vibeui-solutions-038-muted);
}
[data-vibeui-block="solutions-038"] [data-part="route"]{
margin:0.25rem 0 0.5rem;font-size:0.8125rem;color:var(--vibeui-solutions-038-fg);
}
/* Полоса суток: позиция и длина отрезка сразу читаются, без вычитания времени в уме. */
[data-vibeui-block="solutions-038"] [data-part="track"]{
position:relative;height:0.5rem;border-radius:9999px;
background:var(--vibeui-solutions-038-panel);border:1px solid var(--vibeui-solutions-038-border);
}
[data-vibeui-block="solutions-038"] [data-part="span"]{
position:absolute;top:-1px;bottom:-1px;border-radius:9999px;
background:var(--vibeui-solutions-038-accent);
}
[data-vibeui-block="solutions-038"] [data-part="times"]{
display:flex;justify-content:space-between;margin:0.25rem 0 0.625rem;
font-size:0.6875rem;color:var(--vibeui-solutions-038-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-038"] [data-part="odo"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;margin:0;
}
[data-vibeui-block="solutions-038"] [data-part="odo"] dt{
margin:0;font-size:0.625rem;color:var(--vibeui-solutions-038-muted);
}
[data-vibeui-block="solutions-038"] [data-part="odo"] dd{
margin:0.125rem 0 0;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
font-family:var(--vibeui-solutions-038-mono);
}
[data-vibeui-block="solutions-038"] [data-part="marks"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.625rem;padding-top:0.625rem;
border-top:1px solid var(--vibeui-solutions-038-border);
}
[data-vibeui-block="solutions-038"] [data-part="mark"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-038-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-038-muted);
}
[data-vibeui-block="solutions-038"] [data-part="mark"] b{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;flex:none;
background:var(--vibeui-solutions-038-panel);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-038"] [data-mark="done"]{color:var(--vibeui-solutions-038-ok)}
[data-vibeui-block="solutions-038"] [data-mark="done"] b{background:var(--vibeui-solutions-038-ok);color:oklch(1 0 0)}
[data-vibeui-block="solutions-038"] [data-mark="missing"]{color:var(--vibeui-solutions-038-warn)}
[data-vibeui-block="solutions-038"] [data-mark="missing"] b{background:var(--vibeui-solutions-038-warn);color:oklch(1 0 0)}
[data-vibeui-block="solutions-038"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-038-muted);
border-top:1px solid var(--vibeui-solutions-038-border);
}
@container (min-width: 34rem){
[data-vibeui-block="solutions-038"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-038"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SHEETS: Solutions038Sheet[] = [
  {
    driver: "Игорь Стешин",
    vehicle: "ГАЗель NEXT · А 412 ОК 178",
    route: "Склад Парнас → ТЦ «Меркурий»",
    departure: "07:40",
    arrival: "13:10",
    odometerStart: 128102,
    odometerEnd: 128400,
    medExam: true,
    techControl: true,
  },
  {
    driver: "Вера Кулагина",
    vehicle: "Ford Transit · В 087 ТС 178",
    route: "Склад Парнас → 6 точек, Приморский р-н",
    departure: "08:15",
    arrival: "16:45",
    odometerStart: 95960,
    odometerEnd: 96200,
    medExam: true,
    techControl: false,
  },
  {
    driver: "Руслан Ахметов",
    vehicle: "КАМАЗ 65115 · Е 233 РА 178",
    route: "Карьер Гатчина → объект «Лахта-2»",
    departure: "05:30",
    arrival: "12:20",
    odometerStart: 214510,
    odometerEnd: 214900,
    medExam: true,
    techControl: true,
  },
  {
    driver: "Дмитрий Осин",
    vehicle: "Lada Largus · М 561 НВ 178",
    route: "Офис → 4 адреса, Выборгский р-н",
    departure: "09:00",
    arrival: "14:35",
    odometerStart: 74600,
    odometerEnd: 74850,
    medExam: false,
    techControl: true,
  },
]

const SUMMARY_LABEL: Record<string, string> = {
  sheets: "листов за смену",
  mileage: "суммарный пробег",
  incomplete: "без полной отметки",
}

const ODOMETER_LABEL: Record<string, string> = {
  start: "Одометр, выезд",
  end: "Одометр, возврат",
  mileage: "Пробег",
}

const MARK_LABEL: Record<string, string> = {
  medExam: "медосмотр",
  techControl: "техконтроль",
}

const MARK_STATE_LABEL: Record<string, string> = {
  done: "пройден",
  missing: "нет отметки",
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

function timeToHours(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours + minutes / 60
}

/**
 * Путевые листы за смену: маршрут визуализирован полосой суток, пробег
 * считается разницей одометра, а не приходит отдельным полем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions038({
  title = "Путевые листы",
  shift = "Смена 5 марта, 1-я бригада",
  sheets = DEFAULT_SHEETS,
  summaryText = SUMMARY_LABEL,
  odometerText = ODOMETER_LABEL,
  markText = MARK_LABEL,
  markStateText = MARK_STATE_LABEL,
  departureText = "выезд {time}",
  arrivalText = "возврат {time}",
  mileageText = "{km} км",
  footNote = "Пробег считается разницей показаний одометра при выезде и возврате.",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions038Props) {
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const odometer = (key: string) => odometerText[key] ?? ODOMETER_LABEL[key]
  const markState = (done: boolean) => {
    const key = done ? "done" : "missing"
    return markStateText[key] ?? MARK_STATE_LABEL[key]
  }
  const totalMileage = sheets.reduce(
    (sum, sheet) => sum + (sheet.odometerEnd - sheet.odometerStart),
    0,
  )
  const incomplete = sheets.filter(
    (sheet) => !sheet.medExam || !sheet.techControl,
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-038-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-038-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-038" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-038"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="shift">{shift}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{sheets.length}</b>
            <span>{summary("sheets")}</span>
          </p>
          <p data-part="tile">
            <b>
              {mileageText.replace("{km}", totalMileage.toLocaleString(locale))}
            </b>
            <span>{summary("mileage")}</span>
          </p>
          <p data-part="tile" data-tile={incomplete > 0 ? "warn" : undefined}>
            <b>{incomplete}</b>
            <span>{summary("incomplete")}</span>
          </p>
        </div>

        <ol data-part="list">
          {sheets.map((sheet) => {
            const mileage = sheet.odometerEnd - sheet.odometerStart
            const from = timeToHours(sheet.departure)
            const to = timeToHours(sheet.arrival)
            return (
              <li data-part="sheet" key={`${sheet.driver}-${sheet.departure}`}>
                <div data-part="sheethead">
                  <span data-part="driver">{sheet.driver}</span>
                  <span data-part="vehicle">{sheet.vehicle}</span>
                </div>
                <p data-part="route">{sheet.route}</p>

                <div data-part="track" aria-hidden="true">
                  <span
                    data-part="span"
                    style={{
                      left: `${(from / 24) * 100}%`,
                      width: `${Math.max(2, ((to - from) / 24) * 100)}%`,
                    }}
                  />
                </div>
                <div data-part="times">
                  <span>
                    {departureText.replace("{time}", sheet.departure)}
                  </span>
                  <span>{arrivalText.replace("{time}", sheet.arrival)}</span>
                </div>

                <dl data-part="odo">
                  <div>
                    <dt>{odometer("start")}</dt>
                    <dd>{sheet.odometerStart.toLocaleString(locale)}</dd>
                  </div>
                  <div>
                    <dt>{odometer("end")}</dt>
                    <dd>{sheet.odometerEnd.toLocaleString(locale)}</dd>
                  </div>
                  <div>
                    <dt>{odometer("mileage")}</dt>
                    <dd>
                      {mileageText.replace(
                        "{km}",
                        mileage.toLocaleString(locale),
                      )}
                    </dd>
                  </div>
                </dl>

                <div data-part="marks">
                  <span
                    data-part="mark"
                    data-mark={sheet.medExam ? "done" : "missing"}
                  >
                    <b aria-hidden="true">{sheet.medExam ? "✓" : "!"}</b>
                    {markText.medExam ?? MARK_LABEL.medExam}{" "}
                    {markState(sheet.medExam)}
                  </span>
                  <span
                    data-part="mark"
                    data-mark={sheet.techControl ? "done" : "missing"}
                  >
                    <b aria-hidden="true">{sheet.techControl ? "✓" : "!"}</b>
                    {markText.techControl ?? MARK_LABEL.techControl}{" "}
                    {markState(sheet.techControl)}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
