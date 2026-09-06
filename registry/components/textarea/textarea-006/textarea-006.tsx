"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Textarea006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  /** Пауза без набора, после которой черновик уходит на сервер. */
  delay?: number
  /** Текст, с которого поле начинает жизнь. */
  defaultValue?: string
  /** Счётчик символов: {count} подставляется числом. */
  countText?: string
  /** Подписи фаз: idle, dirty, saved. В saved {time} — время сохранения. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: черновик, который сохраняется сам. Кнопка «сохранить»
// под длинным текстом — источник потерянных ответов, поэтому запись идёт
// по паузе в наборе. Пауза обязательна: сохранять на каждое нажатие значит
// слать запрос на каждую букву. Строка статуса показывает не «идёт запрос»,
// а понятное «черновик сохранён» и время — это то, что человек хочет знать.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="textarea-006"]){
--vibeui-textarea-006-bg:transparent;
--vibeui-textarea-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-textarea-006-muted:color-mix(in oklab,var(--vibeui-textarea-006-fg) 68%,transparent);
--vibeui-textarea-006-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-textarea-006-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-textarea-006-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.72 0.15 39.8));
--vibeui-textarea-006-ok:light-dark(oklch(0.52 0.14 155),oklch(0.74 0.14 155));
--vibeui-textarea-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="textarea-006"]{color-scheme:dark}
[data-vibeui-block="textarea-006"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-006-bg);
border:1px solid var(--vibeui-textarea-006-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-006-font);color:var(--vibeui-textarea-006-fg);
}
[data-vibeui-block="textarea-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="textarea-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-006"] textarea{
box-sizing:border-box;width:100%;min-height:6rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-textarea-006-border);border-radius:0.625rem;
background:var(--vibeui-textarea-006-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.55;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-006"] textarea:focus{
outline:none;border-color:var(--vibeui-textarea-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-006-accent) 18%,transparent);
}
/* Статус занимает место всегда: строка, которая то появляется, то исчезает,
   дёргает поле и мешает целиться в него. */
[data-vibeui-block="textarea-006"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;min-height:1.125rem;
font-size:0.75rem;color:var(--vibeui-textarea-006-muted);
}
[data-vibeui-block="textarea-006"][data-state="saved"] [data-part="status"]{color:var(--vibeui-textarea-006-ok)}
[data-vibeui-block="textarea-006"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-textarea-006-muted);
}
[data-vibeui-block="textarea-006"][data-state="dirty"] [data-part="dot"]{
background:var(--vibeui-textarea-006-accent);
animation:vibeui-textarea-006-pulse 1.2s ease-in-out infinite;
}
[data-vibeui-block="textarea-006"][data-state="saved"] [data-part="dot"]{background:var(--vibeui-textarea-006-ok)}
@keyframes vibeui-textarea-006-pulse{0%,100%{opacity:1}50%{opacity:.35}}
[data-vibeui-block="textarea-006"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-textarea-006-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-006"] *{animation:none!important;transition:none!important}}
`

const START =
  "Пока это черновик: набросок ответа, который никто, кроме вас, не видит."

const STATUS_TEXT: Record<string, string> = {
  idle: "Сохраняется автоматически",
  dirty: "Есть несохранённые правки…",
  saved: "Черновик сохранён в {time}",
}

// Своё «чч:мм»: toLocaleTimeString на сервере и в браузере может дать
// разный формат и развалить гидрацию.
function clock(date: Date) {
  const pad = (part: number) => String(part).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
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
 * Поле с автосохранением черновика: запись по паузе, статус со временем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea006({
  label = "Черновик ответа",
  placeholder = "Начните печатать — черновик сохранится сам",
  delay = 1200,
  defaultValue = START,
  countText = "{count} симв.",
  statusText = STATUS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Textarea006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [state, setState] = useState<"idle" | "dirty" | "saved">("idle")
  const [savedAt, setSavedAt] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const palette = {
    ...(accent ? { "--vibeui-textarea-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="textarea"
        data-vibeui-block="textarea-006"
        data-state={state}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="count" id={`${id}-count`}>
            {countText.replace("{count}", String(value.length))}
          </span>
        </div>
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          aria-describedby={`${id}-count ${id}-status`}
          onChange={(event) => {
            setValue(event.target.value)
            setState("dirty")
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
              setSavedAt(clock(new Date()))
              setState("saved")
            }, delay)
          }}
        />
        <p data-part="status" id={`${id}-status`} role="status">
          <span data-part="dot" aria-hidden="true" />
          {(statusText[state] ?? STATUS_TEXT[state]).replace("{time}", savedAt)}
        </p>
      </div>
    </>
  )
}
