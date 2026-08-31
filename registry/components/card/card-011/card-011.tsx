import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card011Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  title?: string
  description?: string
  /** Домен источника: он же рисует буквенный знак и оттенок. */
  url?: string
  href?: string
  /** Внешняя ссылка получает target и rel, а стрелка — поворот. */
  external?: boolean
  accent?: string
}

// Идея компонента: закладка на внешний материал. Кликается вся площадь, но
// ссылка в дереве доступности одна — заголовок растягивает свою зону через
// ::after. Домен показан текстом, а не только знаком: перед уходом с сайта
// человек должен видеть, куда именно он уходит.
const STYLES = `
:where([data-vibeui-block="card-011"]){
--vibeui-card-011-bg:oklch(1 0 0);
--vibeui-card-011-fg:oklch(0.23 0.015 265);
--vibeui-card-011-muted:oklch(0.55 0.013 265);
--vibeui-card-011-border:oklch(0.91 0.006 265);
--vibeui-card-011-accent:oklch(0.55 0.18 262);
--vibeui-card-011-hue:250;
--vibeui-card-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-011"]{
position:relative;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem 1rem;
background:var(--vibeui-card-011-bg);color:var(--vibeui-card-011-fg);
border:1px solid var(--vibeui-card-011-border);border-radius:0.875rem;
font-family:var(--vibeui-card-011-font);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="card-011"]:hover{
border-color:color-mix(in oklab,var(--vibeui-card-011-accent) 40%,var(--vibeui-card-011-border));
box-shadow:0 10px 24px -18px oklch(0.2 0.03 265 / 55%);
}
[data-vibeui-block="card-011"]:has(a:focus-visible){
border-color:var(--vibeui-card-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-card-011-accent) 22%,transparent);
}
[data-vibeui-block="card-011"] [data-part="source"]{
display:flex;align-items:center;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-card-011-muted);
}
[data-vibeui-block="card-011"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:oklch(0.93 0.05 var(--vibeui-card-011-hue));
color:oklch(0.4 0.1 var(--vibeui-card-011-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="card-011"] [data-part="host"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="card-011"] [data-part="arrow"]{
margin-inline-start:auto;flex:none;
width:0.9375rem;height:0.9375rem;
color:var(--vibeui-card-011-muted);
transition:transform .16s ease,color .16s ease;
}
[data-vibeui-block="card-011"]:hover [data-part="arrow"]{
transform:translate(2px,-2px);color:var(--vibeui-card-011-accent);
}
[data-vibeui-block="card-011"] [data-part="title"]{
margin:0;font-size:1rem;font-weight:640;line-height:1.35;letter-spacing:-0.01em;
}
[data-vibeui-block="card-011"] [data-part="title"] a{color:inherit;text-decoration:none;outline:none}
/* Заголовок-ссылка накрывает карточку целиком: одна ссылка, вся площадь. */
[data-vibeui-block="card-011"] [data-part="title"] a::after{
content:"";position:absolute;inset:0;border-radius:inherit;
}
[data-vibeui-block="card-011"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="card-011"] [data-part="description"]{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-card-011-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-011"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-011"]:hover [data-part="arrow"]{transform:none}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Карточка-закладка на внешний материал: домен, заголовок-ссылка на всю
 * площадь и описание. Один файл, ноль зависимостей, собственная палитра.
 */
export function Card011({
  title = "Что такое container queries и когда они нужны",
  description = "Разбор на примерах: почему раскладку компонента считают от его собственной ширины, а не от окна.",
  url = "web.dev",
  href = "https://web.dev",
  external = true,
  accent,
  className,
  style,
  ...props
}: Card011Props) {
  const palette = {
    "--vibeui-card-011-hue": hue(url),
    ...(accent ? { "--vibeui-card-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-011" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-011"
        className={className}
        style={palette}
      >
        <p data-part="source">
          <span data-part="mark" aria-hidden="true">
            {url
              .replace(/^www\./, "")
              .charAt(0)
              .toUpperCase()}
          </span>
          <span data-part="host">{url}</span>
          <svg
            data-part="arrow"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <h3 data-part="title">
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : null)}
          >
            {title}
            {external ? (
              <span data-part="sr"> (откроется в новой вкладке)</span>
            ) : null}
          </a>
        </h3>
        {description ? <p data-part="description">{description}</p> : null}
      </article>
    </>
  )
}
