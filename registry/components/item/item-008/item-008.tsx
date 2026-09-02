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
  /**
   * Подпись ручки. Компонент несёт русскую, проект подставляет свою:
   * {title}, {position} и {total} подставляются на месте.
   */
  handleLabel?: string
  /**
   * Реплики живой области по ключам grabbed, dropped, cancelled, edge и moved.
   * Подстановки те же плюс {target} — позиция после шага.
   */
  announceText?: Record<string, string>
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка, которую переносят за ручку, — но ручка здесь не
// картинка, а кнопка. Мышью строку тянут нативным drag and drop, с клавиатуры
// ручка берётся пробелом, стрелки вверх и вниз двигают строку, Escape кладёт
// её обратно. Без этого перенос доступен ровно половине людей. Ручка называет
// свою позицию вслух («3 из 8»), а переход в режим переноса объявляется в
// живой области: визуальный сдвиг строки скринридер не увидит.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-008"]){
--vibeui-item-008-bg:transparent;
--vibeui-item-008-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-item-008-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-item-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-item-008-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-item-008-shadow:light-dark(oklch(0.2 0.02 265 / 14%),oklch(0 0 0 / 46%));
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
box-shadow:0 6px 16px var(--vibeui-item-008-shadow);
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

const HANDLE_LABEL = "Перенести «{title}», позиция {position} из {total}"

const ANNOUNCE: Record<string, string> = {
  grabbed:
    "«{title}» поднята, позиция {position} из {total}. Стрелки двигают, пробел кладёт.",
  dropped: "«{title}» опущена на позицию {position} из {total}.",
  cancelled: "Перенос «{title}» отменён.",
  edge: "«{title}» уже на краю списка, позиция {position} из {total}.",
  moved: "«{title}» перемещена на позицию {target} из {total}.",
}

/** Подстановка {ключей} в шаблон подписи. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    String(values[key] ?? whole),
  )
}

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
 * Строка с ручкой переноса: мышью — drag, с клавиатуры — пробел и стрелки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item008({
  title = "Блок «Тарифы»",
  meta = "Секция посадочной страницы",
  position = 3,
  total = 8,
  onMove,
  handleLabel = HANDLE_LABEL,
  announceText = ANNOUNCE,
  background = "",
  accent,
  className,
  style,
  ...props
}: Item008Props) {
  const [grabbed, setGrabbed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [announcement, setAnnouncement] = useState("")

  const say = (key: string, target = position) =>
    setAnnouncement(
      fill(announceText[key] ?? ANNOUNCE[key], {
        title,
        position,
        total,
        target,
      }),
    )

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      const next = !grabbed
      setGrabbed(next)
      say(next ? "grabbed" : "dropped")
      return
    }

    if (event.key === "Escape" && grabbed) {
      setGrabbed(false)
      say("cancelled")
      return
    }

    if (!grabbed) return

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      const direction = event.key === "ArrowUp" ? -1 : 1
      const target = position + direction

      if (target < 1 || target > total) {
        say("edge")
        return
      }

      onMove?.(direction)
      say("moved", target)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-item-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          aria-label={fill(handleLabel, { title, position, total })}
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
