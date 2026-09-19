"use client"

import { useMemo, useState, type CSSProperties, type PointerEvent } from "react"

export type Auto001Service = {
  name: string
  /** Цена для компакта, ₽. Классы авто умножают. */
  price: number
  /** Время работ, минут. */
  minutes: number
  note?: string
}

export type Auto001CarClass = {
  label: string
  /** Примеры: «Polo, Rio». */
  hint?: string
  /** Множитель цены и времени. */
  factor: number
}

export type Auto001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  services?: readonly Auto001Service[]
  classes?: readonly Auto001CarClass[]
  /** Какие услуги отмечены изначально (индексы). */
  defaultSelected?: readonly number[]
  actionLabel?: string
  /** Куда ведёт «записаться» — обычно блок записи на этой же странице. */
  actionHref?: string
  /** Имя CustomEvent, который уносит выбор в блок записи. */
  eventName?: string
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Калькулятор детейлинга: сверху сегментный селектор класса авто (компакт →
// внедорожник), ниже карточки-чипы услуг с ценой и временем — по курсору по
// карточке бежит spotlight (radial-gradient по --x/--y), отмеченные горят
// акцентной рамкой. Внизу липкая панель: итог и время пересчитываются на
// лету (tabular-nums, без прыжков), кнопка «Записаться» отправляет выбор
// CustomEvent-ом в блок записи и ведёт на его якорь.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="auto-001"]){
--vibeui-auto-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-auto-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-001-on-accent:oklch(from var(--vibeui-auto-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auto-001-muted:color-mix(in oklab,var(--vibeui-auto-001-fg) 60%,var(--vibeui-auto-001-bg));
--vibeui-auto-001-line:color-mix(in oklab,var(--vibeui-auto-001-fg) 12%,transparent);
--vibeui-auto-001-glass:color-mix(in oklab,var(--vibeui-auto-001-fg) 5%,transparent);
--vibeui-auto-001-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-001-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auto-001"]{color-scheme:dark}
:where([data-vibeui-block="auto-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="auto-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="auto-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-auto-001-bg);color:var(--vibeui-auto-001-fg);font-family:var(--vibeui-auto-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="auto-001"] *{box-sizing:border-box}
[data-vibeui-block="auto-001"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="auto-001"] [data-part="head"]{display:grid;gap:1rem;align-items:end;margin-bottom:2.2rem}
[data-vibeui-block="auto-001"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-auto-001-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-auto-001-accent)}
[data-vibeui-block="auto-001"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-auto-001-accent)}
[data-vibeui-block="auto-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-auto-001-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="auto-001"] [data-part="lede"]{margin:0;max-width:30rem;color:var(--vibeui-auto-001-muted)}
[data-vibeui-block="auto-001"] [data-part="classes"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem;padding:.4rem;border-radius:1rem;border:1px solid var(--vibeui-auto-001-line);background:var(--vibeui-auto-001-glass);margin-bottom:1.2rem}
[data-vibeui-block="auto-001"] [data-part="class"]{display:grid;gap:.1rem;padding:.7rem .9rem;border-radius:.7rem;border:0;background:transparent;color:var(--vibeui-auto-001-muted);font:inherit;text-align:left;cursor:pointer;transition:background .25s,color .25s}
[data-vibeui-block="auto-001"] [data-part="class"] b{font-weight:600;font-size:.95rem;color:var(--vibeui-auto-001-fg)}
[data-vibeui-block="auto-001"] [data-part="class"] small{font-size:.75rem;font-family:var(--vibeui-auto-001-mono)}
[data-vibeui-block="auto-001"] [data-part="class"][aria-checked="true"]{background:var(--vibeui-auto-001-accent);color:color-mix(in oklab,var(--vibeui-auto-001-on-accent) 75%,transparent)}
[data-vibeui-block="auto-001"] [data-part="class"][aria-checked="true"] b{color:var(--vibeui-auto-001-on-accent)}
[data-vibeui-block="auto-001"] [data-part="grid"]{display:grid;gap:.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="auto-001"] [data-part="card"]{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:1fr auto;gap:.3rem .8rem;width:100%;min-height:8.5rem;padding:1.1rem 1.2rem;border-radius:1rem;border:1px solid var(--vibeui-auto-001-line);background:var(--vibeui-auto-001-glass);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .25s,transform .25s;--vibeui-auto-001-x:50%;--vibeui-auto-001-y:50%}
[data-vibeui-block="auto-001"] [data-part="card"]::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(18rem circle at var(--vibeui-auto-001-x) var(--vibeui-auto-001-y),color-mix(in oklab,var(--vibeui-auto-001-accent) 22%,transparent),transparent 60%);opacity:0;transition:opacity .35s}
[data-vibeui-block="auto-001"] [data-part="card"]:hover::before,[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"]::before{opacity:1}
[data-vibeui-block="auto-001"] [data-part="card"]:hover{transform:translateY(-2px)}
[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"]{border-color:var(--vibeui-auto-001-accent);box-shadow:0 0 0 1px var(--vibeui-auto-001-accent) inset}
[data-vibeui-block="auto-001"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-auto-001-accent);outline-offset:2px}
[data-vibeui-block="auto-001"] [data-part="name"]{margin:0;font-weight:600;font-size:1rem;line-height:1.25}
[data-vibeui-block="auto-001"] [data-part="check"]{width:1.5rem;height:1.5rem;border-radius:50%;border:1px solid var(--vibeui-auto-001-line);display:grid;place-items:center;color:var(--vibeui-auto-001-on-accent);transition:background .2s,border-color .2s}
[data-vibeui-block="auto-001"] [data-part="check"] svg{width:.8rem;height:.8rem;opacity:0;transform:scale(.5);transition:opacity .2s,transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"] [data-part="check"]{background:var(--vibeui-auto-001-accent);border-color:var(--vibeui-auto-001-accent)}
[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"] [data-part="check"] svg{opacity:1;transform:scale(1)}
[data-vibeui-block="auto-001"] [data-part="cardnote"]{grid-column:1/-1;margin:0;font-size:.82rem;color:var(--vibeui-auto-001-muted)}
[data-vibeui-block="auto-001"] [data-part="meta"]{grid-column:1/-1;display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;margin-top:auto;padding-top:.6rem;font-family:var(--vibeui-auto-001-mono);font-size:.78rem;color:var(--vibeui-auto-001-muted)}
[data-vibeui-block="auto-001"] [data-part="meta"] b{font-family:var(--vibeui-auto-001-display);font-weight:700;font-size:1rem;color:var(--vibeui-auto-001-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="auto-001"] [data-part="bar"]{position:sticky;bottom:1rem;z-index:2;display:grid;gap:.9rem;margin-top:1.4rem;padding:1rem 1.2rem;border-radius:1.2rem;border:1px solid var(--vibeui-auto-001-line);background:color-mix(in oklab,var(--vibeui-auto-001-bg) 82%,transparent);backdrop-filter:blur(18px);box-shadow:0 30px 60px -30px rgb(0 0 0 / .6)}
[data-vibeui-block="auto-001"] [data-part="totals"]{display:flex;flex-wrap:wrap;gap:.4rem 2rem}
[data-vibeui-block="auto-001"] [data-part="total"]{display:grid;gap:.1rem}
[data-vibeui-block="auto-001"] [data-part="total"] small{font-family:var(--vibeui-auto-001-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-auto-001-muted)}
[data-vibeui-block="auto-001"] [data-part="total"] output{font-family:var(--vibeui-auto-001-display);font-weight:900;font-size:clamp(1.5rem,3.2cqi,2.2rem);line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="auto-001"] [data-part="total"][data-kind="price"] output{color:var(--vibeui-auto-001-accent)}
[data-vibeui-block="auto-001"] [data-part="count"]{font-size:.85rem;color:var(--vibeui-auto-001-muted)}
[data-vibeui-block="auto-001"] [data-part="action"]{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;padding:1rem 1.5rem;border-radius:.7rem;border:0;background:var(--vibeui-auto-001-accent);color:var(--vibeui-auto-001-on-accent);font:inherit;font-weight:700;text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .25s,opacity .2s}
[data-vibeui-block="auto-001"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 14px 34px -12px var(--vibeui-auto-001-accent)}
[data-vibeui-block="auto-001"] [data-part="action"][aria-disabled="true"]{opacity:.45;pointer-events:none}
[data-vibeui-block="auto-001"] [data-part="action"]:focus-visible,[data-vibeui-block="auto-001"] [data-part="class"]:focus-visible{outline:2px solid var(--vibeui-auto-001-accent);outline-offset:2px}
@container (min-width: 36rem){[data-vibeui-block="auto-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="auto-001"] [data-part="classes"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="auto-001"] [data-part="bar"]{grid-template-columns:1fr auto;align-items:center}}
@container (min-width: 56rem){[data-vibeui-block="auto-001"] [data-part="head"]{grid-template-columns:minmax(0,1fr) minmax(0,26rem);gap:2rem}}
@container (min-width: 64rem){[data-vibeui-block="auto-001"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auto-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SERVICES: Auto001Service[] = [
  { name: "Детейлинг-мойка", price: 2500, minutes: 90, note: "Двухфазная ручная, глина, воск." },
  { name: "Полировка кузова", price: 18000, minutes: 480, note: "Два этапа: абразив и финиш." },
  { name: "Керамика 9H, 3 слоя", price: 32000, minutes: 720, note: "Гидрофоб 2–3 года." },
  { name: "Плёнка PPF на фронт", price: 45000, minutes: 960, note: "Капот, бампер, зеркала, стойки." },
  { name: "Химчистка салона", price: 9000, minutes: 300, note: "Сиденья, потолок, ковры, пластик." },
  { name: "Фары: полировка + бронь", price: 7000, minutes: 120, note: "Плёнка 200 мкм сверху." },
  { name: "Керамика на диски", price: 5000, minutes: 150, note: "Снимаем, чистим, кроем." },
  { name: "Кожа: чистка и защита", price: 6500, minutes: 180, note: "Пена, щётка, кондиционер." },
]

const DEFAULT_CLASSES: Auto001CarClass[] = [
  { label: "Компакт", hint: "Polo, Rio, Mini", factor: 1 },
  { label: "Седан", hint: "Camry, 5-я серия", factor: 1.15 },
  { label: "Кроссовер", hint: "RAV4, X3, Q5", factor: 1.3 },
  { label: "Внедорожник", hint: "LC300, X7, G-класс", factor: 1.5 },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function formatTime(minutes: number) {
  if (minutes === 0) return "—"
  if (minutes >= 540) {
    const days = Math.ceil(minutes / 540)
    return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`
  }
  const hours = Math.floor(minutes / 60)
  const rest = Math.round((minutes % 60) / 30) * 30
  if (hours === 0) return `${rest} мин`
  return rest ? `${hours} ч ${rest} мин` : `${hours} ч`
}

/** Калькулятор услуг детейлинга: чипы, класс авто, итог на лету, «записаться» через CustomEvent. */
export function Auto001({
  eyebrow = "Калькулятор",
  title = "Соберите свой детейлинг",
  lede = "Отметьте, что нужно, выберите класс машины — цена и время посчитаются сразу. Итог фиксируем при записи, без «уточним на месте».",
  services = DEFAULT_SERVICES,
  classes = DEFAULT_CLASSES,
  defaultSelected = [0, 2],
  actionLabel = "Записаться",
  actionHref = "#booking",
  eventName = "vibeui-auto:book",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Auto001Props) {
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set(defaultSelected))
  const [carClass, setCarClass] = useState(0)
  const factor = classes[carClass]?.factor ?? 1

  const totals = useMemo(() => {
    let price = 0
    let minutes = 0
    services.forEach((service, index) => {
      if (!selected.has(index)) return
      price += service.price * factor
      minutes += service.minutes * (factor > 1.2 ? 1.2 : 1)
    })
    return { price: Math.round(price / 100) * 100, minutes }
  }, [services, selected, factor])

  const palette = {
    ...(accent ? { "--vibeui-auto-001-accent": accent } : null),
    ...(ink ? { "--vibeui-auto-001-fg": ink } : null),
    ...(background ? { "--vibeui-auto-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const toggle = (index: number) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  // Spotlight пишем прямо в стиль карточки: перерисовка на каждое движение
  // курсора не нужна.
  const spotlight = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-auto-001-x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--vibeui-auto-001-y", `${event.clientY - rect.top}px`)
  }

  const book = () => {
    const names = services.filter((_, index) => selected.has(index)).map((service) => service.name)
    window.dispatchEvent(new CustomEvent(eventName, { detail: { services: names, carClass: classes[carClass]?.label ?? "", total: totals.price, minutes: totals.minutes } }))
  }

  const count = selected.size

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-auto-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="auto-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="classes" role="radiogroup" aria-label="Класс автомобиля">
            {classes.map((item, index) => (
              <button key={item.label} data-part="class" type="button" role="radio" aria-checked={carClass === index} onClick={() => setCarClass(index)}>
                <b>{item.label}</b>
                {item.hint ? <small>{item.hint}</small> : null}
              </button>
            ))}
          </div>
          <ul data-part="grid" aria-label="Услуги">
            {services.map((service, index) => (
              <li key={service.name}>
                <button data-part="card" type="button" aria-pressed={selected.has(index)} onClick={() => toggle(index)} onPointerMove={spotlight}>
                  <p data-part="name">{service.name}</p>
                  <span data-part="check" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5l3.2 3L13 4.5" />
                    </svg>
                  </span>
                  {service.note ? <p data-part="cardnote">{service.note}</p> : null}
                  <span data-part="meta">
                    <b>{formatMoney(service.price * factor, currency)}</b>
                    <span>{formatTime(service.minutes * (factor > 1.2 ? 1.2 : 1))}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div data-part="bar">
            <div data-part="totals" aria-live="polite">
              <div data-part="total" data-kind="price">
                <small>Итого</small>
                <output>{formatMoney(totals.price, currency)}</output>
              </div>
              <div data-part="total">
                <small>Время в боксе</small>
                <output>{formatTime(totals.minutes)}</output>
              </div>
              <div data-part="total">
                <small>Выбрано</small>
                <output>
                  {count} <span data-part="count">{count === 1 ? "услуга" : count > 1 && count < 5 ? "услуги" : "услуг"}</span>
                </output>
              </div>
            </div>
            <a data-part="action" href={actionHref} aria-disabled={count === 0} onClick={book}>
              {actionLabel}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
