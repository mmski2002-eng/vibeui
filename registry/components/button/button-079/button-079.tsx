import type { ComponentProps, CSSProperties } from "react"

export type Button079Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  name?: string
  price?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока delivery-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-079"]){
--vibeui-button-079-card:color-mix(in oklab,var(--vibeui-button-079-fg) 6%,var(--vibeui-button-079-bg));
--vibeui-button-079-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-079-line:color-mix(in oklab,var(--vibeui-button-079-fg) 14%,transparent);
--vibeui-button-079-muted:color-mix(in oklab,var(--vibeui-button-079-fg) 62%,var(--vibeui-button-079-bg));
--vibeui-button-079-on-fg:oklch(from var(--vibeui-button-079-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-079-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-079"]{color-scheme:dark}
[data-vibeui-block="button-079"]{box-sizing:border-box}
[data-vibeui-block="button-079"] *{box-sizing:border-box}
[data-vibeui-block="button-079"]{display:inline-flex;align-items:center;gap:.5rem;height:2.5rem;padding:0 .9rem 0 .6rem;border-radius:999px;border:1px solid var(--vibeui-button-079-line);background:var(--vibeui-button-079-card);color:var(--vibeui-button-079-fg);font:inherit;font-weight:600;font-size:.88rem;cursor:pointer;transition:background .2s,border-color .2s,transform .18s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="button-079"]::before{content:"";width:1.1rem;height:1.1rem;border-radius:50%;background:var(--vibeui-delivery-002-c);box-shadow:inset 0 -2px 0 rgb(0 0 0 / .18)}
[data-vibeui-block="button-079"] small{font-weight:500;color:var(--vibeui-button-079-muted)}
[data-vibeui-block="button-079"]:hover{transform:translateY(-2px);border-color:var(--vibeui-button-079-fg)}
[data-vibeui-block="button-079"][aria-pressed="true"],[data-vibeui-block="button-079"][aria-checked="true"]{background:var(--vibeui-button-079-fg);color:var(--vibeui-button-079-on-fg);border-color:transparent}
[data-vibeui-block="button-079"][aria-pressed="true"] small,[data-vibeui-block="button-079"][aria-checked="true"] small{color:inherit;opacity:.7}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-079"] *{animation:none!important;transition:none!important}}
`

/** Чип-переключатель ингредиента с цветной точкой; выбран через aria-checked/aria-pressed. */
export function Button079({
  name = "Микс салата",
  price = 0,
  accent,
  className,
  style,
  ...props
}: Button079Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-079-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-079" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-079"
        type="button"
        className={className}
        style={palette}
      >
        {name}
        <small>{price > 0 ? `+${price}` : "0"}</small>
      </button>
    </>
  )
}
