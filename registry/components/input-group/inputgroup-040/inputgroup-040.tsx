"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup040Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  hint?: string
  /** Знак терминала слева от команды. */
  prefix?: string
  /** Подписи кнопки: ключи copy и copied. */
  copyText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const COPY_TEXT: Record<string, string> = {
  copy: "Копировать",
  copied: "Готово",
}

// Идея компонента: приставка «$» — неинтерактивный знак терминала, а не
// часть значения, поэтому она не участвует в копировании и не мешает
// выделению самой команды. Поле readonly, но остаётся настоящим input —
// команду можно выделить руками, если Clipboard API недоступен, кнопка
// пробует writeText и на отказе просто выделяет текст вместо тихой неудачи.
const STYLES = `
:where([data-vibeui-block="inputgroup-040"]){
--vibeui-inputgroup-040-surface:transparent;
--vibeui-inputgroup-040-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-040-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-040-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-inputgroup-040-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-040-fixed:light-dark(oklch(0.965 0.003 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-040-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-040-accent:light-dark(oklch(0.55 0.15 230),oklch(0.77 0.13 230));
--vibeui-inputgroup-040-radius:0.75rem;
--vibeui-inputgroup-040-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-040-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-040"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-040-surface);
border:1px solid var(--vibeui-inputgroup-040-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-040-font);color:var(--vibeui-inputgroup-040-fg);
}
[data-vibeui-block="inputgroup-040"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-040"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-040"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-040"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-040-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-040"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-040-radius) 0 0 var(--vibeui-inputgroup-040-radius);
}
[data-vibeui-block="inputgroup-040"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-040-radius) var(--vibeui-inputgroup-040-radius) 0;
}
[data-vibeui-block="inputgroup-040"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-040"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-040-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-040-accent);
}
[data-vibeui-block="inputgroup-040"] [data-part="prefix"]{
display:flex;flex:none;align-items:center;justify-content:center;width:2.25rem;
background:var(--vibeui-inputgroup-040-fixed);
font-family:var(--vibeui-inputgroup-040-mono);font-weight:700;color:var(--vibeui-inputgroup-040-muted);
user-select:none;
}
[data-vibeui-block="inputgroup-040"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-040-field);
font-family:var(--vibeui-inputgroup-040-mono);font-size:0.8125rem;letter-spacing:0.01em;
}
[data-vibeui-block="inputgroup-040"] [data-part="copy"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-040-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-040"] [data-part="copy"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-040-accent) 14%,var(--vibeui-inputgroup-040-fixed));
}
[data-vibeui-block="inputgroup-040"] [data-part="copy"][data-copied="true"]{
color:var(--vibeui-inputgroup-040-accent);
}
[data-vibeui-block="inputgroup-040"] [data-part="copy"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-040"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-040-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-040"] *{transition:none!important}}
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
 * Сцепка «$ + команда + копирование»: приставка терминала неинтерактивна,
 * поле readonly, но выделяемо, кнопка копирует через Clipboard API и на
 * отказе выделяет текст вместо тихой неудачи. Один файл, ноль зависимостей.
 */
export function Inputgroup040({
  label = "Команда установки",
  defaultValue = "npm install vibeui-cli",
  hint = "Клик по кнопке копирует команду целиком вместе со знаком $.",
  prefix = "$",
  copyText = COPY_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup040Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [copied, setCopied] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-040-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-040-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const copyKey = copied ? "copied" : "copy"

  const copy = async () => {
    const command = `${prefix} ${defaultValue}`
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      field.current?.select()
    }
  }

  return (
    <>
      <style href="vibeui-inputgroup-040" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-040"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="prefix" aria-hidden="true">
            {prefix}
          </span>
          <input
            ref={field}
            id={id}
            type="text"
            readOnly
            value={defaultValue}
            aria-describedby={`${id}-hint`}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            data-part="copy"
            data-copied={copied}
            onClick={copy}
          >
            {copied ? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5l3 3 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.2" />
                <path
                  d="M3 10.5V3.7a1.2 1.2 0 0 1 1.2-1.2H10"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {copyText[copyKey] ?? COPY_TEXT[copyKey]}
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
