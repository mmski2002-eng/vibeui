"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Testimonials022Note = {
  name: string
  text: string
}

export type Testimonials022Props = {
  eyebrow?: string
  title?: string
  lede?: string
  notes?: readonly Testimonials022Note[]
  formTitle?: string
  nameLabel?: string
  textLabel?: string
  submitLabel?: string
  /** Куда отправлять форму; пусто — записка остаётся на стекле до перезагрузки. */
  action?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Пожелания как записки на запотевшем окне: стена — стекло с инеем и
// каплями, каждая записка — полупрозрачная «протёртая» область с
// рукописным текстом, подпись — пальцем. Форма «написать на стекле» слева;
// новая записка проявляется, как будто её протирают ладонью (маска
// раскрывается по кругу). Без action живёт до перезагрузки.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-022"]){
--vibeui-testimonials-022-bg:light-dark(#e9e3d8,#0b1220);
--vibeui-testimonials-022-glass:light-dark(#d6dde6,#1c2740);
--vibeui-testimonials-022-card:light-dark(#ffffff,#131c2e);
--vibeui-testimonials-022-fg:light-dark(#1c2740,#f2eee6);
--vibeui-testimonials-022-muted:light-dark(#5b6880,#9fb0c8);
--vibeui-testimonials-022-line:light-dark(rgb(28 39 64 / .16),rgb(159 176 200 / .24));
--vibeui-testimonials-022-accent:#f2b64f;
--vibeui-testimonials-022-silver:#9fb0c8;
--vibeui-testimonials-022-on-accent:#0b1220;
--vibeui-testimonials-022-display:"Cormorant Garamond",Georgia,serif;
--vibeui-testimonials-022-script:"Marck Script","Segoe Script",cursive;
--vibeui-testimonials-022-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-022"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-022"]{box-sizing:border-box;display:block;background:var(--vibeui-testimonials-022-bg);color:var(--vibeui-testimonials-022-fg);font-family:var(--vibeui-testimonials-022-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-022"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-022"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="testimonials-022"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="testimonials-022"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-testimonials-022-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-testimonials-022-silver)}
[data-vibeui-block="testimonials-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-022-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="testimonials-022"] [data-part="lede"]{max-width:30rem;margin:1rem 0 0;color:var(--vibeui-testimonials-022-muted)}
[data-vibeui-block="testimonials-022"] [data-part="form"]{display:grid;gap:.9rem;margin-top:1.6rem;padding:1.4rem;border:1px solid var(--vibeui-testimonials-022-line);border-radius:1rem;background:var(--vibeui-testimonials-022-card)}
[data-vibeui-block="testimonials-022"] [data-part="form"] h3{margin:0 0 .2rem;font-family:var(--vibeui-testimonials-022-display);font-size:1.5rem;font-weight:500}
[data-vibeui-block="testimonials-022"] label{display:grid;gap:.35rem}
[data-vibeui-block="testimonials-022"] label span{font-family:var(--vibeui-testimonials-022-display);font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-testimonials-022-muted)}
[data-vibeui-block="testimonials-022"] input,[data-vibeui-block="testimonials-022"] textarea{width:100%;padding:.7rem .9rem;border:1px solid var(--vibeui-testimonials-022-line);border-radius:.6rem;background:rgb(11 18 32 / .25);color:inherit;font-family:var(--vibeui-testimonials-022-script);font-size:1.2rem;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="testimonials-022"] input:focus,[data-vibeui-block="testimonials-022"] textarea:focus{outline:none;border-color:var(--vibeui-testimonials-022-accent);box-shadow:0 0 0 3px rgb(242 182 79 / .18)}
[data-vibeui-block="testimonials-022"] textarea{min-height:6rem;resize:vertical}
[data-vibeui-block="testimonials-022"] [data-part="submit"]{display:inline-flex;align-items:center;gap:.5rem;justify-self:start;height:2.9rem;padding:0 1.3rem;border:0;border-radius:999px;background:var(--vibeui-testimonials-022-accent);color:var(--vibeui-testimonials-022-on-accent);font-family:var(--vibeui-testimonials-022-display);font-size:1.02rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;box-shadow:0 0 26px -6px var(--vibeui-testimonials-022-accent);transition:transform .2s}
[data-vibeui-block="testimonials-022"] [data-part="submit"]:hover{transform:translateY(-1px)}
[data-vibeui-block="testimonials-022"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-testimonials-022-fg);outline-offset:3px}
[data-vibeui-block="testimonials-022"] [data-part="submit"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="testimonials-022"] [data-part="window"]{position:relative;padding:1rem;border:1px solid var(--vibeui-testimonials-022-line);border-radius:1rem;background:radial-gradient(60% 50% at 30% 20%,rgb(242 238 230 / .14),transparent 70%),radial-gradient(50% 45% at 80% 90%,rgb(242 238 230 / .1),transparent 70%),var(--vibeui-testimonials-022-glass);overflow:hidden;box-shadow:inset 0 0 0 1px rgb(242 238 230 / .06),inset 0 0 80px rgb(159 176 200 / .12)}
[data-vibeui-block="testimonials-022"] [data-part="window"]::before{content:"";position:absolute;inset:0;background-image:radial-gradient(3px 4px at 12% 18%,rgb(242 238 230 / .35) 50%,transparent 51%),radial-gradient(2px 3px at 70% 8%,rgb(242 238 230 / .3) 50%,transparent 51%),radial-gradient(4px 6px at 88% 44%,rgb(242 238 230 / .28) 50%,transparent 51%),radial-gradient(2px 3px at 40% 70%,rgb(242 238 230 / .3) 50%,transparent 51%),radial-gradient(3px 5px at 22% 92%,rgb(242 238 230 / .3) 50%,transparent 51%),radial-gradient(2px 2px at 58% 36%,rgb(242 238 230 / .35) 50%,transparent 51%);pointer-events:none}
[data-vibeui-block="testimonials-022"] [data-part="wall"]{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-022"] [data-part="note"]{position:relative;display:grid;gap:.6rem;padding:1.2rem 1.3rem 1rem;border-radius:1.2rem 1.6rem 1.3rem 1.8rem;background:rgb(242 238 230 / .07);border:1px solid rgb(242 238 230 / .12);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);transform:rotate(-.6deg);transition:transform .4s cubic-bezier(.2,.9,.3,1),background .4s}
[data-vibeui-block="testimonials-022"] li:nth-child(3n) [data-part="note"]{transform:rotate(.8deg)}
[data-vibeui-block="testimonials-022"] li:nth-child(4n+1) [data-part="note"]{transform:rotate(.3deg)}
[data-vibeui-block="testimonials-022"] [data-part="note"]:hover{transform:rotate(0) translateY(-.2rem);background:rgb(242 238 230 / .12)}
[data-vibeui-block="testimonials-022"] [data-part="note"][data-fresh="true"]{animation:vibeui-testimonials-022-wipe 1.4s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-testimonials-022-wipe{from{clip-path:circle(0 at 20% 30%);opacity:.4}to{clip-path:circle(140% at 20% 30%);opacity:1}}
[data-vibeui-block="testimonials-022"] [data-part="note"] p{margin:0;font-family:var(--vibeui-testimonials-022-script);font-size:1.3rem;line-height:1.3;color:var(--vibeui-testimonials-022-fg);text-shadow:0 0 12px rgb(242 238 230 / .25)}
[data-vibeui-block="testimonials-022"] [data-part="note"] b{justify-self:end;font-family:var(--vibeui-testimonials-022-script);font-size:1.1rem;font-weight:400;color:var(--vibeui-testimonials-022-accent)}
[data-vibeui-block="testimonials-022"] [data-part="note"] svg{position:absolute;right:1rem;top:.9rem;width:.9rem;height:.9rem;fill:none;stroke:rgb(242 238 230 / .35);stroke-width:1.2;stroke-linecap:round}
@container (min-width:56rem){
[data-vibeui-block="testimonials-022"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="testimonials-022"] [data-part="grid"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.7fr);gap:3rem;align-items:start}
[data-vibeui-block="testimonials-022"] [data-part="aside"]{position:sticky;top:6rem}
[data-vibeui-block="testimonials-022"] [data-part="window"]{padding:1.4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-022"] *{animation:none!important;transition:none!important}}`

/** Пожелания как записки на запотевшем окне: стекло с каплями, полупрозрачные записки, новая проявляется как протёртая ладонью. */
export function Testimonials022({
  eyebrow = "Пожелания",
  title = "Напишите на стекле",
  lede = "Окно в гостиной запотеет к вечеру — там и напишете по-настоящему. А пока — здесь: увидят все, кто приедет.",
  notes = [
    { name: "Оля и Саша", text: "Тёплые ботинки куплены, песню заказали. Дима, не урони кольцо в снег." },
    { name: "Бабушка Вера", text: "Лера, шаль возьму свою. Дима, дрова колоть умеешь? Проверю." },
    { name: "Кристина", text: "Четыре зимы — и ни одной без вас. Пусть пятая будет самой тёплой." },
    { name: "Игорь", text: "Фейерверк будет. Остальное — как получится. Шучу. Люблю вас." },
    { name: "Марина", text: "Свечи привезли, камин проверили, снег заказали. ❄" },
  ],
  formTitle = "Написать на стекле",
  nameLabel = "Кто пишет",
  textLabel = "Пожелание",
  submitLabel = "Написать",
  action,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials022Props) {
  const [added, setAdded] = useState<Testimonials022Note[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const palette = {
    ...(accent ? { "--vibeui-testimonials-022-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-022-bg": background } : null),
    ...style,
  } as CSSProperties

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!name.trim() || !text.trim()) {
      event.preventDefault()
      return
    }
    if (!action) event.preventDefault()
    setAdded((current) => [{ name: name.trim(), text: text.trim() }, ...current])
    setName("")
    setText("")
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-022" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20l4-1 11-11-3-3L5 16zM13 8l3 3" />
                  </svg>
                  {submitLabel}
                </button>
              </form>
            </div>
            <div data-part="window">
              <ul data-part="wall" aria-live="polite">
                {[...added, ...notes].map((note, index) => (
                  <li key={`${note.name}-${index}`}>
                    <article data-part="note" data-fresh={index < added.length ? "true" : undefined}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />
                      </svg>
                      <p>{note.text}</p>
                      <b>— {note.name}</b>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
