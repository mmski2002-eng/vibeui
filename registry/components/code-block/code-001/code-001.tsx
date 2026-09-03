"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Code001Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  code?: string
  language?: string
  /** Подпись кнопки до копирования. */
  copyText?: string
  /** Подпись кнопки после копирования. */
  copiedText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  onCopy?: () => void
}

// Идея компонента: блок кода с копированием и переносом длинных строк.
// Команда установки не должна требовать горизонтальной прокрутки: её читают
// целиком, поэтому строки переносятся с отступом продолжения. Подсветку
// синтаксиса компонент не делает — она стоит библиотеки, а команде не нужна.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, кнопка держится на полупрозрачном слое поверх страницы.
const STYLES = `
:where([data-vibeui-block="code-001"]){
--vibeui-code-001-bg:transparent;
--vibeui-code-001-fg:light-dark(oklch(0.28 0.016 265),oklch(0.94 0.006 265));
--vibeui-code-001-muted:color-mix(in oklab,var(--vibeui-code-001-fg) 68%,transparent);
--vibeui-code-001-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-code-001-key:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 10%));
--vibeui-code-001-key-hover:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-code-001-done:light-dark(oklch(0.48 0.14 152),oklch(0.8 0.14 152));
--vibeui-code-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-code-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="code-001"]{color-scheme:dark}
[data-vibeui-block="code-001"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-code-001-border);border-radius:0.875rem;
background:var(--vibeui-code-001-bg);color:var(--vibeui-code-001-fg);
font-family:var(--vibeui-code-001-font);
}
[data-vibeui-block="code-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
border-bottom:1px solid var(--vibeui-code-001-border);
font-size:0.75rem;color:var(--vibeui-code-001-muted);
}
[data-vibeui-block="code-001"] button{
appearance:none;border:0;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:0.4375rem;
background:var(--vibeui-code-001-key);color:var(--vibeui-code-001-fg);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="code-001"] button:hover{background:var(--vibeui-code-001-key-hover)}
[data-vibeui-block="code-001"] button:focus-visible{outline:2px solid var(--vibeui-code-001-done);outline-offset:2px}
[data-vibeui-block="code-001"] button[data-done="true"]{color:var(--vibeui-code-001-done)}
/* Перенос с отступом продолжения: команду читают целиком, а не прокручивают. */
[data-vibeui-block="code-001"] pre{
margin:0;padding:0.875rem;
font-family:var(--vibeui-code-001-mono);font-size:0.8125rem;line-height:1.55;
white-space:pre-wrap;overflow-wrap:anywhere;
text-indent:-1.25rem;padding-left:2.125rem;
}
[data-vibeui-block="code-001"] code{font:inherit}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="code-001"] *{animation:none!important;transition:none!important}}
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
 * Блок кода с копированием: длинные команды переносятся, а не прокручиваются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Code001({
  title = "Установка",
  code = "npx shadcn@latest add https://vibeui.ru/r/button-001.json",
  language = "bash",
  copyText = "Копировать",
  copiedText = "Скопировано",
  background = "",
  onCopy,
  className,
  style,
  ...props
}: Code001Props) {
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Буфер недоступен: молча выходим, ложное «скопировано» хуже молчания.
      return
    }
    setDone(true)
    onCopy?.()
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 2000)
  }

  const palette = {
    ...(background
      ? {
          "--vibeui-code-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-code-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="code-001"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span>
            {title} · {language}
          </span>
          <button type="button" data-done={done} onClick={copy}>
            <span aria-live="polite">{done ? copiedText : copyText}</span>
          </button>
        </figcaption>
        <pre>
          <code>{code}</code>
        </pre>
      </figure>
    </>
  )
}
