"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, FormEvent } from "react"

export type Input013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  codes?: Record<string, number>
  onApply?: (code: string, percent: number) => void
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
--vibeui-input-013-surface:oklch(1 0 0);
--vibeui-input-013-shell:oklch(0.91 0.006 265);
--vibeui-input-013-fg:oklch(0.23 0.014 265);
--vibeui-input-013-muted:oklch(0.55 0.014 265);
--vibeui-input-013-field:oklch(0.985 0.002 265);
--vibeui-input-013-border:oklch(0.88 0.008 265);
--vibeui-input-013-accent:oklch(0.5 0.16 300);
--vibeui-input-013-bad:oklch(0.55 0.2 25);
--vibeui-input-013-ok:oklch(0.48 0.13 155);
--vibeui-input-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
appearance:none;flex:none;cursor:pointer;
height:2.5rem;padding:0 0.875rem;border:0;border-radius:0.75rem;
background:var(--vibeui-input-013-accent);color:oklch(1 0 0);
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

/**
 * Поле промокода с проверкой и тремя состояниями: ввод, ожидание, применён.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input013({
  label = "Промокод",
  codes = CODES,
  onApply,
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
        data-vibeui-block="input-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        {state === "done" ? (
          <div data-part="applied">
            <code>{value.trim().toUpperCase()}</code>
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
                placeholder="Например, VIBE10"
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
            ? "Такого кода нет или он уже использован."
            : state === "done"
              ? "Код можно снять и ввести другой — они не складываются."
              : "Код из письма или с чека. Регистр не важен."}
        </p>
      </div>
    </>
  )
}
