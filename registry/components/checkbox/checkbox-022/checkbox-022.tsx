"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox022Option = {
  id: string
  label: string
  locked?: boolean
  reason?: string
}

export type Checkbox022Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox022Option[]
  defaultValue?: string[]
  footnote?: string
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: настройки только для чтения. Заблокированная строка не
// выключается через disabled, а помечается readOnly и aria-disabled: она
// остаётся в порядке табуляции, её видит скринридер, а причина написана
// прямо под подписью — «нельзя» без объяснения читается как поломка.
const STYLES = `
:where([data-vibeui-block="checkbox-022"]){
--vibeui-checkbox-022-bg:oklch(1 0 0);
--vibeui-checkbox-022-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-022-muted:oklch(0.55 0.014 265);
--vibeui-checkbox-022-border:oklch(0.9 0.006 265);
--vibeui-checkbox-022-locked:oklch(0.955 0.004 265);
--vibeui-checkbox-022-accent:oklch(0.5 0.14 265);
--vibeui-checkbox-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-022-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-022-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-022"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-022-accent)}
[data-vibeui-block="checkbox-022"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 265);border-bottom:2px solid oklch(0.99 0.01 265);
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
 * Настройки, часть которых только для чтения: замок, приглушённая строка
 * и причина под подписью. Один файл, ноль зависимостей, своя палитра.
 */
export function Checkbox022({
  legend = "Безопасность аккаунта",
  options = DEFAULT_OPTIONS,
  defaultValue = ["2fa", "session"],
  footnote = "Строки с замком заданы политикой организации — их меняет администратор.",
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox022Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const prefix = useId()

  const palette = {
    ...(accent ? { "--vibeui-checkbox-022-accent": accent } : null),
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
