import type { CSSProperties } from "react"

type Footer004Link = {
  label: string
  href: string
}

export type Footer004Props = {
  brand?: string
  legal?: string
  links?: Footer004Link[]
  backLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Минимальный подвал в одну строку. Нужен там, где страница короткая:
// подвал на четыре колонки под лендингом из двух экранов выглядит как
// чужая деталь. Ссылка «наверх» стоит справа и на узкой раскладке не
// прячется — на длинной странице она единственный быстрый путь обратно.
const STYLES = `
:where([data-vibeui-block="footer-004"]){
--vibeui-footer-004-bg:oklch(1 0 0);
--vibeui-footer-004-ink:oklch(0.22 0.012 255);
--vibeui-footer-004-muted:oklch(0.52 0.012 255);
--vibeui-footer-004-border:oklch(0.91 0.006 255);
--vibeui-footer-004-accent:oklch(0.5 0.16 258);
--vibeui-footer-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-004"]{
display:block;background:var(--vibeui-footer-004-bg);color:var(--vibeui-footer-004-ink);
border-top:1px solid var(--vibeui-footer-004-border);
font-family:var(--vibeui-footer-004-font);
}
[data-vibeui-block="footer-004"] [data-part="shell"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
max-width:76rem;margin:0 auto;padding:1.25rem;
}
[data-vibeui-block="footer-004"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:0.9375rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="footer-004"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:999px;flex:none;background:var(--vibeui-footer-004-accent);
}
[data-vibeui-block="footer-004"] [data-part="legal"]{
margin:0;color:var(--vibeui-footer-004-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-004"] [data-part="links"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
}
[data-vibeui-block="footer-004"] [data-part="links"] a{
color:var(--vibeui-footer-004-muted);text-decoration:none;font-size:0.8125rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-004"] [data-part="links"] a:hover{color:var(--vibeui-footer-004-ink)}
[data-vibeui-block="footer-004"] [data-part="top"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-left:auto;flex:none;
color:var(--vibeui-footer-004-accent);text-decoration:none;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="footer-004"] [data-part="arrow"]{
width:0.5rem;height:0.5rem;flex:none;
border-left:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg) translate(1px,1px);
}
[data-vibeui-block="footer-004"] a:focus-visible{outline:2px solid var(--vibeui-footer-004-accent);outline-offset:3px}
@container (min-width: 40rem){
[data-vibeui-block="footer-004"] [data-part="shell"]{padding:1.375rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="footer-004"] [data-part="links"]{margin-left:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Footer004Link[] = [
  { label: "Условия", href: "#terms" },
  { label: "Конфиденциальность", href: "#privacy" },
  { label: "Контакты", href: "#contacts" },
]

/** Минимальный подвал в одну строку: бренд, копирайт, три ссылки и «наверх». */
export function Footer004({
  brand = "Полёт",
  legal = "© 2026",
  links = DEFAULT_LINKS,
  backLabel = "Наверх",
  accent,
  className,
  style,
}: Footer004Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-004" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="dot" aria-hidden="true" />
            {brand}
          </a>
          <p data-part="legal">{legal}</p>
          <nav data-part="links" aria-label="Служебные ссылки">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="top" href="#top">
            <span data-part="arrow" aria-hidden="true" />
            {backLabel}
          </a>
        </div>
      </footer>
    </>
  )
}
