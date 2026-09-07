"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button072Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Текст подтверждения внутри всплывашки. */
  message?: string
  /** Подпись крестика: у него нет видимого текста. */
  closeLabel?: string
  /** Сколько миллисекунд всплывашка держится, если её не закрыли. */
  duration?: number
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: подтверждение живёт внутри самой кнопки, а не в глобальном
// тостере приложения. Ставить компонент можно куда угодно — ни портала, ни
// провайдера, ни менеджера очереди он не требует.
//
// Всплывашка выезжает снизу с перелётом: она проскакивает точку покоя и
// возвращается, поэтому взгляд ловит её даже боковым зрением. Уезжает она без
// перелёта — уходящее сообщение не должно требовать внимания второй раз.
//
// Разметка всплывашки не размонтируется: переход считается от предыдущего
// состояния, а у только что вставленного узла его нет. Закрытая она помечена
// aria-hidden, а её крестик выключен — иначе он остался бы в обходе Tab.
const STYLES = `
:where([data-vibeui-block="button-072"]){
--vibeui-button-072-bg:transparent;
--vibeui-button-072-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-072-muted:color-mix(in oklab,var(--vibeui-button-072-fg) 62%,transparent);
--vibeui-button-072-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-072-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-button-072-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-072-ring:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-072-on-accent:oklch(0.15 0.02 39.8);
--vibeui-button-072-radius:9999px;
--vibeui-button-072-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-072"]{color-scheme:dark}
[data-vibeui-block="button-072"]{
position:relative;box-sizing:border-box;
display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.75rem;
max-width:22rem;padding:0.5rem;border-radius:1.25rem;
background:var(--vibeui-button-072-bg);color:var(--vibeui-button-072-fg);
font-family:var(--vibeui-button-072-font);
}
[data-vibeui-block="button-072"] *{box-sizing:border-box}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="button-072"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.5rem 1.25rem;
border-radius:var(--vibeui-button-072-radius);
background:var(--vibeui-button-072-accent);color:var(--vibeui-button-072-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;letter-spacing:-0.01em;
transition:filter .16s ease;
}
[data-vibeui-block="button-072"] [data-part="action"]:hover{filter:brightness(0.94)}
[data-vibeui-block="button-072"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-072-ring);outline-offset:2px;
}
/* Всплывашка стоит в потоке под кнопкой и лишь прячется: место под неё
   зарезервировано, ничего вокруг не прыгает. Перелёт: она проскакивает
   точку покоя и возвращается. Первая строка остаётся браузерам без linear(). */
[data-vibeui-block="button-072"] [data-part="toast"]{
position:relative;
display:inline-flex;align-items:center;gap:0.5rem;
max-width:100%;visibility:hidden;
padding:0.4375rem 0.4375rem 0.4375rem 0.875rem;
border:1px solid var(--vibeui-button-072-border);
border-radius:var(--vibeui-button-072-radius);
background:var(--vibeui-button-072-card);color:var(--vibeui-button-072-fg);
font-size:0.8125rem;line-height:1.2;
box-shadow:0 16px 32px -20px oklch(0 0 0 / 55%);
opacity:0;translate:0 60%;scale:0.9;
transition:translate .55s cubic-bezier(.22,1.2,.36,1),scale .55s cubic-bezier(.22,1.2,.36,1),opacity .3s ease,visibility 0s linear .3s;
transition:translate .55s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),scale .55s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),opacity .3s ease,visibility 0s linear .3s;
}
/* Уход — без перелёта и вдвое быстрее: закрытое сообщение не должно ещё раз
   ловить взгляд. */
[data-vibeui-block="button-072"][data-open="false"] [data-part="toast"]{
transition:translate .28s ease-in,scale .28s ease-in,opacity .2s ease,visibility 0s linear .28s;
}
[data-vibeui-block="button-072"][data-open="true"] [data-part="toast"]{
opacity:1;translate:0 0;scale:1;visibility:visible;
transition-delay:0s;
}
[data-vibeui-block="button-072"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;flex:none;border-radius:50%;
background:var(--vibeui-button-072-accent);
}
[data-vibeui-block="button-072"] [data-part="message"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="button-072"] [data-part="close"]{
appearance:none;border:0;background:transparent;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:50%;
color:var(--vibeui-button-072-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-072"] [data-part="close"] svg{width:0.75rem;height:0.75rem;display:block}
[data-vibeui-block="button-072"] [data-part="close"]:hover{
background:color-mix(in oklab,var(--vibeui-button-072-fg) 10%,transparent);
color:var(--vibeui-button-072-fg);
}
[data-vibeui-block="button-072"] [data-part="close"]:focus-visible{
outline:2px solid var(--vibeui-button-072-ring);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-072"] *{animation:none!important;transition:none!important}}
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
 * Кнопка со своим подтверждением: всплывашка выезжает снизу с перелётом и
 * уходит сама. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button072({
  label = "Сохранить",
  message = "Изменения сохранены",
  closeLabel = "Закрыть уведомление",
  duration = 2200,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button072Props) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    [],
  )

  const stopTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const show = () => {
    stopTimer()
    setOpen(true)
    timer.current = setTimeout(() => setOpen(false), duration)
  }

  const hide = () => {
    stopTimer()
    setOpen(false)
  }

  const palette = {
    ...(accent ? { "--vibeui-button-072-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-072-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-072" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-072"
        data-open={open}
        className={className}
        style={palette}
      >
        <button type="button" data-part="action" onClick={show}>
          {label}
        </button>
        <div data-part="toast" role="status" aria-hidden={!open}>
          <span data-part="dot" aria-hidden="true" />
          <span data-part="message">{message}</span>
          <button
            type="button"
            data-part="close"
            aria-label={closeLabel}
            disabled={!open}
            onClick={hide}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="m2 2 8 8M10 2l-8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
