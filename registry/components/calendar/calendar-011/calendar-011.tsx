import type { ComponentProps, CSSProperties } from "react"

export type Calendar011Props = Omit<ComponentProps<"div">, "children"> & {
  year?: number
  /** Отмеченные даты в ISO: 2026-03-14. Строки, а не Date — их проще отдать с сервера. */
  marks?: string[]
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Итог в шапке. {count} — число, {word} — форма слова из countWords. */
  totalText?: string
  /** Три формы слова: одна дата, две даты, пять дат. */
  countWords?: [string, string, string]
  /** Подпись отмеченного дня. {date} подставляется полной датой. */
  markLabelText?: string
}

// Идея компонента: год целиком — двенадцать миниатюр месяцев на одной
// плоскости. Числа мелкие и читаются плохо, поэтому работу делают отметки:
// год нужен, чтобы увидеть, где густо и где пусто, а не чтобы прочитать дату.
const STYLES = `
:where([data-vibeui-block="calendar-011"]){
--vibeui-calendar-011-bg:transparent;
--vibeui-calendar-011-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-011-muted:color-mix(in oklab,var(--vibeui-calendar-011-fg) 68%,transparent);
--vibeui-calendar-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-011-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.19 0.03 265));
--vibeui-calendar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-011"]{color-scheme:dark}
[data-vibeui-block="calendar-011"]{
width:100%;max-width:46rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-011-bg);
border:1px solid var(--vibeui-calendar-011-border);border-radius:1rem;
color:var(--vibeui-calendar-011-fg);font-family:var(--vibeui-calendar-011-font);
}
[data-vibeui-block="calendar-011"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0 0 0.875rem;
}
[data-vibeui-block="calendar-011"] [data-part="year"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-011"] [data-part="total"]{
font-size:0.875rem;color:var(--vibeui-calendar-011-muted);
}
[data-vibeui-block="calendar-011"] [data-part="shell"]{
display:grid;gap:0.75rem;
grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr));
}
[data-vibeui-block="calendar-011"] [data-part="month"]{
min-width:0;
}
[data-vibeui-block="calendar-011"] [data-part="name"]{
margin:0 0 0.3125rem;font-size:0.75rem;font-weight:650;text-transform:capitalize;
}
[data-vibeui-block="calendar-011"] [data-part="name"] b{
font-weight:650;color:var(--vibeui-calendar-011-accent);
}
[data-vibeui-block="calendar-011"] [data-part="mini"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.0625rem;
}
[data-vibeui-block="calendar-011"] [data-part="wd"]{
font-size:0.5625rem;line-height:1.2;text-align:center;
color:var(--vibeui-calendar-011-muted);text-transform:lowercase;
}
[data-vibeui-block="calendar-011"] [data-part="day"]{
aspect-ratio:1;display:flex;align-items:center;justify-content:center;
border-radius:0.25rem;font-size:0.625rem;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-011"] [data-part="day"][data-weekend="true"]{
color:var(--vibeui-calendar-011-muted);
}
/* Отметка — заливка целой клетки, а не точка: на миниатюре точка в шесть
   пикселей теряется, а плотность месяца перестаёт читаться. */
[data-vibeui-block="calendar-011"] [data-part="day"][data-mark="true"]{
background:var(--vibeui-calendar-011-accent);color:var(--vibeui-calendar-011-on-accent);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MARKS = [
  "2026-01-07",
  "2026-01-19",
  "2026-02-14",
  "2026-02-23",
  "2026-03-08",
  "2026-03-14",
  "2026-03-27",
  "2026-04-12",
  "2026-05-01",
  "2026-05-09",
  "2026-06-12",
  "2026-06-13",
  "2026-07-04",
  "2026-08-22",
  "2026-09-01",
  "2026-09-30",
  "2026-10-05",
  "2026-11-04",
  "2026-12-25",
  "2026-12-31",
]

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) {
    return forms[2]
  }

  if (ones === 1) {
    return forms[0]
  }

  if (ones > 1 && ones < 5) {
    return forms[1]
  }

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
 * Год и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за неверного значения: NaN даёт Invalid Date, а Intl бросает
 * RangeError и на нём, и на нераспознанной локали — белый экран вместо сайта.
 */
function safeYear(year: number, fallback: number) {
  return Number.isNaN(new Date(year, 0, 1).getTime()) ? fallback : year
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
 * Год двенадцатью миниатюрами месяцев с заливкой отмеченных дней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar011({
  year: yearProp = 2026,
  marks = DEFAULT_MARKS,
  locale: localeProp = "ru-RU",
  accent,
  background = "",
  totalText = "{count} {word} отмечено",
  countWords = ["дата", "даты", "дат"],
  markLabelText = "{date} — отмечено",
  className,
  style,
  ...props
}: Calendar011Props) {
  const year = safeYear(yearProp, 2026)
  const locale = safeLocale(localeProp, "ru-RU")
  const monthName = new Intl.DateTimeFormat(locale, { month: "long" })
  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "narrow" })
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  const marked = new Set(marks)

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    // 5 января 2026 — понедельник: опора нужна, чтобы неделя начиналась
    // с понедельника независимо от локали.
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const total = marks.filter((value) => value.startsWith(`${year}-`)).length

  return (
    <>
      <style href="vibeui-calendar-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-011"
        className={className}
        style={palette}
      >
        <header data-part="head">
          <p data-part="year">{year}</p>
          <p data-part="total">
            {totalText
              .replace("{count}", String(total))
              .replace("{word}", pluralize(total, countWords))}
          </p>
        </header>
        <div data-part="shell">
          {Array.from({ length: 12 }, (_, month) => {
            const first = new Date(year, month, 1)
            const lead = (first.getDay() + 6) % 7
            const length = new Date(year, month + 1, 0).getDate()
            const inMonth = Array.from({ length }, (_, index) => index + 1)
            const hits = inMonth.filter((day) =>
              marked.has(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
              ),
            ).length

            return (
              <section key={month} data-part="month">
                <h3 data-part="name">
                  {monthName.format(first)}
                  {hits > 0 ? <b> · {hits}</b> : null}
                </h3>
                <div data-part="mini">
                  {weekdays.map((label, index) => (
                    <span key={index} data-part="wd" aria-hidden="true">
                      {label}
                    </span>
                  ))}
                  {Array.from({ length: lead }, (_, index) => (
                    <span key={`lead-${index}`} data-part="day" />
                  ))}
                  {inMonth.map((day) => {
                    const date = new Date(year, month, day)
                    const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const weekend = date.getDay() === 0 || date.getDay() === 6
                    const hit = marked.has(value)

                    return (
                      <span
                        key={day}
                        data-part="day"
                        data-weekend={weekend}
                        data-mark={hit}
                        title={hit ? fullDate.format(date) : undefined}
                        aria-label={
                          hit
                            ? markLabelText.replace(
                                "{date}",
                                fullDate.format(date),
                              )
                            : undefined
                        }
                      >
                        {day}
                      </span>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
