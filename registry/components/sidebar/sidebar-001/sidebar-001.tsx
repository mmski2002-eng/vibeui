import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar001Item = {
  label: string
  href?: string
  /** Число справа: непрочитанные, черновики, ошибки. */
  count?: number
}

export type Sidebar001Section = {
  title?: string
  items: Sidebar001Item[]
}

export type Sidebar001Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  sections?: Sidebar001Section[]
  /** Подпись активного пункта. Сравнивается по тексту, а не по адресу. */
  activeLabel?: string
  accent?: string
}

// Идея компонента: активный пункт отмечен полосой у левого края и плотным
// фоном, а не только цветом текста. В длинном списке разделов взгляд находит
// текущее место сразу, и метка не исчезает при смене темы.
const STYLES = `
:where([data-vibeui-block="sidebar-001"]){
--vibeui-sidebar-001-fg:oklch(0.26 0.016 265);
--vibeui-sidebar-001-muted:oklch(0.55 0.014 265);
--vibeui-sidebar-001-bg:oklch(0.985 0.002 265);
--vibeui-sidebar-001-border:oklch(0.91 0.006 265);
--vibeui-sidebar-001-hover:oklch(0.55 0.02 265 / 7%);
--vibeui-sidebar-001-active:oklch(0.55 0.02 265 / 12%);
--vibeui-sidebar-001-accent:oklch(0.55 0.2 262);
--vibeui-sidebar-001-radius:0.5rem;
--vibeui-sidebar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-001"]{
display:flex;flex-direction:column;gap:1.125rem;
width:100%;max-width:15rem;box-sizing:border-box;
padding:0.875rem 0.75rem;
border:1px solid var(--vibeui-sidebar-001-border);
border-radius:0.875rem;
background:var(--vibeui-sidebar-001-bg);color:var(--vibeui-sidebar-001-fg);
font-family:var(--vibeui-sidebar-001-font);
}
[data-vibeui-block="sidebar-001"] [data-part="section"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-001"] [data-part="title"]{
padding:0 0.5rem 0.375rem;
font-size:0.6875rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-sidebar-001-muted);
}
[data-vibeui-block="sidebar-001"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-001"] a{
position:relative;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:var(--vibeui-sidebar-001-radius);
color:var(--vibeui-sidebar-001-muted);text-decoration:none;
font-size:0.875rem;line-height:1.35;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="sidebar-001"] a:hover{background:var(--vibeui-sidebar-001-hover);color:var(--vibeui-sidebar-001-fg)}
[data-vibeui-block="sidebar-001"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-001-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-001"] a[aria-current="page"]{
background:var(--vibeui-sidebar-001-active);color:var(--vibeui-sidebar-001-fg);font-weight:500;
}
/* Полоса у края: активный пункт отличается не только цветом. */
[data-vibeui-block="sidebar-001"] a[aria-current="page"]::before{
content:"";position:absolute;left:-0.75rem;top:0.3125rem;bottom:0.3125rem;
width:2px;border-radius:0 2px 2px 0;background:var(--vibeui-sidebar-001-accent);
}
[data-vibeui-block="sidebar-001"] [data-part="count"]{
flex:none;font-size:0.75rem;color:var(--vibeui-sidebar-001-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Sidebar001Section[] = [
  {
    title: "Проект",
    items: [
      { label: "Обзор", href: "#" },
      { label: "Страницы", href: "#", count: 12 },
      { label: "Медиа", href: "#" },
    ],
  },
  {
    title: "Публикация",
    items: [
      { label: "Домены", href: "#" },
      { label: "История", href: "#", count: 3 },
      { label: "Настройки", href: "#" },
    ],
  },
]

/**
 * Вертикальная навигация приложения с отмеченным текущим разделом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar001({
  sections = DEFAULT_SECTIONS,
  activeLabel = "Страницы",
  accent,
  className,
  style,
  ...props
}: Sidebar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="sidebar-001"
        aria-label="Разделы проекта"
        className={className}
        style={palette}
      >
        {sections.map((section, index) => (
          <div data-part="section" key={section.title ?? index}>
            {section.title ? (
              <span data-part="title">{section.title}</span>
            ) : null}
            <ul>
              {section.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={
                      item.label === activeLabel ? "page" : undefined
                    }
                  >
                    {item.label}
                    {item.count === undefined ? null : (
                      <span data-part="count">{item.count}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  )
}
