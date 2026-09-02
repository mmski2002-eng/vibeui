"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Tags006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  groups?: string[]
  defaultValue?: { text: string; group: string }[]
  /** Подпись крестика: {tag} — метка, {group} — её категория. */
  removeText?: string
  /** Подпись выбора категории для скринридера. */
  groupText?: string
  /** Плейсхолдер поля ввода. */
  placeholderText?: string
  /** Пояснение под полем. */
  hintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у тега есть категория, и она видна цветом. Плоский список
// из пятнадцати одинаковых чипов не читается — глазу не за что зацепиться,
// пока он не прочитает каждый. Цвет группируется быстрее текста, поэтому
// «команда» и «срочность» различимы до чтения. Оттенок не выбирается вручную,
// а считается из названия категории хеш-функцией: новая категория сразу
// получает свой стабильный цвет, и палитру не нужно вести отдельным списком.
//
// Тема берётся из color-scheme окружения через light-dark(). Цвета чипа
// считаются из оттенка и читаются в обеих темах, поэтому парой их не задают.
const STYLES = `
:where([data-vibeui-block="tags-006"]){
--vibeui-tags-006-surface:transparent;
--vibeui-tags-006-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-tags-006-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.01 265));
--vibeui-tags-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-tags-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-tags-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-tags-006-accent:light-dark(oklch(0.5 0.15 265),oklch(0.76 0.14 265));
--vibeui-tags-006-ring:light-dark(oklch(0.5 0.15 265 / 18%),oklch(0.76 0.14 265 / 28%));
--vibeui-tags-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-006-hue:265;
}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
[data-vibeui-block="tags-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-006-surface);
border:1px solid var(--vibeui-tags-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-006-font);color:var(--vibeui-tags-006-fg);
}
[data-vibeui-block="tags-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="tags-006"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:3rem;padding:0.375rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-006-field);
border:1px solid var(--vibeui-tags-006-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-006"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-006-accent);
box-shadow:0 0 0 2px var(--vibeui-tags-006-ring);
}
/* Цвет считается из названия категории: палитру не надо вести отдельно. */
[data-vibeui-block="tags-006"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:oklch(0.94 0.05 var(--vibeui-tags-006-hue));
color:oklch(0.38 0.12 var(--vibeui-tags-006-hue));
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="tags-006"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;flex:none;
background:oklch(0.6 0.16 var(--vibeui-tags-006-hue));
}
[data-vibeui-block="tags-006"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:inherit;font:inherit;font-size:0.875rem;line-height:1;opacity:.7;
}
[data-vibeui-block="tags-006"] [data-part="chip"] button:hover{opacity:1}
[data-vibeui-block="tags-006"] [data-part="chip"] button:focus-visible{outline:2px solid currentColor;outline-offset:1px}
[data-vibeui-block="tags-006"] [data-part="entry"]{display:flex;gap:0.375rem;align-items:stretch}
[data-vibeui-block="tags-006"] select{
flex:none;appearance:none;cursor:pointer;
padding:0 0.5rem;box-sizing:border-box;height:2.25rem;
border:1px solid var(--vibeui-tags-006-border);border-radius:0.5rem;
background:oklch(0.96 0.03 var(--vibeui-tags-006-hue));
color:oklch(0.38 0.12 var(--vibeui-tags-006-hue));
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="tags-006"] select:focus-visible{outline:2px solid var(--vibeui-tags-006-accent);outline-offset:1px}
[data-vibeui-block="tags-006"] input{
flex:1 1 auto;min-width:0;box-sizing:border-box;height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-tags-006-border);border-radius:0.5rem;
background:var(--vibeui-tags-006-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-006"] input:focus-visible{outline:2px solid var(--vibeui-tags-006-accent);outline-offset:1px;border-color:var(--vibeui-tags-006-accent)}
[data-vibeui-block="tags-006"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-tags-006-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS = ["команда", "срочность", "продукт"]

const DEFAULT_TAGS = [
  { text: "дизайн", group: "команда" },
  { text: "горит", group: "срочность" },
  { text: "каталог", group: "продукт" },
]

// Оттенок из названия: одна и та же категория всегда получает один цвет.
function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
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
 * Теги с цветными категориями: оттенок считается из названия категории.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags006({
  label = "Метки задачи",
  groups = DEFAULT_GROUPS,
  defaultValue = DEFAULT_TAGS,
  removeText = "Убрать {tag} из категории {group}",
  groupText = "Категория тега",
  placeholderText = "Новая метка…",
  hintText = "Категория задаётся до ввода — цвет метки берётся из её названия",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags006Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const [group, setGroup] = useState(groups[0])

  const add = () => {
    const text = draft.trim()
    if (!text || tags.some((tag) => tag.text === text)) return setDraft("")
    setTags([...tags, { text, group }])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    add()
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tags-006"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          {tags.map((tag) => (
            <span
              key={tag.text}
              data-part="chip"
              style={
                { "--vibeui-tags-006-hue": hue(tag.group) } as CSSProperties
              }
            >
              <span data-part="dot" aria-hidden="true" />
              {tag.text}
              <button
                type="button"
                aria-label={removeText
                  .replace("{tag}", tag.text)
                  .replace("{group}", tag.group)}
                onClick={() =>
                  setTags(tags.filter((item) => item.text !== tag.text))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div
          data-part="entry"
          style={{ "--vibeui-tags-006-hue": hue(group) } as CSSProperties}
        >
          <select
            value={group}
            aria-label={groupText}
            onChange={(event) => setGroup(event.target.value)}
          >
            {groups.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            id={id}
            type="text"
            value={draft}
            placeholder={placeholderText}
            aria-describedby={`${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <p id={`${id}-hint`} data-part="hint">
          {hintText}
        </p>
      </div>
    </>
  )
}
