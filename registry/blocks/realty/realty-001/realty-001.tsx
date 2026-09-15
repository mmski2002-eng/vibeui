"use client"

import { useId, useState, type CSSProperties } from "react"

export type Realty001Link = {
  label: string
  href: string
  current?: boolean
}

export type Realty001Props = {
  /** Имя агентства, серифом. */
  brand?: string
  brandHref?: string
  /** Подпись под именем: город, год основания. */
  caption?: string
  links?: readonly Realty001Link[]
  /** Телефон как есть и в виде ссылки tel:. */
  phone?: string
  phoneHref?: string
  actionLabel?: string
  actionHref?: string
  menuLabel?: string
  /** Прилипает к верху страницы. */
  sticky?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка агентства: имя серифом, тонкая латунная линия снизу, телефон
// крупно — в недвижимости звонят чаще, чем пишут, — и кнопка оценки.
// На узком экране ссылки и телефон прячутся в меню.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="realty-001"]){
--vibeui-realty-001-bg:light-dark(#f3ede3,#14211b);
--vibeui-realty-001-fg:light-dark(#173b2e,#eef0ea);
--vibeui-realty-001-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-realty-001-line:light-dark(color-mix(in oklab,#173b2e 14%,#f3ede3),color-mix(in oklab,#eef0ea 14%,#14211b));
--vibeui-realty-001-accent:#b8925a;
--vibeui-realty-001-on-accent:#14211b;
--vibeui-realty-001-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-001"]{color-scheme:dark}
:where([data-vibeui-block="realty-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-001"]{position:relative;z-index:20;box-sizing:border-box;display:block;background:color-mix(in oklab,var(--vibeui-realty-001-bg) 94%,transparent);backdrop-filter:blur(8px);color:var(--vibeui-realty-001-fg);font-family:var(--vibeui-realty-001-font);font-size:.9375rem;line-height:1.3;border-bottom:1px solid var(--vibeui-realty-001-line)}
[data-vibeui-block="realty-001"][data-sticky]{position:sticky;top:0}
[data-vibeui-block="realty-001"] *{box-sizing:border-box}
[data-vibeui-block="realty-001"] [data-part="bar"]{max-width:76rem;margin:0 auto;padding:.9rem 1.25rem;display:flex;align-items:center;gap:1rem 2rem}
[data-vibeui-block="realty-001"] [data-part="brand"]{display:flex;flex-direction:column;color:inherit;text-decoration:none;margin-right:auto;min-width:0;flex:none}
[data-vibeui-block="realty-001"] [data-part="name"]{font-family:var(--vibeui-realty-001-display);font-size:1.75rem;font-weight:600;line-height:1;letter-spacing:.01em;white-space:nowrap}
[data-vibeui-block="realty-001"] [data-part="caption"]{margin-top:.25rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-realty-001-muted);white-space:nowrap}
[data-vibeui-block="realty-001"] [data-part="nav"]{display:none;align-items:center;gap:1.5rem;margin:0;padding:0;list-style:none;white-space:nowrap}
[data-vibeui-block="realty-001"] [data-part="link"]{position:relative;color:inherit;text-decoration:none;font-weight:500;white-space:nowrap;padding:.25rem 0}
[data-vibeui-block="realty-001"] [data-part="link"]::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:1px;background:var(--vibeui-realty-001-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="realty-001"] [data-part="link"]:hover::after,[data-vibeui-block="realty-001"] [data-part="link"][aria-current]::after{transform:scaleX(1)}
[data-vibeui-block="realty-001"] [data-part="phone"]{display:none;font-family:var(--vibeui-realty-001-display);font-size:1.35rem;font-weight:600;color:inherit;text-decoration:none;white-space:nowrap;letter-spacing:.01em}
[data-vibeui-block="realty-001"] [data-part="action"]{display:none;align-items:center;padding:.65rem 1.25rem;border-radius:999px;background:var(--vibeui-realty-001-accent);color:var(--vibeui-realty-001-on-accent);font-weight:600;font-size:.875rem;text-decoration:none;white-space:nowrap;transition:transform .2s,box-shadow .3s}
[data-vibeui-block="realty-001"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 10px 24px -12px var(--vibeui-realty-001-accent)}
[data-vibeui-block="realty-001"] [data-part="link"]:focus-visible,[data-vibeui-block="realty-001"] [data-part="action"]:focus-visible,[data-vibeui-block="realty-001"] [data-part="toggle"]:focus-visible,[data-vibeui-block="realty-001"] [data-part="phone"]:focus-visible{outline:2px solid var(--vibeui-realty-001-accent);outline-offset:3px}
[data-vibeui-block="realty-001"] [data-part="toggle"]{appearance:none;border:1px solid var(--vibeui-realty-001-line);background:none;border-radius:999px;padding:.5rem .9rem;font:inherit;font-weight:600;color:inherit;cursor:pointer}
[data-vibeui-block="realty-001"] [data-part="sheet"]{display:grid;gap:.75rem;padding:.5rem 1.25rem 1.25rem;margin:0;list-style:none;border-top:1px solid var(--vibeui-realty-001-line)}
[data-vibeui-block="realty-001"] [data-part="sheet"][hidden]{display:none}
[data-vibeui-block="realty-001"] [data-part="sheet"] [data-part="link"],[data-vibeui-block="realty-001"] [data-part="sheet"] [data-part="phone"],[data-vibeui-block="realty-001"] [data-part="sheet"] [data-part="action"]{display:inline-flex;font-size:1.1rem}
@container (max-width: 47.99rem){[data-vibeui-block="realty-001"] [data-part="caption"]{max-width:14rem;overflow:hidden;text-overflow:ellipsis}}
@container (min-width: 48rem) and (max-width: 71.99rem){[data-vibeui-block="realty-001"] [data-part="caption"]{display:none}}
@container (min-width: 64rem){[data-vibeui-block="realty-001"] [data-part="nav"]{display:flex}[data-vibeui-block="realty-001"] [data-part="action"]{display:inline-flex}}
@container (min-width: 72rem){[data-vibeui-block="realty-001"] [data-part="phone"]{display:inline-flex}}
@container (min-width: 60rem){
[data-vibeui-block="realty-001"] [data-part="bar"]{padding:1rem 2rem}

[data-vibeui-block="realty-001"] [data-part="toggle"],[data-vibeui-block="realty-001"] [data-part="sheet"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="realty-001"] *{transition:none!important}}`

const DEFAULT_LINKS: Realty001Link[] = [
  { label: "Объекты", href: "#objects", current: true },
  { label: "Районы", href: "#districts" },
  { label: "Как мы работаем", href: "#process" },
  { label: "Ипотека", href: "#mortgage" },
  { label: "Агенты", href: "#agents" },
]

/** Шапка агентства недвижимости: серифное имя, телефон крупно, кнопка оценки. */
export function Realty001({
  brand = "Дом на Неве",
  brandHref = "#",
  caption = "Агентство недвижимости · Петербург",
  links = DEFAULT_LINKS,
  phone = "+7 812 240-00-40",
  phoneHref = "tel:+78122400040",
  actionLabel = "Оценить квартиру",
  actionHref = "#valuation",
  menuLabel = "Меню",
  sticky = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Realty001Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-realty-001-accent": accent } : null),
    ...(background ? { "--vibeui-realty-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const items = links.map((link, index) => (
    <li key={`${link.href}-${index}`}>
      <a href={link.href} data-part="link" aria-current={link.current ? "page" : undefined}>
        {link.label}
      </a>
    </li>
  ))

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-001" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="realty-001"
        data-tone={tone === "auto" ? undefined : tone}
        data-sticky={sticky ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <a href={brandHref} data-part="brand">
            <span data-part="name">{brand}</span>
            {caption ? <span data-part="caption">{caption}</span> : null}
          </a>
          <nav aria-label="Разделы">
            <ul data-part="nav">{items}</ul>
          </nav>
          {phone ? (
            <a href={phoneHref} data-part="phone">
              {phone}
            </a>
          ) : null}
          {actionLabel ? (
            <a href={actionHref} data-part="action">
              {actionLabel}
            </a>
          ) : null}
          <button type="button" data-part="toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
            {menuLabel}
          </button>
        </div>
        <ul id={id} data-part="sheet" hidden={!open}>
          {items}
          {phone ? (
            <li>
              <a href={phoneHref} data-part="phone">
                {phone}
              </a>
            </li>
          ) : null}
          {actionLabel ? (
            <li>
              <a href={actionHref} data-part="action">
                {actionLabel}
              </a>
            </li>
          ) : null}
        </ul>
      </header>
    </>
  )
}
