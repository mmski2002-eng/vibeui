import type { ComponentProps, CSSProperties } from "react"

export type Button089Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока fintech-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-089"]){
--vibeui-button-089-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-089-muted:color-mix(in oklab,var(--vibeui-button-089-fg) 62%,var(--vibeui-button-089-bg));
--vibeui-button-089-on-accent:oklch(from var(--vibeui-button-089-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-089-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-089-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-089"]{color-scheme:dark}
[data-vibeui-block="button-089"]{box-sizing:border-box}
[data-vibeui-block="button-089"] *{box-sizing:border-box}
[data-vibeui-block="button-089"]{padding:.4rem .85rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-button-089-muted);font:inherit;font-size:.8rem;font-weight:500;cursor:pointer;transition:background .25s,color .2s}
[data-vibeui-block="button-089"][aria-pressed="true"]{background:var(--vibeui-button-089-accent);color:var(--vibeui-button-089-on-accent)}
[data-vibeui-block="button-089"]:focus-visible{outline:2px solid var(--vibeui-button-089-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-089"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-таблетка выбора периода графика; активна через aria-pressed. */
export function Button089({
  label = "День",
  accent,
  className,
  style,
  ...props
}: Button089Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-089-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-089" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-089" type="button"
        className={className}
        style={palette}
      >
        {label}
      </button>
    </>
  )
}
