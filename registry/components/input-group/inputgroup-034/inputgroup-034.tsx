"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup034Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  hint?: string
  accent?: string
}

// Идея компонента: секрет по умолчанию скрыт типом password — это системная
// маскировка браузера, а не самодельные точки поверх текста, поэтому
// работает менеджер паролей и автозаполнение. Кнопка справа переключает тип
// поля и явно объявляет своё состояние через aria-pressed, а не только меняет
// иконку. Показ не запоминается между перезагрузками — при следующем визите
// ключ снова скрыт.
const STYLES = `
:where([data-vibeui-block="inputgroup-034"]){
--vibeui-inputgroup-034-surface:oklch(1 0 0);
--vibeui-inputgroup-034-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-034-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-034-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-034-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-034-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-034-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-034-accent:oklch(0.55 0.15 25);
--vibeui-inputgroup-034-radius:0.75rem;
--vibeui-inputgroup-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-034-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="inputgroup-034"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-034-surface);
border:1px solid var(--vibeui-inputgroup-034-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-034-font);color:var(--vibeui-inputgroup-034-fg);
}
[data-vibeui-block="inputgroup-034"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-034"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-034"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-034"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-034-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-034"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-034-radius) 0 0 var(--vibeui-inputgroup-034-radius);
}
[data-vibeui-block="inputgroup-034"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-034-radius) var(--vibeui-inputgroup-034-radius) 0;
}
[data-vibeui-block="inputgroup-034"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-034"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-034-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-034-accent);
}
[data-vibeui-block="inputgroup-034"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-034-field);
font-family:var(--vibeui-inputgroup-034-mono);font-size:0.8125rem;letter-spacing:0.02em;
}
[data-vibeui-block="inputgroup-034"] [data-part="toggle"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-034-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-034"] [data-part="toggle"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-034-accent) 14%,var(--vibeui-inputgroup-034-fixed));
}
[data-vibeui-block="inputgroup-034"] [data-part="toggle"] svg{width:0.9375rem;height:0.9375rem;flex:none;display:block}
[data-vibeui-block="inputgroup-034"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-034-muted);
}
[data-vibeui-block="inputgroup-034"] [data-part="hint"][data-visible="true"]{
color:var(--vibeui-inputgroup-034-accent);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-034"] *{transition:none!important}}
`

/**
 * Сцепка «поле ключа + показ/скрытие»: маскировка системная (type="password"),
 * кнопка справа явно объявляет своё состояние через aria-pressed, показ не
 * сохраняется между визитами. Один файл, ноль зависимостей, своя палитра.
 */
export function Inputgroup034({
  name = "apiKey",
  label = "API-ключ",
  defaultValue = "sk_live_4f8a2c9d1e3b7f6091ab",
  onChange,
  hint = "Ключ скрыт по умолчанию — не показывайте его на общем экране без необходимости.",
  accent,
  className,
  style,
  ...props
}: Inputgroup034Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [visible, setVisible] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-034-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = () => {
    setVisible((prev) => !prev)
    field.current?.focus()
  }

  return (
    <>
      <style href="vibeui-inputgroup-034" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-034"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            name={name}
            type={visible ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            data-part="toggle"
            aria-pressed={visible}
            onClick={toggle}
          >
            {visible ? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M2 8s2.2-4.5 6-4.5S14 8 14 8s-2.2 4.5-6 4.5S2 8 2 8Z" strokeLinejoin="round" />
                <path d="M2 2l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M1.5 8S3.7 3.5 8 3.5 14.5 8 14.5 8 12.3 12.5 8 12.5 1.5 8 1.5 8Z" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="2" />
              </svg>
            )}
            {visible ? "Скрыть" : "Показать"}
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`} data-visible={visible}>
          {visible ? "Ключ виден на экране — не оставляйте его так надолго." : hint}
        </p>
      </div>
    </>
  )
}
