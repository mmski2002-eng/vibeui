"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Button063Props = Omit<
  ComponentProps<"div">,
  "children" | "onSubmit"
> & {
  placeholder?: string
  /** Подпись кнопки отправки: она уходит в aria-label, на кнопке — стрелка. */
  sendLabel?: string
  /** Подсказка под полем: чем Enter отличается от Shift+Enter. */
  hint?: string
  /** Начальный текст: витрине нужна кнопка в рабочем состоянии. */
  defaultValue?: string
  maxLength?: number
  onSend?: (value: string) => void
  accent?: string
  /** Поверхность композера. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка отправки живёт внутри поля, а не рядом с ним.
// Пока текста нет, отправлять нечего — кнопка выключена, и это единственное
// честное состояние: активная кнопка на пустом поле обещает действие, которого
// не будет. Enter отправляет, Shift+Enter переносит строку — так работают все
// композеры, и переучивать человека здесь нельзя.
const STYLES = `
:where([data-vibeui-block="button-063"]){
--vibeui-button-063-bg:light-dark(oklch(1 0 0),oklch(0.22 0.01 265));
--vibeui-button-063-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-063-on-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-063-muted:color-mix(in oklab,var(--vibeui-button-063-fg) 60%,transparent);
--vibeui-button-063-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-button-063-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.14 265));
--vibeui-button-063-radius:1rem;
--vibeui-button-063-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-063"]{color-scheme:dark}
[data-vibeui-block="button-063"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:26rem;box-sizing:border-box;
font-family:var(--vibeui-button-063-font);color:var(--vibeui-button-063-fg);
}
[data-vibeui-block="button-063"] *{box-sizing:border-box}
[data-vibeui-block="button-063"] [data-part="field"]{
display:flex;align-items:flex-end;gap:0.5rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
border:1px solid var(--vibeui-button-063-border);
border-radius:var(--vibeui-button-063-radius);
background:var(--vibeui-button-063-bg);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="button-063"] [data-part="field"]:focus-within{
border-color:var(--vibeui-button-063-fg);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-button-063-fg) 12%,transparent);
}
/* Поле растёт по содержимому до потолка: композер, который скроллится с
   первой строки, читается как сломанный. */
[data-vibeui-block="button-063"] textarea{
flex:1;min-width:0;min-height:1.5rem;max-height:7.5rem;
border:0;padding:0.3125rem 0;margin:0;resize:none;
background:transparent;color:inherit;
font:inherit;font-size:0.875rem;line-height:1.45;
field-sizing:content;
}
[data-vibeui-block="button-063"] textarea:focus{outline:none}
[data-vibeui-block="button-063"] textarea::placeholder{color:var(--vibeui-button-063-muted)}
[data-vibeui-block="button-063"] [data-part="send"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-button-063-fg);color:var(--vibeui-button-063-on-fg);
transition:opacity .16s ease,transform .16s ease,filter .16s ease;
}
[data-vibeui-block="button-063"] [data-part="send"] svg{width:1.125rem;height:1.125rem;fill:currentColor}
[data-vibeui-block="button-063"] [data-part="send"]:hover:not(:disabled){
filter:light-dark(brightness(1.45),brightness(0.9));
}
[data-vibeui-block="button-063"] [data-part="send"]:active:not(:disabled){transform:scale(0.94)}
/* Выключенная кнопка не притворяется рабочей: гасим и отменяем курсор. */
[data-vibeui-block="button-063"] [data-part="send"]:disabled{
opacity:.35;cursor:not-allowed;
}
[data-vibeui-block="button-063"] [data-part="send"]:focus-visible{
outline:2px solid var(--vibeui-button-063-accent);outline-offset:2px;
}
[data-vibeui-block="button-063"] [data-part="hint"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0;padding:0 0.25rem;
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-button-063-muted);
}
[data-vibeui-block="button-063"] [data-part="count"]{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-063"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Композер с кнопкой отправки внутри поля: Enter отправляет, Shift+Enter
 * переносит строку. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button063({
  placeholder = "Напишите сообщение",
  sendLabel = "Отправить",
  hint = "Enter отправит, Shift+Enter перенесёт строку",
  defaultValue = "",
  maxLength = 2000,
  onSend,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button063Props) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(defaultValue)
  const ready = value.trim().length > 0

  const send = () => {
    if (!ready) {
      return
    }

    onSend?.(value.trim())
    setValue("")
    field.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter оставляем браузеру: это перенос строки, а не отправка.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-button-063-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-063-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-063" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-063"
        className={className}
        style={palette}
      >
        <div data-part="field">
          <textarea
            ref={field}
            id={id}
            rows={1}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            data-part="send"
            disabled={!ready}
            aria-label={sendLabel}
            title={sendLabel}
            onClick={send}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 11.5 20 4l-7.5 16-2.2-6.3z" />
            </svg>
          </button>
        </div>

        <p data-part="hint">
          <span>{hint}</span>
          <span data-part="count">
            {value.length} / {maxLength}
          </span>
        </p>
      </div>
    </>
  )
}
