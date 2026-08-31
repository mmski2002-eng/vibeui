"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Item008Props = Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  position?: number
  total?: number
  onMove?: (direction: -1 | 1) => void
  accent?: string
}

// Идея компонента: строка, которую переносят за ручку, — но ручка здесь не
// картинка, а кнопка. Мышью строку тянут нативным drag and drop, с клавиатуры
// ручка берётся пробелом, стрелки вверх и вниз двигают строку, Escape кладёт
// её обратно. Без этого перенос доступен ровно половине людей. Ручка называет
// свою позицию вслух («3 из 8»), а переход в режим переноса объявляется в
// живой области: визуальный сдвиг строки скринридер не увидит.
const STYLES = `
:where([data-vibeui-block="item-008"]){
--vibeui-item-008-bg:oklch(1 0 0);
--vibeui-item-008-fg:oklch(0.23 0.014 265);
--vibeui-item-008-muted:oklch(0.56 0.014 265);
--vibeui-item-008-border:oklch(0.9 0.006 265);
--vibeui-item-008-accent:oklch(0.55 0.19 262);
--vibeui-item-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-008"]{
position:relative;display:flex;align-items:center;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.5rem 0.75rem 0.5rem 0.375rem;
list-style:none;
background:var(--vibeui-item-008-bg);
border:1px solid var(--vibeui-item-008-border);border-radius:0.75rem;
font-family:var(--vibeui-item-008-font);color:var(--vibeui-item-008-fg);
transition:box-shadow .15s ease,border-color .15s ease;
}
[data-vibeui-block="item-008"] *{box-sizing:border-box}
/* Поднятая строка отличается тенью и рамкой, а не только оттенком. */
[data-vibeui-block="item-008"][data-grabbed="true"]{
border-color:var(--vibeui-item-008-accent);
box-shadow:0 6px 16px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="item-008"][data-dragging="true"]{opacity:.5}
/* Ручка — кнопка, а не декоративный значок: иначе она недостижима с клавиатуры. */
[data-vibeui-block="item-008"] [data-part="grip"]{
flex:none;appearance:none;border:0;background:none;cursor:grab;
display:grid;gap:2.5px;padding:0.4375rem 0.375rem;border-radius:0.5rem;
color:var(--vibeui-item-008-muted);
}
[data-vibeui-block="item-008"] [data-part="grip"]:focus-visible{outline:2px solid var(--vibeui-item-008-accent);outline-offset:1px}
[data-vibeui-block="item-008"] [data-part="grip"][aria-pressed="true"]{cursor:grabbing;color:var(--vibeui-item-008-accent)}
[data-vibeui-block="item-008"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;background:currentColor;opacity:.65;
}
[data-vibeui-block="item-008"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.125rem}
[data-vibeui-block="item-008"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-008"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-008-muted)}
[data-vibeui-block="item-008"] [data-part="position"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-item-008-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-008"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка с ручкой переноса: мышью — drag, с клавиатуры — пробел и стрелки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item008({
  title = "Блок «Тарифы»",
  meta = "Секция посадочной страницы",
  position = 3,
  total = 8,
  onMove,
  accent,
  className,
  style,
  ...props
}: Item008Props) {
  const [grabbed, setGrabbed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [announcement, setAnnouncement] = useState("")

  const say = (text: string) => setAnnouncement(text)

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      const next = !grabbed
      setGrabbed(next)
      say(
        next
          ? `«${title}» поднята, позиция ${position} из ${total}. Стрелки двигают, пробел кладёт.`
          : `«${title}» опущена на позицию ${position} из ${total}.`,
      )
      return
    }

    if (event.key === "Escape" && grabbed) {
      setGrabbed(false)
      say(`Перенос «${title}» отменён.`)
      return
    }

    if (!grabbed) return

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      const direction = event.key === "ArrowUp" ? -1 : 1
      const target = position + direction

      if (target < 1 || target > total) {
        say(`«${title}» уже на краю списка, позиция ${position} из ${total}.`)
        return
      }

      onMove?.(direction)
      say(`«${title}» перемещена на позицию ${target} из ${total}.`)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-item-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-008" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        draggable
        data-vibeui-block="item-008"
        data-grabbed={grabbed}
        data-dragging={dragging}
        className={className}
        style={palette}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
      >
        <button
          type="button"
          data-part="grip"
          aria-pressed={grabbed}
          aria-label={`Перенести «${title}», позиция ${position} из ${total}`}
          onKeyDown={handleKey}
          onBlur={() => setGrabbed(false)}
        >
          <span />
          <span />
          <span />
        </button>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        <span data-part="position">
          {position}/{total}
        </span>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </li>
    </>
  )
}
