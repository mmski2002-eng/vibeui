"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  defaultValue?: string
  minLength?: number
  maxLength?: number
  hint?: string
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
--vibeui-inputgroup-016-surface:oklch(1 0 0);
--vibeui-inputgroup-016-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-016-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-016-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-016-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-016-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-016-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-016-accent:oklch(0.5 0.16 350);
--vibeui-inputgroup-016-weak:oklch(0.55 0.19 25);
--vibeui-inputgroup-016-mid:oklch(0.72 0.16 85);
--vibeui-inputgroup-016-strong:oklch(0.55 0.14 155);
--vibeui-inputgroup-016-track:oklch(0.93 0.005 265);
--vibeui-inputgroup-016-radius:0.75rem;
--vibeui-inputgroup-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-inputgroup-016-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
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

function levelFor(length: number) {
  if (length === 0) {
    return { ratio: 0, label: "Пусто", token: "--vibeui-inputgroup-016-weak" }
  }
  if (length < 8) {
    return {
      ratio: length / 16,
      label: "Слишком короткий",
      token: "--vibeui-inputgroup-016-weak",
    }
  }
  if (length < 12) {
    return {
      ratio: length / 16,
      label: "Достаточный",
      token: "--vibeui-inputgroup-016-mid",
    }
  }
  return {
    ratio: Math.min(1, length / 16),
    label: "Надёжный",
    token: "--vibeui-inputgroup-016-strong",
  }
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
  hint = "Кнопка «Создать» подставляет случайный пароль из 16 символов — поле можно и отредактировать вручную.",
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
            placeholder="Нажмите «Создать»"
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="button" onClick={() => setValue(generatePassword(16))}>
            Создать
          </button>
        </div>
        <div data-part="meter">
          <div
            data-part="track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={maxLength}
            aria-valuenow={value.length}
            aria-label="Длина пароля"
          >
            <div
              data-part="fill"
              style={{ width: `${Math.round(level.ratio * 100)}%` }}
            />
          </div>
          <p data-part="status" id={`${id}-status`}>
            <span>{value.length} символов</span>
            <b>{level.label}</b>
          </p>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
