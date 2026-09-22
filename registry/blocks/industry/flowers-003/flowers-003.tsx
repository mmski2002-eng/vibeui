"use client"

import { useEffect, useId, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"
import { Button081 } from "@/registry/components/button/button-081/button-081"

export type Flowers003Order = {
  items: readonly { name: string; count: number; price: number }[]
  stems: number
  price: number
  days: number
}

export type Flowers003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Часы работы курьеров. */
  openHour?: number
  closeHour?: number
  /** Минут на сборку — раньше этого окна не предлагаем. */
  leadMinutes?: number
  /** Длина окна доставки в минутах. */
  slotMinutes?: number
  deliveryPrice?: number
  /** От какой суммы букета доставка бесплатна. */
  freeFrom?: number
  currency?: string
  /** Имя CustomEvent, из которого форма берёт состав букета. */
  eventName?: string
  builderHref?: string
  submitLabel?: string
  doneTitle?: string
  doneText?: string
  /** Формы слова «день», единицы ожидания и все подписи формы. */
  dayUnits?: readonly [string, string, string]
  minutesUnit?: string
  hoursUnit?: string
  decimalSeparator?: string
  clockLine?: string
  nightLine?: string
  nowLine?: string
  byLine?: string
  todayLabel?: string
  tomorrowLabel?: string
  windowLine?: string
  countingLine?: string
  tapeLabel?: string
  rangeLabel?: string
  hintLine?: string
  courierLine?: string
  orderTitle?: string
  orderLine?: string
  editLabel?: string
  noOrderTitle?: string
  noOrderText?: string
  builderLabel?: string
  nameLabel?: string
  phoneLabel?: string
  addressLabel?: string
  noteLabel?: string
  totalLine?: string
  freeLabel?: string
  noBouquetLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Доставка к часу»: лента времени с делениями, по которой ползёт стрелка —
// окна считаются от текущего времени (useSyncExternalStore, на сервере
// пусто), ближайшее — не раньше, чем через час сборки; ночью лента
// показывает завтрашнее утро и подпись «привезём утром первым». Слайдер
// и лента связаны: ползунок двигает ленту, клик по делению — ползунок.
// Справа форма заказа: состав приходит из конструктора через CustomEvent,
// итог считается с доставкой, после отправки — галочка прорисовывается.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-003"]){
--vibeui-flowers-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-003-on-accent:oklch(from var(--vibeui-flowers-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-003-muted:color-mix(in oklab,var(--vibeui-flowers-003-fg) 62%,var(--vibeui-flowers-003-bg));
--vibeui-flowers-003-line:color-mix(in oklab,var(--vibeui-flowers-003-fg) 16%,transparent);
--vibeui-flowers-003-paper:color-mix(in oklab,var(--vibeui-flowers-003-fg) 5%,var(--vibeui-flowers-003-bg));
--vibeui-flowers-003-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-003-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-003-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-003"]{color-scheme:dark}
:where([data-vibeui-block="flowers-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-flowers-003-bg);color:var(--vibeui-flowers-003-fg);font-family:var(--vibeui-flowers-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-003"] *{box-sizing:border-box}
[data-vibeui-block="flowers-003"] [data-part="slot"]{flex:0 0 6.5rem}
[data-vibeui-block="flowers-003"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-003"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="flowers-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-003-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-003"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="flowers-003"] [data-part="clock"]{display:grid;gap:1.2rem;padding:1.5rem;border-radius:1.2rem;background:var(--vibeui-flowers-003-paper);border:1px solid var(--vibeui-flowers-003-line)}
[data-vibeui-block="flowers-003"] [data-part="status"]{margin:0;font-family:var(--vibeui-flowers-003-hand);font-size:1.5rem;line-height:1.05;color:var(--vibeui-flowers-003-accent)}
[data-vibeui-block="flowers-003"] [data-part="readout"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1rem}
[data-vibeui-block="flowers-003"] [data-part="readout"] b{font-family:var(--vibeui-flowers-003-display);font-weight:500;font-size:clamp(3rem,9cqi,5rem);line-height:.9;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="flowers-003"] [data-part="readout"] span{color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="tape"]{position:relative;overflow:hidden;min-height:4.6rem;padding:.5rem 0 .2rem 50%;border-top:1px solid var(--vibeui-flowers-003-line);border-bottom:1px solid var(--vibeui-flowers-003-line);mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)}
[data-vibeui-block="flowers-003"] [data-part="tape"]::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:var(--vibeui-flowers-003-accent);z-index:2}
[data-vibeui-block="flowers-003"] [data-part="track"]{display:flex;transform:translate3d(calc((var(--vibeui-flowers-003-i) + .5) * -6.5rem),0,0);transition:transform .5s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-003"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.35rem;margin:.4rem 0 0;border-radius:999px;background:var(--vibeui-flowers-003-line);outline:none;cursor:pointer}
[data-vibeui-block="flowers-003"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-flowers-003-bg);border:2px solid var(--vibeui-flowers-003-fg);cursor:grab}
[data-vibeui-block="flowers-003"] [data-part="range"]::-moz-range-thumb{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-flowers-003-bg);border:2px solid var(--vibeui-flowers-003-fg);cursor:grab}
[data-vibeui-block="flowers-003"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-flowers-003-accent) 40%,transparent)}
[data-vibeui-block="flowers-003"] [data-part="hint"]{margin:0;font-size:.82rem;color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="form"]{display:grid;gap:.9rem}
[data-vibeui-block="flowers-003"] [data-part="bouquet"]{display:grid;gap:.4rem;padding:1rem 1.1rem;border-radius:.9rem;border:1px dashed color-mix(in oklab,var(--vibeui-flowers-003-fg) 40%,transparent)}
[data-vibeui-block="flowers-003"] [data-part="bouquet"] h3{margin:0;font-family:var(--vibeui-flowers-003-display);font-size:1.4rem;font-weight:600;line-height:1.1}
[data-vibeui-block="flowers-003"] [data-part="bouquet"] p{margin:0;font-size:.9rem;color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="bouquet"] a{color:var(--vibeui-flowers-003-accent);text-decoration:none;border-bottom:1px solid currentColor;font-size:.85rem}
[data-vibeui-block="flowers-003"] [data-part="field"]{position:relative;display:grid}
[data-vibeui-block="flowers-003"] [data-part="field"] input,[data-vibeui-block="flowers-003"] [data-part="field"] textarea{width:100%;padding:1.35rem 1rem .55rem;border-radius:.8rem;border:1px solid var(--vibeui-flowers-003-line);background:transparent;color:var(--vibeui-flowers-003-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s;resize:vertical}
[data-vibeui-block="flowers-003"] [data-part="field"] label{position:absolute;left:1rem;top:.95rem;font-size:.95rem;color:var(--vibeui-flowers-003-muted);pointer-events:none;transform-origin:left top;transition:transform .2s,color .2s}
[data-vibeui-block="flowers-003"] [data-part="field"] :is(input,textarea):focus-visible{border-color:var(--vibeui-flowers-003-fg);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-flowers-003-accent) 25%,transparent)}
[data-vibeui-block="flowers-003"] [data-part="field"] :is(input,textarea):focus-visible+label,[data-vibeui-block="flowers-003"] [data-part="field"] :is(input,textarea):not(:placeholder-shown)+label{transform:translateY(-.65rem) scale(.74);color:var(--vibeui-flowers-003-accent)}
[data-vibeui-block="flowers-003"] [data-part="field"] :is(input,textarea)::placeholder{color:transparent}
[data-vibeui-block="flowers-003"] [data-part="total"]{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:.4rem 1rem;padding:.4rem 0;font-size:.92rem;color:var(--vibeui-flowers-003-muted)}
[data-vibeui-block="flowers-003"] [data-part="total"] b{font-family:var(--vibeui-flowers-003-display);font-size:1.8rem;font-weight:600;color:var(--vibeui-flowers-003-fg);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="flowers-003"] [data-part="submit"]{display:inline-flex;justify-content:center;align-items:center;padding:1rem 1.4rem;border-radius:999px;border:0;background:var(--vibeui-flowers-003-accent);color:var(--vibeui-flowers-003-on-accent);font:inherit;font-weight:500;cursor:pointer;transition:transform .2s,box-shadow .25s}
[data-vibeui-block="flowers-003"] [data-part="submit"]:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px var(--vibeui-flowers-003-accent)}
[data-vibeui-block="flowers-003"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-flowers-003-fg);outline-offset:3px}
[data-vibeui-block="flowers-003"] [data-part="done"]{display:grid;justify-items:start;gap:.8rem;padding:1.5rem;border-radius:1.2rem;border:1px solid var(--vibeui-flowers-003-line)}
[data-vibeui-block="flowers-003"] [data-part="done"] svg{width:4rem;height:4rem;color:var(--vibeui-flowers-003-accent)}
[data-vibeui-block="flowers-003"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-flowers-003-draw .8s ease-out forwards}
[data-vibeui-block="flowers-003"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-flowers-003-draw .5s ease-out .5s forwards}
[data-vibeui-block="flowers-003"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-flowers-003-display);font-size:1.8rem;font-weight:600;line-height:1.1}
[data-vibeui-block="flowers-003"] [data-part="done"] p{margin:0;color:var(--vibeui-flowers-003-muted)}
@keyframes vibeui-flowers-003-draw{to{stroke-dashoffset:0}}
@container (min-width: 60rem){[data-vibeui-block="flowers-003"] [data-part="grid"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:3rem}[data-vibeui-block="flowers-003"] [data-part="clock"]{position:sticky;top:5.5rem;padding:2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-003"] *{animation:none!important;transition:none!important}[data-vibeui-block="flowers-003"] [data-part="done"] circle,[data-vibeui-block="flowers-003"] [data-part="done"] path{stroke-dashoffset:0}}`

type Slot = { start: number; day: "today" | "tomorrow" }

function subscribeMinute(callback: () => void) {
  const id = setInterval(callback, 60_000)
  return () => clearInterval(id)
}

function readMinuteOfDay() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function clock(minutes: number) {
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`
}

function buildSlots(now: number, openHour: number, closeHour: number, lead: number, step: number): Slot[] {
  const dayStart = openHour * 60
  const dayEnd = closeHour * 60
  const slots: Slot[] = []
  const first = Math.max(dayStart, Math.ceil((now + lead) / step) * step)
  for (let start = first; start + step <= dayEnd && slots.length < 8; start += step) slots.push({ start, day: "today" })
  const tomorrowCount = slots.length ? 3 : 6
  for (let start = dayStart, count = 0; count < tomorrowCount && start + step <= dayEnd; start += step, count += 1) slots.push({ start, day: "tomorrow" })
  return slots
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function daysWord(days: number, units: readonly [string, string, string]) {
  const rest = days % 10
  if (days % 100 >= 11 && days % 100 <= 14) return units[2]
  if (rest === 1) return units[0]
  if (rest >= 2 && rest <= 4) return units[1]
  return units[2]
}

/** Доставка к часу: лента времени от текущего момента и форма заказа. */
export function Flowers003({
  eyebrow = "Доставка к часу",
  title = "Скажите, во сколько — привезём минута в минуту",
  lede = "Окна считаем от текущего времени: два часа на сборку, дальше — час на дорогу. Курьер пишет за полчаса до приезда.",
  openHour = 9,
  closeHour = 22,
  leadMinutes = 120,
  slotMinutes = 60,
  deliveryPrice = 390,
  freeFrom = 5000,
  currency = "₽",
  eventName = "vibeui-flowers:order",
  builderHref = "#builder",
  submitLabel = "Оформить заказ",
  doneTitle = "Заказ принят",
  doneText = "Флорист позвонит в течение десяти минут — уточнить открытку и подъезд.",
  dayUnits = ["день", "дня", "дней"],
  minutesUnit = "мин",
  hoursUnit = "ч",
  decimalSeparator = ",",
  clockLine = "смотрим на часы…",
  nightLine = "сейчас ночь — привезём утром первым",
  nowLine = "сейчас {time}, ближайшее окно — через {wait}",
  byLine = "к {time}",
  todayLabel = "сегодня",
  tomorrowLabel = "завтра",
  windowLine = "{day}, окно {from}–{to}",
  countingLine = "считаем окна",
  tapeLabel = "Окно доставки",
  rangeLabel = "Время доставки",
  hintLine = "Курьеры с {open} до {close}. Доставка {price}, от {free} — бесплатно.",
  courierLine = "Курьер будет {day} к {time}. ",
  orderTitle = "Ваш букет",
  orderLine = "{items} · {stems} стеблей · живёт {n} {days}",
  editLabel = "изменить состав",
  noOrderTitle = "Какой букет?",
  noOrderText = "Соберите его в конструкторе — состав появится здесь. Или опишите словами ниже.",
  builderLabel = "открыть конструктор",
  nameLabel = "Как вас зовут",
  phoneLabel = "Телефон",
  addressLabel = "Адрес, подъезд, этаж",
  noteLabel = "Открытка или пожелания",
  totalLine = "букет {bouquet} + доставка {delivery}",
  freeLabel = "бесплатно",
  noBouquetLine = "доставка {delivery}, букет посчитаем после звонка",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers003Props) {
  const now = useSyncExternalStore(subscribeMinute, readMinuteOfDay, () => null)
  const [selected, setSelected] = useState(0)
  const [order, setOrder] = useState<Flowers003Order | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onOrder = (event: Event) => setOrder((event as CustomEvent<Flowers003Order>).detail)
    window.addEventListener(eventName, onOrder)
    return () => window.removeEventListener(eventName, onOrder)
  }, [eventName])

  const slots = now === null ? [] : buildSlots(now, openHour, closeHour, leadMinutes, slotMinutes)
  const index = Math.min(selected, Math.max(0, slots.length - 1))
  const current = slots[index]
  const night = now !== null && slots.length > 0 && slots[0].day === "tomorrow"
  const bouquetPrice = order?.price ?? 0
  const delivery = bouquetPrice >= freeFrom ? 0 : deliveryPrice
  const wait = now !== null && slots.length > 0 ? Math.max(0, slots[0].start - now) : 0
  const waitLabel = wait < 60 ? `${wait} ${minutesUnit}` : `${(wait / 60).toFixed(wait % 60 ? 1 : 0).replace(".", decimalSeparator)} ${hoursUnit}`
  const status = now === null ? clockLine : night ? nightLine : nowLine.replace("{time}", clock(now)).replace("{wait}", waitLabel)
  const id = useId()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-flowers-003-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-003-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flowers-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="flowers-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <div data-part="clock">
              <p data-part="status" aria-live="polite">
                {status}
              </p>
              <div data-part="readout">
                <b>{current ? byLine.replace("{time}", clock(current.start)) : "—:—"}</b>
                <span>{current ? windowLine.replace("{day}", current.day === "today" ? todayLabel : tomorrowLabel).replace("{from}", clock(current.start)).replace("{to}", clock(current.start + slotMinutes)) : countingLine}</span>
              </div>
              <div data-part="tape" role="radiogroup" aria-label={tapeLabel}>
                <div data-part="track" style={{ ["--vibeui-flowers-003-i" as string]: index }}>
                  {slots.map((slot, slotIndex) => (
                    <Button081 key={`${slot.day}-${slot.start}`} data-part="slot" day={slot.day} start={slot.start} todayLabel={todayLabel} tomorrowLabel={tomorrowLabel} aria-checked={slotIndex === index} data-on={slotIndex === index} onClick={() => setSelected(slotIndex)} accent={accent} />
                  ))}
                </div>
              </div>
              <input data-part="range" type="range" min={0} max={Math.max(0, slots.length - 1)} value={index} onChange={(event) => setSelected(Number(event.target.value))} aria-label={rangeLabel} disabled={slots.length === 0} />
              <p data-part="hint">
                {hintLine.replace("{open}", `${pad(openHour)}:00`).replace("{close}", `${pad(closeHour)}:00`).replace("{price}", `${deliveryPrice} ${currency}`).replace("{free}", formatMoney(freeFrom, currency))}
              </p>
            </div>
            <div>
              {done ? (
                <div data-part="done" aria-live="polite">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="32" cy="32" r="25" />
                    <path d="M21 33l8 8 14-16" />
                  </svg>
                  <h3>{doneTitle}</h3>
                  <p>
                    {current ? courierLine.replace("{day}", current.day === "today" ? todayLabel : tomorrowLabel).replace("{time}", clock(current.start)) : ""}
                    {doneText}
                  </p>
                </div>
              ) : (
                <form data-part="form" onSubmit={submit}>
                  <div data-part="bouquet" aria-live="polite">
                    {order && order.items.length > 0 ? (
                      <>
                        <h3>{orderTitle}</h3>
                        <p>
                          {orderLine.replace("{items}", order.items.map((item) => `${item.name.toLowerCase()} ×${item.count}`).join(", ")).replace("{stems}", String(order.stems)).replace("{n}", String(order.days)).replace("{days}", daysWord(order.days, dayUnits))}
                        </p>
                        <a href={builderHref}>{editLabel}</a>
                      </>
                    ) : (
                      <>
                        <h3>{noOrderTitle}</h3>
                        <p>{noOrderText}</p>
                        <a href={builderHref}>{builderLabel}</a>
                      </>
                    )}
                  </div>
                  <div data-part="field">
                    <input id={`${id}-name`} name="name" type="text" placeholder=" " required autoComplete="name" />
                    <label htmlFor={`${id}-name`}>{nameLabel}</label>
                  </div>
                  <div data-part="field">
                    <input id={`${id}-phone`} name="phone" type="tel" placeholder=" " required autoComplete="tel" />
                    <label htmlFor={`${id}-phone`}>{phoneLabel}</label>
                  </div>
                  <div data-part="field">
                    <input id={`${id}-address`} name="address" type="text" placeholder=" " required autoComplete="street-address" />
                    <label htmlFor={`${id}-address`}>{addressLabel}</label>
                  </div>
                  <div data-part="field">
                    <textarea id={`${id}-note`} name="note" placeholder=" " rows={2} />
                    <label htmlFor={`${id}-note`}>{noteLabel}</label>
                  </div>
                  <div data-part="total">
                    <span>
                      {order ? totalLine.replace("{bouquet}", formatMoney(bouquetPrice, currency)).replace("{delivery}", delivery === 0 ? freeLabel : formatMoney(delivery, currency)) : noBouquetLine.replace("{delivery}", formatMoney(deliveryPrice, currency))}
                    </span>
                    <b>{formatMoney(bouquetPrice + delivery, currency)}</b>
                  </div>
                  <button data-part="submit" type="submit">
                    {submitLabel}
                    {current ? ` · ${byLine.replace("{time}", clock(current.start))}` : ""}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
