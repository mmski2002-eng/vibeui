import type { ComponentProps, CSSProperties } from "react"

export type Card095Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  name?: string
  start?: number
  weeks?: number
  weeksLabel?: string
  week?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока renovation-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-095"]){
--vibeui-card-095-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-095-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-095-line:color-mix(in oklab,var(--vibeui-card-095-fg) 16%,transparent);
--vibeui-card-095-muted:color-mix(in oklab,var(--vibeui-card-095-fg) 62%,var(--vibeui-card-095-bg));
--vibeui-card-095-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-095"]{color-scheme:dark}
[data-vibeui-block="card-095"]{box-sizing:border-box}
[data-vibeui-block="card-095"] *{box-sizing:border-box}
[data-vibeui-block="card-095"]{display:contents}
[data-vibeui-block="card-095"] [data-part="name"]{display:flex;align-items:center;gap:.4rem;min-height:2.4rem;padding:.35rem .6rem;border-right:1px solid var(--vibeui-card-095-line);border-bottom:1px solid var(--vibeui-card-095-line);font-size:.8rem;font-weight:500;line-height:1.2;transition:color .2s}
[data-vibeui-block="card-095"] [data-part="name"] svg{flex-shrink:0;width:.85rem;height:.85rem;color:var(--vibeui-card-095-accent);opacity:0;transform:scale(.5);transition:opacity .25s,transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-095"][data-state="done"] [data-part="name"] svg{opacity:1;transform:scale(1)}
[data-vibeui-block="card-095"][data-state="todo"] [data-part="name"]{color:var(--vibeui-card-095-muted)}
[data-vibeui-block="card-095"][data-state="now"] [data-part="name"]{font-weight:700}
[data-vibeui-block="card-095"] [data-part="lane"]{position:relative;border-bottom:1px solid var(--vibeui-card-095-line);background-image:repeating-linear-gradient(90deg,transparent 0 calc(100% / var(--vibeui-renovation-002-total) - 1px),var(--vibeui-card-095-line) calc(100% / var(--vibeui-renovation-002-total) - 1px) calc(100% / var(--vibeui-renovation-002-total)))}
[data-vibeui-block="card-095"] [data-part="bar"]{position:absolute;top:.55rem;bottom:.55rem;left:calc(var(--vibeui-card-095-start) / var(--vibeui-renovation-002-total) * 100%);width:calc(var(--vibeui-card-095-len) / var(--vibeui-renovation-002-total) * 100%);border:1px solid color-mix(in oklab,var(--vibeui-card-095-fg) 40%,transparent);background:color-mix(in oklab,var(--vibeui-card-095-fg) 6%,transparent);overflow:hidden;transition:border-color .3s}
[data-vibeui-block="card-095"] [data-part="bar"]::after{content:"";position:absolute;inset:0;background:var(--vibeui-card-095-accent);transform:scaleX(var(--vibeui-card-095-p));transform-origin:left;transition:transform .15s linear}
[data-vibeui-block="card-095"][data-state="now"] [data-part="bar"]{border-color:var(--vibeui-card-095-fg)}
@container (min-width: 60rem){
[data-vibeui-block="card-095"] [data-part="name"]{font-size:.9rem;min-height:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-095"] *{animation:none!important;transition:none!important}}
`

/** Строка диаграммы Ганта: название этапа с галочкой, дорожка и полоса прогресса по неделям; состояние done/now/todo. */
export function Card095({
  name = "Демонтаж",
  start = 0,
  weeks = 1,
  weeksLabel = "недели {from}–{to}",
  week = 0,
  accent,
  className,
  style,
  ...props
}: Card095Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-095-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-095" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-095" role="row"
        className={className}
        style={palette}
      >
        <div data-part="name" role="rowheader">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8.5l3.5 3.5L13 5" />
          </svg>
          {name}
        </div>
        <div
          data-part="lane"
          role="cell"
          aria-label={weeksLabel.replace("{from}", String(start + 1)).replace("{to}", String(Math.ceil(start + weeks)))}
          style={{ ["--vibeui-card-095-start" as string]: start, ["--vibeui-card-095-len" as string]: weeks }}
        >
          <div data-part="bar" style={{ ["--vibeui-card-095-p" as string]: Math.min(1, Math.max(0, (week - start) / weeks)).toFixed(3) }} />
        </div>
      </div>
    </>
  )
}
