"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type PointerEvent } from "react"

export type Contact021Link = {
  label: string
  href: string
  /** Ник или подпись справа: «@danya». */
  handle?: string
}

export type Contact021Props = {
  eyebrow?: string
  title?: string
  text?: string
  email?: string
  copyLabel?: string
  copiedLabel?: string
  /** Обещание: «отвечу в течение дня». */
  promise?: string
  city?: string
  timeZone?: string
  links?: readonly Contact021Link[]
  image?: string
  imageAlt?: string
  /** Подписи полей формы и кнопки. */
  nameLabel?: string
  emailLabel?: string
  messageLabel?: string
  submitLabel?: string
  /** Подпись над почтой: «или просто на почту». */
  orLabel?: string
  /** Состояние после отправки. */
  sentTitle?: string
  sentText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Напишите мне»: форма из трёх полей с плавающими ярлыками (ярлык уезжает
// вверх по фокусу и когда поле заполнено, чистый CSS через :placeholder-shown)
// и магнитной кнопкой, которая тянется к курсору; после отправки — заглушка с
// прорисовкой svg-галочки. Рядом: адрес почты копируется кликом, живые часы
// города с секундами (useSyncExternalStore, тик раз в секунду), обещание
// «отвечу в течение дня», соцсети и фото-«полароид». Заголовок и поля
// появляются каскадом при попадании в viewport.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-021"]){
--vibeui-contact-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-021-on-accent:oklch(from var(--vibeui-contact-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-021-muted:color-mix(in oklab,var(--vibeui-contact-021-fg) 60%,var(--vibeui-contact-021-bg));
--vibeui-contact-021-line:color-mix(in oklab,var(--vibeui-contact-021-fg) 12%,transparent);
--vibeui-contact-021-panel:color-mix(in oklab,var(--vibeui-contact-021-fg) 5%,var(--vibeui-contact-021-bg));
--vibeui-contact-021-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-021-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-contact-021-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-contact-021-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-021"]{color-scheme:dark}
:where([data-vibeui-block="contact-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="contact-021"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-contact-021-panel);color:var(--vibeui-contact-021-fg);font-family:var(--vibeui-contact-021-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="contact-021"] *{box-sizing:border-box}
[data-vibeui-block="contact-021"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:start}
[data-vibeui-block="contact-021"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-contact-021-mono);font-size:.78rem;color:var(--vibeui-contact-021-muted);opacity:0;transition:opacity .6s}
[data-vibeui-block="contact-021"][data-in="true"] [data-part="eyebrow"]{opacity:1}
[data-vibeui-block="contact-021"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-021-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.04em}
[data-vibeui-block="contact-021"] [data-part="word"]{display:inline-block;vertical-align:top;overflow:hidden;padding:.05em .05em .14em;margin:-.05em -.05em -.14em}
[data-vibeui-block="contact-021"] [data-part="word"] span{display:inline-block;transform:translateY(130%);transition:transform .9s var(--vibeui-contact-021-ease);transition-delay:calc(var(--vibeui-contact-021-i) * .06s)}
[data-vibeui-block="contact-021"][data-in="true"] [data-part="word"] span{transform:none}
[data-vibeui-block="contact-021"] :is([data-part="rise"],[data-rise]){opacity:0;transform:translateY(1.2rem);transition:opacity .8s var(--vibeui-contact-021-ease),transform .8s var(--vibeui-contact-021-ease);transition-delay:calc(.15s + var(--vibeui-contact-021-i,0) * .08s)}
[data-vibeui-block="contact-021"][data-in="true"] :is([data-part="rise"],[data-rise]){opacity:1;transform:none}
[data-vibeui-block="contact-021"] [data-part="text"]{display:block;margin:1rem 0 0;max-width:30rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="form"]{position:relative;display:grid;gap:1rem;margin-top:2rem;max-width:34rem}
[data-vibeui-block="contact-021"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="contact-021"] [data-part="field"] input,[data-vibeui-block="contact-021"] [data-part="field"] textarea{width:100%;padding:1.5rem 1.1rem .7rem;border-radius:.9rem;border:1px solid var(--vibeui-contact-021-line);background:var(--vibeui-contact-021-bg);color:inherit;font:inherit;font-size:1rem;line-height:1.4;outline:none;transition:border-color .25s,box-shadow .25s;resize:vertical}
[data-vibeui-block="contact-021"] [data-part="field"] textarea{min-height:8rem}
[data-vibeui-block="contact-021"] [data-part="field"] input:focus,[data-vibeui-block="contact-021"] [data-part="field"] textarea:focus{border-color:var(--vibeui-contact-021-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-contact-021-accent) 18%,transparent)}
[data-vibeui-block="contact-021"] [data-part="field"] span{position:absolute;left:1.1rem;top:1.1rem;color:var(--vibeui-contact-021-muted);pointer-events:none;transform-origin:left top;transition:transform .3s var(--vibeui-contact-021-ease),color .2s}
[data-vibeui-block="contact-021"] [data-part="field"] :is(input,textarea):focus + span,[data-vibeui-block="contact-021"] [data-part="field"] :is(input,textarea):not(:placeholder-shown) + span{transform:translateY(-.65rem) scale(.74);color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="submit"]{justify-self:start;display:inline-flex;align-items:center;gap:.6rem;padding:1rem 1.7rem;border-radius:999px;border:0;background:var(--vibeui-contact-021-fg);color:var(--vibeui-contact-021-bg);font:inherit;font-weight:600;font-size:1rem;cursor:pointer;transform:translate(calc(var(--vibeui-contact-021-mx,0) * 1px),calc(var(--vibeui-contact-021-my,0) * 1px)) scale(var(--vibeui-contact-021-ms,1));transition:transform .35s var(--vibeui-contact-021-ease),background .25s,color .25s,box-shadow .35s;box-shadow:0 10px 30px -14px color-mix(in oklab,var(--vibeui-contact-021-accent) 60%,transparent)}
[data-vibeui-block="contact-021"] [data-part="submit"]:hover{--vibeui-contact-021-ms:1.04;background:var(--vibeui-contact-021-accent);color:var(--vibeui-contact-021-on-accent);box-shadow:0 18px 40px -14px color-mix(in oklab,var(--vibeui-contact-021-accent) 80%,transparent)}
[data-vibeui-block="contact-021"] [data-part="submit"] i{font-style:normal;transition:transform .35s var(--vibeui-contact-021-ease)}
[data-vibeui-block="contact-021"] [data-part="submit"]:hover i{transform:translateX(.25rem)}
[data-vibeui-block="contact-021"] [data-part="sent"]{display:grid;justify-items:start;gap:.6rem;margin-top:2rem;max-width:34rem;padding:2rem;border-radius:1.2rem;background:var(--vibeui-contact-021-bg);border:1px solid var(--vibeui-contact-021-line);animation:vibeui-contact-021-pop .6s var(--vibeui-contact-021-ease)}
[data-vibeui-block="contact-021"] [data-part="sent"] svg{width:3.4rem;height:3.4rem;color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="sent"] circle{fill:none;stroke:currentColor;stroke-width:2;stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-contact-021-draw .9s var(--vibeui-contact-021-ease) forwards}
[data-vibeui-block="contact-021"] [data-part="sent"] path{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-contact-021-draw .5s .5s var(--vibeui-contact-021-ease) forwards}
[data-vibeui-block="contact-021"] [data-part="sent"] b{font-family:var(--vibeui-contact-021-display);font-weight:800;font-size:1.5rem;letter-spacing:-.03em}
[data-vibeui-block="contact-021"] [data-part="sent"] p{margin:0;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="side"]{display:grid;gap:1.6rem}
[data-vibeui-block="contact-021"] [data-part="or"]{margin:0 0 .4rem;font-family:var(--vibeui-contact-021-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="mail"]{position:relative;display:inline-block;font-family:var(--vibeui-contact-021-display);font-weight:800;font-size:clamp(1.3rem,2.8cqi,2rem);letter-spacing:-.035em;line-height:1;color:inherit;text-decoration:none;border:0;background:none;padding:0 0 .2rem;cursor:pointer;border-bottom:3px solid var(--vibeui-contact-021-accent);transition:color .2s;word-break:break-all;text-align:left}
[data-vibeui-block="contact-021"] [data-part="mail"]:hover{color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="mail"] span{position:absolute;left:0;top:calc(100% + .6rem);padding:.3rem .6rem;border-radius:6px;background:var(--vibeui-contact-021-fg);color:var(--vibeui-contact-021-bg);font-family:var(--vibeui-contact-021-mono);font-size:.7rem;letter-spacing:.06em;opacity:0;transform:translateY(-.2rem);transition:opacity .2s,transform .2s;pointer-events:none;white-space:nowrap}
[data-vibeui-block="contact-021"] [data-part="mail"]:hover span,[data-vibeui-block="contact-021"] [data-part="mail"]:focus-visible span{opacity:1;transform:none}
[data-vibeui-block="contact-021"] [data-part="mail"][data-done="true"] span{opacity:1;transform:none;background:var(--vibeui-contact-021-accent);color:var(--vibeui-contact-021-on-accent)}
[data-vibeui-block="contact-021"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.6rem 1.4rem;margin:1.6rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-contact-021-mono);font-size:.75rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="meta"] b{font-weight:500;color:var(--vibeui-contact-021-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="contact-021"] [data-part="meta"] b i{font-style:normal;animation:vibeui-contact-021-tick 1s steps(1) infinite}
[data-vibeui-block="contact-021"] [data-part="links"]{display:grid;gap:0;margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-contact-021-line)}
[data-vibeui-block="contact-021"] [data-part="links"] a{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 0;border-bottom:1px solid var(--vibeui-contact-021-line);color:inherit;text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="contact-021"] [data-part="links"] a em{font-style:normal;display:inline-block;transition:transform .3s var(--vibeui-contact-021-ease)}
[data-vibeui-block="contact-021"] [data-part="links"] a:hover{color:var(--vibeui-contact-021-accent)}
[data-vibeui-block="contact-021"] [data-part="links"] a:hover em{transform:translateX(.5rem)}
[data-vibeui-block="contact-021"] [data-part="links"] span{font-family:var(--vibeui-contact-021-mono);font-size:.78rem;color:var(--vibeui-contact-021-muted)}
[data-vibeui-block="contact-021"] [data-part="pic"]{aspect-ratio:1;max-width:18rem;padding:.6rem .6rem 2.4rem;background:var(--vibeui-contact-021-bg);box-shadow:0 20px 40px -24px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-contact-021-line);opacity:0;transform:translateY(1.5rem) rotate(2.5deg);transition:opacity .9s var(--vibeui-contact-021-ease),transform .6s var(--vibeui-contact-021-ease)}
[data-vibeui-block="contact-021"][data-in="true"] [data-part="pic"]{opacity:1;transform:rotate(2.5deg)}
[data-vibeui-block="contact-021"][data-in="true"] [data-part="pic"]:hover{transform:rotate(0) scale(1.03)}
[data-vibeui-block="contact-021"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;background:var(--vibeui-contact-021-line)}
[data-vibeui-block="contact-021"] button:focus-visible,[data-vibeui-block="contact-021"] a:focus-visible{outline:2px solid var(--vibeui-contact-021-accent);outline-offset:3px}
@keyframes vibeui-contact-021-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-contact-021-pop{from{opacity:0;transform:scale(.96) translateY(.6rem)}}
@keyframes vibeui-contact-021-tick{50%{opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="contact-021"] [data-part="shell"]{grid-template-columns:minmax(0,1.25fr) minmax(0,.85fr);gap:5rem}[data-vibeui-block="contact-021"] [data-part="side"]{padding-top:4.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-021"] *{animation:none!important;transition:none!important}[data-vibeui-block="contact-021"] [data-part="eyebrow"],[data-vibeui-block="contact-021"] :is([data-part="rise"],[data-rise]){opacity:1;transform:none}[data-vibeui-block="contact-021"] [data-part="pic"]{opacity:1;transform:none}[data-vibeui-block="contact-021"] [data-part="word"] span{transform:none}[data-vibeui-block="contact-021"] [data-part="sent"] circle,[data-vibeui-block="contact-021"] [data-part="sent"] path{stroke-dashoffset:0}}`

const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((fn) => fn()), 1000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function useTime(timeZone: string): string | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 1000), () => null)
  if (tick === null) return null
  try {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone }).format(new Date())
  } catch {
    return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date())
  }
}

/** Контакт личного сайта: форма с плавающими ярлыками и магнитной кнопкой, почта копируется кликом, часы города с секундами. */
export function Contact021({
  eyebrow = "контакт",
  title = "Есть задача? Напишите",
  text = "Без менеджеров и брифов на десять страниц: пара строк о задаче — и созвонимся на этой неделе. Беру два проекта одновременно, не больше.",
  email = "hi@lunev.design",
  copyLabel = "нажмите — скопируется",
  copiedLabel = "скопировано",
  promise = "отвечу в течение дня",
  city = "Тбилиси",
  timeZone = "Asia/Tbilisi",
  links = [
    { label: "Телеграм", href: "#", handle: "@lunev" },
    { label: "GitHub", href: "#", handle: "danyalunev" },
    { label: "Behance", href: "#", handle: "lunev" },
    { label: "LinkedIn", href: "#", handle: "danya-lunev" },
  ],
  image = "",
  imageAlt = "",
  nameLabel = "Как вас зовут",
  emailLabel = "Почта для ответа",
  messageLabel = "Что за задача",
  submitLabel = "Отправить",
  orLabel = "или просто на почту",
  sentTitle = "Письмо ушло",
  sentText = "Отвечу в течение дня. Если срочно — пишите в телеграм.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact021Props) {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [seen, setSeen] = useState(false)
  const time = useTime(timeZone)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(element)
    return () => io.disconnect()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  const magnet = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    event.currentTarget.style.setProperty("--vibeui-contact-021-mx", (dx * 0.22).toFixed(1))
    event.currentTarget.style.setProperty("--vibeui-contact-021-my", (dy * 0.22).toFixed(1))
  }
  const release = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--vibeui-contact-021-mx", "0")
    event.currentTarget.style.setProperty("--vibeui-contact-021-my", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-contact-021-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-021-fg": ink } : null),
    ...(background ? { "--vibeui-contact-021-bg": background } : null),
    ...style,
  } as CSSProperties

  const words = title.split(" ")
  const clock = time ? time.split(":") : null

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-021" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="contact-021" data-tone={tone === "auto" ? undefined : tone} data-in={seen} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <span data-part="word" style={{ ["--vibeui-contact-021-i" as string]: index }}>
                    <span>{word}</span>
                  </span>
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
            {text ? (
              <p data-part="rise" style={{ ["--vibeui-contact-021-i" as string]: 0 }}>
                <span data-part="text">
                  {text}
                </span>
              </p>
            ) : null}
            {sent ? (
              <div data-part="sent" role="status">
                <svg viewBox="0 0 56 56" aria-hidden="true">
                  <circle cx="28" cy="28" r="25" />
                  <path d="M17 29l8 8 14-16" />
                </svg>
                <b>{sentTitle}</b>
                {sentText ? <p>{sentText}</p> : null}
              </div>
            ) : (
              <form data-part="form" onSubmit={submit}>
                <label data-part="field" data-rise="" style={{ ["--vibeui-contact-021-i" as string]: 1 }}>
                  <input type="text" name="name" placeholder=" " required autoComplete="name" />
                  <span>{nameLabel}</span>
                </label>
                <label data-part="field" data-rise="" style={{ ["--vibeui-contact-021-i" as string]: 2 }}>
                  <input type="email" name="email" placeholder=" " required autoComplete="email" />
                  <span>{emailLabel}</span>
                </label>
                <label data-part="field" data-rise="" style={{ ["--vibeui-contact-021-i" as string]: 3 }}>
                  <textarea name="message" placeholder=" " required rows={4} />
                  <span>{messageLabel}</span>
                </label>
                <button type="submit" data-part="submit" onPointerMove={magnet} onPointerLeave={release}>
                  {submitLabel}
                  <i aria-hidden="true">→</i>
                </button>
              </form>
            )}
          </div>
          <div data-part="side">
            {image ? (
              <div data-part="pic">
                <img src={image} alt={imageAlt} loading="lazy" />
              </div>
            ) : null}
            <div data-part="rise" style={{ ["--vibeui-contact-021-i" as string]: 3 }}>
              {orLabel ? <p data-part="or">{orLabel}</p> : null}
              <button type="button" data-part="mail" data-done={copied} onClick={copy} aria-label={`${email} — ${copyLabel}`}>
                {email}
                <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
              </button>
              <ul data-part="meta">
                {city ? (
                  <li>
                    {city} ·{" "}
                    <b>
                      {clock ? (
                        <>
                          {clock[0]}
                          <i>:</i>
                          {clock[1]}
                          <i>:</i>
                          {clock[2]}
                        </>
                      ) : (
                        "--:--:--"
                      )}
                    </b>
                  </li>
                ) : null}
                {promise ? (
                  <li>
                    <b>{promise}</b>
                  </li>
                ) : null}
              </ul>
            </div>
            {links.length > 0 ? (
              <ul data-part="links" data-rise="" style={{ ["--vibeui-contact-021-i" as string]: 4 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>
                      <em>{link.label}</em>
                      {link.handle ? <span>{link.handle}</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
