import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar004Child = {
  label: string
  href?: string
}

export type Sidebar004Group = {
  label: string
  children: Sidebar004Child[]
}

export type Sidebar004Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  groups?: Sidebar004Group[]
  activeLabel?: string
  /** Подпись всей навигации для скринридера. */
  navLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: раскрывающиеся разделы без единой строки JS — каждая
// группа это <details>, а состояние держит браузер. Группа с текущим
// пунктом открыта заранее: меню не должно требовать клика, чтобы показать,
// где пользователь находится. Свёрнутая группа с активным потомком помечена
// точкой, иначе после закрытия раздела текущее место пропадает из виду.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="sidebar-004"]){
--vibeui-sidebar-004-bg:transparent;
--vibeui-sidebar-004-fg:light-dark(oklch(0.25 0.016 265),oklch(0.93 0.006 265));
--vibeui-sidebar-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-sidebar-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-sidebar-004-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.85 0.02 265 / 10%));
--vibeui-sidebar-004-accent:light-dark(oklch(0.54 0.16 300),oklch(0.74 0.14 300));
--vibeui-sidebar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-004"]{
display:flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-004-bg);color:var(--vibeui-sidebar-004-fg);
border:1px solid var(--vibeui-sidebar-004-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-004-font);
}
[data-vibeui-block="sidebar-004"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="sidebar-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="sidebar-004"] summary:hover{background:var(--vibeui-sidebar-004-hover)}
[data-vibeui-block="sidebar-004"] summary:focus-visible{outline:2px solid var(--vibeui-sidebar-004-accent);outline-offset:-2px}
/* Галка нарисована бордюрами: иконочный шрифт в самодостаточный файл не влезет. */
[data-vibeui-block="sidebar-004"] [data-part="chevron"]{
width:0.375rem;height:0.375rem;flex:none;
border-right:1.5px solid var(--vibeui-sidebar-004-muted);
border-bottom:1.5px solid var(--vibeui-sidebar-004-muted);
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="sidebar-004"] details[open] > summary [data-part="chevron"]{transform:rotate(45deg)}
/* Точка у свёрнутой группы: закрыв раздел, не теряем «где я». */
[data-vibeui-block="sidebar-004"] [data-part="mark"]{
margin-left:auto;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-sidebar-004-accent);
}
[data-vibeui-block="sidebar-004"] details[open] > summary [data-part="mark"]{display:none}
[data-vibeui-block="sidebar-004"] ul{
margin:0.0625rem 0 0.375rem 0.6875rem;padding:0 0 0 0.5rem;list-style:none;
display:flex;flex-direction:column;gap:0.0625rem;
border-left:1px solid var(--vibeui-sidebar-004-border);
}
[data-vibeui-block="sidebar-004"] a{
display:block;padding:0.3125rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-sidebar-004-muted);text-decoration:none;
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="sidebar-004"] a:hover{background:var(--vibeui-sidebar-004-hover);color:var(--vibeui-sidebar-004-fg)}
[data-vibeui-block="sidebar-004"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-004-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-004"] a[aria-current="page"]{
color:var(--vibeui-sidebar-004-fg);font-weight:600;
background:color-mix(in oklab,var(--vibeui-sidebar-004-accent) 12%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Sidebar004Group[] = [
  {
    label: "Каталог",
    children: [
      { label: "Товары", href: "#" },
      { label: "Категории", href: "#" },
      { label: "Бренды", href: "#" },
    ],
  },
  {
    label: "Продажи",
    children: [
      { label: "Заказы", href: "#" },
      { label: "Возвраты", href: "#" },
      { label: "Промокоды", href: "#" },
    ],
  },
  {
    label: "Настройки",
    children: [
      { label: "Доставка", href: "#" },
      { label: "Оплата", href: "#" },
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
 * Меню с разделами и подпунктами: группы на details, текущая раскрыта заранее.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar004({
  groups = DEFAULT_GROUPS,
  activeLabel = "Возвраты",
  navLabel = "Разделы магазина",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar004Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-004" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="sidebar-004"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        {groups.map((group) => {
          const holdsActive = group.children.some(
            (child) => child.label === activeLabel,
          )
          return (
            <details key={group.label} open={holdsActive}>
              <summary>
                <span data-part="chevron" aria-hidden="true" />
                {group.label}
                {holdsActive ? (
                  <span data-part="mark" aria-hidden="true" />
                ) : null}
              </summary>
              <ul>
                {group.children.map((child) => (
                  <li key={child.label}>
                    <a
                      href={child.href}
                      aria-current={
                        child.label === activeLabel ? "page" : undefined
                      }
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )
        })}
      </nav>
    </>
  )
}
