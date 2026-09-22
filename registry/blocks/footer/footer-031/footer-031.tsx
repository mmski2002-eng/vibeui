import type { CSSProperties, ComponentProps } from "react"

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

// Подвал сайта приложения: лого с «дышащей» точкой, подпись «сделано, чтобы
// вы спали», ссылки с подчёркиванием-въездом, два бейджа магазинов с цветной
// тенью, строка правовых ссылок и копирайт. Всё по центру на узком и в ряд
// на широком; ряды проявляются по прокрутке (`animation-timeline: view()`
// с фолбэком «видно всегда»).
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
[data-vibeui-block="footer-031"]{box-sizing:border-box;position:relative;overflow:clip;padding:3.5rem 0 2rem;background:var(--vibeui-footer-031-panel);color:var(--vibeui-footer-031-fg);font-family:var(--vibeui-footer-031-font);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-031"] *{box-sizing:border-box}
[data-vibeui-block="footer-031"] [data-part="legal"]{margin:0}
[data-vibeui-block="footer-031"] [data-part="links"]{margin:0}
[data-vibeui-block="footer-031"]::before{content:"";position:absolute;left:50%;bottom:-40%;width:60%;aspect-ratio:2/1;border-radius:50%;transform:translateX(-50%);background:radial-gradient(ellipse,color-mix(in oklab,var(--vibeui-footer-031-accent) 18%,transparent),transparent 70%);filter:blur(30px);pointer-events:none}
[data-vibeui-block="footer-031"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-031"] [data-part="top"]{display:grid;gap:1.5rem;align-items:center}
[data-vibeui-block="footer-031"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-weight:800;font-size:1.2rem;letter-spacing:-.02em}
[data-vibeui-block="footer-031"] [data-part="brand"] i{width:.9rem;height:.9rem;border-radius:50%;background:var(--vibeui-footer-031-accent);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-footer-031-accent) 40%,transparent);animation:vibeui-footer-031-breath 4s ease-in-out infinite}
[data-vibeui-block="footer-031"] [data-part="brand"] small{display:block;font-weight:500;font-size:.8rem;color:var(--vibeui-footer-031-muted)}
[data-vibeui-block="footer-031"] [data-part="stores"]{display:flex;gap:.5rem;flex-wrap:wrap}
[data-vibeui-block="footer-031"] [data-part="store"]{display:inline-flex;align-items:center;padding:.6rem 1rem;border-radius:.9rem;background:var(--vibeui-footer-031-fg);color:var(--vibeui-footer-031-bg);text-decoration:none;font-weight:700;font-size:.85rem;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,background .25s,color .25s}
[data-vibeui-block="footer-031"] [data-part="store"]:hover{transform:translateY(-3px);background:var(--vibeui-footer-031-accent);color:oklch(from var(--vibeui-footer-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);box-shadow:0 14px 30px -14px var(--vibeui-footer-031-accent)}
[data-vibeui-block="footer-031"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:2.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-031-line);font-size:.78rem;color:var(--vibeui-footer-031-muted)}
[data-vibeui-block="footer-031"] a:focus-visible{outline:2px solid var(--vibeui-footer-031-accent);outline-offset:2px}
@container (min-width: 56rem){[data-vibeui-block="footer-031"] [data-part="top"]{grid-template-columns:auto 1fr auto}}
@keyframes vibeui-footer-031-breath{0%,100%{transform:scale(.85)}50%{transform:scale(1.15);box-shadow:0 0 0 .5rem color-mix(in oklab,var(--vibeui-footer-031-accent) 0%,transparent)}}
@keyframes vibeui-footer-031-in{from{opacity:0;transform:translateY(1.2rem)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()){
[data-vibeui-block="footer-031"] [data-part="top"],[data-vibeui-block="footer-031"] [data-part="bottom"]{animation:vibeui-footer-031-in cubic-bezier(.2,.8,.2,1) both;animation-timeline:view();animation-range:entry 0% entry 70%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-031"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="footer-031"] [data-part="legal"]{display:flex;gap:1rem;flex-wrap:wrap;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-031"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-031"] [data-part="legal"] a:hover{color:var(--vibeui-footer-031-fg)}
[data-vibeui-block="footer-031"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-031"] [data-part="links"] a{position:relative;color:inherit;text-decoration:none;font-weight:600;opacity:.8;transition:opacity .2s}
[data-vibeui-block="footer-031"] [data-part="links"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.2rem;height:2px;border-radius:2px;background:var(--vibeui-footer-031-accent);transform:scaleX(0);transform-origin:right;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-031"] [data-part="links"] a:hover{opacity:1}
[data-vibeui-block="footer-031"] [data-part="links"] a:hover::after{transform:none;transform-origin:left}
`

export type LegalLink = {
  label: string
  href: string
}

type LegalProps = Omit<ComponentProps<"ul">, "title" | "children"> & {
  legal?: readonly LegalLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Legal({
  legal = [ { label: "Конфиденциальность", href: "#" }, { label: "Условия", href: "#" }, { label: "Поддержка", href: "#" }, ],
  accent,
  className,
  style,
  ...props
}: LegalProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <ul
        {...props}
        className={className}
        style={palette}
      >
        {legal.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
  )
}

export type LinksLink = {
  label: string
  href: string
}

type LinksProps = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly LinksLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Links({
  links = [ { label: "Что внутри", href: "#features" }, { label: "Результат", href: "#results" }, { label: "Отзывы", href: "#reviews" }, { label: "Тарифы", href: "#pricing" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: LinksProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <ul
        {...props}
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
  )
}

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
            <Links data-part="links" links={links} accent={accent} />
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
            <Legal data-part="legal" legal={legal} accent={accent} />
          </div>
        </div>
      </footer>
    </>
  )
}
