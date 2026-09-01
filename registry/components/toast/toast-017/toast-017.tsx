"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef } from "react"

export type Toast017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  message?: string
  keepLabel?: string
  deleteLabel?: string
  keptResult?: string
  deletedResult?: string
  onKeep?: () => void
  onDelete?: () => void
}

// Идея компонента: разрушительное решение прямо в уведомлении вместо
// отдельного модального диалога. Два равных по размеру, но разных по весу
// действия стоят рядом: «Оставить» — обычная кнопка, «Удалить» — опасная.
// После выбора карточка не исчезает мгновенно, а на секунду показывает
// исход, чтобы решение не терялось бесследно.
const STYLES = `
:where([data-vibeui-block="toast-017"]){
--vibeui-toast-017-bg:oklch(0.99 0.002 265);
--vibeui-toast-017-fg:oklch(0.22 0.014 265);
--vibeui-toast-017-muted:oklch(0.56 0.014 265);
--vibeui-toast-017-border:oklch(0.9 0.006 265);
--vibeui-toast-017-danger:oklch(0.58 0.19 25);
--vibeui-toast-017-danger-bg:oklch(0.58 0.19 25 / 12%);
--vibeui-toast-017-radius:0.875rem;
--vibeui-toast-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-017"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-017-radius);
border:1px solid var(--vibeui-toast-017-border);
background:var(--vibeui-toast-017-bg);color:var(--vibeui-toast-017-fg);
font-family:var(--vibeui-toast-017-font);
box-shadow:0 16px 34px -24px oklch(0.18 0.02 265 / 55%);
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
[data-vibeui-block="toast-017"] [data-part="keep"]:hover{background:oklch(0 0 0 / 4%)}
[data-vibeui-block="toast-017"] [data-part="delete"]{
background:var(--vibeui-toast-017-danger-bg);color:var(--vibeui-toast-017-danger);
}
[data-vibeui-block="toast-017"] [data-part="delete"]:hover{background:oklch(0.58 0.19 25 / 20%)}
[data-vibeui-block="toast-017"] [data-part="row"] button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
[data-vibeui-block="toast-017"] [data-part="result"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.8438rem;font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-017"] *{animation:none!important;transition:none!important}}
`

type Resolution = "pending" | "kept" | "deleted"

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
  onKeep,
  onDelete,
  className,
  style,
  ...props
}: Toast017Props) {
  const [resolution, setResolution] = useState<Resolution>("pending")

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
        data-vibeui-block="toast-017"
        role="alert"
        aria-live="assertive"
        className={className}
        style={style}
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
