"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Field007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  value?: string
  hint?: string
  /** Подписи кнопки и строки состояния: компонент несёт русские. */
  copyText?: string
  copiedText?: string
  copiedHint?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле, которое не редактируют, а забирают. Ключ, ссылка
// приглашения, идентификатор — их печатают глазами и ошибаются. Значение
// лежит в настоящем readOnly-поле, а не в <code>: его можно выделить,
// прокрутить и отдать менеджеру паролей. Кнопка копирования сначала пробует
// буфер обмена, а при отказе просто выделяет текст — так работает везде.
const STYLES = `
:where([data-vibeui-block="field-007"]){
--vibeui-field-007-bg:light-dark(oklch(0.975 0.004 265),oklch(0.26 0.011 265));
--vibeui-field-007-surface:transparent;
--vibeui-field-007-button:light-dark(oklch(1 0 0),oklch(0.31 0.012 265));
--vibeui-field-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-field-007-muted:color-mix(in oklab,var(--vibeui-field-007-fg) 68%,transparent);
--vibeui-field-007-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.012 265));
--vibeui-field-007-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.011 265));
--vibeui-field-007-accent:light-dark(oklch(0.5 0.16 250),oklch(0.75 0.13 250));
--vibeui-field-007-ok:light-dark(oklch(0.5 0.13 155),oklch(0.75 0.13 155));
--vibeui-field-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-field-007-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="field-007"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="field-007"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-007-surface);
border:1px solid var(--vibeui-field-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-007-font);color:var(--vibeui-field-007-fg);
}
[data-vibeui-block="field-007"] *{box-sizing:border-box}
[data-vibeui-block="field-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-007"] [data-part="frame"]{
display:flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.25rem 0.25rem 0.625rem;
background:var(--vibeui-field-007-bg);
border:1px dashed var(--vibeui-field-007-border);border-radius:0.75rem;
}
[data-vibeui-block="field-007"] [data-part="frame"]:focus-within{
border-style:solid;border-color:var(--vibeui-field-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-007-accent) 16%,transparent);
}
/* Настоящее readOnly-поле, а не <code>: значение выделяется и прокручивается. */
[data-vibeui-block="field-007"] input{
flex:1;min-width:0;height:2rem;padding:0;
border:0;background:none;color:inherit;cursor:text;
font-family:var(--vibeui-field-007-mono);font-size:0.8125rem;
text-overflow:ellipsis;
}
[data-vibeui-block="field-007"] input:focus{outline:none}
[data-vibeui-block="field-007"] button{
appearance:none;flex:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-field-007-border);
background:var(--vibeui-field-007-button);color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;line-height:1;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="field-007"] button:hover{border-color:var(--vibeui-field-007-accent);color:var(--vibeui-field-007-accent)}
[data-vibeui-block="field-007"] button:focus-visible{outline:2px solid var(--vibeui-field-007-accent);outline-offset:2px}
[data-vibeui-block="field-007"][data-copied="true"] button{border-color:var(--vibeui-field-007-ok);color:var(--vibeui-field-007-ok)}
/* Две пластины из бордюров: значок копии без иконочной библиотеки. */
[data-vibeui-block="field-007"] [data-part="mark"]{
position:relative;width:0.75rem;height:0.75rem;flex:none;
}
[data-vibeui-block="field-007"] [data-part="mark"]::before,
[data-vibeui-block="field-007"] [data-part="mark"]::after{
content:"";position:absolute;width:0.5rem;height:0.5rem;border-radius:0.125rem;
border:1.5px solid currentColor;
}
[data-vibeui-block="field-007"] [data-part="mark"]::before{left:0;top:0;opacity:.45}
[data-vibeui-block="field-007"] [data-part="mark"]::after{right:0;bottom:0}
[data-vibeui-block="field-007"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-007-muted);
}
[data-vibeui-block="field-007"][data-copied="true"] [data-part="hint"]{color:var(--vibeui-field-007-ok);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-007"] *{animation:none!important;transition:none!important}}
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
 * Поле только для чтения с кнопкой копирования и откатом на выделение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field007({
  label = "Ключ доступа к registry",
  value = "vibeui_live_8f3c21a7b904e6d5",
  hint = "Ключ показывается один раз — сохраните его сейчас.",
  copyText = "Копировать",
  copiedText = "Готово",
  copiedHint = "Скопировано в буфер обмена",
  background = "",
  accent,
  className,
  style,
  ...props
}: Field007Props) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-field-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-field-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const copy = async () => {
    // Выделение — не украшение, а запасной путь: буфер недоступен без
    // защищённого соединения и при отказе в разрешении.
    input.current?.select()

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <style href="vibeui-field-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="field"
        data-vibeui-block="field-007"
        data-copied={copied ? "true" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            ref={input}
            type="text"
            readOnly
            value={value}
            spellCheck={false}
            aria-describedby={`${id}-hint`}
            onFocus={(event) => event.target.select()}
          />
          <button type="button" onClick={copy}>
            <span data-part="mark" aria-hidden="true" />
            {copied ? copiedText : copyText}
          </button>
        </div>
        <p id={`${id}-hint`} data-part="hint" role="status">
          {copied ? copiedHint : hint}
        </p>
      </div>
    </>
  )
}
