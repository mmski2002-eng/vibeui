"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup042Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  score?: number
  upLabel?: string
  downLabel?: string
  label?: string
  onChange?: (vote: "up" | "down" | null) => void
  accent?: string
}

// Идея компонента: голосование, где два тумблера гасят друг друга, но
// каждый умеет сняться сам. Повторное нажатие на уже отданный голос
// отзывает его — это ожидаемое поведение, которое radio дать не может:
// снять выбор у radio без второй кнопки нельзя. Поэтому здесь пара
// aria-pressed, а взаимное исключение сделано в обработчике. Счёт стоит
// между кнопками, набран табличными цифрами и не меняет ширину при
// переходе через ноль; знак минуса рисуется текстом, а не цветом.
const STYLES = `
:where([data-vibeui-block="buttongroup-042"]){
--vibeui-buttongroup-042-surface:oklch(1 0 0);
--vibeui-buttongroup-042-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-042-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-042-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-042-up:oklch(0.52 0.15 150);
--vibeui-buttongroup-042-down:oklch(0.55 0.18 27);
--vibeui-buttongroup-042-accent:oklch(0.5 0.15 265);
--vibeui-buttongroup-042-radius:9999px;
--vibeui-buttongroup-042-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-042"]{
box-sizing:border-box;display:inline-flex;align-items:center;
border:1px solid var(--vibeui-buttongroup-042-border);
border-radius:var(--vibeui-buttongroup-042-radius);
background:var(--vibeui-buttongroup-042-surface);
font-family:var(--vibeui-buttongroup-042-font);
}
[data-vibeui-block="buttongroup-042"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-042"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;
border:0;border-radius:var(--vibeui-buttongroup-042-radius);
background:transparent;
color:var(--vibeui-buttongroup-042-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-042"] svg{
width:1.0625rem;height:1.0625rem;
stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;
transition:fill .16s ease;
}
[data-vibeui-block="buttongroup-042"] button:hover{
background:oklch(0.965 0.005 265);color:var(--vibeui-buttongroup-042-fg);
}
[data-vibeui-block="buttongroup-042"] [data-vote="up"][aria-pressed="true"]{color:var(--vibeui-buttongroup-042-up)}
[data-vibeui-block="buttongroup-042"] [data-vote="down"][aria-pressed="true"]{color:var(--vibeui-buttongroup-042-down)}
/* Заливка значка — второй признак: цвет один при дальтонизме не работает. */
[data-vibeui-block="buttongroup-042"] button[aria-pressed="true"] svg{fill:currentColor}
[data-vibeui-block="buttongroup-042"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-042-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-042"] [data-part="score"]{
min-width:2.25rem;padding:0 0.25rem;text-align:center;
border-inline:1px solid var(--vibeui-buttongroup-042-border);
color:var(--vibeui-buttongroup-042-fg);
font-size:0.8125rem;font-weight:700;line-height:2.125rem;
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-042"] *{animation:none!important;transition:none!important}}
`

const UP = "M7 21V10l5-7 1 1-1 5h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2z"
const DOWN = "M7 3v11l5 7 1-1-1-5h6a2 2 0 0 0 2-2l-2-8a2 2 0 0 0-2-2z"

/**
 * Голосование вверх/вниз, где повторное нажатие отзывает собственный голос.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup042({
  score = 42,
  upLabel = "Полезный ответ",
  downLabel = "Бесполезный ответ",
  label = "Оценка ответа",
  onChange,
  accent,
  className,
  style,
  ...props
}: Buttongroup042Props) {
  const [vote, setVote] = useState<"up" | "down" | null>(null)
  const shown = score + (vote === "up" ? 1 : vote === "down" ? -1 : 0)

  const toggle = (next: "up" | "down") => {
    const value = vote === next ? null : next
    setVote(value)
    onChange?.(value)
  }

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-042-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-042" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-042"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          data-vote="up"
          aria-pressed={vote === "up"}
          aria-label={upLabel}
          onClick={() => toggle("up")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={UP} />
          </svg>
        </button>
        <span data-part="score" aria-live="polite">
          {shown}
        </span>
        <button
          type="button"
          data-vote="down"
          aria-pressed={vote === "down"}
          aria-label={downLabel}
          onClick={() => toggle("down")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={DOWN} />
          </svg>
        </button>
      </div>
    </>
  )
}
