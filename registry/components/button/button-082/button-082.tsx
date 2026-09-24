import type { ComponentProps, CSSProperties } from "react"

export type Button082Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  icon?: "scissors" | "water" | "sun" | "thermometer" | "vase"
  title?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS = {
  scissors: (
    <>
      <circle pathLength={100} cx="6" cy="6" r="3" />
      <circle pathLength={100} cx="6" cy="18" r="3" />
      <path pathLength={100} d="M20 4 8.5 15.5M8.5 8.5 20 20" />
    </>
  ),
  water: (
    <>
      <path pathLength={100} d="M12 3c-3.5 5-6 8-6 11.5a6 6 0 0 0 12 0C18 11 15.5 8 12 3Z" />
      <path pathLength={100} d="M9 15.5a3 3 0 0 0 2 2.5" />
    </>
  ),
  sun: (
    <>
      <circle pathLength={100} cx="12" cy="12" r="4" />
      <path pathLength={100} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  thermometer: (
    <>
      <path pathLength={100} d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z" />
      <path pathLength={100} d="M12 9v7" />
      <circle pathLength={100} cx="12" cy="17" r="1.2" />
    </>
  ),
  vase: (
    <>
      <path pathLength={100} d="M8 3h8c0 3 2 4 2 8s-2 8-4 10H10C8 19 6 15 6 11s2-5 2-8Z" />
      <path pathLength={100} d="M9 5h6" />
    </>
  ),
}

// Часть блока flowers-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-082"]){
--vibeui-button-082-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-082-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-button-082-line:color-mix(in oklab,var(--vibeui-button-082-fg) 16%,transparent);
--vibeui-button-082-muted:color-mix(in oklab,var(--vibeui-button-082-fg) 62%,var(--vibeui-button-082-bg));
--vibeui-button-082-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-082-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-082"]{color-scheme:dark}
[data-vibeui-block="button-082"]{box-sizing:border-box}
[data-vibeui-block="button-082"] *{box-sizing:border-box}
@keyframes vibeui-button-082-draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
[data-vibeui-block="button-082"]{display:grid;grid-template-columns:2.4rem minmax(0,1fr) 1.6rem;align-items:center;gap:1.1rem;width:100%;padding:1.2rem 0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="button-082"]:focus-visible{outline:2px solid var(--vibeui-button-082-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="button-082"] [data-part="icon"]{width:2.4rem;height:2.4rem;color:var(--vibeui-button-082-muted);transition:color .3s}
[data-vibeui-block="button-082"] [data-part="icon"] path,[data-vibeui-block="button-082"] [data-part="icon"] circle{stroke-dasharray:100;stroke-dashoffset:0;opacity:.55;transition:opacity .3s}
[data-vibeui-block="button-082"][aria-expanded="true"] [data-part="icon"]{color:var(--vibeui-button-082-accent)}
[data-vibeui-block="button-082"][aria-expanded="true"] [data-part="icon"] :is(path,circle){opacity:1;animation:vibeui-button-082-draw .9s cubic-bezier(.2,.7,.2,1) both}
[data-vibeui-block="button-082"][aria-expanded="true"] [data-part="icon"] :is(path,circle):nth-child(2){transition-delay:.15s}
[data-vibeui-block="button-082"][aria-expanded="true"] [data-part="icon"] :is(path,circle):nth-child(3){transition-delay:.3s}
[data-vibeui-block="button-082"] h3{margin:0;font-family:var(--vibeui-button-082-display);font-weight:600;font-size:1.5rem;line-height:1.1;transition:color .3s}
[data-vibeui-block="button-082"]:hover h3{color:var(--vibeui-button-082-accent)}
[data-vibeui-block="button-082"] [data-part="plus"]{position:relative;width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid var(--vibeui-button-082-line)}
[data-vibeui-block="button-082"] [data-part="plus"]::before,[data-vibeui-block="button-082"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1px;background:currentColor;transform:translate(-50%,-50%);transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="button-082"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="button-082"][aria-expanded="true"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(0)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-082"] [data-part="icon"] :is(path,circle){stroke-dashoffset:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-082"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-заголовок аккордеона: иконка, название и плюс, раскрытие через aria-expanded. */
export function Button082({
  icon = "scissors",
  title = "Подрежьте стебли наискосок",
  accent,
  className,
  style,
  ...props
}: Button082Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-082-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-082" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-082" type="button"
        className={className}
        style={palette}
      >
        <svg data-part="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {ICONS[icon ?? "vase"]}
        </svg>
        <h3>{title}</h3>
        <i data-part="plus" aria-hidden="true" />
      </button>
    </>
  )
}
