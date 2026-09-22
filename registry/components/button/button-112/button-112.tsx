import type { ComponentProps, CSSProperties } from "react"

export type Button112Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  cartHref?: string
  cartLabel?: string
  countLabel?: string
  count?: number
  bump?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-038, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-112"]){
--vibeui-button-112-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-112-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-112-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-112-on-accent:oklch(from var(--vibeui-button-112-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-112"]{color-scheme:dark}
[data-vibeui-block="button-112"]{box-sizing:border-box}
[data-vibeui-block="button-112"] *{box-sizing:border-box}
@keyframes vibeui-button-112-bump{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
[data-vibeui-block="button-112"]{position:relative;display:inline-flex;align-items:center;gap:.5rem;height:2.6rem;padding:0 1rem;border-radius:999px;background:var(--vibeui-button-112-accent);color:var(--vibeui-button-112-on-accent);text-decoration:none;font-weight:700;font-size:.88rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="button-112"]:hover{transform:translateY(-1px);box-shadow:0 10px 26px -10px var(--vibeui-button-112-accent)}
[data-vibeui-block="button-112"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="button-112"] span{display:none}
[data-vibeui-block="button-112"] [data-part="count"]{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;padding:0 .3rem;border-radius:999px;background:var(--vibeui-button-112-bg);color:var(--vibeui-button-112-fg);font-size:.72rem;font-weight:800;font-variant-numeric:tabular-nums}
[data-vibeui-block="button-112"] [data-part="count"][data-bump="true"]{animation:vibeui-button-112-bump .4s cubic-bezier(.2,.8,.2,1)}
@container (min-width: 40rem){
[data-vibeui-block="button-112"] span{display:inline}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-112"] *{animation:none!important;transition:none!important}}
`

/** Ссылка на корзину с иконкой и числом позиций. */
export function Button112({
  cartHref = "#menu",
  cartLabel = "Корзина",
  countLabel = "В корзине {n}",
  count = 3,
  bump = false,
  accent,
  className,
  style,
  ...props
}: Button112Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-112-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-112" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-112" href={cartHref}
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H7" />
          <circle cx="9.5" cy="20" r="1.2" />
          <circle cx="17.5" cy="20" r="1.2" />
        </svg>
        <span>{cartLabel}</span>
        <output data-part="count" data-bump={bump} aria-label={countLabel.replace("{n}", String(count))}>
          {count}
        </output>
      </a>
    </>
  )
}
