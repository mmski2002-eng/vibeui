"use client"

import { useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type PointerEvent } from "react"

export type Gadget003Swatch = {
  name: string
  color: string
}

export type Gadget003Kit = {
  name: string
  price: number
  note: string
}

export type Gadget003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  swatches?: readonly Gadget003Swatch[]
  kits?: readonly Gadget003Kit[]
  /** Через сколько дней от сегодня отгрузка партии. */
  shipInDays?: number
  batchSize?: number
  batchLeft?: number
  actionLabel?: string
  fine?: string
  doneTitle?: string
  doneText?: string
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Предзаказ гаджета: слева CSS-лампа, цвет корпуса которой меняют три
// свотча (переменная --shell уходит в градиенты корпуса и основания),
// справа выбор комплекта радио-карточками, обратный отсчёт до отгрузки
// (дата считается от текущей, время тикает через useSyncExternalStore
// с серверным снимком null — без гидрационных расхождений), полоса
// «осталось N из партии» и магнитная кнопка: она тянется к курсору
// через transform, надпись — чуть сильнее. После отправки — номер места
// в партии с прорисованной галочкой. Форма ничего не отправляет.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="gadget-003"]){
--vibeui-gadget-003-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-gadget-003-fg:light-dark(#111111,#f2ede4);
--vibeui-gadget-003-accent:light-dark(#111111,#f2ede4);
--vibeui-gadget-003-on-accent:oklch(from var(--vibeui-gadget-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-gadget-003-muted:color-mix(in oklab,var(--vibeui-gadget-003-fg) 60%,var(--vibeui-gadget-003-bg));
--vibeui-gadget-003-line:color-mix(in oklab,var(--vibeui-gadget-003-fg) 14%,transparent);
--vibeui-gadget-003-glass:color-mix(in oklab,var(--vibeui-gadget-003-fg) 5%,transparent);
--vibeui-gadget-003-light:#ffb454;
--vibeui-gadget-003-shell:#2b2b2b;
--vibeui-gadget-003-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-003-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-gadget-003-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="gadget-003"]{color-scheme:dark}
:where([data-vibeui-block="gadget-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="gadget-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="gadget-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-gadget-003-bg);color:var(--vibeui-gadget-003-fg);font-family:var(--vibeui-gadget-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="gadget-003"] *{box-sizing:border-box}
[data-vibeui-block="gadget-003"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="gadget-003"] [data-part="head"]{max-width:44rem}
[data-vibeui-block="gadget-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-gadget-003-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-gadget-003-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="gadget-003"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="stage"]{display:grid;gap:2rem}
[data-vibeui-block="gadget-003"] [data-part="preview"]{position:relative;display:grid;gap:1.4rem;justify-items:center;padding:2rem 1.25rem 1.5rem;border-radius:1.6rem;background:radial-gradient(ellipse at 50% 30%,color-mix(in oklab,var(--vibeui-gadget-003-light) 22%,transparent),transparent 60%),var(--vibeui-gadget-003-glass);border:1px solid var(--vibeui-gadget-003-line);overflow:hidden}
[data-vibeui-block="gadget-003"] [data-part="lamp"]{position:relative;width:13rem;height:19rem}
[data-vibeui-block="gadget-003"] [data-part="foot"]{position:absolute;left:50%;bottom:.5rem;width:13rem;height:2.6rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgb(0 0 0/.55),transparent 70%)}
[data-vibeui-block="gadget-003"] [data-part="base"]{position:absolute;left:50%;bottom:1rem;width:12rem;height:2.4rem;transform:translateX(-50%);border-radius:50%;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-gadget-003-shell) 80%,#fff),color-mix(in oklab,var(--vibeui-gadget-003-shell) 60%,#000));transition:background .4s}
[data-vibeui-block="gadget-003"] [data-part="body"]{position:absolute;left:50%;bottom:2rem;width:10rem;height:12.6rem;transform:translateX(-50%);border-radius:1.5rem 1.5rem 2.6rem 2.6rem/1.5rem 1.5rem 2rem 2rem;background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-gadget-003-shell) 45%,#000) 0%,var(--vibeui-gadget-003-shell) 28%,color-mix(in oklab,var(--vibeui-gadget-003-shell) 80%,#fff) 42%,color-mix(in oklab,var(--vibeui-gadget-003-shell) 75%,#000) 76%,color-mix(in oklab,var(--vibeui-gadget-003-shell) 35%,#000) 100%);box-shadow:inset 0 -18px 30px rgb(0 0 0/.35),0 30px 50px -24px rgb(0 0 0/.8);transition:background .4s}
[data-vibeui-block="gadget-003"] [data-part="body"]::after{content:"";position:absolute;left:50%;top:6rem;width:2.4rem;height:2.4rem;margin-left:-1.2rem;border-radius:50%;background:radial-gradient(circle at 40% 35%,color-mix(in oklab,var(--vibeui-gadget-003-shell) 70%,#fff),color-mix(in oklab,var(--vibeui-gadget-003-shell) 50%,#000));box-shadow:inset 0 0 0 2px color-mix(in oklab,var(--vibeui-gadget-003-shell) 60%,#fff)}
[data-vibeui-block="gadget-003"] [data-part="dome"]{position:absolute;left:50%;top:2.8rem;width:10rem;height:3.2rem;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#fff 0%,var(--vibeui-gadget-003-light) 42%,color-mix(in oklab,var(--vibeui-gadget-003-light) 55%,#000) 100%);box-shadow:0 0 40px color-mix(in oklab,var(--vibeui-gadget-003-light) 80%,transparent),0 0 110px color-mix(in oklab,var(--vibeui-gadget-003-light) 45%,transparent)}
[data-vibeui-block="gadget-003"] [data-part="swatches"]{display:flex;gap:.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="gadget-003"] [data-part="swatch"]{display:grid;justify-items:center;gap:.4rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;font-size:.72rem;cursor:pointer}
[data-vibeui-block="gadget-003"] [data-part="swatch"] i{display:block;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--vibeui-gadget-003-sw);box-shadow:inset 0 -6px 10px rgb(0 0 0/.25),0 0 0 2px var(--vibeui-gadget-003-bg),0 0 0 3px var(--vibeui-gadget-003-line);transition:transform .2s,box-shadow .2s}
[data-vibeui-block="gadget-003"] [data-part="swatch"][aria-pressed="true"] i{transform:scale(1.1);box-shadow:inset 0 -6px 10px rgb(0 0 0/.25),0 0 0 2px var(--vibeui-gadget-003-bg),0 0 0 4px var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="swatch"]:focus-visible{outline:2px solid var(--vibeui-gadget-003-accent);outline-offset:3px;border-radius:.6rem}
[data-vibeui-block="gadget-003"] [data-part="swatch"] span{color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="swatch"][aria-pressed="true"] span{color:var(--vibeui-gadget-003-fg);font-weight:600}
[data-vibeui-block="gadget-003"] [data-part="form"]{display:grid;gap:1.4rem;align-content:start}
[data-vibeui-block="gadget-003"] [data-part="kits"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="gadget-003"] [data-part="kit"]{position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.9rem;padding:1rem 1.1rem;border-radius:1.1rem;border:1px solid var(--vibeui-gadget-003-line);background:var(--vibeui-gadget-003-glass);cursor:pointer;transition:border-color .2s,transform .2s}
[data-vibeui-block="gadget-003"] [data-part="kit"]:hover{transform:translateY(-1px)}
[data-vibeui-block="gadget-003"] [data-part="kit"][data-on="true"]{border-color:var(--vibeui-gadget-003-accent);box-shadow:0 0 0 1px var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="kit"] input{position:absolute;opacity:0;width:1px;height:1px}
[data-vibeui-block="gadget-003"] [data-part="kit"]:has(input:focus-visible){outline:2px solid var(--vibeui-gadget-003-accent);outline-offset:2px}
[data-vibeui-block="gadget-003"] [data-part="radio"]{width:1.15rem;height:1.15rem;border-radius:50%;border:2px solid var(--vibeui-gadget-003-muted);display:grid;place-items:center}
[data-vibeui-block="gadget-003"] [data-part="kit"][data-on="true"] [data-part="radio"]{border-color:var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="kit"][data-on="true"] [data-part="radio"]::after{content:"";width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="kit"] b{display:block;font-weight:600}
[data-vibeui-block="gadget-003"] [data-part="kit"] small{display:block;font-size:.8rem;color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="kit"] output{font-family:var(--vibeui-gadget-003-mono);font-size:.9rem;white-space:nowrap}
[data-vibeui-block="gadget-003"] [data-part="meta"]{display:grid;gap:1rem;padding:1.2rem;border-radius:1.2rem;border:1px solid var(--vibeui-gadget-003-line)}
[data-vibeui-block="gadget-003"] [data-part="row"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;font-size:.85rem;color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="row"] b{color:var(--vibeui-gadget-003-fg);font-weight:600}
[data-vibeui-block="gadget-003"] [data-part="count"]{display:flex;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="gadget-003"] [data-part="count"] li{flex:1;display:grid;justify-items:center;gap:.1rem;padding:.6rem .3rem;border-radius:.8rem;background:var(--vibeui-gadget-003-glass)}
[data-vibeui-block="gadget-003"] [data-part="count"] b{font-family:var(--vibeui-gadget-003-display);font-weight:700;font-size:clamp(1.3rem,3cqi,1.8rem);line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="gadget-003"] [data-part="count"] small{font-family:var(--vibeui-gadget-003-mono);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="bar"]{height:.5rem;border-radius:999px;background:var(--vibeui-gadget-003-line);overflow:hidden}
[data-vibeui-block="gadget-003"] [data-part="bar"] i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-gadget-003-accent),var(--vibeui-gadget-003-light));transform-origin:left;transform:scaleX(var(--vibeui-gadget-003-w));animation:vibeui-gadget-003-grow 1.4s cubic-bezier(.2,.7,.2,1) both}
[data-vibeui-block="gadget-003"] [data-part="magnet"]{display:grid;justify-items:start;gap:.7rem}
[data-vibeui-block="gadget-003"] [data-part="button"]{position:relative;display:inline-flex;align-items:center;gap:.7rem;padding:1.1rem 1.8rem;border-radius:999px;border:0;background:var(--vibeui-gadget-003-accent);color:var(--vibeui-gadget-003-on-accent);font:inherit;font-weight:700;font-size:1.05rem;cursor:pointer;transition:transform .5s cubic-bezier(.2,.7,.2,1),box-shadow .3s;will-change:transform}
[data-vibeui-block="gadget-003"] [data-part="button"]:hover{box-shadow:0 20px 50px -16px var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-gadget-003-fg);outline-offset:3px}
[data-vibeui-block="gadget-003"] [data-part="button"] span{display:inline-block;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="gadget-003"] [data-part="button"] output{font-family:var(--vibeui-gadget-003-mono);font-weight:500;font-size:.9rem;padding:.3rem .6rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-gadget-003-on-accent) 12%,transparent)}
[data-vibeui-block="gadget-003"] [data-part="fine"]{margin:0;font-size:.8rem;color:var(--vibeui-gadget-003-muted)}
[data-vibeui-block="gadget-003"] [data-part="done"]{display:grid;gap:.8rem;justify-items:start;padding:1.5rem;border-radius:1.2rem;border:1px solid var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="done"] svg{width:3.4rem;height:3.4rem;color:var(--vibeui-gadget-003-accent)}
[data-vibeui-block="gadget-003"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-gadget-003-draw .8s ease-out forwards}
[data-vibeui-block="gadget-003"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-gadget-003-draw .5s ease-out .5s forwards}
[data-vibeui-block="gadget-003"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-gadget-003-display);font-weight:700;font-size:1.3rem}
[data-vibeui-block="gadget-003"] [data-part="done"] p{margin:0;color:var(--vibeui-gadget-003-muted)}
@keyframes vibeui-gadget-003-grow{from{transform:scaleX(0)}}
@keyframes vibeui-gadget-003-draw{to{stroke-dashoffset:0}}
@container (min-width: 60rem){[data-vibeui-block="gadget-003"] [data-part="stage"]{grid-template-columns:1fr 1.1fr;gap:3rem;align-items:start}[data-vibeui-block="gadget-003"] [data-part="preview"]{position:sticky;top:5rem;padding:3rem 2rem 2rem}[data-vibeui-block="gadget-003"] [data-part="lamp"]{width:16rem;height:23rem}[data-vibeui-block="gadget-003"] [data-part="body"]{width:12rem;height:15.4rem}[data-vibeui-block="gadget-003"] [data-part="dome"]{width:12rem;height:3.8rem;top:3.7rem}[data-vibeui-block="gadget-003"] [data-part="base"]{width:14rem}[data-vibeui-block="gadget-003"] [data-part="foot"]{width:15rem}[data-vibeui-block="gadget-003"] [data-part="body"]::after{top:7.4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gadget-003"] *{animation:none!important;transition:none!important}[data-vibeui-block="gadget-003"] [data-part="done"] circle,[data-vibeui-block="gadget-003"] [data-part="done"] path{stroke-dashoffset:0}}`

let now = 0
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((fn) => fn())
    }, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

function getSnapshot(): number | null {
  return now || null
}

function getServerSnapshot(): number | null {
  return null
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

const DEFAULT_SWATCHES: Gadget003Swatch[] = [
  { name: "Графит", color: "#2b2b2b" },
  { name: "Песок", color: "#cdb994" },
  { name: "Шалфей", color: "#7d8c76" },
]

const DEFAULT_KITS: Gadget003Kit[] = [
  { name: "Луч", price: 14900, note: "Лампа, кабель USB-C 2 м, блок питания" },
  { name: "Луч + подставка", price: 17900, note: "Плюс подставка с беспроводной зарядкой для телефона" },
  { name: "Пара", price: 27900, note: "Две лампы на две тумбочки, синхронный рассвет" },
]

/** Предзаказ гаджета: свотчи, комплект, отсчёт до отгрузки, магнитная кнопка. */
export function Gadget003({
  eyebrow = "Предзаказ · партия 2",
  title = "Место в партии стоит тысячу рублей",
  lede = "Остальное — при отгрузке. Передумали — вернём предоплату в тот же день, без вопросов.",
  swatches = DEFAULT_SWATCHES,
  kits = DEFAULT_KITS,
  shipInDays = 21,
  batchSize = 1000,
  batchLeft = 312,
  actionLabel = "Оформить предзаказ",
  fine = "Предоплата 1 000 ₽ входит в цену. Доставка по России бесплатно.",
  doneTitle = "Место закреплено",
  doneText = "Номер в партии — 0689. Письмо с подтверждением уже ушло, напомним за три дня до отгрузки.",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Gadget003Props) {
  const [swatch, setSwatch] = useState(0)
  const [kit, setKit] = useState(0)
  const [done, setDone] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  let ship: { date: string; d: number; h: number; m: number; s: number } | null = null
  if (time !== null) {
    const target = new Date(time)
    target.setHours(0, 0, 0, 0)
    target.setDate(target.getDate() + shipInDays)
    const diff = Math.max(0, target.getTime() - time)
    ship = {
      date: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(target),
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }

  const magnet = (event: PointerEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button || event.pointerType !== "mouse") return
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.35}px)`
    if (labelRef.current) labelRef.current.style.transform = `translate(${x * 0.12}px, ${y * 0.15}px)`
  }

  const release = () => {
    if (buttonRef.current) buttonRef.current.style.transform = ""
    if (labelRef.current) labelRef.current.style.transform = ""
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-gadget-003-accent": accent } : null),
    ...(ink ? { "--vibeui-gadget-003-fg": ink } : null),
    ...(background ? { "--vibeui-gadget-003-bg": background } : null),
    "--vibeui-gadget-003-shell": swatches[swatch]?.color ?? "#2b2b2b",
    ...style,
  } as CSSProperties

  const price = kits[kit]?.price ?? 0

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-gadget-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="gadget-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="stage">
            <div data-part="preview">
              <div data-part="lamp" aria-hidden="true">
                <i data-part="foot" />
                <i data-part="base" />
                <i data-part="body" />
                <i data-part="dome" />
              </div>
              <ul data-part="swatches" aria-label="Цвет корпуса">
                {swatches.map((item, index) => (
                  <li key={item.name}>
                    <button data-part="swatch" type="button" aria-pressed={swatch === index} onClick={() => setSwatch(index)} style={{ ["--vibeui-gadget-003-sw" as string]: item.color }}>
                      <i aria-hidden="true" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {done ? (
              <div data-part="done" aria-live="polite">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="32" cy="32" r="25" />
                  <path d="M21 33l8 8 14-16" />
                </svg>
                <h3>{doneTitle}</h3>
                <p>{doneText}</p>
              </div>
            ) : (
              <form data-part="form" onSubmit={submit}>
                <ul data-part="kits" aria-label="Комплект">
                  {kits.map((item, index) => (
                    <li key={item.name}>
                      <label data-part="kit" data-on={kit === index}>
                        <input type="radio" name="vibeui-gadget-003-kit" checked={kit === index} onChange={() => setKit(index)} />
                        <i data-part="radio" aria-hidden="true" />
                        <span>
                          <b>{item.name}</b>
                          <small>{item.note}</small>
                        </span>
                        <output>{formatMoney(item.price, currency)}</output>
                      </label>
                    </li>
                  ))}
                </ul>
                <div data-part="meta">
                  <div data-part="row">
                    <span>Отгрузка партии</span>
                    <b>{ship ? ship.date : "—"}</b>
                  </div>
                  <ul data-part="count" aria-label="До отгрузки">
                    <li>
                      <b>{ship ? ship.d : "–"}</b>
                      <small>дн</small>
                    </li>
                    <li>
                      <b>{ship ? String(ship.h).padStart(2, "0") : "–"}</b>
                      <small>час</small>
                    </li>
                    <li>
                      <b>{ship ? String(ship.m).padStart(2, "0") : "–"}</b>
                      <small>мин</small>
                    </li>
                    <li>
                      <b>{ship ? String(ship.s).padStart(2, "0") : "–"}</b>
                      <small>сек</small>
                    </li>
                  </ul>
                  <div data-part="row">
                    <span>Осталось в партии</span>
                    <b>
                      {batchLeft} из {batchSize}
                    </b>
                  </div>
                  <div data-part="bar" aria-hidden="true">
                    <i style={{ ["--vibeui-gadget-003-w" as string]: Math.min(1, batchLeft / Math.max(1, batchSize)) }} />
                  </div>
                </div>
                <div data-part="magnet">
                  <button data-part="button" type="submit" ref={buttonRef} onPointerMove={magnet} onPointerLeave={release}>
                    <span ref={labelRef}>{actionLabel}</span>
                    <output>{formatMoney(price, currency)}</output>
                  </button>
                  {fine ? <p data-part="fine">{fine}</p> : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
