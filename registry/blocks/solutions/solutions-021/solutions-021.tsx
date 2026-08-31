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
  accent?: string
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
--vibeui-solutions-021-bg:oklch(1 0 0);
--vibeui-solutions-021-panel:oklch(0.975 0.004 260);
--vibeui-solutions-021-fg:oklch(0.21 0.014 265);
--vibeui-solutions-021-muted:oklch(0.54 0.014 265);
--vibeui-solutions-021-border:oklch(0.9 0.006 265);
--vibeui-solutions-021-accent:oklch(0.52 0.16 255);
--vibeui-solutions-021-guest:oklch(0.6 0.15 320);
--vibeui-solutions-021-hours:10;
--vibeui-solutions-021-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-021"]{
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
 * Сетка переговорных: матрица «комната × час», бронь занимает диапазон колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions021({
  title = "Переговорные",
  day = "Четверг, 14 марта · 3 этаж · UTC+3",
  hours = DEFAULT_HOURS,
  rooms = DEFAULT_ROOMS,
  freeLabel = "свободно",
  accent,
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
            Занято {busy} из {capacity} часов
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
                      {room.seats} мест · {room.gear}
                    </span>
                  </span>

                  {hours.map((hour, index) =>
                    taken.has(index) ? null : (
                      <button
                        type="button"
                        data-part="free"
                        key={hour}
                        style={{ gridColumn: index + 2 }}
                        aria-label={`${room.name}, ${hour} — ${freeLabel}`}
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

        <p data-part="foot">
          Розовым помечены встречи с внешними гостями — им нужен пропуск.
        </p>
      </section>
    </>
  )
}
