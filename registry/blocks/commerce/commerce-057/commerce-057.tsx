import type { CSSProperties } from "react"

export type Commerce057Slot = {
  at: string
  taken?: boolean
}

export type Commerce057Day = {
  value: string
  weekday: string
  date: string
  slots: Commerce057Slot[]
}

export type Commerce057Props = {
  service?: string
  title?: string
  lead?: string
  duration?: string
  price?: string
  master?: string
  masterRole?: string
  dayLegend?: string
  timeLegend?: string
  days?: Commerce057Day[]
  takenHint?: string
  cta?: string
  policy?: string
  durationLabel?: string
  priceLabel?: string
  takenSrLabel?: string
  masterTitle?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: запись на услугу, где занятое время видно, но выбрать его
// нельзя. Скрытый слот заставляет искать его глазами, поэтому занятые часы
// остаются в сетке перечёркнутыми и с атрибутом disabled. День и время —
// две радиогруппы, сетку нужного дня показывает :has() без JS.
const STYLES = `
:where([data-vibeui-block="commerce-057"]){
--vibeui-commerce-057-bg:transparent;
--vibeui-commerce-057-fg:light-dark(oklch(0.21 0.014 20),oklch(0.94 0.006 20));
--vibeui-commerce-057-muted:light-dark(oklch(0.53 0.016 20),oklch(0.73 0.013 20));
--vibeui-commerce-057-border:light-dark(oklch(0.9 0.008 20),oklch(0.38 0.014 20));
--vibeui-commerce-057-soft:light-dark(oklch(0.975 0.008 30),oklch(0.27 0.012 25));
--vibeui-commerce-057-accent:light-dark(oklch(0.5 0.15 15),oklch(0.72 0.15 20));
--vibeui-commerce-057-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 20));
--vibeui-commerce-057-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-057"]{
box-sizing:border-box;background:var(--vibeui-commerce-057-bg);
color:var(--vibeui-commerce-057-fg);font-family:var(--vibeui-commerce-057-sans);
}
[data-vibeui-block="commerce-057"] *{box-sizing:border-box}
[data-vibeui-block="commerce-057"] [data-part="shell"]{max-width:58rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-057"] [data-part="service"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-057-accent)}
[data-vibeui-block="commerce-057"] h2{margin:0.375rem 0 0.5rem;font-size:clamp(1.25rem,4cqi,1.875rem);line-height:1.12;letter-spacing:-0.02em}
[data-vibeui-block="commerce-057"] [data-part="lead"]{margin:0 0 1rem;max-width:50ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-057-muted)}
[data-vibeui-block="commerce-057"] [data-part="facts"]{
list-style:none;margin:0 0 1.25rem;padding:0.875rem 1rem;display:grid;gap:0.5rem;
border-radius:0.875rem;background:var(--vibeui-commerce-057-soft);font-size:0.875rem;
}
[data-vibeui-block="commerce-057"] [data-part="facts"] li{display:flex;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="commerce-057"] [data-part="facts"] strong{font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-057"] fieldset{border:0;margin:0 0 1.125rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-057"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-057-muted);
}
[data-vibeui-block="commerce-057"] [data-part="days"]{display:flex;flex-wrap:wrap;gap:0.5rem;clear:both}
[data-vibeui-block="commerce-057"] [data-part="day"]{position:relative}
[data-vibeui-block="commerce-057"] [data-part="day"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-057"] [data-part="dface"]{
display:block;cursor:pointer;text-align:center;min-width:4.75rem;padding:0.5rem 0.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-057-border);
transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-057"] [data-part="day"] input:checked+[data-part="dface"]{
border-color:var(--vibeui-commerce-057-accent);background:var(--vibeui-commerce-057-accent);color:var(--vibeui-commerce-057-onaccent);
}
[data-vibeui-block="commerce-057"] [data-part="day"] input:focus-visible+[data-part="dface"]{outline:2px solid var(--vibeui-commerce-057-accent);outline-offset:2px}
[data-vibeui-block="commerce-057"] [data-part="weekday"]{display:block;font-size:0.6875rem;letter-spacing:0.06em;text-transform:uppercase;opacity:0.8}
[data-vibeui-block="commerce-057"] [data-part="date"]{display:block;margin-top:0.125rem;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-057"] [data-part="slots"]{display:none}
[data-vibeui-block="commerce-057"] [data-part="grid"]{display:grid;gap:0.4375rem;grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="commerce-057"] [data-part="slot"]{position:relative}
[data-vibeui-block="commerce-057"] [data-part="slot"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-057"] [data-part="sface"]{
display:block;cursor:pointer;text-align:center;padding:0.5rem 0.25rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-057-border);font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-057"] [data-part="slot"] input:checked+[data-part="sface"]{
border-color:var(--vibeui-commerce-057-accent);background:var(--vibeui-commerce-057-accent);color:var(--vibeui-commerce-057-onaccent);
}
[data-vibeui-block="commerce-057"] [data-part="slot"] input:focus-visible+[data-part="sface"]{outline:2px solid var(--vibeui-commerce-057-accent);outline-offset:2px}
[data-vibeui-block="commerce-057"] [data-part="slot"] input:disabled+[data-part="sface"]{
cursor:not-allowed;color:var(--vibeui-commerce-057-muted);background:var(--vibeui-commerce-057-soft);
text-decoration:line-through;text-decoration-thickness:1px;
}
[data-vibeui-block="commerce-057"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-057"] [data-part="taken"]{margin:0.625rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-057-muted)}
[data-vibeui-block="commerce-057"] [data-part="panel"]{
border:1px solid var(--vibeui-commerce-057-border);border-radius:1rem;padding:1rem 1.125rem;align-self:start;
}
[data-vibeui-block="commerce-057"] h3{margin:0 0 0.5rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-057"] [data-part="master"]{display:flex;gap:0.75rem;align-items:center;margin-bottom:0.875rem}
[data-vibeui-block="commerce-057"] [data-part="avatar"]{
flex:none;width:2.75rem;height:2.75rem;border-radius:9999px;
background:linear-gradient(140deg,oklch(0.9 0.06 20),oklch(0.78 0.11 30));
}
[data-vibeui-block="commerce-057"] [data-part="mname"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-057"] [data-part="mrole"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-057-muted)}
[data-vibeui-block="commerce-057"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-057-accent);color:var(--vibeui-commerce-057-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-057"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-057-accent);outline-offset:2px}
[data-vibeui-block="commerce-057"] [data-part="policy"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-057-muted)}
[data-vibeui-block="commerce-057"] [data-part="shell"]:has(#commerce-057-day-1:checked) [data-part="slots"][data-for="1"]{display:block}
[data-vibeui-block="commerce-057"] [data-part="shell"]:has(#commerce-057-day-2:checked) [data-part="slots"][data-for="2"]{display:block}
[data-vibeui-block="commerce-057"] [data-part="shell"]:has(#commerce-057-day-3:checked) [data-part="slots"][data-for="3"]{display:block}
[data-vibeui-block="commerce-057"] [data-part="shell"]:has(#commerce-057-day-4:checked) [data-part="slots"][data-for="4"]{display:block}
@container (min-width: 30rem){
[data-vibeui-block="commerce-057"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@container (min-width: 46rem){
[data-vibeui-block="commerce-057"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1fr) 17rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-057"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_DAYS: Commerce057Day[] = [
  {
    value: "1",
    weekday: "Пн",
    date: "11 марта",
    slots: [
      { at: "10:00" },
      { at: "11:30", taken: true },
      { at: "13:00" },
      { at: "14:30" },
      { at: "16:00", taken: true },
      { at: "17:30" },
    ],
  },
  {
    value: "2",
    weekday: "Вт",
    date: "12 марта",
    slots: [
      { at: "10:00", taken: true },
      { at: "11:30", taken: true },
      { at: "13:00", taken: true },
      { at: "14:30" },
      { at: "16:00" },
      { at: "17:30" },
    ],
  },
  {
    value: "3",
    weekday: "Ср",
    date: "13 марта",
    slots: [
      { at: "10:00" },
      { at: "11:30" },
      { at: "13:00" },
      { at: "14:30", taken: true },
      { at: "16:00" },
      { at: "17:30", taken: true },
    ],
  },
  {
    value: "4",
    weekday: "Чт",
    date: "14 марта",
    slots: [
      { at: "10:00" },
      { at: "11:30" },
      { at: "13:00", taken: true },
      { at: "14:30" },
      { at: "16:00" },
      { at: "17:30" },
    ],
  },
]

/**
 * Страница услуги с записью на время: занятые слоты остаются видимыми и
 * отключёнными, день выбирается без JS. Один файл, ноль зависимостей.
 */
export function Commerce057({
  service = "Услуга мастерской",
  title = "Реставрация деревянной столешницы",
  lead = "Шлифуем, выравниваем сколы и покрываем маслом. Работаем у вас дома — стол никуда везти не нужно.",
  duration = "3 часа",
  price = "7 400 ₽",
  master = "Илья Ковалёв",
  masterRole = "Мастер по дереву, 9 лет",
  dayLegend = "Выберите день",
  timeLegend = "Выберите время",
  days = DEFAULT_DAYS,
  takenHint = "Перечёркнутое время уже занято другим заказом.",
  cta = "Записаться",
  policy = "Перенести или отменить запись можно бесплатно за 12 часов. Позже удерживается стоимость выезда — 900 ₽.",
  durationLabel = "Длительность",
  priceLabel = "Стоимость",
  takenSrLabel = "занято",
  masterTitle = "Кто приедет",
  accent,
  background = "",
  className,
  style,
}: Commerce057Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-057-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-057-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-057" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-057"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <p data-part="service">{service}</p>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <ul data-part="facts">
              <li>
                <span>{durationLabel}</span>
                <strong>{duration}</strong>
              </li>
              <li>
                <span>{priceLabel}</span>
                <strong>{price}</strong>
              </li>
            </ul>

            <fieldset>
              <legend>{dayLegend}</legend>
              <div data-part="days">
                {days.map((day, index) => (
                  <label
                    key={day.value}
                    data-part="day"
                    htmlFor={`commerce-057-day-${day.value}`}
                  >
                    <input
                      type="radio"
                      id={`commerce-057-day-${day.value}`}
                      name="commerce-057-day"
                      defaultChecked={index === 0}
                    />
                    <span data-part="dface">
                      <span data-part="weekday">{day.weekday}</span>
                      <span data-part="date">{day.date}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{timeLegend}</legend>
              {days.map((day) => (
                <div key={day.value} data-part="slots" data-for={day.value}>
                  <div data-part="grid">
                    {day.slots.map((slot) => (
                      <label
                        key={slot.at}
                        data-part="slot"
                        htmlFor={`commerce-057-slot-${day.value}-${slot.at}`}
                      >
                        <input
                          type="radio"
                          id={`commerce-057-slot-${day.value}-${slot.at}`}
                          name="commerce-057-slot"
                          disabled={slot.taken}
                        />
                        <span data-part="sface">
                          {slot.at}
                          {slot.taken ? (
                            <span data-part="sr"> {takenSrLabel}</span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <p data-part="taken">{takenHint}</p>
            </fieldset>
          </div>

          <aside data-part="panel">
            <h3>{masterTitle}</h3>
            <div data-part="master">
              <span data-part="avatar" aria-hidden="true" />
              <div>
                <p data-part="mname">{master}</p>
                <p data-part="mrole">{masterRole}</p>
              </div>
            </div>
            <button type="button" data-part="go">
              {cta}
            </button>
            <p data-part="policy">{policy}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
