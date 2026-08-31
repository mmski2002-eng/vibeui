"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar003Item = {
  label: string
  href?: string
  /** Путь SVG в системе координат 16×16: иконка рисуется без библиотеки. */
  icon: string
}

export type Sidebar003Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Sidebar003Item[]
  activeLabel?: string
  collapsedLabel?: string
  accent?: string
}

// Идея компонента: меню сворачивается в полосу иконок, а не исчезает. Подписи
// не удаляются из разметки — они схлопываются по ширине, поэтому скринридер
// и поиск по странице продолжают их видеть, а ширина колонки меняется одной
// переменной. В свёрнутом виде у каждой ссылки остаётся title: иконка без
// подписи опознаётся не всеми и не сразу.
const STYLES = `
:where([data-vibeui-block="sidebar-003"]){
--vibeui-sidebar-003-bg:oklch(0.985 0.002 265);
--vibeui-sidebar-003-fg:oklch(0.25 0.016 265);
--vibeui-sidebar-003-muted:oklch(0.55 0.014 265);
--vibeui-sidebar-003-border:oklch(0.91 0.006 265);
--vibeui-sidebar-003-accent:oklch(0.55 0.19 262);
--vibeui-sidebar-003-width:13rem;
--vibeui-sidebar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:var(--vibeui-sidebar-003-width);box-sizing:border-box;
padding:0.625rem;
background:var(--vibeui-sidebar-003-bg);color:var(--vibeui-sidebar-003-fg);
border:1px solid var(--vibeui-sidebar-003-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-003-font);
transition:max-width .2s ease;
}
/* Свёрнутое состояние — одна переменная ширины, остальное подстраивается. */
[data-vibeui-block="sidebar-003"][data-collapsed="true"]{--vibeui-sidebar-003-width:3.5rem}
[data-vibeui-block="sidebar-003"] [data-part="toggle"]{
appearance:none;cursor:pointer;align-self:flex-end;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-sidebar-003-border);border-radius:0.5rem;
background:oklch(1 0 0);color:var(--vibeui-sidebar-003-muted);
}
[data-vibeui-block="sidebar-003"] [data-part="toggle"]:hover{color:var(--vibeui-sidebar-003-fg)}
[data-vibeui-block="sidebar-003"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-sidebar-003-accent);outline-offset:2px}
[data-vibeui-block="sidebar-003"] [data-part="toggle"] svg{width:0.875rem;height:0.875rem;display:block;transition:transform .2s ease}
[data-vibeui-block="sidebar-003"][data-collapsed="true"] [data-part="toggle"]{align-self:center}
[data-vibeui-block="sidebar-003"][data-collapsed="true"] [data-part="toggle"] svg{transform:rotate(180deg)}
[data-vibeui-block="sidebar-003"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-003"] a{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-003-muted);text-decoration:none;
font-size:0.875rem;line-height:1.3;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="sidebar-003"] a:hover{background:oklch(0.55 0.02 265 / 8%);color:var(--vibeui-sidebar-003-fg)}
[data-vibeui-block="sidebar-003"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-003-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-003"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-sidebar-003-accent) 12%,transparent);
color:var(--vibeui-sidebar-003-fg);font-weight:600;
}
[data-vibeui-block="sidebar-003"] a[aria-current="page"] svg{color:var(--vibeui-sidebar-003-accent)}
[data-vibeui-block="sidebar-003"] svg{width:1rem;height:1rem;flex:none;display:block}
/* Подпись схлопывается по ширине, но остаётся в разметке для скринридера. */
[data-vibeui-block="sidebar-003"] [data-part="label"]{
overflow:hidden;transition:max-width .2s ease,opacity .16s ease;
max-width:8rem;opacity:1;
}
[data-vibeui-block="sidebar-003"][data-collapsed="true"] [data-part="label"]{max-width:0;opacity:0}
[data-vibeui-block="sidebar-003"][data-collapsed="true"] a{justify-content:center;gap:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar003Item[] = [
  { label: "Обзор", href: "#", icon: "M2 8.5 8 3l6 5.5M4 8v5h8V8" },
  { label: "Задачи", href: "#", icon: "M3 4h10M3 8h10M3 12h6" },
  {
    label: "Команда",
    href: "#",
    icon: "M5.5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5.5 6H2a3.5 3.5 0 0 1 7 0Zm0 0h4a3 3 0 0 0-4-2.8",
  },
  { label: "Отчёты", href: "#", icon: "M3 13V7m4 6V3m4 10V9" },
  {
    label: "Настройки",
    href: "#",
    icon: "M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 1.5v1.5M8 13v1.5M2.5 8H1M15 8h-1.5",
  },
]

/**
 * Меню, сворачивающееся в полосу иконок: ширина меняется одной переменной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar003({
  items = DEFAULT_ITEMS,
  activeLabel = "Задачи",
  collapsedLabel = "Свернуть меню",
  accent,
  className,
  style,
  ...props
}: Sidebar003Props) {
  const [collapsed, setCollapsed] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-sidebar-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="sidebar-003"
        data-collapsed={collapsed}
        aria-label="Основное меню"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Развернуть меню" : collapsedLabel}
          onClick={() => setCollapsed((value) => !value)}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <path
              d="M10 3 5 8l5 5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={item.label === activeLabel ? "page" : undefined}
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                  <path
                    d={item.icon}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span data-part="label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
