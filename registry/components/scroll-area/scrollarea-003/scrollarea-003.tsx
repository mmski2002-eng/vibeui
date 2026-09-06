import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea003Card = {
  title: string
  meta: string
}

export type Scrollarea003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  cards?: Scrollarea003Card[]
  /** Ширина карточки в ленте: от неё зависит, сколько видно за раз. */
  cardWidth?: string
  /** Подсказка справа в шапке. */
  hint?: string
  /** Имя ленты для скринридера. {title} подставляется заголовком. */
  railLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: горизонтальная лента с прилипанием. scroll-snap-align на
// карточках плюс scroll-padding у ленты — и остановка всегда приходится на
// начало карточки, а не на её середину. Последняя карточка не упирается в
// край: у ленты есть внутренние отступы, поэтому её видно целиком.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="scrollarea-003"]){
--vibeui-scrollarea-003-bg:transparent;
--vibeui-scrollarea-003-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-scrollarea-003-muted:color-mix(in oklab,var(--vibeui-scrollarea-003-fg) 68%,transparent);
--vibeui-scrollarea-003-border:light-dark(oklch(0.9 0 265),oklch(0.33 0 265));
--vibeui-scrollarea-003-tile:light-dark(oklch(0.97 0 265),oklch(0.26 0 265));
--vibeui-scrollarea-003-thumb-from:light-dark(oklch(0.88 0.06 39.8),oklch(0.45 0.09 39.8));
--vibeui-scrollarea-003-thumb-to:light-dark(oklch(0.93 0.03 200),oklch(0.52 0.06 39.8));
--vibeui-scrollarea-003-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-scrollarea-003-card:9.5rem;
--vibeui-scrollarea-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-003"]{color-scheme:dark}
[data-vibeui-block="scrollarea-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:0.875rem 0;
background:var(--vibeui-scrollarea-003-bg);
border:1px solid var(--vibeui-scrollarea-003-border);border-radius:1rem;
font-family:var(--vibeui-scrollarea-003-font);color:var(--vibeui-scrollarea-003-fg);
}
[data-vibeui-block="scrollarea-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding:0 1rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-003"] [data-part="hint"]{
font-weight:500;font-size:0.6875rem;color:var(--vibeui-scrollarea-003-muted);
}
/* Прилипание: остановка всегда на начале карточки, а не на её середине. */
[data-vibeui-block="scrollarea-003"] [data-part="rail"]{
display:flex;gap:0.625rem;
padding:0.125rem 1rem 0.625rem;
overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;
scroll-snap-type:x mandatory;scroll-padding-inline:1rem;
}
[data-vibeui-block="scrollarea-003"] [data-part="rail"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-003-accent);outline-offset:-2px;border-radius:0.5rem;
}
[data-vibeui-block="scrollarea-003"] [data-part="card"]{
flex:none;box-sizing:border-box;
width:var(--vibeui-scrollarea-003-card);
scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.375rem;
padding:0.75rem;border-radius:0.75rem;
background:var(--vibeui-scrollarea-003-tile);
border:1px solid var(--vibeui-scrollarea-003-border);
}
[data-vibeui-block="scrollarea-003"] [data-part="thumb"]{
aspect-ratio:16 / 10;border-radius:0.5rem;
background:linear-gradient(135deg,var(--vibeui-scrollarea-003-thumb-from),var(--vibeui-scrollarea-003-thumb-to));
}
[data-vibeui-block="scrollarea-003"] [data-part="name"]{
font-size:0.75rem;font-weight:650;line-height:1.25;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="scrollarea-003"] [data-part="meta"]{
font-size:0.6875rem;color:var(--vibeui-scrollarea-003-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="scrollarea-003"] [data-part="rail"]{scroll-behavior:auto}
}
`

const DEFAULT_CARDS: Scrollarea003Card[] = [
  { title: "Hero Split", meta: "блок · 2 мин" },
  { title: "Pricing Trio", meta: "блок · 3 мин" },
  { title: "Feature Grid", meta: "блок · 2 мин" },
  { title: "Testimonial Wall", meta: "блок · 4 мин" },
  { title: "FAQ Accordion", meta: "блок · 2 мин" },
  { title: "Footer Columns", meta: "блок · 1 мин" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Горизонтальная лента с прилипанием карточек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea003({
  title = "Готовые блоки",
  cards = DEFAULT_CARDS,
  cardWidth = "9.5rem",
  hint = "листайте вбок",
  railLabel = "{title}: горизонтальная лента",
  background = "",
  className,
  style,
  ...props
}: Scrollarea003Props) {
  const palette = {
    "--vibeui-scrollarea-003-card": cardWidth,
    ...(background
      ? {
          "--vibeui-scrollarea-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-003"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <span data-part="hint">{hint}</span>
        </div>
        <div
          data-part="rail"
          tabIndex={0}
          role="region"
          aria-label={railLabel.replace("{title}", title)}
        >
          {cards.map((card) => (
            <article key={card.title} data-part="card">
              <span data-part="thumb" aria-hidden="true" />
              <span data-part="name">{card.title}</span>
              <span data-part="meta">{card.meta}</span>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
