"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"

export type Cta032Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Что будет на пробном — три пункта. */
  facts?: readonly string[]
  /** Языки-чипы в форме. */
  languages?: readonly string[]
  nameLabel?: string
  contactLabel?: string
  actionLabel?: string
  fine?: string
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Запись на пробный урок: слева заголовок и три факта о том, что будет на
// занятии, справа тетрадный лист с формой — плавающие ярлыки над полями
// (label уезжает вверх при фокусе и заполнении), чипы языка, одна кнопка.
// После отправки лист меняется на «записали»: кружок и галочка
// прорисовываются штрихом, ниже текст «напишем в течение часа». Форма
// ничего не отправляет наружу — заглушка под свой обработчик.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-032"]){
--vibeui-cta-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-032-on-accent:oklch(from var(--vibeui-cta-032-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-032-muted:color-mix(in oklab,var(--vibeui-cta-032-fg) 62%,var(--vibeui-cta-032-bg));
--vibeui-cta-032-line:color-mix(in oklab,var(--vibeui-cta-032-fg) 14%,transparent);
--vibeui-cta-032-rule:color-mix(in oklab,var(--vibeui-cta-032-fg) 8%,transparent);
--vibeui-cta-032-paper:color-mix(in oklab,var(--vibeui-cta-032-bg) 92%,#fff);
--vibeui-cta-032-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-032-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-032-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-032"]{color-scheme:dark}
:where([data-vibeui-block="cta-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-032"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-cta-032-bg);color:var(--vibeui-cta-032-fg);font-family:var(--vibeui-cta-032-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-032"]::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--vibeui-cta-032-rule) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-cta-032-rule) 1px,transparent 1px);background-size:2rem 2rem;mask-image:radial-gradient(ellipse 70% 80% at 70% 50%,#000 20%,transparent 100%);pointer-events:none}
[data-vibeui-block="cta-032"] *{box-sizing:border-box}
[data-vibeui-block="cta-032"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="cta-032"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-cta-032-hand);font-size:1.4rem;color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-032-display);font-weight:800;font-size:clamp(2.1rem,5cqi,3.6rem);line-height:1.03;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="cta-032"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-cta-032-muted)}
[data-vibeui-block="cta-032"] [data-part="facts"]{display:grid;gap:.6rem;margin:1.6rem 0 0;padding:0;list-style:none;counter-reset:vibeui-cta-032}
[data-vibeui-block="cta-032"] [data-part="facts"] li{display:flex;gap:.8rem;align-items:baseline;counter-increment:vibeui-cta-032}
[data-vibeui-block="cta-032"] [data-part="facts"] li::before{content:counter(vibeui-cta-032);flex:none;display:inline-grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;border:1.5px solid var(--vibeui-cta-032-accent);color:var(--vibeui-cta-032-accent);font-family:var(--vibeui-cta-032-hand);font-size:1.1rem;transform:translateY(.3rem)}
[data-vibeui-block="cta-032"] [data-part="sheet"]{position:relative;width:min(100%,30rem);margin:0 auto;padding:2rem 1.6rem 1.8rem 2.8rem;border-radius:.4rem 1.2rem 1.2rem .4rem;background:var(--vibeui-cta-032-paper);background-image:linear-gradient(90deg,transparent 1.9rem,color-mix(in oklab,var(--vibeui-cta-032-accent) 45%,transparent) 1.9rem,color-mix(in oklab,var(--vibeui-cta-032-accent) 45%,transparent) calc(1.9rem + 1px),transparent calc(1.9rem + 1px));border:1px solid var(--vibeui-cta-032-line);box-shadow:0 30px 60px -30px color-mix(in oklab,var(--vibeui-cta-032-fg) 45%,transparent);transform:rotate(.8deg);min-height:24rem;display:grid;align-content:center}
[data-vibeui-block="cta-032"] [data-part="sheet"]::before{content:"";position:absolute;left:.55rem;top:1.4rem;bottom:1.4rem;width:.45rem;background:repeating-linear-gradient(180deg,var(--vibeui-cta-032-line) 0 .5rem,transparent .5rem 1.6rem);border-radius:999px}
[data-vibeui-block="cta-032"] [data-part="form"]{display:grid;gap:1.1rem}
[data-vibeui-block="cta-032"] [data-part="form"] h3{margin:0 0 .2rem;font-family:var(--vibeui-cta-032-hand);font-weight:400;font-size:1.7rem;line-height:1.1;color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="field"]{position:relative}
[data-vibeui-block="cta-032"] [data-part="field"] input{width:100%;height:3.4rem;padding:1.1rem .2rem 0;border:0;border-bottom:1.5px solid var(--vibeui-cta-032-line);background:transparent;color:var(--vibeui-cta-032-fg);font:inherit;font-size:1.05rem;outline:none;transition:border-color .2s}
[data-vibeui-block="cta-032"] [data-part="field"] input:focus{border-color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="field"] label{position:absolute;left:.2rem;top:1.05rem;font-size:1rem;color:var(--vibeui-cta-032-muted);pointer-events:none;transform-origin:left;transition:transform .25s cubic-bezier(.2,.8,.2,1),color .2s}
[data-vibeui-block="cta-032"] [data-part="field"] input:focus + label,[data-vibeui-block="cta-032"] [data-part="field"] input:not(:placeholder-shown) + label{transform:translateY(-.95rem) scale(.72);color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="field"] input::placeholder{color:transparent}
[data-vibeui-block="cta-032"] [data-part="field"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.5px;background:var(--vibeui-cta-032-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-032"] [data-part="field"]:focus-within::after{transform:scaleX(1)}
[data-vibeui-block="cta-032"] [data-part="langs"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:.2rem 0 0}
[data-vibeui-block="cta-032"] [data-part="langs"] > span{font-size:.78rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-cta-032-muted);margin-right:.2rem}
[data-vibeui-block="cta-032"] [data-part="chip"]{padding:.5rem .9rem;border-radius:999px;border:1.5px solid var(--vibeui-cta-032-line);background:transparent;color:var(--vibeui-cta-032-fg);font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;transition:transform .18s,background .2s,color .2s,border-color .2s}
[data-vibeui-block="cta-032"] [data-part="chip"]:hover{transform:translateY(-1px);border-color:var(--vibeui-cta-032-fg)}
[data-vibeui-block="cta-032"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-cta-032-accent);color:var(--vibeui-cta-032-on-accent);border-color:transparent}
[data-vibeui-block="cta-032"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-cta-032-accent);outline-offset:2px}
[data-vibeui-block="cta-032"] [data-part="submit"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;height:3.3rem;margin-top:.4rem;padding:0 1.4rem;border:0;border-radius:1rem;background:var(--vibeui-cta-032-accent);color:var(--vibeui-cta-032-on-accent);font:inherit;font-weight:600;font-size:1rem;cursor:pointer;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="cta-032"] [data-part="submit"]:hover{transform:translateY(-2px) rotate(-.6deg);box-shadow:0 14px 30px -12px var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-cta-032-fg);outline-offset:2px}
[data-vibeui-block="cta-032"] [data-part="fine"]{margin:0;font-size:.78rem;color:var(--vibeui-cta-032-muted)}
[data-vibeui-block="cta-032"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;text-align:center;animation:vibeui-cta-032-pop .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="cta-032"] [data-part="done"] svg{width:4.5rem;height:4.5rem;color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-cta-032-draw .8s cubic-bezier(.2,.8,.2,1) forwards}
[data-vibeui-block="cta-032"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-cta-032-draw .5s cubic-bezier(.2,.8,.2,1) .5s forwards}
[data-vibeui-block="cta-032"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-032-hand);font-weight:400;font-size:2rem;line-height:1.1;color:var(--vibeui-cta-032-accent)}
[data-vibeui-block="cta-032"] [data-part="done"] p{margin:0;max-width:20rem;color:var(--vibeui-cta-032-muted)}
@keyframes vibeui-cta-032-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-cta-032-pop{from{opacity:0;transform:translateY(8px)}}
@container (min-width: 60rem){[data-vibeui-block="cta-032"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:4rem}[data-vibeui-block="cta-032"] [data-part="sheet"]{margin:0 0 0 auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-032"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-032"] [data-part="done"] circle,[data-vibeui-block="cta-032"] [data-part="done"] path{stroke-dashoffset:0}}`

/** Пробный урок: форма на тетрадном листе с плавающими ярлыками и галочкой. */
export function Cta032({
  eyebrow = "первый урок — бесплатно",
  title = "Приходите поговорить. Просто поговорить",
  lede = "Пробное занятие — это не тест и не продажа. Полчаса разговора с преподавателем, чтобы понять, подходит ли вам формат и группа.",
  facts = ["Поговорим 30 минут на языке — на столько, на сколько получится", "Определим уровень точнее, чем тест, и подберём группу", "Расскажем, чего ждать через месяц и через три"],
  languages = ["Английский", "Испанский", "Итальянский"],
  nameLabel = "Как вас зовут",
  contactLabel = "Телефон или Telegram",
  actionLabel = "Записаться на пробный",
  fine = "Напишем в течение часа в рабочее время. Никаких звонков без предупреждения.",
  doneTitle = "записали!",
  doneText = "Напишем в течение часа и предложим два-три времени на выбор. Проверьте Telegram.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta032Props) {
  const [done, setDone] = useState(false)
  const [lang, setLang] = useState(0)
  const id = useId()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-032-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-032-fg": ink } : null),
    ...(background ? { "--vibeui-cta-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-032" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {facts.length > 0 ? (
              <ol data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ol>
            ) : null}
          </div>
          <div data-part="sheet" aria-live="polite">
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
              <form data-part="form" onSubmit={submit}>
                <h3>{eyebrow || "пробный урок"}</h3>
                <div data-part="field">
                  <input id={`${id}-name`} name="name" type="text" required placeholder={nameLabel} autoComplete="name" />
                  <label htmlFor={`${id}-name`}>{nameLabel}</label>
                </div>
                <div data-part="field">
                  <input id={`${id}-contact`} name="contact" type="text" required placeholder={contactLabel} autoComplete="tel" />
                  <label htmlFor={`${id}-contact`}>{contactLabel}</label>
                </div>
                {languages.length > 0 ? (
                  <div data-part="langs" role="group" aria-label="Язык">
                    <span>язык</span>
                    {languages.map((language, index) => (
                      <button key={language} data-part="chip" type="button" aria-pressed={lang === index} onClick={() => setLang(index)}>
                        {language}
                      </button>
                    ))}
                  </div>
                ) : null}
                <button data-part="submit" type="submit">
                  {actionLabel}
                </button>
                {fine ? <p data-part="fine">{fine}</p> : null}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
