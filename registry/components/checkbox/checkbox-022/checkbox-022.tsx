"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox022Option = {
  id: string
  label: string
  locked?: boolean
  reason?: string
}

export type Checkbox022Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox022Option[]
  defaultValue?: string[]
  footnote?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: настройки только для чтения. Заблокированная строка не
// выключается через disabled, а помечается readOnly и aria-disabled: она
// остаётся в порядке табуляции, её видит скринридер, а причина написана
// прямо под подписью — «нельзя» без объяснения читается как поломка.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-022"]){
--vibeui-checkbox-022-bg:transparent;
--vibeui-checkbox-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-checkbox-022-muted:color-mix(in oklab,var(--vibeui-checkbox-022-fg) 68%,transparent);
--vibeui-checkbox-022-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-checkbox-022-locked:light-dark(oklch(0.955 0 265),oklch(0.28 0 265));
--vibeui-checkbox-022-accent:light-dark(oklch(0.5 0.14 265),oklch(0.65 0.15 265));
--vibeui-checkbox-022-on-accent:oklch(0.99 0 265);
--vibeui-checkbox-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-022"]{color-scheme:dark}
[data-vibeui-block="checkbox-022"]{
display:flex;flex-direction:column;gap:0.25rem;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.875rem;border:1px solid var(--vibeui-checkbox-022-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-022-bg);
font-family:var(--vibeui-checkbox-022-font);color:var(--vibeui-checkbox-022-fg);
}
[data-vibeui-block="checkbox-022"] legend{float:left;width:100%;padding:0 0 0.375rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="checkbox-022"] [data-part="row"]{
clear:both;display:grid;grid-template-columns:auto 1fr auto;column-gap:0.625rem;row-gap:0.125rem;
padding:0.5rem;margin:0 -0.5rem;border-radius:0.625rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-022"] [data-part="row"][data-locked="true"]{
background:var(--vibeui-checkbox-022-locked);cursor:default;
}
[data-vibeui-block="checkbox-022"] input{
appearance:none;position:relative;flex:none;cursor:pointer;margin:0.09375rem 0 0;
width:1.125rem;height:1.125rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-022-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-022-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-022"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-022-accent)}
[data-vibeui-block="checkbox-022"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-022-on-accent);border-bottom:2px solid var(--vibeui-checkbox-022-on-accent);
transform:rotate(45deg);
}
/* Только для чтения — не то же самое, что выключено: отметка остаётся
   различимой, но приглушена, а курсор не обещает нажатие. */
[data-vibeui-block="checkbox-022"] [data-locked="true"] input{
cursor:default;opacity:.55;
}
[data-vibeui-block="checkbox-022"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-022-accent);outline-offset:2px}
[data-vibeui-block="checkbox-022"] [data-part="name"]{line-height:1.35}
[data-vibeui-block="checkbox-022"] [data-locked="true"] [data-part="name"]{color:var(--vibeui-checkbox-022-muted)}
[data-vibeui-block="checkbox-022"] [data-part="why"]{
grid-column:2 / -1;font-size:0.75rem;line-height:1.4;color:var(--vibeui-checkbox-022-muted);
}
/* Замок нарисован дужкой и корпусом: без иконочной библиотеки и без
   картинки, которая не подхватит цвет темы. */
[data-vibeui-block="checkbox-022"] [data-part="lock"]{
position:relative;align-self:start;justify-self:end;
width:0.625rem;height:0.5rem;margin-top:0.3125rem;border-radius:0.125rem;
background:var(--vibeui-checkbox-022-muted);
}
[data-vibeui-block="checkbox-022"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;bottom:0.4375rem;
width:0.375rem;height:0.3125rem;margin-left:-0.1875rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-022-muted);border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="checkbox-022"] [data-part="foot"]{
margin:0.5rem 0 0;padding-top:0.5rem;
border-top:1px solid var(--vibeui-checkbox-022-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-checkbox-022-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Checkbox022Option[] = [
  {
    id: "2fa",
    label: "Двухфакторный вход",
    locked: true,
    reason: "Включено политикой организации",
  },
  { id: "session", label: "Выходить после 30 минут без действий" },
  {
    id: "export",
    label: "Разрешить выгрузку данных",
    locked: true,
    reason: "Отключено администратором пространства",
  },
  { id: "digest", label: "Отчёт о входах раз в неделю" },
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
 * Настройки, часть которых только для чтения: замок, приглушённая строка
 * и причина под подписью. Один файл, ноль зависимостей, своя палитра.
 */
export function Checkbox022({
  legend = "Безопасность аккаунта",
  options = DEFAULT_OPTIONS,
  defaultValue = ["2fa", "session"],
  footnote = "Строки с замком заданы политикой организации — их меняет администратор.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox022Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const prefix = useId()

  const palette = {
    ...(accent ? { "--vibeui-checkbox-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (option: Checkbox022Option) => {
    if (option.locked) {
      return
    }

    const next = value.includes(option.id)
      ? value.filter((item) => item !== option.id)
      : [...value, option.id]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-022" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-022"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => {
          const reasonId = `${prefix}-${option.id}`

          return (
            <label
              key={option.id}
              data-part="row"
              data-locked={option.locked ? "true" : undefined}
            >
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                readOnly={option.locked}
                aria-disabled={option.locked || undefined}
                aria-describedby={option.reason ? reasonId : undefined}
                onChange={() => toggle(option)}
              />
              <span data-part="name">{option.label}</span>
              {option.locked ? (
                <span data-part="lock" aria-hidden="true" />
              ) : null}
              {option.reason ? (
                <span data-part="why" id={reasonId}>
                  {option.reason}
                </span>
              ) : null}
            </label>
          )
        })}
        <p data-part="foot">{footnote}</p>
      </fieldset>
    </>
  )
}
