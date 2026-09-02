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
  /** Имя кнопки для скринридера. {label} — подпись, {count} — число отметок. */
  countLabel?: string
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кнопка-реакция со счётчиком. Состояние объявлено через
// aria-pressed, а не сменой подписи: «Нравится» → «Не нравится» звучит как
// другое действие, а не как отмена. Счётчик меняется сразу, не дожидаясь
// ответа сервера: реакция — дешёвое действие, и ждать её незачем.
const STYLES = `
:where([data-vibeui-block="button-019"]){
--vibeui-button-019-fg:light-dark(oklch(0.32 0.014 265),oklch(0.93 0.006 265));
--vibeui-button-019-bg:transparent;
--vibeui-button-019-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-button-019-hover:light-dark(oklch(0.96 0.004 265),oklch(0.32 0.012 265));
--vibeui-button-019-accent:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
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
border-color:color-mix(in oklab,var(--vibeui-button-019-accent) 50%,transparent);
background:color-mix(in oklab,var(--vibeui-button-019-accent) 12%,transparent);
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
 * Кнопка-реакция со счётчиком: состояние в aria-pressed.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button019({
  label = "Нравится",
  count = 128,
  defaultPressed = false,
  onChange,
  countLabel = "{label}, отметок: {count}",
  background = "",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button019Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-button-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        aria-label={countLabel
          .replace("{label}", label)
          .replace("{count}", String(total))}
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
