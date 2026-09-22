"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Cta030Channel = {
  id: string
  label: string
  /** Что обещаем после отправки. */
  promise: string
}

export type Cta030Estimate = {
  number?: string
  area?: number
  type?: string
  price?: number
  weeks?: number
  currency?: string
}

export type Cta030Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  actionLabel?: string
  channels?: readonly Cta030Channel[]
  defaultChannel?: string
  /** Имя CustomEvent, из которого форма подхватывает смету калькулятора. */
  eventName?: string
  estimateLabel?: string
  doneTitle?: string
  fine?: string
  /** Текст после отправки; {n} — номер жирным. */
  doneLine?: string
  estimateLine?: string
  numberPrefix?: string
  areaUnit?: string
  weekShort?: string
  detachLabel?: string
  phoneLabel?: string
  channelsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Заявка «одно поле — одна кнопка» на сигнально-жёлтой плите с полосами
// ограждения по краям. Поле телефона и переключатель «звонок / Telegram /
// WhatsApp», под ним обещание канала. Форма слушает CustomEvent от
// калькулятора сметы и прикрепляет смету чипом: номер, площадь, тип, цена,
// срок — с крестиком «открепить». После отправки плита показывает галочку,
// которая прорисовывается, и номер заявки. Ничего не отправляет наружу.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-030"]){
--vibeui-cta-030-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-030-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-030-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-030-on-accent:oklch(from var(--vibeui-cta-030-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-030-muted:color-mix(in oklab,var(--vibeui-cta-030-fg) 62%,var(--vibeui-cta-030-bg));
--vibeui-cta-030-line:color-mix(in oklab,var(--vibeui-cta-030-fg) 16%,transparent);
--vibeui-cta-030-grid:color-mix(in oklab,var(--vibeui-cta-030-fg) 7%,transparent);
--vibeui-cta-030-plate-line:color-mix(in oklab,var(--vibeui-cta-030-on-accent) 22%,transparent);
--vibeui-cta-030-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-030-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-030-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-030"]{color-scheme:dark}
:where([data-vibeui-block="cta-030"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-030"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-030"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-cta-030-bg);background-image:linear-gradient(var(--vibeui-cta-030-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-cta-030-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-cta-030-fg);font-family:var(--vibeui-cta-030-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-030"] *{box-sizing:border-box}
[data-vibeui-block="cta-030"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-030"] [data-part="plate"]{position:relative;padding:clamp(2rem,5cqi,3.5rem) clamp(1.25rem,5cqi,3.5rem);background:var(--vibeui-cta-030-accent);color:var(--vibeui-cta-030-on-accent);border:1px solid color-mix(in oklab,var(--vibeui-cta-030-on-accent) 30%,transparent);box-shadow:0 40px 80px -50px rgb(0 0 0 / .6)}
[data-vibeui-block="cta-030"] [data-part="plate"]::before,[data-vibeui-block="cta-030"] [data-part="plate"]::after{content:"";position:absolute;top:0;bottom:0;width:.9rem;background:repeating-linear-gradient(-45deg,var(--vibeui-cta-030-on-accent) 0 .6rem,transparent .6rem 1.2rem);opacity:.85}
[data-vibeui-block="cta-030"] [data-part="plate"]::before{left:0}
[data-vibeui-block="cta-030"] [data-part="plate"]::after{right:0}
[data-vibeui-block="cta-030"] [data-part="inner"]{display:grid;gap:1.6rem;max-width:56rem;margin:0 auto;padding:0 .6rem}
[data-vibeui-block="cta-030"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-cta-030-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
[data-vibeui-block="cta-030"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-030-display);font-weight:800;font-size:clamp(2rem,5.5cqi,3.8rem);line-height:.98;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="cta-030"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;opacity:.8}
[data-vibeui-block="cta-030"] [data-part="estimate"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .9rem;padding:.7rem .9rem;border:1px dashed var(--vibeui-cta-030-on-accent);font-family:var(--vibeui-cta-030-mono);font-size:.78rem;font-variant-numeric:tabular-nums;animation:vibeui-cta-030-in .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-030"] [data-part="estimate"] b{font-weight:600}
[data-vibeui-block="cta-030"] [data-part="estimate"] button{margin-left:auto;width:1.6rem;height:1.6rem;border:1px solid var(--vibeui-cta-030-plate-line);border-radius:50%;background:transparent;color:inherit;font:inherit;font-size:1rem;line-height:1;cursor:pointer}
[data-vibeui-block="cta-030"] [data-part="fields"]{display:grid;gap:.9rem}
[data-vibeui-block="cta-030"] [data-part="form"]{display:grid;gap:.7rem}
[data-vibeui-block="cta-030"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="cta-030"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="cta-030"] [data-part="channels"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="cta-030"] [data-part="channel"]{padding:.5rem .9rem;border:1px solid var(--vibeui-cta-030-on-accent);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;transition:background .2s,color .2s}
[data-vibeui-block="cta-030"] [data-part="channel"][aria-checked="true"]{background:var(--vibeui-cta-030-on-accent);color:var(--vibeui-cta-030-accent)}
[data-vibeui-block="cta-030"] [data-part="channel"]:focus-visible{outline:2px solid var(--vibeui-cta-030-on-accent);outline-offset:2px}
[data-vibeui-block="cta-030"] [data-part="promise"]{margin:0;font-family:var(--vibeui-cta-030-mono);font-size:.74rem;opacity:.8}
[data-vibeui-block="cta-030"] [data-part="fine"]{margin:0;font-size:.78rem;opacity:.7}
[data-vibeui-block="cta-030"] [data-part="done"]{display:grid;justify-items:start;gap:.8rem;padding:.5rem 0}
[data-vibeui-block="cta-030"] [data-part="done"] svg{width:4rem;height:4rem}
[data-vibeui-block="cta-030"] [data-part="done"] rect{stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-cta-030-draw .7s ease-out forwards}
[data-vibeui-block="cta-030"] [data-part="done"] path{stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-cta-030-draw .45s ease-out .5s forwards}
[data-vibeui-block="cta-030"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-030-display);font-weight:800;font-size:clamp(1.6rem,4cqi,2.4rem);letter-spacing:-.03em;line-height:1.05}
[data-vibeui-block="cta-030"] [data-part="done"] p{margin:0;opacity:.85}
[data-vibeui-block="cta-030"] [data-part="done"] b{font-family:var(--vibeui-cta-030-mono);font-weight:600}
@keyframes vibeui-cta-030-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-cta-030-in{from{opacity:0;transform:translateY(-4px)}}
@container (min-width: 40rem){[data-vibeui-block="cta-030"] [data-part="form"]{grid-template-columns:minmax(0,1fr) auto}}
@container (min-width: 60rem){[data-vibeui-block="cta-030"] [data-part="inner"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem;align-items:center;max-width:none}[data-vibeui-block="cta-030"] [data-part="form"]{grid-template-columns:1fr}[data-vibeui-block="cta-030"] [data-part="plate"]{padding-left:4rem;padding-right:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-030"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-030"] [data-part="done"] rect,[data-vibeui-block="cta-030"] [data-part="done"] path{stroke-dashoffset:0}}`

const DEFAULT_CHANNELS: Cta030Channel[] = [
  { id: "call", label: "Позвоните мне", promise: "Перезвоним в течение 15 минут с 9:00 до 21:00" },
  { id: "telegram", label: "Telegram", promise: "Напишем в Telegram, без звонков" },
  { id: "whatsapp", label: "WhatsApp", promise: "Напишем в WhatsApp, без звонков" },
]

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Заявка одним полем с выбором канала, подхватывает смету калькулятора. */
export function Cta030({
  eyebrow = "Заявка",
  title = "Замер бесплатный, смета — в тот же день",
  lede = "Приедем с лазерным дальномером, через два часа пришлём смету с датами этапов. Договор — только если цифры устроят.",
  placeholder = "+7 ___ ___-__-__",
  actionLabel = "Записаться на замер",
  channels = DEFAULT_CHANNELS,
  defaultChannel = "call",
  eventName = "vibeui-renovation:estimate",
  estimateLabel = "К заявке прикреплена смета",
  doneTitle = "Заявка принята",
  fine = "Никаких рассылок: один звонок или одно сообщение по делу.",
  doneLine = "Заявка {n}. {promise}.",
  estimateLine = "Смета {n} прикреплена.",
  numberPrefix = "№",
  areaUnit = "м²",
  weekShort = "нед",
  detachLabel = "Открепить смету",
  phoneLabel = "Телефон",
  channelsLabel = "Как связаться",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta030Props) {
  const [channel, setChannel] = useState(defaultChannel)
  const [estimate, setEstimate] = useState<Cta030Estimate | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const current = channels.find((item) => item.id === channel) ?? channels[0]

  useEffect(() => {
    const onEstimate = (event: Event) => {
      const detail = (event as CustomEvent<Cta030Estimate>).detail
      if (detail) setEstimate(detail)
    }
    window.addEventListener(eventName, onEstimate)
    return () => window.removeEventListener(eventName, onEstimate)
  }, [eventName])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const phone = new FormData(event.currentTarget).get("phone")
    const digits = String(phone ?? "").replace(/\D/g, "")
    setDone(String(4100 + (Number(digits.slice(-4)) || 0) % 900))
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-030-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-030-fg": ink } : null),
    ...(background ? { "--vibeui-cta-030-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-030" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-030" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="plate">
            <div data-part="inner" aria-live="polite">
              {done ? (
                <div data-part="done">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="6" y="6" width="52" height="52" pathLength={1} />
                    <path d="M20 33l9 9 16-19" pathLength={1} />
                  </svg>
                  <h3>{doneTitle}</h3>
                  <p>
                    {doneLine.split("{n}")[0]}
                    <b>
                      {numberPrefix} {done}
                    </b>
                    {(doneLine.split("{n}")[1] ?? "").replace("{promise}", current.promise)}
                    {estimate ? (
                      <>
                        {" "}
                        {estimateLine.split("{n}")[0]}
                        <b>
                          {numberPrefix} {estimate.number}
                        </b>
                        {estimateLine.split("{n}")[1]}
                      </>
                    ) : null}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                    <h2 data-part="title">{title}</h2>
                    {lede ? <p data-part="lede">{lede}</p> : null}
                  </div>
                  <div data-part="fields">
                    {estimate ? (
                      <div data-part="estimate">
                        <span>{estimateLabel}</span>
                        {estimate.number ? <b>{numberPrefix} {estimate.number}</b> : null}
                        {estimate.area ? <span>{estimate.area} {areaUnit}</span> : null}
                        {estimate.type ? <span>{estimate.type}</span> : null}
                        {estimate.price ? (
                          <b>
                            {formatMoney(estimate.price)} {estimate.currency ?? "₽"}
                          </b>
                        ) : null}
                        {estimate.weeks ? <span>{estimate.weeks} {weekShort}</span> : null}
                        <button type="button" aria-label={detachLabel} onClick={() => setEstimate(null)}>
                          ×
                        </button>
                      </div>
                    ) : null}
                    <form data-part="form" onSubmit={submit}>
                      <Input001 type="tel" name="phone" required label={placeholder} autoComplete="tel" accent={accent} />
                      <Button001 type="submit" size="lg" accent={accent}>
                        {actionLabel}
                      </Button001>
                    </form>
                    <ul data-part="channels" role="radiogroup" aria-label={channelsLabel}>
                      {channels.map((item) => (
                        <li key={item.id}>
                          <button data-part="channel" type="button" role="radio" aria-checked={item.id === current.id} onClick={() => setChannel(item.id)}>
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p data-part="promise">{current.promise}</p>
                    {fine ? <p data-part="fine">{fine}</p> : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
