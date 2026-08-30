import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb010Item = {
  label: string
  href?: string
  count?: number
}

export type Breadcrumb010Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb010Item[]
  accent?: string
}

// Идея компонента: путь с числом записей на каждом уровне. Число отвечает
// на вопрос «стоит ли туда возвращаться»: раздел с тремя товарами и раздел
// с тысячей — разные решения. Оно приписано к уровню, а не висит отдельной
// плашкой, и уходит скринридеру словами, а не голой цифрой.
const STYLES = `
:where([data-vibeui-block="breadcrumb-010"]){
--vibeui-breadcrumb-010-surface:oklch(1 0 0);
--vibeui-breadcrumb-010-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-010-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-010-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-010-chip:oklch(0.95 0.005 265);
--vibeui-breadcrumb-010-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-010"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-010-surface);
border:1px solid var(--vibeui-breadcrumb-010-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-010-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-010-muted);
}
[data-vibeui-block="breadcrumb-010"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-010"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-010"] li + li::before{
content:"";width:0.3125rem;height:0.3125rem;
border-top:1.5px solid oklch(0.78 0.01 265);
border-right:1.5px solid oklch(0.78 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-010"] a,
[data-vibeui-block="breadcrumb-010"] [aria-current="page"]{
display:inline-flex;align-items:center;gap:0.3125rem;
color:inherit;text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="breadcrumb-010"] a:hover{color:var(--vibeui-breadcrumb-010-fg)}
[data-vibeui-block="breadcrumb-010"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-010-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-010"] [aria-current="page"]{color:var(--vibeui-breadcrumb-010-fg);font-weight:600}
/* Число приписано к уровню: отдельная плашка оторвалась бы от названия. */
[data-vibeui-block="breadcrumb-010"] [data-part="count"]{
display:inline-flex;align-items:center;height:1.0625rem;padding:0 0.3125rem;
border-radius:9999px;background:var(--vibeui-breadcrumb-010-chip);
font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-breadcrumb-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb010Item[] = [
  { label: "Каталог", href: "#", count: 1280 },
  { label: "Электроника", href: "#", count: 342 },
  { label: "Наушники", count: 27 },
]

/**
 * Путь с числом записей на каждом уровне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb010({
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
  ...props
}: Breadcrumb010Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-010" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-010"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          {items.map((item, index) => {
            const last = index === items.length - 1
            const count =
              item.count === undefined ? null : (
                <span
                  data-part="count"
                  aria-label={`${item.count} записей в разделе`}
                >
                  {item.count}
                </span>
              )

            return (
              <li key={item.label}>
                {item.href && !last ? (
                  <a href={item.href}>
                    {item.label}
                    {count}
                  </a>
                ) : (
                  <span aria-current={last ? "page" : undefined}>
                    {item.label}
                    {count}
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
