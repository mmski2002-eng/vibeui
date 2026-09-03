"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button024Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Сколько элементов всего. */
  total?: number
  /** Сколько выбрано на старте: между нулём и total получится «частично». */
  defaultSelected?: number
  onSelectedChange?: (selected: number) => void
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель с третьим состоянием. Кроме «всё выбрано» и
// «ничего не выбрано» у списка есть промежуточное «выбрано 3 из 8», и его
// нельзя показать булевым aria-pressed. Здесь состояние объявлено значением
// mixed, а значок в квадрате меняется с галочки на тире — состояние читается
// и скринридером, и глазом, без опоры на цвет.
const STYLES = `
:where([data-vibeui-block="button-024"]){
--vibeui-button-024-bg:transparent;
--vibeui-button-024-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-button-024-muted:color-mix(in oklab,var(--vibeui-button-024-fg) 68%,transparent);
--vibeui-button-024-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-button-024-accent:light-dark(oklch(0.55 0.17 265),oklch(0.64 0.18 265));
--vibeui-button-024-mark:oklch(0.99 0.01 265);
--vibeui-button-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-024"]{color-scheme:dark}
[data-vibeui-block="button-024"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.5rem;padding:0 0.875rem;box-sizing:border-box;
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
border-right:2px solid var(--vibeui-button-024-mark);border-bottom:2px solid var(--vibeui-button-024-mark);
transform:rotate(45deg);
}
[data-vibeui-block="button-024"] [data-part="dash"]{
position:absolute;left:0.1875rem;top:0.4375rem;width:0.5rem;height:2px;
border-radius:1px;background:var(--vibeui-button-024-mark);
}
[data-vibeui-block="button-024"] [data-part="count"]{
color:var(--vibeui-button-024-muted);font-variant-numeric:tabular-nums;font-weight:500;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-024"] *{animation:none!important;transition:none!important}}
`

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
 * Кнопка «выбрать всё» с третьим состоянием через aria-pressed="mixed".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button024({
  label = "Выбрать все",
  total = 8,
  defaultSelected = 3,
  onSelectedChange,
  background = "",
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
    ...(background
      ? {
          "--vibeui-button-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="button"
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
