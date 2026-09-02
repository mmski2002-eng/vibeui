"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Otp006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  /** Подпись под полем. */
  hint?: string
  /** Подписи кнопки показа: ключи show и hide. */
  peekText?: Record<string, string>
  onChange?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const PEEK_LABEL: Record<string, string> = {
  show: "Показать",
  hide: "Скрыть",
}

// Идея компонента: одно поле вместо клеток. Клетки красивы, но ломают
// автозаполнение в старых браузерах, мешают выделить код целиком и плохо
// живут в узкой колонке. Здесь обычный input с моноширинным шрифтом и
// разрядкой, а место для недобранных цифр держит подложка из точек. Цифры
// закрыты кружками, но их можно показать кнопкой: код читают с чужого экрана
// реже, чем ошибаются в нём.
const STYLES = `
:where([data-vibeui-block="otp-006"]){
--vibeui-otp-006-bg:transparent;
--vibeui-otp-006-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-006-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-006-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.014 265));
--vibeui-otp-006-field:light-dark(oklch(0.98 0.002 265),oklch(0.26 0.014 265));
--vibeui-otp-006-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-006-accent:light-dark(oklch(0.5 0.17 300),oklch(0.75 0.15 300));
--vibeui-otp-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-otp-006-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="otp-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-006-bg);
border:1px solid var(--vibeui-otp-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-006-font);color:var(--vibeui-otp-006-fg);
}
[data-vibeui-block="otp-006"] *{box-sizing:border-box}
[data-vibeui-block="otp-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-006"] [data-part="frame"]{
position:relative;display:flex;align-items:center;gap:0.5rem;
height:3.25rem;padding:0 0.5rem 0 1rem;
background:var(--vibeui-otp-006-field);
border:1.5px solid var(--vibeui-otp-006-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="otp-006"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-otp-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-otp-006-accent) 18%,transparent);
}
[data-vibeui-block="otp-006"] [data-part="slot"]{position:relative;flex:1;min-width:0}
/* Подложка из точек держит место под весь код: строка не «растёт»
   по мере набора и не дёргает кнопку показа. */
[data-vibeui-block="otp-006"] [data-part="ghost"]{
position:absolute;inset:0;display:flex;align-items:center;pointer-events:none;
color:color-mix(in oklab,var(--vibeui-otp-006-muted) 45%,transparent);
}
[data-vibeui-block="otp-006"] [data-part="ghost"] span,
[data-vibeui-block="otp-006"] input{
font-family:var(--vibeui-otp-006-mono);font-size:1.375rem;font-weight:700;
letter-spacing:0.55em;
}
[data-vibeui-block="otp-006"] input{
position:relative;width:100%;height:2.75rem;padding:0;
border:0;background:transparent;color:inherit;
caret-color:var(--vibeui-otp-006-accent);
}
[data-vibeui-block="otp-006"] input:focus{outline:none}
[data-vibeui-block="otp-006"] [data-part="peek"]{
appearance:none;flex:none;cursor:pointer;
height:2.25rem;padding:0 0.625rem;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-otp-006-muted);
font:inherit;font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="otp-006"] [data-part="peek"]:hover{
background:color-mix(in oklab,var(--vibeui-otp-006-fg) 8%,transparent);
color:var(--vibeui-otp-006-fg);
}
[data-vibeui-block="otp-006"] [data-part="peek"]:focus-visible{
outline:2px solid var(--vibeui-otp-006-accent);outline-offset:1px;
}
[data-vibeui-block="otp-006"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-006-muted);
}
[data-vibeui-block="otp-006"] [data-part="foot"] b{
font-variant-numeric:tabular-nums;font-weight:650;color:var(--vibeui-otp-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-006"] *{animation:none!important;transition:none!important}}
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
 * Код подтверждения одной строкой: моноширинная разрядка вместо клеток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp006({
  label = "Код подтверждения",
  length = 6,
  hint = "Вставка целиком работает — это обычное поле.",
  peekText = PEEK_LABEL,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp006Props) {
  const id = useId()
  const size = Math.max(4, Math.min(10, length))
  const [code, setCode] = useState("")
  const [shown, setShown] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-otp-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const peekKey = shown ? "hide" : "show"

  return (
    <>
      <style href="vibeui-otp-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-006"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <div data-part="slot">
            <div data-part="ghost" aria-hidden="true">
              <span>{"·".repeat(size)}</span>
            </div>
            <input
              id={id}
              type={shown ? "text" : "password"}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={size}
              value={code}
              aria-describedby={`${id}-foot`}
              onChange={(event) => {
                const next = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, size)
                setCode(next)
                onChange?.(next)
              }}
            />
          </div>
          <button
            type="button"
            data-part="peek"
            aria-pressed={shown}
            onClick={() => setShown((was) => !was)}
          >
            {peekText[peekKey] ?? PEEK_LABEL[peekKey]}
          </button>
        </div>
        <p data-part="foot" id={`${id}-foot`}>
          <span>{hint}</span>
          <b>
            {code.length}/{size}
          </b>
        </p>
      </div>
    </>
  )
}
