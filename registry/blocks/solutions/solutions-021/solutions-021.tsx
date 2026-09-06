import type { CSSProperties } from "react"

export type Solutions021Booking = {
  from: number
  to: number
  who: string
  internal?: boolean
}

export type Solutions021Room = {
  name: string
  seats: number
  gear: string
  bookings: Solutions021Booking[]
}

export type Solutions021Props = {
  title?: string
  day?: string
  hours?: string[]
  rooms?: Solutions021Room[]
  freeLabel?: string
  /** Загрузка в шапке: {busy} и {total} — часы. */
  busyText?: string
  /** Вместимость комнаты, {seats} — число мест. */
  seatsText?: string
  /** Подпись свободного часа: {room}, {hour} и {label}. */
  freeSlotLabelText?: string
  /** Пояснение под сеткой. */
  footText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сетка переговорных на день. Матрица «комната × час» отвечает на
// вопрос «где вообще есть окно в 15:00» — список броней по каждой комнате
// заставляет перебирать вкладки. Бронь занимает диапазон колонок через
// grid-column, поэтому двухчасовая встреча видна одним блоком, а не двумя
// одинаковыми ячейками. Свободные интервалы — кнопки, занятые — обычный текст:
// нажать чужую встречу нельзя ни мышью, ни с клавиатуры. Вместимость и техника
// подписаны у названия: комнату выбирают по ним, а не по имени.
const STYLES = `
:where([data-vibeui-block="solutions-021"]){
--vibeui-solutions-021-bg:transparent;
--vibeui-solutions-021-panel:light-dark(oklch(0.975 0 260),oklch(0.27 0 265));
--vibeui-solutions-021-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-021-muted:light-dark(oklch(0.54 0 265),oklch(0.7 0 265));
--vibeui-solutions-021-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-solutions-021-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.74 0.15 39.8));
--vibeui-solutions-021-guest:light-dark(oklch(0.6 0.15 39.8),oklch(0.76 0.14 39.8));
--vibeui-solutions-021-hours:10;
--vibeui-solutions-021-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-021"]{color-scheme:dark}
[data-vibeui-block="solutions-021"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-021-bg);
border:1px solid var(--vibeui-solutions-021-border);border-radius:1rem;
font-family:var(--vibeui-solutions-021-sans);color:var(--vibeui-solutions-021-fg);
}
[data-vibeui-block="solutions-021"] *{box-sizing:border-box}
[data-vibeui-block="solutions-021"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-021"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-021"] [data-part="day"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-021-muted)}
[data-vibeui-block="solutions-021"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin;padding:0 1rem 1rem}
[data-vibeui-block="solutions-021"] [data-part="grid"]{min-width:44rem}
[data-vibeui-block="solutions-021"] [data-part="ruler"],
[data-vibeui-block="solutions-021"] [data-part="lane"]{
display:grid;grid-template-columns:11rem repeat(var(--vibeui-solutions-021-hours),1fr);
gap:0 2px;align-items:center;
}
[data-vibeui-block="solutions-021"] [data-part="ruler"]{padding-bottom:0.3125rem}
[data-vibeui-block="solutions-021"] [data-part="ruler"] b{
font-size:0.625rem;font-weight:600;color:var(--vibeui-solutions-021-muted);
font-variant-numeric:tabular-nums;text-align:left;
}
[data-vibeui-block="solutions-021"] [data-part="lane"]{
padding:0.3125rem 0;border-top:1px solid var(--vibeui-solutions-021-border);
}
[data-vibeui-block="solutions-021"] [data-part="room"]{grid-column:1;padding-right:0.75rem}
[data-vibeui-block="solutions-021"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650;line-height:1.25}
[data-vibeui-block="solutions-021"] [data-part="gear"]{
display:block;font-size:0.625rem;color:var(--vibeui-solutions-021-muted);
}
/* Свободный час — кнопка, занятый — текст: чужую встречу нельзя нажать. */
[data-vibeui-block="solutions-021"] button[data-part="free"]{
grid-row:1;appearance:none;cursor:pointer;width:100%;height:2rem;
border-radius:0.375rem;border:1px dashed var(--vibeui-solutions-021-border);
background:var(--vibeui-solutions-021-bg);color:var(--vibeui-solutions-021-muted);
font:inherit;font-size:0.625rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-021"] button[data-part="free"]:hover{
border-style:solid;border-color:var(--vibeui-solutions-021-accent);color:var(--vibeui-solutions-021-accent);
}
[data-vibeui-block="solutions-021"] button[data-part="free"]:focus-visible{
outline:2px solid var(--vibeui-solutions-021-accent);outline-offset:2px;
}
/* Бронь занимает диапазон колонок: двухчасовая встреча — один блок. */
[data-vibeui-block="solutions-021"] [data-part="booked"]{
grid-row:1;height:2rem;border-radius:0.375rem;
display:flex;align-items:center;padding:0 0.5rem;
background:color-mix(in oklab,var(--vibeui-solutions-021-accent) 16%,var(--vibeui-solutions-021-bg));
border:1px solid color-mix(in oklab,var(--vibeui-solutions-021-accent) 45%,transparent);
border-left:3px solid var(--vibeui-solutions-021-accent);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-021-fg);
overflow:hidden;white-space:nowrap;text-overflow:ellipsis;
}
[data-vibeui-block="solutions-021"] [data-guest="true"]{
background:color-mix(in oklab,var(--vibeui-solutions-021-guest) 16%,var(--vibeui-solutions-021-bg));
border-color:color-mix(in oklab,var(--vibeui-solutions-021-guest) 45%,transparent);
border-left-color:var(--vibeui-solutions-021-guest);
}
[data-vibeui-block="solutions-021"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-021-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

const DEFAULT_ROOMS: Solutions021Room[] = [
  {
    name: "Аквариум",
    seats: 12,
    gear: "экран, доска, ВКС",
    bookings: [
      { from: 0, to: 2, who: "Планёрка продукта" },
      { from: 4, to: 6, who: "Демо для «Версты»", internal: false },
    ],
  },
  {
    name: "Тихая",
    seats: 4,
    gear: "экран",
    bookings: [
      { from: 1, to: 2, who: "1-на-1: Дина" },
      { from: 3, to: 4, who: "Собеседование", internal: false },
      { from: 7, to: 9, who: "Ретро команды" },
    ],
  },
  {
    name: "Переговорка 3",
    seats: 8,
    gear: "доска",
    bookings: [{ from: 5, to: 7, who: "Разбор инцидента" }],
  },
  {
    name: "Гостевая",
    seats: 6,
    gear: "экран, кофе",
    bookings: [
      { from: 2, to: 4, who: "Встреча с «Истоком»", internal: false },
      { from: 8, to: 10, who: "Обучение новичков" },
    ],
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
 * Сетка переговорных: матрица «комната × час», бронь занимает диапазон колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions021({
  title = "Переговорные",
  day = "Четверг, 14 марта · 3 этаж · UTC+3",
  hours = DEFAULT_HOURS,
  rooms = DEFAULT_ROOMS,
  freeLabel = "свободно",
  busyText = "Занято {busy} из {total} часов",
  seatsText = "{seats} мест",
  freeSlotLabelText = "{room}, {hour} — {label}",
  footText = "Розовым помечены встречи с внешними гостями — им нужен пропуск.",
  accent,
  background = "",
  className,
  style,
}: Solutions021Props) {
  const busy = rooms.reduce(
    (sum, room) =>
      sum +
      room.bookings.reduce(
        (inner, booking) => inner + (booking.to - booking.from),
        0,
      ),
    0,
  )
  const capacity = rooms.length * hours.length

  const palette = {
    ...(accent ? { "--vibeui-solutions-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-solutions-021-hours": String(hours.length),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-021" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-021"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="day">{day}</p>
          </div>
          <p data-part="day">
            {busyText
              .replace("{busy}", String(busy))
              .replace("{total}", String(capacity))}
          </p>
        </header>

        <div data-part="scroll">
          <div data-part="grid">
            <div data-part="ruler">
              <span />
              {hours.map((hour) => (
                <b key={hour}>{hour}</b>
              ))}
            </div>

            {rooms.map((room) => {
              const taken = new Set<number>()

              for (const booking of room.bookings) {
                for (let hour = booking.from; hour < booking.to; hour += 1) {
                  taken.add(hour)
                }
              }

              return (
                <div data-part="lane" key={room.name}>
                  <span data-part="room">
                    <span data-part="name">{room.name}</span>
                    <span data-part="gear">
                      {seatsText.replace("{seats}", String(room.seats))} ·{" "}
                      {room.gear}
                    </span>
                  </span>

                  {hours.map((hour, index) =>
                    taken.has(index) ? null : (
                      <button
                        type="button"
                        data-part="free"
                        key={hour}
                        style={{ gridColumn: index + 2 }}
                        aria-label={freeSlotLabelText
                          .replace("{room}", room.name)
                          .replace("{hour}", hour)
                          .replace("{label}", freeLabel)}
                      >
                        {hour}
                      </button>
                    ),
                  )}

                  {room.bookings.map((booking) => (
                    <p
                      data-part="booked"
                      data-guest={booking.internal === false ? "true" : "false"}
                      key={`${room.name}-${booking.from}`}
                      style={{
                        gridColumn: `${booking.from + 2} / ${booking.to + 2}`,
                      }}
                    >
                      {booking.who}
                    </p>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <p data-part="foot">{footText}</p>
      </section>
    </>
  )
}
