import type { ComponentProps, CSSProperties } from "react"

export type Badge034Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  emoji?: string
  href?: string
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока hero-023, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-034"]){
--vibeui-badge-034-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-badge-034-fg:light-dark(#111111,#f4f4f5);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-034"]{color-scheme:dark}
[data-vibeui-block="badge-034"]{box-sizing:border-box}
[data-vibeui-block="badge-034"] *{box-sizing:border-box}
[data-vibeui-block="badge-034"]{display:inline-flex;align-items:center;gap:0;height:4.75rem;padding:0 1.5rem 0 0;border-radius:1.1rem;background:var(--vibeui-hero-023-tag);color:var(--vibeui-hero-023-ink,#111);font-family:var(--vibeui-badge-034-display);font-size:1.3rem;font-weight:500;letter-spacing:-.01em;text-decoration:none;overflow:hidden;transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
[data-vibeui-block="badge-034"][data-plain="true"]{padding-left:1.5rem}
[data-vibeui-block="badge-034"]:hover{transform:translateY(-4px) rotate(-1.5deg);box-shadow:0 18px 30px -18px rgb(0 0 0 / .35)}
[data-vibeui-block="badge-034"]:focus-visible{outline:2px solid var(--vibeui-badge-034-fg);outline-offset:3px}
[data-vibeui-block="badge-034"] [data-part="sticker"]{display:grid;place-items:center;width:4.75rem;height:4.75rem;margin-right:1rem;background:color-mix(in oklab,var(--vibeui-hero-023-tag) 82%,#000);font-size:2.4rem;line-height:1;filter:drop-shadow(0 6px 6px rgb(0 0 0 / .25));transition:transform .35s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="badge-034"]:hover [data-part="sticker"]{transform:rotate(8deg) scale(1.12)}
@container (max-width: 40rem){
[data-vibeui-block="badge-034"][data-plain="true"]{padding-left:1rem}
[data-vibeui-block="badge-034"] [data-part="sticker"]{width:3.4rem;height:3.4rem;margin-right:.7rem;font-size:1.7rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-034"] *{animation:none!important;transition:none!important}}
`

/** Цветная капсула-тег фестиваля со стикером-эмодзи; цвет и чернила через переменные. */
export function Badge034({
  emoji = "Капсула направления",
  href = "#",
  label = "#Музыка",
  accent,
  className,
  style,
  ...props
}: Badge034Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-034-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-034" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-034" data-plain={emoji ? undefined : "true"} href={href}
        className={className}
        style={palette}
      >
        {emoji ? (
          <span data-part="sticker" aria-hidden="true">
            {emoji}
          </span>
        ) : null}
        {label}
      </a>
    </>
  )
}
