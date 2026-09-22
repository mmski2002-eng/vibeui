import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card053Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-053"]){
--vibeui-card-053-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-053-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-053-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-053-dur-2:180ms;
--vibeui-card-053-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-053"]{color-scheme:dark}
[data-vibeui-block="card-053"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-053"] *{box-sizing:border-box}
[data-vibeui-block="card-053"]{min-inline-size:0;display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:1.75rem 1.25rem;text-align:center;
border:1px solid var(--vibeui-card-053-border);border-radius:1.125rem;
background:var(--vibeui-card-053-card);
transition:border-color var(--vibeui-card-053-dur-2) ease;}
[data-vibeui-block="card-053"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-053-accent) 40%,var(--vibeui-card-053-border));}
[data-vibeui-block="card-053"] [data-part="person-name"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="card-053"] [data-part="role"]{margin:0;color:var(--vibeui-card-053-muted);font-size:0.8125rem;line-height:1.4}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-053"] *{animation:none!important;transition:none!important}}
`

/** Карточка участника для сетки «мы нанимаем»: аватар, имя, роль и одна строка о том, чем занят. */
export function Card053({
  name = "Тимур Ахметов",
  image = "/demo/realty/object-01.webp",
  role = "Доступность и качество",
  accent,
  className,
  style,
  ...props
}: Card053Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-053-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-053" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-053"
        className={className}
        style={palette}
      >
        <Avatar001 data-part="avatar" name={name} src={image} size="lg" status="none" aria-hidden="true" />
        <p data-part="person-name">{name}</p>
        <p data-part="role">{role}</p>
      </li>
    </>
  )
}
