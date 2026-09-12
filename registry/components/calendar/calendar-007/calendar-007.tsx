import type { ComponentProps, CSSProperties } from "react"

export type Calendar007Props = Omit<ComponentProps<"div">, "children"> & {
  year?: number
  month?: number
  /** Загрузка по дням месяца: 0 — свободно, 1 — занято целиком. */
  load?: number[]
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подписи шкалы: компонент несёт русские, проект подставляет свои. */
  lowLabel?: string
  highLabel?: string
  /** Подпись клетки. {day} и {load} подставляются числами. */
  dayLabel?: string
}

// Идея компонента: месяц как карта загрузки. Насыщенность клетки показывает
// занятость, но число внутри остаётся: по одному цвету процент не назвать, а
// сравнить два дня «на глаз» ошибаются все. Ступеней пять, а не непрерывная
// шкала — глаз всё равно различает не больше.
const STYLES = `
:where([data-vibeui-block="calendar-007"]){
--vibeui-calendar-007-bg:transparent;
--vibeui-calendar-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-calendar-007-muted:color-mix(in oklab,var(--vibeui-calendar-007-fg) 68%,transparent);
--vibeui-calendar-007-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-007-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-calendar-007-on-accent:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-calendar-007-empty:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-calendar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-007"]{color-scheme:dark}
[data-vibeui-block="calendar-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-007-bg);
border:1px solid var(--vibeui-calendar-007-border);border-radius:0.875rem;
color:var(--vibeui-calendar-007-fg);font-family:var(--vibeui-calendar-007-font);
}
[data-vibeui-block="calendar-007"] [data-part="title"]{font-size:0.9375rem;font-weight:650}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-007"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-007"] table{width:100%;border-collapse:separate;border-spacing:0.1875rem;table-layout:fixed}
[data-vibeui-block="calendar-007"] th{padding:0;font-size:0.6875rem;font-weight:600;color:var(--vibeui-calendar-007-muted);text-transform:capitalize}
[data-vibeui-block="calendar-007"] td{
height:2rem;padding:0;border-radius:0.375rem;text-align:center;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
/* Пять ступеней вместо непрерывной шкалы: больше глаз не различает. */
background:color-mix(in oklab,var(--vibeui-calendar-007-accent) calc(var(--vibeui-calendar-007-step,0) * 22%),var(--vibeui-calendar-007-empty));
}
[data-vibeui-block="calendar-007"] td[data-step="3"],
[data-vibeui-block="calendar-007"] td[data-step="4"]{color:var(--vibeui-calendar-007-on-accent)}
[data-vibeui-block="calendar-007"] td[data-empty="true"]{background:transparent}
[data-vibeui-block="calendar-007"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-calendar-007-muted);
}
[data-vibeui-block="calendar-007"] [data-part="scale"]{display:flex;gap:0.125rem}
[data-vibeui-block="calendar-007"] [data-part="scale"] i{
width:0.875rem;height:0.6875rem;border-radius:0.1875rem;
background:color-mix(in oklab,var(--vibeui-calendar-007-accent) calc(var(--vibeui-calendar-007-step,0) * 22%),var(--vibeui-calendar-007-empty));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-007"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

const DEFAULT_LOAD = [
  0.1, 0.2, 0.9, 0.4, 0.6, 0, 0, 0.3, 0.5, 1, 0.8, 0.2, 0, 0, 0.7, 0.9, 0.95,
  0.5, 0.3, 0, 0, 0.4, 0.6, 0.2, 0.1, 0.8, 0, 0, 0.5, 0.7, 0.3,
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
 * Месяц и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за неверного значения: NaN даёт Invalid Date, а Intl бросает
 * RangeError и на нём, и на нераспознанной локали — белый экран вместо сайта.
 */
function safeMonth(year: number, month: number, fallback: number[]) {
  return Number.isNaN(new Date(year, month - 1, 1).getTime())
    ? fallback
    : [year, month]
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Месяц как карта загрузки: ступени насыщенности и числа внутри клеток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar007({
  year: yearProp = 2026,
  month: monthProp = 3,
  load = DEFAULT_LOAD,
  locale: localeProp = "ru-RU",
  accent,
  background = "",
  lowLabel = "Свободно",
  highLabel = "Занято",
  dayLabel = "{day} число, загрузка {load}%",
  className,
  style,
  ...props
}: Calendar007Props) {
  const [year, month] = safeMonth(yearProp, monthProp, [2026, 3])
  const locale = safeLocale(localeProp, "ru-RU")
  const first = new Date(year, month - 1, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  const cells = Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )

  const week = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  const palette = {
    ...(accent ? { "--vibeui-calendar-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-007"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <table>
          <thead>
            <tr>
              {cells.slice(0, 7).map((date) => (
                <th key={date.toISOString()} scope="col">
                  {week.format(date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {cells.slice(row * 7, row * 7 + 7).map((date) => {
                  const outside = date.getMonth() !== month - 1
                  const value = outside ? 0 : (load[date.getDate() - 1] ?? 0)
                  const step = Math.round(value * 4)

                  return (
                    <td
                      key={date.toISOString()}
                      data-empty={outside}
                      data-step={step}
                      style={
                        { "--vibeui-calendar-007-step": step } as CSSProperties
                      }
                      aria-label={
                        outside
                          ? undefined
                          : dayLabel
                              .replace("{day}", String(date.getDate()))
                              .replace(
                                "{load}",
                                String(Math.round(value * 100)),
                              )
                      }
                    >
                      {outside ? "" : date.getDate()}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p data-part="legend">
          {lowLabel}
          <span data-part="scale" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((step) => (
              <i
                key={step}
                style={{ "--vibeui-calendar-007-step": step } as CSSProperties}
              />
            ))}
          </span>
          {highLabel}
        </p>
      </div>
    </>
  )
}
