"use client"

import { useSyncExternalStore, type CSSProperties } from "react"

export type Footer027Link = {
  label: string
  href: string
}

export type Footer027Column = {
  title: string
  links: readonly Footer027Link[]
}

export type Footer027Props = {
  brand?: string
  caption?: string
  columns?: readonly Footer027Column[]
  dayLabel?: string
  openLabel?: string
  closedLabel?: string
  sleepLabel?: string
  openHour?: number
  closeHour?: number
  copyright?: string
  sign?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал пекарни с «днём пекарни»: полоса рабочего дня заливается до
// текущего часа (по часам посетителя) — тёплым градиентом от корки к маслу,
// с бегунком и подписями часов под ней. Сверху словомарка и три колонки
// ссылок, внизу копирайт и рукописное «спасибо, что рано встали».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-027"]){
--vibeui-footer-027-bg:light-dark(#1a1a1a,#0f0f0f);
--vibeui-footer-027-fg:light-dark(#f2f2f2,#f2f2f2);
--vibeui-footer-027-accent:#f2f2f2;
--vibeui-footer-027-warm:#f2c94c;
--vibeui-footer-027-line:color-mix(in oklab,var(--vibeui-footer-027-fg) 10%,transparent);
--vibeui-footer-027-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-027-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-027-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-027"]{color-scheme:dark}
:where([data-vibeui-block="footer-027"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-027"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-027"]{box-sizing:border-box;background:var(--vibeui-footer-027-bg);color:var(--vibeui-footer-027-fg);padding:3.5rem 0 2rem;font-family:var(--vibeui-footer-027-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="footer-027"] *{box-sizing:border-box}
[data-vibeui-block="footer-027"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-027"] [data-part="top"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="footer-027"] [data-part="brand"]{font-family:var(--vibeui-footer-027-display);font-weight:700;font-size:2.4rem;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="footer-027"] [data-part="brand"] small{display:block;font-family:var(--vibeui-footer-027-font);font-weight:400;font-size:.9rem;letter-spacing:0;opacity:.6;margin-top:.5rem}
[data-vibeui-block="footer-027"] [data-part="cols"]{display:grid;gap:1.5rem;grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="footer-027"] [data-part="cols"] h4{margin:0 0 .6rem;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;opacity:.55;font-weight:600}
[data-vibeui-block="footer-027"] [data-part="cols"] a{display:block;color:inherit;text-decoration:none;font-size:.92rem;opacity:.85;padding:.15rem 0}
[data-vibeui-block="footer-027"] [data-part="cols"] a:hover{opacity:1;color:var(--vibeui-footer-027-warm)}
[data-vibeui-block="footer-027"] [data-part="day"]{margin-top:2.5rem}
[data-vibeui-block="footer-027"] [data-part="label"]{display:flex;justify-content:space-between;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:.6rem}
[data-vibeui-block="footer-027"] [data-part="bar"]{position:relative;height:1.4rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-footer-027-fg) 8%,transparent);margin-bottom:1.6rem}
[data-vibeui-block="footer-027"] [data-part="bar"]::before{content:"";position:absolute;inset:0;width:calc(var(--vibeui-footer-027-p) * 100%);background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-footer-027-accent) 60%,#8b4a1c),var(--vibeui-footer-027-accent) 60%,var(--vibeui-footer-027-warm));border-radius:999px;transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-027"] [data-part="bar"] i{position:absolute;top:0;bottom:0;width:1px;background:color-mix(in oklab,var(--vibeui-footer-027-fg) 18%,transparent)}
[data-vibeui-block="footer-027"] [data-part="bar"] i::after{content:attr(data-h);position:absolute;top:100%;left:0;transform:translateX(-50%);margin-top:.35rem;font-size:.62rem;opacity:.5;font-variant-numeric:tabular-nums}
[data-vibeui-block="footer-027"] [data-part="bar"] b{position:absolute;top:50%;left:calc(var(--vibeui-footer-027-p) * 100%);transform:translate(-50%,-50%);width:.9rem;height:.9rem;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgb(255 255 255 / .2);transition:left 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-027"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:3.2rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-027-line);font-size:.8rem;opacity:.6}
[data-vibeui-block="footer-027"] [data-part="sign"]{font-family:var(--vibeui-footer-027-hand);font-size:1.5rem;color:var(--vibeui-footer-027-warm)}
[data-vibeui-block="footer-027"] a:focus-visible{outline:2px solid var(--vibeui-footer-027-warm);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="footer-027"] [data-part="top"]{grid-template-columns:minmax(0,1fr) minmax(0,1.4fr)}[data-vibeui-block="footer-027"] [data-part="cols"]{grid-template-columns:repeat(3,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-027"] *{transition:none!important}}`

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

function useMinutes(): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  if (tick === null) return null
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

/** Подвал с полосой рабочего дня. */
export function Footer027({
  brand = "Корка",
  caption = "кофейня-пекарня · печём с 2019",
  columns = [
    { title: "Разделы", links: [{ label: "Витрина", href: "#shelf" }, { label: "Кофе", href: "#coffee" }, { label: "Коробка к утру", href: "#box" }, { label: "36 часов до буханки", href: "#story" }] },
    { title: "Адрес", links: [{ label: "Москва, Хамовники", href: "#where" }, { label: "во дворе у сквера", href: "#where" }, { label: "+7 000 000-00-00", href: "tel:+70000000000" }] },
    { title: "Соцсети", links: [{ label: "Телеграм-канал", href: "#" }, { label: "Утро в сторис", href: "#" }, { label: "Хлебный будильник", href: "#newsletter" }] },
  ],
  dayLabel = "день пекарни",
  openLabel = "открыто",
  closedLabel = "закрыто до утра",
  sleepLabel = "ещё спим",
  openHour = 7,
  closeHour = 21,
  copyright = "© Корка, 2026",
  sign = "спасибо, что рано встали",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer027Props) {
  const minutes = useMinutes()
  const m = minutes ?? 9 * 60
  const progress = Math.min(1, Math.max(0, (m - openHour * 60) / ((closeHour - openHour) * 60)))
  const ticks: number[] = []
  for (let hour = openHour; hour <= closeHour; hour += 2) ticks.push(hour)

  const palette = {
    "--vibeui-footer-027-p": progress,
    ...(accent ? { "--vibeui-footer-027-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-027-fg": ink } : null),
    ...(background ? { "--vibeui-footer-027-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-027" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-027" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div data-part="brand">
              {brand}
              {caption ? <small>{caption}</small> : null}
            </div>
            <div data-part="cols">
              {columns.map((column) => (
                <div key={column.title}>
                  <h4>{column.title}</h4>
                  {column.links.map((link) => (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div data-part="day" aria-label={dayLabel}>
            <div data-part="label">
              <span>{dayLabel}</span>
              <span>{progress >= 1 ? closedLabel : progress <= 0 ? sleepLabel : openLabel}</span>
            </div>
            <div data-part="bar">
              {ticks.map((hour) => (
                <i key={hour} data-h={hour} style={{ left: `${((hour - openHour) / (closeHour - openHour)) * 100}%` }} aria-hidden="true" />
              ))}
              <b aria-hidden="true" />
            </div>
          </div>
          <div data-part="bottom">
            <span>{copyright}</span>
            {sign ? <span data-part="sign">{sign}</span> : null}
          </div>
        </div>
      </footer>
    </>
  )
}
