"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  domains?: string[]
  placeholder?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: почту чаще всего ломает не формат, а опечатка в домене —
// «gmial.com» проходит любую регулярку и молча теряет письмо. Поле сначала
// проверяет форму адреса, а потом сравнивает домен с частыми и предлагает
// исправление одной кнопкой. Проверка включается по уходу из поля: ругаться
// на недописанный адрес нечестно.
const STYLES = `
:where([data-vibeui-block="input-006"]){
--vibeui-input-006-surface:transparent;
--vibeui-input-006-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-006-muted:color-mix(in oklab,var(--vibeui-input-006-fg) 68%,transparent);
--vibeui-input-006-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-input-006-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-input-006-bad:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.17 25));
--vibeui-input-006-ok:light-dark(oklch(0.5 0.13 155),oklch(0.75 0.14 155));
--vibeui-input-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-006"]{color-scheme:dark}
[data-vibeui-block="input-006"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-input-006-font);color:var(--vibeui-input-006-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-006"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-006-surface);
border:1px solid var(--vibeui-input-006-shell);border-radius:0.875rem;
}
[data-vibeui-block="input-006"] *{box-sizing:border-box}
[data-vibeui-block="input-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-006"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-006-field);
border:1px solid var(--vibeui-input-006-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-006"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-006-accent) 18%,transparent);
}
[data-vibeui-block="input-006"] [data-state="bad"] [data-part="frame"]{border-color:var(--vibeui-input-006-bad)}
[data-vibeui-block="input-006"] [data-state="ok"] [data-part="frame"]{border-color:var(--vibeui-input-006-ok)}
[data-vibeui-block="input-006"] [data-part="body"]{display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="input-006"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-006"] input:focus{outline:none}
[data-vibeui-block="input-006"] [data-part="mark"]{
flex:none;width:1rem;height:1rem;display:grid;place-items:center;
}
[data-vibeui-block="input-006"] [data-part="mark"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="input-006"] [data-state="ok"] [data-part="mark"]{color:var(--vibeui-input-006-ok)}
[data-vibeui-block="input-006"] [data-state="bad"] [data-part="mark"]{color:var(--vibeui-input-006-bad)}
[data-vibeui-block="input-006"] [data-part="note"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-006-muted);margin:0;
}
[data-vibeui-block="input-006"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-006-bad)}
/* Исправление — настоящая кнопка: подсказку «вы имели в виду» надо уметь
   принять одним нажатием, иначе её просто перечитывают и правят руками. */
[data-vibeui-block="input-006"] [data-part="fix"]{
appearance:none;cursor:pointer;text-align:left;
padding:0.4375rem 0.625rem;border-radius:0.625rem;
border:1px dashed color-mix(in oklab,var(--vibeui-input-006-accent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-input-006-accent) 8%,transparent);
color:inherit;font:inherit;font-size:0.75rem;line-height:1.4;
transition:background-color .16s ease;
}
[data-vibeui-block="input-006"] [data-part="fix"]:hover{
background:color-mix(in oklab,var(--vibeui-input-006-accent) 15%,transparent);
}
[data-vibeui-block="input-006"] [data-part="fix"]:focus-visible{
outline:2px solid var(--vibeui-input-006-accent);outline-offset:2px;
}
[data-vibeui-block="input-006"] [data-part="fix"] b{font-weight:650;color:var(--vibeui-input-006-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-006"] *{animation:none!important;transition:none!important}}
`

const SHAPE = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/

const TEXT = {
  bad: "Адрес неполный: нужны имя, собака и домен.",
  calm: "Проверим формат и домен, когда вы уйдёте из поля.",
  suggest: "Возможно, вы имели в виду {address}",
}

// Расстояние Дамерау — Левенштейна: «gmial.com» отличается от «gmail.com»
// перестановкой соседних букв, а обычная Левенштейна считает её за две правки.
function distance(source: string, target: string) {
  const rows = Array.from({ length: source.length + 1 }, (_, index) =>
    Array.from({ length: target.length + 1 }, (_, column) =>
      index === 0 ? column : column === 0 ? index : 0,
    ),
  )

  for (let row = 1; row <= source.length; row += 1) {
    for (let column = 1; column <= target.length; column += 1) {
      const cost = source[row - 1] === target[column - 1] ? 0 : 1
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + cost,
      )

      if (
        row > 1 &&
        column > 1 &&
        source[row - 1] === target[column - 2] &&
        source[row - 2] === target[column - 1]
      ) {
        rows[row][column] = Math.min(
          rows[row][column],
          rows[row - 2][column - 2] + 1,
        )
      }
    }
  }

  return rows[source.length][target.length]
}

function suggest(value: string, domains: string[]) {
  const at = value.lastIndexOf("@")
  if (at < 1) return null

  const domain = value.slice(at + 1).toLowerCase()
  if (!domain || domains.includes(domain)) return null

  const near = domains.find((candidate) => distance(domain, candidate) <= 2)
  return near ? `${value.slice(0, at + 1)}${near}` : null
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
 * Поле почты с проверкой формата и подсказкой при опечатке в домене.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input006({
  label = "Рабочая почта",
  defaultValue = "anna.orlova@gmial.com",
  domains = ["gmail.com", "yandex.ru", "mail.ru", "outlook.com", "icloud.com"],
  placeholder = "name@company.com",
  text,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [checked, setChecked] = useState(true)
  const copy = { ...TEXT, ...text }

  const palette = {
    ...(accent ? { "--vibeui-input-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const valid = SHAPE.test(value)
  const fix = valid ? suggest(value, domains) : null
  const state = !checked || !value ? "idle" : valid ? "ok" : "bad"

  const [before, after] = copy.suggest.split("{address}")

  const apply = (next: string) => {
    setValue(next)
    setChecked(true)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-input-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-006"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="body" data-state={state}>
          <div data-part="frame">
            <input
              id={id}
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder={placeholder}
              value={value}
              aria-invalid={state === "bad"}
              aria-describedby={`${id}-note`}
              onChange={(event) => {
                setValue(event.target.value)
                setChecked(false)
                onChange?.(event.target.value)
              }}
              onBlur={() => setChecked(true)}
            />
            {state !== "idle" ? (
              <span data-part="mark" aria-hidden="true">
                {state === "ok" ? (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 4.5v4.5" strokeLinecap="round" />
                    <circle
                      cx="8"
                      cy="11.75"
                      r="0.85"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                )}
              </span>
            ) : null}
          </div>
          <p
            data-part="note"
            id={`${id}-note`}
            data-tone={state === "bad" ? "bad" : "calm"}
          >
            {state === "bad" ? copy.bad : copy.calm}
          </p>
          {fix ? (
            <button type="button" data-part="fix" onClick={() => apply(fix)}>
              {before}
              <b>{fix}</b>
              {after}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
