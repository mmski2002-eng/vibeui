import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel004Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  items?: string[]
  label?: string
  /** Секунд на полный проход ленты. Меньше 20 — рябит в глазах. */
  duration?: number
}

// Идея компонента: бегущая лента логотипов. Список дублируется в разметке и
// сдвигается на половину ширины — только так шов между повторами не виден.
// Копия помечена aria-hidden: скринридер должен прочитать список один раз.
// При prefers-reduced-motion лента останавливается и просто прокручивается.
const STYLES = `
:where([data-vibeui-block="carousel-004"]){
--vibeui-carousel-004-bg:oklch(1 0 0);
--vibeui-carousel-004-fg:oklch(0.35 0.014 265);
--vibeui-carousel-004-muted:oklch(0.58 0.014 265);
--vibeui-carousel-004-border:oklch(0.91 0.006 265);
--vibeui-carousel-004-duration:32s;
--vibeui-carousel-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="carousel-004"] [data-part="rail"]:hover{animation-play-state:paused}
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
 * Бегущая лента логотипов: список продублирован, копия скрыта от скринридера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel004({
  items = DEFAULT_ITEMS,
  label = "Нам доверяют",
  duration = 32,
  className,
  style,
  ...props
}: Carousel004Props) {
  const palette = {
    "--vibeui-carousel-004-duration": `${Math.max(20, duration)}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
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
