import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb006Item = {
  label: string
  href?: string
}

export type Breadcrumb006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  items?: Breadcrumb006Item[]
  title?: string
  meta?: string
  accent?: string
}

// Идея компонента: шапка страницы, где путь и заголовок — одно целое.
// Название текущего уровня не дублируется в крошках: строка пути ведёт до
// родителя, а «где я» отвечает сам заголовок. Дублирование заставляет
// читать одно и то же дважды и съедает высоту первого экрана.
const STYLES = `
:where([data-vibeui-block="breadcrumb-006"]){
--vibeui-breadcrumb-006-surface:oklch(1 0 0);
--vibeui-breadcrumb-006-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-006-fg:oklch(0.22 0.016 265);
--vibeui-breadcrumb-006-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-006-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-006"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-006-surface);
border:1px solid var(--vibeui-breadcrumb-006-surface-border);border-radius:0.625rem;
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:32rem;
font-family:var(--vibeui-breadcrumb-006-font);color:var(--vibeui-breadcrumb-006-fg);
}
[data-vibeui-block="breadcrumb-006"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
font-size:0.75rem;line-height:1.3;color:var(--vibeui-breadcrumb-006-muted);
}
[data-vibeui-block="breadcrumb-006"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="breadcrumb-006"] li + li::before{content:"/";color:oklch(0.78 0.01 265)}
[data-vibeui-block="breadcrumb-006"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-006"] a:hover{color:var(--vibeui-breadcrumb-006-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-006"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-006-accent);outline-offset:2px}
/* Заголовок отвечает «где я»: в крошках текущий уровень не повторяется. */
[data-vibeui-block="breadcrumb-006"] h1{
margin:0;font-size:clamp(1.25rem,2.5vw,1.75rem);line-height:1.15;
letter-spacing:-0.02em;font-weight:680;
}
[data-vibeui-block="breadcrumb-006"] [data-part="meta"]{
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-breadcrumb-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb006Item[] = [
  { label: "Главная", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "VibeUI", href: "#" },
]

/**
 * Шапка страницы: путь до родителя и заголовок вместо последней крошки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb006({
  items = DEFAULT_ITEMS,
  title = "Хлебные крошки",
  meta = "12 компонентов · обновлено сегодня",
  accent,
  className,
  style,
  ...props
}: Breadcrumb006Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="breadcrumb-006"
        className={className}
        style={palette}
      >
        <nav aria-label="Хлебные крошки">
          <ol>
            {items.map((item) => (
              <li key={item.label}>
                <a href={item.href ?? "#"}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <h1>{title}</h1>
        {meta ? <p data-part="meta">{meta}</p> : null}
      </div>
    </>
  )
}
