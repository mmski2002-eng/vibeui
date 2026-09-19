import type { CSSProperties } from "react"

export type Footer031Link = {
  label: string
  href: string
}

export type Footer031Props = {
  brand?: string
  caption?: string
  links?: readonly Footer031Link[]
  appStoreLabel?: string
  appStoreHref?: string
  playLabel?: string
  playHref?: string
  legal?: readonly Footer031Link[]
  copyright?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал сайта приложения: лого с точкой, подпись «сделано, чтобы вы
// спали», ссылки, два бейджа магазинов, строка правовых ссылок и
// копирайт. Мягкие плитки, всё по центру на узком и в ряд на широком.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-031"]){
--vibeui-footer-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-031-muted:color-mix(in oklab,var(--vibeui-footer-031-fg) 60%,var(--vibeui-footer-031-bg));
--vibeui-footer-031-line:color-mix(in oklab,var(--vibeui-footer-031-fg) 12%,transparent);
--vibeui-footer-031-panel:color-mix(in oklab,var(--vibeui-footer-031-fg) 5%,var(--vibeui-footer-031-bg));
--vibeui-footer-031-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-031"]{color-scheme:dark}
:where([data-vibeui-block="footer-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-031"]{box-sizing:border-box;padding:3.5rem 0 2rem;background:var(--vibeui-footer-031-panel);color:var(--vibeui-footer-031-fg);font-family:var(--vibeui-footer-031-font);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-031"] *{box-sizing:border-box}
[data-vibeui-block="footer-031"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-031"] [data-part="top"]{display:grid;gap:1.5rem;align-items:center}
[data-vibeui-block="footer-031"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-weight:800;font-size:1.2rem;letter-spacing:-.02em}
[data-vibeui-block="footer-031"] [data-part="brand"] i{width:.9rem;height:.9rem;border-radius:50%;background:var(--vibeui-footer-031-accent)}
[data-vibeui-block="footer-031"] [data-part="brand"] small{display:block;font-weight:500;font-size:.8rem;color:var(--vibeui-footer-031-muted)}
[data-vibeui-block="footer-031"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-031"] [data-part="links"] a{color:inherit;text-decoration:none;font-weight:600;opacity:.8;transition:opacity .2s}
[data-vibeui-block="footer-031"] [data-part="links"] a:hover{opacity:1}
[data-vibeui-block="footer-031"] [data-part="stores"]{display:flex;gap:.5rem;flex-wrap:wrap}
[data-vibeui-block="footer-031"] [data-part="store"]{display:inline-flex;align-items:center;padding:.55rem .9rem;border-radius:.8rem;background:var(--vibeui-footer-031-fg);color:var(--vibeui-footer-031-bg);text-decoration:none;font-weight:700;font-size:.85rem;transition:transform .18s}
[data-vibeui-block="footer-031"] [data-part="store"]:hover{transform:translateY(-2px)}
[data-vibeui-block="footer-031"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:2.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-031-line);font-size:.78rem;color:var(--vibeui-footer-031-muted)}
[data-vibeui-block="footer-031"] [data-part="legal"]{display:flex;gap:1rem;flex-wrap:wrap;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-031"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-031"] [data-part="legal"] a:hover{color:var(--vibeui-footer-031-fg)}
[data-vibeui-block="footer-031"] a:focus-visible{outline:2px solid var(--vibeui-footer-031-accent);outline-offset:2px}
@container (min-width: 56rem){[data-vibeui-block="footer-031"] [data-part="top"]{grid-template-columns:auto 1fr auto}[data-vibeui-block="footer-031"] [data-part="links"]{justify-content:center}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-031"] *{transition:none!important}}`

/** Подвал сайта приложения с бейджами магазинов. */
export function Footer031({
  brand = "Тише",
  caption = "сделано, чтобы вы спали",
  links = [
    { label: "Что внутри", href: "#features" },
    { label: "Результат", href: "#results" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Вопросы", href: "#faq" },
  ],
  appStoreLabel = "App Store",
  appStoreHref = "#",
  playLabel = "Google Play",
  playHref = "#",
  legal = [
    { label: "Конфиденциальность", href: "#" },
    { label: "Условия", href: "#" },
    { label: "Поддержка", href: "#" },
  ],
  copyright = "© Тише, 2026",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer031Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-031-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-031-fg": ink } : null),
    ...(background ? { "--vibeui-footer-031-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-031" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-031" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div data-part="brand">
              <i aria-hidden="true" />
              <span>
                {brand}
                {caption ? <small>{caption}</small> : null}
              </span>
            </div>
            <ul data-part="links">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <div data-part="stores">
              {appStoreLabel ? (
                <a data-part="store" href={appStoreHref}>
                  {appStoreLabel}
                </a>
              ) : null}
              {playLabel ? (
                <a data-part="store" href={playHref}>
                  {playLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div data-part="bottom">
            <span>{copyright}</span>
            <ul data-part="legal">
              {legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
