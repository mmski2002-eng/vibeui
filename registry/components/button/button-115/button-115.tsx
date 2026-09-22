import type { ComponentProps, CSSProperties } from "react"

export type Button115Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  copiedLabel?: string
  copyLabel?: string
  copied?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока cta-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-115"]){
--vibeui-button-115-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-115-dur-2:180ms;
--vibeui-button-115-ok:light-dark(oklch(0.55 0.15 150),oklch(0.75 0.15 150));
--vibeui-button-115-term-border:oklch(0.32 0 0);
--vibeui-button-115-term-ink:oklch(0.93 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-115"]{color-scheme:dark}
[data-vibeui-block="button-115"]{box-sizing:border-box}
[data-vibeui-block="button-115"] *{box-sizing:border-box}
[data-vibeui-block="button-115"]{padding:0.3125rem 0.75rem;border:1px solid var(--vibeui-button-115-term-border);
border-radius:0.5rem;cursor:pointer;
background:transparent;color:var(--vibeui-button-115-term-ink);
font:inherit;font-size:0.75rem;font-weight:600;
transition:border-color var(--vibeui-button-115-dur-2) ease,color var(--vibeui-button-115-dur-2) ease;}
[data-vibeui-block="button-115"]:hover{border-color:var(--vibeui-button-115-accent)}
[data-vibeui-block="button-115"][data-copied="true"]{color:var(--vibeui-button-115-ok)}
[data-vibeui-block="button-115"]:focus-visible{outline:2px solid var(--vibeui-button-115-accent);outline-offset:2px;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-115"] *{animation:none!important;transition:none!important}}
`

/** Кнопка «скопировать» в шапке терминала; после клика показывает «скопировано» по data-copied. */
export function Button115({
  copiedLabel = "Скопировано",
  copyLabel = "Копировать",
  copied = false,
  accent,
  className,
  style,
  ...props
}: Button115Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-115-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-115" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-115"
        type="button"
        data-copied={copied ? "true" : "false"}
        className={className}
        style={palette}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </>
  )
}
