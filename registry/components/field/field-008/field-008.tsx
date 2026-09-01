"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field008State = "idle" | "short" | "checking" | "taken" | "free"

export type Field008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  prefix?: string
  taken?: string[]
  delay?: number
  accent?: string
}

// Идея компонента: проверка на занятость прямо в поле. Ответ «этот адрес уже
// занят» после отправки формы — самая обидная ошибка регистрации, потому что
// к тому моменту заполнено всё остальное. Здесь проверка запускается сама
// через паузу после последнего нажатия, а состояние показано и значком, и
// словом: «проверяем», «занято», «свободно». Значок никогда не работает один.
const STYLES = `
:where([data-vibeui-block="field-008"]){
--vibeui-field-008-bg:oklch(1 0 0);
--vibeui-field-008-surface:oklch(1 0 0);
--vibeui-field-008-fill:oklch(0.975 0.004 265);
--vibeui-field-008-fg:oklch(0.24 0.014 265);
--vibeui-field-008-muted:oklch(0.55 0.014 265);
--vibeui-field-008-border:oklch(0.88 0.008 265);
--vibeui-field-008-shell:oklch(0.91 0.006 265);
--vibeui-field-008-accent:oklch(0.55 0.2 262);
--vibeui-field-008-ok:oklch(0.5 0.13 155);
--vibeui-field-008-busy:oklch(0.56 0.19 28);
--vibeui-field-008-state:var(--vibeui-field-008-muted);
--vibeui-field-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="field-008"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-008-surface);
border:1px solid var(--vibeui-field-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-008-font);color:var(--vibeui-field-008-fg);
}
[data-vibeui-block="field-008"] *{box-sizing:border-box}
[data-vibeui-block="field-008"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-008"] [data-part="frame"]{
display:flex;align-items:center;height:2.625rem;overflow:hidden;
background:var(--vibeui-field-008-bg);
border:1px solid var(--vibeui-field-008-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-008"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-field-008-state);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-008-state) 18%,transparent);
}
[data-vibeui-block="field-008"][data-state="taken"] [data-part="frame"],
[data-vibeui-block="field-008"][data-state="free"] [data-part="frame"]{border-color:var(--vibeui-field-008-state)}
[data-vibeui-block="field-008"] [data-part="prefix"]{
display:flex;align-items:center;align-self:stretch;padding:0 0.625rem;
background:var(--vibeui-field-008-fill);
border-inline-end:1px solid var(--vibeui-field-008-border);
font-size:0.8125rem;color:var(--vibeui-field-008-muted);user-select:none;
}
[data-vibeui-block="field-008"] input{
flex:1;min-width:0;padding:0 0.5rem;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-008"] input:focus{outline:none}
[data-vibeui-block="field-008"] [data-part="mark"]{
flex:none;position:relative;width:1rem;height:1rem;margin-inline-end:0.625rem;
}
/* Проверка: кольцо в две дуги. Значок дублируется словом ниже. */
[data-vibeui-block="field-008"][data-state="checking"] [data-part="mark"]{
border:2px solid color-mix(in oklab,var(--vibeui-field-008-muted) 35%,transparent);
border-top-color:var(--vibeui-field-008-muted);border-radius:9999px;
animation:vibeui-field-008-spin .7s linear infinite;
}
[data-vibeui-block="field-008"][data-state="free"] [data-part="mark"]::before{
content:"";position:absolute;left:0.1875rem;top:0;width:0.375rem;height:0.6875rem;
border-right:2px solid var(--vibeui-field-008-ok);
border-bottom:2px solid var(--vibeui-field-008-ok);
transform:rotate(42deg);
}
[data-vibeui-block="field-008"][data-state="taken"] [data-part="mark"]::before,
[data-vibeui-block="field-008"][data-state="taken"] [data-part="mark"]::after{
content:"";position:absolute;left:0;top:0.4375rem;width:100%;height:2px;
background:var(--vibeui-field-008-busy);border-radius:9999px;
}
[data-vibeui-block="field-008"][data-state="taken"] [data-part="mark"]::before{transform:rotate(45deg)}
[data-vibeui-block="field-008"][data-state="taken"] [data-part="mark"]::after{transform:rotate(-45deg)}
@keyframes vibeui-field-008-spin{to{transform:rotate(1turn)}}
[data-vibeui-block="field-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-008-state);
}
[data-vibeui-block="field-008"][data-state="taken"] [data-part="note"],
[data-vibeui-block="field-008"][data-state="free"] [data-part="note"]{font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TAKEN = ["vibeui", "admin", "shop", "team"]

const NOTES: Record<Field008State, string> = {
  idle: "Адрес можно будет поменять позже, но старая ссылка перестанет работать.",
  short: "Нужно хотя бы три символа.",
  checking: "Проверяем, свободен ли адрес…",
  taken: "Занято. Попробуйте другой адрес.",
  free: "Свободно — этот адрес закрепим за вами.",
}

/**
 * Поле с проверкой занятости: пауза после ввода, состояние словом и значком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field008({
  label = "Адрес рабочего пространства",
  prefix = "vibeui.ru/",
  taken = DEFAULT_TAKEN,
  delay = 600,
  accent,
  className,
  style,
  ...props
}: Field008Props) {
  const [value, setValue] = useState("")
  const [answer, setAnswer] = useState<{
    query: string
    verdict: Field008State
  } | null>(null)

  const query = value.trim().toLowerCase()

  // Состояние выводится из значения, а не хранится: в состоянии живёт только
  // ответ проверки, и он привязан к запросу, на который отвечал.
  const state: Field008State = !query
    ? "idle"
    : query.length < 3
      ? "short"
      : answer?.query === query
        ? answer.verdict
        : "checking"

  useEffect(() => {
    if (state !== "checking") return

    // Пауза после последнего нажатия, а не запрос на каждую букву:
    // иначе на длинном адресе улетает десяток проверок подряд.
    const timer = window.setTimeout(() => {
      setAnswer({ query, verdict: taken.includes(query) ? "taken" : "free" })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [state, query, taken, delay])

  const tone =
    state === "free"
      ? "var(--vibeui-field-008-ok)"
      : state === "taken"
        ? "var(--vibeui-field-008-busy)"
        : "var(--vibeui-field-008-muted)"

  const palette = {
    "--vibeui-field-008-state": tone,
    ...(accent ? { "--vibeui-field-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-008"
        data-state={state}
        className={className}
        style={palette}
      >
        <label htmlFor="field-008-input">{label}</label>
        <div data-part="frame">
          <span data-part="prefix" aria-hidden="true">
            {prefix}
          </span>
          <input
            id="field-008-input"
            name="workspace"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="ваша-команда"
            value={value}
            aria-describedby="field-008-note"
            aria-invalid={state === "taken" ? true : undefined}
            onChange={(event) => setValue(event.target.value)}
          />
          <span data-part="mark" aria-hidden="true" />
        </div>
        {/* Состояние словом: значок сам по себе не читается вслух. */}
        <p id="field-008-note" data-part="note" role="status">
          {NOTES[state]}
        </p>
      </div>
    </>
  )
}
