import type { ComponentProps, CSSProperties } from "react"

export type Card078Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  time?: string
  label?: string
  on?: boolean
  live?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-078"]){
--vibeui-card-078-accent:light-dark(#111111,#f2ede4);
--vibeui-card-078-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-card-078-line:color-mix(in oklab,var(--vibeui-card-078-fg) 12%,transparent);
--vibeui-card-078-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-078-muted:color-mix(in oklab,var(--vibeui-card-078-fg) 60%,var(--vibeui-card-078-bg));
--vibeui-card-078-fg:light-dark(#111111,#f2ede4);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-078"]{color-scheme:dark}
[data-vibeui-block="card-078"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-078"] *{box-sizing:border-box}
@keyframes vibeui-card-078-toggle{0%,40%{background:var(--vibeui-card-078-line)}55%,100%{background:var(--vibeui-card-078-accent)}}
@keyframes vibeui-card-078-knob{0%,40%{transform:none}55%,100%{transform:translateX(.85rem)}}
[data-vibeui-block="card-078"]{display:flex;align-items:center;justify-content:space-between;gap:.6rem;padding:.55rem 0;border-top:1px solid var(--vibeui-card-078-line)}
[data-vibeui-block="card-078"]:first-of-type{border-top:0}
[data-vibeui-block="card-078"] b{display:block;font-family:var(--vibeui-card-078-mono);font-weight:500;font-size:1.05rem;letter-spacing:-.02em}
[data-vibeui-block="card-078"] small{display:block;font-size:.66rem;color:var(--vibeui-card-078-muted)}
[data-vibeui-block="card-078"] [data-part="toggle"]{position:relative;flex-shrink:0;width:2rem;height:1.15rem;border-radius:999px;background:var(--vibeui-card-078-line)}
[data-vibeui-block="card-078"] [data-part="toggle"]::after{content:"";position:absolute;top:.15rem;left:.15rem;width:.85rem;height:.85rem;border-radius:50%;background:var(--vibeui-card-078-bg);box-shadow:0 1px 3px rgb(0 0 0/.4);transition:transform .3s}
[data-vibeui-block="card-078"] [data-part="toggle"][data-on="true"]{background:var(--vibeui-card-078-accent)}
[data-vibeui-block="card-078"] [data-part="toggle"][data-on="true"]::after{transform:translateX(.85rem)}
[data-vibeui-block="card-078"] [data-part="toggle"][data-live="true"]{animation:vibeui-card-078-toggle 4s ease-in-out infinite}
[data-vibeui-block="card-078"] [data-part="toggle"][data-live="true"]::after{animation:vibeui-card-078-knob 4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-078"] *{animation:none!important;transition:none!important}}
`

/** Строка будильника из экрана приложения: время, подпись и переключатель с состоянием on/off и живым последним. */
export function Card078({
  time = "06:00",
  label = "Будни · рассвет 30 мин",
  on,
  live,
  accent,
  className,
  style,
  ...props
}: Card078Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-078-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-078" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-078"
        className={className}
        style={palette}
      >
        <span>
          <b>{time}</b>
          <small>{label}</small>
        </span>
        <i data-part="toggle" data-on={on ? "true" : "false"} data-live={live ? "true" : undefined} />
      </div>
    </>
  )
}
