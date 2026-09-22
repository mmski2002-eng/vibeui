import type { CSSProperties } from "react"
import { Footerlinks027 } from "@/registry/components/navigation/footerlinks-027/footerlinks-027"

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
// эфира». Словомарка заливается акцентом слева направо по мере прокрутки
// к низу страницы — scroll-driven через `animation-timeline: view()` и
// зарегистрированную `@property`, без JS, с фолбэком «залита всегда»;
// при наведении вспыхивает целиком. Карточка ведущей и колонки въезжают
// каскадом, сама словомарка поднимается из-под маски.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
@property --vibeui-footer-028-x{syntax:"<percentage>";inherits:true;initial-value:100%}
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
--vibeui-footer-028-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-028"]{color-scheme:dark}
:where([data-vibeui-block="footer-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-028"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0 2rem;background:var(--vibeui-footer-028-bg);color:var(--vibeui-footer-028-fg);font-family:var(--vibeui-footer-028-font);font-size:.95rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-028-line)}
[data-vibeui-block="footer-028"] *{box-sizing:border-box}
[data-vibeui-block="footer-028"]::before{content:"";position:absolute;left:50%;bottom:-40%;width:80%;aspect-ratio:2/1;translate:-50% 0;border-radius:50%;background:radial-gradient(ellipse,color-mix(in oklab,var(--vibeui-footer-028-accent) 14%,transparent),transparent 65%);filter:blur(50px);pointer-events:none}
[data-vibeui-block="footer-028"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-028"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="footer-028"] [data-part="host"]{position:relative;display:grid;grid-template-columns:5.5rem 1fr;gap:1.2rem;align-items:center;padding:1.3rem;border-radius:1.3rem;background:var(--vibeui-footer-028-panel);box-shadow:0 0 0 1px var(--vibeui-footer-028-line);overflow:hidden;transition:transform .4s var(--vibeui-footer-028-ease),box-shadow .4s}
[data-vibeui-block="footer-028"] [data-part="host"]::before{content:"";position:absolute;right:-4rem;top:-4rem;width:10rem;height:10rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-footer-028-accent) 25%,transparent),transparent 70%);filter:blur(12px);pointer-events:none}
[data-vibeui-block="footer-028"] [data-part="host"]:hover{transform:translateY(-.25rem);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-footer-028-accent) 50%,transparent),0 30px 50px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="footer-028"] [data-part="host"] img{position:relative;width:5.5rem;height:5.5rem;border-radius:1rem;object-fit:cover;display:block;filter:grayscale(.4);transition:filter .5s,transform .6s var(--vibeui-footer-028-ease)}
[data-vibeui-block="footer-028"] [data-part="host"]:hover img{filter:none;transform:rotate(-3deg) scale(1.04)}
[data-vibeui-block="footer-028"] [data-part="host"] > div{position:relative}
[data-vibeui-block="footer-028"] [data-part="host"] b{display:block;font-family:var(--vibeui-footer-028-display);font-weight:700;font-size:1.6rem;line-height:1;text-transform:uppercase}
[data-vibeui-block="footer-028"] [data-part="host"] small{display:block;font-family:var(--vibeui-footer-028-mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-footer-028-accent);margin:.3rem 0}
[data-vibeui-block="footer-028"] [data-part="host"] p{margin:0;font-size:.86rem;color:var(--vibeui-footer-028-muted)}
[data-vibeui-block="footer-028"] [data-part="cols"]{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
[data-vibeui-block="footer-028"] [data-part="rss"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.8rem;font-family:var(--vibeui-footer-028-mono);font-size:.78rem;color:var(--vibeui-footer-028-accent);text-decoration:none}
[data-vibeui-block="footer-028"] [data-part="rss"] i{font-style:normal;display:inline-block;animation:vibeui-footer-028-wiggle 2.4s ease-in-out infinite}
[data-vibeui-block="footer-028"] [data-part="markwrap"]{margin:3.5rem 0 0;overflow:hidden;padding:.1em 0 .08em}
[data-vibeui-block="footer-028"] [data-part="mark"]{font-family:var(--vibeui-footer-028-display);font-weight:800;font-size:clamp(4.6rem,19cqi,15.5rem);line-height:.85;text-transform:uppercase;letter-spacing:-.01em;white-space:nowrap;background:linear-gradient(90deg,var(--vibeui-footer-028-accent) 0 var(--vibeui-footer-028-x),color-mix(in oklab,var(--vibeui-footer-028-fg) 18%,transparent) var(--vibeui-footer-028-x));-webkit-background-clip:text;background-clip:text;color:transparent;transition:--vibeui-footer-028-x .4s var(--vibeui-footer-028-ease);cursor:default}
[data-vibeui-block="footer-028"] [data-part="mark"]:hover{--vibeui-footer-028-x:100%!important}
[data-vibeui-block="footer-028"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-028-line);font-family:var(--vibeui-footer-028-mono);font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-footer-028-muted)}
[data-vibeui-block="footer-028"] a:focus-visible{outline:2px solid var(--vibeui-footer-028-accent);outline-offset:3px}
@keyframes vibeui-footer-028-wiggle{0%,100%{translate:0 0}50%{translate:0 -2px}}
@keyframes vibeui-footer-028-up{from{opacity:0;translate:0 1.6rem}}
@keyframes vibeui-footer-028-rise{from{translate:0 105%}}
@keyframes vibeui-footer-028-fill{from{--vibeui-footer-028-x:0%}to{--vibeui-footer-028-x:100%}}
@supports (animation-timeline: view()){
[data-vibeui-block="footer-028"] [data-part="host"]{animation:vibeui-footer-028-up linear both;animation-timeline:view();animation-range:entry 0% entry 50%}
[data-vibeui-block="footer-028"] [data-part="mark"]{animation:vibeui-footer-028-rise linear both,vibeui-footer-028-fill linear both;animation-timeline:view();animation-range:entry 0% entry 70%,entry 40% entry 100%}
}
@container (min-width: 56rem){[data-vibeui-block="footer-028"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:3rem}[data-vibeui-block="footer-028"] [data-part="cols"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-028"] *{transition:none!important;animation:none!important}}`

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
              <Footerlinks027 data-part="col" title={platformsLabel} links={(rssLabel ? [...platforms, { label: "∿ " + rssLabel, href: rssHref }] : platforms)} accent={accent} />
              <Footerlinks027 data-part="col" title={linksLabel} links={links} accent={accent} />
            </div>
          </div>
          <div data-part="markwrap" aria-hidden="true">
            <div data-part="mark">{brand}</div>
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
