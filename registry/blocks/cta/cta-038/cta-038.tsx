"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"

export type Cta038Props = {
  eyebrow?: string
  title?: string
  lede?: string
  image?: string
  phoneLabel?: string
  phonePlaceholder?: string
  channelsLabel?: string
  channels?: readonly string[]
  submitLabel?: string
  successTitle?: string
  successText?: string
  estimateLabel?: string
  consent?: string
  /** Имя CustomEvent с расчётом из калькулятора. */
  eventName?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Финальная заявка на ночном фото дома у воды: фон медленно дышит
// масштабом, поверх — стеклянная форма с одним полем телефона и выбором
// канала связи. Если на странице считали дом в калькуляторе, его итог
// приходит CustomEvent'ом и встаёт в форму чипом. После отправки галочка
// прорисовывается штрихом.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="cta-038"]'
const STYLES = `
:where(${S}){
--vibeui-cta-038-bg:light-dark(#1b1d20,#0e0f10);
--vibeui-cta-038-fg:#f2efe9;
--vibeui-cta-038-accent:#e8a35c;
--vibeui-cta-038-on-accent:oklch(from var(--vibeui-cta-038-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-038-muted:color-mix(in oklab,var(--vibeui-cta-038-fg) 66%,transparent);
--vibeui-cta-038-line:color-mix(in oklab,var(--vibeui-cta-038-fg) 18%,transparent);
--vibeui-cta-038-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-038-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{position:relative;isolation:isolate;overflow:hidden;padding:clamp(5rem,12cqi,10rem) 0;background:var(--vibeui-cta-038-bg);color:var(--vibeui-cta-038-fg);font-family:var(--vibeui-cta-038-font)}
${S} *{box-sizing:border-box}
${S} [data-part="bg"]{position:absolute;inset:0;z-index:-1;width:100%;height:100%;object-fit:cover;animation:vibeui-cta-038-breathe 18s ease-in-out infinite alternate}
${S}::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgb(8 9 10 / .82) 0%,rgb(8 9 10 / .35) 60%,rgb(8 9 10 / .55) 100%),linear-gradient(0deg,rgb(8 9 10 / .6),transparent 40%)}
${S} [data-part="shell"]{display:grid;gap:2.5rem;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem);align-items:center}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-cta-038-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-cta-038-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-cta-038-accent)}
${S} [data-part="title"]{margin:0;max-width:12ch;font-weight:300;font-size:clamp(2.6rem,7cqi,6rem);line-height:.95;letter-spacing:-.045em}
${S} [data-part="title"] em{font-style:normal;color:var(--vibeui-cta-038-accent)}
${S} [data-part="lede"]{max-width:30rem;margin:1.2rem 0 0;color:var(--vibeui-cta-038-muted)}
${S} [data-part="form"]{position:relative;padding:clamp(1.2rem,2.6cqi,2rem);border:1px solid var(--vibeui-cta-038-line);border-radius:1.8rem;background:rgb(16 18 20 / .5);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);box-shadow:0 40px 80px -40px rgb(0 0 0 / .8)}
${S} [data-part="chip"]{display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;padding:.6rem .9rem;border:1px solid color-mix(in oklab,var(--vibeui-cta-038-accent) 50%,transparent);border-radius:1rem;background:color-mix(in oklab,var(--vibeui-cta-038-accent) 12%,transparent);font-size:.8rem;animation:vibeui-cta-038-pop .6s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="chip"] small{display:block;font-size:.66rem;color:var(--vibeui-cta-038-muted)}
${S} [data-part="chip"] b{font-family:var(--vibeui-cta-038-mono);font-weight:500}
${S} label{display:block;margin-bottom:.5rem;font-size:.78rem;color:var(--vibeui-cta-038-muted)}
${S} input[type="tel"]{width:100%;height:3.4rem;padding:0 1.2rem;border:1px solid var(--vibeui-cta-038-line);border-radius:999px;background:rgb(242 239 233 / .06);color:inherit;font-family:var(--vibeui-cta-038-mono);font-size:1.05rem;transition:border-color .3s,background-color .3s}
${S} input[type="tel"]::placeholder{color:color-mix(in oklab,var(--vibeui-cta-038-fg) 38%,transparent)}
${S} input[type="tel"]:focus{outline:none;border-color:var(--vibeui-cta-038-accent);background:rgb(242 239 233 / .1)}
${S} [data-part="channels"]{display:flex;gap:.35rem;margin:1rem 0 0;padding:.3rem;border:1px solid var(--vibeui-cta-038-line);border-radius:999px}
${S} [data-part="channels"] button{flex:1;height:2.5rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-cta-038-muted);font:inherit;font-size:.8rem;cursor:pointer;transition:background-color .35s,color .35s}
${S} [data-part="channels"] button[aria-pressed="true"]{background:var(--vibeui-cta-038-fg);color:#111}
${S} [data-part="submit"]{display:flex;align-items:center;justify-content:space-between;width:100%;height:3.4rem;margin-top:1rem;padding:0 .45rem 0 1.4rem;border:0;border-radius:999px;background:var(--vibeui-cta-038-accent);color:var(--vibeui-cta-038-on-accent);font:inherit;font-weight:600;cursor:pointer;transition:filter .3s}
${S} [data-part="submit"] i{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;background:var(--vibeui-cta-038-on-accent);color:var(--vibeui-cta-038-accent);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]:hover i{transform:rotate(45deg)}
${S} [data-part="submit"] svg{width:1rem;height:1rem}
${S} [data-part="consent"]{margin:.9rem 0 0;font-size:.68rem;color:var(--vibeui-cta-038-muted)}
${S} [data-part="done"]{display:grid;justify-items:start;gap:.5rem;padding:1rem 0;animation:vibeui-cta-038-pop .6s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="done"] svg{width:3.6rem;height:3.6rem;color:var(--vibeui-cta-038-accent)}
${S} [data-part="done"] path{stroke-dasharray:60;stroke-dashoffset:60;animation:vibeui-cta-038-draw .9s .2s cubic-bezier(.6,0,.2,1) forwards}
${S} [data-part="done"] h3{margin:.4rem 0 0;font-size:1.5rem;font-weight:400;letter-spacing:-.02em}
${S} [data-part="done"] p{margin:0;color:var(--vibeui-cta-038-muted)}
${S} button:focus-visible{outline:2px solid var(--vibeui-cta-038-accent);outline-offset:2px}
@keyframes vibeui-cta-038-breathe{from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes vibeui-cta-038-pop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes vibeui-cta-038-draw{to{stroke-dashoffset:0}}
@container (min-width: 60rem){${S} [data-part="shell"]{grid-template-columns:minmax(0,1.2fr) minmax(0,26rem);gap:4rem;justify-content:space-between}}
@media (prefers-reduced-motion:reduce){${S} *{animation:none!important;transition:none!important}${S} [data-part="done"] path{stroke-dashoffset:0}}
${S} [data-part="submit"]{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-cta-038-fg);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="submit"]:hover{color:#111;box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-cta-038-fg) 70%,transparent)}
${S} [data-part="submit"]:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="submit"] i{overflow:hidden}
${S} [data-part="submit"]:hover i{transform:none}
${S} [data-part="submit"]:hover i svg{animation:vibeui-cta-038-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="channels"] button{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="channels"] button:active{transform:scale(.95);transition-duration:.1s}
${S} [data-part="channels"] button[aria-pressed="true"]{animation:vibeui-cta-038-pop .45s cubic-bezier(.3,1.6,.5,1)}
@keyframes vibeui-cta-038-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-cta-038-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

/** Заявка на фото-фоне: телефон, канал связи и расчёт из калькулятора. */
export function Cta038({
  eyebrow = "Обсудить дом",
  title = "Ваш дом у воды — уже этой осенью",
  lede = "Оставьте телефон: инженер перезвонит, подберёт проект под участок и бюджет и пригласит на экскурсию в построенный дом.",
  image = "/demo/house/cta.webp",
  phoneLabel = "Телефон",
  phonePlaceholder = "+7 (___) ___-__-__",
  channelsLabel = "Как связаться",
  channels = ["Звонок", "Telegram", "WhatsApp"],
  submitLabel = "Обсудить мой дом",
  successTitle = "Заявка принята",
  successText = "Инженер свяжется с вами в течение 15 минут.",
  estimateLabel = "Ваш расчёт",
  consent = "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.",
  eventName = "vibeui-house:estimate",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Cta038Props) {
  const [channel, setChannel] = useState(0)
  const [phone, setPhone] = useState("")
  const [estimate, setEstimate] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const listen = (event: Event) => {
      const detail = (event as CustomEvent<{ text?: string }>).detail
      if (detail?.text) setEstimate(detail.text)
    }
    window.addEventListener(eventName, listen)
    return () => window.removeEventListener(eventName, listen)
  }, [eventName])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (phone.replace(/\D/g, "").length >= 10) setSent(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-038-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-038-fg": ink } : null),
    ...(background ? { "--vibeui-cta-038-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-038" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-038" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="bg" src={image} alt="" loading="lazy" /> : null}
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="form">
            {sent ? (
              <div data-part="done" role="status">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M24 4a20 20 0 1 1 0 40 20 20 0 0 1 0-40Z" opacity=".35" style={{ animationDelay: "0s" }} />
                  <path d="m15 24 6 6 12-12" />
                </svg>
                <h3>{successTitle}</h3>
                <p>{successText}</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {estimate ? (
                  <div data-part="chip">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M2 7.5 8 2.5l6 5V14H2Z" />
                    </svg>
                    <span>
                      <small>{estimateLabel}</small>
                      <b>{estimate}</b>
                    </span>
                  </div>
                ) : null}
                <label htmlFor="vibeui-cta-038-phone">{phoneLabel}</label>
                <input id="vibeui-cta-038-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder={phonePlaceholder} value={phone} onChange={(event) => setPhone(event.target.value)} />
                <div data-part="channels" role="group" aria-label={channelsLabel}>
                  {channels.map((item, itemIndex) => (
                    <button key={item} type="button" aria-pressed={itemIndex === channel} onClick={() => setChannel(itemIndex)}>
                      {item}
                    </button>
                  ))}
                </div>
                <button data-part="submit" type="submit">
                  {submitLabel}
                  <i aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M5 11 11 5M6 5h5v5" />
                    </svg>
                  </i>
                </button>
                {consent ? <p data-part="consent">{consent}</p> : null}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
