import type { ComponentProps, CSSProperties } from "react"

export type Button110Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  actionHref?: string
  actionLabel?: string
  actionPrice?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-022, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-110"]){
--vibeui-button-110-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-110-on-accent:oklch(from var(--vibeui-button-110-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-110"]{color-scheme:dark}
[data-vibeui-block="button-110"]{box-sizing:border-box}
[data-vibeui-block="button-110"] *{box-sizing:border-box}
[data-vibeui-block="button-110"]{display:none;align-items:center;gap:.6rem;height:2.6rem;padding:0 .4rem 0 1.1rem;border-radius:999px;background:var(--vibeui-button-110-accent);color:var(--vibeui-button-110-on-accent);font-weight:600;font-size:.85rem;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="button-110"]:hover{transform:translateY(-1px);box-shadow:0 12px 24px -12px var(--vibeui-button-110-accent)}
[data-vibeui-block="button-110"] [data-part="price"]{display:inline-flex;align-items:center;height:1.9rem;padding:0 .7rem;border-radius:999px;background:rgb(255 255 255 / .18);font-variant-numeric:tabular-nums}
[data-vibeui-block="button-110"]{display:inline-flex;font-size:1rem;justify-self:start}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-110"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка шапки: подпись и цена рядом. */
export function Button110({
  actionHref = "#pricing",
  actionLabel = "Записаться",
  actionPrice = "49 000 ₽",
  accent,
  className,
  style,
  ...props
}: Button110Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-110-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-110" precedence="medium">
        {STYLES}
      </style>
      <a
          {...props}
          data-slot="button"
          data-vibeui-block="button-110" href={actionHref}
          className={className}
          style={palette}
        >
        {actionLabel}
        {actionPrice ? <span data-part="price">{actionPrice}</span> : null}
      </a>
    </>
  )
}
