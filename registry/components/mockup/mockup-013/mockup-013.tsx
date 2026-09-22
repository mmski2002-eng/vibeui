import type { ComponentProps, CSSProperties } from "react"

export type Mockup013Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  slabRef?: ComponentProps<"div">["ref"]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока surface-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="mockup-013"]){
--vibeui-mockup-013-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-mockup-013-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-mockup-013-ink:light-dark(#000000,#ffffff);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-013"]{color-scheme:dark}
[data-vibeui-block="mockup-013"]{box-sizing:border-box}
[data-vibeui-block="mockup-013"] *{box-sizing:border-box}
[data-vibeui-block="mockup-013"]{display:flex;flex-direction:column;flex:1;gap:2.5rem}
[data-vibeui-block="mockup-013"] [data-part="nav"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="mockup-013"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;background:var(--vibeui-mockup-013-ink)}
[data-vibeui-block="mockup-013"] [data-part="nav"] span:not([data-part]){width:3rem;height:0.5rem;border-radius:999px;background:var(--vibeui-mockup-013-ghost-soft)}
[data-vibeui-block="mockup-013"] [data-part="nav"] span:last-child{margin-inline-start:auto;width:4.5rem;height:1.75rem;border-radius:0.5rem;background:var(--vibeui-mockup-013-ink)}
[data-vibeui-block="mockup-013"] [data-part="slab"]{position:relative;margin:auto;width:min(40rem,100%);min-height:14rem;padding:2rem;display:flex;flex-direction:column;gap:1rem;justify-content:center;border-radius:1.25rem}
[data-vibeui-block="mockup-013"] [data-part="slab"] span{height:1rem;border-radius:999px;background:var(--vibeui-mockup-013-ghost);width:70%}
[data-vibeui-block="mockup-013"] [data-part="slab"] span:nth-child(2){width:45%}
[data-vibeui-block="mockup-013"] [data-part="slab"] span:nth-child(3){height:0.625rem;width:55%;background:var(--vibeui-mockup-013-ghost-soft)}
[data-vibeui-block="mockup-013"] [data-part="slab"] span:last-child{margin-top:1rem;width:7rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-mockup-013-ink)}
@container (min-width: 48rem){
[data-vibeui-block="mockup-013"] [data-part="slab"]{min-height:16rem;padding:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="mockup-013"] *{animation:none!important;transition:none!important}}
`

/** Призрачный макет страницы: полоска навигации с меткой и плита с четырьмя строками; используется как содержимое-заглушка. */
export function Mockup013({
  slabRef,
  accent,
  className,
  style,
  ...props
}: Mockup013Props) {
  const palette = {
    ...(accent ? { "--vibeui-mockup-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-mockup-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-013" aria-hidden="true"
        className={className}
        style={palette}
      >
        <div data-part="nav">
          <span data-part="mark" />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div data-part="slab" ref={slabRef}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  )
}
