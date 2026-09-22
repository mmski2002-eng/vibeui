import type { ComponentProps, CSSProperties } from "react"

export type Card145Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  suffix?: string
  shown?: readonly number[]
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

// Часть блока comparison-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-145"]){
--vibeui-card-145-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-145-line:color-mix(in oklab,var(--vibeui-card-145-fg) 16%,transparent);
--vibeui-card-145-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-145-muted:color-mix(in oklab,var(--vibeui-card-145-fg) 62%,var(--vibeui-card-145-bg));
--vibeui-card-145-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-145-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-145"]{color-scheme:dark}
[data-vibeui-block="card-145"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-145"] *{box-sizing:border-box}
[data-vibeui-block="card-145"]{display:grid;gap:.2rem;padding:1.2rem 1.4rem;border-bottom:1px solid var(--vibeui-card-145-line)}
[data-vibeui-block="card-145"]:last-child{border-bottom:0}
[data-vibeui-block="card-145"] b{font-family:var(--vibeui-card-145-mono);font-weight:600;font-size:clamp(2.2rem,5cqi,3.4rem);letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-145"] b small{font-size:.5em;letter-spacing:0;color:var(--vibeui-card-145-accent);margin-left:.15em}
[data-vibeui-block="card-145"] span{font-family:var(--vibeui-card-145-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-145-muted)}
@container (min-width: 40rem){
[data-vibeui-block="card-145"]:last-child{border-right:0}
}
@container (min-width: 60rem){
[data-vibeui-block="card-145"]:last-child{border-bottom:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-145"] *{animation:none!important;transition:none!important}}
`

/** Показатель: число с суффиксом, набегающее при появлении, и подпись. */
export function Card145({
  label = "объектов сдано",
  suffix = "",
  shown = [42],
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card145Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-145-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-145" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-145"
        className={className}
        style={palette}
      >
        <b>
          {formatNumber(shown[index] ?? 0)}
          {suffix ? <small>{suffix}</small> : null}
        </b>
        <span>{label}</span>
      </li>
    </>
  )
}
