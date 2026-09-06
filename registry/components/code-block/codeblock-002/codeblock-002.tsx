"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Codeblock002Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  code?: string
  label?: string
  doneLabel?: string
  resetDelay?: number
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кнопка копирования, которая честно показывает, сколько
// ещё продержится подпись «Скопировано». Под подписью бежит полоса отката —
// пользователь видит, что состояние временное, и не жмёт кнопку повторно.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, рамка и чип кнопки держатся полупрозрачными накладками.
const STYLES = `
:where([data-vibeui-block="codeblock-002"]){
--vibeui-codeblock-002-bg:transparent;
--vibeui-codeblock-002-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-codeblock-002-muted:color-mix(in oklab,var(--vibeui-codeblock-002-fg) 68%,transparent);
--vibeui-codeblock-002-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-002-chip:light-dark(oklch(0 0 0 / 7%),oklch(1 0 0 / 9%));
--vibeui-codeblock-002-chip-hover:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 16%));
--vibeui-codeblock-002-ok:light-dark(oklch(0.52 0.14 152),oklch(0.82 0.14 152));
--vibeui-codeblock-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-002"]{color-scheme:dark}
[data-vibeui-block="codeblock-002"]{
position:relative;display:block;
width:100%;box-sizing:border-box;margin:0;
border:1px solid var(--vibeui-codeblock-002-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-002-bg);color:var(--vibeui-codeblock-002-fg);
font-family:var(--vibeui-codeblock-002-font);
}
[data-vibeui-block="codeblock-002"] figcaption{
padding:0.625rem 0.875rem 0;
font-size:0.75rem;color:var(--vibeui-codeblock-002-muted);
}
[data-vibeui-block="codeblock-002"] pre{
margin:0;padding:0.5rem 0.875rem 0.875rem;overflow-x:auto;
}
[data-vibeui-block="codeblock-002"] code{
display:block;
font-family:var(--vibeui-codeblock-002-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-002"] [data-part="copy"]{
position:absolute;top:0.5rem;right:0.5rem;
appearance:none;border:0;cursor:pointer;overflow:hidden;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:1.875rem;padding:0.25rem 0.6875rem;border-radius:0.5rem;
background:var(--vibeui-codeblock-002-chip);color:var(--vibeui-codeblock-002-fg);
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-002"] [data-part="copy"]:hover{background:var(--vibeui-codeblock-002-chip-hover)}
[data-vibeui-block="codeblock-002"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-codeblock-002-ok);outline-offset:2px}
[data-vibeui-block="codeblock-002"] [data-part="copy"][data-done="true"]{color:var(--vibeui-codeblock-002-ok)}
/* Полоса отката: видно, что подпись сменится сама, а не залипла. */
[data-vibeui-block="codeblock-002"] [data-part="timer"]{
position:absolute;left:0;bottom:0;width:100%;height:2px;
transform-origin:left center;transform:scaleX(0);
background:var(--vibeui-codeblock-002-ok);
}
[data-vibeui-block="codeblock-002"] [data-part="copy"][data-done="true"] [data-part="timer"]{
animation:vibeui-codeblock-002-drain var(--vibeui-codeblock-002-delay,2000ms) linear forwards;
}
[data-vibeui-block="codeblock-002"] [data-part="tick"]{width:0.75rem;height:0.75rem;flex:none}
@keyframes vibeui-codeblock-002-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-002"] *{animation:none!important;transition:none!important}}
`

const CODE = `import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button size="lg">Продолжить</Button>
}`

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

/** Блок кода с кнопкой копирования и видимым откатом подписи. */
export function Codeblock002({
  title = "app/page.tsx",
  code = CODE,
  label = "Копировать",
  doneLabel = "Скопировано",
  resetDelay = 2000,
  background = "",
  className,
  style,
  ...props
}: Codeblock002Props) {
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
      // Буфер недоступен: молчим, ложное «скопировано» хуже отсутствия ответа.
      return
    }
    setDone(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), resetDelay)
  }

  const palette = {
    "--vibeui-codeblock-002-delay": `${resetDelay}ms`,
    ...(background
      ? {
          "--vibeui-codeblock-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-002" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-002"
        className={className}
        style={palette}
      >
        <figcaption>{title}</figcaption>
        <button
          type="button"
          data-part="copy"
          data-done={done}
          onClick={copy}
          aria-label={done ? doneLabel : `${label}: ${title}`}
        >
          {done ? (
            <svg data-part="tick" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2 6.5 4.6 9 10 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
          <span aria-live="polite">{done ? doneLabel : label}</span>
          <span data-part="timer" aria-hidden="true" />
        </button>
        <pre>
          <code>{code}</code>
        </pre>
      </figure>
    </>
  )
}
