"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  /** Пауза без набора, после которой черновик уходит на сервер. */
  delay?: number
  accent?: string
}

// Идея компонента: черновик, который сохраняется сам. Кнопка «сохранить»
// под длинным текстом — источник потерянных ответов, поэтому запись идёт
// по паузе в наборе. Пауза обязательна: сохранять на каждое нажатие значит
// слать запрос на каждую букву. Строка статуса показывает не «идёт запрос»,
// а понятное «черновик сохранён» и время — это то, что человек хочет знать.
const STYLES = `
:where([data-vibeui-block="textarea-006"]){
--vibeui-textarea-006-bg:oklch(1 0 0);
--vibeui-textarea-006-fg:oklch(0.22 0.014 265);
--vibeui-textarea-006-muted:oklch(0.55 0.014 265);
--vibeui-textarea-006-border:oklch(0.9 0.006 265);
--vibeui-textarea-006-field:oklch(0.985 0.002 265);
--vibeui-textarea-006-accent:oklch(0.55 0.17 265);
--vibeui-textarea-006-ok:oklch(0.52 0.14 155);
--vibeui-textarea-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-006"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-006-bg);
border:1px solid var(--vibeui-textarea-006-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-006-font);color:var(--vibeui-textarea-006-fg);
}
[data-vibeui-block="textarea-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="textarea-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-006"] textarea{
box-sizing:border-box;width:100%;min-height:6rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-textarea-006-border);border-radius:0.625rem;
background:var(--vibeui-textarea-006-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.55;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-006"] textarea:focus{
outline:none;border-color:var(--vibeui-textarea-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-006-accent) 18%,transparent);
}
/* Статус занимает место всегда: строка, которая то появляется, то исчезает,
   дёргает поле и мешает целиться в него. */
[data-vibeui-block="textarea-006"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;min-height:1.125rem;
font-size:0.75rem;color:var(--vibeui-textarea-006-muted);
}
[data-vibeui-block="textarea-006"][data-state="saved"] [data-part="status"]{color:var(--vibeui-textarea-006-ok)}
[data-vibeui-block="textarea-006"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-textarea-006-muted);
}
[data-vibeui-block="textarea-006"][data-state="dirty"] [data-part="dot"]{
background:var(--vibeui-textarea-006-accent);
animation:vibeui-textarea-006-pulse 1.2s ease-in-out infinite;
}
[data-vibeui-block="textarea-006"][data-state="saved"] [data-part="dot"]{background:var(--vibeui-textarea-006-ok)}
@keyframes vibeui-textarea-006-pulse{0%,100%{opacity:1}50%{opacity:.35}}
[data-vibeui-block="textarea-006"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-textarea-006-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-006"] *{animation:none!important;transition:none!important}}
`

const START =
  "Пока это черновик: набросок ответа, который никто, кроме вас, не видит."

// Своё «чч:мм»: toLocaleTimeString на сервере и в браузере может дать
// разный формат и развалить гидрацию.
function clock(date: Date) {
  const pad = (part: number) => String(part).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Поле с автосохранением черновика: запись по паузе, статус со временем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea006({
  label = "Черновик ответа",
  placeholder = "Начните печатать — черновик сохранится сам",
  delay = 1200,
  accent,
  className,
  style,
  ...props
}: Textarea006Props) {
  const id = useId()
  const [value, setValue] = useState(START)
  const [state, setState] = useState<"idle" | "dirty" | "saved">("idle")
  const [savedAt, setSavedAt] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const palette = {
    ...(accent ? { "--vibeui-textarea-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-006"
        data-state={state}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="count">{value.length} симв.</span>
        </div>
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          aria-describedby={`${id}-status`}
          onChange={(event) => {
            setValue(event.target.value)
            setState("dirty")
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
              setSavedAt(clock(new Date()))
              setState("saved")
            }, delay)
          }}
        />
        <p data-part="status" id={`${id}-status`} role="status">
          <span data-part="dot" aria-hidden="true" />
          {state === "dirty" ? "Есть несохранённые правки…" : null}
          {state === "saved" ? `Черновик сохранён в ${savedAt}` : null}
          {state === "idle" ? "Сохраняется автоматически" : null}
        </p>
      </div>
    </>
  )
}
