import type { ComponentProps, CSSProperties } from "react"

export type Word001Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  word?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bakery-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="word-001"]){

}
[data-vibeui-block="word-001"]{box-sizing:border-box}
[data-vibeui-block="word-001"] *{box-sizing:border-box}
[data-vibeui-block="word-001"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="word-001"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="word-001"] i{transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="word-001"] *{animation:none!important;transition:none!important}}
`

/**  */
export function Word001({
  word,
  accent,
  className,
  style,
  ...props
}: Word001Props) {
  const palette = {
    ...(accent ? { "--vibeui-word-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-word-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="typography"
        data-vibeui-block="word-001"
        className={className}
        style={palette}
      >
        <i>{word}</i>
      </span>
    </>
  )
}
