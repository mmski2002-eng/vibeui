import type { ComponentProps, CSSProperties } from "react"

export type Button118Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  caption?: string
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока cta-025, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-118"]){
--vibeui-button-118-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-118-on-accent:oklch(from var(--vibeui-button-118-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-118"]{color-scheme:dark}
[data-vibeui-block="button-118"]{box-sizing:border-box}
[data-vibeui-block="button-118"] *{box-sizing:border-box}
[data-vibeui-block="button-118"]{display:inline-flex;flex-direction:column;padding:.65rem 1.25rem .7rem;border-radius:1rem;background:#f4f2fb;color:#151428;text-decoration:none;line-height:1.1;transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,color .25s,box-shadow .35s}
[data-vibeui-block="button-118"]:hover{transform:translateY(-3px) scale(1.03);background:var(--vibeui-button-118-accent);color:var(--vibeui-button-118-on-accent);box-shadow:0 18px 40px -16px var(--vibeui-button-118-accent)}
[data-vibeui-block="button-118"] small{font-size:.62rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="button-118"] b{font-size:1rem;font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-118"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка магазина: мелкая подпись и название. */
export function Button118({
  href = "#",
  caption = "Скачать в",
  label = "App Store",
  accent,
  className,
  style,
  ...props
}: Button118Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-118-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-118" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-118" href={href}
        className={className}
        style={palette}
      >
        <small>{caption}</small>
        <b>{label}</b>
      </a>
    </>
  )
}
