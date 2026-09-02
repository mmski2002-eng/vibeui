"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent } from "react"

export type Contextmenu009Action = {
  label: string
  keys?: string
}

export type Contextmenu009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  fileName?: string
  meta?: string
  actions?: Contextmenu009Action[]
  /** Доступное имя блока для скринридера. */
  sectionLabel?: string
  /** Подсказка под карточкой. */
  hint?: string
  /** Имя кнопки и открытого меню; {file} — имя файла. */
  menuLabel?: string
  deleteLabel?: string
  /** Строка отчёта; {action} — действие, {file} — имя файла. */
  doneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню на карточке файла с опасным пунктом в
// самом низу. В отличие от соседних меню на HTML popover, здесь меню — обычный
// слой внутри области показа: координаты клика переводятся в систему отсчёта
// этой области и зажимаются её границами, поэтому меню физически не может
// вылезти за карточку каталога. Открытие и закрытие компонент ведёт сам:
// Escape и клик мимо закрывают меню, фокус возвращается на кнопку-дублёр.
const STYLES = `
:where([data-vibeui-block="contextmenu-009"]){
--vibeui-contextmenu-009-bg:transparent;
--vibeui-contextmenu-009-surface:light-dark(oklch(1 0 0),oklch(0.24 0.013 265));
--vibeui-contextmenu-009-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-contextmenu-009-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-contextmenu-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-contextmenu-009-hover:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.014 265));
--vibeui-contextmenu-009-accent:light-dark(oklch(0.55 0.18 258),oklch(0.75 0.14 258));
--vibeui-contextmenu-009-danger:light-dark(oklch(0.56 0.19 25),oklch(0.73 0.16 25));
--vibeui-contextmenu-009-shadow:light-dark(oklch(0.2 0.03 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="contextmenu-009"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-009-bg);color:var(--vibeui-contextmenu-009-fg);
border:1px solid var(--vibeui-contextmenu-009-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-009-font);
}
[data-vibeui-block="contextmenu-009"] *{box-sizing:border-box}
/* Демонстрационная область — единственная система отсчёта для меню:
   position:relative плюс overflow:hidden гарантируют, что абсолютный слой
   меню физически не выйдет за её границы, даже если координаты не зажать. */
[data-vibeui-block="contextmenu-009"] [data-part="stage"]{
position:relative;overflow:hidden;min-height:11rem;
border:1px dashed var(--vibeui-contextmenu-009-border);border-radius:0.875rem;
padding:1rem;display:flex;flex-direction:column;align-items:flex-start;gap:0.75rem;
}
[data-vibeui-block="contextmenu-009"] [data-part="card"]{
display:flex;align-items:center;gap:0.625rem;width:100%;max-width:16rem;
padding:0.625rem 0.625rem 0.625rem 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-contextmenu-009-border);border-radius:0.75rem;
background:var(--vibeui-contextmenu-009-surface);
}
[data-vibeui-block="contextmenu-009"] [data-part="sheet"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-contextmenu-009-accent) 14%,transparent);
color:var(--vibeui-contextmenu-009-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="contextmenu-009"] [data-part="file"]{display:grid;gap:0.125rem;min-width:0;flex:1 1 auto}
[data-vibeui-block="contextmenu-009"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-009"] [data-part="meta"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-009-muted)}
[data-vibeui-block="contextmenu-009"] [data-part="more"]{
appearance:none;cursor:pointer;flex:none;margin-left:auto;
width:1.75rem;height:1.75rem;padding:0;
border:0;border-radius:0.4375rem;background:none;color:var(--vibeui-contextmenu-009-muted);
font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="contextmenu-009"] [data-part="more"]:hover{background:var(--vibeui-contextmenu-009-hover)}
[data-vibeui-block="contextmenu-009"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-009-accent);outline-offset:1px}
[data-vibeui-block="contextmenu-009"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-009-muted)}
[data-vibeui-block="contextmenu-009"] [data-part="log"]{margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-009-muted);min-height:1rem}
/* Координаты клика уже переведены в систему отсчёта stage — просто px. */
[data-vibeui-block="contextmenu-009"] [data-part="menu"]{
position:absolute;margin:0;padding:0.3125rem;width:12rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-009-surface);color:var(--vibeui-contextmenu-009-fg);
border:1px solid var(--vibeui-contextmenu-009-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-009-shadow);
font-family:var(--vibeui-contextmenu-009-font);
}
[data-vibeui-block="contextmenu-009"] [data-part="target"]{
padding:0.375rem 0.5rem 0.3125rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-009-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-contextmenu-009-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-009"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-009"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-009-hover)}
[data-vibeui-block="contextmenu-009"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-009-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-009"] [data-part="item"][data-danger="true"]{color:var(--vibeui-contextmenu-009-danger)}
[data-vibeui-block="contextmenu-009"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-009-muted)}
[data-vibeui-block="contextmenu-009"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-contextmenu-009-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Contextmenu009Action[] = [
  { label: "Открыть", keys: "↵" },
  { label: "Переименовать", keys: "F2" },
  { label: "Дублировать", keys: "⌘D" },
  { label: "Скачать", keys: "⌘S" },
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

// Размер меню известен заранее (ширина фиксирована в CSS, высота — сумма
// шапки, пунктов и разделителя), поэтому клик можно зажать в границах stage
// без измерения ещё не отрисованного слоя.
const MENU_WIDTH = 192
const MENU_HEIGHT = 224

/**
 * Меню на карточке файла с опасным пунктом внизу: собственный слой вместо
 * popover, зажатый в границах демонстрационной области. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Contextmenu009({
  fileName = "Презентация Q3.pdf",
  meta = "4,1 МБ · изменён вчера",
  actions = DEFAULT_ACTIONS,
  sectionLabel = "Карточка файла с меню",
  hint = "правый клик по карточке — или кнопка «•••»",
  menuLabel = "Действия: {file}",
  deleteLabel = "Удалить безвозвратно",
  doneText = "{action}: {file}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu009Props) {
  const stage = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)
  const [done, setDone] = useState("")

  const open = spot !== null

  const openAt = (clientX: number, clientY: number, trigger: HTMLElement) => {
    const box = stage.current?.getBoundingClientRect()

    if (!box) {
      return
    }

    const x = Math.max(0, Math.min(clientX - box.left, box.width - MENU_WIDTH))
    const y = Math.max(0, Math.min(clientY - box.top, box.height - MENU_HEIGHT))

    opener.current = trigger
    setSpot({ x, y })
  }

  const close = (returnFocus: boolean) => {
    setSpot(null)

    if (returnFocus) {
      opener.current?.focus()
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus()

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) {
        close(false)
      }
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const run = (action: string) => {
    setDone(doneText.replace("{action}", action).replace("{file}", fileName))
    close(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="contextmenu-009"
        aria-label={sectionLabel}
        className={className}
        style={palette}
      >
        <div data-part="stage" ref={stage}>
          <div
            data-part="card"
            onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
              event.preventDefault()
              openAt(event.clientX, event.clientY, event.currentTarget)
            }}
          >
            <span data-part="sheet" aria-hidden="true">
              PDF
            </span>
            <span data-part="file">
              <span data-part="name">{fileName}</span>
              <span data-part="meta">{meta}</span>
            </span>
            <button
              type="button"
              data-part="more"
              aria-haspopup="menu"
              aria-label={menuLabel.replace("{file}", fileName)}
              onClick={(event) => {
                const box = event.currentTarget.getBoundingClientRect()
                openAt(box.left, box.bottom + 4, event.currentTarget)
              }}
            >
              •••
            </button>
          </div>
          <span data-part="hint">{hint}</span>
          {open ? (
            <div
              ref={menu}
              data-part="menu"
              role="menu"
              aria-label={menuLabel.replace("{file}", fileName)}
              style={{ left: `${spot.x}px`, top: `${spot.y}px` }}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                  return
                }

                event.preventDefault()
                const items = Array.from(
                  menu.current?.querySelectorAll<HTMLElement>(
                    '[data-part="item"]',
                  ) ?? [],
                )

                if (items.length === 0) {
                  return
                }

                const delta = event.key === "ArrowDown" ? 1 : -1
                const from = items.indexOf(
                  document.activeElement as HTMLElement,
                )
                items[(from + delta + items.length) % items.length].focus()
              }}
            >
              <div data-part="target">{fileName}</div>
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  data-part="item"
                  onClick={() => run(action.label)}
                >
                  {action.label}
                  <span data-part="keys">{action.keys}</span>
                </button>
              ))}
              <div data-part="rule" role="separator" />
              <button
                type="button"
                role="menuitem"
                data-part="item"
                data-danger="true"
                onClick={() => run(deleteLabel)}
              >
                {deleteLabel}
                <span data-part="keys">⌫</span>
              </button>
            </div>
          ) : null}
        </div>
        <p data-part="log" role="status">
          {done}
        </p>
      </section>
    </>
  )
}
