"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle007Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  scale?: number
  text?: string
  /** Заголовок образца. */
  heading?: string
  /** Строка масштаба; {scale} подставляется числом. */
  valueText?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: toggle размерной шкалы. Нажатие меняет один множитель, от
// которого считаются все размеры образца, — поэтому крупный режим не ломает
// пропорции, а увеличивает их целиком. Шкала показана самой кнопкой: две «A».
const STYLES = `
:where([data-vibeui-block="toggle-007"]){
--vibeui-toggle-007-bg:transparent;
--vibeui-toggle-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-toggle-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-toggle-007-accent:light-dark(oklch(0.54 0.16 320),oklch(0.76 0.13 320));
--vibeui-toggle-007-hover:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.01 265));
--vibeui-toggle-007-scale:1;
--vibeui-toggle-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-007"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:23rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-007-border);border-radius:0.875rem;
background:var(--vibeui-toggle-007-bg);color:var(--vibeui-toggle-007-fg);
font-family:var(--vibeui-toggle-007-font);
}
[data-vibeui-block="toggle-007"] *{box-sizing:border-box}
[data-vibeui-block="toggle-007"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="toggle-007"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:baseline;gap:0.3125rem;
height:2.125rem;padding:0 0.75rem;
border:1px solid var(--vibeui-toggle-007-border);border-radius:0.5rem;
background:var(--vibeui-toggle-007-bg);color:var(--vibeui-toggle-007-fg);
line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-007"] button:hover{background:var(--vibeui-toggle-007-hover)}
[data-vibeui-block="toggle-007"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-007-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-007"] button[aria-pressed="true"]{
border-color:var(--vibeui-toggle-007-accent);color:var(--vibeui-toggle-007-accent);
background:color-mix(in oklab,var(--vibeui-toggle-007-accent) 12%,transparent);
}
[data-vibeui-block="toggle-007"] [data-part="small"]{font-size:0.75rem;font-weight:700}
[data-vibeui-block="toggle-007"] [data-part="big"]{font-size:1.0625rem;font-weight:700}
[data-vibeui-block="toggle-007"] [data-part="value"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toggle-007-muted);
font-variant-numeric:tabular-nums;
}
/* Единый множитель на весь образец: заголовок, текст и отступы считаются от
   него, поэтому крупный режим не превращает вёрстку в лесенку. */
[data-vibeui-block="toggle-007"] [data-part="sample"]{
padding:calc(0.75rem * var(--vibeui-toggle-007-scale));
border-radius:0.625rem;background:var(--vibeui-toggle-007-hover);
transition:padding .18s ease;
}
[data-vibeui-block="toggle-007"] [data-part="sample"] h3{
margin:0 0 calc(0.375rem * var(--vibeui-toggle-007-scale));
font-size:calc(0.9375rem * var(--vibeui-toggle-007-scale));line-height:1.25;
transition:font-size .18s ease;
}
[data-vibeui-block="toggle-007"] [data-part="sample"] p{
margin:0;color:var(--vibeui-toggle-007-muted);
font-size:calc(0.8125rem * var(--vibeui-toggle-007-scale));line-height:1.5;
transition:font-size .18s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Toggle размерной шкалы: один множитель увеличивает весь образец целиком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle007({
  label = "Крупный текст",
  scale = 125,
  text = "Размер меняется одним множителем, поэтому заголовок, абзац и отступы растут вместе.",
  heading = "Размерная шкала",
  valueText = "Масштаб {scale}%",
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle007Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    "--vibeui-toggle-007-scale": String(pressed ? scale / 100 : 1),
    ...(accent ? { "--vibeui-toggle-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="toggle-007"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            aria-pressed={pressed}
            aria-label={label}
            onClick={() => {
              setPressed(!pressed)
              onChange?.(!pressed)
            }}
          >
            <span data-part="small" aria-hidden="true">
              A
            </span>
            <span data-part="big" aria-hidden="true">
              A
            </span>
          </button>
          <p data-part="value" role="status">
            {valueText.replace("{scale}", String(pressed ? scale : 100))}
          </p>
        </div>
        <div data-part="sample">
          <h3>{heading}</h3>
          <p>{text}</p>
        </div>
      </section>
    </>
  )
}
