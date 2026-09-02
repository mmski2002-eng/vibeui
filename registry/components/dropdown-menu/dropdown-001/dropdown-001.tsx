import type { CSSProperties } from "react"

export type Dropdown001Item = {
  label: string
  href?: string
  /** Отделяет пункт от предыдущего линией: «Выйти», «Удалить». */
  separated?: boolean
  danger?: boolean
}

export type Dropdown001Props = {
  id?: string
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  items?: Dropdown001Item[]
  accent?: string
  /** Подложка кнопки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: меню без JS. Открытие держит HTML popover, а положение
// рядом с кнопкой — CSS anchor positioning: меню привязано к триггеру якорем,
// а не пересчитывается скриптом на каждый скролл. Там, где якоря ещё нет,
// меню открывается по центру экрана — некрасиво, но работает.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-001"]){
--vibeui-dropdown-001-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-dropdown-001-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-dropdown-001-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-dropdown-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-dropdown-001-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.86 0.02 265 / 12%));
--vibeui-dropdown-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dropdown-001-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-dropdown-001-radius:0.625rem;
--vibeui-dropdown-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-001"]{display:inline-flex;font-family:var(--vibeui-dropdown-001-font)}
[data-vibeui-block="dropdown-001"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-dropdown-001-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-001-bg);color:var(--vibeui-dropdown-001-fg);
font:inherit;font-size:0.875rem;font-weight:500;
anchor-name:--vibeui-dropdown-001-anchor;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="dropdown-001"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-001-hover)}
[data-vibeui-block="dropdown-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-001-accent);outline-offset:2px}
[data-vibeui-block="dropdown-001"] [data-part="chevron"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-dropdown-001-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-001-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-dropdown-001-menu]{
position:fixed;margin:0;padding:0.3125rem;
min-width:12rem;box-sizing:border-box;
border:1px solid var(--vibeui-dropdown-001-border,light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265)));
border-radius:var(--vibeui-dropdown-001-radius,0.625rem);
background:var(--vibeui-dropdown-001-bg,light-dark(oklch(1 0 0),oklch(0.25 0.012 265)));
color:var(--vibeui-dropdown-001-fg,light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265)));
font-family:var(--vibeui-dropdown-001-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-dropdown-001-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dropdown-001-menu]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
/* Привязка к кнопке. Без поддержки якорей меню останется по центру экрана. */
@supports (anchor-name: --a){
[data-vibeui-dropdown-001-menu]{
position-anchor:--vibeui-dropdown-001-anchor;
position-area:bottom span-right;
margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-dropdown-001-menu] [data-part="item"]{
display:flex;align-items:center;width:100%;box-sizing:border-box;
padding:0.4375rem 0.5625rem;border-radius:0.4375rem;
color:inherit;text-decoration:none;font-size:0.875rem;line-height:1.3;
transition:background-color .14s ease;
}
[data-vibeui-dropdown-001-menu] [data-part="item"]:hover{background:var(--vibeui-dropdown-001-hover,light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.86 0.02 265 / 12%)))}
[data-vibeui-dropdown-001-menu] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-001-accent,light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262)));outline-offset:-2px}
[data-vibeui-dropdown-001-menu] [data-part="item"][data-danger="true"]{color:var(--vibeui-dropdown-001-danger,light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25)))}
[data-vibeui-dropdown-001-menu] [data-part="item"][data-separated="true"]{
margin-top:0.3125rem;padding-top:0.5625rem;
border-top:1px solid var(--vibeui-dropdown-001-border,light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265)));
border-radius:0 0 0.4375rem 0.4375rem;
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-001"]:has([data-open="true"]){flex-direction:column;align-items:flex-start}
[data-vibeui-dropdown-001-menu][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dropdown-001"] *{animation:none!important;transition:none!important}
[data-vibeui-dropdown-001-menu]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_ITEMS: Dropdown001Item[] = [
  { label: "Настройки проекта", href: "#" },
  { label: "Участники", href: "#" },
  { label: "История публикаций", href: "#" },
  { label: "Удалить проект", href: "#", separated: true, danger: true },
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
 * Выпадающее меню на HTML popover и якорном позиционировании: без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown001({
  id = "vibeui-dropdown-001",
  open = false,
  trigger = "Проект",
  items = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
}: Dropdown001Props) {
  const palette = {
    ...(accent ? { "--vibeui-dropdown-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="dropdown-001"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
          <span data-part="chevron" aria-hidden="true" />
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dropdown-001-menu=""
          data-open={open || undefined}
          style={palette}
        >
          {items.map((item) => (
            <a
              key={item.label}
              data-part="item"
              data-danger={item.danger || undefined}
              data-separated={item.separated || undefined}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
