"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Hero039Word = {
  word: string
  /** Метка языка в чипе: «EN», «ES», «IT». */
  lang: string
}

export type Hero039Message = {
  who: "teacher" | "student"
  text: string
  /** Перевод под репликой преподавателя — появляется, когда реплика допечатана. */
  note?: string
}

export type Hero039Props = {
  eyebrow?: string
  /** Начало заголовка до «переводимого» слова. */
  titleStart?: string
  /** Слова, которые сменяют друг друга перелистыванием. */
  words?: readonly Hero039Word[]
  /** Конец заголовка после слова. Пусто — не показывать. */
  titleEnd?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  trust?: string
  /** Шапка окна диалога: «Урок 12 · четверг 19:30». */
  chatTitle?: string
  teacherName?: string
  studentName?: string
  messages?: readonly Hero039Message[]
  /** Рукописный стикер на окне диалога. Пусто — без стикера. */
  sticker?: string
  /** Секунд на одно слово в заголовке. */
  interval?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро языковой школы на тетрадной клетке: в заголовке одно слово
// «переводится» по кругу — «по-английски → по-испански → по-итальянски» —
// перелистываясь вокруг оси X, как страница; под словом чернильная черта,
// рядом чип языка. Справа тетрадный лист с полями, в нём живой диалог
// урока: сначала точки «печатает», потом реплика набирается по буквам,
// под репликой преподавателя проявляется перевод; в конце цикл заново.
// Позади — бледные рукописные Hello / Hola / Ciao.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-039"]){
--vibeui-hero-039-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-039-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-039-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-039-on-accent:oklch(from var(--vibeui-hero-039-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-039-muted:color-mix(in oklab,var(--vibeui-hero-039-fg) 62%,var(--vibeui-hero-039-bg));
--vibeui-hero-039-line:color-mix(in oklab,var(--vibeui-hero-039-fg) 12%,transparent);
--vibeui-hero-039-rule:color-mix(in oklab,var(--vibeui-hero-039-fg) 7%,transparent);
--vibeui-hero-039-paper:color-mix(in oklab,var(--vibeui-hero-039-bg) 92%,#fff);
--vibeui-hero-039-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-039-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-039-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-039"]{color-scheme:dark}
:where([data-vibeui-block="hero-039"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-039"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-039"]{box-sizing:border-box;position:relative;overflow:hidden;padding:4rem 0 4.5rem;background:var(--vibeui-hero-039-bg);color:var(--vibeui-hero-039-fg);font-family:var(--vibeui-hero-039-font);font-size:1rem;line-height:1.5;isolation:isolate}
[data-vibeui-block="hero-039"]::before{content:"";position:absolute;inset:0;z-index:-1;background-image:linear-gradient(var(--vibeui-hero-039-rule) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-039-rule) 1px,transparent 1px);background-size:2rem 2rem;mask-image:radial-gradient(ellipse 80% 90% at 50% 40%,#000 30%,transparent 100%)}
[data-vibeui-block="hero-039"] *{box-sizing:border-box}
[data-vibeui-block="hero-039"] [data-part="ghost"]{position:absolute;z-index:-1;font-family:var(--vibeui-hero-039-hand);font-size:clamp(4rem,12cqi,9rem);line-height:1;color:var(--vibeui-hero-039-accent);opacity:.08;pointer-events:none;user-select:none;white-space:nowrap}
[data-vibeui-block="hero-039"] [data-part="ghost"]:nth-of-type(1){left:-2%;top:6%;transform:rotate(-8deg)}
[data-vibeui-block="hero-039"] [data-part="ghost"]:nth-of-type(2){right:4%;top:-2%;transform:rotate(6deg)}
[data-vibeui-block="hero-039"] [data-part="ghost"]:nth-of-type(3){left:38%;bottom:-4%;transform:rotate(-4deg)}
[data-vibeui-block="hero-039"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-039"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.2rem;padding:.4rem .9rem .4rem .5rem;border-radius:999px;border:1px solid var(--vibeui-hero-039-line);background:var(--vibeui-hero-039-paper);font-size:.8rem;font-weight:500;color:var(--vibeui-hero-039-muted)}
[data-vibeui-block="hero-039"] [data-part="eyebrow"] i{width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-hero-039-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-hero-039-accent) 20%,transparent)}
[data-vibeui-block="hero-039"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-039-display);font-weight:800;font-size:clamp(2.5rem,6.4cqi,4.9rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="hero-039"] [data-part="flip"]{position:relative;display:inline-grid;vertical-align:baseline;perspective:600px;color:var(--vibeui-hero-039-accent);white-space:nowrap}
[data-vibeui-block="hero-039"] [data-part="flip"] > span{grid-area:1/1;display:inline-flex;align-items:baseline;gap:.35em;visibility:hidden;backface-visibility:hidden;transform-origin:50% 100%}
[data-vibeui-block="hero-039"] [data-part="flip"] > span[data-state="in"]{visibility:visible;animation:vibeui-hero-039-in .7s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-039"] [data-part="flip"] > span[data-state="out"]{visibility:visible;animation:vibeui-hero-039-out .45s cubic-bezier(.6,0,.8,.4) both}
[data-vibeui-block="hero-039"] [data-part="flip"] small{font-family:var(--vibeui-hero-039-display);font-size:.28em;font-weight:700;letter-spacing:.06em;padding:.25em .5em;border-radius:.45em;background:var(--vibeui-hero-039-accent);color:var(--vibeui-hero-039-on-accent);transform:translateY(-.9em)}
[data-vibeui-block="hero-039"] [data-part="flip"] svg{position:absolute;left:0;right:0;bottom:-.08em;width:100%;height:.28em;color:var(--vibeui-hero-039-accent);overflow:visible;pointer-events:none}
[data-vibeui-block="hero-039"] [data-part="flip"] path{stroke-dasharray:110;stroke-dashoffset:110;animation:vibeui-hero-039-ink 1s cubic-bezier(.2,.8,.2,1) .4s forwards}
[data-vibeui-block="hero-039"] [data-part="lede"]{margin:1.4rem 0 0;max-width:32rem;font-size:1.1rem;color:var(--vibeui-hero-039-muted)}
[data-vibeui-block="hero-039"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-039"] [data-part="primary"],[data-vibeui-block="hero-039"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:1rem;font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .2s,background .2s}
[data-vibeui-block="hero-039"] [data-part="primary"]{background:var(--vibeui-hero-039-accent);color:var(--vibeui-hero-039-on-accent)}
[data-vibeui-block="hero-039"] [data-part="primary"]:hover{transform:translateY(-2px) rotate(-1deg);box-shadow:0 14px 30px -12px var(--vibeui-hero-039-accent)}
[data-vibeui-block="hero-039"] [data-part="secondary"]{color:var(--vibeui-hero-039-fg);border:1.5px solid var(--vibeui-hero-039-fg)}
[data-vibeui-block="hero-039"] [data-part="secondary"]:hover{transform:translateY(-2px) rotate(1deg);background:var(--vibeui-hero-039-paper)}
[data-vibeui-block="hero-039"] a:focus-visible{outline:2px solid var(--vibeui-hero-039-accent);outline-offset:2px}
[data-vibeui-block="hero-039"] [data-part="trust"]{margin:1.6rem 0 0;font-family:var(--vibeui-hero-039-hand);font-size:1.35rem;color:var(--vibeui-hero-039-muted);transform:rotate(-1.5deg);transform-origin:left}
[data-vibeui-block="hero-039"] [data-part="chat"]{position:relative;width:min(100%,30rem);margin:0 auto;border-radius:.5rem 1.2rem 1.2rem .5rem;background:var(--vibeui-hero-039-paper);background-image:linear-gradient(90deg,transparent 2.6rem,color-mix(in oklab,var(--vibeui-hero-039-accent) 45%,transparent) 2.6rem,color-mix(in oklab,var(--vibeui-hero-039-accent) 45%,transparent) calc(2.6rem + 1px),transparent calc(2.6rem + 1px)),repeating-linear-gradient(180deg,transparent 0 calc(1.75rem - 1px),var(--vibeui-hero-039-rule) calc(1.75rem - 1px) 1.75rem);box-shadow:0 1px 0 var(--vibeui-hero-039-line),0 30px 60px -30px color-mix(in oklab,var(--vibeui-hero-039-fg) 45%,transparent);transform:rotate(1deg)}
[data-vibeui-block="hero-039"] [data-part="chat"]::before{content:"";position:absolute;left:.6rem;top:1.4rem;bottom:1.4rem;width:.5rem;background:repeating-linear-gradient(180deg,var(--vibeui-hero-039-line) 0 .5rem,transparent .5rem 1.6rem);border-radius:999px;opacity:.9}
[data-vibeui-block="hero-039"] [data-part="chathead"]{display:flex;align-items:center;gap:.6rem;padding:1rem 1.2rem .6rem 3.4rem;font-size:.78rem;font-weight:500;color:var(--vibeui-hero-039-muted)}
[data-vibeui-block="hero-039"] [data-part="chathead"] i{width:.5rem;height:.5rem;border-radius:50%;background:#22c55e;animation:vibeui-hero-039-live 1.6s ease-in-out infinite}
[data-vibeui-block="hero-039"] [data-part="thread"]{display:grid;gap:.7rem;margin:0;padding:.4rem 1.2rem 1.6rem 3.4rem;list-style:none;min-height:19rem;align-content:start}
[data-vibeui-block="hero-039"] [data-part="msg"]{display:grid;gap:.25rem;max-width:85%;animation:vibeui-hero-039-pop .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-039"] [data-part="msg"][data-who="student"]{justify-self:end;text-align:right}
[data-vibeui-block="hero-039"] [data-part="msg"] b{font-family:var(--vibeui-hero-039-hand);font-weight:400;font-size:1rem;color:var(--vibeui-hero-039-accent)}
[data-vibeui-block="hero-039"] [data-part="msg"][data-who="student"] b{color:var(--vibeui-hero-039-muted)}
[data-vibeui-block="hero-039"] [data-part="bubble"]{display:inline-block;padding:.55rem .85rem;border-radius:.2rem 1rem 1rem 1rem;background:var(--vibeui-hero-039-bg);border:1px solid var(--vibeui-hero-039-line);font-size:.95rem;line-height:1.4;text-align:left}
[data-vibeui-block="hero-039"] [data-part="msg"][data-who="student"] [data-part="bubble"]{border-radius:1rem .2rem 1rem 1rem;background:var(--vibeui-hero-039-accent);color:var(--vibeui-hero-039-on-accent);border-color:transparent}
[data-vibeui-block="hero-039"] [data-part="cursor"]{display:inline-block;width:2px;height:1em;margin-left:1px;vertical-align:-.15em;background:currentColor;animation:vibeui-hero-039-blink 1s steps(2) infinite}
[data-vibeui-block="hero-039"] [data-part="dots"]{display:inline-flex;gap:.25rem;padding:.3rem 0;vertical-align:middle}
[data-vibeui-block="hero-039"] [data-part="dots"] i{width:.4rem;height:.4rem;border-radius:50%;background:currentColor;opacity:.4;animation:vibeui-hero-039-dot 1.1s ease-in-out infinite}
[data-vibeui-block="hero-039"] [data-part="dots"] i:nth-child(2){animation-delay:.15s}
[data-vibeui-block="hero-039"] [data-part="dots"] i:nth-child(3){animation-delay:.3s}
[data-vibeui-block="hero-039"] [data-part="note"]{font-family:var(--vibeui-hero-039-hand);font-size:1rem;color:var(--vibeui-hero-039-muted);animation:vibeui-hero-039-pop .4s ease-out}
[data-vibeui-block="hero-039"] [data-part="sticker"]{position:absolute;right:-.8rem;top:-1.2rem;max-width:11rem;padding:.7rem .9rem;border-radius:.3rem;background:var(--vibeui-hero-039-accent);color:var(--vibeui-hero-039-on-accent);font-family:var(--vibeui-hero-039-hand);font-size:1.05rem;line-height:1.2;transform:rotate(4deg);box-shadow:0 10px 20px -10px color-mix(in oklab,var(--vibeui-hero-039-fg) 50%,transparent)}
@keyframes vibeui-hero-039-in{from{transform:rotateX(-92deg);opacity:0}to{transform:rotateX(0);opacity:1}}
@keyframes vibeui-hero-039-out{from{transform:rotateX(0);opacity:1}to{transform:rotateX(88deg);opacity:0}}
@keyframes vibeui-hero-039-ink{to{stroke-dashoffset:0}}
@keyframes vibeui-hero-039-live{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes vibeui-hero-039-blink{to{opacity:0}}
@keyframes vibeui-hero-039-dot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-3px);opacity:1}}
@keyframes vibeui-hero-039-pop{from{opacity:0;transform:translateY(6px)}}
@container (min-width: 60rem){[data-vibeui-block="hero-039"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:4rem}[data-vibeui-block="hero-039"] [data-part="chat"]{margin:0 0 0 auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-039"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-039"] [data-part="flip"] path{stroke-dashoffset:0}[data-vibeui-block="hero-039"] [data-part="flip"] > span[data-state="out"]{visibility:hidden}}`

const DEFAULT_WORDS: Hero039Word[] = [
  { word: "по-английски", lang: "EN" },
  { word: "по-испански", lang: "ES" },
  { word: "по-итальянски", lang: "IT" },
]

const DEFAULT_MESSAGES: Hero039Message[] = [
  { who: "teacher", text: "Hi Masha! How was your weekend?", note: "Привет, Маша! Как прошли выходные?" },
  { who: "student", text: "It was great, I went to the mountains with friends." },
  { who: "teacher", text: "Nice! Did you go hiking or just relax?", note: "Здорово! Ходили в поход или просто отдыхали?" },
  { who: "student", text: "We hiked for five hours. My legs still hurt." },
  { who: "teacher", text: "Ha! Then today we talk about the past — you already use it perfectly.", note: "Тогда сегодня о прошедшем времени — вы его уже отлично используете." },
]

/** Хиро языковой школы: слово-перелистывание в заголовке и живой диалог урока. */
export function Hero039({
  eyebrow = "Онлайн-школа · с 2019 года",
  titleStart = "Через три месяца вы расскажете это",
  words = DEFAULT_WORDS,
  titleEnd = "",
  lede = "Английский, испанский и итальянский в группах до шести человек. Разговор с первого урока, преподаватели-носители раз в неделю, тетрадь с домашкой — и ни одной таблицы неправильных глаголов наизусть.",
  primaryLabel = "Пройти тест уровня",
  primaryHref = "#test",
  secondaryLabel = "Пробный урок бесплатно",
  secondaryHref = "#trial",
  trust = "1 240 учеников за год · 4,9 на Яндексе",
  chatTitle = "Урок 12 · четверг 19:30",
  teacherName = "Emma",
  studentName = "Маша",
  messages = DEFAULT_MESSAGES,
  sticker = "домашка: рассказать про выходные",
  interval = 2.8,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero039Props) {
  const [flip, setFlip] = useState({ index: 0, previous: -1 })
  const [step, setStep] = useState({ index: 0, chars: -1 })

  useEffect(() => {
    if (words.length < 2) return
    const timer = setInterval(() => {
      setFlip((current) => ({ index: (current.index + 1) % words.length, previous: current.index }))
    }, Math.max(1, interval) * 1000)
    return () => clearInterval(timer)
  }, [words.length, interval])

  const current = messages[step.index]
  const text = current?.text ?? ""
  const total = messages.length

  useEffect(() => {
    if (total === 0) return
    let delay = 0
    let next = step
    if (step.chars < 0) {
      delay = 650
      next = { index: step.index, chars: 0 }
    } else if (step.chars < text.length) {
      delay = text[step.chars] === " " ? 55 : 26
      next = { index: step.index, chars: step.chars + 1 }
    } else if (step.index < total - 1) {
      delay = 1000
      next = { index: step.index + 1, chars: -1 }
    } else {
      delay = 3600
      next = { index: 0, chars: -1 }
    }
    const timer = setTimeout(() => setStep(next), delay)
    return () => clearTimeout(timer)
  }, [step, text, total])

  const palette = {
    ...(accent ? { "--vibeui-hero-039-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-039-fg": ink } : null),
    ...(background ? { "--vibeui-hero-039-bg": background } : null),
    ...style,
  } as CSSProperties

  const ghosts = ["Hello", "Hola", "Ciao"]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-039" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-039" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {ghosts.map((ghost) => (
          <span key={ghost} data-part="ghost" aria-hidden="true">
            {ghost}
          </span>
        ))}
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <i aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1 data-part="title">
              {titleStart}{" "}
              <span data-part="flip" aria-live="off">
                {words.map((item, index) => (
                  <span key={item.word} data-state={index === flip.index ? "in" : index === flip.previous ? "out" : undefined} aria-hidden={index !== flip.index}>
                    {item.word}
                    {item.lang ? <small>{item.lang}</small> : null}
                  </span>
                ))}
                <svg viewBox="0 0 100 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 6c18-5 40-5 60-2s26 2 36-1" />
                </svg>
              </span>
              {titleEnd ? <> {titleEnd}</> : null}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {trust ? <p data-part="trust">{trust}</p> : null}
          </div>
          <div data-part="chat" aria-label="Фрагмент урока">
            {sticker ? <span data-part="sticker">{sticker}</span> : null}
            <div data-part="chathead">
              <i aria-hidden="true" />
              {chatTitle}
            </div>
            <ul data-part="thread" aria-live="off">
              {messages.slice(0, step.index + 1).map((message, index) => {
                const active = index === step.index
                const typed = active ? text.slice(0, Math.max(0, step.chars)) : message.text
                const finished = !active || step.chars >= message.text.length
                return (
                  <li key={index} data-part="msg" data-who={message.who}>
                    <b>{message.who === "teacher" ? teacherName : studentName}</b>
                    {active && step.chars < 0 ? (
                      <span data-part="bubble">
                        <span data-part="dots" aria-label="печатает">
                          <i />
                          <i />
                          <i />
                        </span>
                      </span>
                    ) : (
                      <span data-part="bubble">
                        {typed}
                        {!finished ? <i data-part="cursor" aria-hidden="true" /> : null}
                      </span>
                    )}
                    {finished && message.note ? <span data-part="note">{message.note}</span> : null}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
