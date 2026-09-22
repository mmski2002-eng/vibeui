import type { ComponentProps, CSSProperties } from "react"

export type Card041Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  caption?: string
  value?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-041"]){
--vibeui-card-041-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-card-041-muted:light-dark(oklch(0.47 0.02 70),oklch(0.73 0.014 80));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-041"]{color-scheme:dark}
[data-vibeui-block="card-041"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-041"] *{box-sizing:border-box}
[data-vibeui-block="card-041"] dt{font-size:clamp(1.5rem,3.6cqi,2rem);line-height:1;letter-spacing:-0.03em;font-weight:730;
color:var(--vibeui-card-041-accent);}
[data-vibeui-block="card-041"] dd{margin:0.375rem 0 0;color:var(--vibeui-card-041-muted);font-size:0.875rem;line-height:1.45;max-width:26ch;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-041"] *{animation:none!important;transition:none!important}}
`

/** Пара «значение — подпись» для ряда метрик под большой цитатой: крупное число и мелкая подпись. */
export function Card041({
  caption = "страниц собрано за первый квартал",
  value = "17",
  accent,
  className,
  style,
  ...props
}: Card041Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-041-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-041" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-041"
        className={className}
        style={palette}
      >
        <dt>{value}</dt>
        <dd>{caption}</dd>
      </div>
    </>
  )
}
