"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button050Props = Omit<
  ComponentProps<"button">,
  "children" | "onChange"
> & {
  label?: string
  /** Подпись во включённом состоянии: она уходит в aria-label. */
  activeLabel?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Поверхность кнопки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: переключатель избранного без счётчика и без подписи.
// Сердце нарисовано инлайновым SVG: два псевдоэлемента с рамками давали
// внутренние линии на стыке половин и читались как знак бесконечности.
// Контур и заливка — один и тот же путь, поэтому включение не двигает фигуру.
// При включении из-под сердца расходится кольцо — короткая вспышка, которая
// подтверждает нажатие без смены раскладки.
const STYLES = `
:where([data-vibeui-block="button-050"]){
--vibeui-button-050-surface:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-button-050-border:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-button-050-idle:light-dark(oklch(0.6 0 265),oklch(0.74 0 265));
--vibeui-button-050-accent:light-dark(oklch(0.6 0.22 20),oklch(0.72 0.19 20));
--vibeui-button-050-size:2.75rem;
--vibeui-button-050-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-050"]{color-scheme:dark}
[data-vibeui-block="button-050"]{
position:relative;appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-button-050-size);height:var(--vibeui-button-050-size);
border:1px solid var(--vibeui-button-050-border);border-radius:50%;
background:var(--vibeui-button-050-surface);color:var(--vibeui-button-050-idle);
font-family:var(--vibeui-button-050-font);
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-050"]:hover{border-color:var(--vibeui-button-050-accent);color:var(--vibeui-button-050-accent)}
[data-vibeui-block="button-050"][aria-pressed="true"]{color:var(--vibeui-button-050-accent);border-color:var(--vibeui-button-050-accent)}
[data-vibeui-block="button-050"]:focus-visible{outline:2px solid var(--vibeui-button-050-accent);outline-offset:3px}
/* Сердце: один путь, обводка и заливка одного цвета. */
[data-vibeui-block="button-050"] [data-part="heart"]{
width:1.25rem;height:1.25rem;
fill:none;stroke:currentColor;stroke-width:1.75;
stroke-linecap:round;stroke-linejoin:round;
transition:transform .2s cubic-bezier(0.34,1.56,0.64,1),fill .18s ease;
}
[data-vibeui-block="button-050"][aria-pressed="true"] [data-part="heart"]{
fill:currentColor;transform:scale(1.08);
}
/* Кольцо-вспышка: рисуется только во включённом состоянии. */
[data-vibeui-block="button-050"] [data-part="burst"]{
position:absolute;inset:0;border-radius:50%;pointer-events:none;
border:2px solid var(--vibeui-button-050-accent);opacity:0;
}
[data-vibeui-block="button-050"][aria-pressed="true"] [data-part="burst"]{
animation:vibeui-button-050-burst .45s ease-out 1;
}
@keyframes vibeui-button-050-burst{
from{opacity:.65;transform:scale(1)}
to{opacity:0;transform:scale(1.6)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-050"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * контуру тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Кнопка избранного с переключением: сердце на CSS и кольцо-вспышка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button050({
  label = "В избранное",
  activeLabel = "Убрать из избранного",
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button050Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-button-050-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-050-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-050" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-050"
        className={className}
        style={palette}
        aria-pressed={pressed}
        aria-label={pressed ? activeLabel : label}
        onClick={() => {
          const next = !pressed

          setPressed(next)
          onChange?.(next)
        }}
      >
        <span data-part="burst" aria-hidden="true" />
        <svg data-part="heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20.5 4.2 12.9a4.8 4.8 0 0 1 0-6.8 4.8 4.8 0 0 1 6.8 0l1 1 1-1a4.8 4.8 0 0 1 6.8 0 4.8 4.8 0 0 1 0 6.8Z" />
        </svg>
      </button>
    </>
  )
}
