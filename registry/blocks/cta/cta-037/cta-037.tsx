"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"

export type Cta037Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Суммы на чипах. */
  amounts?: readonly number[]
  defaultAmount?: number
  currency?: string
  onceLabel?: string
  monthlyLabel?: string
  /** Рукописная пометка при ежемесячном платеже; {year} — сумма за год. */
  monthlyNote?: string
  actionLabel?: string
  /** Мелкий текст под кнопкой: комиссия, безопасность, отписка. */
  fine?: readonly string[]
  doneTitle?: string
  doneText?: string
  image?: string
  imageAlt?: string
  caption?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Форма пожертвования: слева фото в бумажной рамке с рукописной подписью,
// справа бланк — чипы сумм и своё поле, переключатель «разово /
// ежемесячно»: при ежемесячном сумма «×12» докручивается до годовой, а
// рядом появляется пометка от руки. Слушает событие vibeui-charity:amount
// из блока «что даёт ваша сумма» и подставляет выбранное. После отправки —
// сердце, которое прорисовывается штрихом. Заглушка: наружу ничего не идёт.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-037"]){
--vibeui-cta-037-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-037-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-037-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-037-on-accent:oklch(from var(--vibeui-cta-037-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-037-muted:color-mix(in oklab,var(--vibeui-cta-037-fg) 62%,var(--vibeui-cta-037-bg));
--vibeui-cta-037-line:color-mix(in oklab,var(--vibeui-cta-037-fg) 16%,transparent);
--vibeui-cta-037-soft:color-mix(in oklab,var(--vibeui-cta-037-fg) 6%,var(--vibeui-cta-037-bg));
--vibeui-cta-037-paper:color-mix(in oklab,#ffffff 60%,var(--vibeui-cta-037-bg));
--vibeui-cta-037-second:color-mix(in oklab,var(--vibeui-cta-037-accent) 45%,#e0b000);
--vibeui-cta-037-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-cta-037-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-037-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-037"]{color-scheme:dark}
:where([data-vibeui-block="cta-037"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-037"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-037"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-037-bg);color:var(--vibeui-cta-037-fg);font-family:var(--vibeui-cta-037-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-037"] *{box-sizing:border-box}
[data-vibeui-block="cta-037"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="cta-037"] [data-part="figure"]{position:relative;margin:0 auto;width:min(100%,32rem);padding:.75rem .75rem 2.8rem;background:var(--vibeui-cta-037-paper);border:1px solid var(--vibeui-cta-037-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .45);transform:rotate(-1.5deg)}
[data-vibeui-block="cta-037"] [data-part="figure"]::before{content:"";position:absolute;top:-.8rem;right:2rem;width:5.5rem;height:1.5rem;transform:rotate(5deg);background:color-mix(in oklab,var(--vibeui-cta-037-second) 55%,transparent);opacity:.85}
[data-vibeui-block="cta-037"] [data-part="photo"]{position:relative;aspect-ratio:3/2;overflow:hidden;background:linear-gradient(135deg,var(--vibeui-cta-037-soft),color-mix(in oklab,var(--vibeui-cta-037-accent) 25%,var(--vibeui-cta-037-bg)))}
[data-vibeui-block="cta-037"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="cta-037"] [data-part="caption"]{position:absolute;left:1rem;right:1rem;bottom:.5rem;margin:0;font-family:var(--vibeui-cta-037-hand);font-size:1.35rem;line-height:1.1;transform:rotate(-1deg)}
[data-vibeui-block="cta-037"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-cta-037-accent)}
[data-vibeui-block="cta-037"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-037-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.2rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="cta-037"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-cta-037-muted)}
[data-vibeui-block="cta-037"] [data-part="form"]{display:grid;gap:1.2rem;margin:1.8rem 0 0;padding:1.5rem;border:1px solid var(--vibeui-cta-037-line);border-radius:1.2rem;background:var(--vibeui-cta-037-paper)}
[data-vibeui-block="cta-037"] [data-part="seg"]{display:grid;grid-template-columns:1fr 1fr;padding:.25rem;border-radius:999px;background:var(--vibeui-cta-037-soft);position:relative}
[data-vibeui-block="cta-037"] [data-part="seg"]::before{content:"";position:absolute;top:.25rem;bottom:.25rem;left:.25rem;width:calc(50% - .25rem);border-radius:999px;background:var(--vibeui-cta-037-bg);box-shadow:0 2px 8px -2px rgb(0 0 0 / .3);transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-037"] [data-part="seg"][data-monthly="true"]::before{transform:translateX(100%)}
[data-vibeui-block="cta-037"] [data-part="seg"] button{position:relative;padding:.6rem .5rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-cta-037-muted);font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;transition:color .2s}
[data-vibeui-block="cta-037"] [data-part="seg"] button[aria-pressed="true"]{color:var(--vibeui-cta-037-fg)}
[data-vibeui-block="cta-037"] [data-part="chips"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="cta-037"] [data-part="chip"]{width:100%;padding:.7rem .4rem;border-radius:.8rem;border:1px solid var(--vibeui-cta-037-line);background:var(--vibeui-cta-037-bg);color:var(--vibeui-cta-037-fg);font:inherit;font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
[data-vibeui-block="cta-037"] [data-part="chip"]:hover{border-color:var(--vibeui-cta-037-accent);transform:translateY(-1px)}
[data-vibeui-block="cta-037"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-cta-037-accent);border-color:var(--vibeui-cta-037-accent);color:var(--vibeui-cta-037-on-accent)}
[data-vibeui-block="cta-037"] [data-part="own"]{position:relative;display:flex;align-items:center}
[data-vibeui-block="cta-037"] [data-part="own"] input{width:100%;height:3.4rem;padding:0 3rem 0 1rem;border-radius:.8rem;border:1px solid var(--vibeui-cta-037-line);background:var(--vibeui-cta-037-bg);color:var(--vibeui-cta-037-fg);font:inherit;font-weight:600;font-size:1.1rem;font-variant-numeric:tabular-nums;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="cta-037"] [data-part="own"] input:focus-visible{border-color:var(--vibeui-cta-037-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-cta-037-accent) 22%,transparent)}
[data-vibeui-block="cta-037"] [data-part="own"] span{position:absolute;right:1rem;color:var(--vibeui-cta-037-muted);font-weight:600}
[data-vibeui-block="cta-037"] [data-part="year"]{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:.2rem .9rem;padding:.9rem 1rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-cta-037-accent) 10%,var(--vibeui-cta-037-bg));animation:vibeui-cta-037-in .4s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="cta-037"] [data-part="year"] strong{font-family:var(--vibeui-cta-037-display);font-weight:700;font-size:1.6rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="cta-037"] [data-part="year"] strong small{font-family:var(--vibeui-cta-037-font);font-weight:500;font-size:.8rem;color:var(--vibeui-cta-037-muted);margin-left:.4rem;letter-spacing:0}
[data-vibeui-block="cta-037"] [data-part="year"] em{font-family:var(--vibeui-cta-037-hand);font-style:normal;font-size:1.3rem;line-height:1.1;color:var(--vibeui-cta-037-accent)}
[data-vibeui-block="cta-037"] [data-part="submit"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;height:3.4rem;padding:0 1.6rem;border-radius:999px;border:0;background:var(--vibeui-cta-037-accent);color:var(--vibeui-cta-037-on-accent);font:inherit;font-weight:600;font-size:1.05rem;cursor:pointer;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="cta-037"] [data-part="submit"]:hover{transform:translateY(-1px);box-shadow:0 14px 34px -14px var(--vibeui-cta-037-accent)}
[data-vibeui-block="cta-037"] [data-part="submit"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="cta-037"] button:focus-visible{outline:2px solid var(--vibeui-cta-037-fg);outline-offset:2px}
[data-vibeui-block="cta-037"] [data-part="fine"]{display:flex;flex-wrap:wrap;gap:.3rem 1.1rem;margin:0;padding:0;list-style:none;font-size:.78rem;color:var(--vibeui-cta-037-muted)}
[data-vibeui-block="cta-037"] [data-part="fine"] li::before{content:"✓ ";color:var(--vibeui-cta-037-accent)}
[data-vibeui-block="cta-037"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;padding:1.5rem 0;text-align:center}
[data-vibeui-block="cta-037"] [data-part="done"] svg{width:4.5rem;height:4.5rem;color:var(--vibeui-cta-037-accent)}
[data-vibeui-block="cta-037"] [data-part="done"] path{fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-cta-037-draw 1.2s cubic-bezier(.2,.8,.2,1) forwards}
[data-vibeui-block="cta-037"] [data-part="done"] path + path{animation-delay:.9s;animation-duration:.6s}
[data-vibeui-block="cta-037"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-037-display);font-size:1.5rem;font-weight:700}
[data-vibeui-block="cta-037"] [data-part="done"] p{margin:0;color:var(--vibeui-cta-037-muted)}
[data-vibeui-block="cta-037"] [data-part="done"] em{font-family:var(--vibeui-cta-037-hand);font-style:normal;font-size:1.4rem;color:var(--vibeui-cta-037-accent)}
@keyframes vibeui-cta-037-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes vibeui-cta-037-draw{to{stroke-dashoffset:0}}
@container (min-width: 40rem){[data-vibeui-block="cta-037"] [data-part="chips"]{grid-template-columns:repeat(5,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="cta-037"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-037"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-037"] [data-part="done"] path{stroke-dashoffset:0}}`

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Форма пожертвования: чипы, своя сумма, «разово / ежемесячно» с ×12. */
export function Cta037({
  eyebrow = "Помочь",
  title = "Одна среда в месяц — это вы",
  lede = "Регулярный платёж — самое ценное: мы можем планировать визиты на год вперёд, а не от сбора к сбору. Отменить можно в любой момент, одним письмом.",
  amounts = [300, 500, 1000, 2000, 5000],
  defaultAmount = 1000,
  currency = "₽",
  onceLabel = "Разово",
  monthlyLabel = "Ежемесячно",
  monthlyNote = "за год — {year}. Это 12 визитов к одному человеку",
  actionLabel = "Помочь",
  fine = ["Без комиссии для вас", "Оплата через ЮKassa", "Отписка одним письмом"],
  doneTitle = "Спасибо. Правда.",
  doneText = "Чек придёт на почту, а через месяц — письмо о том, куда ушли деньги.",
  image = "",
  imageAlt = "",
  caption = "Виктор Ильич и Игорь, развоз в Торжке",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta037Props) {
  const [amount, setAmount] = useState(defaultAmount)
  const [custom, setCustom] = useState("")
  const [monthly, setMonthly] = useState(false)
  const [done, setDone] = useState(false)
  const [yearShown, setYearShown] = useState(0)
  const value = custom ? Number(custom) || 0 : amount
  const year = value * 12

  useEffect(() => {
    const onAmount = (event: Event) => {
      const detail = (event as CustomEvent<{ amount?: number }>).detail
      if (detail && typeof detail.amount === "number") {
        setCustom("")
        setAmount(detail.amount)
      }
    }
    window.addEventListener("vibeui-charity:amount", onAmount)
    return () => window.removeEventListener("vibeui-charity:amount", onAmount)
  }, [])

  useEffect(() => {
    if (!monthly) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      const id = window.setTimeout(() => setYearShown(year), 0)
      return () => window.clearTimeout(id)
    }
    let frame = 0
    let start = 0
    const from = value
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / 900)
      const eased = 1 - Math.pow(1 - t, 3)
      setYearShown(Math.round(from + (year - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [monthly, year, value])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (value > 0) setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-037-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-037-fg": ink } : null),
    ...(background ? { "--vibeui-cta-037-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-037" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-037" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <figure data-part="figure">
            <div data-part="photo">{image ? <img src={image} alt={imageAlt} /> : null}</div>
            {caption ? <figcaption data-part="caption">{caption}</figcaption> : null}
          </figure>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <form data-part="form" onSubmit={submit} aria-live="polite">
              {done ? (
                <div data-part="done">
                  <svg viewBox="0 0 64 64" aria-hidden="true">
                    <path d="M32 54S10 41 10 24a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 17-22 30-22 30Z" pathLength={1} />
                    <path d="M24 30l6 6 11-12" pathLength={1} />
                  </svg>
                  <h3>{doneTitle}</h3>
                  <p>{doneText}</p>
                  <em>
                    {formatMoney(value)} {currency} {monthly ? "каждый месяц" : "разово"}
                  </em>
                </div>
              ) : (
                <>
                  <div data-part="seg" data-monthly={monthly} role="group" aria-label="Частота">
                    <button type="button" aria-pressed={!monthly} onClick={() => setMonthly(false)}>
                      {onceLabel}
                    </button>
                    <button type="button" aria-pressed={monthly} onClick={() => setMonthly(true)}>
                      {monthlyLabel}
                    </button>
                  </div>
                  <ul data-part="chips" aria-label="Сумма">
                    {amounts.map((item) => (
                      <li key={item}>
                        <button
                          data-part="chip"
                          type="button"
                          aria-pressed={!custom && amount === item}
                          onClick={() => {
                            setCustom("")
                            setAmount(item)
                          }}
                        >
                          {formatMoney(item)} {currency}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <label data-part="own">
                    <input type="number" inputMode="numeric" min={10} step={10} value={custom} placeholder="Своя сумма" aria-label="Своя сумма" onChange={(event) => setCustom(event.target.value)} />
                    <span aria-hidden="true">{currency}</span>
                  </label>
                  {monthly && value > 0 ? (
                    <div data-part="year">
                      <strong>
                        {formatMoney(value)} × 12<small>=</small>
                      </strong>
                      <em>{monthlyNote.replace("{year}", `${formatMoney(yearShown)} ${currency}`)}</em>
                    </div>
                  ) : null}
                  <button data-part="submit" type="submit">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.6 0 5.8 3.6 4.5 6.8C19.5 16.4 12 21 12 21Z" />
                    </svg>
                    {actionLabel} {value > 0 ? `${formatMoney(value)} ${currency}` : ""}
                    {monthly ? " / мес" : ""}
                  </button>
                  {fine.length > 0 ? (
                    <ul data-part="fine">
                      {fine.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
