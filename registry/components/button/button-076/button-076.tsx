"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button076Props = Omit<ComponentProps<"div">, "children"> & {
  /** Подпись кнопки. */
  label?: string
  /** Обработчик нажатия: желе срабатывает независимо от него. */
  onPress?: () => void
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: кнопка ведёт себя как желе — при удержании сплющивается,
// а после отпускания качается по осям, пока не успокоится. Держится это на
// сохранении объёма: одна ось растёт ровно тогда, когда другая сжимается.
// Перезапуск сделан двумя одинаковыми наборами кадров, которые чередуются:
// смена имени анимации гарантированно начинает её заново, а элемент при
// этом не перемонтируется и не теряет фокус.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="button-076"]){
--vibeui-button-076-bg:transparent;
--vibeui-button-076-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-076-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-076-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-button-076-accent-text:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-076-on-accent:oklch(0.15 0 0);
--vibeui-button-076-radius:1.375rem;
--vibeui-button-076-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-076"]{color-scheme:dark}
[data-vibeui-block="button-076"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-button-076-bg);color:var(--vibeui-button-076-fg);
font-family:var(--vibeui-button-076-font);
}
[data-vibeui-block="button-076"] *{box-sizing:border-box}
/* Подпись настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="button-076"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:3rem;padding:0.75rem 1.75rem;border-radius:var(--vibeui-button-076-radius);
background:var(--vibeui-button-076-accent);color:oklch(from var(--vibeui-button-076-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:1rem;font-weight:750;letter-spacing:0.02em;line-height:1;
}
[data-vibeui-block="button-076"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-076-accent-text);outline-offset:3px;
}
/* Удержание сплющивает сразу, без ожидания кадров: качание начинается уже
   из сжатого состояния, как у настоящего мягкого тела. */
[data-vibeui-block="button-076"] [data-part="action"]:active{transform:scale(0.94,1.06)}
[data-vibeui-block="button-076"] [data-part="action"][data-wobble="a"]{
animation:vibeui-button-076-wobble-a .8s cubic-bezier(.22,1.2,.36,1);
animation:vibeui-button-076-wobble-a .8s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="button-076"] [data-part="action"][data-wobble="b"]{
animation:vibeui-button-076-wobble-b .8s cubic-bezier(.22,1.2,.36,1);
animation:vibeui-button-076-wobble-b .8s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
/* Два одинаковых набора кадров нужны только ради перезапуска: одно и то же
   имя анимации браузер не начинает заново, пока элемент тот же. */
@keyframes vibeui-button-076-wobble-a{
0%{transform:scale(1,1)}
25%{transform:scale(1.14,0.86) translateY(0.125rem)}
45%{transform:scale(0.9,1.1) translateY(-0.1875rem)}
65%{transform:scale(1.05,0.95)}
82%{transform:scale(0.98,1.02)}
100%{transform:scale(1,1)}
}
@keyframes vibeui-button-076-wobble-b{
0%{transform:scale(1,1)}
25%{transform:scale(1.14,0.86) translateY(0.125rem)}
45%{transform:scale(0.9,1.1) translateY(-0.1875rem)}
65%{transform:scale(1.05,0.95)}
82%{transform:scale(0.98,1.02)}
100%{transform:scale(1,1)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-076"] *{animation:none!important;transition:none!important}}
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
 * Кнопка-желе: нажатие сплющивает её и отпускает пружинить по осям.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button076({
  label = "Нажми меня",
  onPress,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button076Props) {
  const [phase, setPhase] = useState<"" | "a" | "b">("")

  const palette = {
    ...(accent ? { "--vibeui-button-076-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-076-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-076" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-076"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="action"
          data-wobble={phase || undefined}
          onClick={() => {
            setPhase((previous) => (previous === "a" ? "b" : "a"))
            onPress?.()
          }}
        >
          {label}
        </button>
      </div>
    </>
  )
}
