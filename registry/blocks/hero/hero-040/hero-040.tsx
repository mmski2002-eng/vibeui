"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Hero040Transaction = {
  title: string
  note: string
  /** С знаком и валютой: «+42 500 ₽», «−1 240 ₽». */
  amount: string
}

export type Hero040Fact = {
  value: string
  label: string
}

export type Hero040Props = {
  eyebrow?: string
  /** Слово в *звёздочках* красится градиентом. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  facts?: readonly Hero040Fact[]
  cardBrand?: string
  cardKind?: string
  /** Полный номер карты; по умолчанию показывается замаскированным. */
  cardNumber?: string
  cardHolder?: string
  cardExpiry?: string
  transactions?: readonly Hero040Transaction[]
  /** Интервал появления операций, мс. */
  interval?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро необанка: слева заголовок с одним градиентным словом, два действия
// и три факта; справа 3D-карта в perspective — поворачивается за курсором
// (углы пишутся в CSS-переменные напрямую, без ререндера), по ней ходит
// блик, номер замаскирован и открывается кнопкой-глазом, а рядом по одной
// всплывают «живые» операции. Без курсора карта медленно плывёт.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-040"]){
--vibeui-hero-040-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-040-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-040-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-040-on-accent:oklch(from var(--vibeui-hero-040-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-040-mint:color-mix(in oklab,var(--vibeui-hero-040-accent) 45%,#99f6e4);
--vibeui-hero-040-muted:color-mix(in oklab,var(--vibeui-hero-040-fg) 62%,var(--vibeui-hero-040-bg));
--vibeui-hero-040-line:color-mix(in oklab,var(--vibeui-hero-040-fg) 11%,transparent);
--vibeui-hero-040-glass:color-mix(in oklab,var(--vibeui-hero-040-fg) 5%,transparent);
--vibeui-hero-040-aurora:linear-gradient(100deg,var(--vibeui-hero-040-accent),var(--vibeui-hero-040-mint),color-mix(in oklab,var(--vibeui-hero-040-accent) 35%,#818cf8));
--vibeui-hero-040-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-040-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-040-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-040"]{color-scheme:dark}
:where([data-vibeui-block="hero-040"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-040"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-040"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;padding:4rem 0 5rem;min-height:min(calc(100svh - 4.2rem),58rem);display:grid;align-items:center;background:var(--vibeui-hero-040-bg);color:var(--vibeui-hero-040-fg);font-family:var(--vibeui-hero-040-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-040"] *{box-sizing:border-box}
[data-vibeui-block="hero-040"] [data-part="grid"]{position:absolute;inset:0;z-index:-2;background-image:linear-gradient(var(--vibeui-hero-040-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-040-line) 1px,transparent 1px);background-size:4rem 4rem;mask-image:radial-gradient(ellipse 70% 60% at 60% 40%,#000 20%,transparent 100%)}
[data-vibeui-block="hero-040"] [data-part="blob"]{position:absolute;z-index:-1;border-radius:50%;filter:blur(80px);opacity:.45;animation:vibeui-hero-040-float 16s ease-in-out infinite alternate}
[data-vibeui-block="hero-040"] [data-part="blob"]:nth-child(2){width:32rem;height:32rem;right:-10rem;top:-12rem;background:var(--vibeui-hero-040-accent)}
[data-vibeui-block="hero-040"] [data-part="blob"]:nth-child(3){width:24rem;height:24rem;right:10rem;bottom:-14rem;background:var(--vibeui-hero-040-mint);animation-delay:-7s}
[data-vibeui-block="hero-040"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center;width:100%}
[data-vibeui-block="hero-040"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0 0 1.2rem;padding:.35rem .8rem .35rem .5rem;border-radius:999px;border:1px solid var(--vibeui-hero-040-line);background:var(--vibeui-hero-040-glass);font-family:var(--vibeui-hero-040-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-hero-040-muted)}
[data-vibeui-block="hero-040"] [data-part="eyebrow"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-hero-040-accent);box-shadow:0 0 0 0 var(--vibeui-hero-040-accent);animation:vibeui-hero-040-ping 2.4s ease-out infinite}
[data-vibeui-block="hero-040"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-040-display);font-weight:800;font-size:clamp(2.6rem,6.4cqi,5.2rem);line-height:.98;letter-spacing:-.045em;text-wrap:balance}
[data-vibeui-block="hero-040"] [data-part="title"] em{font-style:normal;background:var(--vibeui-hero-040-aurora);-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-040"] [data-part="lede"]{margin:1.4rem 0 0;max-width:32rem;font-size:1.1rem;color:var(--vibeui-hero-040-muted)}
[data-vibeui-block="hero-040"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:2rem 0 0}
[data-vibeui-block="hero-040"] [data-part="primary"],[data-vibeui-block="hero-040"] [data-part="secondary"]{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.9rem 1.5rem;border-radius:999px;font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .25s,background .2s}
[data-vibeui-block="hero-040"] [data-part="primary"]{background:var(--vibeui-hero-040-accent);color:var(--vibeui-hero-040-on-accent)}
[data-vibeui-block="hero-040"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 16px 40px -12px var(--vibeui-hero-040-accent)}
[data-vibeui-block="hero-040"] [data-part="secondary"]{color:var(--vibeui-hero-040-fg);border:1px solid var(--vibeui-hero-040-line);background:var(--vibeui-hero-040-glass)}
[data-vibeui-block="hero-040"] [data-part="secondary"]:hover{transform:translateY(-2px);background:color-mix(in oklab,var(--vibeui-hero-040-fg) 10%,transparent)}
[data-vibeui-block="hero-040"] a:focus-visible,[data-vibeui-block="hero-040"] button:focus-visible{outline:2px solid var(--vibeui-hero-040-accent);outline-offset:2px}
[data-vibeui-block="hero-040"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.4rem 2.2rem;margin:2.4rem 0 0;padding:1.4rem 0 0;border-top:1px solid var(--vibeui-hero-040-line);list-style:none}
[data-vibeui-block="hero-040"] [data-part="facts"] strong{display:block;font-family:var(--vibeui-hero-040-mono);font-weight:600;font-size:1.25rem;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="hero-040"] [data-part="facts"] span{font-size:.82rem;color:var(--vibeui-hero-040-muted)}
[data-vibeui-block="hero-040"] [data-part="scene"]{position:relative;perspective:1200px;padding:1rem 0 0;--vibeui-hero-040-rx:0deg;--vibeui-hero-040-ry:0deg;--vibeui-hero-040-gx:30%;--vibeui-hero-040-gy:20%}
[data-vibeui-block="hero-040"] [data-part="float"]{width:min(100%,24rem);margin:0 auto;animation:vibeui-hero-040-drift 9s ease-in-out infinite;transform-style:preserve-3d}
[data-vibeui-block="hero-040"] [data-part="card"]{position:relative;aspect-ratio:1.586;border-radius:1.3rem;padding:1.1rem 1.2rem;display:grid;grid-template-rows:auto 1fr auto;color:#f4f7ff;background:linear-gradient(135deg,#141a3a,#090c22 55%,#0b1330);border:1px solid rgb(255 255 255 / .16);box-shadow:0 40px 80px -30px rgb(0 0 0 / .8),0 0 0 1px rgb(0 0 0 / .4) inset;overflow:hidden;transform:rotateX(var(--vibeui-hero-040-rx)) rotateY(var(--vibeui-hero-040-ry));transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.7,.2,1);will-change:transform}
[data-vibeui-block="hero-040"] [data-part="scene"][data-active="true"] [data-part="card"]{transition:transform .12s ease-out}
[data-vibeui-block="hero-040"] [data-part="card"]::before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 200deg at 70% 30%,transparent 0,var(--vibeui-hero-040-accent) 12%,var(--vibeui-hero-040-mint) 22%,transparent 40%);opacity:.5;filter:blur(30px);pointer-events:none}
[data-vibeui-block="hero-040"] [data-part="glare"]{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--vibeui-hero-040-gx) var(--vibeui-hero-040-gy),rgb(255 255 255 / .28),transparent 45%);mix-blend-mode:screen;transition:opacity .4s;opacity:.7}
[data-vibeui-block="hero-040"] [data-part="card"] > :not([data-part="glare"]){position:relative}
[data-vibeui-block="hero-040"] [data-part="cardtop"]{display:flex;align-items:center;justify-content:space-between;font-family:var(--vibeui-hero-040-display);font-weight:800;font-size:1.05rem;letter-spacing:-.02em}
[data-vibeui-block="hero-040"] [data-part="cardtop"] small{display:block;font-family:var(--vibeui-hero-040-mono);font-weight:400;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;opacity:.6}
[data-vibeui-block="hero-040"] [data-part="wave"]{width:1.4rem;height:1.4rem;opacity:.85}
[data-vibeui-block="hero-040"] [data-part="wave"] path{stroke-dasharray:30;animation:vibeui-hero-040-wave 2.6s ease-out infinite}
[data-vibeui-block="hero-040"] [data-part="wave"] path:nth-child(2){animation-delay:.25s}
[data-vibeui-block="hero-040"] [data-part="wave"] path:nth-child(3){animation-delay:.5s}
[data-vibeui-block="hero-040"] [data-part="cardmid"]{display:flex;align-items:center;gap:.7rem;align-self:center}
[data-vibeui-block="hero-040"] [data-part="chip"]{width:2.4rem;height:1.8rem;border-radius:.4rem;background:linear-gradient(135deg,#f5e6a8,#c9a54b 60%,#e9d58c);box-shadow:0 0 0 1px rgb(0 0 0 / .3) inset;flex:none;position:relative}
[data-vibeui-block="hero-040"] [data-part="chip"]::after{content:"";position:absolute;inset:.35rem .5rem;border:1px solid rgb(0 0 0 / .35);border-radius:.2rem}
[data-vibeui-block="hero-040"] [data-part="number"]{margin:0;font-family:var(--vibeui-hero-040-mono);font-weight:500;font-size:clamp(.85rem,4.2cqi,1.2rem);letter-spacing:.05em;font-variant-numeric:tabular-nums;white-space:nowrap;text-shadow:0 1px 0 rgb(0 0 0 / .5)}
[data-vibeui-block="hero-040"] [data-part="eye"]{margin-left:auto;flex:none;width:1.8rem;height:1.8rem;border-radius:50%;border:1px solid rgb(255 255 255 / .2);background:rgb(255 255 255 / .08);color:inherit;cursor:pointer;display:grid;place-items:center;padding:0;transition:background .2s}
[data-vibeui-block="hero-040"] [data-part="eye"]:hover{background:rgb(255 255 255 / .18)}
[data-vibeui-block="hero-040"] [data-part="eye"] svg{width:1rem;height:1rem}
[data-vibeui-block="hero-040"] [data-part="cardbottom"]{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;opacity:.9}
[data-vibeui-block="hero-040"] [data-part="cardbottom"] b{font-family:var(--vibeui-hero-040-mono);font-weight:500}
[data-vibeui-block="hero-040"] [data-part="feed"]{list-style:none;margin:1.2rem auto 0;padding:0;display:grid;gap:.5rem;width:min(100%,24rem)}
[data-vibeui-block="hero-040"] [data-part="tx"]{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.7rem;padding:.6rem .8rem;border-radius:.9rem;background:color-mix(in oklab,var(--vibeui-hero-040-bg) 70%,transparent);border:1px solid var(--vibeui-hero-040-line);backdrop-filter:blur(16px);box-shadow:0 20px 40px -24px rgb(0 0 0 / .7);font-size:.85rem}
[data-vibeui-block="hero-040"] [data-part="tx"][data-new="true"]{animation:vibeui-hero-040-pop .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-040"] [data-part="tx"] i{width:2rem;height:2rem;border-radius:.6rem;display:grid;place-items:center;font-style:normal;font-family:var(--vibeui-hero-040-mono);font-size:.7rem;background:color-mix(in oklab,var(--vibeui-hero-040-accent) 16%,transparent);color:var(--vibeui-hero-040-accent)}
[data-vibeui-block="hero-040"] [data-part="tx"] div{min-width:0}
[data-vibeui-block="hero-040"] [data-part="tx"] div span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="hero-040"] [data-part="tx"] div span:last-child{font-size:.74rem;color:var(--vibeui-hero-040-muted)}
[data-vibeui-block="hero-040"] [data-part="tx"] b{font-family:var(--vibeui-hero-040-mono);font-weight:600;font-size:.9rem;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="hero-040"] [data-part="tx"][data-plus="true"] b{color:var(--vibeui-hero-040-accent)}
@keyframes vibeui-hero-040-float{from{transform:translate(0,0) scale(1)}to{transform:translate(-8%,10%) scale(1.15)}}
@keyframes vibeui-hero-040-drift{0%,100%{transform:translateY(0) rotate(-.6deg)}50%{transform:translateY(-10px) rotate(.6deg)}}
@keyframes vibeui-hero-040-ping{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-040-accent) 60%,transparent)}100%{box-shadow:0 0 0 .6rem transparent}}
@keyframes vibeui-hero-040-wave{0%{stroke-dashoffset:30;opacity:0}30%{opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes vibeui-hero-040-pop{from{opacity:0;transform:translateY(14px) scale(.96)}}
@container (min-width: 60rem){[data-vibeui-block="hero-040"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:4rem}[data-vibeui-block="hero-040"] [data-part="card"]{padding:1.3rem 1.4rem}[data-vibeui-block="hero-040"] [data-part="scene"]{padding:2rem 0 5rem}[data-vibeui-block="hero-040"] [data-part="float"]{width:min(100%,26rem);margin:0 3rem 0 auto}[data-vibeui-block="hero-040"] [data-part="feed"]{position:absolute;right:0;bottom:0;width:17rem;margin:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-040"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TRANSACTIONS: Hero040Transaction[] = [
  { title: "Ozon · выплата", note: "маркетплейс", amount: "+184 300 ₽" },
  { title: "Аренда, ул. Правды 8", note: "по расписанию", amount: "−62 000 ₽" },
  { title: "ООО «Прим-Логистик»", note: "СБП, 0 ₽ комиссии", amount: "+48 900 ₽" },
  { title: "Зарплата · 6 человек", note: "проект: пятница", amount: "−318 500 ₽" },
  { title: "Wildberries · выплата", note: "маркетплейс", amount: "+96 120 ₽" },
  { title: "УСН 6 % · аванс", note: "посчитан сам", amount: "−41 760 ₽" },
]

function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <em key={index}>{part.slice(1, -1)}</em> : part))
}

function maskNumber(number: string) {
  const groups = number.split(" ")
  return groups.map((group, index) => (index === groups.length - 1 ? group : "••••")).join(" ")
}

/** Хиро необанка с 3D-картой за курсором и живыми операциями. */
export function Hero040({
  eyebrow = "Банк для малого бизнеса · лицензия ЦБ РФ",
  title = "Счёт, который *работает* быстрее бухгалтера",
  lede = "Открываем счёт за 10 минут без визита в офис. Переводы по СБП без комиссии, налоги считаем сами, карты сотрудникам — за день.",
  primaryLabel = "Открыть счёт",
  primaryHref = "#open",
  secondaryLabel = "Посмотреть тарифы",
  secondaryHref = "#pricing",
  facts = [
    { value: "10 мин", label: "до открытия счёта" },
    { value: "0 ₽", label: "за переводы по СБП" },
    { value: "24/7", label: "живая поддержка" },
  ],
  cardBrand = "Ось",
  cardKind = "Business",
  cardNumber = "5536 9138 2214 4821",
  cardHolder = "ООО «Северный ветер»",
  cardExpiry = "09/29",
  transactions = DEFAULT_TRANSACTIONS,
  interval = 2600,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero040Props) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [masked, setMasked] = useState(true)
  const [head, setHead] = useState(2)

  useEffect(() => {
    if (transactions.length < 2) return
    const timer = window.setInterval(() => setHead((value) => value + 1), interval)
    return () => window.clearInterval(timer)
  }, [transactions.length, interval])

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current
    if (!scene || event.pointerType === "touch") return
    const rect = scene.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    scene.style.setProperty("--vibeui-hero-040-rx", `${((0.5 - y) * 18).toFixed(2)}deg`)
    scene.style.setProperty("--vibeui-hero-040-ry", `${((x - 0.5) * 24).toFixed(2)}deg`)
    scene.style.setProperty("--vibeui-hero-040-gx", `${(x * 100).toFixed(1)}%`)
    scene.style.setProperty("--vibeui-hero-040-gy", `${(y * 100).toFixed(1)}%`)
  }

  const onLeave = () => {
    const scene = sceneRef.current
    if (!scene) return
    scene.style.setProperty("--vibeui-hero-040-rx", "0deg")
    scene.style.setProperty("--vibeui-hero-040-ry", "0deg")
    scene.style.setProperty("--vibeui-hero-040-gx", "30%")
    scene.style.setProperty("--vibeui-hero-040-gy", "20%")
    setActive(false)
  }

  const visible = transactions.length ? [head - 2, head - 1, head].map((index) => ({ index, item: transactions[((index % transactions.length) + transactions.length) % transactions.length] })) : []

  const palette = {
    ...(accent ? { "--vibeui-hero-040-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-040-fg": ink } : null),
    ...(background ? { "--vibeui-hero-040-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-040" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-040" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <i data-part="grid" aria-hidden="true" />
        <i data-part="blob" aria-hidden="true" />
        <i data-part="blob" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{renderTitle(title)}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
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
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    <strong>{fact.value}</strong>
                    <span>{fact.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="scene" ref={sceneRef} data-active={active} onPointerMove={onMove} onPointerEnter={() => setActive(true)} onPointerLeave={onLeave}>
            <div data-part="float">
              <div data-part="card" aria-label={`Карта ${cardBrand} ${cardKind}`}>
                <div data-part="cardtop">
                  <span>
                    {cardBrand}
                    <small>{cardKind}</small>
                  </span>
                  <svg data-part="wave" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 9a5 5 0 0 1 0 6" />
                    <path d="M10 6.5a9 9 0 0 1 0 11" />
                    <path d="M14 4a13 13 0 0 1 0 16" />
                  </svg>
                </div>
                <div data-part="cardmid">
                  <i data-part="chip" aria-hidden="true" />
                  <p data-part="number" aria-live="polite">
                    {masked ? maskNumber(cardNumber) : cardNumber}
                  </p>
                  <button data-part="eye" type="button" aria-pressed={!masked} aria-label={masked ? "Показать номер" : "Скрыть номер"} onClick={() => setMasked((value) => !value)}>
                    {masked ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 13.4 13.4M6.5 6.6C4 8.2 2 12 2 12s3.5 6 10 6c1.6 0 3-.3 4.2-.9M9.9 5.1C10.6 5 11.3 5 12 5c6.5 0 10 7 10 7s-.8 1.4-2.3 2.9" />
                      </svg>
                    )}
                  </button>
                </div>
                <div data-part="cardbottom">
                  <span>{cardHolder}</span>
                  <b>{cardExpiry}</b>
                </div>
                <i data-part="glare" aria-hidden="true" />
              </div>
            </div>
            {visible.length > 0 ? (
              <ul data-part="feed" aria-label="Последние операции">
                {visible.map(({ index, item }, position) => (
                  <li key={index} data-part="tx" data-new={position === visible.length - 1} data-plus={item.amount.trim().startsWith("+")}>
                    <i aria-hidden="true">{item.amount.trim().startsWith("+") ? "↓" : "↑"}</i>
                    <div>
                      <span>{item.title}</span>
                      <span>{item.note}</span>
                    </div>
                    <b>{item.amount}</b>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
