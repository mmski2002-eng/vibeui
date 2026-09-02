"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button054Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  children?: string
  /** Ссылка, которой делятся. Пустая строка — текущий адрес страницы. */
  url?: string
  title?: string
  /** Подпись после запасного пути: ссылка ушла в буфер обмена. */
  copiedLabel?: string
  accent?: string
}

// Идея компонента: два пути в одной кнопке. Если браузер умеет navigator.share
// — открывается системный лист «Поделиться»; если нет, ссылка молча уходит
// в буфер обмена, и кнопка сама об этом отчитывается. Отказ пользователя
// от системного листа (AbortError) не считается ошибкой и не даёт отчёта.
const STYLES = `
:where([data-vibeui-block="button-054"]){
--vibeui-button-054-accent:light-dark(oklch(0.52 0.16 235),oklch(0.62 0.15 235));
--vibeui-button-054-done:light-dark(oklch(0.5 0.13 155),oklch(0.6 0.13 155));
--vibeui-button-054-fg:light-dark(oklch(0.99 0.01 235),oklch(0.17 0.02 250));
--vibeui-button-054-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-054"]{
position:relative;appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:9.5rem;height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-button-054-accent);color:var(--vibeui-button-054-fg);
font-family:var(--vibeui-button-054-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .2s ease,filter .16s ease;
}
[data-vibeui-block="button-054"][data-copied="true"]{background:var(--vibeui-button-054-done)}
[data-vibeui-block="button-054"]:hover:not(:disabled){filter:brightness(1.07)}
[data-vibeui-block="button-054"]:focus-visible{outline:2px solid var(--vibeui-button-054-accent);outline-offset:3px}
[data-vibeui-block="button-054"]:disabled{cursor:not-allowed;opacity:.55}
/* Знак «поделиться»: три узла и две связи между ними. */
[data-vibeui-block="button-054"] [data-part="share"]{position:relative;flex:none;width:1rem;height:1rem}
[data-vibeui-block="button-054"] [data-part="share"] i{
position:absolute;width:0.375rem;height:0.375rem;border-radius:50%;
background:currentColor;
}
[data-vibeui-block="button-054"] [data-part="share"] i:nth-child(1){right:0;top:0}
[data-vibeui-block="button-054"] [data-part="share"] i:nth-child(2){left:0;top:50%;margin-top:-0.1875rem}
[data-vibeui-block="button-054"] [data-part="share"] i:nth-child(3){right:0;bottom:0}
[data-vibeui-block="button-054"] [data-part="share"]::before,
[data-vibeui-block="button-054"] [data-part="share"]::after{
content:"";position:absolute;left:0.25rem;top:50%;width:0.6875rem;height:1.25px;
background:currentColor;transform-origin:left center;
}
[data-vibeui-block="button-054"] [data-part="share"]::before{transform:rotate(-32deg)}
[data-vibeui-block="button-054"] [data-part="share"]::after{transform:rotate(32deg)}
[data-vibeui-block="button-054"] [data-part="check"]{position:relative;flex:none;width:1rem;height:1rem}
[data-vibeui-block="button-054"] [data-part="check"]::after{
content:"";position:absolute;left:0.1875rem;top:0.0625rem;width:0.375rem;height:0.6875rem;
box-sizing:border-box;border:2px solid currentColor;border-top:0;border-left:0;
transform:rotate(42deg);
}
[data-vibeui-block="button-054"] [data-part="live"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-054"]{transition:none!important}}
`

/**
 * Кнопка «поделиться» с нативным листом и копированием ссылки как запасным путём.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button054({
  children = "Поделиться",
  url = "",
  title = "VibeUI",
  copiedLabel = "Ссылка скопирована",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button054Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timer = window.setTimeout(() => setCopied(false), 2200)

    return () => window.clearTimeout(timer)
  }, [copied])

  const palette = {
    ...(accent ? { "--vibeui-button-054-accent": accent } : null),
    ...style,
  } as CSSProperties

  const share = async () => {
    const link = url || window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url: link })
      } catch {
        // Отказ от системного листа — не ошибка: молча выходим.
      }

      return
    }

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <style href="vibeui-button-054" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-054"
        data-copied={String(copied)}
        className={className}
        style={palette}
        onClick={share}
      >
        {copied ? (
          <span data-part="check" aria-hidden="true" />
        ) : (
          <span data-part="share" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        {copied ? copiedLabel : children}
        <span data-part="live" role="status" aria-live="polite">
          {copied ? copiedLabel : ""}
        </span>
      </button>
    </>
  )
}
