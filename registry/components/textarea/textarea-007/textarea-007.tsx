"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Textarea007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  /** Слов в минуту: 200 — средняя скорость чтения на русском. */
  wordsPerMinute?: number
  /** Целевой объём текста: по нему считается полоса прогресса. */
  target?: number
  /** Текст, с которого поле начинает жизнь. */
  defaultValue?: string
  /** Подписи счётчиков: words, characters, minutes. */
  statsText?: Record<string, string>
  /** Подпись полосы для скринридера: {percent} подставляется числом. */
  progressLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле для редактора, где важен объём. Счётчик символов
// ничего не говорит автору статьи — он думает словами и минутами чтения,
// поэтому под полем стоят слова, знаки и время, а полоса показывает, далеко
// ли до целевого объёма. Слова считаются по разделителям, а не по пробелам:
// иначе двойной пробел добавлял бы лишнее слово.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="textarea-007"]){
--vibeui-textarea-007-bg:transparent;
--vibeui-textarea-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-textarea-007-muted:color-mix(in oklab,var(--vibeui-textarea-007-fg) 68%,transparent);
--vibeui-textarea-007-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-textarea-007-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-textarea-007-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-textarea-007-accent:light-dark(oklch(0.52 0.15 165),oklch(0.74 0.14 165));
--vibeui-textarea-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-textarea-007-progress:0%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="textarea-007"]{color-scheme:dark}
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

const STATS_TEXT: Record<string, string> = {
  words: "слов",
  characters: "знаков",
  minutes: "мин чтения",
}

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
 * Поле со счётчиком слов и временем чтения, с полосой до целевого объёма.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea007({
  label = "Текст статьи",
  placeholder = "Первый абзац задаёт тон всему тексту",
  wordsPerMinute = 200,
  target = 120,
  defaultValue = START,
  statsText = STATS_TEXT,
  progressLabel = "Объём текста: {percent}% от цели",
  background = "",
  accent,
  className,
  style,
  ...props
}: Textarea007Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const words = value.split(/[\s\n]+/u).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / wordsPerMinute))
  const progress = Math.min(100, Math.round((words / target) * 100))

  const palette = {
    "--vibeui-textarea-007-progress": `${progress}%`,
    ...(accent ? { "--vibeui-textarea-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="textarea"
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
          aria-label={progressLabel.replace("{percent}", String(progress))}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span data-part="fill" />
        </div>
        <ul data-part="stats" id={`${id}-stats`}>
          <li>
            <span data-part="number">{words}</span>{" "}
            {statsText.words ?? STATS_TEXT.words}
          </li>
          <li>
            <span data-part="number">{value.length}</span>{" "}
            {statsText.characters ?? STATS_TEXT.characters}
          </li>
          <li>
            ≈ <span data-part="number">{minutes}</span>{" "}
            {statsText.minutes ?? STATS_TEXT.minutes}
          </li>
        </ul>
      </div>
    </>
  )
}
