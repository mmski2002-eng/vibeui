import type { ComponentProps, CSSProperties } from "react"

export type Underline001Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  contactLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="underline-001"]){
--vibeui-underline-001-dur-2:180ms;
}
[data-vibeui-block="underline-001"]{box-sizing:border-box}
[data-vibeui-block="underline-001"] *{box-sizing:border-box}
[data-vibeui-block="underline-001"]{align-self:flex-start;color:inherit;text-decoration:none;
font-size:1.0625rem;font-weight:620;
border-bottom:2px solid currentColor;padding-bottom:0.125rem;
margin-bottom:1rem;
transition:opacity var(--vibeui-underline-001-dur-2) ease;}
[data-vibeui-block="underline-001"]:hover{opacity:.66}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="underline-001"] *{animation:none!important;transition:none!important}}
`

/** Подпись «связаться» с подчёркиванием в шапке-манифесте. */
export function Underline001({
  contactLabel = "hello@ton.studio",
  accent,
  className,
  style,
  ...props
}: Underline001Props) {
  const palette = {
    ...(accent ? { "--vibeui-underline-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-underline-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="typography"
        data-vibeui-block="underline-001"
        className={className}
        style={palette}
      >{contactLabel}</span>
    </>
  )
}
