"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  /** Слов в минуту: 200 — средняя скорость чтения на русском. */
  wordsPerMinute?: number
  /** Целевой объём текста: по нему считается полоса прогресса. */
  target?: number
  accent?: string
}

// Идея компонента: поле для редактора, где важен объём. Счётчик символов
// ничего не говорит автору статьи — он думает словами и минутами чтения,
// поэтому под полем стоят слова, знаки и время, а полоса показывает, далеко
// ли до целевого объёма. Слова считаются по разделителям, а не по пробелам:
// иначе двойной пробел добавлял бы лишнее слово.
const STYLES = `
:where([data-vibeui-block="textarea-007"]){
--vibeui-textarea-007-bg:oklch(1 0 0);
--vibeui-textarea-007-fg:oklch(0.22 0.014 265);
--vibeui-textarea-007-muted:oklch(0.55 0.014 265);
--vibeui-textarea-007-border:oklch(0.9 0.006 265);
--vibeui-textarea-007-field:oklch(0.985 0.002 265);
--vibeui-textarea-007-track:oklch(0.93 0.005 265);
--vibeui-textarea-007-accent:oklch(0.52 0.15 165);
--vibeui-textarea-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-textarea-007-progress:0%;
}
[data-vibeui-block="textarea-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-007-bg);
border:1px solid var(--vibeui-textarea-007-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-007-font);color:var(--vibeui-textarea-007-fg);
}
[data-vibeui-block="textarea-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-007"] textarea{
box-sizing:border-box;width:100%;min-height:6.5rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-textarea-007-border);border-radius:0.625rem;
background:var(--vibeui-textarea-007-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.6;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-007"] textarea:focus{
outline:none;border-color:var(--vibeui-textarea-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-007-accent) 18%,transparent);
}
/* Полоса объёма: чистый div с шириной от переменной — <progress> пришлось
   бы перекрашивать тремя вендорными псевдоэлементами. */
[data-vibeui-block="textarea-007"] [data-part="bar"]{
height:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-textarea-007-track);
}
[data-vibeui-block="textarea-007"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-textarea-007-progress);
background:var(--vibeui-textarea-007-accent);
transition:width .2s ease;
}
[data-vibeui-block="textarea-007"] [data-part="stats"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.75rem;color:var(--vibeui-textarea-007-muted);
}
[data-vibeui-block="textarea-007"] [data-part="stats"] li{display:flex;align-items:baseline;gap:0.25rem}
[data-vibeui-block="textarea-007"] [data-part="number"]{
font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-textarea-007-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-007"] *{animation:none!important;transition:none!important}}
`

const START =
  "Компонент из VibeUI ставится одной командой, живёт в одном файле и не тянет зависимостей. Скопируйте инструкцию для агента — и он поставит блок сам, сохранив анимации, типографику и отступы."

/**
 * Поле со счётчиком слов и временем чтения, с полосой до целевого объёма.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea007({
  label = "Текст статьи",
  placeholder = "Первый абзац задаёт тон всему тексту",
  wordsPerMinute = 200,
  target = 120,
  accent,
  className,
  style,
  ...props
}: Textarea007Props) {
  const id = useId()
  const [value, setValue] = useState(START)
  const words = value.split(/[\s\n]+/u).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / wordsPerMinute))
  const progress = Math.min(100, Math.round((words / target) * 100))

  const palette = {
    "--vibeui-textarea-007-progress": `${progress}%`,
    ...(accent ? { "--vibeui-textarea-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-007"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          aria-describedby={`${id}-stats`}
          onChange={(event) => setValue(event.target.value)}
        />
        <div
          data-part="bar"
          role="progressbar"
          aria-label={`Объём текста: ${progress}% от цели`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span data-part="fill" />
        </div>
        <ul data-part="stats" id={`${id}-stats`}>
          <li>
            <span data-part="number">{words}</span> слов
          </li>
          <li>
            <span data-part="number">{value.length}</span> знаков
          </li>
          <li>
            ≈ <span data-part="number">{minutes}</span> мин чтения
          </li>
        </ul>
      </div>
    </>
  )
}
