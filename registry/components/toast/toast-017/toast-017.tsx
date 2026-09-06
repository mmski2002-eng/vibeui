"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast017Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  message?: string
  keepLabel?: string
  deleteLabel?: string
  keptResult?: string
  deletedResult?: string
  /** Цвет опасного действия. Пусто — штатная палитра. */
  danger?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  onKeep?: () => void
  onDelete?: () => void
}

// Идея компонента: разрушительное решение прямо в уведомлении вместо
// отдельного модального диалога. Два равных по размеру, но разных по весу
// действия стоят рядом: «Оставить» — обычная кнопка, «Удалить» — опасная.
// После выбора карточка не исчезает мгновенно, а на секунду показывает
// исход, чтобы решение не терялось бесследно.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, граница светлее подложки, а тон опасности
// поднят по светлоте, чтобы читаться на тёмной карточке.
const STYLES = `
:where([data-vibeui-block="toast-017"]){
--vibeui-toast-017-bg:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
--vibeui-toast-017-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-toast-017-muted:color-mix(in oklab,var(--vibeui-toast-017-fg) 68%,transparent);
--vibeui-toast-017-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-017-shadow:light-dark(oklch(0.18 0 265 / 55%),oklch(0.05 0 265 / 70%));
--vibeui-toast-017-hover:light-dark(oklch(0.2 0 265 / 5%),oklch(1 0 0 / 10%));
--vibeui-toast-017-danger:light-dark(oklch(0.56 0.19 25),oklch(0.74 0.17 25));
--vibeui-toast-017-radius:0.875rem;
--vibeui-toast-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-017"]{color-scheme:dark}
[data-vibeui-block="toast-017"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-017-radius);
border:1px solid var(--vibeui-toast-017-border);
background:var(--vibeui-toast-017-bg);color:var(--vibeui-toast-017-fg);
font-family:var(--vibeui-toast-017-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-017-shadow);
transition:opacity .18s ease;
}
[data-vibeui-block="toast-017"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="toast-017"] [data-part="message"]{font-size:0.8125rem;color:var(--vibeui-toast-017-muted);line-height:1.4}
[data-vibeui-block="toast-017"] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-block="toast-017"] [data-part="row"] button{
flex:1;appearance:none;cursor:pointer;border:1px solid transparent;border-radius:0.5rem;
height:2.125rem;padding:0 0.75rem;font:inherit;font-size:0.8125rem;font-weight:700;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="toast-017"] [data-part="keep"]{
background:transparent;border-color:var(--vibeui-toast-017-border);color:var(--vibeui-toast-017-fg);
}
[data-vibeui-block="toast-017"] [data-part="keep"]:hover{background:var(--vibeui-toast-017-hover)}
[data-vibeui-block="toast-017"] [data-part="delete"]{
background:color-mix(in oklab,var(--vibeui-toast-017-danger) 14%,transparent);
color:var(--vibeui-toast-017-danger);
}
[data-vibeui-block="toast-017"] [data-part="delete"]:hover{background:color-mix(in oklab,var(--vibeui-toast-017-danger) 24%,transparent)}
[data-vibeui-block="toast-017"] [data-part="row"] button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
[data-vibeui-block="toast-017"] [data-part="result"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-017"] *{animation:none!important;transition:none!important}}
`

type Resolution = "pending" | "kept" | "deleted"

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
 * Подтверждение с двумя действиями: «Оставить» и «Удалить». Опасное
 * действие выделено цветом, после выбора виден исход.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast017({
  title = "Удалить черновик статьи?",
  message = "Черновик «Осенняя коллекция» будет удалён без возможности восстановления.",
  keepLabel = "Оставить",
  deleteLabel = "Удалить",
  keptResult = "Черновик оставлен",
  deletedResult = "Черновик удалён",
  danger = "",
  background = "",
  onKeep,
  onDelete,
  className,
  style,
  ...props
}: Toast017Props) {
  const [resolution, setResolution] = useState<Resolution>("pending")

  const palette = {
    ...(danger ? { "--vibeui-toast-017-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-toast-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function keep() {
    setResolution("kept")
    onKeep?.()
  }

  function remove() {
    setResolution("deleted")
    onDelete?.()
  }

  return (
    <>
      <style href="vibeui-toast-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-017"
        role="alert"
        aria-live="assertive"
        className={className}
        style={palette}
      >
        {resolution === "pending" ? (
          <>
            <span data-part="title">{title}</span>
            <span data-part="message">{message}</span>
            <span data-part="row">
              <button type="button" data-part="keep" onClick={keep}>
                {keepLabel}
              </button>
              <button type="button" data-part="delete" onClick={remove}>
                {deleteLabel}
              </button>
            </span>
          </>
        ) : (
          <span data-part="result">
            {resolution === "kept" ? keptResult : deletedResult}
          </span>
        )}
      </div>
    </>
  )
}
