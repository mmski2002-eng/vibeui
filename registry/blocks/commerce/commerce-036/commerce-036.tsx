import type { CSSProperties } from "react"

export type Commerce036Period = {
  value: string
  label: string
  every: number
  discount: string
}

export type Commerce036Props = {
  title?: string
  product?: string
  period?: string
  periods?: Commerce036Period[]
  monthLabel?: string
  firstDay?: number
  startDay?: number
  daysInMonth?: number
  weekStart?: number
  nextLabel?: string
  nextDate?: string
  rules?: string[]
  cta?: string
  /** Подписи столбцов календаря, начиная с weekStart. */
  weekdays?: string[]
  /** Подпись группы периодичности. */
  periodsLegend?: string
  /** Скрытая подпись таблицы: {month} подставляет месяц. */
  calendarCaption?: string
  /** Подпись дня доставки: {day} и {month} подставляют дату. */
  dayLabel?: string
  /** Подписи под календарём. */
  dropsLegend?: string
  firstLegend?: string
  /** Подпись колонки условий для скринридера. */
  rulesLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подписка на регулярную доставку, где периодичность сразу
// отмечается на календаре месяца. Абстрактное «раз в две недели» ничего не
// говорит о том, когда придёт курьер, поэтому даты доставок считаются из шага
// периода и рисуются сеткой из семи колонок. Календарь построен на разметке
// таблицы: у дней есть заголовки столбцов, и скринридер читает их как даты,
// а не как набор чисел.
const STYLES = `
:where([data-vibeui-block="commerce-036"]){
--vibeui-commerce-036-bg:transparent;
--vibeui-commerce-036-radius:0;
--vibeui-commerce-036-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-036-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-036-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-commerce-036-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.011 265));
--vibeui-commerce-036-card:light-dark(oklch(1 0 0),oklch(0.22 0.01 265));
--vibeui-commerce-036-accent:light-dark(oklch(0.5 0.15 190),oklch(0.76 0.13 190));
--vibeui-commerce-036-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 190));
--vibeui-commerce-036-save:light-dark(oklch(0.5 0.13 150),oklch(0.78 0.14 150));
--vibeui-commerce-036-past:light-dark(oklch(0.75 0.01 265),oklch(0.45 0.012 265));
--vibeui-commerce-036-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-036"]{
box-sizing:border-box;background:var(--vibeui-commerce-036-bg);
border-radius:var(--vibeui-commerce-036-radius);
color:var(--vibeui-commerce-036-fg);font-family:var(--vibeui-commerce-036-sans);
}
[data-vibeui-block="commerce-036"] *{box-sizing:border-box}
[data-vibeui-block="commerce-036"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-036"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-036"] [data-part="product"]{margin:0 0 1rem;font-size:0.875rem;color:var(--vibeui-commerce-036-muted)}
[data-vibeui-block="commerce-036"] [data-part="grid"]{display:grid;gap:1rem}
@container (min-width: 44rem){
[data-vibeui-block="commerce-036"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 19rem;align-items:start}
}
[data-vibeui-block="commerce-036"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="commerce-036"] legend{
padding:0;float:left;width:100%;clear:both;margin-bottom:0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-036-muted);
}
[data-vibeui-block="commerce-036"] [data-part="periods"]{clear:both;display:grid;gap:0.5rem}
@container (min-width: 30rem){
[data-vibeui-block="commerce-036"] [data-part="periods"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-036"] [data-part="period"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="commerce-036"] [data-part="period"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="commerce-036"] [data-part="face"]{
display:block;height:100%;padding:0.75rem;border-radius:0.875rem;text-align:left;
border:1px solid var(--vibeui-commerce-036-border);background:var(--vibeui-commerce-036-bg);
transition:border-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="commerce-036"] [data-part="period"] input:checked + [data-part="face"]{
border-color:var(--vibeui-commerce-036-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-036-accent);
}
[data-vibeui-block="commerce-036"] [data-part="period"] input:focus-visible + [data-part="face"]{outline:2px solid var(--vibeui-commerce-036-accent);outline-offset:2px}
[data-vibeui-block="commerce-036"] [data-part="face"] b{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-036"] [data-part="face"] span{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-036-save);font-weight:600}
[data-vibeui-block="commerce-036"] [data-part="cal"]{
margin-top:1rem;border:1px solid var(--vibeui-commerce-036-border);border-radius:1.125rem;padding:0.875rem;
}
[data-vibeui-block="commerce-036"] [data-part="month"]{
margin:0 0 0.625rem;font-size:0.875rem;font-weight:700;text-align:center;
}
[data-vibeui-block="commerce-036"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="commerce-036"] th{
padding:0 0 0.375rem;font-size:0.625rem;font-weight:650;color:var(--vibeui-commerce-036-muted);
}
[data-vibeui-block="commerce-036"] td{padding:0.125rem;text-align:center}
[data-vibeui-block="commerce-036"] [data-part="day"]{
display:grid;place-items:center;aspect-ratio:1;border-radius:0.625rem;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
/* Дата доставки помечена и формой, и подписью: цвет один состояние не называет. */
[data-vibeui-block="commerce-036"] [data-part="day"][data-drop="yes"]{
background:var(--vibeui-commerce-036-accent);color:var(--vibeui-commerce-036-on-accent);font-weight:700;
}
[data-vibeui-block="commerce-036"] [data-part="day"][data-drop="first"]{
background:var(--vibeui-commerce-036-accent);color:var(--vibeui-commerce-036-on-accent);font-weight:700;
box-shadow:0 0 0 2px var(--vibeui-commerce-036-card),0 0 0 4px var(--vibeui-commerce-036-accent);
}
[data-vibeui-block="commerce-036"] [data-part="day"][data-past="yes"]{color:var(--vibeui-commerce-036-past)}
[data-vibeui-block="commerce-036"] [data-part="legend"]{
margin:0.625rem 0 0;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.6875rem;color:var(--vibeui-commerce-036-muted);
}
[data-vibeui-block="commerce-036"] [data-part="dot"]{
display:inline-block;width:0.625rem;height:0.625rem;border-radius:0.25rem;vertical-align:-1px;margin-right:0.25rem;
background:var(--vibeui-commerce-036-accent);
}
[data-vibeui-block="commerce-036"] aside{
border:1px solid var(--vibeui-commerce-036-border);border-radius:1.125rem;padding:0.875rem;
background:var(--vibeui-commerce-036-soft);
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-036"] aside{position:sticky;top:1rem}
}
[data-vibeui-block="commerce-036"] aside h3{margin:0 0 0.25rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-036-muted)}
[data-vibeui-block="commerce-036"] [data-part="next"]{margin:0 0 0.75rem;font-size:1.125rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="commerce-036"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="commerce-036"] li{
position:relative;padding-left:1rem;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-036-muted);
}
[data-vibeui-block="commerce-036"] li::before{
content:"";position:absolute;left:0;top:0.4375rem;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-commerce-036-accent);
}
[data-vibeui-block="commerce-036"] [data-part="cta"]{
margin-top:0.875rem;width:100%;appearance:none;border:0;cursor:pointer;height:2.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-036-accent);color:var(--vibeui-commerce-036-on-accent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-036"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-036-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-036"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERIODS: Commerce036Period[] = [
  { value: "week", label: "Раз в неделю", every: 7, discount: "−15% к цене" },
  {
    value: "biweek",
    label: "Раз в две недели",
    every: 14,
    discount: "−10% к цене",
  },
  { value: "month", label: "Раз в месяц", every: 28, discount: "−5% к цене" },
]

const DEFAULT_RULES = [
  "Списываем деньги за день до доставки и присылаем напоминание.",
  "Пропустить или перенести доставку можно до 20:00 предыдущего дня.",
  "Отменить подписку — в один шаг, без звонка и объяснений.",
  "Цена фиксируется на всё время подписки, даже если товар подорожает.",
]

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Подписка на регулярную доставку: периодичность сразу отмечена на календаре месяца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce036({
  title = "Привозить регулярно",
  product = "Кофе «Отмель», 1 кг · 2 400 ₽ за доставку",
  period = "biweek",
  periods = DEFAULT_PERIODS,
  monthLabel = "Март 2024",
  firstDay = 5,
  startDay = 7,
  daysInMonth = 31,
  weekStart = 1,
  nextLabel = "Ближайшая доставка",
  nextDate = "7 марта, четверг",
  rules = DEFAULT_RULES,
  cta = "Оформить подписку",
  weekdays = WEEKDAYS,
  periodsLegend = "Как часто привозить",
  calendarCaption = "Календарь доставок на {month}: отмеченные дни — даты доставки",
  dayLabel = "{day} {month}, доставка",
  dropsLegend = "дни доставки",
  firstLegend = "Первая доставка обведена рамкой",
  rulesLabel = "Условия подписки",
  accent,
  background = "",
  className,
  style,
}: Commerce036Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-036-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-036-bg": background,
          "--vibeui-commerce-036-card": background,
          "--vibeui-commerce-036-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const step = periods.find((item) => item.value === period)?.every ?? 14
  const drops = new Set<number>()

  for (let day = startDay; day <= daysInMonth; day += step) {
    drops.add(day)
  }

  const offset = (firstDay - weekStart + 7) % 7
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const weeks: (number | null)[][] = []

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return (
    <>
      <style href="vibeui-commerce-036" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-036"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="product">{product}</p>

          <div data-part="grid">
            <div>
              <fieldset>
                <legend>{periodsLegend}</legend>
                <div data-part="periods">
                  {periods.map((item) => (
                    <label data-part="period" key={item.value}>
                      <input
                        type="radio"
                        name="commerce-036-period"
                        value={item.value}
                        defaultChecked={item.value === period}
                      />
                      <span data-part="face">
                        <b>{item.label}</b>
                        <span>{item.discount}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div data-part="cal">
                <p data-part="month">{monthLabel}</p>
                <table>
                  <caption hidden>
                    {calendarCaption.replace("{month}", monthLabel)}
                  </caption>
                  <thead>
                    <tr>
                      {weekdays.map((day) => (
                        <th scope="col" key={day}>
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((week, weekIndex) => (
                      <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <td key={dayIndex}>
                            {day ? (
                              <span
                                data-part="day"
                                data-drop={
                                  day === startDay
                                    ? "first"
                                    : drops.has(day)
                                      ? "yes"
                                      : "no"
                                }
                                data-past={day < firstDay ? "yes" : "no"}
                                aria-label={
                                  drops.has(day)
                                    ? dayLabel
                                        .replace("{day}", String(day))
                                        .replace("{month}", monthLabel)
                                    : undefined
                                }
                              >
                                {day}
                              </span>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p data-part="legend">
                  <span>
                    <span data-part="dot" aria-hidden="true" />
                    {dropsLegend}
                  </span>
                  <span>{firstLegend}</span>
                </p>
              </div>
            </div>

            <aside aria-label={rulesLabel}>
              <h3>{nextLabel}</h3>
              <p data-part="next">{nextDate}</p>
              <ul>
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <button type="button" data-part="cta">
                {cta}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
