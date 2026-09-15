"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Restaurant006Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Свободные окна на сегодня — чипы, клик подставляет время. */
  slots?: readonly string[]
  slotsLabel?: string
  /** Заметки: «столы для компаний до 12», «с детьми — до 20:00». */
  notes?: readonly string[]
  minGuests?: number
  maxGuests?: number
  submitLabel?: string
  doneTitle?: string
  doneText?: string
  consentLabel?: string
  /** Куда отправить форму. Пусто — показывается «готово» на месте. */
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Бронь стола: слева свободные окна на сегодня чипами и заметки, справа
// форма — дата, время, гости (степпер ±), имя, телефон, пожелание,
// согласие. Клик по чипу подставляет время и сегодняшнюю дату. Настоящая
// <form>: с action уходит POST, без него показывает «готово» на месте.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-006"]){
--vibeui-restaurant-006-bg:light-dark(#efe7dc,#1a1614);
--vibeui-restaurant-006-fg:light-dark(#1c1714,#f2ebe0);
--vibeui-restaurant-006-muted:light-dark(color-mix(in oklab,#1c1714 60%,#efe7dc),color-mix(in oklab,#f2ebe0 58%,#1a1614));
--vibeui-restaurant-006-card:light-dark(#fffaf3,#141110);
--vibeui-restaurant-006-line:light-dark(color-mix(in oklab,#1c1714 16%,#efe7dc),color-mix(in oklab,#f2ebe0 16%,#1a1614));
--vibeui-restaurant-006-accent:#7d2a3a;
--vibeui-restaurant-006-glow:0 0 24px rgb(125 42 58 / .7),0 0 70px rgb(125 42 58 / .35);
--vibeui-restaurant-006-accent-ink:light-dark(var(--vibeui-restaurant-006-accent),color-mix(in oklab,var(--vibeui-restaurant-006-accent) 55%,#f2ebe0));
--vibeui-restaurant-006-on-accent:#fff4ee;
--vibeui-restaurant-006-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-006-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="restaurant-006"]{color-scheme:dark}
:where([data-vibeui-block="restaurant-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="restaurant-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="restaurant-006"]{box-sizing:border-box;display:block;background:var(--vibeui-restaurant-006-bg);color:var(--vibeui-restaurant-006-fg);font-family:var(--vibeui-restaurant-006-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="restaurant-006"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-006"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="restaurant-006"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-restaurant-006-accent-ink);font-weight:600}
[data-vibeui-block="restaurant-006"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-006-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="restaurant-006"] [data-part="lede"]{margin:.75rem 0 0;max-width:30rem;color:var(--vibeui-restaurant-006-muted)}
[data-vibeui-block="restaurant-006"] [data-part="slots-label"]{display:block;margin:2rem 0 .6rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-restaurant-006-muted)}
[data-vibeui-block="restaurant-006"] [data-part="slots"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="restaurant-006"] [data-part="slot"]{appearance:none;border:1px solid var(--vibeui-restaurant-006-line);border-radius:999px;background:transparent;padding:.55rem 1rem;font:inherit;font-size:.9rem;font-weight:600;color:inherit;cursor:pointer;font-variant-numeric:tabular-nums;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="restaurant-006"] [data-part="slot"]:hover{border-color:var(--vibeui-restaurant-006-accent-ink)}
[data-vibeui-block="restaurant-006"] [data-part="slot"][aria-pressed="true"]{background:var(--vibeui-restaurant-006-accent);color:var(--vibeui-restaurant-006-on-accent);border-color:var(--vibeui-restaurant-006-accent-ink);box-shadow:var(--vibeui-restaurant-006-glow)}
[data-vibeui-block="restaurant-006"] [data-part="notes"]{margin:2rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem;color:var(--vibeui-restaurant-006-muted);font-size:.9rem}
[data-vibeui-block="restaurant-006"] [data-part="notes"] li{display:flex;gap:.65rem;align-items:flex-start}
[data-vibeui-block="restaurant-006"] [data-part="notes"] li::before{content:"";flex:none;width:.4rem;height:.4rem;margin-top:.55rem;border-radius:50%;background:var(--vibeui-restaurant-006-accent)}
[data-vibeui-block="restaurant-006"] [data-part="form"]{display:grid;gap:1rem;padding:1.5rem;border-radius:1rem;background:var(--vibeui-restaurant-006-card);border:1px solid var(--vibeui-restaurant-006-line)}
[data-vibeui-block="restaurant-006"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
[data-vibeui-block="restaurant-006"] [data-part="field"]{display:grid;gap:.35rem}
[data-vibeui-block="restaurant-006"] [data-part="field"] > span{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-restaurant-006-muted);font-weight:600}
[data-vibeui-block="restaurant-006"] input:not([type="checkbox"]),[data-vibeui-block="restaurant-006"] textarea{width:100%;padding:0 .9rem;border:1px solid var(--vibeui-restaurant-006-line);border-radius:.6rem;background:transparent;font:inherit;color:inherit;color-scheme:inherit}
[data-vibeui-block="restaurant-006"] input:not([type="checkbox"]){height:3rem}
[data-vibeui-block="restaurant-006"] textarea{padding:.75rem .9rem;min-height:5rem;resize:vertical}
[data-vibeui-block="restaurant-006"] input:focus-visible,[data-vibeui-block="restaurant-006"] textarea:focus-visible,[data-vibeui-block="restaurant-006"] button:focus-visible{outline:2px solid var(--vibeui-restaurant-006-accent);outline-offset:1px}
[data-vibeui-block="restaurant-006"] input::placeholder,[data-vibeui-block="restaurant-006"] textarea::placeholder{color:var(--vibeui-restaurant-006-muted);opacity:.7}
[data-vibeui-block="restaurant-006"] [data-part="stepper"]{display:grid;grid-template-columns:3rem 1fr 3rem;height:3rem;border:1px solid var(--vibeui-restaurant-006-line);border-radius:.6rem;overflow:hidden}
[data-vibeui-block="restaurant-006"] [data-part="stepper"] button{border:0;background:transparent;color:inherit;font:inherit;font-size:1.2rem;cursor:pointer;transition:background .2s}
[data-vibeui-block="restaurant-006"] [data-part="stepper"] button:hover{background:var(--vibeui-restaurant-006-line)}
[data-vibeui-block="restaurant-006"] [data-part="stepper"] output{display:grid;place-items:center;font-family:var(--vibeui-restaurant-006-display);font-size:1.25rem}
[data-vibeui-block="restaurant-006"] [data-part="consent"]{display:flex;gap:.6rem;align-items:flex-start;font-size:.8rem;color:var(--vibeui-restaurant-006-muted);cursor:pointer}
[data-vibeui-block="restaurant-006"] [data-part="consent"] input{margin:.2rem 0 0;accent-color:var(--vibeui-restaurant-006-accent-ink)}
[data-vibeui-block="restaurant-006"] [data-part="submit"]{height:3.25rem;border:0;border-radius:999px;background:var(--vibeui-restaurant-006-accent);color:var(--vibeui-restaurant-006-on-accent);font:inherit;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="restaurant-006"] [data-part="submit"]{box-shadow:var(--vibeui-restaurant-006-glow)}
[data-vibeui-block="restaurant-006"] [data-part="submit"]:hover{transform:translateY(-1px);filter:brightness(1.08)}
[data-vibeui-block="restaurant-006"] [data-part="done"]{display:grid;gap:.5rem;padding:2.5rem 1.5rem;border-radius:1rem;background:var(--vibeui-restaurant-006-card);border:1px solid var(--vibeui-restaurant-006-line);text-align:center}
[data-vibeui-block="restaurant-006"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-restaurant-006-display);font-size:2rem;font-weight:400;line-height:1.05}
[data-vibeui-block="restaurant-006"] [data-part="done"] p{margin:0;color:var(--vibeui-restaurant-006-muted)}
@container (min-width: 56rem){
[data-vibeui-block="restaurant-006"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="restaurant-006"] [data-part="form"],[data-vibeui-block="restaurant-006"] [data-part="done"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-006"] *{transition:none!important}}`

function today(): string {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

/** Бронь стола: свободные окна чипами, форма с датой, временем, гостями и телефоном. */
export function Restaurant006({
  eyebrow = "Бронь",
  title = "Оставьте стол за собой",
  lede = "Подтверждаем в течение пятнадцати минут в рабочее время. Компании от восьми человек — по телефону.",
  slots = ["18:00", "18:30", "19:30", "20:00", "21:30"],
  slotsLabel = "Свободно сегодня",
  notes = ["Стол держим 15 минут после брони", "С детьми — до 20:00, есть стулья", "Терраса открыта с мая по сентябрь"],
  minGuests = 1,
  maxGuests = 12,
  submitLabel = "Забронировать",
  doneTitle = "Стол ваш",
  doneText = "Пришлём подтверждение в мессенджер за пару минут.",
  consentLabel = "Согласен на обработку данных и звонок по этому номеру.",
  action = "",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Restaurant006Props) {
  const [done, setDone] = useState(false)
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-restaurant-006-accent": accent } : null),
    ...(background ? { "--vibeui-restaurant-006-bg": background } : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (action) return
    event.preventDefault()
    setDone(true)
  }

  const pick = (slot: string) => {
    setTime(slot)
    if (!date) setDate(today())
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-006" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="restaurant-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {slots.length > 0 ? (
              <>
                <span data-part="slots-label">{slotsLabel}</span>
                <ul data-part="slots">
                  {slots.map((slot) => (
                    <li key={slot}>
                      <button type="button" data-part="slot" aria-pressed={time === slot} onClick={() => pick(slot)}>
                        {slot}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {notes.length > 0 ? (
              <ul data-part="notes">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {done ? (
            <div data-part="done" role="status">
              <h3>{doneTitle}</h3>
              <p>{doneText}</p>
            </div>
          ) : (
            <form data-part="form" action={action || undefined} method={action ? "post" : undefined} onSubmit={submit}>
              <div data-part="pair">
                <label data-part="field">
                  <span>Дата</span>
                  <input name="date" type="date" required value={date} min={today()} onChange={(event) => setDate(event.target.value)} />
                </label>
                <label data-part="field">
                  <span>Время</span>
                  <input name="time" type="time" required value={time} step={900} onChange={(event) => setTime(event.target.value)} />
                </label>
              </div>
              <div data-part="pair">
                <div data-part="field">
                  <span>Гостей</span>
                  <div data-part="stepper">
                    <button type="button" aria-label="Меньше" onClick={() => setGuests((value) => Math.max(minGuests, value - 1))}>
                      −
                    </button>
                    <output aria-live="polite">{guests}</output>
                    <button type="button" aria-label="Больше" onClick={() => setGuests((value) => Math.min(maxGuests, value + 1))}>
                      +
                    </button>
                    <input type="hidden" name="guests" value={guests} />
                  </div>
                </div>
                <label data-part="field">
                  <span>Имя</span>
                  <input name="name" required placeholder="Как к вам обращаться" autoComplete="name" />
                </label>
              </div>
              <label data-part="field">
                <span>Телефон</span>
                <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="+7 999 123-45-67" />
              </label>
              <label data-part="field">
                <span>Пожелания</span>
                <textarea name="note" placeholder="У окна, день рождения, без лука…" />
              </label>
              <label data-part="consent">
                <input type="checkbox" name="consent" required />
                <span>{consentLabel}</span>
              </label>
              <button type="submit" data-part="submit">
                {submitLabel}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
