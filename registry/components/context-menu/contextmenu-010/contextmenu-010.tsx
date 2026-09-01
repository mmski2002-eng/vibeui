"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent } from "react"

export type Contextmenu010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  text?: string
  emptyHint?: string
  accent?: string
}

// Идея компонента: меню форматирования на выделенном тексте. Выделение читается
// в момент вызова — window.getSelection() в рендере ничего не знает о выборе
// пользователя, а после закрытия меню оно уже сброшено. Меню не HTML popover,
// а обычный слой внутри демонстрационной области: координаты клика переведены
// в систему отсчёта области и зажаты её границами, поэтому меню физически не
// может вылезти за карточку каталога. Кнопки формата помечают то, что к
// выделению уже применено, — список меток под абзацем растёт с каждым нажатием.
const STYLES = `
:where([data-vibeui-block="contextmenu-010"]){
--vibeui-contextmenu-010-bg:oklch(1 0 0);
--vibeui-contextmenu-010-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-010-muted:oklch(0.55 0.014 265);
--vibeui-contextmenu-010-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-010-hover:oklch(0.96 0.004 265);
--vibeui-contextmenu-010-accent:oklch(0.58 0.17 300);
--vibeui-contextmenu-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="contextmenu-010"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-contextmenu-010-bg);color:var(--vibeui-contextmenu-010-fg);
border:1px solid var(--vibeui-contextmenu-010-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-010-font);
}
[data-vibeui-block="contextmenu-010"] *{box-sizing:border-box}
/* Демонстрационная область — единственная система отсчёта: position:relative
   и overflow:hidden держат меню внутри неё, даже если координаты не зажать. */
[data-vibeui-block="contextmenu-010"] [data-part="stage"]{
position:relative;overflow:hidden;
border-radius:0.75rem;
}
[data-vibeui-block="contextmenu-010"] [data-part="text"]{
margin:0;font-size:0.875rem;line-height:1.6;
}
[data-vibeui-block="contextmenu-010"] [data-part="text"]::selection{
background:color-mix(in oklab,var(--vibeui-contextmenu-010-accent) 35%,transparent);
}
[data-vibeui-block="contextmenu-010"] [data-part="marks"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:0.625rem;min-height:1.5rem;
}
[data-vibeui-block="contextmenu-010"] [data-part="mark"]{
display:inline-flex;align-items:center;padding:0.125rem 0.5rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-contextmenu-010-accent) 40%,transparent);
background:color-mix(in oklab,var(--vibeui-contextmenu-010-accent) 10%,transparent);
font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="contextmenu-010"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-top:0.25rem;
}
[data-vibeui-block="contextmenu-010"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-010-muted)}
[data-vibeui-block="contextmenu-010"] [data-part="fallback"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 0.75rem;
border:1px solid var(--vibeui-contextmenu-010-border);border-radius:0.5rem;
background:var(--vibeui-contextmenu-010-bg);color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="contextmenu-010"] [data-part="fallback"]:hover{background:var(--vibeui-contextmenu-010-hover)}
[data-vibeui-block="contextmenu-010"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-010-accent);outline-offset:2px}
/* Координаты клика уже переведены в систему отсчёта stage — просто px. */
[data-vibeui-block="contextmenu-010"] [data-part="menu"]{
position:absolute;margin:0;padding:0.3125rem;width:12.5rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-010-bg);color:var(--vibeui-contextmenu-010-fg);
border:1px solid var(--vibeui-contextmenu-010-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 50%);
font-family:var(--vibeui-contextmenu-010-font);
}
[data-vibeui-block="contextmenu-010"] [data-part="quote"]{
padding:0.375rem 0.5rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-010-border);
font-size:0.6875rem;font-style:italic;color:var(--vibeui-contextmenu-010-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-010"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-010"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-010-hover)}
[data-vibeui-block="contextmenu-010"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-010-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-010"] [data-part="item"][aria-disabled="true"]{color:var(--vibeui-contextmenu-010-muted);cursor:not-allowed}
[data-vibeui-block="contextmenu-010"] [data-part="item"][aria-disabled="true"]:hover{background:none}
[data-vibeui-block="contextmenu-010"] [data-part="glyph"]{flex:none;width:1.125rem;font-weight:800;text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEXT =
  "Выделите фразу в этом абзаце и вызовите меню правой кнопкой: форматирование применится именно к выделению."

const ACTIONS = [
  { label: "Полужирный", glyph: "Ж" },
  { label: "Курсив", glyph: "К" },
  { label: "Подчёркнутый", glyph: "Ч" },
  { label: "Ссылка", glyph: "→" },
]

// Ширина меню фиксирована в CSS, высота — сумма шапки и четырёх пунктов.
const MENU_WIDTH = 200
const MENU_HEIGHT = 214

/**
 * Меню форматирования выделенного текста: читает выделение при вызове,
 * держит меню внутри демонстрационной области без HTML popover.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu010({
  text = DEFAULT_TEXT,
  emptyHint = "Ничего не выделено",
  accent,
  className,
  style,
  ...props
}: Contextmenu010Props) {
  const stage = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [picked, setPicked] = useState("")
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)
  const [marks, setMarks] = useState<string[]>([])

  const open = spot !== null

  // Выделение известно только сейчас — читаем его до открытия, а не в рендере.
  const openAt = (clientX: number, clientY: number, trigger: HTMLElement) => {
    const box = stage.current?.getBoundingClientRect()

    if (!box) {
      return
    }

    setPicked(window.getSelection()?.toString().trim() ?? "")

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

  const run = (label: string) => {
    if (!picked) {
      return
    }

    setMarks((current) => [...current, `${label}: «${picked}»`])
    close(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="contextmenu-010"
        aria-label="Текст с меню форматирования"
        className={className}
        style={palette}
      >
        <div data-part="stage" ref={stage}>
          <p
            data-part="text"
            onContextMenu={(event: MouseEvent<HTMLParagraphElement>) => {
              event.preventDefault()
              openAt(event.clientX, event.clientY, event.currentTarget)
            }}
          >
            {text}
          </p>
          {open ? (
            <div
              ref={menu}
              data-part="menu"
              role="menu"
              aria-label="Форматирование выделения"
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
              <div data-part="quote">{picked ? `«${picked}»` : emptyHint}</div>
              {ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  data-part="item"
                  aria-disabled={picked ? undefined : true}
                  onClick={() => run(action.label)}
                >
                  <span data-part="glyph" aria-hidden="true">
                    {action.glyph}
                  </span>
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div data-part="marks" role="status">
          {marks.map((mark, index) => (
            <span key={index} data-part="mark">
              {mark}
            </span>
          ))}
        </div>
        <div data-part="row">
          <span data-part="hint">правый клик по выделению</span>
          <button
            type="button"
            data-part="fallback"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6, event.currentTarget)
            }}
          >
            Форматирование
          </button>
        </div>
      </section>
    </>
  )
}
