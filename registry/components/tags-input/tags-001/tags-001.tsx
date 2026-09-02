"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Tags001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  defaultValue?: string[]
  max?: number
  /** Подпись крестика: {tag} — имя тега. */
  removeText?: string
  /** Плейсхолдер ввода, пока предел не достигнут. */
  placeholderText?: string
  /** Плейсхолдер ввода на пределе. */
  fullText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле тегов. Тег добавляется по Enter и по запятой — обе
// привычки встречаются одинаково часто. Backspace на пустом поле удаляет
// последний тег: без этого приходится целиться в крестик. Повторы отсекаются
// молча, потому что второй такой же тег не ошибка пользователя, а шум.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-001"]){
--vibeui-tags-001-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-tags-001-surface:transparent;
--vibeui-tags-001-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.01 265));
--vibeui-tags-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-tags-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.68 0.012 265));
--vibeui-tags-001-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-tags-001-chip:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-tags-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-tags-001-ring:light-dark(oklch(0.55 0.2 262 / 22%),oklch(0.72 0.18 262 / 30%));
--vibeui-tags-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
[data-vibeui-block="tags-001"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
background:var(--vibeui-tags-001-surface);
border:1px solid var(--vibeui-tags-001-shell);border-radius:0.875rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-tags-001-font);color:var(--vibeui-tags-001-fg);
}
[data-vibeui-block="tags-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="tags-001"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:2.5rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-001-bg);
border:1px solid var(--vibeui-tags-001-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-001"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-001-accent);
box-shadow:0 0 0 2px var(--vibeui-tags-001-ring);
}
[data-vibeui-block="tags-001"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.625rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-001-chip);font-size:0.8125rem;
}
[data-vibeui-block="tags-001"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:var(--vibeui-tags-001-muted);font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="tags-001"] [data-part="chip"] button:hover{color:var(--vibeui-tags-001-fg)}
[data-vibeui-block="tags-001"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-tags-001-accent);outline-offset:1px}
/* Поле тянется по остатку строки, но не выталкивает теги на свою строку. */
[data-vibeui-block="tags-001"] input{
flex:1 1 6rem;min-width:6rem;
appearance:none;border:0;background:none;outline:none;
height:1.625rem;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-001"] [data-part="hint"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0;font-size:0.75rem;color:var(--vibeui-tags-001-muted);
}
[data-vibeui-block="tags-001"] [data-part="counter"]{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-001"] *{animation:none!important;transition:none!important}}
`

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
 * Поле тегов: Enter и запятая добавляют, Backspace на пустом поле удаляет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags001({
  label = "Теги компонента",
  hint = "Enter или запятая добавляют тег",
  defaultValue = ["форма", "без зависимостей"],
  max = 8,
  removeText = "Убрать тег {tag}",
  placeholderText = "Добавить…",
  fullText = "Достигнут предел",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags001Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")

  const add = (value: string) => {
    const tag = value.trim().replace(/,+$/, "")
    if (!tag || tags.length >= max || tags.includes(tag)) return setDraft("")
    setTags([...tags, tag])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      add(draft)
      return
    }
    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tags-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          {tags.map((tag) => (
            <span key={tag} data-part="chip">
              {tag}
              <button
                type="button"
                aria-label={removeText.replace("{tag}", tag)}
                onClick={() => setTags(tags.filter((item) => item !== tag))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={id}
            type="text"
            value={draft}
            placeholder={tags.length >= max ? fullText : placeholderText}
            disabled={tags.length >= max}
            aria-describedby={`${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => add(draft)}
          />
        </div>
        <p id={`${id}-hint`} data-part="hint">
          {hint}
          <span data-part="counter">
            {tags.length} / {max}
          </span>
        </p>
      </div>
    </>
  )
}
