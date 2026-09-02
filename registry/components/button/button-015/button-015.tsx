"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button015Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "value"
> & {
  value?: string
  label?: string
  doneLabel?: string
  /** Сколько держать состояние «скопировано», мс. */
  hold?: number
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кнопка копирования, которая честно отчитывается. Успех
// показан сменой подписи и галочкой, а не всплывающим сообщением: оно
// появляется в другом углу экрана, и глаз его не находит. Состояние живёт
// пару секунд и само возвращается — иначе непонятно, копировалось ли снова.
const STYLES = `
:where([data-vibeui-block="button-015"]){
--vibeui-button-015-fg:light-dark(oklch(0.3 0.014 265),oklch(0.94 0.006 265));
--vibeui-button-015-bg:transparent;
--vibeui-button-015-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-button-015-hover:light-dark(oklch(0.96 0.004 265),oklch(0.32 0.012 265));
--vibeui-button-015-done:light-dark(oklch(0.55 0.15 152),oklch(0.76 0.14 152));
--vibeui-button-015-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-button-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-015"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-015-border);border-radius:0.625rem;
background:var(--vibeui-button-015-bg);color:var(--vibeui-button-015-fg);
font-family:var(--vibeui-button-015-font);font-size:0.8125rem;font-weight:600;line-height:1;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-015"]:hover{background:var(--vibeui-button-015-hover)}
[data-vibeui-block="button-015"]:focus-visible{outline:2px solid var(--vibeui-button-015-accent);outline-offset:2px}
[data-vibeui-block="button-015"][data-done="true"]{color:var(--vibeui-button-015-done);border-color:color-mix(in oklab,var(--vibeui-button-015-done) 50%,transparent)}
/* Два листа бумаги: один со сдвигом — знак копирования без пакета иконок. */
[data-vibeui-block="button-015"] [data-part="copy"]{position:relative;flex:none;width:0.875rem;height:0.875rem}
[data-vibeui-block="button-015"] [data-part="copy"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.625rem;height:0.625rem;
border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-015"] [data-part="copy"]::after{
content:"";position:absolute;right:0;top:0;width:0.625rem;height:0.625rem;
border:1.5px solid currentColor;border-radius:0.1875rem;
background:var(--vibeui-button-015-bg);
}
[data-vibeui-block="button-015"] [data-part="tick"]{
flex:none;width:0.3125rem;height:0.5625rem;margin:0 0.125rem 0.125rem 0.125rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-015"] *{animation:none!important;transition:none!important}}
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
 * Кнопка копирования с честным отчётом прямо в подписи.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button015({
  value = "npx shadcn@latest add https://vibeui.ru/r/button-015.json",
  label = "Скопировать",
  doneLabel = "Скопировано",
  hold = 2000,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button015Props) {
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const palette = {
    ...(background
      ? {
          "--vibeui-button-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Буфер недоступен (нет доступа или небезопасный контекст) — молча
      // выходим: ложное «скопировано» хуже отсутствия отклика.
      return
    }
    setDone(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), hold)
  }

  return (
    <>
      <style href="vibeui-button-015" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-015"
        data-done={done}
        className={className}
        style={palette}
        onClick={copy}
      >
        {done ? (
          <span data-part="tick" aria-hidden="true" />
        ) : (
          <span data-part="copy" aria-hidden="true" />
        )}
        <span aria-live="polite">{done ? doneLabel : label}</span>
      </button>
    </>
  )
}
