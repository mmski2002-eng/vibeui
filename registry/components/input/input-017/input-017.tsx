"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  onChange?: (value: string) => void
  /**
   * Строка под полем: ключи idle, loading, found, empty.
   * В loading подставляется {query}, в found — {count}.
   */
  statusText?: Record<string, string>
  /** Подпись кнопки очистки для скринридера. */
  clearLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: очистка и подсказка сочетания клавиш уже заняты
// (input-004, input-009). Здесь другой вопрос — что показать полю, пока ответ
// от сервера ещё не пришёл. Лупа уступает место вращающемуся кольцу, статус
// произносится через aria-live, а счётчик результатов появляется только
// после honest паузы, а не мгновенно вместе с набором.
const STYLES = `
:where([data-vibeui-block="input-017"]){
--vibeui-input-017-bg:transparent;
--vibeui-input-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-017-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-input-017-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-input-017-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-input-017-hover:light-dark(oklch(0.94 0.005 265),oklch(0.33 0.011 265));
--vibeui-input-017-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-input-017-ring:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.012 265));
--vibeui-input-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-017"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-017-bg);
border:1px solid var(--vibeui-input-017-border);border-radius:0.875rem;
font-family:var(--vibeui-input-017-font);color:var(--vibeui-input-017-fg);
}
[data-vibeui-block="input-017"] *{box-sizing:border-box}
[data-vibeui-block="input-017"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-017"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-017"] input{
width:100%;height:2.5rem;padding:0 2.25rem 0 2.25rem;
border:1px solid var(--vibeui-input-017-border);border-radius:0.625rem;
background:var(--vibeui-input-017-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-017"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="input-017"] input:focus-visible{
outline:2px solid var(--vibeui-input-017-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="input-017"] [data-part="glass"]{
position:absolute;left:0.75rem;top:50%;width:0.75rem;height:0.75rem;
margin-top:-0.4375rem;pointer-events:none;
border:1.5px solid var(--vibeui-input-017-muted);border-radius:9999px;
}
[data-vibeui-block="input-017"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.3125rem;bottom:-0.1875rem;
width:0.375rem;height:1.5px;background:var(--vibeui-input-017-muted);transform:rotate(45deg);
}
/* Кольцо загрузки занимает то же место, что и лупа: смена значка честно
   отражает переход idle → loading, а не просто мигает текст рядом. */
[data-vibeui-block="input-017"] [data-part="spinner"]{
position:absolute;left:0.75rem;top:50%;width:0.75rem;height:0.75rem;margin-top:-0.375rem;
border-radius:9999px;pointer-events:none;
border:1.5px solid var(--vibeui-input-017-ring);
border-top-color:var(--vibeui-input-017-accent);
animation:vibeui-input-017-spin 0.7s linear infinite;
}
@keyframes vibeui-input-017-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="input-017"] [data-part="clear"]{
position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;background:transparent;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;
color:var(--vibeui-input-017-muted);
}
[data-vibeui-block="input-017"] [data-part="clear"]:hover{background:var(--vibeui-input-017-hover);color:var(--vibeui-input-017-fg)}
[data-vibeui-block="input-017"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-input-017-accent);outline-offset:1px}
[data-vibeui-block="input-017"] [data-part="cross"]{position:relative;width:0.5rem;height:0.5rem}
[data-vibeui-block="input-017"] [data-part="cross"]::before,
[data-vibeui-block="input-017"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="input-017"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="input-017"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="input-017"] [data-part="status"]{
font-size:0.75rem;color:var(--vibeui-input-017-muted);
}
[data-vibeui-block="input-017"] [data-part="status"][data-tone="empty"]{color:var(--vibeui-input-017-accent)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="input-017"] *{transition:none!important}
[data-vibeui-block="input-017"] [data-part="spinner"]{animation:none!important}
}
`

type Phase = "idle" | "loading" | "done"

// Демонстрационный счётчик: реальный запрос подставляют через onChange,
// здесь важно лишь честно показать разницу между «ищем» и «нашли».
function fakeCount(value: string) {
  if (!value.trim()) return 0
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 97
  return hash % 24
}

const STATUS: Record<string, string> = {
  idle: "Начните вводить запрос",
  loading: "Ищем «{query}»…",
  found: "Найдено результатов: {count}",
  empty: "Ничего не найдено",
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
 * Поле поиска с честным состоянием загрузки: кольцо вместо лупы, пауза перед
 * ответом, счётчик результатов через aria-live. Один файл, ноль зависимостей.
 */
export function Input017({
  label = "Поиск по заказам",
  placeholder = "Номер заказа или имя клиента",
  onChange,
  statusText = STATUS,
  clearLabel = "Очистить поиск",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Input017Props) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const field = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  // «Устоявшийся» результат отстаёт от значения на время паузы: пока они не
  // совпали, поле честно показывает «ищем», а не мгновенно готовый ответ.
  const [settled, setSettled] = useState({ value: "", count: 0 })

  useEffect(() => {
    if (!value || value === settled.value) {
      return
    }

    const timer = window.setTimeout(() => {
      setSettled({ value, count: fakeCount(value) })
    }, 450)

    return () => window.clearTimeout(timer)
  }, [value, settled.value])

  const palette = {
    ...(accent ? { "--vibeui-input-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const phase: Phase = !value
    ? "idle"
    : value === settled.value
      ? "done"
      : "loading"
  const statusKey =
    phase === "idle"
      ? "idle"
      : phase === "loading"
        ? "loading"
        : settled.count > 0
          ? "found"
          : "empty"
  const status = (statusText[statusKey] ?? STATUS[statusKey])
    .replace("{query}", value)
    .replace("{count}", String(settled.count))

  return (
    <>
      <style href="vibeui-input-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-017"
        className={className}
        style={palette}
      >
        <label htmlFor={fieldId}>{label}</label>
        <span data-part="field">
          {phase === "loading" ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : (
            <span data-part="glass" aria-hidden="true" />
          )}
          <input
            ref={field}
            id={fieldId}
            type="search"
            placeholder={placeholder}
            value={value}
            autoComplete="off"
            aria-describedby={`${fieldId}-status`}
            onChange={(event) => update(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label={clearLabel}
              onClick={() => {
                update("")
                field.current?.focus()
              }}
            >
              <span data-part="cross" aria-hidden="true" />
            </button>
          ) : null}
        </span>
        <span
          data-part="status"
          id={`${fieldId}-status`}
          role="status"
          aria-live="polite"
          data-tone={
            phase === "done" && settled.count === 0 ? "empty" : undefined
          }
        >
          {status}
        </span>
      </div>
    </>
  )
}
