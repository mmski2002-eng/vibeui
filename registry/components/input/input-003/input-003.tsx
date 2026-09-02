"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  hint?: string
  /** Вердикты по ступеням оценки: пусто, слабый, средний, хороший. */
  levelText?: string[]
  /** Подписи кнопки показа: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: пароль с показом и честной оценкой. Кнопка «показать» —
// не украшение: без неё длинный пароль набирают вслепую и ошибаются. Оценка
// считается по длине и разнообразию символов и подписана словом: полоска без
// подписи не отвечает, что именно исправить.
const STYLES = `
:where([data-vibeui-block="input-003"]){
--vibeui-input-003-bg:transparent;
--vibeui-input-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-003-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-input-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.014 265));
--vibeui-input-003-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-003-track:light-dark(oklch(0.92 0.005 265),oklch(0.34 0.012 265));
--vibeui-input-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-input-003-weak:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.16 25));
--vibeui-input-003-fair:light-dark(oklch(0.72 0.16 75),oklch(0.8 0.14 75));
--vibeui-input-003-good:light-dark(oklch(0.58 0.15 152),oklch(0.76 0.14 152));
--vibeui-input-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-input-003-font);color:var(--vibeui-input-003-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-003"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-003-bg);
border:1px solid var(--vibeui-input-003-border);border-radius:0.875rem;
}
[data-vibeui-block="input-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-003"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-003"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 5.75rem 0 0.75rem;
border:1px solid var(--vibeui-input-003-border);border-radius:0.625rem;
background:var(--vibeui-input-003-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-003"] input:focus-visible{
outline:2px solid var(--vibeui-input-003-accent);outline-offset:1px;border-color:transparent;
}
/* Кнопка показа: без неё длинный пароль набирают вслепую. */
[data-vibeui-block="input-003"] button{
position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;background:transparent;
padding:0 0.375rem;height:1.875rem;border-radius:0.4375rem;
color:var(--vibeui-input-003-muted);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="input-003"] button:hover{color:var(--vibeui-input-003-fg)}
[data-vibeui-block="input-003"] button:focus-visible{outline:2px solid var(--vibeui-input-003-accent);outline-offset:1px}
[data-vibeui-block="input-003"] [data-part="meter"]{display:flex;gap:0.25rem}
[data-vibeui-block="input-003"] [data-part="bar"]{
flex:1;height:0.25rem;border-radius:9999px;background:var(--vibeui-input-003-track);
}
[data-vibeui-block="input-003"][data-score="1"] [data-part="bar"]:nth-child(-n+1){background:var(--vibeui-input-003-weak)}
[data-vibeui-block="input-003"][data-score="2"] [data-part="bar"]:nth-child(-n+2){background:var(--vibeui-input-003-fair)}
[data-vibeui-block="input-003"][data-score="3"] [data-part="bar"]:nth-child(-n+3){background:var(--vibeui-input-003-good)}
[data-vibeui-block="input-003"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-003"] *{animation:none!important;transition:none!important}}
`

const LEVELS = [
  "Пусто",
  "Слабый: добавьте длины",
  "Средний: добавьте цифры или знаки",
  "Хороший пароль",
]

const TEXT = {
  show: "Показать",
  hide: "Скрыть",
  showLabel: "Показать пароль",
  hideLabel: "Скрыть пароль",
}

// Оценка по длине и разнообразию: три ступени, потому что больше человек всё
// равно не различает, а «очень сильный» ничего не меняет в поведении.
function score(value: string) {
  if (!value) return 0
  const variety =
    Number(/[a-zа-я]/.test(value)) +
    Number(/[A-ZА-Я]/.test(value)) +
    Number(/\d/.test(value)) +
    Number(/[^\wа-яА-Я]/.test(value))
  if (value.length >= 12 && variety >= 3) return 3
  if (value.length >= 8 && variety >= 2) return 2
  return 1
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Пароль с показом и оценкой словами, а не только полоской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input003({
  label = "Пароль",
  placeholder = "Не короче восьми символов",
  hint,
  levelText = LEVELS,
  text,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input003Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const [shown, setShown] = useState(false)
  const level = score(value)
  const copy = { ...TEXT, ...text }

  const palette = {
    ...(accent ? { "--vibeui-input-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-003"
        data-score={level}
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <span data-part="field">
          <input
            id={id}
            type={shown ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            autoComplete="new-password"
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            aria-pressed={shown}
            aria-label={shown ? copy.hideLabel : copy.showLabel}
            onClick={() => setShown(!shown)}
          >
            {shown ? copy.hide : copy.show}
          </button>
        </span>
        <span data-part="meter" aria-hidden="true">
          <span data-part="bar" />
          <span data-part="bar" />
          <span data-part="bar" />
        </span>
        <span data-part="hint" id={`${id}-hint`}>
          {hint ?? levelText[level] ?? LEVELS[level]}
        </span>
      </div>
    </>
  )
}
