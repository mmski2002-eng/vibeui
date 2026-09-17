"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Testimonials021Card = {
  name: string
  text: string
  /** Откуда открытка: город на штемпеле. */
  from?: string
}

export type Testimonials021Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cards?: readonly Testimonials021Card[]
  formTitle?: string
  nameLabel?: string
  fromLabel?: string
  textLabel?: string
  submitLabel?: string
  /** Штемпель на новой открытке: «отправлено». */
  sentLabel?: string
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Открытки от гостей: стена открыток обратной стороной — разлиновка,
// марка, круглый штемпель с городом, текст рукописным. Слева форма
// «отправить открытку»: новая ложится первой с штемпелем «отправлено» и
// анимацией приземления. Без action — живёт до перезагрузки.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-021"]){
--vibeui-testimonials-021-bg:light-dark(#f3e9d2,#1c2a34);
--vibeui-testimonials-021-paper:#fffaf0;
--vibeui-testimonials-021-field:light-dark(#ffffff,#0f1a22);
--vibeui-testimonials-021-fg:light-dark(#123a4b,#eef4f2);
--vibeui-testimonials-021-ink:#123a4b;
--vibeui-testimonials-021-muted:light-dark(#5b6f78,#9fb2b8);
--vibeui-testimonials-021-line:light-dark(#e3d7bf,#2c3f4a);
--vibeui-testimonials-021-accent:#ff6b57;
--vibeui-testimonials-021-sea:#2aa7a0;
--vibeui-testimonials-021-sun:#f2c14e;
--vibeui-testimonials-021-on-accent:#fffaf0;
--vibeui-testimonials-021-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-testimonials-021-script:"Lobster","Brush Script MT",cursive;
--vibeui-testimonials-021-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-021"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-021"]{box-sizing:border-box;display:block;background:var(--vibeui-testimonials-021-bg);color:var(--vibeui-testimonials-021-fg);font-family:var(--vibeui-testimonials-021-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-021"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="testimonials-021"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="testimonials-021"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-testimonials-021-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-testimonials-021-accent)}
[data-vibeui-block="testimonials-021"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-021-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="testimonials-021"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-testimonials-021-muted)}
[data-vibeui-block="testimonials-021"] [data-part="form"]{margin-top:1.5rem;padding:1.4rem;border-radius:.9rem;background:var(--vibeui-testimonials-021-paper);color:var(--vibeui-testimonials-021-ink);box-shadow:0 24px 50px -36px rgb(18 58 75 / .5)}
[data-vibeui-block="testimonials-021"] [data-part="form"] h3{margin:0 0 .9rem;font-family:var(--vibeui-testimonials-021-display);font-size:1.3rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
[data-vibeui-block="testimonials-021"] [data-part="row"]{display:grid;gap:0 .8rem;grid-template-columns:1fr 1fr}
[data-vibeui-block="testimonials-021"] label{display:block;margin-bottom:.9rem}
[data-vibeui-block="testimonials-021"] label span{display:block;margin-bottom:.3rem;font-family:var(--vibeui-testimonials-021-display);font-size:.66rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-testimonials-021-muted)}
[data-vibeui-block="testimonials-021"] input,[data-vibeui-block="testimonials-021"] textarea{width:100%;padding:.7rem .9rem;border:1px solid var(--vibeui-testimonials-021-line);border-radius:.5rem;background:var(--vibeui-testimonials-021-field);color:var(--vibeui-testimonials-021-fg);font:inherit;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="testimonials-021"] textarea{min-height:6rem;resize:vertical;font-family:var(--vibeui-testimonials-021-script);font-size:1.15rem}
[data-vibeui-block="testimonials-021"] input:focus,[data-vibeui-block="testimonials-021"] textarea:focus{outline:none;border-color:var(--vibeui-testimonials-021-sea);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-testimonials-021-sea) 20%,transparent)}
[data-vibeui-block="testimonials-021"] [data-part="submit"]{display:inline-flex;align-items:center;gap:.5rem;height:2.8rem;padding:0 1.3rem;border:0;border-radius:.6rem;background:var(--vibeui-testimonials-021-accent);color:var(--vibeui-testimonials-021-on-accent);font-family:var(--vibeui-testimonials-021-display);font-size:.9rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:transform .2s}
[data-vibeui-block="testimonials-021"] [data-part="submit"]:hover{transform:translateY(-1px)}
[data-vibeui-block="testimonials-021"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-testimonials-021-fg);outline-offset:3px}
[data-vibeui-block="testimonials-021"] [data-part="submit"] svg{width:1rem;height:1rem;fill:currentColor}
[data-vibeui-block="testimonials-021"] [data-part="wall"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));gap:1.4rem;margin:0;padding:0;list-style:none;align-content:start}
[data-vibeui-block="testimonials-021"] [data-part="card"]{position:relative;display:grid;grid-template-columns:1.5fr 1fr;min-height:11rem;padding:1rem 1rem .9rem 1.1rem;border-radius:.3rem;background:var(--vibeui-testimonials-021-paper);color:var(--vibeui-testimonials-021-ink);box-shadow:0 18px 30px -24px rgb(18 58 75 / .6);transform:rotate(var(--vibeui-testimonials-021-tilt,0deg));transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="testimonials-021"] [data-part="wall"] li:nth-child(4n+1) [data-part="card"]{--vibeui-testimonials-021-tilt:-1.6deg}
[data-vibeui-block="testimonials-021"] [data-part="wall"] li:nth-child(4n+2) [data-part="card"]{--vibeui-testimonials-021-tilt:1.2deg}
[data-vibeui-block="testimonials-021"] [data-part="wall"] li:nth-child(4n+3) [data-part="card"]{--vibeui-testimonials-021-tilt:-.6deg}
[data-vibeui-block="testimonials-021"] [data-part="wall"] li:nth-child(4n) [data-part="card"]{--vibeui-testimonials-021-tilt:1.8deg}
[data-vibeui-block="testimonials-021"] [data-part="card"]:hover{transform:rotate(0) scale(1.03);box-shadow:0 26px 40px -24px rgb(18 58 75 / .6);z-index:1}
[data-vibeui-block="testimonials-021"] [data-part="card"]::before{content:"";position:absolute;top:1rem;bottom:1rem;left:56%;width:1px;background:var(--vibeui-testimonials-021-line)}
[data-vibeui-block="testimonials-021"] [data-part="card"][data-fresh="true"]{animation:vibeui-testimonials-021-land .7s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes vibeui-testimonials-021-land{from{opacity:0;transform:rotate(var(--vibeui-testimonials-021-tilt,0deg)) translateY(-2rem) scale(1.1)}}
[data-vibeui-block="testimonials-021"] [data-part="card"] p{margin:0;padding-right:.9rem;font-family:var(--vibeui-testimonials-021-script);font-size:1.05rem;line-height:1.35}
[data-vibeui-block="testimonials-021"] [data-part="side"]{position:relative;display:grid;align-content:end;gap:.35rem;padding-left:.9rem}
[data-vibeui-block="testimonials-021"] [data-part="side"] i{display:block;height:1px;background:var(--vibeui-testimonials-021-line)}
[data-vibeui-block="testimonials-021"] [data-part="side"] b{font-family:var(--vibeui-testimonials-021-script);font-size:1rem;font-weight:400;color:var(--vibeui-testimonials-021-accent)}
[data-vibeui-block="testimonials-021"] [data-part="stampmark"]{position:absolute;top:-.2rem;right:0;width:2rem;height:2.4rem;border:.2rem solid var(--vibeui-testimonials-021-paper);background:var(--vibeui-testimonials-021-sea);outline:2px dashed var(--vibeui-testimonials-021-paper);outline-offset:-.4rem;box-shadow:0 0 0 1px var(--vibeui-testimonials-021-line)}
[data-vibeui-block="testimonials-021"] [data-part="wall"] li:nth-child(even) [data-part="stampmark"]{background:var(--vibeui-testimonials-021-sun)}
[data-vibeui-block="testimonials-021"] [data-part="post"]{position:absolute;top:.1rem;right:1.6rem;width:3.4rem;height:3.4rem;transform:rotate(-14deg);opacity:.8}
[data-vibeui-block="testimonials-021"] [data-part="post"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="testimonials-021"] [data-part="post"] circle{fill:none;stroke:var(--vibeui-testimonials-021-accent);stroke-width:2}
[data-vibeui-block="testimonials-021"] [data-part="post"] text{font-family:var(--vibeui-testimonials-021-display);font-size:8px;font-weight:600;letter-spacing:1px;fill:var(--vibeui-testimonials-021-accent);text-anchor:middle;text-transform:uppercase}
[data-vibeui-block="testimonials-021"] [data-part="card"][data-fresh="true"] [data-part="post"] circle{stroke:var(--vibeui-testimonials-021-sea)}
[data-vibeui-block="testimonials-021"] [data-part="card"][data-fresh="true"] [data-part="post"] text{fill:var(--vibeui-testimonials-021-sea)}
@container (min-width:56rem){
[data-vibeui-block="testimonials-021"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="testimonials-021"] [data-part="grid"]{grid-template-columns:minmax(16rem,.8fr) minmax(0,1.7fr);gap:3rem;align-items:start}
[data-vibeui-block="testimonials-021"] [data-part="aside"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-021"] *{animation:none!important;transition:none!important}}`

/** Открытки от гостей: стена открыток оборотной стороной с марками и штемпелями, форма «отправить открытку» кладёт новую первой. */
export function Testimonials021({
  eyebrow = "Открытки",
  title = "Напишите нам открытку",
  lede = "Настоящие мы соберём на пляже. Но эта стена уже работает — и её увидят все, кто летит.",
  cards = [
    { name: "Оля и Саша", from: "Москва", text: "Билеты куплены, шляпы тоже. Ждём вас на пирсе — только не опаздывайте на собственную свадьбу." },
    { name: "Бабушка Вера", from: "Казань", text: "Тимур, я лечу первый раз за океан. Соня, я лечу ради тебя. Купите мне ром." },
    { name: "Дима", from: "Берлин", text: "Прилетаю через Стамбул, как вы тогда. Если застряну на сутки — вы знаете, чья это вина." },
    { name: "Мариэла", from: "Гавана", text: "Всё готово, море тёплое, группа репетирует. ¡Hasta la boda!" },
    { name: "Кристина", from: "Питер", text: "Отпуск согласован, загар запланирован. Песню уже выбрала — Chan Chan, конечно." },
  ],
  formTitle = "Отправить открытку",
  nameLabel = "Кто пишет",
  fromLabel = "Откуда",
  textLabel = "Текст открытки",
  submitLabel = "Отправить",
  sentLabel = "отправлено",
  action,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials021Props) {
  const [added, setAdded] = useState<Testimonials021Card[]>([])
  const [name, setName] = useState("")
  const [from, setFrom] = useState("")
  const [text, setText] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-testimonials-021-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-021-bg": background } : null),
    ...style,
  } as CSSProperties

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!name.trim() || !text.trim()) {
      event.preventDefault()
      return
    }
    if (!action) event.preventDefault()
    setAdded((current) => [{ name: name.trim(), from: from.trim() || sentLabel, text: text.trim() }, ...current])
    setName("")
    setFrom("")
    setText("")
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div data-part="aside">
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              <form data-part="form" method="post" action={action} onSubmit={submit}>
                <h3>{formTitle}</h3>
                <div data-part="row">
                  <label>
                    <span>{nameLabel}</span>
                    <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                  </label>
                  <label>
                    <span>{fromLabel}</span>
                    <input type="text" name="from" value={from} onChange={(event) => setFrom(event.target.value)} placeholder="Москва" />
                  </label>
                </div>
                <label>
                  <span>{textLabel}</span>
                  <textarea name="text" value={text} onChange={(event) => setText(event.target.value)} required />
                </label>
                <button type="submit" data-part="submit">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                  </svg>
                  {submitLabel}
                </button>
              </form>
            </div>
            <ul data-part="wall" aria-live="polite">
              {[...added, ...cards].map((card, index) => (
                <li key={`${card.name}-${index}`}>
                  <article data-part="card" data-fresh={index < added.length ? "true" : undefined}>
                    <p>{card.text}</p>
                    <span data-part="side">
                      <span data-part="stampmark" aria-hidden="true" />
                      <span data-part="post" aria-hidden="true">
                        <svg viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r="27" />
                          <text x="30" y="33">
                            {index < added.length ? sentLabel : (card.from ?? "").slice(0, 10)}
                          </text>
                        </svg>
                      </span>
                      <i />
                      <i />
                      <b>{card.name}</b>
                    </span>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
