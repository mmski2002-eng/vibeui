"use client"

import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from "react"
import { Button091 } from "@/registry/components/button/button-091/button-091"

export type Language002Language = {
  /** Код: «en». Им помечены группы. */
  code: string
  label: string
}

export type Language002Group = {
  lang: string
  level: string
  /** День недели: 1 — понедельник … 7 — воскресенье. */
  day: number
  /** Время начала: «19:30». */
  time: string
  /** Дата старта: «2026-10-05». */
  start: string
  teacher: string
  /** Свободных мест. 0 — лист ожидания. */
  seats: number
}

export type Language002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  languages?: readonly Language002Language[]
  levels?: readonly string[]
  groups?: readonly Language002Group[]
  /** Подписи дней с понедельника. */
  days?: readonly string[]
  actionLabel?: string
  actionHref?: string
  /** Месяцы в родительном падеже, формы слов, подписи фильтров и панели старта. */
  months?: readonly string[]
  dayUnits?: readonly [string, string, string]
  seatUnits?: readonly [string, string, string]
  nearestLabel?: string
  todayLabel?: string
  inDaysLine?: string
  countingLabel?: string
  onRequestLabel?: string
  calendarLabel?: string
  writeLabel?: string
  langFilterLabel?: string
  langShort?: string
  allLabel?: string
  levelFilterLabel?: string
  levelShort?: string
  anyLabel?: string
  emptyText?: string
  tableLabel?: string
  waitlistLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Расписание групп в виде тетрадной клетки: колонки — дни недели, строки —
// время, в ячейках карточки групп с языком, уровнем, преподавателем и
// свободными местами. Сверху фильтры язык / уровень — чипы, сетка при
// смене фильтра «перерисовывается». Справа в шапке «ближайший старт через
// N дней» — считается от текущей даты через useSyncExternalStore, на
// сервере вместо числа заглушка, чтобы не расходилась гидрация. Блок
// слушает событие vibeui-language:level от теста уровня и выставляет
// фильтр по уровню сам. На узком сетка складывается в список по дням.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="language-002"]){
--vibeui-language-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-language-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-002-on-accent:oklch(from var(--vibeui-language-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-language-002-muted:color-mix(in oklab,var(--vibeui-language-002-fg) 62%,var(--vibeui-language-002-bg));
--vibeui-language-002-line:color-mix(in oklab,var(--vibeui-language-002-fg) 12%,transparent);
--vibeui-language-002-rule:color-mix(in oklab,var(--vibeui-language-002-fg) 8%,transparent);
--vibeui-language-002-paper:color-mix(in oklab,var(--vibeui-language-002-bg) 92%,#fff);
--vibeui-language-002-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-002-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="language-002"]{color-scheme:dark}
:where([data-vibeui-block="language-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="language-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="language-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-language-002-bg);color:var(--vibeui-language-002-fg);font-family:var(--vibeui-language-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="language-002"] *{box-sizing:border-box}
[data-vibeui-block="language-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="language-002"] [data-part="head"]{display:grid;gap:1.5rem;margin:0 0 2rem;align-items:end}
[data-vibeui-block="language-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-language-002-hand);font-size:1.4rem;color:var(--vibeui-language-002-accent)}
[data-vibeui-block="language-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-language-002-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="language-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="next"]{position:relative;display:grid;gap:.2rem;padding:1.2rem 1.4rem;border-radius:.4rem 1.2rem 1.2rem .4rem;background:var(--vibeui-language-002-paper);border:1px solid var(--vibeui-language-002-line);border-left:3px solid var(--vibeui-language-002-accent);transform:rotate(-1deg)}
[data-vibeui-block="language-002"] [data-part="next"] small{font-size:.75rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="next"] strong{font-family:var(--vibeui-language-002-display);font-weight:800;font-size:clamp(1.6rem,3cqi,2.2rem);line-height:1.05;letter-spacing:-.03em;color:var(--vibeui-language-002-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="language-002"] [data-part="next"] span{font-size:.9rem;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="filters"]{display:grid;gap:.8rem;margin:0 0 1.5rem}
[data-vibeui-block="language-002"] [data-part="filter"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem}
[data-vibeui-block="language-002"] [data-part="filter"] > span{margin-right:.4rem;font-size:.78rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="grid"]{display:grid;gap:.6rem;animation:vibeui-language-002-fade .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-002"] [data-part="row"]{display:contents}
[data-vibeui-block="language-002"] [data-part="dayhead"]{display:none}
[data-vibeui-block="language-002"] [data-part="timehead"]{display:none}
[data-vibeui-block="language-002"] [data-part="cell"]{display:grid;gap:.5rem;align-content:start;min-width:0}
[data-vibeui-block="language-002"] [data-part="cell"][data-empty="true"]{display:none}
[data-vibeui-block="language-002"] [data-part="cell"]::before{content:attr(data-label);font-family:var(--vibeui-language-002-display);font-size:.78rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="group"]{position:relative;display:grid;gap:.25rem;padding:.7rem .8rem;border-radius:.8rem;background:var(--vibeui-language-002-paper);border:1px solid var(--vibeui-language-002-line);color:inherit;text-decoration:none;font-size:.82rem;line-height:1.3;transition:transform .2s cubic-bezier(.2,.8,.2,1),border-color .2s,box-shadow .2s}
[data-vibeui-block="language-002"] [data-part="group"]:hover{transform:translateY(-2px) rotate(-.6deg);border-color:var(--vibeui-language-002-accent);box-shadow:0 14px 24px -18px var(--vibeui-language-002-fg)}
[data-vibeui-block="language-002"] [data-part="group"]:focus-visible{outline:2px solid var(--vibeui-language-002-accent);outline-offset:2px}
[data-vibeui-block="language-002"] [data-part="group"] header{display:flex;align-items:center;gap:.4rem;font-family:var(--vibeui-language-002-display);font-weight:700}
[data-vibeui-block="language-002"] [data-part="group"] header b{padding:.1rem .4rem;border-radius:.4rem;background:var(--vibeui-language-002-accent);color:var(--vibeui-language-002-on-accent);font-size:.66rem;letter-spacing:.06em}
[data-vibeui-block="language-002"] [data-part="group"] header i{margin-left:auto;font-style:normal;font-weight:500;color:var(--vibeui-language-002-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="language-002"] [data-part="group"] span{color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="group"] em{font-style:normal;font-family:var(--vibeui-language-002-hand);font-size:1rem;color:var(--vibeui-language-002-accent)}
[data-vibeui-block="language-002"] [data-part="group"][data-full="true"] em{color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="empty"]{padding:2rem;border-radius:1rem;border:1px dashed var(--vibeui-language-002-line);text-align:center;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="foot"]{margin:1.5rem 0 0;font-family:var(--vibeui-language-002-hand);font-size:1.15rem;color:var(--vibeui-language-002-muted)}
[data-vibeui-block="language-002"] [data-part="foot"] a{color:inherit;text-decoration-color:var(--vibeui-language-002-accent);text-underline-offset:.2em}
[data-vibeui-block="language-002"] [data-part="foot"] a:hover{color:var(--vibeui-language-002-accent)}
[data-vibeui-block="language-002"] [data-part="foot"] a:focus-visible{outline:2px solid var(--vibeui-language-002-accent);outline-offset:2px}
@keyframes vibeui-language-002-fade{from{opacity:0;transform:translateY(8px)}}
@container (min-width: 44rem){[data-vibeui-block="language-002"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="language-002"] [data-part="next"]{min-width:16rem}}
@container (min-width: 60rem){[data-vibeui-block="language-002"] [data-part="filters"]{grid-template-columns:auto auto;justify-content:space-between}[data-vibeui-block="language-002"] [data-part="grid"]{grid-template-columns:3.2rem repeat(7,minmax(0,1fr));gap:1px;padding:1px;border-radius:1rem;background:var(--vibeui-language-002-rule);overflow:hidden}[data-vibeui-block="language-002"] [data-part="dayhead"],[data-vibeui-block="language-002"] [data-part="timehead"]{display:grid;place-items:center;padding:.6rem .3rem;background:var(--vibeui-language-002-bg);font-family:var(--vibeui-language-002-display);font-size:.78rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-002-muted)}[data-vibeui-block="language-002"] [data-part="timehead"]{font-variant-numeric:tabular-nums;text-transform:none;align-content:start;padding-top:.8rem}[data-vibeui-block="language-002"] [data-part="cell"]{padding:.4rem;background:var(--vibeui-language-002-bg);min-height:5.5rem}[data-vibeui-block="language-002"] [data-part="cell"][data-empty="true"]{display:block;background-image:radial-gradient(var(--vibeui-language-002-line) 1px,transparent 1px);background-size:.6rem .6rem}[data-vibeui-block="language-002"] [data-part="cell"]::before{display:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="language-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_LANGUAGES: Language002Language[] = [
  { code: "en", label: "Английский" },
  { code: "es", label: "Испанский" },
  { code: "it", label: "Итальянский" },
]

const DEFAULT_LEVELS = ["A1", "A2", "B1", "B2", "C1"]

const DEFAULT_GROUPS: Language002Group[] = [
  { lang: "en", level: "A1", day: 2, time: "19:30", start: "2026-10-05", teacher: "Анна", seats: 3 },
  { lang: "en", level: "A1", day: 4, time: "19:30", start: "2026-10-05", teacher: "Анна", seats: 3 },
  { lang: "en", level: "A2", day: 1, time: "20:00", start: "2026-09-28", teacher: "Emma", seats: 1 },
  { lang: "en", level: "A2", day: 3, time: "20:00", start: "2026-09-28", teacher: "Emma", seats: 1 },
  { lang: "en", level: "B1", day: 2, time: "20:00", start: "2026-10-05", teacher: "Emma", seats: 4 },
  { lang: "en", level: "B1", day: 4, time: "20:00", start: "2026-10-05", teacher: "Emma", seats: 4 },
  { lang: "en", level: "B2", day: 1, time: "19:30", start: "2026-10-12", teacher: "Анна", seats: 2 },
  { lang: "en", level: "B2", day: 3, time: "19:30", start: "2026-10-12", teacher: "Анна", seats: 2 },
  { lang: "en", level: "C1", day: 6, time: "12:00", start: "2026-10-10", teacher: "Emma", seats: 0 },
  { lang: "es", level: "A1", day: 1, time: "19:30", start: "2026-10-05", teacher: "Diego", seats: 5 },
  { lang: "es", level: "A1", day: 3, time: "19:30", start: "2026-10-05", teacher: "Diego", seats: 5 },
  { lang: "es", level: "A2", day: 6, time: "11:00", start: "2026-10-17", teacher: "Diego", seats: 2 },
  { lang: "es", level: "B1", day: 2, time: "08:00", start: "2026-10-06", teacher: "Diego", seats: 3 },
  { lang: "es", level: "B1", day: 4, time: "08:00", start: "2026-10-06", teacher: "Diego", seats: 3 },
  { lang: "it", level: "A1", day: 2, time: "20:00", start: "2026-10-13", teacher: "Giulia", seats: 6 },
  { lang: "it", level: "A1", day: 4, time: "20:00", start: "2026-10-13", teacher: "Giulia", seats: 6 },
  { lang: "it", level: "A2", day: 7, time: "12:00", start: "2026-10-18", teacher: "Giulia", seats: 2 },
  { lang: "it", level: "B1", day: 5, time: "19:30", start: "2026-10-09", teacher: "Giulia", seats: 1 },
]

const listeners = new Set<() => void>()
let minute = 0
let ticker: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!ticker) {
    ticker = setInterval(() => {
      minute = Math.floor(Date.now() / 60000)
      listeners.forEach((fn) => fn())
    }, 60000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && ticker) {
      clearInterval(ticker)
      ticker = undefined
    }
  }
}

function getSnapshot() {
  if (minute === 0) minute = Math.floor(Date.now() / 60000)
  return minute
}

function getServerSnapshot(): number | null {
  return null
}

function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

function pluralDays(count: number, units: readonly [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return units[1]
  return units[2]
}

function pluralSeats(count: number, units: readonly [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return units[1]
  return units[2]
}

/** Расписание групп: сетка неделя × время, фильтры, «ближайший старт через N дней». */
export function Language002({
  eyebrow = "расписание",
  title = "Группы, которые стартуют этой осенью",
  lede = "Выберите язык и уровень — покажем, где есть места. Занятия два раза в неделю по часу, утренние и вечерние.",
  languages = DEFAULT_LANGUAGES,
  levels = DEFAULT_LEVELS,
  groups = DEFAULT_GROUPS,
  days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  actionLabel = "Не нашли своё время? Напишите — соберём группу под вас.",
  actionHref = "#trial",
  months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  dayUnits = ["день", "дня", "дней"],
  seatUnits = ["место", "места", "мест"],
  nearestLabel = "ближайший старт",
  todayLabel = "сегодня",
  inDaysLine = "через {n} {days}",
  countingLabel = "считаем…",
  onRequestLabel = "по запросу",
  calendarLabel = "смотрим календарь",
  writeLabel = "напишите — соберём группу",
  langFilterLabel = "Язык",
  langShort = "язык",
  allLabel = "Все",
  levelFilterLabel = "Уровень",
  levelShort = "уровень",
  anyLabel = "Любой",
  emptyText = "Таких групп пока нет — но мы собираем новые каждые две недели.",
  tableLabel = "Расписание групп",
  waitlistLabel = "лист ожидания",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Language002Props) {
  const [lang, setLang] = useState("all")
  const [level, setLevel] = useState("all")
  const now = useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    const onLevel = (event: Event) => {
      const detail = (event as CustomEvent<{ level?: string }>).detail
      if (detail?.level && levels.includes(detail.level)) setLevel(detail.level)
    }
    window.addEventListener("vibeui-language:level", onLevel)
    return () => window.removeEventListener("vibeui-language:level", onLevel)
  }, [levels])

  const filtered = useMemo(() => groups.filter((group) => (lang === "all" || group.lang === lang) && (level === "all" || group.level === level)), [groups, lang, level])
  const times = useMemo(() => Array.from(new Set(filtered.map((group) => group.time))).sort(), [filtered])

  const nearest = useMemo(() => {
    if (now === null || filtered.length === 0) return null
    const nowMs = now * 60000
    let best: { group: Language002Group; daysLeft: number } | null = null
    for (const group of filtered) {
      const daysLeft = Math.ceil((parseDate(group.start).getTime() - nowMs) / 86400000)
      if (daysLeft < 0) continue
      if (!best || daysLeft < best.daysLeft) best = { group, daysLeft }
    }
    return best
  }, [filtered, now])

  const languageLabel = (code: string) => languages.find((item) => item.code === code)?.label ?? code.toUpperCase()

  const palette = {
    ...(accent ? { "--vibeui-language-002-accent": accent } : null),
    ...(ink ? { "--vibeui-language-002-fg": ink } : null),
    ...(background ? { "--vibeui-language-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-language-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="language-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="next" aria-live="polite">
              <small>{nearestLabel}</small>
              {nearest ? (
                <>
                  <strong>{nearest.daysLeft === 0 ? todayLabel : inDaysLine.replace("{n}", String(nearest.daysLeft)).replace("{days}", pluralDays(nearest.daysLeft, dayUnits))}</strong>
                  <span>
                    {parseDate(nearest.group.start).getDate()} {months[parseDate(nearest.group.start).getMonth()]} · {languageLabel(nearest.group.lang)} {nearest.group.level} · {nearest.group.time}
                  </span>
                </>
              ) : (
                <>
                  <strong>{now === null ? countingLabel : onRequestLabel}</strong>
                  <span>{now === null ? calendarLabel : writeLabel}</span>
                </>
              )}
            </div>
          </div>
          <div data-part="filters">
            <div data-part="filter" role="group" aria-label={langFilterLabel}>
              <span>{langShort}</span>
              <Button091 data-part="chip" label={allLabel} aria-pressed={lang === "all"} onClick={() => setLang("all")} accent={accent} />
              {languages.map((item) => (
                <Button091 key={item.code} data-part="chip" label={item.label} aria-pressed={lang === item.code} onClick={() => setLang(item.code)} accent={accent} />
              ))}
            </div>
            <div data-part="filter" role="group" aria-label={levelFilterLabel}>
              <span>{levelShort}</span>
              <Button091 data-part="chip" label={anyLabel} aria-pressed={level === "all"} onClick={() => setLevel("all")} accent={accent} />
              {levels.map((item) => (
                <Button091 key={item} data-part="chip" label={item} aria-pressed={level === item} onClick={() => setLevel(item)} accent={accent} />
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p data-part="empty">{emptyText}</p>
          ) : (
            <div data-part="grid" key={`${lang}-${level}`} role="table" aria-label={tableLabel}>
              <div data-part="timehead" role="columnheader" aria-hidden="true" />
              {days.map((day) => (
                <div key={day} data-part="dayhead" role="columnheader">
                  {day}
                </div>
              ))}
              {times.map((time) => (
                <div key={time} data-part="row" role="row">
                  <div data-part="timehead" role="rowheader">
                    {time}
                  </div>
                  {days.map((day, dayIndex) => {
                    const cellGroups = filtered.filter((group) => group.day === dayIndex + 1 && group.time === time)
                    return (
                      <div key={day} data-part="cell" role="cell" data-empty={cellGroups.length === 0 ? "true" : undefined} data-label={`${day} · ${time}`}>
                        {cellGroups.map((group, groupIndex) => (
                          <a key={groupIndex} data-part="group" href={actionHref} data-full={group.seats === 0 ? "true" : undefined}>
                            <header>
                              <b>{group.lang.toUpperCase()}</b>
                              {group.level}
                              <i>{group.time}</i>
                            </header>
                            <span>{group.teacher}</span>
                            <em>{group.seats === 0 ? waitlistLabel : `${group.seats} ${pluralSeats(group.seats, seatUnits)}`}</em>
                          </a>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
          {actionLabel ? (
            <p data-part="foot">
              <a href={actionHref}>
                {actionLabel}
              </a>
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
