import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel007Shot = {
  label: string
  hue?: number
}

export type Carousel007Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  shots?: Carousel007Shot[]
  label?: string
  hint?: string
}

// Идея компонента: галерея-плёнка с подписями под кадрами. Прокрутка
// горизонтальная, но кадры не занимают всю ширину: видно сразу три, и это
// превращает ленту в обзор, а не в пролистывание по одному. Подписи стоят
// под кадром, а не поверх — на светлом снимке текст поверх не читается.
const STYLES = `
:where([data-vibeui-block="carousel-007"]){
--vibeui-carousel-007-bg:oklch(1 0 0);
--vibeui-carousel-007-fg:oklch(0.22 0.014 265);
--vibeui-carousel-007-muted:oklch(0.58 0.014 265);
--vibeui-carousel-007-border:oklch(0.91 0.006 265);
--vibeui-carousel-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="carousel-007"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-carousel-007-font);color:var(--vibeui-carousel-007-fg);
}
[data-vibeui-block="carousel-007"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-007-bg);
border:1px solid var(--vibeui-carousel-007-border);border-radius:0.875rem;
}
[data-vibeui-block="carousel-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="carousel-007"] [data-part="film"]{
display:flex;gap:0.5rem;
margin:0;padding:0 0 0.375rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x proximity;scrollbar-width:thin;
}
/* Треть ширины на кадр: видно сразу несколько, лента читается как обзор. */
[data-vibeui-block="carousel-007"] [data-part="shot"]{
flex:0 0 34%;scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.3125rem;min-width:0;
}
[data-vibeui-block="carousel-007"] [data-part="frame"]{
aspect-ratio:4 / 3;border-radius:0.625rem;
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.92 0.06 var(--vibeui-carousel-007-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.8 0.08 var(--vibeui-carousel-007-hue,250)),oklch(0.55 0.1 var(--vibeui-carousel-007-hue,250)));
}
/* Подпись под кадром, а не поверх: на светлом снимке текст поверх пропадает. */
[data-vibeui-block="carousel-007"] [data-part="caption"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-carousel-007-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="carousel-007"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-carousel-007-muted)}
@container (max-width: 24rem){
[data-vibeui-block="carousel-007"] [data-part="shot"]{flex-basis:52%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SHOTS: Carousel007Shot[] = [
  { label: "Главная страница", hue: 250 },
  { label: "Каталог с фильтрами", hue: 150 },
  { label: "Страница компонента", hue: 30 },
  { label: "Инструкция для агента", hue: 300 },
  { label: "Тёмная тема", hue: 200 },
]

/**
 * Галерея-плёнка: несколько кадров в кадре и подписи под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel007({
  shots = DEFAULT_SHOTS,
  label = "Скриншоты",
  hint = "Прокрутите вбок — всего кадров: 5",
  className,
  style,
  ...props
}: Carousel007Props) {
  return (
    <>
      <style href="vibeui-carousel-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-007"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="card">
          <h3 data-part="title">{label}</h3>
          <ul data-part="film" tabIndex={0}>
            {shots.map((shot) => (
              <li
                key={shot.label}
                data-part="shot"
                style={
                  {
                    "--vibeui-carousel-007-hue": shot.hue ?? 250,
                  } as CSSProperties
                }
              >
                <span data-part="frame" aria-hidden="true" />
                <span data-part="caption">{shot.label}</span>
              </li>
            ))}
          </ul>
          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
