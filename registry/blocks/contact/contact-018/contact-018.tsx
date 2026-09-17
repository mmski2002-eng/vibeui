"use client"

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react"

export type Contact018Option = { value: string; label: string }

export type Contact018Props = {
  eyebrow?: string
  title?: string
  /** Приветствие, если гость назван в ссылке ?guest=Имя: «{name}, привет!». */
  greeting?: string
  lede?: string
  /** Срок ответа: «до 1 августа». */
  deadline?: string
  /** Имя гостя из пропса; иначе берётся из ?guest= в адресе. */
  guest?: string
  /** Подписи шагов: кто, с кем, меню, дорога, песня. */
  stepLabels?: readonly [string, string, string, string, string]
  menu?: readonly Contact018Option[]
  drinks?: readonly Contact018Option[]
  /** Заголовок сводки справа. */
  summaryTitle?: string
  submitLabel?: string
  thanksTitle?: string
  thanksText?: string
  /** Куда уходит анкета: форма делает POST сюда. Пусто — только экран «спасибо». */
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

type Answers = {
  name: string
  coming: "yes" | "no" | ""
  plusOne: boolean
  plusOneName: string
  children: string
  menu: string
  drinks: string[]
  allergies: string
  transfer: "yes" | "no" | ""
  song: string
  wish: string
}

const EMPTY: Answers = { name: "", coming: "", plusOne: false, plusOneName: "", children: "", menu: "", drinks: [], allergies: "", transfer: "", song: "", wish: "" }

// RSVP-анкета в пять шагов: кто и придёт ли, с кем, меню и напитки, нужен
// ли трансфер, песня для танцпола и пожелание. Сверху прогресс-точки,
// справа сводка, которая заполняется по ходу. Имя гостя подставляется из
// ?guest= в адресе — ссылку можно слать персональной. Финал — «спасибо»
// с восковой печатью. Отправка — обычный POST на action, без него просто
// показывается финал.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-018"]){
--vibeui-contact-018-bg:light-dark(#fffaf3,#1d1620);
--vibeui-contact-018-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-contact-018-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-contact-018-line:light-dark(#e2d8ca,#372b31);
--vibeui-contact-018-card:light-dark(#f6f1e8,#17131a);
--vibeui-contact-018-field:light-dark(#ffffff,#241c28);
--vibeui-contact-018-accent:#b8552f;
--vibeui-contact-018-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-contact-018-sage:#8a9a7b;
--vibeui-contact-018-on-accent:#fff7ef;
--vibeui-contact-018-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-contact-018-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-018"]{color-scheme:dark}
:where([data-vibeui-block="contact-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-018"]{box-sizing:border-box;display:block;background:var(--vibeui-contact-018-bg);color:var(--vibeui-contact-018-fg);font-family:var(--vibeui-contact-018-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-018"] *{box-sizing:border-box}
[data-vibeui-block="contact-018"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="contact-018"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-contact-018-accent)}
[data-vibeui-block="contact-018"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-018-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-contact-018-plum);text-wrap:balance}
[data-vibeui-block="contact-018"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-contact-018-muted)}
[data-vibeui-block="contact-018"] [data-part="lede"] b{color:var(--vibeui-contact-018-accent);font-weight:600}
[data-vibeui-block="contact-018"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="contact-018"] [data-part="form"]{padding:1.5rem;border:1px solid var(--vibeui-contact-018-line);border-radius:1.4rem;background:var(--vibeui-contact-018-card)}
[data-vibeui-block="contact-018"] [data-part="progress"]{display:flex;align-items:center;gap:.4rem;margin:0 0 1.5rem;padding:0;list-style:none}
[data-vibeui-block="contact-018"] [data-part="progress"] li{flex:1;height:3px;border-radius:2px;background:var(--vibeui-contact-018-line);overflow:hidden}
[data-vibeui-block="contact-018"] [data-part="progress"] li::after{content:"";display:block;height:100%;background:var(--vibeui-contact-018-accent);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="contact-018"] [data-part="progress"] li[data-done="true"]::after{transform:scaleX(1)}
[data-vibeui-block="contact-018"] [data-part="step"]{animation:vibeui-contact-018-in .4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-contact-018-in{from{opacity:0;transform:translateY(.5rem)}}
[data-vibeui-block="contact-018"] [data-part="step"] h3{margin:0 0 .25rem;font-family:var(--vibeui-contact-018-display);font-size:1.7rem;font-weight:500;line-height:1.15;color:var(--vibeui-contact-018-plum)}
[data-vibeui-block="contact-018"] [data-part="step"] > p{margin:0 0 1.2rem;font-size:.92rem;color:var(--vibeui-contact-018-muted)}
[data-vibeui-block="contact-018"] label{display:block;margin-bottom:1rem}
[data-vibeui-block="contact-018"] label > span{display:block;margin-bottom:.35rem;font-size:.78rem;font-weight:600;letter-spacing:.04em;color:var(--vibeui-contact-018-muted)}
[data-vibeui-block="contact-018"] input[type="text"],[data-vibeui-block="contact-018"] textarea{width:100%;padding:.75rem .9rem;border:1px solid var(--vibeui-contact-018-line);border-radius:.8rem;background:var(--vibeui-contact-018-field);color:inherit;font:inherit;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="contact-018"] input[type="text"]:focus,[data-vibeui-block="contact-018"] textarea:focus{outline:none;border-color:var(--vibeui-contact-018-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-contact-018-accent) 18%,transparent)}
[data-vibeui-block="contact-018"] textarea{min-height:5.5rem;resize:vertical}
[data-vibeui-block="contact-018"] [data-part="choices"]{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem}
[data-vibeui-block="contact-018"] [data-part="choice"]{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1rem;border:1px solid var(--vibeui-contact-018-line);border-radius:999px;background:var(--vibeui-contact-018-field);color:inherit;font:inherit;font-size:.92rem;cursor:pointer;transition:border-color .25s,background .25s,color .25s,transform .2s}
[data-vibeui-block="contact-018"] [data-part="choice"]:hover{border-color:var(--vibeui-contact-018-accent);transform:translateY(-1px)}
[data-vibeui-block="contact-018"] [data-part="choice"][aria-pressed="true"],[data-vibeui-block="contact-018"] [data-part="choice"][aria-checked="true"]{border-color:var(--vibeui-contact-018-accent);background:var(--vibeui-contact-018-accent);color:var(--vibeui-contact-018-on-accent)}
[data-vibeui-block="contact-018"] [data-part="choice"]:focus-visible,[data-vibeui-block="contact-018"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-contact-018-accent);outline-offset:3px}
[data-vibeui-block="contact-018"] [data-part="nav"]{display:flex;justify-content:space-between;gap:.75rem;margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-contact-018-line)}
[data-vibeui-block="contact-018"] [data-part="nav"] button{display:inline-flex;align-items:center;gap:.4rem;height:2.9rem;padding:0 1.3rem;border-radius:999px;border:1px solid var(--vibeui-contact-018-line);background:transparent;color:inherit;font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;transition:transform .2s,background .25s,border-color .25s}
[data-vibeui-block="contact-018"] [data-part="nav"] button:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="contact-018"] [data-part="nav"] button[data-primary]{margin-left:auto;background:var(--vibeui-contact-018-accent);border-color:var(--vibeui-contact-018-accent);color:var(--vibeui-contact-018-on-accent)}
[data-vibeui-block="contact-018"] [data-part="nav"] button:not(:disabled):hover{transform:translateY(-1px)}
[data-vibeui-block="contact-018"] [data-part="summary"]{align-self:start;padding:1.5rem;border-radius:1.4rem 1.4rem 3rem 1.4rem;background:color-mix(in oklab,var(--vibeui-contact-018-sage) 16%,transparent)}
[data-vibeui-block="contact-018"] [data-part="summary"] h3{margin:0 0 .8rem;font-family:var(--vibeui-contact-018-display);font-size:1.4rem;font-weight:500;font-style:italic;color:var(--vibeui-contact-018-plum)}
[data-vibeui-block="contact-018"] [data-part="summary"] dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.4rem .9rem;margin:0;font-size:.9rem}
[data-vibeui-block="contact-018"] [data-part="summary"] dt{color:var(--vibeui-contact-018-muted)}
[data-vibeui-block="contact-018"] [data-part="summary"] dd{margin:0;font-weight:600;overflow-wrap:anywhere}
[data-vibeui-block="contact-018"] [data-part="summary"] dd:empty::before{content:"—";font-weight:400;color:var(--vibeui-contact-018-muted)}
[data-vibeui-block="contact-018"] [data-part="thanks"]{display:grid;justify-items:center;gap:.8rem;padding:2.5rem 1rem;text-align:center;animation:vibeui-contact-018-in .5s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="contact-018"] [data-part="seal"]{display:grid;place-items:center;width:5.5rem;height:5.5rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-contact-018-accent) 70%,#fff) 0,var(--vibeui-contact-018-accent) 35%,color-mix(in oklab,var(--vibeui-contact-018-accent) 70%,#000) 100%);color:var(--vibeui-contact-018-on-accent);font-family:var(--vibeui-contact-018-display);font-style:italic;font-size:1.6rem;box-shadow:0 10px 24px -10px rgb(43 26 36 / .6),inset 0 0 0 .35rem rgb(255 255 255 / .12);animation:vibeui-contact-018-stamp .6s cubic-bezier(.2,.9,.3,1.4) both}
@keyframes vibeui-contact-018-stamp{from{transform:scale(1.6) rotate(-10deg);opacity:0}}
[data-vibeui-block="contact-018"] [data-part="thanks"] h3{margin:.5rem 0 0;font-family:var(--vibeui-contact-018-display);font-size:2rem;font-weight:500;font-style:italic;color:var(--vibeui-contact-018-plum)}
[data-vibeui-block="contact-018"] [data-part="thanks"] p{max-width:28rem;margin:0;color:var(--vibeui-contact-018-muted)}
@container (min-width:56rem){
[data-vibeui-block="contact-018"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="contact-018"] [data-part="grid"]{grid-template-columns:minmax(0,1.4fr) minmax(16rem,.7fr);gap:2.5rem}
[data-vibeui-block="contact-018"] [data-part="form"]{padding:2rem 2.25rem}
[data-vibeui-block="contact-018"] [data-part="summary"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-018"] *{animation:none!important;transition:none!important}}`

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

/** RSVP-анкета свадьбы в пять шагов: кто, с кем, меню и напитки, трансфер, песня и пожелание; сводка справа, «спасибо» с печатью. */
export function Contact018({
  eyebrow = "Подтверждение",
  title = "Скажите, что придёте",
  greeting = "{name}, привет!",
  lede = "Пять коротких вопросов — чтобы мы посадили вас рядом с теми, с кем хочется, и не забыли ничего важного. Ответьте, пожалуйста, {deadline}.",
  deadline = "до 1 августа",
  guest,
  stepLabels = ["Кто", "С кем", "Меню", "Дорога", "Песня"],
  menu = [
    { value: "meat", label: "Мясо" },
    { value: "fish", label: "Рыба" },
    { value: "veg", label: "Вегетарианское" },
  ],
  drinks = [
    { value: "wine", label: "Вино" },
    { value: "strong", label: "Крепкое" },
    { value: "none", label: "Без алкоголя" },
  ],
  summaryTitle = "Ваш ответ",
  submitLabel = "Отправить ответ",
  thanksTitle = "Спасибо, ждём вас!",
  thanksText = "Ответ записан. Если что-то поменяется — просто откройте эту страницу снова и напишите нам.",
  action,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Contact018Props) {
  const fromUrl = useSyncExternalStore(subscribe, readGuest, () => "")
  const guestName = guest ?? fromUrl
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => ({ ...EMPTY, name: guestName }))
  const [sent, setSent] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-contact-018-accent": accent } : null),
    ...(background ? { "--vibeui-contact-018-bg": background } : null),
    ...style,
  } as CSSProperties
  const name = answers.name || guestName
  const last = stepLabels.length - 1

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function toggleDrink(value: string) {
    setAnswers((current) => ({ ...current, drinks: current.drinks.includes(value) ? current.drinks.filter((item) => item !== value) : [...current.drinks, value] }))
  }

  const canNext = step === 0 ? name.trim().length > 0 && answers.coming !== "" : true

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!action) {
      event.preventDefault()
    }
    setSent(true)
  }

  const choice = (pressed: boolean, label: string, onClick: () => void, role: "button" | "checkbox" = "button") => (
    <button type="button" data-part="choice" role={role === "checkbox" ? "checkbox" : undefined} aria-checked={role === "checkbox" ? pressed : undefined} aria-pressed={role === "button" ? pressed : undefined} onClick={onClick}>
      {label}
    </button>
  )

  const menuLabel = menu.find((item) => item.value === answers.menu)?.label ?? ""
  const drinksLabel = drinks.filter((item) => answers.drinks.includes(item.value)).map((item) => item.label).join(", ")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-018" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-018" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
                  <span data-part="seal" aria-hidden="true">
                    ✓
                  </span>
                  <h3>{thanksTitle}</h3>
                  <p>{thanksText}</p>
                </div>
              ) : (
                <>
                  <ol data-part="progress" aria-label={`${step + 1} / ${stepLabels.length}`}>
                    {stepLabels.map((label, index) => (
                      <li key={label} data-done={index <= step ? "true" : undefined} title={label} />
                    ))}
                  </ol>
                  {step === 0 ? (
                    <div data-part="step" key="who">
                      <h3>{stepLabels[0]}</h3>
                      <p>Как вас записать и получится ли приехать.</p>
                      <label>
                        <span>Имя и фамилия</span>
                        <input type="text" name="name" value={name} onChange={(event) => set("name", event.target.value)} autoComplete="name" placeholder="Ольга Смирнова" />
                      </label>
                      <div data-part="choices">
                        {choice(answers.coming === "yes", "Буду, конечно", () => set("coming", "yes"))}
                        {choice(answers.coming === "no", "Не смогу, простите", () => set("coming", "no"))}
                      </div>
                    </div>
                  ) : null}
                  {step === 1 ? (
                    <div data-part="step" key="with">
                      <h3>{stepLabels[1]}</h3>
                      <p>Плюс один и дети — мы посчитаем стулья и стаканы.</p>
                      <div data-part="choices">
                        {choice(!answers.plusOne, "Приду один(на)", () => set("plusOne", false))}
                        {choice(answers.plusOne, "С парой", () => set("plusOne", true))}
                      </div>
                      {answers.plusOne ? (
                        <label>
                          <span>Как зовут пару</span>
                          <input type="text" value={answers.plusOneName} onChange={(event) => set("plusOneName", event.target.value)} placeholder="Имя" />
                        </label>
                      ) : null}
                      <label>
                        <span>Дети и их возраст, если берёте</span>
                        <input type="text" value={answers.children} onChange={(event) => set("children", event.target.value)} placeholder="Мира, 4 года" />
                      </label>
                    </div>
                  ) : null}
                  {step === 2 ? (
                    <div data-part="step" key="menu">
                      <h3>{stepLabels[2]}</h3>
                      <p>Основное блюдо одно на выбор, напитки — сколько угодно.</p>
                      <div data-part="choices" role="group" aria-label={stepLabels[2]}>
                        {menu.map((item) => choice(answers.menu === item.value, item.label, () => set("menu", item.value)))}
                      </div>
                      <div data-part="choices" role="group" aria-label="Напитки">
                        {drinks.map((item) => choice(answers.drinks.includes(item.value), item.label, () => toggleDrink(item.value), "checkbox"))}
                      </div>
                      <label>
                        <span>Аллергии и ограничения</span>
                        <input type="text" value={answers.allergies} onChange={(event) => set("allergies", event.target.value)} placeholder="Орехи, лактоза…" />
                      </label>
                    </div>
                  ) : null}
                  {step === 3 ? (
                    <div data-part="step" key="road">
                      <h3>{stepLabels[3]}</h3>
                      <p>Трансфер от метро «Алтуфьево» в 13:30 и 14:15, обратно в 23:30.</p>
                      <div data-part="choices">
                        {choice(answers.transfer === "yes", "Поеду на трансфере", () => set("transfer", "yes"))}
                        {choice(answers.transfer === "no", "Доберусь сам(а)", () => set("transfer", "no"))}
                      </div>
                    </div>
                  ) : null}
                  {step === 4 ? (
                    <div data-part="step" key="song">
                      <h3>{stepLabels[4]}</h3>
                      <p>Песня, под которую вы точно выйдете танцевать, — поставим её вечером.</p>
                      <label>
                        <span>Исполнитель — название</span>
                        <input type="text" value={answers.song} onChange={(event) => set("song", event.target.value)} placeholder="ABBA — Dancing Queen" />
                      </label>
                      <label>
                        <span>Пара слов для нас</span>
                        <textarea value={answers.wish} onChange={(event) => set("wish", event.target.value)} placeholder="Необязательно, но приятно" />
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
            <aside data-part="summary" aria-live="polite">
              <h3>{summaryTitle}</h3>
              <dl>
                <dt>Гость</dt>
                <dd>{name}</dd>
                <dt>Придёт</dt>
                <dd>{answers.coming === "yes" ? "да" : answers.coming === "no" ? "нет" : ""}</dd>
                <dt>С кем</dt>
                <dd>{[answers.plusOne ? answers.plusOneName || "с парой" : "", answers.children].filter(Boolean).join(", ")}</dd>
                <dt>Меню</dt>
                <dd>{[menuLabel, drinksLabel].filter(Boolean).join(" · ")}</dd>
                <dt>Трансфер</dt>
                <dd>{answers.transfer === "yes" ? "нужен" : answers.transfer === "no" ? "не нужен" : ""}</dd>
                <dt>Песня</dt>
                <dd>{answers.song}</dd>
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
