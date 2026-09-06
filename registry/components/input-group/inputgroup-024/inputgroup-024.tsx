"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup024Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  placeholder?: string
  applyLabel?: string
  defaultValue?: string
  validCodes?: string[]
  delay?: number
  /** Подпись кнопки во время проверки. */
  checkingLabel?: string
  /** Подпись ссылки «ввести другой код». */
  resetLabel?: string
  /** Тексты статуса: idle, checking, accepted, rejected. */
  statusText?: Record<string, string>
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Status = "idle" | "checking" | "accepted" | "rejected"

const DEFAULT_VALID_CODES = ["VIBEUI10", "SALE2026"]

// Идея компонента: у промокода три исхода, а не два — идёт проверка,
// принят, отклонён — и каждый должен быть виден без чтения текста статуса
// (свой цвет и своя иконка). Проверка идёт по таймеру, имитируя запрос к
// серверу: поле блокируется на время проверки и остаётся заблокированным
// после успеха, а любое повторное редактирование сбрасывает статус в
// исходный, потому что старая проверка больше не про новый текст.
const STYLES = `
:where([data-vibeui-block="inputgroup-024"]){
--vibeui-inputgroup-024-surface:transparent;
--vibeui-inputgroup-024-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-024-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-024-muted:color-mix(in oklab,var(--vibeui-inputgroup-024-fg) 68%,transparent);
--vibeui-inputgroup-024-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-024-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-024-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-024-accent:light-dark(oklch(0.5 0.15 39.8),oklch(0.73 0.14 39.8));
--vibeui-inputgroup-024-checking:light-dark(oklch(0.6 0 265),oklch(0.72 0 265));
--vibeui-inputgroup-024-accepted:light-dark(oklch(0.56 0.14 39.8),oklch(0.76 0.14 39.8));
--vibeui-inputgroup-024-rejected:light-dark(oklch(0.56 0.19 39.8),oklch(0.72 0.17 39.8));
--vibeui-inputgroup-024-radius:0.75rem;
--vibeui-inputgroup-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-024-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-024"]{color-scheme:dark}
[data-vibeui-block="inputgroup-024"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-024-surface);
border:1px solid var(--vibeui-inputgroup-024-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-024-font);color:var(--vibeui-inputgroup-024-fg);
}
[data-vibeui-block="inputgroup-024"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-024"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-024"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-024"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-024-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-024"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-024-radius) 0 0 var(--vibeui-inputgroup-024-radius);
}
[data-vibeui-block="inputgroup-024"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-024-radius) var(--vibeui-inputgroup-024-radius) 0;
}
[data-vibeui-block="inputgroup-024"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-024"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-024-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-024-accent);
}
[data-vibeui-block="inputgroup-024"] [data-part="group"][data-status="accepted"] > *{
border-color:var(--vibeui-inputgroup-024-accepted);
}
[data-vibeui-block="inputgroup-024"] [data-part="group"][data-status="rejected"] > *{
border-color:var(--vibeui-inputgroup-024-rejected);
}
[data-vibeui-block="inputgroup-024"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-024-field);
font-family:var(--vibeui-inputgroup-024-mono);font-size:0.875rem;letter-spacing:0.03em;
text-transform:uppercase;
}
[data-vibeui-block="inputgroup-024"] input:disabled{color:var(--vibeui-inputgroup-024-muted)}
[data-vibeui-block="inputgroup-024"] [data-part="apply"]{
appearance:none;flex:none;cursor:pointer;padding:0 1rem;min-width:6.5rem;
background:var(--vibeui-inputgroup-024-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-024"] [data-part="apply"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-024-accent) 14%,var(--vibeui-inputgroup-024-fixed));
}
[data-vibeui-block="inputgroup-024"] [data-part="apply"]:disabled{opacity:0.55;cursor:not-allowed}
[data-vibeui-block="inputgroup-024"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-024-muted);
}
[data-vibeui-block="inputgroup-024"] [data-part="status"][data-status="accepted"]{
color:var(--vibeui-inputgroup-024-accepted);font-weight:600;
}
[data-vibeui-block="inputgroup-024"] [data-part="status"][data-status="rejected"]{
color:var(--vibeui-inputgroup-024-rejected);font-weight:600;
}
[data-vibeui-block="inputgroup-024"] [data-part="status"] svg{
width:0.875rem;height:0.875rem;flex:none;display:block;
}
[data-vibeui-block="inputgroup-024"] [data-part="spinner"]{
animation:vibeui-inputgroup-024-spin 0.8s linear infinite;
}
[data-vibeui-block="inputgroup-024"] [data-part="reset"]{
appearance:none;cursor:pointer;color:var(--vibeui-inputgroup-024-accent);
font:inherit;font-size:0.75rem;font-weight:650;text-decoration:underline;
text-underline-offset:2px;
}
[data-vibeui-block="inputgroup-024"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-024-muted);
}
@keyframes vibeui-inputgroup-024-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="inputgroup-024"] *{transition:none!important}
[data-vibeui-block="inputgroup-024"] [data-part="spinner"]{animation:none!important}
}
`

const STATUS_TEXT: Record<Status, string> = {
  idle: "Введите промокод и нажмите «Применить»",
  checking: "Проверяем код…",
  accepted: "Промокод принят",
  rejected: "Такой промокод не найден или уже истёк",
}

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
 * Сцепка «поле промокода + проверка»: три состояния статуса со своим цветом
 * и иконкой, поле блокируется на время проверки и после успеха.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup024({
  name = "promo",
  label = "Промокод",
  placeholder = "Например, VIBEUI10",
  applyLabel = "Применить",
  defaultValue = "",
  validCodes = DEFAULT_VALID_CODES,
  delay = 900,
  checkingLabel = "Проверяем…",
  resetLabel = "Ввести другой",
  statusText = STATUS_TEXT,
  hint = "Демонстрационная проверка: подходит код VIBEUI10 или SALE2026, остальные будут отклонены.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup024Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [code, setCode] = useState(defaultValue)
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-024-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = () => {
    const trimmed = code.trim()
    if (!trimmed || status === "checking") return

    setStatus("checking")
    timeoutRef.current = setTimeout(() => {
      const ok = validCodes.some(
        (valid) => valid.toLowerCase() === trimmed.toLowerCase(),
      )
      setStatus(ok ? "accepted" : "rejected")
    }, delay)
  }

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setStatus("idle")
    setCode("")
    field.current?.focus()
  }

  return (
    <>
      <style href="vibeui-inputgroup-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-024"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group" data-status={status}>
          <input
            ref={field}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            value={code}
            disabled={status === "accepted"}
            aria-invalid={status === "rejected"}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => {
              setCode(event.target.value)
              if (status === "rejected") {
                setStatus("idle")
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                apply()
              }
            }}
          />
          <button
            type="button"
            data-part="apply"
            disabled={
              status === "checking" || status === "accepted" || !code.trim()
            }
            onClick={apply}
          >
            {status === "checking" ? checkingLabel : applyLabel}
          </button>
        </div>
        <p
          data-part="status"
          id={`${id}-status`}
          data-status={status}
          role="status"
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
          ) : null}
          {status === "accepted" ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="m3 8.5 3.2 3.2L13 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
          {status === "rejected" ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          ) : null}
          <span>{statusText[status] ?? STATUS_TEXT[status]}</span>
          {status === "accepted" ? (
            <button type="button" data-part="reset" onClick={reset}>
              {resetLabel}
            </button>
          ) : null}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
