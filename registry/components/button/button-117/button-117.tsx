import type { ComponentProps, CSSProperties } from "react"

export type Button117Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  label?: string
  price?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока cta-018, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-117"]){
--vibeui-button-117-accent:#4f46e5;
--vibeui-button-117-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-117-marker:#d9f99d;
--vibeui-button-117-on-accent:#ffffff;
}
[data-vibeui-block="button-117"]{box-sizing:border-box}
[data-vibeui-block="button-117"] *{box-sizing:border-box}
[data-vibeui-block="button-117"]{display:inline-flex;align-items:center;gap:.6rem;height:3rem;padding:0 .4rem 0 1.25rem;border-radius:999px;background:var(--vibeui-button-117-accent);color:var(--vibeui-button-117-on-accent);font-weight:600;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="button-117"]:hover{transform:translateY(-1px);box-shadow:0 14px 30px -12px var(--vibeui-button-117-accent)}
[data-vibeui-block="button-117"]:focus-visible{outline:2px solid var(--vibeui-button-117-marker);outline-offset:3px}
[data-vibeui-block="button-117"] [data-part="price"]{display:inline-flex;align-items:center;height:2.2rem;padding:0 .8rem;border-radius:999px;background:rgb(255 255 255 / .18);font-family:var(--vibeui-button-117-display);font-size:.8rem;font-weight:600;font-variant-numeric:tabular-nums}
[data-vibeui-block="button-117"]:only-child{margin-left:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-117"] *{animation:none!important;transition:none!important}}
`

/** Ссылка призыва к действию, появляющаяся по прокрутке. */
export function Button117({
  href = "#pricing",
  label = "Записаться",
  price = "49 000 ₽",
  accent,
  className,
  style,
  ...props
}: Button117Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-117-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-117" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-117" href={href}
        className={className}
        style={palette}
      >
        {label}
        {price ? <span data-part="price">{price}</span> : null}
      </a>
    </>
  )
}
