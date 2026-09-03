import type { CSSProperties } from "react"

type Navbar002Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar002Props = {
  brand?: string
  /** Буква в знаке: компонент несёт русскую. */
  markLabel?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  links?: Navbar002Link[]
  loginLabel?: string
  loginHref?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плотная тёмная шапка: меню собрано в одну «пилюлю», поэтому навигация
// читается как единый объект, а не как россыпь ссылок. В узкой раскладке
// пилюля не прячется в меню, а превращается в горизонтальную ленту с
// прокруткой — на контентных сайтах разделы должны оставаться на виду.
//
// Тёмная подложка здесь — сама идея блока, а не тёмная тема: шапка остаётся
// тёмной и на светлой странице, поэтому палитра намеренно одноцветная.
const STYLES = `
:where([data-vibeui-block="navbar-002"]){
--vibeui-navbar-002-bg:oklch(0.21 0.014 265);
--vibeui-navbar-002-rail:oklch(0.27 0.016 265);
--vibeui-navbar-002-ink:oklch(0.97 0.003 265);
--vibeui-navbar-002-muted:oklch(0.72 0.012 265);
--vibeui-navbar-002-border:oklch(0.35 0.014 265);
--vibeui-navbar-002-accent:oklch(0.72 0.16 152);
--vibeui-navbar-002-accent-fg:oklch(0.2 0.04 152);
--vibeui-navbar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-002-bg);color:var(--vibeui-navbar-002-ink);
font-family:var(--vibeui-navbar-002-font);
}
[data-vibeui-block="navbar-002"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-002"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-002"] [data-part="mark"]{
width:1.75rem;height:1.75rem;border-radius:0.625rem;flex:none;
display:grid;place-items:center;
background:var(--vibeui-navbar-002-accent);color:var(--vibeui-navbar-002-accent-fg);
font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="navbar-002"] [data-part="rail"]{
order:3;flex:1 1 100%;
display:flex;align-items:center;gap:0.125rem;
padding:0.25rem;border:1px solid var(--vibeui-navbar-002-border);border-radius:999px;
background:var(--vibeui-navbar-002-rail);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-002"] [data-part="rail"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-002"] [data-part="rail"] a{
flex:none;padding:0.4375rem 0.875rem;border-radius:999px;
color:var(--vibeui-navbar-002-muted);text-decoration:none;
font-size:0.875rem;font-weight:520;white-space:nowrap;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-002"] [data-part="rail"] a:hover{color:var(--vibeui-navbar-002-ink)}
[data-vibeui-block="navbar-002"] [data-part="rail"] a[aria-current="page"]{
background:oklch(1 0 0 / 10%);color:var(--vibeui-navbar-002-ink);
}
[data-vibeui-block="navbar-002"] [data-part="actions"]{
display:flex;align-items:center;gap:0.5rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-002"] [data-part="login"]{
padding:0.4375rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-002-muted);text-decoration:none;font-size:0.875rem;font-weight:520;
transition:color .16s ease;
}
[data-vibeui-block="navbar-002"] [data-part="login"]:hover{color:var(--vibeui-navbar-002-ink)}
[data-vibeui-block="navbar-002"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;border-radius:0.625rem;
background:var(--vibeui-navbar-002-accent);color:var(--vibeui-navbar-002-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:640;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-002"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-002-accent) 86%,white)}
[data-vibeui-block="navbar-002"] a:focus-visible{outline:2px solid var(--vibeui-navbar-002-accent);outline-offset:2px}
@container (min-width: 54rem){
[data-vibeui-block="navbar-002"] [data-part="shell"]{padding:0.875rem 2rem;gap:1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-002"] [data-part="rail"]{order:0;flex:0 1 auto;margin:0 auto;overflow:visible}
[data-vibeui-block="navbar-002"] [data-part="actions"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar002Link[] = [
  { label: "Продукт", href: "#product", current: true },
  { label: "Решения", href: "#solutions" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Клиенты", href: "#customers" },
  { label: "Блог", href: "#blog" },
]

/** Тёмная шапка с меню-пилюлей: разделы всегда на виду, даже в узкой колонке. */
export function Navbar002({
  brand = "Контур",
  markLabel = "К",
  navLabel = "Разделы сайта",
  links = DEFAULT_LINKS,
  loginLabel = "Войти",
  loginHref = "#login",
  actionLabel = "Демо",
  actionHref = "#demo",
  accent,
  className,
  style,
}: Navbar002Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-002" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-002"
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
          <nav data-part="rail" aria-label={navLabel}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="actions">
            <a data-part="login" href={loginHref}>
              {loginLabel}
            </a>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
