"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox018Shape = "star" | "flag" | "bolt"

export type Checkbox018Option = {
  id: string
  label: string
  shape: Checkbox018Shape
}

export type Checkbox018Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox018Option[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: вместо галочки — фигура по смыслу отметки. Звезда,
// флажок и молния вырезаны из залитого квадрата через clip-path, поэтому
// иконочная библиотека не нужна. Невыбранное состояние показывает ту же
// фигуру приглушённой: пустая рамка не подсказала бы, что будет после клика.
const STYLES = `
:where([data-vibeui-block="checkbox-018"]){
--vibeui-checkbox-018-bg:oklch(1 0 0);
--vibeui-checkbox-018-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-018-muted:oklch(0.58 0.014 265);
--vibeui-checkbox-018-border:oklch(0.9 0.006 265);
--vibeui-checkbox-018-idle:oklch(0.87 0.008 265);
--vibeui-checkbox-018-surface:oklch(0.975 0.003 265);
--vibeui-checkbox-018-accent:oklch(0.64 0.16 65);
--vibeui-checkbox-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Чекбоксы с фигурой вместо галочки: звезда, флажок и молния вырезаны
 * через clip-path. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox018({
  legend = "Отметки для карточки",
  options = DEFAULT_OPTIONS,
  defaultValue = ["favorite"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox018Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-018-accent": accent } : null),
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
            ? "Отметок нет"
            : `Отметок: ${value.length} из ${options.length}`}
        </p>
      </fieldset>
    </>
  )
}
