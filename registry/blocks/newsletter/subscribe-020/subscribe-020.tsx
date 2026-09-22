"use client"

import { useEffect, useState, type CSSProperties, type FormEvent } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Subscribe020Frequency = {
  /** Короткое имя: «Раз в неделю». */
  name: string
  /** Что обещаем: «Каждое воскресенье, короткое, на две минуты». */
  promise: string
}

export type Subscribe020Props = {
  eyebrow?: string
  title?: string
  lede?: string
  frequencies?: readonly Subscribe020Frequency[]
  placeholder?: string
  actionLabel?: string
  fine?: string
  doneTitle?: string
  doneText?: string
  /** Прошлое письмо в конверте. */
  letterDate?: string
  letterSubject?: string
  letterText?: readonly string[]
  letterHref?: string
  letterHrefLabel?: string
  /** aria частоты, конверта, буква на печати и подпись. */
  frequencyLabel?: string
  closeLabel?: string
  openLabel?: string
  sealLetter?: string
  caption?: string
  tone?: "auto" | "light" | "dark"
  /** Идти против сайта: ночью — бумага, днём — графит. Событие темы уважается, но переворачивается. */
  invert?: boolean
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Письма читателям: слева выбор частоты — два тумблера, подпись под ними
// меняет обещание («каждое воскресенье…» / «первого числа…»), одно поле
// почты и одна кнопка; после отправки — галочка, которую «прорисовывает»
// перо (stroke-dashoffset), и текст «письмо придёт». Справа — конверт с
// прошлым письмом: по наведению или нажатию клапан откидывается и лист
// выезжает из конверта, показывая дату, тему и первые абзацы. Форма ничего
// не отправляет — заглушка, обработчик подключается в проекте.
// Карман держит will-change: без своего слоя Chrome теряет его clip-path,
// пока письмо анимируется, и вырез на время подъёма закрывается.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="subscribe-020"]){
--vibeui-subscribe-020-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-subscribe-020-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-020-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-020-on-accent:oklch(from var(--vibeui-subscribe-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-020-muted:color-mix(in oklab,var(--vibeui-subscribe-020-fg) 60%,var(--vibeui-subscribe-020-bg));
--vibeui-subscribe-020-line:color-mix(in oklab,var(--vibeui-subscribe-020-fg) 14%,transparent);
--vibeui-subscribe-020-paper:color-mix(in oklab,var(--vibeui-subscribe-020-bg) 93%,var(--vibeui-subscribe-020-fg));
--vibeui-subscribe-020-envelope:color-mix(in oklab,var(--vibeui-subscribe-020-bg) 86%,var(--vibeui-subscribe-020-fg));
--vibeui-subscribe-020-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-subscribe-020-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-020"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-020"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="subscribe-020"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="subscribe-020"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="subscribe-020"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-subscribe-020-bg);color:var(--vibeui-subscribe-020-fg);font-family:var(--vibeui-subscribe-020-font);font-size:1.05rem;line-height:1.65;transition:background-color .6s,color .6s}
@supports (animation-timeline:view()){[data-vibeui-block="subscribe-020"] [data-part="shell"]{animation:vibeui-subscribe-020-reveal linear both;animation-timeline:view();animation-range:entry 0% entry 35%}}
@keyframes vibeui-subscribe-020-reveal{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="subscribe-020"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-020"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3.5rem;align-items:center}
@container (min-width:48rem){[data-vibeui-block="subscribe-020"] [data-part="shell"]{padding-block:2rem}}
@container (min-width:72rem){[data-vibeui-block="subscribe-020"] [data-part="shell"]{padding-block:3rem}}
[data-vibeui-block="subscribe-020"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-subscribe-020-accent)}
[data-vibeui-block="subscribe-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-020-display);font-weight:400;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.02em}
[data-vibeui-block="subscribe-020"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-subscribe-020-muted)}
[data-vibeui-block="subscribe-020"] [data-part="freq"]{display:inline-flex;flex-wrap:wrap;gap:.3rem;margin:1.8rem 0 0;padding:.3rem;border:1px solid var(--vibeui-subscribe-020-line);border-radius:999px}
[data-vibeui-block="subscribe-020"] [data-part="freq"] button{padding:.5rem 1rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-subscribe-020-muted);font:inherit;font-size:.92rem;font-style:italic;cursor:pointer;transition:background-color .3s,color .3s}
[data-vibeui-block="subscribe-020"] [data-part="freq"] button:hover{color:var(--vibeui-subscribe-020-fg)}
[data-vibeui-block="subscribe-020"] [data-part="freq"] button[aria-pressed="true"]{background:var(--vibeui-subscribe-020-fg);color:var(--vibeui-subscribe-020-bg)}
[data-vibeui-block="subscribe-020"] [data-part="freq"] button:focus-visible{outline:2px solid var(--vibeui-subscribe-020-accent);outline-offset:2px}
[data-vibeui-block="subscribe-020"] [data-part="promise"]{margin:.8rem 0 0;min-height:1.7em;font-style:italic;color:var(--vibeui-subscribe-020-muted);animation:vibeui-subscribe-020-swap .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="subscribe-020"] [data-part="form"]{display:grid;gap:.6rem;margin:1.4rem 0 0;max-width:30rem}
/* Поле — input-001, кнопка — button-001; в сетке формы им отдаются колонки. */
[data-vibeui-block="subscribe-020"] [data-part="form"] > [data-vibeui-block="input-001"]{min-width:0}
[data-vibeui-block="subscribe-020"] [data-part="fine"]{margin:.8rem 0 0;font-size:.8rem;font-style:italic;color:var(--vibeui-subscribe-020-muted)}
[data-vibeui-block="subscribe-020"] [data-part="done"]{display:flex;align-items:center;gap:1.2rem;margin:1.6rem 0 0;max-width:30rem}
[data-vibeui-block="subscribe-020"] [data-part="done"] svg{flex-shrink:0;width:3.6rem;height:3.6rem;color:var(--vibeui-subscribe-020-accent)}
[data-vibeui-block="subscribe-020"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-subscribe-020-draw 1s ease-out forwards}
[data-vibeui-block="subscribe-020"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-subscribe-020-draw .6s ease-out .6s forwards}
[data-vibeui-block="subscribe-020"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-subscribe-020-display);font-weight:400;font-size:1.6rem;line-height:1.1}
[data-vibeui-block="subscribe-020"] [data-part="done"] p{margin:.3rem 0 0;font-size:.92rem;color:var(--vibeui-subscribe-020-muted)}
[data-vibeui-block="subscribe-020"] [data-part="scene"]{display:grid;justify-items:center;gap:1rem;padding-top:9rem}
[data-vibeui-block="subscribe-020"] [data-part="envelope"]{position:relative;width:min(100%,26rem);aspect-ratio:3/2;border:0;padding:0;background:transparent;color:inherit;font:inherit;cursor:pointer;perspective:1000px;text-align:left;outline:none}
[data-vibeui-block="subscribe-020"] [data-part="envelope"]:focus-visible [data-part="pocket"]{outline:2px solid var(--vibeui-subscribe-020-accent);outline-offset:6px}
[data-vibeui-block="subscribe-020"] [data-part="back"],[data-vibeui-block="subscribe-020"] [data-part="pocket"],[data-vibeui-block="subscribe-020"] [data-part="flap"]{display:block}
[data-vibeui-block="subscribe-020"] [data-part="back"]{position:absolute;inset:0;border-radius:.4rem;background:var(--vibeui-subscribe-020-envelope);box-shadow:0 30px 60px -30px rgb(0 0 0 / .6)}
[data-vibeui-block="subscribe-020"] [data-part="flap"]{position:absolute;left:0;right:0;top:0;height:52%;border-radius:.4rem .4rem 0 0;background:color-mix(in oklab,var(--vibeui-subscribe-020-envelope) 80%,var(--vibeui-subscribe-020-fg));clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top;transform:rotateX(0);transition:transform .8s cubic-bezier(.3,.8,.2,1) .5s,z-index 0s .7s;z-index:3}
[data-vibeui-block="subscribe-020"] [data-part="seal"]{position:absolute;left:50%;top:52%;width:2.4rem;height:2.4rem;margin:-1.2rem 0 0 -1.2rem;border-radius:50%;background:var(--vibeui-subscribe-020-accent);color:var(--vibeui-subscribe-020-on-accent);display:grid;place-items:center;font-family:var(--vibeui-subscribe-020-display);font-size:1.2rem;z-index:4;transition:opacity .3s 1.1s,transform .5s 1.1s}
[data-vibeui-block="subscribe-020"] [data-part="letter"]{display:block;position:absolute;left:6%;right:6%;top:6%;bottom:4%;padding:1.2rem 1.3rem;border-radius:.3rem;background:linear-gradient(180deg,var(--vibeui-subscribe-020-paper) 50%,color-mix(in oklab,var(--vibeui-subscribe-020-paper) 78%,#000));color:var(--vibeui-subscribe-020-fg);box-shadow:0 10px 30px -14px rgb(0 0 0 / .5);overflow:hidden;transform:translateY(0);transition:transform .9s cubic-bezier(.2,.8,.2,1);z-index:1}
[data-vibeui-block="subscribe-020"] [data-part="letter"] small{display:block;font-size:.68rem;font-style:italic;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-subscribe-020-accent)}
[data-vibeui-block="subscribe-020"] [data-part="letter"] b{display:block;margin:.3rem 0 .5rem;font-family:var(--vibeui-subscribe-020-display);font-weight:400;font-size:1.35rem;line-height:1.1}
[data-vibeui-block="subscribe-020"] [data-part="line"]{display:block;margin:0 0 .5em;font-size:.8rem;line-height:1.5}
[data-vibeui-block="subscribe-020"] [data-part="pocket"]{position:absolute;inset:0;border-radius:.4rem;z-index:2;will-change:transform;background:var(--vibeui-subscribe-020-envelope);clip-path:polygon(0 0,50% 50%,100% 0,100% 100%,0 100%);box-shadow:inset 0 1px 0 rgb(255 255 255 / .12)}
[data-vibeui-block="subscribe-020"] [data-part="envelope"]:hover [data-part="flap"],[data-vibeui-block="subscribe-020"] [data-part="envelope"][aria-pressed="true"] [data-part="flap"]{transform:rotateX(-170deg);z-index:0;transition:transform .8s cubic-bezier(.3,.8,.2,1),z-index 0s .25s}
[data-vibeui-block="subscribe-020"] [data-part="envelope"]:hover [data-part="seal"],[data-vibeui-block="subscribe-020"] [data-part="envelope"][aria-pressed="true"] [data-part="seal"]{opacity:0;transform:scale(.4);transition:opacity .3s,transform .5s}
[data-vibeui-block="subscribe-020"] [data-part="envelope"]:hover [data-part="letter"],[data-vibeui-block="subscribe-020"] [data-part="envelope"][aria-pressed="true"] [data-part="letter"]{transform:translateY(-52%);transition:transform .9s cubic-bezier(.2,.8,.2,1) .3s}
[data-vibeui-block="subscribe-020"] [data-part="caption"]{margin:0;font-size:.8rem;font-style:italic;color:var(--vibeui-subscribe-020-muted);text-align:center}
[data-vibeui-block="subscribe-020"] [data-part="archive"]{position:relative;color:var(--vibeui-subscribe-020-fg);text-decoration:none;font-style:italic;font-size:.95rem;padding:.2rem 0}
[data-vibeui-block="subscribe-020"] [data-part="archive"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-subscribe-020-accent);transform:scaleX(.35);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="subscribe-020"] [data-part="archive"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="subscribe-020"] [data-part="archive"]:focus-visible{outline:2px solid var(--vibeui-subscribe-020-accent);outline-offset:3px}
@keyframes vibeui-subscribe-020-swap{from{opacity:0;transform:translateY(.3em)}}
@keyframes vibeui-subscribe-020-draw{to{stroke-dashoffset:0}}
@container (min-width: 36rem){[data-vibeui-block="subscribe-020"] [data-part="form"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}}
@container (min-width: 60rem){[data-vibeui-block="subscribe-020"] [data-part="shell"]{grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-020"] *{animation:none!important;transition:none!important}[data-vibeui-block="subscribe-020"] [data-part="done"] circle,[data-vibeui-block="subscribe-020"] [data-part="done"] path{stroke-dashoffset:0}}`

const DEFAULT_FREQUENCIES: Subscribe020Frequency[] = [
  { name: "Раз в неделю", promise: "Каждое воскресенье, короткое: одна мысль, одна книга, одна фотография с балкона." },
  { name: "Раз в месяц", promise: "Первого числа, длинное: новое эссе целиком, до того как оно выйдет где-то ещё." },
]

/** Письма читателям: частота, одно поле, конверт прошлого письма. */
export function Subscribe020({
  eyebrow = "Письма",
  title = "Письма читателям",
  lede = "Я пишу письма чаще, чем эссе. Они короче, теплее и не проходят редактуру. Подписывайтесь — и выберите, как часто.",
  frequencies = DEFAULT_FREQUENCIES,
  placeholder = "Ваша почта",
  actionLabel = "Получать письма",
  fine = "Без рекламы и без «горящих предложений». Отписаться — одной ссылкой внизу любого письма.",
  doneTitle = "Письмо уже в пути",
  doneText = "Первое придёт в ближайший срок — проверьте папку «Промоакции», почта иногда путает письма с рассылками.",
  letterDate = "7 сентября",
  letterSubject = "Про окно, которое не мыли с весны",
  letterText = [
    "Я заметила, что не мыла окно с апреля, только когда на нём проявился город: пыль легла ровно по силуэту домов напротив, будто негатив.",
    "И подумала — так работает память. Мы не храним события. Мы храним пыль, которая на них осела.",
  ],
  letterHref = "#archive",
  letterHrefLabel = "Архив писем →",
  frequencyLabel = "Как часто",
  closeLabel = "Закрыть конверт",
  openLabel = "Открыть прошлое письмо",
  sealLetter = "В",
  caption = "Прошлое письмо · наведите, чтобы открыть",
  tone = "auto",
  invert = false,
  accent,
  ink,
  background,
  className,
  style,
}: Subscribe020Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)
  const [open, setOpen] = useState(false)
  const frequency = frequencies[Math.min(active, frequencies.length - 1)]

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-subscribe-020-accent": accent } : null),
    ...(ink ? { "--vibeui-subscribe-020-fg": ink } : null),
    ...(background ? { "--vibeui-subscribe-020-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-subscribe-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="subscribe-020" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ? (invert ? (mode === "day" ? "night" : "day") : mode) : undefined} className={className} style={palette}>
        <div data-part="shell">
          <div aria-live="polite">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {done ? (
              <div data-part="done">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="32" cy="32" r="25" />
                  <path d="M21 33l8 8 14-16" />
                </svg>
                <div>
                  <h3>{doneTitle}</h3>
                  <p>
                    {frequency ? `${frequency.name.toLowerCase()}. ` : ""}
                    {doneText}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {frequencies.length > 1 ? (
                  <div data-part="freq" role="group" aria-label={frequencyLabel}>
                    {frequencies.map((item, i) => (
                      <button key={item.name} type="button" aria-pressed={i === active} onClick={() => setActive(i)}>
                        {item.name}
                      </button>
                    ))}
                  </div>
                ) : null}
                {frequency ? (
                  <p data-part="promise" key={frequency.name}>
                    {frequency.promise}
                  </p>
                ) : null}
                <form data-part="form" onSubmit={submit}>
                  <Input001 type="email" name="email" required label={placeholder} autoComplete="email" accent={accent} />
                  <Button001 type="submit" size="lg" accent={accent}>
                    {actionLabel}
                  </Button001>
                </form>
                {fine ? <p data-part="fine">{fine}</p> : null}
              </>
            )}
          </div>
          <div data-part="scene">
            <button data-part="envelope" type="button" aria-pressed={open} aria-label={open ? closeLabel : openLabel} onClick={() => setOpen((value) => !value)}>
              <i data-part="back" aria-hidden="true" />
              <span data-part="letter" aria-hidden={!open}>
                <small>{letterDate}</small>
                <b>{letterSubject}</b>
                {letterText.map((paragraph, i) => (
                  <span data-part="line" key={i}>
                    {paragraph}
                  </span>
                ))}
              </span>
              <i data-part="pocket" aria-hidden="true" />
              <i data-part="flap" aria-hidden="true" />
              <span data-part="seal" aria-hidden="true">
                {sealLetter}
              </span>
            </button>
            <p data-part="caption">{caption}</p>
            {letterHrefLabel ? (
              <a data-part="archive" href={letterHref}>
                {letterHrefLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
