"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox018Shape = "star" | "flag" | "bolt"

export type Checkbox018Option = {
  id: string
  label: string
  shape: Checkbox018Shape
}

export type Checkbox018Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox018Option[]
  defaultValue?: string[]
  /** Строка под рядом, когда отметок нет. */
  emptyText?: string
  /** Строка под рядом со счётчиком. {count} — отмечено, {total} — всего. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вместо галочки — фигура по смыслу отметки. Звезда,
// флажок и молния вырезаны из залитого квадрата через clip-path, поэтому
// иконочная библиотека не нужна. Невыбранное состояние показывает ту же
// фигуру приглушённой: пустая рамка не подсказала бы, что будет после клика.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-018"]){
--vibeui-checkbox-018-bg:transparent;
--vibeui-checkbox-018-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-checkbox-018-muted:color-mix(in oklab,var(--vibeui-checkbox-018-fg) 68%,transparent);
--vibeui-checkbox-018-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-checkbox-018-idle:light-dark(oklch(0.87 0 265),oklch(0.45 0 265));
--vibeui-checkbox-018-surface:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-checkbox-018-accent:light-dark(oklch(0.64 0.16 65),oklch(0.76 0.15 65));
--vibeui-checkbox-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-018"]{color-scheme:dark}
[data-vibeui-block="checkbox-018"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.875rem;border:1px solid var(--vibeui-checkbox-018-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-018-bg);
font-family:var(--vibeui-checkbox-018-font);color:var(--vibeui-checkbox-018-fg);
}
[data-vibeui-block="checkbox-018"] legend{float:left;width:100%;padding:0 0 0.5rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="checkbox-018"] label{
clear:both;flex:1 1 5.5rem;
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
padding:0.625rem 0.5rem;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-checkbox-018-surface);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-018-border);
font-size:0.75rem;text-align:center;
transition:background-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="checkbox-018"] label:has(input:checked){
box-shadow:inset 0 0 0 1.5px var(--vibeui-checkbox-018-accent);
background:var(--vibeui-checkbox-018-bg);
}
[data-vibeui-block="checkbox-018"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-checkbox-018-accent);outline-offset:2px;
}
[data-vibeui-block="checkbox-018"] input{
appearance:none;position:absolute;width:1px;height:1px;margin:0;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
/* Фигура вырезается из закрашенного квадрата: одна и та же геометрия
   работает и для приглушённого, и для отмеченного состояния. */
[data-vibeui-block="checkbox-018"] [data-part="icon"]{
display:block;width:1.5rem;height:1.5rem;
background:var(--vibeui-checkbox-018-idle);
transition:background-color .15s ease,transform .15s ease;
}
[data-vibeui-block="checkbox-018"] label:has(input:checked) [data-part="icon"]{
background:var(--vibeui-checkbox-018-accent);transform:scale(1.08);
}
[data-vibeui-block="checkbox-018"] [data-shape="star"]{
clip-path:polygon(50% 2%,62% 36%,98% 36%,69% 58%,80% 94%,50% 72%,20% 94%,31% 58%,2% 36%,38% 36%);
}
[data-vibeui-block="checkbox-018"] [data-shape="flag"]{
clip-path:polygon(12% 2%,88% 2%,88% 98%,50% 72%,12% 98%);
}
[data-vibeui-block="checkbox-018"] [data-shape="bolt"]{
clip-path:polygon(58% 2%,20% 54%,45% 54%,38% 98%,80% 42%,52% 42%);
}
[data-vibeui-block="checkbox-018"] [data-part="name"]{line-height:1.3}
[data-vibeui-block="checkbox-018"] label:has(input:checked) [data-part="name"]{font-weight:650}
[data-vibeui-block="checkbox-018"] [data-part="foot"]{
flex:1 1 100%;margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-checkbox-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Checkbox018Option[] = [
  { id: "favorite", label: "В избранное", shape: "star" },
  { id: "report", label: "Пометить", shape: "flag" },
  { id: "priority", label: "Срочно", shape: "bolt" },
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
 * Чекбоксы с фигурой вместо галочки: звезда, флажок и молния вырезаны
 * через clip-path. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox018({
  legend = "Отметки для карточки",
  options = DEFAULT_OPTIONS,
  defaultValue = ["favorite"],
  emptyText = "Отметок нет",
  countText = "Отметок: {count} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox018Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-018" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-018"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.id}>
            <input
              type="checkbox"
              checked={value.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
            <span
              data-part="icon"
              data-shape={option.shape}
              aria-hidden="true"
            />
            <span data-part="name">{option.label}</span>
          </label>
        ))}
        <p data-part="foot" role="status">
          {value.length === 0
            ? emptyText
            : countText
                .replace("{count}", String(value.length))
                .replace("{total}", String(options.length))}
        </p>
      </fieldset>
    </>
  )
}
