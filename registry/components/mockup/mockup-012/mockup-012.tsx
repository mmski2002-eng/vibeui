import type { ComponentProps, CSSProperties } from "react"

export type Mockup012Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока surface-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="mockup-012"]){
--vibeui-mockup-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-mockup-012-ghost:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 12%,transparent));
--vibeui-mockup-012-ghost-soft:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 6%,transparent));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-012"]{color-scheme:dark}
[data-vibeui-block="mockup-012"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="mockup-012"] *{box-sizing:border-box}
[data-vibeui-block="mockup-012"]{display:flex;flex-direction:column;gap:1.75rem;flex:1;justify-content:center;}
[data-vibeui-block="mockup-012"] [data-part="head"]{display:flex;align-items:center;gap:0.875rem}
[data-vibeui-block="mockup-012"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;
background:var(--vibeui-mockup-012-accent);color:oklch(from var(--vibeui-mockup-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="mockup-012"] [data-part="head"] span:not([data-part]){width:4rem;height:0.5rem;border-radius:999px;background:var(--vibeui-mockup-012-ghost);}
[data-vibeui-block="mockup-012"] [data-part="works"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;}
[data-vibeui-block="mockup-012"] [data-part="works"] span{height:7rem;border-radius:0.75rem;background:var(--vibeui-mockup-012-ghost-soft);
border:1px solid var(--vibeui-mockup-012-line);}
[data-vibeui-block="mockup-012"] [data-part="works"] span:first-child{border-color:color-mix(in oklab,var(--vibeui-mockup-012-accent) 45%,transparent);}
@container (min-width: 48rem){
[data-vibeui-block="mockup-012"] [data-part="works"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="mockup-012"] *{animation:none!important;transition:none!important}}
`

/** Призрачный макет: навигация, заголовок и сетка карточек для градиентной подложки. */
export function Mockup012({
  accent,
  className,
  style,
  ...props
}: Mockup012Props) {
  const palette = {
    ...(accent ? { "--vibeui-mockup-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-mockup-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-012" aria-hidden="true"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="mark" />
          <span />
          <span />
        </div>
        <div data-part="works">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  )
}
