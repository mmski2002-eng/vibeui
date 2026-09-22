import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card052Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  role?: string
  city?: string
  since?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-052"]){
--vibeui-card-052-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-052-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-052-dur-2:180ms;
--vibeui-card-052-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-052"]{color-scheme:dark}
[data-vibeui-block="card-052"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-052"] *{box-sizing:border-box}
[data-vibeui-block="card-052"]{min-inline-size:0;display:grid;grid-template-columns:auto minmax(0,1fr) auto;
align-items:center;gap:0.875rem;
padding:0.75rem 0.5rem;border-top:1px solid var(--vibeui-card-052-border);
border-radius:0.5rem;
transition:background var(--vibeui-card-052-dur-2) ease;}
[data-vibeui-block="card-052"]:last-child{border-bottom:1px solid var(--vibeui-card-052-border)}
[data-vibeui-block="card-052"]:hover{background:color-mix(in oklab,var(--vibeui-card-052-accent) 7%,transparent);}
[data-vibeui-block="card-052"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="card-052"] [data-part="person-name"]{margin:0;font-size:0.9375rem;font-weight:650;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
[data-vibeui-block="card-052"] [data-part="role"]{margin:0;color:var(--vibeui-card-052-muted);font-size:0.8125rem;line-height:1.35;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
[data-vibeui-block="card-052"] [data-part="meta"]{display:grid;gap:0.0625rem;text-align:right;}
[data-vibeui-block="card-052"] [data-part="city"]{font-size:0.8125rem;white-space:nowrap}
[data-vibeui-block="card-052"] [data-part="since"]{color:var(--vibeui-card-052-muted);font-size:0.75rem;white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-052"] *{animation:none!important;transition:none!important}}
`

/** Строка списка команды: аватар, имя и роль слева, город и стаж справа, тонкий разделитель. */
export function Card052({
  name = "Алексей Громов",
  image = "/demo/realty/object-01.webp",
  role = "Основатель, продукт",
  city = "Санкт-Петербург",
  since = "с 2021",
  accent,
  className,
  style,
  ...props
}: Card052Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-052-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-052" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-052"
        className={className}
        style={palette}
      >
        <Avatar001 data-part="avatar" name={name} src={image} status="none" aria-hidden="true" />
        <span data-part="who">
          <p data-part="person-name">{name}</p>
          <p data-part="role">{role}</p>
        </span>
        <span data-part="meta">
          <span data-part="city">{city}</span>
          <span data-part="since">{since}</span>
        </span>
      </li>
    </>
  )
}
