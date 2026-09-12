"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input011Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  minLength?: number
  /** Начальное значение поля. */
  defaultValue?: string
  /** Пять требований по порядку; в первом {min} заменяется на minLength. */
  ruleText?: string[]
  /** Пять слов надёжности по числу выполненных требований. */
  strengthText?: string[]
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: надёжность показана сегментами и списком требований, а не
// одной полоской. Полоска отвечает «слабо», но не говорит, что именно
// исправить; здесь каждое требование — отдельная строка, которая гаснет,
// как только выполнена. Оценка считается от числа выполненных правил, поэтому
// шкала и список никогда не расходятся.
const STYLES = `
:where([data-vibeui-block="input-011"]){
--vibeui-input-011-surface:transparent;
--vibeui-input-011-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-011-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-011-muted:color-mix(in oklab,var(--vibeui-input-011-fg) 68%,transparent);
--vibeui-input-011-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-011-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-input-011-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-input-011-track:light-dark(oklch(0.92 0 265),oklch(0.34 0 265));
--vibeui-input-011-weak:light-dark(oklch(0.6 0.2 25),oklch(0.74 0.17 25));
--vibeui-input-011-fair:light-dark(oklch(0.72 0.15 75),oklch(0.8 0.14 75));
--vibeui-input-011-good:light-dark(oklch(0.55 0.14 155),oklch(0.76 0.14 155));
--vibeui-input-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-011"]{color-scheme:dark}
[data-vibeui-block="input-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;
font-family:var(--vibeui-input-011-font);color:var(--vibeui-input-011-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-011"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-011-surface);
border:1px solid var(--vibeui-input-011-shell);border-radius:0.875rem;
}
[data-vibeui-block="input-011"] *{box-sizing:border-box}
[data-vibeui-block="input-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-011"] [data-part="frame"]{
display:flex;align-items:center;gap:0.375rem;
height:2.5rem;padding:0 0.375rem 0 0.75rem;
background:var(--vibeui-input-011-field);
border:1px solid var(--vibeui-input-011-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-011"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-011-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-011-accent) 18%,transparent);
}
[data-vibeui-block="input-011"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;letter-spacing:0.02em;
}
[data-vibeui-block="input-011"] input:focus{outline:none}
[data-vibeui-block="input-011"] [data-part="peek"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 0.5rem;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-input-011-muted);
font:inherit;font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-011"] [data-part="peek"]:hover{
background:color-mix(in oklab,var(--vibeui-input-011-fg) 8%,transparent);
color:var(--vibeui-input-011-fg);
}
[data-vibeui-block="input-011"] [data-part="peek"]:focus-visible{
outline:2px solid var(--vibeui-input-011-accent);outline-offset:1px;
}
/* Сегменты вместо сплошной полоски: шаг виден без чтения процентов. */
[data-vibeui-block="input-011"] [data-part="meter"]{display:flex;gap:0.25rem}
[data-vibeui-block="input-011"] [data-part="seg"]{
flex:1;height:0.25rem;border-radius:999px;background:var(--vibeui-input-011-track);
transition:background-color .2s ease;
}
[data-vibeui-block="input-011"] [data-tone="weak"] [data-part="seg"][data-on="1"]{background:var(--vibeui-input-011-weak)}
[data-vibeui-block="input-011"] [data-tone="fair"] [data-part="seg"][data-on="1"]{background:var(--vibeui-input-011-fair)}
[data-vibeui-block="input-011"] [data-tone="good"] [data-part="seg"][data-on="1"]{background:var(--vibeui-input-011-good)}
[data-vibeui-block="input-011"] [data-part="verdict"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-input-011-muted);
}
[data-vibeui-block="input-011"] [data-part="verdict"] strong{font-weight:650}
[data-vibeui-block="input-011"] [data-tone="weak"] [data-part="verdict"] strong{color:var(--vibeui-input-011-weak)}
[data-vibeui-block="input-011"] [data-tone="fair"] [data-part="verdict"] strong{color:var(--vibeui-input-011-fair)}
[data-vibeui-block="input-011"] [data-tone="good"] [data-part="verdict"] strong{color:var(--vibeui-input-011-good)}
[data-vibeui-block="input-011"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="input-011"] li{
display:flex;align-items:center;gap:0.4375rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-011-muted);
}
[data-vibeui-block="input-011"] li[data-done="1"]{color:var(--vibeui-input-011-good)}
[data-vibeui-block="input-011"] li svg{flex:none;width:0.875rem;height:0.875rem;display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-011"] *{animation:none!important;transition:none!important}}
`

const TONES = ["weak", "weak", "fair", "fair", "good"] as const
const WORDS = ["слишком слабый", "слабый", "средний", "хороший", "надёжный"]

const RULES = [
  "не короче {min} символов",
  "строчные и прописные буквы",
  "хотя бы одна цифра",
  "знак препинания или символ",
  "не повторяет слово «пароль»",
]

const TEXT = {
  show: "Показать",
  hide: "Скрыть",
  strength: "Надёжность",
  empty: "пусто",
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
 * Пароль с сегментной шкалой и списком требований: видно, что именно исправить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input011({
  label = "Придумайте пароль",
  minLength = 10,
  defaultValue = "vibeui2026",
  ruleText = RULES,
  strengthText = WORDS,
  text,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [shown, setShown] = useState(false)
  const copy = { ...TEXT, ...text }

  const palette = {
    ...(accent ? { "--vibeui-input-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const checks = [
    value.length >= minLength,
    /[a-zа-я]/.test(value) && /[A-ZА-Я]/.test(value),
    /\d/.test(value),
    /[^\p{L}\d]/u.test(value),
    !/(пароль|password|qwerty)/i.test(value),
  ]
  const rules = checks.map((done, index) => ({
    text: (ruleText[index] ?? RULES[index]).replace("{min}", String(minLength)),
    done,
  }))

  const done = rules.filter((rule) => rule.done).length
  const score = value ? done : 0
  const tone = score === 0 ? "weak" : TONES[score - 1]

  return (
    <>
      <style href="vibeui-input-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-011"
        className={className}
        style={palette}
        data-tone={tone}
        data-surface={background ? "on" : undefined}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type={shown ? "text" : "password"}
            autoComplete="new-password"
            spellCheck={false}
            value={value}
            aria-describedby={`${id}-verdict`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            data-part="peek"
            aria-pressed={shown}
            onClick={() => setShown((was) => !was)}
          >
            {shown ? copy.hide : copy.show}
          </button>
        </div>
        <div data-part="meter" aria-hidden="true">
          {rules.map((rule, index) => (
            <span
              key={rule.text}
              data-part="seg"
              data-on={index < score ? "1" : "0"}
            />
          ))}
        </div>
        <p data-part="verdict" id={`${id}-verdict`} aria-live="polite">
          <span>{copy.strength}</span>
          <strong>
            {value ? (strengthText[score - 1] ?? strengthText[0]) : copy.empty}
          </strong>
        </p>
        <ul>
          {rules.map((rule) => (
            <li key={rule.text} data-done={rule.done ? "1" : "0"}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {rule.done ? (
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <circle cx="8" cy="8" r="3" />
                )}
              </svg>
              {rule.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
