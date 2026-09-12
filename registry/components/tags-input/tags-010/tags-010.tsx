"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags010Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  placeholder?: string
  defaultValue?: string[]
  /** Пояснение под полем: чем важен порядок. */
  hint?: string
  /** Подпись кнопки «выше». {name} и {position} подставляются. */
  upTemplate?: string
  /** Подпись кнопки «ниже». {name} и {position} подставляются. */
  downTemplate?: string
  removeTemplate?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: теги, у которых важен порядок — первый становится главным.
// Обычно порядок меняют перетаскиванием, и тогда управление существует только
// для мыши: с клавиатуры и на телефоне переставить нечего. Здесь у каждого
// тега две кнопки — выше и ниже; они же дают номер позиции в подписи, поэтому
// скринридер сообщает не «кнопка вверх», а «Дизайн, вторая позиция». Порядок
// показан числами, а не только расположением: в строке из шести чипов глазом
// первый от второго не отличить.
const STYLES = `
:where([data-vibeui-block="tags-010"]){
--vibeui-tags-010-bg:light-dark(oklch(0.99 0 265),oklch(0.23 0 265));
--vibeui-tags-010-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-tags-010-muted:color-mix(in oklab,var(--vibeui-tags-010-fg) 62%,transparent);
--vibeui-tags-010-border:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-tags-010-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 5%));
--vibeui-tags-010-chip:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 9%));
--vibeui-tags-010-accent:light-dark(oklch(0.4 0 265),oklch(0.72 0 265));
--vibeui-tags-010-on-accent:oklch(from var(--vibeui-tags-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-tags-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-010"]{color-scheme:dark}
[data-vibeui-block="tags-010"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-tags-010-font);color:var(--vibeui-tags-010-fg);
}
[data-vibeui-block="tags-010"] *{box-sizing:border-box}
[data-vibeui-block="tags-010"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="tags-010"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
padding:0.4375rem 0.5rem;
border:1px solid var(--vibeui-tags-010-border);border-radius:0.625rem;
background:var(--vibeui-tags-010-field);
}
[data-vibeui-block="tags-010"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-010-accent);
outline:2px solid color-mix(in oklab,var(--vibeui-tags-010-accent) 40%,transparent);
outline-offset:1px;
}
[data-vibeui-block="tags-010"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.125rem;
padding:0.125rem 0.1875rem 0.125rem 0.25rem;border-radius:0.4375rem;
background:var(--vibeui-tags-010-chip);font-size:0.8125rem;max-width:100%;
}
/* Номер позиции стоит в самом чипе: порядок, показанный только
   расположением, в строке из шести одинаковых чипов не читается. */
[data-vibeui-block="tags-010"] [data-part="rank"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;margin-inline-end:0.125rem;
border-radius:0.3125rem;
background:var(--vibeui-tags-010-accent);color:oklch(from var(--vibeui-tags-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tags-010"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding-inline-end:0.125rem;
}
[data-vibeui-block="tags-010"] [data-part="move"],
[data-vibeui-block="tags-010"] [data-part="drop"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.25rem;border-radius:0.25rem;font:inherit;
}
[data-vibeui-block="tags-010"] [data-part="move"]:hover:not(:disabled),
[data-vibeui-block="tags-010"] [data-part="drop"]:hover{background:color-mix(in oklab,currentColor 16%,transparent)}
[data-vibeui-block="tags-010"] [data-part="move"]:disabled{opacity:.35;cursor:default}
[data-vibeui-block="tags-010"] [data-part="move"]:focus-visible,
[data-vibeui-block="tags-010"] [data-part="drop"]:focus-visible{
outline:2px solid var(--vibeui-tags-010-accent);outline-offset:1px;
}
[data-vibeui-block="tags-010"] svg{width:0.5625rem;height:0.5625rem}
[data-vibeui-block="tags-010"] input{
flex:1;min-width:6rem;border:0;padding:0.1875rem 0.125rem;
background:transparent;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-010"] input:focus{outline:none}
[data-vibeui-block="tags-010"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-tags-010-muted);
}
[data-vibeui-block="tags-010"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-010"] *{animation:none!important;transition:none!important}}
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
 * Теги с порядком: перестановка кнопками, доступная с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags010({
  title = "Направления в отклике",
  placeholder = "Добавить направление…",
  defaultValue = ["интерфейсы", "исследования", "аналитика"],
  hint = "Порядок важен: первое направление видно в списке откликов.",
  upTemplate = "{name}: поднять на {position}",
  downTemplate = "{name}: опустить на {position}",
  removeTemplate = "Убрать {name}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tags010Props) {
  const [tags, setTags] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState("")
  const [said, setSaid] = useState("")

  const move = (index: number, step: number) => {
    const target = index + step

    if (target < 0 || target >= tags.length) {
      return
    }

    const next = [...tags]
    ;[next[index], next[target]] = [next[target], next[index]]

    setTags(next)
    // Перестановка видна глазом, но не слышна: без объявления скринридер
    // сообщит только о смене фокуса.
    setSaid(`${next[target]}: позиция ${target + 1} из ${next.length}`)
  }

  const add = () => {
    const name = draft.trim()

    if (name === "" || tags.includes(name)) {
      setDraft("")
      return
    }

    setTags((current) => [...current, name])
    setDraft("")
  }

  const keys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      add()
      return
    }

    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((current) => current.slice(0, -1))
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-010"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>

        <div data-part="field">
          {tags.map((name, index) => (
            <span key={name} data-part="chip">
              <span data-part="rank" aria-hidden="true">
                {index + 1}
              </span>
              <span data-part="name">{name}</span>

              {/* Подписи кнопок несут имя и будущую позицию: «кнопка вверх»
                  сама по себе не говорит, что именно поедет и куда. */}
              <button
                type="button"
                data-part="move"
                disabled={index === 0}
                aria-label={upTemplate
                  .replace("{name}", name)
                  .replace("{position}", String(index))}
                onClick={() => move(index, -1)}
              >
                <svg viewBox="0 0 10 10" aria-hidden="true">
                  <path
                    d="M1 6.5 5 2.5l4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === tags.length - 1}
                aria-label={downTemplate
                  .replace("{name}", name)
                  .replace("{position}", String(index + 2))}
                onClick={() => move(index, 1)}
              >
                <svg viewBox="0 0 10 10" aria-hidden="true">
                  <path
                    d="M1 3.5 5 7.5l4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                data-part="drop"
                aria-label={removeTemplate.replace("{name}", name)}
                onClick={() =>
                  setTags((current) => current.filter((item) => item !== name))
                }
              >
                ×
              </button>
            </span>
          ))}

          <input
            type="text"
            autoComplete="off"
            value={draft}
            placeholder={placeholder}
            aria-label={title}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={keys}
            onBlur={add}
          />
        </div>

        <p data-part="hint">{hint}</p>
        <span data-part="sr" aria-live="polite">
          {said}
        </span>
      </div>
    </>
  )
}
