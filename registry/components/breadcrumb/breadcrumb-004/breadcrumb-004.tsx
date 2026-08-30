import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb004Item = {
  label: string
  href?: string
}

export type Breadcrumb004Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb004Item[]
  visible?: number
  accent?: string
}

// Идея компонента: свёрнутая середина раскрывается списком, а не исчезает.
// Многоточие здесь — <summary> нативного <details>: раскрытие без единой
// строки клиентского кода, с клавиатуры и с правильной ролью. Скрытые уровни
// остаются достижимы, а не просто спрятаны за троеточием.
const STYLES = `
:where([data-vibeui-block="breadcrumb-004"]){
--vibeui-breadcrumb-004-surface:oklch(1 0 0);
--vibeui-breadcrumb-004-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-004-fg:oklch(0.28 0.016 265);
--vibeui-breadcrumb-004-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-004-bg:oklch(1 0 0);
--vibeui-breadcrumb-004-border:oklch(0.9 0.006 265);
--vibeui-breadcrumb-004-hover:oklch(0.96 0.004 265);
--vibeui-breadcrumb-004-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-004"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-004-surface);
border:1px solid var(--vibeui-breadcrumb-004-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-004-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-004-muted);
}
[data-vibeui-block="breadcrumb-004"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-004"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="breadcrumb-004"] li + li::before{content:"/";color:oklch(0.75 0.01 265)}
[data-vibeui-block="breadcrumb-004"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-004"] a:hover{color:var(--vibeui-breadcrumb-004-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-004"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-004-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-004"] [aria-current="page"]{color:var(--vibeui-breadcrumb-004-fg);font-weight:600}
/* Раскрытие на нативном details: без JS, с клавиатуры, с ролью кнопки. */
[data-vibeui-block="breadcrumb-004"] details{position:relative}
[data-vibeui-block="breadcrumb-004"] summary{
list-style:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
height:1.25rem;padding:0 0.375rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-breadcrumb-004-border);
color:var(--vibeui-breadcrumb-004-muted);letter-spacing:0.06em;
}
[data-vibeui-block="breadcrumb-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="breadcrumb-004"] summary:hover{color:var(--vibeui-breadcrumb-004-fg);background:var(--vibeui-breadcrumb-004-hover)}
[data-vibeui-block="breadcrumb-004"] summary:focus-visible{outline:2px solid var(--vibeui-breadcrumb-004-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-004"] [data-part="hidden"]{
position:absolute;left:0;top:calc(100% + 0.375rem);z-index:20;
display:flex;flex-direction:column;gap:0.125rem;min-width:10rem;
margin:0;padding:0.25rem;list-style:none;
border:1px solid var(--vibeui-breadcrumb-004-border);border-radius:0.5rem;
background:var(--vibeui-breadcrumb-004-bg);
box-shadow:0 14px 30px -18px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="breadcrumb-004"] [data-part="hidden"] li{display:block}
[data-vibeui-block="breadcrumb-004"] [data-part="hidden"] li::before{content:none}
[data-vibeui-block="breadcrumb-004"] [data-part="hidden"] a{
display:block;padding:0.3125rem 0.5rem;border-radius:0.375rem;
}
[data-vibeui-block="breadcrumb-004"] [data-part="hidden"] a:hover{background:var(--vibeui-breadcrumb-004-hover);text-decoration:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb004Item[] = [
  { label: "Главная", href: "#" },
  { label: "Документы", href: "#" },
  { label: "2026", href: "#" },
  { label: "Договоры", href: "#" },
  { label: "Поставщики", href: "#" },
  { label: "Акт №142" },
]

/**
 * Свёрнутая середина раскрывается списком на нативном details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb004({
  items = DEFAULT_ITEMS,
  visible = 2,
  accent,
  className,
  style,
  ...props
}: Breadcrumb004Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const first = items[0]
  const tail = items.slice(-Math.max(1, visible))
  const middle = items.slice(1, items.length - tail.length)

  return (
    <>
      <style href="vibeui-breadcrumb-004" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-004"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          <li>
            <a href={first.href ?? "#"}>{first.label}</a>
          </li>
          {middle.length ? (
            <li>
              <details name={`${id}-crumbs`}>
                <summary aria-label={`Показать ещё ${middle.length} уровня`}>
                  …
                </summary>
                <ul data-part="hidden">
                  {middle.map((item) => (
                    <li key={item.label}>
                      <a href={item.href ?? "#"}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ) : null}
          {tail.map((item, index) => {
            const last = index === tail.length - 1

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
