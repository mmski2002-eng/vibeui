import type { ComponentProps, CSSProperties } from "react"

export type Button107Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  bagHref?: string
  bagLabel?: string
  bagCount?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-107"]){
--vibeui-button-107-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-107-dur-2:180ms;
--vibeui-button-107-ink:light-dark(#000000,#ffffff);
--vibeui-button-107-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 62%,#000000));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-107"]{color-scheme:dark}
[data-vibeui-block="button-107"]{box-sizing:border-box}
[data-vibeui-block="button-107"] *{box-sizing:border-box}
[data-vibeui-block="button-107"]{position:relative;
display:inline-flex;align-items:center;gap:0.4375rem;padding:0.4375rem 0;
color:var(--vibeui-button-107-muted);text-decoration:none;
font-size:0.75rem;font-weight:580;letter-spacing:0.16em;text-transform:uppercase;
transition:color var(--vibeui-button-107-dur-2) ease;}
[data-vibeui-block="button-107"]:hover{color:var(--vibeui-button-107-ink)}
[data-vibeui-block="button-107"] [data-part="count"]{min-width:1.125rem;height:1.125rem;padding:0 0.3125rem;
display:inline-flex;align-items:center;justify-content:center;border-radius:999px;
background:var(--vibeui-button-107-accent);color:oklch(from var(--vibeui-button-107-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:700;letter-spacing:0;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-107"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка корзины в шапке магазина. */
export function Button107({
  bagHref = "#bag",
  bagLabel = "Корзина",
  bagCount = 2,
  accent,
  className,
  style,
  ...props
}: Button107Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-107-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-107" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-107" href={bagHref}
        className={className}
        style={palette}
      >
        {bagLabel}
        {bagCount > 0 ? (
          <span data-part="count" aria-hidden="true">
            {bagCount}
          </span>
        ) : null}
      </a>
    </>
  )
}
