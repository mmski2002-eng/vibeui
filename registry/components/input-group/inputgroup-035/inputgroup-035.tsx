"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup035Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  takenHandles?: string[]
  checkDelay?: number
  onChange?: (value: string) => void
  onResult?: (value: string, available: boolean) => void
  hint?: string
  /** Текст результата по ключам статуса: idle, checking, available, taken. */
  resultText?: Record<string, string>
  /** Подписи кнопки: ключи check и checking. */
  actionText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Status = "idle" | "checking" | "available" | "taken"

const TAKEN: string[] = ["admin", "support", "vibeui", "root"]

// Идея компонента: кнопка «Проверить» — не единственный способ узнать
// результат, но поле не блокируется ни во время проверки, ни после неё —
// в отличие от сцепки с промокодом, где принятое значение фиксируется.
// Здесь имя можно перепроверять сколько угодно раз, а любое редактирование
// сразу возвращает статус к «не проверено», потому что старый результат
// относится уже к другой строке.
const STYLES = `
:where([data-vibeui-block="inputgroup-035"]){
--vibeui-inputgroup-035-surface:transparent;
--vibeui-inputgroup-035-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-inputgroup-035-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-035-muted:color-mix(in oklab,var(--vibeui-inputgroup-035-fg) 68%,transparent);
--vibeui-inputgroup-035-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-035-fixed:light-dark(oklch(0.965 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-035-border:light-dark(oklch(0.86 0 265),oklch(0.42 0 265));
--vibeui-inputgroup-035-accent:light-dark(oklch(0.55 0.14 39.8),oklch(0.77 0.13 39.8));
--vibeui-inputgroup-035-available:light-dark(oklch(0.56 0.14 39.8),oklch(0.79 0.13 39.8));
--vibeui-inputgroup-035-taken:light-dark(oklch(0.56 0.19 39.8),oklch(0.75 0.15 39.8));
--vibeui-inputgroup-035-radius:0.75rem;
--vibeui-inputgroup-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-035"]{color-scheme:dark}
[data-vibeui-block="inputgroup-035"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-035-surface);
border:1px solid var(--vibeui-inputgroup-035-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-035-font);color:var(--vibeui-inputgroup-035-fg);
}
[data-vibeui-block="inputgroup-035"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-035"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-035"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-035"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-035-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-035"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-035-radius) 0 0 var(--vibeui-inputgroup-035-radius);
}
[data-vibeui-block="inputgroup-035"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-035-radius) var(--vibeui-inputgroup-035-radius) 0;
}
[data-vibeui-block="inputgroup-035"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-035"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-035-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-035-accent);
}
[data-vibeui-block="inputgroup-035"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-035-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-035"] input:disabled{color:var(--vibeui-inputgroup-035-muted)}
[data-vibeui-block="inputgroup-035"] [data-part="check"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-035-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-035"] [data-part="check"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-035-accent) 14%,var(--vibeui-inputgroup-035-fixed));
}
[data-vibeui-block="inputgroup-035"] [data-part="check"]:disabled{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="inputgroup-035"] [data-part="check"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-035"] [data-part="check"] [data-part="spinner"]{
animation:vibeui-inputgroup-035-spin 0.8s linear infinite;
}
[data-vibeui-block="inputgroup-035"] [data-part="result"]{
margin:0;display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-035-muted);
}
[data-vibeui-block="inputgroup-035"] [data-part="result"][data-status="available"]{
color:var(--vibeui-inputgroup-035-available);font-weight:600;
}
[data-vibeui-block="inputgroup-035"] [data-part="result"][data-status="taken"]{
color:var(--vibeui-inputgroup-035-taken);font-weight:600;
}
[data-vibeui-block="inputgroup-035"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:999px;background:currentColor;flex:none;
}
@keyframes vibeui-inputgroup-035-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="inputgroup-035"] *{transition:none!important}
[data-vibeui-block="inputgroup-035"] [data-part="spinner"]{animation:none!important}
}
`

const RESULT_TEXT: Record<Status, string> = {
  idle: "Имя ещё не проверено — нажмите «Проверить».",
  checking: "Проверяем занятость имени…",
  available: "Свободно, можно занять.",
  taken: "Уже занято — попробуйте другое имя.",
}

const ACTION_TEXT: Record<string, string> = {
  check: "Проверить",
  checking: "Проверяем…",
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
 * Сцепка «поле имени + проверка занятости»: результат виден под рамкой,
 * поле остаётся редактируемым в любом состоянии, а правка после ответа
 * сбрасывает статус в idle — старый результат относился к другой строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup035({
  name = "handle",
  label = "Имя пользователя",
  placeholder = "имя_профиля",
  defaultValue = "",
  takenHandles = TAKEN,
  checkDelay = 900,
  onChange,
  onResult,
  hint = "Проверка имитационная: подставьте сюда реальный запрос к серверу.",
  resultText = RESULT_TEXT,
  actionText = ACTION_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup035Props) {
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
    ...(accent ? { "--vibeui-inputgroup-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-035-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const actionKey = status === "checking" ? "checking" : "check"

  const check = () => {
    const handle = value.trim()
    if (!handle || status === "checking") return

    setStatus("checking")
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      const available = !takenHandles.includes(handle.toLowerCase())
      setStatus(available ? "available" : "taken")
      onResult?.(handle, available)
    }, checkDelay)
  }

  return (
    <>
      <style href="vibeui-inputgroup-035" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-035"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={value}
            disabled={status === "checking"}
            aria-invalid={status === "taken"}
            aria-describedby={`${id}-result ${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
              setStatus("idle")
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                check()
              }
            }}
          />
          <button
            type="button"
            data-part="check"
            disabled={!value.trim() || status === "checking"}
            onClick={check}
          >
            {status === "checking" ? (
              <svg
                data-part="spinner"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M8 2a6 6 0 1 1-6 6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8.5l3.5 3.5 7-8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {actionText[actionKey] ?? ACTION_TEXT[actionKey]}
          </button>
        </div>
        <p
          data-part="result"
          id={`${id}-result`}
          data-status={status}
          role="status"
        >
          {(status === "available" || status === "taken") && (
            <span data-part="dot" aria-hidden="true" />
          )}
          {resultText[status] ?? RESULT_TEXT[status]}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
