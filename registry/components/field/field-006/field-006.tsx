"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, FormEvent } from "react"

export type Field006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onSubmit"
> & {
  label?: string
  action?: string
  placeholder?: string
  note?: string
  /** Подтверждение; {code} заменяется на введённое значение. */
  doneText?: string
  onSubmit?: (value: string) => void
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кнопка действия живёт внутри рамки поля, а не рядом с ней.
// Промокод, приглашение, короткий поиск — это одно действие, и разрыв между
// полем и кнопкой заставляет глаз прыгать. Обёртка — настоящий <form>, поэтому
// Enter в поле нажимает кнопку без единого обработчика клавиш. Пока поле
// пустое, кнопка выключена: нажимать нечего, и это видно.
const STYLES = `
:where([data-vibeui-block="field-006"]){
--vibeui-field-006-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-field-006-surface:transparent;
--vibeui-field-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-field-006-muted:color-mix(in oklab,var(--vibeui-field-006-fg) 68%,transparent);
--vibeui-field-006-border:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-field-006-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-field-006-accent:light-dark(oklch(0.28 0 0),oklch(0.899 0 0));
--vibeui-field-006-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0 285));
--vibeui-field-006-ok:light-dark(oklch(0.5 0.13 155),oklch(0.75 0.13 155));
--vibeui-field-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="field-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="field-006"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-006-surface);
border:1px solid var(--vibeui-field-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-006-font);color:var(--vibeui-field-006-fg);
}
[data-vibeui-block="field-006"] *{box-sizing:border-box}
[data-vibeui-block="field-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-006"] form{display:block;margin:0}
[data-vibeui-block="field-006"] [data-part="frame"]{
display:flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.25rem 0.25rem 0.75rem;
background:var(--vibeui-field-006-bg);
border:1px solid var(--vibeui-field-006-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-006"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-field-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-006-accent) 18%,transparent);
}
[data-vibeui-block="field-006"] input{
flex:1;min-width:0;height:2rem;padding:0;
border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;letter-spacing:0.02em;
}
[data-vibeui-block="field-006"] input:focus{outline:none}
[data-vibeui-block="field-006"] input::placeholder{color:var(--vibeui-field-006-muted);letter-spacing:normal}
/* Кнопка внутри рамки: действие и поле читаются как одно целое. */
[data-vibeui-block="field-006"] button{
appearance:none;flex:none;cursor:pointer;
height:2rem;padding:0 0.875rem;border:0;border-radius:0.5rem;
background:var(--vibeui-field-006-accent);color:oklch(from var(--vibeui-field-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
transition:opacity .16s ease,background-color .16s ease;
}
[data-vibeui-block="field-006"] button:hover:not(:disabled){background:color-mix(in oklab,var(--vibeui-field-006-accent) 88%,oklch(0 0 0))}
[data-vibeui-block="field-006"] button:focus-visible{outline:2px solid var(--vibeui-field-006-accent);outline-offset:2px}
/* Пустое поле — нажимать нечего, и это видно, а не только по отсутствию реакции. */
[data-vibeui-block="field-006"] button:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="field-006"] [data-part="note"]{
display:flex;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-006-muted);
}
[data-vibeui-block="field-006"][data-done="true"] [data-part="note"]{color:var(--vibeui-field-006-ok);font-weight:600}
[data-vibeui-block="field-006"] [data-part="tick"]{
flex:none;width:0.875rem;height:0.875rem;border-radius:9999px;
background:var(--vibeui-field-006-ok);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-006"] *{animation:none!important;transition:none!important}}
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
 * Поле с кнопкой действия внутри рамки: Enter отправляет, пустое — выключает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field006({
  label = "Промокод",
  action = "Применить",
  placeholder = "VIBEUI-2026",
  note = "Код появится в чеке, скидка пересчитается сразу.",
  doneText = "Код «{code}» принят",
  onSubmit,
  background = "",
  accent,
  className,
  style,
  ...props
}: Field006Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const [applied, setApplied] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-field-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-field-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim()) return
    setApplied(value.trim())
    onSubmit?.(value.trim())
  }

  return (
    <>
      <style href="vibeui-field-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="field"
        data-vibeui-block="field-006"
        data-done={applied ? "true" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        {/* Настоящая форма: Enter нажимает кнопку без обработчика клавиш. */}
        <form onSubmit={submit}>
          <div data-part="frame">
            <input
              id={id}
              name="promo"
              type="text"
              autoComplete="off"
              placeholder={placeholder}
              value={value}
              aria-describedby={`${id}-note`}
              onChange={(event) => {
                setValue(event.target.value)
                setApplied("")
              }}
            />
            <button type="submit" disabled={!value.trim()}>
              {action}
            </button>
          </div>
        </form>
        <p id={`${id}-note`} data-part="note" role="status">
          {applied ? (
            <>
              <span data-part="tick" aria-hidden="true" />
              {doneText.replace("{code}", applied)}
            </>
          ) : (
            note
          )}
        </p>
      </div>
    </>
  )
}
