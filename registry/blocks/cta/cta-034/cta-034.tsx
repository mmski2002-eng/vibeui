"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Cta034Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** День недели дропа 1–7 (1 — понедельник) и час по местному времени. */
  dropDay?: number
  dropHour?: number
  /** Слово, которое уплывает контуром на фоне. */
  word?: string
  placeholder?: string
  actionLabel?: string
  fine?: readonly string[]
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подписка на дропы: таймер до следующего дропа (день недели и час —
// пропсы) тикает через useSyncExternalStore с серверным снимком null,
// поэтому на сервере рендерятся прочерки, а на клиенте цифры оживают без
// расхождений гидрации. Фоном уплывает огромное контурное слово
// (-webkit-text-stroke, бегущая строка). Форма «одно поле — одна кнопка»,
// после отправки галочка прорисовывается по stroke-dashoffset. Форма
// ничего не отправляет — заглушка под свой обработчик.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-034"]){
--vibeui-cta-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-034-on-accent:oklch(from var(--vibeui-cta-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-034-muted:color-mix(in oklab,var(--vibeui-cta-034-fg) 58%,var(--vibeui-cta-034-bg));
--vibeui-cta-034-line:color-mix(in oklab,var(--vibeui-cta-034-fg) 12%,transparent);
--vibeui-cta-034-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-034-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-034-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-034"]{color-scheme:dark}
:where([data-vibeui-block="cta-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-034"]{box-sizing:border-box;position:relative;padding:6rem 0;background:var(--vibeui-cta-034-bg);color:var(--vibeui-cta-034-fg);font-family:var(--vibeui-cta-034-font);font-size:1rem;line-height:1.5;overflow:hidden;isolation:isolate}
[data-vibeui-block="cta-034"] *{box-sizing:border-box}
[data-vibeui-block="cta-034"] [data-part="ghost"]{position:absolute;left:0;top:50%;z-index:-1;display:flex;transform:translateY(-50%);pointer-events:none;user-select:none;font-family:var(--vibeui-cta-034-display);font-weight:800;font-size:clamp(9rem,32cqi,26rem);line-height:.8;letter-spacing:-.06em;white-space:nowrap;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-cta-034-fg) 14%,transparent)}
[data-vibeui-block="cta-034"] [data-part="ghost"] span{flex-shrink:0;padding-right:.25em;animation:vibeui-cta-034-run 40s linear infinite}
[data-vibeui-block="cta-034"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-034"] [data-part="card"]{max-width:38rem;margin:0 auto;padding:clamp(1.5rem,5cqi,3rem);border-radius:1.6rem;border:1px solid var(--vibeui-cta-034-line);background:color-mix(in oklab,var(--vibeui-cta-034-bg) 80%,transparent);backdrop-filter:blur(18px);text-align:center;box-shadow:0 40px 80px -50px rgb(0 0 0 / .35)}
[data-vibeui-block="cta-034"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-cta-034-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="timer"]{display:flex;justify-content:center;gap:.4rem;margin:0 0 1.4rem;padding:0;list-style:none}
[data-vibeui-block="cta-034"] [data-part="timer"] li{display:grid;justify-items:center;gap:.2rem;min-width:3.6rem;padding:.5rem .4rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-cta-034-fg) 5%,transparent)}
[data-vibeui-block="cta-034"] [data-part="timer"] b{font-family:var(--vibeui-cta-034-mono);font-weight:500;font-size:1.5rem;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-cta-034-accent)}
[data-vibeui-block="cta-034"] [data-part="timer"] b[data-empty="true"]{color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="timer"] small{font-family:var(--vibeui-cta-034-mono);font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-034-display);font-weight:800;font-size:clamp(1.9rem,4.8cqi,3.2rem);line-height:1;letter-spacing:-.04em}
[data-vibeui-block="cta-034"] [data-part="lede"]{margin:1rem auto 0;max-width:28rem;color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="form"]{display:grid;gap:.5rem;margin:1.6rem 0 0}
[data-vibeui-block="cta-034"] [data-part="form"] input{width:100%;height:3.1rem;padding:0 1.1rem;border-radius:999px;border:1px solid var(--vibeui-cta-034-line);background:var(--vibeui-cta-034-bg);color:var(--vibeui-cta-034-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="cta-034"] [data-part="form"] input::placeholder{color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="form"] input:focus-visible{border-color:var(--vibeui-cta-034-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-cta-034-accent) 22%,transparent)}
[data-vibeui-block="cta-034"] [data-part="form"] button{height:3.1rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-cta-034-accent);color:var(--vibeui-cta-034-on-accent);font:inherit;font-weight:600;cursor:pointer;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="cta-034"] [data-part="form"] button:hover{transform:translateY(-1px);box-shadow:0 12px 30px -12px var(--vibeui-cta-034-accent)}
[data-vibeui-block="cta-034"] [data-part="form"] button:focus-visible{outline:2px solid var(--vibeui-cta-034-fg);outline-offset:2px}
[data-vibeui-block="cta-034"] [data-part="fine"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.3rem 1rem;margin:1rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-cta-034-mono);font-size:.68rem;color:var(--vibeui-cta-034-muted)}
[data-vibeui-block="cta-034"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;padding:1rem 0}
[data-vibeui-block="cta-034"] [data-part="done"] svg{width:4rem;height:4rem;color:var(--vibeui-cta-034-accent)}
[data-vibeui-block="cta-034"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-cta-034-draw .8s ease-out forwards}
[data-vibeui-block="cta-034"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-cta-034-draw .5s ease-out .5s forwards}
[data-vibeui-block="cta-034"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-034-display);font-size:1.5rem;font-weight:700;letter-spacing:-.03em}
[data-vibeui-block="cta-034"] [data-part="done"] p{margin:0;color:var(--vibeui-cta-034-muted)}
@keyframes vibeui-cta-034-run{to{transform:translateX(-100%)}}
@keyframes vibeui-cta-034-draw{to{stroke-dashoffset:0}}
@container (min-width: 36rem){[data-vibeui-block="cta-034"] [data-part="form"]{grid-template-columns:1fr auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-034"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-034"] [data-part="done"] circle,[data-vibeui-block="cta-034"] [data-part="done"] path{stroke-dashoffset:0}}`

let nowSeconds = 0
function subscribe(callback: () => void) {
  const tick = () => {
    nowSeconds = Math.floor(Date.now() / 1000)
    callback()
  }
  tick()
  const id = window.setInterval(tick, 1000)
  return () => window.clearInterval(id)
}
const getSnapshot = () => nowSeconds
const getServerSnapshot = () => null

function nextDrop(now: number, day: number, hour: number) {
  const date = new Date(now * 1000)
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0)
  const weekday = ((date.getDay() + 6) % 7) + 1
  let ahead = (day - weekday + 7) % 7
  if (ahead === 0 && target.getTime() <= date.getTime()) ahead = 7
  target.setDate(target.getDate() + ahead)
  return Math.max(0, Math.floor((target.getTime() - date.getTime()) / 1000))
}

const pad = (value: number) => String(value).padStart(2, "0")

/** Подписка на дропы с таймером до следующего и контурным словом на фоне. */
export function Cta034({
  eyebrow = "следующий дроп через",
  title = "Новые товары — по четвергам в полдень",
  lede = "Раз в неделю письмо с дропом: 10–15 новых товаров и один со скидкой 50 % на сутки. Ничего лишнего.",
  dropDay = 4,
  dropHour = 12,
  word = "ДРОП",
  placeholder = "Почта",
  actionLabel = "Получать дропы",
  fine = ["раз в неделю", "отписка в одно письмо", "без спама"],
  doneTitle = "Вы в списке",
  doneText = "Первое письмо придёт в четверг ровно в 12:00.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta034Props) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [done, setDone] = useState(false)
  const left = now ? nextDrop(now, dropDay, dropHour) : null
  const parts = left === null ? null : { d: Math.floor(left / 86400), h: Math.floor((left % 86400) / 3600), m: Math.floor((left % 3600) / 60), s: left % 60 }

  const palette = {
    ...(accent ? { "--vibeui-cta-034-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-034-fg": ink } : null),
    ...(background ? { "--vibeui-cta-034-bg": background } : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const ghost = `${word} · `.repeat(6)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-034" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-034" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {word ? (
          <div data-part="ghost" aria-hidden="true">
            <span>{ghost}</span>
            <span>{ghost}</span>
          </div>
        ) : null}
        <div data-part="shell">
          <div data-part="card" aria-live="polite">
            {done ? (
              <div data-part="done">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="32" cy="32" r="25" />
                  <path d="M21 33l8 8 14-16" />
                </svg>
                <h3>{doneTitle}</h3>
                <p>{doneText}</p>
              </div>
            ) : (
              <>
                {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                <ul data-part="timer" aria-label="До следующего дропа">
                  {(["d", "h", "m", "s"] as const).map((unit) => (
                    <li key={unit}>
                      <b data-empty={parts === null}>{parts === null ? "--" : pad(parts[unit])}</b>
                      <small>{{ d: "дн", h: "час", m: "мин", s: "сек" }[unit]}</small>
                    </li>
                  ))}
                </ul>
                <h2 data-part="title">{title}</h2>
                {lede ? <p data-part="lede">{lede}</p> : null}
                <form data-part="form" onSubmit={submit}>
                  <input type="email" name="email" required placeholder={placeholder} aria-label={placeholder} autoComplete="email" />
                  <button type="submit">{actionLabel}</button>
                </form>
                {fine.length > 0 ? (
                  <ul data-part="fine">
                    {fine.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
