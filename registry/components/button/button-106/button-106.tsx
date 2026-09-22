import type { ComponentProps, CSSProperties } from "react"

export type Button106Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  loginLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function FaceIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 16.5c1-2.6 3-4 5.5-4s4.5 1.4 5.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Часть блока navbar-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-106"]){
--vibeui-button-106-dur-2:180ms;
--vibeui-button-106-dur-3:240ms;
--vibeui-button-106-ink:light-dark(#000000,#ffffff);
--vibeui-button-106-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-106"]{color-scheme:dark}
[data-vibeui-block="button-106"]{box-sizing:border-box}
[data-vibeui-block="button-106"] *{box-sizing:border-box}
[data-vibeui-block="button-106"]{cursor:pointer;background:transparent;font:inherit;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.5rem;padding:0.25rem 0.5rem 0.25rem 0.9375rem;
border:1px solid var(--vibeui-button-106-line);border-radius:999px;
color:var(--vibeui-button-106-ink);text-decoration:none;
font-size:0.875rem;font-weight:560;
box-shadow:0 0.125rem 0.5rem color-mix(in oklab,#000000 6%,transparent);
transition:box-shadow var(--vibeui-button-106-dur-3) ease,border-color var(--vibeui-button-106-dur-2) ease;}
[data-vibeui-block="button-106"]:hover{border-color:color-mix(in oklab,#000000 18%,transparent);
box-shadow:0 0.375rem 1rem color-mix(in oklab,#000000 12%,transparent);}
[data-vibeui-block="button-106"] [data-part="face"]{width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;border-radius:999px;
background:#1a1a1a;color:#ffffff;}
[data-vibeui-block="button-106"] [data-part="face"] svg{width:1rem;height:1rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-106"] *{animation:none!important;transition:none!important}}
`

/** Кнопка аккаунта в шапке: открывает меню, состояние через aria-expanded. */
export function Button106({
  loginLabel = "Войти",
  accent,
  className,
  style,
  ...props
}: Button106Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-106-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-106" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-106"
        type="button"
        aria-controls="vibeui-navbar-011-account"
        className={className}
        style={palette}
      >
        {loginLabel}
        <span data-part="face" aria-hidden="true">
          <FaceIcon />
        </span>
      </button>
    </>
  )
}
