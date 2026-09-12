"use client"

import { useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

export type Navmenu006Section = {
  label: string
  items?: string[]
  href?: string
}

export type Navmenu006Props = {
  /**
   * Показать лист развёрнутым: витрина, скриншот. Лист и так раскрывается
   * в потоке и толкает содержимое, поэтому режим меняет только стартовое
   * состояние чекбокса — бургер продолжает закрывать и открывать его.
   */
  open?: boolean
  sections?: Navmenu006Section[]
  brand?: string
  actionLabel?: string
  /** Подпись рядом с бургером. */
  burgerLabel?: string
  /** Имя скрытого переключателя для скринридера. */
  toggleLabel?: string
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подпись текущего раздела: он помечается aria-current. */
  current?: string
  /** Подложка карточки. Пусто — своя палитра компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: мобильная навигация, где выпадающие панели заменены
// раскрытием списком — на узком экране летящая панель некуда встать, поэтому
// разделы разворачиваются вниз и толкают содержимое. Лист открывает чекбокс,
// разделы внутри — <details>, поэтому состояние живёт без единой строки JS.
const STYLES = `
:where([data-vibeui-block="navmenu-006"]){
--vibeui-navmenu-006-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-navmenu-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navmenu-006-muted:color-mix(in oklab,var(--vibeui-navmenu-006-fg) 68%,transparent);
--vibeui-navmenu-006-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-navmenu-006-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-navmenu-006-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-navmenu-006-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-navmenu-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-006"]{color-scheme:dark}
[data-vibeui-block="navmenu-006"]{
box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-navmenu-006-bg);color:var(--vibeui-navmenu-006-fg);
border:1px solid var(--vibeui-navmenu-006-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-006-font);overflow:hidden;
}
[data-vibeui-block="navmenu-006"] [data-part="top"]{
display:flex;align-items:center;gap:0.5rem;padding:0.625rem 0.75rem;
}
[data-vibeui-block="navmenu-006"] [data-part="brand"]{font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="navmenu-006"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="navmenu-006"] [data-part="burger"]{
margin-left:auto;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.625rem;border-radius:0.5rem;
font-size:0.8125rem;color:var(--vibeui-navmenu-006-muted);
border:1px solid var(--vibeui-navmenu-006-border);
}
[data-vibeui-block="navmenu-006"] input:focus-visible + [data-part="burger"]{outline:2px solid var(--vibeui-navmenu-006-accent);outline-offset:2px}
[data-vibeui-block="navmenu-006"] [data-part="bars"]{display:grid;gap:0.1875rem;width:0.875rem}
[data-vibeui-block="navmenu-006"] [data-part="bars"] i{display:block;height:1.5px;background:currentColor;border-radius:1px;transition:transform .18s ease,opacity .18s ease}
[data-vibeui-block="navmenu-006"] input:checked + [data-part="burger"] [data-part="bars"] i:first-child{transform:translateY(0.3125rem) rotate(45deg)}
[data-vibeui-block="navmenu-006"] input:checked + [data-part="burger"] [data-part="bars"] i:nth-child(2){opacity:0}
[data-vibeui-block="navmenu-006"] input:checked + [data-part="burger"] [data-part="bars"] i:last-child{transform:translateY(-0.3125rem) rotate(-45deg)}
/* Лист раскрывается высотой, а не display:none — так переход виден, а ссылки
   остаются в разметке одинаково при любом состоянии. */
[data-vibeui-block="navmenu-006"] [data-part="sheet"]{
display:grid;grid-template-rows:0fr;transition:grid-template-rows .22s ease;
}
[data-vibeui-block="navmenu-006"]:has(input:checked) [data-part="sheet"]{grid-template-rows:1fr}
[data-vibeui-block="navmenu-006"] [data-part="sheet"] > div{overflow:hidden}
[data-vibeui-block="navmenu-006"] [data-part="list"]{
margin:0;padding:0 0.5rem 0.5rem;list-style:none;
border-top:1px solid var(--vibeui-navmenu-006-border);
}
[data-vibeui-block="navmenu-006"] [data-part="row-wrap"]{border-bottom:1px solid var(--vibeui-navmenu-006-border)}
[data-vibeui-block="navmenu-006"] [data-part="row-wrap"]:last-child{border-bottom:0}
[data-vibeui-block="navmenu-006"] [data-part="head"]{
list-style:none;cursor:pointer;
display:flex;align-items:center;justify-content:space-between;
padding:0.75rem 0.5rem;font-size:0.9375rem;
}
[data-vibeui-block="navmenu-006"] [data-part="head"]::-webkit-details-marker{display:none}
[data-vibeui-block="navmenu-006"] [data-part="head"]:focus-visible{outline:2px solid var(--vibeui-navmenu-006-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="navmenu-006"] [data-part="caret"]{
width:0.4375rem;height:0.4375rem;
border:1.5px solid var(--vibeui-navmenu-006-muted);border-left:0;border-top:0;
transform:rotate(45deg);margin-top:-0.1875rem;transition:transform .16s ease;
}
[data-vibeui-block="navmenu-006"] [data-part="row"][open] [data-part="caret"]{transform:rotate(-135deg);margin-top:0.125rem}
[data-vibeui-block="navmenu-006"] [data-part="sub"]{margin:0;padding:0 0 0.5rem;list-style:none}
[data-vibeui-block="navmenu-006"] [data-part="link"]{
display:block;padding:0.5rem 0.5rem 0.5rem 1rem;border-radius:0.5rem;
text-decoration:none;color:var(--vibeui-navmenu-006-muted);font-size:0.875rem;
}
[data-vibeui-block="navmenu-006"] [data-part="link"]:hover{background:var(--vibeui-navmenu-006-hover);color:var(--vibeui-navmenu-006-fg)}
[data-vibeui-block="navmenu-006"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-006-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-006"] [data-part="plain"]{
display:block;padding:0.75rem 0.5rem;text-decoration:none;color:inherit;font-size:0.9375rem;
}
[data-vibeui-block="navmenu-006"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-006-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="navmenu-006"] [data-part="action"]{
display:block;margin:0.5rem;padding:0.6875rem;border-radius:0.625rem;text-align:center;
background:var(--vibeui-navmenu-006-accent);color:oklch(from var(--vibeui-navmenu-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="navmenu-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-navmenu-006-accent);outline-offset:2px}
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-006"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-006-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Navmenu006Section[] = [
  {
    label: "Продукт",
    items: ["Редактор", "Шаблоны", "Аналитика", "Интеграции"],
  },
  {
    label: "Решения",
    items: ["Студиям", "Магазинам", "Медиа"],
  },
  { label: "Цены", href: "#" },
  { label: "Документация", href: "#" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Мобильная навигация: бургер открывает лист, разделы раскрываются списком.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu006({
  open = false,
  sections = DEFAULT_SECTIONS,
  brand = "Полотно",
  actionLabel = "Начать бесплатно",
  burgerLabel = "Меню",
  toggleLabel = "Показать меню",
  label = "Основная навигация",
  current = "Цены",
  background = "",
  accent,
  className,
  style,
}: Navmenu006Props) {
  const [active, setActive] = useState(current)

  // Демо-данные ведут в "#": без этого клик по пункту прокручивает страницу
  // вверх и меняет адрес, а меню остаётся прежним. Ссылка с настоящим href
  // из данных проходит дальше и работает как обычная.
  const onNavigate = (event: ReactMouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest("a")

    if (!link || !link.getAttribute("href")?.startsWith("#")) {
      return
    }

    event.preventDefault()

    // Панель может быть и в верхнем слое, и развёрнутой в потоке витрины:
    // ссылка внутри неё — это переход, а не смена активного раздела.
    const panel = link.closest<HTMLElement>(
      '[popover],[data-part="panel"],[data-part="menu"],[data-part="sheet"],[data-part="sub"]',
    )
    const label = link.textContent?.trim()

    if (panel) {
      if (panel.matches(":popover-open")) {
        panel.hidePopover()
      }

      return
    }

    if (label) {
      setActive(label)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-navmenu-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-006" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-006"
        onClick={onNavigate}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="top">
          <span data-part="brand">{brand}</span>
          <input
            type="checkbox"
            id="vibeui-navmenu-006-toggle"
            aria-label={toggleLabel}
            defaultChecked={open}
          />
          <label data-part="burger" htmlFor="vibeui-navmenu-006-toggle">
            <span data-part="bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {burgerLabel}
          </label>
        </div>
        <div data-part="sheet">
          <div>
            <ul data-part="list">
              {sections.map((section) => (
                <li key={section.label} data-part="row-wrap">
                  {section.items ? (
                    <details data-part="row">
                      <summary data-part="head">
                        {section.label}
                        <span data-part="caret" aria-hidden="true" />
                      </summary>
                      <ul data-part="sub">
                        {section.items.map((item) => (
                          <li key={item}>
                            <a data-part="link" href="#">
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <a
                      data-part="plain"
                      href={section.href ?? "#"}
                      aria-current={
                        section.label === active ? "page" : undefined
                      }
                    >
                      {section.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <a data-part="action" href="#">
              {actionLabel}
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
