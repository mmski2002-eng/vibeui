"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Auto004Order = {
  services: string[]
  carClass: string
  total: number
  minutes: number
}

export type Auto004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Часы слотов, по порядку. */
  hours?: readonly number[]
  /** Сколько дней показать от сегодня. */
  days?: number
  /** Выходные дни недели (0 — воскресенье). */
  closedWeekdays?: readonly number[]
  /** Имя CustomEvent, из которого блок берёт выбор калькулятора. */
  eventName?: string
  namePlaceholder?: string
  phonePlaceholder?: string
  actionLabel?: string
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

// Запись в бокс: сетка слотов на неделю вперёд (день × время), считается
// от текущего дня через useSyncExternalStore — на сервере рисуется
// скелет, на клиенте появляются даты. Занятые слоты перечёркнуты
// (детерминированно от даты, чтобы не мигать), прошедшие сегодня —
// погашены, выбранный горит акцентом. Справа панель заказа: слушает
// CustomEvent из калькулятора и показывает выбранные услуги с суммой,
// поле имени и телефона, после отправки — галочка, которая прорисовывается.
// Форма ничего не отправляет наружу — заглушка.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="auto-004"]){
--vibeui-auto-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-auto-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-004-on-accent:oklch(from var(--vibeui-auto-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auto-004-muted:color-mix(in oklab,var(--vibeui-auto-004-fg) 60%,var(--vibeui-auto-004-bg));
--vibeui-auto-004-line:color-mix(in oklab,var(--vibeui-auto-004-fg) 12%,transparent);
--vibeui-auto-004-glass:color-mix(in oklab,var(--vibeui-auto-004-fg) 5%,transparent);
--vibeui-auto-004-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-004-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-004-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auto-004"]{color-scheme:dark}
:where([data-vibeui-block="auto-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="auto-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="auto-004"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-auto-004-bg);color:var(--vibeui-auto-004-fg);font-family:var(--vibeui-auto-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="auto-004"] *{box-sizing:border-box}
[data-vibeui-block="auto-004"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="auto-004"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-auto-004-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-auto-004-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="auto-004"] [data-part="lede"]{margin:1rem 0 2.2rem;max-width:32rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="layout"]{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem;align-items:start}
[data-vibeui-block="auto-004"] [data-part="board"]{overflow-x:auto;min-width:0;border-radius:1.2rem;border:1px solid var(--vibeui-auto-004-line);background:var(--vibeui-auto-004-glass);scrollbar-width:thin}
[data-vibeui-block="auto-004"] [data-part="grid"]{display:grid;grid-template-columns:3.6rem repeat(var(--vibeui-auto-004-days,7),minmax(4.4rem,1fr));gap:.35rem;min-width:36rem;padding:.9rem;border-collapse:separate}
[data-vibeui-block="auto-004"] [data-part="day"]{display:grid;justify-items:center;gap:.05rem;padding:.4rem 0 .6rem;font-family:var(--vibeui-auto-004-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="day"] b{font-family:var(--vibeui-auto-004-display);font-weight:700;font-size:1.1rem;letter-spacing:-.02em;color:var(--vibeui-auto-004-fg)}
[data-vibeui-block="auto-004"] [data-part="day"][data-today="true"] b{color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="hour"]{display:flex;align-items:center;font-family:var(--vibeui-auto-004-mono);font-size:.75rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="slot"]{position:relative;height:2.6rem;border-radius:.6rem;border:1px solid var(--vibeui-auto-004-line);background:transparent;color:var(--vibeui-auto-004-fg);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}
[data-vibeui-block="auto-004"] [data-part="slot"]:hover{border-color:var(--vibeui-auto-004-accent);transform:translateY(-1px)}
[data-vibeui-block="auto-004"] [data-part="slot"][data-state="busy"],[data-vibeui-block="auto-004"] [data-part="slot"][data-state="past"],[data-vibeui-block="auto-004"] [data-part="slot"][data-state="closed"]{cursor:not-allowed;color:var(--vibeui-auto-004-muted);border-style:dashed;transform:none}
[data-vibeui-block="auto-004"] [data-part="slot"][data-state="busy"]::after{content:"";position:absolute;left:.6rem;right:.6rem;top:50%;height:1px;background:currentColor;transform:rotate(-12deg)}
[data-vibeui-block="auto-004"] [data-part="slot"][data-state="past"],[data-vibeui-block="auto-004"] [data-part="slot"][data-state="closed"]{opacity:.35;border-color:transparent;background:var(--vibeui-auto-004-glass)}
[data-vibeui-block="auto-004"] [data-part="slot"][data-state="skeleton"]{background:var(--vibeui-auto-004-glass);border-color:transparent;cursor:default;animation:vibeui-auto-004-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="auto-004"] [data-part="slot"][aria-pressed="true"]{background:var(--vibeui-auto-004-accent);border-color:var(--vibeui-auto-004-accent);color:var(--vibeui-auto-004-on-accent);font-weight:700;box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-auto-004-accent) 25%,transparent)}
[data-vibeui-block="auto-004"] [data-part="slot"]:focus-visible{outline:2px solid var(--vibeui-auto-004-accent);outline-offset:2px}
[data-vibeui-block="auto-004"] [data-part="legend"]{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;margin:.9rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-auto-004-mono);font-size:.7rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:.4rem}
[data-vibeui-block="auto-004"] [data-part="legend"] i{width:.9rem;height:.9rem;border-radius:.25rem;border:1px solid var(--vibeui-auto-004-line)}
[data-vibeui-block="auto-004"] [data-part="legend"] i[data-kind="busy"]{border-style:dashed}
[data-vibeui-block="auto-004"] [data-part="legend"] i[data-kind="picked"]{background:var(--vibeui-auto-004-accent);border-color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="panel"]{display:grid;gap:1rem;padding:1.4rem;border-radius:1.2rem;border:1px solid var(--vibeui-auto-004-line);background:var(--vibeui-auto-004-glass)}
[data-vibeui-block="auto-004"] [data-part="panel"] h3{margin:0;font-family:var(--vibeui-auto-004-display);font-weight:700;font-size:1.05rem;letter-spacing:-.01em}
[data-vibeui-block="auto-004"] [data-part="order"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem;font-size:.9rem}
[data-vibeui-block="auto-004"] [data-part="order"] li{display:flex;gap:.5rem;align-items:baseline}
[data-vibeui-block="auto-004"] [data-part="order"] li::before{content:"—";color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="empty"]{margin:0;font-size:.88rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="sum"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding-top:.8rem;border-top:1px solid var(--vibeui-auto-004-line);font-size:.85rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="sum"] b{font-family:var(--vibeui-auto-004-display);font-weight:900;font-size:1.5rem;letter-spacing:-.03em;color:var(--vibeui-auto-004-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="auto-004"] [data-part="when"]{display:grid;gap:.15rem;padding:.8rem 1rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-auto-004-accent) 12%,transparent);font-size:.9rem}
[data-vibeui-block="auto-004"] [data-part="when"] small{font-family:var(--vibeui-auto-004-mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="form"]{display:grid;gap:.6rem}
[data-vibeui-block="auto-004"] [data-part="form"] input{width:100%;height:3rem;padding:0 1rem;border-radius:.7rem;border:1px solid var(--vibeui-auto-004-line);background:color-mix(in oklab,var(--vibeui-auto-004-bg) 70%,transparent);color:var(--vibeui-auto-004-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="auto-004"] [data-part="form"] input::placeholder{color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="form"] input:focus-visible{border-color:var(--vibeui-auto-004-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-auto-004-accent) 25%,transparent)}
[data-vibeui-block="auto-004"] [data-part="form"] button{height:3.1rem;border-radius:.7rem;border:0;background:var(--vibeui-auto-004-accent);color:var(--vibeui-auto-004-on-accent);font:inherit;font-weight:700;cursor:pointer;transition:transform .18s,box-shadow .2s,opacity .2s}
[data-vibeui-block="auto-004"] [data-part="form"] button:hover{transform:translateY(-1px);box-shadow:0 12px 30px -10px var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="form"] button:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
[data-vibeui-block="auto-004"] [data-part="form"] button:focus-visible{outline:2px solid var(--vibeui-auto-004-fg);outline-offset:2px}
[data-vibeui-block="auto-004"] [data-part="fine"]{margin:0;font-size:.78rem;color:var(--vibeui-auto-004-muted)}
[data-vibeui-block="auto-004"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;padding:1.5rem 0;text-align:center}
[data-vibeui-block="auto-004"] [data-part="done"] svg{width:4rem;height:4rem;color:var(--vibeui-auto-004-accent)}
[data-vibeui-block="auto-004"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-auto-004-draw .8s ease-out forwards}
[data-vibeui-block="auto-004"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-auto-004-draw .5s ease-out .5s forwards}
[data-vibeui-block="auto-004"] [data-part="done"] h3{font-size:1.3rem}
[data-vibeui-block="auto-004"] [data-part="done"] p{margin:0;color:var(--vibeui-auto-004-muted)}
@keyframes vibeui-auto-004-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-auto-004-pulse{50%{opacity:.4}}
@container (min-width: 60rem){[data-vibeui-block="auto-004"] [data-part="layout"]{grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:2rem}[data-vibeui-block="auto-004"] [data-part="panel"]{position:sticky;top:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auto-004"] *{animation:none!important;transition:none!important}[data-vibeui-block="auto-004"] [data-part="done"] circle,[data-vibeui-block="auto-004"] [data-part="done"] path{stroke-dashoffset:0}}`

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]

function subscribe(listener: () => void) {
  const id = window.setInterval(listener, 60000)
  return () => window.clearInterval(id)
}

// Снимок «сейчас» с точностью до часа: строка стабильна внутри часа, а
// значит useSyncExternalStore не дёргает рендер лишний раз.
function nowSnapshot() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Запись в бокс: сетка слотов на неделю от сегодня и панель заказа из калькулятора. */
export function Auto004({
  eyebrow = "Запись",
  title = "Выберите слот — подтвердим за минуту",
  lede = "Неделя вперёд по двум подъёмникам. Занятое перечёркнуто, серое — уже прошло. Нажмите свободное время и оставьте телефон.",
  hours = [9, 11, 13, 15, 17, 19],
  days = 7,
  closedWeekdays = [0],
  eventName = "vibeui-auto:book",
  namePlaceholder = "Как вас зовут",
  phonePlaceholder = "+7 (___) ___-__-__",
  actionLabel = "Записаться",
  doneTitle = "Слот за вами",
  doneText = "Мастер напишет в мессенджер в течение минуты, чтобы подтвердить время и уточнить машину.",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Auto004Props) {
  const snapshot = useSyncExternalStore(subscribe, nowSnapshot, () => null)
  const [picked, setPicked] = useState<string | null>(null)
  const [order, setOrder] = useState<Auto004Order | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onBook = (event: Event) => {
      const detail = (event as CustomEvent<Auto004Order>).detail
      if (detail && Array.isArray(detail.services)) setOrder(detail)
    }
    window.addEventListener(eventName, onBook)
    return () => window.removeEventListener(eventName, onBook)
  }, [eventName])

  const palette = {
    ...(accent ? { "--vibeui-auto-004-accent": accent } : null),
    ...(ink ? { "--vibeui-auto-004-fg": ink } : null),
    ...(background ? { "--vibeui-auto-004-bg": background } : null),
    ...style,
  } as CSSProperties

  const parts = snapshot ? snapshot.split("-").map(Number) : null
  const columns = Array.from({ length: days }, (_, index) => {
    if (!parts) return null
    const date = new Date(parts[0], parts[1], parts[2] + index)
    return { date, key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, weekday: date.getDay(), today: index === 0 }
  })

  const stateOf = (column: (typeof columns)[number], hour: number) => {
    if (!column || !parts) return "skeleton"
    if (closedWeekdays.includes(column.weekday)) return "closed"
    if (column.today && hour <= parts[3]) return "past"
    // Занятость детерминирована от даты и часа: не мигает между рендерами
    // и не расходится между вкладками.
    const seed = (column.date.getDate() * 31 + column.date.getMonth() * 7 + hour * 13) % 7
    return seed === 0 || seed === 3 ? "busy" : "free"
  }

  const pickedInfo = (() => {
    if (!picked) return null
    const [key, hour] = picked.split("@")
    const column = columns.find((item) => item?.key === key)
    if (!column) return null
    return `${WEEKDAYS[column.weekday]}, ${column.date.getDate()} ${MONTHS[column.date.getMonth()]} · ${hour}:00`
  })()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-auto-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="auto-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="layout">
            <div>
              <div data-part="board">
                <div data-part="grid" aria-label="Свободные слоты на неделю" style={{ ["--vibeui-auto-004-days" as string]: days }}>
                  <span aria-hidden="true" />
                  {columns.map((column, index) => (
                    <span key={index} data-part="day" data-today={column?.today ? "true" : undefined}>
                      <b>{column ? column.date.getDate() : "··"}</b>
                      {column ? WEEKDAYS[column.weekday] : "···"}
                    </span>
                  ))}
                  {hours.map((hour) => (
                    <FragmentRow key={hour} hour={hour} columns={columns} stateOf={stateOf} picked={picked} onPick={setPicked} />
                  ))}
                </div>
              </div>
              <ul data-part="legend">
                <li>
                  <i />
                  свободно
                </li>
                <li>
                  <i data-kind="busy" />
                  занято
                </li>
                <li>
                  <i data-kind="picked" />
                  ваш выбор
                </li>
              </ul>
            </div>
            <aside data-part="panel" aria-live="polite">
              {done ? (
                <div data-part="done">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="32" cy="32" r="25" />
                    <path d="M21 33l8 8 14-16" />
                  </svg>
                  <h3>{doneTitle}</h3>
                  {pickedInfo ? <p>{pickedInfo}</p> : null}
                  <p>{doneText}</p>
                </div>
              ) : (
                <>
                  <h3>Ваш заказ</h3>
                  {order && order.services.length > 0 ? (
                    <>
                      <ul data-part="order">
                        {order.services.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                        {order.carClass ? <li>Класс: {order.carClass}</li> : null}
                      </ul>
                      <div data-part="sum">
                        <span>Итого по калькулятору</span>
                        <b>{formatMoney(order.total, currency)}</b>
                      </div>
                    </>
                  ) : (
                    <p data-part="empty">Услуги подтянутся из калькулятора выше. Или просто выберите время — обсудим по телефону.</p>
                  )}
                  <div data-part="when">
                    <small>Время</small>
                    {pickedInfo ?? "Выберите слот в сетке"}
                  </div>
                  <form data-part="form" onSubmit={submit}>
                    <input type="text" name="name" required placeholder={namePlaceholder} aria-label={namePlaceholder} autoComplete="name" />
                    <input type="tel" name="phone" required placeholder={phonePlaceholder} aria-label="Телефон" autoComplete="tel" />
                    <button type="submit" disabled={!picked}>
                      {actionLabel}
                    </button>
                  </form>
                  <p data-part="fine">Предоплаты нет. Перенести или отменить можно до вечера накануне.</p>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

type Column = { date: Date; key: string; weekday: number; today: boolean } | null

function FragmentRow({ hour, columns, stateOf, picked, onPick }: { hour: number; columns: Column[]; stateOf: (column: Column, hour: number) => string; picked: string | null; onPick: (value: string) => void }) {
  return (
    <>
      <span data-part="hour">
        {hour}:00
      </span>
      {columns.map((column, index) => {
        const state = stateOf(column, hour)
        const id = column ? `${column.key}@${hour}` : ""
        const free = state === "free"
        return (
          <button key={index} data-part="slot" type="button" data-state={state} aria-pressed={free ? picked === id : undefined} aria-disabled={!free} disabled={state === "skeleton"} aria-label={column ? `${column.date.getDate()} ${MONTHS[column.date.getMonth()]}, ${hour}:00 — ${state === "busy" ? "занято" : state === "past" ? "прошло" : state === "closed" ? "выходной" : "свободно"}` : undefined} onClick={() => (free ? onPick(id) : undefined)}>
            {state === "closed" ? "—" : state === "skeleton" ? "" : `${hour}:00`}
          </button>
        )
      })}
    </>
  )
}
