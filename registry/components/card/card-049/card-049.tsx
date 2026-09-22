import type { ComponentProps, CSSProperties } from "react"
import { Avatar001 } from "@/registry/components/avatar/avatar-001/avatar-001"

export type Card049Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  role?: string
  links?: Card049Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
export type Card049Link = {
  kind: "mail" | "site" | "chat"
  label: string
  href: string
}

const STYLES = `
:where([data-vibeui-block="card-049"]){
--vibeui-card-049-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-049-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-049-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-card-049-dur-2:180ms;
--vibeui-card-049-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-card-049-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-049"]{color-scheme:dark}
[data-vibeui-block="card-049"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-049"] *{box-sizing:border-box}
[data-vibeui-block="card-049"]{min-inline-size:0;display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:1.75rem 1.25rem;text-align:center;
border:1px solid var(--vibeui-card-049-border);border-radius:1.125rem;
background:var(--vibeui-card-049-card);
transition:border-color var(--vibeui-card-049-dur-2) ease,transform var(--vibeui-card-049-dur-2) ease,box-shadow var(--vibeui-card-049-dur-2) ease;}
[data-vibeui-block="card-049"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-049-accent) 40%,var(--vibeui-card-049-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-card-049-shadow);}
[data-vibeui-block="card-049"] [data-part="person-name"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="card-049"] [data-part="role"]{margin:0;color:var(--vibeui-card-049-muted);font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="card-049"] [data-part="links"]{display:flex;gap:0.5rem;margin-top:0.875rem}
[data-vibeui-block="card-049"] [data-part="link"]{width:2rem;height:2rem;border-radius:999px;display:grid;place-items:center;
border:1px solid var(--vibeui-card-049-border);
color:var(--vibeui-card-049-muted);text-decoration:none;
font-size:0.875rem;font-weight:650;line-height:1;
transition:color var(--vibeui-card-049-dur-2) ease,border-color var(--vibeui-card-049-dur-2) ease,background var(--vibeui-card-049-dur-2) ease;}
[data-vibeui-block="card-049"] [data-part="link"]:hover{color:var(--vibeui-card-049-accent);
border-color:color-mix(in oklab,var(--vibeui-card-049-accent) 45%,var(--vibeui-card-049-border));
background:color-mix(in oklab,var(--vibeui-card-049-accent) 8%,var(--vibeui-card-049-card));}
[data-vibeui-block="card-049"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-card-049-accent);outline-offset:2px;}
[data-vibeui-block="card-049"] [data-part="link"][data-kind="mail"]::before{content:"@"}
[data-vibeui-block="card-049"] [data-part="link"][data-kind="site"]::before{content:"↗"}
[data-vibeui-block="card-049"] [data-part="link"][data-kind="chat"]::before{content:"#"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-049"] *{animation:none!important;transition:none!important}}
`

/** Карточка человека для сетки команды: аватар, имя, роль и ряд ссылок-иконок на почту и профили. */
export function Card049({
  name = "Алексей Громов",
  image = "/demo/realty/object-01.webp",
  role = "Основатель, продукт",
  links = [],
  accent,
  className,
  style,
  ...props
}: Card049Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-049-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-049" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-049"
        className={className}
        style={palette}
      >
        <Avatar001 data-part="avatar" name={name} src={image} size="lg" status="none" aria-hidden="true" />
        <p data-part="person-name">{name}</p>
        <p data-part="role">{role}</p>
        {links && links.length > 0 ? (
          <span data-part="links">
            {links.map((link) => (
              <a
                key={link.kind + link.label}
                data-part="link"
                data-kind={link.kind}
                href={link.href}
                aria-label={`${link.label} — ${name}`}
              />
            ))}
          </span>
        ) : null}
      </li>
    </>
  )
}
