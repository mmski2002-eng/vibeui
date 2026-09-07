"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button074Props = Omit<ComponentProps<"div">, "children"> & {
  /** Строка, которая уходит в буфер обмена. Она же показана рядом. */
  value?: string
  label?: string
  /** Подпись после удачного копирования. */
  copiedLabel?: string
  /** Подпись, когда буфер обмена недоступен. */
  errorLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: кнопка копирования отвечает за результат, а не только за
// нажатие. Иконка листов сменяется галочкой с пружинным доскоком, подпись
// меняется вместе с ней, и через полторы секунды всё возвращается — второй
// раз копировать можно, не дожидаясь ничего.
//
// Отказ буфера обмена показан честно: writeText падает без защищённого
// соединения и без жеста пользователя, и молча притворяться, что скопировано,
// значит терять текст, который человек считал сохранённым.
//
// Обе иконки лежат в одном квадрате друг на друге и меняются прозрачностью:
// подмена одной иконки другой сдвигала бы подпись на кадр.
const STYLES = `
:where([data-vibeui-block="button-074"]){
--vibeui-button-074-bg:transparent;
--vibeui-button-074-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-074-muted:color-mix(in oklab,var(--vibeui-button-074-fg) 62%,transparent);
--vibeui-button-074-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-074-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-button-074-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-074-ring:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-074-radius:0.75rem;
--vibeui-button-074-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-074-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-074"]{color-scheme:dark}
[data-vibeui-block="button-074"]{
position:relative;box-sizing:border-box;display:flex;align-items:center;gap:0.5rem;
width:100%;max-width:22rem;padding:0.4375rem 0.4375rem 0.4375rem 0.875rem;
border:1px solid var(--vibeui-button-074-border);
border-radius:var(--vibeui-button-074-radius);
background:var(--vibeui-button-074-bg);color:var(--vibeui-button-074-fg);
font-family:var(--vibeui-button-074-font);
}
[data-vibeui-block="button-074"] *{box-sizing:border-box}
/* Значение занимает всю свободную ширину и обрезается многоточием: в узкой
   карточке длинный токен иначе вытолкнул бы кнопку за край. */
[data-vibeui-block="button-074"] [data-part="value"]{
flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-button-074-mono);font-size:0.8125rem;
color:var(--vibeui-button-074-muted);
}
[data-vibeui-block="button-074"] [data-part="action"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.4375rem;
min-height:2.125rem;padding:0.375rem 0.75rem;
border:1px solid var(--vibeui-button-074-border);
border-radius:calc(var(--vibeui-button-074-radius) - 0.25rem);
background:var(--vibeui-button-074-card);color:var(--vibeui-button-074-fg);
font:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
transition:border-color .2s ease,color .2s ease;
}
[data-vibeui-block="button-074"] [data-part="action"]:hover{
border-color:color-mix(in oklab,var(--vibeui-button-074-fg) 28%,transparent);
}
[data-vibeui-block="button-074"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-074-ring);outline-offset:2px;
}
[data-vibeui-block="button-074"] [data-part="action"][data-state="copied"]{
color:var(--vibeui-button-074-ring);
border-color:color-mix(in oklab,var(--vibeui-button-074-accent) 55%,transparent);
}
[data-vibeui-block="button-074"] [data-part="icon"]{
position:relative;flex:none;width:1rem;height:1rem;
}
/* Морф иконки: прозрачность гасится быстро, масштаб доезжает пружиной с
   лёгким перелётом. Первая строка остаётся браузерам без linear(). */
[data-vibeui-block="button-074"] [data-part="icon"] svg{
position:absolute;inset:0;width:100%;height:100%;display:block;
fill:none;stroke:currentColor;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;
transition:opacity .2s ease,scale .3s cubic-bezier(.22,1.2,.36,1);
transition:opacity .2s ease,scale .3s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="button-074"] [data-part="glyph-done"]{opacity:0;scale:0.5}
[data-vibeui-block="button-074"] [data-part="action"][data-state="idle"] [data-part="glyph-idle"]{opacity:1;scale:1}
[data-vibeui-block="button-074"] [data-part="action"][data-state="copied"] [data-part="glyph-idle"]{opacity:0;scale:0.5}
[data-vibeui-block="button-074"] [data-part="action"][data-state="copied"] [data-part="glyph-done"]{opacity:1;scale:1}
[data-vibeui-block="button-074"] [data-part="action"][data-state="error"]{
color:var(--vibeui-button-074-muted);
}
/* Живая область для скринридера: смена подписи внутри кнопки сама по себе
   не объявляется, пока фокус не ушёл и не вернулся. */
[data-vibeui-block="button-074"] [data-part="status"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-074"] *{animation:none!important;transition:none!important}}
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
 * Кнопка копирования: иконка листов перетекает в галочку с пружиной и через
 * полторы секунды возвращается. Один файл, ноль зависимостей, своя палитра.
 */
export function Button074({
  value = "npx shadcn@latest add button-074",
  label = "Копировать",
  copiedLabel = "Скопировано",
  errorLabel = "Не удалось",
  accent,
  background = "",
  className,
  style,
  ...props
}: Button074Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    [],
  )

  const copy = async () => {
    let next: "copied" | "error" = "copied"

    try {
      await navigator.clipboard.writeText(value)
    } catch {
      next = "error"
    }

    setState(next)

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => setState("idle"), 1500)
  }

  const currentLabel =
    state === "copied" ? copiedLabel : state === "error" ? errorLabel : label

  const palette = {
    ...(accent ? { "--vibeui-button-074-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-074-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-074" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-074"
        className={className}
        style={palette}
      >
        <code data-part="value">{value}</code>
        <button
          type="button"
          data-part="action"
          data-state={state}
          onClick={() => void copy()}
        >
          <span data-part="icon" aria-hidden="true">
            <svg data-part="glyph-idle" viewBox="0 0 16 16">
              <rect x="6" y="6" width="8" height="8" rx="1.6" />
              <path d="M3.4 10.4V3.6a1.6 1.6 0 0 1 1.6-1.6h6.8" />
            </svg>
            <svg data-part="glyph-done" viewBox="0 0 16 16">
              <path d="m3 8.5 3.5 3.5L13 5" />
            </svg>
          </span>
          {currentLabel}
        </button>
        <span data-part="status" role="status">
          {state === "idle" ? "" : currentLabel}
        </span>
      </div>
    </>
  )
}
