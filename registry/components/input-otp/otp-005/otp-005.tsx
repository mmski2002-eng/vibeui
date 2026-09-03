"use client"

import { Fragment, useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp005Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  groups?: number[]
  hint?: string
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  onChange?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: код разбит на группы с дефисом посередине — так его
// диктуют вслух и так печатают в письме. Дефис не поле и не текст внутри
// клетки: это отдельный элемент с aria-hidden, чтобы его не озвучивали
// и по нему нельзя было промахнуться мышью. Группы задаются массивом длин,
// поэтому «3-3», «2-2-2» и «4-4» — один и тот же компонент.
const STYLES = `
:where([data-vibeui-block="otp-005"]){
--vibeui-otp-005-bg:transparent;
--vibeui-otp-005-surface:light-dark(oklch(1 0 0),oklch(0.31 0.014 265));
--vibeui-otp-005-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-005-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-005-muted:color-mix(in oklab,var(--vibeui-otp-005-fg) 68%,transparent);
--vibeui-otp-005-field:light-dark(oklch(0.98 0.002 265),oklch(0.25 0.014 265));
--vibeui-otp-005-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-005-accent:light-dark(oklch(0.5 0.15 160),oklch(0.74 0.14 160));
--vibeui-otp-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-005"]{color-scheme:dark}
[data-vibeui-block="otp-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-005-bg);
border:1px solid var(--vibeui-otp-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-005-font);color:var(--vibeui-otp-005-fg);
}
[data-vibeui-block="otp-005"] *{box-sizing:border-box}
[data-vibeui-block="otp-005"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
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
margin:0;font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-005-muted);
}
/* Шкала категории. Порог 19rem, а не 32rem: карточка упёрта в max-width:22rem. */
@container (min-width: 19rem){
[data-vibeui-block="otp-005"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-005"] [data-part="hint"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-005"] *{animation:none!important;transition:none!important}}
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
 * Код подтверждения группами через дефис: так его диктуют и так печатают в письме.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp005({
  label = "Код из письма",
  groups = [3, 3],
  hint = "Дефис ставить не нужно — он нарисован, а не набирается.",
  digitLabel = "Цифра {index} из {total}",
  onChange,
  background = "",
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
    ...(background
      ? {
          "--vibeui-otp-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const digitName = (index: number) =>
    digitLabel
      .replace("{index}", String(index + 1))
      .replace("{total}", String(size))

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
        data-slot="input-otp"
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
                        aria-label={digitName(index)}
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
