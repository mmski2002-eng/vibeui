"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"

export type Cta017Props = {
  eyebrow?: string
  title?: string
  text?: string
  /** Дата и время старта в ISO: «2026-10-06T10:00:00+03:00». */
  startsAt?: string
  /** Подпись под таймером: «до старта потока». */
  countdownLabel?: string
  /** «Осталось 12 мест». */
  seats?: string
  placeholder?: string
  submitLabel?: string
  doneTitle?: string
  doneText?: string
  consent?: string
  /** Куда отправить форму. Пусто — «готово» на месте. */
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Финальный призыв: тёмная карточка с живым обратным отсчётом до старта
// (дни:часы:минуты:секунды, тикает раз в секунду, цифры перелистываются),
// плашка «осталось мест» и форма — email и кнопка. С action уходит POST,
// без него показывает «место за вами». Дата берётся из startsAt.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-017"]){
--vibeui-cta-017-bg:light-dark(#ffffff,#0f1117);
--vibeui-cta-017-fg:light-dark(#111827,#f3f4f6);
--vibeui-cta-017-card:#111827;
--vibeui-cta-017-on-card:#f8fafc;
--vibeui-cta-017-muted:rgb(248 250 252 / .65);
--vibeui-cta-017-line:rgb(248 250 252 / .16);
--vibeui-cta-017-accent:#4f46e5;
--vibeui-cta-017-on-accent:#ffffff;
--vibeui-cta-017-marker:#d9f99d;
--vibeui-cta-017-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-017-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-017"]{color-scheme:dark}
:where([data-vibeui-block="cta-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-017"]{box-sizing:border-box;display:block;background:var(--vibeui-cta-017-bg);color:var(--vibeui-cta-017-fg);font-family:var(--vibeui-cta-017-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="cta-017"] *{box-sizing:border-box}
[data-vibeui-block="cta-017"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="cta-017"] [data-part="card"]{position:relative;overflow:hidden;display:grid;gap:2rem;padding:2.5rem 1.5rem;border-radius:1.5rem;background:var(--vibeui-cta-017-card);color:var(--vibeui-cta-017-on-card);color-scheme:dark}
[data-vibeui-block="cta-017"] [data-part="card"]::before{content:"";position:absolute;right:-20%;top:-60%;width:60cqi;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-cta-017-accent) 55%,transparent),transparent);pointer-events:none}
[data-vibeui-block="cta-017"] [data-part="copy"]{position:relative}
[data-vibeui-block="cta-017"] [data-part="eyebrow"]{display:inline-block;margin:0 0 1rem;padding:.35rem .7rem;border-radius:.5rem;background:var(--vibeui-cta-017-marker);color:#1a2e05;font-family:var(--vibeui-cta-017-display);font-size:.72rem;font-weight:600}
[data-vibeui-block="cta-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-017-display);font-weight:700;font-size:clamp(1.8rem,3.8cqi,2.9rem);line-height:1.08;letter-spacing:-.02em;text-wrap:balance}
[data-vibeui-block="cta-017"] [data-part="text"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-cta-017-muted)}
[data-vibeui-block="cta-017"] [data-part="timer"]{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="cta-017"] [data-part="unit"]{display:grid;justify-items:center;gap:.35rem;padding:.9rem .5rem;border-radius:.9rem;background:rgb(248 250 252 / .06);border:1px solid var(--vibeui-cta-017-line)}
[data-vibeui-block="cta-017"] [data-part="digits"]{position:relative;height:2.2rem;overflow:hidden;font-family:var(--vibeui-cta-017-display);font-size:1.9rem;font-weight:700;line-height:2.2rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="cta-017"] [data-part="digits"] span{display:block;animation:vibeui-cta-017-flip .4s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-cta-017-flip{from{transform:translateY(60%);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="cta-017"] [data-part="unit"] small{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-cta-017-muted)}
[data-vibeui-block="cta-017"] [data-part="timer-label"]{margin:.75rem 0 0;font-size:.8rem;color:var(--vibeui-cta-017-muted);text-align:center}
[data-vibeui-block="cta-017"] [data-part="form"]{position:relative;display:grid;gap:.75rem}
[data-vibeui-block="cta-017"] [data-part="row"]{display:grid;gap:.6rem}
[data-vibeui-block="cta-017"] input[type="email"]{height:3.25rem;padding:0 1.1rem;border-radius:999px;border:1px solid var(--vibeui-cta-017-line);background:rgb(248 250 252 / .06);color:inherit;font:inherit}
[data-vibeui-block="cta-017"] input[type="email"]::placeholder{color:var(--vibeui-cta-017-muted)}
[data-vibeui-block="cta-017"] input:focus-visible,[data-vibeui-block="cta-017"] button:focus-visible{outline:2px solid var(--vibeui-cta-017-marker);outline-offset:2px}
[data-vibeui-block="cta-017"] [data-part="submit"]{height:3.25rem;padding:0 1.5rem;border:0;border-radius:999px;background:var(--vibeui-cta-017-accent);color:var(--vibeui-cta-017-on-accent);font:inherit;font-weight:600;cursor:pointer;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="cta-017"] [data-part="submit"]:hover{transform:translateY(-1px);box-shadow:0 14px 30px -14px var(--vibeui-cta-017-accent)}
[data-vibeui-block="cta-017"] [data-part="seats"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.8rem;color:var(--vibeui-cta-017-muted)}
[data-vibeui-block="cta-017"] [data-part="seats"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-cta-017-marker);box-shadow:0 0 0 3px rgb(217 249 157 / .25)}
[data-vibeui-block="cta-017"] [data-part="consent"]{margin:0;font-size:.72rem;color:var(--vibeui-cta-017-muted)}
[data-vibeui-block="cta-017"] [data-part="done"]{position:relative;display:grid;gap:.4rem;padding:1.5rem;border-radius:1rem;border:1px solid var(--vibeui-cta-017-line);background:rgb(248 250 252 / .06)}
[data-vibeui-block="cta-017"] [data-part="done"] b{font-family:var(--vibeui-cta-017-display);font-size:1.2rem}
[data-vibeui-block="cta-017"] [data-part="done"] span{color:var(--vibeui-cta-017-muted);font-size:.9rem}
@container (min-width: 40rem){[data-vibeui-block="cta-017"] [data-part="row"]{grid-template-columns:minmax(0,1fr) auto}}
@container (min-width: 60rem){
[data-vibeui-block="cta-017"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="cta-017"] [data-part="card"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:3rem;padding:3.5rem;align-items:center}
[data-vibeui-block="cta-017"] [data-part="digits"]{font-size:2.4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-017"] *{animation:none!important;transition:none!important}}`

const UNITS: [keyof Remaining, string][] = [
  ["days", "дней"],
  ["hours", "часов"],
  ["minutes", "минут"],
  ["seconds", "секунд"],
]

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function remaining(target: number, now: number): Remaining {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 }
}

/** Финальный призыв: обратный отсчёт до старта, «осталось мест» и форма с email. */
export function Cta017({
  eyebrow = "Ближайший поток",
  title = "Старт 6 октября. Следующий поток — только в феврале",
  text = "Оставьте почту — пришлём программу, договор и ссылку на оплату. Место держим 48 часов.",
  startsAt = "2026-10-06T10:00:00+03:00",
  countdownLabel = "до старта потока",
  seats = "Осталось 12 мест из 60",
  placeholder = "Ваша почта",
  submitLabel = "Забронировать место",
  doneTitle = "Место за вами",
  doneText = "Письмо с программой и ссылкой уже летит. Проверьте «Промоакции», если не видите.",
  consent = "Нажимая кнопку, вы соглашаетесь с политикой обработки данных.",
  action = "",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Cta017Props) {
  const target = new Date(startsAt).getTime()
  const [now, setNow] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-cta-017-accent": accent } : null),
    ...(background ? { "--vibeui-cta-017-bg": background } : null),
    ...style,
  } as CSSProperties

  // Время берём только на клиенте: на сервере таймер отдаётся пустым,
  // иначе секунды разойдутся при гидрации.
  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const left = now === null ? null : remaining(target, now)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (action) return
    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card">
            <div data-part="copy">
              {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
              <h2 data-part="title">{title}</h2>
              {text ? <p data-part="text">{text}</p> : null}
            </div>
            <div>
              <ol data-part="timer" aria-label={countdownLabel}>
                {UNITS.map(([key, label]) => {
                  const value = left ? left[key] : 0
                  return (
                    <li key={key} data-part="unit">
                      <span data-part="digits" aria-hidden={left === null}>
                        <span key={value}>{String(value).padStart(2, "0")}</span>
                      </span>
                      <small>{label}</small>
                    </li>
                  )
                })}
              </ol>
              {countdownLabel ? <p data-part="timer-label">{countdownLabel}</p> : null}
              {done ? (
                <div data-part="done" role="status" style={{ marginTop: "1.5rem" }}>
                  <b>{doneTitle}</b>
                  <span>{doneText}</span>
                </div>
              ) : (
                <form data-part="form" action={action || undefined} method={action ? "post" : undefined} onSubmit={submit} style={{ marginTop: "1.5rem" }}>
                  <div data-part="row">
                    <input type="email" name="email" required placeholder={placeholder} autoComplete="email" aria-label={placeholder} />
                    <button type="submit" data-part="submit">
                      {submitLabel}
                    </button>
                  </div>
                  {seats ? <span data-part="seats">{seats}</span> : null}
                  {consent ? <p data-part="consent">{consent}</p> : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
