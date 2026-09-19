"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

export type Writer003Props = {
  eyebrow?: string
  title?: string
  /** Откуда фрагмент: «из книги …, глава 3». */
  source?: string
  /**
   * Абзацы. Разметка: ==фраза== — подчёркивается чернилами, когда абзац
   * доскроллили; [1] — ссылка на сноску из notes (нумерация с единицы).
   */
  paragraphs?: readonly string[]
  /** Сноски по номерам: notes[0] — это [1]. Показываются на полях. */
  notes?: readonly string[]
  /** Подпись закладки: «прочитано». */
  progressLabel?: string
  actionLabel?: string
  actionHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Чтение по прокрутке: фрагмент эссе узкой колонкой в 65 символов с
// буквицей. Слева — закладка: липкая лента, которая заполняется по мере
// прокрутки секции, и процент прочитанного. Справа на полях — сноски:
// каждая появляется, когда её абзац доезжает до середины экрана
// (IntersectionObserver ставит data-seen), и тогда же выделенные фразы
// подчёркиваются «чернилами» — background-size растёт от 0 до 100%.
// На узком экране сноски встают под абзацем, закладка уходит в верхнюю строку.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="writer-003"]){
--vibeui-writer-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-writer-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-003-muted:color-mix(in oklab,var(--vibeui-writer-003-fg) 60%,var(--vibeui-writer-003-bg));
--vibeui-writer-003-line:color-mix(in oklab,var(--vibeui-writer-003-fg) 14%,transparent);
--vibeui-writer-003-ink:color-mix(in oklab,var(--vibeui-writer-003-accent) 45%,transparent);
--vibeui-writer-003-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-writer-003-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="writer-003"]{color-scheme:dark}
:where([data-vibeui-block="writer-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="writer-003"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="writer-003"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="writer-003"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="writer-003"]{box-sizing:border-box;padding:clamp(4rem,8cqi,7rem) 0;background:var(--vibeui-writer-003-bg);color:var(--vibeui-writer-003-fg);font-family:var(--vibeui-writer-003-font);font-size:1.125rem;line-height:1.7;transition:background-color .6s,color .6s}
[data-vibeui-block="writer-003"] *{box-sizing:border-box}
[data-vibeui-block="writer-003"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="writer-003"] [data-part="mark"]{display:flex;align-items:center;gap:1rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-writer-003-muted)}
[data-vibeui-block="writer-003"] [data-part="track"]{position:relative;flex:1;height:2px;background:var(--vibeui-writer-003-line);overflow:hidden}
[data-vibeui-block="writer-003"] [data-part="ribbon"]{position:absolute;inset:0;background:var(--vibeui-writer-003-accent);transform:scaleX(var(--vibeui-writer-003-p,0));transform-origin:left;transition:transform .15s linear}
[data-vibeui-block="writer-003"] [data-part="percent"]{font-variant-numeric:tabular-nums;color:var(--vibeui-writer-003-fg);min-width:3ch;text-align:right}
[data-vibeui-block="writer-003"] [data-part="head"]{max-width:65ch}
[data-vibeui-block="writer-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-writer-003-accent)}
[data-vibeui-block="writer-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-writer-003-display);font-weight:400;font-size:clamp(2.2rem,5.5cqi,4rem);line-height:1.05;letter-spacing:-.02em}
[data-vibeui-block="writer-003"] [data-part="source"]{margin:.8rem 0 0;font-style:italic;color:var(--vibeui-writer-003-muted)}
[data-vibeui-block="writer-003"] [data-part="body"]{display:grid;gap:1.6rem}
[data-vibeui-block="writer-003"] [data-part="para"]{display:grid;gap:.8rem;max-width:65ch}
[data-vibeui-block="writer-003"] [data-part="para"] p{margin:0;text-wrap:pretty}
[data-vibeui-block="writer-003"] [data-part="para"]:first-child p::first-letter{float:left;font-family:var(--vibeui-writer-003-display);font-size:4.2em;line-height:.78;padding:.1em .14em 0 0;color:var(--vibeui-writer-003-accent)}
[data-vibeui-block="writer-003"] [data-part="para"] mark{background:linear-gradient(transparent 62%,var(--vibeui-writer-003-ink) 62%,var(--vibeui-writer-003-ink) 92%,transparent 92%) no-repeat 0 0/0% 100%;color:inherit;transition:background-size 1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="writer-003"] [data-part="para"][data-seen="true"] mark{background-size:100% 100%}
[data-vibeui-block="writer-003"] [data-part="ref"]{font-size:.62em;vertical-align:super;line-height:0;margin-left:.1em;color:var(--vibeui-writer-003-accent);font-style:italic}
[data-vibeui-block="writer-003"] [data-part="notes"]{margin:0;padding:0 0 0 1rem;list-style:none;border-left:1px solid var(--vibeui-writer-003-line);font-size:.82rem;line-height:1.5;color:var(--vibeui-writer-003-muted);display:grid;gap:.6rem}
[data-vibeui-block="writer-003"] [data-part="notes"] li{opacity:0;transform:translateY(.5rem);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="writer-003"] [data-part="para"][data-seen="true"] [data-part="notes"] li{opacity:1;transform:none}
[data-vibeui-block="writer-003"] [data-part="notes"] li:nth-child(2){transition-delay:.15s}
[data-vibeui-block="writer-003"] [data-part="notes"] li:nth-child(3){transition-delay:.3s}
[data-vibeui-block="writer-003"] [data-part="notes"] b{font-weight:400;font-style:italic;color:var(--vibeui-writer-003-accent);margin-right:.4em}
[data-vibeui-block="writer-003"] [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 2rem;max-width:65ch;padding-top:1.6rem;border-top:1px solid var(--vibeui-writer-003-line)}
[data-vibeui-block="writer-003"] [data-part="ornament"]{font-family:var(--vibeui-writer-003-display);font-size:1.4rem;color:var(--vibeui-writer-003-accent)}
[data-vibeui-block="writer-003"] [data-part="action"]{position:relative;color:var(--vibeui-writer-003-fg);text-decoration:none;font-style:italic;font-size:1.05rem;padding:.3rem 0}
[data-vibeui-block="writer-003"] [data-part="action"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-writer-003-accent);transform:scaleX(.35);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="writer-003"] [data-part="action"]:hover::after{transform:scaleX(1)}
[data-vibeui-block="writer-003"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-writer-003-accent);outline-offset:3px}
@container (min-width: 64rem){[data-vibeui-block="writer-003"] [data-part="shell"]{grid-template-columns:4.5rem minmax(0,1fr);column-gap:2rem}[data-vibeui-block="writer-003"] [data-part="mark"]{grid-row:1/span 3;align-self:start;position:sticky;top:6rem;flex-direction:column;align-items:center;gap:.8rem;height:22rem}[data-vibeui-block="writer-003"] [data-part="track"]{width:2px;height:auto;flex:1}[data-vibeui-block="writer-003"] [data-part="ribbon"]{transform:scaleY(var(--vibeui-writer-003-p,0));transform-origin:top}[data-vibeui-block="writer-003"] [data-part="percent"]{text-align:center;min-width:0}[data-vibeui-block="writer-003"] [data-part="mark"] span:first-child{writing-mode:vertical-rl;transform:rotate(180deg)}[data-vibeui-block="writer-003"] [data-part="head"],[data-vibeui-block="writer-003"] [data-part="body"],[data-vibeui-block="writer-003"] [data-part="foot"]{grid-column:2}[data-vibeui-block="writer-003"] [data-part="para"]{grid-template-columns:minmax(0,65ch) 15rem;column-gap:3rem;max-width:none;align-items:start}[data-vibeui-block="writer-003"] [data-part="notes"]{padding:.3rem 0 0 1rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="writer-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PARAGRAPHS = [
  "Холодильник, оказывается, вздыхает. Я не знала этого тридцать четыре года, потому что дома всегда кто-то был, и его вздох терялся в разговорах, в радио, в шагах по коридору. Теперь все ушли — кто на работу, кто навсегда, — и ==дом заговорил тем голосом, который у него был всё это время==.",
  "Я записываю его в тетрадь, как записывала бы птиц. Половина восьмого: батарея щёлкает три раза, будто считает[1]. Девять: свет в подъезде выключается с тем звуком, с каким закрывают книгу. Одиннадцать: ==этажом выше кто-то ставит чашку, и я знаю, что чашка белая==.",
  "Пустой дом звучит как ожидание: дверь, которая ещё не хлопнула, чайник, который ещё не поставили. Он не молчит — ==он держит паузу==, как хороший чтец перед последней строчкой[2].",
  "Мне кажется, я поняла, зачем люди заводят кошек. Не ради тепла и не ради мышей. Ради того, чтобы в доме был ещё один слушатель[3], — и чтобы вздох холодильника снова стал чьим-то, а не только твоим.",
]

const DEFAULT_NOTES = [
  "Позже выяснилось: это термостат. Но я оставила «считает».",
  "Учитель по чтению вслух говорил: пауза — это тоже текст, просто его не набирают.",
  "Кошки в этом эссе так и не появилось. Появился фикус.",
]

function renderInline(text: string, notes: readonly string[]): ReactNode[] {
  return text.split(/(==[^=]+==|\[\d+\])/g).map((chunk, i) => {
    if (chunk.startsWith("==") && chunk.endsWith("==")) return <mark key={i}>{chunk.slice(2, -2)}</mark>
    const ref = /^\[(\d+)\]$/.exec(chunk)
    if (ref) {
      const n = Number(ref[1])
      return notes[n - 1] ? (
        <sup key={i} data-part="ref" aria-label={`Сноска ${n}`}>
          {n}
        </sup>
      ) : null
    }
    return chunk
  })
}

function noteNumbers(text: string) {
  return Array.from(text.matchAll(/\[(\d+)\]/g), (match) => Number(match[1]))
}

/** Фрагмент эссе с закладкой-прогрессом, сносками на полях и чернильными подчёркиваниями. */
export function Writer003({
  eyebrow = "Фрагмент",
  title = "Как звучит дом, когда все ушли",
  source = "Из книги «Комнаты, в которых мы не жили», глава третья",
  paragraphs = DEFAULT_PARAGRAPHS,
  notes = DEFAULT_NOTES,
  progressLabel = "прочитано",
  actionLabel = "Читать эссе целиком",
  actionHref = "#texts",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Writer003Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [seen, setSeen] = useState<readonly boolean[]>([])
  const [percent, setPercent] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const body = bodyRef.current
    if (!root || !body) return
    const paras = Array.from(body.querySelectorAll<HTMLElement>('[data-part="para"]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = paras.indexOf(entry.target as HTMLElement)
          setSeen((value) => (value[index] ? value : Object.assign([...value], { [index]: true })))
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0.2 },
    )
    paras.forEach((para) => observer.observe(para))

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const box = body.getBoundingClientRect()
        const read = (window.innerHeight * 0.6 - box.top) / Math.max(1, box.height)
        setPercent(Math.round(Math.min(1, Math.max(0, read)) * 100))
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-writer-003-accent": accent } : null),
    ...(ink ? { "--vibeui-writer-003-fg": ink } : null),
    ...(background ? { "--vibeui-writer-003-bg": background } : null),
    "--vibeui-writer-003-p": percent / 100,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-writer-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="writer-003" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="mark" aria-hidden="true">
            <span>{progressLabel}</span>
            <span data-part="track">
              <i data-part="ribbon" />
            </span>
            <span data-part="percent">{percent}%</span>
          </div>
          <header data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {source ? <p data-part="source">{source}</p> : null}
          </header>
          <div data-part="body" ref={bodyRef}>
            {paragraphs.map((paragraph, i) => {
              const numbers = noteNumbers(paragraph).filter((n) => notes[n - 1])
              return (
                <div key={i} data-part="para" data-seen={seen[i] ? "true" : undefined}>
                  <p>{renderInline(paragraph, notes)}</p>
                  {numbers.length > 0 ? (
                    <ul data-part="notes">
                      {numbers.map((n) => (
                        <li key={n}>
                          <b>{n}</b>
                          {notes[n - 1]}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div data-part="foot">
            <span data-part="ornament" aria-hidden="true">
              ❦
            </span>
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
