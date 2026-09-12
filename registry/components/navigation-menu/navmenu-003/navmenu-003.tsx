"use client"

import { useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

export type Navmenu003Group = {
  label: string
  items?: string[]
  href?: string
}

export type Navmenu003Props = {
  /**
   * Показать первый раздел развёрнутым в потоке полосы: витрина, скриншот.
   * В этом режиме столбик не висит слоем, а раздвигает полосу вниз.
   */
  open?: boolean
  groups?: Navmenu003Group[]
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подпись текущего раздела: он помечается aria-current. */
  current?: string
  /** Подложка полосы и выпадающего столбика. Пусто — своя палитра. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: самое простое выпадающее меню разделов — один столбик ссылок
// без описаний, картинок и колонок. Открытие и взаимное закрытие держит атрибут
// name у <details>: браузер сам следит, что раскрыт только один раздел. JS нет,
// значит меню работает и до гидратации, и при отключённых скриптах.
const STYLES = `
:where([data-vibeui-block="navmenu-003"]){
--vibeui-navmenu-003-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-navmenu-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navmenu-003-muted:color-mix(in oklab,var(--vibeui-navmenu-003-fg) 68%,transparent);
--vibeui-navmenu-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-navmenu-003-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-navmenu-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-navmenu-003-shadow:light-dark(oklch(0.2 0 265 / 42%),oklch(0 0 0 / 70%));
--vibeui-navmenu-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-003"]{color-scheme:dark}
[data-vibeui-block="navmenu-003"]{
box-sizing:border-box;width:100%;max-width:32rem;padding:0.375rem;
display:flex;align-items:center;flex-wrap:wrap;gap:0.125rem;
background:var(--vibeui-navmenu-003-bg);color:var(--vibeui-navmenu-003-fg);
border:1px solid var(--vibeui-navmenu-003-border);border-radius:0.75rem;
font-family:var(--vibeui-navmenu-003-font);
}
[data-vibeui-block="navmenu-003"] [data-part="slot"]{position:relative}
/* Закрытый столбик всё равно абсолютно позиционирован: браузер не всегда
   убирает его из потока ширины страницы, раз он выходит за пределы clip
   у <details>. display:none снимает вопрос однозначно. */
[data-vibeui-block="navmenu-003"] [data-part="slot"]:not([open]) [data-part="menu"]{display:none}
[data-vibeui-block="navmenu-003"] [data-part="trigger"],
[data-vibeui-block="navmenu-003"] [data-part="plain"]{
list-style:none;cursor:pointer;text-decoration:none;color:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-003"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-003-hover)}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-003"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-003-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-003"] [data-part="slot"][open] > [data-part="trigger"]{background:var(--vibeui-navmenu-003-hover)}
/* Галочка переворачивается вместе с раскрытием: состояние видно на самой кнопке. */
[data-vibeui-block="navmenu-003"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.1875rem;
border:1.5px solid var(--vibeui-navmenu-003-muted);border-left:0;border-top:0;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="navmenu-003"] [data-part="slot"][open] [data-part="caret"]{transform:rotate(-135deg);margin-top:0.125rem}
[data-vibeui-block="navmenu-003"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:30;
min-width:12rem;margin:0;padding:0.25rem;box-sizing:border-box;list-style:none;
background:var(--vibeui-navmenu-003-bg);
border:1px solid var(--vibeui-navmenu-003-border);border-radius:0.75rem;
box-shadow:0 20px 40px -22px var(--vibeui-navmenu-003-shadow);
}
[data-vibeui-block="navmenu-003"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-003"] [data-part="link"]:hover{background:var(--vibeui-navmenu-003-hover)}
[data-vibeui-block="navmenu-003"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-003-accent);outline-offset:-2px}
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-003"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-003-accent);
}
/* Развёрнутый режим: столбик стоит в потоке под кнопкой, поэтому полоса
   растёт вниз, а не накрывает соседей слоем. */
[data-vibeui-block="navmenu-003"]:has([data-part="slot"][data-open="true"]){align-items:flex-start}
[data-vibeui-block="navmenu-003"] [data-part="slot"][data-open="true"] [data-part="menu"]{
position:static;margin-top:0.375rem;max-width:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Navmenu003Group[] = [
  {
    label: "Продукт",
    items: ["Редактор", "Шаблоны", "Аналитика", "Интеграции"],
  },
  {
    label: "Компания",
    items: ["О нас", "Вакансии", "Контакты"],
  },
  { label: "Цены", href: "#" },
  { label: "Блог", href: "#" },
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
 * Простое выпадающее меню разделов: один столбик ссылок, без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Navmenu003({
  open = false,
  groups = DEFAULT_GROUPS,
  label = "Основная навигация",
  current = "Цены",
  background = "",
  accent,
  className,
  style,
}: Navmenu003Props) {
  const shown = open ? groups.find((group) => group.items)?.label : undefined
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
    ...(accent ? { "--vibeui-navmenu-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-003"
        onClick={onNavigate}
        aria-label={label}
        className={className}
        style={palette}
      >
        {groups.map((group) =>
          group.items ? (
            <details
              key={group.label}
              data-part="slot"
              data-open={group.label === shown || undefined}
              open={group.label === shown || undefined}
              name="vibeui-navmenu-003"
            >
              <summary data-part="trigger">
                {group.label}
                <span data-part="caret" aria-hidden="true" />
              </summary>
              <ul data-part="menu" aria-label={group.label}>
                {group.items.map((item) => (
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
              key={group.label}
              data-part="plain"
              href={group.href ?? "#"}
              aria-current={group.label === active ? "page" : undefined}
            >
              {group.label}
            </a>
          ),
        )}
      </nav>
    </>
  )
}
