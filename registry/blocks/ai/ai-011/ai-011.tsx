"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Ai011Props = {
  title?: string
  description?: string
  modes?: string[]
  temperature?: number
  maxTokens?: number
  resetLabel?: string
  applyLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: настройки модели, которые понятны без документации. Каждый
// ползунок подписан не только числом, но и следствием: «0,2 — почти всегда
// один и тот же ответ», «1,4 — заметный разброс». Цифра без объяснения
// заставляет крутить ручку наугад.
//
// Значение выводится в <output> с for, привязанным к ползунку: браузер
// объявляет изменение сам, и aria-live не нужен. Режим выбирается
// радиогруппой — это взаимоисключающий выбор, и список сразу показывает
// все варианты, а не прячет их в select.
const STYLES = `
:where([data-vibeui-block="ai-011"]){
--vibeui-ai-011-bg:oklch(1 0 0);
--vibeui-ai-011-soft:oklch(0.975 0.004 265);
--vibeui-ai-011-fg:oklch(0.21 0.014 265);
--vibeui-ai-011-muted:oklch(0.53 0.014 265);
--vibeui-ai-011-border:oklch(0.91 0.006 265);
--vibeui-ai-011-accent:oklch(0.53 0.16 285);
--vibeui-ai-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-011"]{
background:var(--vibeui-ai-011-bg);color:var(--vibeui-ai-011-fg);
font-family:var(--vibeui-ai-011-sans);
border:1px solid var(--vibeui-ai-011-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-011"] *{box-sizing:border-box}
[data-vibeui-block="ai-011"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1.125rem}
[data-vibeui-block="ai-011"] h2{margin:0;font-size:1rem;font-weight:680;letter-spacing:-0.01em}
[data-vibeui-block="ai-011"] [data-part="lede"]{
margin:0.25rem 0 0;max-width:56ch;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-011-muted);
}
[data-vibeui-block="ai-011"] [data-part="row"]{display:grid;gap:0.4375rem}
[data-vibeui-block="ai-011"] [data-part="row-top"]{display:flex;align-items:baseline;gap:0.625rem}
[data-vibeui-block="ai-011"] label{font-size:0.8125rem;font-weight:640}
/* output объявляется браузером сам: отдельный aria-live только помешал бы. */
[data-vibeui-block="ai-011"] output{
margin-left:auto;padding:0.125rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-ai-011-soft);border:1px solid var(--vibeui-ai-011-border);
font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-011"] input[type="range"]{
width:100%;margin:0;accent-color:var(--vibeui-ai-011-accent);
}
/* Цифра без следствия заставляет крутить ручку наугад. */
[data-vibeui-block="ai-011"] [data-part="effect"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-ai-011-muted);
}
[data-vibeui-block="ai-011"] fieldset{margin:0;padding:0;border:0;display:grid;gap:0.4375rem}
[data-vibeui-block="ai-011"] legend{padding:0;font-size:0.8125rem;font-weight:640}
[data-vibeui-block="ai-011"] [data-part="modes"]{display:flex;flex-wrap:wrap;gap:0.375rem;clear:both}
[data-vibeui-block="ai-011"] [data-part="mode"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
height:2rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-ai-011-border);background:var(--vibeui-ai-011-soft);
font-size:0.75rem;font-weight:600;color:var(--vibeui-ai-011-muted);
}
[data-vibeui-block="ai-011"] [data-part="mode"]:has(input:checked){
color:var(--vibeui-ai-011-accent);
border-color:color-mix(in oklab,var(--vibeui-ai-011-accent) 45%,var(--vibeui-ai-011-border));
background:color-mix(in oklab,var(--vibeui-ai-011-accent) 10%,var(--vibeui-ai-011-bg));
}
[data-vibeui-block="ai-011"] [data-part="mode"]:has(input:focus-visible){outline:2px solid var(--vibeui-ai-011-accent);outline-offset:2px}
[data-vibeui-block="ai-011"] input[type="radio"]{width:0.8125rem;height:0.8125rem;margin:0;accent-color:var(--vibeui-ai-011-accent)}
[data-vibeui-block="ai-011"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.5rem;padding-top:0.875rem;
border-top:1px solid var(--vibeui-ai-011-border);
}
[data-vibeui-block="ai-011"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:0.75rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-011"] [data-part="apply"]{border:0;background:var(--vibeui-ai-011-accent);color:oklch(1 0 0)}
[data-vibeui-block="ai-011"] [data-part="reset"]{
border:1px solid var(--vibeui-ai-011-border);background:none;color:inherit;margin-left:auto;
}
[data-vibeui-block="ai-011"] :focus-visible{outline:2px solid var(--vibeui-ai-011-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="ai-011"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-011"] [data-part="grid"]{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MODES = ["Точный", "Сбалансированный", "Свободный"]

function temperatureEffect(value: number) {
  if (value <= 0.3)
    return "Почти всегда один и тот же ответ. Хорошо для фактов и кода."
  if (value <= 0.8)
    return "Формулировки меняются, суть держится. Обычный режим для текстов."
  return "Заметный разброс: два запуска дадут разные ответы. Для идей и вариантов."
}

function lengthEffect(value: number) {
  if (value <= 400)
    return "Короткий ответ: пара абзацев, длинное перечисление не поместится."
  if (value <= 1200)
    return "Средний ответ: разбор на несколько абзацев со списком."
  return "Длинный ответ: развёрнутый разбор. Дольше ждать и дороже по расходу."
}

/**
 * Настройки модели: температура и длина ответа с объяснением следствий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai011({
  title = "Настройки ответа",
  description = "Ползунки подписаны следствием, а не только числом: видно, что изменится в ответе.",
  modes = DEFAULT_MODES,
  temperature = 0.7,
  maxTokens = 900,
  resetLabel = "Вернуть по умолчанию",
  applyLabel = "Применить",
  accent,
  className,
  style,
}: Ai011Props) {
  const [heat, setHeat] = useState(temperature)
  const [length, setLength] = useState(maxTokens)

  const palette = {
    ...(accent ? { "--vibeui-ai-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </header>

          <div data-part="grid">
            <div data-part="row">
              <div data-part="row-top">
                <label htmlFor="ai-011-temperature">Температура</label>
                <output htmlFor="ai-011-temperature">
                  {heat.toFixed(1).replace(".", ",")}
                </output>
              </div>
              <input
                id="ai-011-temperature"
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={heat}
                onChange={(event) => setHeat(Number(event.target.value))}
              />
              <p data-part="effect">{temperatureEffect(heat)}</p>
            </div>

            <div data-part="row">
              <div data-part="row-top">
                <label htmlFor="ai-011-length">Длина ответа</label>
                <output htmlFor="ai-011-length">{length} токенов</output>
              </div>
              <input
                id="ai-011-length"
                type="range"
                min={200}
                max={2000}
                step={100}
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
              <p data-part="effect">{lengthEffect(length)}</p>
            </div>
          </div>

          <fieldset>
            <legend>Режим</legend>
            <div data-part="modes">
              {modes.map((mode, index) => (
                <label key={mode} data-part="mode">
                  <input
                    type="radio"
                    name="ai-011-mode"
                    value={mode}
                    defaultChecked={index === 1}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </fieldset>

          <div data-part="foot">
            <button type="button" data-part="apply">
              {applyLabel}
            </button>
            <button type="button" data-part="reset">
              {resetLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
