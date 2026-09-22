import type { ComponentProps, CSSProperties } from "react"

export type Button105Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  favoritesHref?: string
  favoritesLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5S4 15.5 4 9.9C4 7.2 6.1 5 8.7 5c1.4 0 2.6.6 3.3 1.7C12.7 5.6 14 5 15.3 5 17.9 5 20 7.2 20 9.9c0 5.6-8 10.6-8 10.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Часть блока navbar-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-105"]){
--vibeui-button-105-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-105-dur-1:130ms;
--vibeui-button-105-dur-2:180ms;
--vibeui-button-105-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-button-105-ink:light-dark(#000000,#ffffff);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-105"]{color-scheme:dark}
[data-vibeui-block="button-105"]{box-sizing:border-box}
[data-vibeui-block="button-105"] *{box-sizing:border-box}
[data-vibeui-block="button-105"]{position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:0.1875rem;
min-width:3.25rem;padding:0.4375rem 0.5rem;border-radius:0.75rem;
color:var(--vibeui-button-105-ink);text-decoration:none;
font-size:0.6875rem;font-weight:530;
transition:background-color var(--vibeui-button-105-dur-2) ease,color var(--vibeui-button-105-dur-1) ease;}
[data-vibeui-block="button-105"]:hover{background:var(--vibeui-button-105-hover);color:var(--vibeui-button-105-accent);}
[data-vibeui-block="button-105"] svg{width:1.375rem;height:1.375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-105"] *{animation:none!important;transition:none!important}}
`

/** Ссылка шапки с иконкой и подписью: избранное, корзина. */
export function Button105({
  favoritesHref = "#favorites",
  favoritesLabel = "Избранное",
  accent,
  className,
  style,
  ...props
}: Button105Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-105-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-105" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-105" href={favoritesHref}
        className={className}
        style={palette}
      >
        <HeartIcon />
        {favoritesLabel}
      </a>
    </>
  )
}
