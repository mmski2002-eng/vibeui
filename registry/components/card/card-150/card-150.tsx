"use client"

import type { ComponentProps, CSSProperties, PointerEvent } from "react"

export type Card150Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  kind?: "wave" | "text" | "tasks"
  meta?: string
  text?: string
  tasks?: readonly string[]
  stage?: number
  onNodeMove?: (event: PointerEvent<HTMLDivElement>) => void
  onNodeLeave?: (event: PointerEvent<HTMLDivElement>) => void
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока ai-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-150"]){
--vibeui-card-150-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-150-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-150-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-150-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-150-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-150-glass:color-mix(in oklab,var(--vibeui-card-150-fg) 6%,transparent);
--vibeui-card-150-line:color-mix(in oklab,var(--vibeui-card-150-fg) 14%,transparent);
--vibeui-card-150-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-150-muted:color-mix(in oklab,var(--vibeui-card-150-fg) 60%,var(--vibeui-card-150-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-150"]{color-scheme:dark}
[data-vibeui-block="card-150"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-150"] *{box-sizing:border-box}
@keyframes vibeui-card-150-wave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@keyframes vibeui-card-150-type{0%{transform:scaleX(0)}40%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-card-150-flow-v{to{top:100%}}
@keyframes vibeui-card-150-flow-h{to{left:100%}}
@keyframes vibeui-card-150-check{0%,30%{background:transparent;color:transparent}45%,85%{background:var(--vibeui-card-150-accent);color:var(--vibeui-card-150-bg);border-color:transparent}100%{background:transparent;color:transparent}}
[data-vibeui-block="card-150"]{display:contents}
[data-vibeui-block="card-150"] [data-part="node"]{position:relative;opacity:.42;transform:translateY(14px) scale(.97);transition:opacity .7s var(--vibeui-card-150-ease),transform .7s var(--vibeui-card-150-ease)}
[data-vibeui-block="card-150"] [data-part="node"][data-lit="true"]{opacity:1;transform:none}
[data-vibeui-block="card-150"] [data-part="card"]{--vibeui-card-150-rx:0deg;--vibeui-card-150-ry:0deg;position:relative;height:100%;padding:1.5rem;border-radius:1.3rem;background:var(--vibeui-card-150-glass);border:1px solid var(--vibeui-card-150-line);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgb(255 255 255 / .1) inset;display:grid;gap:1rem;align-content:start;transform:perspective(1000px) rotateX(var(--vibeui-card-150-rx)) rotateY(var(--vibeui-card-150-ry));transition:transform .25s ease-out,border-color .7s,box-shadow .7s;transform-style:preserve-3d;will-change:transform}
[data-vibeui-block="card-150"] [data-part="node"][data-lit="true"] [data-part="card"]{border-color:color-mix(in oklab,var(--vibeui-card-150-accent) 45%,transparent);box-shadow:0 1px 0 rgb(255 255 255 / .14) inset,0 30px 60px -30px var(--vibeui-card-150-accent),0 0 0 1px color-mix(in oklab,var(--vibeui-card-150-accent) 12%,transparent)}
[data-vibeui-block="card-150"] [data-part="node"][data-lit="true"][data-last="true"] [data-part="card"]{box-shadow:0 1px 0 rgb(255 255 255 / .14) inset,0 40px 80px -30px var(--vibeui-card-150-accent),0 0 40px -10px color-mix(in oklab,var(--vibeui-card-150-accent) 55%,transparent)}
[data-vibeui-block="card-150"] [data-part="num"]{position:absolute;top:1.1rem;right:1.2rem;font-family:var(--vibeui-card-150-mono);font-size:.7rem;letter-spacing:.08em;color:var(--vibeui-card-150-muted);transition:color .5s}
[data-vibeui-block="card-150"] [data-part="node"][data-lit="true"] [data-part="num"]{color:var(--vibeui-card-150-accent)}
[data-vibeui-block="card-150"] [data-part="node"] h3{margin:0;font-family:var(--vibeui-card-150-display);font-size:1.25rem;font-weight:700}
[data-vibeui-block="card-150"] [data-part="node"] p{margin:0;color:var(--vibeui-card-150-muted);font-size:.92rem}
[data-vibeui-block="card-150"] [data-part="meta"]{font-family:var(--vibeui-card-150-mono);font-size:.7rem;color:var(--vibeui-card-150-accent)}
[data-vibeui-block="card-150"] [data-part="demo"]{height:5.5rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-card-150-bg) 70%,transparent);border:1px solid var(--vibeui-card-150-line);display:grid;align-items:center;padding:.8rem 1rem;overflow:hidden;transform:translateZ(18px)}
[data-vibeui-block="card-150"] [data-part="demo"] i,[data-vibeui-block="card-150"] [data-part="demo"] span i{animation-play-state:paused}
[data-vibeui-block="card-150"] [data-part="node"][data-lit="true"] [data-part="demo"] i{animation-play-state:running}
[data-vibeui-block="card-150"] [data-demo="wave"]{grid-auto-flow:column;gap:3px;align-items:center;justify-content:center}
[data-vibeui-block="card-150"] [data-demo="wave"] i{width:4px;height:60%;border-radius:2px;background:var(--vibeui-card-150-accent);transform:scaleY(.3);animation:vibeui-card-150-wave 1s ease-in-out infinite alternate;animation-delay:calc(var(--vibeui-card-150-i) * -.09s)}
[data-vibeui-block="card-150"] [data-demo="text"]{gap:.45rem;align-content:center}
[data-vibeui-block="card-150"] [data-demo="text"] i{display:block;height:.45rem;border-radius:3px;background:color-mix(in oklab,var(--vibeui-card-150-fg) 30%,transparent);transform-origin:left;transform:scaleX(0);animation:vibeui-card-150-type 3s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-150-i) * .4s)}
[data-vibeui-block="card-150"] [data-demo="text"] i:nth-child(1){width:90%}
[data-vibeui-block="card-150"] [data-demo="text"] i:nth-child(2){width:70%}
[data-vibeui-block="card-150"] [data-demo="text"] i:nth-child(3){width:80%}
[data-vibeui-block="card-150"] [data-demo="tasks"]{gap:.4rem;align-content:center}
[data-vibeui-block="card-150"] [data-demo="tasks"] span{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--vibeui-card-150-muted)}
[data-vibeui-block="card-150"] [data-demo="tasks"] i{width:1rem;height:1rem;border-radius:4px;border:1px solid var(--vibeui-card-150-line);display:grid;place-items:center;font-size:.6rem;font-style:normal;color:transparent;animation:vibeui-card-150-check 4s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-150-i) * .6s)}
[data-vibeui-block="card-150"] [data-part="link"]{position:relative;height:2.6rem;margin:0 auto;width:2px;background:var(--vibeui-card-150-line);overflow:hidden;transition:background .5s}
[data-vibeui-block="card-150"] [data-part="link"]::after{content:"";position:absolute;left:0;top:-40%;width:100%;height:40%;background:linear-gradient(180deg,transparent,var(--vibeui-card-150-accent));opacity:0;animation:vibeui-card-150-flow-v 1.2s linear infinite;animation-play-state:paused;transition:opacity .3s}
[data-vibeui-block="card-150"] [data-part="link"][data-run="true"]::after{opacity:1;animation-play-state:running}
[data-vibeui-block="card-150"] [data-part="link"][data-done="true"]{background:color-mix(in oklab,var(--vibeui-card-150-accent) 55%,transparent)}
@container (min-width: 56rem){
[data-vibeui-block="card-150"] [data-part="link"]{height:2px;width:3.5rem;align-self:center}
[data-vibeui-block="card-150"] [data-part="link"]::after{top:0;left:-40%;width:40%;height:100%;background:linear-gradient(90deg,transparent,var(--vibeui-card-150-accent));animation:vibeui-card-150-flow-h 1.2s linear infinite;animation-play-state:paused}
[data-vibeui-block="card-150"] [data-part="link"][data-run="true"]::after{animation-play-state:running}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-150"] [data-demo="text"] i{transform:none}
[data-vibeui-block="card-150"] [data-demo="wave"] i{transform:none}
[data-vibeui-block="card-150"] [data-part="node"]{opacity:1;transform:none}
[data-vibeui-block="card-150"] [data-part="card"]{transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-150"] *{animation:none!important;transition:none!important}}
`

/** Шаг конвейера: связка с предыдущим, узел с номером, карточка с содержимым по виду шага; подсветка по data-lit/data-run. */
export function Card150({
  title = "Слушает встречу",
  kind,
  meta,
  text = "Подключается к Zoom, Meet или Телемосту как участник. Или берёт запись.",
  tasks = ["Миграция базы — Марк", "Иконки — дизайн", "Окно провайдера — риск"],
  stage = 2,
  onNodeMove,
  onNodeLeave,
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card150Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-150-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-150" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-150"
        className={className}
        style={palette}
      >
        {index > 0 ? <div data-part="link" data-run={stage === index ? "true" : undefined} data-done={stage > index ? "true" : undefined} aria-hidden="true" /> : null}
        <div data-part="node" data-lit={index < stage ? "true" : undefined} data-last={index === stage - 1 ? "true" : undefined}>
          <div data-part="card" onPointerMove={onNodeMove} onPointerLeave={onNodeLeave}>
          <span data-part="num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div data-part="demo" data-demo={kind} aria-hidden="true">
            {kind === "wave" ? Array.from({ length: 24 }, (_, i) => <i key={i} style={{ ["--vibeui-card-150-i" as string]: i }} />) : null}
            {kind === "text" ? [0, 1, 2].map((i) => <i key={i} style={{ ["--vibeui-card-150-i" as string]: i }} />) : null}
            {kind === "tasks"
              ? tasks.map((task, i) => (
                  <span key={task}>
                    <i style={{ ["--vibeui-card-150-i" as string]: i }}>✓</i>
                    {task}
                  </span>
                ))
              : null}
          </div>
          <div>
            {meta ? <div data-part="meta">{meta}</div> : null}
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          </div>
        </div>
      </li>
    </>
  )
}
