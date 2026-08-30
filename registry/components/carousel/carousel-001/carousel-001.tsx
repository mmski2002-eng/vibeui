import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel001Slide = {
  label: string
  hue?: number
}

export type Carousel001Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  slides?: Carousel001Slide[]
  label?: string
  accent?: string
}

// Идея компонента: карусель без единой строки JS. Прокрутку держит
// scroll-snap, а точки внизу — обычные якорные ссылки на слайды: браузер сам
// доедет до нужного и подсветит его через :target. Пролистать можно пальцем,
// колесом, стрелками и Tab — всё это уже умеет обычная прокрутка.
const STYLES = `
:where([data-vibeui-block="carousel-001"]){
--vibeui-carousel-001-bg:oklch(1 0 0);
--vibeui-carousel-001-fg:oklch(0.22 0.014 265);
--vibeui-carousel-001-muted:oklch(0.58 0.014 265);
--vibeui-carousel-001-border:oklch(0.91 0.006 265);
--vibeui-carousel-001-accent:oklch(0.55 0.17 265);
--vibeui-carousel-001-radius:0.875rem;
--vibeui-carousel-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-001"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;
font-family:var(--vibeui-carousel-001-font);color:var(--vibeui-carousel-001-fg);
}
/* Вся прокрутка — нативная: палец, колесо, стрелки и Tab работают сами. */
[data-vibeui-block="carousel-001"] [data-part="track"]{
display:flex;gap:0.625rem;
margin:0;padding:0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-behavior:smooth;
scrollbar-width:none;
}
[data-vibeui-block="carousel-001"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="carousel-001"] [data-part="slide"]{
flex:0 0 100%;scroll-snap-align:center;
display:flex;align-items:flex-end;
aspect-ratio:16 / 9;padding:0.875rem;box-sizing:border-box;
border-radius:var(--vibeui-carousel-001-radius);
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.9 0.06 var(--vibeui-carousel-001-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.78 0.09 var(--vibeui-carousel-001-hue,250)),oklch(0.5 0.11 var(--vibeui-carousel-001-hue,250)));
color:oklch(0.99 0.003 265);font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="carousel-001"] [data-part="dots"]{
display:flex;justify-content:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
/* Точка — якорная ссылка: браузер доезжает до слайда сам, без обработчиков. */
[data-vibeui-block="carousel-001"] [data-part="dot"]{
display:block;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-carousel-001-border);
}
[data-vibeui-block="carousel-001"] [data-part="dot"]:hover{background:var(--vibeui-carousel-001-muted)}
[data-vibeui-block="carousel-001"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-carousel-001-accent);outline-offset:3px}
[data-vibeui-block="carousel-001"] [data-part="slide"]:target{scroll-snap-align:center}
[data-vibeui-block="carousel-001"] [data-part="hint"]{
text-align:center;font-size:0.75rem;color:var(--vibeui-carousel-001-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="carousel-001"] [data-part="track"]{scroll-behavior:auto}
}
`

const DEFAULT_SLIDES: Carousel001Slide[] = [
  { label: "Каталог компонентов", hue: 250 },
  { label: "Живое превью", hue: 150 },
  { label: "Инструкция для агента", hue: 30 },
  { label: "Установка одной командой", hue: 300 },
]

/**
 * Карусель на scroll-snap и якорных ссылках: без клиентского кода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel001({
  slides = DEFAULT_SLIDES,
  label = "Возможности",
  accent,
  className,
  style,
  ...props
}: Carousel001Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-carousel-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-001"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
      >
        <ul data-part="track" tabIndex={0}>
          {slides.map((slide, index) => (
            <li
              key={slide.label}
              id={`${id}-slide-${index}`}
              data-part="slide"
              aria-roledescription="слайд"
              aria-label={`${index + 1} из ${slides.length}: ${slide.label}`}
              style={
                {
                  "--vibeui-carousel-001-hue": slide.hue ?? 250,
                } as CSSProperties
              }
            >
              {slide.label}
            </li>
          ))}
        </ul>
        <ul data-part="dots">
          {slides.map((slide, index) => (
            <li key={slide.label}>
              <a
                data-part="dot"
                href={`#${id}-slide-${index}`}
                aria-label={`Перейти к слайду ${index + 1}: ${slide.label}`}
              />
            </li>
          ))}
        </ul>
        <p data-part="hint">Листайте пальцем или переходите по точкам</p>
      </section>
    </>
  )
}
