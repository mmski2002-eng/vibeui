import type { ComponentProps, CSSProperties } from "react"

export type Button108Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  ticketHref?: string
  ticketLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-108"]){
--vibeui-button-108-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-108-dur-2:180ms;
--vibeui-button-108-dur-3:240ms;
--vibeui-button-108-ease:cubic-bezier(.32,.72,0,1);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-108"]{color-scheme:dark}
[data-vibeui-block="button-108"]{box-sizing:border-box}
[data-vibeui-block="button-108"] *{box-sizing:border-box}
[data-vibeui-block="button-108"]{margin-left:auto;flex:none;position:relative;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.75rem;padding:0.25rem 1.5rem;border-radius:0.625rem;
background:var(--vibeui-button-108-accent);color:oklch(from var(--vibeui-button-108-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:740;letter-spacing:0.02em;
text-transform:uppercase;white-space:nowrap;
/* вырезы по краям: кнопка читается билетом, а не плашкой */
-webkit-mask:radial-gradient(0.4375rem 0.4375rem at 0 50%,transparent 98%,#000 100%),
radial-gradient(0.4375rem 0.4375rem at 100% 50%,transparent 98%,#000 100%);
-webkit-mask-composite:source-in;
mask:radial-gradient(0.4375rem 0.4375rem at 0 50%,transparent 98%,#000 100%),
radial-gradient(0.4375rem 0.4375rem at 100% 50%,transparent 98%,#000 100%);
mask-composite:intersect;
transition:transform var(--vibeui-button-108-dur-2) var(--vibeui-button-108-ease),filter var(--vibeui-button-108-dur-3) ease;}
[data-vibeui-block="button-108"]::before{content:"";position:absolute;left:0.9375rem;top:0.5rem;bottom:0.5rem;width:1.5px;
background:repeating-linear-gradient(currentColor 0 3px,transparent 3px 6px);
opacity:.4;}
[data-vibeui-block="button-108"]:hover{transform:translateY(-1px);filter:brightness(1.06);}
[data-vibeui-block="button-108"] span{padding-left:0.75rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-108"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка «билеты» в шапке события. */
export function Button108({
  ticketHref = "#tickets",
  ticketLabel = "Билеты",
  accent,
  className,
  style,
  ...props
}: Button108Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-108-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-108" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-108" href={ticketHref}
        className={className}
        style={palette}
      >
        <span>{ticketLabel}</span>
      </a>
    </>
  )
}
