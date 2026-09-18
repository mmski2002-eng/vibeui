"use client"

import { useState, useSyncExternalStore, type CSSProperties } from "react"

export type Contact021Link = {
  label: string
  href: string
  /** Ник или подпись справа: «@danya». */
  handle?: string
}

export type Contact021Props = {
  eyebrow?: string
  title?: string
  text?: string
  email?: string
  copyLabel?: string
  copiedLabel?: string
  /** Обещание: «отвечу в течение дня». */
  promise?: string
  city?: string
  timeZone?: string
  links?: readonly Contact021Link[]
  image?: string
  imageAlt?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Напишите мне»: адрес почты — огромной ссылкой, при клике копируется
// (Clipboard API) и на две секунды показывает «скопировано»; рядом живое
// местное время города и обещание «отвечу в течение дня», список соцсетей с
// никами, справа фото. Без формы — люди пишут туда, где уже сидят.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-021"]){
--vibeui-contact-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-021-on-accent:oklch(from var(--vibeui-contact-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-021-muted:color-mix(in oklab,var(--vibeui-contact-021-fg) 60%,var(--vibeui-contact-021-bg));
--vibeui-contact-021-line:color-mix(in oklab,var(--vibeui-contact-021-fg) 12%,transparent);
--vibeui-contact-021-panel:color-mix(in oklab,var(--vibeui-contact-021-fg) 5%,var(--vibeui-contact-021-bg));
--vibeui-contact-021-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-021-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-021-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-021"]{color-scheme:dark}
:where([data-vibeui-block="contact-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-021"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-contact-021-panel);color:var(--vibeui-contact-021-fg);font-family:var(--vibeui-contact-021-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-021"] *{box-sizing:border-box}
[data-vibeui-block="contact-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="contact-021"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-contact-021-mono);font-size:.78rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-021-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.04em}
[data-vibeui-block="contact-021"] [data-part="text"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="mail"]{position:relative;display:inline-block;margin-top:1.8rem;font-family:var(--vibeui-contact-021-display);font-weight:800;font-size:clamp(1.4rem,4.4cqi,3rem);letter-spacing:-.04em;line-height:1;color:inherit;text-decoration:none;border:0;background:none;padding:0 0 .2rem;cursor:pointer;border-bottom:3px solid var(--vibeui-contact-021-accent);transition:color .2s;word-break:break-all;text-align:left;font-family:var(--vibeui-contact-021-display)}
[data-vibeui-block="contact-021"] [data-part="mail"]:hover{color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="mail"] span{position:absolute;left:0;top:calc(100% + .6rem);padding:.3rem .6rem;border-radius:6px;background:var(--vibeui-contact-021-fg);color:var(--vibeui-contact-021-bg);font-family:var(--vibeui-contact-021-mono);font-size:.7rem;letter-spacing:.06em;opacity:0;transform:translateY(-.2rem);transition:opacity .2s,transform .2s;pointer-events:none;white-space:nowrap}
[data-vibeui-block="contact-021"] [data-part="mail"][data-done="true"] span{opacity:1;transform:none;background:var(--vibeui-contact-021-accent);color:var(--vibeui-contact-021-on-accent)}
[data-vibeui-block="contact-021"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.6rem 1.4rem;margin:2.2rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-contact-021-mono);font-size:.75rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="meta"] b{font-weight:500;color:var(--vibeui-contact-021-fg)}
[data-vibeui-block="contact-021"] [data-part="links"]{display:grid;gap:0;margin:1.6rem 0 0;padding:0;list-style:none;border-top:1px solid var(--vibeui-contact-021-line)}
[data-vibeui-block="contact-021"] [data-part="links"] a{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 0;border-bottom:1px solid var(--vibeui-contact-021-line);color:inherit;text-decoration:none;font-weight:500;transition:padding-left .25s,color .2s}
[data-vibeui-block="contact-021"] [data-part="links"] a:hover{padding-left:.5rem;color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="links"] span{font-family:var(--vibeui-contact-021-mono);font-size:.78rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="pic"]{aspect-ratio:1;max-width:24rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-contact-021-line);transform:rotate(2deg);transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="contact-021"] [data-part="pic"]:hover{transform:rotate(0) scale(1.02)}
[data-vibeui-block="contact-021"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="contact-021"] button:focus-visible,[data-vibeui-block="contact-021"] a:focus-visible{outline:2px solid var(--vibeui-contact-021-accent);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="contact-021"] [data-part="shell"]{grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr);gap:4rem}[data-vibeui-block="contact-021"] [data-part="pic"]{justify-self:end}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-021"] *{transition:none!important}}`

const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((fn) => fn()), 30000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function useTime(timeZone: string): string | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  if (tick === null) return null
  try {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date())
  } catch {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date())
  }
}

/** Контакт личного сайта: почта копируется кликом, местное время, соцсети. */
export function Contact021({
  eyebrow = "контакт",
  title = "Есть задача? Напишите",
  text = "Без форм и менеджеров: письмо или сообщение — и созвонимся на этой неделе. Беру два проекта одновременно, не больше.",
  email = "hi@lunev.design",
  copyLabel = "нажмите — скопируется",
  copiedLabel = "скопировано",
  promise = "отвечу в течение дня",
  city = "Тбилиси",
  timeZone = "Asia/Tbilisi",
  links = [
    { label: "Телеграм", href: "#", handle: "@lunev" },
    { label: "GitHub", href: "#", handle: "danyalunev" },
    { label: "Behance", href: "#", handle: "lunev" },
    { label: "LinkedIn", href: "#", handle: "danya-lunev" },
  ],
  image = "",
  imageAlt = "",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact021Props) {
  const [copied, setCopied] = useState(false)
  const time = useTime(timeZone)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-contact-021-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-021-fg": ink } : null),
    ...(background ? { "--vibeui-contact-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {text ? <p data-part="text">{text}</p> : null}
            <button type="button" data-part="mail" data-done={copied} onClick={copy} aria-label={`${email} — ${copyLabel}`}>
              {email}
              <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
            </button>
            <ul data-part="meta">
              {city ? (
                <li>
                  {city} · <b>{time ?? "--:--"}</b>
                </li>
              ) : null}
              {promise ? (
                <li>
                  <b>{promise}</b>
                </li>
              ) : null}
            </ul>
            {links.length > 0 ? (
              <ul data-part="links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>
                      {link.label}
                      {link.handle ? <span>{link.handle}</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {image ? (
            <div data-part="pic">
              <img src={image} alt={imageAlt} loading="lazy" />
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
