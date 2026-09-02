"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup029Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  delay?: number
  onSave?: (value: string) => void
  hint?: string
  /** Подписи статуса: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Status = "idle" | "editing" | "saved"

// Идея компонента: автосохранение не должно требовать кнопки, но и не
// должно срабатывать на каждое нажатие клавиши — статус меняется на
// «Сохраняем…» сразу при вводе и на «Сохранено» только после паузы, когда
// пользователь перестал печатать. Таймер пересоздаётся при каждом
// изменении текста (обычный debounce) и очищается при размонтировании,
// иначе старый вызов onSave сработает после того, как поле уже исчезло.
const STYLES = `
:where([data-vibeui-block="inputgroup-029"]){
--vibeui-inputgroup-029-surface:transparent;
--vibeui-inputgroup-029-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-029-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-029-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-inputgroup-029-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-029-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-029-accent:light-dark(oklch(0.55 0.14 250),oklch(0.76 0.13 250));
--vibeui-inputgroup-029-saved:light-dark(oklch(0.56 0.14 155),oklch(0.75 0.13 155));
--vibeui-inputgroup-029-radius:0.75rem;
--vibeui-inputgroup-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-029"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-029-surface);
border:1px solid var(--vibeui-inputgroup-029-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-029-font);color:var(--vibeui-inputgroup-029-fg);
}
[data-vibeui-block="inputgroup-029"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-029"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="inputgroup-029"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-029"] input{
width:100%;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-inputgroup-029-field);
border:1px solid var(--vibeui-inputgroup-029-border);border-radius:var(--vibeui-inputgroup-029-radius);
font:inherit;font-size:0.875rem;color:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="inputgroup-029"] input:focus{
outline:none;border-color:var(--vibeui-inputgroup-029-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-inputgroup-029-accent) 18%,transparent);
}
[data-vibeui-block="inputgroup-029"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-inputgroup-029-muted);
}
[data-vibeui-block="inputgroup-029"] [data-part="status"][data-status="saved"]{
color:var(--vibeui-inputgroup-029-saved);
}
[data-vibeui-block="inputgroup-029"] [data-part="status"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:999px;flex:none;
background:currentColor;
}
[data-vibeui-block="inputgroup-029"] [data-part="status"][data-status="editing"] [data-part="dot"]{
animation:vibeui-inputgroup-029-pulse 1s ease-in-out infinite;
}
[data-vibeui-block="inputgroup-029"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-029-muted);
}
@keyframes vibeui-inputgroup-029-pulse{0%,100%{opacity:0.35}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="inputgroup-029"] *{transition:none!important}
[data-vibeui-block="inputgroup-029"] [data-part="dot"]{animation:none!important}
}
`

const STATUS_TEXT: Record<Status, string> = {
  idle: "Изменения сохраняются автоматически",
  editing: "Сохраняем…",
  saved: "Сохранено",
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
 * Сцепка «поле + индикатор автосохранения»: статус переключается на
 * «Сохраняем…» сразу при вводе и на «Сохранено» после паузы — таймер
 * debounce пересоздаётся на каждое изменение и чистится при размонтировании.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup029({
  name = "note",
  label = "Заметка к заказу",
  placeholder = "Например, позвонить перед доставкой",
  defaultValue = "",
  delay = 900,
  onSave,
  hint = "Демонстрация: реальное сохранение подключается через onSave, здесь оно просто меняет статус.",
  statusText = STATUS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup029Props) {
  const id = useId()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-029-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const handleChange = (next: string) => {
    setValue(next)
    setStatus("editing")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setStatus("saved")
      onSave?.(next)
    }, delay)
  }

  return (
    <>
      <style href="vibeui-inputgroup-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-029"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="status" data-status={status} role="status">
            <span data-part="dot" aria-hidden="true" />
            {statusText[status] ?? STATUS_TEXT[status]}
          </span>
        </div>
        <input
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          aria-describedby={`${id}-hint`}
          onChange={(event) => handleChange(event.target.value)}
        />
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
