"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox012Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: string[]
  limit?: number
  defaultValue?: string[]
  /** Счётчик у полосы. {selected} — выбрано, {limit} — потолок. */
  counterText?: string
  /** Подпись, когда лимит выбран целиком. */
  fullText?: string
  /** Подпись с остатком. {left} — сколько ещё можно отметить. */
  remainingText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа с потолком выбора. На лимите невыбранные пункты
// выключаются, а счётчик заранее показывает, сколько осталось, — запрет
// объясняется до нажатия, а не после него сообщением об ошибке.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-012"]){
--vibeui-checkbox-012-surface:transparent;
--vibeui-checkbox-012-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-checkbox-012-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-checkbox-012-muted:color-mix(in oklab,var(--vibeui-checkbox-012-fg) 68%,transparent);
--vibeui-checkbox-012-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-checkbox-012-hover:light-dark(oklch(0.975 0 265),oklch(0.32 0 265));
--vibeui-checkbox-012-accent:light-dark(oklch(0.295 0 0),oklch(0.906 0 0));
--vibeui-checkbox-012-track:light-dark(oklch(0.93 0 265),oklch(0.36 0 265));
--vibeui-checkbox-012-mark:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-checkbox-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-012"]{color-scheme:dark}
[data-vibeui-block="checkbox-012"]{
display:flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.875rem;border:1px solid var(--vibeui-checkbox-012-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-012-surface);
font-family:var(--vibeui-checkbox-012-font);color:var(--vibeui-checkbox-012-fg);
}
[data-vibeui-block="checkbox-012"] legend{float:left;width:100%;padding:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="checkbox-012"] [data-part="meter"]{
clear:both;display:flex;align-items:center;gap:0.5rem;
margin:0.375rem 0 0.5rem;font-size:0.75rem;color:var(--vibeui-checkbox-012-muted);
font-variant-numeric:tabular-nums;
}
/* Полоса заполнения — вторая, невербальная подсказка о лимите: число
   замечают не все, длину — все. */
[data-vibeui-block="checkbox-012"] [data-part="track"]{
flex:1;height:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-checkbox-012-track);
}
[data-vibeui-block="checkbox-012"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-checkbox-012-accent);
transition:width .2s ease;color:oklch(from var(--vibeui-checkbox-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="checkbox-012"] label{
display:flex;align-items:center;gap:0.625rem;
min-height:2.125rem;padding:0 0.5rem;margin:0 -0.5rem;border-radius:0.5rem;
font-size:0.875rem;cursor:pointer;
transition:background-color .15s ease;
}
[data-vibeui-block="checkbox-012"] label:hover{background:var(--vibeui-checkbox-012-hover)}
/* Заблокированный лимитом пункт остаётся в списке и просто гаснет: убрать
   его было бы враньём — он доступен, как только снимут другую галку. */
[data-vibeui-block="checkbox-012"] label:has(input:disabled){
cursor:not-allowed;color:var(--vibeui-checkbox-012-muted);
}
[data-vibeui-block="checkbox-012"] label:has(input:disabled):hover{background:transparent}
[data-vibeui-block="checkbox-012"] input{
appearance:none;position:relative;flex:none;cursor:inherit;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-012-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-012-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-012"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-012-accent);color:oklch(from var(--vibeui-checkbox-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="checkbox-012"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-012-mark);
border-bottom:2px solid var(--vibeui-checkbox-012-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-012"] input:disabled{background:var(--vibeui-checkbox-012-track);border-color:transparent}
[data-vibeui-block="checkbox-012"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-012-accent);outline-offset:2px}
[data-vibeui-block="checkbox-012"] [data-part="note"]{
margin:0.5rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-checkbox-012-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Скорость загрузки",
  "Понятность интерфейса",
  "Поддержка",
  "Цена",
  "Надёжность",
  "Внешний вид",
]

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
 * Группа чекбоксов с потолком выбора: на лимите остальные выключаются,
 * счётчик показывает остаток. Один файл, ноль зависимостей.
 */
export function Checkbox012({
  legend = "Что для вас важнее всего",
  options = DEFAULT_OPTIONS,
  limit = 3,
  defaultValue = ["Цена"],
  counterText = "{selected} из {limit}",
  fullText = "Выбрано максимум. Снимите одну галочку, чтобы поставить другую.",
  remainingText = "Можно отметить ещё {left}.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox012Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const full = value.length >= limit
  const left = Math.max(0, limit - value.length)

  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-012" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-012"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <p data-part="meter">
          <span data-part="track">
            <span
              data-part="fill"
              style={{ width: `${(value.length / limit) * 100}%` }}
            />
          </span>
          <span role="status">
            {counterText
              .replace("{selected}", String(value.length))
              .replace("{limit}", String(limit))}
          </span>
        </p>
        {options.map((option) => {
          const checked = value.includes(option)

          return (
            <label key={option}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!checked && full}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          )
        })}
        <p data-part="note">
          {full ? fullText : remainingText.replace("{left}", String(left))}
        </p>
      </fieldset>
    </>
  )
}
