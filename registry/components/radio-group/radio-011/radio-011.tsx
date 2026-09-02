import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio011Slot = {
  value: string
  day: string
  time: string
  price: string
  disabled?: boolean
}

export type Radio011Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  slots?: Radio011Slot[]
  name?: string
  defaultValue?: string
  /** Что стоит вместо цены у занятого слота. */
  busyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: слоты доставки сгруппированы по дню — так решение
// принимают в два взгляда, день и время, а не читая дату в каждой строке.
// Группировка считается один раз при рендере из плоского массива, разметка
// остаётся одной radio-группой с общим name на все дни и слоты.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-011"]){
--vibeui-radio-011-bg:transparent;
--vibeui-radio-011-card:light-dark(oklch(0.99 0.002 265),oklch(0.27 0.008 265));
--vibeui-radio-011-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-011-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-radio-011-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-radio-011-accent:light-dark(oklch(0.58 0.17 40),oklch(0.76 0.14 40));
--vibeui-radio-011-tint:light-dark(oklch(0.58 0.17 40 / 8%),oklch(0.76 0.14 40 / 16%));
--vibeui-radio-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-011"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-011-bg);
border:1px solid var(--vibeui-radio-011-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-011-font);color:var(--vibeui-radio-011-fg);
}
[data-vibeui-block="radio-011"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-011"] [data-part="days"]{
clear:both;display:grid;gap:0.75rem;
grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr));
}
[data-vibeui-block="radio-011"] [data-part="day"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="radio-011"] [data-part="day-title"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-radio-011-muted);
}
[data-vibeui-block="radio-011"] [data-part="slot"]{
display:flex;flex-direction:column;gap:0.125rem;cursor:pointer;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-radio-011-border);
background:var(--vibeui-radio-011-card);
transition:border-color .16s ease,background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="radio-011"] [data-part="slot"]:has(input:checked){
border-color:var(--vibeui-radio-011-accent);background:var(--vibeui-radio-011-tint);
}
[data-vibeui-block="radio-011"] [data-part="slot"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-011-accent);outline-offset:2px;
}
[data-vibeui-block="radio-011"] [data-part="slot"]:has(input:disabled){
cursor:not-allowed;opacity:.5;background:transparent;
}
/* Радио спрятано визуально: кликабельна вся плашка слота целиком. */
[data-vibeui-block="radio-011"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-011"] [data-part="time"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="radio-011"] [data-part="price"]{
font-size:0.75rem;color:var(--vibeui-radio-011-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLOTS: Radio011Slot[] = [
  { value: "today-1", day: "Сегодня", time: "18:00–20:00", price: "390 ₽" },
  { value: "today-2", day: "Сегодня", time: "20:00–22:00", price: "590 ₽" },
  {
    value: "tomorrow-1",
    day: "Завтра",
    time: "10:00–12:00",
    price: "190 ₽",
  },
  {
    value: "tomorrow-2",
    day: "Завтра",
    time: "18:00–20:00",
    price: "190 ₽",
    disabled: true,
  },
  { value: "later-1", day: "Послезавтра", time: "10:00–12:00", price: "0 ₽" },
]

function groupByDay(slots: Radio011Slot[]) {
  const groups: { day: string; items: Radio011Slot[] }[] = []

  for (const slot of slots) {
    const group = groups.find((entry) => entry.day === slot.day)

    if (group) {
      group.items.push(slot)
    } else {
      groups.push({ day: slot.day, items: [slot] })
    }
  }

  return groups
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
 * Выбор слота доставки: слоты сгруппированы по дню, недоступные погашены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio011({
  legend = "Время доставки",
  slots = DEFAULT_SLOTS,
  name = "vibeui-radio-011",
  defaultValue = "tomorrow-1",
  busyLabel = "занято",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio011Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-011" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-011"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="days">
          {groupByDay(slots).map((group) => (
            <div key={group.day} data-part="day">
              <span data-part="day-title">{group.day}</span>
              {group.items.map((slot) => (
                <label key={slot.value} data-part="slot">
                  <input
                    type="radio"
                    name={name}
                    value={slot.value}
                    disabled={slot.disabled}
                    defaultChecked={slot.value === defaultValue}
                  />
                  <span data-part="time">{slot.time}</span>
                  <span data-part="price">
                    {slot.disabled ? busyLabel : slot.price}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
    </>
  )
}
