"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Otp002Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  hint?: string
  onChange?: (code: string) => void
  /** Начальный код в ячейках: витрине нужен вид наполовину введённого кода. */
  defaultCode?: string
  /** Каретка стоит в текущей ячейке, пока поле не получило настоящий фокус. */
  defaultFocused?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ячеек шесть, а поле одно. Прозрачный input растянут поверх
// ячеек, ячейки — просто отрисовка его значения. Отсюда бесплатно берутся
// вставка целиком, автопереход, Backspace, стрелки, отмена и системная
// подстановка кода — всё это умеет обычное текстовое поле, и городить шесть
// input'ов с переносом фокуса не нужно. Каретка нарисована сама: у прозрачного
// поля её не видно.
const STYLES = `
:where([data-vibeui-block="otp-002"]){
--vibeui-otp-002-bg:transparent;
--vibeui-otp-002-surface:light-dark(oklch(1 0 0),oklch(0.3 0.014 265));
--vibeui-otp-002-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-002-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-002-muted:color-mix(in oklab,var(--vibeui-otp-002-fg) 68%,transparent);
--vibeui-otp-002-field:light-dark(oklch(0.98 0.002 265),oklch(0.25 0.014 265));
--vibeui-otp-002-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-002-accent:light-dark(oklch(0.52 0.18 285),oklch(0.74 0.16 285));
--vibeui-otp-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-002"]{color-scheme:dark}
[data-vibeui-block="otp-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);max-width:21rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-002-bg);
border:1px solid var(--vibeui-otp-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-002-font);color:var(--vibeui-otp-002-fg);
}
[data-vibeui-block="otp-002"] *{box-sizing:border-box}
[data-vibeui-block="otp-002"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="otp-002"] [data-part="shell"]{position:relative}
/* Настоящее поле прозрачно, и его собственный контур не виден. Клавиатурный
   фокус рисуем на оболочке: подсветка активной ячейки гаснет, когда код
   набран целиком, и полный фокус иначе оставался бы вовсе без индикатора. */
[data-vibeui-block="otp-002"] [data-part="shell"]:has(input:focus-visible){
border-radius:0.75rem;outline:2px solid var(--vibeui-otp-002-accent);outline-offset:3px;
}
/* Настоящее поле лежит поверх ячеек и полностью прозрачно: щелчок в любую
   ячейку попадает в него, а системная клавиатура и автоподстановка работают. */
[data-vibeui-block="otp-002"] input{
position:absolute;inset:0;width:100%;height:100%;
padding:0;border:0;margin:0;background:transparent;
color:transparent;caret-color:transparent;
font:inherit;font-size:1rem;letter-spacing:2rem;
}
[data-vibeui-block="otp-002"] input:focus{outline:none}
[data-vibeui-block="otp-002"] [data-part="row"]{
display:flex;gap:0.375rem;pointer-events:none;
}
[data-vibeui-block="otp-002"] [data-part="cell"]{
flex:1;min-width:0;height:3rem;
display:grid;place-items:center;
border:1.5px solid var(--vibeui-otp-002-border);border-radius:0.625rem;
background:var(--vibeui-otp-002-field);
font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="otp-002"] [data-part="cell"][data-filled="1"]{
border-color:color-mix(in oklab,var(--vibeui-otp-002-accent) 55%,transparent);
background:var(--vibeui-otp-002-surface);
}
[data-vibeui-block="otp-002"] [data-part="cell"][data-active="1"]{
border-color:var(--vibeui-otp-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-otp-002-accent) 18%,transparent);
}
/* Каретка рисуется сама: у прозрачного поля её не видно. */
[data-vibeui-block="otp-002"] [data-part="caret"]{
width:2px;height:1.375rem;border-radius:1px;
background:var(--vibeui-otp-002-accent);
animation:vibeui-otp-002-blink 1.06s steps(2,start) infinite;
}
@keyframes vibeui-otp-002-blink{50%{opacity:0}}
[data-vibeui-block="otp-002"] [data-part="hint"]{
margin:0;font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-002-muted);
}
/* Шкала категории. Порог 19rem, а не 32rem: карточка упёрта в max-width:21rem. */
@container (min-width: 19rem){
[data-vibeui-block="otp-002"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-002"] [data-part="hint"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Код подтверждения: шесть ячеек, но одно настоящее поле под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp002({
  label = "Код подтверждения",
  length = 6,
  hint = "Вставьте код целиком — он разложится по ячейкам сам.",
  onChange,
  defaultCode = "",
  defaultFocused = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp002Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState(() =>
    defaultCode.replace(/\D/g, "").slice(0, size),
  )
  const [focused, setFocused] = useState(defaultFocused)
  const field = useRef<HTMLInputElement | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-otp-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const cells = Array.from({ length: size }, (_, index) => code[index] ?? "")
  const at = Math.min(code.length, size - 1)

  return (
    <>
      <style href="vibeui-otp-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-002"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="shell">
          <div data-part="row" aria-hidden="true">
            {cells.map((digit, index) => (
              <div
                key={index}
                data-part="cell"
                data-filled={digit ? "1" : "0"}
                data-active={
                  focused && index === at && code.length < size ? "1" : "0"
                }
              >
                {digit ||
                  (focused && index === at ? <span data-part="caret" /> : null)}
              </div>
            ))}
          </div>
          <input
            ref={field}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={size}
            value={code}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-hint`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, size)
              setCode(next)
              onChange?.(next)
            }}
          />
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
