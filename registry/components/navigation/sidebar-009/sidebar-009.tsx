"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar009Item = {
  label: string
  href?: string
}

export type Sidebar009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Sidebar009Item[]
  activeLabel?: string
  title?: string
  openLabel?: string
  accent?: string
}

// Идея компонента: меню-ящик выезжает слева и затемняет то, что под ним.
// Затемнение здесь не декорация: оно ловит нажатие мимо панели и закрывает
// ящик — на телефоне это главный способ выйти. Закрытый ящик помечен inert,
// поэтому таб не проваливается в невидимые ссылки, а при открытии фокус
// уезжает на кнопку закрытия, чтобы Escape и Tab работали сразу.
const STYLES = `
:where([data-vibeui-block="sidebar-009"]){
--vibeui-sidebar-009-bg:oklch(1 0 0);
--vibeui-sidebar-009-fg:oklch(0.25 0.016 265);
--vibeui-sidebar-009-muted:oklch(0.55 0.014 265);
--vibeui-sidebar-009-border:oklch(0.91 0.006 265);
--vibeui-sidebar-009-accent:oklch(0.55 0.19 262);
--vibeui-sidebar-009-scrim:oklch(0.2 0.02 265 / 45%);
--vibeui-sidebar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-009"]{
position:relative;overflow:hidden;
display:flex;flex-direction:column;
width:100%;max-width:20rem;height:16rem;box-sizing:border-box;
background:var(--vibeui-sidebar-009-bg);color:var(--vibeui-sidebar-009-fg);
border:1px solid var(--vibeui-sidebar-009-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-009-font);
}
[data-vibeui-block="sidebar-009"] [data-part="bar"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-sidebar-009-border);
}
[data-vibeui-block="sidebar-009"] [data-part="burger"],
[data-vibeui-block="sidebar-009"] [data-part="close"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-sidebar-009-border);border-radius:0.5rem;
background:var(--vibeui-sidebar-009-bg);color:var(--vibeui-sidebar-009-fg);
}
[data-vibeui-block="sidebar-009"] [data-part="burger"]:focus-visible,
[data-vibeui-block="sidebar-009"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-sidebar-009-accent);outline-offset:2px}
[data-vibeui-block="sidebar-009"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="sidebar-009"] [data-part="brand"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="sidebar-009"] [data-part="page"]{
flex:1;padding:0.75rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-sidebar-009-muted);
}
/* Затемнение ловит нажатие мимо панели: на телефоне это главный выход. */
[data-vibeui-block="sidebar-009"] [data-part="scrim"]{
appearance:none;border:0;padding:0;cursor:pointer;
position:absolute;inset:0;z-index:1;
background:var(--vibeui-sidebar-009-scrim);
opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease;
}
[data-vibeui-block="sidebar-009"][data-open="true"] [data-part="scrim"]{opacity:1;visibility:visible}
[data-vibeui-block="sidebar-009"] [data-part="drawer"]{
position:absolute;inset:0 auto 0 0;z-index:2;
display:flex;flex-direction:column;gap:0.625rem;
width:12rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-009-bg);
border-right:1px solid var(--vibeui-sidebar-009-border);
box-shadow:0 0 24px oklch(0.2 0.02 265 / 18%);
transform:translateX(-100%);transition:transform .22s ease;
}
[data-vibeui-block="sidebar-009"][data-open="true"] [data-part="drawer"]{transform:translateX(0)}
[data-vibeui-block="sidebar-009"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="sidebar-009"] [data-part="title"]{margin:0;font-size:0.8125rem;font-weight:700;letter-spacing:0.02em}
[data-vibeui-block="sidebar-009"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-009"] [data-part="drawer"] a{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-009-muted);text-decoration:none;font-size:0.875rem;line-height:1.3;
}
[data-vibeui-block="sidebar-009"] [data-part="drawer"] a:hover{background:oklch(0.55 0.02 265 / 8%);color:var(--vibeui-sidebar-009-fg)}
[data-vibeui-block="sidebar-009"] [data-part="drawer"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-009-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-009"] [data-part="drawer"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-sidebar-009-accent) 14%,transparent);
color:var(--vibeui-sidebar-009-fg);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar009Item[] = [
  { label: "Главная", href: "#" },
  { label: "Каталог", href: "#" },
  { label: "Заказы", href: "#" },
  { label: "Избранное", href: "#" },
  { label: "Поддержка", href: "#" },
]

/**
 * Мобильное меню-ящик: выезжает слева, затемнение закрывает по нажатию мимо.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar009({
  items = DEFAULT_ITEMS,
  activeLabel = "Заказы",
  title = "Меню",
  openLabel = "Открыть меню",
  accent,
  className,
  style,
  ...props
}: Sidebar009Props) {
  const [open, setOpen] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  const burger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeButton.current?.focus()
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-sidebar-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  function close() {
    setOpen(false)
    burger.current?.focus()
  }

  return (
    <>
      <style href="vibeui-sidebar-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sidebar-009"
        data-open={open}
        className={className}
        style={palette}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) close()
        }}
      >
        <div data-part="bar">
          <button
            type="button"
            data-part="burger"
            ref={burger}
            aria-expanded={open}
            aria-label={openLabel}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M2 4h12M2 8h12M2 12h12"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span data-part="brand">Северный порт</span>
        </div>
        <p data-part="page">
          Содержимое страницы. Ящик выезжает поверх него и затемняет всё, что
          под ним, — нажатие по затемнению закрывает меню.
        </p>
        <button
          type="button"
          data-part="scrim"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
        />
        <nav data-part="drawer" aria-label={title} inert={!open}>
          <div data-part="head">
            <h3 data-part="title">{title}</h3>
            <button
              type="button"
              data-part="close"
              ref={closeButton}
              aria-label="Закрыть меню"
              onClick={close}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <ul>
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={item.label === activeLabel ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
