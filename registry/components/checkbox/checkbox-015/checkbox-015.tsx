"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox015Props = Omit<
  ComponentProps<"form">,
  "children" | "onChange" | "onSubmit"
> & {
  legend?: string
  options?: string[]
  error?: string
  hint?: string
  /** Подпись кнопки отправки. */
  submitLabel?: string
  onSubmitValue?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ошибка не у отдельной галочки, а у всей группы —
// «отметьте хотя бы одно» относится к набору, а не к строке. Ошибочное
// состояние читается тремя способами сразу: рамка группы, знак «!» и текст
// с объяснением, что именно сделать. Одного цвета мало.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-015"]){
--vibeui-checkbox-015-bg:transparent;
--vibeui-checkbox-015-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-checkbox-015-muted:color-mix(in oklab,var(--vibeui-checkbox-015-fg) 68%,transparent);
--vibeui-checkbox-015-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-checkbox-015-accent:light-dark(oklch(0.282 0 0),oklch(0.888 0 0));
--vibeui-checkbox-015-danger:light-dark(oklch(0.55 0.2 25),oklch(0.7 0.17 25));
--vibeui-checkbox-015-danger-soft:light-dark(oklch(0.96 0.03 25),oklch(0.29 0.05 25));
--vibeui-checkbox-015-on-accent:oklch(from var(--vibeui-checkbox-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-checkbox-015-on-danger:light-dark(oklch(0.99 0.01 25),oklch(0.21 0.04 25));
--vibeui-checkbox-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-015"]{color-scheme:dark}
[data-vibeui-block="checkbox-015"]{
display:block;width:100%;max-width:21rem;box-sizing:border-box;
padding:0.9375rem;border:1px solid var(--vibeui-checkbox-015-border);border-radius:0.9375rem;
background:var(--vibeui-checkbox-015-bg);
font-family:var(--vibeui-checkbox-015-font);color:var(--vibeui-checkbox-015-fg);
}
[data-vibeui-block="checkbox-015"] fieldset{
display:flex;flex-direction:column;gap:0.125rem;
margin:0;padding:0.625rem;border:1.5px solid var(--vibeui-checkbox-015-border);border-radius:0.75rem;
transition:border-color .15s ease,background-color .15s ease;
}
/* Ошибка на группе, а не на строке: требование «хотя бы одно» относится
   ко всему набору. */
[data-vibeui-block="checkbox-015"] fieldset[data-invalid="true"]{
border-color:var(--vibeui-checkbox-015-danger);
background:var(--vibeui-checkbox-015-danger-soft);
}
[data-vibeui-block="checkbox-015"] legend{
float:left;width:100%;padding:0 0 0.375rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="checkbox-015"] label{
clear:both;display:flex;align-items:center;gap:0.625rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-015"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-015-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-015-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-015"] fieldset[data-invalid="true"] input{border-color:var(--vibeui-checkbox-015-danger)}
[data-vibeui-block="checkbox-015"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-015-accent);color:oklch(from var(--vibeui-checkbox-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="checkbox-015"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-015-on-accent);border-bottom:2px solid var(--vibeui-checkbox-015-on-accent);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-015"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-015-accent);outline-offset:2px}
[data-vibeui-block="checkbox-015"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.5rem;
margin:0.625rem 0 0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-015-danger);
}
/* Знак «!» кружком: ошибка обязана читаться и в чёрно-белой печати,
   и при дальтонизме. */
[data-vibeui-block="checkbox-015"] [data-part="sign"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-checkbox-015-danger);color:var(--vibeui-checkbox-015-on-danger);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="checkbox-015"] [data-part="fix"]{
display:block;margin-top:0.125rem;color:var(--vibeui-checkbox-015-muted);font-size:0.75rem;
}
[data-vibeui-block="checkbox-015"] button{
appearance:none;border:0;cursor:pointer;margin-top:0.75rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
background:var(--vibeui-checkbox-015-accent);color:oklch(from var(--vibeui-checkbox-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="checkbox-015"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-015-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Разработка",
  "Дизайн",
  "Аналитика",
  "Поддержка клиентов",
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
 * Группа чекбоксов с ошибкой на уровне набора: рамка, знак и объяснение,
 * что сделать. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox015({
  legend = "Чем занимается ваша команда",
  options = DEFAULT_OPTIONS,
  error = "Отметьте хотя бы одно направление",
  hint = "Мы подберём шаблоны под выбранные направления.",
  submitLabel = "Продолжить",
  onSubmitValue,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox015Props) {
  const [value, setValue] = useState<string[]>([])
  const [checked, setChecked] = useState(true)
  const errorId = useId()

  const palette = {
    ...(accent ? { "--vibeui-checkbox-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const invalid = checked && value.length === 0

  const toggle = (option: string) => {
    setValue(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    )
  }

  return (
    <>
      <style href="vibeui-checkbox-015" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-015"
        className={className}
        style={palette}
        onSubmit={(event) => {
          event.preventDefault()
          setChecked(true)

          if (value.length > 0) {
            onSubmitValue?.(value)
          }
        }}
      >
        <fieldset
          data-invalid={invalid}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
        >
          <legend>{legend}</legend>
          {options.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggle(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        {invalid ? (
          <p data-part="error" id={errorId} role="alert">
            <span data-part="sign" aria-hidden="true">
              !
            </span>
            <span>
              {error}
              <span data-part="fix">{hint}</span>
            </span>
          </p>
        ) : null}
        <button type="submit">{submitLabel}</button>
      </form>
    </>
  )
}
