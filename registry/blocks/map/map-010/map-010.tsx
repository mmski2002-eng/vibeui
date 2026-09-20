"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react"

export type Map010Hours = {
  label: string
  value: string
}

export type Map010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Адрес iframe карты (Яндекс, Google, OSM). Пусто — серая подложка. */
  mapSrc?: string
  mapTitle?: string
  pinTitle?: string
  pinText?: string
  hoursTitle?: string
  hours?: readonly Map010Hours[]
  /** Условная очередь по часам работы: людей у кассы в каждый час, начиная с openHour. */
  queue?: readonly number[]
  openHour?: number
  queueLabel?: string
  closedLabel?: string
  nowLabel?: string
  /** Рукописная подсказка внизу; {before} и {after} — до и после часа `warnHour`. */
  warnBefore?: string
  warnAfter?: string
  warnHour?: number
  /** aria диаграммы очереди. */
  chartLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Где мы» с очередью по часам: карта в iframe с подписью-плашкой поверх
// (плашка чуть покачивается, карта по наведению оживает цветом), рядом
// карточка часов и столбики «сколько человек у кассы» по каждому часу
// работы — когда секция попадает в кадр, столбики вырастают один за другим,
// число у кассы докручивается, текущий час подсвечен акцентом с рукописным
// «сейчас» и пульсирует. Карточка ловит блик под курсором. Час берётся у
// посетителя раз в полминуты; ночью — «закрыто, очереди нет».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="map-010"]){
--vibeui-map-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-010-muted:color-mix(in oklab,var(--vibeui-map-010-fg) 60%,var(--vibeui-map-010-bg));
--vibeui-map-010-panel:color-mix(in oklab,var(--vibeui-map-010-fg) 6%,var(--vibeui-map-010-bg));
--vibeui-map-010-line:color-mix(in oklab,var(--vibeui-map-010-fg) 12%,transparent);
--vibeui-map-010-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-map-010-bg) 88%,var(--vibeui-map-010-fg)));
--vibeui-map-010-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-map-010-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-010-hand:"Caveat",cursive;
--vibeui-map-010-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-010"]{color-scheme:dark}
:where([data-vibeui-block="map-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-010"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-map-010-bg);color:var(--vibeui-map-010-fg);font-family:var(--vibeui-map-010-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="map-010"] *{box-sizing:border-box}
[data-vibeui-block="map-010"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="map-010"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-map-010-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="map-010"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-map-010-accent);border-radius:2px}
[data-vibeui-block="map-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-010-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="map-010"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="map-010"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
[data-vibeui-block="map-010"][data-shown="true"] [data-part="word"] i{animation:vibeui-map-010-rise .9s var(--vibeui-map-010-ease) both;animation-delay:calc(var(--vibeui-map-010-n) * .09s)}
[data-vibeui-block="map-010"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-map-010-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="map-010"] [data-part="lede"],[data-vibeui-block="map-010"] [data-part="map"],[data-vibeui-block="map-010"] [data-part="info"]{opacity:0;translate:0 1.5rem}
[data-vibeui-block="map-010"][data-shown="true"] [data-part="lede"]{animation:vibeui-map-010-in .8s var(--vibeui-map-010-ease) .3s both}
[data-vibeui-block="map-010"][data-shown="true"] [data-part="map"]{animation:vibeui-map-010-in .9s var(--vibeui-map-010-ease) .35s both}
[data-vibeui-block="map-010"][data-shown="true"] [data-part="info"]{animation:vibeui-map-010-in .9s var(--vibeui-map-010-ease) .5s both}
[data-vibeui-block="map-010"] [data-part="grid"]{display:grid;gap:1.25rem;margin-top:2.5rem}
[data-vibeui-block="map-010"] [data-part="map"]{position:relative;min-height:22rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-map-010-panel);box-shadow:0 0 0 1px var(--vibeui-map-010-line),0 30px 60px -40px rgb(0 0 0 / .5)}
[data-vibeui-block="map-010"] [data-part="map"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.55) contrast(1.05);transition:filter .7s}
[data-vibeui-block="map-010"] [data-part="map"]:hover iframe{filter:saturate(1) contrast(1)}
[data-vibeui-block="map-010"] [data-part="pin"]{position:absolute;left:1rem;bottom:1rem;padding:.9rem 1.1rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-map-010-card) 92%,transparent);backdrop-filter:blur(8px);box-shadow:0 10px 30px -20px rgb(0 0 0 / .6),0 0 0 1px rgb(255 255 255 / .5) inset;max-width:19rem;animation:vibeui-map-010-float 5s ease-in-out infinite}
[data-vibeui-block="map-010"] [data-part="pin"] b{font-family:var(--vibeui-map-010-display);font-weight:600;font-size:.95rem;display:flex;align-items:center;gap:.4rem}
[data-vibeui-block="map-010"] [data-part="pin"] b::before{content:"";width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-map-010-accent);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-map-010-accent) 50%,transparent);animation:vibeui-map-010-pulse 2.2s ease-out infinite}
[data-vibeui-block="map-010"] [data-part="pin"] span{color:var(--vibeui-map-010-muted);font-size:.86rem}
[data-vibeui-block="map-010"] [data-part="info"]{position:relative;padding:1.6rem;display:grid;gap:1.2rem;align-content:start;border-radius:1.4rem;background:radial-gradient(18rem circle at var(--vibeui-map-010-x,50%) var(--vibeui-map-010-y,0%),color-mix(in oklab,var(--vibeui-map-010-accent) 10%,transparent),transparent 65%),var(--vibeui-map-010-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="map-010"] [data-part="info"] h3{margin:0;font-family:var(--vibeui-map-010-display);font-size:1.25rem;font-weight:600;letter-spacing:-.02em}
[data-vibeui-block="map-010"] [data-part="hours"]{display:grid;gap:.4rem;font-size:.92rem}
[data-vibeui-block="map-010"] [data-part="hours"] div{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.4rem;border-bottom:1px dashed var(--vibeui-map-010-line)}
[data-vibeui-block="map-010"] [data-part="hours"] span{color:var(--vibeui-map-010-muted)}
[data-vibeui-block="map-010"] [data-part="queue"]{display:grid;gap:.6rem}
[data-vibeui-block="map-010"] [data-part="now"]{display:flex;align-items:baseline;gap:.5rem;font-size:.9rem;color:var(--vibeui-map-010-muted)}
[data-vibeui-block="map-010"] [data-part="now"] b{font-family:var(--vibeui-map-010-display);font-size:1.8rem;color:var(--vibeui-map-010-fg);font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="map-010"] [data-part="bars"]{display:grid;grid-template-columns:repeat(var(--vibeui-map-010-cols),1fr);gap:.3rem;align-items:end;height:5.5rem;margin-top:1rem}
[data-vibeui-block="map-010"] [data-part="bars"] i{position:relative;display:block;height:calc(var(--vibeui-map-010-v) * 100%);min-height:.3rem;border-radius:.3rem .3rem .15rem .15rem;background:color-mix(in oklab,var(--vibeui-map-010-fg) 12%,transparent);transform:scaleY(0);transform-origin:bottom;transition:background .3s,transform .3s var(--vibeui-map-010-ease)}
[data-vibeui-block="map-010"][data-shown="true"] [data-part="bars"] i{animation:vibeui-map-010-grow .8s cubic-bezier(.2,1.4,.4,1) both;animation-delay:calc(.6s + var(--vibeui-map-010-i) * .05s)}
[data-vibeui-block="map-010"] [data-part="bars"] i:hover{background:color-mix(in oklab,var(--vibeui-map-010-fg) 28%,transparent)}
[data-vibeui-block="map-010"] [data-part="bars"] i[data-now="true"]{background:var(--vibeui-map-010-accent);box-shadow:0 0 18px -2px color-mix(in oklab,var(--vibeui-map-010-accent) 70%,transparent)}
[data-vibeui-block="map-010"] [data-part="bars"] i[data-now="true"]::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--vibeui-map-010-accent);animation:vibeui-map-010-beam 2.2s ease-out infinite}
[data-vibeui-block="map-010"] [data-part="bars"] i[data-now="true"]::after{content:attr(data-label);position:absolute;left:50%;top:-1.3rem;transform:translateX(-50%);font-family:var(--vibeui-map-010-hand);font-size:.95rem;color:var(--vibeui-map-010-accent);white-space:nowrap}
[data-vibeui-block="map-010"] [data-part="ticks"]{display:grid;grid-template-columns:repeat(var(--vibeui-map-010-cols),1fr);font-size:.62rem;color:var(--vibeui-map-010-muted);text-align:center;font-variant-numeric:tabular-nums}
[data-vibeui-block="map-010"] [data-part="warn"]{font-family:var(--vibeui-map-010-hand);font-size:1.25rem;color:var(--vibeui-map-010-accent);margin:0}
@keyframes vibeui-map-010-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-map-010-in{from{opacity:0;translate:0 1.5rem}to{opacity:1;translate:0 0}}
@keyframes vibeui-map-010-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes vibeui-map-010-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-.35rem)}}
@keyframes vibeui-map-010-pulse{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-map-010-accent) 50%,transparent)}100%{box-shadow:0 0 0 10px transparent}}
@keyframes vibeui-map-010-beam{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.6,1.1)}}
@container (min-width: 60rem){[data-vibeui-block="map-010"] [data-part="grid"]{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}[data-vibeui-block="map-010"] [data-part="map"]{min-height:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-010"] *{animation:none!important;transition:none!important}[data-vibeui-block="map-010"] [data-part="word"] i{transform:none}[data-vibeui-block="map-010"] [data-part="lede"],[data-vibeui-block="map-010"] [data-part="map"],[data-vibeui-block="map-010"] [data-part="info"]{opacity:1;translate:none}[data-vibeui-block="map-010"] [data-part="bars"] i{transform:none}}`

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

function useHour(): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 30000), () => null)
  return tick === null ? null : new Date().getHours()
}

function spotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--vibeui-map-010-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--vibeui-map-010-y", `${event.clientY - rect.top}px`)
}

/** Карта с часами и очередью по часам. */
export function Map010({
  eyebrow = "Где мы",
  title = "Семь минут от Парка культуры",
  lede = "Хамовники, тихий двор, вход с улицы. Рядом парковка на десять минут — ровно столько, чтобы забрать коробку.",
  mapSrc = "",
  mapTitle = "Карта",
  pinTitle = "Корка · Хамовники",
  pinText = "Москва, во дворе у сквера. Ориентир — красная дверь и запах хлеба.",
  hoursTitle = "Часы",
  hours = [
    { label: "Будни", value: "7:00 — 21:00" },
    { label: "Выходные", value: "8:00 — 21:00" },
    { label: "Коробки к утру", value: "с 7:30" },
  ],
  queue = [6, 9, 7, 4, 3, 5, 6, 4, 2, 2, 3, 4, 5, 3],
  openHour = 7,
  queueLabel = "человек у кассы сейчас",
  closedLabel = "закрыто, очереди нет",
  nowLabel = "сейчас",
  warnBefore = "хлеб заканчивается к 14:00 — приходите до",
  warnAfter = "хлеб на сегодня почти разобрали — завтра с семи",
  warnHour = 14,
  chartLabel = "Очередь по часам",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map010Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [counted, setCounted] = useState(0)
  const liveHour = useHour()
  const hour = liveHour ?? openHour + 1
  const index = hour - openHour
  const open = index >= 0 && index < queue.length
  const people = open ? queue[index] : 0
  const max = Math.max(1, ...queue)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Число у кассы докручивается от нуля, когда секция показана.
  useEffect(() => {
    if (!shown) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setCounted(people), 0)
      return () => window.clearTimeout(id)
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start - 500) / 900)
      const eased = t <= 0 ? 0 : 1 - Math.pow(1 - t, 3)
      setCounted(Math.round(people * eased))
      if (t < 1) raf = window.requestAnimationFrame(step)
    }
    raf = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(raf)
  }, [shown, people])

  const palette = {
    "--vibeui-map-010-cols": queue.length,
    ...(accent ? { "--vibeui-map-010-accent": accent } : null),
    ...(ink ? { "--vibeui-map-010-fg": ink } : null),
    ...(background ? { "--vibeui-map-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-010" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="map-010" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, position, all) => (
              <span key={`${word}-${position}`}>
                <span data-part="word" style={{ ["--vibeui-map-010-n" as string]: position }}>
                  <i>{word}</i>
                </span>
                {position < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="map">
              {mapSrc ? <iframe src={mapSrc} title={mapTitle} loading="lazy" allowFullScreen /> : null}
              {pinTitle ? (
                <div data-part="pin">
                  <b>{pinTitle}</b>
                  {pinText ? <span>{pinText}</span> : null}
                </div>
              ) : null}
            </div>
            <div data-part="info" onPointerMove={spotlight}>
              <h3>{hoursTitle}</h3>
              <div data-part="hours">
                {hours.map((line) => (
                  <div key={line.label}>
                    {line.label} <span>{line.value}</span>
                  </div>
                ))}
              </div>
              {queue.length > 0 ? (
                <div data-part="queue" aria-label={chartLabel}>
                  <div data-part="now">
                    <b>{open ? `~${shown ? counted : people}` : "0"}</b>
                    {open ? queueLabel : closedLabel}
                  </div>
                  <div data-part="bars" aria-hidden="true">
                    {queue.map((value, i) => (
                      <i key={i} data-now={open && i === index} data-label={nowLabel} style={{ ["--vibeui-map-010-v" as string]: value / max, ["--vibeui-map-010-i" as string]: i }} />
                    ))}
                  </div>
                  <div data-part="ticks" aria-hidden="true">
                    {queue.map((_, i) => (
                      <span key={i}>{i % 2 === 0 ? openHour + i : ""}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {warnBefore ? <p data-part="warn">{hour < warnHour ? warnBefore : warnAfter}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
