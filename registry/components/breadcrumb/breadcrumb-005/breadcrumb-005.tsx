import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb005Item = {
  label: string
  href?: string
}

export type Breadcrumb005Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb005Item[]
  accent?: string
}

// Идея компонента: путь не переносится и не сворачивается, а прокручивается
// вбок. Такой вариант нужен там, где важен каждый уровень: в файловом
// менеджере и в админке. Край подтёрт градиентом-маской — обрубленная
// строка иначе выглядит поломкой, а не продолжением.
const STYLES = `
:where([data-vibeui-block="breadcrumb-005"]){
--vibeui-breadcrumb-005-surface:oklch(1 0 0);
--vibeui-breadcrumb-005-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-005-fg:oklch(0.28 0.016 265);
--vibeui-breadcrumb-005-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-005-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-005"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-005-surface);
border:1px solid var(--vibeui-breadcrumb-005-surface-border);border-radius:0.625rem;
display:block;width:100%;box-sizing:border-box;
font-family:var(--vibeui-breadcrumb-005-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-005-muted);
}
/* Прокрутка вбок вместо переноса: каждый уровень остаётся на месте. */
[data-vibeui-block="breadcrumb-005"] ol{
display:flex;align-items:center;gap:0.375rem;
margin:0;padding:0.125rem 1.25rem 0.375rem 0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scrollbar-width:thin;
/* Маска у правого края: обрубленная строка читается как продолжение. */
mask:linear-gradient(to right,oklch(0 0 0) calc(100% - 1.25rem),transparent);
}
[data-vibeui-block="breadcrumb-005"] li{display:inline-flex;align-items:center;gap:0.375rem;flex:none;white-space:nowrap}
[data-vibeui-block="breadcrumb-005"] li + li::before{content:"/";color:oklch(0.75 0.01 265)}
[data-vibeui-block="breadcrumb-005"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-005"] a:hover{color:var(--vibeui-breadcrumb-005-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-005"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-005-accent);outline-offset:2px}
/* Текущий уровень прилипает к правому краю: он важнее всех остальных. */
[data-vibeui-block="breadcrumb-005"] [aria-current="page"]{
position:sticky;right:0;color:var(--vibeui-breadcrumb-005-fg);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb005Item[] = [
  { label: "Диск", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "VibeUI", href: "#" },
  { label: "registry", href: "#" },
  { label: "components", href: "#" },
  { label: "breadcrumb", href: "#" },
  { label: "breadcrumb-005.tsx" },
]

/**
 * Путь с прокруткой вбок: уровни не сворачиваются и не переносятся.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb005({
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
  ...props
}: Breadcrumb005Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-005"
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
