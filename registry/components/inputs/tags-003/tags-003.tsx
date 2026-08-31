"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Tags003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  max?: number
  defaultValue?: string[]
  accent?: string
}

// Идея компонента: лимит, который не запирает поле, а вытесняет самый старый
// тег. Заблокированный ввод на пределе — тупик: чтобы добавить нужный тег,
// приходится сначала догадаться удалить лишний. Здесь очередь: новый тег
// выталкивает первый, и тот заранее подсвечен как кандидат на вылет, поэтому
// вытеснение не становится сюрпризом. Полоса лимита показывает заполненность
// без счёта чипов глазами.
const STYLES = `
:where([data-vibeui-block="tags-003"]){
--vibeui-tags-003-surface:oklch(1 0 0);
--vibeui-tags-003-field:oklch(1 0 0);
--vibeui-tags-003-shell:oklch(0.9 0.006 265);
--vibeui-tags-003-fg:oklch(0.23 0.014 265);
--vibeui-tags-003-muted:oklch(0.55 0.014 265);
--vibeui-tags-003-border:oklch(0.88 0.008 265);
--vibeui-tags-003-chip:oklch(0.96 0.004 265);
--vibeui-tags-003-track:oklch(0.93 0.006 265);
--vibeui-tags-003-accent:oklch(0.55 0.16 300);
--vibeui-tags-003-warn:oklch(0.62 0.16 60);
--vibeui-tags-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-003-fill:0%;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="tags-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-003-surface);
border:1px solid var(--vibeui-tags-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-003-font);color:var(--vibeui-tags-003-fg);
}
[data-vibeui-block="tags-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="tags-003"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="tags-003"] [data-part="counter"]{
font-size:0.75rem;font-weight:650;color:var(--vibeui-tags-003-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tags-003"][data-full="true"] [data-part="counter"]{color:var(--vibeui-tags-003-warn)}
[data-vibeui-block="tags-003"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:2.75rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-003-field);
border:1px solid var(--vibeui-tags-003-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-003"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-003-accent);
box-shadow:0 0 0 2px oklch(0.55 0.16 300 / 18%);
}
[data-vibeui-block="tags-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.75rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-003-chip);
font-size:0.8125rem;
transition:background-color .14s ease,color .14s ease;
}
/* Кандидат на вылет подсвечен заранее: вытеснение не должно быть сюрпризом. */
[data-vibeui-block="tags-003"] [data-part="chip"][data-doomed="true"]{
background:oklch(0.62 0.16 60 / 16%);color:var(--vibeui-tags-003-warn);
text-decoration:line-through;
}
[data-vibeui-block="tags-003"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:var(--vibeui-tags-003-muted);font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="tags-003"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-tags-003-accent);outline-offset:1px}
[data-vibeui-block="tags-003"] input{
flex:1 1 6rem;min-width:6rem;
appearance:none;border:0;background:none;outline:none;
height:1.75rem;color:inherit;font:inherit;font-size:0.875rem;
}
/* Полоса лимита: заполненность видна без пересчёта чипов глазами. */
[data-vibeui-block="tags-003"] [data-part="bar"]{
height:0.25rem;border-radius:9999px;background:var(--vibeui-tags-003-track);overflow:hidden;
}
[data-vibeui-block="tags-003"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-tags-003-fill);
background:var(--vibeui-tags-003-accent);
transition:width .18s ease,background-color .18s ease;
}
[data-vibeui-block="tags-003"][data-full="true"] [data-part="fill"]{background:var(--vibeui-tags-003-warn)}
[data-vibeui-block="tags-003"] [data-part="hint"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-tags-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Теги с лимитом-очередью: на пределе новый тег вытесняет самый старый.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags003({
  label = "Интересы в ленте",
  max = 5,
  defaultValue = ["дизайн", "типографика", "интерфейсы"],
  accent,
  className,
  style,
  ...props
}: Tags003Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const full = tags.length >= max

  const add = (value: string) => {
    const tag = value.trim().toLowerCase()
    if (!tag || tags.includes(tag)) return setDraft("")
    // Очередь вместо блокировки: первый тег уходит, новый встаёт в конец.
    setTags([...tags, tag].slice(-max))
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    add(draft)
  }

  const palette = {
    "--vibeui-tags-003-fill": `${Math.min(100, (tags.length / max) * 100)}%`,
    ...(accent ? { "--vibeui-tags-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tags-003"
        data-full={full}
        className={className}
        style={palette}
      >
        <p data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="counter">
            {tags.length} / {max}
          </span>
        </p>
        <div data-part="field">
          {tags.map((tag, index) => (
            <span
              key={tag}
              data-part="chip"
              data-doomed={full && index === 0 && draft.trim() !== ""}
            >
              {tag}
              <button
                type="button"
                aria-label={`Убрать ${tag}`}
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
            placeholder="Добавить интерес…"
            aria-describedby={`${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div data-part="bar" aria-hidden="true">
          <span data-part="fill" />
        </div>
        <p id={`${id}-hint`} data-part="hint" aria-live="polite">
          {full
            ? `Лимит ${max}: следующий тег вытеснит «${tags[0]}».`
            : `Можно добавить ещё ${max - tags.length}. На пределе новый тег вытеснит самый старый.`}
        </p>
      </div>
    </>
  )
}
