"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags004Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string[]
  /** Подпись крестика: {tag} — имя тега. */
  removeText?: string
  /** Плейсхолдер поля ввода. */
  placeholderText?: string
  /** Сообщение о повторе: {tag} — уже существующий тег. */
  duplicateText?: string
  /** Пояснение под полем, пока повтора не было. */
  hintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: повтор не игнорируется молча, а показывается. Тихо
// отбросить второй такой же тег — значит оставить человека с ощущением, что
// поле сломалось: он нажал Enter, и ничего не произошло. Здесь существующий
// чип подсвечивается вспышкой, а под полем появляется объяснение. Сравнение
// идёт по приведённому виду — нижний регистр, схлопнутые пробелы, снятая
// пунктуация по краям, — поэтому «Ремонт», «ремонт» и «ремонт.» считаются одним
// тегом, а показывается тот вариант, который сохранён первым.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-004"]){
--vibeui-tags-004-surface:transparent;
--vibeui-tags-004-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-tags-004-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.01 265));
--vibeui-tags-004-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-tags-004-muted:color-mix(in oklab,var(--vibeui-tags-004-fg) 68%,transparent);
--vibeui-tags-004-border:light-dark(oklch(0.88 0.008 265),oklch(0.38 0.012 265));
--vibeui-tags-004-chip:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-tags-004-accent:light-dark(oklch(0.52 0.15 190),oklch(0.76 0.13 190));
--vibeui-tags-004-ring:light-dark(oklch(0.52 0.15 190 / 18%),oklch(0.76 0.13 190 / 28%));
--vibeui-tags-004-warn:light-dark(oklch(0.58 0.18 30),oklch(0.78 0.16 30));
--vibeui-tags-004-flash:light-dark(oklch(0.58 0.18 30 / 18%),oklch(0.78 0.16 30 / 24%));
--vibeui-tags-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-004"]{color-scheme:dark}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
[data-vibeui-block="tags-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-004-surface);
border:1px solid var(--vibeui-tags-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-004-font);color:var(--vibeui-tags-004-fg);
}
[data-vibeui-block="tags-004"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="tags-004"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:2.75rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-004-field);
border:1px solid var(--vibeui-tags-004-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-004"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-004-accent);
box-shadow:0 0 0 2px var(--vibeui-tags-004-ring);
}
[data-vibeui-block="tags-004"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.75rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-004-chip);font-size:0.8125rem;
}
/* Вспышка на существующем чипе: молчание читается как поломка поля. */
[data-vibeui-block="tags-004"] [data-part="chip"][data-hit="true"]{
animation:vibeui-tags-004-flash .7s ease;
}
@keyframes vibeui-tags-004-flash{
0%,100%{background:var(--vibeui-tags-004-chip);color:var(--vibeui-tags-004-fg)}
20%,60%{background:var(--vibeui-tags-004-flash);color:var(--vibeui-tags-004-warn)}
}
[data-vibeui-block="tags-004"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:var(--vibeui-tags-004-muted);font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="tags-004"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-tags-004-accent);outline-offset:1px}
[data-vibeui-block="tags-004"] input{
flex:1 1 6rem;min-width:6rem;
appearance:none;border:0;background:none;outline:none;
height:1.75rem;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-004"] [data-part="note"]{
margin:0;min-height:1.05rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-tags-004-muted);
}
[data-vibeui-block="tags-004"] [data-part="note"][data-warn="true"]{color:var(--vibeui-tags-004-warn);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-004"] *{animation:none!important;transition:none!important}}
`

// Приведённый вид: «Ремонт», «ремонт» и «ремонт.» — один и тот же тег.
function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[.,;]+|[.,;]+$/g, "")
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
 * Поле тегов с проверкой дубликатов: повтор подсвечивает уже существующий тег.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags004({
  label = "Теги объявления",
  defaultValue = ["ремонт", "своими руками"],
  removeText = "Убрать {tag}",
  placeholderText = "Новый тег…",
  duplicateText = "Тег «{tag}» уже добавлен — он подсвечен выше.",
  hintText = "Регистр и точки не считаются: «Ремонт» и «ремонт.» — один тег.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags004Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const [hit, setHit] = useState<string | null>(null)

  const add = (value: string) => {
    const key = normalize(value)
    if (!key) return
    const existing = tags.find((tag) => normalize(tag) === key)
    if (existing) {
      setHit(existing)
      return
    }
    setTags([...tags, value.trim()])
    setDraft("")
    setHit(null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    add(draft)
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-004"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          {tags.map((tag) => (
            <span
              key={tag}
              data-part="chip"
              data-hit={hit === tag}
              // Флаг снимается по концу анимации: иначе вспышка сыграет один раз.
              onAnimationEnd={() => setHit(null)}
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
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              setDraft(event.target.value)
              setHit(null)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <p
          id={`${id}-note`}
          data-part="note"
          data-warn={hit !== null}
          aria-live="assertive"
        >
          {hit ? duplicateText.replace("{tag}", hit) : hintText}
        </p>
      </div>
    </>
  )
}
