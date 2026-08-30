"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button019Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onChange"
> & {
  label?: string
  count?: number
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: кнопка-реакция со счётчиком. Состояние объявлено через
// aria-pressed, а не сменой подписи: «Нравится» → «Не нравится» звучит как
// другое действие, а не как отмена. Счётчик меняется сразу, не дожидаясь
// ответа сервера: реакция — дешёвое действие, и ждать её незачем.
const STYLES = `
:where([data-vibeui-block="button-019"]){
--vibeui-button-019-fg:oklch(0.32 0.014 265);
--vibeui-button-019-bg:oklch(1 0 0);
--vibeui-button-019-border:oklch(0.9 0.006 265);
--vibeui-button-019-hover:oklch(0.96 0.004 265);
--vibeui-button-019-accent:oklch(0.58 0.19 25);
--vibeui-button-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-019"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2rem;padding:0 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-019-border);border-radius:9999px;
background:var(--vibeui-button-019-bg);color:var(--vibeui-button-019-fg);
font-family:var(--vibeui-button-019-font);font-size:0.8125rem;font-weight:600;line-height:1;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-019"]:hover{background:var(--vibeui-button-019-hover)}
[data-vibeui-block="button-019"]:focus-visible{outline:2px solid var(--vibeui-button-019-accent);outline-offset:2px}
/* Нажатое состояние: цвет плюс заливка сердца — не только цвет. */
[data-vibeui-block="button-019"][aria-pressed="true"]{
color:var(--vibeui-button-019-accent);
border-color:color-mix(in oklab,var(--vibeui-button-019-accent) 40%,oklch(1 0 0));
background:color-mix(in oklab,var(--vibeui-button-019-accent) 8%,oklch(1 0 0));
}
/* Сердце: повёрнутый квадрат и два круга, без иконочного пакета. В покое
   оно бледнее и мельче, в нажатом — плотнее и крупнее: состояние читается
   не только цветом. */
[data-vibeui-block="button-019"] [data-part="heart"]{
position:relative;flex:none;width:0.875rem;height:0.8125rem;
opacity:.5;transform:scale(.9);
transition:opacity .16s ease,transform .16s ease;
}
[data-vibeui-block="button-019"][aria-pressed="true"] [data-part="heart"]{opacity:1;transform:scale(1.06)}
[data-vibeui-block="button-019"] [data-part="heart"]::before{
content:"";position:absolute;left:0.1875rem;bottom:0.0625rem;
width:0.5rem;height:0.5rem;background:currentColor;transform:rotate(45deg);
}
[data-vibeui-block="button-019"] [data-part="heart"]::after,
[data-vibeui-block="button-019"] [data-part="heart"] i{
content:"";position:absolute;top:0.0625rem;width:0.4375rem;height:0.4375rem;
border-radius:9999px;background:currentColor;
}
[data-vibeui-block="button-019"] [data-part="heart"]::after{left:0.0625rem}
[data-vibeui-block="button-019"] [data-part="heart"] i{right:0.0625rem}
[data-vibeui-block="button-019"] [data-part="count"]{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-019"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка-реакция со счётчиком: состояние в aria-pressed.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button019({
  label = "Нравится",
  count = 128,
  defaultPressed = false,
  onChange,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button019Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-button-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const total = count + (pressed ? 1 : 0) - (defaultPressed ? 1 : 0)

  return (
    <>
      <style href="vibeui-button-019" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-019"
        className={className}
        style={palette}
        aria-pressed={pressed}
        aria-label={`${label}, отметок: ${total}`}
        onClick={() => {
          setPressed(!pressed)
          onChange?.(!pressed)
        }}
      >
        <span data-part="heart" aria-hidden="true">
          <i />
        </span>
        <span aria-hidden="true">{label}</span>
        <span data-part="count" aria-hidden="true">
          {total}
        </span>
      </button>
    </>
  )
}
