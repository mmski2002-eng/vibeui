"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "content"
> & {
  label?: string
  hint?: string
  copyText?: string
  copiedText?: string
  /** Текст в поле: команда, ключ, сниппет. */
  content?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле только для чтения — ключ, сниппет, инструкция для
// агента. readOnly, а не disabled: выключенное поле нельзя выделить и
// прочитать скринридером, а здесь текст и есть содержимое. Копирование идёт
// через буфер обмена, но с запасным путём: без защищённого соединения
// clipboard недоступен, и тогда текст просто выделяется целиком.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="textarea-008"]){
--vibeui-textarea-008-bg:transparent;
--vibeui-textarea-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-textarea-008-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-textarea-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-textarea-008-field:light-dark(oklch(0.97 0.004 265),oklch(0.25 0.012 265));
--vibeui-textarea-008-accent:light-dark(oklch(0.5 0.16 250),oklch(0.73 0.14 250));
--vibeui-textarea-008-ok:light-dark(oklch(0.52 0.14 155),oklch(0.74 0.14 155));
--vibeui-textarea-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-textarea-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="textarea-008"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-008-bg);
border:1px solid var(--vibeui-textarea-008-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-008-font);color:var(--vibeui-textarea-008-fg);
}
[data-vibeui-block="textarea-008"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="textarea-008"] label{font-size:0.8125rem;font-weight:600}
/* Кнопка стоит в шапке, а не поверх текста: наложенная кнопка перекрывает
   первую строку и мешает выделять текст руками. */
[data-vibeui-block="textarea-008"] button{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-textarea-008-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="textarea-008"] button:hover{border-color:var(--vibeui-textarea-008-accent)}
[data-vibeui-block="textarea-008"] button:focus-visible{outline:2px solid var(--vibeui-textarea-008-accent);outline-offset:2px}
[data-vibeui-block="textarea-008"][data-copied="true"] button{
border-color:var(--vibeui-textarea-008-ok);color:var(--vibeui-textarea-008-ok);
}
/* Две квадратные рамки со сдвигом — значок «копировать» без иконочного пакета. */
[data-vibeui-block="textarea-008"] [data-part="mark"]{
position:relative;width:0.75rem;height:0.75rem;
border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="textarea-008"] [data-part="mark"]::after{
content:"";position:absolute;left:-0.3125rem;top:-0.3125rem;
width:0.5rem;height:0.5rem;
border:1.5px solid currentColor;border-right:0;border-bottom:0;
border-radius:0.1875rem 0 0 0;
}
[data-vibeui-block="textarea-008"][data-copied="true"] [data-part="mark"]{
width:0.375rem;height:0.6875rem;border-radius:0;
border:0;border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="textarea-008"][data-copied="true"] [data-part="mark"]::after{content:none}
[data-vibeui-block="textarea-008"] textarea{
box-sizing:border-box;width:100%;min-height:5.5rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;
border:1px dashed var(--vibeui-textarea-008-border);border-radius:0.625rem;
background:var(--vibeui-textarea-008-field);color:inherit;
font-family:var(--vibeui-textarea-008-mono);font-size:0.75rem;line-height:1.6;
cursor:text;
}
[data-vibeui-block="textarea-008"] textarea:focus-visible{
outline:2px solid var(--vibeui-textarea-008-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="textarea-008"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-textarea-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-008"] *{animation:none!important;transition:none!important}}
`

const CONTENT = `npx shadcn@latest add https://vibeui.dev/r/textarea-008.json

# Поле только для чтения: текст можно выделить,
# скопировать кнопкой и прочитать скринридером.`

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
 * Поле только для чтения с кнопкой копирования и запасным выделением текста.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea008({
  label = "Команда установки",
  hint = "Поле доступно для чтения и выделения, но не для правки",
  copyText = "Копировать",
  copiedText = "Скопировано",
  content = CONTENT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Textarea008Props) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const element = field.current
    if (!element) {
      return
    }
    try {
      await navigator.clipboard.writeText(element.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Без защищённого соединения clipboard недоступен: тогда выделяем
      // текст целиком, чтобы копирование осталось в один жест.
      element.focus()
      element.select()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-textarea-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-008"
        data-copied={copied}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <button type="button" onClick={copy}>
            <span data-part="mark" aria-hidden="true" />
            <span>{copied ? copiedText : copyText}</span>
          </button>
        </div>
        <textarea
          id={id}
          ref={field}
          readOnly
          spellCheck={false}
          value={content}
          onFocus={(event) => event.currentTarget.select()}
        />
        <p data-part="hint" role="status">
          {copied ? copiedText : hint}
        </p>
      </div>
    </>
  )
}
