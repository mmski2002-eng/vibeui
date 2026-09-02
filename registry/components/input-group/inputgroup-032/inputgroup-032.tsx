"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup032Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  connected?: boolean
  scanDelay?: number
  onChange?: (value: string) => void
  onScan?: (value: string) => void
  hint?: string
  /** Подписи состояния сканера: ключи online и offline. */
  deviceText?: Record<string, string>
  /** Подписи кнопки: ключи idle и scanning. */
  buttonText?: Record<string, string>
  /** Строки статуса: ключи empty, scanning и done; {value} — считанный код. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const DEVICE_TEXT: Record<string, string> = {
  online: "Сканер подключён",
  offline: "Сканер не найден",
}

const BUTTON_TEXT: Record<string, string> = {
  idle: "Сканировать",
  scanning: "Сканируем…",
}

const STATUS_TEXT: Record<string, string> = {
  empty: "Код ещё не считан",
  scanning: "Идёт сканирование, подождите",
  done: "Считан код: {value}",
}

function randomCode() {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(
    "",
  )
}

// Идея компонента: кнопка сканирования не работает вслепую — статус
// устройства виден рядом с полем и решает, доступно ли сканирование, ещё
// до нажатия кнопки. Само сканирование имитируется таймером и переводит
// поле в заблокированное состояние на время «съёмки», как и должно быть
// с настоящим сканером: значение меняется одним действием, а не приходит
// по кусочкам. Таймер чистится при размонтировании и при повторном запуске.
const STYLES = `
:where([data-vibeui-block="inputgroup-032"]){
--vibeui-inputgroup-032-surface:transparent;
--vibeui-inputgroup-032-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-032-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-032-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-inputgroup-032-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-032-fixed:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-032-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-032-accent:light-dark(oklch(0.55 0.14 220),oklch(0.76 0.13 220));
--vibeui-inputgroup-032-online:light-dark(oklch(0.56 0.14 155),oklch(0.75 0.13 155));
--vibeui-inputgroup-032-offline:light-dark(oklch(0.56 0.19 25),oklch(0.75 0.16 25));
--vibeui-inputgroup-032-radius:0.75rem;
--vibeui-inputgroup-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-032-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-032"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-032-surface);
border:1px solid var(--vibeui-inputgroup-032-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-032-font);color:var(--vibeui-inputgroup-032-fg);
}
[data-vibeui-block="inputgroup-032"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-032"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="inputgroup-032"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-032"] [data-part="device"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.75rem;font-weight:650;color:var(--vibeui-inputgroup-032-offline);
}
[data-vibeui-block="inputgroup-032"] [data-part="device"][data-online="true"]{
color:var(--vibeui-inputgroup-032-online);
}
[data-vibeui-block="inputgroup-032"] [data-part="device"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:999px;background:currentColor;flex:none;
}
[data-vibeui-block="inputgroup-032"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-032"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-032-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-032"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-032-radius) 0 0 var(--vibeui-inputgroup-032-radius);
}
[data-vibeui-block="inputgroup-032"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-032-radius) var(--vibeui-inputgroup-032-radius) 0;
}
[data-vibeui-block="inputgroup-032"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-032"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-032-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-032-accent);
}
[data-vibeui-block="inputgroup-032"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-032-field);
font-family:var(--vibeui-inputgroup-032-mono);font-size:0.875rem;letter-spacing:0.02em;
}
[data-vibeui-block="inputgroup-032"] input:disabled{color:var(--vibeui-inputgroup-032-muted)}
[data-vibeui-block="inputgroup-032"] [data-part="scan"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-032-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-032"] [data-part="scan"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-032-accent) 14%,var(--vibeui-inputgroup-032-fixed));
}
[data-vibeui-block="inputgroup-032"] [data-part="scan"]:disabled{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="inputgroup-032"] [data-part="scan"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-032"] [data-part="scan"] [data-part="spinner"]{
animation:vibeui-inputgroup-032-spin 0.8s linear infinite;
}
[data-vibeui-block="inputgroup-032"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-032-muted);
}
[data-vibeui-block="inputgroup-032"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-032-muted);
}
@keyframes vibeui-inputgroup-032-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="inputgroup-032"] *{transition:none!important}
[data-vibeui-block="inputgroup-032"] [data-part="spinner"]{animation:none!important}
}
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
 * Сцепка «поле кода + сканирование + статус устройства»: точка статуса
 * рядом с меткой показывает, подключён ли сканер, кнопка запускает
 * имитацию съёмки таймером и блокирует поле на время сканирования.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup032({
  name = "code",
  label = "Код товара",
  placeholder = "Отсканируйте или введите код",
  defaultValue = "",
  connected = true,
  scanDelay = 1100,
  onChange,
  onScan,
  hint = "Демонстрационное сканирование: код генерируется на месте, вместо таймера подключите настоящий сканер.",
  deviceText = DEVICE_TEXT,
  buttonText = BUTTON_TEXT,
  statusText = STATUS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup032Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-032-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const statusKey = scanning ? "scanning" : value ? "done" : "empty"
  const statusLine = (statusText[statusKey] ?? STATUS_TEXT[statusKey]).replace(
    "{value}",
    value,
  )

  const scan = () => {
    if (!connected || scanning) return

    setScanning(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      const code = randomCode()
      setValue(code)
      setScanning(false)
      onChange?.(code)
      onScan?.(code)
      field.current?.focus()
    }, scanDelay)
  }

  return (
    <>
      <style href="vibeui-inputgroup-032" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-032"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="device" data-online={connected} role="status">
            <span data-part="dot" aria-hidden="true" />
            {connected
              ? (deviceText.online ?? DEVICE_TEXT.online)
              : (deviceText.offline ?? DEVICE_TEXT.offline)}
          </span>
        </div>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={value}
            disabled={scanning}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            data-part="scan"
            disabled={!connected || scanning}
            onClick={scan}
          >
            {scanning ? (
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
                  d="M2 5V3.5A1.5 1.5 0 0 1 3.5 2H5M11 2h1.5A1.5 1.5 0 0 1 14 3.5V5M14 11v1.5a1.5 1.5 0 0 1-1.5 1.5H11M5 14H3.5A1.5 1.5 0 0 1 2 12.5V11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4 8h8" strokeLinecap="round" />
              </svg>
            )}
            {scanning
              ? (buttonText.scanning ?? BUTTON_TEXT.scanning)
              : (buttonText.idle ?? BUTTON_TEXT.idle)}
          </button>
        </div>
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          {statusLine}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
