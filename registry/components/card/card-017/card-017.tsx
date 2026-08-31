import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card017Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> & {
  /** Сама цитата, без кавычек: их рисует CSS. */
  quote?: string
  author?: string
  /** Роль и компания одной строкой: без них отзыв ничего не весит. */
  role?: string
  /** Оценка от 1 до 5. Ноль убирает ряд звёзд целиком. */
  rating?: number
  /** Ссылка на источник отзыва: сторонняя площадка, письмо, интервью. */
  source?: string
  accent?: string
}

// Идея компонента: отзыв как figure с blockquote и figcaption — автор
// связан с цитатой разметкой, а не соседством. Кавычка нарисована
// псевдоэлементом и спрятана от скринридера: вслух она звучит мусором.
// Звёзды продублированы числом, потому что «четыре закрашенных из пяти»
// на слух не существует.
const STYLES = `
:where([data-vibeui-block="card-017"]){
--vibeui-card-017-bg:oklch(0.99 0.004 90);
--vibeui-card-017-fg:oklch(0.23 0.016 265);
--vibeui-card-017-muted:oklch(0.55 0.013 265);
--vibeui-card-017-border:oklch(0.91 0.007 90);
--vibeui-card-017-accent:oklch(0.62 0.14 55);
--vibeui-card-017-star:oklch(0.74 0.15 78);
--vibeui-card-017-hue:60;
--vibeui-card-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:color-mix(in oklab,var(--vibeui-card-017-star) 25%,oklch(0.93 0.005 90));
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
background:oklch(0.92 0.05 var(--vibeui-card-017-hue));
color:oklch(0.38 0.09 var(--vibeui-card-017-hue));
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
 * Карточка отзыва: цитата в blockquote, автор в figcaption, оценка
 * звёздами с числом. Один файл, ноль зависимостей.
 */
export function Card017({
  quote = "Отдали агенту три блока из каталога и получили рабочую страницу за вечер. Правили только тексты — вёрстку трогать не пришлось.",
  author = "Ольга Терентьева",
  role = "Продакт, «Ранняя птица»",
  rating = 5,
  source = "Отзыв на площадке",
  accent,
  className,
  style,
  ...props
}: Card017Props) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)))

  const palette = {
    "--vibeui-card-017-hue": hue(author),
    ...(accent ? { "--vibeui-card-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="card-017"
        className={className}
        style={palette}
      >
        {stars > 0 ? (
          <p data-part="stars">
            <span data-part="sr">Оценка {stars} из 5</span>
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
