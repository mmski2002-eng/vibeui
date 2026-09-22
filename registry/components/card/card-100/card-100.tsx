import type { ComponentProps, CSSProperties } from "react"

export type Card100Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  label?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока gadget-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-100"]){
--vibeui-card-100-ember:#ff6a2a;
--vibeui-card-100-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-100-text:color-mix(in oklab,#f2ede4,#14110f calc(var(--vibeui-card-100-day) * 100%));
--vibeui-card-100-day:0;
}
[data-vibeui-block="card-100"]{box-sizing:border-box}
[data-vibeui-block="card-100"] *{box-sizing:border-box}
@keyframes vibeui-card-100-fade{from{opacity:0;transform:translateY(.4rem)}}
[data-vibeui-block="card-100"]{margin:1rem 0 0;display:grid;gap:.25rem;min-height:4.4rem}
[data-vibeui-block="card-100"] b{font-family:var(--vibeui-card-100-mono);font-weight:500;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-card-100-ember) 60%,var(--vibeui-card-100-text))}
[data-vibeui-block="card-100"] p{margin:0;font-size:1rem;opacity:.85;animation:vibeui-card-100-fade .5s ease-out}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-100"] *{animation:none!important;transition:none!important}}
`

/** Подпись шага sticky-сцены: метка и текст, текст проявляется при смене. */
export function Card100({
  label,
  text,
  accent,
  className,
  style,
  ...props
}: Card100Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-100-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-100" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-100" aria-live="polite"
        className={className}
        style={palette}
      >
        <b>{label}</b>
        <p key={label}>{text}</p>
      </div>
    </>
  )
}
