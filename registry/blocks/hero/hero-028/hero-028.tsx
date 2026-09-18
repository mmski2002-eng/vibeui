"use client"

import { useSyncExternalStore, type CSSProperties } from "react"

export type Hero028Batch = {
  /** Время выхода из печи «07:00». */
  time: string
  name: string
  note?: string
}

export type Hero028Props = {
  image?: string
  imageAlt?: string
  /** Рукописная пометка на фото: «горячий!». Пусто — без неё. */
  sticker?: string
  /** Заголовок по словам: последнее — акцентом. */
  words?: readonly string[]
  lede?: string
  batches?: readonly Hero028Batch[]
  /** Час, когда включается печь. */
  ovenHour?: number
  bakingLabel?: string
  nightLabel?: string
  nightTitle?: string
  nightText?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран пекарни «хлеб по часам»: слева фото витрины на всю высоту с
// рукописной пометкой, справа заголовок, который «поднимается» как тесто, и
// живой таймер печи — кольцо, внутри минуты до следующей партии, рядом лента
// партий дня: прошедшие с галочкой, текущая пульсирует, будущие серые. Всё
// считается от часов посетителя раз в полминуты; ночью — «тесто на расстойке».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-028"]){
--vibeui-hero-028-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-028-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-028-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-028-on-accent:oklch(from var(--vibeui-hero-028-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-028-muted:color-mix(in oklab,var(--vibeui-hero-028-fg) 60%,var(--vibeui-hero-028-bg));
--vibeui-hero-028-soft:color-mix(in oklab,var(--vibeui-hero-028-fg) 6%,var(--vibeui-hero-028-bg));
--vibeui-hero-028-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-hero-028-bg) 88%,var(--vibeui-hero-028-fg)));
--vibeui-hero-028-done:#3fa35b;
--vibeui-hero-028-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-028-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-028-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-028"]{color-scheme:dark}
:where([data-vibeui-block="hero-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-028"]{box-sizing:border-box;display:block;background:var(--vibeui-hero-028-bg);color:var(--vibeui-hero-028-fg);font-family:var(--vibeui-hero-028-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="hero-028"] *{box-sizing:border-box}
[data-vibeui-block="hero-028"] [data-part="grid"]{display:grid;grid-template-columns:1fr;min-height:calc(100svh - 4.25rem)}
[data-vibeui-block="hero-028"] [data-part="photo"]{position:relative;min-height:26rem;overflow:hidden;border-radius:0 0 1.4rem 1.4rem;background:var(--vibeui-hero-028-soft)}
[data-vibeui-block="hero-028"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:vibeui-hero-028-in 1.6s cubic-bezier(.2,.7,.2,1) both}
[data-vibeui-block="hero-028"] [data-part="photo"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(0 0 0 / 0) 55%,rgb(0 0 0 / .35))}
[data-vibeui-block="hero-028"] [data-part="sticker"]{position:absolute;left:7%;bottom:12%;z-index:2;color:#fff;font-family:var(--vibeui-hero-028-hand);font-size:1.9rem;font-weight:600;transform:rotate(-6deg);text-shadow:0 2px 12px rgb(0 0 0 / .4)}
[data-vibeui-block="hero-028"] [data-part="sticker"] svg{position:absolute;left:100%;top:-1.6rem;width:5.5rem;height:4rem;stroke:#fff;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-hero-028-draw 1.1s cubic-bezier(.4,0,.2,1) 1s forwards}
[data-vibeui-block="hero-028"] [data-part="copy"]{display:flex;flex-direction:column;justify-content:center;gap:1.6rem;padding:3rem 1.25rem 3.5rem}
[data-vibeui-block="hero-028"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-028-display);font-size:clamp(2.6rem,7cqi,5.4rem);font-weight:700;letter-spacing:-.04em;line-height:.98;overflow:hidden}
[data-vibeui-block="hero-028"] [data-part="title"] span{display:inline-block;transform-origin:bottom;animation:vibeui-hero-028-rise .9s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-hero-028-n) * .12s)}
[data-vibeui-block="hero-028"] [data-part="title"] span:last-child{color:var(--vibeui-hero-028-accent)}
[data-vibeui-block="hero-028"] [data-part="lede"]{max-width:30rem;color:var(--vibeui-hero-028-muted);font-size:1.08rem;margin:0}
[data-vibeui-block="hero-028"] [data-part="oven"]{display:grid;grid-template-columns:auto 1fr;gap:1.25rem;align-items:center;padding:1.25rem 1.4rem;max-width:34rem;border-radius:1.4rem;background:var(--vibeui-hero-028-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="hero-028"] [data-part="ring"]{position:relative;width:7.5rem;height:7.5rem;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--vibeui-hero-028-accent) calc(var(--vibeui-hero-028-p) * 1turn),color-mix(in oklab,var(--vibeui-hero-028-fg) 8%,transparent) 0);box-shadow:0 8px 18px -10px color-mix(in oklab,var(--vibeui-hero-028-accent) 60%,transparent)}
[data-vibeui-block="hero-028"] [data-part="ring"]::before{content:"";position:absolute;inset:.55rem;border-radius:50%;background:var(--vibeui-hero-028-card);box-shadow:0 2px 6px rgb(0 0 0 / .12) inset}
[data-vibeui-block="hero-028"] [data-part="ring"]::after{content:"";position:absolute;inset:.55rem;border-radius:50%;border:2px dashed color-mix(in oklab,var(--vibeui-hero-028-fg) 12%,transparent);animation:vibeui-hero-028-spin 40s linear infinite}
[data-vibeui-block="hero-028"] [data-part="ring"] b{position:relative;font-family:var(--vibeui-hero-028-display);font-size:1.5rem;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-028"] [data-part="ring"] small{position:relative;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-028-muted);margin-top:-.1rem}
[data-vibeui-block="hero-028"] [data-part="oven"] h2{margin:0;font-family:var(--vibeui-hero-028-display);font-size:1.15rem;letter-spacing:-.01em;font-weight:600;line-height:1.1}
[data-vibeui-block="hero-028"] [data-part="oven"] p{margin:.3rem 0 0;color:var(--vibeui-hero-028-muted);font-size:.92rem}
[data-vibeui-block="hero-028"] [data-part="tag"]{display:inline-flex;align-items:center;gap:.4rem;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-hero-028-accent);font-weight:600;margin-bottom:.35rem}
[data-vibeui-block="hero-028"] [data-part="tag"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-028-accent);animation:vibeui-hero-028-pulse 2s ease-out infinite}
[data-vibeui-block="hero-028"] [data-part="batches"]{display:flex;gap:.5rem;flex-wrap:wrap;list-style:none;margin:0;padding:0}
[data-vibeui-block="hero-028"] [data-part="batches"] li{display:inline-flex;align-items:center;gap:.45rem;padding:.45rem .8rem;border-radius:999px;background:var(--vibeui-hero-028-soft);font-size:.85rem;color:var(--vibeui-hero-028-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="done"]{color:var(--vibeui-hero-028-fg)}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="done"]::before{content:"✓";color:var(--vibeui-hero-028-done);font-weight:700}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="now"]{background:var(--vibeui-hero-028-fg);color:var(--vibeui-hero-028-bg);box-shadow:0 8px 18px -10px rgb(0 0 0 / .8)}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="now"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-028-accent);animation:vibeui-hero-028-pulse 2s ease-out infinite}
[data-vibeui-block="hero-028"] [data-part="actions"]{display:flex;gap:.75rem;flex-wrap:wrap}
[data-vibeui-block="hero-028"] [data-part="primary"],[data-vibeui-block="hero-028"] [data-part="secondary"]{display:inline-flex;align-items:center;border-radius:999px;padding:.95rem 1.5rem;font-weight:600;font-size:.95rem;text-decoration:none;transition:transform .18s,filter .18s}
[data-vibeui-block="hero-028"] [data-part="primary"]{color:var(--vibeui-hero-028-on-accent);background:var(--vibeui-hero-028-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-hero-028-accent) 70%,transparent),0 2px 4px rgb(0 0 0 / .12)}
[data-vibeui-block="hero-028"] [data-part="secondary"]{color:var(--vibeui-hero-028-fg);background:var(--vibeui-hero-028-soft);box-shadow:0 1px 0 rgb(255 255 255 / .6) inset,0 2px 4px rgb(0 0 0 / .08)}
[data-vibeui-block="hero-028"] [data-part="primary"]:hover,[data-vibeui-block="hero-028"] [data-part="secondary"]:hover{transform:translateY(-1px);filter:brightness(1.04)}
[data-vibeui-block="hero-028"] [data-part="primary"]:active,[data-vibeui-block="hero-028"] [data-part="secondary"]:active{transform:translateY(1px) scale(.985)}
[data-vibeui-block="hero-028"] a:focus-visible{outline:2px solid var(--vibeui-hero-028-accent);outline-offset:3px}
@keyframes vibeui-hero-028-rise{from{transform:scaleY(.6) translateY(40%);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-hero-028-in{from{transform:scale(1.08)}to{transform:none}}
@keyframes vibeui-hero-028-spin{to{transform:rotate(1turn)}}
@keyframes vibeui-hero-028-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-hero-028-pulse{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-028-accent) 50%,transparent)}100%{box-shadow:0 0 0 10px transparent}}
@container (min-width: 64rem){
[data-vibeui-block="hero-028"] [data-part="grid"]{grid-template-columns:minmax(0,46%) minmax(0,54%)}
[data-vibeui-block="hero-028"] [data-part="photo"]{min-height:0;border-radius:0 1.4rem 1.4rem 0}
[data-vibeui-block="hero-028"] [data-part="copy"]{padding:3rem 3rem 3rem 3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-028"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-028"] [data-part="sticker"] svg{stroke-dashoffset:0}}`

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

const toMinutes = (time: string) => {
  const [h, m = 0] = time.split(":").map(Number)
  return h * 60 + m
}

const DEFAULT_BATCHES: Hero028Batch[] = [
  { time: "07:00", name: "Круассаны", note: "первая партия, 40 шт." },
  { time: "08:30", name: "Тартин на закваске", note: "36 часов, как положено" },
  { time: "11:00", name: "Булочки с корицей", note: "с глазурью, пока тёплые" },
  { time: "13:00", name: "Фокачча с розмарином", note: "к обеду, режем на месте" },
  { time: "15:00", name: "Ржаной", note: "тёмная корка, тмин" },
  { time: "17:00", name: "Багеты", note: "к ужину, последний хлеб дня" },
]

/** Первый экран пекарни: живой таймер печи и лента партий дня. */
export function Hero028({
  image = "",
  imageAlt = "",
  sticker = "горячий!",
  words = ["Хлеб", "по", "часам"],
  lede = "Замешиваем вечером, печём в пять утра, достаём партиями весь день. Сайт показывает, что в печи прямо сейчас, — чтобы вы приходили к горячему.",
  batches = DEFAULT_BATCHES,
  ovenHour = 5,
  bakingLabel = "Сейчас в печи",
  nightLabel = "Ночь в пекарне",
  nightTitle = "Тихо, тесто поднимается",
  nightText = "тесто на расстойке · печь в 05:00",
  primaryLabel = "Собрать коробку к утру",
  primaryHref = "#box",
  secondaryLabel = "Что на полке",
  secondaryHref = "#shelf",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero028Props) {
  const minutes = useMinutes()
  const times = batches.map((batch) => toMinutes(batch.time))
  // До гидрации — за 14 минут до первой партии: разметка совпадает на сервере и клиенте.
  const m = minutes ?? (times[0] ?? 7 * 60) - 14
  const nextIndex = times.findIndex((time) => time > m)
  const baking = nextIndex >= 0 && m >= ovenHour * 60
  const previous = nextIndex <= 0 ? ovenHour * 60 : times[nextIndex - 1]
  const progress = baking ? (m - previous) / Math.max(1, times[nextIndex] - previous) : Math.min(1, ((m + 24 * 60 - 18 * 60) % (24 * 60)) / (11 * 60))

  const palette = {
    ...(accent ? { "--vibeui-hero-028-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-028-fg": ink } : null),
    ...(background ? { "--vibeui-hero-028-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-028" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-028" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="grid">
          <div data-part="photo">
            {image ? <img src={image} alt={imageAlt} /> : null}
            {sticker ? (
              <div data-part="sticker" aria-hidden="true">
                {sticker}
                <svg viewBox="0 0 90 60" aria-hidden="true">
                  <path pathLength="1" d="M4 40 C 30 52, 60 40, 78 14 M 66 12 L 80 12 L 78 26" />
                </svg>
              </div>
            ) : null}
          </div>
          <div data-part="copy">
            <h1 data-part="title">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} style={{ ["--vibeui-hero-028-n" as string]: index }}>
                  {word}
                  {index < words.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="oven" aria-live="polite">
              <div data-part="ring" style={{ ["--vibeui-hero-028-p" as string]: progress }}>
                {baking ? (
                  <>
                    <b>{times[nextIndex] - m}</b>
                    <small>мин</small>
                  </>
                ) : (
                  <>
                    <b>{String(ovenHour).padStart(2, "0")}:00</b>
                    <small>печь</small>
                  </>
                )}
              </div>
              <div>
                <div data-part="tag">
                  <i aria-hidden="true" />
                  {baking ? bakingLabel : nightLabel}
                </div>
                {baking ? (
                  <>
                    <h2>{batches[nextIndex].name}</h2>
                    <p>
                      {batches[nextIndex].note ? `${batches[nextIndex].note} · ` : ""}достанем в {batches[nextIndex].time}
                    </p>
                  </>
                ) : (
                  <>
                    <h2>{nightTitle}</h2>
                    <p>{nightText}</p>
                  </>
                )}
              </div>
            </div>
            <ol data-part="batches" aria-label="Партии дня">
              {batches.map((batch, index) => (
                <li key={batch.time} data-state={times[index] <= m ? "done" : baking && index === nextIndex ? "now" : "next"}>
                  {batch.time} {batch.name.toLowerCase()}
                </li>
              ))}
            </ol>
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
