"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Autocomplete008Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  domains?: string[]
  defaultValue?: string
  /** Строка рядом с клавишей Tab. {domain} — домен целиком. */
  acceptHint?: string
  /** Строка, пока дописывать нечего. */
  idleHint?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: почта дописывается прямо в поле. Хвост домена показан
// серым за курсором и принимается Tab — список из пяти строк ради «gmail.com»
// избыточен, а опечатка в домене стоит письма. Подсказка появляется только
// после «@»: до собаки угадывать нечего.
const STYLES = `
:where([data-vibeui-block="autocomplete-008"]){
--vibeui-autocomplete-008-bg:transparent;
--vibeui-autocomplete-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-008-muted:color-mix(in oklab,var(--vibeui-autocomplete-008-fg) 68%,transparent);
--vibeui-autocomplete-008-ghost:light-dark(oklch(0.72 0 265),oklch(0.53 0 265));
--vibeui-autocomplete-008-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-008-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-008-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-autocomplete-008-radius:0.625rem;
--vibeui-autocomplete-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-008"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-008-bg);
border:1px solid var(--vibeui-autocomplete-008-border);
border-radius:calc(var(--vibeui-autocomplete-008-radius) + 0.25rem);
color:var(--vibeui-autocomplete-008-fg);
font-family:var(--vibeui-autocomplete-008-font);
}
[data-vibeui-block="autocomplete-008"] label{font-size:0.8125rem;font-weight:600}
/* Подложка и рамка живут на обёртке, а поле прозрачно: непрозрачный инпут
   закрыл бы собой слой с хвостом. */
[data-vibeui-block="autocomplete-008"] [data-part="field"]{
position:relative;display:block;
border:1px solid var(--vibeui-autocomplete-008-border);
border-radius:var(--vibeui-autocomplete-008-radius);
background:var(--vibeui-autocomplete-008-field);
}
[data-vibeui-block="autocomplete-008"] [data-part="field"]:focus-within{
outline:2px solid var(--vibeui-autocomplete-008-accent);outline-offset:1px;border-color:transparent;
}
/* Тень и поле обязаны совпасть по шрифту и отступам до пикселя: любое
   расхождение — и хвост уезжает относительно набранного. */
[data-vibeui-block="autocomplete-008"] [data-part="ghost"],
[data-vibeui-block="autocomplete-008"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid transparent;border-radius:var(--vibeui-autocomplete-008-radius);
font-family:inherit;font-size:0.875rem;line-height:2.375rem;
letter-spacing:normal;white-space:pre;
}
[data-vibeui-block="autocomplete-008"] [data-part="ghost"]{
position:absolute;inset:0;pointer-events:none;overflow:hidden;
color:var(--vibeui-autocomplete-008-ghost);
}
[data-vibeui-block="autocomplete-008"] [data-part="ghost"] i{color:transparent;font-style:normal}
[data-vibeui-block="autocomplete-008"] input{
position:relative;background:transparent;color:inherit;
}
[data-vibeui-block="autocomplete-008"] input::placeholder{color:var(--vibeui-autocomplete-008-muted)}
[data-vibeui-block="autocomplete-008"] input:focus{outline:none}
[data-vibeui-block="autocomplete-008"] [data-part="hint"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-autocomplete-008-muted);
}
[data-vibeui-block="autocomplete-008"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-autocomplete-008-border);
font-family:inherit;font-size:0.6875rem;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-008"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DOMAINS = [
  "gmail.com",
  "yandex.ru",
  "mail.ru",
  "outlook.com",
  "icloud.com",
  "proton.me",
]

function completion(value: string, domains: string[]) {
  const at = value.indexOf("@")
  if (at < 0) return ""
  const typed = value.slice(at + 1)
  if (!typed) return domains[0].slice(typed.length)
  const found = domains.find(
    (domain) => domain.startsWith(typed) && domain !== typed,
  )
  return found ? found.slice(typed.length) : ""
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
 * Почта с дописыванием домена: серый хвост принимается Tab.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete008({
  label = "Почта",
  placeholder = "имя@почта",
  domains = DEFAULT_DOMAINS,
  defaultValue = "",
  acceptHint = "допишет домен {domain}",
  idleHint = "После @ поле допишет домен",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const rest = completion(value, domains)

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!rest) return
    const atEnd =
      event.currentTarget.selectionStart === value.length &&
      event.currentTarget.selectionEnd === value.length
    if (event.key === "Tab" || (event.key === "ArrowRight" && atEnd)) {
      event.preventDefault()
      update(value + rest)
    }
  }

  return (
    <>
      <style href="vibeui-autocomplete-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-008"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <span data-part="field">
          <span data-part="ghost" aria-hidden="true">
            <i>{value}</i>
            {rest}
          </span>
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => update(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </span>
        <span data-part="hint" id={`${id}-hint`}>
          {rest ? (
            <>
              <kbd>Tab</kbd>{" "}
              {acceptHint.replace(
                "{domain}",
                `${value.slice(value.indexOf("@") + 1)}${rest}`,
              )}
            </>
          ) : (
            idleHint
          )}
        </span>
      </div>
    </>
  )
}
