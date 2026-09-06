"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Codeblock013Props = {
  title?: string
  lines?: string[]
  showNumbers?: boolean
  /** Подпись кнопки копирования, {n} — номер строки. */
  copyLabel?: string
  /** Подпись кнопки после копирования, {n} — номер строки. */
  copiedLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: копировать не весь блок, а одну строку. У каждой строки
// своя кнопка: она проявляется при наведении и при фокусе с клавиатуры,
// поэтому копирование доступно и без мыши, а не только по hover.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, он ложится на фон страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="codeblock-013"]){
--vibeui-codeblock-013-bg:transparent;
--vibeui-codeblock-013-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-013-fg:light-dark(oklch(0.26 0 265),oklch(0.93 0 265));
--vibeui-codeblock-013-muted:color-mix(in oklab,var(--vibeui-codeblock-013-fg) 68%,transparent);
--vibeui-codeblock-013-gutter:light-dark(oklch(0.63 0 265),oklch(0.55 0 265));
--vibeui-codeblock-013-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-codeblock-013-row:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 6%));
--vibeui-codeblock-013-mark:light-dark(oklch(0.72 0.14 152 / 24%),oklch(0.6 0.14 152 / 18%));
--vibeui-codeblock-013-key:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 10%));
--vibeui-codeblock-013-ok:light-dark(oklch(0.48 0.15 152),oklch(0.84 0.14 152));
--vibeui-codeblock-013-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-013"]{color-scheme:dark}
[data-vibeui-block="codeblock-013"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-013-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-013-bg);color:var(--vibeui-codeblock-013-fg);
font-family:var(--vibeui-codeblock-013-font);
}
[data-vibeui-block="codeblock-013"] figcaption{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-013-head);
border-bottom:1px solid var(--vibeui-codeblock-013-border);
font-family:var(--vibeui-codeblock-013-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-013-muted);
}
[data-vibeui-block="codeblock-013"] ol{
margin:0;padding:0.375rem 0;list-style:none;
counter-reset:line;
}
[data-vibeui-block="codeblock-013"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.375rem 0 0.875rem;min-height:1.625rem;
transition:background-color .16s ease;
}
[data-vibeui-block="codeblock-013"] li[data-numbered="true"]::before{
counter-increment:line;content:counter(line);
flex:none;width:1.5rem;text-align:right;
font-family:var(--vibeui-codeblock-013-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-013-gutter);font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-013"] li:hover{background:var(--vibeui-codeblock-013-row)}
[data-vibeui-block="codeblock-013"] li[data-copied="true"]{background:var(--vibeui-codeblock-013-mark)}
/* Строка режется многоточием, а не прокручивается: своя полоса прокрутки на
   каждой строке превращает блок в лестницу, а кнопка копирования уезжает за
   край. Целиком строка всё равно уходит в буфер. */
[data-vibeui-block="codeblock-013"] code{
flex:1 1 auto;min-width:0;
font-family:var(--vibeui-codeblock-013-mono);
font-size:0.8125rem;line-height:1.6;
white-space:pre;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="codeblock-013"] button{
appearance:none;border:0;cursor:pointer;flex:none;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-codeblock-013-key);color:var(--vibeui-codeblock-013-muted);
opacity:0;transition:opacity .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-013"] li:hover button,
[data-vibeui-block="codeblock-013"] button:focus-visible,
[data-vibeui-block="codeblock-013"] button[data-copied="true"]{opacity:1}
[data-vibeui-block="codeblock-013"] button:hover{color:var(--vibeui-codeblock-013-fg)}
/* Без мыши наведения не бывает: на телефоне кнопки видны сразу, иначе
   копирование построчно там просто не существует. */
@media (hover:none){
[data-vibeui-block="codeblock-013"] button{opacity:1}
}
[data-vibeui-block="codeblock-013"] button:focus-visible{outline:2px solid var(--vibeui-codeblock-013-ok);outline-offset:2px}
[data-vibeui-block="codeblock-013"] button[data-copied="true"]{color:var(--vibeui-codeblock-013-ok)}
[data-vibeui-block="codeblock-013"] svg{width:0.875rem;height:0.875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-013"] *{animation:none!important;transition:none!important}}
`

const LINES = [
  "git remote add upstream git@github.com:vibeui/vibeui.git",
  "git fetch upstream --prune",
  "git rebase upstream/main",
  "git push --force-with-lease",
]

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

/** Список строк, каждую можно скопировать отдельной кнопкой. */
export function Codeblock013({
  title = "Обновление форка",
  lines = LINES,
  showNumbers = true,
  copyLabel = "Скопировать строку {n}",
  copiedLabel = "Строка {n} скопирована",
  background = "",
  className,
  style,
  ...props
}: Codeblock013Props) {
  const [copied, setCopied] = useState(-1)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async (line: string, index: number) => {
    try {
      await navigator.clipboard.writeText(line)
    } catch {
      // Буфер недоступен: отметка «скопировано» была бы обманом.
      return
    }
    setCopied(index)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(-1), 1400)
  }

  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-013" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-013"
        className={className}
        style={palette}
      >
        <figcaption>{title}</figcaption>
        <ol>
          {lines.map((line, index) => (
            <li
              key={index}
              data-numbered={showNumbers || undefined}
              data-copied={copied === index || undefined}
            >
              <code>{line}</code>
              <button
                type="button"
                data-copied={copied === index || undefined}
                onClick={() => copy(line, index)}
                aria-label={(copied === index
                  ? copiedLabel
                  : copyLabel
                ).replace("{n}", String(index + 1))}
              >
                {copied === index ? (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path
                      d="M2 6.5 4.6 9 10 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <rect
                      x="4"
                      y="1.5"
                      width="6.5"
                      height="6.5"
                      rx="1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M8 10.5H3a1.5 1.5 0 0 1-1.5-1.5V4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ol>
      </figure>
    </>
  )
}
