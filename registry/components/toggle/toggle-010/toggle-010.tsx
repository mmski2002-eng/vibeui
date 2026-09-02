"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  /** Подписи состояния по ключам on и off. */
  stateText?: Record<string, string>
  /** Имена кнопки по ключам on и off: что произойдёт по нажатию. */
  actionText?: Record<string, string>
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кнопка звука с тремя столбиками эквалайзера вместо
// значка-волны. Столбики анимированы, только пока звук включён, а рядом
// постоянно видна подпись состояния — не всплывающая, а часть разметки.
const STYLES = `
:where([data-vibeui-block="toggle-010"]){
--vibeui-toggle-010-bg:transparent;
--vibeui-toggle-010-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-010-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-toggle-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-toggle-010-accent:light-dark(oklch(0.58 0.17 250),oklch(0.76 0.14 250));
--vibeui-toggle-010-off:light-dark(oklch(0.7 0.01 265),oklch(0.48 0.012 265));
--vibeui-toggle-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-010"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:19rem;padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toggle-010-border);border-radius:0.875rem;
background:var(--vibeui-toggle-010-bg);color:var(--vibeui-toggle-010-fg);
font-family:var(--vibeui-toggle-010-font);
}
[data-vibeui-block="toggle-010"] *{box-sizing:border-box}
[data-vibeui-block="toggle-010"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:flex-end;justify-content:center;gap:0.1875rem;
width:2.75rem;height:2.75rem;padding:0;
border:1px solid var(--vibeui-toggle-010-border);border-radius:0.75rem;
background:var(--vibeui-toggle-010-bg);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="toggle-010"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-010-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-010"] [data-part="bar"]{
display:block;width:0.1875rem;border-radius:9999px;
background:var(--vibeui-toggle-010-off);height:0.5rem;
transition:background-color .16s ease,height .16s ease;
}
/* Три столбика анимированы вразнобой только при включённом звуке: полная
   тишина — это неподвижные столбики одной высоты, а не пустой значок. */
[data-vibeui-block="toggle-010"] button[aria-pressed="false"] [data-part="bar"]{
background:var(--vibeui-toggle-010-accent);
animation:vibeui-toggle-010-wave 0.9s ease-in-out infinite;
}
[data-vibeui-block="toggle-010"] button[aria-pressed="false"] [data-part="bar"]:nth-child(1){animation-delay:0s}
[data-vibeui-block="toggle-010"] button[aria-pressed="false"] [data-part="bar"]:nth-child(2){animation-delay:.18s}
[data-vibeui-block="toggle-010"] button[aria-pressed="false"] [data-part="bar"]:nth-child(3){animation-delay:.36s}
[data-vibeui-block="toggle-010"] button[aria-pressed="true"] [data-part="bar"]{height:0.25rem}
[data-vibeui-block="toggle-010"] [data-part="text"]{flex:1;min-width:0}
[data-vibeui-block="toggle-010"] [data-part="state"]{
margin:0;font-size:0.875rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="toggle-010"] [data-part="hint"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-toggle-010-muted);
}
@keyframes vibeui-toggle-010-wave{
0%,100%{height:0.5rem}
50%{height:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-010"] *{animation:none!important;transition:none!important}}
`

const STATE_TEXT: Record<string, string> = {
  on: "Звук выключен",
  off: "Звук включён",
}

const ACTION_TEXT: Record<string, string> = {
  on: "Включить звук",
  off: "Выключить звук",
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
 * Кнопка звука со столбиками эквалайзера и постоянной подписью состояния
 * рядом. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toggle010({
  label = "Звук в плеере",
  stateText = STATE_TEXT,
  actionText = ACTION_TEXT,
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle010Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const key = pressed ? "on" : "off"

  const palette = {
    ...(accent ? { "--vibeui-toggle-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-010"
        className={className}
        style={palette}
      >
        <button
          type="button"
          aria-pressed={pressed}
          aria-label={actionText[key] ?? ACTION_TEXT[key]}
          onClick={() => {
            setPressed(!pressed)
            onChange?.(!pressed)
          }}
        >
          <span data-part="bar" aria-hidden="true" />
          <span data-part="bar" aria-hidden="true" />
          <span data-part="bar" aria-hidden="true" />
        </button>
        <div data-part="text">
          <p data-part="state" role="status">
            {stateText[key] ?? STATE_TEXT[key]}
          </p>
          <p data-part="hint">{label}</p>
        </div>
      </div>
    </>
  )
}
