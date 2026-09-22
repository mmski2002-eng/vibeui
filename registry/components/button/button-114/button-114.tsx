import type { ComponentProps, CSSProperties } from "react"

export type Button114Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-045, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-114"]){
--vibeui-button-114-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-114-line:color-mix(in oklab,var(--vibeui-button-114-fg) 14%,transparent);
--vibeui-button-114-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-114"]{color-scheme:dark}
[data-vibeui-block="button-114"]{box-sizing:border-box}
[data-vibeui-block="button-114"] *{box-sizing:border-box}
[data-vibeui-block="button-114"]{position:relative;display:inline-grid;place-items:center;width:2.5rem;height:2.5rem;padding:0;border:1px solid var(--vibeui-button-114-line);border-radius:999px;background:transparent;color:var(--vibeui-button-114-accent);cursor:pointer;transition:border-color .25s,transform .25s}
[data-vibeui-block="button-114"]:hover{border-color:var(--vibeui-button-114-accent);transform:rotate(15deg)}
[data-vibeui-block="button-114"] svg{position:absolute;width:1.15rem;height:1.15rem;transition:opacity .5s,transform .6s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="button-114"] [data-icon="sun"]{opacity:0;transform:rotate(-90deg) scale(.5)}
[data-vibeui-block="button-114"] [data-icon="moon"]{opacity:1;transform:rotate(0) scale(1)}
[data-vibeui-block="button-114"][aria-checked="true"] [data-icon="sun"]{opacity:1;transform:rotate(0) scale(1)}
[data-vibeui-block="button-114"][aria-checked="true"] [data-icon="moon"]{opacity:0;transform:rotate(90deg) scale(.5)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-114"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-переключатель режима с иконками солнца и луны; состояние через aria-checked. */
export function Button114({
  accent,
  className,
  style,
  ...props
}: Button114Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-114-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-114" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-114" type="button" role="switch"
        className={className}
        style={palette}
      >
        <svg data-icon="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <svg data-icon="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
      </button>
    </>
  )
}
