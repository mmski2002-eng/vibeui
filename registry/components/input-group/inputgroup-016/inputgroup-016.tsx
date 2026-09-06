"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup016Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  defaultValue?: string
  minLength?: number
  maxLength?: number
  placeholder?: string
  /** Подпись кнопки генератора: компонент несёт русскую. */
  generateLabel?: string
  /** Подписи уровней: empty, short, fair, strong. */
  strengthText?: Record<string, string>
  /** Счётчик символов; {count} — длина текущего значения. */
  countTemplate?: string
  /** Подпись шкалы длины для скринридера. */
  meterLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const CHARSET =
  "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*"

function generatePassword(length: number) {
  let result = ""
  for (let index = 0; index < length; index += 1) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return result
}

// Идея компонента: пароль не набирают, а получают — поле остаётся текстовым
// (не password), потому что сгенерированное значение незачем прятать от
// собственного взгляда сразу после нажатия. Индикатор ниже реагирует на
// длину: короче восьми символов — предупреждение, от двенадцати — достаточно.
// Это только длина, не полная проверка сложности: набор символов уже
// гарантирован генератором, а ручной ввод пользователь контролирует сам.
const STYLES = `
:where([data-vibeui-block="inputgroup-016"]){
--vibeui-inputgroup-016-surface:transparent;
--vibeui-inputgroup-016-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-016-muted:color-mix(in oklab,var(--vibeui-inputgroup-016-fg) 68%,transparent);
--vibeui-inputgroup-016-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-016-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-016-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-016-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.72 0.15 39.8));
--vibeui-inputgroup-016-weak:light-dark(oklch(0.55 0.19 25),oklch(0.7 0.17 25));
--vibeui-inputgroup-016-mid:light-dark(oklch(0.72 0.16 85),oklch(0.8 0.15 85));
--vibeui-inputgroup-016-strong:light-dark(oklch(0.55 0.14 39.8),oklch(0.76 0.14 39.8));
--vibeui-inputgroup-016-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-inputgroup-016-radius:0.75rem;
--vibeui-inputgroup-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-016-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-016"]{color-scheme:dark}
[data-vibeui-block="inputgroup-016"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-016-surface);
border:1px solid var(--vibeui-inputgroup-016-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-016-font);color:var(--vibeui-inputgroup-016-fg);
}
[data-vibeui-block="inputgroup-016"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-016"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-016"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-016"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-016-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-016"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-016-radius) 0 0 var(--vibeui-inputgroup-016-radius);
}
[data-vibeui-block="inputgroup-016"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-016-radius) var(--vibeui-inputgroup-016-radius) 0;
}
[data-vibeui-block="inputgroup-016"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-016"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-016-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-016-accent);
}
[data-vibeui-block="inputgroup-016"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-016-field);
font-family:var(--vibeui-inputgroup-016-mono);font-size:0.875rem;letter-spacing:0.02em;
}
[data-vibeui-block="inputgroup-016"] button{
appearance:none;flex:none;cursor:pointer;padding:0 1rem;
background:var(--vibeui-inputgroup-016-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-016"] button:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-016-accent) 14%,var(--vibeui-inputgroup-016-fixed));
}
[data-vibeui-block="inputgroup-016"] [data-part="meter"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="inputgroup-016"] [data-part="track"]{
height:0.375rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-inputgroup-016-track);
}
[data-vibeui-block="inputgroup-016"] [data-part="fill"]{
height:100%;border-radius:999px;
background:var(--vibeui-inputgroup-016-level);
transition:width .18s ease,background-color .18s ease;
}
[data-vibeui-block="inputgroup-016"] [data-part="status"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-016-muted);
}
[data-vibeui-block="inputgroup-016"] [data-part="status"] b{
font-weight:650;color:var(--vibeui-inputgroup-016-level);
}
[data-vibeui-block="inputgroup-016"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-016-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-016"] *{animation:none!important;transition:none!important}}
`

const STRENGTH_TEXT: Record<string, string> = {
  empty: "Пусто",
  short: "Слишком короткий",
  fair: "Достаточный",
  strong: "Надёжный",
}

function levelFor(length: number) {
  if (length === 0) {
    return { ratio: 0, key: "empty", token: "--vibeui-inputgroup-016-weak" }
  }
  if (length < 8) {
    return {
      ratio: length / 16,
      key: "short",
      token: "--vibeui-inputgroup-016-weak",
    }
  }
  if (length < 12) {
    return {
      ratio: length / 16,
      key: "fair",
      token: "--vibeui-inputgroup-016-mid",
    }
  }
  return {
    ratio: Math.min(1, length / 16),
    key: "strong",
    token: "--vibeui-inputgroup-016-strong",
  }
}

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
 * Сцепка «поле пароля + генератор»: кнопка заполняет поле случайной строкой,
 * а индикатор ниже показывает длину результата и её достаточность.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup016({
  name = "password",
  label = "Пароль",
  defaultValue = "",
  minLength = 6,
  maxLength = 40,
  placeholder = "Нажмите «Создать»",
  generateLabel = "Создать",
  strengthText = STRENGTH_TEXT,
  countTemplate = "{count} символов",
  meterLabel = "Длина пароля",
  hint = "Кнопка «Создать» подставляет случайный пароль из 16 символов — поле можно и отредактировать вручную.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup016Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const level = levelFor(value.length)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-016-accent": accent } : null),
    "--vibeui-inputgroup-016-level": `var(${level.token})`,
    ...(background
      ? {
          "--vibeui-inputgroup-016-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-016"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="text"
            autoComplete="new-password"
            spellCheck={false}
            minLength={minLength}
            maxLength={maxLength}
            value={value}
            placeholder={placeholder}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="button" onClick={() => setValue(generatePassword(16))}>
            {generateLabel}
          </button>
        </div>
        <div data-part="meter">
          <div
            data-part="track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={maxLength}
            aria-valuenow={value.length}
            aria-label={meterLabel}
          >
            <div
              data-part="fill"
              style={{ width: `${Math.round(level.ratio * 100)}%` }}
            />
          </div>
          <p data-part="status" id={`${id}-status`}>
            <span>
              {countTemplate.replace("{count}", String(value.length))}
            </span>
            <b>{strengthText[level.key] ?? STRENGTH_TEXT[level.key]}</b>
          </p>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
