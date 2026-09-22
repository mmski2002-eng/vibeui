import type { ComponentProps, CSSProperties } from "react"

export type Button083Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока auto-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-083"]){
--vibeui-button-083-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-083-muted:color-mix(in oklab,var(--vibeui-button-083-fg) 60%,var(--vibeui-button-083-bg));
--vibeui-button-083-on-accent:oklch(from var(--vibeui-button-083-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-083-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-083-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-083"]{color-scheme:dark}
[data-vibeui-block="button-083"]{box-sizing:border-box}
[data-vibeui-block="button-083"] *{box-sizing:border-box}
[data-vibeui-block="button-083"]{padding:.6rem 1.1rem;border-radius:999px;border:0;background:transparent;color:var(--vibeui-button-083-muted);font:inherit;font-weight:600;font-size:.9rem;cursor:pointer;transition:background .25s,color .25s}
[data-vibeui-block="button-083"][aria-selected="true"]{background:var(--vibeui-button-083-accent);color:var(--vibeui-button-083-on-accent)}
[data-vibeui-block="button-083"]:focus-visible{outline:2px solid var(--vibeui-button-083-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-083"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-вкладка выбора пары фото; активна через aria-selected. */
export function Button083({
  label = "Фары",
  accent,
  className,
  style,
  ...props
}: Button083Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-083-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-083" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-083" type="button" role="tab"
        className={className}
        style={palette}
      >
        {label}
      </button>
    </>
  )
}
