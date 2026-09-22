import type { ComponentProps, CSSProperties } from "react"

export type Card075Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  title?: string
  wide?: boolean
  text?: string
  demo?: "rows" | "sort" | "group" | "types" | "size" | "theme" | "none"
  sizeOthers?: readonly [string, string]
  kbUnit?: string
  featureIndex?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function Demo({ kind, sizeOthers, kbUnit }: { kind: NonNullable<Card075Feature["demo"]>; sizeOthers: readonly [string, string]; kbUnit: string }) {
  const row = (key: number) => (
    <div key={key} data-part="row">
      <i />
      <i />
      <i />
    </div>
  )
  if (kind === "rows")
    return (
      <div data-part="demo" data-demo="rows" aria-hidden="true">
        <div data-part="stack">{Array.from({ length: 12 }, (_, i) => row(i))}</div>
      </div>
    )
  if (kind === "sort")
    return (
      <div data-part="demo" data-demo="sort" aria-hidden="true">
        {[0, 1, 2].map(row)}
      </div>
    )
  if (kind === "group")
    return (
      <div data-part="demo" data-demo="group" aria-hidden="true">
        <div data-part="row" data-head="true">
          pdf · 2
        </div>
        <div data-part="fold">
          <div>{[0, 1].map(row)}</div>
        </div>
        <div data-part="row" data-head="true">
          image · 3
        </div>
      </div>
    )
  if (kind === "types")
    return (
      <div data-part="demo" data-demo="types" aria-hidden="true">
        <div>
          <span data-part="typed">
            row.<b>size</b>
          </span>
          <i data-part="caret" />
        </div>
        <div data-part="tip">
          (property) size: <u>number</u>
        </div>
      </div>
    )
  if (kind === "size")
    return (
      <div data-part="demo" data-demo="size" aria-hidden="true">
        {[
          ["tabl", 0.12, "4.1"],
          [sizeOthers[0], 0.55, "19"],
          [sizeOthers[1], 1, "38"],
        ].map(([name, w, kb]) => (
          <div key={String(name)}>
            <span>{name}</span>
            <i style={{ ["--vibeui-card-075-w" as string]: w }} />
            <span>{kb} {kbUnit}</span>
          </div>
        ))}
      </div>
    )
  if (kind === "theme")
    return (
      <div data-part="demo" data-demo="theme" aria-hidden="true">
        <div data-part="switch">
          <span>
            <i>theme: light</i>
            <i>theme: dark</i>
          </span>
          <b data-part="knob" />
        </div>
        <div>{[0, 1, 2].map(row)}</div>
      </div>
    )
  return null
}

// Часть блока bento-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
export type Card075Feature = {
  title: string
  text: string
  /** Микродемо на CSS: rows — бегущие строки, sort — строки меняются местами, group — свёртка, types — подсказка типов «печатается», size — линейка, theme — тема переключается, none. */
  demo?: "rows" | "sort" | "group" | "types" | "size" | "theme" | "none"
  /** Плитка на две колонки. */
  wide?: boolean
}

const STYLES = `
:where([data-vibeui-block="card-075"]){
--vibeui-card-075-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-075-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-075-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-075-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-075-line:color-mix(in oklab,var(--vibeui-card-075-fg) 12%,transparent);
--vibeui-card-075-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-075-muted:color-mix(in oklab,var(--vibeui-card-075-fg) 60%,var(--vibeui-card-075-bg));
--vibeui-card-075-panel:color-mix(in oklab,var(--vibeui-card-075-fg) 4%,var(--vibeui-card-075-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-075"]{color-scheme:dark}
[data-vibeui-block="card-075"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-075"] *{box-sizing:border-box}
@keyframes vibeui-card-075-upward{0%,35%{transform:none}65%,100%{transform:translateY(-200%)}}
@keyframes vibeui-card-075-type{0%{width:0}55%,100%{width:8ch}}
@keyframes vibeui-card-075-tip{0%,62%{opacity:0;transform:translateY(.35rem)}78%,100%{opacity:1;transform:none}}
@keyframes vibeui-card-075-theme{0%,38%{background:#ffffff;color:#1a1a1a}62%,100%{background:#0f1117;color:#e6e8ee}}
@keyframes vibeui-card-075-scroll{to{transform:translateY(-50%)}}
@keyframes vibeui-card-075-lbl-b{0%,50%{opacity:0}51%,100%{opacity:1}}
@keyframes vibeui-card-075-lbl-a{0%,50%{opacity:1}51%,100%{opacity:0}}
@keyframes vibeui-card-075-knob{0%,38%{transform:none}62%,100%{transform:translateX(.8rem)}}
@keyframes vibeui-card-075-fold{0%,35%{grid-template-rows:1fr}65%,100%{grid-template-rows:0fr}}
@keyframes vibeui-card-075-down{0%,35%{transform:none}65%,100%{transform:translateY(200%)}}
@keyframes vibeui-card-075-chev{0%,35%{transform:none}65%,100%{transform:rotate(-90deg)}}
@keyframes vibeui-card-075-caret{50%{opacity:0}}
@keyframes vibeui-card-075-blink{0%,35%{opacity:0}55%,100%{opacity:1}}
[data-vibeui-block="card-075"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.6rem;background:var(--vibeui-card-075-bg);min-height:17rem;transition:background .3s;overflow:hidden}
[data-vibeui-block="card-075"]::before{content:"";position:absolute;inset:0;background:radial-gradient(26rem circle at var(--vibeui-card-075-x,50%) var(--vibeui-card-075-y,50%),color-mix(in oklab,var(--vibeui-card-075-accent) 12%,transparent),transparent 55%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="card-075"] > *{position:relative}
[data-vibeui-block="card-075"] h3{margin:0;font-size:1.2rem;font-weight:700;letter-spacing:-.015em}
[data-vibeui-block="card-075"] p{margin:0;color:var(--vibeui-card-075-muted);font-size:.93rem}
[data-vibeui-block="card-075"] [data-part="demo"]{margin-top:auto;height:6.8rem;border-radius:10px;border:1px solid var(--vibeui-card-075-line);background:var(--vibeui-card-075-panel);overflow:hidden;position:relative;font-family:var(--vibeui-card-075-mono);font-size:.72rem;color:var(--vibeui-card-075-muted);transition:transform .5s var(--vibeui-card-075-ease),border-color .3s}
[data-vibeui-block="card-075"]:hover [data-part="demo"]{transform:translateY(-3px);border-color:color-mix(in oklab,var(--vibeui-card-075-accent) 35%,var(--vibeui-card-075-line))}
[data-vibeui-block="card-075"] [data-part="row"]{display:flex;gap:.6rem;align-items:center;padding:.45rem .8rem;border-bottom:1px solid var(--vibeui-card-075-line);background:var(--vibeui-card-075-bg)}
[data-vibeui-block="card-075"] [data-part="row"] i{display:block;height:.45rem;border-radius:3px;background:var(--vibeui-card-075-line)}
[data-vibeui-block="card-075"] [data-part="row"] i:first-child{width:38%}
[data-vibeui-block="card-075"] [data-part="row"] i:nth-child(2){width:18%}
[data-vibeui-block="card-075"] [data-part="row"] i:nth-child(3){width:24%;margin-left:auto;background:color-mix(in oklab,var(--vibeui-card-075-accent) 45%,var(--vibeui-card-075-line))}
[data-vibeui-block="card-075"] [data-demo="rows"] [data-part="stack"]{animation:vibeui-card-075-scroll 6s linear infinite}
[data-vibeui-block="card-075"] [data-demo="rows"]::after{content:"virtual · 12 of 48 000";position:absolute;right:.6rem;bottom:.5rem;padding:.15rem .4rem;border-radius:4px;background:var(--vibeui-card-075-accent);color:var(--vibeui-card-075-bg);font-size:.62rem}
[data-vibeui-block="card-075"] [data-demo="sort"] [data-part="row"]:nth-child(1){animation:vibeui-card-075-down 4.5s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="sort"] [data-part="row"]:nth-child(3){animation:vibeui-card-075-upward 4.5s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="sort"]::after{content:"size ↓";position:absolute;right:.6rem;top:.5rem;color:var(--vibeui-card-075-accent);font-size:.62rem;animation:vibeui-card-075-blink 4.5s ease infinite alternate}
[data-vibeui-block="card-075"] [data-demo="group"] [data-part="row"][data-head="true"]{color:var(--vibeui-card-075-accent);cursor:default}
[data-vibeui-block="card-075"] [data-demo="group"] [data-part="row"][data-head="true"]::before{content:"▾";display:inline-block;animation:vibeui-card-075-chev 5s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="group"] [data-part="fold"]{display:grid;grid-template-rows:1fr;animation:vibeui-card-075-fold 5s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="group"] [data-part="fold"] > div{overflow:hidden}
[data-vibeui-block="card-075"] [data-demo="types"]{padding:.9rem;font-size:.8rem;color:var(--vibeui-card-075-fg)}
[data-vibeui-block="card-075"] [data-demo="types"] [data-part="typed"]{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;width:8ch;animation:vibeui-card-075-type 3.6s steps(8) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="types"] b{color:var(--vibeui-card-075-accent);font-weight:500}
[data-vibeui-block="card-075"] [data-demo="types"] [data-part="caret"]{display:inline-block;width:.5em;height:1.05em;vertical-align:text-bottom;background:var(--vibeui-card-075-accent);animation:vibeui-card-075-caret 1s steps(1) infinite}
[data-vibeui-block="card-075"] [data-demo="types"] [data-part="tip"]{position:absolute;left:1.8rem;top:2.9rem;padding:.5rem .7rem;border-radius:6px;background:var(--vibeui-card-075-fg);color:var(--vibeui-card-075-bg);font-size:.68rem;white-space:nowrap;box-shadow:0 10px 24px -10px rgb(0 0 0 / .5);animation:vibeui-card-075-tip 3.6s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="types"] [data-part="tip"] u{text-decoration:none;color:#7ee787}
[data-vibeui-block="card-075"] [data-demo="size"]{display:grid;align-content:center;gap:.5rem;padding:.9rem}
[data-vibeui-block="card-075"] [data-demo="size"] div{display:grid;grid-template-columns:5rem 1fr auto;gap:.6rem;align-items:center}
[data-vibeui-block="card-075"] [data-demo="size"] i{display:block;height:.5rem;border-radius:3px;background:var(--vibeui-card-075-line);width:calc(var(--vibeui-card-075-w) * 100%);transform-origin:left;transform:scaleX(0);transition:transform 1s var(--vibeui-card-075-ease);transition-delay:calc(.5s + var(--vibeui-card-075-w) * .3s)}
[data-vibeui-block="card-075"] [data-demo="size"] div:first-child i{background:var(--vibeui-card-075-accent)}
[data-vibeui-block="card-075"] [data-demo="theme"]{display:grid;grid-template-rows:auto 1fr;animation:vibeui-card-075-theme 5s var(--vibeui-card-075-ease) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="row"]{background:transparent;border-color:color-mix(in oklab,currentColor 14%,transparent)}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="row"] i{background:currentColor;opacity:.16}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="row"] i:nth-child(3){background:var(--vibeui-card-075-accent);opacity:.7}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="switch"]{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.45rem .8rem;border-bottom:1px solid color-mix(in oklab,currentColor 14%,transparent);font-size:.62rem}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="switch"] span{display:grid}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="switch"] span > i{grid-area:1/1;font-style:normal}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="switch"] span > i:first-child{animation:vibeui-card-075-lbl-a 5s steps(1) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="switch"] span > i:last-child{animation:vibeui-card-075-lbl-b 5s steps(1) infinite alternate}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="knob"]{position:relative;width:1.8rem;height:1rem;border-radius:999px;background:var(--vibeui-card-075-accent);flex:none}
[data-vibeui-block="card-075"] [data-demo="theme"] [data-part="knob"]::after{content:"";position:absolute;top:.15rem;left:.15rem;width:.7rem;height:.7rem;border-radius:50%;background:#fff;animation:vibeui-card-075-knob 5s var(--vibeui-card-075-ease) infinite alternate}
@container (min-width: 44rem){
[data-vibeui-block="card-075"][data-wide="true"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-075"] [data-demo="size"] i{transform:none}
[data-vibeui-block="card-075"] [data-demo="types"] [data-part="tip"]{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-075"] *{animation:none!important;transition:none!important}}
`

/** Плитка bento-сетки с заголовком, текстом и живой демонстрацией: сжатие, форматы, батч или загрузка — по значению demo. Широкая вариация по data-wide. */
export function Card075({
  title = "Виртуализация из коробки",
  wide,
  text = "48 000 строк рендерятся как 12: в DOM только то, что в окне. Включается сама, когда строк больше двухсот.",
  demo,
  sizeOthers = ["другие", "ещё одни"],
  kbUnit = "кб",
  accent,
  className,
  style,
  ...props
}: Card075Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-075-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-075" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-075" data-wide={wide ?? false} data-reveal=""
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p>{text}</p>
        {demo && demo !== "none" ? <Demo kind={demo} sizeOthers={sizeOthers} kbUnit={kbUnit} /> : null}
      </article>
    </>
  )
}
