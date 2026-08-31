import type { CSSProperties } from "react"

type Navbar007Link = {
  label: string
  href: string
}

export type Navbar007Props = {
  brand?: string
  links?: Navbar007Link[]
  loginLabel?: string
  loginHref?: string
  trialLabel?: string
  trialHref?: string
  trialNote?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка продукта с пробным периодом. Двух равных кнопок здесь нет: вход —
// текстовая ссылка, пробный период — единственная закрашенная кнопка, а под
// ней мелкая строка, которая снимает возражение «сейчас попросят карту»
// ровно в том месте, где человек решает нажимать или нет.
const STYLES = `
:where([data-vibeui-block="navbar-007"]){
--vibeui-navbar-007-bg:oklch(0.99 0.004 150);
--vibeui-navbar-007-ink:oklch(0.22 0.02 160);
--vibeui-navbar-007-muted:oklch(0.5 0.018 160);
--vibeui-navbar-007-border:oklch(0.89 0.012 160);
--vibeui-navbar-007-accent:oklch(0.53 0.14 158);
--vibeui-navbar-007-accent-fg:oklch(0.99 0 0);
--vibeui-navbar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="navbar-007"]{
display:block;background:var(--vibeui-navbar-007-bg);color:var(--vibeui-navbar-007-ink);
border-bottom:1px solid var(--vibeui-navbar-007-border);
font-family:var(--vibeui-navbar-007-font);
}
[data-vibeui-block="navbar-007"] [data-part="shell"]{
display:flex;align-items:center;gap:1rem;
max-width:80rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-007"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:700;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-007"] [data-part="mark"]{
width:1.625rem;height:1.625rem;flex:none;border-radius:0.5rem;
background:var(--vibeui-navbar-007-accent);
mask-image:radial-gradient(circle at 50% 118%,transparent 46%,black 47%);
}
[data-vibeui-block="navbar-007"] [data-part="links"]{display:none;align-items:center;gap:0.25rem;margin-inline:auto}
[data-vibeui-block="navbar-007"] [data-part="links"] a{
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-007-muted);text-decoration:none;font-size:0.875rem;font-weight:520;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-007"] [data-part="links"] a:hover{
color:var(--vibeui-navbar-007-ink);background:color-mix(in oklab,var(--vibeui-navbar-007-accent) 8%,transparent);
}
[data-vibeui-block="navbar-007"] [data-part="side"]{
display:flex;align-items:center;gap:0.875rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-007"] [data-part="login"]{
color:var(--vibeui-navbar-007-muted);text-decoration:none;font-size:0.875rem;font-weight:560;
white-space:nowrap;
transition:color .16s ease;
}
[data-vibeui-block="navbar-007"] [data-part="login"]:hover{color:var(--vibeui-navbar-007-ink)}
[data-vibeui-block="navbar-007"] [data-part="trial"]{display:flex;flex-direction:column;align-items:flex-end;gap:0.1875rem}
[data-vibeui-block="navbar-007"] [data-part="cta"]{
display:inline-flex;align-items:center;height:2.375rem;padding:0 1.0625rem;
border-radius:0.6875rem;background:var(--vibeui-navbar-007-accent);color:var(--vibeui-navbar-007-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:640;white-space:nowrap;
box-shadow:0 8px 18px -12px color-mix(in oklab,var(--vibeui-navbar-007-accent) 90%,black);
transition:background-color .16s ease,transform .16s ease;
}
[data-vibeui-block="navbar-007"] [data-part="cta"]:hover{
background:color-mix(in oklab,var(--vibeui-navbar-007-accent) 88%,black);transform:translateY(-1px);
}
[data-vibeui-block="navbar-007"] [data-part="note"]{
display:none;margin:0;color:var(--vibeui-navbar-007-muted);
font-size:0.6875rem;line-height:1;letter-spacing:0.01em;
}
[data-vibeui-block="navbar-007"] a:focus-visible{outline:2px solid var(--vibeui-navbar-007-accent);outline-offset:2px}
@container (min-width: 50rem){
[data-vibeui-block="navbar-007"] [data-part="shell"]{padding:0.875rem 2rem}
[data-vibeui-block="navbar-007"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-007"] [data-part="side"]{margin-left:0}
[data-vibeui-block="navbar-007"] [data-part="note"]{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar007Link[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Истории клиентов", href: "#stories" },
  { label: "Поддержка", href: "#support" },
]

/** Шапка с пробным периодом: одна кнопка, вход ссылкой и строка про карту. */
export function Navbar007({
  brand = "Ростки",
  links = DEFAULT_LINKS,
  loginLabel = "Войти",
  loginHref = "#login",
  trialLabel = "14 дней бесплатно",
  trialHref = "#trial",
  trialNote = "Карта не нужна",
  accent,
  className,
  style,
}: Navbar007Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-007" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav data-part="links" aria-label="Основная навигация">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div data-part="side">
            <a data-part="login" href={loginHref}>
              {loginLabel}
            </a>
            <div data-part="trial">
              <a data-part="cta" href={trialHref}>
                {trialLabel}
              </a>
              <p data-part="note">{trialNote}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
