"use client"

import { Fragment, useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  groups?: number[]
  hint?: string
  onChange?: (code: string) => void
  accent?: string
}

// Идея компонента: код разбит на группы с дефисом посередине — так его
// диктуют вслух и так печатают в письме. Дефис не поле и не текст внутри
// клетки: это отдельный элемент с aria-hidden, чтобы его не озвучивали
// и по нему нельзя было промахнуться мышью. Группы задаются массивом длин,
// поэтому «3-3», «2-2-2» и «4-4» — один и тот же компонент.
const STYLES = `
:where([data-vibeui-block="otp-005"]){
--vibeui-otp-005-surface:oklch(1 0 0);
--vibeui-otp-005-shell:oklch(0.91 0.006 265);
--vibeui-otp-005-fg:oklch(0.21 0.014 265);
--vibeui-otp-005-muted:oklch(0.56 0.014 265);
--vibeui-otp-005-field:oklch(0.98 0.002 265);
--vibeui-otp-005-border:oklch(0.87 0.008 265);
--vibeui-otp-005-accent:oklch(0.5 0.15 160);
--vibeui-otp-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-005-surface);
border:1px solid var(--vibeui-otp-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-005-font);color:var(--vibeui-otp-005-fg);
}
[data-vibeui-block="otp-005"] *{box-sizing:border-box}
[data-vibeui-block="otp-005"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-005"] [data-part="row"]{display:flex;align-items:center;gap:0.5rem}
/* Внутри группы клетки сцеплены: общая рамка, схлопнутые границы,
   фокусная клетка поднимается над соседями. */
[data-vibeui-block="otp-005"] [data-part="pack"]{display:flex;flex:1;min-width:0}
[data-vibeui-block="otp-005"] input{
flex:1;min-width:0;height:3rem;padding:0;position:relative;
border:1px solid var(--vibeui-otp-005-border);border-radius:0;margin-left:-1px;
background:var(--vibeui-otp-005-field);color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-005"] [data-part="pack"] input:first-child{
margin-left:0;border-radius:0.625rem 0 0 0.625rem;
}
[data-vibeui-block="otp-005"] [data-part="pack"] input:last-child{
border-radius:0 0.625rem 0.625rem 0;
}
[data-vibeui-block="otp-005"] input:focus-visible{
z-index:1;outline:2px solid var(--vibeui-otp-005-accent);outline-offset:-1px;
border-color:var(--vibeui-otp-005-accent);
}
[data-vibeui-block="otp-005"] input:not(:placeholder-shown){
background:var(--vibeui-otp-005-surface);
}
[data-vibeui-block="otp-005"] [data-part="dash"]{
flex:none;width:0.75rem;height:2px;border-radius:1px;
background:var(--vibeui-otp-005-muted);opacity:.5;
}
[data-vibeui-block="otp-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Код подтверждения группами через дефис: так его диктуют и так печатают в письме.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp005({
  label = "Код из письма",
  groups = [3, 3],
  hint = "Дефис ставить не нужно — он нарисован, а не набирается.",
  onChange,
  accent,
  className,
  style,
  ...props
}: Otp005Props) {
  const id = useId()
  const size = groups.reduce((total, part) => total + part, 0)
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-otp-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: string[]) => {
    setCode(next)
    onChange?.(next.join(""))
  }

  const type = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[index] = digit
    push(next)
    if (digit && index < size - 1) boxes.current[index + 1]?.focus()
  }

  // Вставка перехватывается на любой клетке: код копируют целиком,
  // а группы — оформление, а не части значения.
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    push(Array.from({ length: size }, (_, index) => digits[index] ?? ""))
    boxes.current[Math.min(digits.length, size - 1)]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault()
      const next = [...code]
      next[index - 1] = ""
      push(next)
      boxes.current[index - 1]?.focus()
    } else if (event.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < size - 1) {
      boxes.current[index + 1]?.focus()
    }
  }

  // Номер первой клетки группы считается суммой предыдущих длин: копить его
  // в переменной по ходу отрисовки нельзя — это правка состояния во время
  // рендера.
  const packs = groups.map((count, index) => ({
    count,
    start: groups.slice(0, index).reduce((total, part) => total + part, 0),
  }))

  return (
    <>
      <style href="vibeui-otp-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-005"
        className={className}
        style={palette}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="row">
          {packs.map(({ count, start }, groupIndex) => {
            return (
              <Fragment key={groupIndex}>
                {groupIndex > 0 ? (
                  <span data-part="dash" aria-hidden="true" />
                ) : null}
                <div data-part="pack">
                  {Array.from({ length: count }, (_, offset) => {
                    const index = start + offset

                    return (
                      <input
                        key={index}
                        ref={(node) => {
                          boxes.current[index] = node
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        placeholder=" "
                        value={code[index]}
                        aria-label={`Цифра ${index + 1} из ${size}`}
                        aria-describedby={`${id}-hint`}
                        onChange={(event) => type(index, event.target.value)}
                        onPaste={paste}
                        onKeyDown={(event) => onKeyDown(event, index)}
                      />
                    )
                  })}
                </div>
              </Fragment>
            )
          })}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
