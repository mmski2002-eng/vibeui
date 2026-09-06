"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup034Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  hint?: string
  /** Подписи кнопки: ключи show и hide. */
  toggleText?: Record<string, string>
  /** Подсказка, пока ключ открыт на экране. */
  visibleHint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const TOGGLE_TEXT: Record<string, string> = {
  show: "Показать",
  hide: "Скрыть",
}

const VISIBLE_HINT = "Ключ виден на экране — не оставляйте его так надолго."

// Идея компонента: секрет по умолчанию скрыт типом password — это системная
// маскировка браузера, а не самодельные точки поверх текста, поэтому
// работает менеджер паролей и автозаполнение. Кнопка справа переключает тип
// поля и явно объявляет своё состояние через aria-pressed, а не только меняет
// иконку. Показ не запоминается между перезагрузками — при следующем визите
// ключ снова скрыт.
const STYLES = `
:where([data-vibeui-block="inputgroup-034"]){
--vibeui-inputgroup-034-surface:transparent;
--vibeui-inputgroup-034-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-inputgroup-034-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-034-muted:color-mix(in oklab,var(--vibeui-inputgroup-034-fg) 68%,transparent);
--vibeui-inputgroup-034-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-034-fixed:light-dark(oklch(0.965 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-034-border:light-dark(oklch(0.86 0 265),oklch(0.42 0 265));
--vibeui-inputgroup-034-accent:light-dark(oklch(0.55 0.15 25),oklch(0.76 0.14 25));
--vibeui-inputgroup-034-radius:0.75rem;
--vibeui-inputgroup-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-034-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-034"]{color-scheme:dark}
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
  toggleText = TOGGLE_TEXT,
  visibleHint = VISIBLE_HINT,
  background = "",
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
    ...(background
      ? {
          "--vibeui-inputgroup-034-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggleKey = visible ? "hide" : "show"

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
        data-slot="input-group"
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
                <path
                  d="M2 8s2.2-4.5 6-4.5S14 8 14 8s-2.2 4.5-6 4.5S2 8 2 8Z"
                  strokeLinejoin="round"
                />
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
                <path
                  d="M1.5 8S3.7 3.5 8 3.5 14.5 8 14.5 8 12.3 12.5 8 12.5 1.5 8 1.5 8Z"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="8" r="2" />
              </svg>
            )}
            {toggleText[toggleKey] ?? TOGGLE_TEXT[toggleKey]}
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`} data-visible={visible}>
          {visible ? visibleHint : hint}
        </p>
      </div>
    </>
  )
}
