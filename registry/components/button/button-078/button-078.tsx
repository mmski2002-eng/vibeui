import type { ComponentProps, CSSProperties } from "react"

export type Button078Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  year?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока charity-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-078"]){
--vibeui-button-078-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-078-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-078-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-078-line:color-mix(in oklab,var(--vibeui-button-078-fg) 16%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-078"]{color-scheme:dark}
[data-vibeui-block="button-078"]{box-sizing:border-box}
[data-vibeui-block="button-078"] *{box-sizing:border-box}
[data-vibeui-block="button-078"]{padding:.55rem 1.1rem;border-radius:999px;border:1px solid var(--vibeui-button-078-line);background:transparent;color:var(--vibeui-button-078-fg);font:inherit;font-weight:600;font-variant-numeric:tabular-nums;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="button-078"]:hover{border-color:var(--vibeui-button-078-accent)}
[data-vibeui-block="button-078"][aria-pressed="true"]{background:var(--vibeui-button-078-fg);border-color:var(--vibeui-button-078-fg);color:var(--vibeui-button-078-bg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-078"] *{animation:none!important;transition:none!important}}
`

/** Кнопка выбора года отчёта: нажатое состояние через aria-pressed. */
export function Button078({
  year = "2025",
  accent,
  className,
  style,
  ...props
}: Button078Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-078-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-078" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-078" type="button"
        className={className}
        style={palette}
      >
        {year}
      </button>
    </>
  )
}
