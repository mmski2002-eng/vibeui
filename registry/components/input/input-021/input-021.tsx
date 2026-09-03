"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, FormEvent } from "react"

export type Input021Props = Omit<
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

// Идея компонента: три состояния купона — ввод, ожидание, применён — уже
// есть (input-013), но там код набирают простым текстом. Здесь другой
// формат: ключ-подобный код с дефисами по четвёркам символов, как у
// лицензионных ключей. В состоянии живёт только канонический текст без
// дефисов, а дефисы дорисовывает функция группировки — вставка в любом
// формате даёт один результат.
const STYLES = `
:where([data-vibeui-block="input-021"]){
--vibeui-input-021-surface:transparent;
--vibeui-input-021-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-021-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-021-muted:color-mix(in oklab,var(--vibeui-input-021-fg) 68%,transparent);
--vibeui-input-021-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.011 265));
--vibeui-input-021-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.013 265));
--vibeui-input-021-accent:light-dark(oklch(0.5 0.16 300),oklch(0.72 0.15 300));
--vibeui-input-021-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 300));
--vibeui-input-021-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-021-ok:light-dark(oklch(0.48 0.13 155),oklch(0.76 0.13 155));
--vibeui-input-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-021"]{color-scheme:dark}
[data-vibeui-block="input-021"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-021-surface);
border:1px solid var(--vibeui-input-021-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-021-font);color:var(--vibeui-input-021-fg);
}
[data-vibeui-block="input-021"] *{box-sizing:border-box}
[data-vibeui-block="input-021"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-021"] form{display:flex;gap:0.375rem;margin:0}
[data-vibeui-block="input-021"] [data-part="frame"]{
flex:1;min-width:0;display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-021-field);
border:1px solid var(--vibeui-input-021-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-021"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-021-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-021-accent) 18%,transparent);
}
[data-vibeui-block="input-021"] [data-part="frame"][data-bad="1"]{border-color:var(--vibeui-input-021-bad)}
[data-vibeui-block="input-021"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;letter-spacing:0.06em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-021"] input:focus{outline:none}
[data-vibeui-block="input-021"] input::placeholder{font-weight:400;letter-spacing:0.02em}
[data-vibeui-block="input-021"] [data-part="apply"]{
appearance:none;flex:none;cursor:pointer;
height:2.5rem;padding:0 0.875rem;border:0;border-radius:0.75rem;
background:var(--vibeui-input-021-accent);color:var(--vibeui-input-021-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:opacity .16s ease,filter .16s ease;
}
[data-vibeui-block="input-021"] [data-part="apply"]:hover:not(:disabled){filter:brightness(1.08)}
[data-vibeui-block="input-021"] [data-part="apply"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="input-021"] [data-part="apply"]:focus-visible{
outline:2px solid var(--vibeui-input-021-accent);outline-offset:2px;
}
[data-vibeui-block="input-021"] [data-part="applied"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.5rem 0.5rem 0.75rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-input-021-ok) 12%,transparent);
border:1px dashed color-mix(in oklab,var(--vibeui-input-021-ok) 45%,transparent);
}
[data-vibeui-block="input-021"] [data-part="applied"] code{
font-family:inherit;font-size:0.8125rem;font-weight:700;letter-spacing:0.06em;
color:var(--vibeui-input-021-ok);
}
[data-vibeui-block="input-021"] [data-part="applied"] span{
flex:1;min-width:0;font-size:0.75rem;color:var(--vibeui-input-021-muted);
}
[data-vibeui-block="input-021"] [data-part="off"]{
appearance:none;flex:none;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-input-021-ok) 40%,transparent);
background:transparent;color:var(--vibeui-input-021-ok);
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="input-021"] [data-part="off"]:focus-visible{
outline:2px solid var(--vibeui-input-021-ok);outline-offset:2px;
}
[data-vibeui-block="input-021"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-021-muted);
}
[data-vibeui-block="input-021"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-021-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-021"] *{animation:none!important;transition:none!important}}
`

const CODES: Record<string, number> = {
  VIBE2026SALE: 20,
  WELCOMEHOME1: 10,
  STUDIOFLASH9: 15,
}

const NOTE: Record<string, string> = {
  idle: "Двенадцать символов, дефисы подставляются сами. Регистр не важен.",
  bad: "Такого ключа нет или он уже использован.",
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

function normalize(raw: string) {
  return raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 12)
}

function group(value: string) {
  return value.replace(/(.{4})/g, "$1-").replace(/-$/, "")
}

/**
 * Поле кода купона-ключа с дефисами по четвёркам символов и тремя
 * состояниями: ввод, ожидание, применён. Один файл, ноль зависимостей.
 */
export function Input021({
  label = "Код купона",
  codes = CODES,
  onApply,
  placeholder = "VIBE-2026-SALE",
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
}: Input021Props) {
  const id = useId()
  const [value, setValue] = useState("")
  const [state, setState] = useState<"idle" | "checking" | "bad" | "done">(
    "idle",
  )
  const [percent, setPercent] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-input-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-021-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const check = (event: FormEvent) => {
    event.preventDefault()
    if (!value) return

    setState("checking")
    // Задержка изображает поход на сервер: проверка ключа всегда серверная,
    // словарь codes на клиенте — только для демонстрации состояний.
    window.setTimeout(() => {
      const discount = codes[value]
      if (discount) {
        setPercent(discount)
        setState("done")
        onApply?.(value, discount)
      } else {
        setState("bad")
      }
    }, 700)
  }

  return (
    <>
      <style href="vibeui-input-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-021"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        {state === "done" ? (
          <div data-part="applied">
            <code>{group(value)}</code>
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
                value={group(value)}
                aria-invalid={state === "bad"}
                aria-describedby={`${id}-note`}
                onChange={(event) => {
                  setValue(normalize(event.target.value))
                  setState("idle")
                }}
              />
            </div>
            <button
              type="submit"
              data-part="apply"
              disabled={!value || state === "checking"}
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
