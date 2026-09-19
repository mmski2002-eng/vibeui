"use client"

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react"

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

// Письмо после каждого выпуска: одно поле с плавающим ярлыком и магнитная
// кнопка на «конверте» с плакатным заголовком, слева — что внутри письма
// (три строки с маркером), внизу обещание частоты. Кнопка на фокусе поля
// подсвечивается волной (box-shadow pulse); после отправки конверт
// «запечатывается» — форма переворачивается в подтверждение, где
// прорисовывается svg-галочка. Заголовок въезжает словами через маски,
// строки и форма проявляются каскадом по IntersectionObserver; в углу
// конверта дышит пятно акцента.
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
--vibeui-subscribe-008-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-008"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="subscribe-008"]{box-sizing:border-box;padding:6rem 0;background:var(--vibeui-subscribe-008-bg);color:var(--vibeui-subscribe-008-fg);font-family:var(--vibeui-subscribe-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="subscribe-008"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="subscribe-008"] [data-part="card"]{position:relative;display:grid;gap:2rem;padding:2.5rem 1.5rem;border-radius:1.6rem;background:var(--vibeui-subscribe-008-panel);box-shadow:0 0 0 1px var(--vibeui-subscribe-008-line),0 40px 80px -50px rgb(0 0 0 / .8);overflow:hidden;perspective:1200px;animation:vibeui-subscribe-008-up 1s var(--vibeui-subscribe-008-ease) both paused}
[data-vibeui-block="subscribe-008"] [data-part="card"]::before{content:"";position:absolute;right:-6rem;top:-6rem;width:20rem;height:20rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-subscribe-008-accent) 28%,transparent),transparent 65%);filter:blur(20px);pointer-events:none;animation:vibeui-subscribe-008-breathe 6s ease-in-out infinite}
[data-vibeui-block="subscribe-008"] [data-part="card"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,transparent 40%,rgb(255 255 255 / .05) 50%,transparent 60%);pointer-events:none}
[data-vibeui-block="subscribe-008"] [data-part="card"] > :not([data-part="done"]){position:relative;z-index:1}
[data-vibeui-block="subscribe-008"] [data-part="eyebrow"]{margin:0 0 .9rem;font-family:var(--vibeui-subscribe-008-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-subscribe-008-accent);animation:vibeui-subscribe-008-up .7s var(--vibeui-subscribe-008-ease) .2s both paused}
[data-vibeui-block="subscribe-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-008-display);font-weight:800;font-size:clamp(3.4rem,9cqi,7rem);line-height:.88;letter-spacing:-.015em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="subscribe-008"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .08em .12em 0;margin:-.04em 0 -.12em 0}
[data-vibeui-block="subscribe-008"] [data-part="w"] i{display:inline-block;font-style:normal;animation:vibeui-subscribe-008-word .9s var(--vibeui-subscribe-008-ease) both paused;animation-delay:calc(.2s + var(--vibeui-subscribe-008-i) * 80ms)}
[data-vibeui-block="subscribe-008"] [data-part="lede"]{margin:1.2rem 0 0;color:var(--vibeui-subscribe-008-muted);max-width:30rem;animation:vibeui-subscribe-008-up .8s var(--vibeui-subscribe-008-ease) .5s both paused}
[data-vibeui-block="subscribe-008"] [data-part="inside"]{margin:1.4rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.92rem}
[data-vibeui-block="subscribe-008"] [data-part="inside"] li{display:flex;gap:.6rem;align-items:baseline;animation:vibeui-subscribe-008-up .7s var(--vibeui-subscribe-008-ease) both paused;animation-delay:calc(.6s + var(--vibeui-subscribe-008-i) * 100ms)}
[data-vibeui-block="subscribe-008"] [data-part="inside"] li::before{content:"→";color:var(--vibeui-subscribe-008-accent);font-family:var(--vibeui-subscribe-008-mono);transition:translate .3s var(--vibeui-subscribe-008-ease)}
[data-vibeui-block="subscribe-008"] [data-part="inside"] li:hover::before{translate:4px 0}
[data-vibeui-block="subscribe-008"] form{position:relative;display:grid;gap:.8rem;align-self:center;transition:transform .6s var(--vibeui-subscribe-008-ease),opacity .3s;transform-style:preserve-3d;animation:vibeui-subscribe-008-up .9s var(--vibeui-subscribe-008-ease) .5s both paused}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] form{transform:rotateX(90deg);opacity:0;pointer-events:none}
[data-vibeui-block="subscribe-008"] [data-part="field"]{position:relative}
[data-vibeui-block="subscribe-008"] input{width:100%;font:inherit;font-size:1rem;padding:1.35rem 1.1rem .65rem;border-radius:1rem;border:1px solid var(--vibeui-subscribe-008-line);background:var(--vibeui-subscribe-008-bg);color:inherit;transition:border-color .25s,box-shadow .25s}
[data-vibeui-block="subscribe-008"] input::placeholder{color:transparent}
[data-vibeui-block="subscribe-008"] input:hover{border-color:color-mix(in oklab,var(--vibeui-subscribe-008-fg) 30%,transparent)}
[data-vibeui-block="subscribe-008"] input:focus-visible{outline:none;border-color:var(--vibeui-subscribe-008-accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-subscribe-008-accent) 25%,transparent)}
[data-vibeui-block="subscribe-008"] [data-part="field"] label{position:absolute;left:1.1rem;top:50%;translate:0 -50%;color:var(--vibeui-subscribe-008-muted);pointer-events:none;transition:translate .25s var(--vibeui-subscribe-008-ease),scale .25s var(--vibeui-subscribe-008-ease),color .25s;transform-origin:left center}
[data-vibeui-block="subscribe-008"] input:focus-visible + label,[data-vibeui-block="subscribe-008"] input:not(:placeholder-shown) + label{translate:0 -1.35rem;scale:.72;color:var(--vibeui-subscribe-008-accent);font-family:var(--vibeui-subscribe-008-mono);letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="subscribe-008"] [data-part="submit"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;border:0;border-radius:1rem;padding:1rem 1.4rem;font:inherit;font-weight:600;cursor:pointer;color:var(--vibeui-subscribe-008-on-accent);background:var(--vibeui-subscribe-008-accent);translate:var(--vibeui-subscribe-008-mx,0) var(--vibeui-subscribe-008-my,0);transition:translate .3s var(--vibeui-subscribe-008-ease),scale .3s var(--vibeui-subscribe-008-ease),box-shadow .3s}
[data-vibeui-block="subscribe-008"] form:focus-within [data-part="submit"]{box-shadow:0 0 0 8px color-mix(in oklab,var(--vibeui-subscribe-008-accent) 18%,transparent),0 16px 40px -16px var(--vibeui-subscribe-008-accent)}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:hover{scale:1.03;box-shadow:0 16px 40px -16px var(--vibeui-subscribe-008-accent)}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:active{scale:.98}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-subscribe-008-accent);outline-offset:3px}
[data-vibeui-block="subscribe-008"] [data-part="submit"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;transition:translate .3s var(--vibeui-subscribe-008-ease)}
[data-vibeui-block="subscribe-008"] [data-part="submit"]:hover svg{translate:4px 0}
[data-vibeui-block="subscribe-008"] [data-part="promise"]{margin:0;font-family:var(--vibeui-subscribe-008-mono);font-size:.72rem;letter-spacing:.08em;color:var(--vibeui-subscribe-008-muted)}
[data-vibeui-block="subscribe-008"] [data-part="done"]{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:.6rem;text-align:center;padding:2rem;opacity:0;transform:rotateX(-90deg);transition:transform .6s var(--vibeui-subscribe-008-ease) .25s,opacity .3s .25s;pointer-events:none}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] [data-part="done"]{opacity:1;transform:none;pointer-events:auto}
[data-vibeui-block="subscribe-008"] [data-part="check"]{width:4.5rem;height:4.5rem;border-radius:50%;display:grid;place-items:center;background:color-mix(in oklab,var(--vibeui-subscribe-008-accent) 16%,transparent);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-subscribe-008-accent) 40%,transparent)}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] [data-part="check"]{animation:vibeui-subscribe-008-ping 1.2s ease-out .5s}
[data-vibeui-block="subscribe-008"] [data-part="check"] svg{width:2.4rem;height:2.4rem;fill:none;stroke:var(--vibeui-subscribe-008-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="subscribe-008"] [data-part="check"] path{stroke-dasharray:40;stroke-dashoffset:40}
[data-vibeui-block="subscribe-008"] [data-part="card"][data-sent="true"] [data-part="check"] path{animation:vibeui-subscribe-008-draw .6s var(--vibeui-subscribe-008-ease) .6s forwards}
[data-vibeui-block="subscribe-008"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-subscribe-008-display);font-weight:800;font-size:2.8rem;line-height:1;text-transform:uppercase;color:var(--vibeui-subscribe-008-accent)}
[data-vibeui-block="subscribe-008"] [data-part="done"] p{margin:0;color:var(--vibeui-subscribe-008-muted);max-width:26rem}
[data-vibeui-block="subscribe-008"][data-in="true"] [data-part="card"],[data-vibeui-block="subscribe-008"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="subscribe-008"][data-in="true"] [data-part="w"] i,[data-vibeui-block="subscribe-008"][data-in="true"] [data-part="lede"],[data-vibeui-block="subscribe-008"][data-in="true"] [data-part="inside"] li,[data-vibeui-block="subscribe-008"][data-in="true"] form{animation-play-state:running}
@keyframes vibeui-subscribe-008-word{from{translate:0 110%;rotate:3deg}}
@keyframes vibeui-subscribe-008-up{from{opacity:0;translate:0 1.6rem}}
@keyframes vibeui-subscribe-008-breathe{50%{translate:-2rem 2rem;scale:1.15}}
@keyframes vibeui-subscribe-008-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-subscribe-008-ping{to{box-shadow:0 0 0 1.6rem transparent}}
@container (min-width: 56rem){[data-vibeui-block="subscribe-008"] [data-part="card"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:4rem;padding:3.5rem 3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-008"] *,[data-vibeui-block="subscribe-008"] *::before{transition:none!important;animation:none!important}[data-vibeui-block="subscribe-008"] [data-part="check"] path{stroke-dashoffset:0}}`

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
  const [shown, setShown] = useState(false)
  const root = useRef<HTMLElement>(null)
  const fieldId = useId()
  const words = title.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const magnet = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)) * 6
    const dy = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)) * 5
    event.currentTarget.style.setProperty("--vibeui-subscribe-008-mx", `${dx.toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-subscribe-008-my", `${dy.toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--vibeui-subscribe-008-mx", "0px")
    event.currentTarget.style.setProperty("--vibeui-subscribe-008-my", "0px")
  }
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
      <section ref={root} data-vibeui-block="subscribe-008" data-tone={tone === "auto" ? undefined : tone} data-in={shown} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="card" data-sent={sent}>
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">
                {words.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <span data-part="w" style={{ ["--vibeui-subscribe-008-i" as string]: i }}>
                      <i>{word}</i>
                    </span>
                    {i < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {inside.length > 0 ? (
                <ul data-part="inside">
                  {inside.map((line, i) => (
                    <li key={line} style={{ ["--vibeui-subscribe-008-i" as string]: i }}>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <form onSubmit={submit}>
              <div data-part="field">
                <input id={fieldId} type="email" name="email" required placeholder={placeholder} />
                <label htmlFor={fieldId}>{placeholder}</label>
              </div>
              <button type="submit" data-part="submit" onPointerMove={magnet} onPointerLeave={unmagnet}>
                {submitLabel}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              {promise ? <p data-part="promise">{promise}</p> : null}
            </form>
            <div data-part="done" aria-live="polite">
              <span data-part="check" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 12.5l5.5 5.5L20 7" />
                </svg>
              </span>
              <h3>{doneTitle}</h3>
              <p>{doneText}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
