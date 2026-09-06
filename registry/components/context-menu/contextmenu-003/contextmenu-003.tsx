"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Contextmenu003Props = Omit<
  ComponentProps<"section">,
  "children"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  fileName?: string
  submenuLabel?: string
  apps?: string[]
  /** Доступное имя блока для скринридера. */
  sectionLabel?: string
  /** Подпись кнопки-дублёра: компонент несёт русскую, проект подставляет свою. */
  actionLabel?: string
  /** Имя открытого меню; {file} — имя файла. */
  menuLabel?: string
  openLabel?: string
  propertiesLabel?: string
  /** Строка отчёта; {file} — файл, {action} — выбранное действие. */
  doneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню с подменю «Открыть с помощью». Список
// программ не помещается в основное меню и не нужен в девяти случаях из
// десяти, поэтому он спрятан на второй уровень. Подменю — обычный слой внутри
// popover, а не второй popover: вложенные popover закрывают друг друга.
// Стрелка вправо входит в подменю, влево возвращает фокус на родителя.
const STYLES = `
:where([data-vibeui-block="contextmenu-003"]){
--vibeui-contextmenu-003-bg:transparent;
--vibeui-contextmenu-003-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contextmenu-003-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-contextmenu-003-muted:color-mix(in oklab,var(--vibeui-contextmenu-003-fg) 68%,transparent);
--vibeui-contextmenu-003-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-contextmenu-003-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-contextmenu-003-accent:light-dark(oklch(0.56 0.16 165),oklch(0.76 0.13 165));
--vibeui-contextmenu-003-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-003-x:50%;
--vibeui-contextmenu-003-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-003"]{color-scheme:dark}
[data-vibeui-block="contextmenu-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-003-bg);color:var(--vibeui-contextmenu-003-fg);
border:1px solid var(--vibeui-contextmenu-003-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-003-font);
}
[data-vibeui-block="contextmenu-003"] [data-part="file"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem;box-sizing:border-box;
border:1px dashed var(--vibeui-contextmenu-003-border);border-radius:0.75rem;
font-size:0.8125rem;touch-action:manipulation;
}
[data-vibeui-block="contextmenu-003"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-contextmenu-003-accent) 15%,transparent);
color:var(--vibeui-contextmenu-003-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="contextmenu-003"] [data-part="open"]{
appearance:none;cursor:pointer;margin-left:auto;
height:1.75rem;padding:0 0.625rem;
border:1px solid var(--vibeui-contextmenu-003-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.75rem;
}
[data-vibeui-block="contextmenu-003"] [data-part="open"]:hover{background:var(--vibeui-contextmenu-003-hover)}
[data-vibeui-block="contextmenu-003"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-003-accent);outline-offset:2px}
[data-vibeui-block="contextmenu-003"] [data-part="log"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-003-muted);min-height:1rem;
}
[data-vibeui-block="contextmenu-003"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-003-y);left:var(--vibeui-contextmenu-003-x);
min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-003-surface);color:var(--vibeui-contextmenu-003-fg);
border:1px solid var(--vibeui-contextmenu-003-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-003-shadow);
font-family:var(--vibeui-contextmenu-003-font);
}
[data-vibeui-block="contextmenu-003"] [data-part="item"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-003"] [data-part="item"]:hover,
[data-vibeui-block="contextmenu-003"] [data-part="item"][aria-expanded="true"]{background:var(--vibeui-contextmenu-003-hover)}
[data-vibeui-block="contextmenu-003"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-003-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-003"] [data-part="arrow"]{
margin-left:auto;flex:none;width:0.3125rem;height:0.3125rem;
border-top:1.5px solid var(--vibeui-contextmenu-003-muted);
border-right:1.5px solid var(--vibeui-contextmenu-003-muted);
transform:rotate(45deg);
}
[data-vibeui-block="contextmenu-003"] [data-part="nest"]{position:relative}
/* Второй уровень — слой внутри popover: вложенный popover закрыл бы первый. */
[data-vibeui-block="contextmenu-003"] [data-part="sub"]{
position:absolute;top:-0.3125rem;left:calc(100% + 0.25rem);z-index:1;
padding:0.3125rem;min-width:11rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-003-surface);
border:1px solid var(--vibeui-contextmenu-003-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-003-shadow);
}
[data-vibeui-block="contextmenu-003"] [data-part="badge"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;border-radius:0.375rem;
background:var(--vibeui-contextmenu-003-hover);
font-size:0.625rem;font-weight:700;color:var(--vibeui-contextmenu-003-muted);
}
[data-vibeui-block="contextmenu-003"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-contextmenu-003-border);
}
/* Развёрнутый режим: меню стоит в потоке под областью, а не в верхнем слое. */
[data-vibeui-block="contextmenu-003"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_APPS = [
  "Просмотр",
  "Редактор кода",
  "Браузер",
  "Другое приложение…",
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
 * Контекстное меню с подменю «Открыть с помощью» и переходом по стрелкам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu003({
  open = false,
  fileName = "макет-главной.svg",
  submenuLabel = "Открыть с помощью",
  apps = DEFAULT_APPS,
  sectionLabel = "Файл",
  actionLabel = "Действия",
  menuLabel = "Действия: {file}",
  openLabel = "Открыть",
  propertiesLabel = "Свойства",
  doneText = "{file} → {action}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu003Props) {
  const menu = useRef<HTMLDivElement>(null)
  const parent = useRef<HTMLButtonElement>(null)
  const sub = useRef<HTMLDivElement>(null)
  const [subOpen, setSubOpen] = useState(false)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)
  const [done, setDone] = useState("")

  const openAt = (x: number, y: number) => {
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const enterSub = () => {
    setSubOpen(true)
    requestAnimationFrame(() =>
      sub.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const choose = (label: string) => {
    setDone(doneText.replace("{file}", fileName).replace("{action}", label))
    setSubOpen(false)
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-003-x": spot.x,
          "--vibeui-contextmenu-003-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="context-menu"
        data-vibeui-block="contextmenu-003"
        aria-label={sectionLabel}
        className={className}
        style={palette}
      >
        <div
          data-part="file"
          onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            openAt(event.clientX, event.clientY)
          }}
        >
          <span data-part="icon" aria-hidden="true">
            SVG
          </span>
          {fileName}
          <button
            type="button"
            data-part="open"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6)
            }}
          >
            {actionLabel}
          </button>
        </div>
        <p data-part="log" role="status">
          {done}
        </p>
        <div
          ref={menu}
          data-part="menu"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={menuLabel.replace("{file}", fileName)}
          onToggle={() => setSubOpen(false)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
              return
            }

            event.preventDefault()
            const items = Array.from(
              menu.current?.querySelectorAll<HTMLElement>(
                '[data-part="item"]',
              ) ?? [],
            ).filter((item) => item.offsetParent !== null)

            if (items.length === 0) {
              return
            }

            const delta = event.key === "ArrowDown" ? 1 : -1
            const from = items.indexOf(document.activeElement as HTMLElement)
            items[(from + delta + items.length) % items.length].focus()
          }}
        >
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => choose(openLabel)}
          >
            {openLabel}
          </button>
          <div
            data-part="nest"
            onMouseEnter={() => setSubOpen(true)}
            onMouseLeave={() => setSubOpen(false)}
          >
            <button
              type="button"
              ref={parent}
              role="menuitem"
              data-part="item"
              aria-haspopup="menu"
              aria-expanded={subOpen}
              onClick={() => (subOpen ? setSubOpen(false) : enterSub())}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault()
                  enterSub()
                }
              }}
            >
              {submenuLabel}
              <span data-part="arrow" aria-hidden="true" />
            </button>
            {subOpen ? (
              <div
                ref={sub}
                data-part="sub"
                role="menu"
                aria-label={submenuLabel}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    setSubOpen(false)
                    parent.current?.focus()
                  }
                }}
              >
                {apps.map((app) => (
                  <button
                    key={app}
                    type="button"
                    role="menuitem"
                    data-part="item"
                    onClick={() => choose(app)}
                  >
                    <span data-part="badge" aria-hidden="true">
                      {app[0]}
                    </span>
                    {app}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div data-part="rule" role="separator" />
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => choose(propertiesLabel)}
          >
            {propertiesLabel}
          </button>
        </div>
      </section>
    </>
  )
}
