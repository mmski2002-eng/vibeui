import type { ComponentProps, CSSProperties } from "react"

export type Card098Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  ours?: boolean
  currency?: string
  perYearLabel?: string
  fee?: number
  maxFee?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatMoney(value: number, currency: string) {
  const digits = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${value < 0 ? "−" : ""}${digits} ${currency}`
}

// Часть блока fintech-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-098"]){
--vibeui-card-098-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-098-aurora:linear-gradient(90deg,var(--vibeui-card-098-accent),var(--vibeui-card-098-mint));
--vibeui-card-098-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-098-line:color-mix(in oklab,var(--vibeui-card-098-fg) 11%,transparent);
--vibeui-card-098-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-098-muted:color-mix(in oklab,var(--vibeui-card-098-fg) 62%,var(--vibeui-card-098-bg));
--vibeui-card-098-mint:color-mix(in oklab,var(--vibeui-card-098-accent) 45%,#99f6e4);
--vibeui-card-098-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-098"]{color-scheme:dark}
[data-vibeui-block="card-098"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-098"] *{box-sizing:border-box}
[data-vibeui-block="card-098"]{display:grid;gap:.4rem;font-size:.85rem}
[data-vibeui-block="card-098"] header{display:flex;justify-content:space-between;gap:1rem;color:var(--vibeui-card-098-muted)}
[data-vibeui-block="card-098"][data-ours="true"] header{color:var(--vibeui-card-098-fg);font-weight:600}
[data-vibeui-block="card-098"] header b{font-family:var(--vibeui-card-098-mono);font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="card-098"] [data-part="track"]{height:.7rem;border-radius:999px;background:var(--vibeui-card-098-line);overflow:hidden}
[data-vibeui-block="card-098"] [data-part="fill"]{display:block;height:100%;border-radius:999px;background:color-mix(in oklab,var(--vibeui-card-098-fg) 35%,transparent);transform-origin:left;transform:scaleX(var(--vibeui-card-098-w));transition:transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-098"][data-ours="true"] [data-part="fill"]{background:var(--vibeui-card-098-aurora);box-shadow:0 0 18px color-mix(in oklab,var(--vibeui-card-098-accent) 50%,transparent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-098"] *{animation:none!important;transition:none!important}}
`

/** Строка сравнения комиссий: название банка, сумма в год и полоса относительно максимума; свой банк выделен по data-ours. */
export function Card098({
  name = "Ось · Рост",
  ours,
  currency = "₽",
  perYearLabel = "/ год",
  fee,
  maxFee,
  accent,
  className,
  style,
  ...props
}: Card098Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-098-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-098" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-098" data-ours={ours ? "true" : undefined}
        className={className}
        style={palette}
      >
        <header>
          <span>{name}</span>
          <b>{formatMoney(fee, currency)} {perYearLabel}</b>
        </header>
        <div data-part="track">
          <i data-part="fill" style={{ ["--vibeui-card-098-w" as string]: Math.max(0.02, fee / maxFee) }} />
        </div>
      </li>
    </>
  )
}
