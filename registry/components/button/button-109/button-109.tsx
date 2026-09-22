import type { ComponentProps, CSSProperties } from "react"

export type Button109Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  current?: boolean
  icon?: "home" | "search" | "heart" | "cart" | "user" | "grid"
  label?: string
  badge?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20h-5.5v-5h-5v5H4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5S4 15.5 4 9.9C4 7.2 6.1 5 8.7 5c1.4 0 2.6.6 3.3 1.7C12.7 5.6 14 5 15.3 5 17.9 5 20 7.2 20 9.9c0 5.6-8 10.6-8 10.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
} as const

// Часть блока navbar-019, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-109"]){
--vibeui-button-109-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-109-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-109-dur-1:130ms;
--vibeui-button-109-dur-2:180ms;
--vibeui-button-109-dur-3:240ms;
--vibeui-button-109-ease:cubic-bezier(.32,.72,0,1);
--vibeui-button-109-ink:light-dark(#000000,#ffffff);
--vibeui-button-109-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-button-109-pill:light-dark(color-mix(in oklab,light-dark(#1a1a1a,#f2f2f2) 14%,transparent),color-mix(in oklab,light-dark(#1a1a1a,#f2f2f2) 22%,transparent));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-109"]{color-scheme:dark}
[data-vibeui-block="button-109"]{box-sizing:border-box}
[data-vibeui-block="button-109"] *{box-sizing:border-box}
[data-vibeui-block="button-109"]{flex:1 1 0;min-width:0;position:relative;
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:0.4375rem 0.25rem 0.5rem;border-radius:0.875rem;
color:var(--vibeui-button-109-muted);text-decoration:none;
font-size:0.6875rem;font-weight:560;
transition:color var(--vibeui-button-109-dur-1) ease,background-color var(--vibeui-button-109-dur-2) ease;}
[data-vibeui-block="button-109"]:hover{color:var(--vibeui-button-109-ink)}
[data-vibeui-block="button-109"][aria-current="page"]{color:var(--vibeui-button-109-ink);font-weight:620;
background:var(--vibeui-button-109-pill);}
[data-vibeui-block="button-109"] svg{width:1.375rem;height:1.375rem;
transition:transform var(--vibeui-button-109-dur-3) var(--vibeui-button-109-ease);}
[data-vibeui-block="button-109"][aria-current="page"] svg{color:var(--vibeui-button-109-accent);transform:scale(1.08);}
[data-vibeui-block="button-109"]:active svg{transform:scale(.92)}
[data-vibeui-block="button-109"] [data-part="label"]{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
[data-vibeui-block="button-109"] [data-part="badge"]{position:absolute;top:0.1875rem;left:calc(50% + 0.3125rem);
min-width:1.0625rem;height:1.0625rem;padding:0 0.1875rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-button-109-accent);color:oklch(from var(--vibeui-button-109-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-radius:999px;font-size:0.625rem;font-weight:700;
box-shadow:0 0 0 2px var(--vibeui-button-109-bg);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-109"] *{animation:none!important;transition:none!important}}
`

/** Пункт мобильной панели: иконка, подпись и бейдж; текущий через aria-current. */
export function Button109({
  href = "#home",
  current,
  icon = "home",
  label = "Главная",
  badge,
  accent,
  className,
  style,
  ...props
}: Button109Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-109-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-109" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-109"
        href={href}
        aria-current={current ? "page" : undefined}
        className={className}
        style={palette}
      >
        {ICONS[icon]}
        <span data-part="label">{label}</span>
        {badge ? (
          <span
            data-part="badge"
            aria-label={`${label}: ${badge}`}
          >
            {badge}
          </span>
        ) : null}
      </a>
    </>
  )
}
