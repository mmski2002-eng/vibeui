import type { ComponentProps, CSSProperties } from "react"

export type Button100Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  hex?: string
  name?: string
  copiedLabel?: string
  copied?: string | null
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-100"]){
--vibeui-button-100-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-100-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-100-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-100-muted:light-dark(#7a6a70,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-100"]{color-scheme:dark}
[data-vibeui-block="button-100"]{box-sizing:border-box}
[data-vibeui-block="button-100"] *{box-sizing:border-box}
@keyframes vibeui-button-100-pop{40%{transform:translateY(-.9rem) scale(1.1)}}
[data-vibeui-block="button-100"]{position:relative;display:grid;gap:.5rem;justify-items:center;margin-right:-.75rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer}
[data-vibeui-block="button-100"] [data-part="chip"]{display:block;width:clamp(4.5rem,14cqi,8.5rem);aspect-ratio:1;border-radius:50%;background:var(--vibeui-event-009-chip);box-shadow:0 0 0 .3rem var(--vibeui-button-100-bg),0 18px 30px -18px rgb(43 26 36 / .6);transition:transform .35s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="button-100"]:hover [data-part="chip"],[data-vibeui-block="button-100"]:focus-visible [data-part="chip"]{transform:translateY(-.5rem) scale(1.05)}
[data-vibeui-block="button-100"][data-copied="true"] [data-part="chip"]{animation:vibeui-button-100-pop .5s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="button-100"]:focus-visible{outline:none}
[data-vibeui-block="button-100"] small{display:grid;justify-items:center;gap:.1rem;font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-button-100-muted)}
[data-vibeui-block="button-100"] small b{font-weight:600;color:var(--vibeui-button-100-fg)}
[data-vibeui-block="button-100"] small code{font-family:inherit;font-variant-numeric:tabular-nums;text-transform:uppercase}
[data-vibeui-block="button-100"][data-copied="true"] small code{color:var(--vibeui-button-100-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-100"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-свотч цвета дресс-кода: цвет, название и hex; после клика показывает «скопировано». */
export function Button100({
  hex = "#f1e8d8",
  name = "Крем",
  copiedLabel = "скопировано",
  copied = null,
  accent,
  className,
  style,
  ...props
}: Button100Props) {
  const palette = {
    "--vibeui-button-100-chip": hex,
    ...(accent ? { "--vibeui-button-100-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-100" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-100" type="button" data-copied={copied === hex ? "true" : undefined} aria-label={`${name} ${hex}`}
        className={className}
        style={palette}
      >
        <span data-part="chip" aria-hidden="true" />
        <small aria-hidden="true">
          <b>{name}</b>
          <code>{copied === hex ? copiedLabel : hex}</code>
        </small>
      </button>
    </>
  )
}
