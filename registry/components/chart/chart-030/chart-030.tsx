import type { ComponentProps, CSSProperties } from "react"

export type Chart030Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  label?: string
  percent?: number
  value?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="chart-030"]){
--vibeui-chart-030-accent:light-dark(#111111,#f2ede4);
--vibeui-chart-030-fg:light-dark(#111111,#f2ede4);
--vibeui-chart-030-line:color-mix(in oklab,var(--vibeui-chart-030-fg) 12%,transparent);
--vibeui-chart-030-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-chart-030-muted:color-mix(in oklab,var(--vibeui-chart-030-fg) 60%,var(--vibeui-chart-030-bg));
--vibeui-chart-030-bg:light-dark(#ffffff,#0a0a0a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-030"]{color-scheme:dark}
[data-vibeui-block="chart-030"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="chart-030"] *{box-sizing:border-box}
@keyframes vibeui-chart-030-fill{from{--vibeui-chart-030-v:0%}}
[data-vibeui-block="chart-030"]{display:grid;gap:.4rem;justify-items:center;font-family:var(--vibeui-chart-030-mono);font-size:.68rem;color:var(--vibeui-chart-030-muted);text-align:center}
[data-vibeui-block="chart-030"] i{display:block;position:relative;width:4.2rem;height:4.2rem;border-radius:50%;background:conic-gradient(var(--vibeui-chart-030-accent) var(--vibeui-chart-030-v),var(--vibeui-chart-030-line) 0);mask:radial-gradient(farthest-side,transparent 70%,#000 72%);-webkit-mask:radial-gradient(farthest-side,transparent 70%,#000 72%);animation:vibeui-chart-030-fill 1.6s cubic-bezier(.2,.7,.2,1) both}
[data-vibeui-block="chart-030"] b{position:absolute;inset:0;display:grid;place-items:center;font-weight:500;font-size:.72rem;color:var(--vibeui-chart-030-fg)}
[data-vibeui-block="chart-030"] [data-part="wrap"]{position:relative;display:block;width:4.2rem;height:4.2rem}
@property --vibeui-chart-030-v{syntax:"<percentage>";inherits:false;initial-value:0%}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-030"] *{animation:none!important;transition:none!important}}
`

/** Кольцевой индикатор датчика: дуга на процент, значение в центре и подпись под кольцом. */
export function Chart030({
  label = "CO₂, ppm",
  percent,
  value = "640",
  accent,
  className,
  style,
  ...props
}: Chart030Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-030-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-030" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-030"
        className={className}
        style={palette}
      >
        <span data-part="wrap">
          <i style={{ ["--vibeui-bento-012-v" as string]: `${percent}%` }} aria-hidden="true" />
          <b>{value}</b>
        </span>
        {label}
      </div>
    </>
  )
}
