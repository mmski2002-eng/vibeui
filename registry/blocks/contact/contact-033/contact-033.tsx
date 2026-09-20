"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Contact033Right = {
  name: string
  /** Статус: «свободны», «проданы: Германия, Польша». */
  status: string
}

export type Contact033Props = {
  eyebrow?: string
  title?: string
  lede?: string
  rights?: readonly Contact033Right[]
  /** Кто ведёт права. */
  agentName?: string
  agentRole?: string
  agency?: string
  email?: string
  phone?: string
  /** Прямая почта автора для журналов и эфиров. */
  authorEmail?: string
  pressKitLabel?: string
  pressKitHref?: string
  /** Начало статуса, которое считается «свободно» (подсветка). */
  freePrefix?: string
  directLine?: string
  copyLabel?: string
  copiedLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Контакты для издателей: слева — что можно купить (права на перевод,
// фрагменты, экранизация) со статусами, справа — визитка агента, которая
// наклоняется вслед за курсором (perspective + rotateX/Y через CSS-переменные,
// без ререндеров) и ловит блик. Почта копируется в один клик:
// кнопка на две секунды становится «скопировано». Ничего наружу не
// отправляется — только clipboard.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="contact-033"]){
--vibeui-contact-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-contact-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-contact-033-on-accent:oklch(from var(--vibeui-contact-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-033-muted:color-mix(in oklab,var(--vibeui-contact-033-fg) 60%,var(--vibeui-contact-033-bg));
--vibeui-contact-033-line:color-mix(in oklab,var(--vibeui-contact-033-fg) 14%,transparent);
--vibeui-contact-033-paper:color-mix(in oklab,var(--vibeui-contact-033-bg) 93%,var(--vibeui-contact-033-fg));
--vibeui-contact-033-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-contact-033-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-033"]{color-scheme:dark}
:where([data-vibeui-block="contact-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="contact-033"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="contact-033"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="contact-033"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="contact-033"]{box-sizing:border-box;padding:clamp(4rem,8cqi,7rem) 0;background:var(--vibeui-contact-033-bg);color:var(--vibeui-contact-033-fg);font-family:var(--vibeui-contact-033-font);font-size:1.05rem;line-height:1.65;transition:background-color .6s,color .6s}
[data-vibeui-block="contact-033"] *{box-sizing:border-box}
[data-vibeui-block="contact-033"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="contact-033"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-contact-033-accent)}
[data-vibeui-block="contact-033"] [data-part="title"]{margin:0;font-family:var(--vibeui-contact-033-display);font-weight:400;font-size:clamp(2.4rem,6cqi,4.4rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="contact-033"] [data-part="lede"]{margin:1rem 0 0;max-width:32rem;color:var(--vibeui-contact-033-muted)}
[data-vibeui-block="contact-033"] [data-part="rights"]{margin:2rem 0 0;padding:0;list-style:none;border-top:1px solid var(--vibeui-contact-033-line)}
[data-vibeui-block="contact-033"] [data-part="rights"] li{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:.2rem 1.5rem;padding:.9rem 0;border-bottom:1px solid var(--vibeui-contact-033-line)}
[data-vibeui-block="contact-033"] [data-part="rights"] b{font-family:var(--vibeui-contact-033-display);font-weight:400;font-size:1.5rem;line-height:1.1}
[data-vibeui-block="contact-033"] [data-part="rights"] span{font-size:.88rem;font-style:italic;color:var(--vibeui-contact-033-muted)}
[data-vibeui-block="contact-033"] [data-part="rights"] span[data-free="true"]{color:var(--vibeui-contact-033-accent)}
[data-vibeui-block="contact-033"] [data-part="author"]{margin:1.6rem 0 0;font-size:.92rem;color:var(--vibeui-contact-033-muted)}
[data-vibeui-block="contact-033"] [data-part="author"] a{color:var(--vibeui-contact-033-fg);font-style:italic;text-decoration:none;border-bottom:1px solid var(--vibeui-contact-033-accent)}
[data-vibeui-block="contact-033"] [data-part="author"] a:focus-visible{outline:2px solid var(--vibeui-contact-033-accent);outline-offset:3px}
[data-vibeui-block="contact-033"] [data-part="stage"]{display:grid;justify-items:center;perspective:1200px}
[data-vibeui-block="contact-033"] [data-part="card"]{position:relative;width:min(100%,26rem);aspect-ratio:8/5;padding:1.6rem 1.8rem;border-radius:.5rem;background:var(--vibeui-contact-033-paper);border:1px solid var(--vibeui-contact-033-line);box-shadow:0 40px 80px -40px rgb(0 0 0 / .7);display:flex;flex-direction:column;justify-content:space-between;transform:rotateX(var(--vibeui-contact-033-rx,0deg)) rotateY(var(--vibeui-contact-033-ry,0deg));transition:transform .5s cubic-bezier(.2,.8,.2,1),background-color .6s;transform-style:preserve-3d;overflow:hidden}
[data-vibeui-block="contact-033"] [data-part="card"]::after{content:"";position:absolute;inset:0;background:radial-gradient(40% 60% at var(--vibeui-contact-033-gx,50%) var(--vibeui-contact-033-gy,50%),rgb(255 255 255 / .14),transparent 70%);pointer-events:none;opacity:0;transition:opacity .4s}
[data-vibeui-block="contact-033"] [data-part="stage"]:hover [data-part="card"]::after{opacity:1}
[data-vibeui-block="contact-033"] [data-part="card"] small{font-size:.68rem;font-style:italic;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-contact-033-accent)}
[data-vibeui-block="contact-033"] [data-part="who"] b{display:block;margin-top:.4rem;font-family:var(--vibeui-contact-033-display);font-weight:400;font-size:1.9rem;line-height:1}
[data-vibeui-block="contact-033"] [data-part="who"] i{display:block;margin-top:.3rem;font-size:.9rem;color:var(--vibeui-contact-033-muted)}
[data-vibeui-block="contact-033"] [data-part="lines"]{display:grid;gap:.4rem;font-size:.92rem}
[data-vibeui-block="contact-033"] [data-part="lines"] a{color:var(--vibeui-contact-033-fg);text-decoration:none}
[data-vibeui-block="contact-033"] [data-part="lines"] a:hover{color:var(--vibeui-contact-033-accent)}
[data-vibeui-block="contact-033"] [data-part="lines"] a:focus-visible{outline:2px solid var(--vibeui-contact-033-accent);outline-offset:3px}
[data-vibeui-block="contact-033"] [data-part="copy"]{display:inline-flex;align-items:center;gap:.5rem;margin-left:.6rem;padding:.2rem .7rem;border:1px solid var(--vibeui-contact-033-line);border-radius:999px;background:transparent;color:var(--vibeui-contact-033-muted);font:inherit;font-size:.75rem;font-style:italic;cursor:pointer;transition:color .25s,border-color .25s,background-color .25s}
[data-vibeui-block="contact-033"] [data-part="copy"]:hover{border-color:var(--vibeui-contact-033-accent);color:var(--vibeui-contact-033-fg)}
[data-vibeui-block="contact-033"] [data-part="copy"][data-done="true"]{background:var(--vibeui-contact-033-accent);border-color:transparent;color:var(--vibeui-contact-033-on-accent)}
[data-vibeui-block="contact-033"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-contact-033-accent);outline-offset:2px}
[data-vibeui-block="contact-033"] [data-part="press"]{margin-top:1.4rem;position:relative;color:var(--vibeui-contact-033-fg);text-decoration:none;font-style:italic;font-size:.95rem;padding:.2rem 0}
[data-vibeui-block="contact-033"] [data-part="press"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-contact-033-accent);transform:scaleX(.35);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="contact-033"] [data-part="press"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="contact-033"] [data-part="press"]:focus-visible{outline:2px solid var(--vibeui-contact-033-accent);outline-offset:3px}
@container (min-width: 60rem){[data-vibeui-block="contact-033"] [data-part="shell"]{grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-033"] *{animation:none!important;transition:none!important}}`

/** Контакты для издателей: права со статусами и наклоняющаяся визитка агента. */
export function Contact033({
  eyebrow = "Издателям",
  title = "Права, фрагменты, эфиры",
  lede = "Переводы, публикацию фрагментов и экранизацию обсуждаем через агента. Интервью и эфиры — напрямую, я отвечаю в течение недели.",
  rights = [
    { name: "Перевод", status: "проданы: Германия, Польша · свободны: остальные" },
    { name: "Фрагменты в журналах", status: "свободны" },
    { name: "Аудиокнига", status: "выходит в ноябре" },
    { name: "Экранизация", status: "свободны" },
  ],
  agentName = "Дарья Ланина",
  agentRole = "литературный агент",
  agency = "Агентство «Полоса»",
  email = "daria@polosa.agency",
  phone = "+7 921 400-17-08",
  authorEmail = "vera@kholodova.ru",
  pressKitLabel = "Пресс-кит: фото, биография, обложка (zip, 14 МБ)",
  pressKitHref = "#press-kit",
  freePrefix = "свободны",
  directLine = "Для интервью и эфиров — напрямую:",
  copyLabel = "копировать",
  copiedLabel = "скопировано",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Contact033Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const box = card.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    card.style.setProperty("--vibeui-contact-033-ry", `${((x - 0.5) * 14).toFixed(2)}deg`)
    card.style.setProperty("--vibeui-contact-033-rx", `${((0.5 - y) * 10).toFixed(2)}deg`)
    card.style.setProperty("--vibeui-contact-033-gx", `${Math.round(x * 100)}%`)
    card.style.setProperty("--vibeui-contact-033-gy", `${Math.round(y * 100)}%`)
  }

  const reset = () => {
    const card = cardRef.current
    if (!card) return
    card.style.removeProperty("--vibeui-contact-033-ry")
    card.style.removeProperty("--vibeui-contact-033-rx")
  }

  const copy = () => {
    navigator.clipboard?.writeText(email).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const palette = {
    ...(accent ? { "--vibeui-contact-033-accent": accent } : null),
    ...(ink ? { "--vibeui-contact-033-fg": ink } : null),
    ...(background ? { "--vibeui-contact-033-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-contact-033" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="contact-033" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {rights.length > 0 ? (
              <ul data-part="rights">
                {rights.map((right) => (
                  <li key={right.name}>
                    <b>{right.name}</b>
                    <span data-free={right.status.startsWith(freePrefix) ? "true" : undefined}>{right.status}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {authorEmail ? (
              <p data-part="author">
                {directLine} <a href={`mailto:${authorEmail}`}>{authorEmail}</a>
              </p>
            ) : null}
          </div>
          <div data-part="stage" onPointerMove={tilt} onPointerLeave={reset}>
            <div data-part="card" ref={cardRef}>
              <div data-part="who">
                <small>{agentRole}</small>
                <b>{agentName}</b>
                <i>{agency}</i>
              </div>
              <div data-part="lines">
                <div>
                  <a href={`mailto:${email}`}>{email}</a>
                  <button data-part="copy" type="button" data-done={copied} onClick={copy} aria-live="polite">
                    {copied ? copiedLabel : copyLabel}
                  </button>
                </div>
                {phone ? <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a> : null}
              </div>
            </div>
            {pressKitLabel ? (
              <a data-part="press" href={pressKitHref}>
                {pressKitLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
