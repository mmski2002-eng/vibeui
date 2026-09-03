import type { ComponentProps, CSSProperties } from "react"

export type Aspect008Props = Omit<ComponentProps<"div">, "children"> & {
  ratio?: string
  /** Сколько кадров показывать: сетка заглушек под будущую галерею. */
  count?: number
  label?: string
}

// Идея компонента: заглушка галереи, которая занимает ровно то место, что
// займут будущие кадры. Соотношение задаётся один раз и передаётся всем
// плиткам, поэтому при загрузке страница не прыгает — это и есть смысл
// заглушки с пропорцией, в отличие от серого прямоугольника наугад.
//
// Тема берётся из color-scheme окружения через light-dark(): заглушка темнеет
// вместе со страницей, иначе светлые плитки прожигали бы тёмный макет.
const STYLES = `
:where([data-vibeui-block="aspect-008"]){
--vibeui-aspect-008-ratio:4 / 3;
--vibeui-aspect-008-base:light-dark(oklch(0.93 0.005 265),oklch(0.28 0.012 265));
--vibeui-aspect-008-shine:light-dark(oklch(0.97 0.003 265),oklch(0.35 0.014 265));
--vibeui-aspect-008-fg:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-aspect-008-radius:0.75rem;
--vibeui-aspect-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="aspect-008"]{color-scheme:dark}
[data-vibeui-block="aspect-008"]{display:block;width:100%;box-sizing:border-box;font-family:var(--vibeui-aspect-008-font)}
/* Раскладка живёт на внутренней рамке, а не на корне: контейнерный запрос
   применяется к потомкам контейнера, но не к нему самому. */
[data-vibeui-block="aspect-008"] [data-part="grid"]{
display:grid;gap:0.625rem;grid-template-columns:repeat(2,1fr);
}
[data-vibeui-block="aspect-008"] [data-part="tile"]{
position:relative;overflow:hidden;
aspect-ratio:var(--vibeui-aspect-008-ratio);
border-radius:var(--vibeui-aspect-008-radius);
background:
linear-gradient(90deg,var(--vibeui-aspect-008-base) 0%,var(--vibeui-aspect-008-shine) 50%,var(--vibeui-aspect-008-base) 100%)
0 0 / 200% 100%;
animation:vibeui-aspect-008-sweep 1.4s ease-in-out infinite;
}
/* Задержка по плиткам: одновременная вспышка выглядит как мигание экрана. */
[data-vibeui-block="aspect-008"] [data-part="tile"]:nth-child(2){animation-delay:.12s}
[data-vibeui-block="aspect-008"] [data-part="tile"]:nth-child(3){animation-delay:.24s}
[data-vibeui-block="aspect-008"] [data-part="tile"]:nth-child(4){animation-delay:.36s}
[data-vibeui-block="aspect-008"] [data-part="tile"]:nth-child(5){animation-delay:.48s}
[data-vibeui-block="aspect-008"] [data-part="tile"]:nth-child(6){animation-delay:.6s}
/* Значок кадра: две фигуры, как в пустом слоте галереи. */
[data-vibeui-block="aspect-008"] [data-part="tile"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1.5rem;height:1.125rem;margin:-0.5625rem 0 0 -0.75rem;
border:1.5px solid var(--vibeui-aspect-008-fg);border-radius:0.25rem;opacity:.35;
}
@keyframes vibeui-aspect-008-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@container (min-width: 30rem){
[data-vibeui-block="aspect-008"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="aspect-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="aspect-008"] [data-part="tile"]{background:var(--vibeui-aspect-008-base)}
}
`

/**
 * Заглушка галереи: кадры занимают то же место, что займут снимки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect008({
  ratio = "4 / 3",
  count = 6,
  label = "Загружаются снимки",
  className,
  style,
  ...props
}: Aspect008Props) {
  const palette = {
    "--vibeui-aspect-008-ratio": ratio,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="aspect-ratio"
        data-vibeui-block="aspect-008"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="grid">
          {Array.from({ length: Math.max(1, count) }, (_, index) => (
            <div key={index} data-part="tile" />
          ))}
        </div>
      </div>
    </>
  )
}
