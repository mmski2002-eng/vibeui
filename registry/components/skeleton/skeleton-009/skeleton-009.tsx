import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton009Props = ComponentPropsWithoutRef<"div"> & {
  ratio?: "1 / 1" | "4 / 3" | "16 / 9"
  label?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка карточки товара держит её каркас — обложку,
// две строки названия и отдельную полосу цены. Цена — не такая же серая
// полоса, как строки названия: она короче, толще и стоит отдельно от текста,
// поэтому глаз узнаёт в заглушке карточку товара, а не произвольный текстовый
// блок. Вся заливка декоративна и спрятана от вспомогательных технологий:
// текст-заглушка живёт только в aria-label корня.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, карточка темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="skeleton-009"]){
--vibeui-skeleton-009-bg:transparent;
--vibeui-skeleton-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-009-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-009-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
--vibeui-skeleton-009-ratio:1 / 1;
}
[data-vibeui-block="skeleton-009"]{
display:flex;flex-direction:column;
width:100%;max-width:14rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-skeleton-009-bg);
border:1px solid var(--vibeui-skeleton-009-border);border-radius:1rem;
}
/* Один рецепт заливки на все формы: блик и база не расходятся между частями. */
[data-vibeui-block="skeleton-009"] [data-part="media"],
[data-vibeui-block="skeleton-009"] [data-part="bar"],
[data-vibeui-block="skeleton-009"] [data-part="price"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-009-base) 0%,
var(--vibeui-skeleton-009-shine) 50%,
var(--vibeui-skeleton-009-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-009-sweep 1.4s ease-in-out infinite;
}
/* Место под обложку занято пропорцией: подстановка фото не двигает сетку. */
[data-vibeui-block="skeleton-009"] [data-part="media"]{
aspect-ratio:var(--vibeui-skeleton-009-ratio);width:100%;
}
[data-vibeui-block="skeleton-009"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.75rem 0.8125rem 0.875rem;
}
[data-vibeui-block="skeleton-009"] [data-part="bar"]{height:0.6875rem;border-radius:0.25rem;width:88%}
[data-vibeui-block="skeleton-009"] [data-part="bar"][data-size="short"]{width:56%}
/* Цена — отдельная полоса, толще и короче строк названия. */
[data-vibeui-block="skeleton-009"] [data-part="price"]{
height:0.9375rem;width:34%;border-radius:0.25rem;margin-top:0.1875rem;
}
@keyframes vibeui-skeleton-009-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-009"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-009"] [data-part="media"],
[data-vibeui-block="skeleton-009"] [data-part="bar"],
[data-vibeui-block="skeleton-009"] [data-part="price"]{background:var(--vibeui-skeleton-009-base)}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы полосам
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
 * Заглушка карточки товара: обложка с пропорцией, две строки названия и
 * отдельная полоса цены. Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton009({
  ratio = "1 / 1",
  label = "Товар загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton009Props) {
  const palette = {
    "--vibeui-skeleton-009-ratio": ratio,
    ...(background
      ? {
          "--vibeui-skeleton-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-009"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="media" aria-hidden="true" />
        <div data-part="body" aria-hidden="true">
          <div data-part="bar" />
          <div data-part="bar" data-size="short" />
          <div data-part="price" />
        </div>
      </div>
    </>
  )
}
