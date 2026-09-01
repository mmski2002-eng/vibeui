"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup020Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultTags?: string[]
  max?: number
  onChange?: (tags: string[]) => void
  hint?: string
  accent?: string
}

function pluralTags(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "тег"
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "тега"
  return "тегов"
}

// Идея компонента: добавление тега — не побочный эффект Enter, а обычная
// кнопка рядом с полем, поэтому сценарий работает и с мышью, и с клавиатуры
// одинаково явно. Список добавленных тегов — не текст в поле, а отдельные
// чипы с собственной кнопкой удаления, а значения на сервер уходят скрытыми
// полями формы, потому что видимое поле ввода — только черновик следующего
// тега, а не хранилище всех значений сразу.
const STYLES = `
:where([data-vibeui-block="inputgroup-020"]){
--vibeui-inputgroup-020-surface:oklch(1 0 0);
--vibeui-inputgroup-020-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-020-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-020-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-020-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-020-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-020-chip:oklch(0.95 0.02 300);
--vibeui-inputgroup-020-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-020-accent:oklch(0.52 0.16 300);
--vibeui-inputgroup-020-radius:0.75rem;
--vibeui-inputgroup-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-020"]{
display:flex;flex-direction:column;gap:0.5625rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-020-surface);
border:1px solid var(--vibeui-inputgroup-020-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-020-font);color:var(--vibeui-inputgroup-020-fg);
}
[data-vibeui-block="inputgroup-020"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-020"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-020"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-020"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-020-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-020"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-020-radius) 0 0 var(--vibeui-inputgroup-020-radius);
}
[data-vibeui-block="inputgroup-020"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-020-radius) var(--vibeui-inputgroup-020-radius) 0;
}
[data-vibeui-block="inputgroup-020"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-020"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-020-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-020-accent);
}
[data-vibeui-block="inputgroup-020"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-020-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-020"] [data-part="add"]{
appearance:none;flex:none;cursor:pointer;padding:0 1rem;
background:var(--vibeui-inputgroup-020-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-020"] [data-part="add"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-020-accent) 14%,var(--vibeui-inputgroup-020-fixed));
}
[data-vibeui-block="inputgroup-020"] [data-part="add"]:disabled{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="inputgroup-020"] [data-part="tags"]{
list-style:none;margin:0;padding:0;
display:flex;flex-wrap:wrap;gap:0.375rem;min-height:1.75rem;
}
[data-vibeui-block="inputgroup-020"] [data-part="tag"]{
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.375rem 0 0.625rem;border-radius:999px;
background:var(--vibeui-inputgroup-020-chip);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-020-fg);
}
[data-vibeui-block="inputgroup-020"] [data-part="tag"] button{
appearance:none;cursor:pointer;display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:999px;color:inherit;
background:color-mix(in oklab,var(--vibeui-inputgroup-020-accent) 16%,transparent);
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-020"] [data-part="tag"] button:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-020-accent) 30%,transparent);
}
[data-vibeui-block="inputgroup-020"] [data-part="tag"] button:focus-visible{
outline:2px solid var(--vibeui-inputgroup-020-accent);outline-offset:1px;
}
[data-vibeui-block="inputgroup-020"] [data-part="tag"] svg{width:0.625rem;height:0.625rem;display:block}
[data-vibeui-block="inputgroup-020"] [data-part="empty"]{
margin:0;font-size:0.75rem;line-height:1.75rem;color:var(--vibeui-inputgroup-020-muted);
}
[data-vibeui-block="inputgroup-020"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-020-muted);
}
[data-vibeui-block="inputgroup-020"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-020"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «черновик тега + кнопка «Добавить»» и отдельный список чипов ниже:
 * каждый тег добавляется явным действием, удаляется своей кнопкой, а на
 * сервер уходит скрытыми полями формы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup020({
  name = "tags",
  label = "Теги материала",
  placeholder = "Новый тег",
  defaultTags = ["React", "Next.js"],
  max = 8,
  onChange,
  hint = "Кнопка «Добавить» переносит текст из поля в список — Enter в поле делает то же самое.",
  accent,
  className,
  style,
  ...props
}: Inputgroup020Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [tags, setTags] = useState(defaultTags)
  const [draft, setDraft] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  const trimmed = draft.trim()
  const isDuplicate = tags.some(
    (tag) => tag.toLocaleLowerCase("ru") === trimmed.toLocaleLowerCase("ru"),
  )
  const atLimit = tags.length >= max
  const canAdd = trimmed !== "" && !isDuplicate && !atLimit

  const commit = (next: string[]) => {
    setTags(next)
    onChange?.(next)
  }

  const addTag = () => {
    if (!canAdd) return
    commit([...tags, trimmed])
    setDraft("")
    field.current?.focus()
  }

  const removeTag = (index: number) => {
    commit(tags.filter((_, tagIndex) => tagIndex !== index))
    field.current?.focus()
  }

  return (
    <>
      <style href="vibeui-inputgroup-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-020"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            type="text"
            placeholder={placeholder}
            value={draft}
            disabled={atLimit}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                addTag()
              }
            }}
          />
          <button
            type="button"
            data-part="add"
            disabled={!canAdd}
            onClick={addTag}
          >
            Добавить
          </button>
        </div>
        {tags.length > 0 ? (
          <ul data-part="tags" aria-label="Добавленные теги">
            {tags.map((tag, index) => (
              <li data-part="tag" key={tag}>
                {tag}
                <button
                  type="button"
                  aria-label={`Удалить тег «${tag}»`}
                  onClick={() => removeTag(index)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
                <input type="hidden" name={`${name}[]`} value={tag} />
              </li>
            ))}
          </ul>
        ) : (
          <p data-part="empty">Тегов пока нет</p>
        )}
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          {atLimit
            ? `Достигнут предел: ${max} ${pluralTags(max)}`
            : `${tags.length} из ${max} ${pluralTags(max)}`}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
