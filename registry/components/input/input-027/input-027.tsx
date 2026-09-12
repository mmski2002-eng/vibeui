"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input027Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  placeholder?: string
  /**
   * Примечание под полем: ключи empty, invalid и ready. В ready подставляется
   * {color} — получившийся цвет.
   */
  noteText?: Record<string, string>
  onChange?: (hex: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле принимает hex как текст — с решёткой или без,
// в три или шесть знаков — а превью-квадрат перед полем всегда показывает,
// что из этого текста реально получится. Пока значение неполное или не hex,
// квадрат остаётся клетчатым (обозначение «нет цвета»), а не молча гаснет:
// разница между «ещё не дописали» и «ошиблись» должна быть видна глазами.
const STYLES = `
:where([data-vibeui-block="input-027"]){
--vibeui-input-027-surface:transparent;
--vibeui-input-027-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-input-027-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-027-muted:color-mix(in oklab,var(--vibeui-input-027-fg) 68%,transparent);
--vibeui-input-027-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-027-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-input-027-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-input-027-bad:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.16 25));
--vibeui-input-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-027"]{color-scheme:dark}
[data-vibeui-block="input-027"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-027-surface);
border:1px solid var(--vibeui-input-027-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-027-font);color:var(--vibeui-input-027-fg);
}
[data-vibeui-block="input-027"] *{box-sizing:border-box}
[data-vibeui-block="input-027"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-027"] [data-part="row"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="input-027"] [data-part="swatch"]{
flex:none;width:2.5rem;height:2.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-input-027-border);
background-image:
  linear-gradient(45deg,color-mix(in oklab,var(--vibeui-input-027-fg) 8%,transparent) 25%,transparent 25%),
  linear-gradient(-45deg,color-mix(in oklab,var(--vibeui-input-027-fg) 8%,transparent) 25%,transparent 25%),
  linear-gradient(45deg,transparent 75%,color-mix(in oklab,var(--vibeui-input-027-fg) 8%,transparent) 75%),
  linear-gradient(-45deg,transparent 75%,color-mix(in oklab,var(--vibeui-input-027-fg) 8%,transparent) 75%);
background-size:0.625rem 0.625rem;
background-position:0 0,0 0.3125rem,0.3125rem -0.3125rem,-0.3125rem 0;
}
[data-vibeui-block="input-027"] [data-part="frame"]{
flex:1;min-width:0;display:flex;align-items:center;gap:0.375rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-027-field);
border:1px solid var(--vibeui-input-027-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-027"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-027-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-027-accent) 18%,transparent);
}
[data-vibeui-block="input-027"][data-invalid="1"] [data-part="frame"]{border-color:var(--vibeui-input-027-bad)}
[data-vibeui-block="input-027"] [data-part="hash"]{color:var(--vibeui-input-027-muted);font-size:0.9375rem;user-select:none}
[data-vibeui-block="input-027"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;letter-spacing:0.04em;text-transform:uppercase;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-027"] input:focus{outline:none}
[data-vibeui-block="input-027"] input::placeholder{text-transform:none}
[data-vibeui-block="input-027"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-027-muted);
}
[data-vibeui-block="input-027"][data-invalid="1"] [data-part="note"]{color:var(--vibeui-input-027-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-027"] *{animation:none!important;transition:none!important}}
`

const NOTE: Record<string, string> = {
  empty: "Три или шесть шестнадцатеричных знаков, решётка не нужна.",
  invalid: "Нужно ровно три или шесть знаков 0–9 и A–F.",
  ready: "Итоговый цвет — {color}.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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

function normalize(raw: string) {
  return raw
    .replace(/[^0-9a-fA-F]/g, "")
    .toUpperCase()
    .slice(0, 6)
}

function expand(hex: string) {
  if (hex.length === 3) {
    return hex
      .split("")
      .map((char) => char + char)
      .join("")
  }
  return hex
}

/**
 * Текстовое поле hex-цвета с превью-квадратом: клетчатый узор, пока значение
 * неполное или неверное, полноценный цвет — как только hex сходится.
 * Один файл, ноль зависимостей.
 */
export function Input027({
  label = "Акцентный цвет",
  defaultValue = "5B8DEF",
  placeholder = "5B8DEF",
  noteText = NOTE,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input027Props) {
  const id = useId()
  const [value, setValue] = useState(normalize(defaultValue))

  const palette = {
    ...(accent ? { "--vibeui-input-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-027-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const complete = value.length === 3 || value.length === 6
  const preview = complete ? `#${expand(value)}` : undefined
  const invalid = value.length > 0 && !complete
  const noteKey = value.length === 0 ? "empty" : invalid ? "invalid" : "ready"
  const note = (noteText[noteKey] ?? NOTE[noteKey]).replace(
    "{color}",
    preview ?? "",
  )

  return (
    <>
      <style href="vibeui-input-027" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-027"
        data-invalid={invalid ? "1" : "0"}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <span
            data-part="swatch"
            aria-hidden="true"
            style={preview ? { background: preview } : undefined}
          />
          <span data-part="frame">
            <span data-part="hash" aria-hidden="true">
              #
            </span>
            <input
              id={id}
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              placeholder={placeholder}
              value={value}
              aria-invalid={invalid}
              aria-describedby={`${id}-note`}
              onChange={(event) => {
                const next = normalize(event.target.value)
                setValue(next)
                if (next.length === 3 || next.length === 6) {
                  onChange?.(`#${expand(next)}`)
                }
              }}
            />
          </span>
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {note}
        </p>
      </div>
    </>
  )
}
