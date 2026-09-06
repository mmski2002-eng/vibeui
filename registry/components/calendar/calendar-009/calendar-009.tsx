import type { ComponentProps, CSSProperties } from "react"

export type Calendar009Props = Omit<ComponentProps<"div">, "children"> & {
  from?: string
  to?: string
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Счёт ночей. {count} подставляется числом. */
  nightsText?: string
}

// Идея компонента: два месяца рядом для брони. Диапазон почти всегда
// пересекает границу месяца, и в одном окне человек теряет счёт ночам,
// переключаясь туда-сюда. На узкой ширине второй месяц уходит под первый, а
// не сжимается: календарь в 140 пикселей нечитаем.
const STYLES = `
:where([data-vibeui-block="calendar-009"]){
--vibeui-calendar-009-bg:transparent;
--vibeui-calendar-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-calendar-009-muted:color-mix(in oklab,var(--vibeui-calendar-009-fg) 68%,transparent);
--vibeui-calendar-009-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-009-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.72 0.15 39.8));
--vibeui-calendar-009-on-accent:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-calendar-009-range:light-dark(color-mix(in oklab,var(--vibeui-calendar-009-accent) 12%,oklch(1 0 0)),color-mix(in oklab,var(--vibeui-calendar-009-accent) 26%,oklch(0.24 0 265)));
--vibeui-calendar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-009"]{color-scheme:dark}
[data-vibeui-block="calendar-009"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-calendar-009-font);color:var(--vibeui-calendar-009-fg);
}
[data-vibeui-block="calendar-009"] [data-part="card"]{
box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-009-bg);
border:1px solid var(--vibeui-calendar-009-border);border-radius:0.875rem;
}
[data-vibeui-block="calendar-009"] [data-part="months"]{display:flex;gap:1.25rem}
[data-vibeui-block="calendar-009"] [data-part="month"]{flex:1;min-width:0}
[data-vibeui-block="calendar-009"] [data-part="title"]{
margin:0 0 0.375rem;font-size:0.9375rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-009"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-009"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-009"] th{padding:0.1875rem 0;font-size:0.6875rem;font-weight:600;color:var(--vibeui-calendar-009-muted);text-transform:capitalize}
[data-vibeui-block="calendar-009"] td{
height:1.875rem;padding:0;text-align:center;
font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-009"] td[data-in="true"]{background:var(--vibeui-calendar-009-range)}
[data-vibeui-block="calendar-009"] td[data-edge="from"]{border-radius:0.4375rem 0 0 0.4375rem}
[data-vibeui-block="calendar-009"] td[data-edge="to"]{border-radius:0 0.4375rem 0.4375rem 0}
[data-vibeui-block="calendar-009"] td[data-edge] span{
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
background:var(--vibeui-calendar-009-accent);color:var(--vibeui-calendar-009-on-accent);font-weight:650;
}
[data-vibeui-block="calendar-009"] td[data-outside="true"]{color:var(--vibeui-calendar-009-muted);opacity:.45}
[data-vibeui-block="calendar-009"] [data-part="summary"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
margin:0.75rem 0 0;font-size:0.875rem;color:var(--vibeui-calendar-009-muted);
}
[data-vibeui-block="calendar-009"] [data-part="nights"]{color:var(--vibeui-calendar-009-fg);font-weight:650}
/* В узкой колонке второй месяц уходит вниз: календарь в 140 пикселей
   не читается, а перенос сохраняет обе сетки целыми. */
@container (max-width: 30rem){
[data-vibeui-block="calendar-009"] [data-part="months"]{flex-direction:column;gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-009"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  return Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )
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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? fallback
    : value
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
 * Два месяца рядом с подсвеченным диапазоном и счётом ночей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar009({
  from: fromProp = "2026-03-28",
  to: toProp = "2026-04-05",
  locale: localeProp = "ru-RU",
  accent,
  background = "",
  nightsText = "{count} ночей",
  className,
  style,
  ...props
}: Calendar009Props) {
  const from = safeDate(fromProp, "2026-03-28")
  const to = safeDate(toProp, "2026-04-05")
  const locale = safeLocale(localeProp, "ru-RU")
  const [year, month] = from.split("-").map(Number)
  const months = [{ year, month: month - 1 }, new Date(year, month, 1)].map(
    (value, index) =>
      index === 0
        ? (value as { year: number; month: number })
        : {
            year: (value as Date).getFullYear(),
            month: (value as Date).getMonth(),
          },
  )

  const week = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  })
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" })

  const nights = Math.round(
    (new Date(`${to}T00:00:00`).getTime() -
      new Date(`${from}T00:00:00`).getTime()) /
      DAY,
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-009"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="months">
            {months.map((value) => {
              const days = buildGrid(value.year, value.month)

              return (
                <section key={`${value.year}-${value.month}`} data-part="month">
                  <h3 data-part="title">
                    {title.format(new Date(value.year, value.month, 1))}
                  </h3>
                  <table>
                    <thead>
                      <tr>
                        {days.slice(0, 7).map((date) => (
                          <th key={date.toISOString()} scope="col">
                            {week.format(date)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 6 }, (_, row) => (
                        <tr key={row}>
                          {days.slice(row * 7, row * 7 + 7).map((date) => {
                            const key = iso(date)
                            const outside = date.getMonth() !== value.month
                            const inRange = !outside && key >= from && key <= to
                            const edge =
                              key === from
                                ? "from"
                                : key === to
                                  ? "to"
                                  : undefined

                            return (
                              <td
                                key={key}
                                data-outside={outside}
                                data-in={inRange}
                                data-edge={outside ? undefined : edge}
                              >
                                {edge && !outside ? (
                                  <span>{date.getDate()}</span>
                                ) : (
                                  date.getDate()
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )
            })}
          </div>
          <p data-part="summary">
            <span>
              {day.format(new Date(`${from}T00:00:00`))} —{" "}
              {day.format(new Date(`${to}T00:00:00`))}
            </span>
            <span data-part="nights">
              {nightsText.replace("{count}", String(nights))}
            </span>
          </p>
        </div>
      </div>
    </>
  )
}
