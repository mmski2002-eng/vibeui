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
  accent?: string
}

// Идея компонента: у тега есть категория, и она видна цветом. Плоский список
// из пятнадцати одинаковых чипов не читается — глазу не за что зацепиться,
// пока он не прочитает каждый. Цвет группируется быстрее текста, поэтому
// «команда» и «срочность» различимы до чтения. Оттенок не выбирается вручную,
// а считается из названия категории хеш-функцией: новая категория сразу
// получает свой стабильный цвет, и палитру не нужно вести отдельным списком.
const STYLES = `
:where([data-vibeui-block="tags-006"]){
--vibeui-tags-006-surface:oklch(1 0 0);
--vibeui-tags-006-field:oklch(1 0 0);
--vibeui-tags-006-shell:oklch(0.9 0.006 265);
--vibeui-tags-006-fg:oklch(0.23 0.014 265);
--vibeui-tags-006-muted:oklch(0.55 0.014 265);
--vibeui-tags-006-border:oklch(0.88 0.008 265);
--vibeui-tags-006-accent:oklch(0.5 0.15 265);
--vibeui-tags-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-006-hue:265;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
box-shadow:0 0 0 2px oklch(0.5 0.15 265 / 18%);
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
 * Теги с цветными категориями: оттенок считается из названия категории.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags006({
  label = "Метки задачи",
  groups = DEFAULT_GROUPS,
  defaultValue = DEFAULT_TAGS,
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
                aria-label={`Убрать ${tag.text} из категории ${tag.group}`}
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
            aria-label="Категория тега"
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
            placeholder="Новая метка…"
            aria-describedby={`${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <p id={`${id}-hint`} data-part="hint">
          Категория задаётся до ввода — цвет метки берётся из её названия
        </p>
      </div>
    </>
  )
}
