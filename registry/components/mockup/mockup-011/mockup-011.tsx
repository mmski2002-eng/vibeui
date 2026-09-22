import type { ComponentProps, CSSProperties } from "react"

export type Mockup011Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока surface-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="mockup-011"]){
--vibeui-mockup-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-mockup-011-ghost:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-mockup-011-ghost-soft:light-dark(color-mix(in oklab,#000000 13%,transparent),color-mix(in oklab,#ffffff 16%,transparent));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-011"]{color-scheme:dark}
[data-vibeui-block="mockup-011"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="mockup-011"] *{box-sizing:border-box}
[data-vibeui-block="mockup-011"]{display:flex;flex-direction:column;flex:1;}
[data-vibeui-block="mockup-011"] [data-part="topbar"]{display:flex;align-items:center;gap:0.875rem}
[data-vibeui-block="mockup-011"] [data-part="mark"]{width:1.75rem;height:1.75rem;flex:none;background:var(--vibeui-mockup-011-accent);color:oklch(from var(--vibeui-mockup-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="mockup-011"] [data-part="topbar"] span:not([data-part]){width:3.5rem;height:0.5rem;background:var(--vibeui-mockup-011-ghost-soft);}
[data-vibeui-block="mockup-011"] [data-part="caption"]{display:flex;flex-direction:column;gap:0.875rem;margin-top:auto;max-width:34rem;}
[data-vibeui-block="mockup-011"] [data-part="caption"] span{height:2rem;background:var(--vibeui-mockup-011-ghost)}
[data-vibeui-block="mockup-011"] [data-part="caption"] span:nth-child(2){width:68%}
[data-vibeui-block="mockup-011"] [data-part="caption"] span:nth-child(3){height:0.625rem;width:52%;margin-top:0.25rem;background:var(--vibeui-mockup-011-ghost-soft);}
[data-vibeui-block="mockup-011"] [data-part="buttons"]{display:flex;gap:0.75rem;margin-top:1.25rem}
[data-vibeui-block="mockup-011"] [data-part="buttons"] span{width:8.5rem;height:2.75rem;background:var(--vibeui-mockup-011-ghost-soft)}
[data-vibeui-block="mockup-011"] [data-part="buttons"] span:first-child{background:var(--vibeui-mockup-011-accent);color:oklch(from var(--vibeui-mockup-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="mockup-011"] *{animation:none!important;transition:none!important}}
`

/** Призрачный макет для фото-подложки: топбар со знаком и подпись внизу кадра. */
export function Mockup011({
  accent,
  className,
  style,
  ...props
}: Mockup011Props) {
  const palette = {
    ...(accent ? { "--vibeui-mockup-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-mockup-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-011" aria-hidden="true"
        className={className}
        style={palette}
      >
        <div data-part="topbar">
          <span data-part="mark" />
          <span />
          <span />
          <span />
        </div>
        <div data-part="caption">
          <span />
          <span />
          <span />
        </div>
        <div data-part="buttons">
          <span />
          <span />
        </div>
      </div>
    </>
  )
}
