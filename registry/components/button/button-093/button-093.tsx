import type { ComponentProps, CSSProperties } from "react"

export type Button093Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  title?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока restaurant-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-093"]){
--vibeui-button-093-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-093-accent-ink:light-dark(var(--vibeui-button-093-accent),color-mix(in oklab,var(--vibeui-button-093-accent) 55%,var(--vibeui-button-093-fg)));
--vibeui-button-093-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-093-line:color-mix(in oklab,var(--vibeui-button-093-fg) 16%,var(--vibeui-button-093-bg));
--vibeui-button-093-on-accent:oklch(from var(--vibeui-button-093-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-093-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-093"]{color-scheme:dark}
[data-vibeui-block="button-093"]{box-sizing:border-box}
[data-vibeui-block="button-093"] *{box-sizing:border-box}
[data-vibeui-block="button-093"]{position:relative;z-index:1;appearance:none;border:1px solid var(--vibeui-button-093-line);border-radius:999px;background:transparent;padding:.6rem 1.1rem;font:inherit;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-button-093-fg);cursor:pointer;transition:color .35s,border-color .35s}
[data-vibeui-block="button-093"]:hover{border-color:var(--vibeui-button-093-accent-ink)}
[data-vibeui-block="button-093"][aria-selected="true"]{color:var(--vibeui-button-093-on-accent);border-color:transparent}
[data-vibeui-block="button-093"]:focus-visible{outline:2px solid var(--vibeui-button-093-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-093"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-вкладка раздела меню; активна через aria-selected. */
export function Button093({
  title = "Закуски",
  accent,
  className,
  style,
  ...props
}: Button093Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-093-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-093" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-093"
        type="button"
        role="tab"
        className={className}
        style={palette}
      >
        {title}
      </button>
    </>
  )
}
