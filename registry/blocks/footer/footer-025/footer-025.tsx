import type { CSSProperties } from "react"
import { Footerlinks020 } from "@/registry/components/navigation/footerlinks-020/footerlinks-020"

export type Footer025Link = { label: string; href: string }

export type Footer025Props = {
  names?: string
  /** Рукописная строка: «¡Hasta la boda!». */
  script?: string
  from?: string
  to?: string
  dateLabel?: string
  /** Координаты пляжа — как на бортовом журнале. */
  coordinates?: string
  place?: string
  hashtag?: string
  links?: readonly Footer025Link[]
  rsvpText?: string
  rsvpLabel?: string
  rsvpHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал как низ посадочного талона на чернильно-синем: сверху линия
// отрыва с перфорацией, слева коды рейса и даты, по центру имена с
// рукописной «¡Hasta la boda!», справа координаты пляжа моноширинным;
// ниже ряд якорей, хэштег и «check-in до…». Невысокий. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-025"]){
--vibeui-footer-025-bg:light-dark(#1a1a1a,#0f0f0f);
--vibeui-footer-025-fg:#f2f2f2;
--vibeui-footer-025-muted:color-mix(in oklab,var(--vibeui-footer-025-fg) 62%,transparent);
--vibeui-footer-025-line:color-mix(in oklab,var(--vibeui-footer-025-fg) 16%,transparent);
--vibeui-footer-025-accent:#f2f2f2;
--vibeui-footer-025-sea:#2aa7a0;
--vibeui-footer-025-sun:#f2c14e;
--vibeui-footer-025-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-footer-025-script:"Lobster","Brush Script MT",cursive;
--vibeui-footer-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-025"]{color-scheme:dark}
:where([data-vibeui-block="footer-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-025"]{box-sizing:border-box;position:relative;display:block;background:var(--vibeui-footer-025-bg);color:var(--vibeui-footer-025-fg);font-family:var(--vibeui-footer-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="footer-025"] *{box-sizing:border-box}
[data-vibeui-block="footer-025"] [data-part="links"]{margin:0}
[data-vibeui-block="footer-025"]::before{content:"";position:absolute;left:0;right:0;top:-1px;height:2px;background:radial-gradient(circle,var(--vibeui-footer-025-bg) 0 2.5px,transparent 3px) 0 0/12px 2px repeat-x}
[data-vibeui-block="footer-025"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-025"] a:focus-visible{outline:2px solid var(--vibeui-footer-025-sun);outline-offset:3px;border-radius:.3rem}
[data-vibeui-block="footer-025"] [data-part="shell"]{display:grid;gap:1.25rem;max-width:80rem;margin:0 auto;padding:2.5rem 1.25rem 1.5rem}
[data-vibeui-block="footer-025"] [data-part="top"]{display:grid;gap:1.25rem;align-items:center;text-align:center}
[data-vibeui-block="footer-025"] [data-part="flight"]{display:grid;gap:.15rem;justify-items:center}
[data-vibeui-block="footer-025"] [data-part="codes"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-footer-025-display);font-size:1.6rem;font-weight:700;letter-spacing:.08em;line-height:1}
[data-vibeui-block="footer-025"] [data-part="codes"] svg{width:1.2rem;height:1.2rem;fill:var(--vibeui-footer-025-accent)}
[data-vibeui-block="footer-025"] [data-part="flight"] small{font-family:var(--vibeui-footer-025-display);font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-footer-025-muted)}
[data-vibeui-block="footer-025"] [data-part="names"]{margin:0;font-family:var(--vibeui-footer-025-display);font-size:clamp(1.6rem,4cqi,2.4rem);font-weight:700;line-height:1;text-transform:uppercase}
[data-vibeui-block="footer-025"] [data-part="script"]{display:block;margin-top:.2rem;font-family:var(--vibeui-footer-025-script);font-size:1.4rem;color:var(--vibeui-footer-025-sun)}
[data-vibeui-block="footer-025"] [data-part="coords"]{display:grid;gap:.15rem;justify-items:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.82rem;letter-spacing:.08em;color:var(--vibeui-footer-025-muted)}
[data-vibeui-block="footer-025"] [data-part="coords"] b{font-family:var(--vibeui-footer-025-display);font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-footer-025-sea)}
[data-vibeui-block="footer-025"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem 1.4rem;padding-top:1rem;border-top:1px solid var(--vibeui-footer-025-line)}
[data-vibeui-block="footer-025"] [data-part="tag"]{display:inline-flex;align-items:center;height:1.9rem;padding:0 .8rem;border:1px solid var(--vibeui-footer-025-line);border-radius:999px;font-size:.76rem;font-weight:600;letter-spacing:.02em;color:var(--vibeui-footer-025-sun);transition:border-color .25s}
[data-vibeui-block="footer-025"] [data-part="tag"]:hover{border-color:var(--vibeui-footer-025-sun)}
[data-vibeui-block="footer-025"] [data-part="rsvp"]{margin:0;font-size:.84rem;color:var(--vibeui-footer-025-muted);white-space:nowrap}
[data-vibeui-block="footer-025"] [data-part="rsvp"] a{font-weight:600;color:var(--vibeui-footer-025-fg);border-bottom:2px solid var(--vibeui-footer-025-accent)}
@container (min-width:56rem){
[data-vibeui-block="footer-025"] [data-part="shell"]{padding:2.75rem 2.5rem 1.5rem}
[data-vibeui-block="footer-025"] [data-part="top"]{grid-template-columns:1fr auto 1fr;text-align:left}
[data-vibeui-block="footer-025"] [data-part="flight"]{justify-items:start}
[data-vibeui-block="footer-025"] [data-part="coords"]{justify-items:end;text-align:right}
[data-vibeui-block="footer-025"] [data-part="bottom"]{justify-content:space-between}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-025"] *{animation:none!important;transition:none!important}}`

/** Подвал свадьбы-путешествия как низ посадочного талона: коды рейса, имена с «¡Hasta la boda!», координаты пляжа, якоря, хэштег. */
export function Footer025({
  names = "Соня & Тимур",
  script = "¡Hasta la boda!",
  from = "SVO",
  to = "HAV",
  dateLabel = "12 · 02 · 2027",
  coordinates = "21°37′28″N 81°33′46″W",
  place = "Playa Paraíso, Cayo Largo",
  hashtag = "#сонятимурлетят",
  links = [
    { label: "Маршрут", href: "#route" },
    { label: "Три дня", href: "#days" },
    { label: "Дорога", href: "#travel" },
    { label: "Check-in", href: "#checkin" },
    { label: "Вопросы", href: "#faq" },
  ],
  rsvpText = "Check-in открыт",
  rsvpLabel = "до 1 декабря",
  rsvpHref = "#checkin",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer025Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-025-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-025-fg": ink } : null),
    ...(background ? { "--vibeui-footer-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-025" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div data-part="flight">
              <span data-part="codes">
                {from}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                </svg>
                {to}
              </span>
              <small>{dateLabel}</small>
            </div>
            <div>
              <p data-part="names">{names}</p>
              {script ? <span data-part="script">{script}</span> : null}
            </div>
            <div data-part="coords">
              <b>{place}</b>
              <span>{coordinates}</span>
            </div>
          </div>
          <div data-part="bottom">
            {links.length > 0 ? (
              <Footerlinks020 data-part="links" links={links} accent={accent} />
            ) : null}
            {hashtag ? (
              <a data-part="tag" href={`https://www.instagram.com/explore/tags/${hashtag.replace(/^#/, "")}/`} target="_blank" rel="noopener noreferrer">
                {hashtag}
              </a>
            ) : null}
            {rsvpLabel ? (
              <p data-part="rsvp">
                {rsvpText} <a href={rsvpHref}>{rsvpLabel}</a>
              </p>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
