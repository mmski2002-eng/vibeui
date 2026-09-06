import type { ComponentProps, CSSProperties } from "react"

export type Item005Props = Omit<ComponentProps<"li">, "children" | "title"> & {
  title?: string
  meta?: string
  badge?: string
  image?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка с медиа-превью. Место под картинку занято до её
// загрузки: превью задано пропорцией 16 / 9 и фиксированной шириной, поэтому
// строка не прыгает, когда файл наконец приехал. Без картинки в том же
// прямоугольнике лежит градиентная заглушка, а не пустота — высота строки
// одинакова в обоих случаях. Длительность лежит поверх превью и продублирована
// текстом для скринридера: подпись на картинке ему не видна.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку. Плашка
// длительности остаётся тёмной в обеих темах — она лежит поверх картинки,
// а не поверх страницы.
const STYLES = `
:where([data-vibeui-block="item-005"]){
--vibeui-item-005-bg:transparent;
--vibeui-item-005-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-005-muted:color-mix(in oklab,var(--vibeui-item-005-fg) 68%,transparent);
--vibeui-item-005-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-005-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.72 0.17 39.8));
--vibeui-item-005-shade:oklch(0.2 0 265 / 72%);
--vibeui-item-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-005"]{color-scheme:dark}
[data-vibeui-block="item-005"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-005-bg);
border:1px solid var(--vibeui-item-005-border);border-radius:0.75rem;
font-family:var(--vibeui-item-005-font);color:var(--vibeui-item-005-fg);
}
[data-vibeui-block="item-005"] *{box-sizing:border-box}
/* Место под превью занято пропорцией: строка не прыгает после загрузки. */
[data-vibeui-block="item-005"] [data-part="media"]{
position:relative;flex:none;width:5.5rem;aspect-ratio:16 / 9;
border-radius:0.5rem;overflow:hidden;
background:linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-item-005-accent) 30%,white),
color-mix(in oklab,var(--vibeui-item-005-accent) 70%,black));
}
[data-vibeui-block="item-005"] [data-part="media"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="item-005"] [data-part="badge"]{
position:absolute;right:0.25rem;bottom:0.25rem;
padding:0 0.25rem;border-radius:0.25rem;
background:var(--vibeui-item-005-shade);color:oklch(1 0 0);
font-size:0.625rem;font-weight:650;line-height:1.4;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-005"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.1875rem}
[data-vibeui-block="item-005"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
[data-vibeui-block="item-005"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-005"] *{animation:none!important;transition:none!important}}
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
 * Строка списка с медиа-превью фиксированной пропорции и меткой длительности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item005({
  title = "Как собрать каталог компонентов за вечер",
  meta = "Роман Тищенко · 3 дня назад",
  badge = "12:40",
  image,
  background = "",
  accent,
  className,
  style,
  ...props
}: Item005Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-005" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="item"
        data-vibeui-block="item-005"
        className={className}
        style={palette}
      >
        <span data-part="media">
          {image ? <img src={image} alt="" /> : null}
          {badge ? (
            <span data-part="badge" aria-hidden="true">
              {badge}
            </span>
          ) : null}
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          <span data-part="meta">
            {meta}
            {badge ? ` · ${badge}` : null}
          </span>
        </span>
      </li>
    </>
  )
}
