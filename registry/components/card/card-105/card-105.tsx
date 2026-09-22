import type { ComponentProps, CSSProperties } from "react"

export type Card105Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  beforeLabel?: string
  hoursUnit?: string
  beforeNote?: string
  afterLabel?: string
  afterNote?: string
  tick?: number
  targets?: readonly number[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока app-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-105"]){
--vibeui-card-105-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-105-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-105-muted:color-mix(in oklab,var(--vibeui-card-105-fg) 60%,var(--vibeui-card-105-bg));
--vibeui-card-105-p:0.5;
--vibeui-card-105-panel:color-mix(in oklab,var(--vibeui-card-105-fg) 5%,var(--vibeui-card-105-bg));
--vibeui-card-105-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-105-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-105"]{color-scheme:dark}
[data-vibeui-block="card-105"]{box-sizing:border-box}
[data-vibeui-block="card-105"] *{box-sizing:border-box}
@keyframes vibeui-card-105-rise{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="card-105"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.8rem}
[data-vibeui-block="card-105"] div{padding:1.1rem 1.2rem;border-radius:1.1rem;background:var(--vibeui-card-105-panel);transition:opacity .3s,transform .3s}
[data-vibeui-block="card-105"][data-in="true"] div{animation:vibeui-card-105-rise .8s cubic-bezier(.2,.8,.2,1) backwards}
[data-vibeui-block="card-105"][data-in="true"] div:last-child{animation-delay:.12s}
[data-vibeui-block="card-105"] div:first-child{opacity:calc(1 - var(--vibeui-card-105-p) * .6)}
[data-vibeui-block="card-105"] div:last-child{opacity:calc(.4 + var(--vibeui-card-105-p) * .6);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-card-105-accent) 50%,transparent) inset,0 20px 40px -30px color-mix(in oklab,var(--vibeui-card-105-accent) 60%,transparent)}
[data-vibeui-block="card-105"] small{display:block;font-family:var(--vibeui-card-105-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-105-muted)}
[data-vibeui-block="card-105"] b{display:block;margin-top:.3rem;font-size:2rem;font-weight:800;letter-spacing:-.03em;line-height:1.1;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-105"] div:last-child b{color:var(--vibeui-card-105-accent)}
[data-vibeui-block="card-105"] span{font-size:.82rem;color:var(--vibeui-card-105-muted)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-105"] div{opacity:1!important;transform:none!important}
[data-vibeui-block="card-105"] div:first-child{opacity:calc(1 - var(--vibeui-card-105-p) * .6)!important}
[data-vibeui-block="card-105"] div:last-child{opacity:calc(.4 + var(--vibeui-card-105-p) * .6)!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-105"] *{animation:none!important;transition:none!important}}
`

/** Две колонки итогов «до» и «после»: подпись, часы с анимацией счёта и заметка. */
export function Card105({
  beforeLabel = "до",
  hoursUnit = "ч",
  beforeNote = "засыпали за 48 мин",
  afterLabel = "после",
  afterNote = "засыпают за 12 мин",
  tick = 1,
  targets = [6.4, 4.1],
  accent,
  className,
  style,
  ...props
}: Card105Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-105-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-105" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-105" data-reveal=""
        className={className}
        style={palette}
      >
        <div>
          <small>{beforeLabel}</small>
          <b>{(targets[0] * tick).toFixed(1)} {hoursUnit}</b>
          <span>{beforeNote}</span>
        </div>
        <div>
          <small>{afterLabel}</small>
          <b>{(targets[1] * tick).toFixed(1)} {hoursUnit}</b>
          <span>{afterNote}</span>
        </div>
      </div>
    </>
  )
}
