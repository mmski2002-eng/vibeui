import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Aspect003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  price?: string
  oldPrice?: string
  /** Плашка в углу: «−30 %», «Хит», «Нет в наличии». */
  badge?: string
  href?: string
  accent?: string
}

// Идея компонента: квадратный кадр товара. Квадрат выбран не из вкуса: в
// сетке магазина карточки должны быть одной высоты, а фотографии товаров
// приходят разные — квадрат обрезает их предсказуемо. Цена стоит под кадром,
// а не поверх: поверх её не прочитать на светлой фотографии.
const STYLES = `
:where([data-vibeui-block="aspect-003"]){
--vibeui-aspect-003-fg:oklch(0.22 0.014 265);
--vibeui-aspect-003-muted:oklch(0.52 0.014 265);
--vibeui-aspect-003-bg:oklch(1 0 0);
--vibeui-aspect-003-frame:oklch(0.955 0.006 265);
--vibeui-aspect-003-border:oklch(0.91 0.006 265);
--vibeui-aspect-003-accent:oklch(0.56 0.19 25);
--vibeui-aspect-003-radius:0.875rem;
--vibeui-aspect-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Карточка несёт собственную светлую подложку: она обязана читаться и на
   тёмной странице, где её текст иначе сливается с фоном. */
[data-vibeui-block="aspect-003"]{
position:relative;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-aspect-003-bg);
border:1px solid var(--vibeui-aspect-003-border);
border-radius:calc(var(--vibeui-aspect-003-radius) + 0.25rem);
color:var(--vibeui-aspect-003-fg);font-family:var(--vibeui-aspect-003-font);
}
/* Квадрат: в сетке магазина карточки обязаны быть одной высоты. */
[data-vibeui-block="aspect-003"] [data-part="frame"]{
position:relative;aspect-ratio:1 / 1;overflow:hidden;
border:1px solid var(--vibeui-aspect-003-border);
border-radius:var(--vibeui-aspect-003-radius);
background:
radial-gradient(90% 80% at 30% 20%,oklch(1 0 0),transparent 70%),
var(--vibeui-aspect-003-frame);
}
[data-vibeui-block="aspect-003"] [data-part="frame"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="aspect-003"] [data-part="badge"]{
position:absolute;left:0.625rem;top:0.625rem;
padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-aspect-003-accent);color:oklch(0.99 0.01 25);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="aspect-003"] [data-part="title"]{
font-size:0.875rem;line-height:1.35;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="aspect-003"] a{color:inherit;text-decoration:none}
[data-vibeui-block="aspect-003"] a::after{content:"";position:absolute;inset:0;border-radius:inherit}
[data-vibeui-block="aspect-003"] a:focus-visible{outline:2px solid var(--vibeui-aspect-003-accent);outline-offset:3px;border-radius:0.375rem}
[data-vibeui-block="aspect-003"] [data-part="prices"]{display:flex;align-items:baseline;gap:0.5rem}
[data-vibeui-block="aspect-003"] [data-part="price"]{font-size:1rem;font-weight:650;font-variant-numeric:tabular-nums}
/* Старая цена зачёркнута и приглушена: рядом с новой её только сравнивают. */
[data-vibeui-block="aspect-003"] [data-part="old"]{
font-size:0.8125rem;color:var(--vibeui-aspect-003-muted);
text-decoration:line-through;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Квадратный кадр товара: предсказуемая обрезка и цена под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect003({
  title = "Настольная лампа «Полёт», тёплый свет",
  price = "4 900 ₽",
  oldPrice = "6 900 ₽",
  badge = "−30 %",
  href = "#",
  accent,
  className,
  style,
  ...props
}: Aspect003Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="aspect-003"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {badge ? <span data-part="badge">{badge}</span> : null}
        </div>
        <span data-part="title">
          {href ? <a href={href}>{title}</a> : title}
        </span>
        <span data-part="prices">
          <span data-part="price">{price}</span>
          {oldPrice ? <span data-part="old">{oldPrice}</span> : null}
        </span>
      </div>
    </>
  )
}
