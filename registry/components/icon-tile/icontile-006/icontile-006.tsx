"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Icontile006Props = Omit<ComponentProps<"button">, "children"> & {
  glyph?: string
  label?: string
  defaultPressed?: boolean
  /** Угол оттенка в oklch: красит ховер, нажатое состояние и кольцо фокуса. */
  hue?: number
}

// Идея компонента: плитка-переключатель с честным нажатым состоянием.
// Состояние объявлено через aria-pressed, а не подкрашено классом: без него
// скринридер сообщит просто «кнопка» и не скажет, включено ли. Нажатие видно
// не одним цветом — плитка утоплена внутренней тенью и сдвинута на пиксель,
// поэтому включённость читается и в чёрно-белом режиме.
const STYLES = `
:where([data-vibeui-block="icontile-006"]){
--vibeui-icontile-006-size:2.75rem;
--vibeui-icontile-006-hue:262;
--vibeui-icontile-006-idle:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.008 265));
--vibeui-icontile-006-hover:light-dark(oklch(0.93 0.01 var(--vibeui-icontile-006-hue)),oklch(0.33 0.03 var(--vibeui-icontile-006-hue)));
--vibeui-icontile-006-fg:light-dark(oklch(0.36 0.014 265),oklch(0.91 0.008 265));
--vibeui-icontile-006-border:light-dark(oklch(0.89 0.006 265),oklch(0.4 0.01 265));
--vibeui-icontile-006-on:light-dark(oklch(0.55 0.17 var(--vibeui-icontile-006-hue)),oklch(0.62 0.17 var(--vibeui-icontile-006-hue)));
--vibeui-icontile-006-on-border:light-dark(oklch(0.47 0.17 var(--vibeui-icontile-006-hue)),oklch(0.72 0.15 var(--vibeui-icontile-006-hue)));
--vibeui-icontile-006-ring:light-dark(oklch(0.55 0.17 262 / 60%),oklch(0.74 0.15 262 / 70%));
--vibeui-icontile-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-006"]{color-scheme:dark}
[data-vibeui-block="icontile-006"]{
appearance:none;cursor:pointer;
display:inline-grid;place-items:center;flex:none;box-sizing:border-box;
width:var(--vibeui-icontile-006-size);height:var(--vibeui-icontile-006-size);
padding:0;border-radius:0.875rem;
background:var(--vibeui-icontile-006-idle);
border:1px solid var(--vibeui-icontile-006-border);
color:var(--vibeui-icontile-006-fg);
font-family:var(--vibeui-icontile-006-font);
font-size:calc(var(--vibeui-icontile-006-size) * 0.44);line-height:1;
transition:background-color .16s ease,color .16s ease,transform .1s ease,box-shadow .16s ease;
}
[data-vibeui-block="icontile-006"]:hover{background:var(--vibeui-icontile-006-hover)}
[data-vibeui-block="icontile-006"]:focus-visible{outline:2px solid var(--vibeui-icontile-006-ring);outline-offset:2px}
/* Нажатое состояние — не только цвет: утопленная тень видна и без цвета. */
[data-vibeui-block="icontile-006"][aria-pressed="true"]{
background:var(--vibeui-icontile-006-on);
border-color:var(--vibeui-icontile-006-on-border);
color:oklch(0.99 0 0);
box-shadow:inset 0 2px 4px oklch(0.25 0.1 var(--vibeui-icontile-006-hue) / 45%);
transform:translateY(1px);
}
[data-vibeui-block="icontile-006"]:active{transform:translateY(1px)}
[data-vibeui-block="icontile-006"]:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-006"]{animation:none!important;transition:none!important}}
`

/**
 * Плитка-кнопка с нажатым состоянием на aria-pressed.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile006({
  glyph = "★",
  label = "В избранное",
  defaultPressed = false,
  hue = 262,
  type = "button",
  onClick,
  className,
  style,
  ...props
}: Icontile006Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const palette = {
    "--vibeui-icontile-006-hue": hue,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-006" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="icon-tile"
        data-vibeui-block="icontile-006"
        aria-pressed={pressed}
        aria-label={label}
        onClick={(event) => {
          setPressed((value) => !value)
          onClick?.(event)
        }}
        className={className}
        style={palette}
      >
        <span aria-hidden="true">{glyph}</span>
      </button>
    </>
  )
}
