"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Pricing025Plan = {
  name: string
  /** Цена за место в месяц при помесячной оплате. 0 — бесплатно. */
  perSeat: number
  /** Сколько мест входит бесплатно (для нулевого тарифа — потолок). */
  seatsIncluded?: number
  note: string
  features: readonly string[]
  featured?: boolean
  actionLabel?: string
  actionHref?: string
}

export type Pricing025Props = {
  eyebrow?: string
  title?: string
  lede?: string
  plans?: readonly Pricing025Plan[]
  /** Диапазон ползунка мест. */
  minSeats?: number
  maxSeats?: number
  defaultSeats?: number
  /** Скидка за год, в процентах. */
  yearlyDiscount?: number
  currency?: string
  /** Подписи ползунка, периода и карточек. */
  seatsLabel?: string
  seatUnits?: readonly [string, string, string]
  monthlyLabel?: string
  yearlyLabel?: string
  yearlyAria?: string
  featuredLabel?: string
  upToLine?: string
  foreverLabel?: string
  perSeatLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы с ползунком мест: один range сверху, под ним три карточки, цена
// в каждой пересчитывается на лету (за место × мест, годовая скидка
// переключателем). Цифры не прыгают, а морфят: каждая — колонка 0–9,
// которая прокручивается к нужной (transform по CSS-переменной). Средняя
// карточка «выбирают чаще» дышит аврора-рамкой и свечением, карточки ловят
// spotlight под курсором, заголовок въезжает словами через маску, карточки
// проявляются каскадом при попадании в экран (IntersectionObserver).
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-025"]){
--vibeui-pricing-025-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-025-on-accent:oklch(from var(--vibeui-pricing-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-025-muted:color-mix(in oklab,var(--vibeui-pricing-025-fg) 60%,var(--vibeui-pricing-025-bg));
--vibeui-pricing-025-line:color-mix(in oklab,var(--vibeui-pricing-025-fg) 14%,transparent);
--vibeui-pricing-025-glass:color-mix(in oklab,var(--vibeui-pricing-025-fg) 6%,transparent);
--vibeui-pricing-025-aurora:linear-gradient(135deg,var(--vibeui-pricing-025-accent),color-mix(in oklab,var(--vibeui-pricing-025-accent) 40%,#a855f7),color-mix(in oklab,var(--vibeui-pricing-025-accent) 30%,#f472b6));
--vibeui-pricing-025-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-pricing-025-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-025-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-025-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-025"]{color-scheme:dark}
:where([data-vibeui-block="pricing-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-025"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-pricing-025-bg);color:var(--vibeui-pricing-025-fg);font-family:var(--vibeui-pricing-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-025"] *{box-sizing:border-box}
[data-vibeui-block="pricing-025"] [data-part="glow"]{position:absolute;left:50%;top:55%;width:70%;aspect-ratio:2.2;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-pricing-025-accent) 10%,transparent),transparent);filter:blur(60px);pointer-events:none;opacity:0;transition:opacity 1.2s var(--vibeui-pricing-025-ease)}
[data-vibeui-block="pricing-025"][data-in="true"] [data-part="glow"]{opacity:1}
[data-vibeui-block="pricing-025"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-025"] [data-part="head"]{max-width:44rem;margin:0 auto;text-align:center}
[data-vibeui-block="pricing-025"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-025-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-pricing-025-accent);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-pricing-025-ease),transform .6s var(--vibeui-pricing-025-ease)}
[data-vibeui-block="pricing-025"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:clamp(2.2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="pricing-025"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="pricing-025"] [data-part="w"] span{display:inline-block;transform:translateY(112%);transition:transform .8s var(--vibeui-pricing-025-ease);transition-delay:calc(var(--vibeui-pricing-025-i) * .06s)}
[data-vibeui-block="pricing-025"][data-in="true"] [data-part="w"] span{transform:none}
[data-vibeui-block="pricing-025"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-pricing-025-muted);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-pricing-025-ease) .3s,transform .6s var(--vibeui-pricing-025-ease) .3s}
[data-vibeui-block="pricing-025"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="pricing-025"][data-in="true"] [data-part="lede"]{opacity:1;transform:none}
[data-vibeui-block="pricing-025"] [data-part="controls"]{margin:2.4rem auto 0;max-width:44rem;padding:1.2rem 1.4rem;border-radius:1.2rem;background:var(--vibeui-pricing-025-glass);border:1px solid var(--vibeui-pricing-025-line);display:grid;gap:1rem;opacity:0;transform:translateY(20px);transition:opacity .8s var(--vibeui-pricing-025-ease) .35s,transform .8s var(--vibeui-pricing-025-ease) .35s}
[data-vibeui-block="pricing-025"][data-in="true"] [data-part="controls"]{opacity:1;transform:none}
[data-vibeui-block="pricing-025"] [data-part="seats"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:.9rem}
[data-vibeui-block="pricing-025"] [data-part="seats"] output{font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:1.6rem;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="pricing-025"] [data-part="seats"] output small{font-family:var(--vibeui-pricing-025-font);font-weight:500;font-size:.85rem;color:var(--vibeui-pricing-025-muted);margin-left:.3rem}
[data-vibeui-block="pricing-025"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-pricing-025-accent) var(--vibeui-pricing-025-fill),var(--vibeui-pricing-025-line) var(--vibeui-pricing-025-fill));outline:none;cursor:pointer}
[data-vibeui-block="pricing-025"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-025-bg);border:3px solid var(--vibeui-pricing-025-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-025-accent) 20%,transparent);cursor:grab;transition:box-shadow .3s,transform .3s var(--vibeui-pricing-025-ease)}
[data-vibeui-block="pricing-025"] [data-part="range"]:hover::-webkit-slider-thumb{transform:scale(1.12);box-shadow:0 0 0 8px color-mix(in oklab,var(--vibeui-pricing-025-accent) 25%,transparent),0 0 24px var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="range"]:active::-webkit-slider-thumb{cursor:grabbing;transform:scale(1.2)}
[data-vibeui-block="pricing-025"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-025-bg);border:3px solid var(--vibeui-pricing-025-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-025-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="pricing-025"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-025-accent) 40%,transparent)}
[data-vibeui-block="pricing-025"] [data-part="period"]{display:flex;align-items:center;justify-content:center;gap:.8rem;font-size:.88rem;color:var(--vibeui-pricing-025-muted)}
[data-vibeui-block="pricing-025"] [data-part="period"] [data-on="true"]{color:var(--vibeui-pricing-025-fg);font-weight:600}
[data-vibeui-block="pricing-025"] [data-part="switch"]{position:relative;width:2.8rem;height:1.5rem;border-radius:999px;border:0;padding:0;background:var(--vibeui-pricing-025-line);cursor:pointer;transition:background .2s}
[data-vibeui-block="pricing-025"] [data-part="switch"]::after{content:"";position:absolute;top:.2rem;left:.2rem;width:1.1rem;height:1.1rem;border-radius:50%;background:var(--vibeui-pricing-025-fg);transition:transform .2s}
[data-vibeui-block="pricing-025"] [data-part="switch"][aria-checked="true"]{background:var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="switch"][aria-checked="true"]::after{transform:translateX(1.3rem);background:var(--vibeui-pricing-025-on-accent)}
[data-vibeui-block="pricing-025"] [data-part="switch"]:focus-visible{outline:2px solid var(--vibeui-pricing-025-accent);outline-offset:2px}
[data-vibeui-block="pricing-025"] [data-part="save"]{font-family:var(--vibeui-pricing-025-mono);font-size:.68rem;padding:.15rem .5rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-pricing-025-accent) 18%,transparent);color:var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="grid"]{display:grid;gap:1rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="pricing-025"] [data-part="plan"]{--vibeui-pricing-025-x:50%;--vibeui-pricing-025-y:0%;position:relative;display:grid;gap:1.2rem;padding:1.6rem;border-radius:1.4rem;background:var(--vibeui-pricing-025-glass);border:1px solid var(--vibeui-pricing-025-line);opacity:0;translate:0 28px;transition:opacity .8s var(--vibeui-pricing-025-ease) calc(.4s + var(--vibeui-pricing-025-i) * .12s),translate .8s var(--vibeui-pricing-025-ease) calc(.4s + var(--vibeui-pricing-025-i) * .12s),border-color .4s}
[data-vibeui-block="pricing-025"][data-in="true"] [data-part="plan"]{opacity:1;translate:0 0}
[data-vibeui-block="pricing-025"] [data-part="plan"]:hover{border-color:color-mix(in oklab,var(--vibeui-pricing-025-accent) 40%,transparent)}
[data-vibeui-block="pricing-025"] [data-part="plan"]::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(24rem circle at var(--vibeui-pricing-025-x) var(--vibeui-pricing-025-y),color-mix(in oklab,var(--vibeui-pricing-025-accent) 14%,transparent),transparent 60%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="pricing-025"] [data-part="plan"]:hover::before{opacity:1}
[data-vibeui-block="pricing-025"] [data-part="plan"]>*{position:relative}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"]{isolation:isolate;border-color:transparent;background:linear-gradient(var(--vibeui-pricing-025-bg),var(--vibeui-pricing-025-bg)) padding-box,var(--vibeui-pricing-025-aurora) border-box;background-size:auto,300% 300%;box-shadow:0 30px 60px -30px var(--vibeui-pricing-025-accent);animation:vibeui-pricing-025-breathe 5s ease-in-out infinite alternate}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"]::after{content:"";position:absolute;inset:-2px;z-index:-1;border-radius:inherit;background:var(--vibeui-pricing-025-aurora);background-size:300% 300%;filter:blur(24px);opacity:.35;animation:vibeui-pricing-025-breathe 5s ease-in-out infinite alternate,vibeui-pricing-025-halo 5s ease-in-out infinite alternate;pointer-events:none}
[data-vibeui-block="pricing-025"] [data-part="badge"]{position:absolute;top:-.8rem;left:1.6rem;padding:.25rem .7rem;border-radius:999px;background:var(--vibeui-pricing-025-aurora);background-size:300% 300%;color:var(--vibeui-pricing-025-on-accent);font-size:.7rem;font-weight:600;letter-spacing:.02em;animation:vibeui-pricing-025-breathe 5s ease-in-out infinite alternate}
[data-vibeui-block="pricing-025"] [data-part="plan"] h3{margin:0;font-family:var(--vibeui-pricing-025-display);font-size:1.15rem;font-weight:700}
[data-vibeui-block="pricing-025"] [data-part="price"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2rem .5rem;font-family:var(--vibeui-pricing-025-display);font-weight:800;font-size:2.4rem;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-025"] [data-part="odo"]{display:inline-flex;height:1em;overflow:hidden;line-height:1;vertical-align:bottom;-webkit-mask:linear-gradient(transparent,#000 6%,#000 94%,transparent);mask:linear-gradient(transparent,#000 6%,#000 94%,transparent)}
[data-vibeui-block="pricing-025"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
[data-vibeui-block="pricing-025"] [data-part="odo"] [data-d]{display:inline-block;width:1ch;height:1em;text-align:center;transform:translateY(calc(var(--vibeui-pricing-025-d) * -1em));transition:transform .55s var(--vibeui-pricing-025-ease)}
[data-vibeui-block="pricing-025"] [data-part="odo"] [data-d] i{display:block;height:1em;font-style:normal}
[data-vibeui-block="pricing-025"] [data-part="odo"] [data-c]{display:inline-block;height:1em}
[data-vibeui-block="pricing-025"] [data-part="price"] small{font-family:var(--vibeui-pricing-025-font);font-weight:500;font-size:.85rem;color:var(--vibeui-pricing-025-muted);letter-spacing:0}
[data-vibeui-block="pricing-025"] [data-part="note"]{margin:0;font-size:.85rem;color:var(--vibeui-pricing-025-muted);min-height:2.6em}
[data-vibeui-block="pricing-025"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.9rem}
[data-vibeui-block="pricing-025"] [data-part="features"] li{display:flex;gap:.5rem;align-items:baseline}
[data-vibeui-block="pricing-025"] [data-part="features"] li::before{content:"✓";font-family:var(--vibeui-pricing-025-mono);color:var(--vibeui-pricing-025-accent);font-size:.8rem}
[data-vibeui-block="pricing-025"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;padding:.8rem 1.2rem;border-radius:999px;font-weight:600;text-decoration:none;color:var(--vibeui-pricing-025-fg);border:1px solid var(--vibeui-pricing-025-line);transition:transform .4s var(--vibeui-pricing-025-ease),background .3s,color .3s,box-shadow .4s}
[data-vibeui-block="pricing-025"] [data-part="action"]:hover{transform:translateY(-2px);background:var(--vibeui-pricing-025-glass)}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"] [data-part="action"]{background:var(--vibeui-pricing-025-accent);color:var(--vibeui-pricing-025-on-accent);border-color:transparent}
[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"] [data-part="action"]:hover{box-shadow:0 10px 30px -10px var(--vibeui-pricing-025-accent)}
[data-vibeui-block="pricing-025"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-025-accent);outline-offset:2px}
@keyframes vibeui-pricing-025-breathe{from{background-position:0 0,0% 50%}to{background-position:0 0,100% 50%}}
@keyframes vibeui-pricing-025-halo{from{opacity:.25;transform:scale(.98)}to{opacity:.55;transform:scale(1.02)}}
@container (min-width: 44rem){[data-vibeui-block="pricing-025"] [data-part="controls"]{grid-template-columns:1fr auto;align-items:center}[data-vibeui-block="pricing-025"] [data-part="seats"]{grid-column:1/-1}}
@container (min-width: 56rem){[data-vibeui-block="pricing-025"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}[data-vibeui-block="pricing-025"] [data-part="plan"][data-featured="true"]{transform:translateY(-.6rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-025"] *{animation:none!important;transition:none!important}[data-vibeui-block="pricing-025"] [data-part="w"] span,[data-vibeui-block="pricing-025"] [data-part="controls"],[data-vibeui-block="pricing-025"] [data-part="eyebrow"],[data-vibeui-block="pricing-025"] [data-part="lede"]{opacity:1;transform:none}[data-vibeui-block="pricing-025"] [data-part="plan"]{opacity:1;translate:0 0}}`

const DEFAULT_PLANS: Pricing025Plan[] = [
  { name: "Старт", perSeat: 0, seatsIncluded: 3, note: "До трёх человек, 5 встреч в месяц, сводка в Telegram.", features: ["Расшифровка и сводка", "5 встреч в месяц", "Экспорт в Markdown"], actionLabel: "Начать бесплатно", actionHref: "#start" },
  { name: "Команда", perSeat: 890, note: "Всё, что нужно команде до 50 человек. Интеграции и задачи в трекере.", features: ["Безлимит встреч", "Задачи в Jira, Notion, Linear", "Поиск по всем решениям", "История 12 месяцев"], featured: true, actionLabel: "Попробовать 14 дней", actionHref: "#start" },
  { name: "Компания", perSeat: 1490, note: "SSO, свой контур данных, договор и поддержка с SLA.", features: ["Всё из «Команды»", "SSO и SCIM", "Данные в вашем контуре", "Менеджер и SLA"], actionLabel: "Обсудить", actionHref: "#contact" },
]

function formatMoney(value: number, currency: string) {
  const digits = String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${digits} ${currency}`
}


// Число как барабан: каждая цифра — колонка 0–9, сдвинутая на своё
// значение; ключ считается от конца, чтобы новый разряд слева не
// перекручивал остальные.
function Odometer({ value }: { value: string }) {
  const chars = Array.from(value)
  return (
    <span data-part="odo">
      <span data-part="sr">{value}</span>
      {chars.map((char, index) => {
        const key = chars.length - index
        return /\d/.test(char) ? (
          <span key={key} data-d="" aria-hidden="true" style={{ ["--vibeui-pricing-025-d" as string]: Number(char) }}>
            {Array.from({ length: 10 }, (_, digit) => (
              <i key={digit}>{digit}</i>
            ))}
          </span>
        ) : (
          <span key={key} data-c="" aria-hidden="true">
            {/\s/.test(char) ? "\u2009" : char}
          </span>
        )
      })}
    </span>
  )
}
/** Тарифы с ползунком мест и годовым переключателем. */
export function Pricing025({
  eyebrow = "Цены",
  title = "Платите за людей, не за минуты",
  lede = "Подвиньте ползунок под размер команды — цена пересчитается. Годовая оплата дешевле на пятую часть.",
  plans = DEFAULT_PLANS,
  minSeats = 1,
  maxSeats = 100,
  defaultSeats = 12,
  yearlyDiscount = 20,
  currency = "₽",
  seatsLabel = "Человек в команде",
  seatUnits = ["место", "места", "мест"],
  monthlyLabel = "В месяц",
  yearlyLabel = "За год",
  yearlyAria = "Оплата за год",
  featuredLabel = "Выбирают чаще",
  upToLine = "только до {n} человек",
  foreverLabel = "навсегда",
  perSeatLine = "/ мес · {price} за место",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing025Props) {
  const [seats, setSeats] = useState(defaultSeats)
  const [yearly, setYearly] = useState(false)
  const [seen, setSeen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const onPlanMove = (event: PointerEvent<HTMLLIElement>) => {
    const plan = event.currentTarget
    const rect = plan.getBoundingClientRect()
    plan.style.setProperty("--vibeui-pricing-025-x", `${event.clientX - rect.left}px`)
    plan.style.setProperty("--vibeui-pricing-025-y", `${event.clientY - rect.top}px`)
  }
  const words = title.split(" ").filter(Boolean)
  const fill = `${((seats - minSeats) / Math.max(1, maxSeats - minSeats)) * 100}%`
  const factor = yearly ? 1 - yearlyDiscount / 100 : 1

  const palette = {
    ...(accent ? { "--vibeui-pricing-025-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-025-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-025" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="pricing-025" data-tone={tone === "auto" ? undefined : tone} data-in={seen ? "true" : undefined} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">
              {words
                .map((word, index) => (
                  <span key={index} data-part="w">
                    <span style={{ ["--vibeui-pricing-025-i" as string]: index }}>{word}</span>
                  </span>
                ))
                .flatMap((node, index) => (index ? [" ", node] : [node]))}
            </h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="controls">
            <label data-part="seats">
              <span>{seatsLabel}</span>
              <output>
                <Odometer value={String(seats)} />
                <small>{seats === 1 ? seatUnits[0] : seats < 5 ? seatUnits[1] : seatUnits[2]}</small>
              </output>
            </label>
            <input
              data-part="range"
              type="range"
              min={minSeats}
              max={maxSeats}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              aria-label={seatsLabel}
              style={{ ["--vibeui-pricing-025-fill" as string]: fill }}
            />
            <div data-part="period">
              <span data-on={!yearly}>{monthlyLabel}</span>
              <button data-part="switch" type="button" role="switch" aria-checked={yearly} aria-label={yearlyAria} onClick={() => setYearly((value) => !value)} />
              <span data-on={yearly}>{yearlyLabel}</span>
              {yearlyDiscount > 0 ? <span data-part="save">−{yearlyDiscount}%</span> : null}
            </div>
          </div>
          <ul data-part="grid">
            {plans.map((plan, planIndex) => {
              const paidSeats = plan.perSeat === 0 ? 0 : seats
              const total = paidSeats * plan.perSeat * factor
              const over = plan.perSeat === 0 && plan.seatsIncluded !== undefined && seats > plan.seatsIncluded
              return (
                <li key={plan.name} data-part="plan" data-featured={plan.featured ? "true" : undefined} style={{ ["--vibeui-pricing-025-i" as string]: planIndex }} onPointerMove={onPlanMove}>
                  {plan.featured ? <span data-part="badge">{featuredLabel}</span> : null}
                  <h3>{plan.name}</h3>
                  <div data-part="price">
                    {plan.perSeat === 0 ? (
                      <>
                        {"0 " + currency}
                        <small>{over ? upToLine.replace("{n}", String(plan.seatsIncluded)) : foreverLabel}</small>
                      </>
                    ) : (
                      <>
                        <Odometer value={formatMoney(total, currency)} />
                        <small>{perSeatLine.replace("{price}", formatMoney(plan.perSeat * factor, currency))}</small>
                      </>
                    )}
                  </div>
                  <p data-part="note">{plan.note}</p>
                  <ul data-part="features">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  {plan.actionLabel ? (
                    <a data-part="action" href={plan.actionHref ?? "#"}>
                      {plan.actionLabel}
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
