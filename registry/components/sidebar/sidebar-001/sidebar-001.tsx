import type { ComponentProps, CSSProperties } from "react"

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

export type Sidebar001Props = Omit<ComponentProps<"nav">, "children"> & {
  sections?: Sidebar001Section[]
  /** Подпись активного пункта. Сравнивается по тексту, а не по адресу. */
  activeLabel?: string
  /** Подпись всей навигации для скринридера. */
  navLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: активный пункт отмечен полосой у левого края и плотным
// фоном, а не только цветом текста. В длинном списке разделов взгляд находит
// текущее место сразу, и метка не исчезает при смене темы.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="sidebar-001"]){
--vibeui-sidebar-001-fg:light-dark(oklch(0.26 0 265),oklch(0.93 0 265));
--vibeui-sidebar-001-muted:color-mix(in oklab,var(--vibeui-sidebar-001-fg) 68%,transparent);
--vibeui-sidebar-001-bg:transparent;
--vibeui-sidebar-001-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-sidebar-001-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.85 0 265 / 10%));
--vibeui-sidebar-001-active:light-dark(oklch(0.55 0 265 / 12%),oklch(0.85 0 265 / 17%));
--vibeui-sidebar-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.17 262));
--vibeui-sidebar-001-radius:0.5rem;
--vibeui-sidebar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-001"]{color-scheme:dark}
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
font-size:0.75rem;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-sidebar-001-muted);
}
[data-vibeui-block="sidebar-001"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-001"] a{
position:relative;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:var(--vibeui-sidebar-001-radius);
color:var(--vibeui-sidebar-001-muted);text-decoration:none;
font-size:0.9375rem;line-height:1.35;
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
flex:none;font-size:0.875rem;color:var(--vibeui-sidebar-001-muted);
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
 * Вертикальная навигация приложения с отмеченным текущим разделом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar001({
  sections = DEFAULT_SECTIONS,
  activeLabel = "Страницы",
  navLabel = "Разделы проекта",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-001"
        aria-label={navLabel}
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
