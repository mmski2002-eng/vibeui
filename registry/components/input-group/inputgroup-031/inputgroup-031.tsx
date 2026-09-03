"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup031Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  maxLength?: number
  required?: boolean
  onChange?: (value: string) => void
  hint?: string
  /** Подпись обязательности рядом со звёздочкой. */
  requiredText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: обязательность поля и остаток символов — обе метки о
// границах допустимого, поэтому обе стоят рядом со значением, а не в
// разных углах карточки. Звёздочка у label — не единственный носитель
// обязательности: рядом текст «обязательное» для тех, кто не читает
// звёздочки как значок. Счётчик — фиксированный сегмент слева от поля, а
// не подпись под ним, и меняет цвет на предупреждающий, когда лимит
// исчерпан.
const STYLES = `
:where([data-vibeui-block="inputgroup-031"]){
--vibeui-inputgroup-031-surface:transparent;
--vibeui-inputgroup-031-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-031-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-031-muted:color-mix(in oklab,var(--vibeui-inputgroup-031-fg) 68%,transparent);
--vibeui-inputgroup-031-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-031-fixed:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-031-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-031-accent:light-dark(oklch(0.55 0.16 25),oklch(0.76 0.15 25));
--vibeui-inputgroup-031-required:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-inputgroup-031-limit:light-dark(oklch(0.56 0.19 25),oklch(0.75 0.16 25));
--vibeui-inputgroup-031-radius:0.75rem;
--vibeui-inputgroup-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-031"]{color-scheme:dark}
[data-vibeui-block="inputgroup-031"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-031-surface);
border:1px solid var(--vibeui-inputgroup-031-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-031-font);color:var(--vibeui-inputgroup-031-fg);
}
[data-vibeui-block="inputgroup-031"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-031"] [data-part="label"]{
display:flex;align-items:baseline;gap:0.3125rem;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="inputgroup-031"] [data-part="label"] [data-part="star"]{
color:var(--vibeui-inputgroup-031-required);
}
[data-vibeui-block="inputgroup-031"] [data-part="label"] [data-part="req"]{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-inputgroup-031-required);
}
[data-vibeui-block="inputgroup-031"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-031"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-031-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-031"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-031-radius) 0 0 var(--vibeui-inputgroup-031-radius);
}
[data-vibeui-block="inputgroup-031"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-031-radius) var(--vibeui-inputgroup-031-radius) 0;
}
[data-vibeui-block="inputgroup-031"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-031"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-031-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-031-accent);
}
[data-vibeui-block="inputgroup-031"] [data-part="counter"]{
display:flex;align-items:center;justify-content:center;flex:none;width:3.75rem;
background:var(--vibeui-inputgroup-031-fixed);
font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-inputgroup-031-muted);
}
[data-vibeui-block="inputgroup-031"] [data-part="counter"][data-limit="true"]{
color:var(--vibeui-inputgroup-031-limit);
}
[data-vibeui-block="inputgroup-031"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-031-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-031"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-031-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-031"] *{transition:none!important}}
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
 * Сцепка «обязательность + счётчик + поле»: метка со звёздочкой и
 * текстом «обязательное», фиксированный сегмент счётчика слева от поля
 * меняет цвет, когда лимит символов исчерпан.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup031({
  name = "title",
  label = "Заголовок объявления",
  placeholder = "Например, Диван угловой б/у",
  defaultValue = "",
  maxLength = 60,
  required = true,
  onChange,
  hint = "Заголовок обязателен для публикации, счётчик слева показывает остаток символов.",
  requiredText = "обязательное",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup031Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-031-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-031-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const atLimit = value.length >= maxLength

  return (
    <>
      <style href="vibeui-inputgroup-031" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-031"
        className={className}
        style={palette}
      >
        <div data-part="label">
          <label htmlFor={id}>{label}</label>
          {required ? (
            <>
              <span data-part="star" aria-hidden="true">
                *
              </span>
              <span data-part="req">{requiredText}</span>
            </>
          ) : null}
        </div>
        <div data-part="group">
          <span data-part="counter" data-limit={atLimit} aria-hidden="true">
            {value.length}/{maxLength}
          </span>
          <input
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            aria-required={required}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
