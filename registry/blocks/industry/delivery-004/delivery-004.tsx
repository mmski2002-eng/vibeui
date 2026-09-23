"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Delivery004Step = {
  title: string
  text: string
  /** Время в демо: «12:41». */
  time: string
  /** Через сколько миллисекунд после старта шаг включается. */
  after: number
  /** Где курьер на маршруте, 0–100. */
  progress: number
}

export type Delivery004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Delivery004Step[]
  playLabel?: string
  replayLabel?: string
  courierName?: string
  /** Статусы и значения ETA, подписи карты, сообщение курьера. */
  etaLabels?: readonly [string, string, string, string]
  etaValues?: readonly [string, string, string]
  kitchenLabel?: string
  youLabel?: string
  courierRole?: string
  courierMessage?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Трекер заказа: слева шаги с иконками — текущий подсвечен и заполняет
// свою полоску, пройденные отмечены галочкой. Справа телефон с приложением:
// кольцо прогресса с минутами до приезда, тёмная карта кварталов с маршрутом
// по улицам — курьер едет по нему через CSS offset-path, пройденный путь
// прорисовывается; снизу карточка курьера, в конце его сообщение.
// Демо стартует само, когда блок появляется на экране, и по кнопке;
// если корзина шлёт vibeui-cart:checkout — тоже.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const ROUTE = "M 52 302 L 52 236 Q 52 224 64 224 L 150 224 Q 162 224 162 212 L 162 140 Q 162 128 174 128 L 238 128 Q 250 128 250 116 L 250 80"

const STYLES = `
:where([data-vibeui-block="delivery-004"]){
--vibeui-delivery-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-004-on-accent:oklch(from var(--vibeui-delivery-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-004-muted:color-mix(in oklab,var(--vibeui-delivery-004-fg) 60%,var(--vibeui-delivery-004-bg));
--vibeui-delivery-004-line:color-mix(in oklab,var(--vibeui-delivery-004-fg) 12%,transparent);
--vibeui-delivery-004-card:color-mix(in oklab,var(--vibeui-delivery-004-fg) 5%,var(--vibeui-delivery-004-bg));
--vibeui-delivery-004-map:color-mix(in oklab,var(--vibeui-delivery-004-fg) 4%,#0c0c0d);
--vibeui-delivery-004-block:color-mix(in oklab,var(--vibeui-delivery-004-fg) 9%,#0c0c0d);
--vibeui-delivery-004-road:color-mix(in oklab,var(--vibeui-delivery-004-fg) 20%,#0c0c0d);
--vibeui-delivery-004-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-004-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-004-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-004"]{color-scheme:dark}
:where([data-vibeui-block="delivery-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-004"]{box-sizing:border-box;padding:5rem 0;overflow-x:clip;background:var(--vibeui-delivery-004-bg);color:var(--vibeui-delivery-004-fg);font-family:var(--vibeui-delivery-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="delivery-004"] *{box-sizing:border-box}
[data-vibeui-block="delivery-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="delivery-004"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-004-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-004"] [data-part="lede"]{margin:.9rem 0 0;max-width:30rem;color:var(--vibeui-delivery-004-muted)}
[data-vibeui-block="delivery-004"] [data-part="steps"]{display:grid;gap:.6rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="delivery-004"] [data-part="step"]{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:.2rem 1rem;align-items:center;padding:.95rem 1.1rem;border-radius:1.2rem;border:1px solid var(--vibeui-delivery-004-line);background:var(--vibeui-delivery-004-card);overflow:hidden;opacity:.5;transition:opacity .5s,border-color .5s,background .5s,translate .5s var(--vibeui-delivery-004-ease)}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="done"]{opacity:.85}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="now"]{opacity:1;translate:6px 0;border-color:color-mix(in oklab,var(--vibeui-delivery-004-accent) 55%,transparent);background:color-mix(in oklab,var(--vibeui-delivery-004-accent) 9%,var(--vibeui-delivery-004-card))}
[data-vibeui-block="delivery-004"] [data-part="icon"]{grid-row:span 2;display:grid;place-items:center;width:2.8rem;height:2.8rem;border-radius:.9rem;background:color-mix(in oklab,var(--vibeui-delivery-004-fg) 8%,transparent);color:var(--vibeui-delivery-004-muted);transition:background .5s,color .5s,box-shadow .5s}
[data-vibeui-block="delivery-004"] [data-part="glyph"]{width:1.35rem;height:1.35rem}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="now"] [data-part="icon"]{background:var(--vibeui-delivery-004-accent);color:var(--vibeui-delivery-004-on-accent);box-shadow:0 10px 26px -10px var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="done"] [data-part="icon"]{color:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="step-title"]{margin:0;font-weight:700;font-size:1rem}
[data-vibeui-block="delivery-004"] [data-part="step-text"]{grid-column:2 / 4;margin:0;font-size:.86rem;color:var(--vibeui-delivery-004-muted)}
[data-vibeui-block="delivery-004"] [data-part="time"]{font-size:.8rem;font-weight:600;color:var(--vibeui-delivery-004-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="delivery-004"] [data-part="step"] [data-part="bar"]{position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--vibeui-delivery-004-accent);transform-origin:left;transform:scaleX(0)}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="done"] [data-part="bar"]{transform:scaleX(1);opacity:.35}
[data-vibeui-block="delivery-004"] [data-part="step"][data-state="now"] [data-part="bar"]{animation:vibeui-delivery-004-fill var(--vibeui-delivery-004-span) linear forwards}
[data-vibeui-block="delivery-004"] [data-part="play"]{display:inline-flex;align-items:center;gap:.55rem;margin:1.4rem 0 0;padding:.3rem 0;border:0;background:none;color:var(--vibeui-delivery-004-fg);font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;border-bottom:1px solid var(--vibeui-delivery-004-line);transition:border-color .3s}
[data-vibeui-block="delivery-004"] [data-part="play"]:hover{border-color:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="play"] [data-part="glyph"]{width:1rem;height:1rem;color:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] :is(button,a):focus-visible{outline:2px solid var(--vibeui-delivery-004-accent);outline-offset:3px}
[data-vibeui-block="delivery-004"] [data-part="device"]{position:relative;width:min(100%,21rem);margin:0 auto}
[data-vibeui-block="delivery-004"] [data-part="device"]::before{content:"";position:absolute;inset:12% -18% 8%;z-index:-1;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-delivery-004-accent) 32%,transparent),transparent);filter:blur(30px)}
[data-vibeui-block="delivery-004"] [data-part="phone"]{position:relative;padding:.55rem;border-radius:3rem;background:linear-gradient(145deg,#2a2a2c,#0b0b0c 40%,#1b1b1d);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .09),0 50px 90px -40px rgb(0 0 0 / .9)}
[data-vibeui-block="delivery-004"] [data-part="screen"]{position:relative;display:flex;flex-direction:column;aspect-ratio:9/19;overflow:hidden;border-radius:2.5rem;background:#0c0c0d;color:#f6f1ea;font-size:.8rem}
[data-vibeui-block="delivery-004"] [data-part="status"]{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1.5rem .2rem;font-weight:700;font-size:.72rem}
[data-vibeui-block="delivery-004"] [data-part="island"]{position:absolute;left:50%;top:.55rem;width:5.5rem;height:1.45rem;border-radius:999px;background:#000;translate:-50% 0}
[data-vibeui-block="delivery-004"] [data-part="app"]{display:flex;align-items:center;gap:.8rem;padding:.8rem 1rem .9rem}
[data-vibeui-block="delivery-004"] [data-part="ring"]{position:relative;flex:none;width:3.6rem;height:3.6rem}
[data-vibeui-block="delivery-004"] [data-part="ring"] [data-part="glyph"]{width:100%;height:100%;rotate:-90deg}
[data-vibeui-block="delivery-004"] [data-part="ring-back"]{fill:none;stroke:rgb(255 255 255 / .1);stroke-width:4}
[data-vibeui-block="delivery-004"] [data-part="ring-fill"]{fill:none;stroke:var(--vibeui-delivery-004-accent);stroke-width:4;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-delivery-004-fill));transition:stroke-dashoffset 1.2s var(--vibeui-delivery-004-ease)}
[data-vibeui-block="delivery-004"] [data-part="ring"] b{position:absolute;inset:0;display:grid;place-content:center;font-family:var(--vibeui-delivery-004-display);font-weight:900;font-size:.95rem;font-variant-numeric:tabular-nums;text-align:center;line-height:1}
[data-vibeui-block="delivery-004"] [data-part="ring"] b small{font-family:var(--vibeui-delivery-004-font);font-weight:600;font-size:.55rem;color:rgb(246 241 234 / .6)}
[data-vibeui-block="delivery-004"] [data-part="app"] p{margin:0;display:grid;gap:.1rem}
[data-vibeui-block="delivery-004"] [data-part="app"] small{color:rgb(246 241 234 / .55);font-size:.7rem}
[data-vibeui-block="delivery-004"] [data-part="app"] strong{font-family:var(--vibeui-delivery-004-display);font-weight:700;font-size:.92rem;line-height:1.15}
[data-vibeui-block="delivery-004"] [data-part="map"]{position:relative;flex:1;min-height:0;margin:0 .6rem;border-radius:1.4rem;overflow:hidden;background:var(--vibeui-delivery-004-map)}
[data-vibeui-block="delivery-004"] [data-part="map"] > [data-part="glyph"]{position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="delivery-004"] [data-part="blocks"]{fill:var(--vibeui-delivery-004-block)}
[data-vibeui-block="delivery-004"] [data-part="park"]{fill:color-mix(in oklab,#4f8a4a 32%,#0c0c0d)}
[data-vibeui-block="delivery-004"] [data-part="river"]{fill:none;stroke:color-mix(in oklab,#3d6fa8 40%,#0c0c0d);stroke-width:18;stroke-linecap:round}
[data-vibeui-block="delivery-004"] [data-part="roads"]{fill:none;stroke:var(--vibeui-delivery-004-road);stroke-width:7;stroke-linecap:round}
[data-vibeui-block="delivery-004"] [data-part="route"]{fill:none;stroke:rgb(255 255 255 / .25);stroke-width:3;stroke-dasharray:1 7;stroke-linecap:round}
[data-vibeui-block="delivery-004"] [data-part="trail"]{fill:none;stroke:var(--vibeui-delivery-004-accent);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-delivery-004-p));filter:drop-shadow(0 0 6px var(--vibeui-delivery-004-accent));transition:stroke-dashoffset 2.8s cubic-bezier(.45,0,.25,1)}
[data-vibeui-block="delivery-004"] [data-part="kitchen"]{fill:#f6f1ea}
[data-vibeui-block="delivery-004"] [data-part="home"]{fill:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="home-pulse"]{fill:none;stroke:var(--vibeui-delivery-004-accent);stroke-width:2;transform-box:fill-box;transform-origin:center;animation:vibeui-delivery-004-pulse 2s ease-out infinite}
[data-vibeui-block="delivery-004"] [data-part="label"]{fill:rgb(246 241 234 / .7);font-family:var(--vibeui-delivery-004-font);font-weight:700;font-size:10px;letter-spacing:.06em}
[data-vibeui-block="delivery-004"] [data-part="courier"]{offset-path:path("${ROUTE}");offset-rotate:0deg;offset-distance:var(--vibeui-delivery-004-d);transition:offset-distance 2.8s cubic-bezier(.45,0,.25,1)}
[data-vibeui-block="delivery-004"] [data-part="courier-dot"]{fill:var(--vibeui-delivery-004-accent);stroke:#fff;stroke-width:2.5}
[data-vibeui-block="delivery-004"] [data-part="courier-halo"]{fill:var(--vibeui-delivery-004-accent);opacity:.25}
[data-vibeui-block="delivery-004"] [data-part="courier-icon"]{fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="delivery-004"] [data-part="sheet"]{margin:.6rem .6rem .6rem;padding:.8rem;border-radius:1.4rem;background:#18181a;display:grid;gap:.7rem}
[data-vibeui-block="delivery-004"] [data-part="courier-card"]{display:flex;align-items:center;gap:.7rem}
[data-vibeui-block="delivery-004"] [data-part="avatar"]{display:grid;place-items:center;flex:none;width:2.5rem;height:2.5rem;border-radius:50%;background:linear-gradient(135deg,var(--vibeui-delivery-004-accent),#ffb03a);color:#fff;font-weight:800;font-size:.95rem}
[data-vibeui-block="delivery-004"] [data-part="who"]{flex:1;min-width:0;display:grid;line-height:1.25}
[data-vibeui-block="delivery-004"] [data-part="who"] b{font-size:.85rem}
[data-vibeui-block="delivery-004"] [data-part="who"] small{color:rgb(246 241 234 / .55);font-size:.7rem}
[data-vibeui-block="delivery-004"] [data-part="call"]{display:grid;place-items:center;flex:none;width:2.2rem;height:2.2rem;border-radius:50%;background:rgb(255 255 255 / .08);color:#f6f1ea}
[data-vibeui-block="delivery-004"] [data-part="call"] [data-part="glyph"]{width:1rem;height:1rem}
[data-vibeui-block="delivery-004"] [data-part="chat"]{margin:0;padding:.6rem .75rem;border-radius:1rem 1rem 1rem .3rem;background:var(--vibeui-delivery-004-accent);color:var(--vibeui-delivery-004-on-accent);font-size:.76rem;line-height:1.35;transform-origin:left bottom;animation:vibeui-delivery-004-bubble .5s cubic-bezier(.3,1.5,.5,1) both}
@keyframes vibeui-delivery-004-fill{to{transform:scaleX(1)}}
@keyframes vibeui-delivery-004-pulse{from{scale:.6;opacity:.9}to{scale:2.4;opacity:0}}
@keyframes vibeui-delivery-004-bubble{from{scale:.4;opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="delivery-004"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STEPS: Delivery004Step[] = [
  { title: "Заказ принят", text: "Оплата прошла, повар видит заказ на экране.", time: "12:41", after: 300, progress: 0 },
  { title: "Готовим", text: "Котлеты на гриле, картошка в масле. Ещё 9 минут.", time: "12:43", after: 1800, progress: 0 },
  { title: "Курьер выехал", text: "Артём на скутере, термосумка, 2,3 км до вас.", time: "12:56", after: 3600, progress: 100 },
  { title: "У двери", text: "Курьер на месте. Приятного аппетита.", time: "13:07", after: 6600, progress: 100 },
]

const ICONS = [
  "M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21V3ZM10 8h4M10 12h4",
  "M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.6.7-2.7 1.5-3.5.2 1.5 1 2.2 1.8 2.2C11 8.5 11 5.5 12 3ZM6 21h12",
  "M5 17a2 2 0 1 0 0 .01M18 17a2 2 0 1 0 0 .01M7 17h9l-2-6h-3l-2 3H5M14 11V7h3l2 4",
  "M5 21V4h11v17M16 7h3v14M12 12v1.5M3 21h18",
]

/** Трекер заказа: шаги проигрываются, курьер едет по карте в телефоне. */
export function Delivery004({
  eyebrow = "Трекер",
  title = "Видно каждую минуту",
  lede = "После оплаты заказ живёт на одном экране: кто готовит, когда выехал курьер и где он сейчас. Никаких «ожидайте, с вами свяжутся».",
  steps = DEFAULT_STEPS,
  playLabel = "Показать, как это выглядит",
  replayLabel = "Ещё раз",
  courierName = "Артём",
  etaLabels = ["Ждём заказ", "Готовим", "Курьер в пути", "Доставлено"],
  etaValues = ["26 мин", "11 мин", "0 мин"],
  kitchenLabel = "КУХНЯ",
  youLabel = "ВЫ",
  courierRole = "курьер",
  courierMessage = "Я у подъезда, поднимаюсь. Заказ горячий.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Delivery004Props) {
  const [run, setRun] = useState(0)
  const [step, setStep] = useState(-1)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (run === 0) return
    const timers = steps.map((item, index) => window.setTimeout(() => setStep(index), item.after))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [run, steps])

  useEffect(() => {
    const onCheckout = () => {
      setStep(-1)
      setRun((value) => value + 1)
    }
    window.addEventListener("vibeui-cart:checkout", onCheckout)
    return () => window.removeEventListener("vibeui-cart:checkout", onCheckout)
  }, [])

  // Первый показ — сам, как только трекер заметно вошёл в экран.
  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        setRun((value) => (value === 0 ? 1 : value))
      },
      { threshold: 0.45 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const play = () => {
    setStep(-1)
    setRun((value) => value + 1)
  }

  const palette = {
    ...(accent ? { "--vibeui-delivery-004-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-004-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-004-bg": background } : null),
    ...style,
  } as CSSProperties

  const progress = step >= 0 ? (steps[step]?.progress ?? 0) / 100 : 0
  const fill = steps.length > 1 ? Math.max(0, step) / (steps.length - 1) : 0
  const finished = step === steps.length - 1
  const eta = step < 0 ? etaLabels[0] : finished ? etaLabels[3] : step >= 2 ? etaLabels[2] : etaLabels[1]
  const etaValue = step < 0 ? "—" : finished ? etaValues[2] : step >= 2 ? etaValues[1] : etaValues[0]
  const [etaNumber, ...etaRest] = etaValue.split(" ")
  const etaUnit = etaRest.join(" ")
  const nowTime = step >= 0 ? steps[step]?.time : steps[0]?.time

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="delivery-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ol data-part="steps" aria-live="polite">
              {steps.map((item, index) => {
                const next = steps[index + 1]
                const span = next ? next.after - item.after : 1000
                return (
                  <li
                    key={`${run}-${item.title}`}
                    data-part="step"
                    data-state={index < step ? "done" : index === step ? "now" : "todo"}
                    style={{ ["--vibeui-delivery-004-span" as string]: `${span}ms` }}
                  >
                    <span data-part="icon" aria-hidden="true">
                      <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={index < step ? "M5 12.5l4.5 4.5L19 7.5" : ICONS[index % ICONS.length]} />
                      </svg>
                    </span>
                    <p data-part="step-title">{item.title}</p>
                    <span data-part="time">{item.time}</span>
                    <p data-part="step-text">{item.text}</p>
                    <i data-part="bar" aria-hidden="true" />
                  </li>
                )
              })}
            </ol>
            <button data-part="play" type="button" onClick={play}>
              <svg data-part="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
              {run > 0 ? replayLabel : playLabel}
            </button>
          </div>
          <div data-part="device" aria-hidden="true">
            <div data-part="phone">
              <div data-part="screen" style={{ ["--vibeui-delivery-004-fill" as string]: fill, ["--vibeui-delivery-004-p" as string]: progress, ["--vibeui-delivery-004-d" as string]: `${progress * 100}%` } as CSSProperties}>
                <i data-part="island" />
                <div data-part="status">
                  <span>{nowTime}</span>
                  <span>5G ▮▮▮</span>
                </div>
                <div data-part="app">
                  <span data-part="ring">
                    <svg data-part="glyph" viewBox="0 0 40 40">
                      <circle data-part="ring-back" cx="20" cy="20" r="17" />
                      <circle data-part="ring-fill" cx="20" cy="20" r="17" pathLength={1} />
                    </svg>
                    <b>
                      {etaNumber}
                      {etaUnit ? <small>{etaUnit}</small> : null}
                    </b>
                  </span>
                  <p>
                    <small>{courierName}</small>
                    <strong>{eta}</strong>
                  </p>
                </div>
                <div data-part="map">
                  <svg data-part="glyph" viewBox="0 0 300 340" preserveAspectRatio="xMidYMid slice">
                    <path data-part="river" d="M-10 40 C 60 70 90 20 140 50 S 230 30 320 10" />
                    <rect data-part="park" x="186" y="150" width="54" height="56" rx="8" />
                    <g data-part="blocks">
                      <rect x="0" y="236" width="40" height="54" rx="6" />
                      <rect x="64" y="236" width="86" height="54" rx="6" />
                      <rect x="64" y="140" width="34" height="72" rx="6" />
                      <rect x="110" y="140" width="40" height="72" rx="6" />
                      <rect x="0" y="140" width="40" height="72" rx="6" />
                      <rect x="174" y="236" width="64" height="54" rx="6" />
                      <rect x="262" y="236" width="50" height="54" rx="6" />
                      <rect x="262" y="140" width="50" height="72" rx="6" />
                      <rect x="174" y="84" width="64" height="32" rx="6" />
                      <rect x="64" y="84" width="86" height="32" rx="6" />
                      <rect x="0" y="84" width="40" height="32" rx="6" />
                      <rect x="0" y="314" width="150" height="40" rx="6" />
                      <rect x="174" y="314" width="138" height="40" rx="6" />
                    </g>
                    <g data-part="roads">
                      <path d="M52 76V350M162 76V350M250 76V350M0 128H300M0 224H300M0 302H300M110 128V224" />
                    </g>
                    <path data-part="route" d={ROUTE} />
                    <path data-part="trail" d={ROUTE} pathLength={1} />
                    <rect data-part="kitchen" x="42" y="292" width="20" height="20" rx="6" />
                    <text data-part="label" x="70" y="322">{kitchenLabel}</text>
                    <circle data-part="home-pulse" cx="250" cy="72" r="8" />
                    <circle data-part="home" cx="250" cy="72" r="8" />
                    <text data-part="label" x="228" y="60" textAnchor="end">{youLabel}</text>
                    <g data-part="courier">
                      <circle data-part="courier-halo" r="20" />
                      <circle data-part="courier-dot" r="12" />
                      <path data-part="courier-icon" d="M-6 3h3l2-5h4l1 3h2M-4 5.5a2 2 0 1 0 0 .01M5 5.5a2 2 0 1 0 0 .01" />
                    </g>
                  </svg>
                </div>
                <div data-part="sheet">
                  <div data-part="courier-card">
                    <span data-part="avatar">{courierName.charAt(0)}</span>
                    <span data-part="who">
                      <b>{courierName}</b>
                      <small>{courierRole}</small>
                    </span>
                    <span data-part="call">
                      <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                      </svg>
                    </span>
                  </div>
                  {finished ? <p data-part="chat">{courierMessage}</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
