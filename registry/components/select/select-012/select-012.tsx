"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select012Option = {
  value: string
  label: string
  flag: string
  code: string
}

export type Select012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select012Option[]
  defaultValue?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: код страны для телефона выбирают по флагу быстрее, чем
// по названию. Флаг — это просто эмодзи, символьный шрифт рисует его сам,
// а настоящий select снизу невидим и отдаёт клавиатуру и системный список,
// как в select-003. Наша работа — плитка с флагом, именем и кодом.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-012"]){
--vibeui-select-012-surface:transparent;
--vibeui-select-012-surface-border:transparent;
--vibeui-select-012-surface-pad:0;
--vibeui-select-012-surface-radius:0;
--vibeui-select-012-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-012-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-select-012-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-select-012-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.15 262));
--vibeui-select-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложка появляется только вместе с пропом background: по умолчанию поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-012"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:19rem;box-sizing:border-box;
padding:var(--vibeui-select-012-surface-pad);
background:var(--vibeui-select-012-surface);
border:1px solid var(--vibeui-select-012-surface-border);
border-radius:var(--vibeui-select-012-surface-radius);
font-family:var(--vibeui-select-012-font);color:var(--vibeui-select-012-fg);
}
[data-vibeui-block="select-012"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-012"] [data-part="field"]{position:relative;display:block}
/* Настоящий select лежит поверх плитки и невидим: клик, клавиатура и
   системный список остаются браузерными, оформление — наше. */
[data-vibeui-block="select-012"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
[data-vibeui-block="select-012"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:2.75rem;padding:0.5rem 2.25rem 0.5rem 0.625rem;
border:1px solid var(--vibeui-select-012-border);border-radius:0.625rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-012"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-012"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-012-accent) 22%,transparent);
}
[data-vibeui-block="select-012"] [data-part="flag"]{
flex:none;font-size:1.25rem;line-height:1;
}
[data-vibeui-block="select-012"] [data-part="text"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-012"] [data-part="code"]{
flex:none;font-size:0.8125rem;font-variant-numeric:tabular-nums;color:var(--vibeui-select-012-muted);
}
[data-vibeui-block="select-012"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-012-muted);
border-bottom:1.5px solid var(--vibeui-select-012-muted);
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select012Option[] = [
  { value: "ru", label: "Россия", flag: "🇷🇺", code: "+7" },
  { value: "kz", label: "Казахстан", flag: "🇰🇿", code: "+7" },
  { value: "de", label: "Германия", flag: "🇩🇪", code: "+49" },
  { value: "us", label: "США", flag: "🇺🇸", code: "+1" },
  { value: "in", label: "Индия", flag: "🇮🇳", code: "+91" },
  { value: "br", label: "Бразилия", flag: "🇧🇷", code: "+55" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Select страны с флагом-эмодзи и телефонным кодом. Своя плитка,
 * системный список. Один файл, ноль зависимостей, собственная палитра.
 */
export function Select012({
  label = "Код страны",
  options = DEFAULT_OPTIONS,
  defaultValue = "ru",
  background = "",
  accent,
  className,
  style,
  ...props
}: Select012Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const current = options.find((option) => option.value === value) ?? options[0]

  // Подложка приходит вместе с полями и скруглением: без неё поле лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-012-surface": background,
          "--vibeui-select-012-surface-border":
            "light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265))",
          "--vibeui-select-012-surface-pad": "0.875rem",
          "--vibeui-select-012-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-012"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={id}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.flag} {option.label} · {option.code}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="flag">{current?.flag}</span>
            <span data-part="text">{current?.label}</span>
            <span data-part="code">{current?.code}</span>
          </span>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}
