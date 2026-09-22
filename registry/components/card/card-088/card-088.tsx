import type { ComponentProps, CSSProperties } from "react"

export type Card088Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  text?: string
  duration?: string
  result?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока auto-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-088"]){
--vibeui-card-088-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-088-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-088-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-088-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-088-glass:color-mix(in oklab,var(--vibeui-card-088-fg) 5%,transparent);
--vibeui-card-088-line:color-mix(in oklab,var(--vibeui-card-088-fg) 12%,transparent);
--vibeui-card-088-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-088-muted:color-mix(in oklab,var(--vibeui-card-088-fg) 60%,var(--vibeui-card-088-bg));
--vibeui-card-088-on-accent:oklch(from var(--vibeui-card-088-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-088"]{color-scheme:dark}
[data-vibeui-block="card-088"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-088"] *{box-sizing:border-box}
[data-vibeui-block="card-088"]{position:relative;display:grid;gap:.5rem;padding:1.3rem 1.4rem;border-radius:1.2rem;border:1px solid var(--vibeui-card-088-line);background:var(--vibeui-card-088-glass);opacity:.45;transform:translateX(.6rem);transition:opacity .5s,transform .6s cubic-bezier(.2,.8,.2,1),border-color .4s}
[data-vibeui-block="card-088"][data-on="true"]{opacity:1;transform:none;border-color:color-mix(in oklab,var(--vibeui-card-088-accent) 40%,var(--vibeui-card-088-line))}
[data-vibeui-block="card-088"] [data-part="num"]{position:absolute;left:-3.2rem;top:1rem;width:2.3rem;height:2.3rem;border-radius:50%;display:grid;place-items:center;border:2px solid var(--vibeui-card-088-line);background:var(--vibeui-card-088-bg);font-family:var(--vibeui-card-088-mono);font-size:.78rem;font-weight:500;color:var(--vibeui-card-088-muted);transition:background .4s,color .4s,border-color .4s,box-shadow .4s}
[data-vibeui-block="card-088"][data-on="true"] [data-part="num"]{background:var(--vibeui-card-088-accent);border-color:var(--vibeui-card-088-accent);color:var(--vibeui-card-088-on-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-card-088-accent) 20%,transparent)}
[data-vibeui-block="card-088"] h3{margin:0;font-family:var(--vibeui-card-088-display);font-weight:700;font-size:1.15rem;letter-spacing:-.01em}
[data-vibeui-block="card-088"] p{margin:0;color:var(--vibeui-card-088-muted)}
[data-vibeui-block="card-088"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.4rem .6rem;margin:.3rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-card-088-mono);font-size:.72rem;color:var(--vibeui-card-088-muted)}
[data-vibeui-block="card-088"] [data-part="facts"] li{padding:.3rem .6rem;border-radius:999px;border:1px solid var(--vibeui-card-088-line)}
[data-vibeui-block="card-088"] [data-part="facts"] li[data-kind="result"]{color:var(--vibeui-card-088-fg);border-color:color-mix(in oklab,var(--vibeui-card-088-accent) 50%,transparent)}
@container (min-width: 56rem){
[data-vibeui-block="card-088"] [data-part="num"]{left:-4rem;width:2.7rem;height:2.7rem;font-size:.85rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-088"] *{animation:none!important;transition:none!important}}
`

/** Шаг процесса: номер, заголовок и текст; пройденные подсвечены по data-on. */
export function Card088({
  title = "Осмотр под лампой",
  text = "Заезжаете в бокс, мастер смотрит кузов под софитами, меряет толщину лака, показывает проблемные места и фиксирует цену.",
  duration = "20 минут",
  result = "смета в мессенджер",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card088Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-088-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-088" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-088"
        className={className}
        style={palette}
      >
        <span data-part="num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{title}</h3>
        <p>{text}</p>
        {duration || result ? (
          <ul data-part="facts">
            {duration ? <li>{duration}</li> : null}
            {result ? <li data-kind="result">{result}</li> : null}
          </ul>
        ) : null}
      </li>
    </>
  )
}
