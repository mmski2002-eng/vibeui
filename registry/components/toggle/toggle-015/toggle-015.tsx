"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Toggle015Props = Omit<ComponentProps<"button">, "children"> & {
  /** Подпись в выключенном состоянии. */
  label?: string
  /** Подпись во включённом состоянии: закладка уже сохранена. */
  pressedLabel?: string
  /** Стартовое состояние закладки. */
  defaultPressed?: boolean
  /** Вызывается после переключения — сюда вешают сохранение на сервер. */
  onPressedChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, кнопка ложится на фон страницы. */
  background?: string
}

// Идея компонента: сохранение в закладки, где подтверждением работает сама
// иконка. Ленточка заливается акцентом и на пружине «падает» на место —
// подписи «Сохранено» и всплывающего уведомления после этого не требуется,
// хотя подпись рядом всё равно меняется для тех, кто анимацию не увидит.
//
// Состояние объявлено через aria-pressed на кнопке, а не спрятанным checkbox:
// закладка — это действие над объектом, а не поле формы, и уезжать вместе с
// формой ей незачем.
const STYLES = `
:where([data-vibeui-block="toggle-015"]){
--vibeui-toggle-015-bg:transparent;
--vibeui-toggle-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-toggle-015-muted:color-mix(in oklab,var(--vibeui-toggle-015-fg) 62%,transparent);
--vibeui-toggle-015-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-toggle-015-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-toggle-015-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-toggle-015-accent-text:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-toggle-015-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-toggle-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-015"]{color-scheme:dark}
[data-vibeui-block="toggle-015"]{
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.5rem;padding:0.375rem 0.9375rem 0.375rem 0.75rem;
max-width:100%;box-sizing:border-box;
appearance:none;cursor:pointer;border-radius:9999px;
border:1px solid var(--vibeui-toggle-015-border);
background:var(--vibeui-toggle-015-bg);color:var(--vibeui-toggle-015-muted);
font-family:var(--vibeui-toggle-015-font);font-size:0.875rem;font-weight:600;
transition:border-color .3s ease,background-color .3s ease,color .3s ease;
}
[data-vibeui-block="toggle-015"] *{box-sizing:border-box}
[data-vibeui-block="toggle-015"]:hover{border-color:color-mix(in oklab,var(--vibeui-toggle-015-accent) 45%,var(--vibeui-toggle-015-border))}
[data-vibeui-block="toggle-015"]:focus-visible{outline:2px solid var(--vibeui-toggle-015-accent);outline-offset:2px}
[data-vibeui-block="toggle-015"][aria-pressed="true"]{
background:var(--vibeui-toggle-015-card);
border-color:color-mix(in oklab,var(--vibeui-toggle-015-accent) 55%,var(--vibeui-toggle-015-border));
color:var(--vibeui-toggle-015-accent-text);
}
[data-vibeui-block="toggle-015"] svg{
width:1.375rem;height:1.375rem;flex:none;
fill:transparent;stroke:currentColor;
transition:fill .3s ease,stroke .3s ease;
}
/* Заливка и падение — один и тот же момент: ленточка приходит на место уже
   закрашенной, поэтому нажатие читается как результат, а не как заготовка. */
[data-vibeui-block="toggle-015"][aria-pressed="true"] svg{
fill:var(--vibeui-toggle-015-accent);stroke:var(--vibeui-toggle-015-accent);
animation:vibeui-toggle-015-drop .55s cubic-bezier(.22,1.2,.36,1);
animation:vibeui-toggle-015-drop .55s var(--vibeui-toggle-015-ease);
}
[data-vibeui-block="toggle-015"] [data-part="label"]{
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
@keyframes vibeui-toggle-015-drop{
0%{transform:translateY(-0.5625rem) scale(0.9)}
55%{transform:translateY(0.1875rem) scale(1.14)}
100%{transform:translateY(0) scale(1)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-015"] *,[data-vibeui-block="toggle-015"]{animation:none!important;transition:none!important}}
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
 * Кнопка-закладка: ленточка заливается акцентом и падает на место пружиной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle015({
  label = "Сохранить",
  pressedLabel = "Сохранено",
  defaultPressed = false,
  onPressedChange,
  accent,
  background = "",
  className,
  style,
  onClick,
  ...props
}: Toggle015Props) {
  const [pressed, setPressed] = useState(defaultPressed)

  const palette = {
    ...(accent
      ? {
          "--vibeui-toggle-015-accent": accent,
          "--vibeui-toggle-015-accent-text": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-toggle-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !pressed

    setPressed(next)
    onPressedChange?.(next)
    onClick?.(event)
  }

  return (
    <>
      <style href="vibeui-toggle-015" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type="button"
        data-slot="toggle"
        data-vibeui-block="toggle-015"
        aria-pressed={pressed}
        className={className}
        style={palette}
        onClick={toggle}
      >
        <svg
          viewBox="0 0 24 24"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" />
        </svg>
        <span data-part="label">{pressed ? pressedLabel : label}</span>
      </button>
    </>
  )
}
