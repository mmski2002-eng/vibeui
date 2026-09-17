import type { CSSProperties } from "react"

export type Footer024Link = {
  label: string
  href: string
}

export type Footer024Props = {
  /** Монограмма: «В & А». */
  monogram?: string
  names?: string
  dateLabel?: string
  place?: string
  /** Хэштег для фото гостей. */
  hashtag?: string
  links?: readonly Footer024Link[]
  /** Напоминание об ответе: «ответьте до 1 августа». */
  rsvpText?: string
  rsvpLabel?: string
  rsvpHref?: string
  /** Подпись внизу: «с любовью, В. и А.». */
  signature?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал приглашения: крупная монограмма в круге с двойной рамкой, под
// ней имена, дата и место serif'ом, хэштег капсулой, ряд якорей и
// напоминание «ответьте до…». Тонкая линия с сердечком-разделителем и
// подпись «с любовью». Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-024"]){
--vibeui-footer-024-bg:light-dark(#2b1a24,#0f0b11);
--vibeui-footer-024-fg:#f3ebe4;
--vibeui-footer-024-muted:#b3a5aa;
--vibeui-footer-024-line:rgb(243 235 228 / .14);
--vibeui-footer-024-accent:#d9784f;
--vibeui-footer-024-sand:#d9c5a5;
--vibeui-footer-024-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-footer-024-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-024"]{color-scheme:dark}
:where([data-vibeui-block="footer-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-024"]{box-sizing:border-box;display:block;background:var(--vibeui-footer-024-bg);color:var(--vibeui-footer-024-fg);font-family:var(--vibeui-footer-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="footer-024"] *{box-sizing:border-box}
[data-vibeui-block="footer-024"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-024"] a:focus-visible{outline:2px solid var(--vibeui-footer-024-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="footer-024"] [data-part="shell"]{display:grid;justify-items:center;gap:1.2rem;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 2.5rem;text-align:center}
[data-vibeui-block="footer-024"] [data-part="seal"]{position:relative;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;width:6.5rem;height:6.5rem;border:1px solid var(--vibeui-footer-024-sand);border-radius:50%;font-family:var(--vibeui-footer-024-display);font-style:italic;font-size:2.2rem;font-weight:500;color:var(--vibeui-footer-024-sand)}
[data-vibeui-block="footer-024"] [data-part="seal"]::before{content:"";position:absolute;inset:.4rem;border:1px solid var(--vibeui-footer-024-line);border-radius:50%}
[data-vibeui-block="footer-024"] [data-part="seal"] em{color:var(--vibeui-footer-024-accent);font-style:italic;margin:0 .05em}
[data-vibeui-block="footer-024"] [data-part="names"]{margin:.4rem 0 0;font-family:var(--vibeui-footer-024-display);font-style:italic;font-size:clamp(1.8rem,4cqi,2.6rem);font-weight:500;line-height:1.1}
[data-vibeui-block="footer-024"] [data-part="when"]{margin:0;font-family:var(--vibeui-footer-024-display);font-size:1.15rem;color:var(--vibeui-footer-024-muted)}
[data-vibeui-block="footer-024"] [data-part="tag"]{display:inline-flex;align-items:center;height:2.2rem;padding:0 .9rem;border:1px solid var(--vibeui-footer-024-line);border-radius:999px;font-size:.82rem;font-weight:600;letter-spacing:.02em;color:var(--vibeui-footer-024-sand);transition:border-color .25s,color .25s}
[data-vibeui-block="footer-024"] [data-part="tag"]:hover{border-color:var(--vibeui-footer-024-accent);color:var(--vibeui-footer-024-accent)}
[data-vibeui-block="footer-024"] [data-part="links"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.4rem;margin:.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="footer-024"] [data-part="links"] a{position:relative;font-family:var(--vibeui-footer-024-display);font-size:1.15rem;color:var(--vibeui-footer-024-fg);opacity:.85;transition:opacity .25s}
[data-vibeui-block="footer-024"] [data-part="links"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:1px;background:var(--vibeui-footer-024-accent);transform:scaleX(0);transition:transform .3s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="footer-024"] [data-part="links"] a:hover{opacity:1}
[data-vibeui-block="footer-024"] [data-part="links"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="footer-024"] [data-part="rsvp"]{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-footer-024-muted)}
[data-vibeui-block="footer-024"] [data-part="rsvp"] a{font-weight:600;color:var(--vibeui-footer-024-fg);border-bottom:1px solid var(--vibeui-footer-024-accent)}
[data-vibeui-block="footer-024"] [data-part="rule"]{display:flex;align-items:center;gap:1rem;width:100%;max-width:28rem;margin-top:1.5rem;color:var(--vibeui-footer-024-accent)}
[data-vibeui-block="footer-024"] [data-part="rule"]::before,[data-vibeui-block="footer-024"] [data-part="rule"]::after{content:"";flex:1;height:1px;background:var(--vibeui-footer-024-line)}
[data-vibeui-block="footer-024"] [data-part="rule"] svg{width:1rem;height:1rem;fill:currentColor}
[data-vibeui-block="footer-024"] [data-part="sign"]{margin:0;font-family:var(--vibeui-footer-024-display);font-style:italic;font-size:1.05rem;color:var(--vibeui-footer-024-muted)}
@container (min-width:56rem){
[data-vibeui-block="footer-024"] [data-part="shell"]{padding:5rem 2.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-024"] *{animation:none!important;transition:none!important}}`

/** Подвал свадебного приглашения: монограмма, имена и дата, хэштег, якоря, «ответьте до» и подпись с любовью. */
export function Footer024({
  monogram = "В & А",
  names = "Василиса и Артём",
  dateLabel = "5 сентября 2027",
  place = "усадьба Марфино",
  hashtag = "#василисаартём2027",
  links = [
    { label: "История", href: "#story" },
    { label: "Программа", href: "#program" },
    { label: "Место", href: "#place" },
    { label: "Подтвердить", href: "#rsvp" },
    { label: "Вопросы", href: "#faq" },
  ],
  rsvpText = "Ответьте, пожалуйста,",
  rsvpLabel = "до 1 августа",
  rsvpHref = "#rsvp",
  signature = "С любовью, В. и А.",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Footer024Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-024-accent": accent } : null),
    ...(background ? { "--vibeui-footer-024-bg": background } : null),
    ...style,
  } as CSSProperties
  const [left, right] = monogram.split(/\s*&\s*/)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-024" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <span data-part="seal" aria-hidden="true">
            {left}
            <em>&amp;</em>
            {right}
          </span>
          <p data-part="names">{names}</p>
          <p data-part="when">
            {dateLabel} · {place}
          </p>
          {hashtag ? (
            <a data-part="tag" href={`https://www.instagram.com/explore/tags/${hashtag.replace(/^#/, "")}/`} target="_blank" rel="noopener noreferrer">
              {hashtag}
            </a>
          ) : null}
          {links.length > 0 ? (
            <ul data-part="links">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          ) : null}
          {rsvpLabel ? (
            <p data-part="rsvp">
              {rsvpText} <a href={rsvpHref}>{rsvpLabel}</a>
            </p>
          ) : null}
          <span data-part="rule" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7.5-4.6-9.5-9A5.5 5.5 0 0 1 12 6.3 5.5 5.5 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9z" />
            </svg>
          </span>
          {signature ? <p data-part="sign">{signature}</p> : null}
        </div>
      </footer>
    </>
  )
}
