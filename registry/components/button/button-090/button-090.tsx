import type { ComponentProps, CSSProperties } from "react"

export type Button090Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  color?: string
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока gadget-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-090"]){
--vibeui-button-090-accent:light-dark(#111111,#f2ede4);
--vibeui-button-090-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-button-090-fg:light-dark(#111111,#f2ede4);
--vibeui-button-090-line:color-mix(in oklab,var(--vibeui-button-090-fg) 14%,transparent);
--vibeui-button-090-muted:color-mix(in oklab,var(--vibeui-button-090-fg) 60%,var(--vibeui-button-090-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-090"]{color-scheme:dark}
[data-vibeui-block="button-090"]{box-sizing:border-box}
[data-vibeui-block="button-090"] *{box-sizing:border-box}
[data-vibeui-block="button-090"]{display:grid;justify-items:center;gap:.4rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;font-size:.72rem;cursor:pointer}
[data-vibeui-block="button-090"] i{display:block;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--vibeui-button-090-sw);box-shadow:inset 0 -6px 10px rgb(0 0 0/.25),0 0 0 2px var(--vibeui-button-090-bg),0 0 0 3px var(--vibeui-button-090-line);transition:transform .2s,box-shadow .2s}
[data-vibeui-block="button-090"][aria-pressed="true"] i{transform:scale(1.1);box-shadow:inset 0 -6px 10px rgb(0 0 0/.25),0 0 0 2px var(--vibeui-button-090-bg),0 0 0 4px var(--vibeui-button-090-accent)}
[data-vibeui-block="button-090"]:focus-visible{outline:2px solid var(--vibeui-button-090-accent);outline-offset:3px;border-radius:.6rem}
[data-vibeui-block="button-090"] span{color:var(--vibeui-button-090-muted)}
[data-vibeui-block="button-090"][aria-pressed="true"] span{color:var(--vibeui-button-090-fg);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-090"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-свотч цвета: кружок цвета и название; выбран через aria-pressed. */
export function Button090({
  color = "#2b2b2b",
  name = "Графит",
  accent,
  className,
  style,
  ...props
}: Button090Props) {
  const palette = {
    ["--vibeui-button-090-sw" as string]: color,
    ...(accent ? { "--vibeui-button-090-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-090" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-090" type="button"
        className={className}
        style={palette}
      >
        <i aria-hidden="true" />
        <span>{name}</span>
      </button>
    </>
  )
}
