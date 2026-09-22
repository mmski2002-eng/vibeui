"use client"

import { useState, type CSSProperties, type FormEvent } from "react"
import { Card039 } from "@/registry/components/card/card-039/card-039"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Input034 } from "@/registry/components/input/input-034/input-034"

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
  ink?: string
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
--vibeui-testimonials-020-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-020-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-020-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-testimonials-020-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-testimonials-020-board:light-dark(#e6d5bd,#2a2a2a);
--vibeui-testimonials-020-note:light-dark(#fffdf8,#3a3a3a);
--vibeui-testimonials-020-field:light-dark(#ffffff,#242424);
--vibeui-testimonials-020-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-020-plum:var(--vibeui-testimonials-020-fg);
--vibeui-testimonials-020-brass:#c9a35a;
--vibeui-testimonials-020-on-accent:oklch(from var(--vibeui-testimonials-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
[data-vibeui-block="testimonials-020"] [data-part="form"]{display:grid;gap:.9rem;margin-top:1.5rem;padding:1.4rem;border:1px solid var(--vibeui-testimonials-020-line);border-radius:1.2rem}
[data-vibeui-block="testimonials-020"] [data-part="form"] h3{margin:0 0 .9rem;font-family:var(--vibeui-testimonials-020-display);font-size:1.4rem;font-weight:500;color:var(--vibeui-testimonials-020-plum)}
[data-vibeui-block="testimonials-020"] [data-part="board"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(12rem,1fr));align-content:start;gap:1.6rem 1.2rem;margin:0;padding:1.75rem 1.5rem;list-style:none;border-radius:1.4rem;background:var(--vibeui-testimonials-020-board);box-shadow:inset 0 0 0 .6rem color-mix(in oklab,var(--vibeui-testimonials-020-board) 80%,#000),inset 0 30px 60px -30px rgb(43 26 36 / .3)}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+1) [data-part="footnote"]{--vibeui-card-039-tilt:-2.4deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+2) [data-part="footnote"]{--vibeui-card-039-tilt:1.8deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n+3) [data-part="footnote"]{--vibeui-card-039-tilt:-.8deg}
[data-vibeui-block="testimonials-020"] [data-part="board"] li:nth-child(4n) [data-part="footnote"]{--vibeui-card-039-tilt:2.6deg}
@keyframes vibeui-testimonials-020-pin{from{opacity:0;transform:rotate(var(--vibeui-testimonials-020-tilt,0deg)) scale(1.3) translateY(-1rem)}}
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
  ink,
  background,
  className,
  style,
}: Testimonials020Props) {
  const [added, setAdded] = useState<Testimonials020Wish[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-testimonials-020-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-020-fg": ink } : null),
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
                <Input001
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  label={nameLabel}
                  accent={accent}
                />
                <Input034
                  name="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  required
                  label={textLabel}
                  accent={accent}
                />
                <Button001 type="submit" size="lg" accent={accent}>
                  {submitLabel}
                </Button001>
              </form>
            </div>
            <ul data-part="board" aria-live="polite">
              {[...added, ...wishes].map((wish, index) => (
                <li key={`${wish.name}-${index}`}>
                  <Card039 data-part="footnote" text={wish.text} name={wish.name} note={wish.note} index={index} data-fresh={index < added.length ? "true" : undefined} accent={accent} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
