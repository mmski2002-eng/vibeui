"use client"

import { useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react"

export type Navmenu008Props = {
  /**
   * Показать панель развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  triggerLabel?: string
  placeholder?: string
  suggestions?: string[]
  recent?: string[]
  /** Обычные ссылки полосы слева от кнопки поиска. */
  barLinks?: string[]
  /** Подпись кнопки отправки формы. */
  submitLabel?: string
  /** Заголовок над списком недавних запросов. */
  recentTitle?: string
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

// Идея компонента: выпадающая панель, которая начинается со строки поиска.
// Поле лежит в настоящей <form method="get">: запрос уходит на страницу
// результатов и без JS, а подсказки под ним — обычные ссылки, поэтому меню
// остаётся работоспособным до гидратации. Панель — HTML popover.
const STYLES = `
:where([data-vibeui-block="navmenu-008"]){
--vibeui-navmenu-008-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-navmenu-008-field:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-navmenu-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-navmenu-008-muted:color-mix(in oklab,var(--vibeui-navmenu-008-fg) 68%,transparent);
--vibeui-navmenu-008-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-navmenu-008-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-navmenu-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-navmenu-008-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-navmenu-008-shadow:light-dark(oklch(0.2 0 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-navmenu-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navmenu-008"]{color-scheme:dark}
[data-vibeui-block="navmenu-008"]{
box-sizing:border-box;width:100%;max-width:38rem;
font-family:var(--vibeui-navmenu-008-font);color:var(--vibeui-navmenu-008-fg);
}
[data-vibeui-block="navmenu-008"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-008-bg);
border:1px solid var(--vibeui-navmenu-008-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-008-bar;
}
[data-vibeui-block="navmenu-008"] [data-part="plain"],
[data-vibeui-block="navmenu-008"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;gap:0.5rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-008"] [data-part="trigger"]{margin-left:auto;color:var(--vibeui-navmenu-008-muted)}
[data-vibeui-block="navmenu-008"] [data-part="plain"]:hover,
[data-vibeui-block="navmenu-008"] [data-part="trigger"]:hover{background:var(--vibeui-navmenu-008-hover)}
[data-vibeui-block="navmenu-008"] [data-part="plain"]:focus-visible,
[data-vibeui-block="navmenu-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-008"] [data-part="lens"]{
width:0.75rem;height:0.75rem;border:1.5px solid currentColor;border-radius:999px;position:relative;
}
[data-vibeui-block="navmenu-008"] [data-part="lens"]::after{
content:"";position:absolute;right:-0.1875rem;bottom:-0.1875rem;
width:0.3125rem;height:1.5px;background:currentColor;transform:rotate(45deg);
}
[data-vibeui-block="navmenu-008"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(30rem,92vw);padding:0.625rem;box-sizing:border-box;
background:var(--vibeui-navmenu-008-bg);color:var(--vibeui-navmenu-008-fg);
border:1px solid var(--vibeui-navmenu-008-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-008-font);
box-shadow:0 24px 48px -24px var(--vibeui-navmenu-008-shadow);
}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-008"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-008-bar;
position-area:bottom span-left;margin-top:0.5rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="navmenu-008"] [data-part="form"]{display:flex;gap:0.375rem}
[data-vibeui-block="navmenu-008"] [data-part="input"]{
flex:1;min-width:0;box-sizing:border-box;
height:2.375rem;padding:0 0.75rem;border-radius:0.625rem;
background:var(--vibeui-navmenu-008-field);color:inherit;
border:1px solid var(--vibeui-navmenu-008-border);
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-008"] [data-part="input"]::placeholder{color:var(--vibeui-navmenu-008-muted)}
[data-vibeui-block="navmenu-008"] [data-part="input"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-1px;border-color:transparent}
[data-vibeui-block="navmenu-008"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;
height:2.375rem;padding:0 0.875rem;border-radius:0.625rem;
background:var(--vibeui-navmenu-008-accent);color:var(--vibeui-navmenu-008-on-accent);
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="navmenu-008"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:2px}
[data-vibeui-block="navmenu-008"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0.625rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="navmenu-008"] [data-part="chip"]{
display:inline-flex;align-items:center;padding:0.25rem 0.5rem;border-radius:999px;
border:1px solid var(--vibeui-navmenu-008-border);
text-decoration:none;color:var(--vibeui-navmenu-008-muted);font-size:0.75rem;
}
[data-vibeui-block="navmenu-008"] [data-part="chip"]:hover{color:var(--vibeui-navmenu-008-fg);border-color:var(--vibeui-navmenu-008-accent)}
[data-vibeui-block="navmenu-008"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:2px}
[data-vibeui-block="navmenu-008"] [data-part="title"]{
margin:0.875rem 0 0.375rem;font-size:0.6875rem;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-navmenu-008-muted);
}
[data-vibeui-block="navmenu-008"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.0625rem}
[data-vibeui-block="navmenu-008"] [data-part="link"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-008"] [data-part="link"]:hover{background:var(--vibeui-navmenu-008-hover)}
[data-vibeui-block="navmenu-008"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-008-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-008"] [data-part="clock"]{color:var(--vibeui-navmenu-008-muted);font-size:0.75rem}
/* Текущий раздел: подчёркивание и вес, а не один только цвет. */
[data-vibeui-block="navmenu-008"] [aria-current="page"]{
font-weight:700;
text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:0.3125rem;
text-decoration-color:var(--vibeui-navmenu-008-accent);
}
/* Развёрнутый режим: панель стоит в потоке под полосой, а не в верхнем слое. */
[data-vibeui-block="navmenu-008"] [data-part="panel"][data-open="true"]{
width:100%;
position:static;inset:auto;margin-top:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = [
  "Тарифы",
  "Домены",
  "Импорт из Тильды",
  "Формы",
  "API",
]

const DEFAULT_RECENT = ["Как подключить домен", "Экспорт статистики"]

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
 * Навигация с панелью, которая начинается со строки поиска.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu008({
  open = false,
  triggerLabel = "Поиск",
  placeholder = "Что ищем в справке?",
  suggestions = DEFAULT_SUGGESTIONS,
  recent = DEFAULT_RECENT,
  barLinks = ["Справка", "Сообщество"],
  submitLabel = "Найти",
  recentTitle = "Недавнее",
  label = "Основная навигация",
  current = "Справка",
  background = "",
  accent,
  className,
  style,
}: Navmenu008Props) {
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
    ...(accent ? { "--vibeui-navmenu-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navmenu-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="navigation-menu"
        data-vibeui-block="navmenu-008"
        onClick={onNavigate}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          {barLinks.map((entry) => (
            <a
              key={entry}
              data-part="plain"
              href="#"
              aria-current={entry === active ? "page" : undefined}
            >
              {entry}
            </a>
          ))}
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-008-panel"
          >
            <span data-part="lens" aria-hidden="true" />
            {triggerLabel}
          </button>
        </div>
        <div
          id="vibeui-navmenu-008-panel"
          data-part="panel"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          aria-label={triggerLabel}
        >
          <form data-part="form" method="get" action="#" role="search">
            <input
              data-part="input"
              type="search"
              name="q"
              placeholder={placeholder}
              aria-label={placeholder}
            />
            <button type="submit" data-part="go">
              {submitLabel}
            </button>
          </form>
          <ul data-part="chips">
            {suggestions.map((item) => (
              <li key={item}>
                <a data-part="chip" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <p data-part="title">{recentTitle}</p>
          <ul data-part="list">
            {recent.map((item) => (
              <li key={item}>
                <a data-part="link" href="#">
                  <span data-part="clock" aria-hidden="true">
                    ↺
                  </span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
