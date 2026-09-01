"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup035Props = Omit<
  ComponentPropsWithoutRef<"div">,
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
--vibeui-inputgroup-035-surface:oklch(1 0 0);
--vibeui-inputgroup-035-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-035-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-035-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-035-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-035-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-035-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-035-accent:oklch(0.55 0.14 150);
--vibeui-inputgroup-035-available:oklch(0.56 0.14 155);
--vibeui-inputgroup-035-taken:oklch(0.56 0.19 25);
--vibeui-inputgroup-035-radius:0.75rem;
--vibeui-inputgroup-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
    ...style,
  } as CSSProperties

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
            {status === "checking" ? "Проверяем…" : "Проверить"}
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
          {RESULT_TEXT[status]}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
