import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card050Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  department?: string
  image?: string
  role?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-050"]){
--vibeui-card-050-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-050-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-050-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-050-dur-2:180ms;
--vibeui-card-050-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-050"]{color-scheme:dark}
[data-vibeui-block="card-050"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-050"] *{box-sizing:border-box}
[data-vibeui-block="card-050"]{min-inline-size:0;display:flex;align-items:center;gap:0.875rem;
padding:1rem 1.125rem;border:1px solid var(--vibeui-card-050-border);border-radius:1rem;
background:var(--vibeui-card-050-card);
transition:border-color var(--vibeui-card-050-dur-2) ease;}
[data-vibeui-block="card-050"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-050-accent) 40%,var(--vibeui-card-050-border));}
[data-vibeui-block="card-050"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-050"] [data-part="person-name"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="card-050"] [data-part="role"]{margin:0;color:var(--vibeui-card-050-muted);font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="card-050"] [data-part="dept"]{margin-left:auto;flex:none;align-self:flex-start;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-card-050-border);
color:var(--vibeui-card-050-muted);font-size:0.6875rem;font-weight:600;white-space:nowrap;}
[data-vibeui-block="card-050"] [data-part="dept"]::before{content:"";width:0.375rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-card-050-accent);color:oklch(from var(--vibeui-card-050-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-050"] *{animation:none!important;transition:none!important}}
`

/** Карточка участника с аватаром, именем, ролью и меткой отдела для сетки с фильтром. */
export function Card050({
  name = "Вера Лапина",
  department = "Дизайн",
  image,
  role = "Дизайн-система и токены",
  accent,
  className,
  style,
  ...props
}: Card050Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-050-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-050" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-050"
        className={className}
        style={palette}
      >
        <Avatar001 data-part="avatar" name={name} src={image} status="none" aria-hidden="true" />
        <span data-part="who">
          <p data-part="person-name">{name}</p>
          <p data-part="role">{role}</p>
        </span>
        <span data-part="dept">{department}</span>
      </li>
    </>
  )
}
