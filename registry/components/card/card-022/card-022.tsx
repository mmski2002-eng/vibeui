import type { ComponentProps, CSSProperties } from "react"

export type Card022Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  title?: string
  /** Число дня плашки-календаря: «18». Без ведущего нуля. */
  dateDay?: string
  /** Месяц под числом, коротко: «сен». */
  dateMonth?: string
  time?: string
  /** Машиночитаемое время для <time datetime>: ISO 8601. */
  dateTime?: string
  location?: string
  href?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка события в списке анонсов. Дата — не строка в
// абзаце, а плашка календаря: число дня крупно, месяц под ним. При скролле
// ленты глаз цепляется за число, а не вычитывает дату из текста. Время и
// место идут через <time datetime> и текст с меткой, а не одной фразой —
// это разные факты, и у времени должен быть точный машиночитаемый вид.
// Кликается вся карточка, но ссылка в разметке остаётся одна: заголовок
// растягивает область через ::after, как у карточки материала.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка и плашка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-022"]){
--vibeui-card-022-bg:transparent;
--vibeui-card-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-022-muted:color-mix(in oklab,var(--vibeui-card-022-fg) 68%,transparent);
--vibeui-card-022-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-022-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-card-022-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-card-022-date-bg:color-mix(in oklab,var(--vibeui-card-022-accent) 12%,transparent);
--vibeui-card-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-022"]{color-scheme:dark}
[data-vibeui-block="card-022"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:24rem;min-inline-size:0;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-022-bg);
border:1px solid var(--vibeui-card-022-border);border-radius:0.875rem;
color:var(--vibeui-card-022-fg);font-family:var(--vibeui-card-022-font);
}
[data-vibeui-block="card-022"] [data-part="date"]{
flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
width:3rem;height:3rem;border-radius:0.625rem;
background:var(--vibeui-card-022-date-bg);
color:color-mix(in oklab,var(--vibeui-card-022-accent) 82%,var(--vibeui-card-022-fg));
}
[data-vibeui-block="card-022"] [data-part="day"]{
font-size:1.1875rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-022"] [data-part="month"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="card-022"] [data-part="body"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.3125rem;
}
[data-vibeui-block="card-022"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.35;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="card-022"] [data-part="title"] a{color:inherit;text-decoration:none;outline:none}
/* Ссылка заголовка накрывает карточку целиком: одна ссылка, вся площадь. */
[data-vibeui-block="card-022"] [data-part="title"] a::after{content:"";position:absolute;inset:0;border-radius:inherit}
[data-vibeui-block="card-022"]:has(a:focus-visible){
outline:2px solid var(--vibeui-card-022-accent);outline-offset:2px;
}
[data-vibeui-block="card-022"] [data-part="meta"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.375rem;
font-size:0.8125rem;color:var(--vibeui-card-022-muted);
}
[data-vibeui-block="card-022"] [data-part="time"],
[data-vibeui-block="card-022"] [data-part="location"]{
display:inline-flex;align-items:center;gap:0.25rem;min-width:0;
}
[data-vibeui-block="card-022"] [data-part="location"] span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="card-022"] [data-part="icon"]{width:0.75rem;height:0.75rem;flex:none}
[data-vibeui-block="card-022"] [data-part="dot"]{flex:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-022"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Карточка события: плашка календаря с числом дня, заголовок-ссылка на всю
 * площадь, время в <time> и место. Один файл, ноль зависимостей, своя
 * палитра.
 */
export function Card022({
  title = "Открытая встреча по дизайн-системам",
  dateDay = "18",
  dateMonth = "сен",
  time = "19:00",
  dateTime = "2026-09-18T19:00:00+03:00",
  location = "Лофт «Река», зал 2",
  href = "#",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card022Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-022" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-022"
        className={className}
        style={palette}
      >
        <div data-part="date" aria-hidden="true">
          <span data-part="day">{dateDay}</span>
          <span data-part="month">{dateMonth}</span>
        </div>
        <div data-part="body">
          <h3 data-part="title">{href ? <a href={href}>{title}</a> : title}</h3>
          <p data-part="meta">
            {time ? (
              <time data-part="time" dateTime={dateTime}>
                <svg
                  data-part="icon"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M6 3.4V6l1.8 1.1"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {time}
              </time>
            ) : null}
            {time && location ? <span data-part="dot">·</span> : null}
            {location ? (
              <span data-part="location">
                <svg
                  data-part="icon"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 11c2-2.2 3.4-4 3.4-5.6a3.4 3.4 0 1 0-6.8 0C2.6 7 4 8.8 6 11Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="6"
                    cy="5.4"
                    r="1.05"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
                <span>{location}</span>
              </span>
            ) : null}
          </p>
        </div>
      </article>
    </>
  )
}
