"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Input034 } from "@/registry/components/input/input-034/input-034"

import { Button001 } from "@/registry/components/button/button-001/button-001"

export type Contact017Artist = {
  key: string
  name: string
  styles: string
  color?: string
}

export type Contact017Slot = {
  /** «21 сен». */
  date: string
  /** Свободные часы. */
  times: readonly string[]
}

export type Contact017Props = {
  eyebrow?: string
  title?: string
  lede?: string
  artists?: readonly Contact017Artist[]
  zones?: readonly string[]
  slots?: readonly Contact017Slot[]
  /** Куда отправлять форму. Пусто — «готово» на месте. */
  action?: string
  submitLabel?: string
  doneTitle?: string
  doneText?: string
  consent?: string
  /** Подписи степпера, полей, кнопок и сводки. */
  steps?: readonly [string, string, string]
  stepperLabel?: string
  artistLabel?: string
  zoneLabel?: string
  dateLabel?: string
  slotsUnit?: string
  timeLabel?: string
  namePlaceholder?: string
  nameLabel?: string
  phonePlaceholder?: string
  ideaPlaceholder?: string
  ideaLabel?: string
  fileLabel?: string
  backLabel?: string
  nextLabel?: string
  summaryTitle?: string
  whenLabel?: string
  consultLabel?: string
  freeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Запись: три шага степпером с неоновой линией прогресса — мастер и зона,
// дата и время (свободные слоты подсвечены лаймом), идея и контакты с
// референсом. Шаги переключаются с въездом, выбранное собирается в сводку
// справа. С action уходит POST со всеми полями, без него — «готово».
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-017"]){
--vibeui-contact-017-bg:#07060b;
--vibeui-contact-017-fg:#f3eefc;
--vibeui-contact-017-muted:#a39bb5;
--vibeui-contact-017-line:rgb(255 255 255 / .12);
--vibeui-contact-017-card:#110e1a;
--vibeui-contact-017-accent:#ff2bd6;
--vibeui-contact-017-cyan:#22f3ff;
--vibeui-contact-017-ok:#c8ff3a;
--vibeui-contact-017-on-accent:#15121c;
--vibeui-contact-017-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-017-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-017-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-017"]{color-scheme:dark}
:where([data-vibeui-block="contact-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-017"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-017-bg);color:var(--vibeui-contact-017-fg);font-family:var(--vibeui-contact-017-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-017"] *{box-sizing:border-box}
[data-vibeui-block="contact-017"] [data-part="file"]{display:flex}
[data-vibeui-block="contact-017"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="contact-017"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-contact-017-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-contact-017-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-contact-017-cyan) 70%,transparent)}
[data-vibeui-block="contact-017"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-contact-017-cyan);box-shadow:0 0 8px var(--vibeui-contact-017-cyan)}
[data-vibeui-block="contact-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-017-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="contact-017"] [data-part="lede"]{margin:.75rem 0 2rem;max-width:36rem;color:var(--vibeui-contact-017-muted)}
[data-vibeui-block="contact-017"] [data-part="grid"]{display:grid;gap:1.5rem}
[data-vibeui-block="contact-017"] [data-part="form"]{display:grid;gap:1.5rem;padding:1.5rem;border-radius:1.1rem;border:1px solid var(--vibeui-contact-017-line);background:var(--vibeui-contact-017-card)}
[data-vibeui-block="contact-017"] [data-part="stepper"]{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="contact-017"] [data-part="stepper"] li{display:grid;gap:.5rem;font-family:var(--vibeui-contact-017-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-contact-017-muted)}
[data-vibeui-block="contact-017"] [data-part="stepper"] li::before{content:"";height:3px;border-radius:3px;background:var(--vibeui-contact-017-line);transition:background .4s,box-shadow .4s}
[data-vibeui-block="contact-017"] [data-part="stepper"] li[data-done="true"]::before,[data-vibeui-block="contact-017"] [data-part="stepper"] li[data-active="true"]::before{background:var(--vibeui-contact-017-accent);box-shadow:0 0 10px var(--vibeui-contact-017-accent)}
[data-vibeui-block="contact-017"] [data-part="stepper"] li[data-active="true"]{color:var(--vibeui-contact-017-fg)}
[data-vibeui-block="contact-017"] [data-part="step"]{display:grid;gap:1.25rem;animation:vibeui-contact-017-in .4s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-contact-017-in{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="contact-017"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.45rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="contact-017"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.5rem;min-height:2.5rem;padding:.35rem .9rem;border-radius:.5rem;border:1px solid var(--vibeui-contact-017-line);background:transparent;color:var(--vibeui-contact-017-muted);font:inherit;font-size:.9rem;font-weight:600;cursor:pointer;transition:color .25s,border-color .25s,box-shadow .3s,background .25s}
[data-vibeui-block="contact-017"] [data-part="chip"] small{font-weight:400;font-size:.75rem;opacity:.75}
[data-vibeui-block="contact-017"] [data-part="chip"]:hover{color:var(--vibeui-contact-017-fg)}
[data-vibeui-block="contact-017"] [data-part="chip"][aria-pressed="true"]{color:var(--vibeui-contact-017-fg);border-color:var(--vibeui-contact-017-neon,var(--vibeui-contact-017-accent));background:color-mix(in oklab,var(--vibeui-contact-017-neon,var(--vibeui-contact-017-accent)) 14%,transparent);box-shadow:0 0 14px color-mix(in oklab,var(--vibeui-contact-017-neon,var(--vibeui-contact-017-accent)) 45%,transparent)}
[data-vibeui-block="contact-017"] [data-part="chip"][data-free="true"]{border-color:color-mix(in oklab,var(--vibeui-contact-017-ok) 50%,transparent);color:var(--vibeui-contact-017-ok)}
[data-vibeui-block="contact-017"] [data-part="chip"][data-free="true"][aria-pressed="true"]{background:color-mix(in oklab,var(--vibeui-contact-017-ok) 16%,transparent);box-shadow:0 0 14px color-mix(in oklab,var(--vibeui-contact-017-ok) 45%,transparent)}
[data-vibeui-block="contact-017"] [data-part="fields"]{display:grid;gap:.75rem}
[data-vibeui-block="contact-017"] [data-part="file"]{display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;border-radius:.6rem;border:1px dashed var(--vibeui-contact-017-line);font-size:.9rem;color:var(--vibeui-contact-017-muted);cursor:pointer}
[data-vibeui-block="contact-017"] [data-part="file"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="contact-017"] [data-part="nav"]{display:flex;justify-content:space-between;gap:.75rem;padding-top:.5rem}
[data-vibeui-block="contact-017"] [data-part="consent"]{margin:0;font-size:.75rem;color:var(--vibeui-contact-017-muted)}
[data-vibeui-block="contact-017"] [data-part="summary"]{display:grid;gap:.75rem;align-content:start;padding:1.5rem;border-radius:1.1rem;border:1px solid color-mix(in oklab,var(--vibeui-contact-017-cyan) 40%,transparent);background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-contact-017-cyan) 8%,var(--vibeui-contact-017-card)),var(--vibeui-contact-017-card));box-shadow:0 0 30px color-mix(in oklab,var(--vibeui-contact-017-cyan) 12%,transparent)}
[data-vibeui-block="contact-017"] [data-part="summary"] h3{margin:0;font-family:var(--vibeui-contact-017-display);font-size:1rem;font-weight:600}
[data-vibeui-block="contact-017"] [data-part="row"]{display:flex;justify-content:space-between;gap:1rem;padding:.6rem 0;border-bottom:1px solid var(--vibeui-contact-017-line);font-size:.9rem}
[data-vibeui-block="contact-017"] [data-part="row"] span:first-child{color:var(--vibeui-contact-017-muted)}
[data-vibeui-block="contact-017"] [data-part="row"] b{font-family:var(--vibeui-contact-017-mono);font-weight:500;color:var(--vibeui-contact-017-cyan);text-align:right}
[data-vibeui-block="contact-017"] [data-part="done"]{display:grid;gap:.5rem;padding:2rem;border-radius:1.1rem;border:1px solid color-mix(in oklab,var(--vibeui-contact-017-ok) 60%,transparent);box-shadow:0 0 30px color-mix(in oklab,var(--vibeui-contact-017-ok) 25%,transparent)}
[data-vibeui-block="contact-017"] [data-part="done"] b{font-family:var(--vibeui-contact-017-display);font-size:1.3rem;color:var(--vibeui-contact-017-ok);text-shadow:0 0 12px color-mix(in oklab,var(--vibeui-contact-017-ok) 60%,transparent)}
[data-vibeui-block="contact-017"] [data-part="done"] span{color:var(--vibeui-contact-017-muted)}
@container (min-width: 60rem){
[data-vibeui-block="contact-017"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="contact-017"] [data-part="grid"]{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:2rem;align-items:start}
[data-vibeui-block="contact-017"] [data-part="form"]{padding:2rem}
[data-vibeui-block="contact-017"] [data-part="summary"]{position:sticky;top:6rem}
[data-vibeui-block="contact-017"] [data-part="fields"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-017"] *{animation:none!important;transition:none!important}}
/* возвращено после разборки списков селекторов */
[data-vibeui-block="contact-017"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-contact-017-cyan);outline-offset:2px}
[data-vibeui-block="contact-017"] [data-part="fields"]>[data-part="file"]{grid-column:1/-1}
`

const DEFAULT_ARTISTS: Contact017Artist[] = [
  { key: "asya", name: "Ася", styles: "олд-скул", color: "#ff2bd6" },
  { key: "mark", name: "Марк", styles: "реализм", color: "#8b5cff" },
  { key: "timur", name: "Тимур", styles: "графика", color: "#22f3ff" },
  { key: "lina", name: "Лина", styles: "минимализм", color: "#c8ff3a" },
  { key: "any", name: "Любой", styles: "подберёте вы", color: "#a39bb5" },
]

const DEFAULT_SLOTS: Contact017Slot[] = [
  { date: "20 сен", times: ["12:00", "16:00"] },
  { date: "21 сен", times: ["11:00", "14:00", "18:00"] },
  { date: "23 сен", times: ["13:00"] },
  { date: "24 сен", times: ["10:00", "15:00", "19:00"] },
  { date: "27 сен", times: ["12:00", "17:00"] },
]

/** Запись в тату-студию: степпер с неоновым прогрессом, слоты лаймом и сводка выбора. */
export function Contact017({
  eyebrow = "Запись",
  title = "Забронировать сеанс",
  lede = "Три шага, две минуты. Консультация и эскиз бесплатно, предоплата только при бронировании даты.",
  artists = DEFAULT_ARTISTS,
  zones = ["рука", "нога", "спина", "грудь", "рёбра", "шея / кисти"],
  slots = DEFAULT_SLOTS,
  action = "",
  submitLabel = "Отправить заявку",
  doneTitle = "Заявка у нас",
  doneText = "Напишем в мессенджер в течение часа, чтобы подтвердить окно и обсудить эскиз.",
  consent = "Нажимая кнопку, вы соглашаетесь с политикой обработки данных. Вам должно быть 18+.",
  steps = ["Мастер и зона", "Дата и время", "Идея и контакты"],
  stepperLabel = "Шаги записи",
  artistLabel = "Мастер",
  zoneLabel = "Зона",
  dateLabel = "Дата",
  slotsUnit = "окна",
  timeLabel = "Время",
  namePlaceholder = "Как вас зовут",
  nameLabel = "Имя",
  phonePlaceholder = "Телефон или Telegram",
  ideaPlaceholder = "Идея: что, размер, есть ли референсы",
  ideaLabel = "Идея",
  fileLabel = "Прикрепить референс — по желанию",
  backLabel = "Назад",
  nextLabel = "Дальше",
  summaryTitle = "Ваш выбор",
  whenLabel = "Когда",
  consultLabel = "Консультация",
  freeLabel = "бесплатно",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Contact017Props) {
  const [step, setStep] = useState(0)
  const [artist, setArtist] = useState("")
  const [zone, setZone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [done, setDone] = useState(false)
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-contact-017-accent": accent } : null),
    ...(background ? { "--vibeui-contact-017-bg": background } : null),
    ...style,
  } as CSSProperties
  const artistName = artists.find((item) => item.key === artist)?.name ?? "—"
  const canNext = step === 0 ? Boolean(artist && zone) : step === 1 ? Boolean(date && time) : true

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (action) return
    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            {done ? (
              <div data-part="done" role="status">
                <b>{doneTitle}</b>
                <span>{doneText}</span>
              </div>
            ) : (
              <form data-part="form" action={action || undefined} method={action ? "post" : undefined} onSubmit={submit}>
                <ol data-part="stepper" aria-label={stepperLabel}>
                  {steps.map((label, index) => (
                    <li key={label} data-active={index === step} data-done={index < step}>
                      {index + 1}. {label}
                    </li>
                  ))}
                </ol>
                <input type="hidden" name="artist" value={artist} />
                <input type="hidden" name="zone" value={zone} />
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="time" value={time} />
                {step === 0 ? (
                  <div key="s0" data-part="step">
                    <div>
                      <span data-part="group-label" id={`${id}-artist`}>
                        {artistLabel}
                      </span>
                      <ul data-part="chips" role="group" aria-labelledby={`${id}-artist`}>
                        {artists.map((item) => (
                          <li key={item.key}>
                            <button type="button" data-part="chip" aria-pressed={artist === item.key} style={{ ["--vibeui-contact-017-neon" as string]: item.color }} onClick={() => setArtist(item.key)}>
                              {item.name}
                              <small>{item.styles}</small>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span data-part="group-label" id={`${id}-zone`}>
                        {zoneLabel}
                      </span>
                      <ul data-part="chips" role="group" aria-labelledby={`${id}-zone`}>
                        {zones.map((item) => (
                          <li key={item}>
                            <button type="button" data-part="chip" aria-pressed={zone === item} onClick={() => setZone(item)}>
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {step === 1 ? (
                  <div key="s1" data-part="step">
                    <div>
                      <span data-part="group-label" id={`${id}-date`}>
                        {dateLabel}
                      </span>
                      <ul data-part="chips" role="group" aria-labelledby={`${id}-date`}>
                        {slots.map((slot) => (
                          <li key={slot.date}>
                            <button type="button" data-part="chip" data-free="true" aria-pressed={date === slot.date} onClick={() => { setDate(slot.date); setTime("") }}>
                              {slot.date}
                              <small>{slot.times.length} {slotsUnit}</small>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {date ? (
                      <div>
                        <span data-part="group-label" id={`${id}-time`}>
                          {timeLabel}
                        </span>
                        <ul data-part="chips" role="group" aria-labelledby={`${id}-time`}>
                          {(slots.find((slot) => slot.date === date)?.times ?? []).map((item) => (
                            <li key={item}>
                              <button type="button" data-part="chip" data-free="true" aria-pressed={time === item} onClick={() => setTime(item)}>
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {step === 2 ? (
                  <div key="s2" data-part="step">
                    <div data-part="fields">
                      <Input001 type="text" name="name" required label={nameLabel} autoComplete="name" accent={accent} />
                      <Input001 type="tel" name="phone" required label={phonePlaceholder} autoComplete="tel" accent={accent} />
                      <Input034 name="idea" label={ideaLabel} hint={ideaPlaceholder} rows={3} accent={accent} />
                      <label data-part="file">
                        <input type="file" name="reference" accept="image/*" />
                        {fileLabel}
                      </label>
                    </div>
                    {consent ? <p data-part="consent">{consent}</p> : null}
                  </div>
                ) : null}
                <div data-part="nav">
                  <Button001 type="button" tone="soft" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} accent={accent}>
                    {backLabel}
                  </Button001>
                  {step < 2 ? (
                    <Button001 type="button" tone="solid" disabled={!canNext} onClick={() => setStep((value) => value + 1)} accent={accent}>
                      {nextLabel}
                    </Button001>
                  ) : (
                    <Button001 type="submit" size="lg" accent={accent}>
                      {submitLabel}
                    </Button001>
                  )}
                </div>
              </form>
            )}
            <aside data-part="summary" aria-live="polite">
              <h3>{summaryTitle}</h3>
              <div data-part="row">
                <span>{artistLabel}</span>
                <b>{artistName}</b>
              </div>
              <div data-part="row">
                <span>{zoneLabel}</span>
                <b>{zone || "—"}</b>
              </div>
              <div data-part="row">
                <span>{whenLabel}</span>
                <b>{date ? `${date}${time ? `, ${time}` : ""}` : "—"}</b>
              </div>
              <div data-part="row">
                <span>{consultLabel}</span>
                <b>{freeLabel}</b>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
