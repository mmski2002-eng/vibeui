"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Contact020Option = { value: string; label: string }

export type Contact020Props = {
  eyebrow?: string
  title?: string
  /** Приветствие для гостя из ?guest=: «{name}, мы ждём ваш ответ». */
  greeting?: string
  lede?: string
  deadline?: string
  guest?: string
  stepLabels?: readonly [string, string, string, string, string]
  menu?: readonly Contact020Option[]
  /** Инициалы на сургуче. */
  seal?: string
  summaryTitle?: string
  submitLabel?: string
  thanksTitle?: string
  thanksText?: string
  stampLabel?: string
  action?: string
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
  companions: string
  stay: "house" | "back" | ""
  transfer: "bus" | "car" | ""
  transferTime: string
  menu: string
  allergies: string
  song: string
  wish: string
}

const EMPTY: Answers = { name: "", coming: "", companions: "", stay: "", transfer: "", transferTime: "", menu: "", allergies: "", song: "", wish: "" }

// Письмо-ответ вместо RSVP: пять шагов на светлой «бумаге» — кто и с кем,
// ночуете ли в доме, трансфер или машина, меню и аллергии, песня и слова.
// Справа конверт-сводка с сургучной печатью, заполняется по ходу; финал —
// штамп «ЖДЁМ» со снежинкой. Имя гостя — из ?guest=.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-020"]){
--vibeui-contact-020-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-020-paper:#f7f3ea;
--vibeui-contact-020-field:#ffffff;
--vibeui-contact-020-ink:#1c2740;
--vibeui-contact-020-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-020-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-contact-020-paper-muted:#6b7488;
--vibeui-contact-020-line:light-dark(color-mix(in oklab,var(--vibeui-contact-020-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-contact-020-fg) 24%,transparent));
--vibeui-contact-020-paper-line:#d9d2c4;
--vibeui-contact-020-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-020-wax:#7a2b35;
--vibeui-contact-020-silver:#9fb0c8;
--vibeui-contact-020-envelope:light-dark(#ffffff,#131c2e);
--vibeui-contact-020-display:"Cormorant Garamond",Georgia,serif;
--vibeui-contact-020-script:"Marck Script","Segoe Script",cursive;
--vibeui-contact-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-020"]{color-scheme:dark}
:where([data-vibeui-block="contact-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-020"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-020-bg);color:var(--vibeui-contact-020-fg);font-family:var(--vibeui-contact-020-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-020"] *{box-sizing:border-box}
[data-vibeui-block="contact-020"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="contact-020"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-contact-020-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-contact-020-silver)}
[data-vibeui-block="contact-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-020-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="contact-020"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-contact-020-muted)}
[data-vibeui-block="contact-020"] [data-part="lede"] b{color:var(--vibeui-contact-020-accent);font-weight:600}
[data-vibeui-block="contact-020"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="contact-020"] [data-part="form"]{position:relative;padding:1.5rem;border-radius:.4rem;background:var(--vibeui-contact-020-paper);color:var(--vibeui-contact-020-ink);color-scheme:light;box-shadow:0 40px 80px -40px rgb(0 0 0 / .8),0 0 0 1px rgb(255 255 255 / .06)}
[data-vibeui-block="contact-020"] [data-part="form"]::before{content:"";position:absolute;inset:.6rem;border:1px solid var(--vibeui-contact-020-paper-line);border-radius:.2rem;pointer-events:none}
[data-vibeui-block="contact-020"] [data-part="progress"]{position:relative;display:flex;gap:.4rem;margin:0 0 1.5rem;padding:0;list-style:none}
[data-vibeui-block="contact-020"] [data-part="progress"] li{flex:1;display:grid;gap:.35rem;font-family:var(--vibeui-contact-020-display);font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-contact-020-paper-muted)}
[data-vibeui-block="contact-020"] [data-part="progress"] li::before{content:"";display:block;height:2px;background:var(--vibeui-contact-020-paper-line);transition:background .35s}
[data-vibeui-block="contact-020"] [data-part="progress"] li[data-done="true"]::before{background:var(--vibeui-contact-020-wax)}
[data-vibeui-block="contact-020"] [data-part="progress"] li[data-done="true"]{color:var(--vibeui-contact-020-ink)}
[data-vibeui-block="contact-020"] [data-part="step"]{position:relative;animation:vibeui-contact-020-in .4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-contact-020-in{from{opacity:0;transform:translateY(.5rem)}}
[data-vibeui-block="contact-020"] [data-part="step"] h3{margin:0 0 .25rem;font-family:var(--vibeui-contact-020-display);font-size:1.9rem;font-weight:500;line-height:1.1}
[data-vibeui-block="contact-020"] [data-part="step"] > p{margin:0 0 1.2rem;font-size:.92rem;color:var(--vibeui-contact-020-paper-muted)}
[data-vibeui-block="contact-020"] [data-part="row"]{display:grid;gap:0 .8rem}
[data-vibeui-block="contact-020"] label{display:block;margin-bottom:1rem}
[data-vibeui-block="contact-020"] label > span{display:block;margin-bottom:.35rem;font-family:var(--vibeui-contact-020-display);font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-020-paper-muted)}
[data-vibeui-block="contact-020"] input,[data-vibeui-block="contact-020"] textarea{width:100%;padding:.75rem .9rem;border:0;border-bottom:1px solid var(--vibeui-contact-020-paper-line);border-radius:.3rem .3rem 0 0;background:var(--vibeui-contact-020-field);color:var(--vibeui-contact-020-ink);font-family:var(--vibeui-contact-020-script);font-size:1.25rem;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="contact-020"] input::placeholder,[data-vibeui-block="contact-020"] textarea::placeholder{color:#b3ab9b}
[data-vibeui-block="contact-020"] input:focus,[data-vibeui-block="contact-020"] textarea:focus{outline:none;border-color:var(--vibeui-contact-020-wax);box-shadow:0 2px 0 0 var(--vibeui-contact-020-wax)}
[data-vibeui-block="contact-020"] textarea{min-height:5.5rem;resize:vertical}
[data-vibeui-block="contact-020"] [data-part="choices"]{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem}
[data-vibeui-block="contact-020"] [data-part="choice"]{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1.1rem;border:1px solid var(--vibeui-contact-020-paper-line);border-radius:999px;background:var(--vibeui-contact-020-field);color:var(--vibeui-contact-020-ink);font-family:var(--vibeui-contact-020-display);font-size:1.02rem;font-weight:500;letter-spacing:.06em;cursor:pointer;transition:border-color .25s,background .25s,color .25s,transform .2s}
[data-vibeui-block="contact-020"] [data-part="choice"]:hover{border-color:var(--vibeui-contact-020-wax);transform:translateY(-1px)}
[data-vibeui-block="contact-020"] [data-part="choice"][aria-pressed="true"]{border-color:var(--vibeui-contact-020-wax);background:var(--vibeui-contact-020-wax);color:#f7f3ea}
[data-vibeui-block="contact-020"] [data-part="choice"]:focus-visible,[data-vibeui-block="contact-020"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-contact-020-wax);outline-offset:3px}
[data-vibeui-block="contact-020"] [data-part="nav"]{position:relative;display:flex;justify-content:space-between;gap:.75rem;margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-contact-020-paper-line)}
[data-vibeui-block="contact-020"] [data-part="nav"] button{display:inline-flex;align-items:center;gap:.4rem;height:2.9rem;padding:0 1.3rem;border-radius:999px;border:1px solid var(--vibeui-contact-020-paper-line);background:transparent;color:var(--vibeui-contact-020-ink);font-family:var(--vibeui-contact-020-display);font-size:1rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:transform .2s,background .25s,opacity .25s}
[data-vibeui-block="contact-020"] [data-part="nav"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="contact-020"] [data-part="nav"] button[data-primary]{margin-left:auto;background:var(--vibeui-contact-020-wax);border-color:var(--vibeui-contact-020-wax);color:#f7f3ea;box-shadow:0 12px 24px -14px var(--vibeui-contact-020-wax)}
[data-vibeui-block="contact-020"] [data-part="nav"] button:not(:disabled):hover{transform:translateY(-1px)}
[data-vibeui-block="contact-020"] [data-part="envelope"]{position:relative;align-self:start;overflow:hidden;border:1px solid var(--vibeui-contact-020-line);border-radius:.6rem;background:var(--vibeui-contact-020-envelope);box-shadow:0 30px 60px -40px rgb(0 0 0 / .8)}
[data-vibeui-block="contact-020"] [data-part="flap"]{position:relative;height:5.2rem;background:linear-gradient(180deg,rgb(159 176 200 / .12),transparent);border-bottom:1px solid var(--vibeui-contact-020-line)}
[data-vibeui-block="contact-020"] [data-part="flap"]::before,[data-vibeui-block="contact-020"] [data-part="flap"]::after{content:"";position:absolute;top:0;width:50%;height:100%;background:linear-gradient(to bottom right,transparent 49.5%,var(--vibeui-contact-020-line) 49.5%,var(--vibeui-contact-020-line) 50.5%,transparent 50.5%)}
[data-vibeui-block="contact-020"] [data-part="flap"]::before{left:0}
[data-vibeui-block="contact-020"] [data-part="flap"]::after{right:0;transform:scaleX(-1)}
[data-vibeui-block="contact-020"] [data-part="seal"]{position:absolute;left:50%;bottom:-1.3rem;z-index:1;display:grid;place-items:center;width:3.2rem;height:3.2rem;margin-left:-1.6rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,#a8404d,var(--vibeui-contact-020-wax) 55%,#4f171f);color:#f7f3ea;font-family:var(--vibeui-contact-020-display);font-size:1rem;font-weight:600;letter-spacing:.08em;box-shadow:0 6px 14px -6px rgb(0 0 0 / .8),inset 0 0 0 .18rem rgb(0 0 0 / .12),inset 0 0 0 .3rem rgb(255 255 255 / .06)}
[data-vibeui-block="contact-020"] [data-part="seal"]::before{content:"";position:absolute;inset:.35rem;border-radius:50%;border:1px solid rgb(247 243 234 / .35)}
[data-vibeui-block="contact-020"] [data-part="envelope"] header{padding:1.9rem 1.2rem .4rem;font-family:var(--vibeui-contact-020-display);font-size:.78rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;text-align:center;color:var(--vibeui-contact-020-silver)}
[data-vibeui-block="contact-020"] [data-part="envelope"] dl{display:grid;grid-template-columns:1fr 1fr;gap:.9rem 1rem;margin:0;padding:.6rem 1.2rem 1.2rem}
[data-vibeui-block="contact-020"] [data-part="envelope"] dt{font-family:var(--vibeui-contact-020-display);font-size:.7rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-020-muted)}
[data-vibeui-block="contact-020"] [data-part="envelope"] dd{margin:.1rem 0 0;font-family:var(--vibeui-contact-020-script);font-size:1.2rem;line-height:1.2;overflow-wrap:anywhere}
[data-vibeui-block="contact-020"] [data-part="envelope"] dd:empty::before{content:"—";color:var(--vibeui-contact-020-line)}
[data-vibeui-block="contact-020"] [data-part="envelope"] dl > div[data-wide]{grid-column:1 / -1}
[data-vibeui-block="contact-020"] [data-part="stamp"]{position:absolute;right:1rem;bottom:1rem;display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .9rem;border:2px solid var(--vibeui-contact-020-accent);border-radius:.4rem;color:var(--vibeui-contact-020-accent);font-family:var(--vibeui-contact-020-display);font-size:1.15rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;transform:rotate(-10deg);opacity:0;pointer-events:none}
[data-vibeui-block="contact-020"] [data-part="stamp"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round}
[data-vibeui-block="contact-020"] [data-part="envelope"][data-sent="true"] [data-part="stamp"]{animation:vibeui-contact-020-stamp .5s cubic-bezier(.2,.9,.3,1.4) both}
@keyframes vibeui-contact-020-stamp{from{opacity:0;transform:rotate(-10deg) scale(2)}to{opacity:.95;transform:rotate(-10deg) scale(1)}}
[data-vibeui-block="contact-020"] [data-part="thanks"]{position:relative;display:grid;justify-items:center;gap:.6rem;padding:2.5rem 1rem;text-align:center;animation:vibeui-contact-020-in .5s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="contact-020"] [data-part="thanks"] svg{width:3rem;height:3rem;fill:none;stroke:var(--vibeui-contact-020-wax);stroke-width:1.4;stroke-linecap:round}
[data-vibeui-block="contact-020"] [data-part="thanks"] h3{margin:.4rem 0 0;font-family:var(--vibeui-contact-020-display);font-size:2.2rem;font-weight:500}
[data-vibeui-block="contact-020"] [data-part="thanks"] p{max-width:28rem;margin:0;color:var(--vibeui-contact-020-paper-muted)}
@container (min-width:40rem){
[data-vibeui-block="contact-020"] [data-part="row"]{grid-template-columns:1fr 1fr}
}
@container (min-width:56rem){
[data-vibeui-block="contact-020"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="contact-020"] [data-part="grid"]{grid-template-columns:minmax(0,1.4fr) minmax(18rem,.7fr);gap:2.5rem}
[data-vibeui-block="contact-020"] [data-part="form"]{padding:2.25rem 2.5rem}
[data-vibeui-block="contact-020"] [data-part="envelope"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-020"] *{animation:none!important;transition:none!important}[data-vibeui-block="contact-020"] [data-part="envelope"][data-sent="true"] [data-part="stamp"]{opacity:.95}}`

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

const SNOW = "M12 2v20M2 12h20M5 5l14 14M19 5L5 19"

/** Письмо-ответ вместо RSVP: пять шагов на бумаге, конверт-сводка с сургучом и штамп «Ждём». */
export function Contact020({
  eyebrow = "Ответ",
  title = "Напишите, что приедете",
  greeting = "{name}, мы ждём ваш ответ",
  lede = "Пять вопросов — и мы знаем, сколько ставить стульев, где вас уложить и что готовить. Ответьте, пожалуйста, {deadline}.",
  deadline = "до 1 ноября",
  guest,
  stepLabels = ["Кто", "Ночёвка", "Дорога", "Меню", "Песня"],
  menu = [
    { value: "duck", label: "Утка с яблоками" },
    { value: "fish", label: "Форель" },
    { value: "veg", label: "Вегетарианское" },
  ],
  seal = "В·Д",
  summaryTitle = "Ваш ответ",
  submitLabel = "Отправить",
  thanksTitle = "Письмо получено",
  thanksText = "Спасибо! За две недели до вечера напишем про трансфер и комнаты.",
  stampLabel = "Ждём",
  action,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact020Props) {
  const fromUrl = useSyncExternalStore(subscribe, readGuest, () => "")
  const guestName = guest ?? fromUrl
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [sent, setSent] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-contact-020-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-020-fg": ink } : null),
    ...(background ? { "--vibeui-contact-020-bg": background } : null),
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

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
                    <path d={SNOW} />
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
                      <h3>Кто приедет</h3>
                      <p>Как вас записать и получится ли быть с нами.</p>
                      <label>
                        <span>Имя и фамилия</span>
                        <input type="text" name="name" value={name} onChange={(event) => set("name", event.target.value)} autoComplete="name" placeholder="Анна Соколова" />
                      </label>
                      <div data-part="choices">
                        {choice(answers.coming === "yes", "Приеду", () => set("coming", "yes"))}
                        {choice(answers.coming === "no", "Не смогу", () => set("coming", "no"))}
                      </div>
                      <label>
                        <span>С кем</span>
                        <input type="text" value={answers.companions} onChange={(event) => set("companions", event.target.value)} placeholder="Одна, с парой, с ребёнком 5 лет…" />
                      </label>
                    </div>
                  ) : null}
                  {step === 1 ? (
                    <div data-part="step" key="stay">
                      <h3>Останетесь ночевать?</h3>
                      <p>В доме двенадцать комнат, бельё и завтрак — наши. Кто уезжает — трансфер в 00:30 и 01:00.</p>
                      <div data-part="choices">
                        {choice(answers.stay === "house", "Остаюсь в доме", () => set("stay", "house"))}
                        {choice(answers.stay === "back", "Вернусь ночью", () => set("stay", "back"))}
                      </div>
                    </div>
                  ) : null}
                  {step === 2 ? (
                    <div data-part="step" key="road">
                      <h3>Как доберётесь</h3>
                      <p>Трансфер от метро «Тушинская» или своя машина — парковка под навесом.</p>
                      <div data-part="choices">
                        {choice(answers.transfer === "bus", "Трансфером", () => set("transfer", "bus"))}
                        {choice(answers.transfer === "car", "На машине", () => set("transfer", "car"))}
                      </div>
                      {answers.transfer === "bus" ? (
                        <div data-part="choices" role="group" aria-label="Время трансфера">
                          {choice(answers.transferTime === "14:30", "В 14:30", () => set("transferTime", "14:30"))}
                          {choice(answers.transferTime === "15:15", "В 15:15", () => set("transferTime", "15:15"))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {step === 3 ? (
                    <div data-part="step" key="menu">
                      <h3>Что приготовить</h3>
                      <p>Ужин у камина готовят заранее — выберите основное.</p>
                      <div data-part="choices" role="group" aria-label={stepLabels[3]}>
                        {menu.map((item) => choice(answers.menu === item.value, item.label, () => set("menu", item.value)))}
                      </div>
                      <label>
                        <span>Аллергии и ограничения</span>
                        <input type="text" value={answers.allergies} onChange={(event) => set("allergies", event.target.value)} placeholder="Орехи, лактоза…" />
                      </label>
                    </div>
                  ) : null}
                  {step === 4 ? (
                    <div data-part="step" key="song">
                      <h3>Песня и пара слов</h3>
                      <p>Под что вы точно пойдёте танцевать — отдадим диджею.</p>
                      <label>
                        <span>Исполнитель — название</span>
                        <input type="text" value={answers.song} onChange={(event) => set("song", event.target.value)} placeholder="Frank Sinatra — Let It Snow" />
                      </label>
                      <label>
                        <span>Слова для нас</span>
                        <textarea value={answers.wish} onChange={(event) => set("wish", event.target.value)} placeholder="Необязательно, но мы читаем всё" />
                      </label>
                    </div>
                  ) : null}
                  <div data-part="nav">
                    <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                      ← Назад
                    </button>
                    {step < last ? (
                      <button type="button" data-primary="" disabled={!canNext} onClick={() => setStep((value) => Math.min(last, value + 1))}>
                        Дальше →
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
            <aside data-part="envelope" data-sent={sent ? "true" : undefined} aria-live="polite">
              <div data-part="flap" aria-hidden="true">
                <span data-part="seal">{seal}</span>
              </div>
              <header>{summaryTitle}</header>
              <dl>
                <div>
                  <dt>От кого</dt>
                  <dd>{name}</dd>
                </div>
                <div>
                  <dt>Ответ</dt>
                  <dd>{answers.coming === "yes" ? "приедет" : answers.coming === "no" ? "не сможет" : ""}</dd>
                </div>
                <div>
                  <dt>С кем</dt>
                  <dd>{answers.companions}</dd>
                </div>
                <div>
                  <dt>Ночёвка</dt>
                  <dd>{answers.stay === "house" ? "в доме" : answers.stay === "back" ? "уедет" : ""}</dd>
                </div>
                <div>
                  <dt>Дорога</dt>
                  <dd>{answers.transfer === "bus" ? `трансфер ${answers.transferTime}`.trim() : answers.transfer === "car" ? "на машине" : ""}</dd>
                </div>
                <div>
                  <dt>Меню</dt>
                  <dd>{menuLabel}</dd>
                </div>
                <div data-wide="">
                  <dt>Песня</dt>
                  <dd>{answers.song}</dd>
                </div>
              </dl>
              <span data-part="stamp" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={SNOW} />
                </svg>
                {stampLabel}
              </span>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
