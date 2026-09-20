"use client"

import { useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

export type Navmenu004Tile = {
  label: string
  hint?: string
  count?: number
  href?: string
}

export type Navmenu004Props = {
  tiles?: Navmenu004Tile[]
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  triggerLabel?: string
  footerLabel?: string
  /** Обычные ссылки полосы рядом с кнопкой каталога. */
  entries?: string[]
  /** Строка слева в подвале панели. */
  footerNote?: string
  /** Подпись навигации для скринридера. */
  label?: string
  /** Подпись текущего раздела: он помечается aria-current. */
  current?: string
  /** Подложка полосы и панели. Пусто — своя палитра компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: мега-меню каталога — плитки со значками вместо строчек. Значок
// рисуется из самого названия: оттенок берётся из хеша подписи, поэтому каждая
// категория получает свой устойчивый цвет без набора иконок и без картинок.
// Панель — HTML popover, поэтому Escape и клик мимо достаются от браузера.
const STYLES = `
:where([data-vibeui-block="navmenu-004"]){
--vibeui-navmenu-004-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-navmenu-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navmenu-004-muted:color-mix(in oklab,var(--vibeui-navmenu-004-fg) 68%,transparent);
--vibeui-navmenu-004-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-navmenu-004-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.85 0 265 / 12%));
--vibeui-navmenu-004-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-navmenu-004-shadow:light-dark(oklch(0.2 0 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-navmenu-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-004"]{color-scheme:dark}
[data-vibeui-block="navmenu-004"]{
box-sizing:border-box;width:100%;max-width:42rem;
font-family:var(--vibeui-navmenu-004-font);color:var(--vibeui-navmenu-004-fg);
}
[data-vibeui-block="navmenu-004"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-004-bg);
border:1px solid var(--vibeui-navmenu-004-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-004-bar;
}
[data-vibeui-block="navmenu-004"] [data-part="trigger"],
[data-vibeui-block="navmenu-004"] [data-part="plain"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;gap:0.5rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-004"] [data-part="trigger"]{font-weight:600}
[data-vibeui-block="navmenu-004"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-004"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-004-hover)}
[data-vibeui-block="navmenu-004"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-004"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-004-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-004"] [data-part="grid-glyph"]{
display:grid;grid-template-columns:1fr 1fr;gap:2px;width:0.75rem;height:0.75rem;
}
[data-vibeui-block="navmenu-004"] [data-part="grid-glyph"] i{display:block;background:currentColor;border-radius:1px}
[data-vibeui-block="navmenu-004"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(40rem,92vw);padding:0.75rem;box-sizing:border-box;
background:var(--vibeui-navmenu-004-bg);color:var(--vibeui-navmenu-004-fg);
border:1px solid var(--vibeui-navmenu-004-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-004-font);
box-shadow:0 24px 48px -24px var(--vibeui-navmenu-004-shadow);
}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-004"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-004-bar;
position-area:bottom span-right;margin-top:0.5rem;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="navmenu-004"] [data-part="tiles"]{
margin:0;padding:0;list-style:none;
display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:0.25rem;
}
[data-vibeui-block="navmenu-004"] [data-part="tile"]{
display:grid;grid-template-columns:2rem 1fr;align-items:center;gap:0.625rem;
padding:0.5rem;border-radius:0.625rem;text-decoration:none;color:inherit;
}
[data-vibeui-block="navmenu-004"] [data-part="tile"]:hover{background:var(--vibeui-navmenu-004-hover)}
[data-vibeui-block="navmenu-004"] [data-part="tile"]:focus-visible{outline:2px solid var(--vibeui-navmenu-004-accent);outline-offset:-2px}
/* Значок: оттенок приходит переменной, посчитанной из подписи категории. */
[data-vibeui-block="navmenu-004"] [data-part="icon"]{
width:2rem;height:2rem;border-radius:0.5rem;display:grid;place-items:center;
background:light-dark(oklch(0.94 0.06 var(--vibeui-navmenu-004-hue)),oklch(0.38 0.06 var(--vibeui-navmenu-004-hue)));
color:light-dark(oklch(0.42 0.13 var(--vibeui-navmenu-004-hue)),oklch(0.9 0.08 var(--vibeui-navmenu-004-hue)));
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="navmenu-004"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="navmenu-004"] [data-part="hint"]{display:block;font-size:0.75rem;color:var(--vibeui-navmenu-004-muted)}
[data-vibeui-block="navmenu-004"] [data-part="count"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="navmenu-004"] [data-part="footer"]{
display:flex;justify-content:space-between;align-items:center;
margin-top:0.625rem;padding-top:0.625rem;
border-top:1px solid var(--vibeui-navmenu-004-border);
font-size:0.8125rem;color:var(--vibeui-navmenu-004-muted);
}
[data-vibeui-block="navmenu-004"] [data-part="all"]{color:var(--vibeui-navmenu-004-accent);text-decoration:none;font-weight:600}
[data-vibeui-block="navmenu-004"] [data-part="all"]:focus-visible{outline:2px solid var(--vibeui-navmenu-004-accent);outline-offset:2px;border-radius:0.25rem}
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-004"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-004-accent);
}
/* Развёрнутый режим: панель стоит в потоке под полосой, а не в верхнем слое. */
[data-vibeui-block="navmenu-004"] [data-part="panel"][data-open="true"]{
width:100%;
position:static;inset:auto;margin-top:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TILES: Navmenu004Tile[] = [
  { label: "Ноутбуки", hint: "Тонкие и игровые", count: 412 },
  { label: "Телефоны", hint: "И аксессуары", count: 908 },
  { label: "Мониторы", hint: "От 24 до 49 дюймов", count: 176 },
  { label: "Клавиатуры", hint: "Механика и мембрана", count: 233 },
  { label: "Наушники", hint: "Полноразмерные и вкладыши", count: 514 },
  { label: "Хранение", hint: "Диски и карты памяти", count: 187 },
]

/**
 * Оттенок значка выводится из подписи: одна и та же категория всегда получает
 * один и тот же цвет, и его не нужно держать в данных.
 */
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

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
 * Мега-меню каталога: плитки категорий со значками и счётчиками.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu004({
  tiles = DEFAULT_TILES,
  open = false,
  triggerLabel = "Каталог",
  footerLabel = "Все категории",
  entries = ["Доставка", "Оплата"],
  footerNote = "Товары в наличии на складе",
  label = "Каталог",
  current = "Доставка",
  background = "",
  accent,
  className,
  style,
}: Navmenu004Props) {
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
    ...(accent ? { "--vibeui-navmenu-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-004" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-004"
        onClick={onNavigate}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-004-panel"
          >
            <span data-part="grid-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {triggerLabel}
          </button>
          {entries.map((entry) => (
            <a
              key={entry}
              data-part="plain"
              href="#"
              aria-current={entry === active ? "page" : undefined}
            >
              {entry}
            </a>
          ))}
        </div>
        <div
          id="vibeui-navmenu-004-panel"
          data-part="panel"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          aria-label={triggerLabel}
        >
          <ul data-part="tiles">
            {tiles.map((tile) => (
              <li key={tile.label}>
                <a
                  data-part="tile"
                  href={tile.href ?? "#"}
                  style={
                    {
                      "--vibeui-navmenu-004-hue": `${hue(tile.label)}`,
                    } as CSSProperties
                  }
                >
                  <span data-part="icon" aria-hidden="true">
                    {tile.label.slice(0, 2)}
                  </span>
                  <span>
                    <span data-part="name">{tile.label}</span>
                    <span data-part="hint">
                      {tile.hint}
                      {tile.count === undefined ? null : (
                        <>
                          {" · "}
                          <span data-part="count">{tile.count}</span>
                        </>
                      )}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p data-part="footer">
            <span>{footerNote}</span>
            <a data-part="all" href="#">
              {footerLabel} →
            </a>
          </p>
        </div>
      </nav>
    </>
  )
}
