import type { CSSProperties } from "react"

type Navbar005Link = {
  label: string
  href: string
}

export type Navbar005Props = {
  brand?: string
  links?: Navbar005Link[]
  searchPlaceholder?: string
  searchHint?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка, в которой главное — поиск: поле стоит в середине и забирает всю
// свободную ширину, а разделы ужимаются вокруг него. Поле — настоящая форма
// с role="search", лупой из псевдоэлемента и подсказкой горячей клавиши,
// поэтому блок работает и без JS: отправка уходит на страницу поиска.
const STYLES = `
:where([data-vibeui-block="navbar-005"]){
--vibeui-navbar-005-bg:oklch(0.99 0.002 265);
--vibeui-navbar-005-field:oklch(1 0 0);
--vibeui-navbar-005-ink:oklch(0.24 0.014 265);
--vibeui-navbar-005-muted:oklch(0.55 0.014 265);
--vibeui-navbar-005-border:oklch(0.9 0.006 265);
--vibeui-navbar-005-accent:oklch(0.55 0.17 232);
--vibeui-navbar-005-accent-fg:oklch(0.99 0 0);
--vibeui-navbar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-005"]{
display:block;background:var(--vibeui-navbar-005-bg);color:var(--vibeui-navbar-005-ink);
border-bottom:1px solid var(--vibeui-navbar-005-border);
font-family:var(--vibeui-navbar-005-font);
}
[data-vibeui-block="navbar-005"] [data-part="shell"]{
display:grid;gap:0.75rem;align-items:center;
max-width:84rem;margin:0 auto;padding:0.75rem 1rem;
grid-template-columns:auto auto;
}
[data-vibeui-block="navbar-005"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-005"] [data-part="mark"]{
width:1.625rem;height:1.625rem;border-radius:0.5rem;flex:none;
display:grid;place-items:center;font-size:0.75rem;font-weight:800;
background:var(--vibeui-navbar-005-accent);color:var(--vibeui-navbar-005-accent-fg);
}
[data-vibeui-block="navbar-005"] [data-part="search"]{
grid-column:1 / -1;position:relative;display:flex;align-items:center;
}
[data-vibeui-block="navbar-005"] [data-part="search"]::before{
content:"";position:absolute;left:0.875rem;width:0.75rem;height:0.75rem;
border:1.5px solid var(--vibeui-navbar-005-muted);border-radius:999px;
pointer-events:none;
}
[data-vibeui-block="navbar-005"] [data-part="search"]::after{
content:"";position:absolute;left:1.5rem;top:calc(50% + 0.25rem);width:0.375rem;height:1.5px;
background:var(--vibeui-navbar-005-muted);transform:rotate(45deg);transform-origin:left center;
pointer-events:none;
}
[data-vibeui-block="navbar-005"] [data-part="input"]{
width:100%;height:2.5rem;padding:0 4.5rem 0 2.5rem;
border:1px solid var(--vibeui-navbar-005-border);border-radius:0.75rem;
background:var(--vibeui-navbar-005-field);color:inherit;
font:inherit;font-size:0.9375rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="navbar-005"] [data-part="input"]::placeholder{color:var(--vibeui-navbar-005-muted)}
[data-vibeui-block="navbar-005"] [data-part="input"]:focus{
outline:none;border-color:var(--vibeui-navbar-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-005-accent) 22%,transparent);
}
[data-vibeui-block="navbar-005"] [data-part="kbd"]{
position:absolute;right:0.625rem;display:inline-flex;align-items:center;height:1.375rem;padding:0 0.4375rem;
border:1px solid var(--vibeui-navbar-005-border);border-radius:0.375rem;
background:var(--vibeui-navbar-005-bg);color:var(--vibeui-navbar-005-muted);
font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;font-size:0.6875rem;
pointer-events:none;
}
[data-vibeui-block="navbar-005"] [data-part="links"]{
grid-column:1 / -1;display:flex;align-items:center;gap:1rem;overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-005"] [data-part="links"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-005"] [data-part="links"] a{
color:var(--vibeui-navbar-005-muted);text-decoration:none;white-space:nowrap;
font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-005"] [data-part="links"] a:hover{color:var(--vibeui-navbar-005-ink)}
[data-vibeui-block="navbar-005"] [data-part="action"]{
justify-self:end;display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border-radius:0.625rem;background:var(--vibeui-navbar-005-accent);color:var(--vibeui-navbar-005-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-005"] a:focus-visible,
[data-vibeui-block="navbar-005"] button:focus-visible{outline:2px solid var(--vibeui-navbar-005-accent);outline-offset:2px}
@container (min-width: 56rem){
[data-vibeui-block="navbar-005"] [data-part="shell"]{grid-template-columns:auto minmax(12rem,26rem) 1fr auto;padding:0.875rem 2rem;gap:1.5rem}
[data-vibeui-block="navbar-005"] [data-part="search"]{grid-column:auto}
[data-vibeui-block="navbar-005"] [data-part="links"]{grid-column:auto;overflow:visible}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar005Link[] = [
  { label: "Каталог", href: "#catalog" },
  { label: "Гайды", href: "#guides" },
  { label: "Сообщество", href: "#community" },
]

/** Шапка вокруг поиска: поле в середине забирает всю свободную ширину. */
export function Navbar005({
  brand = "Справочник",
  links = DEFAULT_LINKS,
  searchPlaceholder = "Поиск по документации и примерам",
  searchHint = "/",
  actionLabel = "Войти",
  actionHref = "#login",
  accent,
  className,
  style,
}: Navbar005Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-005" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              С
            </span>
            {brand}
          </a>
          <form data-part="search" role="search" action="#search">
            <input
              data-part="input"
              id="vibeui-navbar-005-input"
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label="Поиск по сайту"
            />
            <kbd data-part="kbd">{searchHint}</kbd>
          </form>
          <nav data-part="links" aria-label="Разделы">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </header>
    </>
  )
}
