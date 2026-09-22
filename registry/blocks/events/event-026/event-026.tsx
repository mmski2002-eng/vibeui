"use client"

import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Event026Item = {
  /** Дата ISO «2026-10-03». Если пусто — берётся inDays от сегодня (для демо). */
  date?: string
  /** Через сколько дней от сегодняшнего: демо-данные, чтобы лента не устаревала. */
  inDays?: number
  time?: string
  /** Вид встречи: «презентация», «чтения», «эфир». */
  kind: string
  title: string
  place?: string
  city?: string
  actionLabel?: string
  href?: string
}

export type Event026Props = {
  eyebrow?: string
  title?: string
  lede?: string
  events?: readonly Event026Item[]
  /** Подпись к счётчику дней. */
  countdownLabel?: string
  /** Сколько прошедших встреч показывать (вычеркнутыми). */
  pastLimit?: number
  /** Месяцы в родительном падеже, дни недели, подписи списка. */
  months?: readonly string[]
  days?: readonly string[]
  tbaLabel?: string
  nextLabel?: string
  todayLabel?: string
  dayUnits?: readonly [string, string, string]
  pastLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Встречи с читателями как лента дат от сегодняшнего дня: слева крупно
// «до ближайшей — N дней» (текущее время через useSyncExternalStore, на
// сервере снимок null, поэтому цифры появляются после гидрации без
// рассинхрона), справа список: число антиквой, месяц и день недели, вид
// встречи курсивом, название, место и время. Ближайшая помечена
// пульсирующей точкой, прошедшие остаются вычеркнутыми внизу. Демо-даты
// заданы через inDays, чтобы лента никогда не устаревала.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="event-026"]){
--vibeui-event-026-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-026-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-026-muted:color-mix(in oklab,var(--vibeui-event-026-fg) 60%,var(--vibeui-event-026-bg));
--vibeui-event-026-line:color-mix(in oklab,var(--vibeui-event-026-fg) 14%,transparent);
--vibeui-event-026-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-event-026-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-026"]{color-scheme:dark}
:where([data-vibeui-block="event-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-026"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="event-026"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="event-026"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="event-026"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-event-026-bg);color:var(--vibeui-event-026-fg);font-family:var(--vibeui-event-026-font);font-size:1.05rem;line-height:1.6;transition:background-color .6s,color .6s}
@supports (animation-timeline:view()){[data-vibeui-block="event-026"] [data-part="shell"]{animation:vibeui-event-026-reveal linear both;animation-timeline:view();animation-range:entry 0% entry 35%}}
@keyframes vibeui-event-026-reveal{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="event-026"] *{box-sizing:border-box}
[data-vibeui-block="event-026"] [data-part="action"]{align-self:start;justify-self:start;grid-column:2;margin-top:.5rem}
[data-vibeui-block="event-026"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
@container (min-width:48rem){[data-vibeui-block="event-026"] [data-part="shell"]{padding-block:2rem}}
@container (min-width:72rem){[data-vibeui-block="event-026"] [data-part="shell"]{padding-block:3rem}}
[data-vibeui-block="event-026"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-event-026-accent)}
[data-vibeui-block="event-026"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-026-display);font-weight:400;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.02em}
[data-vibeui-block="event-026"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="countdown"]{margin:2rem 0 0;padding:1.4rem 0 0;border-top:1px solid var(--vibeui-event-026-line)}
[data-vibeui-block="event-026"] [data-part="countdown"] small{display:block;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="countdown"] b{display:block;margin-top:.3rem;font-family:var(--vibeui-event-026-display);font-weight:400;font-size:clamp(3.4rem,9cqi,6.5rem);line-height:.95;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="event-026"] [data-part="countdown"] b span{font-style:italic;font-size:.42em;letter-spacing:0;margin-left:.2em;color:var(--vibeui-event-026-accent)}
[data-vibeui-block="event-026"] [data-part="countdown"] em{display:block;margin-top:.5rem;font-style:italic;color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="list"]{margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-event-026-line)}
[data-vibeui-block="event-026"] [data-part="row"]{position:relative;display:grid;grid-template-columns:4.5rem minmax(0,1fr);gap:.3rem 1.2rem;padding:1.3rem 0 1.3rem .6rem;border-bottom:1px solid var(--vibeui-event-026-line);transition:padding-left .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="event-026"] [data-part="row"]::before{content:"";position:absolute;left:0;top:1.3rem;bottom:1.3rem;width:2px;background:var(--vibeui-event-026-accent);transform:scaleY(0);transform-origin:top;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="event-026"] [data-part="row"]:hover{padding-left:1.2rem}
[data-vibeui-block="event-026"] [data-part="row"]:hover::before,[data-vibeui-block="event-026"] [data-part="row"][data-next="true"]::before{transform:scaleY(1)}
[data-vibeui-block="event-026"] [data-part="row"][data-past="true"]{color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="row"][data-past="true"] [data-part="name"]{text-decoration:line-through;text-decoration-color:var(--vibeui-event-026-accent);text-decoration-thickness:1px}
[data-vibeui-block="event-026"] [data-part="date"]{grid-row:span 2;display:grid;align-content:start;font-family:var(--vibeui-event-026-display);line-height:1}
[data-vibeui-block="event-026"] [data-part="date"] b{font-weight:400;font-size:2.8rem;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="event-026"] [data-part="date"] small{margin-top:.3rem;font-family:var(--vibeui-event-026-font);font-size:.72rem;font-style:italic;letter-spacing:.06em;color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="kind"]{display:flex;align-items:center;gap:.6rem;font-size:.8rem;font-style:italic;letter-spacing:.06em;color:var(--vibeui-event-026-accent)}
[data-vibeui-block="event-026"] [data-part="dot"]{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-event-026-accent);animation:vibeui-event-026-pulse 1.8s ease-in-out infinite}
[data-vibeui-block="event-026"] [data-part="name"]{margin:0;font-family:var(--vibeui-event-026-display);font-weight:400;font-size:clamp(1.4rem,2.6cqi,1.9rem);line-height:1.15}
[data-vibeui-block="event-026"] [data-part="where"]{display:flex;flex-wrap:wrap;gap:.2rem 1rem;margin:.2rem 0 0;font-size:.9rem;color:var(--vibeui-event-026-muted)}
[data-vibeui-block="event-026"] [data-part="where"] span+span::before{content:"·";margin-right:1rem;color:var(--vibeui-event-026-accent)}
[data-vibeui-block="event-026"] [data-part="past-label"]{margin:0;padding:1rem 0 .4rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-event-026-muted)}
@keyframes vibeui-event-026-pulse{50%{transform:scale(1.6);opacity:.5}}
@container (min-width: 44rem){
[data-vibeui-block="event-026"] [data-part="action"]{grid-column:3;grid-row:1/span 2;align-self:center;margin:0}[data-vibeui-block="event-026"] [data-part="row"]{grid-template-columns:5rem minmax(0,1fr) auto}}
@container (min-width: 60rem){[data-vibeui-block="event-026"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:4rem;align-items:start}[data-vibeui-block="event-026"] [data-part="aside"]{position:sticky;top:6rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-026"] *{animation:none!important;transition:none!important}}`


const DEFAULT_EVENTS: Event026Item[] = [
  { inDays: -9, time: "19:30", kind: "чтения", title: "«Балконы» и другие тексты — вечер в «Подписных изданиях»", place: "Подписные издания", city: "Петербург" },
  { inDays: 6, time: "19:00", kind: "презентация", title: "«Комнаты, в которых мы не жили» — первая презентация книги", place: "Дом книги, зал на втором этаже", city: "Петербург", actionLabel: "Записаться", href: "#rsvp" },
  { inDays: 14, time: "20:00", kind: "эфир", title: "Разговор о городах и памяти в подкасте «Между строк»", place: "Онлайн, ссылка придёт письмом", actionLabel: "Напомнить", href: "#letters" },
  { inDays: 27, time: "18:00", kind: "чтения", title: "Читаю новые эссе из «Ночной смены» — черновики вслух", place: "Библиотека им. Некрасова", city: "Москва", actionLabel: "Записаться", href: "#rsvp" },
  { inDays: 41, time: "17:00", kind: "презентация", title: "Книга в Тбилиси: разговор на двух языках", place: "Книжный «Auditoria»", city: "Тбилиси", actionLabel: "Подробнее", href: "#rsvp" },
]

const listeners = new Set<() => void>()
let minuteTimer = 0
function subscribe(callback: () => void) {
  listeners.add(callback)
  if (!minuteTimer) minuteTimer = window.setInterval(() => listeners.forEach((fn) => fn()), 60000)
  return () => {
    listeners.delete(callback)
    if (listeners.size === 0 && minuteTimer) {
      window.clearInterval(minuteTimer)
      minuteTimer = 0
    }
  }
}
function getMinute() {
  return Math.floor(Date.now() / 60000)
}
function getServerMinute() {
  return null
}

function plural(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

/** Встречи как лента дат от сегодня с «до ближайшей — N дней». */
export function Event026({
  eyebrow = "Встречи",
  title = "Где увидимся",
  lede = "Презентации, чтения и эфиры. Приходите, я подпишу книгу и почитаю то, чего ещё нет в печати.",
  events = DEFAULT_EVENTS,
  countdownLabel = "до ближайшей встречи",
  pastLimit = 1,
  months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  tbaLabel = "дата уточняется",
  nextLabel = "· ближайшая",
  todayLabel = "сегодня",
  dayUnits = ["день", "дня", "дней"],
  pastLabel = "Уже прошло",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event026Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  const rows = useMemo(() => {
    const today = minute === null ? null : new Date(minute * 60000)
    if (today) today.setHours(0, 0, 0, 0)
    const resolved = events.map((event) => {
      let date: Date | null = null
      if (event.date) date = new Date(event.date + "T00:00:00")
      else if (today && event.inDays !== undefined) {
        date = new Date(today)
        date.setDate(date.getDate() + event.inDays)
      }
      const days = date && today ? Math.round((date.getTime() - today.getTime()) / 86400000) : null
      return { event, date, days }
    })
    resolved.sort((a, b) => (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity))
    const upcoming = resolved.filter((row) => row.days === null || row.days >= 0)
    const past = resolved.filter((row) => row.days !== null && row.days < 0).slice(-pastLimit)
    return { upcoming, past, next: upcoming.find((row) => row.days !== null) ?? null }
  }, [events, minute, pastLimit])

  const palette = {
    ...(accent ? { "--vibeui-event-026-accent": accent } : null),
    ...(ink ? { "--vibeui-event-026-fg": ink } : null),
    ...(background ? { "--vibeui-event-026-bg": background } : null),
    ...style,
  } as CSSProperties

  const renderRow = (row: { event: Event026Item; date: Date | null; days: number | null }, isNext: boolean, isPast: boolean) => (
    <li key={row.event.title} data-part="row" data-next={isNext || undefined} data-past={isPast || undefined}>
      <div data-part="date">
        <b>{row.date ? row.date.getDate() : "—"}</b>
        <small>{row.date ? `${months[row.date.getMonth()]}, ${days[row.date.getDay()]}` : tbaLabel}</small>
      </div>
      <div>
        <div data-part="kind">
          {isNext ? <i data-part="dot" aria-hidden="true" /> : null}
          <span>{row.event.kind}</span>
          {isNext ? <span>{nextLabel}</span> : null}
        </div>
        <h3 data-part="name">{row.event.title}</h3>
        <p data-part="where">
          {row.event.place ? <span>{row.event.place}</span> : null}
          {row.event.city ? <span>{row.event.city}</span> : null}
          {row.event.time ? <span>{row.event.time}</span> : null}
        </p>
      </div>
      {row.event.actionLabel && !isPast ? (
        <Button077
          data-part="action"
          label={row.event.actionLabel}
          href={row.event.href ?? "#"}
          accent={accent}
        />
      ) : null}
    </li>
  )

  const nextDays = rows.next?.days ?? null

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-026" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-026" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="aside">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="countdown" aria-live="off">
              <small>{countdownLabel}</small>
              {nextDays === null ? (
                <b>…</b>
              ) : nextDays === 0 ? (
                <b>{todayLabel}</b>
              ) : (
                <b>
                  {nextDays}
                  <span>{plural(nextDays, ...dayUnits)}</span>
                </b>
              )}
              {rows.next ? <em>{rows.next.event.kind}{rows.next.event.city ? `, ${rows.next.event.city}` : ""}</em> : null}
            </div>
          </div>
          <div>
            <ul data-part="list">
              {rows.upcoming.map((row) => renderRow(row, row === rows.next, false))}
            </ul>
            {rows.past.length > 0 ? (
              <>
                <p data-part="past-label">{pastLabel}</p>
                <ul data-part="list">{rows.past.map((row) => renderRow(row, false, true))}</ul>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
