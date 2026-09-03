import type { ComponentProps, CSSProperties } from "react"

export type Carousel004Props = Omit<ComponentProps<"section">, "children"> & {
  items?: string[]
  label?: string
  /** Секунд на полный проход ленты. Меньше 20 — рябит в глазах. */
  duration?: number
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
}

// Идея компонента: бегущая лента логотипов. Список дублируется в разметке и
// сдвигается на половину ширины — только так шов между повторами не виден.
// Копия помечена aria-hidden: скринридер должен прочитать список один раз.
// При prefers-reduced-motion лента останавливается и просто прокручивается.
//
// Тема берётся из color-scheme окружения через light-dark(): подложка и текст
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-004"]){
--vibeui-carousel-004-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-carousel-004-fg:light-dark(oklch(0.35 0.014 265),oklch(0.92 0.007 265));
--vibeui-carousel-004-muted:color-mix(in oklab,var(--vibeui-carousel-004-fg) 68%,transparent);
--vibeui-carousel-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-carousel-004-duration:32s;
--vibeui-carousel-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-004"]{color-scheme:dark}
[data-vibeui-block="carousel-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-004-bg);
border:1px solid var(--vibeui-carousel-004-border);border-radius:0.875rem;
font-family:var(--vibeui-carousel-004-font);color:var(--vibeui-carousel-004-fg);
}
[data-vibeui-block="carousel-004"] [data-part="label"]{
font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-carousel-004-muted);
}
/* Края подтёрты маской: лента должна выезжать из ничего, а не обрываться. */
[data-vibeui-block="carousel-004"] [data-part="window"]{
overflow:hidden;
mask:linear-gradient(to right,transparent,oklch(0 0 0) 8%,oklch(0 0 0) 92%,transparent);
}
[data-vibeui-block="carousel-004"] [data-part="rail"]{
display:flex;width:max-content;gap:2rem;
margin:0;padding:0;list-style:none;
animation:vibeui-carousel-004-run var(--vibeui-carousel-004-duration) linear infinite;
}
/* Пауза и по наведению, и по фокусу: с клавиатуры лента тоже должна замереть. */
[data-vibeui-block="carousel-004"]:hover [data-part="rail"],
[data-vibeui-block="carousel-004"]:focus-within [data-part="rail"]{animation-play-state:paused}
[data-vibeui-block="carousel-004"] [data-part="item"]{
flex:none;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;white-space:nowrap;
}
/* Сдвиг ровно на половину: список продублирован, поэтому шва не видно. */
@keyframes vibeui-carousel-004-run{
to{transform:translateX(calc(-50% - 1rem))}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-004"] [data-part="rail"]{animation:none!important}
[data-vibeui-block="carousel-004"] [data-part="window"]{overflow-x:auto;scrollbar-width:thin}
}
`

const DEFAULT_ITEMS = [
  "Полёт",
  "Северянка",
  "Контур",
  "Ижевск Групп",
  "Мурманская линия",
  "Заря",
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
 * Бегущая лента логотипов: список продублирован, копия скрыта от скринридера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel004({
  items = DEFAULT_ITEMS,
  label = "Нам доверяют",
  duration = 32,
  background = "",
  className,
  style,
  ...props
}: Carousel004Props) {
  const palette = {
    "--vibeui-carousel-004-duration": `${Math.max(20, duration)}s`,
    ...(background
      ? {
          "--vibeui-carousel-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-004"
        aria-label={label}
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <div data-part="window">
          <ul data-part="rail">
            {items.map((item) => (
              <li key={item} data-part="item">
                {item}
              </li>
            ))}
            {items.map((item) => (
              <li key={`copy-${item}`} data-part="item" aria-hidden="true">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
