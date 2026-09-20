"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Ai001Step = {
  title: string
  text: string
  /** Микроанимация узла: wave — волна звука, text — печатающиеся строки, tasks — галочки задач. */
  kind: "wave" | "text" | "tasks"
  /** Подпись-время: «≈ 2 мин». */
  meta?: string
}

export type Ai001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Ai001Step[]
  /** Счётчик шагов и задачи в демо третьего шага. */
  stepLine?: string
  tasks?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как это работает» конвейером: три стеклянных узла — звук, текст, задачи, —
// между ними линии, по которым бегут точки. Конвейер зажигается по
// прокрутке: на широком экране сцена прилипает, а по мере прокрутки узлы
// загораются по очереди, на узком — каждый узел загорается, когда доходит
// до нижней трети экрана. Точки бегут только по линии к следующему узлу,
// микроанимации внутри (волна, строки, галочки) играют только в зажжённых.
// Узлы наклоняются за курсором (3D-tilt), заголовок въезжает словами через
// маску, когда секция попадает в экран.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="ai-001"]){
--vibeui-ai-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-ai-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-001-muted:color-mix(in oklab,var(--vibeui-ai-001-fg) 60%,var(--vibeui-ai-001-bg));
--vibeui-ai-001-line:color-mix(in oklab,var(--vibeui-ai-001-fg) 14%,transparent);
--vibeui-ai-001-glass:color-mix(in oklab,var(--vibeui-ai-001-fg) 6%,transparent);
--vibeui-ai-001-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-ai-001-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-001-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-001"]{color-scheme:dark}
:where([data-vibeui-block="ai-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="ai-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="ai-001"]{box-sizing:border-box;position:relative;background:var(--vibeui-ai-001-bg);color:var(--vibeui-ai-001-fg);font-family:var(--vibeui-ai-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="ai-001"] *{box-sizing:border-box}
[data-vibeui-block="ai-001"] [data-part="track"]{position:relative}
[data-vibeui-block="ai-001"] [data-part="scene"]{position:relative;padding:5rem 0;overflow:hidden}
[data-vibeui-block="ai-001"] [data-part="glow"]{position:absolute;left:50%;top:40%;width:60%;aspect-ratio:2;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-ai-001-accent) 14%,transparent),transparent);filter:blur(40px);pointer-events:none;opacity:0;transition:opacity 1.2s var(--vibeui-ai-001-ease)}
[data-vibeui-block="ai-001"][data-in="true"] [data-part="glow"]{opacity:1}
[data-vibeui-block="ai-001"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="ai-001"] [data-part="head"]{display:grid;gap:.5rem}
[data-vibeui-block="ai-001"] [data-part="eyebrow"]{margin:0 0 .3rem;font-family:var(--vibeui-ai-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-001-accent);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-ai-001-ease),transform .6s var(--vibeui-ai-001-ease)}
[data-vibeui-block="ai-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-ai-001-display);font-weight:800;font-size:clamp(2.2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="ai-001"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="ai-001"] [data-part="w"] span{display:inline-block;transform:translateY(112%);transition:transform .8s var(--vibeui-ai-001-ease);transition-delay:calc(var(--vibeui-ai-001-i) * .06s)}
[data-vibeui-block="ai-001"][data-in="true"] [data-part="w"] span{transform:none}
[data-vibeui-block="ai-001"] [data-part="lede"]{margin:.6rem 0 0;max-width:34rem;color:var(--vibeui-ai-001-muted);opacity:0;transform:translateY(10px);transition:opacity .6s var(--vibeui-ai-001-ease) .3s,transform .6s var(--vibeui-ai-001-ease) .3s}
[data-vibeui-block="ai-001"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="ai-001"][data-in="true"] [data-part="lede"]{opacity:1;transform:none}
[data-vibeui-block="ai-001"] [data-part="counter"]{margin:1.2rem 0 0;font-family:var(--vibeui-ai-001-mono);font-size:.72rem;letter-spacing:.08em;color:var(--vibeui-ai-001-muted);display:flex;align-items:center;gap:.7rem}
[data-vibeui-block="ai-001"] [data-part="counter"] i{position:relative;display:block;width:6rem;height:2px;background:var(--vibeui-ai-001-line);overflow:hidden}
[data-vibeui-block="ai-001"] [data-part="counter"] i::after{content:"";position:absolute;inset:0;background:var(--vibeui-ai-001-accent);transform-origin:left;transform:scaleX(var(--vibeui-ai-001-p,0));transition:transform .5s var(--vibeui-ai-001-ease)}
[data-vibeui-block="ai-001"] [data-part="flow"]{display:grid;gap:0;margin:2.5rem 0 0;padding:0;list-style:none;grid-template-columns:1fr}
[data-vibeui-block="ai-001"] [data-part="step"]{display:contents}
[data-vibeui-block="ai-001"] [data-part="node"]{position:relative;opacity:.42;transform:translateY(14px) scale(.97);transition:opacity .7s var(--vibeui-ai-001-ease),transform .7s var(--vibeui-ai-001-ease)}
[data-vibeui-block="ai-001"] [data-part="node"][data-lit="true"]{opacity:1;transform:none}
[data-vibeui-block="ai-001"] [data-part="card"]{--vibeui-ai-001-rx:0deg;--vibeui-ai-001-ry:0deg;position:relative;height:100%;padding:1.5rem;border-radius:1.3rem;background:var(--vibeui-ai-001-glass);border:1px solid var(--vibeui-ai-001-line);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgb(255 255 255 / .1) inset;display:grid;gap:1rem;align-content:start;transform:perspective(1000px) rotateX(var(--vibeui-ai-001-rx)) rotateY(var(--vibeui-ai-001-ry));transition:transform .25s ease-out,border-color .7s,box-shadow .7s;transform-style:preserve-3d;will-change:transform}
[data-vibeui-block="ai-001"] [data-part="node"][data-lit="true"] [data-part="card"]{border-color:color-mix(in oklab,var(--vibeui-ai-001-accent) 45%,transparent);box-shadow:0 1px 0 rgb(255 255 255 / .14) inset,0 30px 60px -30px var(--vibeui-ai-001-accent),0 0 0 1px color-mix(in oklab,var(--vibeui-ai-001-accent) 12%,transparent)}
[data-vibeui-block="ai-001"] [data-part="node"][data-lit="true"][data-last="true"] [data-part="card"]{box-shadow:0 1px 0 rgb(255 255 255 / .14) inset,0 40px 80px -30px var(--vibeui-ai-001-accent),0 0 40px -10px color-mix(in oklab,var(--vibeui-ai-001-accent) 55%,transparent)}
[data-vibeui-block="ai-001"] [data-part="num"]{position:absolute;top:1.1rem;right:1.2rem;font-family:var(--vibeui-ai-001-mono);font-size:.7rem;letter-spacing:.08em;color:var(--vibeui-ai-001-muted);transition:color .5s}
[data-vibeui-block="ai-001"] [data-part="node"][data-lit="true"] [data-part="num"]{color:var(--vibeui-ai-001-accent)}
[data-vibeui-block="ai-001"] [data-part="node"] h3{margin:0;font-family:var(--vibeui-ai-001-display);font-size:1.25rem;font-weight:700}
[data-vibeui-block="ai-001"] [data-part="node"] p{margin:0;color:var(--vibeui-ai-001-muted);font-size:.92rem}
[data-vibeui-block="ai-001"] [data-part="meta"]{font-family:var(--vibeui-ai-001-mono);font-size:.7rem;color:var(--vibeui-ai-001-accent)}
[data-vibeui-block="ai-001"] [data-part="demo"]{height:5.5rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-ai-001-bg) 70%,transparent);border:1px solid var(--vibeui-ai-001-line);display:grid;align-items:center;padding:.8rem 1rem;overflow:hidden;transform:translateZ(18px)}
[data-vibeui-block="ai-001"] [data-part="demo"] i,[data-vibeui-block="ai-001"] [data-part="demo"] span i{animation-play-state:paused}
[data-vibeui-block="ai-001"] [data-part="node"][data-lit="true"] [data-part="demo"] i{animation-play-state:running}
[data-vibeui-block="ai-001"] [data-demo="wave"]{grid-auto-flow:column;gap:3px;align-items:center;justify-content:center}
[data-vibeui-block="ai-001"] [data-demo="wave"] i{width:4px;height:60%;border-radius:2px;background:var(--vibeui-ai-001-accent);transform:scaleY(.3);animation:vibeui-ai-001-wave 1s ease-in-out infinite alternate;animation-delay:calc(var(--vibeui-ai-001-i) * -.09s)}
[data-vibeui-block="ai-001"] [data-demo="text"]{gap:.45rem;align-content:center}
[data-vibeui-block="ai-001"] [data-demo="text"] i{display:block;height:.45rem;border-radius:3px;background:color-mix(in oklab,var(--vibeui-ai-001-fg) 30%,transparent);transform-origin:left;transform:scaleX(0);animation:vibeui-ai-001-type 3s ease-in-out infinite;animation-delay:calc(var(--vibeui-ai-001-i) * .4s)}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(1){width:90%}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(2){width:70%}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(3){width:80%}
[data-vibeui-block="ai-001"] [data-demo="tasks"]{gap:.4rem;align-content:center}
[data-vibeui-block="ai-001"] [data-demo="tasks"] span{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--vibeui-ai-001-muted)}
[data-vibeui-block="ai-001"] [data-demo="tasks"] i{width:1rem;height:1rem;border-radius:4px;border:1px solid var(--vibeui-ai-001-line);display:grid;place-items:center;font-size:.6rem;font-style:normal;color:transparent;animation:vibeui-ai-001-check 4s ease-in-out infinite;animation-delay:calc(var(--vibeui-ai-001-i) * .6s)}
[data-vibeui-block="ai-001"] [data-part="link"]{position:relative;height:2.6rem;margin:0 auto;width:2px;background:var(--vibeui-ai-001-line);overflow:hidden;transition:background .5s}
[data-vibeui-block="ai-001"] [data-part="link"]::after{content:"";position:absolute;left:0;top:-40%;width:100%;height:40%;background:linear-gradient(180deg,transparent,var(--vibeui-ai-001-accent));opacity:0;animation:vibeui-ai-001-flow-v 1.2s linear infinite;animation-play-state:paused;transition:opacity .3s}
[data-vibeui-block="ai-001"] [data-part="link"][data-run="true"]::after{opacity:1;animation-play-state:running}
[data-vibeui-block="ai-001"] [data-part="link"][data-done="true"]{background:color-mix(in oklab,var(--vibeui-ai-001-accent) 55%,transparent)}
@keyframes vibeui-ai-001-wave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@keyframes vibeui-ai-001-type{0%{transform:scaleX(0)}40%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-ai-001-check{0%,30%{background:transparent;color:transparent}45%,85%{background:var(--vibeui-ai-001-accent);color:var(--vibeui-ai-001-bg);border-color:transparent}100%{background:transparent;color:transparent}}
@keyframes vibeui-ai-001-flow-v{to{top:100%}}
@keyframes vibeui-ai-001-flow-h{to{left:100%}}
@container (min-width: 56rem){
[data-vibeui-block="ai-001"] [data-part="track"]{min-height:190svh}
[data-vibeui-block="ai-001"] [data-part="scene"]{position:sticky;top:0;min-height:100svh;display:grid;align-content:center;padding:6rem 0}
[data-vibeui-block="ai-001"] [data-part="head"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:end;gap:2rem}
[data-vibeui-block="ai-001"] [data-part="lede"]{margin:0 0 .35rem}
[data-vibeui-block="ai-001"] [data-part="counter"]{grid-column:1/-1}
[data-vibeui-block="ai-001"] [data-part="flow"]{grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch;margin-top:3rem}
[data-vibeui-block="ai-001"] [data-part="link"]{height:2px;width:3.5rem;align-self:center}
[data-vibeui-block="ai-001"] [data-part="link"]::after{top:0;left:-40%;width:40%;height:100%;background:linear-gradient(90deg,transparent,var(--vibeui-ai-001-accent));animation:vibeui-ai-001-flow-h 1.2s linear infinite;animation-play-state:paused}
[data-vibeui-block="ai-001"] [data-part="link"][data-run="true"]::after{animation-play-state:running}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="ai-001"] [data-demo="text"] i{transform:none}[data-vibeui-block="ai-001"] [data-demo="wave"] i{transform:none}[data-vibeui-block="ai-001"] [data-part="node"]{opacity:1;transform:none}[data-vibeui-block="ai-001"] [data-part="card"]{transform:none}[data-vibeui-block="ai-001"] [data-part="w"] span{transform:none}[data-vibeui-block="ai-001"] [data-part="eyebrow"],[data-vibeui-block="ai-001"] [data-part="lede"],[data-vibeui-block="ai-001"] [data-part="glow"]{opacity:1;transform:none}}`

const DEFAULT_STEPS: Ai001Step[] = [
  { title: "Слушает встречу", text: "Подключается к Zoom, Meet или Телемосту как участник. Или берёт запись.", kind: "wave", meta: "во время созвона" },
  { title: "Понимает, о чём речь", text: "Расшифровка с ролями, выделение решений, задач, сроков и рисков.", kind: "text", meta: "≈ 40 секунд после" },
  { title: "Раскладывает по местам", text: "Задачи — в Jira или Notion, сводка — в Telegram, решения — в базу.", kind: "tasks", meta: "без единого клика" },
]

/** «Как это работает» — конвейер из трёх узлов, который зажигается по прокрутке. */
export function Ai001({
  eyebrow = "Как это работает",
  title = "Три шага, ни одного вашего",
  lede = "Вы просто заканчиваете созвон. Всё остальное происходит, пока вы идёте за кофе.",
  steps = DEFAULT_STEPS,
  stepLine = "шаг {n} / {total}",
  tasks = ["Миграция базы — Марк", "Иконки — дизайн", "Окно провайдера — риск"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Ai001Props) {
  const [stage, setStage] = useState(0)
  const [seen, setSeen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const total = steps.length

  useEffect(() => {
    const track = trackRef.current
    const scene = sceneRef.current
    if (!track || !scene) return
    let raf = 0
    const measure = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const viewport = window.innerHeight
      const spare = rect.height - scene.offsetHeight
      let next: number
      if (spare > 80) {
        // Сцена прилипла: доля пройденной «лишней» высоты трека → номер шага.
        const progress = Math.min(1, Math.max(0, (viewport * 0.25 - rect.top) / spare))
        next = Math.min(total, Math.floor(progress * (total + 1)))
      } else {
        const nodes = track.querySelectorAll<HTMLElement>('[data-part="node"]')
        next = 0
        nodes.forEach((node) => {
          if (node.getBoundingClientRect().top < viewport * 0.8) next += 1
        })
      }
      setStage((current) => (current === next ? current : next))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure)
    }
    let listening = false
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        if (visible) setSeen(true)
        if (visible && !listening) {
          listening = true
          window.addEventListener("scroll", onScroll, { passive: true })
          window.addEventListener("resize", onScroll)
          onScroll()
        } else if (!visible && listening) {
          listening = false
          window.removeEventListener("scroll", onScroll)
          window.removeEventListener("resize", onScroll)
        }
      },
      { rootMargin: "10% 0px 10% 0px" },
    )
    observer.observe(track)
    return () => {
      observer.disconnect()
      if (listening) {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
      }
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [total])

  const onNodeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const node = event.currentTarget
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty("--vibeui-ai-001-rx", `${(-y * 8).toFixed(2)}deg`)
    node.style.setProperty("--vibeui-ai-001-ry", `${(x * 10).toFixed(2)}deg`)
  }
  const onNodeLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--vibeui-ai-001-rx", "0deg")
    event.currentTarget.style.setProperty("--vibeui-ai-001-ry", "0deg")
  }

  const words = title.split(" ").filter(Boolean)
  const palette = {
    ...(accent ? { "--vibeui-ai-001-accent": accent } : null),
    ...(ink ? { "--vibeui-ai-001-fg": ink } : null),
    ...(background ? { "--vibeui-ai-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-ai-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="ai-001" data-tone={tone === "auto" ? undefined : tone} data-in={seen ? "true" : undefined} className={className} style={palette}>
        <div ref={trackRef} data-part="track">
          <div ref={sceneRef} data-part="scene">
            <div data-part="glow" aria-hidden="true" />
            <div data-part="shell">
              <div data-part="head">
                <div>
                  {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                  <h2 data-part="title">
                    {words.map((word, index) => (
                      <span key={index} data-part="w">
                        <span style={{ ["--vibeui-ai-001-i" as string]: index }}>{word}</span>
                      </span>
                    )).flatMap((node, index) => (index ? [" ", node] : [node]))}
                  </h2>
                </div>
                {lede ? <p data-part="lede">{lede}</p> : null}
                <p data-part="counter" aria-live="polite">
                  <i aria-hidden="true" style={{ ["--vibeui-ai-001-p" as string]: total ? stage / total : 0 }} />
                  {stepLine.replace("{n}", String(Math.min(Math.max(stage, 1), total))).replace("{total}", String(total))}
                </p>
              </div>
              <ol data-part="flow">
                {steps.map((step, index) => (
                  <li key={step.title} data-part="step">
                    {index > 0 ? <div data-part="link" data-run={stage === index ? "true" : undefined} data-done={stage > index ? "true" : undefined} aria-hidden="true" /> : null}
                    <div data-part="node" data-lit={index < stage ? "true" : undefined} data-last={index === stage - 1 ? "true" : undefined}>
                      <div data-part="card" onPointerMove={onNodeMove} onPointerLeave={onNodeLeave}>
                      <span data-part="num" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div data-part="demo" data-demo={step.kind} aria-hidden="true">
                        {step.kind === "wave" ? Array.from({ length: 24 }, (_, i) => <i key={i} style={{ ["--vibeui-ai-001-i" as string]: i }} />) : null}
                        {step.kind === "text" ? [0, 1, 2].map((i) => <i key={i} style={{ ["--vibeui-ai-001-i" as string]: i }} />) : null}
                        {step.kind === "tasks"
                          ? tasks.map((task, i) => (
                              <span key={task}>
                                <i style={{ ["--vibeui-ai-001-i" as string]: i }}>✓</i>
                                {task}
                              </span>
                            ))
                          : null}
                      </div>
                      <div>
                        {step.meta ? <div data-part="meta">{step.meta}</div> : null}
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
