"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Ai002Attachment = {
  name: string
  size: string
}

export type Ai002Props = {
  title?: string
  hint?: string
  placeholder?: string
  models?: string[]
  presets?: string[]
  attachments?: Ai002Attachment[]
  limit?: number
  /** Текст, с которого поле открывается. */
  defaultText?: string
  /** Название списка моделей для скринридера. */
  modelLabel?: string
  /** Счётчик остатка: {left} — сколько символов ещё влезет. */
  counterText?: string
  sendText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: панель запроса к модели. Настройки лежат рядом с полем, а не в
// отдельном окне: модель и длину ответа выбирают в момент формулировки, а не
// заранее. Счётчик символов появляется на подходе к пределу — постоянный
// счётчик отвлекает, а внезапная блокировка ввода пугает. Приложенные файлы
// стоят над полем, потому что их проверяют глазами перед отправкой.
const STYLES = `
:where([data-vibeui-block="ai-002"]){
--vibeui-ai-002-bg:transparent;
--vibeui-ai-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-ai-002-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-ai-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-ai-002-chip:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.011 265));
--vibeui-ai-002-field:light-dark(oklch(1 0 0),oklch(0.25 0.01 265));
--vibeui-ai-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-ai-002-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-ai-002-ring:light-dark(oklch(0.55 0.2 262/20%),oklch(0.72 0.18 262/28%));
--vibeui-ai-002-warn:light-dark(oklch(0.58 0.16 60),oklch(0.79 0.14 70));
--vibeui-ai-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-002"]{
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-ai-002-bg);
border:1px solid var(--vibeui-ai-002-border);border-radius:1rem;
font-family:var(--vibeui-ai-002-sans);color:var(--vibeui-ai-002-fg);
}
[data-vibeui-block="ai-002"] *{box-sizing:border-box}
[data-vibeui-block="ai-002"] h2{margin:0 0 0.125rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="ai-002"] [data-part="lead"]{margin:0 0 0.75rem;font-size:0.75rem;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] [data-part="presets"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.625rem}
[data-vibeui-block="ai-002"] [data-part="preset"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-ai-002-border);background:none;color:inherit;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="ai-002"] [data-part="preset"]:hover{background:var(--vibeui-ai-002-chip)}
[data-vibeui-block="ai-002"] [data-part="preset"]:focus-visible{outline:2px solid var(--vibeui-ai-002-accent);outline-offset:2px}
/* Файлы над полем: их проверяют глазами перед отправкой. */
[data-vibeui-block="ai-002"] [data-part="files"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.5rem}
[data-vibeui-block="ai-002"] [data-part="file"]{
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.5rem;border-radius:0.5rem;
background:var(--vibeui-ai-002-chip);font-size:0.75rem;
}
[data-vibeui-block="ai-002"] [data-part="size"]{color:var(--vibeui-ai-002-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="ai-002"] [data-part="field"]{
border:1px solid var(--vibeui-ai-002-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="ai-002"] [data-part="field"]:focus-within{
border-color:var(--vibeui-ai-002-accent);
box-shadow:0 0 0 2px var(--vibeui-ai-002-ring);
}
[data-vibeui-block="ai-002"] textarea{
display:block;width:100%;resize:none;border:0;outline:none;
min-height:5rem;padding:0.75rem;
background:none;color:inherit;font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="ai-002"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.5rem;border-top:1px solid var(--vibeui-ai-002-border);
}
[data-vibeui-block="ai-002"] select{
height:2rem;padding:0 0.5rem;
border:1px solid var(--vibeui-ai-002-border);border-radius:0.5rem;
background:var(--vibeui-ai-002-field);color:inherit;font:inherit;font-size:0.75rem;
}
[data-vibeui-block="ai-002"] select:focus-visible{outline:2px solid var(--vibeui-ai-002-accent);outline-offset:1px}
[data-vibeui-block="ai-002"] [data-part="spacer"]{flex:1 1 auto}
/* Счётчик появляется у предела: постоянный отвлекает, тишина у стены пугает. */
[data-vibeui-block="ai-002"] [data-part="counter"]{
font-size:0.75rem;color:var(--vibeui-ai-002-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-002"] [data-part="counter"][data-near="true"]{color:var(--vibeui-ai-002-warn);font-weight:650}
[data-vibeui-block="ai-002"] [data-part="send"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.875rem;border:0;border-radius:0.5rem;
background:var(--vibeui-ai-002-accent);color:var(--vibeui-ai-002-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-002"] [data-part="send"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="ai-002"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-ai-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MODELS = ["Быстрая модель", "Точная модель", "Черновая модель"]

const DEFAULT_PRESETS = [
  "Собрать лендинг",
  "Переписать текст",
  "Подобрать блоки",
  "Объяснить код",
]

const DEFAULT_FILES: Ai002Attachment[] = [
  { name: "brief.pdf", size: "240 КБ" },
  { name: "palette.png", size: "88 КБ" },
]

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
 * Панель запроса к модели: пресеты, файлы, выбор модели и счётчик у предела.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai002({
  title = "Запрос к ассистенту",
  hint = "Опишите задачу словами: какие блоки нужны и что важно сохранить.",
  placeholder = "Например: лендинг студии — hero, три преимущества, тарифы и форма заявки",
  models = DEFAULT_MODELS,
  presets = DEFAULT_PRESETS,
  attachments = DEFAULT_FILES,
  limit = 600,
  defaultText = "Лендинг студии дизайна: hero с одним действием, три преимущества и тарифы.",
  modelLabel = "Модель",
  counterText = "Осталось {left}",
  sendText = "Отправить",
  accent,
  background = "",
  className,
  style,
}: Ai002Props) {
  const [text, setText] = useState(defaultText)
  const left = limit - text.length
  const near = left <= limit * 0.2

  const palette = {
    ...(accent ? { "--vibeui-ai-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{hint}</p>

        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              data-part="preset"
              onClick={() => setText(`${preset}: `)}
            >
              {preset}
            </button>
          ))}
        </div>

        {attachments.length > 0 ? (
          <div data-part="files">
            {attachments.map((file) => (
              <span key={file.name} data-part="file">
                {file.name}
                <span data-part="size">{file.size}</span>
              </span>
            ))}
          </div>
        ) : null}

        <div data-part="field">
          <textarea
            value={text}
            maxLength={limit}
            placeholder={placeholder}
            aria-label={title}
            onChange={(event) => setText(event.target.value)}
          />
          <div data-part="bar">
            <select aria-label={modelLabel} defaultValue={models[0]}>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <span data-part="spacer" />
            {near ? (
              <span data-part="counter" data-near="true" aria-live="polite">
                {counterText.replace("{left}", String(left))}
              </span>
            ) : null}
            <button
              type="button"
              data-part="send"
              disabled={text.trim() === ""}
            >
              {sendText}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
