import type { ComponentProps, CSSProperties } from "react"

export type Mockup010Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока surface-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="mockup-010"]){
--vibeui-mockup-010-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-mockup-010-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-mockup-010-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-mockup-010-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-mockup-010-ink:light-dark(#000000,#ffffff);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-010"]{color-scheme:dark}
[data-vibeui-block="mockup-010"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="mockup-010"] *{box-sizing:border-box}
[data-vibeui-block="mockup-010"]{display:flex;flex-direction:column;flex:1;gap:3rem}
[data-vibeui-block="mockup-010"] [data-part="nav"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="mockup-010"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;background:var(--vibeui-mockup-010-ink)}
[data-vibeui-block="mockup-010"] [data-part="nav"] span:not([data-part]){width:3rem;height:0.5rem;border-radius:999px;background:var(--vibeui-mockup-010-ghost-soft)}
[data-vibeui-block="mockup-010"] [data-part="nav"] span:last-child{margin-inline-start:auto;width:4.5rem;height:1.75rem;border-radius:0.5rem;background:var(--vibeui-mockup-010-ink)}
[data-vibeui-block="mockup-010"] [data-part="title"]{display:flex;flex-direction:column;gap:0.875rem;max-width:36rem}
[data-vibeui-block="mockup-010"] [data-part="title"] span{height:1.25rem;border-radius:999px;background:var(--vibeui-mockup-010-ghost);width:90%}
[data-vibeui-block="mockup-010"] [data-part="title"] span:nth-child(2){width:62%}
[data-vibeui-block="mockup-010"] [data-part="title"] span:nth-child(3){height:0.625rem;width:48%;background:var(--vibeui-mockup-010-ghost-soft);margin-top:0.5rem}
[data-vibeui-block="mockup-010"] [data-part="cards"]{margin-top:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
[data-vibeui-block="mockup-010"] [data-part="cards"] span{height:6.5rem;border-radius:1rem;background:var(--vibeui-mockup-010-glass);border:1px solid var(--vibeui-mockup-010-edge);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2)}
[data-vibeui-block="mockup-010"] [data-part="cards"] span:last-child{display:none}
@container (min-width: 48rem){
[data-vibeui-block="mockup-010"] [data-part="cards"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="mockup-010"] [data-part="cards"] span:last-child{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="mockup-010"] *{animation:none!important;transition:none!important}}
`

/** Призрачный макет страницы: полоска навигации со знаком, три строки заголовка и три карточки — показывает, как фон работает под контентом. */
export function Mockup010({
  accent,
  className,
  style,
  ...props
}: Mockup010Props) {
  const palette = {
    ...(accent ? { "--vibeui-mockup-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-mockup-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-010" aria-hidden="true"
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
        <div data-part="title">
          <span />
          <span />
          <span />
        </div>
        <div data-part="cards">
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  )
}
