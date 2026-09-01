"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup025Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  buttonLabel?: string
  onChange?: (value: string) => void
  hint?: string
  accent?: string
}

type Status = "idle" | "pasted" | "denied"

const STATUS_TEXT: Record<Status, string> = {
  idle: "Поле можно заполнить вручную или вставить значение из буфера обмена",
  pasted: "Значение вставлено из буфера обмена",
  denied: "Нет доступа к буферу обмена — вставьте значение сочетанием клавиш",
}

// Идея компонента: у поля один явный способ получить значение из буфера —
// кнопка справа, а не догадка пользователя про Ctrl+V. Кнопка не блокирует
// ручной ввод: buffer API может быть недоступен (нет разрешения, не HTTPS,
// старый браузер), и тогда статус прямо говорит, что делать дальше, а не
// молчит. Успешная вставка возвращает фокус в поле и ставит курсор в конец,
// чтобы можно было сразу продолжить редактировать значение.
const STYLES = `
:where([data-vibeui-block="inputgroup-025"]){
--vibeui-inputgroup-025-surface:oklch(1 0 0);
--vibeui-inputgroup-025-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-025-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-025-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-025-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-025-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-025-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-025-accent:oklch(0.55 0.14 250);
--vibeui-inputgroup-025-denied:oklch(0.56 0.19 25);
--vibeui-inputgroup-025-radius:0.75rem;
--vibeui-inputgroup-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-025"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-025-surface);
border:1px solid var(--vibeui-inputgroup-025-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-025-font);color:var(--vibeui-inputgroup-025-fg);
}
[data-vibeui-block="inputgroup-025"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-025"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-025"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-025"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-025-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-025"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-025-radius) 0 0 var(--vibeui-inputgroup-025-radius);
}
[data-vibeui-block="inputgroup-025"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-025-radius) var(--vibeui-inputgroup-025-radius) 0;
}
[data-vibeui-block="inputgroup-025"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-025"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-025-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-025-accent);
}
[data-vibeui-block="inputgroup-025"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-025-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-025"] [data-part="paste"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-025-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-025"] [data-part="paste"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-025-accent) 14%,var(--vibeui-inputgroup-025-fixed));
}
[data-vibeui-block="inputgroup-025"] [data-part="paste"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-025"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-025-muted);
}
[data-vibeui-block="inputgroup-025"] [data-part="status"][data-status="pasted"]{
color:var(--vibeui-inputgroup-025-accent);font-weight:600;
}
[data-vibeui-block="inputgroup-025"] [data-part="status"][data-status="denied"]{
color:var(--vibeui-inputgroup-025-denied);font-weight:600;
}
[data-vibeui-block="inputgroup-025"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-025-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-025"] *{transition:none!important}}
`

/**
 * Сцепка «поле + вставка из буфера»: кнопка справа читает буфер обмена
 * через Clipboard API, статус снизу озвучивает результат и подсказывает
 * запасной способ, если доступа к буферу нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup025({
  name = "value",
  label = "Ссылка на профиль",
  placeholder = "Вставьте или введите значение",
  defaultValue = "",
  buttonLabel = "Вставить из буфера",
  onChange,
  hint = "Кнопка запрашивает доступ к буферу обмена браузера — без него значение вводится вручную.",
  accent,
  className,
  style,
  ...props
}: Inputgroup025Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [status, setStatus] = useState<Status>("idle")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setValue(text)
      onChange?.(text)
      setStatus("pasted")
      const input = field.current
      input?.focus()
      input?.setSelectionRange(text.length, text.length)
    } catch {
      setStatus("denied")
      field.current?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-inputgroup-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-025"
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
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
              setStatus("idle")
            }}
          />
          <button type="button" data-part="paste" onClick={paste}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <rect x="4.5" y="3" width="7" height="11" rx="1.2" />
              <path
                d="M6.5 3V2.2a.7.7 0 0 1 .7-.7h1.6a.7.7 0 0 1 .7.7V3"
                strokeLinecap="round"
              />
            </svg>
            {buttonLabel}
          </button>
        </div>
        <p
          data-part="status"
          id={`${id}-status`}
          data-status={status}
          aria-live="polite"
        >
          {STATUS_TEXT[status]}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
