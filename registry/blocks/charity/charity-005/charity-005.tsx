"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Charity005Role = {
  label: string
  /** Что делать: «привозить продукты раз в неделю». */
  text: string
  /** Сколько часов в неделю обычно занимает. */
  hours: number
}

export type Charity005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  roles?: readonly Charity005Role[]
  days?: readonly string[]
  namePlaceholder?: string
  actionLabel?: string
  doneTitle?: string
  doneText?: string
  /** Сколько человек «помогло сегодня» к полуночи — счётчик растёт от текущего времени. */
  helpedPerDay?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Стать волонтёром»: слева чипы ролей (одна), дни недели (несколько) и
// имя, справа живая карточка волонтёра — бейдж на шнурке, который меняется
// по мере выбора: имя, роль, часы в неделю, точки дней, дата заявки.
// Счётчик «сегодня помогли N» считается от текущего времени через
// useSyncExternalStore с серверным снимком null — без рассинхрона гидрации.
// Форма ничего не отправляет: заглушка с рисующейся галочкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="charity-005"]){
--vibeui-charity-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-charity-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-005-on-accent:oklch(from var(--vibeui-charity-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-charity-005-muted:color-mix(in oklab,var(--vibeui-charity-005-fg) 62%,var(--vibeui-charity-005-bg));
--vibeui-charity-005-line:color-mix(in oklab,var(--vibeui-charity-005-fg) 16%,transparent);
--vibeui-charity-005-soft:color-mix(in oklab,var(--vibeui-charity-005-fg) 6%,var(--vibeui-charity-005-bg));
--vibeui-charity-005-second:color-mix(in oklab,var(--vibeui-charity-005-accent) 45%,#e0b000);
--vibeui-charity-005-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-charity-005-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-charity-005-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="charity-005"]{color-scheme:dark}
:where([data-vibeui-block="charity-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="charity-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="charity-005"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-charity-005-bg);color:var(--vibeui-charity-005-fg);font-family:var(--vibeui-charity-005-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="charity-005"] *{box-sizing:border-box}
[data-vibeui-block="charity-005"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="charity-005"] [data-part="eyebrow"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem 1rem;margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-charity-005-accent)}
[data-vibeui-block="charity-005"] [data-part="today"]{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:999px;background:var(--vibeui-charity-005-soft);font-size:.78rem;letter-spacing:.02em;text-transform:none;color:var(--vibeui-charity-005-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="charity-005"] [data-part="today"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-charity-005-accent);animation:vibeui-charity-005-blink 2s ease-in-out infinite}
[data-vibeui-block="charity-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-charity-005-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="charity-005"] [data-part="lede"]{margin:1rem 0 0;max-width:32rem;color:var(--vibeui-charity-005-muted)}
[data-vibeui-block="charity-005"] [data-part="form"]{display:grid;gap:1.6rem;margin:2rem 0 0}
[data-vibeui-block="charity-005"] [data-part="group"]{display:grid;gap:.6rem}
[data-vibeui-block="charity-005"] [data-part="group"] legend,[data-vibeui-block="charity-005"] [data-part="group"] label{padding:0;margin:0 0 .2rem;font-size:.82rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-charity-005-muted)}
[data-vibeui-block="charity-005"] fieldset{border:0;padding:0;margin:0;min-width:0}
[data-vibeui-block="charity-005"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem}
[data-vibeui-block="charity-005"] [data-part="chip"]{padding:.6rem 1rem;border-radius:999px;border:1px solid var(--vibeui-charity-005-line);background:transparent;color:var(--vibeui-charity-005-fg);font:inherit;font-weight:500;font-size:.95rem;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s}
[data-vibeui-block="charity-005"] [data-part="chip"]:hover{border-color:var(--vibeui-charity-005-accent);transform:translateY(-1px)}
[data-vibeui-block="charity-005"] [data-part="chip"][aria-pressed="true"],[data-vibeui-block="charity-005"] [data-part="chip"][aria-checked="true"]{background:var(--vibeui-charity-005-accent);border-color:var(--vibeui-charity-005-accent);color:var(--vibeui-charity-005-on-accent)}
[data-vibeui-block="charity-005"] [data-part="chip"][data-day]{width:3rem;height:3rem;padding:0;border-radius:50%;text-align:center}
[data-vibeui-block="charity-005"] [data-part="input"]{width:100%;height:3.2rem;padding:0 1rem;border-radius:.8rem;border:1px solid var(--vibeui-charity-005-line);background:transparent;color:var(--vibeui-charity-005-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="charity-005"] [data-part="input"]:focus-visible{border-color:var(--vibeui-charity-005-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-charity-005-accent) 22%,transparent)}
[data-vibeui-block="charity-005"] [data-part="submit"]{justify-self:start;display:inline-flex;align-items:center;gap:.5rem;padding:.95rem 1.6rem;border-radius:999px;border:0;background:var(--vibeui-charity-005-fg);color:var(--vibeui-charity-005-bg);font:inherit;font-weight:600;font-size:1rem;cursor:pointer;transition:transform .18s,box-shadow .2s,opacity .2s}
[data-vibeui-block="charity-005"] [data-part="submit"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -14px var(--vibeui-charity-005-fg)}
[data-vibeui-block="charity-005"] [data-part="submit"]:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
[data-vibeui-block="charity-005"] button:focus-visible{outline:2px solid var(--vibeui-charity-005-accent);outline-offset:2px}
[data-vibeui-block="charity-005"] [data-part="stage"]{position:relative;padding:2.5rem 0 1rem}
[data-vibeui-block="charity-005"] [data-part="lanyard"]{position:absolute;left:50%;top:0;width:1.2rem;height:3.2rem;transform:translateX(-50%);background:repeating-linear-gradient(180deg,var(--vibeui-charity-005-accent) 0 .5rem,color-mix(in oklab,var(--vibeui-charity-005-accent) 70%,#fff) .5rem 1rem);border-radius:0 0 .3rem .3rem}
[data-vibeui-block="charity-005"] [data-part="badge"]{position:relative;max-width:22rem;margin:0 auto;padding:2rem 1.6rem 1.6rem;border-radius:1.2rem;background:var(--vibeui-charity-005-bg);border:1px solid var(--vibeui-charity-005-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .5);transform-origin:top center;animation:vibeui-charity-005-swing 6s ease-in-out infinite;display:grid;gap:.9rem}
[data-vibeui-block="charity-005"] [data-part="badge"]::before{content:"";position:absolute;top:.8rem;left:50%;width:2.4rem;height:.5rem;transform:translateX(-50%);border-radius:999px;background:var(--vibeui-charity-005-soft);border:1px solid var(--vibeui-charity-005-line)}
[data-vibeui-block="charity-005"] [data-part="brand"]{display:flex;justify-content:space-between;align-items:baseline;margin-top:.6rem;font-family:var(--vibeui-charity-005-display);font-style:italic;font-size:1rem;color:var(--vibeui-charity-005-muted)}
[data-vibeui-block="charity-005"] [data-part="brand"] small{font-family:var(--vibeui-charity-005-font);font-style:normal;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="charity-005"] [data-part="avatar"]{width:5rem;height:5rem;border-radius:50%;display:grid;place-items:center;background:color-mix(in oklab,var(--vibeui-charity-005-accent) 18%,var(--vibeui-charity-005-bg));color:var(--vibeui-charity-005-accent);font-family:var(--vibeui-charity-005-hand);font-weight:700;font-size:2rem;transition:background .3s}
[data-vibeui-block="charity-005"] [data-part="who"]{margin:0;font-family:var(--vibeui-charity-005-hand);font-weight:700;font-size:2rem;line-height:1;min-height:1em;color:var(--vibeui-charity-005-fg)}
[data-vibeui-block="charity-005"] [data-part="who"][data-empty="true"]{color:var(--vibeui-charity-005-muted);opacity:.6}
[data-vibeui-block="charity-005"] [data-part="role"]{margin:0;font-size:.9rem;font-weight:600;color:var(--vibeui-charity-005-accent);animation:vibeui-charity-005-in .4s ease-out both}
[data-vibeui-block="charity-005"] [data-part="role"] small{display:block;font-weight:400;color:var(--vibeui-charity-005-muted)}
[data-vibeui-block="charity-005"] [data-part="week"]{display:flex;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="charity-005"] [data-part="week"] li{width:1.9rem;height:1.9rem;border-radius:50%;display:grid;place-items:center;font-size:.7rem;font-weight:600;border:1px solid var(--vibeui-charity-005-line);color:var(--vibeui-charity-005-muted);transition:background .25s,color .25s,transform .25s}
[data-vibeui-block="charity-005"] [data-part="week"] li[data-on="true"]{background:var(--vibeui-charity-005-accent);border-color:var(--vibeui-charity-005-accent);color:var(--vibeui-charity-005-on-accent);transform:scale(1.08)}
[data-vibeui-block="charity-005"] [data-part="facts"]{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin:0;padding:.9rem 0 0;border-top:1px dashed var(--vibeui-charity-005-line)}
[data-vibeui-block="charity-005"] [data-part="facts"] div{display:grid;gap:.1rem}
[data-vibeui-block="charity-005"] [data-part="facts"] dt{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-charity-005-muted)}
[data-vibeui-block="charity-005"] [data-part="facts"] dd{margin:0;font-family:var(--vibeui-charity-005-display);font-weight:700;font-size:1.15rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="charity-005"] [data-part="stamp"]{position:absolute;right:-.4rem;bottom:-.6rem;padding:.3rem .7rem;border:2px solid var(--vibeui-charity-005-second);border-radius:.4rem;font-family:var(--vibeui-charity-005-hand);font-size:1.15rem;line-height:1;color:var(--vibeui-charity-005-second);transform:rotate(-8deg);mix-blend-mode:multiply}
[data-vibeui-block="charity-005"] [data-part="done"]{display:grid;justify-items:center;gap:.6rem;padding:1rem 0;text-align:center}
[data-vibeui-block="charity-005"] [data-part="done"] svg{width:3.6rem;height:3.6rem;color:var(--vibeui-charity-005-accent)}
[data-vibeui-block="charity-005"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-charity-005-draw .8s ease-out forwards}
[data-vibeui-block="charity-005"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-charity-005-draw .5s ease-out .5s forwards}
[data-vibeui-block="charity-005"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-charity-005-display);font-size:1.3rem;font-weight:700}
[data-vibeui-block="charity-005"] [data-part="done"] p{margin:0;font-size:.9rem;color:var(--vibeui-charity-005-muted)}
@keyframes vibeui-charity-005-blink{50%{opacity:.3}}
@keyframes vibeui-charity-005-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes vibeui-charity-005-swing{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
@keyframes vibeui-charity-005-draw{to{stroke-dashoffset:0}}
@container (min-width: 56rem){[data-vibeui-block="charity-005"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:4rem}[data-vibeui-block="charity-005"] [data-part="stage"]{position:sticky;top:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="charity-005"] *{animation:none!important;transition:none!important}[data-vibeui-block="charity-005"] [data-part="done"] circle,[data-vibeui-block="charity-005"] [data-part="done"] path{stroke-dashoffset:0}}`

const DEFAULT_ROLES: Charity005Role[] = [
  { label: "Водитель", text: "Развозить продукты и лекарства по своему району", hours: 3 },
  { label: "Собеседник", text: "Звонить или приходить, чтобы поговорить и почитать вслух", hours: 2 },
  { label: "Мастер", text: "Краны, розетки, замки, утепление окон", hours: 4 },
  { label: "Помощник по дому", text: "Уборка, купание, поход в поликлинику вместе", hours: 4 },
  { label: "Юрист или бухгалтер", text: "Разбирать документы, льготы и счета", hours: 2 },
]

const DEFAULT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

const subscribe = (callback: () => void) => {
  const id = window.setInterval(callback, 60_000)
  return () => window.clearInterval(id)
}
const getMinute = () => Math.floor(Date.now() / 60_000)
const getServerMinute = () => null

/** Стать волонтёром: чипы ролей и дней, живой бейдж, счётчик «сегодня помогли». */
export function Charity005({
  eyebrow = "Стать волонтёром",
  title = "Два часа в неделю — это чья-то среда, которой ждут",
  lede = "Выберите, что умеете, и дни, когда свободны. Мы подберём подопечного рядом с домом и познакомим лично — без анкет на десять страниц.",
  roles = DEFAULT_ROLES,
  days = DEFAULT_DAYS,
  namePlaceholder = "Как вас зовут",
  actionLabel = "Хочу помогать",
  doneTitle = "Заявка у нас",
  doneText = "Координатор напишет в течение двух дней и позовёт на короткую встречу-знакомство.",
  helpedPerDay = 63,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Charity005Props) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute)
  const [roleIndex, setRoleIndex] = useState<number | null>(0)
  const [picked, setPicked] = useState<readonly boolean[]>(() => days.map((day, index) => index === 2 && day.length > 0))
  const [name, setName] = useState("")
  const [done, setDone] = useState(false)
  const role = roleIndex === null ? null : (roles[roleIndex] ?? null)
  const pickedCount = picked.filter(Boolean).length

  const now = minute === null ? null : new Date(minute * 60_000)
  const helped = now === null ? null : Math.max(1, Math.round(((now.getHours() * 60 + now.getMinutes()) / 1440) * helpedPerDay))
  const dateLabel = now === null ? "—" : `${now.getDate()} ${MONTHS[now.getMonth()]}`
  const number = now === null ? "—" : String(1200 + ((now.getDate() * 31 + now.getMonth() * 7 + name.length * 13) % 700))
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  const toggleDay = (index: number) => setPicked((value) => value.map((on, dayIndex) => (dayIndex === index ? !on : on)))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-charity-005-accent": accent } : null),
    ...(ink ? { "--vibeui-charity-005-fg": ink } : null),
    ...(background ? { "--vibeui-charity-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-charity-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="charity-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            <p data-part="eyebrow">
              {eyebrow ? <span>{eyebrow}</span> : null}
              {helped !== null ? <span data-part="today">сегодня помогли {helped} чел.</span> : null}
            </p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <form data-part="form" onSubmit={submit}>
              <fieldset data-part="group">
                <legend>Чем хотите помогать</legend>
                <div data-part="chips">
                  {roles.map((item, index) => (
                    <button key={item.label} data-part="chip" type="button" aria-pressed={roleIndex === index} onClick={() => setRoleIndex(index)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset data-part="group">
                <legend>В какие дни свободны</legend>
                <div data-part="chips" role="group">
                  {days.map((day, index) => (
                    <button key={day} data-part="chip" data-day="" type="button" role="checkbox" aria-checked={picked[index] ?? false} aria-label={day} onClick={() => toggleDay(index)}>
                      {day}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div data-part="group">
                <label htmlFor="vibeui-charity-005-name">Имя</label>
                <input data-part="input" id="vibeui-charity-005-name" type="text" value={name} placeholder={namePlaceholder} autoComplete="given-name" maxLength={40} onChange={(event) => setName(event.target.value)} />
              </div>
              <button data-part="submit" type="submit" disabled={done || role === null || pickedCount === 0}>
                {actionLabel}
              </button>
            </form>
          </div>
          <div data-part="stage" aria-live="polite">
            <i data-part="lanyard" aria-hidden="true" />
            <div data-part="badge">
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
                  <p data-part="brand">
                    <span>Тёплый дом</span>
                    <small>волонтёр № {number}</small>
                  </p>
                  <div data-part="avatar" aria-hidden="true">
                    {initials || "?"}
                  </div>
                  <p data-part="who" data-empty={!name.trim()}>
                    {name.trim() || "Ваше имя"}
                  </p>
                  {role ? (
                    <p data-part="role" key={role.label}>
                      {role.label}
                      <small>{role.text}</small>
                    </p>
                  ) : (
                    <p data-part="role">
                      <small>Выберите роль слева</small>
                    </p>
                  )}
                  <ul data-part="week" aria-label="Дни">
                    {days.map((day, index) => (
                      <li key={day} data-on={picked[index] ?? false}>
                        {day}
                      </li>
                    ))}
                  </ul>
                  <dl data-part="facts">
                    <div>
                      <dt>Часов в неделю</dt>
                      <dd>≈ {role ? role.hours * Math.max(1, pickedCount) : 0}</dd>
                    </div>
                    <div>
                      <dt>Заявка</dt>
                      <dd>{dateLabel}</dd>
                    </div>
                  </dl>
                  <span data-part="stamp" aria-hidden="true">
                    ждём вас
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
