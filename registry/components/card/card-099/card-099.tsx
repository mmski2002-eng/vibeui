import type { ComponentProps, CSSProperties } from "react"

export type Card099Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  icon?: "biometrics" | "lock" | "radar" | "shield"
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Icon({ kind }: { kind: NonNullable<Card099Layer["icon"]> }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1 }
  switch (kind) {
    case "biometrics":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M7 4.5A9 9 0 0 1 17 4.5M4 9a9 9 0 0 1 16 0M6.5 20a9 9 0 0 1-1.5-8 7 7 0 0 1 14 0c0 2-.3 4-1 6M9.5 21a7 7 0 0 1-.5-9 3 3 0 0 1 6 0c0 2.5-.5 6-1.5 8M12 12v9" />
        </svg>
      )
    case "lock":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v2.5" />
        </svg>
      )
    case "radar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="12" cy="12" r="9" />
          <path {...common} d="M12 3a9 9 0 0 1 9 9M12 7a5 5 0 0 1 5 5M12 12l5-5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6zM9 12l2 2 4-4" />
        </svg>
      )
  }
}

// Часть блока fintech-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-099"]){
--vibeui-card-099-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-099-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-099-glass:color-mix(in oklab,var(--vibeui-card-099-fg) 5%,transparent);
--vibeui-card-099-muted:color-mix(in oklab,var(--vibeui-card-099-fg) 62%,var(--vibeui-card-099-bg));
--vibeui-card-099-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-099-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-099"]{color-scheme:dark}
[data-vibeui-block="card-099"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-099"] *{box-sizing:border-box}
@keyframes vibeui-card-099-draw{to{stroke-dashoffset:0}}
[data-vibeui-block="card-099"]{display:grid;grid-template-columns:auto 1fr;gap:.2rem .8rem;align-items:center;padding:.6rem .8rem;border-radius:.9rem;border:1px solid transparent;opacity:.5;transition:opacity .4s,border-color .4s,background .4s}
[data-vibeui-block="card-099"][data-active="true"]{opacity:1;background:var(--vibeui-card-099-glass);border-color:color-mix(in oklab,var(--vibeui-card-099-accent) 40%,transparent)}
[data-vibeui-block="card-099"] svg{width:1.6rem;height:1.6rem;color:var(--vibeui-card-099-accent);grid-row:span 2}
[data-vibeui-block="card-099"] svg path,[data-vibeui-block="card-099"] svg circle{stroke-dasharray:1;stroke-dashoffset:1}
[data-vibeui-block="card-099"][data-active="true"] svg path,[data-vibeui-block="card-099"][data-active="true"] svg circle{animation:vibeui-card-099-draw .9s cubic-bezier(.2,.7,.2,1) forwards}
[data-vibeui-block="card-099"] h3{margin:0;font-family:var(--vibeui-card-099-display);font-size:1rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="card-099"] p{margin:0;font-size:.84rem;color:var(--vibeui-card-099-muted);display:none}
[data-vibeui-block="card-099"][data-active="true"] p{display:block}
@container (min-width: 56rem){
[data-vibeui-block="card-099"] p{display:block}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-099"] svg path,[data-vibeui-block="card-099"] svg circle{stroke-dashoffset:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-099"] *{animation:none!important;transition:none!important}}
`

/** Карточка слоя безопасности: иконка (биометрия, щит, ключ…), заголовок и текст; активна по data-active. */
export function Card099({
  title = "Вход по лицу и ключу",
  icon,
  text = "Биометрия на телефоне, аппаратный ключ или подтверждение в приложении. СМС-кодов, которые перехватывают, нет.",
  accent,
  className,
  style,
  ...props
}: Card099Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-099-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-099" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-099"
        className={className}
        style={palette}
      >
        <Icon kind={icon ?? "shield"} />
        <h3>{title}</h3>
        <p>{text}</p>
      </li>
    </>
  )
}
