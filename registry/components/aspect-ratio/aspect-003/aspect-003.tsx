import type { ComponentProps, CSSProperties } from "react"

export type Aspect003Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  price?: string
  oldPrice?: string
  /** Плашка в углу: «−30 %», «Хит», «Нет в наличии». */
  badge?: string
  href?: string
  /** Пусто — подложки нет, карточка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: квадратный кадр товара. Квадрат выбран не из вкуса: в
// сетке магазина карточки должны быть одной высоты, а фотографии товаров
// приходят разные — квадрат обрезает их предсказуемо. Цена стоит под кадром,
// а не поверх: поверх её не прочитать на светлой фотографии.
//
// Тема берётся из color-scheme окружения через light-dark(): карточка темнеет
// вместе со страницей, а подложки под собой по умолчанию не выкладывает.
const STYLES = `
:where([data-vibeui-block="aspect-003"]){
--vibeui-aspect-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-aspect-003-muted:color-mix(in oklab,var(--vibeui-aspect-003-fg) 68%,transparent);
--vibeui-aspect-003-bg:transparent;
--vibeui-aspect-003-frame:light-dark(oklch(0.955 0.006 265),oklch(0.28 0.012 265));
--vibeui-aspect-003-sheen:light-dark(oklch(1 0 0),oklch(0.35 0.014 265));
--vibeui-aspect-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
/* Плашка скидки — белый текст на акценте, поэтому в тёмной ветке акцент не
   светлее, чем в светлой: выше L≈0.58 контраст падает ниже 4.5:1. */
--vibeui-aspect-003-accent:light-dark(oklch(0.56 0.19 25),oklch(0.56 0.17 25));
--vibeui-aspect-003-radius:0.875rem;
--vibeui-aspect-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="aspect-003"]{color-scheme:dark}
/* Карточку держит рамка, а не заливка: без подложки она ложится на фон
   страницы, и в тёмной теме текст остаётся читаемым сам по себе. */
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
radial-gradient(90% 80% at 30% 20%,var(--vibeui-aspect-003-sheen),transparent 70%),
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
 * Квадратный кадр товара: предсказуемая обрезка и цена под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect003({
  title = "Настольная лампа «Полёт», тёплый свет",
  price = "4 900 ₽",
  oldPrice = "6 900 ₽",
  badge = "−30 %",
  href = "#",
  background = "",
  accent,
  className,
  style,
  ...props
}: Aspect003Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-aspect-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="aspect-ratio"
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
