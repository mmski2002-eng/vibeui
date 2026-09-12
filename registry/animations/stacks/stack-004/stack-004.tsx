import type { ComponentProps, CSSProperties } from "react"

export type Stack004Props = Omit<ComponentProps<"div">, "children"> & {
  /** Фото карточек по порядку; при нехватке идут по кругу. Пусто — брендовые плашки. */
  images?: string[]
  /** Раскрыть без наведения: витрина, тач-экран, скриншот. */
  open?: boolean
  /** Расстояние между соседними крайними карточками, px. */
  gap?: number
  accent?: string
  /** Подпись для скринридера: стопка читается как одно изображение. */
  label?: string
}

// Идея: карточки разъезжаются строго по горизонтали без поворота — ровный ряд из стопки, центральная чуть крупнее.
//
// Раскрытие — чистый CSS: :hover, :focus-visible или data-open переключают
// transform каждой карточки на её целевую позу, а позу считает компонент из
// пропов и кладёт в локальные переменные. Пружина оригинала (motion, spring
// 180/20) заменена кривой linear() с тем же лёгким перелётом.
const STYLES = `
:where([data-vibeui-block="stack-004"]){
--vibeui-stack-004-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-stack-004-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-stack-004-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-stack-004-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-stack-004-shadow:0 4px 10px -2px oklch(0 0 0 / 0.15),0 2px 6px -2px oklch(0 0 0 / 0.1);
--vibeui-stack-004-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-stack-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stack-004"]{color-scheme:dark}
[data-vibeui-block="stack-004"]{
position:relative;display:block;box-sizing:border-box;width:8rem;height:11rem;margin:0;
cursor:pointer;border-radius:1rem;outline:none;-webkit-tap-highlight-color:transparent;
color:var(--vibeui-stack-004-fg);font-family:var(--vibeui-stack-004-font);
}
[data-vibeui-block="stack-004"]:focus-visible{outline:2px solid var(--vibeui-stack-004-accent);outline-offset:6px}
[data-vibeui-block="stack-004"] [data-part="card"]{
position:absolute;inset:0;overflow:hidden;box-sizing:border-box;
border-radius:1rem;border:1px solid var(--vibeui-stack-004-border);
background:var(--vibeui-stack-004-card);box-shadow:var(--vibeui-stack-004-shadow);
transform-origin:var(--vibeui-stack-004-origin,50% 100%);
transform:translate(0,var(--vibeui-stack-004-ty0,0px)) rotate(0deg) scale(1);
transition:transform .65s cubic-bezier(.22,1.2,.36,1);
transition:transform .65s var(--vibeui-stack-004-ease);
will-change:transform;
}
[data-vibeui-block="stack-004"] [data-part="card"] img{display:block;width:100%;height:100%;object-fit:cover;user-select:none}
/* Без фото — брендовая плашка: тёплый тинт акцента уходит в цвет карточки. */
[data-vibeui-block="stack-004"] [data-part="card"][data-empty="true"]{
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-stack-004-accent) var(--vibeui-stack-004-tint,24%),var(--vibeui-stack-004-card)),var(--vibeui-stack-004-card) 70%);
}
[data-vibeui-block="stack-004"] [data-part="num"]{
position:absolute;left:0.625rem;top:0.5rem;font-size:0.75rem;font-weight:700;
letter-spacing:0.04em;font-variant-numeric:tabular-nums;color:var(--vibeui-stack-004-accent);
}
[data-vibeui-block="stack-004"]:is(:hover,:focus-visible,[data-open="true"]) [data-part="card"]{
transform:translate(var(--vibeui-stack-004-tx),var(--vibeui-stack-004-ty)) rotate(var(--vibeui-stack-004-r)) scale(var(--vibeui-stack-004-s));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stack-004"] [data-part="card"]{transition:none}}
`

const COUNT = 5

function pose(index: number, gap: number) {
  const dist = index - 2

  return {
    x: (dist * gap) / 2,
    y: 0,
    rotate: 0,
    scale: dist === 0 ? 1.05 : 1,
    z: 3 - Math.abs(dist),
  }
}

/**
 * Линейный разворот пяти карточек в ряд.
 * Один файл, ноль зависимостей, собственная палитра; раскрытие на CSS.
 */
export function Stack004({
  images = [],
  open = false,
  gap = 90,
  accent,
  label = "Ряд из пяти фотографий",
  className,
  style,
  ...props
}: Stack004Props) {
  const palette = {
    ...(accent ? { "--vibeui-stack-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stack-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="stack-004"
        data-slot="card-stack"
        data-open={open ? "true" : undefined}
        role="img"
        aria-label={label}
        tabIndex={0}
        className={className}
        style={palette}
      >
        {Array.from({ length: COUNT }, (_, index) => {
          const target = pose(index, gap)
          const src = images.length ? images[index % images.length] : null

          return (
            <span
              key={index}
              data-part="card"
              data-empty={src ? undefined : "true"}
              style={
                {
                  zIndex: target.z,
                  "--vibeui-stack-004-tx": `${target.x}px`,
                  "--vibeui-stack-004-ty": `${target.y}px`,
                  "--vibeui-stack-004-r": `${target.rotate}deg`,
                  "--vibeui-stack-004-s": target.scale,
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
