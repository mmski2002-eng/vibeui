import type { ComponentProps, CSSProperties } from "react"

export type Card142Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  userName?: string
  userEmail?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-142"]){
--vibeui-card-142-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-142"]{color-scheme:dark}
[data-vibeui-block="card-142"]{box-sizing:border-box}
[data-vibeui-block="card-142"] *{box-sizing:border-box}
[data-vibeui-block="card-142"]{display:flex;flex-direction:column;gap:0.0625rem;
padding:0.5rem 0.625rem 0.625rem;}
[data-vibeui-block="card-142"] strong{font-size:0.875rem;font-weight:620;letter-spacing:-0.01em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
[data-vibeui-block="card-142"] span{font-size:0.75rem;color:var(--vibeui-card-142-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-142"] *{animation:none!important;transition:none!important}}
`

/** Шапка меню пользователя: имя и почта. */
export function Card142({
  userName = "Анна Ковалёва",
  userEmail = "anna@konturlab.ru",
  accent,
  className,
  style,
  ...props
}: Card142Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-142-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-142" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-142"
        className={className}
        style={palette}
      >
        <strong>{userName}</strong>
        <span>{userEmail}</span>
      </div>
    </>
  )
}
