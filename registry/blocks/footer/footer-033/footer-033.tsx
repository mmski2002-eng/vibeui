import type { CSSProperties } from "react"

export type Footer033Link = {
  label: string
  href: string
}

export type Footer033Column = {
  title: string
  links: readonly Footer033Link[]
}

export type Footer033Props = {
  /** Огромное слово-марка внизу. */
  wordmark?: string
  brand?: string
  tagline?: string
  columns?: readonly Footer033Column[]
  phone?: string
  phoneHref?: string
  address?: string
  hours?: string
  /** Юридическая строка. */
  legal?: string
  note?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал автосервиса: верх — бренд с шевроном, слоган, колонки ссылок и
// контакты с часами; низ — огромное слово-марка контуром (text-stroke),
// по наведению заливается акцентом снизу вверх через background-clip. Над
// маркой тонкая «шкала» из рисок, как на тюнинговом приборе. Всё на CSS.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-033"]){
--vibeui-footer-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-033-muted:color-mix(in oklab,var(--vibeui-footer-033-fg) 60%,var(--vibeui-footer-033-bg));
--vibeui-footer-033-line:color-mix(in oklab,var(--vibeui-footer-033-fg) 12%,transparent);
--vibeui-footer-033-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-033-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-033-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-033"]{color-scheme:dark}
:where([data-vibeui-block="footer-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-033"]{box-sizing:border-box;overflow:hidden;padding:4rem 0 1.5rem;background:var(--vibeui-footer-033-bg);color:var(--vibeui-footer-033-fg);font-family:var(--vibeui-footer-033-font);font-size:.95rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-033-line)}
[data-vibeui-block="footer-033"] *{box-sizing:border-box}
[data-vibeui-block="footer-033"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-033"] [data-part="top"]{display:grid;gap:2.5rem}
[data-vibeui-block="footer-033"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--vibeui-footer-033-display);font-weight:900;font-size:1.1rem;text-transform:uppercase;letter-spacing:-.01em}
[data-vibeui-block="footer-033"] [data-part="brand"] svg{width:2rem;height:2rem;color:var(--vibeui-footer-033-accent)}
[data-vibeui-block="footer-033"] [data-part="tagline"]{margin:1rem 0 0;max-width:22rem;color:var(--vibeui-footer-033-muted)}
[data-vibeui-block="footer-033"] [data-part="cols"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1.5rem}
[data-vibeui-block="footer-033"] [data-part="col"] h3{margin:0 0 .9rem;font-family:var(--vibeui-footer-033-mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-footer-033-accent)}
[data-vibeui-block="footer-033"] [data-part="col"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footer-033"] [data-part="col"] a{color:var(--vibeui-footer-033-fg);text-decoration:none;opacity:.8;transition:opacity .2s,color .2s}
[data-vibeui-block="footer-033"] [data-part="col"] a:hover{opacity:1;color:var(--vibeui-footer-033-accent)}
[data-vibeui-block="footer-033"] [data-part="contacts"]{display:grid;gap:.4rem}
[data-vibeui-block="footer-033"] [data-part="phone"]{font-family:var(--vibeui-footer-033-display);font-weight:700;font-size:1.3rem;letter-spacing:-.02em;color:var(--vibeui-footer-033-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-033"] [data-part="phone"]:hover{color:var(--vibeui-footer-033-accent)}
[data-vibeui-block="footer-033"] [data-part="contacts"] p{margin:0;color:var(--vibeui-footer-033-muted)}
[data-vibeui-block="footer-033"] [data-part="hours"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:.4rem;font-family:var(--vibeui-footer-033-mono);font-size:.75rem;color:var(--vibeui-footer-033-fg)}
[data-vibeui-block="footer-033"] [data-part="hours"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#3ddc84}
[data-vibeui-block="footer-033"] a:focus-visible{outline:2px solid var(--vibeui-footer-033-accent);outline-offset:2px}
[data-vibeui-block="footer-033"] [data-part="scale"]{position:relative;height:1.4rem;margin:3.5rem 0 0;background:repeating-linear-gradient(90deg,var(--vibeui-footer-033-line) 0 1px,transparent 1px 1.25rem);mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)}
[data-vibeui-block="footer-033"] [data-part="scale"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-footer-033-line)}
[data-vibeui-block="footer-033"] [data-part="wordmark"]{display:block;margin:.4rem 0 0;font-family:var(--vibeui-footer-033-display);font-weight:900;font-size:clamp(2.6rem,12cqi,11rem);line-height:1;letter-spacing:-.05em;text-transform:uppercase;white-space:nowrap;text-align:center;color:transparent;-webkit-text-stroke:1.5px color-mix(in oklab,var(--vibeui-footer-033-fg) 45%,transparent);background:linear-gradient(to top,var(--vibeui-footer-033-accent) 0 50%,transparent 50% 100%) 0 100%/100% 200% no-repeat;-webkit-background-clip:text;background-clip:text;transition:background-position .7s cubic-bezier(.2,.8,.2,1),-webkit-text-stroke-color .4s;user-select:none;cursor:default}
[data-vibeui-block="footer-033"] [data-part="wordmark"]:hover{background-position:0 0;-webkit-text-stroke-color:var(--vibeui-footer-033-accent)}
[data-vibeui-block="footer-033"] [data-part="bottom"]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem 1.5rem;margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-033-line);font-family:var(--vibeui-footer-033-mono);font-size:.72rem;color:var(--vibeui-footer-033-muted)}
[data-vibeui-block="footer-033"] [data-part="bottom"] p{margin:0}
@container (min-width: 40rem){[data-vibeui-block="footer-033"] [data-part="cols"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="footer-033"] [data-part="top"]{grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:4rem}[data-vibeui-block="footer-033"] [data-part="cols"]{grid-template-columns:repeat(3,minmax(0,1fr)) minmax(0,1.3fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-033"] *{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer033Column[] = [
  { title: "Услуги", links: [{ label: "Керамика", href: "#services" }, { label: "Плёнка PPF", href: "#services" }, { label: "Полировка", href: "#services" }, { label: "Химчистка", href: "#services" }] },
  { title: "Студия", links: [{ label: "До / после", href: "#results" }, { label: "Как проходит", href: "#process" }, { label: "Мастера", href: "#team" }, { label: "Отзывы", href: "#reviews" }] },
  { title: "Клиентам", links: [{ label: "Записаться", href: "#booking" }, { label: "Гарантия", href: "#" }, { label: "Памятка по уходу", href: "#" }, { label: "Подарочный сертификат", href: "#" }] },
]

/** Подвал автосервиса с огромным контурным словом-маркой. */
export function Footer033({
  wordmark = "Гараж 42",
  brand = "Гараж 42",
  tagline = "Детейлинг-студия в закрытом боксе. Керамика, плёнка, полировка, салон. Санкт-Петербург, с 2017 года.",
  columns = DEFAULT_COLUMNS,
  phone = "+7 (812) 420-42-42",
  phoneHref = "tel:+78124204242",
  address = "наб. Обводного канала, 150, корп. 3",
  hours = "Пн–Сб 9:00–21:00",
  legal = "© 2026 ООО «Гараж 42». ИНН 7805123456",
  note = "Цены на сайте — ориентир, точная фиксируется после осмотра.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer033Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-033-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-033-fg": ink } : null),
    ...(background ? { "--vibeui-footer-033-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-033" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-033" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              <span data-part="brand">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 22 16 6l12 16" />
                  <path d="M9 26h14" />
                </svg>
                {brand}
              </span>
              {tagline ? <p data-part="tagline">{tagline}</p> : null}
            </div>
            <div data-part="cols">
              {columns.map((column) => (
                <nav key={column.title} data-part="col" aria-label={column.title}>
                  <h3>{column.title}</h3>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
              <div data-part="col">
                <h3>Контакты</h3>
                <div data-part="contacts">
                  {phone ? (
                    <a data-part="phone" href={phoneHref}>
                      {phone}
                    </a>
                  ) : null}
                  {address ? <p>{address}</p> : null}
                  {hours ? <span data-part="hours">{hours}</span> : null}
                </div>
              </div>
            </div>
          </div>
          <div data-part="scale" aria-hidden="true" />
          <span data-part="wordmark" aria-hidden="true">
            {wordmark}
          </span>
          <div data-part="bottom">
            <p>{legal}</p>
            {note ? <p>{note}</p> : null}
          </div>
        </div>
      </footer>
    </>
  )
}
