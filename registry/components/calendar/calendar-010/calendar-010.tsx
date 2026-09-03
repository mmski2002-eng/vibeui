import type { ComponentProps, CSSProperties } from "react"

export type Calendar010Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  date?: string
  time?: string
  place?: string
  people?: string[]
  locale?: string
  /** Подпись списка участников. {people} подставляется перечислением имён. */
  peopleLabel?: string
  accent?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: карточка встречи — то, что видно в приглашении и в списке
// событий. Дата вынесена отрывным листком слева: в ленте из десяти карточек
// глаз ищет число, а не строку «17 марта 2026». Участники — инициалы стопкой,
// имена целиком есть в подписи для скринридера.
const STYLES = `
:where([data-vibeui-block="calendar-010"]){
--vibeui-calendar-010-bg:transparent;
--vibeui-calendar-010-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-010-muted:color-mix(in oklab,var(--vibeui-calendar-010-fg) 68%,transparent);
--vibeui-calendar-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-010-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-010-sheet:light-dark(oklch(0.98 0.002 265),oklch(0.28 0.012 265));
/* Кольцо между наложенными аватарами: подложки у карточки нет, поэтому оно
   рисуется цветом страницы, а с пропом background — цветом плашки. */
--vibeui-calendar-010-ring:light-dark(oklch(1 0 0),oklch(0.19 0.012 265));
--vibeui-calendar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-010"]{color-scheme:dark}
[data-vibeui-block="calendar-010"]{
display:flex;gap:0.875rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-010-bg);
border:1px solid var(--vibeui-calendar-010-border);border-radius:0.875rem;
color:var(--vibeui-calendar-010-fg);font-family:var(--vibeui-calendar-010-font);
}
/* Отрывной листок: число крупно, месяц мелко — в ленте ищут именно число. */
[data-vibeui-block="calendar-010"] [data-part="sheet"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;
width:3.25rem;padding:0.4375rem 0;border-radius:0.625rem;
border:1px solid var(--vibeui-calendar-010-border);
background:var(--vibeui-calendar-010-sheet);
}
[data-vibeui-block="calendar-010"] [data-part="month"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-calendar-010-accent);
}
[data-vibeui-block="calendar-010"] [data-part="day"]{
font-size:1.375rem;font-weight:680;line-height:1.1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-010"] [data-part="weekday"]{font-size:0.6875rem;color:var(--vibeui-calendar-010-muted)}
[data-vibeui-block="calendar-010"] [data-part="body"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0}
[data-vibeui-block="calendar-010"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="calendar-010"] [data-part="line"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.875rem;color:var(--vibeui-calendar-010-muted);
}
[data-vibeui-block="calendar-010"] [data-part="clock"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid currentColor;border-radius:9999px;
}
[data-vibeui-block="calendar-010"] [data-part="clock"]::after{
content:"";position:absolute;left:50%;top:0.125rem;width:1.5px;height:0.25rem;
margin-left:-0.75px;background:currentColor;
}
[data-vibeui-block="calendar-010"] [data-part="pin"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid currentColor;border-radius:9999px 9999px 9999px 0;
transform:rotate(-45deg);
}
[data-vibeui-block="calendar-010"] [data-part="people"]{display:flex;align-items:center;margin-top:0.1875rem}
[data-vibeui-block="calendar-010"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
box-shadow:0 0 0 2px var(--vibeui-calendar-010-ring);
/* Кружок участника считается от своего тона, поэтому light-dark() нужен
   и здесь: без него на тёмной подложке горит светлая пастель. */
background:light-dark(oklch(0.93 0.04 var(--vibeui-calendar-010-hue,250)),oklch(0.34 0.06 var(--vibeui-calendar-010-hue,250)));
color:light-dark(oklch(0.38 0.08 var(--vibeui-calendar-010-hue,250)),oklch(0.92 0.05 var(--vibeui-calendar-010-hue,250)));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="calendar-010"] [data-part="face"] + [data-part="face"]{margin-left:-0.4375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-010"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
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
 * Карточка встречи: отрывной листок с датой, время, место и участники.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar010({
  title = "Разбор каталога с дизайнером",
  date: dateProp = "2026-03-17",
  time = "11:00 — 12:00",
  place = "Переговорная «Полёт»",
  people = ["Анна Петрова", "Марк Ильин", "Мария Гурова"],
  locale: localeProp = "ru-RU",
  peopleLabel = "Участники: {people}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar010Props) {
  const date = safeDate(dateProp, "2026-03-17")
  const locale = safeLocale(localeProp, "ru-RU")
  const value = new Date(`${date}T00:00:00`)
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(
    value,
  )
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    value,
  )
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    value,
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-010-bg": background,
          "--vibeui-calendar-010-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-010" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-010"
        className={className}
        style={palette}
      >
        <div data-part="sheet" aria-hidden="true">
          <span data-part="month">{month.replace(".", "")}</span>
          <span data-part="day">{value.getDate()}</span>
          <span data-part="weekday">{weekday}</span>
        </div>
        <div data-part="body">
          <h3 data-part="title">{title}</h3>
          <p data-part="line">
            <span data-part="clock" aria-hidden="true" />
            <span>
              {full}, {time}
            </span>
          </p>
          {place ? (
            <p data-part="line">
              <span data-part="pin" aria-hidden="true" />
              {place}
            </p>
          ) : null}
          {people.length ? (
            <p
              data-part="people"
              aria-label={peopleLabel.replace("{people}", people.join(", "))}
            >
              {people.map((person) => (
                <span
                  key={person}
                  data-part="face"
                  aria-hidden="true"
                  style={
                    {
                      "--vibeui-calendar-010-hue": hue(person),
                    } as CSSProperties
                  }
                >
                  {initials(person)}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </article>
    </>
  )
}
