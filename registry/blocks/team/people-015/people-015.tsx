"use client"

import { useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type People015Doctor = {
  name: string
  role: string
  photo?: string
  /** Чем занимается, коротко: «зубы», «кошки». */
  tags?: readonly string[]
  /** Дни приёма: 0 — воскресенье, 1 — понедельник … 6 — суббота. */
  days: readonly number[]
  hours: string
  since?: string
}

export type People015Props = {
  eyebrow?: string
  title?: string
  lede?: string
  doctors?: readonly People015Doctor[]
  actionLabel?: string
  actionHref?: string
  /** Дни недели: полные с воскресенья и короткие с понедельника. */
  dayNames?: readonly string[]
  dayShort?: readonly string[]
  scheduleTitle?: string
  scheduleNote?: string
  todayLine?: string
  onDutyLine?: string
  nobodyLine?: string
  todayHoursLine?: string
  weekLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Врачи ветклиники: карточки с 3D-tilt за курсором (perspective +
// rotateX/Y через --rx/--ry на currentTarget, без стейта) и бликом,
// который ездит за указателем. Сверху строка «сегодня, среда — принимают:
// …» и бейджи «сегодня» на карточках — день недели берётся из
// useSyncExternalStore с серверным снимком null, так что на сервере и до
// гидрации показывается нейтральное «расписание приёма».
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="people-015"]){
--vibeui-people-015-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-015-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-015-on-accent:oklch(from var(--vibeui-people-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-015-muted:color-mix(in oklab,var(--vibeui-people-015-fg) 62%,var(--vibeui-people-015-bg));
--vibeui-people-015-line:color-mix(in oklab,var(--vibeui-people-015-fg) 12%,transparent);
--vibeui-people-015-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-people-015-bg) 88%,#fff));
--vibeui-people-015-today:#4f8f45;
--vibeui-people-015-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-people-015-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-015"]{color-scheme:dark}
:where([data-vibeui-block="people-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-015"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-people-015-bg);color:var(--vibeui-people-015-fg);font-family:var(--vibeui-people-015-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-015"] *{box-sizing:border-box}
[data-vibeui-block="people-015"] [data-part="action"]{margin:2rem 0 0}
[data-vibeui-block="people-015"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-015"] [data-part="head"]{display:grid;gap:1.2rem;align-items:end}
[data-vibeui-block="people-015"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-people-015-accent)}
[data-vibeui-block="people-015"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-015-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="people-015"] [data-part="lede"]{margin:.9rem 0 0;max-width:34rem;color:var(--vibeui-people-015-muted)}
[data-vibeui-block="people-015"] [data-part="today"]{display:flex;align-items:flex-start;gap:.7rem;padding:1rem 1.2rem;border-radius:1.2rem;background:var(--vibeui-people-015-card);border:1px solid var(--vibeui-people-015-line);font-size:.9rem;max-width:26rem}
[data-vibeui-block="people-015"] [data-part="today"] i{position:relative;flex-shrink:0;width:.6rem;height:.6rem;margin-top:.45rem;border-radius:50%;background:var(--vibeui-people-015-today)}
[data-vibeui-block="people-015"] [data-part="today"] i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--vibeui-people-015-today);opacity:0;animation:vibeui-people-015-pulse 2.2s ease-out infinite}
[data-vibeui-block="people-015"] [data-part="today"][data-known="false"] i{background:var(--vibeui-people-015-muted)}
[data-vibeui-block="people-015"] [data-part="today"][data-known="false"] i::after{animation:none}
[data-vibeui-block="people-015"] [data-part="today"] b{display:block;font-family:var(--vibeui-people-015-display);font-weight:800}
[data-vibeui-block="people-015"] [data-part="today"] span{color:var(--vibeui-people-015-muted)}
[data-vibeui-block="people-015"] [data-part="grid"]{display:grid;gap:1.2rem;margin:2.2rem 0 0;padding:0;list-style:none;perspective:1200px}
[data-vibeui-block="people-015"] [data-part="card"]{position:relative;display:grid;grid-template-rows:auto 1fr;border-radius:1.6rem;background:var(--vibeui-people-015-card);border:1px solid var(--vibeui-people-015-line);overflow:hidden;transform:rotateX(var(--vibeui-people-015-rx,0deg)) rotateY(var(--vibeui-people-015-ry,0deg));transform-style:preserve-3d;transition:transform .15s ease-out,box-shadow .3s;will-change:transform}
[data-vibeui-block="people-015"] [data-part="card"]:hover{box-shadow:0 30px 60px -30px rgb(0 0 0 / .5);transition:transform .05s linear,box-shadow .3s}
[data-vibeui-block="people-015"] [data-part="card"]::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(18rem circle at var(--vibeui-people-015-gx,50%) var(--vibeui-people-015-gy,0%),rgb(255 255 255 / .35),transparent 60%);opacity:0;transition:opacity .3s}
[data-vibeui-block="people-015"] [data-part="card"]:hover::after{opacity:1}
[data-vibeui-block="people-015"] [data-part="pic"]{position:relative;aspect-ratio:4/5;background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-people-015-accent) 30%,var(--vibeui-people-015-bg)),color-mix(in oklab,var(--vibeui-people-015-accent) 65%,var(--vibeui-people-015-fg)));display:grid;place-items:center;font-family:var(--vibeui-people-015-display);font-weight:900;font-size:3rem;color:var(--vibeui-people-015-on-accent);overflow:hidden}
[data-vibeui-block="people-015"] [data-part="pic"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="people-015"] [data-part="card"]:hover [data-part="pic"] img{transform:scale(1.05)}
[data-vibeui-block="people-015"] [data-part="badge"]{position:absolute;z-index:2;left:.9rem;top:.9rem;display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-people-015-today);color:#fff;font-family:var(--vibeui-people-015-display);font-weight:800;font-size:.72rem;letter-spacing:.01em;animation:vibeui-people-015-pop .4s cubic-bezier(.34,1.56,.64,1) both}
[data-vibeui-block="people-015"] [data-part="badge"] i{width:.45rem;height:.45rem;border-radius:50%;background:#fff}
[data-vibeui-block="people-015"] [data-part="body"]{padding:1.1rem 1.2rem 1.3rem}
[data-vibeui-block="people-015"] [data-part="body"] h3{margin:0;font-family:var(--vibeui-people-015-display);font-weight:900;font-size:1.2rem;line-height:1.15;letter-spacing:-.01em}
[data-vibeui-block="people-015"] [data-part="role"]{margin:.25rem 0 0;font-size:.88rem;color:var(--vibeui-people-015-muted)}
[data-vibeui-block="people-015"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:.3rem;margin:.8rem 0 0;padding:0;list-style:none}
[data-vibeui-block="people-015"] [data-part="tags"] li{padding:.2rem .55rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-people-015-accent) 12%,transparent);color:var(--vibeui-people-015-accent);font-size:.72rem;font-weight:600}
[data-vibeui-block="people-015"] [data-part="week"]{display:flex;gap:.25rem;margin:1rem 0 0;padding:0;list-style:none}
[data-vibeui-block="people-015"] [data-part="week"] li{flex:1;display:grid;place-items:center;height:1.7rem;border-radius:.5rem;background:color-mix(in oklab,var(--vibeui-people-015-fg) 6%,transparent);color:var(--vibeui-people-015-muted);font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.02em}
[data-vibeui-block="people-015"] [data-part="week"] li[data-on="true"]{background:var(--vibeui-people-015-fg);color:var(--vibeui-people-015-bg)}
[data-vibeui-block="people-015"] [data-part="week"] li[data-today="true"]{box-shadow:0 0 0 2px var(--vibeui-people-015-today)}
[data-vibeui-block="people-015"] [data-part="hours"]{margin:.6rem 0 0;font-size:.82rem;color:var(--vibeui-people-015-muted)}
[data-vibeui-block="people-015"] [data-part="hours"] b{color:var(--vibeui-people-015-fg);font-weight:600}
@keyframes vibeui-people-015-pulse{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2);opacity:0}}
@keyframes vibeui-people-015-pop{from{opacity:0;transform:scale(.6)}}
@container (min-width: 40rem){[data-vibeui-block="people-015"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 56rem){[data-vibeui-block="people-015"] [data-part="head"]{grid-template-columns:1fr auto}}
@container (min-width: 64rem){[data-vibeui-block="people-015"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-015"] *{animation:none!important;transition:none!important}}`


const DEFAULT_DOCTORS: People015Doctor[] = [
  { name: "Марина Соколова", role: "Главный врач, терапевт", photo: "/demo/vet/doctor-01.webp", tags: ["кошки", "УЗИ", "эндокринология"], days: [1, 2, 3, 4, 5], hours: "9:00–17:00", since: "в профессии с 2009" },
  { name: "Артём Гусев", role: "Хирург, ортопед", photo: "/demo/vet/doctor-02.webp", tags: ["операции", "переломы", "лапароскопия"], days: [1, 3, 5, 6], hours: "11:00–21:00", since: "в профессии с 2013" },
  { name: "Даша Ким", role: "Ратолог, врач по экзотам", photo: "/demo/vet/doctor-03.webp", tags: ["кролики", "грызуны", "птицы"], days: [0, 2, 4, 6], hours: "10:00–19:00", since: "в профессии с 2017" },
  { name: "Илья Романов", role: "Стоматолог, дежурный врач", photo: "/demo/vet/doctor-04.webp", tags: ["зубы", "ночные смены", "реанимация"], days: [0, 1, 2, 3, 4, 5, 6], hours: "21:00–9:00", since: "в профессии с 2015" },
]

function subscribeMinute(callback: () => void) {
  const id = window.setInterval(callback, 60_000)
  return () => window.clearInterval(id)
}

function dayNow() {
  return new Date().getDay()
}

function tilt(event: ReactPointerEvent<HTMLLIElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  const target = event.currentTarget.style
  target.setProperty("--vibeui-people-015-ry", `${(px - 0.5) * 14}deg`)
  target.setProperty("--vibeui-people-015-rx", `${(0.5 - py) * 12}deg`)
  target.setProperty("--vibeui-people-015-gx", `${px * 100}%`)
  target.setProperty("--vibeui-people-015-gy", `${py * 100}%`)
}

function untilt(event: ReactPointerEvent<HTMLLIElement>) {
  const target = event.currentTarget.style
  target.setProperty("--vibeui-people-015-ry", "0deg")
  target.setProperty("--vibeui-people-015-rx", "0deg")
}

/** Врачи с 3D-tilt и расписанием «кто сегодня принимает». */
export function People015({
  eyebrow = "Врачи",
  title = "Кто сегодня в клинике",
  lede = "Четыре врача, у каждого своя специализация. Расписание живое: смотрите, к кому попадёте прямо сегодня.",
  doctors = DEFAULT_DOCTORS,
  actionLabel = "Все 11 врачей",
  actionHref = "#contacts",
  dayNames = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  dayShort = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  scheduleTitle = "Расписание приёма",
  scheduleNote = "День недели подставится на вашем устройстве.",
  todayLine = "Сегодня, {day}",
  onDutyLine = "Принимают: {list}",
  nobodyLine = "Плановых приёмов нет, дежурный врач на месте.",
  todayHoursLine = "сегодня {hours}",
  weekLabel = "Дни приёма",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People015Props) {
  const today = useSyncExternalStore(subscribeMinute, dayNow, () => null)
  const onDuty = today === null ? [] : doctors.filter((doctor) => doctor.days.includes(today))

  const palette = {
    ...(accent ? { "--vibeui-people-015-accent": accent } : null),
    ...(ink ? { "--vibeui-people-015-fg": ink } : null),
    ...(background ? { "--vibeui-people-015-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-015" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-015" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <p data-part="today" data-known={today !== null} aria-live="polite">
              <i aria-hidden="true" />
              {today === null ? (
                <span>
                  <b>{scheduleTitle}</b>
                  {scheduleNote}
                </span>
              ) : (
                <span>
                  <b>{todayLine.replace("{day}", dayNames[today])}</b>
                  {onDuty.length > 0 ? onDutyLine.replace("{list}", onDuty.map((doctor) => `${doctor.name.split(" ")[0]} ${doctor.hours}`).join(", ")) : nobodyLine}
                </span>
              )}
            </p>
          </div>
          <ul data-part="grid">
            {doctors.map((doctor) => {
              const duty = today !== null && doctor.days.includes(today)
              return (
                <li key={doctor.name} data-part="card" onPointerMove={tilt} onPointerLeave={untilt}>
                  <div data-part="pic">
                    {doctor.photo ? <img src={doctor.photo} alt={doctor.name} loading="lazy" /> : doctor.name.charAt(0)}
                    {duty ? (
                      <span data-part="badge">
                        <i aria-hidden="true" />
                        {todayHoursLine.replace("{hours}", doctor.hours)}
                      </span>
                    ) : null}
                  </div>
                  <div data-part="body">
                    <h3>{doctor.name}</h3>
                    <p data-part="role">{doctor.role}</p>
                    {doctor.tags && doctor.tags.length > 0 ? (
                      <ul data-part="tags">
                        {doctor.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                    <ul data-part="week" aria-label={weekLabel}>
                      {dayShort.map((label, index) => {
                        const day = (index + 1) % 7
                        return (
                          <li key={label} data-on={doctor.days.includes(day)} data-today={today === day}>
                            {label}
                          </li>
                        )
                      })}
                    </ul>
                    <p data-part="hours">
                      <b>{doctor.hours}</b>
                      {doctor.since ? ` · ${doctor.since}` : null}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          {actionLabel ? (
            <Button016
              data-part="action"
              label={actionLabel}
              href={actionHref}
              external={false}
              size="md"
              tone="neutral"
              accent={accent}
            />
          ) : null}
        </div>
      </section>
    </>
  )
}
