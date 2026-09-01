"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, FormEvent } from "react"

export type Input021Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  codes?: Record<string, number>
  onApply?: (code: string, percent: number) => void
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
--vibeui-input-021-surface:oklch(1 0 0);
--vibeui-input-021-shell:oklch(0.91 0.006 265);
--vibeui-input-021-fg:oklch(0.23 0.014 265);
--vibeui-input-021-muted:oklch(0.55 0.014 265);
--vibeui-input-021-field:oklch(0.985 0.002 265);
--vibeui-input-021-border:oklch(0.88 0.008 265);
--vibeui-input-021-accent:oklch(0.5 0.16 300);
--vibeui-input-021-bad:oklch(0.55 0.2 25);
--vibeui-input-021-ok:oklch(0.48 0.13 155);
--vibeui-input-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-input-021-accent);color:oklch(1 0 0);
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
        data-vibeui-block="input-021"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        {state === "done" ? (
          <div data-part="applied">
            <code>{group(value)}</code>
            <span>скидка {percent}% уже в сумме заказа</span>
            <button
              type="button"
              data-part="off"
              onClick={() => {
                setValue("")
                setPercent(0)
                setState("idle")
              }}
            >
              Снять
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
                placeholder="VIBE-2026-SALE"
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
              {state === "checking" ? "Проверяем…" : "Применить"}
            </button>
          </form>
        )}
        <p
          data-part="note"
          id={`${id}-note`}
          aria-live="polite"
          data-tone={state === "bad" ? "bad" : "calm"}
        >
          {state === "bad"
            ? "Такого ключа нет или он уже использован."
            : state === "done"
              ? "Код можно снять и ввести другой — они не складываются."
              : "Двенадцать символов, дефисы подставляются сами. Регистр не важен."}
        </p>
      </div>
    </>
  )
}
