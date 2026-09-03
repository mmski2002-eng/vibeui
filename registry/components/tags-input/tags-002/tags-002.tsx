"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags002Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  options?: string[]
  defaultValue?: string[]
  /** Подпись крестика: {tag} — имя тега. */
  removeText?: string
  /** Плейсхолдер поля ввода. */
  placeholderText?: string
  /** Пояснение под полем. */
  hintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказки из готового списка. Свободный ввод плодит «react»,
// «React» и «reactjs» — три тега вместо одного, и поиск по ним перестаёт
// работать. Список подсказок отдан нативному datalist: он сам фильтрует по
// набранному, знает клавиатуру и на телефоне показывается системным способом.
// Рядом лежат ещё не использованные варианты кнопками: до первой буквы человек
// не знает, что вообще можно выбрать, а список подсказок пока не виден.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-002"]){
--vibeui-tags-002-surface:transparent;
--vibeui-tags-002-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-tags-002-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.01 265));
--vibeui-tags-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-tags-002-muted:color-mix(in oklab,var(--vibeui-tags-002-fg) 68%,transparent);
--vibeui-tags-002-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-tags-002-chip:light-dark(oklch(0.55 0.16 255 / 12%),oklch(0.74 0.16 255 / 22%));
--vibeui-tags-002-accent:light-dark(oklch(0.5 0.16 255),oklch(0.78 0.14 255));
--vibeui-tags-002-ring:light-dark(oklch(0.5 0.16 255 / 18%),oklch(0.78 0.14 255 / 28%));
--vibeui-tags-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-002"]{color-scheme:dark}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
[data-vibeui-block="tags-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-002-surface);
border:1px solid var(--vibeui-tags-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-002-font);color:var(--vibeui-tags-002-fg);
}
[data-vibeui-block="tags-002"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="tags-002"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:2.75rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-002-field);
border:1px solid var(--vibeui-tags-002-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-002"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-002-accent);
box-shadow:0 0 0 2px var(--vibeui-tags-002-ring);
}
[data-vibeui-block="tags-002"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.75rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-002-chip);color:var(--vibeui-tags-002-accent);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="tags-002"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:inherit;font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="tags-002"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-tags-002-accent);outline-offset:1px}
[data-vibeui-block="tags-002"] input{
flex:1 1 6rem;min-width:6rem;
appearance:none;border:0;background:none;outline:none;
height:1.75rem;color:inherit;font:inherit;font-size:0.875rem;
}
/* Ещё не выбранные варианты видны до первой буквы: datalist откроется потом. */
[data-vibeui-block="tags-002"] [data-part="rest"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="tags-002"] [data-part="rest"] button{
appearance:none;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:9999px;
border:1px dashed var(--vibeui-tags-002-border);
background:none;color:var(--vibeui-tags-002-muted);
font:inherit;font-size:0.75rem;
transition:border-color .14s ease,color .14s ease;
}
[data-vibeui-block="tags-002"] [data-part="rest"] button:hover{border-color:var(--vibeui-tags-002-accent);color:var(--vibeui-tags-002-accent)}
[data-vibeui-block="tags-002"] [data-part="rest"] button:focus-visible{outline:2px solid var(--vibeui-tags-002-accent);outline-offset:2px}
[data-vibeui-block="tags-002"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-tags-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "TypeScript",
  "React",
  "Next.js",
  "CSS",
  "Node.js",
  "GraphQL",
  "Docker",
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
 * Поле тегов с подсказками из готового списка на нативном datalist.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags002({
  label = "Стек проекта",
  options = DEFAULT_OPTIONS,
  defaultValue = ["React", "TypeScript"],
  removeText = "Убрать {tag}",
  placeholderText = "Начните вводить…",
  hintText = "Свои варианты не добавляются: список общий для всего каталога",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags002Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const rest = options.filter((option) => !tags.includes(option))

  const add = (value: string) => {
    // Совпадение ищется без учёта регистра: «react» и «React» — один тег.
    const match = options.find(
      (option) => option.toLowerCase() === value.trim().toLowerCase(),
    )
    if (!match || tags.includes(match)) return setDraft("")
    setTags([...tags, match])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    add(draft)
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-002"
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
            list={`${id}-options`}
            value={draft}
            placeholder={placeholderText}
            aria-describedby={`${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <datalist id={`${id}-options`}>
            {rest.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
        {rest.length > 0 ? (
          <div data-part="rest">
            {rest.slice(0, 5).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTags([...tags, option])}
              >
                + {option}
              </button>
            ))}
          </div>
        ) : null}
        <p id={`${id}-hint`} data-part="hint">
          {hintText}
        </p>
      </div>
    </>
  )
}
