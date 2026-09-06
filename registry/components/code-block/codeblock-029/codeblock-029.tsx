"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Codeblock029Field = {
  /** Метка-заполнитель в шаблоне: {token} подставляется по этому имени. */
  name: string
  label: string
  /** Что показать в пустом поле: пример значения, а не «введите сюда». */
  placeholder: string
}

export type Codeblock029Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  /** Шаблон команды: {name} заменяется полем ввода. */
  template?: string
  fields?: Codeblock029Field[]
  copyText?: string
  copiedText?: string
  /** Подпись о незаполненном. {count} — сколько осталось. */
  leftTemplate?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: команда, в которую надо подставить свои значения. Обычно
// её печатают как есть, с «<YOUR_TOKEN>» внутри, и человек копирует строку
// вместе с угловыми скобками — а потом читает ошибку авторизации. Здесь
// заполнители это настоящие поля ввода прямо в строке: команда собирается на
// глазах, а в буфер уходит уже готовая. Незаполненное посчитано вслух, чтобы
// нельзя было скопировать половину команды и не заметить.
const STYLES = `
:where([data-vibeui-block="codeblock-029"]){
--vibeui-codeblock-029-bg:transparent;
--vibeui-codeblock-029-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-codeblock-029-muted:color-mix(in oklab,var(--vibeui-codeblock-029-fg) 66%,transparent);
--vibeui-codeblock-029-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-029-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-codeblock-029-key:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 10%));
--vibeui-codeblock-029-key-hover:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-codeblock-029-slot:light-dark(oklch(0.95 0.03 85),oklch(0.32 0.04 39.8));
--vibeui-codeblock-029-slot-line:light-dark(oklch(0.72 0.11 39.8),oklch(0.62 0.1 39.8));
--vibeui-codeblock-029-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.8 0.12 39.8));
--vibeui-codeblock-029-ok:light-dark(oklch(0.48 0.14 152),oklch(0.8 0.14 152));
--vibeui-codeblock-029-prompt:light-dark(oklch(0.5 0.13 152),oklch(0.78 0.14 152));
--vibeui-codeblock-029-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-029"]{color-scheme:dark}
[data-vibeui-block="codeblock-029"]{
display:block;width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-029-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-029-bg);color:var(--vibeui-codeblock-029-fg);
font-family:var(--vibeui-codeblock-029-font);
}
[data-vibeui-block="codeblock-029"] *{box-sizing:border-box}
[data-vibeui-block="codeblock-029"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
gap:0.375rem 0.75rem;padding:0.4375rem 0.5rem 0.4375rem 0.875rem;
background:var(--vibeui-codeblock-029-head);
border-bottom:1px solid var(--vibeui-codeblock-029-border);
font-size:0.75rem;color:var(--vibeui-codeblock-029-muted);
}
[data-vibeui-block="codeblock-029"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-codeblock-029-mono);
}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="codeblock-029"] [data-part="copy"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.75rem;padding:0.25rem 0.625rem;border-radius:0.4375rem;
background:var(--vibeui-codeblock-029-key);color:var(--vibeui-codeblock-029-fg);
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-029"] [data-part="copy"]:hover{background:var(--vibeui-codeblock-029-key-hover)}
[data-vibeui-block="codeblock-029"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-codeblock-029-accent);outline-offset:2px}
[data-vibeui-block="codeblock-029"] [data-part="copy"][data-done="true"]{color:var(--vibeui-codeblock-029-ok)}
/* Команда переносится, а не прокручивается: её собирают целиком, и уехавшее
   за край поле ввода человек просто не найдёт. */
[data-vibeui-block="codeblock-029"] [data-part="line"]{
margin:0;padding:0.875rem;
display:flex;flex-wrap:wrap;align-items:center;gap:0.125rem 0;
font-family:var(--vibeui-codeblock-029-mono);font-size:0.8125rem;line-height:1.9;
white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="codeblock-029"] [data-part="line"]::before{
content:"$";flex:none;margin-inline-end:0.5rem;
color:var(--vibeui-codeblock-029-prompt);
user-select:none;-webkit-user-select:none;
}
/* Заполнитель — настоящее поле ввода: ширина считается по длине значения,
   поэтому строка не дёргается при наборе больше, чем нужно. */
[data-vibeui-block="codeblock-029"] input{
min-width:0;padding:0.0625rem 0.375rem;
border:0;border-bottom:1.5px dashed var(--vibeui-codeblock-029-slot-line);
border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-codeblock-029-slot);
color:var(--vibeui-codeblock-029-fg);
font:inherit;
}
[data-vibeui-block="codeblock-029"] input::placeholder{color:var(--vibeui-codeblock-029-muted)}
[data-vibeui-block="codeblock-029"] input:focus-visible{
outline:2px solid var(--vibeui-codeblock-029-accent);outline-offset:1px;
}
[data-vibeui-block="codeblock-029"] input[data-filled="true"]{
border-bottom-style:solid;border-bottom-color:var(--vibeui-codeblock-029-ok);
background:transparent;
}
[data-vibeui-block="codeblock-029"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;
padding:0 0.875rem 0.75rem;
font-size:0.75rem;color:var(--vibeui-codeblock-029-muted);
}
[data-vibeui-block="codeblock-029"] [data-part="left"]{color:var(--vibeui-codeblock-029-slot-line);font-weight:600}
[data-vibeui-block="codeblock-029"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS: Codeblock029Field[] = [
  { name: "token", label: "Ключ доступа", placeholder: "vb_live_…" },
  { name: "project", label: "Идентификатор проекта", placeholder: "prj_42" },
]

const DEFAULT_TEMPLATE =
  'curl -H "Authorization: Bearer {token}" https://api.vibeui.ru/v1/projects/{project}'

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
 * Команда с подстановкой: заполнители — настоящие поля, в буфер уходит готовое.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Codeblock029({
  title = "Запрос к API",
  template = DEFAULT_TEMPLATE,
  fields = DEFAULT_FIELDS,
  copyText = "Копировать",
  copiedText = "Скопировано",
  leftTemplate = "Осталось заполнить: {count}",
  background = "",
  className,
  style,
  ...props
}: Codeblock029Props) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const byName = new Map(fields.map((field) => [field.name, field]))
  // Шаблон режется по заполнителям: нечётные куски — имена полей.
  const parts = template.split(/\{(\w+)\}/)
  const left = fields.filter((field) => !values[field.name]?.trim()).length

  // Незаполненное уходит в буфер примером из placeholder: пустое место в
  // команде молча ломает её, а пример хотя бы виден глазом.
  const filled = parts
    .map((part, index) => {
      if (index % 2 === 0) {
        return part
      }

      const value = values[part]?.trim()

      return value || byName.get(part)?.placeholder || `{${part}}`
    })
    .join("")

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(filled)
    } catch {
      // Буфер недоступен: молчим, ложное «скопировано» хуже отсутствия ответа.
      return
    }
    setDone(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 2000)
  }

  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-029" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-029"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="name">{title}</span>
          <button
            type="button"
            data-part="copy"
            data-done={done}
            onClick={copy}
          >
            <span aria-live="polite">{done ? copiedText : copyText}</span>
          </button>
        </figcaption>

        <p data-part="line">
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              return <span key={index}>{part}</span>
            }

            const field = byName.get(part)

            if (!field) {
              return <span key={index}>{`{${part}}`}</span>
            }

            const value = values[field.name] ?? ""

            return (
              <label key={index}>
                {/* Метка есть всегда, но видима только для чтения с экрана:
                    в строке команды подпись рядом с полем сломала бы саму
                    команду. */}
                <span data-part="sr">{field.label}</span>
                <input
                  type="text"
                  value={value}
                  data-filled={value.trim() !== ""}
                  placeholder={field.placeholder}
                  size={Math.max(value.length, field.placeholder.length) + 1}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                />
              </label>
            )
          })}
        </p>

        {left > 0 ? (
          <p data-part="foot">
            <span data-part="left">
              {leftTemplate.replace("{count}", String(left))}
            </span>
          </p>
        ) : null}
      </figure>
    </>
  )
}
