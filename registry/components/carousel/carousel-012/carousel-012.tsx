import type { ComponentProps, CSSProperties } from "react"

export type Carousel012Props = Omit<ComponentProps<"section">, "children"> & {
  /** Верхняя лента едет влево, нижняя — вправо. */
  topRow?: string[]
  bottomRow?: string[]
  title?: string
  /** Секунд на полный проход одной ленты. */
  duration?: number
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
}

// Идея компонента: две встречные ленты вместо одной. Встречное движение
// читается как «список большой», а не как «карусель едет»: глаз не успевает
// зацепиться за конкретный логотип и воспринимает полосу целиком. Каждая
// лента продублирована и сдвигается ровно на половину, поэтому шва нет;
// копия помечена aria-hidden, чтобы список не прочитался дважды. Движение
// замирает при наведении и при фокусе внутри блока, а при
// prefers-reduced-motion ленты стоят и просто прокручиваются пальцем.
//
// Тема берётся из color-scheme окружения через light-dark(): подложка и плашки
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-012"]){
--vibeui-carousel-012-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-carousel-012-fg:light-dark(oklch(0.34 0 265),oklch(0.92 0 265));
--vibeui-carousel-012-muted:color-mix(in oklab,var(--vibeui-carousel-012-fg) 68%,transparent);
--vibeui-carousel-012-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-carousel-012-chip:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-carousel-012-duration:34s;
--vibeui-carousel-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-012"]{color-scheme:dark}
[data-vibeui-block="carousel-012"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-012-bg);
border:1px solid var(--vibeui-carousel-012-border);border-radius:1rem;
font-family:var(--vibeui-carousel-012-font);color:var(--vibeui-carousel-012-fg);
}
[data-vibeui-block="carousel-012"] [data-part="title"]{
margin:0 0 0.125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;
text-transform:uppercase;color:var(--vibeui-carousel-012-muted);
}
/* Края растворены маской: лента должна выезжать из ничего, а не обрываться. */
[data-vibeui-block="carousel-012"] [data-part="window"]{
overflow:hidden;
mask:linear-gradient(to right,transparent,oklch(0 0 0) 10%,oklch(0 0 0) 90%,transparent);
}
[data-vibeui-block="carousel-012"] [data-part="rail"]{
display:flex;width:max-content;gap:0.5rem;margin:0;padding:0.25rem 0;list-style:none;
animation:vibeui-carousel-012-left var(--vibeui-carousel-012-duration) linear infinite;
}
[data-vibeui-block="carousel-012"] [data-part="rail"][data-way="right"]{
animation-name:vibeui-carousel-012-right;
}
/* Пауза и по наведению, и по фокусу: с клавиатуры лента тоже должна замереть. */
[data-vibeui-block="carousel-012"]:hover [data-part="rail"],
[data-vibeui-block="carousel-012"]:focus-within [data-part="rail"]{animation-play-state:paused}
[data-vibeui-block="carousel-012"] [data-part="chip"]{
flex:none;display:inline-flex;align-items:center;
padding:0.375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-carousel-012-chip);
border:1px solid var(--vibeui-carousel-012-border);
font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;white-space:nowrap;
}
@keyframes vibeui-carousel-012-left{to{transform:translateX(calc(-50% - 0.25rem))}}
@keyframes vibeui-carousel-012-right{from{transform:translateX(calc(-50% - 0.25rem))}to{transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-012"] [data-part="rail"]{animation:none!important;transform:none!important}
[data-vibeui-block="carousel-012"] [data-part="window"]{overflow-x:auto;scrollbar-width:thin}
}
`

const DEFAULT_TOP = [
  "Северсталь",
  "Ozon",
  "Кофеин",
  "Яндекс",
  "Точка",
  "Скиллбокс",
]

const DEFAULT_BOTTOM = [
  "Тинькофф",
  "Авито",
  "ВкусВилл",
  "Самокат",
  "Читай-город",
  "Литрес",
]

function Rail({ items, way }: { items: string[]; way: "left" | "right" }) {
  return (
    <div data-part="window">
      <ul data-part="rail" data-way={way}>
        {items.map((item) => (
          <li data-part="chip" key={item}>
            {item}
          </li>
        ))}
        {items.map((item) => (
          <li data-part="chip" key={`echo-${item}`} aria-hidden="true">
            {item}
          </li>
        ))}
      </ul>
    </div>
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
 * Две встречные бегущие ленты логотипов с растворёнными краями и паузой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel012({
  topRow = DEFAULT_TOP,
  bottomRow = DEFAULT_BOTTOM,
  title = "Нам доверяют",
  duration = 34,
  background = "",
  className,
  style,
  ...props
}: Carousel012Props) {
  const palette = {
    "--vibeui-carousel-012-duration": `${duration}s`,
    ...(background
      ? {
          "--vibeui-carousel-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-012"
        aria-label={title}
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <Rail items={topRow} way="left" />
        <Rail items={bottomRow} way="right" />
      </section>
    </>
  )
}
