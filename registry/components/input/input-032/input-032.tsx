"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Input032Props = Omit<ComponentProps<"input">, "type"> & {
  label?: string
  /** Подсказка в пустом поле. */
  placeholder?: string
  /** Текст предупреждения, пока Caps Lock включён и поле в фокусе. */
  warnText?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пароль набирают вслепую, и Caps Lock тихо меняет регистр
// всех букв — самая незаметная причина «неверный пароль». Браузер эту
// клавишу никак не показывает сам, поэтому предупреждение держит
// getModifierState на каждое нажатие и гаснет вместе с фокусом или клавишей:
// оно не должно жить дольше самой причины.
const STYLES = `
:where([data-vibeui-block="input-032"]){
--vibeui-input-032-surface:transparent;
--vibeui-input-032-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-input-032-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-032-muted:color-mix(in oklab,var(--vibeui-input-032-fg) 68%,transparent);
--vibeui-input-032-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-032-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-input-032-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-input-032-warn:light-dark(oklch(0.58 0.16 75),oklch(0.78 0.14 75));
--vibeui-input-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-032"]{color-scheme:dark}
[data-vibeui-block="input-032"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-032-surface);
border:1px solid var(--vibeui-input-032-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-032-font);color:var(--vibeui-input-032-fg);
}
[data-vibeui-block="input-032"] *{box-sizing:border-box}
[data-vibeui-block="input-032"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-032"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-032-field);
border:1px solid var(--vibeui-input-032-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-032"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-032-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-032-accent) 18%,transparent);
}
[data-vibeui-block="input-032"][data-warn="1"] [data-part="frame"]{
border-color:var(--vibeui-input-032-warn);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-032-warn) 16%,transparent);
}
[data-vibeui-block="input-032"] input{
flex:1;min-inline-size:0;inline-size:100%;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;letter-spacing:0.02em;
}
[data-vibeui-block="input-032"] input:focus{outline:none}
[data-vibeui-block="input-032"] [data-part="warn"]{
margin:0;display:flex;align-items:center;gap:0.3125rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-032-warn);font-weight:600;
}
[data-vibeui-block="input-032"] [data-part="warn"] svg{flex:none;width:0.875rem;height:0.875rem;display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-032"] *{animation:none!important;transition:none!important}}
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
 * Пароль с предупреждением о Caps Lock: подсказка появляется вместе с
 * фокусом и включённой клавишей, а гаснет с любой из них.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input032({
  label = "Пароль",
  placeholder = "Не короче восьми символов",
  warnText = "Включён Caps Lock — буквы наберутся в другом регистре.",
  background = "",
  accent,
  id,
  className,
  style,
  onFocus,
  onBlur,
  onKeyUp,
  onKeyDown,
  ...props
}: Input032Props) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const warnId = `${inputId}-warn`
  const [focused, setFocused] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const showWarn = focused && capsOn

  const palette = {
    ...(accent ? { "--vibeui-input-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-032-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // getModifierState — единственный надёжный способ узнать про Caps Lock:
  // ни value, ни onChange о нажатой клавише ничего не знают.
  const track = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsOn(event.getModifierState("CapsLock"))
  }

  return (
    <>
      <style href="vibeui-input-032" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="input"
        data-vibeui-block="input-032"
        data-warn={showWarn ? "1" : "0"}
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={inputId}>{label}</label>
        <span data-part="frame">
          <input
            {...props}
            id={inputId}
            type="password"
            placeholder={placeholder}
            aria-describedby={showWarn ? warnId : undefined}
            onFocus={(event) => {
              setFocused(true)
              onFocus?.(event)
            }}
            onBlur={(event) => {
              setFocused(false)
              setCapsOn(false)
              onBlur?.(event)
            }}
            onKeyUp={(event) => {
              track(event)
              onKeyUp?.(event)
            }}
            onKeyDown={(event) => {
              track(event)
              onKeyDown?.(event)
            }}
          />
        </span>
        {showWarn ? (
          <p data-part="warn" id={warnId} role="status">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M8 2.5 14 13.5H2z" strokeLinejoin="round" />
              <path d="M8 6.5v3M8 11.5v.01" strokeLinecap="round" />
            </svg>
            {warnText}
          </p>
        ) : null}
      </div>
    </>
  )
}
