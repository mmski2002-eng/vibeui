"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, FormEvent } from "react"

export type Input013Props = Omit<
  ComponentProps<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  codes?: Record<string, number>
  onApply?: (code: string, percent: number) => void
  /** Подсказка в пустом поле. */
  placeholder?: string
  /** Надпись на кнопке отправки. */
  applyText?: string
  /** Надпись на кнопке, пока идёт проверка. */
  checkingText?: string
  /** Надпись на кнопке снятия применённого кода. */
  removeText?: string
  /** Строка рядом с применённым кодом; {percent} подставляется числом. */
  appliedText?: string
  /** Подсказка под полем по состоянию: idle, bad, done. */
  noteText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: купон — это не «поле с кнопкой», а короткий цикл
// «ввод → проверка → результат». Поэтому у компонента три состояния и в
// каждом своя разметка: пустое поле, ожидание ответа и применённый код,
// который уже нельзя редактировать — его можно только снять. Ввод приводится
// к верхнему регистру: купоны печатают на чеках заглавными, а набирают как
// придётся.
const STYLES = `
:where([data-vibeui-block="input-013"]){
--vibeui-input-013-surface:transparent;
--vibeui-input-013-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-013-muted:color-mix(in oklab,var(--vibeui-input-013-fg) 68%,transparent);
--vibeui-input-013-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-input-013-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-input-013-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.72 0.15 39.8));
--vibeui-input-013-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 300));
--vibeui-input-013-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-013-ok:light-dark(oklch(0.48 0.13 155),oklch(0.76 0.13 155));
--vibeui-input-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-013"]{color-scheme:dark}
[data-vibeui-block="input-013"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-013-surface);
border:1px solid var(--vibeui-input-013-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-013-font);color:var(--vibeui-input-013-fg);
}
[data-vibeui-block="input-013"] *{box-sizing:border-box}
[data-vibeui-block="input-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-013"] form{display:flex;gap:0.375rem;margin:0}
[data-vibeui-block="input-013"] [data-part="frame"]{
flex:1;min-width:0;display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-013-field);
border:1px solid var(--vibeui-input-013-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-013"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-013-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-013-accent) 18%,transparent);
}
[data-vibeui-block="input-013"] [data-part="frame"][data-bad="1"]{border-color:var(--vibeui-input-013-bad)}
[data-vibeui-block="input-013"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;letter-spacing:0.08em;
text-transform:uppercase;
}
[data-vibeui-block="input-013"] input:focus{outline:none}
[data-vibeui-block="input-013"] input::placeholder{font-weight:400;letter-spacing:0.02em}
[data-vibeui-block="input-013"] [data-part="apply"]{
appearance:none;flex:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.25rem 0.875rem;border:0;border-radius:0.75rem;
background:var(--vibeui-input-013-accent);color:var(--vibeui-input-013-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:opacity .16s ease,filter .16s ease;
}
[data-vibeui-block="input-013"] [data-part="apply"]:hover:not(:disabled){filter:brightness(1.08)}
[data-vibeui-block="input-013"] [data-part="apply"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="input-013"] [data-part="apply"]:focus-visible{
outline:2px solid var(--vibeui-input-013-accent);outline-offset:2px;
}
/* Применённый купон — не поле: редактировать его нечего, его снимают. */
[data-vibeui-block="input-013"] [data-part="applied"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.5rem 0.5rem 0.75rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-input-013-ok) 12%,transparent);
border:1px dashed color-mix(in oklab,var(--vibeui-input-013-ok) 45%,transparent);
}
[data-vibeui-block="input-013"] [data-part="applied"] code{
font-family:inherit;font-size:0.8125rem;font-weight:700;letter-spacing:0.08em;
color:var(--vibeui-input-013-ok);
}
[data-vibeui-block="input-013"] [data-part="applied"] span{
flex:1;min-width:0;font-size:0.75rem;color:var(--vibeui-input-013-muted);
}
[data-vibeui-block="input-013"] [data-part="off"]{
appearance:none;flex:none;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-input-013-ok) 40%,transparent);
background:transparent;color:var(--vibeui-input-013-ok);
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="input-013"] [data-part="off"]:focus-visible{
outline:2px solid var(--vibeui-input-013-ok);outline-offset:2px;
}
[data-vibeui-block="input-013"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-013-muted);
}
[data-vibeui-block="input-013"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-013-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-013"] *{animation:none!important;transition:none!important}}
`

const CODES: Record<string, number> = { VIBE10: 10, FIRST: 15, SPRING25: 25 }

const NOTE: Record<string, string> = {
  idle: "Код из письма или с чека. Регистр не важен.",
  bad: "Такого кода нет или он уже использован.",
  done: "Код можно снять и ввести другой — они не складываются.",
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
 * Поле промокода с проверкой и тремя состояниями: ввод, ожидание, применён.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input013({
  label = "Промокод",
  codes = CODES,
  onApply,
  placeholder = "Например, VIBE10",
  applyText = "Применить",
  checkingText = "Проверяем…",
  removeText = "Снять",
  appliedText = "скидка {percent}% уже в сумме заказа",
  noteText = NOTE,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input013Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const [state, setState] = useState<"idle" | "checking" | "bad" | "done">(
    "idle",
  )
  const [percent, setPercent] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-input-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const check = (event: FormEvent) => {
    event.preventDefault()
    const code = value.trim().toUpperCase()
    if (!code) return

    setState("checking")
    // Задержка изображает поход на сервер: проверка купона всегда серверная,
    // список кодов на клиенте — только для демонстрации состояний.
    window.setTimeout(() => {
      const discount = codes[code]
      if (discount) {
        setPercent(discount)
        setState("done")
        onApply?.(code, discount)
      } else {
        setState("bad")
      }
    }, 700)
  }

  return (
    <>
      <style href="vibeui-input-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        {state === "done" ? (
          <div data-part="applied">
            <code>{value.trim().toUpperCase()}</code>
            <span>{appliedText.replace("{percent}", String(percent))}</span>
            <button
              type="button"
              data-part="off"
              onClick={() => {
                setValue("")
                setPercent(0)
                setState("idle")
              }}
            >
              {removeText}
            </button>
          </div>
        ) : (
          <form onSubmit={check}>
            <div data-part="frame" data-bad={state === "bad" ? "1" : "0"}>
              <input
                id={id}
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder={placeholder}
                value={value}
                aria-invalid={state === "bad"}
                aria-describedby={`${id}-note`}
                onChange={(event) => {
                  setValue(event.target.value.toUpperCase())
                  setState("idle")
                }}
              />
            </div>
            <button
              type="submit"
              data-part="apply"
              disabled={!value.trim() || state === "checking"}
            >
              {state === "checking" ? checkingText : applyText}
            </button>
          </form>
        )}
        <p
          data-part="note"
          id={`${id}-note`}
          aria-live="polite"
          data-tone={state === "bad" ? "bad" : "calm"}
        >
          {noteText[state === "bad" || state === "done" ? state : "idle"] ??
            NOTE.idle}
        </p>
      </div>
    </>
  )
}
