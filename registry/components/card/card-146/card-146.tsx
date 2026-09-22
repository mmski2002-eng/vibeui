import type { ComponentProps, CSSProperties } from "react"

export type Card146Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  label?: string
  isNew?: boolean
  current?: string
  currentBar?: number
  previous?: string
  previousBar?: number
  newLabel?: string
  currentName?: string
  previousName?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока comparison-016, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-146"]){
--vibeui-card-146-accent:light-dark(#111111,#f2ede4);
--vibeui-card-146-glass:color-mix(in oklab,var(--vibeui-card-146-fg) 5%,transparent);
--vibeui-card-146-line:color-mix(in oklab,var(--vibeui-card-146-fg) 12%,transparent);
--vibeui-card-146-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-146-muted:color-mix(in oklab,var(--vibeui-card-146-fg) 60%,var(--vibeui-card-146-bg));
--vibeui-card-146-on-accent:oklch(from var(--vibeui-card-146-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-146-fg:light-dark(#111111,#f2ede4);
--vibeui-card-146-bg:light-dark(#ffffff,#0a0a0a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-146"]{color-scheme:dark}
[data-vibeui-block="card-146"]{box-sizing:border-box}
[data-vibeui-block="card-146"] *{box-sizing:border-box}
@keyframes vibeui-card-146-in{from{opacity:0;transform:translateY(.8rem)}}
@keyframes vibeui-card-146-grow{from{transform:scaleX(0)}}
[data-vibeui-block="card-146"] [data-current]{color:var(--vibeui-card-146-accent)}
[data-vibeui-block="card-146"]{display:grid;gap:.8rem;padding:1.1rem 1.2rem;border-radius:1.2rem;background:var(--vibeui-card-146-glass);border:1px solid var(--vibeui-card-146-line);animation:vibeui-card-146-in .7s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--vibeui-comparison-016-i) * 60ms)}
[data-vibeui-block="card-146"] [data-part="label"]{display:flex;align-items:center;gap:.6rem;font-weight:600}
[data-vibeui-block="card-146"] [data-part="new"]{padding:.15rem .5rem;border-radius:999px;background:var(--vibeui-card-146-accent);color:var(--vibeui-card-146-on-accent);font-family:var(--vibeui-card-146-mono);font-size:.6rem;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="card-146"] [data-part="cell"]{display:grid;gap:.35rem}
[data-vibeui-block="card-146"] [data-part="cell"] span{display:flex;justify-content:space-between;gap:.6rem;font-family:var(--vibeui-card-146-mono);font-size:.82rem}
[data-vibeui-block="card-146"] [data-part="cell"] small{font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-146-muted)}
[data-vibeui-block="card-146"] [data-part="bar"]{height:.4rem;border-radius:999px;background:var(--vibeui-card-146-line);overflow:hidden}
[data-vibeui-block="card-146"] [data-part="bar"] i{display:block;height:100%;border-radius:999px;background:var(--vibeui-card-146-muted);transform-origin:left;transform:scaleX(var(--vibeui-card-146-w));animation:vibeui-card-146-grow 1.2s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--vibeui-comparison-016-i) * 80ms + .2s)}
[data-vibeui-block="card-146"] [data-part="cell"][data-current] [data-part="bar"] i{background:var(--vibeui-card-146-accent)}
[data-vibeui-block="card-146"] [data-part="cell"][data-current] span{font-weight:500}
@container (min-width: 52rem){
[data-vibeui-block="card-146"] [data-part="cell"] small{display:none}
[data-vibeui-block="card-146"] [data-part="cell"] span{justify-content:flex-start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-146"] *{animation:none!important;transition:none!important}}
`

/** Строка сравнения тарифов: подпись с меткой «новое», ячейка «сейчас» с полосой и ячейка «станет». */
export function Card146({
  label = "Яркость",
  isNew,
  current = "1 200 лм",
  currentBar,
  previous = "800 лм",
  previousBar,
  newLabel = "новое",
  currentName = "Луч 2",
  previousName = "Луч 1",
  accent,
  className,
  style,
  ...props
}: Card146Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-146-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-146" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-146" role="row"
        className={className}
        style={palette}
      >
        <div data-part="label" role="rowheader">
          {label}
          {isNew ? <span data-part="new">{newLabel}</span> : null}
        </div>
        <div data-part="cell" data-current="" role="cell">
          <span>
            <small>{currentName}</small>
            {current}
          </span>
          <div data-part="bar" aria-hidden="true">
            <i style={{ ["--vibeui-card-146-w" as string]: (currentBar ?? 100) / 100 }} />
          </div>
        </div>
        <div data-part="cell" role="cell">
          <span>
            <small>{previousName}</small>
            {previous}
          </span>
          <div data-part="bar" aria-hidden="true">
            <i style={{ ["--vibeui-card-146-w" as string]: (previousBar ?? 0) / 100 }} />
          </div>
        </div>
      </div>
    </>
  )
}
