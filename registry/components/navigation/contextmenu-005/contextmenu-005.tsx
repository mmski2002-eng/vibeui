"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent } from "react"

export type Contextmenu005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  text?: string
  emptyHint?: string
  accent?: string
}

// Идея компонента: меню для выделенного текста. Оно читает выделение в момент
// вызова — до этого браузер ничего не знает о том, что выбрал пользователь, —
// и показывает кусок текста в шапке: команда «перевести» без предмета перевода
// бессмысленна. Пока ничего не выделено, пункты помечены aria-disabled и
// объясняют причину, а не молча не срабатывают.
const STYLES = `
:where([data-vibeui-block="contextmenu-005"]){
--vibeui-contextmenu-005-bg:oklch(1 0 0);
--vibeui-contextmenu-005-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-005-muted:oklch(0.55 0.014 265);
--vibeui-contextmenu-005-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-005-hover:oklch(0.96 0.004 265);
--vibeui-contextmenu-005-accent:oklch(0.6 0.16 60);
--vibeui-contextmenu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-005-x:50%;
--vibeui-contextmenu-005-y:50%;
}
[data-vibeui-block="contextmenu-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-contextmenu-005-bg);color:var(--vibeui-contextmenu-005-fg);
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-005-font);
}
[data-vibeui-block="contextmenu-005"] [data-part="text"]{
margin:0;font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="contextmenu-005"] [data-part="text"]::selection{
background:color-mix(in oklab,var(--vibeui-contextmenu-005-accent) 35%,transparent);
}
[data-vibeui-block="contextmenu-005"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="contextmenu-005"] [data-part="hint"]{
font-size:0.6875rem;color:var(--vibeui-contextmenu-005-muted);
}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 0.75rem;
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:0.5rem;
background:var(--vibeui-contextmenu-005-bg);color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]:hover{background:var(--vibeui-contextmenu-005-hover)}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-005-accent);outline-offset:2px}
[data-vibeui-block="contextmenu-005"] [data-part="log"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-005-muted);min-height:1rem;
}
[data-vibeui-block="contextmenu-005"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-005-y);left:var(--vibeui-contextmenu-005-x);
min-width:12.5rem;max-width:15rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-005-bg);color:var(--vibeui-contextmenu-005-fg);
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 50%);
font-family:var(--vibeui-contextmenu-005-font);
}
/* Шапка показывает предмет действия: «перевести» без текста ничего не значит. */
[data-vibeui-block="contextmenu-005"] [data-part="quote"]{
padding:0.375rem 0.5rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-005-border);
font-size:0.6875rem;font-style:italic;color:var(--vibeui-contextmenu-005-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-005"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-005"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-005-hover)}
[data-vibeui-block="contextmenu-005"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-005"] [data-part="item"][aria-disabled="true"]{color:var(--vibeui-contextmenu-005-muted);cursor:not-allowed}
[data-vibeui-block="contextmenu-005"] [data-part="item"][aria-disabled="true"]:hover{background:none}
[data-vibeui-block="contextmenu-005"] [data-part="dot"]{
flex:none;width:0.625rem;height:0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-contextmenu-005-accent) 60%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEXT =
  "Выделите любую фразу в этом абзаце и вызовите меню правой кнопкой: команда покажет, с каким именно текстом она будет работать."

const ACTIONS = ["Копировать", "Найти в сети", "Перевести", "Процитировать"]

/**
 * Контекстное меню выделенного текста: читает выделение и показывает его в шапке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu005({
  text = DEFAULT_TEXT,
  emptyHint = "Ничего не выделено",
  accent,
  className,
  style,
  ...props
}: Contextmenu005Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState("")
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)
  const [done, setDone] = useState("")

  // Выделение известно только в момент вызова: читаем его здесь, а не в рендере.
  const openAt = (x: number, y: number) => {
    setPicked(window.getSelection()?.toString().trim() ?? "")
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const run = (action: string) => {
    if (!picked) {
      return
    }

    setDone(`${action}: «${picked}»`)
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-005-accent": accent } : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-005-x": spot.x,
          "--vibeui-contextmenu-005-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="contextmenu-005"
        aria-label="Текст с меню выделения"
        className={className}
        style={palette}
      >
        <p
          data-part="text"
          onContextMenu={(event: MouseEvent<HTMLParagraphElement>) => {
            event.preventDefault()
            openAt(event.clientX, event.clientY)
          }}
        >
          {text}
        </p>
        <div data-part="row">
          <span data-part="hint">правый клик по абзацу</span>
          <button
            type="button"
            data-part="fallback"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6)
            }}
          >
            Действия с выделением
          </button>
        </div>
        <p data-part="log" role="status">
          {done}
        </p>
        <div
          ref={menu}
          data-part="menu"
          popover="auto"
          role="menu"
          aria-label="Действия с выделением"
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
            const from = items.indexOf(document.activeElement as HTMLElement)
            items[(from + delta + items.length) % items.length].focus()
          }}
        >
          <div data-part="quote">{picked ? `«${picked}»` : emptyHint}</div>
          {ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              data-part="item"
              aria-disabled={picked ? undefined : true}
              onClick={() => run(action)}
            >
              <span data-part="dot" aria-hidden="true" />
              {action}
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
