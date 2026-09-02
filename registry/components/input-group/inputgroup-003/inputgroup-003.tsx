"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  base?: string
  defaultValue?: string
  /** Подпись кнопки перевыпуска. */
  refreshText?: string
  /** Подпись кнопки копирования. */
  copyText?: string
  /** Подтверждение после копирования. */
  copiedText?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у сцепки две кнопки по краям и разные роли. Слева —
// перевыпуск ссылки (действие меняет значение), справа — копирование
// (действие только читает). Поле между ними readonly: ссылку не набирают
// руками, но выделить её должно быть можно, поэтому это настоящий input,
// а не span. Обе кнопки делят рамку с полем, фокус поднимается z-index'ом.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-003"]){
--vibeui-inputgroup-003-surface:transparent;
--vibeui-inputgroup-003-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-inputgroup-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-inputgroup-003-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.013 265));
--vibeui-inputgroup-003-fixed:light-dark(oklch(0.96 0.003 265),oklch(0.32 0.012 265));
--vibeui-inputgroup-003-border:light-dark(oklch(0.86 0.008 265),oklch(0.44 0.013 265));
--vibeui-inputgroup-003-accent:light-dark(oklch(0.52 0.17 290),oklch(0.72 0.15 290));
--vibeui-inputgroup-003-ok:light-dark(oklch(0.48 0.13 155),oklch(0.76 0.14 155));
--vibeui-inputgroup-003-radius:0.75rem;
--vibeui-inputgroup-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-003-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-003"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-003-surface);
border:1px solid var(--vibeui-inputgroup-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-003-font);color:var(--vibeui-inputgroup-003-fg);
}
[data-vibeui-block="inputgroup-003"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-003"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-003"] [data-part="group"] > *{
position:relative;height:2.625rem;
border:1px solid var(--vibeui-inputgroup-003-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-003"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-003-radius) 0 0 var(--vibeui-inputgroup-003-radius);
}
[data-vibeui-block="inputgroup-003"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-003-radius) var(--vibeui-inputgroup-003-radius) 0;
}
[data-vibeui-block="inputgroup-003"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-003"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-003-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-003-accent);
}
[data-vibeui-block="inputgroup-003"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-003-field);
font-family:var(--vibeui-inputgroup-003-mono);font-size:0.8125rem;
text-overflow:ellipsis;
}
[data-vibeui-block="inputgroup-003"] button{
appearance:none;flex:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;padding:0 0.75rem;
background:var(--vibeui-inputgroup-003-fixed);
font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-003"] button:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-003-accent) 12%,var(--vibeui-inputgroup-003-fixed));
}
[data-vibeui-block="inputgroup-003"] button svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-003"] button[data-done="1"]{color:var(--vibeui-inputgroup-003-ok)}
[data-vibeui-block="inputgroup-003"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-003"] *{animation:none!important;transition:none!important}}
`

function token() {
  return Math.random().toString(36).slice(2, 10)
}

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
 * Сцепка с кнопками по краям: слева перевыпуск ссылки, справа копирование.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup003({
  label = "Ссылка-приглашение",
  base = "https://vibeui.ru/join/",
  defaultValue = "k7f2apqz",
  refreshText = "Обновить",
  copyText = "Копировать",
  copiedText = "Готово",
  hint = "Обновление ссылки отключает предыдущую — старая перестанет работать.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup003Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [code, setCode] = useState(defaultValue)
  const [copied, setCopied] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const value = `${base}${code}`

  // Буфер может быть недоступен (нет https, отказ в разрешении). Тогда
  // значение просто выделяется — копировать вручную всё ещё можно.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      field.current?.select()
    }
  }

  return (
    <>
      <style href="vibeui-inputgroup-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <button
            type="button"
            onClick={() => {
              setCode(token())
              setCopied(false)
            }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M13 8a5 5 0 1 1-1.6-3.7" strokeLinecap="round" />
              <path
                d="M13 2.5V5h-2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {refreshText}
          </button>
          <input
            ref={field}
            id={id}
            type="text"
            readOnly
            value={value}
            aria-describedby={`${id}-hint`}
          />
          <button type="button" data-done={copied ? "1" : "0"} onClick={copy}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              {copied ? (
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                  <path
                    d="M10.5 3.5H3.5a1 1 0 0 0-1 1v7"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
            {copied ? copiedText : copyText}
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
