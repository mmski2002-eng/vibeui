"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Tabs014Item = {
  label: string
  href?: string
  /** Число на значке: непрочитанные, заказы, уведомления. */
  count?: number
}

export type Tabs014Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Tabs014Item[]
  activeLabel?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись панели для скринридера. */
  navLabel?: string
  /** Шаблон подписи пункта со значком: {label} и {count}. */
  countLabel?: string
}

// Идея компонента: нижняя панель навигации для телефона. Высота панели
// считается вместе с safe-area-inset-bottom, иначе на iPhone нижний пункт
// попадает под системную полосу. Активный пункт отмечен цветом и точкой
// сверху: одного цвета мало, когда экран на солнце.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="tabs-014"]){
--vibeui-tabs-014-bg:transparent;
--vibeui-tabs-014-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-tabs-014-muted:color-mix(in oklab,var(--vibeui-tabs-014-fg) 68%,transparent);
--vibeui-tabs-014-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-tabs-014-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.17 39.8));
--vibeui-tabs-014-badge:light-dark(oklch(0.56 0.19 25),oklch(0.62 0.19 25));
--vibeui-tabs-014-badge-fg:oklch(1 0 0);
--vibeui-tabs-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-014"]{color-scheme:dark}
[data-vibeui-block="tabs-014"]{
display:flex;align-items:stretch;
width:100%;max-width:24rem;box-sizing:border-box;
padding-bottom:env(safe-area-inset-bottom,0px);
background:var(--vibeui-tabs-014-bg);
border:1px solid var(--vibeui-tabs-014-border);border-radius:1rem;
font-family:var(--vibeui-tabs-014-font);
}
[data-vibeui-block="tabs-014"] [data-part="item"]{
position:relative;flex:1 1 0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
min-height:3.25rem;padding:0.5rem 0.25rem;
color:var(--vibeui-tabs-014-muted);text-decoration:none;
font-size:0.6875rem;line-height:1.1;
}
[data-vibeui-block="tabs-014"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-tabs-014-accent);outline-offset:-3px;border-radius:0.875rem}
[data-vibeui-block="tabs-014"] [data-part="item"][aria-current="page"]{color:var(--vibeui-tabs-014-accent);font-weight:650}
/* Точка сверху: активный пункт виден и когда цвет на солнце не читается. */
[data-vibeui-block="tabs-014"] [data-part="item"][aria-current="page"]::before{
content:"";position:absolute;top:0.375rem;
width:0.25rem;height:0.25rem;border-radius:9999px;
background:var(--vibeui-tabs-014-accent);
}
[data-vibeui-block="tabs-014"] [data-part="glyph"]{
position:relative;
width:1.25rem;height:1.25rem;border-radius:0.4375rem;
border:1.5px solid currentColor;
}
[data-vibeui-block="tabs-014"] [data-part="item"]:nth-child(2) [data-part="glyph"]{border-radius:9999px}
[data-vibeui-block="tabs-014"] [data-part="item"]:nth-child(3) [data-part="glyph"]{border-radius:0.1875rem;transform:rotate(45deg)}
/* Значок вынесен из фигуры: иначе он поворачивается вместе с ней. */
[data-vibeui-block="tabs-014"] [data-part="count"]{
position:absolute;top:0.5rem;left:calc(50% + 0.125rem);
min-width:1rem;height:1rem;padding:0 0.25rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border-radius:9999px;background:var(--vibeui-tabs-014-badge);
color:var(--vibeui-tabs-014-badge-fg);font-size:0.625rem;font-weight:650;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs014Item[] = [
  { label: "Каталог", href: "#" },
  { label: "Поиск", href: "#" },
  { label: "Заказы", href: "#", count: 3 },
  { label: "Профиль", href: "#" },
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
 * Нижняя панель навигации: safe area учтена, активный пункт помечен точкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs014({
  items = DEFAULT_ITEMS,
  activeLabel = "Каталог",
  background = "",
  accent,
  navLabel = "Основная навигация",
  countLabel = "{label}, новых: {count}",
  className,
  style,
  ...props
}: Tabs014Props) {
  const [active, setActive] = useState(activeLabel)
  const palette = {
    ...(accent ? { "--vibeui-tabs-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tabs-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-014"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        {items.map((item) => (
          <a
            key={item.label}
            data-part="item"
            href={item.href ?? "#"}
            aria-current={item.label === active ? "page" : undefined}
            onClick={(event) => {
              // «#» — заглушка витрины и прототипа: прыжок наверх страницы
              // здесь не нужен, настоящий адрес отрабатывает браузер.
              if (!item.href || item.href === "#") {
                event.preventDefault()
              }

              setActive(item.label)
            }}
            aria-label={
              item.count
                ? countLabel
                    .replace("{label}", item.label)
                    .replace("{count}", String(item.count))
                : undefined
            }
          >
            <span data-part="glyph" aria-hidden="true" />
            {item.count ? (
              <span data-part="count" aria-hidden="true">
                {item.count}
              </span>
            ) : null}
            {item.label}
          </a>
        ))}
      </nav>
    </>
  )
}
