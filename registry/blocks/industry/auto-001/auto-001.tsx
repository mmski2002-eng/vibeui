"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
  /** Единицы времени: формы «день», час, минута. */
  dayUnits?: readonly [string, string, string]
  hoursUnit?: string
  minutesUnit?: string
  /** Формы слова «услуга» в счётчике. */
  serviceUnits?: readonly [string, string, string]
  classLabel?: string
  servicesLabel?: string
  totalLabel?: string
  timeLabel?: string
  selectedLabel?: string
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
[data-vibeui-block="auto-001"] [data-part="classes"]{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem;padding:.4rem;border-radius:1rem;border:1px solid var(--vibeui-auto-001-line);background:var(--vibeui-auto-001-glass);margin-bottom:1.2rem}
[data-vibeui-block="auto-001"] [data-part="class"]{position:relative;z-index:1;display:grid;gap:.1rem;padding:.7rem .9rem;border-radius:.7rem;border:0;background:transparent;color:var(--vibeui-auto-001-muted);font:inherit;text-align:left;cursor:pointer;transition:background .25s,color .35s}
[data-vibeui-block="auto-001"] [data-part="class"] b{font-weight:600;font-size:.95rem;color:var(--vibeui-auto-001-fg)}
[data-vibeui-block="auto-001"] [data-part="class"] small{font-size:.75rem;font-family:var(--vibeui-auto-001-mono)}
[data-vibeui-block="auto-001"] [data-part="class"][aria-checked="true"]{background:var(--vibeui-auto-001-accent);color:color-mix(in oklab,var(--vibeui-auto-001-on-accent) 75%,transparent)}
[data-vibeui-block="auto-001"] [data-part="class"][aria-checked="true"] b{color:var(--vibeui-auto-001-on-accent)}
[data-vibeui-block="auto-001"] [data-part="class"] b{transition:color .35s}
[data-vibeui-block="auto-001"] [data-part="pill"]{position:absolute;left:0;top:0;z-index:0;border-radius:.7rem;background:var(--vibeui-auto-001-accent);box-shadow:0 8px 22px -10px var(--vibeui-auto-001-accent);pointer-events:none;opacity:0;transition:translate .5s cubic-bezier(.3,.8,.25,1),width .5s cubic-bezier(.3,.8,.25,1),height .5s cubic-bezier(.3,.8,.25,1)}
[data-vibeui-block="auto-001"] [data-part="classes"][data-ready="true"] [data-part="pill"]{opacity:1}
[data-vibeui-block="auto-001"] [data-part="classes"][data-ready="true"] [data-part="class"][aria-checked="true"]{background:transparent}
[data-vibeui-block="auto-001"] [data-part="grid"]{display:grid;gap:.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="auto-001"] [data-part="card"]{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:1fr auto;gap:.3rem .8rem;width:100%;min-height:8.5rem;padding:1.1rem 1.2rem;border-radius:1rem;border:1px solid var(--vibeui-auto-001-line);background:var(--vibeui-auto-001-glass);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .25s,transform .25s,scale .35s cubic-bezier(.3,.8,.25,1);--vibeui-auto-001-x:50%;--vibeui-auto-001-y:50%}
[data-vibeui-block="auto-001"] [data-part="card"]::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(18rem circle at var(--vibeui-auto-001-x) var(--vibeui-auto-001-y),color-mix(in oklab,var(--vibeui-auto-001-accent) 22%,transparent),transparent 60%);opacity:0;transition:opacity .35s}
[data-vibeui-block="auto-001"] [data-part="card"]:hover::before,[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"]::before{opacity:1}
[data-vibeui-block="auto-001"] [data-part="card"]:hover{transform:translateY(-2px)}
[data-vibeui-block="auto-001"] [data-part="card"][aria-pressed="true"]{z-index:1;scale:1.025;border-color:var(--vibeui-auto-001-accent);box-shadow:0 0 0 1px var(--vibeui-auto-001-accent) inset,0 16px 36px -20px var(--vibeui-auto-001-accent);animation:vibeui-auto-001-pop .45s cubic-bezier(.3,1.5,.5,1)}
@keyframes vibeui-auto-001-pop{0%{scale:1}45%{scale:1.05}100%{scale:1.025}}
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
[data-vibeui-block="auto-001"] [data-part="class"]:focus-visible{outline:2px solid var(--vibeui-auto-001-accent);outline-offset:2px}
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

function plural(n: number, units: readonly [string, string, string]) {
  return n === 1 ? units[0] : n > 1 && n < 5 ? units[1] : units[2]
}

function formatTime(minutes: number, dayUnits: readonly [string, string, string], hoursUnit: string, minutesUnit: string) {
  if (minutes === 0) return "—"
  if (minutes >= 540) {
    const days = Math.ceil(minutes / 540)
    return `${days} ${plural(days, dayUnits)}`
  }
  // Округляем всё время сразу, иначе 117 минут дают «1 ч 60 мин».
  const rounded = Math.max(30, Math.round(minutes / 30) * 30)
  const hours = Math.floor(rounded / 60)
  const rest = rounded % 60
  if (hours === 0) return `${rest} ${minutesUnit}`
  return rest ? `${hours} ${hoursUnit} ${rest} ${minutesUnit}` : `${hours} ${hoursUnit}`
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
  dayUnits = ["день", "дня", "дней"],
  hoursUnit = "ч",
  minutesUnit = "мин",
  serviceUnits = ["услуга", "услуги", "услуг"],
  classLabel = "Класс автомобиля",
  servicesLabel = "Услуги",
  totalLabel = "Итого",
  timeLabel = "Время в боксе",
  selectedLabel = "Выбрано",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Auto001Props) {
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set(defaultSelected))
  const [carClass, setCarClass] = useState(0)
  const classesRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  // Подложка выбранного класса переезжает к кнопке, а не гаснет и вспыхивает:
  // меряем кнопку и двигаем одну плашку (translate + размер). До первого
  // замера подсвечена сама кнопка — так без скрипта выбор тоже виден.
  useEffect(() => {
    const group = classesRef.current
    const pill = pillRef.current
    if (!group || !pill) return
    const place = () => {
      const button = group.querySelectorAll<HTMLElement>('[data-part="class"]')[carClass]
      if (!button) return
      pill.style.translate = `${button.offsetLeft}px ${button.offsetTop}px`
      pill.style.width = `${button.offsetWidth}px`
      pill.style.height = `${button.offsetHeight}px`
      group.dataset.ready = "true"
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(group)
    return () => observer.disconnect()
  }, [carClass])
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
          <div data-part="classes" role="radiogroup" aria-label={classLabel} ref={classesRef}>
            <span data-part="pill" ref={pillRef} aria-hidden="true" />
            {classes.map((item, index) => (
              <button key={item.label} data-part="class" type="button" role="radio" aria-checked={carClass === index} onClick={() => setCarClass(index)}>
                <b>{item.label}</b>
                {item.hint ? <small>{item.hint}</small> : null}
              </button>
            ))}
          </div>
          <ul data-part="grid" aria-label={servicesLabel}>
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
                    <span>{formatTime(service.minutes * (factor > 1.2 ? 1.2 : 1), dayUnits, hoursUnit, minutesUnit)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div data-part="bar">
            <div data-part="totals" aria-live="polite">
              <div data-part="total" data-kind="price">
                <small>{totalLabel}</small>
                <output>{formatMoney(totals.price, currency)}</output>
              </div>
              <div data-part="total">
                <small>{timeLabel}</small>
                <output>{formatTime(totals.minutes, dayUnits, hoursUnit, minutesUnit)}</output>
              </div>
              <div data-part="total">
                <small>{selectedLabel}</small>
                <output>
                  {count} <span data-part="count">{plural(count, serviceUnits)}</span>
                </output>
              </div>
            </div>
            <Button016
              data-part="action"
              aria-disabled={count === 0}
              onClick={book}
              label={actionLabel}
              href={actionHref}
              external={false}
              size="md"
              tone="accent"
              accent={accent}
            />
          </div>
        </div>
      </section>
    </>
  )
}
