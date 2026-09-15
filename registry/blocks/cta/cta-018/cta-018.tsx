"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Cta018Props = {
  label?: string
  /** Цена в капсуле рядом с текстом. */
  price?: string
  href?: string
  /** Подпись слева от кнопки: «старт 6 октября». */
  caption?: string
  /** Селектор секции, после которой кнопка появляется: обычно хиро. */
  showAfter?: string
  /** Селектор секции, рядом с которой кнопка прячется: обычно тарифы или финальный CTA. */
  hideNear?: string
  /** Прятать, когда докрутили до низа страницы. */
  hideAtBottom?: boolean
  /** static — кнопка в потоке страницы (для превью и документации), fixed — закреплена внизу экрана. */
  placement?: "fixed" | "static"
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плавающая кнопка записи: закреплена внизу экрана, выезжает снизу, когда
// первый экран ушёл из вида (IntersectionObserver по showAfter), и прячется,
// пока на экране блок с тарифами или финальным призывом (hideNear) — чтобы
// не дублировать кнопку рядом с ценами. Слева подпись, справа цена в
// капсуле. Без состояния, кроме видимости. Не занимает место в потоке.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-018"]){
--vibeui-cta-018-bg:light-dark(#111827,#f3f4f6);
--vibeui-cta-018-fg:light-dark(#f8fafc,#111827);
--vibeui-cta-018-muted:light-dark(rgb(248 250 252 / .65),rgb(17 24 39 / .6));
--vibeui-cta-018-accent:#4f46e5;
--vibeui-cta-018-on-accent:#ffffff;
--vibeui-cta-018-marker:#d9f99d;
--vibeui-cta-018-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-018-font:"Inter",ui-sans-serif,system-ui,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-018"]{color-scheme:dark}
:where([data-vibeui-block="cta-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-018"]{box-sizing:border-box;position:fixed;left:0;right:0;bottom:max(1rem,env(safe-area-inset-bottom));z-index:40;container-type:inline-size;display:flex;justify-content:center;padding:0 1rem;pointer-events:none;font-family:var(--vibeui-cta-018-font);font-size:.9375rem;line-height:1.4}
[data-vibeui-block="cta-018"] *{box-sizing:border-box}
[data-vibeui-block="cta-018"] [data-part="bar"]{display:flex;align-items:center;gap:1rem;max-width:100%;padding:.5rem .5rem .5rem 1.25rem;border-radius:999px;background:var(--vibeui-cta-018-bg);color:var(--vibeui-cta-018-fg);box-shadow:0 20px 50px -20px rgb(0 0 0 / .5),0 0 0 1px rgb(255 255 255 / .08);pointer-events:auto;transform:translateY(calc(100% + 2rem));opacity:0;transition:transform .55s cubic-bezier(.2,.9,.25,1),opacity .4s}
[data-vibeui-block="cta-018"][data-show="true"] [data-part="bar"]{transform:none;opacity:1}
[data-vibeui-block="cta-018"] [data-part="caption"]{display:none;font-size:.85rem;color:var(--vibeui-cta-018-muted);white-space:nowrap}
[data-vibeui-block="cta-018"] [data-part="caption"]::before{content:"";display:inline-block;width:.5rem;height:.5rem;margin-right:.5rem;border-radius:50%;background:var(--vibeui-cta-018-marker);box-shadow:0 0 0 3px rgb(217 249 157 / .25);vertical-align:.05em}
[data-vibeui-block="cta-018"] [data-part="link"]{display:inline-flex;align-items:center;gap:.6rem;height:3rem;padding:0 .4rem 0 1.25rem;border-radius:999px;background:var(--vibeui-cta-018-accent);color:var(--vibeui-cta-018-on-accent);font-weight:600;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="cta-018"] [data-part="link"]:hover{transform:translateY(-1px);box-shadow:0 14px 30px -12px var(--vibeui-cta-018-accent)}
[data-vibeui-block="cta-018"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-cta-018-marker);outline-offset:3px}
[data-vibeui-block="cta-018"] [data-part="price"]{display:inline-flex;align-items:center;height:2.2rem;padding:0 .8rem;border-radius:999px;background:rgb(255 255 255 / .18);font-family:var(--vibeui-cta-018-display);font-size:.8rem;font-weight:600;font-variant-numeric:tabular-nums}
[data-vibeui-block="cta-018"] [data-part="link"]:only-child{margin-left:0}
[data-vibeui-block="cta-018"][data-placement="static"]{position:static;padding:1.5rem 1rem;background:light-dark(#ffffff,#0f1117)}
@container (min-width: 40rem){[data-vibeui-block="cta-018"] [data-part="caption"]{display:inline}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-018"] *{transition:none!important}}`

/** Плавающая кнопка записи с ценой: появляется после первого экрана, прячется у тарифов. */
export function Cta018({
  label = "Записаться",
  price = "49 000 ₽",
  href = "#pricing",
  caption = "Старт 6 октября",
  showAfter = "#hero",
  hideNear = "#pricing, #enroll",
  hideAtBottom = true,
  placement = "fixed",
  tone = "auto",
  accent,
  className,
  style,
}: Cta018Props) {
  const [passed, setPassed] = useState(!showAfter || placement === "static")
  const [blocked, setBlocked] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const shown = passed && !blocked && !atBottom
  const palette = {
    ...(accent ? { "--vibeui-cta-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || placement === "static") return
    const gate = showAfter ? document.querySelector(showAfter) : null
    const cleanups: (() => void)[] = []
    if (!showAfter) {
      // Без порога кнопка видна сразу.
    } else if (gate) {
      const observer = new IntersectionObserver(([entry]) => setPassed(!entry.isIntersecting && entry.boundingClientRect.bottom < 0), { threshold: 0 })
      observer.observe(gate)
      cleanups.push(() => observer.disconnect())
    } else {
      const onScroll = () => setPassed(window.scrollY > window.innerHeight * 0.6)
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener("scroll", onScroll))
    }
    const near = hideNear ? Array.from(document.querySelectorAll(hideNear)) : []
    if (near.length) {
      const seen = new Set<Element>()
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => (entry.isIntersecting ? seen.add(entry.target) : seen.delete(entry.target)))
          setBlocked(seen.size > 0)
        },
        { rootMargin: "0px 0px -20% 0px", threshold: 0.05 },
      )
      near.forEach((node) => observer.observe(node))
      cleanups.push(() => observer.disconnect())
    }
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [showAfter, hideNear, placement])

  useEffect(() => {
    if (!hideAtBottom || placement === "static") return
    const onScroll = () => setAtBottom(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [hideAtBottom, placement])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-018" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="cta-018" data-tone={tone === "auto" ? undefined : tone} data-show={shown} data-placement={placement} className={className} style={palette}>
        <div data-part="bar" aria-hidden={!shown}>
          {caption ? <span data-part="caption">{caption}</span> : null}
          <a data-part="link" href={href} tabIndex={shown ? undefined : -1}>
            {label}
            {price ? <span data-part="price">{price}</span> : null}
          </a>
        </div>
      </div>
    </>
  )
}
