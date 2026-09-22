"use client"

import { useSyncExternalStore, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
  /** Подписи кольца: минуты до партии и «печь» до открытия. */
  minutesUnit?: string
  ovenLabel?: string
  /** «достанем в {time}» под названием следующей партии. */
  outLine?: string
  batchesLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран пекарни «хлеб по часам»: слева фото витрины на всю высоту с
// рукописной пометкой, справа заголовок-гигант, слова которого поднимаются
// из-под маски как тесто (с лёгким перелётом), и живой таймер печи — кольцо
// с тёплым сиянием, внутри минуты до следующей партии, рядом лента партий
// дня. За текстом медленно поднимается жар из печи — размытые тёплые пятна,
// поверх всего зерно бумаги. Главная кнопка магнитится к курсору, карточка
// печи ловит блик под указателем. Всё считается от часов посетителя раз в
// полминуты; ночью — «тесто на расстойке».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-028"]){
--vibeui-hero-028-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-028-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-028-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-028-on-accent:oklch(from var(--vibeui-hero-028-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-028-muted:color-mix(in oklab,var(--vibeui-hero-028-fg) 60%,var(--vibeui-hero-028-bg));
--vibeui-hero-028-soft:color-mix(in oklab,var(--vibeui-hero-028-fg) 6%,var(--vibeui-hero-028-bg));
--vibeui-hero-028-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-hero-028-bg) 88%,var(--vibeui-hero-028-fg)));
--vibeui-hero-028-heat:color-mix(in oklab,var(--vibeui-hero-028-accent) 55%,#ffb36b);
--vibeui-hero-028-done:#3fa35b;
--vibeui-hero-028-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-hero-028-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-028-hand:"Caveat",cursive;
--vibeui-hero-028-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-028"]{color-scheme:dark}
:where([data-vibeui-block="hero-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-028"]{box-sizing:border-box;display:block;position:relative;overflow:clip;background:var(--vibeui-hero-028-bg);color:var(--vibeui-hero-028-fg);font-family:var(--vibeui-hero-028-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="hero-028"] *{box-sizing:border-box}
[data-vibeui-block="hero-028"] [data-part="primary"],[data-vibeui-block="hero-028"] [data-part="secondary"]{transform:translate(var(--vibeui-hero-028-mx,0px),var(--vibeui-hero-028-my,0px));transition:transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-028"] [data-part="grain"]{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.07;mix-blend-mode:multiply;background-image:${GRAIN}}
[data-vibeui-block="hero-028"] [data-part="grid"]{display:grid;grid-template-columns:1fr;min-height:calc(100svh - 4.25rem)}
[data-vibeui-block="hero-028"] [data-part="photo"]{position:relative;min-height:26rem;overflow:hidden;border-radius:0 0 1.4rem 1.4rem;background:var(--vibeui-hero-028-soft);animation:vibeui-hero-028-reveal 1.3s cubic-bezier(.7,0,.2,1) both}
[data-vibeui-block="hero-028"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:vibeui-hero-028-in 2.2s var(--vibeui-hero-028-ease) both}
[data-vibeui-block="hero-028"] [data-part="photo"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(0 0 0 / 0) 55%,rgb(0 0 0 / .38)),radial-gradient(60% 40% at 50% 100%,color-mix(in oklab,var(--vibeui-hero-028-heat) 35%,transparent),transparent 70%)}
[data-vibeui-block="hero-028"] [data-part="sticker"]{position:absolute;left:7%;bottom:12%;z-index:2;color:#fff;font-family:var(--vibeui-hero-028-hand);font-size:2.1rem;font-weight:600;transform:rotate(-6deg);text-shadow:0 2px 12px rgb(0 0 0 / .4);animation:vibeui-hero-028-pop .6s cubic-bezier(.2,1.5,.4,1) 1.1s both}
[data-vibeui-block="hero-028"] [data-part="sticker"] svg{position:absolute;left:100%;top:-1.6rem;width:5.5rem;height:4rem;stroke:#fff;fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-hero-028-draw 1.1s cubic-bezier(.4,0,.2,1) 1.5s forwards}
[data-vibeui-block="hero-028"] [data-part="copy"]{position:relative;display:flex;flex-direction:column;justify-content:center;gap:1.6rem;padding:3rem 1.25rem 3.5rem}
[data-vibeui-block="hero-028"] [data-part="copy"] > *{position:relative;z-index:1}
[data-vibeui-block="hero-028"] [data-part="heat"]{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
[data-vibeui-block="hero-028"] [data-part="heat"] i{position:absolute;bottom:-30%;left:var(--vibeui-hero-028-l);width:var(--vibeui-hero-028-s);height:var(--vibeui-hero-028-s);border-radius:50%;background:radial-gradient(closest-side,var(--vibeui-hero-028-heat),transparent 72%);filter:blur(34px);opacity:0;animation:vibeui-hero-028-heat var(--vibeui-hero-028-t) ease-in-out infinite;animation-delay:var(--vibeui-hero-028-d);will-change:transform,opacity}
[data-vibeui-block="hero-028"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-028-display);font-size:clamp(2.8rem,8cqi,6.5rem);font-weight:700;letter-spacing:-.045em;line-height:.95}
[data-vibeui-block="hero-028"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .08em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="hero-028"] [data-part="word"] i{display:inline-block;font-style:normal;transform-origin:50% 100%;animation:vibeui-hero-028-rise 1.15s var(--vibeui-hero-028-ease) both;animation-delay:calc(var(--vibeui-hero-028-n) * .14s + .15s)}
[data-vibeui-block="hero-028"] [data-part="word"][data-accent="true"] i{background:linear-gradient(110deg,var(--vibeui-hero-028-accent) 30%,var(--vibeui-hero-028-heat));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-028"] [data-part="lede"]{max-width:30rem;color:var(--vibeui-hero-028-muted);font-size:1.1rem;margin:0;animation:vibeui-hero-028-up .9s var(--vibeui-hero-028-ease) .55s both}
[data-vibeui-block="hero-028"] [data-part="oven"]{display:grid;grid-template-columns:auto 1fr;gap:1.4rem;align-items:center;padding:1.3rem 1.5rem;max-width:34rem;border-radius:1.5rem;background:radial-gradient(16rem circle at var(--vibeui-hero-028-x,50%) var(--vibeui-hero-028-y,50%),color-mix(in oklab,var(--vibeui-hero-028-accent) 12%,transparent),transparent 65%),var(--vibeui-hero-028-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 30px 60px -36px color-mix(in oklab,var(--vibeui-hero-028-accent) 45%,rgb(0 0 0 / .4)),0 1px 2px rgb(0 0 0 / .06);animation:vibeui-hero-028-up .9s var(--vibeui-hero-028-ease) .7s both}
[data-vibeui-block="hero-028"] [data-part="ringwrap"]{position:relative;width:7.5rem;height:7.5rem}
[data-vibeui-block="hero-028"] [data-part="halo"]{position:absolute;inset:-1.2rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-hero-028-heat) 70%,transparent),transparent 75%);filter:blur(10px);animation:vibeui-hero-028-breathe 3s ease-in-out infinite}
[data-vibeui-block="hero-028"] [data-part="ring"]{position:relative;width:7.5rem;height:7.5rem;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--vibeui-hero-028-accent) calc(var(--vibeui-hero-028-p) * 1turn),color-mix(in oklab,var(--vibeui-hero-028-fg) 8%,transparent) 0);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-hero-028-accent) 10%,transparent),0 10px 24px -10px color-mix(in oklab,var(--vibeui-hero-028-accent) 80%,transparent),0 0 34px -4px color-mix(in oklab,var(--vibeui-hero-028-heat) 60%,transparent);animation:vibeui-hero-028-glow 3s ease-in-out infinite}
[data-vibeui-block="hero-028"] [data-part="ring"]::before{content:"";position:absolute;inset:.55rem;border-radius:50%;background:var(--vibeui-hero-028-card);box-shadow:0 2px 6px rgb(0 0 0 / .12) inset}
[data-vibeui-block="hero-028"] [data-part="ring"]::after{content:"";position:absolute;inset:.55rem;border-radius:50%;border:2px dashed color-mix(in oklab,var(--vibeui-hero-028-fg) 12%,transparent);animation:vibeui-hero-028-spin 40s linear infinite}
[data-vibeui-block="hero-028"] [data-part="ring"] b{position:relative;font-family:var(--vibeui-hero-028-display);font-size:1.6rem;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-028"] [data-part="ring"] small{position:relative;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-028-muted);margin-top:-.1rem}
[data-vibeui-block="hero-028"] [data-part="oven"] h2{margin:0;font-family:var(--vibeui-hero-028-display);font-size:1.2rem;letter-spacing:-.01em;font-weight:600;line-height:1.1}
[data-vibeui-block="hero-028"] [data-part="oven"] p{margin:.3rem 0 0;color:var(--vibeui-hero-028-muted);font-size:.92rem}
[data-vibeui-block="hero-028"] [data-part="tag"]{display:inline-flex;align-items:center;gap:.4rem;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-hero-028-accent);font-weight:600;margin-bottom:.35rem}
[data-vibeui-block="hero-028"] [data-part="tag"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-028-accent);animation:vibeui-hero-028-pulse 2s ease-out infinite}
[data-vibeui-block="hero-028"] [data-part="batches"]{display:flex;gap:.5rem;flex-wrap:wrap;list-style:none;margin:0;padding:0}
[data-vibeui-block="hero-028"] [data-part="batches"] li{display:inline-flex;align-items:center;gap:.45rem;padding:.45rem .8rem;border-radius:999px;background:var(--vibeui-hero-028-soft);font-size:.85rem;color:var(--vibeui-hero-028-muted);font-variant-numeric:tabular-nums;white-space:nowrap;transition:translate .3s var(--vibeui-hero-028-ease);animation:vibeui-hero-028-up .7s var(--vibeui-hero-028-ease) both;animation-delay:calc(.85s + var(--vibeui-hero-028-n) * .07s)}
[data-vibeui-block="hero-028"] [data-part="batches"] li:hover{translate:0 -2px}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="done"]{color:var(--vibeui-hero-028-fg)}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="done"]::before{content:"✓";color:var(--vibeui-hero-028-done);font-weight:700}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="now"]{background:var(--vibeui-hero-028-fg);color:var(--vibeui-hero-028-bg);box-shadow:0 8px 18px -10px rgb(0 0 0 / .8)}
[data-vibeui-block="hero-028"] [data-part="batches"] li[data-state="now"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-028-accent);animation:vibeui-hero-028-pulse 2s ease-out infinite}
[data-vibeui-block="hero-028"] [data-part="actions"]{display:flex;gap:.75rem;flex-wrap:wrap;animation:vibeui-hero-028-up .9s var(--vibeui-hero-028-ease) 1.05s both}
@keyframes vibeui-hero-028-rise{0%{transform:translateY(112%) scaleY(.7)}65%{transform:translateY(-3%) scaleY(1.04)}100%{transform:none}}
@keyframes vibeui-hero-028-up{from{opacity:0;transform:translateY(1.2rem)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-028-pop{from{opacity:0;transform:rotate(-14deg) scale(.6)}to{opacity:1;transform:rotate(-6deg)}}
@keyframes vibeui-hero-028-reveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes vibeui-hero-028-in{from{transform:scale(1.14)}to{transform:none}}
@keyframes vibeui-hero-028-heat{0%{transform:translateY(0) scale(.7);opacity:0}20%{opacity:.55}60%{opacity:.4}100%{transform:translateY(-140%) scale(1.35);opacity:0}}
@keyframes vibeui-hero-028-breathe{0%,100%{transform:scale(.9);opacity:.5}50%{transform:scale(1.12);opacity:.95}}
@keyframes vibeui-hero-028-glow{0%,100%{box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-hero-028-accent) 10%,transparent),0 10px 24px -10px color-mix(in oklab,var(--vibeui-hero-028-accent) 80%,transparent),0 0 30px -6px color-mix(in oklab,var(--vibeui-hero-028-heat) 50%,transparent)}50%{box-shadow:0 0 0 7px color-mix(in oklab,var(--vibeui-hero-028-accent) 14%,transparent),0 12px 28px -10px color-mix(in oklab,var(--vibeui-hero-028-accent) 90%,transparent),0 0 46px 0 color-mix(in oklab,var(--vibeui-hero-028-heat) 75%,transparent)}}
@keyframes vibeui-hero-028-spin{to{transform:rotate(1turn)}}
@keyframes vibeui-hero-028-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-hero-028-pulse{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-028-accent) 50%,transparent)}100%{box-shadow:0 0 0 10px transparent}}
@container (min-width: 64rem){
[data-vibeui-block="hero-028"] [data-part="grid"]{grid-template-columns:minmax(0,46%) minmax(0,54%)}
[data-vibeui-block="hero-028"] [data-part="photo"]{min-height:0;border-radius:0 1.4rem 1.4rem 0}
[data-vibeui-block="hero-028"] [data-part="copy"]{padding:3rem 3rem 3rem 3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-028"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-028"] [data-part="sticker"] svg{stroke-dashoffset:0}[data-vibeui-block="hero-028"] [data-part="heat"] i{opacity:.35;transform:translateY(-60%)}[data-vibeui-block="hero-028"] [data-part="halo"]{opacity:.7}}`

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

// Пять языков жара: позиция, размер, длительность и задержка — чтобы не шли строем.
const HEAT = [
  { l: "-6%", s: "22rem", t: "9s", d: "0s" },
  { l: "28%", s: "18rem", t: "11s", d: "-4s" },
  { l: "52%", s: "26rem", t: "13s", d: "-7s" },
  { l: "74%", s: "16rem", t: "8.5s", d: "-2s" },
  { l: "16%", s: "14rem", t: "10s", d: "-9s" },
]

// Магнит: кнопка едет к курсору, но не дальше 7px, чтобы не уползать из-под него.
function magnet(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()
  const dx = event.clientX - (rect.left + rect.width / 2)
  const dy = event.clientY - (rect.top + rect.height / 2)
  element.style.setProperty("--vibeui-hero-028-mx", `${Math.max(-7, Math.min(7, dx * 0.22))}px`)
  element.style.setProperty("--vibeui-hero-028-my", `${Math.max(-7, Math.min(7, dy * 0.22))}px`)
}

function unmagnet(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--vibeui-hero-028-mx")
  event.currentTarget.style.removeProperty("--vibeui-hero-028-my")
}

function spotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--vibeui-hero-028-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--vibeui-hero-028-y", `${event.clientY - rect.top}px`)
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
  minutesUnit = "мин",
  ovenLabel = "печь",
  outLine = "достанем в {time}",
  batchesLabel = "Партии дня",
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
        <div data-part="grain" aria-hidden="true" />
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
            <div data-part="heat" aria-hidden="true">
              {HEAT.map((blob, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--vibeui-hero-028-l": blob.l,
                      "--vibeui-hero-028-s": blob.s,
                      "--vibeui-hero-028-t": blob.t,
                      "--vibeui-hero-028-d": blob.d,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <h1 data-part="title">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-part="word" data-accent={index === words.length - 1} style={{ ["--vibeui-hero-028-n" as string]: index }}>
                    <i>{word}</i>
                  </span>
                  {index < words.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="oven" aria-live="polite" onPointerMove={spotlight}>
              <div data-part="ringwrap">
                <i data-part="halo" aria-hidden="true" />
                <div data-part="ring" style={{ ["--vibeui-hero-028-p" as string]: progress }}>
                  {baking ? (
                    <>
                      <b>{times[nextIndex] - m}</b>
                      <small>{minutesUnit}</small>
                    </>
                  ) : (
                    <>
                      <b>{String(ovenHour).padStart(2, "0")}:00</b>
                      <small>{ovenLabel}</small>
                    </>
                  )}
                </div>
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
                      {batches[nextIndex].note ? `${batches[nextIndex].note} · ` : ""}
                      {outLine.replace("{time}", batches[nextIndex].time)}
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
            <ol data-part="batches" aria-label={batchesLabel}>
              {batches.map((batch, index) => (
                <li key={batch.time} data-state={times[index] <= m ? "done" : baking && index === nextIndex ? "now" : "next"} style={{ ["--vibeui-hero-028-n" as string]: index }}>
                  {batch.time} {batch.name.toLowerCase()}
                </li>
              ))}
            </ol>
            <div data-part="actions">
              {primaryLabel ? (
                <Button016
                  data-part="primary"
                  size="lg"
                  onPointerMove={magnet}
                  onPointerLeave={unmagnet}
                  label={primaryLabel}
                  href={primaryHref}
                  external={false}
                  tone="accent"
                  accent={accent}
                />
              ) : null}
              {secondaryLabel ? (
                <Button016
                  data-part="secondary"
                  size="lg"
                  onPointerMove={magnet}
                  onPointerLeave={unmagnet}
                  label={secondaryLabel}
                  href={secondaryHref}
                  external={false}
                  tone="neutral"
                  accent={accent}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
