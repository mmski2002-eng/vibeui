import type { ComponentProps, CSSProperties } from "react"

export type Card017Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Сама цитата, без кавычек: их рисует CSS. */
  quote?: string
  author?: string
  /** Роль и компания одной строкой: без них отзыв ничего не весит. */
  role?: string
  /** Оценка от 1 до 5. Ноль убирает ряд звёзд целиком. */
  rating?: number
  /** Ссылка на источник отзыва: сторонняя площадка, письмо, интервью. */
  source?: string
  /** Подпись оценки для скринридера: {rating} — сколько звёзд, {max} — из скольких. */
  ratingTemplate?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: отзыв как figure с blockquote и figcaption — автор
// связан с цитатой разметкой, а не соседством. Кавычка нарисована
// псевдоэлементом и спрятана от скринридера: вслух она звучит мусором.
// Звёзды продублированы числом, потому что «четыре закрашенных из пяти»
// на слух не существует.
const STYLES = `
:where([data-vibeui-block="card-017"]){
--vibeui-card-017-bg:transparent;
--vibeui-card-017-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-card-017-muted:color-mix(in oklab,var(--vibeui-card-017-fg) 68%,transparent);
--vibeui-card-017-border:light-dark(oklch(0.91 0.007 90),oklch(0.37 0.011 90));
--vibeui-card-017-accent:light-dark(oklch(0.62 0.14 55),oklch(0.78 0.12 55));
--vibeui-card-017-star:light-dark(oklch(0.74 0.15 78),oklch(0.82 0.14 78));
--vibeui-card-017-track:light-dark(oklch(0.93 0.005 90),oklch(0.35 0.008 90));
--vibeui-card-017-hue:60;
--vibeui-card-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-017"]{color-scheme:dark}
[data-vibeui-block="card-017"]{
position:relative;display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:25rem;box-sizing:border-box;margin:0;padding:1.25rem 1.25rem 1.125rem;
background:var(--vibeui-card-017-bg);color:var(--vibeui-card-017-fg);
border:1px solid var(--vibeui-card-017-border);border-radius:1rem;
font-family:var(--vibeui-card-017-font);
}
/* Открывающая кавычка — украшение: aria-hidden она не нужна, потому что
   псевдоэлемента в дереве доступности и так нет. */
[data-vibeui-block="card-017"]::before{
content:"\\201C";position:absolute;inset-block-start:0.125rem;inset-inline-start:0.75rem;
font-family:Georgia,"Times New Roman",serif;font-size:3.5rem;line-height:1;
color:color-mix(in oklab,var(--vibeui-card-017-accent) 22%,transparent);
pointer-events:none;
}
[data-vibeui-block="card-017"] [data-part="stars"]{
display:flex;align-items:center;gap:0.1875rem;position:relative;
}
[data-vibeui-block="card-017"] [data-part="star"]{
width:0.875rem;height:0.875rem;
background:color-mix(in oklab,var(--vibeui-card-017-star) 25%,var(--vibeui-card-017-track));
clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
}
[data-vibeui-block="card-017"] [data-part="star"][data-on="true"]{background:var(--vibeui-card-017-star)}
[data-vibeui-block="card-017"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="card-017"] [data-part="quote"]{
margin:0;font-size:1rem;line-height:1.55;letter-spacing:-0.005em;
text-wrap:pretty;
}
[data-vibeui-block="card-017"] [data-part="caption"]{
display:flex;align-items:center;gap:0.625rem;
padding-top:0.875rem;border-top:1px solid var(--vibeui-card-017-border);
}
[data-vibeui-block="card-017"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.125rem;height:2.125rem;border-radius:9999px;
background:light-dark(oklch(0.92 0.05 var(--vibeui-card-017-hue)),oklch(0.33 0.07 var(--vibeui-card-017-hue)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-card-017-hue)),oklch(0.92 0.05 var(--vibeui-card-017-hue)));
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="card-017"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="card-017"] [data-part="author"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-017"] [data-part="role"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-card-017-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="card-017"] [data-part="source"]{
margin-inline-start:auto;flex:none;font-size:0.6875rem;
color:var(--vibeui-card-017-muted);
}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

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
 * Карточка отзыва: цитата в blockquote, автор в figcaption, оценка
 * звёздами с числом. Один файл, ноль зависимостей.
 */
export function Card017({
  quote = "Отдали агенту три блока из каталога и получили рабочую страницу за вечер. Правили только тексты — вёрстку трогать не пришлось.",
  author = "Ольга Терентьева",
  role = "Продакт, «Ранняя птица»",
  rating = 5,
  source = "Отзыв на площадке",
  ratingTemplate = "Оценка {rating} из {max}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card017Props) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)))

  const palette = {
    "--vibeui-card-017-hue": hue(author),
    ...(accent ? { "--vibeui-card-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-017"
        className={className}
        style={palette}
      >
        {stars > 0 ? (
          <p data-part="stars">
            <span data-part="sr">
              {ratingTemplate
                .replace("{rating}", String(stars))
                .replace("{max}", "5")}
            </span>
            {[1, 2, 3, 4, 5].map((position) => (
              <span
                key={position}
                data-part="star"
                data-on={position <= stars}
                aria-hidden="true"
              />
            ))}
          </p>
        ) : null}
        <blockquote data-part="quote">{quote}</blockquote>
        <figcaption data-part="caption">
          <span data-part="face" aria-hidden="true">
            {initials(author)}
          </span>
          <span data-part="who">
            <span data-part="author">{author}</span>
            {role ? <span data-part="role">{role}</span> : null}
          </span>
          {source ? <span data-part="source">{source}</span> : null}
        </figcaption>
      </figure>
    </>
  )
}
