"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button024Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Сколько элементов всего. */
  total?: number
  /** Сколько выбрано на старте: между нулём и total получится «частично». */
  defaultSelected?: number
  onSelectedChange?: (selected: number) => void
  accent?: string
}

// Идея компонента: переключатель с третьим состоянием. Кроме «всё выбрано» и
// «ничего не выбрано» у списка есть промежуточное «выбрано 3 из 8», и его
// нельзя показать булевым aria-pressed. Здесь состояние объявлено значением
// mixed, а значок в квадрате меняется с галочки на тире — состояние читается
// и скринридером, и глазом, без опоры на цвет.
const STYLES = `
:where([data-vibeui-block="button-024"]){
--vibeui-button-024-bg:oklch(1 0 0);
--vibeui-button-024-fg:oklch(0.26 0.016 265);
--vibeui-button-024-muted:oklch(0.55 0.014 265);
--vibeui-button-024-border:oklch(0.9 0.006 265);
--vibeui-button-024-accent:oklch(0.55 0.17 265);
--vibeui-button-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-024"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.375rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-024-border);border-radius:0.5rem;
background:var(--vibeui-button-024-bg);color:var(--vibeui-button-024-fg);
font-family:var(--vibeui-button-024-font);font-size:0.875rem;font-weight:550;line-height:1;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-024"]:hover{border-color:var(--vibeui-button-024-accent)}
[data-vibeui-block="button-024"]:focus-visible{outline:2px solid var(--vibeui-button-024-accent);outline-offset:2px}
[data-vibeui-block="button-024"] [data-part="box"]{
flex:none;position:relative;width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-button-024-border);border-radius:0.3125rem;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-024"][aria-pressed="true"] [data-part="box"],
[data-vibeui-block="button-024"][aria-pressed="mixed"] [data-part="box"]{
background:var(--vibeui-button-024-accent);border-color:var(--vibeui-button-024-accent);
}
/* Галочка и тире — второй канал состояния помимо заливки. */
[data-vibeui-block="button-024"] [data-part="tick"]{
position:absolute;left:0.3125rem;top:0.0625rem;width:0.25rem;height:0.5rem;
border-right:2px solid oklch(1 0 0);border-bottom:2px solid oklch(1 0 0);
transform:rotate(45deg);
}
[data-vibeui-block="button-024"] [data-part="dash"]{
position:absolute;left:0.1875rem;top:0.4375rem;width:0.5rem;height:2px;
border-radius:1px;background:oklch(1 0 0);
}
[data-vibeui-block="button-024"] [data-part="count"]{
color:var(--vibeui-button-024-muted);font-variant-numeric:tabular-nums;font-weight:500;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-024"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка «выбрать всё» с третьим состоянием через aria-pressed="mixed".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button024({
  label = "Выбрать все",
  total = 8,
  defaultSelected = 3,
  onSelectedChange,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button024Props) {
  const [selected, setSelected] = useState(
    Math.min(Math.max(defaultSelected, 0), total),
  )

  const pressed =
    selected === 0 ? "false" : selected === total ? "true" : "mixed"

  const toggle = () => {
    const next = selected === total ? 0 : total
    setSelected(next)
    onSelectedChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-button-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-024" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-024"
        className={className}
        style={palette}
        aria-pressed={pressed}
        onClick={toggle}
      >
        <span data-part="box" aria-hidden="true">
          {pressed === "true" ? <span data-part="tick" /> : null}
          {pressed === "mixed" ? <span data-part="dash" /> : null}
        </span>
        {label}
        <span data-part="count">
          {selected} / {total}
        </span>
      </button>
    </>
  )
}
