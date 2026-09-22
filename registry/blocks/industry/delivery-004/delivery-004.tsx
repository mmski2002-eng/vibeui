"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Card084 } from "@/registry/components/card/card-084/card-084"

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

// Трекер заказа: слева четыре статуса с вертикальной линией, которая
// заполняется по мере прохождения, справа карточка-«телефон» с картой —
// маршрут от кухни до дома и курьер, который едет по кривой через CSS
// offset-path (offset-distance переезжает с transition). Шаги
// проигрываются по кнопке «показать» таймерами: принят → готовим →
// курьер выехал → у двери; в конце сообщение от курьера. Если корзина
// шлёт vibeui-cart:checkout, демо стартует само.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const ROUTE = "M 36 214 C 70 214 84 150 130 150 C 176 150 180 96 226 96 C 258 96 270 60 284 46"

const STYLES = `
:where([data-vibeui-block="delivery-004"]){
--vibeui-delivery-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-004-on-accent:oklch(from var(--vibeui-delivery-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-004-on-fg:oklch(from var(--vibeui-delivery-004-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-004-muted:color-mix(in oklab,var(--vibeui-delivery-004-fg) 62%,var(--vibeui-delivery-004-bg));
--vibeui-delivery-004-line:color-mix(in oklab,var(--vibeui-delivery-004-fg) 14%,transparent);
--vibeui-delivery-004-card:color-mix(in oklab,var(--vibeui-delivery-004-fg) 6%,var(--vibeui-delivery-004-bg));
--vibeui-delivery-004-street:color-mix(in oklab,var(--vibeui-delivery-004-fg) 10%,transparent);
--vibeui-delivery-004-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-004-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-004"]{color-scheme:dark}
:where([data-vibeui-block="delivery-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-004"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-delivery-004-bg);color:var(--vibeui-delivery-004-fg);font-family:var(--vibeui-delivery-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="delivery-004"] *{box-sizing:border-box}
[data-vibeui-block="delivery-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="delivery-004"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-004-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-004"] [data-part="lede"]{margin:.8rem 0 0;max-width:30rem;color:var(--vibeui-delivery-004-muted)}
[data-vibeui-block="delivery-004"] [data-part="play"]{display:inline-flex;align-items:center;gap:.6rem;margin:1.4rem 0 0;height:3.2rem;padding:0 1.4rem 0 1rem;border-radius:999px;border:0;background:var(--vibeui-delivery-004-accent);color:var(--vibeui-delivery-004-on-accent);font:inherit;font-weight:800;font-size:.95rem;cursor:pointer;transition:transform .18s cubic-bezier(.2,.8,.2,1),box-shadow .2s}
[data-vibeui-block="delivery-004"] [data-part="play"]:hover{transform:translateY(-2px);box-shadow:0 14px 34px -12px var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="play"]:focus-visible{outline:2px solid var(--vibeui-delivery-004-fg);outline-offset:2px}
[data-vibeui-block="delivery-004"] [data-part="play"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="delivery-004"] [data-part="steps"]{position:relative;display:grid;gap:1.2rem;margin:2rem 0 0;padding:0 0 0 2.2rem;list-style:none}
[data-vibeui-block="delivery-004"] [data-part="steps"]::before,[data-vibeui-block="delivery-004"] [data-part="steps"]::after{content:"";position:absolute;left:.65rem;top:.6rem;bottom:.6rem;width:2px;border-radius:2px;background:var(--vibeui-delivery-004-line)}
[data-vibeui-block="delivery-004"] [data-part="steps"]::after{background:var(--vibeui-delivery-004-accent);transform:scaleY(var(--vibeui-delivery-004-fill));transform-origin:top;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-004"] [data-part="phone"]{position:relative;width:min(100%,24rem);margin:0 auto;padding:.7rem;border-radius:2.2rem;background:var(--vibeui-delivery-004-fg);color:var(--vibeui-delivery-004-on-fg);box-shadow:0 40px 80px -30px rgb(0 0 0 / .7)}
[data-vibeui-block="delivery-004"] [data-part="screen"]{position:relative;overflow:hidden;border-radius:1.6rem;background:var(--vibeui-delivery-004-bg);color:var(--vibeui-delivery-004-fg)}
[data-vibeui-block="delivery-004"] [data-part="screen"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="delivery-004"] [data-part="grid"]{stroke:var(--vibeui-delivery-004-street);stroke-width:6;stroke-linecap:round}
[data-vibeui-block="delivery-004"] [data-part="route"]{fill:none;stroke:var(--vibeui-delivery-004-line);stroke-width:4;stroke-dasharray:2 8;stroke-linecap:round}
[data-vibeui-block="delivery-004"] [data-part="trail"]{fill:none;stroke:var(--vibeui-delivery-004-accent);stroke-width:4;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-delivery-004-p));transition:stroke-dashoffset 2.6s cubic-bezier(.4,0,.2,1)}
[data-vibeui-block="delivery-004"] [data-part="pin"]{fill:var(--vibeui-delivery-004-fg)}
[data-vibeui-block="delivery-004"] [data-part="pin-label"]{fill:var(--vibeui-delivery-004-muted);font-family:var(--vibeui-delivery-004-font);font-weight:700;font-size:11px;letter-spacing:.04em}
[data-vibeui-block="delivery-004"] [data-part="courier"]{offset-path:path("${ROUTE}");offset-rotate:0deg;offset-distance:var(--vibeui-delivery-004-d);transition:offset-distance 2.6s cubic-bezier(.4,0,.2,1)}
[data-vibeui-block="delivery-004"] [data-part="courier"] circle{fill:var(--vibeui-delivery-004-accent)}
[data-vibeui-block="delivery-004"] [data-part="courier"] path{fill:none;stroke:var(--vibeui-delivery-004-on-accent);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="delivery-004"] [data-part="courier"][data-moving="true"]{animation:vibeui-delivery-004-wobble .5s ease-in-out infinite}
[data-vibeui-block="delivery-004"] [data-part="eta"]{position:absolute;left:.9rem;top:.9rem;right:.9rem;display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.6rem .9rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-delivery-004-bg) 88%,transparent);backdrop-filter:blur(10px);border:1px solid var(--vibeui-delivery-004-line);font-size:.82rem;font-weight:600}
[data-vibeui-block="delivery-004"] [data-part="eta"] b{font-family:var(--vibeui-delivery-004-display);font-weight:900;font-size:1rem;color:var(--vibeui-delivery-004-accent);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="delivery-004"] [data-part="chat"]{position:absolute;left:.9rem;right:.9rem;bottom:.9rem;display:flex;align-items:center;gap:.7rem;padding:.7rem .9rem;border-radius:1rem;background:var(--vibeui-delivery-004-fg);color:var(--vibeui-delivery-004-on-fg);font-size:.84rem;transform:translateY(140%);transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-004"] [data-part="chat"][data-show="true"]{transform:none}
[data-vibeui-block="delivery-004"] [data-part="chat"] i{display:grid;place-items:center;flex-shrink:0;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-delivery-004-accent);color:var(--vibeui-delivery-004-on-accent);font-style:normal;font-weight:800;font-size:.8rem}
[data-vibeui-block="delivery-004"] [data-part="chat"] b{display:block;font-weight:700}
@keyframes vibeui-delivery-004-wobble{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
@container (min-width: 56rem){[data-vibeui-block="delivery-004"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STEPS: Delivery004Step[] = [
  { title: "Заказ принят", text: "Оплата прошла, повар видит заказ на экране.", time: "12:41", after: 300, progress: 0 },
  { title: "Готовим", text: "Котлеты на гриле, картошка в масле. Ещё 9 минут.", time: "12:43", after: 1800, progress: 0 },
  { title: "Курьер выехал", text: "Артём на скутере, термосумка, 2,3 км до вас.", time: "12:56", after: 3600, progress: 100 },
  { title: "У двери", text: "Курьер на месте. Приятного аппетита.", time: "13:07", after: 6600, progress: 100 },
]

/** Трекер заказа: статусы проигрываются, курьер едет по маршруту. */
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
  const moving = step >= 0 && progress > 0 && !finished

  const eta = step < 0 ? etaLabels[0] : finished ? etaLabels[3] : step >= 2 ? etaLabels[2] : etaLabels[1]
  const etaValue = step < 0 ? "—" : finished ? etaValues[2] : step >= 2 ? etaValues[1] : etaValues[0]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="delivery-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <button data-part="play" type="button" onClick={play}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
              {run > 0 ? replayLabel : playLabel}
            </button>
            <ol data-part="steps" style={{ ["--vibeui-delivery-004-fill" as string]: fill } as CSSProperties} aria-live="polite">
              {steps.map((item, index) => (
                <Card084 key={item.title} data-part="step" title={item.title} time={item.time} text={item.text} data-state={index < step ? "done" : index === step ? "now" : "todo"} accent={accent} />
              ))}
            </ol>
          </div>
          <div data-part="phone" aria-hidden="true">
            <div data-part="screen">
              <svg viewBox="0 0 320 260" style={{ ["--vibeui-delivery-004-d" as string]: `${progress * 100}%`, ["--vibeui-delivery-004-p" as string]: progress } as CSSProperties}>
                <g data-part="grid">
                  <path d="M0 60H320M0 120H320M0 180H320M0 240H320M60 0V260M120 0V260M180 0V260M240 0V260" />
                </g>
                <path data-part="route" d={ROUTE} />
                <path data-part="trail" d={ROUTE} pathLength={1} />
                <circle data-part="pin" cx="36" cy="214" r="7" />
                <text data-part="pin-label" x="36" y="240" textAnchor="middle">{kitchenLabel}</text>
                <path data-part="pin" d="M284 24c-8 0-14 6-14 14 0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14Zm0 19a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
                <text data-part="pin-label" x="284" y="78" textAnchor="middle">{youLabel}</text>
                <g data-part="courier" data-moving={moving}>
                  <circle r="13" />
                  <path d="M-6 3h3l2-5h4l1 3h2M-4 5.5a2 2 0 1 0 0 .01M5 5.5a2 2 0 1 0 0 .01" />
                </g>
              </svg>
              <div data-part="eta">
                <span>{eta}</span>
                <b>{etaValue}</b>
              </div>
              <div data-part="chat" data-show={finished}>
                <i>{courierName.charAt(0)}</i>
                <span>
                  <b>{courierName}, {courierRole}</b>
                  {courierMessage}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
