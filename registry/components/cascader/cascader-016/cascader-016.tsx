"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cascader016Room = { name: string; seats: number; busy?: boolean }

export type Cascader016Floor = { name: string; rooms: Cascader016Room[] }

export type Cascader016Building = { name: string; floors: Cascader016Floor[] }

export type Cascader016Props = Omit<
  ComponentProps<"section">,
  "children" | "onSelect"
> & {
  label?: string
  buildings?: Cascader016Building[]
  defaultRoom?: string
  /** Подписи уровней для скринридера: здания, этажи, комнаты. */
  levelLabels?: { buildings: string; floors: string; rooms: string }
  /** Три формы слова «место» для числа мест. */
  seatsForms?: [string, string, string]
  /** Подпись занятой комнаты. */
  busyText?: string
  /** Итог, пока комната не выбрана. */
  emptyText?: string
  onSelect?: (building: string, floor: string, room: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: «здание → этаж → комната» — это не список списков,
// а три разных по природе выбора. Здания сделаны вкладками, этажи —
// фишками, а комнаты сеткой плиток с вместимостью: последний уровень
// пространственный, и плитка ближе к плану этажа, чем строка списка.
const STYLES = `
:where([data-vibeui-block="cascader-016"]){
--vibeui-cascader-016-bg:transparent;
--vibeui-cascader-016-fg:light-dark(oklch(0.22 0.014 210),oklch(0.94 0.006 210));
--vibeui-cascader-016-muted:color-mix(in oklab,var(--vibeui-cascader-016-fg) 68%,transparent);
--vibeui-cascader-016-border:light-dark(oklch(0.9 0.008 210),oklch(0.35 0.012 210));
--vibeui-cascader-016-soft:light-dark(oklch(0.965 0.008 210),oklch(0.27 0.012 210));
--vibeui-cascader-016-tab:light-dark(oklch(1 0 0),oklch(0.36 0.014 210));
--vibeui-cascader-016-onaccent:light-dark(oklch(1 0 0),oklch(0.2 0.02 210));
--vibeui-cascader-016-busy:light-dark(oklch(0.94 0.03 25),oklch(0.33 0.045 25));
--vibeui-cascader-016-busyfg:light-dark(oklch(0.5 0.1 25),oklch(0.82 0.09 25));
--vibeui-cascader-016-accent:light-dark(oklch(0.48 0.11 39.8),oklch(0.75 0.12 39.8));
--vibeui-cascader-016-accentsoft:light-dark(oklch(0.94 0.045 39.8),oklch(0.32 0.05 39.8));
--vibeui-cascader-016-radius:0.625rem;
--vibeui-cascader-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-016"]{color-scheme:dark}
[data-vibeui-block="cascader-016"]{
display:flex;flex-direction:column;gap:0.5625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-016-bg);
border:1px solid var(--vibeui-cascader-016-border);
border-radius:calc(var(--vibeui-cascader-016-radius) + 0.25rem);
color:var(--vibeui-cascader-016-fg);
font-family:var(--vibeui-cascader-016-font);
}
[data-vibeui-block="cascader-016"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-016"] [data-part="tabs"]{
display:flex;gap:0.125rem;padding:0.125rem;border-radius:0.5625rem;
background:var(--vibeui-cascader-016-soft);
}
[data-vibeui-block="cascader-016"] [data-part="tab"]{
appearance:none;cursor:pointer;font:inherit;flex:1 1 0;min-width:0;
padding:0.375rem 0.5rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-cascader-016-muted);
font-size:0.8125rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="cascader-016"] [data-part="tab"][aria-selected="true"]{
background:var(--vibeui-cascader-016-tab);color:var(--vibeui-cascader-016-fg);
box-shadow:0 1px 2px oklch(0.2 0.02 210 / 12%);
}
[data-vibeui-block="cascader-016"] [data-part="tab"]:focus-visible,
[data-vibeui-block="cascader-016"] [data-part="floor"]:focus-visible,
[data-vibeui-block="cascader-016"] [data-part="room"]:focus-visible{
outline:2px solid var(--vibeui-cascader-016-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-016"] [data-part="floors"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="cascader-016"] [data-part="floor"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-cascader-016-border);
background:transparent;color:var(--vibeui-cascader-016-muted);
font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="cascader-016"] [data-part="floor"][aria-pressed="true"]{
background:var(--vibeui-cascader-016-accent);border-color:transparent;
color:var(--vibeui-cascader-016-onaccent);
}
[data-vibeui-block="cascader-016"] [data-part="rooms"]{
display:grid;grid-template-columns:repeat(auto-fill,minmax(6.5rem,1fr));gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="cascader-016"] [data-part="room"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;flex-direction:column;gap:0.125rem;
box-sizing:border-box;padding:0.5rem 0.5625rem;
border:1px solid var(--vibeui-cascader-016-border);
border-radius:0.5rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="cascader-016"] [data-part="room"]:hover:not(:disabled){border-color:var(--vibeui-cascader-016-accent)}
[data-vibeui-block="cascader-016"] [data-part="room"][aria-pressed="true"]{
background:var(--vibeui-cascader-016-accentsoft);border-color:var(--vibeui-cascader-016-accent);
}
[data-vibeui-block="cascader-016"] [data-part="room"]:disabled{
cursor:not-allowed;background:var(--vibeui-cascader-016-busy);
border-color:transparent;color:var(--vibeui-cascader-016-busyfg);
}
[data-vibeui-block="cascader-016"] [data-part="roomname"]{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="cascader-016"] [data-part="seats"]{font-size:0.6875rem;color:var(--vibeui-cascader-016-muted)}
[data-vibeui-block="cascader-016"] [data-part="room"]:disabled [data-part="seats"]{color:inherit}
[data-vibeui-block="cascader-016"] [data-part="path"]{
margin:0;padding-top:0.5625rem;border-top:1px solid var(--vibeui-cascader-016-border);
font-size:0.8125rem;color:var(--vibeui-cascader-016-muted);
}
[data-vibeui-block="cascader-016"] [data-part="path"] b{color:var(--vibeui-cascader-016-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-016"] *{animation:none!important;transition:none!important}}
`

const CAMPUS: Cascader016Building[] = [
  {
    name: "Корпус А",
    floors: [
      {
        name: "1 этаж",
        rooms: [
          { name: "А-101", seats: 4 },
          { name: "А-102", seats: 8, busy: true },
          { name: "А-105", seats: 2 },
        ],
      },
      {
        name: "2 этаж",
        rooms: [
          { name: "А-201", seats: 12 },
          { name: "А-204", seats: 6 },
        ],
      },
    ],
  },
  {
    name: "Корпус Б",
    floors: [
      {
        name: "3 этаж",
        rooms: [
          { name: "Б-301", seats: 6, busy: true },
          { name: "Б-302", seats: 10 },
          { name: "Б-310", seats: 3 },
          { name: "Б-311", seats: 3 },
        ],
      },
    ],
  },
]

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
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
 * Выбор места: здание вкладками, этаж фишками, комната плиткой сетки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader016({
  label = "Место встречи",
  buildings = CAMPUS,
  defaultRoom = "А-201",
  levelLabels = { buildings: "Здания", floors: "Этажи", rooms: "Комнаты" },
  seatsForms = ["место", "места", "мест"],
  busyText = "занята",
  emptyText = "Комната не выбрана",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader016Props) {
  const [building, setBuilding] = useState(buildings[0]?.name ?? "")
  const [floor, setFloor] = useState(buildings[0]?.floors[1]?.name ?? "")
  const [room, setRoom] = useState(defaultRoom)

  const current = buildings.find((entry) => entry.name === building)
  const floors = current?.floors ?? []
  const rooms = floors.find((entry) => entry.name === floor)?.rooms ?? []
  const picked = rooms.find((entry) => entry.name === room)

  const seatsLabel = (seats: number) =>
    `${seats} ${pluralize(seats, seatsForms)}`

  const palette = {
    ...(accent ? { "--vibeui-cascader-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="cascader"
        data-vibeui-block="cascader-016"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="tabs" role="tablist" aria-label={levelLabels.buildings}>
          {buildings.map((entry) => (
            <button
              key={entry.name}
              type="button"
              role="tab"
              data-part="tab"
              aria-selected={entry.name === building}
              onClick={() => {
                setBuilding(entry.name)
                setFloor(entry.floors[0]?.name ?? "")
                setRoom("")
              }}
            >
              {entry.name}
            </button>
          ))}
        </div>
        <ul data-part="floors" aria-label={levelLabels.floors}>
          {floors.map((entry) => (
            <li key={entry.name}>
              <button
                type="button"
                data-part="floor"
                aria-pressed={entry.name === floor}
                onClick={() => {
                  setFloor(entry.name)
                  setRoom("")
                }}
              >
                {entry.name}
              </button>
            </li>
          ))}
        </ul>
        <ul data-part="rooms" aria-label={levelLabels.rooms}>
          {rooms.map((entry) => (
            <li key={entry.name}>
              <button
                type="button"
                data-part="room"
                disabled={entry.busy}
                aria-pressed={entry.name === room}
                aria-label={`${entry.name}, ${seatsLabel(entry.seats)}${entry.busy ? `, ${busyText}` : ""}`}
                onClick={() => {
                  setRoom(entry.name)
                  onSelect?.(building, floor, entry.name)
                }}
              >
                <span data-part="roomname">{entry.name}</span>
                <span data-part="seats">
                  {entry.busy ? busyText : seatsLabel(entry.seats)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p data-part="path" aria-live="polite">
          {picked ? (
            <>
              <b>
                {building} · {floor} · {picked.name}
              </b>{" "}
              — {seatsLabel(picked.seats)}
            </>
          ) : (
            emptyText
          )}
        </p>
      </section>
    </>
  )
}
