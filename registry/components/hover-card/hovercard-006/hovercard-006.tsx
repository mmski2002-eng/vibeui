import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  day?: string
  month?: string
  time?: string
  place?: string
  /** Участники: показываем кружки с инициалами и остаток числом. */
  people?: string[]
  /** Текст строки до названия встречи. */
  leadText?: string
  /** Текст строки после названия встречи. */
  tailText?: string
  /** Счётчик скрытых участников: {count} подставляется числом. */
  restText?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: карточка события у названия встречи. Дата вынесена в
// отрывной листок календаря — это узнаваемая форма, её читают быстрее строки;
// участники сложены веером, а лишние свёрнуты в счётчик.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-006"]){
--vibeui-hovercard-006-bg:transparent;
--vibeui-hovercard-006-card:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-hovercard-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-hovercard-006-muted:light-dark(oklch(0.54 0.014 265),oklch(0.71 0.012 265));
--vibeui-hovercard-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-hovercard-006-accent:light-dark(oklch(0.55 0.18 20),oklch(0.66 0.17 20));
--vibeui-hovercard-006-face:light-dark(oklch(0.92 0.04 265),oklch(0.38 0.05 265));
--vibeui-hovercard-006-face-fg:light-dark(oklch(0.36 0.07 265),oklch(0.92 0.04 265));
--vibeui-hovercard-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-006"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-006-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-006-bg);
font-family:var(--vibeui-hovercard-006-font);color:var(--vibeui-hovercard-006-fg);
}
[data-vibeui-block="hovercard-006"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Карточка цепляется к названию встречи в строке, а не к абзацу. */
[data-vibeui-block="hovercard-006"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-006"] [data-part="link"]{
color:inherit;font-weight:640;text-decoration:none;
box-shadow:inset 0 -0.45em 0 color-mix(in oklab,var(--vibeui-hovercard-006-accent) 16%,transparent);
border-radius:0.1875rem;
}
[data-vibeui-block="hovercard-006"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-006-accent);outline-offset:2px}
[data-vibeui-block="hovercard-006"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.75rem;
width:18.5rem;box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-hovercard-006-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-006-card);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-006"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-006"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
/* Отрывной листок календаря: форму узнают быстрее, чем читают дату строкой. */
[data-vibeui-block="hovercard-006"] [data-part="sheet"]{
grid-row:1 / span 3;overflow:hidden;
display:flex;flex-direction:column;align-items:center;
width:3.125rem;border-radius:0.5rem;
border:1px solid var(--vibeui-hovercard-006-border);
}
[data-vibeui-block="hovercard-006"] [data-part="month"]{
width:100%;padding:0.1875rem 0;text-align:center;
background:var(--vibeui-hovercard-006-accent);color:oklch(0.99 0.01 20);
font-size:0.625rem;font-weight:750;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="hovercard-006"] [data-part="day"]{
padding:0.1875rem 0 0.3125rem;
font-size:1.375rem;font-weight:750;line-height:1.1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="hovercard-006"] [data-part="title"]{font-size:0.875rem;font-weight:660;line-height:1.3}
[data-vibeui-block="hovercard-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.1875rem;
font-size:0.75rem;color:var(--vibeui-hovercard-006-muted);
}
[data-vibeui-block="hovercard-006"] [data-part="people"]{
grid-column:2;display:flex;align-items:center;margin-top:0.5rem;
}
/* Веер аватаров: перекрытие показывает группу и экономит ширину. */
[data-vibeui-block="hovercard-006"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;margin-right:-0.375rem;border-radius:9999px;
border:2px solid var(--vibeui-hovercard-006-card);
background:var(--vibeui-hovercard-006-face);color:var(--vibeui-hovercard-006-face-fg);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="hovercard-006"] [data-part="rest"]{
margin-left:0.75rem;font-size:0.75rem;color:var(--vibeui-hovercard-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE = ["Мария Гурова", "Артём Северов", "Ким Сон", "Лена Пак"]

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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Карточка события календаря: отрывной листок с датой, время, место и участники.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard006({
  title = "Разбор макетов каталога",
  day = "14",
  month = "сен",
  time = "11:00 – 12:00",
  place = "Переговорная «Север», 4 этаж",
  people = DEFAULT_PEOPLE,
  leadText = "Ближайшая встреча — ",
  tailText = " — время и место видно без открытия календаря.",
  restText = "и ещё {count}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard006Props) {
  const shown = people.slice(0, 3)
  const rest = people.length - shown.length
  const palette = {
    ...(accent ? { "--vibeui-hovercard-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-006"
        className={className}
        style={palette}
      >
        <p data-part="line">
          {leadText}
          <span data-part="host">
            <a
              data-part="link"
              href="#event"
              aria-describedby="vibeui-hovercard-006-card"
            >
              {title}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-006-card"
              role="tooltip"
            >
              <span data-part="sheet" aria-hidden="true">
                <span data-part="month">{month}</span>
                <span data-part="day">{day}</span>
              </span>
              <span data-part="title">{title}</span>
              <span data-part="row">
                <span aria-hidden="true">🕘</span>
                {time}
              </span>
              <span data-part="row">
                <span aria-hidden="true">📍</span>
                {place}
              </span>
              <span data-part="people">
                {shown.map((person) => (
                  <span data-part="face" key={person} title={person}>
                    {initials(person)}
                  </span>
                ))}
                {rest > 0 ? (
                  <span data-part="rest">
                    {restText.replace("{count}", String(rest))}
                  </span>
                ) : null}
              </span>
            </span>
          </span>
          {tailText}
        </p>
      </div>
    </>
  )
}
