import type { ComponentProps, CSSProperties } from "react"

export type Button080Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  minutes?: number
  minutesUnit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока delivery-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-080"]){
--vibeui-button-080-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-080-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-080-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-080"]{color-scheme:dark}
[data-vibeui-block="button-080"]{box-sizing:border-box}
[data-vibeui-block="button-080"] *{box-sizing:border-box}
[data-vibeui-block="button-080"]{display:inline-flex;align-items:center;gap:.4rem;height:1.9rem;padding:0 .7rem 0 .5rem;border-radius:999px;border:0;background:color-mix(in oklab,var(--vibeui-button-080-bg) 85%,transparent);backdrop-filter:blur(8px);color:var(--vibeui-button-080-fg);font:inherit;font-size:.72rem;font-weight:600;cursor:pointer}
[data-vibeui-block="button-080"]::before{content:"";width:.7rem;height:.7rem;border-radius:.2rem;background:var(--vibeui-button-080-accent);opacity:var(--vibeui-delivery-003-o)}
[data-vibeui-block="button-080"][aria-pressed="true"]{outline:1.5px solid var(--vibeui-button-080-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-080"] *{animation:none!important;transition:none!important}}
`

/** Кнопка легенды зоны: квадрат цвета зоны и минуты; выбрана через aria-pressed. */
export function Button080({
  minutes = 25,
  minutesUnit = "мин",
  accent,
  className,
  style,
  ...props
}: Button080Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-080-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-080" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-080" type="button"
        className={className}
        style={palette}
      >
        {minutes} {minutesUnit}
      </button>
    </>
  )
}
