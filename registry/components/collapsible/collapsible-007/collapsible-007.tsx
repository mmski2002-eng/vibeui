"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible007Item = {
  label: string
  glyph: string
  badge?: string
}

export type Collapsible007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  items?: Collapsible007Item[]
  defaultCollapsed?: boolean
  /** Подпись кнопки, когда панель свёрнута. */
  expandLabel?: string
  /** Подпись кнопки, когда панель развёрнута. */
  collapseLabel?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель, которая сворачивается не в ноль, а в узкую полосу
// иконок — навигация остаётся доступной и в свёрнутом виде. Ширина едет по
// одной переменной, подписи не размонтируются, а прячутся нулевой шириной с
// overflow:hidden: тогда переход плавный, а порядок табуляции не скачет.
// В свёрнутом состоянии подпись уходит в title и aria-label кнопки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у панели
// по умолчанию нет, она темнеет вместе со страницей и не носит своей темы.
const STYLES = `
:where([data-vibeui-block="collapsible-007"]){
--vibeui-collapsible-007-bg:transparent;
--vibeui-collapsible-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-collapsible-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-collapsible-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-collapsible-007-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-collapsible-007-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 262));
--vibeui-collapsible-007-width:14rem;
--vibeui-collapsible-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-007"]{
display:flex;box-sizing:border-box;width:100%;max-width:14rem;
font-family:var(--vibeui-collapsible-007-font);
}
[data-vibeui-block="collapsible-007"] [data-part="rail"]{
display:flex;flex-direction:column;gap:0.25rem;
box-sizing:border-box;padding:0.5rem;
width:var(--vibeui-collapsible-007-width);
background:var(--vibeui-collapsible-007-bg);color:var(--vibeui-collapsible-007-fg);
border:1px solid var(--vibeui-collapsible-007-border);border-radius:1rem;
transition:width .26s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="collapsible-007"] [data-part="rail"][data-collapsed="true"]{--vibeui-collapsible-007-width:3.5rem}
[data-vibeui-block="collapsible-007"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;padding:0.25rem 0.25rem 0.5rem;
}
[data-vibeui-block="collapsible-007"] [data-part="brand"]{
font-size:0.8125rem;font-weight:700;white-space:nowrap;
}
[data-vibeui-block="collapsible-007"] [data-part="toggle"]{
display:grid;place-items:center;flex:none;margin-left:auto;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
appearance:none;border:1px solid var(--vibeui-collapsible-007-border);
background:none;color:var(--vibeui-collapsible-007-muted);cursor:pointer;
}
[data-vibeui-block="collapsible-007"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-collapsible-007-accent);outline-offset:2px}
[data-vibeui-block="collapsible-007"] [data-part="toggle"] span{
width:0.4375rem;height:0.4375rem;
border-left:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);transition:transform .22s ease;
}
[data-vibeui-block="collapsible-007"] [data-part="rail"][data-collapsed="true"] [data-part="toggle"] span{transform:rotate(-135deg)}
[data-vibeui-block="collapsible-007"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;padding:0.4375rem 0.5rem;
appearance:none;border:0;background:none;cursor:pointer;text-align:left;
border-radius:0.625rem;color:var(--vibeui-collapsible-007-muted);
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="collapsible-007"] [data-part="row"]:hover{background:color-mix(in oklab,var(--vibeui-collapsible-007-accent) 8%,transparent);color:var(--vibeui-collapsible-007-fg)}
[data-vibeui-block="collapsible-007"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-collapsible-007-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-007"] [data-part="row"][aria-current="page"]{background:color-mix(in oklab,var(--vibeui-collapsible-007-accent) 14%,transparent);color:var(--vibeui-collapsible-007-accent);font-weight:650}
[data-vibeui-block="collapsible-007"] [data-part="glyph"]{
flex:none;display:grid;place-items:center;width:1.25rem;font-size:0.9375rem;line-height:1;
}
/* Подпись не размонтируется: нулевая ширина + overflow даёт плавный переход. */
[data-vibeui-block="collapsible-007"] [data-part="label"]{
flex:1;min-width:0;overflow:hidden;white-space:nowrap;
opacity:1;transition:opacity .18s ease;
}
[data-vibeui-block="collapsible-007"] [data-part="badge"]{
flex:none;padding:0 0.375rem;border-radius:9999px;
background:var(--vibeui-collapsible-007-accent);color:var(--vibeui-collapsible-007-on-accent);
font-size:0.625rem;font-weight:700;line-height:1.15rem;
}
[data-vibeui-block="collapsible-007"] [data-part="rail"][data-collapsed="true"] [data-part="brand"],
[data-vibeui-block="collapsible-007"] [data-part="rail"][data-collapsed="true"] [data-part="label"],
[data-vibeui-block="collapsible-007"] [data-part="rail"][data-collapsed="true"] [data-part="badge"]{
flex:none;width:0;padding:0;opacity:0;overflow:hidden;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Collapsible007Item[] = [
  { label: "Каталог", glyph: "▦" },
  { label: "Компоненты", glyph: "◍", badge: "24" },
  { label: "Реестр", glyph: "⌗" },
  { label: "Настройки", glyph: "⚙" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Боковая панель, сворачивающаяся в полосу иконок: ширина едет по одной
 * переменной, подписи не размонтируются. Один файл, ноль зависимостей.
 */
export function Collapsible007({
  title = "VibeUI",
  items = DEFAULT_ITEMS,
  defaultCollapsed = false,
  expandLabel = "Развернуть панель",
  collapseLabel = "Свернуть панель",
  background = "",
  accent,
  className,
  style,
  ...props
}: Collapsible007Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const palette = {
    ...(accent ? { "--vibeui-collapsible-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-collapsible-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="collapsible-007"
        className={className}
        style={palette}
      >
        <nav data-part="rail" data-collapsed={collapsed} aria-label={title}>
          <div data-part="head">
            <span data-part="brand">{title}</span>
            <button
              type="button"
              data-part="toggle"
              aria-expanded={!collapsed}
              aria-label={collapsed ? expandLabel : collapseLabel}
              onClick={() => setCollapsed((value) => !value)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              data-part="row"
              title={collapsed ? item.label : undefined}
              aria-current={index === 0 ? "page" : undefined}
            >
              <span data-part="glyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span data-part="label">{item.label}</span>
              {item.badge ? <span data-part="badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
