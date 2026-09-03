"use client"

import { useEffect, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react"

export type Menu002Item = {
  label: string
  hint?: string
  danger?: boolean
}

export type Menu002Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  items?: Menu002Item[]
  /** Заголовок области: компонент несёт русский, проект подставляет свой. */
  zoneTitle?: string
  hint?: string
  /** Доступное имя меню для скринридера. */
  menuLabel?: string
  /** Строка отчёта о выборе; {action} — подпись выбранного пункта. */
  pickedText?: string
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню по правой кнопке. Оно появляется там, где
// нажали, поэтому координаты считаются от события — их не даст ни popover, ни
// якорное позиционирование. Закрывается выбором, Escape и щелчком мимо. Сама
// область — кнопка: правой кнопки нет ни на телефоне, ни у клавиатуры, поэтому
// то же меню открывается Enter, а Escape возвращает фокус на область.
const STYLES = `
:where([data-vibeui-block="menu-002"]){
--vibeui-menu-002-bg:transparent;
--vibeui-menu-002-surface:light-dark(oklch(1 0 0),oklch(0.24 0.013 265));
--vibeui-menu-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-menu-002-muted:color-mix(in oklab,var(--vibeui-menu-002-fg) 68%,transparent);
--vibeui-menu-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-menu-002-hover:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.014 265));
--vibeui-menu-002-danger:light-dark(oklch(0.56 0.19 25),oklch(0.73 0.16 25));
--vibeui-menu-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.14 265));
--vibeui-menu-002-shadow:light-dark(oklch(0.2 0.02 265 / 55%),oklch(0 0 0 / 72%));
--vibeui-menu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menu-002"]{color-scheme:dark}
[data-vibeui-block="menu-002"]{
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-menu-002-font);color:var(--vibeui-menu-002-fg);
}
/* Область, на которой работает правая кнопка: она обязана быть очевидной. */
[data-vibeui-block="menu-002"] [data-part="zone"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
width:100%;min-height:7rem;padding:1rem;box-sizing:border-box;text-align:center;
appearance:none;font:inherit;color:inherit;cursor:context-menu;
border:1.5px dashed var(--vibeui-menu-002-border);border-radius:0.875rem;
background:var(--vibeui-menu-002-bg);
}
[data-vibeui-block="menu-002"] [data-part="zone"]:focus-visible{outline:2px solid var(--vibeui-menu-002-accent);outline-offset:2px}
[data-vibeui-block="menu-002"] [data-part="zone-title"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="menu-002"] [data-part="zone-hint"]{font-size:0.75rem;color:var(--vibeui-menu-002-muted)}
[data-vibeui-block="menu-002"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:12rem;
border:1px solid var(--vibeui-menu-002-border);border-radius:0.75rem;
background:var(--vibeui-menu-002-surface);color:inherit;
box-shadow:0 18px 40px -22px var(--vibeui-menu-002-shadow);
}
[data-vibeui-block="menu-002"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;min-height:2rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.5rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-002"] [data-part="item"]:hover{background:var(--vibeui-menu-002-hover)}
[data-vibeui-block="menu-002"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-002-accent);outline-offset:-2px}
[data-vibeui-block="menu-002"] [data-part="item"][data-danger="true"]{color:var(--vibeui-menu-002-danger)}
[data-vibeui-block="menu-002"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-menu-002-border);
font-family:inherit;font-size:0.6875rem;color:var(--vibeui-menu-002-muted);
}
[data-vibeui-block="menu-002"] [data-part="picked"]{
margin-top:0.5rem;font-size:0.75rem;color:var(--vibeui-menu-002-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Menu002Item[] = [
  { label: "Открыть", hint: "Enter" },
  { label: "Переименовать", hint: "F2" },
  { label: "Копировать путь" },
  { label: "Удалить", hint: "⌫", danger: true },
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
 * Контекстное меню по правой кнопке: координаты от события, закрытие по
 * выбору, Escape и щелчку мимо. Открывается и с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu002({
  items = DEFAULT_ITEMS,
  zoneTitle = "Файл «Каталог.fig»",
  hint = "Правая кнопка или Enter с клавиатуры",
  menuLabel = "Действия с файлом",
  pickedText = "Выбрано: {action}",
  emptyText = "Действие не выбрано",
  background = "",
  accent,
  className,
  style,
  ...props
}: Menu002Props) {
  const zone = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const [picked, setPicked] = useState<string | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-menu-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menu-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const open = (event: ReactMouseEvent) => {
    event.preventDefault()
    setPoint({ x: event.clientX, y: event.clientY })
  }

  const close = (returnFocus: boolean) => {
    setPoint(null)

    if (returnFocus) {
      zone.current?.focus()
    }
  }

  // С клавиатуры координат нет — меню встаёт от самой области.
  const openFromZone = () => {
    const box = zone.current?.getBoundingClientRect()

    if (box) {
      setPoint({ x: box.left + 16, y: box.bottom - 16 })
    }
  }

  useEffect(() => {
    if (!point) {
      return
    }

    menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus()

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) {
        setPoint(null)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)

    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [point])

  return (
    <>
      <style href="vibeui-menu-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="context-menu"
        data-vibeui-block="menu-002"
        className={className}
        style={palette}
      >
        <button
          ref={zone}
          type="button"
          data-part="zone"
          aria-haspopup="menu"
          aria-expanded={point !== null}
          onContextMenu={open}
          onClick={openFromZone}
        >
          <span data-part="zone-title">{zoneTitle}</span>
          <span data-part="zone-hint">{hint}</span>
        </button>
        {point ? (
          <div
            ref={menu}
            data-part="menu"
            role="menu"
            aria-label={menuLabel}
            style={{ left: point.x, top: point.y }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                close(true)
                return
              }

              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                return
              }

              event.preventDefault()
              const list = Array.from(
                menu.current?.querySelectorAll<HTMLElement>(
                  '[data-part="item"]',
                ) ?? [],
              )

              if (list.length === 0) {
                return
              }

              const delta = event.key === "ArrowDown" ? 1 : -1
              const from = list.indexOf(document.activeElement as HTMLElement)
              list[(from + delta + list.length) % list.length].focus()
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                data-part="item"
                data-danger={item.danger}
                onClick={() => {
                  setPicked(item.label)
                  close(true)
                }}
              >
                {item.label}
                {item.hint ? <kbd>{item.hint}</kbd> : null}
              </button>
            ))}
          </div>
        ) : null}
        <p data-part="picked" role="status">
          {picked ? pickedText.replace("{action}", picked) : emptyText}
        </p>
      </div>
    </>
  )
}
