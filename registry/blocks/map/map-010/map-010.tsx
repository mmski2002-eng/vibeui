"use client"

import { useSyncExternalStore, type CSSProperties } from "react"

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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Где мы» с очередью по часам: карта в iframe с подписью-плашкой поверх,
// рядом карточка часов и столбики «сколько человек у кассы» по каждому часу
// работы — текущий час подсвечен акцентом с рукописным «сейчас». Час берётся
// у посетителя раз в полминуты; ночью — «закрыто, очереди нет».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="map-010"]){
--vibeui-map-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-010-muted:color-mix(in oklab,var(--vibeui-map-010-fg) 60%,var(--vibeui-map-010-bg));
--vibeui-map-010-panel:color-mix(in oklab,var(--vibeui-map-010-fg) 6%,var(--vibeui-map-010-bg));
--vibeui-map-010-line:color-mix(in oklab,var(--vibeui-map-010-fg) 12%,transparent);
--vibeui-map-010-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-map-010-bg) 88%,var(--vibeui-map-010-fg)));
--vibeui-map-010-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-010-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-010-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-010"]{color-scheme:dark}
:where([data-vibeui-block="map-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-010"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-map-010-bg);color:var(--vibeui-map-010-fg);font-family:var(--vibeui-map-010-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="map-010"] *{box-sizing:border-box}
[data-vibeui-block="map-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="map-010"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-map-010-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="map-010"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-map-010-accent);border-radius:2px}
[data-vibeui-block="map-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-010-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="map-010"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-map-010-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="map-010"] [data-part="grid"]{display:grid;gap:1.25rem;margin-top:2.5rem}
[data-vibeui-block="map-010"] [data-part="map"]{position:relative;min-height:22rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-map-010-panel);box-shadow:0 0 0 1px var(--vibeui-map-010-line)}
[data-vibeui-block="map-010"] [data-part="map"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.7) contrast(1.05)}
[data-vibeui-block="map-010"] [data-part="pin"]{position:absolute;left:1rem;bottom:1rem;padding:.9rem 1.1rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-map-010-card) 92%,transparent);backdrop-filter:blur(8px);box-shadow:0 10px 30px -20px rgb(0 0 0 / .6);max-width:19rem}
[data-vibeui-block="map-010"] [data-part="pin"] b{font-family:var(--vibeui-map-010-display);font-weight:600;font-size:.95rem;display:block}
[data-vibeui-block="map-010"] [data-part="pin"] span{color:var(--vibeui-map-010-muted);font-size:.86rem}
[data-vibeui-block="map-010"] [data-part="info"]{padding:1.6rem;display:grid;gap:1.2rem;align-content:start;border-radius:1.4rem;background:var(--vibeui-map-010-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="map-010"] [data-part="info"] h3{margin:0;font-family:var(--vibeui-map-010-display);font-size:1.25rem;font-weight:600;letter-spacing:-.02em}
[data-vibeui-block="map-010"] [data-part="hours"]{display:grid;gap:.4rem;font-size:.92rem}
[data-vibeui-block="map-010"] [data-part="hours"] div{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.4rem;border-bottom:1px dashed var(--vibeui-map-010-line)}
[data-vibeui-block="map-010"] [data-part="hours"] span{color:var(--vibeui-map-010-muted)}
[data-vibeui-block="map-010"] [data-part="queue"]{display:grid;gap:.6rem}
[data-vibeui-block="map-010"] [data-part="now"]{display:flex;align-items:baseline;gap:.5rem;font-size:.9rem;color:var(--vibeui-map-010-muted)}
[data-vibeui-block="map-010"] [data-part="now"] b{font-family:var(--vibeui-map-010-display);font-size:1.5rem;color:var(--vibeui-map-010-fg);font-weight:700;letter-spacing:-.03em}
[data-vibeui-block="map-010"] [data-part="bars"]{display:grid;grid-template-columns:repeat(var(--vibeui-map-010-cols),1fr);gap:.3rem;align-items:end;height:5.5rem;margin-top:1rem}
[data-vibeui-block="map-010"] [data-part="bars"] i{position:relative;display:block;height:calc(var(--vibeui-map-010-v) * 100%);min-height:.3rem;border-radius:.3rem .3rem .15rem .15rem;background:color-mix(in oklab,var(--vibeui-map-010-fg) 12%,transparent);transition:background .3s}
[data-vibeui-block="map-010"] [data-part="bars"] i[data-now="true"]{background:var(--vibeui-map-010-accent)}
[data-vibeui-block="map-010"] [data-part="bars"] i[data-now="true"]::after{content:attr(data-label);position:absolute;left:50%;top:-1.3rem;transform:translateX(-50%);font-family:var(--vibeui-map-010-hand);font-size:.95rem;color:var(--vibeui-map-010-accent);white-space:nowrap}
[data-vibeui-block="map-010"] [data-part="ticks"]{display:grid;grid-template-columns:repeat(var(--vibeui-map-010-cols),1fr);font-size:.62rem;color:var(--vibeui-map-010-muted);text-align:center;font-variant-numeric:tabular-nums}
[data-vibeui-block="map-010"] [data-part="warn"]{font-family:var(--vibeui-map-010-hand);font-size:1.25rem;color:var(--vibeui-map-010-accent);margin:0}
@container (min-width: 60rem){[data-vibeui-block="map-010"] [data-part="grid"]{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}[data-vibeui-block="map-010"] [data-part="map"]{min-height:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-010"] *{transition:none!important}}`

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
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map010Props) {
  const liveHour = useHour()
  const hour = liveHour ?? openHour + 1
  const index = hour - openHour
  const open = index >= 0 && index < queue.length
  const people = open ? queue[index] : 0
  const max = Math.max(1, ...queue)

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
      <section data-vibeui-block="map-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
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
            <div data-part="info">
              <h3>{hoursTitle}</h3>
              <div data-part="hours">
                {hours.map((line) => (
                  <div key={line.label}>
                    {line.label} <span>{line.value}</span>
                  </div>
                ))}
              </div>
              {queue.length > 0 ? (
                <div data-part="queue" aria-label="Очередь по часам">
                  <div data-part="now">
                    <b>{open ? `~${people}` : "0"}</b>
                    {open ? queueLabel : closedLabel}
                  </div>
                  <div data-part="bars" aria-hidden="true">
                    {queue.map((value, i) => (
                      <i key={i} data-now={open && i === index} data-label={nowLabel} style={{ ["--vibeui-map-010-v" as string]: value / max }} />
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
