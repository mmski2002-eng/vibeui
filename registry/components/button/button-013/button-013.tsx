"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button013Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  options?: string[]
  defaultValue?: string
  label?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, дорожка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сегментированный переключатель — выбор одного из немногих.
// Внутри настоящие radio, а не кнопки: стрелки, Home/End и объявление
// «выбрано 2 из 3» браузер даёт сам. Подложка выбранного двигается за
// значением, но состояние держит форма, а не анимация.
const STYLES = `
:where([data-vibeui-block="button-013"]){
--vibeui-button-013-fg:light-dark(oklch(0.3 0 265),oklch(0.94 0 265));
--vibeui-button-013-muted:color-mix(in oklab,var(--vibeui-button-013-fg) 68%,transparent);
--vibeui-button-013-bg:transparent;
--vibeui-button-013-on:light-dark(oklch(1 0 0),oklch(0.34 0 265));
--vibeui-button-013-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-013-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-013-radius:0.625rem;
--vibeui-button-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-013"]{color-scheme:dark}
[data-vibeui-block="button-013"]{
display:inline-flex;align-items:center;gap:0.125rem;
padding:0.1875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-013-border);
border-radius:calc(var(--vibeui-button-013-radius) + 0.1875rem);
background:var(--vibeui-button-013-bg);
font-family:var(--vibeui-button-013-font);
}
[data-vibeui-block="button-013"] label{
position:relative;display:inline-flex;align-items:center;justify-content:center;
height:1.875rem;padding:0 0.75rem;border-radius:var(--vibeui-button-013-radius);
color:var(--vibeui-button-013-muted);font-size:0.8125rem;font-weight:600;
cursor:pointer;white-space:nowrap;
transition:color .16s ease,background-color .16s ease;
}
/* Настоящие radio под подписями: стрелки и объявление позиции — от браузера. */
[data-vibeui-block="button-013"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;
opacity:0;cursor:pointer;
}
[data-vibeui-block="button-013"] label:has(input:checked){
background:var(--vibeui-button-013-on);color:var(--vibeui-button-013-fg);
box-shadow:0 1px 2px light-dark(oklch(0.2 0 265 / 12%),oklch(0 0 0 / 40%));
}
[data-vibeui-block="button-013"] label:has(input:focus-visible){outline:2px solid var(--vibeui-button-013-accent);outline-offset:2px}
[data-vibeui-block="button-013"] label:hover{color:var(--vibeui-button-013-fg);background:color-mix(in oklab,var(--vibeui-button-013-fg) 7%,transparent)}
[data-vibeui-block="button-013"] label:has(input:checked):hover{background:var(--vibeui-button-013-on)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["День", "Неделя", "Месяц"]

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
 * Сегментированный переключатель на настоящих radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button013({
  options = DEFAULT_OPTIONS,
  defaultValue = "Неделя",
  label = "Период",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Button013Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-button-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-013"
        role="radiogroup"
        aria-label={label}
        className={className}
        style={palette}
      >
        {options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={id}
              value={option}
              checked={value === option}
              onChange={() => {
                setValue(option)
                onChange?.(option)
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </>
  )
}
