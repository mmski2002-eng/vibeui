"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup038Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onLocate?: (latitude: number, longitude: number) => void
  hint?: string
  accent?: string
}

type Status = "idle" | "locating" | "done" | "denied" | "unsupported"

const STATUS_TEXT: Record<Exclude<Status, "idle">, string> = {
  locating: "Определяем координаты устройства…",
  done: "Координаты подставлены — проверьте и уточните адрес.",
  denied: "Доступ к геолокации не разрешён — введите адрес вручную.",
  unsupported: "Браузер не поддерживает геолокацию — введите адрес вручную.",
}

// Идея компонента: браузер отдаёт координаты, а не готовый адрес — обратного
// геокодирования без стороннего сервиса нет, поэтому кнопка подставляет
// координаты как текст и явно предупреждает, что их нужно превратить в
// адрес самостоятельно. Отказ доступа и отсутствие API — два разных статуса
// с разным текстом, а не одно общее «не получилось».
const STYLES = `
:where([data-vibeui-block="inputgroup-038"]){
--vibeui-inputgroup-038-surface:oklch(1 0 0);
--vibeui-inputgroup-038-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-038-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-038-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-038-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-038-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-038-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-038-accent:oklch(0.55 0.14 140);
--vibeui-inputgroup-038-denied:oklch(0.56 0.19 25);
--vibeui-inputgroup-038-radius:0.75rem;
--vibeui-inputgroup-038-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-038"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-038-surface);
border:1px solid var(--vibeui-inputgroup-038-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-038-font);color:var(--vibeui-inputgroup-038-fg);
}
[data-vibeui-block="inputgroup-038"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-038"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-038"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-038"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-038-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-038"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-038-radius) 0 0 var(--vibeui-inputgroup-038-radius);
}
[data-vibeui-block="inputgroup-038"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-038-radius) var(--vibeui-inputgroup-038-radius) 0;
}
[data-vibeui-block="inputgroup-038"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-038"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-038-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-038-accent);
}
[data-vibeui-block="inputgroup-038"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-038-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-038"] input:disabled{color:var(--vibeui-inputgroup-038-muted)}
[data-vibeui-block="inputgroup-038"] [data-part="locate"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-038-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-038"] [data-part="locate"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-038-accent) 14%,var(--vibeui-inputgroup-038-fixed));
}
[data-vibeui-block="inputgroup-038"] [data-part="locate"]:disabled{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="inputgroup-038"] [data-part="locate"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-038"] [data-part="locate"] [data-part="spinner"]{
animation:vibeui-inputgroup-038-spin 0.8s linear infinite;
}
[data-vibeui-block="inputgroup-038"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-038-muted);
}
[data-vibeui-block="inputgroup-038"] [data-part="status"][data-status="denied"],
[data-vibeui-block="inputgroup-038"] [data-part="status"][data-status="unsupported"]{
color:var(--vibeui-inputgroup-038-denied);font-weight:600;
}
[data-vibeui-block="inputgroup-038"] [data-part="status"][data-status="done"]{
color:var(--vibeui-inputgroup-038-accent);font-weight:600;
}
@keyframes vibeui-inputgroup-038-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="inputgroup-038"] *{transition:none!important}
[data-vibeui-block="inputgroup-038"] [data-part="spinner"]{animation:none!important}
}
`

/**
 * Сцепка «адрес + геолокация»: кнопка справа запрашивает координаты через
 * Geolocation API и подставляет их в поле как текст, статус снизу различает
 * отказ доступа и отсутствие поддержки API. Один файл, ноль зависимостей.
 */
export function Inputgroup038({
  name = "address",
  label = "Адрес доставки",
  placeholder = "Город, улица, дом",
  defaultValue = "",
  onChange,
  onLocate,
  hint = "Определите адрес автоматически или введите его вручную.",
  accent,
  className,
  style,
  ...props
}: Inputgroup038Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [status, setStatus] = useState<Status>("idle")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-038-accent": accent } : null),
    ...style,
  } as CSSProperties

  const locate = () => {
    if (status === "locating") return

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported")
      return
    }

    setStatus("locating")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const text = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        setValue(text)
        onChange?.(text)
        onLocate?.(latitude, longitude)
        setStatus("done")
        field.current?.focus()
      },
      () => {
        setStatus("denied")
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <>
      <style href="vibeui-inputgroup-038" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-038"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={value}
            disabled={status === "locating"}
            aria-describedby={`${id}-status`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
              setStatus("idle")
            }}
          />
          <button
            type="button"
            data-part="locate"
            disabled={status === "locating"}
            onClick={locate}
          >
            {status === "locating" ? (
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
                  d="M8 14.5S13 9.8 13 6.3A5 5 0 0 0 3 6.3C3 9.8 8 14.5 8 14.5Z"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="6.3" r="1.7" />
              </svg>
            )}
            {status === "locating" ? "Ищем…" : "Определить"}
          </button>
        </div>
        <p
          data-part="status"
          id={`${id}-status`}
          data-status={status}
          aria-live="polite"
        >
          {status === "idle" ? hint : STATUS_TEXT[status]}
        </p>
      </div>
    </>
  )
}
