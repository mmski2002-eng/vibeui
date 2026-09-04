"use client"

import { useEffect, useRef, useState } from "react"
import type { ClipboardEvent, ComponentProps, CSSProperties } from "react"

export type Field012Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  /** Строка на время после отменённой вставки. */
  blockedText?: string
  placeholder?: string
  defaultValue?: string
  name?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: повторное поле обычно проверяет не опечатку, а то, что
// человек ввёл значение сам — а вставка того же текста, что и в первом поле,
// делает проверку бессмысленной: опечатка повторится незамеченной. Вставка
// здесь отключена через preventDefault, но молча — это выглядело бы как
// сломанное поле, поэтому попытка на секунды подсвечивает рамку и меняет
// строку под полем, а после гаснет сама, без клика.
const STYLES = `
:where([data-vibeui-block="field-012"]){
--vibeui-field-012-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-field-012-surface:transparent;
--vibeui-field-012-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-field-012-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-field-012-muted:color-mix(in oklab,var(--vibeui-field-012-fg) 68%,transparent);
--vibeui-field-012-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.012 265));
--vibeui-field-012-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-field-012-warn:light-dark(oklch(0.58 0.16 75),oklch(0.78 0.14 75));
--vibeui-field-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="field-012"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="field-012"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
background:var(--vibeui-field-012-surface);
border:1px solid var(--vibeui-field-012-shell);border-radius:0.875rem;
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-field-012-font);color:var(--vibeui-field-012-fg);
}
[data-vibeui-block="field-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-012"] input{
width:100%;box-sizing:border-box;height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-field-012-bg);color:inherit;
border:1px solid var(--vibeui-field-012-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-012"] input::placeholder{color:var(--vibeui-field-012-muted)}
[data-vibeui-block="field-012"] input:focus-visible{
outline:2px solid var(--vibeui-field-012-accent);outline-offset:1px;border-color:var(--vibeui-field-012-accent);
}
[data-vibeui-block="field-012"][data-blocked="1"] input{
border-color:var(--vibeui-field-012-warn);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-012-warn) 16%,transparent);
}
[data-vibeui-block="field-012"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-012-muted);
}
[data-vibeui-block="field-012"][data-blocked="1"] [data-part="note"]{
color:var(--vibeui-field-012-warn);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-012"] *{animation:none!important;transition:none!important}}
`

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

/**
 * Поле повтора без вставки: preventDefault на paste не молчит, а на секунды
 * подсвечивает рамку и меняет пояснение, потом гаснет сам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field012({
  label = "Повторите email",
  hint = "Наберите вручную — так опечатка в первом поле не проскочит незамеченной.",
  blockedText = "Вставка отключена: наберите значение вручную.",
  placeholder = "name@company.ru",
  defaultValue = "",
  name = "email-confirm",
  background = "",
  accent,
  className,
  style,
  ...props
}: Field012Props) {
  const [blocked, setBlocked] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  const reject = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    setBlocked(true)
    window.clearTimeout(timer.current)
    // Гаснет сама через паузу: постоянное предупреждение перестаёт замечаться,
    // а без автосброса человеку пришлось бы убирать его руками.
    timer.current = window.setTimeout(() => setBlocked(false), 2400)
  }

  const palette = {
    ...(accent ? { "--vibeui-field-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-field-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="field"
        data-vibeui-block="field-012"
        data-blocked={blocked ? "1" : "0"}
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-input`}>{label}</label>
        <input
          id={`${name}-input`}
          name={name}
          type="email"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby={`${name}-note`}
          onPaste={reject}
          onChange={() => setBlocked(false)}
        />
        <p id={`${name}-note`} data-part="note" role="status">
          {blocked ? blockedText : hint}
        </p>
      </div>
    </>
  )
}
