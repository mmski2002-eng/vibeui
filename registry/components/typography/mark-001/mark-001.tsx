import type { ComponentProps, CSSProperties } from "react"

export type Mark001Props = Omit<ComponentProps<"mark">, "title" | "children"> & {
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока about-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="mark-001"]){
--vibeui-mark-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-mark-001-mark:color-mix(in oklab,var(--vibeui-mark-001-accent) 12%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mark-001"]{color-scheme:dark}
[data-vibeui-block="mark-001"]{box-sizing:border-box}
[data-vibeui-block="mark-001"] *{box-sizing:border-box}
[data-vibeui-block="mark-001"]{color:var(--vibeui-mark-001-accent);
background:var(--vibeui-mark-001-mark);
border-radius:0.25em;padding:0 0.12em;
-webkit-box-decoration-break:clone;box-decoration-break:clone;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="mark-001"] *{animation:none!important;transition:none!important}}
`

/** Выделенный фрагмент фразы-заявления: подложка-маркер и акцентный цвет текста. */
export function Mark001({
  text = "Мы строим библиотеку, в которой ",
  accent,
  className,
  style,
  ...props
}: Mark001Props) {
  const palette = {
    ...(accent ? { "--vibeui-mark-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-mark-001" precedence="medium">
        {STYLES}
      </style>
      <mark
        {...props}
        data-slot="typography"
        data-vibeui-block="mark-001"
        className={className}
        style={palette}
      >
        {text}
      </mark>
    </>
  )
}
