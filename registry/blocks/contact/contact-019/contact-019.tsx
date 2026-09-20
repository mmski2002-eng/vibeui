"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Contact019Option = { value: string; label: string }

export type Contact019Labels = {
  whoText: string
  nameLabel: string
  namePlaceholder: string
  comingYes: string
  comingNo: string
  datesText: string
  arriveLabel: string
  arrivePlaceholder: string
  departLabel: string
  departPlaceholder: string
  flightLabel: string
  flightPlaceholder: string
  hotelText: string
  hotelHelp: string
  hotelOwn: string
  companionsLabel: string
  companionsPlaceholder: string
  menuText: string
  allergies: string
  allergiesPlaceholder: string
  songText: string
  songLabel: string
  songPlaceholder: string
  wishLabel: string
  wishPlaceholder: string
  back: string
  next: string
  summaryPassenger: string
  summaryStatus: string
  flying: string
  notFlying: string
  summaryDates: string
  summaryFlight: string
  summaryHotel: string
  hotelBooking: string
  hotelOwnShort: string
  summaryMenu: string
  summarySong: string
}

export type Contact019Props = {
  eyebrow?: string
  title?: string
  /** Приветствие для гостя из ?guest=: «{name}, добро пожаловать на борт». */
  greeting?: string
  lede?: string
  deadline?: string
  guest?: string
  stepLabels?: readonly [string, string, string, string, string]
  menu?: readonly Contact019Option[]
  /** Коды аэропортов на талоне-сводке. */
  from?: string
  to?: string
  summaryTitle?: string
  submitLabel?: string
  thanksTitle?: string
  thanksText?: string
  stampLabel?: string
  action?: string
  /** Подписи шагов, полей и сводки; можно переопределить частично. */
  labels?: Partial<Contact019Labels>
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

type Answers = {
  name: string
  coming: "yes" | "no" | ""
  arrive: string
  depart: string
  flight: string
  hotel: "help" | "own" | ""
  companions: string
  menu: string
  allergies: string
  song: string
  wish: string
}

const EMPTY: Answers = { name: "", coming: "", arrive: "", depart: "", flight: "", hotel: "", companions: "", menu: "", allergies: "", song: "", wish: "" }

// Check-in вместо RSVP: пять шагов дорожной анкеты — летишь ли, даты и
// рейс, отель (помочь забронировать?), меню и аллергии, песня для пляжа.
// Справа сводка в виде посадочного талона, который заполняется по ходу;
// финал — штамп «CHECKED IN» с поворотом. Имя гостя — из ?guest=.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-019"]){
--vibeui-contact-019-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-019-paper:light-dark(#fffaf0,#1a1a1a);
--vibeui-contact-019-field:light-dark(#ffffff,#151515);
--vibeui-contact-019-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-019-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-contact-019-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-contact-019-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-019-sea:#2aa7a0;
--vibeui-contact-019-sun:#f2c14e;
--vibeui-contact-019-on-accent:oklch(from var(--vibeui-contact-019-accent) clamp(0,(0.72 - l) * 100,1) 0 0);
--vibeui-contact-019-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-contact-019-script:"Lobster","Brush Script MT",cursive;
--vibeui-contact-019-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-019"]{color-scheme:dark}
:where([data-vibeui-block="contact-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-019"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-019-bg);color:var(--vibeui-contact-019-fg);font-family:var(--vibeui-contact-019-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-019"] *{box-sizing:border-box}
[data-vibeui-block="contact-019"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="contact-019"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-contact-019-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-contact-019-accent)}
[data-vibeui-block="contact-019"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-019-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="contact-019"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-contact-019-muted)}
[data-vibeui-block="contact-019"] [data-part="lede"] b{color:var(--vibeui-contact-019-accent);font-weight:600}
[data-vibeui-block="contact-019"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="contact-019"] [data-part="form"]{padding:1.5rem;border-radius:1rem;background:var(--vibeui-contact-019-paper);box-shadow:0 30px 60px -40px rgb(18 58 75 / .5)}
[data-vibeui-block="contact-019"] [data-part="progress"]{display:flex;gap:.4rem;margin:0 0 1.5rem;padding:0;list-style:none}
[data-vibeui-block="contact-019"] [data-part="progress"] li{flex:1;display:grid;gap:.3rem;font-family:var(--vibeui-contact-019-display);font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-contact-019-muted)}
[data-vibeui-block="contact-019"] [data-part="progress"] li::before{content:"";display:block;height:4px;border-radius:2px;background:var(--vibeui-contact-019-line);transition:background .35s}
[data-vibeui-block="contact-019"] [data-part="progress"] li[data-done="true"]::before{background:var(--vibeui-contact-019-sea)}
[data-vibeui-block="contact-019"] [data-part="progress"] li[data-done="true"]{color:var(--vibeui-contact-019-fg)}
[data-vibeui-block="contact-019"] [data-part="step"]{animation:vibeui-contact-019-in .4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-contact-019-in{from{opacity:0;transform:translateY(.5rem)}}
[data-vibeui-block="contact-019"] [data-part="step"] h3{margin:0 0 .25rem;font-family:var(--vibeui-contact-019-display);font-size:1.7rem;font-weight:600;line-height:1.1;text-transform:uppercase}
[data-vibeui-block="contact-019"] [data-part="step"] > p{margin:0 0 1.2rem;font-size:.92rem;color:var(--vibeui-contact-019-muted)}
[data-vibeui-block="contact-019"] [data-part="row"]{display:grid;gap:0 .8rem}
[data-vibeui-block="contact-019"] label{display:block;margin-bottom:1rem}
[data-vibeui-block="contact-019"] label > span{display:block;margin-bottom:.35rem;font-family:var(--vibeui-contact-019-display);font-size:.7rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-019-muted)}
[data-vibeui-block="contact-019"] input,[data-vibeui-block="contact-019"] textarea{width:100%;padding:.75rem .9rem;border:1px solid var(--vibeui-contact-019-line);border-radius:.6rem;background:var(--vibeui-contact-019-field);color:inherit;font:inherit;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="contact-019"] input:focus,[data-vibeui-block="contact-019"] textarea:focus{outline:none;border-color:var(--vibeui-contact-019-sea);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-contact-019-sea) 20%,transparent)}
[data-vibeui-block="contact-019"] textarea{min-height:5.5rem;resize:vertical}
[data-vibeui-block="contact-019"] [data-part="choices"]{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem}
[data-vibeui-block="contact-019"] [data-part="choice"]{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1rem;border:1px solid var(--vibeui-contact-019-line);border-radius:.5rem;background:var(--vibeui-contact-019-field);color:inherit;font-family:var(--vibeui-contact-019-display);font-size:.9rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:border-color .25s,background .25s,color .25s,transform .2s}
[data-vibeui-block="contact-019"] [data-part="choice"]:hover{border-color:var(--vibeui-contact-019-sea);transform:translateY(-1px)}
[data-vibeui-block="contact-019"] [data-part="choice"][aria-pressed="true"]{border-color:var(--vibeui-contact-019-fg);background:var(--vibeui-contact-019-fg);color:var(--vibeui-contact-019-paper)}
[data-vibeui-block="contact-019"] [data-part="choice"]:focus-visible,[data-vibeui-block="contact-019"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-contact-019-accent);outline-offset:3px}
[data-vibeui-block="contact-019"] [data-part="nav"]{display:flex;justify-content:space-between;gap:.75rem;margin-top:1.5rem;padding-top:1.2rem;border-top:2px dashed var(--vibeui-contact-019-line)}
[data-vibeui-block="contact-019"] [data-part="nav"] button{display:inline-flex;align-items:center;gap:.4rem;height:2.9rem;padding:0 1.3rem;border-radius:.6rem;border:1px solid var(--vibeui-contact-019-line);background:transparent;color:inherit;font-family:var(--vibeui-contact-019-display);font-size:.9rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:transform .2s,background .25s,border-color .25s}
[data-vibeui-block="contact-019"] [data-part="nav"] button:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="contact-019"] [data-part="nav"] button[data-primary]{margin-left:auto;background:var(--vibeui-contact-019-accent);border-color:var(--vibeui-contact-019-accent);color:var(--vibeui-contact-019-on-accent);box-shadow:0 12px 24px -14px var(--vibeui-contact-019-accent)}
[data-vibeui-block="contact-019"] [data-part="nav"] button:not(:disabled):hover{transform:translateY(-1px)}
[data-vibeui-block="contact-019"] [data-part="pass"]{position:relative;align-self:start;overflow:hidden;border-radius:.9rem;background:var(--vibeui-contact-019-paper);box-shadow:0 30px 60px -40px rgb(18 58 75 / .5)}
[data-vibeui-block="contact-019"] [data-part="pass"] header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1.2rem;background:var(--vibeui-contact-019-fg);color:var(--vibeui-contact-019-paper)}
[data-vibeui-block="contact-019"] [data-part="pass"] header b{font-family:var(--vibeui-contact-019-display);font-size:.8rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-contact-019-sun)}
[data-vibeui-block="contact-019"] [data-part="pass"] header span{font-family:var(--vibeui-contact-019-display);font-size:1.1rem;font-weight:700;letter-spacing:.1em}
[data-vibeui-block="contact-019"] [data-part="pass"] dl{display:grid;grid-template-columns:1fr 1fr;gap:.9rem 1rem;margin:0;padding:1.1rem 1.2rem}
[data-vibeui-block="contact-019"] [data-part="pass"] dt{font-family:var(--vibeui-contact-019-display);font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-019-muted)}
[data-vibeui-block="contact-019"] [data-part="pass"] dd{margin:.1rem 0 0;font-family:var(--vibeui-contact-019-display);font-size:1.05rem;font-weight:600;letter-spacing:.02em;overflow-wrap:anywhere}
[data-vibeui-block="contact-019"] [data-part="pass"] dd:empty::before{content:"—";color:var(--vibeui-contact-019-line)}
[data-vibeui-block="contact-019"] [data-part="pass"] dl > div[data-wide]{grid-column:1 / -1}
[data-vibeui-block="contact-019"] [data-part="pass"] [data-part="barcode"]{height:1.6rem;margin:0 1.2rem 1.1rem;background:repeating-linear-gradient(90deg,var(--vibeui-contact-019-fg) 0 2px,transparent 2px 4px,var(--vibeui-contact-019-fg) 4px 5px,transparent 5px 8px,var(--vibeui-contact-019-fg) 8px 11px,transparent 11px 13px);opacity:.75}
[data-vibeui-block="contact-019"] [data-part="stamp"]{position:absolute;right:1rem;bottom:2.4rem;padding:.35rem .9rem;border:3px solid var(--vibeui-contact-019-sea);border-radius:.4rem;color:var(--vibeui-contact-019-sea);font-family:var(--vibeui-contact-019-display);font-size:1.1rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;transform:rotate(-12deg);opacity:0;pointer-events:none;mix-blend-mode:multiply}
[data-vibeui-block="contact-019"] [data-part="pass"][data-sent="true"] [data-part="stamp"]{animation:vibeui-contact-019-stamp .5s cubic-bezier(.2,.9,.3,1.4) both}
@keyframes vibeui-contact-019-stamp{from{opacity:0;transform:rotate(-12deg) scale(2)}to{opacity:.9;transform:rotate(-12deg) scale(1)}}
[data-vibeui-block="contact-019"] [data-part="thanks"]{display:grid;justify-items:center;gap:.6rem;padding:2.5rem 1rem;text-align:center;animation:vibeui-contact-019-in .5s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="contact-019"] [data-part="thanks"] svg{width:3.4rem;height:3.4rem;fill:var(--vibeui-contact-019-accent)}
[data-vibeui-block="contact-019"] [data-part="thanks"] h3{margin:.4rem 0 0;font-family:var(--vibeui-contact-019-display);font-size:2rem;font-weight:700;text-transform:uppercase}
[data-vibeui-block="contact-019"] [data-part="thanks"] p{max-width:28rem;margin:0;color:var(--vibeui-contact-019-muted)}
@container (min-width:40rem){
[data-vibeui-block="contact-019"] [data-part="row"]{grid-template-columns:1fr 1fr}
}
@container (min-width:56rem){
[data-vibeui-block="contact-019"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="contact-019"] [data-part="grid"]{grid-template-columns:minmax(0,1.4fr) minmax(18rem,.7fr);gap:2.5rem}
[data-vibeui-block="contact-019"] [data-part="form"]{padding:2rem 2.25rem}
[data-vibeui-block="contact-019"] [data-part="pass"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-019"] *{animation:none!important;transition:none!important}[data-vibeui-block="contact-019"] [data-part="pass"][data-sent="true"] [data-part="stamp"]{opacity:.9}}`

function subscribe() {
  return () => {}
}

function readGuest(): string {
  try {
    return new URLSearchParams(window.location.search).get("guest") ?? ""
  } catch {
    return ""
  }
}

const DEFAULT_LABELS: Contact019Labels = {
  whoText: "Как вас записать в список пассажиров и получится ли прилететь.",
  nameLabel: "Имя и фамилия — как в паспорте",
  namePlaceholder: "Ольга Смирнова",
  comingYes: "Лечу!",
  comingNo: "Не смогу",
  datesText: "Когда вас встречать в Гаване и когда провожать.",
  arriveLabel: "Прилёт",
  arrivePlaceholder: "12 февраля",
  departLabel: "Вылет",
  departPlaceholder: "15 февраля",
  flightLabel: "Номер рейса, если уже есть",
  flightPlaceholder: "SU 1402",
  hotelText: "Мы держим номера в Гаване и на Кайо-Ларго по нашей цене — или живите где хотите.",
  hotelHelp: "Забронируйте за меня",
  hotelOwn: "Сам(а) найду жильё",
  companionsLabel: "С кем летите",
  companionsPlaceholder: "С парой, с ребёнком 6 лет…",
  menuText: "Ужин на пляже готовят заранее — выберите основное.",
  allergies: "Аллергии и ограничения",
  allergiesPlaceholder: "Морепродукты, орехи…",
  songText: "Песня, под которую вы выйдете танцевать на песке, — отдадим группе.",
  songLabel: "Исполнитель — название",
  songPlaceholder: "Buena Vista Social Club — Chan Chan",
  wishLabel: "Пара слов для нас",
  wishPlaceholder: "Необязательно, но приятно",
  back: "← Назад",
  next: "Дальше →",
  summaryPassenger: "Пассажир",
  summaryStatus: "Статус",
  flying: "летит",
  notFlying: "не летит",
  summaryDates: "Даты",
  summaryFlight: "Рейс",
  summaryHotel: "Отель",
  hotelBooking: "бронируем",
  hotelOwnShort: "своё",
  summaryMenu: "Меню",
  summarySong: "Песня",
}

/** Check-in вместо RSVP для свадьбы-путешествия: пять дорожных шагов, сводка-посадочный талон и штамп «Checked in». */
export function Contact019({
  eyebrow = "Check-in",
  title = "Зарегистрируйтесь на рейс",
  greeting = "{name}, добро пожаловать на борт",
  lede = "Пять вопросов — и мы знаем, когда вас встречать, где селить и что вам готовить. Ответьте, пожалуйста, {deadline}.",
  deadline = "до 1 декабря",
  guest,
  stepLabels = ["Летите?", "Даты", "Отель", "Меню", "Песня"],
  menu = [
    { value: "fish", label: "Рыба и лобстер" },
    { value: "chicken", label: "Курица" },
    { value: "veg", label: "Вегетарианское" },
  ],
  from = "SVO",
  to = "HAV",
  summaryTitle = "Посадочный талон",
  submitLabel = "Check-in",
  thanksTitle = "Вы на борту",
  thanksText = "Ответ записан. Мариэла напишет за две недели до вылета с деталями трансфера.",
  stampLabel = "Checked in",
  action,
  labels,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact019Props) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const fromUrl = useSyncExternalStore(subscribe, readGuest, () => "")
  const guestName = guest ?? fromUrl
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [sent, setSent] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-contact-019-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-019-fg": ink } : null),
    ...(background ? { "--vibeui-contact-019-bg": background } : null),
    ...style,
  } as CSSProperties
  const name = answers.name || guestName
  const last = stepLabels.length - 1

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  const canNext = step === 0 ? name.trim().length > 0 && answers.coming !== "" : true

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!action) event.preventDefault()
    setSent(true)
  }

  const choice = (pressed: boolean, label: string, onClick: () => void) => (
    <button key={label} type="button" data-part="choice" aria-pressed={pressed} onClick={onClick}>
      {label}
    </button>
  )

  const menuLabel = menu.find((item) => item.value === answers.menu)?.label ?? ""
  const dates = [answers.arrive, answers.depart].filter(Boolean).join(" → ")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-019" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{guestName ? greeting.replace("{name}", guestName) : title}</h2>
          <p data-part="lede">
            {lede.split("{deadline}")[0]}
            <b>{deadline}</b>
            {lede.split("{deadline}")[1] ?? ""}
          </p>
          <div data-part="grid">
            <form data-part="form" method="post" action={action} onSubmit={submit}>
              <input type="hidden" name="guest" value={name} />
              <input type="hidden" name="answers" value={JSON.stringify(answers)} />
              {sent ? (
                <div data-part="thanks" role="status">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                  </svg>
                  <h3>{thanksTitle}</h3>
                  <p>{thanksText}</p>
                </div>
              ) : (
                <>
                  <ol data-part="progress" aria-label={`${step + 1} / ${stepLabels.length}`}>
                    {stepLabels.map((label, index) => (
                      <li key={label} data-done={index <= step ? "true" : undefined}>
                        {label}
                      </li>
                    ))}
                  </ol>
                  {step === 0 ? (
                    <div data-part="step" key="who">
                      <h3>{stepLabels[0]}</h3>
                      <p>{t.whoText}</p>
                      <label>
                        <span>{t.nameLabel}</span>
                        <input type="text" name="name" value={name} onChange={(event) => set("name", event.target.value)} autoComplete="name" placeholder={t.namePlaceholder} />
                      </label>
                      <div data-part="choices">
                        {choice(answers.coming === "yes", t.comingYes, () => set("coming", "yes"))}
                        {choice(answers.coming === "no", t.comingNo, () => set("coming", "no"))}
                      </div>
                    </div>
                  ) : null}
                  {step === 1 ? (
                    <div data-part="step" key="dates">
                      <h3>{stepLabels[1]}</h3>
                      <p>{t.datesText}</p>
                      <div data-part="row">
                        <label>
                          <span>{t.arriveLabel}</span>
                          <input type="text" value={answers.arrive} onChange={(event) => set("arrive", event.target.value)} placeholder={t.arrivePlaceholder} />
                        </label>
                        <label>
                          <span>{t.departLabel}</span>
                          <input type="text" value={answers.depart} onChange={(event) => set("depart", event.target.value)} placeholder={t.departPlaceholder} />
                        </label>
                      </div>
                      <label>
                        <span>{t.flightLabel}</span>
                        <input type="text" value={answers.flight} onChange={(event) => set("flight", event.target.value)} placeholder={t.flightPlaceholder} />
                      </label>
                    </div>
                  ) : null}
                  {step === 2 ? (
                    <div data-part="step" key="hotel">
                      <h3>{stepLabels[2]}</h3>
                      <p>{t.hotelText}</p>
                      <div data-part="choices">
                        {choice(answers.hotel === "help", t.hotelHelp, () => set("hotel", "help"))}
                        {choice(answers.hotel === "own", t.hotelOwn, () => set("hotel", "own"))}
                      </div>
                      <label>
                        <span>{t.companionsLabel}</span>
                        <input type="text" value={answers.companions} onChange={(event) => set("companions", event.target.value)} placeholder={t.companionsPlaceholder} />
                      </label>
                    </div>
                  ) : null}
                  {step === 3 ? (
                    <div data-part="step" key="menu">
                      <h3>{stepLabels[3]}</h3>
                      <p>{t.menuText}</p>
                      <div data-part="choices" role="group" aria-label={stepLabels[3]}>
                        {menu.map((item) => choice(answers.menu === item.value, item.label, () => set("menu", item.value)))}
                      </div>
                      <label>
                        <span>{t.allergies}</span>
                        <input type="text" value={answers.allergies} onChange={(event) => set("allergies", event.target.value)} placeholder={t.allergiesPlaceholder} />
                      </label>
                    </div>
                  ) : null}
                  {step === 4 ? (
                    <div data-part="step" key="song">
                      <h3>{stepLabels[4]}</h3>
                      <p>{t.songText}</p>
                      <label>
                        <span>{t.songLabel}</span>
                        <input type="text" value={answers.song} onChange={(event) => set("song", event.target.value)} placeholder={t.songPlaceholder} />
                      </label>
                      <label>
                        <span>{t.wishLabel}</span>
                        <textarea value={answers.wish} onChange={(event) => set("wish", event.target.value)} placeholder={t.wishPlaceholder} />
                      </label>
                    </div>
                  ) : null}
                  <div data-part="nav">
                    <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                      {t.back}
                    </button>
                    {step < last ? (
                      <button type="button" data-primary="" disabled={!canNext} onClick={() => setStep((value) => Math.min(last, value + 1))}>
                        {t.next}
                      </button>
                    ) : (
                      <button type="submit" data-primary="">
                        {submitLabel}
                      </button>
                    )}
                  </div>
                </>
              )}
            </form>
            <aside data-part="pass" data-sent={sent ? "true" : undefined} aria-live="polite">
              <header>
                <b>{summaryTitle}</b>
                <span>
                  {from} → {to}
                </span>
              </header>
              <dl>
                <div>
                  <dt>{t.summaryPassenger}</dt>
                  <dd>{name}</dd>
                </div>
                <div>
                  <dt>{t.summaryStatus}</dt>
                  <dd>{answers.coming === "yes" ? t.flying : answers.coming === "no" ? t.notFlying : ""}</dd>
                </div>
                <div>
                  <dt>{t.summaryDates}</dt>
                  <dd>{dates}</dd>
                </div>
                <div>
                  <dt>{t.summaryFlight}</dt>
                  <dd>{answers.flight}</dd>
                </div>
                <div>
                  <dt>{t.summaryHotel}</dt>
                  <dd>{answers.hotel === "help" ? t.hotelBooking : answers.hotel === "own" ? t.hotelOwnShort : ""}</dd>
                </div>
                <div>
                  <dt>{t.summaryMenu}</dt>
                  <dd>{menuLabel}</dd>
                </div>
                <div data-wide="">
                  <dt>{t.summarySong}</dt>
                  <dd>{answers.song}</dd>
                </div>
              </dl>
              <div data-part="barcode" aria-hidden="true" />
              <span data-part="stamp" aria-hidden="true">
                {stampLabel}
              </span>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
