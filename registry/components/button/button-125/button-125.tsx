import type { ComponentProps, CSSProperties } from "react"

export type Button125Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  caption?: string
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока hero-032, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-125"]){
--vibeui-button-125-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-125-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-125-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-125-on-accent:oklch(from var(--vibeui-button-125-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-125"]{color-scheme:dark}
[data-vibeui-block="button-125"]{box-sizing:border-box}
[data-vibeui-block="button-125"] *{box-sizing:border-box}
[data-vibeui-block="button-125"]{display:inline-flex;flex-direction:column;padding:.65rem 1.25rem .7rem;border-radius:1rem;background:var(--vibeui-button-125-fg);color:var(--vibeui-button-125-bg);text-decoration:none;line-height:1.1;transform:translate(var(--vibeui-hero-032-mx,0px),var(--vibeui-hero-032-my,0px));transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,color .25s,box-shadow .35s}
[data-vibeui-block="button-125"]:hover{background:var(--vibeui-button-125-accent);color:var(--vibeui-button-125-on-accent);box-shadow:0 18px 40px -18px color-mix(in oklab,var(--vibeui-button-125-accent) 70%,transparent)}
[data-vibeui-block="button-125"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="button-125"] b{font-size:1.05rem;font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-125"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка магазина с подписью, тянется к курсору. */
export function Button125({
  href = "#",
  caption = "Скачать в",
  label = "App Store",
  accent,
  className,
  style,
  ...props
}: Button125Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-125-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-125" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-125" href={href}
        className={className}
        style={palette}
      >
        <small>{caption}</small>
        <b>{label}</b>
      </a>
    </>
  )
}
