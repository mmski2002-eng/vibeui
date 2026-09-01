"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Code001Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  code?: string
  language?: string
  onCopy?: () => void
}

// Идея компонента: блок кода с копированием и переносом длинных строк.
// Команда установки не должна требовать горизонтальной прокрутки: её читают
// целиком, поэтому строки переносятся с отступом продолжения. Подсветку
// синтаксиса компонент не делает — она стоит библиотеки, а команде не нужна.
const STYLES = `
:where([data-vibeui-block="code-001"]){
--vibeui-code-001-bg:oklch(0.22 0.02 265);
--vibeui-code-001-fg:oklch(0.94 0.006 265);
--vibeui-code-001-muted:oklch(0.72 0.014 265);
--vibeui-code-001-border:oklch(1 0 0 / 12%);
--vibeui-code-001-done:oklch(0.8 0.14 152);
--vibeui-code-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-code-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="code-001"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;margin:0;overflow:hidden;
border-radius:0.875rem;
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
background:oklch(1 0 0 / 10%);color:var(--vibeui-code-001-fg);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="code-001"] button:hover{background:oklch(1 0 0 / 16%)}
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
 * Блок кода с копированием: длинные команды переносятся, а не прокручиваются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Code001({
  title = "Установка",
  code = "npx shadcn@latest add https://vibeui.ru/r/button-001.json",
  language = "bash",
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

  return (
    <>
      <style href="vibeui-code-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="code-001"
        className={className}
        style={style as CSSProperties}
      >
        <figcaption data-part="head">
          <span>
            {title} · {language}
          </span>
          <button type="button" data-done={done} onClick={copy}>
            <span aria-live="polite">
              {done ? "Скопировано" : "Копировать"}
            </span>
          </button>
        </figcaption>
        <pre>
          <code>{code}</code>
        </pre>
      </figure>
    </>
  )
}
