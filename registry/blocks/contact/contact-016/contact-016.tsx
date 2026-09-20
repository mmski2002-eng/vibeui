"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Contact016Props = {
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
  /** Подписи полей формы брони. */
  dateLabel?: string
  timeLabel?: string
  guestsLabel?: string
  lessLabel?: string
  moreLabel?: string
  nameLabel?: string
  namePlaceholder?: string
  phoneLabel?: string
  phonePlaceholder?: string
  noteLabel?: string
  notePlaceholder?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
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
:where([data-vibeui-block="contact-016"]){
--vibeui-contact-016-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-016-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-016-muted:light-dark(color-mix(in oklab,var(--vibeui-contact-016-fg) 60%,var(--vibeui-contact-016-bg)),color-mix(in oklab,var(--vibeui-contact-016-fg) 58%,var(--vibeui-contact-016-bg)));
--vibeui-contact-016-card:light-dark(#fffaf3,#141110);
--vibeui-contact-016-line:color-mix(in oklab,var(--vibeui-contact-016-fg) 16%,var(--vibeui-contact-016-bg));
--vibeui-contact-016-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-016-glow:0 0 24px color-mix(in oklab,var(--vibeui-contact-016-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-contact-016-accent) 35%,transparent);
--vibeui-contact-016-accent-ink:light-dark(var(--vibeui-contact-016-accent),color-mix(in oklab,var(--vibeui-contact-016-accent) 55%,var(--vibeui-contact-016-fg)));
--vibeui-contact-016-on-accent:oklch(from var(--vibeui-contact-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-016-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-contact-016-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-016"]{color-scheme:dark}
:where([data-vibeui-block="contact-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-016"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-016-bg);color:var(--vibeui-contact-016-fg);font-family:var(--vibeui-contact-016-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="contact-016"] *{box-sizing:border-box}
[data-vibeui-block="contact-016"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="contact-016"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-contact-016-accent-ink);font-weight:600}
[data-vibeui-block="contact-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-016-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="contact-016"] [data-part="lede"]{margin:.75rem 0 0;max-width:30rem;color:var(--vibeui-contact-016-muted)}
[data-vibeui-block="contact-016"] [data-part="slots-label"]{display:block;margin:2rem 0 .6rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-contact-016-muted)}
[data-vibeui-block="contact-016"] [data-part="slots"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="contact-016"] [data-part="slot"]{appearance:none;border:1px solid var(--vibeui-contact-016-line);border-radius:999px;background:transparent;padding:.55rem 1rem;font:inherit;font-size:.9rem;font-weight:600;color:inherit;cursor:pointer;font-variant-numeric:tabular-nums;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="contact-016"] [data-part="slot"]:hover{border-color:var(--vibeui-contact-016-accent-ink)}
[data-vibeui-block="contact-016"] [data-part="slot"][aria-pressed="true"]{background:var(--vibeui-contact-016-accent);color:var(--vibeui-contact-016-on-accent);border-color:var(--vibeui-contact-016-accent-ink);box-shadow:var(--vibeui-contact-016-glow)}
[data-vibeui-block="contact-016"] [data-part="notes"]{margin:2rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem;color:var(--vibeui-contact-016-muted);font-size:.9rem}
[data-vibeui-block="contact-016"] [data-part="notes"] li{display:flex;gap:.65rem;align-items:flex-start}
[data-vibeui-block="contact-016"] [data-part="notes"] li::before{content:"";flex:none;width:.4rem;height:.4rem;margin-top:.55rem;border-radius:50%;background:var(--vibeui-contact-016-accent)}
[data-vibeui-block="contact-016"] [data-part="form"]{display:grid;gap:1rem;padding:1.5rem;border-radius:1rem;background:var(--vibeui-contact-016-card);border:1px solid var(--vibeui-contact-016-line)}
[data-vibeui-block="contact-016"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
[data-vibeui-block="contact-016"] [data-part="field"]{display:grid;gap:.35rem}
[data-vibeui-block="contact-016"] [data-part="field"] > span{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-contact-016-muted);font-weight:600}
[data-vibeui-block="contact-016"] input:not([type="checkbox"]),[data-vibeui-block="contact-016"] textarea{width:100%;padding:0 .9rem;border:1px solid var(--vibeui-contact-016-line);border-radius:.6rem;background:transparent;font:inherit;color:inherit;color-scheme:inherit}
[data-vibeui-block="contact-016"] input:not([type="checkbox"]){height:3rem}
[data-vibeui-block="contact-016"] textarea{padding:.75rem .9rem;min-height:5rem;resize:vertical}
[data-vibeui-block="contact-016"] input:focus-visible,[data-vibeui-block="contact-016"] textarea:focus-visible,[data-vibeui-block="contact-016"] button:focus-visible{outline:2px solid var(--vibeui-contact-016-accent);outline-offset:1px}
[data-vibeui-block="contact-016"] input::placeholder,[data-vibeui-block="contact-016"] textarea::placeholder{color:var(--vibeui-contact-016-muted);opacity:.7}
[data-vibeui-block="contact-016"] [data-part="stepper"]{display:grid;grid-template-columns:3rem 1fr 3rem;height:3rem;border:1px solid var(--vibeui-contact-016-line);border-radius:.6rem;overflow:hidden}
[data-vibeui-block="contact-016"] [data-part="stepper"] button{border:0;background:transparent;color:inherit;font:inherit;font-size:1.2rem;cursor:pointer;transition:background .2s}
[data-vibeui-block="contact-016"] [data-part="stepper"] button:hover{background:var(--vibeui-contact-016-line)}
[data-vibeui-block="contact-016"] [data-part="stepper"] output{display:grid;place-items:center;font-family:var(--vibeui-contact-016-display);font-size:1.25rem}
[data-vibeui-block="contact-016"] [data-part="consent"]{display:flex;gap:.6rem;align-items:flex-start;font-size:.8rem;color:var(--vibeui-contact-016-muted);cursor:pointer}
[data-vibeui-block="contact-016"] [data-part="consent"] input{margin:.2rem 0 0;accent-color:var(--vibeui-contact-016-accent-ink)}
[data-vibeui-block="contact-016"] [data-part="submit"]{height:3.25rem;border:0;border-radius:999px;background:var(--vibeui-contact-016-accent);color:var(--vibeui-contact-016-on-accent);font:inherit;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="contact-016"] [data-part="submit"]{box-shadow:var(--vibeui-contact-016-glow)}
[data-vibeui-block="contact-016"] [data-part="submit"]:hover{transform:translateY(-1px);filter:brightness(1.08)}
[data-vibeui-block="contact-016"] [data-part="done"]{display:grid;gap:.5rem;padding:2.5rem 1.5rem;border-radius:1rem;background:var(--vibeui-contact-016-card);border:1px solid var(--vibeui-contact-016-line);text-align:center}
[data-vibeui-block="contact-016"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-contact-016-display);font-size:2rem;font-weight:400;line-height:1.05}
[data-vibeui-block="contact-016"] [data-part="done"] p{margin:0;color:var(--vibeui-contact-016-muted)}
@container (min-width: 56rem){
[data-vibeui-block="contact-016"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="contact-016"] [data-part="form"],[data-vibeui-block="contact-016"] [data-part="done"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-016"] *{transition:none!important}}`

function today(): string {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function subscribeNever() {
  return () => {}
}

function noMinDate() {
  return ""
}

/** Бронь стола: свободные окна чипами, форма с датой, временем, гостями и телефоном. */
export function Contact016({
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
  dateLabel = "Дата",
  timeLabel = "Время",
  guestsLabel = "Гостей",
  lessLabel = "Меньше",
  moreLabel = "Больше",
  nameLabel = "Имя",
  namePlaceholder = "Как к вам обращаться",
  phoneLabel = "Телефон",
  phonePlaceholder = "+7 999 123-45-67",
  noteLabel = "Пожелания",
  notePlaceholder = "У окна, день рождения, без лука…",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact016Props) {
  const [done, setDone] = useState(false)
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  // Нижняя граница даты известна только на клиенте: сервер и браузер могут
  // жить в разных сутках (UTC против местного времени), и SSR-значение
  // расходилось бы с клиентским при гидратации. На сервере границы нет.
  const minDate = useSyncExternalStore(subscribeNever, today, noMinDate)
  const palette = {
    ...(accent ? { "--vibeui-contact-016-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-016-fg": ink } : null),
    ...(background ? { "--vibeui-contact-016-bg": background } : null),
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
      <style href="vibeui-contact-016" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-016" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
                  <span>{dateLabel}</span>
                  <input name="date" type="date" required value={date} min={minDate || undefined} onChange={(event) => setDate(event.target.value)} />
                </label>
                <label data-part="field">
                  <span>{timeLabel}</span>
                  <input name="time" type="time" required value={time} step={900} onChange={(event) => setTime(event.target.value)} />
                </label>
              </div>
              <div data-part="pair">
                <div data-part="field">
                  <span>{guestsLabel}</span>
                  <div data-part="stepper">
                    <button type="button" aria-label={lessLabel} onClick={() => setGuests((value) => Math.max(minGuests, value - 1))}>
                      −
                    </button>
                    <output aria-live="polite">{guests}</output>
                    <button type="button" aria-label={moreLabel} onClick={() => setGuests((value) => Math.min(maxGuests, value + 1))}>
                      +
                    </button>
                    <input type="hidden" name="guests" value={guests} />
                  </div>
                </div>
                <label data-part="field">
                  <span>{nameLabel}</span>
                  <input name="name" required placeholder={namePlaceholder} autoComplete="name" />
                </label>
              </div>
              <label data-part="field">
                <span>{phoneLabel}</span>
                <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder={phonePlaceholder} />
              </label>
              <label data-part="field">
                <span>{noteLabel}</span>
                <textarea name="note" placeholder={notePlaceholder} />
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
