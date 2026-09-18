"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Subscribe008Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  submitLabel?: string
  /** Обещание частоты: «раз в неделю, после выпуска». */
  promise?: string
  /** Строки «что внутри письма». */
  inside?: readonly string[]
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Письмо после каждого выпуска: одно поле и кнопка на «конверте» с
// плакатным заголовком, слева — что внутри письма (три строки с маркером),
// внизу обещание частоты. Кнопка на фокусе поля подсвечивается волной
// (box-shadow pulse); после отправки конверт «запечатывается» — карточка
// переворачивается в подтверждение.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="subscribe-008"]){
--vibeui-subscribe-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-subscribe-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-008-on-accent:oklch(from var(--vibeui-subscribe-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-008-muted:color-mix(in oklab,var(--vibeui-subscribe-008-fg) 60%,var(--vibeui-subscribe-008-bg));
--vibeui-subscribe-008-panel:color-mix(in oklab,var(--vibeui-subscribe-008-fg) 6%,var(--vibeui-subscribe-008-bg));
--vibeui-subscribe-008-line:color-mix(in oklab,var(--vibeui-subscribe-008-fg) 12%,transparent);
--vibeui-subscribe-008-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-subscribe-008-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-subscribe-008-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-008"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="subscribe-008"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-subscribe-008-bg);color:var(--vibeui-subscribe-008-fg);font-family:var(--vibeui-subscribe-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="subscribe-008"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="subscribe-008"] [data-part="card"]{position:relative;display:grid;gap:2rem;padding:2.5rem 1.5rem;border-radius:1.6rem;background:var(--vibeui-subscribe-008-panel);box-shadow:0 0 0 1px var(--vibeui-subscribe-008-line);overflow:hidden;perspective:1200px}
[data-vibeui-block="subscribe-008"] [data-part="card"]::before{content:"";position:absolute;right:-6rem;top:-6rem;width:18rem;height:18rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-subscribe-008-accent) 25%,transparent),transparent 65%);filter:blur(20px);pointer-events:none}
[data-vibeui-block="subscribe-008"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-subscribe-008-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-subscribe-008-accent)}
[data-vibeui-block="subscribe-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-008-display);font-weight:800;font-size:clamp(2.4rem,6cqi,4.6rem);line-height:.92;text-transform:uppercase}
[data-vibeui-block="subscribe-008"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-subscribe-008-muted);max-width:30rem}
[data-vibeui-block="subscribe-008"] [data-part="inside"]{margin:1.4rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.92rem}
[data-vibeui-block="subscribe-008"] [data-part="inside"] li{display:flex;gap:.6rem;align-items:baseline}
[data-vibeui-block="subscribe-008"] [data-part="inside"] li::before{content:"→";color:var(--vibeui-subscribe-008-accent);font-family:var(--vibeui-subscribe-008-mono)}
[data-vibeui-block="subscribe-008"] form{position:relative;display:grid;gap:.8rem;align-self:center;transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .3s;transform-style:preserve-3d}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] form{transform:rotateX(90deg);opacity:0;pointer-events:none}
[data-vibeui-block="subscribe-008"] input{width:100%;font:inherit;font-size:1rem;padding:1rem 1.1rem;border-radius:1rem;border:1px solid var(--vibeui-subscribe-008-line);background:var(--vibeui-subscribe-008-bg);color:inherit}
[data-vibeui-block="subscribe-008"] input:focus-visible{outline:2px solid var(--vibeui-subscribe-008-accent);outline-offset:2px}
[data-vibeui-block="subscribe-008"] [data-part="submit"]{display:inline-flex;justify-content:center;align-items:center;border:0;border-radius:1rem;padding:1rem 1.4rem;font:inherit;font-weight:600;cursor:pointer;color:var(--vibeui-subscribe-008-on-accent);background:var(--vibeui-subscribe-008-accent);transition:transform .18s,box-shadow .3s}
[data-vibeui-block="subscribe-008"] form:focus-within [data-part="submit"]{box-shadow:0 0 0 8px color-mix(in oklab,var(--vibeui-subscribe-008-accent) 18%,transparent)}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:hover{transform:translateY(-1px)}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-subscribe-008-accent);outline-offset:3px}
[data-vibeui-block="subscribe-008"] [data-part="promise"]{margin:0;font-family:var(--vibeui-subscribe-008-mono);font-size:.72rem;letter-spacing:.08em;color:var(--vibeui-subscribe-008-muted)}
[data-vibeui-block="subscribe-008"] [data-part="done"]{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:.5rem;text-align:center;padding:2rem;opacity:0;transform:rotateX(-90deg);transition:transform .6s cubic-bezier(.2,.8,.2,1) .25s,opacity .3s .25s;pointer-events:none}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] [data-part="done"]{opacity:1;transform:none;pointer-events:auto}
[data-vibeui-block="subscribe-008"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-subscribe-008-display);font-weight:800;font-size:2.6rem;line-height:1;text-transform:uppercase;color:var(--vibeui-subscribe-008-accent)}
[data-vibeui-block="subscribe-008"] [data-part="done"] p{margin:0;color:var(--vibeui-subscribe-008-muted);max-width:26rem}
@container (min-width: 56rem){[data-vibeui-block="subscribe-008"] [data-part="card"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:4rem;padding:3.5rem 3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-008"] *{transition:none!important}}`

/** Письмо после каждого выпуска: одно поле, «что внутри» и обещание частоты. */
export function Subscribe008({
  eyebrow = "Письмо",
  title = "После каждого выпуска — письмо",
  lede = "Не дайджест и не «новости студии». Одно письмо от ведущей: что осталось за кадром и что слушать дальше.",
  placeholder = "почта",
  submitLabel = "Получать",
  promise = "раз в неделю · после выпуска · отписка одним кликом",
  inside = ["три цитаты, которые не вошли в эфир", "ссылка на полную версию без монтажа", "вопрос гостю, на который вы можете ответить"],
  doneTitle = "Записали",
  doneText = "Первое письмо придёт в ближайший четверг, сразу после выпуска.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Subscribe008Props) {
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }
  const palette = {
    ...(accent ? { "--vibeui-subscribe-008-accent": accent } : null),
    ...(ink ? { "--vibeui-subscribe-008-fg": ink } : null),
    ...(background ? { "--vibeui-subscribe-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-subscribe-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="subscribe-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card" data-sent={sent}>
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {inside.length > 0 ? (
                <ul data-part="inside">
                  {inside.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <form onSubmit={submit}>
              <input type="email" name="email" required placeholder={placeholder} aria-label={placeholder} />
              <button type="submit" data-part="submit">
                {submitLabel}
              </button>
              {promise ? <p data-part="promise">{promise}</p> : null}
            </form>
            <div data-part="done" aria-live="polite">
              <h3>{doneTitle}</h3>
              <p>{doneText}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
