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
  /** Буква в знаке: компонент несёт русскую. */
  markLabel?: string
  /** Подпись поля поиска для скринридера: компонент несёт русскую. */
  searchLabel?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка, в которой главное — поиск: поле стоит в середине и забирает всю
// свободную ширину, а разделы ужимаются вокруг него. Поле — настоящая форма
// с role="search", лупой из псевдоэлемента и подсказкой горячей клавиши,
// поэтому блок работает и без JS: отправка уходит на страницу поиска.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-005"]){
--vibeui-navbar-005-bg:transparent;
--vibeui-navbar-005-field:light-dark(oklch(1 0 0),oklch(0.28 0.014 265));
--vibeui-navbar-005-ink:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-navbar-005-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-navbar-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.011 265));
--vibeui-navbar-005-accent:light-dark(oklch(0.55 0.17 232),oklch(0.74 0.14 232));
--vibeui-navbar-005-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.17 0.03 232));
--vibeui-navbar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-005"]{color-scheme:dark}
[data-vibeui-block="navbar-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-navbar-005-field);color:var(--vibeui-navbar-005-muted);
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

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Шапка вокруг поиска: поле в середине забирает всю свободную ширину. */
export function Navbar005({
  brand = "Справочник",
  links = DEFAULT_LINKS,
  searchPlaceholder = "Поиск по документации и примерам",
  searchHint = "/",
  actionLabel = "Войти",
  actionHref = "#login",
  markLabel = "С",
  searchLabel = "Поиск по сайту",
  navLabel = "Разделы",
  background = "",
  accent,
  className,
  style,
}: Navbar005Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              {markLabel}
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
              aria-label={searchLabel}
            />
            <kbd data-part="kbd">{searchHint}</kbd>
          </form>
          <nav data-part="links" aria-label={navLabel}>
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
