"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags003Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  max?: number
  defaultValue?: string[]
  /** Подпись крестика: {tag} — имя тега. */
  removeText?: string
  /** Плейсхолдер поля ввода. */
  placeholderText?: string
  /** Подсказка на пределе: {max} — лимит, {tag} — кандидат на вылет. */
  fullText?: string
  /** Подсказка до предела: {rest} — сколько ещё можно добавить. */
  restText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: лимит, который не запирает поле, а вытесняет самый старый
// тег. Заблокированный ввод на пределе — тупик: чтобы добавить нужный тег,
// приходится сначала догадаться удалить лишний. Здесь очередь: новый тег
// выталкивает первый, и тот заранее подсвечен как кандидат на вылет, поэтому
// вытеснение не становится сюрпризом. Полоса лимита показывает заполненность
// без счёта чипов глазами.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-003"]){
--vibeui-tags-003-surface:transparent;
--vibeui-tags-003-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-tags-003-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.01 265));
--vibeui-tags-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-tags-003-muted:color-mix(in oklab,var(--vibeui-tags-003-fg) 68%,transparent);
--vibeui-tags-003-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-tags-003-chip:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-tags-003-track:light-dark(oklch(0.93 0.006 265),oklch(0.32 0.01 265));
--vibeui-tags-003-accent:light-dark(oklch(0.55 0.16 300),oklch(0.76 0.15 300));
--vibeui-tags-003-ring:light-dark(oklch(0.55 0.16 300 / 18%),oklch(0.76 0.15 300 / 28%));
--vibeui-tags-003-warn:light-dark(oklch(0.62 0.16 60),oklch(0.8 0.15 60));
--vibeui-tags-003-doomed:light-dark(oklch(0.62 0.16 60 / 16%),oklch(0.8 0.15 60 / 22%));
--vibeui-tags-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-003-fill:0%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-003"]{color-scheme:dark}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
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
box-shadow:0 0 0 2px var(--vibeui-tags-003-ring);
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
background:var(--vibeui-tags-003-doomed);color:var(--vibeui-tags-003-warn);
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
 * Теги с лимитом-очередью: на пределе новый тег вытесняет самый старый.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags003({
  label = "Интересы в ленте",
  max = 5,
  defaultValue = ["дизайн", "типографика", "интерфейсы"],
  removeText = "Убрать {tag}",
  placeholderText = "Добавить интерес…",
  fullText = "Лимит {max}: следующий тег вытеснит «{tag}».",
  restText = "Можно добавить ещё {rest}. На пределе новый тег вытеснит самый старый.",
  background = "",
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
    ...(background
      ? {
          "--vibeui-tags-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
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
            placeholder={placeholderText}
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
            ? fullText
                .replace("{max}", String(max))
                .replace("{tag}", tags[0] ?? "")
            : restText.replace("{rest}", String(max - tags.length))}
        </p>
      </div>
    </>
  )
}
