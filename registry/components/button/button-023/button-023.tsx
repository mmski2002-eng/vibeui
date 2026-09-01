"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button023Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick" | "value"
> & {
  /** Что копируем. Он же виден в поле. */
  value?: string
  label?: string
  doneLabel?: string
  /** Сколько держится подпись «Скопировано», мс. */
  hold?: number
  accent?: string
}

// Идея компонента: копируется не подпись, а значение, которое видно на месте.
// Ключ лежит в моноширинном поле, кнопкой служит всё поле целиком, длинная
// строка усечена многоточием — но в буфер уходит она полностью. После клика
// поле отчитывается галочкой и само откатывается через hold миллисекунд,
// поэтому подтверждение не нужно закрывать руками.
const STYLES = `
:where([data-vibeui-block="button-023"]){
--vibeui-button-023-bg:oklch(1 0 0);
--vibeui-button-023-fg:oklch(0.26 0.016 265);
--vibeui-button-023-muted:oklch(0.55 0.014 265);
--vibeui-button-023-border:oklch(0.9 0.006 265);
--vibeui-button-023-accent:oklch(0.55 0.17 265);
--vibeui-button-023-done:oklch(0.5 0.14 152);
--vibeui-button-023-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-button-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-023"]{
appearance:none;cursor:pointer;text-align:left;
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;height:2.75rem;padding:0 0.5rem 0 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-023-border);border-radius:0.625rem;
background:var(--vibeui-button-023-bg);color:var(--vibeui-button-023-fg);
font-family:var(--vibeui-button-023-font);font-size:0.875rem;line-height:1;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="button-023"]:hover{border-color:var(--vibeui-button-023-accent)}
[data-vibeui-block="button-023"]:focus-visible{outline:2px solid var(--vibeui-button-023-accent);outline-offset:2px}
[data-vibeui-block="button-023"][data-state="done"]{border-color:var(--vibeui-button-023-done)}
/* Значение всегда одной строкой: перенос ключа читается как две разные строки. */
[data-vibeui-block="button-023"] [data-part="value"]{
flex:1 1 auto;min-width:0;
font-family:var(--vibeui-button-023-mono);font-size:0.8125rem;letter-spacing:-0.01em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="button-023"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-button-023-accent) 10%,transparent);
color:var(--vibeui-button-023-accent);
font-size:0.75rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-023"][data-state="done"] [data-part="action"]{
background:color-mix(in oklab,var(--vibeui-button-023-done) 12%,transparent);
color:var(--vibeui-button-023-done);
}
[data-vibeui-block="button-023"] [data-part="copy"]{
flex:none;width:0.625rem;height:0.6875rem;box-sizing:border-box;position:relative;
border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-023"] [data-part="copy"]::before{
content:"";position:absolute;left:0.1875rem;top:-0.25rem;width:0.625rem;height:0.6875rem;
box-sizing:border-box;border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-023"] [data-part="tick"]{
flex:none;width:0.3125rem;height:0.5rem;margin-bottom:0.125rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-023"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле-кнопка: показывает значение и копирует его целиком по клику.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button023({
  value = "vb_live_7f3c9a21e845b06d4c9f",
  label = "Копировать",
  doneLabel = "Скопировано",
  hold = 2000,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button023Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Буфер закрыт политикой или нет прав — состояние всё равно не врёт.
      return
    }

    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), hold)
  }

  const palette = {
    ...(accent ? { "--vibeui-button-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-023" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-023"
        data-state={copied ? "done" : "idle"}
        className={className}
        style={palette}
        aria-label={`${label}: ${value}`}
        onClick={copy}
      >
        <span data-part="value">{value}</span>
        <span data-part="action">
          {copied ? (
            <span data-part="tick" aria-hidden="true" />
          ) : (
            <span data-part="copy" aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? doneLabel : label}</span>
        </span>
      </button>
    </>
  )
}
