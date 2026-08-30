import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb002Item = {
  label: string
  href?: string
}

export type Breadcrumb002Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb002Item[]
  separator?: string
  accent?: string
}

// Идея компонента: минимальные крошки без рамок и заливок. Разделитель
// нарисован псевдоэлементом, а не вставлен в разметку: символ между
// ссылками скринридер прочитал бы как «слэш» на каждом уровне. Последний
// уровень — не ссылка: вести на текущую страницу незачем.
const STYLES = `
:where([data-vibeui-block="breadcrumb-002"]){
--vibeui-breadcrumb-002-surface:oklch(1 0 0);
--vibeui-breadcrumb-002-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-002-fg:oklch(0.28 0.016 265);
--vibeui-breadcrumb-002-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-002-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-002-separator:"/";
--vibeui-breadcrumb-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-002"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-002-surface);
border:1px solid var(--vibeui-breadcrumb-002-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-002-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-002-muted);
}
[data-vibeui-block="breadcrumb-002"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-002"] li{display:inline-flex;align-items:center;gap:0.375rem}
/* Разделитель в CSS, а не в разметке: иначе скринридер читает его вслух. */
[data-vibeui-block="breadcrumb-002"] li + li::before{
content:var(--vibeui-breadcrumb-002-separator);
color:oklch(0.75 0.01 265);
}
[data-vibeui-block="breadcrumb-002"] a{
color:inherit;text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="breadcrumb-002"] a:hover{color:var(--vibeui-breadcrumb-002-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-002"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-002-accent);outline-offset:2px}
/* Текущий уровень — не ссылка, но выделен: он отвечает «где я». */
[data-vibeui-block="breadcrumb-002"] [aria-current="page"]{color:var(--vibeui-breadcrumb-002-fg);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb002Item[] = [
  { label: "Главная", href: "#" },
  { label: "Каталог", href: "#" },
  { label: "Компоненты", href: "#" },
  { label: "Хлебные крошки" },
]

/**
 * Минимальные крошки: разделитель в CSS, текущий уровень без ссылки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb002({
  items = DEFAULT_ITEMS,
  separator = "/",
  accent,
  className,
  style,
  ...props
}: Breadcrumb002Props) {
  const palette = {
    "--vibeui-breadcrumb-002-separator": `"${separator}"`,
    ...(accent ? { "--vibeui-breadcrumb-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-002"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          {items.map((item, index) => {
            const last = index === items.length - 1

            return (
              <li key={item.label}>
                {item.href && !last ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
