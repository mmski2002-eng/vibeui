"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  limit?: number
  /** Текст, с которого поле начинает жизнь. */
  defaultValue?: string
  /** Подписи состояний: ok — в пределах лимита, over — превышение. */
  stateText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: поле с ограничением, которое не обрезает текст молча.
// maxlength не стоит: он не даёт дописать даже пробел и не объясняет, почему
// клавиатура перестала работать. Вместо этого счётчик краснеет, а лишнее
// подсвечивается — человек сам решает, что сократить.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="textarea-002"]){
--vibeui-textarea-002-bg:transparent;
--vibeui-textarea-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-textarea-002-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-textarea-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-textarea-002-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-textarea-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-textarea-002-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-textarea-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-002"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-002-bg);
border:1px solid var(--vibeui-textarea-002-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-002-font);color:var(--vibeui-textarea-002-fg);
}
[data-vibeui-block="textarea-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-002"] textarea{
box-sizing:border-box;width:100%;min-height:5.5rem;resize:vertical;
padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-textarea-002-border);border-radius:0.625rem;
background:var(--vibeui-textarea-002-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="textarea-002"] textarea:focus-visible{
outline:2px solid var(--vibeui-textarea-002-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="textarea-002"][data-over="true"] textarea{border-color:var(--vibeui-textarea-002-danger)}
[data-vibeui-block="textarea-002"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-textarea-002-muted);
}
/* Счётчик краснеет, но текст не обрезается: сокращать решает человек. */
[data-vibeui-block="textarea-002"] [data-part="count"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="textarea-002"][data-over="true"] [data-part="count"]{color:var(--vibeui-textarea-002-danger);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-002"] *{animation:none!important;transition:none!important}}
`

const START =
  "Карточка товара с квадратным кадром: кнопка «в корзину» — отдельная цель поверх ссылки."

const STATE_TEXT: Record<string, string> = {
  ok: "Коротко и по делу",
  over: "Слишком длинно — сократите",
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
 * Поле с ограничением: счётчик краснеет, но текст не обрезается молча.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea002({
  label = "Описание компонента",
  placeholder = "Что делает компонент и в чём его идея",
  limit = 180,
  defaultValue = START,
  stateText = STATE_TEXT,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Textarea002Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const over = value.length > limit

  const palette = {
    ...(accent ? { "--vibeui-textarea-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-002"
        data-over={over}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          aria-describedby={`${id}-count`}
          aria-invalid={over}
          onChange={(event) => {
            setValue(event.target.value)
            onChange?.(event.target.value)
          }}
        />
        <p data-part="foot">
          <span>
            {over
              ? (stateText.over ?? STATE_TEXT.over)
              : (stateText.ok ?? STATE_TEXT.ok)}
          </span>
          <span data-part="count" id={`${id}-count`} role="status">
            {value.length} / {limit}
          </span>
        </p>
      </div>
    </>
  )
}
