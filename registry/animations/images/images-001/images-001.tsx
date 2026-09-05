import type { ComponentProps, CSSProperties } from "react"

export type Images001Slide = {
  label: string
}

export type Images001Props = Omit<ComponentProps<"section">, "children"> & {
  slides?: Images001Slide[]
  accent?: string
  /** Стрелки навигации по бокам кадра. */
  arrows?: boolean
  /** Точки-индикаторы снизу кадра. */
  dots?: boolean
}

// Идея: карусель слайдов, которая крутится сама. Кадры — цветные градиентные
// плейсхолдеры с подписью — уложены друг на друга абсолютным позиционированием
// и по очереди выходят в видимую зону через opacity+translateX, каждый следующий
// стартует со сдвигом по animation-delay (nth-child). Точки-индикаторы снизу
// используют ту же схему сдвигов, поэтому подсветка активной точки синхронна
// со сменой слайда без единой строчки JS.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="images-001"]){
--vibeui-images-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-images-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-images-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-images-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-images-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="images-001"]{color-scheme:dark}
[data-vibeui-block="images-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-images-001-fg);font-family:var(--vibeui-images-001-font);
}
[data-vibeui-block="images-001"] *{box-sizing:border-box}
[data-vibeui-block="images-001"] [data-part="stage"]{
position:relative;overflow:hidden;aspect-ratio:4/3;border-radius:1rem;
border:1px solid var(--vibeui-images-001-border);
background:var(--vibeui-images-001-frame);
box-shadow:0 1px 2px oklch(0 0 0 / 0.06);
}
[data-vibeui-block="images-001"] [data-part="track"]{position:absolute;inset:0}
[data-vibeui-block="images-001"] [data-part="slide"]{
position:absolute;inset:0;display:flex;align-items:flex-end;
padding:0.875rem;opacity:0;
animation:vibeui-images-001-cycle 10s ease-in-out infinite;
}
[data-vibeui-block="images-001"] [data-part="slide"]:nth-child(1){
animation-delay:0s;
background:linear-gradient(135deg,oklch(0.72 0.15 30),oklch(0.5 0.18 345));
}
[data-vibeui-block="images-001"] [data-part="slide"]:nth-child(2){
animation-delay:-2.5s;
background:linear-gradient(135deg,oklch(0.68 0.14 220),oklch(0.38 0.13 255));
}
[data-vibeui-block="images-001"] [data-part="slide"]:nth-child(3){
animation-delay:-5s;
background:linear-gradient(135deg,oklch(0.76 0.15 145),oklch(0.48 0.12 170));
}
[data-vibeui-block="images-001"] [data-part="slide"]:nth-child(4){
animation-delay:-7.5s;
background:linear-gradient(135deg,oklch(0.8 0.12 85),oklch(0.56 0.15 55));
}
[data-vibeui-block="images-001"] [data-part="scrim"]{
position:absolute;inset:0;
background:linear-gradient(to top,oklch(0 0 0 / 0.45),transparent 55%);
}
[data-vibeui-block="images-001"] [data-part="caption"]{
position:relative;font-size:0.75rem;font-weight:650;color:oklch(0.98 0 0);
text-shadow:0 1px 3px oklch(0 0 0 / 0.35);
}
[data-vibeui-block="images-001"] [data-part="nav"]{
position:absolute;top:50%;translate:0 -50%;z-index:1;
display:flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;border-radius:9999px;
background:oklch(0 0 0 / 0.32);color:oklch(0.98 0 0);
backdrop-filter:blur(3px);
}
[data-vibeui-block="images-001"] [data-part="nav"] svg{width:1rem;height:1rem}
[data-vibeui-block="images-001"] [data-part="nav"][data-dir="prev"]{left:0.5rem}
[data-vibeui-block="images-001"] [data-part="nav"][data-dir="next"]{right:0.5rem}
[data-vibeui-block="images-001"] [data-part="dots"]{
position:absolute;left:0;right:0;bottom:0.625rem;z-index:1;
display:flex;align-items:center;justify-content:center;gap:0.3125rem;
}
[data-vibeui-block="images-001"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:oklch(0.98 0 0 / 0.4);
animation:vibeui-images-001-dot 10s ease-in-out infinite;
}
[data-vibeui-block="images-001"] [data-part="dot"]:nth-child(1){animation-delay:0s}
[data-vibeui-block="images-001"] [data-part="dot"]:nth-child(2){animation-delay:-2.5s}
[data-vibeui-block="images-001"] [data-part="dot"]:nth-child(3){animation-delay:-5s}
[data-vibeui-block="images-001"] [data-part="dot"]:nth-child(4){animation-delay:-7.5s}
@keyframes vibeui-images-001-cycle{
0%,3%{opacity:1;transform:translateX(0)}
22%{opacity:1;transform:translateX(0)}
27%,97%{opacity:0;transform:translateX(-2.5%)}
100%{opacity:1;transform:translateX(0)}
}
@keyframes vibeui-images-001-dot{
0%,22%{width:1.125rem;background:var(--vibeui-images-001-accent)}
27%,97%{width:0.375rem;background:oklch(0.98 0 0 / 0.4)}
100%{width:1.125rem;background:var(--vibeui-images-001-accent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="images-001"] [data-part="slide"]{animation:none;opacity:0;transform:none}
[data-vibeui-block="images-001"] [data-part="slide"]:first-child{opacity:1}
[data-vibeui-block="images-001"] [data-part="dot"]{animation:none;width:0.375rem;background:oklch(0.98 0 0 / 0.4)}
[data-vibeui-block="images-001"] [data-part="dot"]:first-child{width:1.125rem;background:var(--vibeui-images-001-accent)}
}
`

const CHEVRON_LEFT = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const CHEVRON_RIGHT = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const DEFAULT_SLIDES: Images001Slide[] = [
  { label: "Горы" },
  { label: "Океан" },
  { label: "Лес" },
  { label: "Пустыня" },
]

/**
 * Карусель слайдов с точками-индикаторами и стрелками навигации. Один файл,
 * ноль зависимостей, собственная палитра. Слайды крутятся сами по кругу на
 * чистом CSS, индикатор синхронизирован той же схемой сдвигов.
 */
export function Images001({
  slides = DEFAULT_SLIDES,
  accent,
  arrows = true,
  dots = true,
  className,
  style,
  ...props
}: Images001Props) {
  const palette = {
    ...(accent ? { "--vibeui-images-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-images-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="images-001"
        data-slot="image-carousel"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="track" aria-hidden="true">
            {slides.map((slide) => (
              <div data-part="slide" key={slide.label}>
                <span data-part="scrim" aria-hidden="true" />
                <span data-part="caption">{slide.label}</span>
              </div>
            ))}
          </div>
          {arrows ? (
            <>
              <span data-part="nav" data-dir="prev" aria-hidden="true">
                {CHEVRON_LEFT}
              </span>
              <span data-part="nav" data-dir="next" aria-hidden="true">
                {CHEVRON_RIGHT}
              </span>
            </>
          ) : null}
          {dots ? (
            <div data-part="dots" aria-hidden="true">
              {slides.map((slide) => (
                <span data-part="dot" key={slide.label} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
