"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Testimonials020Wish = {
  name: string
  text: string
  /** Подпись под именем: «подруга невесты». */
  note?: string
}

export type Testimonials020Props = {
  eyebrow?: string
  title?: string
  lede?: string
  wishes?: readonly Testimonials020Wish[]
  formTitle?: string
  nameLabel?: string
  textLabel?: string
  submitLabel?: string
  /** Подпись новой записки: «только что». */
  freshNote?: string
  /** Куда уходит пожелание POST'ом. Пусто — записка просто появляется на доске. */
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Стена пожеланий: кремовые записки на пробковой доске, каждая под своим
// углом, с латунной кнопкой сверху и рукописным serif'ом. Слева форма
// «оставить пожелание»: новая записка прикалывается первой с анимацией.
// Без action записка живёт до перезагрузки — это витрина, не бэкенд.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-020"]){
--vibeui-testimonials-020-bg:light-dark(#fffaf3,#1d1620);
--vibeui-testimonials-020-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-testimonials-020-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-testimonials-020-line:light-dark(#e2d8ca,#372b31);
--vibeui-testimonials-020-board:light-dark(#e6d5bd,#2a2230);
--vibeui-testimonials-020-note:light-dark(#fffdf8,#3a2f40);
--vibeui-testimonials-020-field:light-dark(#ffffff,#241c28);
--vibeui-testimonials-020-accent:#b8552f;
--vibeui-testimonials-020-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-testimonials-020-brass:#c9a35a;
--vibeui-testimonials-020-on-accent:#fff7ef;
--vibeui-testimonials-020-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-testimonials-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-020"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-020"]{box-sizing:border-box;display:block;background:var(--vibeui-testimonials-020-bg);color:var(--vibeui-testimonials-020-fg);font-family:var(--vibeui-testimonials-020-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-020"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-020"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="testimonials-020"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="testimonials-020"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-testimonials-020-accent)}
[data-vibeui-block="testimonials-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-020-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-testimonials-020-plum);text-wrap:balance}
[data-vibeui-block="testimonials-020"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-testimonials-020-muted)}
[data-vibeui-block="testimonials-020"] [data-part="form"]{margin-top:1.5rem;padding:1.4rem;border:1px solid var(--vibeui-testimonials-020-line);border-radius:1.2rem}
[data-vibeui-block="testimonials-020"] [data-part="form"] h3{margin:0 0 .9rem;font-family:var(--vibeui-testimonials-020-display);font-size:1.4rem;font-weight:500;color:var(--vibeui-testimonials-020-plum)}
[data-vibeui-block="testimonials-020"] label{display:block;margin-bottom:.9rem}
[data-vibeui-block="testimonials-020"] label span{display:block;margin-bottom:.3rem;font-size:.76rem;font-weight:600;letter-spacing:.04em;color:var(--vibeui-testimonials-020-muted)}
[data-vibeui-block="testimonials-020"] input,[data-vibeui-block="testimonials-020"] textarea{width:100%;padding:.7rem .9rem;border:1px solid var(--vibeui-testimonials-020-line);border-radius:.8rem;background:var(--vibeui-testimonials-020-field);color:inherit;font:inherit;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="testimonials-020"] textarea{min-height:6rem;resize:vertical;font-family:var(--vibeui-testimonials-020-display);font-size:1.15rem}
[data-vibeui-block="testimonials-020"] input:focus,[data-vibeui-block="testimonials-020"] textarea:focus{outline:none;border-color:var(--vibeui-testimonials-020-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-testimonials-020-accent) 18%,transparent)}
[data-vibeui-block="testimonials-020"] [data-part="submit"]{display:inline-flex;align-items:center;height:2.8rem;padding:0 1.3rem;border:0;border-radius:999px;background:var(--vibeui-testimonials-020-accent);color:var(--vibeui-testimonials-020-on-accent);font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;transition:transform .2s,background .25s}
[data-vibeui-block="testimonials-020"] [data-part="submit"]:hover{transform:translateY(-1px);background:color-mix(in oklab,var(--vibeui-testimonials-020-accent) 88%,#000)}
[data-vibeui-block="testimonials-020"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-testimonials-020-accent);outline-offset:3px}
[data-vibeui-block="testimonials-020"] [data-part="board"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(12rem,1fr));align-content:start;gap:1.6rem 1.2rem;margin:0;padding:1.75rem 1.5rem;list-style:none;border-radius:1.4rem;background:var(--vibeui-testimonials-020-board);box-shadow:inset 0 0 0 .6rem color-mix(in oklab,var(--vibeui-testimonials-020-board) 80%,#000),inset 0 30px 60px -30px rgb(43 26 36 / .3)}
[data-vibeui-block="testimonials-020"] [data-part="note"]{position:relative;padding:1.6rem 1rem 1rem;background:var(--vibeui-testimonials-020-note);box-shadow:0 14px 24px -16px rgb(43 26 36 / .7);transform:rotate(var(--vibeui-testimonials-020-tilt,0deg));transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+1) [data-part="note"]{--vibeui-testimonials-020-tilt:-2.4deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+2) [data-part="note"]{--vibeui-testimonials-020-tilt:1.8deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+3) [data-part="note"]{--vibeui-testimonials-020-tilt:-.8deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n) [data-part="note"]{--vibeui-testimonials-020-tilt:2.6deg}
[data-vibeui-block="testimonials-020"] [data-part="note"]:hover{transform:rotate(0) scale(1.03);box-shadow:0 22px 34px -18px rgb(43 26 36 / .7);z-index:1}
[data-vibeui-block="testimonials-020"] [data-part="note"][data-fresh="true"]{animation:vibeui-testimonials-020-pin .6s cubic-bezier(.2,.9,.3,1.3) both}
@keyframes vibeui-testimonials-020-pin{from{opacity:0;transform:rotate(var(--vibeui-testimonials-020-tilt,0deg)) scale(1.3) translateY(-1rem)}}
[data-vibeui-block="testimonials-020"] [data-part="pin"]{position:absolute;top:-.45rem;left:50%;width:.95rem;height:.95rem;margin-left:-.475rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f2dca6,var(--vibeui-testimonials-020-brass) 55%,#8a6a2a);box-shadow:0 3px 6px -2px rgb(0 0 0 / .5)}
[data-vibeui-block="testimonials-020"] [data-part="note"] p{margin:0;font-family:var(--vibeui-testimonials-020-display);font-size:1.15rem;line-height:1.35;color:var(--vibeui-testimonials-020-fg)}
[data-vibeui-block="testimonials-020"] [data-part="note"] footer{margin-top:.8rem;font-size:.78rem;color:var(--vibeui-testimonials-020-muted)}
[data-vibeui-block="testimonials-020"] [data-part="note"] footer b{display:block;font-weight:600;color:var(--vibeui-testimonials-020-accent)}
@container (min-width:56rem){
[data-vibeui-block="testimonials-020"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="testimonials-020"] [data-part="grid"]{grid-template-columns:minmax(16rem,.8fr) minmax(0,1.6fr);gap:3rem;align-items:stretch}
[data-vibeui-block="testimonials-020"] [data-part="aside"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-020"] *{animation:none!important;transition:none!important}}`

/** Стена пожеланий на пробковой доске: записки под углом с латунными кнопками и форма «оставить пожелание». */
export function Testimonials020({
  eyebrow = "Пожелания",
  title = "Доска у входа — уже здесь",
  lede = "На свадьбе будет настоящая, с бумагой и булавками. Но можно начать сейчас: записка появится на доске сразу.",
  wishes = [
    { name: "Ксения", note: "свидетельница", text: "Наконец-то! Я знала это с первого кофе. Люблю вас обоих, готовьте танцпол." },
    { name: "Бабушка Нина", text: "Артём, береги её. Василиса, корми его. Остальное приложится." },
    { name: "Даниил", note: "брат", text: "Брат, ты выбрал лучшую. Трансфер за мной, тосты — за тобой." },
    { name: "Маша и Егор", text: "Ждём пятое сентября больше, чем свой отпуск. Везём вам саженец." },
    { name: "Полина", note: "организатор", text: "Всё будет вовремя. Даже дождь — по расписанию." },
    { name: "Тётя Лена", text: "Плачу уже сейчас. Артём, ты обещал научить меня танцевать — помню." },
  ],
  formTitle = "Оставить пожелание",
  nameLabel = "Как вас подписать",
  textLabel = "Пожелание",
  submitLabel = "Приколоть на доску",
  freshNote = "только что",
  action,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials020Props) {
  const [added, setAdded] = useState<Testimonials020Wish[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-testimonials-020-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-020-bg": background } : null),
    ...style,
  } as CSSProperties

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!name.trim() || !text.trim()) {
      event.preventDefault()
      return
    }
    if (!action) event.preventDefault()
    setAdded((current) => [{ name: name.trim(), text: text.trim(), note: freshNote }, ...current])
    setName("")
    setText("")
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div data-part="aside">
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              <form data-part="form" method="post" action={action} onSubmit={submit}>
                <h3>{formTitle}</h3>
                <label>
                  <span>{nameLabel}</span>
                  <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                </label>
                <label>
                  <span>{textLabel}</span>
                  <textarea name="text" value={text} onChange={(event) => setText(event.target.value)} required />
                </label>
                <button type="submit" data-part="submit">
                  {submitLabel}
                </button>
              </form>
            </div>
            <ul data-part="board" aria-live="polite">
              {[...added, ...wishes].map((wish, index) => (
                <li key={`${wish.name}-${index}`}>
                  <article data-part="note" data-fresh={index < added.length ? "true" : undefined}>
                    <span data-part="pin" aria-hidden="true" />
                    <p>{wish.text}</p>
                    <footer>
                      <b>{wish.name}</b>
                      {wish.note}
                    </footer>
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
