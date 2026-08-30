import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb001Item = {
  label: string
  href?: string
}

export type Breadcrumb001Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb001Item[]
  /** Сколько уровней показывать целиком. Середина сворачивается в многоточие. */
  maxVisible?: number
  accent?: string
}

// Идея компонента: длинный путь сворачивается посередине, а не обрезается
// с конца. Первый и последний уровни — самые нужные: откуда пришли и где
// находимся; их и оставляем, а середину прячем за многоточием.
const STYLES = `
:where([data-vibeui-block="breadcrumb-001"]){
--vibeui-breadcrumb-001-surface:oklch(1 0 0);
--vibeui-breadcrumb-001-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-001-fg:oklch(0.28 0.016 265);
--vibeui-breadcrumb-001-muted:oklch(0.55 0.014 265);
--vibeui-breadcrumb-001-accent:oklch(0.55 0.2 262);
--vibeui-breadcrumb-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-001"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-001-surface);
border:1px solid var(--vibeui-breadcrumb-001-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-001-font);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="breadcrumb-001"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-001"] li{display:flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="breadcrumb-001"] a{
color:var(--vibeui-breadcrumb-001-muted);text-decoration:none;
border-radius:0.25rem;
transition:color .16s ease;
}
[data-vibeui-block="breadcrumb-001"] a:hover{color:var(--vibeui-breadcrumb-001-fg)}
[data-vibeui-block="breadcrumb-001"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-001-accent);outline-offset:2px}
/* Текущий уровень — не ссылка: на страницу, где стоишь, не переходят. */
[data-vibeui-block="breadcrumb-001"] [data-part="current"]{
color:var(--vibeui-breadcrumb-001-fg);font-weight:500;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="breadcrumb-001"] [data-part="ellipsis"]{color:var(--vibeui-breadcrumb-001-muted);letter-spacing:0.05em}
/* Разделитель — грань квадрата: одна фигура вместо шрифтового символа. */
[data-vibeui-block="breadcrumb-001"] [data-part="sep"]{
width:0.3125rem;height:0.3125rem;flex:none;
border-right:1.5px solid var(--vibeui-breadcrumb-001-muted);
border-top:1.5px solid var(--vibeui-breadcrumb-001-muted);
transform:rotate(45deg);opacity:.7;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb001Item[] = [
  { label: "Проекты", href: "#" },
  { label: "Студия «Полёт»", href: "#" },
  { label: "Сайт студии", href: "#" },
  { label: "Страницы", href: "#" },
  { label: "Главная" },
]

/**
 * Хлебные крошки, сворачивающиеся посередине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb001({
  items = DEFAULT_ITEMS,
  maxVisible = 3,
  accent,
  className,
  style,
  ...props
}: Breadcrumb001Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const collapsed = items.length > maxVisible
  const visible = collapsed
    ? [items[0], ...items.slice(items.length - (maxVisible - 1))]
    : items
  const ellipsisAfter = collapsed ? 0 : -1

  return (
    <>
      <style href="vibeui-breadcrumb-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-001"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          {visible.map((item, index) => {
            const last = index === visible.length - 1

            return (
              <li key={`${item.label}-${index}`}>
                {item.href && !last ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span
                    data-part="current"
                    aria-current={last ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {index === ellipsisAfter ? (
                  <>
                    <span data-part="sep" aria-hidden="true" />
                    <span data-part="ellipsis" aria-hidden="true">
                      …
                    </span>
                  </>
                ) : null}
                {last ? null : <span data-part="sep" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
