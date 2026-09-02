"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox009Option = {
  id: string
  label: string
  description: string
  badge?: string
}

export type Checkbox009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  options?: Checkbox009Option[]
  defaultValue?: string[]
  /** Строка состояния, когда черновик совпадает с сохранённым. */
  savedText?: string
  /** Строка состояния с черновиком. {count} — сколько строк изменено. */
  unsavedText?: string
  /** Подпись кнопки сохранения. */
  saveLabel?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель настроек, где под каждой подписью живёт пояснение,
// а изменённые с момента сохранения строки помечаются точкой. Черновик виден
// до нажатия «Сохранить»: настройки, применяющиеся молча, невозможно отменить.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-009"]){
--vibeui-checkbox-009-surface:transparent;
--vibeui-checkbox-009-bg:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-checkbox-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-checkbox-009-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-checkbox-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-checkbox-009-hover:light-dark(oklch(0.975 0.003 265),oklch(0.32 0.012 265));
--vibeui-checkbox-009-accent:light-dark(oklch(0.56 0.16 265),oklch(0.74 0.14 265));
--vibeui-checkbox-009-badge:light-dark(oklch(0.95 0.03 265),oklch(0.34 0.05 265));
--vibeui-checkbox-009-mark:light-dark(oklch(0.99 0.01 265),oklch(0.2 0.014 265));
--vibeui-checkbox-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-009"]{
display:block;width:100%;max-width:26rem;box-sizing:border-box;
padding:1rem;border:1px solid var(--vibeui-checkbox-009-border);border-radius:1rem;
background:var(--vibeui-checkbox-009-surface);
font-family:var(--vibeui-checkbox-009-font);color:var(--vibeui-checkbox-009-fg);
}
[data-vibeui-block="checkbox-009"] [data-part="title"]{
margin:0 0 0.5rem;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="checkbox-009"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="checkbox-009"] [data-part="row"]+[data-part="row"]{
border-top:1px solid var(--vibeui-checkbox-009-border);
}
[data-vibeui-block="checkbox-009"] label{
display:grid;grid-template-columns:auto 1fr;column-gap:0.625rem;row-gap:0.125rem;
padding:0.625rem 0.5rem;margin:0 -0.5rem;border-radius:0.625rem;cursor:pointer;
transition:background-color .15s ease;
}
[data-vibeui-block="checkbox-009"] label:hover{background:var(--vibeui-checkbox-009-hover)}
[data-vibeui-block="checkbox-009"] input{
appearance:none;position:relative;flex:none;grid-row:1 / span 2;align-self:start;
width:1.0625rem;height:1.0625rem;margin:0.0625rem 0 0;box-sizing:border-box;cursor:inherit;
border:1.5px solid var(--vibeui-checkbox-009-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-009-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-009"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-009-accent)}
[data-vibeui-block="checkbox-009"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-009-mark);
border-bottom:2px solid var(--vibeui-checkbox-009-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-009"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-009-accent);outline-offset:2px}
[data-vibeui-block="checkbox-009"] [data-part="name"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:550;line-height:1.3;
}
[data-vibeui-block="checkbox-009"] [data-part="badge"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-checkbox-009-badge);color:var(--vibeui-checkbox-009-accent);
font-size:0.625rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
}
/* Точка изменения: она отличает черновик от сохранённого, и без неё кнопка
   «Сохранить» непонятно к чему относится. */
[data-vibeui-block="checkbox-009"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-checkbox-009-accent);
}
[data-vibeui-block="checkbox-009"] [data-part="hint"]{
font-size:0.75rem;line-height:1.45;color:var(--vibeui-checkbox-009-muted);
}
[data-vibeui-block="checkbox-009"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
margin-top:0.75rem;padding-top:0.75rem;
border-top:1px solid var(--vibeui-checkbox-009-border);
font-size:0.75rem;color:var(--vibeui-checkbox-009-muted);
}
[data-vibeui-block="checkbox-009"] button{
appearance:none;cursor:pointer;border:0;border-radius:0.5rem;
padding:0.375rem 0.75rem;font:inherit;font-size:0.75rem;font-weight:650;
background:var(--vibeui-checkbox-009-accent);color:var(--vibeui-checkbox-009-mark);
transition:opacity .15s ease;
}
[data-vibeui-block="checkbox-009"] button:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="checkbox-009"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-009-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Checkbox009Option[] = [
  {
    id: "digest",
    label: "Недельная сводка",
    description: "Письмо по понедельникам: что изменилось в проекте.",
  },
  {
    id: "mentions",
    label: "Упоминания",
    description: "Уведомление, когда вас назвали в комментарии.",
    badge: "new",
  },
  {
    id: "deploys",
    label: "Отчёты о выкладке",
    description: "Каждая выкладка на прод с итогом и временем.",
  },
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
 * Настройки с пояснениями: изменённые строки помечаются точкой,
 * а черновик применяется кнопкой. Один файл, ноль зависимостей.
 */
export function Checkbox009({
  title = "Уведомления",
  options = DEFAULT_OPTIONS,
  defaultValue = ["digest"],
  savedText = "Всё сохранено",
  unsavedText = "Не сохранено: {count}",
  saveLabel = "Сохранить",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox009Props) {
  const [saved, setSaved] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const changed = options.filter(
    (option) => draft.includes(option.id) !== saved.includes(option.id),
  )

  const toggle = (id: string) => {
    const next = draft.includes(id)
      ? draft.filter((item) => item !== id)
      : [...draft, id]

    setDraft(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checkbox-009"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ul data-part="list">
          {options.map((option) => {
            const isChanged =
              draft.includes(option.id) !== saved.includes(option.id)

            return (
              <li data-part="row" key={option.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.includes(option.id)}
                    onChange={() => toggle(option.id)}
                  />
                  <span data-part="name">
                    {option.label}
                    {option.badge ? (
                      <span data-part="badge">{option.badge}</span>
                    ) : null}
                    {isChanged ? (
                      <span data-part="dot" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span data-part="hint">{option.description}</span>
                </label>
              </li>
            )
          })}
        </ul>
        <p data-part="foot">
          <span role="status">
            {changed.length === 0
              ? savedText
              : unsavedText.replace("{count}", String(changed.length))}
          </span>
          <button
            type="button"
            disabled={changed.length === 0}
            onClick={() => setSaved(draft)}
          >
            {saveLabel}
          </button>
        </p>
      </section>
    </>
  )
}
