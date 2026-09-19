import type { CSSProperties } from "react"

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
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как это работает» конвейером: три стеклянных узла — звук, текст, задачи, —
// между ними линии, по которым бегут точки (keyframes по offset-path через
// background-position), внутри каждого узла своя микроанимация на CSS:
// волна из полосок, строки, которые проявляются, галочки, которые
// ставятся по очереди. На узком — вертикально, линии тоже поворачиваются.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="ai-001"]){
--vibeui-ai-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-ai-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-001-muted:color-mix(in oklab,var(--vibeui-ai-001-fg) 60%,var(--vibeui-ai-001-bg));
--vibeui-ai-001-line:color-mix(in oklab,var(--vibeui-ai-001-fg) 14%,transparent);
--vibeui-ai-001-glass:color-mix(in oklab,var(--vibeui-ai-001-fg) 6%,transparent);
--vibeui-ai-001-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-001-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-001"]{color-scheme:dark}
:where([data-vibeui-block="ai-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="ai-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="ai-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-ai-001-bg);color:var(--vibeui-ai-001-fg);font-family:var(--vibeui-ai-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="ai-001"] *{box-sizing:border-box}
[data-vibeui-block="ai-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="ai-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-ai-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-001-accent)}
[data-vibeui-block="ai-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-ai-001-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="ai-001"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-ai-001-muted)}
[data-vibeui-block="ai-001"] [data-part="flow"]{display:grid;gap:0;margin:2.5rem 0 0;padding:0;list-style:none;grid-template-columns:1fr}
[data-vibeui-block="ai-001"] [data-part="step"]{display:contents}
[data-vibeui-block="ai-001"] [data-part="node"]{position:relative;padding:1.5rem;border-radius:1.2rem;background:var(--vibeui-ai-001-glass);border:1px solid var(--vibeui-ai-001-line);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgb(255 255 255 / .1) inset;display:grid;gap:1rem}
[data-vibeui-block="ai-001"] [data-part="node"] h3{margin:0;font-family:var(--vibeui-ai-001-display);font-size:1.2rem;font-weight:700}
[data-vibeui-block="ai-001"] [data-part="node"] p{margin:0;color:var(--vibeui-ai-001-muted);font-size:.92rem}
[data-vibeui-block="ai-001"] [data-part="meta"]{font-family:var(--vibeui-ai-001-mono);font-size:.7rem;color:var(--vibeui-ai-001-accent)}
[data-vibeui-block="ai-001"] [data-part="demo"]{height:5.5rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-ai-001-bg) 70%,transparent);border:1px solid var(--vibeui-ai-001-line);display:grid;align-items:center;padding:.8rem 1rem;overflow:hidden}
[data-vibeui-block="ai-001"] [data-demo="wave"]{grid-auto-flow:column;gap:3px;align-items:center;justify-content:center}
[data-vibeui-block="ai-001"] [data-demo="wave"] i{width:4px;height:60%;border-radius:2px;background:var(--vibeui-ai-001-accent);animation:vibeui-ai-001-wave 1s ease-in-out infinite alternate;animation-delay:calc(var(--vibeui-ai-001-i) * -.09s)}
[data-vibeui-block="ai-001"] [data-demo="text"]{gap:.45rem;align-content:center}
[data-vibeui-block="ai-001"] [data-demo="text"] i{display:block;height:.45rem;border-radius:3px;background:color-mix(in oklab,var(--vibeui-ai-001-fg) 30%,transparent);transform-origin:left;animation:vibeui-ai-001-type 3s ease-in-out infinite;animation-delay:calc(var(--vibeui-ai-001-i) * .4s)}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(1){width:90%}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(2){width:70%}
[data-vibeui-block="ai-001"] [data-demo="text"] i:nth-child(3){width:80%}
[data-vibeui-block="ai-001"] [data-demo="tasks"]{gap:.4rem;align-content:center}
[data-vibeui-block="ai-001"] [data-demo="tasks"] span{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--vibeui-ai-001-muted)}
[data-vibeui-block="ai-001"] [data-demo="tasks"] i{width:1rem;height:1rem;border-radius:4px;border:1px solid var(--vibeui-ai-001-line);display:grid;place-items:center;font-size:.6rem;font-style:normal;color:var(--vibeui-ai-001-bg);animation:vibeui-ai-001-check 4s ease-in-out infinite;animation-delay:calc(var(--vibeui-ai-001-i) * .6s)}
[data-vibeui-block="ai-001"] [data-part="link"]{position:relative;height:2.6rem;margin:0 auto;width:2px;background:var(--vibeui-ai-001-line);overflow:hidden}
[data-vibeui-block="ai-001"] [data-part="link"]::after{content:"";position:absolute;left:0;top:-40%;width:100%;height:40%;background:linear-gradient(180deg,transparent,var(--vibeui-ai-001-accent));animation:vibeui-ai-001-flow-v 1.4s linear infinite}
@keyframes vibeui-ai-001-wave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@keyframes vibeui-ai-001-type{0%{transform:scaleX(0)}40%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-ai-001-check{0%,30%{background:transparent;color:transparent}45%,85%{background:var(--vibeui-ai-001-accent);color:var(--vibeui-ai-001-bg);border-color:transparent}100%{background:transparent;color:transparent}}
@keyframes vibeui-ai-001-flow-v{to{top:100%}}
@keyframes vibeui-ai-001-flow-h{to{left:100%}}
@container (min-width: 56rem){
[data-vibeui-block="ai-001"] [data-part="flow"]{grid-template-columns:1fr auto 1fr auto 1fr;align-items:stretch}
[data-vibeui-block="ai-001"] [data-part="link"]{height:2px;width:3.5rem;align-self:center}
[data-vibeui-block="ai-001"] [data-part="link"]::after{top:0;left:-40%;width:40%;height:100%;background:linear-gradient(90deg,transparent,var(--vibeui-ai-001-accent));animation:vibeui-ai-001-flow-h 1.4s linear infinite}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="ai-001"] [data-demo="text"] i{transform:none}}`

const DEFAULT_STEPS: Ai001Step[] = [
  { title: "Слушает встречу", text: "Подключается к Zoom, Meet или Телемосту как участник. Или берёт запись.", kind: "wave", meta: "во время созвона" },
  { title: "Понимает, о чём речь", text: "Расшифровка с ролями, выделение решений, задач, сроков и рисков.", kind: "text", meta: "≈ 40 секунд после" },
  { title: "Раскладывает по местам", text: "Задачи — в Jira или Notion, сводка — в Telegram, решения — в базу.", kind: "tasks", meta: "без единого клика" },
]

/** «Как это работает» — конвейер из трёх узлов с бегущими точками. */
export function Ai001({
  eyebrow = "Как это работает",
  title = "Три шага, ни одного вашего",
  lede = "Вы просто заканчиваете созвон. Всё остальное происходит, пока вы идёте за кофе.",
  steps = DEFAULT_STEPS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Ai001Props) {
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
      <section data-vibeui-block="ai-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ol data-part="flow">
            {steps.map((step, index) => (
              <li key={step.title} data-part="step">
                {index > 0 ? <div data-part="link" aria-hidden="true" /> : null}
                <div data-part="node">
                  <div data-part="demo" data-demo={step.kind} aria-hidden="true">
                    {step.kind === "wave" ? Array.from({ length: 24 }, (_, i) => <i key={i} style={{ ["--vibeui-ai-001-i" as string]: i }} />) : null}
                    {step.kind === "text" ? [0, 1, 2].map((i) => <i key={i} style={{ ["--vibeui-ai-001-i" as string]: i }} />) : null}
                    {step.kind === "tasks"
                      ? ["Миграция базы — Марк", "Иконки — дизайн", "Окно провайдера — риск"].map((task, i) => (
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
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
