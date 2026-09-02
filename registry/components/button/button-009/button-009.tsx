"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button009Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
> & {
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  onLabel?: string
  offLabel?: string
  accent?: string
}

// Идея компонента: кнопка и переключатель в одном пятне. Справа — дорожка
// с бегунком, который переезжает при нажатии, подпись меняется вместе
// с состоянием. Состояние объявлено через aria-pressed, поэтому кнопка
// остаётся кнопкой, а не чекбоксом.
//
// Тема берётся из color-scheme окружения через light-dark(): включённое
// состояние в тёмном контексте — глубокая зелёная заливка со светлой
// подписью, а не выбеленная плашка, и граница светлее фона.
const STYLES = `
:where([data-vibeui-block="button-009"]){
--vibeui-button-009-bg:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.012 265));
--vibeui-button-009-fg:light-dark(oklch(0.42 0.014 265),oklch(0.86 0.008 265));
--vibeui-button-009-border:light-dark(oklch(0.55 0.02 265 / 24%),oklch(0.82 0.02 265 / 28%));
--vibeui-button-009-on-bg:light-dark(oklch(0.94 0.045 160),oklch(0.34 0.055 160));
--vibeui-button-009-on-fg:light-dark(oklch(0.36 0.08 160),oklch(0.9 0.07 160));
--vibeui-button-009-accent:light-dark(oklch(0.62 0.15 160),oklch(0.7 0.14 160));
--vibeui-button-009-track:light-dark(oklch(0.55 0.02 265 / 26%),oklch(0.85 0.02 265 / 26%));
--vibeui-button-009-ring:light-dark(oklch(0.55 0.02 265 / 60%),oklch(0.82 0.02 265 / 60%));
--vibeui-button-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-009"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.5rem;padding:0 0.5rem 0 1rem;
border:1px solid var(--vibeui-button-009-border);border-radius:9999px;
font-family:var(--vibeui-button-009-font);font-size:0.875rem;font-weight:500;line-height:1;
background:var(--vibeui-button-009-bg);color:var(--vibeui-button-009-fg);
transition:background-color .2s ease,color .2s ease,border-color .2s ease;
}
[data-vibeui-block="button-009"][aria-pressed="true"]{
background:var(--vibeui-button-009-on-bg);color:var(--vibeui-button-009-on-fg);
border-color:color-mix(in oklab, var(--vibeui-button-009-accent) 40%, transparent);
}
[data-vibeui-block="button-009"] [data-part="track"]{
position:relative;width:2rem;height:1.125rem;flex:none;border-radius:9999px;
background:var(--vibeui-button-009-track);transition:background-color .2s ease;
}
[data-vibeui-block="button-009"][aria-pressed="true"] [data-part="track"]{background:var(--vibeui-button-009-accent)}
[data-vibeui-block="button-009"] [data-part="thumb"]{
position:absolute;top:0.1875rem;left:0.1875rem;width:0.75rem;height:0.75rem;border-radius:9999px;
background:oklch(1 0 0);box-shadow:0 1px 2px oklch(0 0 0 / 25%);
transition:transform .22s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-009"][aria-pressed="true"] [data-part="thumb"]{transform:translateX(0.875rem)}
[data-vibeui-block="button-009"]:hover:not(:disabled){border-color:color-mix(in oklab, var(--vibeui-button-009-fg) 35%, transparent)}
[data-vibeui-block="button-009"]:focus-visible{outline:2px solid var(--vibeui-button-009-ring);outline-offset:2px}
[data-vibeui-block="button-009"]:disabled{cursor:not-allowed;opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-009"] *{transition:none!important}}
`

/**
 * Кнопка-переключатель: подпись и бегунок в одном пятне. Один файл, ноль
 * зависимостей. Клиентский компонент: состояние переключателя.
 */
export function Button009({
  defaultPressed = false,
  onPressedChange,
  onLabel = "Уведомления включены",
  offLabel = "Уведомления выключены",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button009Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent ? { "--vibeui-button-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-009" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-009"
        aria-pressed={pressed}
        className={className}
        style={palette}
        onClick={() => {
          const next = !pressed
          setPressed(next)
          onPressedChange?.(next)
        }}
      >
        {pressed ? onLabel : offLabel}
        <span data-part="track" aria-hidden="true">
          <span data-part="thumb" />
        </span>
      </button>
    </>
  )
}
