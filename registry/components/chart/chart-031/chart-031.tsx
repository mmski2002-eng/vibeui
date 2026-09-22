import type { ComponentProps, CSSProperties } from "react"

export type Chart031Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  label?: string
  value?: number
  unit?: string
  previousLabel?: string
  previous?: number
  wasLabel?: string
  t?: number
  decimals?: number
  fraction?: number
  delta?: number | null
  accent?: string
  className?: string
  style?: CSSProperties
}

const ARC = 2 * Math.PI * 42 * 0.75

function format(value: number, decimals: number) {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

// Часть блока stats-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="chart-031"]){
--vibeui-chart-031-accent:light-dark(#111111,#f2ede4);
--vibeui-chart-031-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-chart-031-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-chart-031-panel-line:color-mix(in oklab,var(--vibeui-chart-031-on-panel) 14%,transparent);
--vibeui-chart-031-panel-muted:color-mix(in oklab,var(--vibeui-chart-031-on-panel) 55%,var(--vibeui-chart-031-panel));
--vibeui-chart-031-on-panel:var(--vibeui-chart-031-bg);
--vibeui-chart-031-panel:var(--vibeui-chart-031-fg);
--vibeui-chart-031-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-chart-031-fg:light-dark(#111111,#f2ede4);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-031"]{color-scheme:dark}
[data-vibeui-block="chart-031"]{box-sizing:border-box}
[data-vibeui-block="chart-031"] *{box-sizing:border-box}
[data-vibeui-block="chart-031"]{display:grid;justify-items:center;gap:.4rem;padding:1rem .6rem;border-radius:1.2rem;border:1px solid var(--vibeui-chart-031-panel-line);text-align:center}
[data-vibeui-block="chart-031"] [data-part="dial"]{width:min(100%,9rem);aspect-ratio:1;position:relative}
[data-vibeui-block="chart-031"] [data-part="dial"] svg{width:100%;height:100%;transform:rotate(135deg)}
[data-vibeui-block="chart-031"] [data-part="dial"] circle{fill:none;stroke-width:7;stroke-linecap:round}
[data-vibeui-block="chart-031"] [data-part="track"]{stroke:var(--vibeui-chart-031-panel-line)}
[data-vibeui-block="chart-031"] [data-part="fill"]{stroke:var(--vibeui-chart-031-accent);stroke-dashoffset:var(--vibeui-chart-031-full);transition:stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="chart-031"] [data-part="value"]{position:absolute;inset:0;display:grid;place-content:center;font-family:var(--vibeui-chart-031-display);font-weight:900;font-size:clamp(1.3rem,2.6cqi,1.9rem);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-031"] [data-part="value"] small{display:block;margin-top:.3rem;font-family:var(--vibeui-chart-031-mono);font-weight:400;font-size:.62rem;letter-spacing:.06em;color:var(--vibeui-chart-031-panel-muted)}
[data-vibeui-block="chart-031"] [data-part="label"]{margin:0;font-weight:600;font-size:.92rem}
[data-vibeui-block="chart-031"] [data-part="delta"]{margin:0;font-family:var(--vibeui-chart-031-mono);font-size:.68rem;letter-spacing:.04em;color:var(--vibeui-chart-031-panel-muted)}
[data-vibeui-block="chart-031"] [data-part="delta"] b{font-weight:500;color:var(--vibeui-chart-031-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-031"] *{animation:none!important;transition:none!important}}
`

/** Показатель-дуга: заполнение по доле, значение с единицей в центре, подпись и дельта к прошлому периоду. */
export function Chart031({
  label = "Яркость",
  value = 1200,
  unit,
  previousLabel,
  previous,
  wasLabel = "было",
  t = 1,
  decimals = 0,
  fraction = 0.7,
  delta = null,
  accent,
  className,
  style,
  ...props
}: Chart031Props) {
  const palette = {
    ...(accent ? { "--vibeui-chart-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-031" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-031"
        className={className}
        style={palette}
      >
        <div data-part="dial" style={{ ["--vibeui-chart-031-full" as string]: ARC, ["--vibeui-chart-031-off" as string]: ARC * (1 - fraction) }}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle data-part="track" cx="50" cy="50" r="42" strokeDasharray={`${ARC} 999`} />
            <circle data-part="fill" cx="50" cy="50" r="42" strokeDasharray={`${ARC} 999`} />
          </svg>
          <div data-part="value">
            {format(value * t, decimals)}
            {unit ? <small>{unit}</small> : null}
          </div>
        </div>
        <p data-part="label">{label}</p>
        {delta !== null ? (
          <p data-part="delta">
            {previousLabel ?? wasLabel} {format(previous ?? 0, decimals)} · <b>{delta >= 0 ? "+" : ""}{delta} %</b>
          </p>
        ) : null}
      </div>
    </>
  )
}
