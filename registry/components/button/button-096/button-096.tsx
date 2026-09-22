import type { ComponentProps, CSSProperties } from "react"

export type Button096Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока opensource-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-096"]){
--vibeui-button-096-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-096-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-096-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-button-096-line:color-mix(in oklab,var(--vibeui-button-096-fg) 12%,transparent);
--vibeui-button-096-panel:color-mix(in oklab,var(--vibeui-button-096-fg) 4%,var(--vibeui-button-096-bg));
--vibeui-button-096-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-096"]{color-scheme:dark}
[data-vibeui-block="button-096"]{box-sizing:border-box}
[data-vibeui-block="button-096"] *{box-sizing:border-box}
[data-vibeui-block="button-096"]{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .8rem;border-radius:8px;border:1px solid var(--vibeui-button-096-line);background:var(--vibeui-button-096-panel);color:inherit;font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:border-color .2s,background .3s,transform .3s var(--vibeui-button-096-ease),box-shadow .3s}
[data-vibeui-block="button-096"]:hover{transform:translateY(-2px);box-shadow:0 10px 24px -14px color-mix(in oklab,var(--vibeui-button-096-accent) 60%,transparent)}
[data-vibeui-block="button-096"][aria-pressed="true"]{border-color:var(--vibeui-button-096-accent);background:color-mix(in oklab,var(--vibeui-button-096-accent) 10%,var(--vibeui-button-096-bg))}
[data-vibeui-block="button-096"] i{width:1.6rem;height:.9rem;border-radius:999px;background:var(--vibeui-button-096-line);position:relative;transition:background .25s}
[data-vibeui-block="button-096"] i::after{content:"";position:absolute;top:.1rem;left:.1rem;width:.7rem;height:.7rem;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgb(0 0 0 / .3);transition:transform .3s var(--vibeui-button-096-ease)}
[data-vibeui-block="button-096"][aria-pressed="true"] i{background:var(--vibeui-button-096-accent)}
[data-vibeui-block="button-096"][aria-pressed="true"] i::after{transform:translateX(.7rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-096"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-переключатель с индикатором; включён через aria-pressed. */
export function Button096({
  label,
  accent,
  className,
  style,
  ...props
}: Button096Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-096-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-096" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-096" type="button"
        className={className}
        style={palette}
      >
        <i aria-hidden="true" />
        {label}
      </button>
    </>
  )
}
