"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle002Props = Omit<
  ComponentProps<"button">,
  "children" | "onChange"
> & {
  label?: string
  onLabel?: string
  /** Строка состояния, когда кнопка не нажата. */
  offLabel?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: toggle с иконкой и подписью, у которого подпись остаётся
// именем действия, а результат объявляется отдельной живой строкой. Менять
// подпись на «Откреплено» нельзя: скринридер прочитает новое имя и старое
// aria-pressed вместе, и получится «Откреплено, нажато».
const STYLES = `
:where([data-vibeui-block="toggle-002"]){
--vibeui-toggle-002-bg:transparent;
--vibeui-toggle-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-002-muted:color-mix(in oklab,var(--vibeui-toggle-002-fg) 68%,transparent);
--vibeui-toggle-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-toggle-002-accent:light-dark(oklch(0.56 0.16 255),oklch(0.76 0.13 255));
--vibeui-toggle-002-soft:light-dark(oklch(0.95 0.03 255),oklch(0.31 0.05 255));
--vibeui-toggle-002-radius:0.625rem;
--vibeui-toggle-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-002"]{color-scheme:dark}
[data-vibeui-block="toggle-002"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.5rem;
padding:0.75rem;max-width:18rem;
border:1px solid var(--vibeui-toggle-002-border);border-radius:0.875rem;
background:var(--vibeui-toggle-002-bg);color:var(--vibeui-toggle-002-fg);
font-family:var(--vibeui-toggle-002-font);
}
[data-vibeui-block="toggle-002"] *{box-sizing:border-box}
[data-vibeui-block="toggle-002"] [data-part="button"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-toggle-002-border);
border-radius:var(--vibeui-toggle-002-radius);
background:var(--vibeui-toggle-002-bg);color:var(--vibeui-toggle-002-fg);
font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-002"] [data-part="button"]:hover{border-color:var(--vibeui-toggle-002-accent)}
[data-vibeui-block="toggle-002"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-toggle-002-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-002"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="toggle-002"] [data-part="button"] svg path{
fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;
transition:fill .16s ease;
}
/* Нажатое состояние читается тремя способами разом: заливкой значка, фоном
   и словом в строке ниже. Один цвет на тёмном фоне карточки не читается. */
[data-vibeui-block="toggle-002"] [data-part="button"][aria-pressed="true"]{
background:var(--vibeui-toggle-002-soft);
border-color:var(--vibeui-toggle-002-accent);
color:var(--vibeui-toggle-002-accent);
}
[data-vibeui-block="toggle-002"] [data-part="button"][aria-pressed="true"] svg path{fill:currentColor}
[data-vibeui-block="toggle-002"] [data-part="state"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-toggle-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-002"] *{animation:none!important;transition:none!important}}
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
 * Toggle с иконкой и постоянной подписью: состояние объявляет aria-pressed,
 * а результат — живая строка под кнопкой. Один файл, ноль зависимостей.
 */
export function Toggle002({
  label = "Закрепить",
  onLabel = "Закреплено вверху списка",
  offLabel = "Не закреплено",
  defaultPressed = true,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle002Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-toggle-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="toggle"
        data-vibeui-block="toggle-002"
        className={className}
        style={palette}
      >
        <button
          {...props}
          type="button"
          data-part="button"
          aria-pressed={pressed}
          onClick={() => {
            setPressed(!pressed)
            onChange?.(!pressed)
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 3H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v2.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.3V16h14v-.7a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V8a1 1 0 0 1 1-1 2 2 0 0 0 0-4Z" />
            <path d="M12 16v5" />
          </svg>
          {label}
        </button>
        <p data-part="state" role="status">
          {pressed ? onLabel : offLabel}
        </p>
      </div>
    </>
  )
}
