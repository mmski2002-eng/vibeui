"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup013Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  prefixLabel?: string
  defaultValue?: string
  /** Подпись кнопки в покое: компонент несёт русскую, проект подставляет свою. */
  copyLabel?: string
  /** Подпись кнопки после удачного копирования. */
  copiedLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: слева не кнопка, а неподвижная подпись «Ссылка» — она
// объясняет содержимое поля, но по ней нечего нажимать. Справа единственное
// действие — копирование, и оно само себя подтверждает: иконка на секунду
// с половиной превращается в галочку, а подпись кнопки — в «Готово». В
// отличие от сцепки с перевыпуском (там два разных действия по краям), здесь
// оба конца рамки описывают одно и то же значение: слева его смысл, справа —
// как его забрать.
const STYLES = `
:where([data-vibeui-block="inputgroup-013"]){
--vibeui-inputgroup-013-surface:transparent;
--vibeui-inputgroup-013-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-013-muted:color-mix(in oklab,var(--vibeui-inputgroup-013-fg) 68%,transparent);
--vibeui-inputgroup-013-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-013-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-013-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-013-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.72 0.15 39.8));
--vibeui-inputgroup-013-ok:light-dark(oklch(0.48 0.13 155),oklch(0.75 0.14 155));
--vibeui-inputgroup-013-radius:0.75rem;
--vibeui-inputgroup-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-013-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-013"]{color-scheme:dark}
[data-vibeui-block="inputgroup-013"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-013-surface);
border:1px solid var(--vibeui-inputgroup-013-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-013-font);color:var(--vibeui-inputgroup-013-fg);
}
[data-vibeui-block="inputgroup-013"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-013"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-013"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-013-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-013"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-013-radius) 0 0 var(--vibeui-inputgroup-013-radius);
}
[data-vibeui-block="inputgroup-013"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-013-radius) var(--vibeui-inputgroup-013-radius) 0;
}
[data-vibeui-block="inputgroup-013"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-013"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-013-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-013-accent);
}
/* Неподвижная подпись: не мишень, текст не выделяется и не переносится. */
[data-vibeui-block="inputgroup-013"] [data-part="prefix"]{
flex:none;display:flex;align-items:center;padding:0 0.75rem;
background:var(--vibeui-inputgroup-013-fixed);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-013-muted);
user-select:none;
}
[data-vibeui-block="inputgroup-013"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-013-field);
font-family:var(--vibeui-inputgroup-013-mono);font-size:0.8125rem;
text-overflow:ellipsis;
}
[data-vibeui-block="inputgroup-013"] button{
appearance:none;flex:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;padding:0 0.875rem;
background:var(--vibeui-inputgroup-013-fixed);
font-size:0.8125rem;font-weight:600;color:inherit;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-013"] button:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-013-accent) 12%,var(--vibeui-inputgroup-013-fixed));
}
[data-vibeui-block="inputgroup-013"] button svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-013"] button[data-done="1"]{color:var(--vibeui-inputgroup-013-ok)}
[data-vibeui-block="inputgroup-013"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Сцепка «подпись + ссылка + копирование»: единственное действие подтверждает
 * само себя сменой иконки и подписи кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup013({
  label = "Ссылка на счёт",
  prefixLabel = "Ссылка",
  defaultValue = "https://vibeui.ru/invoice/8834-ff2a",
  copyLabel = "Копировать",
  copiedLabel = "Готово",
  hint = "Поле только для чтения: ссылку можно скопировать или выделить вручную.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup013Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [copied, setCopied] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Буфер может быть недоступен (нет https, отказ в разрешении). Тогда
  // значение просто выделяется — скопировать вручную всё ещё можно.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(defaultValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      field.current?.select()
    }
  }

  return (
    <>
      <style href="vibeui-inputgroup-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="prefix" aria-hidden="true">
            {prefixLabel}
          </span>
          <input
            ref={field}
            id={id}
            type="text"
            readOnly
            value={defaultValue}
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
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
