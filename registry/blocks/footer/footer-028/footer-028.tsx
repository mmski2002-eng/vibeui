import type { CSSProperties } from "react"

export type Footer028Link = {
  label: string
  href: string
}

export type Footer028Props = {
  brand?: string
  caption?: string
  /** Ведущая: имя, роль, портрет. */
  hostName?: string
  hostRole?: string
  hostImage?: string
  hostText?: string
  platformsLabel?: string
  platforms?: readonly Footer028Link[]
  linksLabel?: string
  links?: readonly Footer028Link[]
  rssLabel?: string
  rssHref?: string
  copyright?: string
  sign?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал подкаста: огромная словомарка на всю ширину узким гротеском, слева
// карточка ведущей с портретом и двумя строками, справа платформы и разделы,
// ссылка на RSS моноширинным «∿ rss», внизу копирайт и «до следующего
// эфира». Словомарка при наведении подсвечивается акцентом по буквам через
// background-clip — без JS.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-028"]){
--vibeui-footer-028-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-028-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-028-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-028-muted:color-mix(in oklab,var(--vibeui-footer-028-fg) 60%,var(--vibeui-footer-028-bg));
--vibeui-footer-028-panel:color-mix(in oklab,var(--vibeui-footer-028-fg) 6%,var(--vibeui-footer-028-bg));
--vibeui-footer-028-line:color-mix(in oklab,var(--vibeui-footer-028-fg) 12%,transparent);
--vibeui-footer-028-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-footer-028-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-028-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-028"]{color-scheme:dark}
:where([data-vibeui-block="footer-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-028"]{box-sizing:border-box;padding:4rem 0 2rem;background:var(--vibeui-footer-028-bg);color:var(--vibeui-footer-028-fg);font-family:var(--vibeui-footer-028-font);font-size:.95rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-028-line)}
[data-vibeui-block="footer-028"] *{box-sizing:border-box}
[data-vibeui-block="footer-028"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-028"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="footer-028"] [data-part="host"]{display:grid;grid-template-columns:5rem 1fr;gap:1rem;align-items:center;padding:1.2rem;border-radius:1.2rem;background:var(--vibeui-footer-028-panel)}
[data-vibeui-block="footer-028"] [data-part="host"] img{width:5rem;height:5rem;border-radius:1rem;object-fit:cover;display:block}
[data-vibeui-block="footer-028"] [data-part="host"] b{display:block;font-family:var(--vibeui-footer-028-display);font-weight:700;font-size:1.4rem;line-height:1;text-transform:uppercase}
[data-vibeui-block="footer-028"] [data-part="host"] small{display:block;font-family:var(--vibeui-footer-028-mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-footer-028-accent);margin:.3rem 0}
[data-vibeui-block="footer-028"] [data-part="host"] p{margin:0;font-size:.86rem;color:var(--vibeui-footer-028-muted)}
[data-vibeui-block="footer-028"] [data-part="cols"]{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
[data-vibeui-block="footer-028"] [data-part="cols"] h4{margin:0 0 .6rem;font-family:var(--vibeui-footer-028-mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-028-muted)}
[data-vibeui-block="footer-028"] [data-part="cols"] a{display:block;color:inherit;text-decoration:none;padding:.15rem 0;opacity:.85;transition:opacity .2s,color .2s}
[data-vibeui-block="footer-028"] [data-part="cols"] a:hover{opacity:1;color:var(--vibeui-footer-028-accent)}
[data-vibeui-block="footer-028"] [data-part="rss"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.8rem;font-family:var(--vibeui-footer-028-mono);font-size:.78rem;color:var(--vibeui-footer-028-accent);text-decoration:none}
[data-vibeui-block="footer-028"] [data-part="mark"]{margin:3rem 0 0;font-family:var(--vibeui-footer-028-display);font-weight:800;font-size:clamp(4rem,19cqi,15rem);line-height:.85;text-transform:uppercase;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;background:linear-gradient(90deg,var(--vibeui-footer-028-accent) 0 var(--vibeui-footer-028-x,0%),color-mix(in oklab,var(--vibeui-footer-028-fg) 18%,transparent) var(--vibeui-footer-028-x,0%));-webkit-background-clip:text;background-clip:text;color:transparent;transition:color .3s}
[data-vibeui-block="footer-028"] [data-part="mark"]:hover{background:var(--vibeui-footer-028-accent);-webkit-background-clip:text;background-clip:text}
[data-vibeui-block="footer-028"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-028-line);font-family:var(--vibeui-footer-028-mono);font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-footer-028-muted)}
[data-vibeui-block="footer-028"] a:focus-visible{outline:2px solid var(--vibeui-footer-028-accent);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="footer-028"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:3rem}[data-vibeui-block="footer-028"] [data-part="cols"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-028"] *{transition:none!important}}`

/** Подвал подкаста с огромной словомаркой и карточкой ведущей. */
export function Footer028({
  brand = "Тихий час",
  caption = "подкаст о том, как люди работают",
  hostName = "Вера Ильина",
  hostRole = "ведущая и продюсер",
  hostImage = "",
  hostText = "Записываю по средам, монтирую ночью, публикую в четверг. Пишите, если есть человек, которого стоит послушать.",
  platformsLabel = "Слушать",
  platforms = [
    { label: "Яндекс Музыка", href: "#" },
    { label: "Apple Podcasts", href: "#" },
    { label: "Spotify", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  linksLabel = "Разделы",
  links = [
    { label: "Эпизоды", href: "#episodes" },
    { label: "Гости", href: "#guests" },
    { label: "Поддержать", href: "#support" },
    { label: "Письмо", href: "#letter" },
  ],
  rssLabel = "rss-лента",
  rssHref = "#",
  copyright = "© Тихий час, 2026",
  sign = "до следующего эфира",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer028Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-028-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-028-fg": ink } : null),
    ...(background ? { "--vibeui-footer-028-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-028" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-028" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div data-part="host">
              {hostImage ? <img src={hostImage} alt={hostName} /> : <span />}
              <div>
                <b>{hostName}</b>
                {hostRole ? <small>{hostRole}</small> : null}
                {hostText ? <p>{hostText}</p> : null}
              </div>
            </div>
            <div data-part="cols">
              <div>
                <h4>{platformsLabel}</h4>
                {platforms.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
                {rssLabel ? (
                  <a data-part="rss" href={rssHref}>
                    ∿ {rssLabel}
                  </a>
                ) : null}
              </div>
              <div>
                <h4>{linksLabel}</h4>
                {links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div data-part="mark" aria-hidden="true">
            {brand}
          </div>
          <div data-part="bottom">
            <span>
              {copyright}
              {caption ? ` · ${caption}` : ""}
            </span>
            {sign ? <span>{sign}</span> : null}
          </div>
        </div>
      </footer>
    </>
  )
}
