import type { ComponentProps, CSSProperties } from "react"

export type Stack005Props = Omit<ComponentProps<"div">, "children"> & {
  /** Фото карточек по порядку; при нехватке идут по кругу. Пусто — брендовые плашки. */
  images?: string[]
  /** Раскрыть без наведения: витрина, тач-экран, скриншот. */
  open?: boolean
  /** Полный размах веера, градусы; первая карточка отклоняется на −10°. */
  angle?: number
  accent?: string
  /** Подпись для скринридера: стопка читается как одно изображение. */
  label?: string
}

// Идея: веер из угла — все карточки вращаются вокруг одной точки в нижнем левом углу, как карты в руке.
//
// Раскрытие — чистый CSS: :hover, :focus-visible или data-open переключают
// transform каждой карточки на её целевую позу, а позу считает компонент из
// пропов и кладёт в локальные переменные. Пружина оригинала (motion, spring
// 180/20) заменена кривой linear() с тем же лёгким перелётом.
const STYLES = `
:where([data-vibeui-block="stack-005"]){
--vibeui-stack-005-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-stack-005-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-stack-005-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-stack-005-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-stack-005-shadow:0 4px 10px -2px oklch(0 0 0 / 0.15),0 2px 6px -2px oklch(0 0 0 / 0.1);
--vibeui-stack-005-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-stack-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stack-005"]{color-scheme:dark}
[data-vibeui-block="stack-005"]{
position:relative;display:block;box-sizing:border-box;width:8rem;height:11rem;margin:0;
cursor:pointer;border-radius:1rem;outline:none;-webkit-tap-highlight-color:transparent;
color:var(--vibeui-stack-005-fg);font-family:var(--vibeui-stack-005-font);
}
[data-vibeui-block="stack-005"]:focus-visible{outline:2px solid var(--vibeui-stack-005-accent);outline-offset:6px}
[data-vibeui-block="stack-005"] [data-part="card"]{
position:absolute;inset:0;overflow:hidden;box-sizing:border-box;
border-radius:1rem;border:1px solid var(--vibeui-stack-005-border);
background:var(--vibeui-stack-005-card);box-shadow:var(--vibeui-stack-005-shadow);
transform-origin:var(--vibeui-stack-005-origin,50% 100%);
transform:translate(0,var(--vibeui-stack-005-ty0,0px)) rotate(0deg) scale(1);
transition:transform .65s cubic-bezier(.22,1.2,.36,1);
transition:transform .65s var(--vibeui-stack-005-ease);
will-change:transform;
}
[data-vibeui-block="stack-005"] [data-part="card"] img{display:block;width:100%;height:100%;object-fit:cover;user-select:none}
/* Без фото — брендовая плашка: тёплый тинт акцента уходит в цвет карточки. */
[data-vibeui-block="stack-005"] [data-part="card"][data-empty="true"]{
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-stack-005-accent) var(--vibeui-stack-005-tint,24%),var(--vibeui-stack-005-card)),var(--vibeui-stack-005-card) 70%);
}
[data-vibeui-block="stack-005"] [data-part="num"]{
position:absolute;left:0.625rem;top:0.5rem;font-size:0.75rem;font-weight:700;
letter-spacing:0.04em;font-variant-numeric:tabular-nums;color:var(--vibeui-stack-005-accent);
}
[data-vibeui-block="stack-005"]:is(:hover,:focus-visible,[data-open="true"]) [data-part="card"]{
transform:translate(var(--vibeui-stack-005-tx),var(--vibeui-stack-005-ty)) rotate(var(--vibeui-stack-005-r)) scale(var(--vibeui-stack-005-s));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stack-005"] [data-part="card"]{transition:none}}
`

const COUNT = 5

function pose(index: number, angle: number) {
  return {
    x: 0,
    y: 0,
    rotate: -10 + (index / (COUNT - 1)) * angle,
    scale: index === 2 ? 1.03 : 1,
    z: 5 - index,
  }
}

/**
 * Угловой веер: карточки расходятся из нижнего левого угла.
 * Один файл, ноль зависимостей, собственная палитра; раскрытие на CSS.
 */
export function Stack005({
  images = [],
  open = false,
  angle = 40,
  accent,
  label = "Веер из пяти фотографий",
  className,
  style,
  ...props
}: Stack005Props) {
  const palette = {
    ...(accent ? { "--vibeui-stack-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stack-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="stack-005"
        data-slot="card-stack"
        data-open={open ? "true" : undefined}
        role="img"
        aria-label={label}
        tabIndex={0}
        className={className}
        style={palette}
      >
        {Array.from({ length: COUNT }, (_, index) => {
          const target = pose(index, angle)
          const src = images.length ? images[index % images.length] : null

          return (
            <span
              key={index}
              data-part="card"
              data-empty={src ? undefined : "true"}
              style={
                {
                  zIndex: target.z,
                  "--vibeui-stack-005-tx": `${target.x}px`,
                  "--vibeui-stack-005-ty": `${target.y}px`,
                  "--vibeui-stack-005-r": `${target.rotate}deg`,
                  "--vibeui-stack-005-s": target.scale,
                  "--vibeui-stack-005-origin": "0% 100%",
                } as CSSProperties
              }
            >
              {src ? (
                <img src={src} alt="" loading="lazy" draggable={false} />
              ) : (
                <span data-part="num">{index + 1}</span>
              )}
            </span>
          )
        })}
      </div>
    </>
  )
}
