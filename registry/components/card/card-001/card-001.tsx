import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Card001Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "title"
> & {
  title?: string
  description?: string
  /** Надпись над заголовком: раздел, дата, тип материала. */
  eyebrow?: string
  /** Ссылка. Если задана, кликается вся карточка, а не только заголовок. */
  href?: string
  /** Подвал: цена, автор, кнопка. Пустой подвал не рисуется. */
  footer?: ReactNode
  accent?: string
}

// Идея компонента: кликает вся карточка, но ссылка остаётся одна. Заголовок
// растягивает свою область до краёв через ::after, поэтому в списке ссылок
// не появляется по три штуки на карточку — и скринридер читает одну.
const STYLES = `
:where([data-vibeui-block="card-001"]){
--vibeui-card-001-fg:oklch(0.22 0.016 265);
--vibeui-card-001-muted:oklch(0.52 0.014 265);
--vibeui-card-001-bg:oklch(1 0 0);
--vibeui-card-001-border:oklch(0.9 0.006 265);
--vibeui-card-001-accent:oklch(0.55 0.2 262);
--vibeui-card-001-radius:0.875rem;
--vibeui-card-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="card-001"]{
position:relative;display:flex;flex-direction:column;
max-width:22rem;box-sizing:border-box;
border:1px solid var(--vibeui-card-001-border);
border-radius:var(--vibeui-card-001-radius);
background:var(--vibeui-card-001-bg);color:var(--vibeui-card-001-fg);
font-family:var(--vibeui-card-001-font);
transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease;
}
[data-vibeui-block="card-001"]:hover{
border-color:color-mix(in oklab,var(--vibeui-card-001-accent) 35%,var(--vibeui-card-001-border));
box-shadow:0 8px 24px -12px oklch(0.2 0.03 265 / 30%);
transform:translateY(-2px);
}
[data-vibeui-block="card-001"]:focus-within{
border-color:var(--vibeui-card-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-card-001-accent) 20%,transparent);
}
[data-vibeui-block="card-001"] [data-part="media"]{
aspect-ratio:16 / 9;border-radius:calc(var(--vibeui-card-001-radius) - 1px) calc(var(--vibeui-card-001-radius) - 1px) 0 0;
background:
radial-gradient(120% 90% at 15% 0%,color-mix(in oklab,var(--vibeui-card-001-accent) 35%,transparent),transparent 60%),
linear-gradient(160deg,oklch(0.94 0.02 265),oklch(0.88 0.03 250));
}
[data-vibeui-block="card-001"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;padding:1rem 1.125rem 1.125rem;
}
[data-vibeui-block="card-001"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-card-001-accent);
}
[data-vibeui-block="card-001"] [data-part="title"]{
margin:0;font-size:1.0625rem;font-weight:600;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="card-001"] [data-part="title"] a{
color:inherit;text-decoration:none;outline:none;
}
/* Ссылка заголовка накрывает карточку целиком: одна ссылка, вся площадь. */
[data-vibeui-block="card-001"] [data-part="title"] a::after{
content:"";position:absolute;inset:0;border-radius:inherit;
}
[data-vibeui-block="card-001"] [data-part="description"]{
margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-card-001-muted);
}
[data-vibeui-block="card-001"] [data-part="footer"]{
display:flex;align-items:center;gap:0.5rem;
margin-top:0.375rem;padding-top:0.75rem;
border-top:1px solid var(--vibeui-card-001-border);
font-size:0.8125rem;color:var(--vibeui-card-001-muted);
}
@container (min-width: 26rem){
[data-vibeui-block="card-001"] [data-part="body"]{padding:1.25rem 1.375rem 1.375rem}
[data-vibeui-block="card-001"] [data-part="title"]{font-size:1.1875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-001"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-001"]:hover{transform:none}}
`

/**
 * Карточка материала: обложка, заголовок-ссылка на всю площадь, подвал.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card001({
  title = "Как собрать лендинг за вечер",
  description = "Разбираем сборку страницы из готовых блоков: что отдать агенту, а что править руками.",
  eyebrow = "Практика",
  href = "#",
  footer = "8 минут чтения",
  accent,
  className,
  style,
  ...props
}: Card001Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-001" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-001"
        className={className}
        style={palette}
      >
        <div data-part="media" aria-hidden="true" />
        <div data-part="body">
          {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
          <h3 data-part="title">{href ? <a href={href}>{title}</a> : title}</h3>
          {description ? <p data-part="description">{description}</p> : null}
          {footer ? <div data-part="footer">{footer}</div> : null}
        </div>
      </article>
    </>
  )
}
