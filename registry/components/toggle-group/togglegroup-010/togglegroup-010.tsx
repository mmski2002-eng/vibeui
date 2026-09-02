"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Togglegroup010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string[]
  text?: string
  /** Имена кнопок по идентификатору отметки. */
  markText?: Record<string, string>
  /** Счётчик с подстановками {selected} и {total}. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель форматирования множественным выбором, где отметки
// не просто красят образец CSS-правилом, а по-настоящему вкладывают друг
// в друга <strong>, <em>, <s> и <code> — превью читает то же дерево тегов,
// какое получил бы реальный текст после форматирования.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-010"]){
--vibeui-togglegroup-010-bg:transparent;
--vibeui-togglegroup-010-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-010-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-togglegroup-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-010-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-010-accent:light-dark(oklch(0.56 0.19 320),oklch(0.74 0.16 320));
--vibeui-togglegroup-010-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 320));
--vibeui-togglegroup-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-togglegroup-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="togglegroup-010"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-010-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-010-bg);color:var(--vibeui-togglegroup-010-fg);
font-family:var(--vibeui-togglegroup-010-font);
}
[data-vibeui-block="togglegroup-010"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-010"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-010"] [data-part="group"]{
display:inline-flex;gap:0.1875rem;padding:0.25rem;
border-radius:9999px;background:var(--vibeui-togglegroup-010-surface);
}
[data-vibeui-block="togglegroup-010"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:9999px;
background:transparent;color:var(--vibeui-togglegroup-010-muted);
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-010"] button svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="togglegroup-010"] button:hover{color:var(--vibeui-togglegroup-010-fg)}
[data-vibeui-block="togglegroup-010"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-010-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-010"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-010-accent);color:var(--vibeui-togglegroup-010-accent-fg);
}
[data-vibeui-block="togglegroup-010"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-togglegroup-010-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="togglegroup-010"] [data-part="sample"]{
margin:0;padding:0.75rem;border-radius:0.625rem;
background:var(--vibeui-togglegroup-010-surface);
font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="togglegroup-010"] [data-part="sample"] code{
font-family:var(--vibeui-togglegroup-010-mono);font-size:0.875em;
background:color-mix(in oklab,var(--vibeui-togglegroup-010-accent) 12%,var(--vibeui-togglegroup-010-surface));
padding:0.05em 0.3em;border-radius:0.3em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-010"] *{animation:none!important;transition:none!important}}
`

const MARKS: {
  id: string
  d: string
  wrap: (node: ReactNode) => ReactNode
}[] = [
  {
    id: "bold",
    d: "M5.4 3h4a2.6 2.6 0 0 1 0 5.2h-4zm0 5.2h4.6a2.8 2.8 0 0 1 0 5.6H5.4z",
    wrap: (node) => <strong>{node}</strong>,
  },
  {
    id: "italic",
    d: "M11.4 3.2H7.6M8.8 12.8H5M9.8 3.2 7 12.8",
    wrap: (node) => <em>{node}</em>,
  },
  {
    id: "strike",
    d: "M3.2 8h9.6M11 4.6C10.4 3.6 9.3 3 8 3 6.3 3 5 3.9 5 5.3 5 6.4 5.8 7 7 7.5M5 11.4c.6 1 1.7 1.6 3 1.6 1.7 0 3-.9 3-2.3",
    wrap: (node) => <s>{node}</s>,
  },
  {
    id: "code",
    d: "M6 4.5 2.5 8 6 11.5M10 4.5 13.5 8 10 11.5",
    wrap: (node) => <code>{node}</code>,
  },
]

const MARK_TEXT: Record<string, string> = {
  bold: "Полужирный",
  italic: "Курсив",
  strike: "Зачёркнутый",
  code: "Моноширинный",
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
 * Панель форматирования множественным выбором: отметки вкладываются друг
 * в друга и рисуют настоящее дерево тегов в превью. Один файл, ноль
 * зависимостей.
 */
export function Togglegroup010({
  label = "Форматирование",
  defaultValue = ["bold"],
  text = "Отметки складываются одна в другую и применяются к образцу сразу.",
  markText = MARK_TEXT,
  countText = "Активно: {selected} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup010Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setValue(next)
    onChange?.(next)
  }

  const preview = MARKS.reduce<ReactNode>(
    (node, mark) => (value.includes(mark.id) ? mark.wrap(node) : node),
    text,
  )

  return (
    <>
      <style href="vibeui-togglegroup-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-010"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <div data-part="group" role="group" aria-label={label}>
            {MARKS.map((mark) => (
              <button
                key={mark.id}
                type="button"
                aria-pressed={value.includes(mark.id)}
                aria-label={markText[mark.id] ?? MARK_TEXT[mark.id]}
                title={markText[mark.id] ?? MARK_TEXT[mark.id]}
                onClick={() => toggle(mark.id)}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d={mark.d}
                    fill={mark.id === "bold" ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={mark.id === "bold" ? 0 : 1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
          <p data-part="count" role="status">
            {countText
              .replace("{selected}", String(value.length))
              .replace("{total}", String(MARKS.length))}
          </p>
        </div>
        <p data-part="sample">{preview}</p>
      </section>
    </>
  )
}
