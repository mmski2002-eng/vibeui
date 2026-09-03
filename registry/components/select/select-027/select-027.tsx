"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select027Option = {
  value: string
  label: string
}

export type Select027Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  options?: Select027Option[]
  defaultValue?: string
  /** Подпись кнопки-буквы для скринридера, {letter} — сама буква. */
  letterHintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный алфавитный список делится на разделы optgroup
// по первой букве, а строка кнопок-букв над полем — быстрый переход: клик
// сразу ставит первый вариант нужной буквы, не заставляя листать список
// вручную. Список рисует система, кнопки — только способ выставить значение.
const STYLES = `
:where([data-vibeui-block="select-027"]){
--vibeui-select-027-surface:transparent;
--vibeui-select-027-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-027-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-select-027-muted:color-mix(in oklab,var(--vibeui-select-027-fg) 68%,transparent);
--vibeui-select-027-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-select-027-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-027-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-027-tint:color-mix(in oklab,var(--vibeui-select-027-accent) 14%,transparent);
--vibeui-select-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-027"]{color-scheme:dark}
[data-vibeui-block="select-027"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-027-surface);
border:1px solid var(--vibeui-select-027-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-027-font);color:var(--vibeui-select-027-fg);
container-type:inline-size;
}
[data-vibeui-block="select-027"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-027"] [data-part="letters"]{
display:flex;flex-wrap:wrap;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="select-027"] [data-part="letter"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-select-027-border);border-radius:0.4375rem;
background:var(--vibeui-select-027-field);color:var(--vibeui-select-027-fg);
font:inherit;font-size:0.75rem;font-weight:600;cursor:pointer;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="select-027"] [data-part="letter"]:hover{border-color:var(--vibeui-select-027-accent)}
[data-vibeui-block="select-027"] [data-part="letter"]:focus-visible{
outline:none;border-color:var(--vibeui-select-027-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-027-accent) 22%,transparent);
}
[data-vibeui-block="select-027"] [data-part="letter"][data-active="true"]{
background:var(--vibeui-select-027-tint);border-color:var(--vibeui-select-027-accent);
color:var(--vibeui-select-027-accent);
}
[data-vibeui-block="select-027"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-027"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-027-border);border-radius:0.625rem;
background:var(--vibeui-select-027-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-027"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-027-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-027-accent) 22%,transparent);
}
[data-vibeui-block="select-027"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-027-muted);
border-bottom:1.5px solid var(--vibeui-select-027-muted);
transform:rotate(45deg);
}
@container (max-width: 16rem){
[data-vibeui-block="select-027"] [data-part="letter"]{width:1.5rem;height:1.5rem;font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select027Option[] = [
  { value: "almaty", label: "Алматы" },
  { value: "arkhangelsk", label: "Архангельск" },
  { value: "barnaul", label: "Барнаул" },
  { value: "vladimir", label: "Владимир" },
  { value: "voronezh", label: "Воронеж" },
  { value: "grodno", label: "Гродно" },
  { value: "ekaterinburg", label: "Екатеринбург" },
  { value: "izhevsk", label: "Ижевск" },
  { value: "kazan", label: "Казань" },
  { value: "krasnodar", label: "Краснодар" },
  { value: "minsk", label: "Минск" },
  { value: "moscow", label: "Москва" },
  { value: "novosibirsk", label: "Новосибирск" },
  { value: "omsk", label: "Омск" },
  { value: "perm", label: "Пермь" },
  { value: "samara", label: "Самара" },
  { value: "tomsk", label: "Томск" },
  { value: "ufa", label: "Уфа" },
  { value: "chelyabinsk", label: "Челябинск" },
  { value: "yaroslavl", label: "Ярославль" },
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
 * Список городов с группировкой optgroup по первой букве и рядом кнопок
 * для быстрого перехода к нужной букве. Один файл, ноль зависимостей,
 * клиентский компонент.
 */
export function Select027({
  label = "Город",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  letterHintText = "Перейти к букве {letter}",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select027Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const selectRef = useRef<HTMLSelectElement>(null)
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "")

  const groups = useMemo(() => {
    const byLetter = new Map<string, Select027Option[]>()
    for (const option of options) {
      const letter = option.label.charAt(0).toUpperCase()
      const list = byLetter.get(letter) ?? []
      list.push(option)
      byLetter.set(letter, list)
    }
    return Array.from(byLetter.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [options])

  const activeLetter = value
    ? options
        .find((option) => option.value === value)
        ?.label.charAt(0)
        .toUpperCase()
    : undefined

  function jumpToLetter(letter: string) {
    const group = groups.find(([groupLetter]) => groupLetter === letter)
    const first = group?.[1][0]
    if (!first) return
    setValue(first.value)
    selectRef.current?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-select-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-027-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-027" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-027"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <ul data-part="letters">
          {groups.map(([letter]) => (
            <li key={letter}>
              <button
                type="button"
                data-part="letter"
                data-active={letter === activeLetter}
                aria-label={letterHintText.replace("{letter}", letter)}
                aria-pressed={letter === activeLetter}
                onClick={() => jumpToLetter(letter)}
              >
                {letter}
              </button>
            </li>
          ))}
        </ul>
        <span data-part="field">
          <select
            ref={selectRef}
            id={fieldId}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            {groups.map(([letter, items]) => (
              <optgroup key={letter} label={letter}>
                {items.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}
