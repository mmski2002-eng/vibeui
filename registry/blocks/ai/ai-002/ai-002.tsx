"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Button126 } from "@/registry/components/button/button-126/button-126"

export type Ai002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  inputLabel?: string
  /** Расшифровка по умолчанию в поле. */
  sample?: string
  runLabel?: string
  runningLabel?: string
  resetLabel?: string
  copyLabel?: string
  copiedLabel?: string
  outputLabel?: string
  placeholder?: string
  /** Что «сгенерируется»: строки с «# » — заголовки секций. */
  result?: readonly string[]
  /** Счётчик слов, пустое состояние и строка готовности. */
  wordsUnit?: string
  emptyText?: string
  doneLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Песочница AI-продукта: слева поле с расшифровкой (можно править), кнопка
// «Сделать сводку» магнитится к курсору, а в состоянии «думает» переливается
// аврора-градиентом; потом справа ответ печатается по токенам с курсором —
// каждая секция (решения, задачи, риски) выезжает отдельной карточкой
// каскадом. Внизу «скопировать» (Clipboard API) и «заново». Панели ловят
// spotlight под указателем, заголовок въезжает словами через маску при
// попадании в экран. Ответ — заданный пропсом текст: витрина поведения,
// подключить API — заменить один вызов.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="ai-002"]){
--vibeui-ai-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-ai-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-002-on-accent:oklch(from var(--vibeui-ai-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-002-muted:color-mix(in oklab,var(--vibeui-ai-002-fg) 60%,var(--vibeui-ai-002-bg));
--vibeui-ai-002-line:color-mix(in oklab,var(--vibeui-ai-002-fg) 14%,transparent);
--vibeui-ai-002-glass:color-mix(in oklab,var(--vibeui-ai-002-fg) 6%,transparent);
--vibeui-ai-002-a2:color-mix(in oklab,var(--vibeui-ai-002-accent) 40%,#a855f7);
--vibeui-ai-002-a3:color-mix(in oklab,var(--vibeui-ai-002-accent) 30%,#f472b6);
--vibeui-ai-002-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-ai-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-002"]{color-scheme:dark}
:where([data-vibeui-block="ai-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="ai-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="ai-002"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-ai-002-bg);color:var(--vibeui-ai-002-fg);font-family:var(--vibeui-ai-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="ai-002"] *{box-sizing:border-box}
[data-vibeui-block="ai-002"] [data-part="glow"]{position:absolute;right:-10%;top:-10%;width:50%;aspect-ratio:1.4;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-ai-002-a2) 22%,transparent),transparent);filter:blur(50px);pointer-events:none;opacity:0;transition:opacity 1.2s var(--vibeui-ai-002-ease)}
[data-vibeui-block="ai-002"][data-in="true"] [data-part="glow"]{opacity:1}
[data-vibeui-block="ai-002"][data-busy="true"] [data-part="glow"]{animation:vibeui-ai-002-think 1.6s ease-in-out infinite alternate}
[data-vibeui-block="ai-002"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="ai-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-ai-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-accent);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-ai-002-ease),transform .6s var(--vibeui-ai-002-ease)}
[data-vibeui-block="ai-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-ai-002-display);font-weight:800;font-size:clamp(2.2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="ai-002"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="ai-002"] [data-part="w"] span{display:inline-block;transform:translateY(112%);transition:transform .8s var(--vibeui-ai-002-ease);transition-delay:calc(var(--vibeui-ai-002-i) * .06s)}
[data-vibeui-block="ai-002"][data-in="true"] [data-part="w"] span{transform:none}
[data-vibeui-block="ai-002"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-ai-002-muted);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-ai-002-ease) .3s,transform .6s var(--vibeui-ai-002-ease) .3s}
[data-vibeui-block="ai-002"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="ai-002"][data-in="true"] [data-part="lede"]{opacity:1;transform:none}
[data-vibeui-block="ai-002"] [data-part="box"]{display:grid;gap:1rem;margin-top:2.5rem;padding:1rem;border-radius:1.4rem;background:var(--vibeui-ai-002-glass);border:1px solid var(--vibeui-ai-002-line);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgb(255 255 255 / .1) inset,0 40px 80px -50px rgb(0 0 0 / .8);opacity:0;transform:translateY(30px);transition:opacity .9s var(--vibeui-ai-002-ease) .25s,transform .9s var(--vibeui-ai-002-ease) .25s}
[data-vibeui-block="ai-002"][data-in="true"] [data-part="box"]{opacity:1;transform:none}
[data-vibeui-block="ai-002"] [data-part="pane"]{--vibeui-ai-002-x:50%;--vibeui-ai-002-y:50%;position:relative;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;gap:.7rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-ai-002-bg) 70%,transparent);border:1px solid var(--vibeui-ai-002-line);padding:1rem;min-height:20rem}
[data-vibeui-block="ai-002"] [data-part="pane"]::before{content:"";position:absolute;inset:0;background:radial-gradient(22rem circle at var(--vibeui-ai-002-x) var(--vibeui-ai-002-y),color-mix(in oklab,var(--vibeui-ai-002-accent) 12%,transparent),transparent 60%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="ai-002"] [data-part="pane"]:hover::before{opacity:1}
[data-vibeui-block="ai-002"] [data-part="pane"]>*{position:relative}
[data-vibeui-block="ai-002"] [data-part="label"]{display:flex;align-items:center;gap:.5rem;font-family:var(--vibeui-ai-002-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] [data-part="label"] i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] textarea{width:100%;min-height:13rem;resize:vertical;font:inherit;font-size:.9rem;line-height:1.5;color:inherit;background:transparent;border:0;outline:0;padding:0}
[data-vibeui-block="ai-002"] [data-part="row"]{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
[data-vibeui-block="ai-002"] [data-part="ghost"]{display:inline-flex;align-items:center;padding:.7rem 1rem;border-radius:.8rem;border:1px solid var(--vibeui-ai-002-line);background:none;color:inherit;font:inherit;font-weight:500;font-size:.9rem;cursor:pointer;transition:background .3s,transform .3s var(--vibeui-ai-002-ease),border-color .3s,color .3s}
[data-vibeui-block="ai-002"] [data-part="ghost"]:hover:not(:disabled){background:var(--vibeui-ai-002-line);transform:translateY(-1px)}
[data-vibeui-block="ai-002"] [data-part="ghost"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="ai-002"] [data-part="ghost"][data-done="true"]{border-color:var(--vibeui-ai-002-accent);color:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] [data-part="out"]{margin:0;display:grid;gap:.6rem;align-content:start;font-size:.92rem;line-height:1.6;min-height:13rem}
[data-vibeui-block="ai-002"] [data-part="sec"]{margin:0;padding:.7rem .9rem;border-radius:.8rem;border:1px solid var(--vibeui-ai-002-line);background:var(--vibeui-ai-002-glass);border-left:2px solid var(--vibeui-ai-002-accent);white-space:pre-wrap;word-break:break-word;font-family:inherit;animation:vibeui-ai-002-sec .6s var(--vibeui-ai-002-ease) both}
[data-vibeui-block="ai-002"] [data-part="sec"][data-loose="true"]{border:0;padding:0;background:none}
[data-vibeui-block="ai-002"] [data-part="sec"] b{display:block;margin-bottom:.2rem;font-family:var(--vibeui-ai-002-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] [data-part="out"] i{display:inline-block;width:.5em;height:1em;vertical-align:text-bottom;background:var(--vibeui-ai-002-accent);box-shadow:0 0 10px var(--vibeui-ai-002-accent);animation:vibeui-ai-002-cursor 1s steps(1) infinite}
[data-vibeui-block="ai-002"] [data-part="done-mark"]{display:inline-flex;align-items:center;gap:.4rem;font-family:var(--vibeui-ai-002-mono);font-size:.7rem;color:var(--vibeui-ai-002-accent);animation:vibeui-ai-002-sec .5s var(--vibeui-ai-002-ease) both}
[data-vibeui-block="ai-002"] [data-part="done-mark"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="ai-002"] [data-part="done-mark"] path{stroke-dasharray:24;stroke-dashoffset:24;animation:vibeui-ai-002-draw .5s ease-out .2s forwards}
[data-vibeui-block="ai-002"] [data-part="empty"]{margin:0;color:var(--vibeui-ai-002-muted);font-size:.9rem;align-self:center;text-align:center}
[data-vibeui-block="ai-002"] [data-part="stats"]{font-family:var(--vibeui-ai-002-mono);font-size:.7rem;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] button:focus-visible,[data-vibeui-block="ai-002"] textarea:focus-visible{outline:2px solid var(--vibeui-ai-002-accent);outline-offset:2px}
@keyframes vibeui-ai-002-sheen{to{left:100%}}
@keyframes vibeui-ai-002-cursor{50%{opacity:0}}
@keyframes vibeui-ai-002-thinking{to{background-position:300% 0}}
@keyframes vibeui-ai-002-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-ai-002-think{from{opacity:.5;transform:scale(1)}to{opacity:1;transform:scale(1.15)}}
@keyframes vibeui-ai-002-sec{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1}}
@keyframes vibeui-ai-002-draw{to{stroke-dashoffset:0}}
@container (min-width: 56rem){[data-vibeui-block="ai-002"] [data-part="box"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="ai-002"] [data-part="w"] span,[data-vibeui-block="ai-002"] [data-part="box"],[data-vibeui-block="ai-002"] [data-part="eyebrow"],[data-vibeui-block="ai-002"] [data-part="lede"]{opacity:1;transform:none}[data-vibeui-block="ai-002"] [data-part="done-mark"] path{stroke-dashoffset:0}}`

const DEFAULT_SAMPLE = `Лена: Давайте релиз перенесём на четверг, тесты не успевают.
Марк: Ок, но тогда я беру на себя миграцию базы до среды.
Оля: Мне нужны от дизайна финальные иконки к вторнику, иначе всё сдвинется.
Лена: Риск — у платёжного провайдера окно обслуживания в среду ночью.
Марк: Тогда деплой в четверг утром, после окна.`

const DEFAULT_RESULT = ["# Решения", "Релиз переносится на четверг; деплой — четверг утром, после окна провайдера.", "# Задачи", "Марк — миграция базы до среды.", "Дизайн — финальные иконки Оле до вторника.", "# Риски", "Окно обслуживания платёжного провайдера в среду ночью — проверить статус в четверг в 9:00."]

/** Песочница: вставьте расшифровку — сводка печатается по токенам. */
export function Ai002({
  eyebrow = "Песочница",
  title = "Попробуйте на своём созвоне",
  lede = "Вставьте кусок расшифровки — любой. Ответ ниже сгенерирован заранее: это витрина поведения, а не модель.",
  inputLabel = "расшифровка",
  sample = DEFAULT_SAMPLE,
  runLabel = "Сделать сводку",
  runningLabel = "Думаю…",
  resetLabel = "Заново",
  copyLabel = "Скопировать",
  copiedLabel = "Скопировано",
  outputLabel = "сводка",
  placeholder = "Вставьте расшифровку встречи…",
  result = DEFAULT_RESULT,
  wordsUnit = "слов",
  emptyText = "Нажмите «{run}» — сводка появится здесь.",
  doneLine = "готово · {n} токенов",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Ai002Props) {
  const [text, setText] = useState(sample)
  const [phase, setPhase] = useState<"idle" | "busy" | "typing" | "done">("idle")
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [seen, setSeen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const runRef = useRef<HTMLButtonElement>(null)
  const tokens = useMemo(() => result.flatMap((line) => (line.startsWith("# ") ? [line] : line.split(" ").map((word, index, all) => (index < all.length - 1 ? `${word} ` : `${word}\n`)))), [result])

  useEffect(() => {
    if (phase === "busy") {
      const timer = window.setTimeout(() => setPhase("typing"), 1400)
      return () => window.clearTimeout(timer)
    }
    if (phase !== "typing") return
    let i = 0
    let timer = 0
    const step = () => {
      i += 1
      setCount(i)
      if (i >= tokens.length) {
        setPhase("done")
        return
      }
      timer = window.setTimeout(step, tokens[i - 1].startsWith("# ") ? 380 : 40 + Math.random() * 60)
    }
    timer = window.setTimeout(step, 200)
    return () => window.clearTimeout(timer)
  }, [phase, tokens])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const onRunMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return
    const button = runRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    button.style.transform = `translate(${(dx * 7).toFixed(1)}px,${(dy * 6).toFixed(1)}px)`
  }
  const onRunLeave = () => {
    if (runRef.current) runRef.current.style.transform = ""
  }
  const onPaneMove = (event: PointerEvent<HTMLDivElement>) => {
    const pane = event.currentTarget
    const rect = pane.getBoundingClientRect()
    pane.style.setProperty("--vibeui-ai-002-x", `${event.clientX - rect.left}px`)
    pane.style.setProperty("--vibeui-ai-002-y", `${event.clientY - rect.top}px`)
  }

  // Напечатанные токены группируются по секциям: каждая секция — своя
  // карточка, которая выезжает в момент появления заголовка.
  const sections = useMemo(() => {
    const groups: { head: string | null; body: string[] }[] = []
    tokens.slice(0, count).forEach((token) => {
      if (token.startsWith("# ")) groups.push({ head: token.slice(2), body: [] })
      else {
        if (!groups.length) groups.push({ head: null, body: [] })
        groups[groups.length - 1].body.push(token)
      }
    })
    return groups
  }, [tokens, count])
  const words = title.split(" ").filter(Boolean)

  const run = () => {
    setCount(0)
    setCopied(false)
    setPhase("busy")
  }
  const reset = () => {
    setCount(0)
    setCopied(false)
    setPhase("idle")
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.map((line) => line.replace(/^# /, "")).join("\n"))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* буфер недоступен */
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-ai-002-accent": accent } : null),
    ...(ink ? { "--vibeui-ai-002-fg": ink } : null),
    ...(background ? { "--vibeui-ai-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-ai-002" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="ai-002" data-tone={tone === "auto" ? undefined : tone} data-in={seen ? "true" : undefined} data-busy={phase === "busy" ? "true" : undefined} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {words
              .map((word, index) => (
                <span key={index} data-part="w">
                  <span style={{ ["--vibeui-ai-002-i" as string]: index }}>{word}</span>
                </span>
              ))
              .flatMap((node, index) => (index ? [" ", node] : [node]))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="box">
            <div data-part="pane" onPointerMove={onPaneMove}>
              <p data-part="label">
                <i aria-hidden="true" />
                {inputLabel}
              </p>
              <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={placeholder} aria-label={inputLabel} />
              <div data-part="row">
                <Button126 data-part="run" runningLabel={runningLabel} runLabel={runLabel} phase={phase} ref={runRef} onClick={run} onPointerMove={onRunMove} onPointerLeave={onRunLeave} accent={accent} />
                <span data-part="stats">
                  {text.split(/\s+/).filter(Boolean).length} {wordsUnit}
                </span>
              </div>
            </div>
            <div data-part="pane" onPointerMove={onPaneMove}>
              <p data-part="label">
                <i aria-hidden="true" />
                {outputLabel}
              </p>
              {phase === "idle" ? (
                <p data-part="empty">{emptyText.replace("{run}", runLabel)}</p>
              ) : (
                <div data-part="out" aria-live="polite">
                  {sections.map((section, index) => (
                    <pre key={index} data-part="sec" data-loose={section.head === null ? "true" : undefined}>
                      {section.head !== null ? <b>{section.head}</b> : null}
                      {section.body.join("")}
                      {phase !== "done" && index === sections.length - 1 ? <i aria-hidden="true" /> : null}
                    </pre>
                  ))}
                  {phase === "done" ? (
                    <span data-part="done-mark">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                      {doneLine.replace("{n}", String(tokens.length))}
                    </span>
                  ) : null}
                </div>
              )}
              <div data-part="row">
                <button type="button" data-part="ghost" data-done={copied} disabled={phase !== "done"} onClick={copy}>
                  {copied ? copiedLabel : copyLabel}
                </button>
                {phase !== "idle" ? (
                  <button type="button" data-part="ghost" onClick={reset}>
                    {resetLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
