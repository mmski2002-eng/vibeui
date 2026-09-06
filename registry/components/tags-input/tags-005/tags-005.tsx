"use client"

import { useId, useState } from "react"
import type {
  ClipboardEvent,
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Tags005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string[]
  /** Подпись крестика: {tag} — имя тега. */
  removeText?: string
  /** Плейсхолдер поля ввода. */
  placeholderText?: string
  /** Итог вставки: {count} — сколько адресов разобрано. */
  pastedText?: string
  /** Пояснение рядом с клавишами-разделителями. */
  legendText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: тег заканчивается там, где человек поставил разделитель.
// Enter, запятая и точка с запятой делают одно и то же, потому что все три
// привычки встречаются одинаково часто, и заставлять переучиваться незачем.
// Вставка из буфера разбирается тем же правилом: список адресов, скопированный
// из письма, превращается в готовые чипы за одну вставку, а не в один
// гигантский тег со всем текстом внутри.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-005"]){
--vibeui-tags-005-surface:transparent;
--vibeui-tags-005-field:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-tags-005-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tags-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-tags-005-muted:color-mix(in oklab,var(--vibeui-tags-005-fg) 68%,transparent);
--vibeui-tags-005-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-tags-005-chip:light-dark(oklch(0.55 0.15 39.8 / 14%),oklch(0.75 0.15 39.8 / 22%));
--vibeui-tags-005-accent:light-dark(oklch(0.48 0.15 39.8),oklch(0.78 0.14 39.8));
--vibeui-tags-005-ring:light-dark(oklch(0.48 0.15 39.8 / 18%),oklch(0.78 0.14 39.8 / 28%));
--vibeui-tags-005-key:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-tags-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-005"]{color-scheme:dark}
/* Подложка по умолчанию прозрачная: поле ложится на фон страницы. */
[data-vibeui-block="tags-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-005-surface);
border:1px solid var(--vibeui-tags-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-005-font);color:var(--vibeui-tags-005-fg);
}
[data-vibeui-block="tags-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="tags-005"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
min-height:3rem;padding:0.375rem 0.5rem;box-sizing:border-box;
background:var(--vibeui-tags-005-field);
border:1px solid var(--vibeui-tags-005-border);border-radius:0.625rem;
}
[data-vibeui-block="tags-005"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-005-accent);
box-shadow:0 0 0 2px var(--vibeui-tags-005-ring);
}
[data-vibeui-block="tags-005"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
max-width:100%;height:1.75rem;padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-005-chip);color:var(--vibeui-tags-005-accent);
font-size:0.8125rem;font-weight:600;
}
/* Длинный адрес обрезается, а не растягивает поле в одну строку. */
[data-vibeui-block="tags-005"] [data-part="text"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:11rem;
}
[data-vibeui-block="tags-005"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;flex:none;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:inherit;font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="tags-005"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-tags-005-accent);outline-offset:1px}
[data-vibeui-block="tags-005"] input{
flex:1 1 7rem;min-width:7rem;
appearance:none;border:0;background:none;outline:none;
height:1.75rem;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-005"] [data-part="legend"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin:0;
font-size:0.75rem;color:var(--vibeui-tags-005-muted);
}
[data-vibeui-block="tags-005"] kbd{
display:inline-block;padding:0.0625rem 0.375rem;
border:1px solid var(--vibeui-tags-005-border);border-bottom-width:2px;border-radius:0.3125rem;
background:var(--vibeui-tags-005-key);color:var(--vibeui-tags-005-fg);
font-family:var(--vibeui-tags-005-mono);font-size:0.6875rem;line-height:1.4;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-005"] *{animation:none!important;transition:none!important}}
`

// Одно правило разбора на все случаи: набор, Enter и вставка из буфера.
function split(value: string) {
  return value
    .split(/[,;\n\t]/)
    .map((part) => part.trim())
    .filter(Boolean)
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
 * Теги по Enter, запятой и точке с запятой, со вставкой целого списка из буфера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags005({
  label = "Кому отправить",
  defaultValue = ["anna@example.com"],
  removeText = "Убрать {tag}",
  placeholderText = "Введите или вставьте список…",
  pastedText = "Из вставки добавлено сразу {count} адресов",
  legendText = "заканчивают тег, вставка списка разбирается целиком",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags005Props) {
  const id = useId()
  const [tags, setTags] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const [added, setAdded] = useState(0)

  const push = (parts: string[]) => {
    const fresh = parts.filter((part) => !tags.includes(part))
    if (fresh.length === 0) return
    setTags([...tags, ...fresh])
    setAdded(fresh.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === ";") {
      event.preventDefault()
      push(split(draft))
      setDraft("")
      return
    }
    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  // Вставка разбирается тем же правилом: список из письма становится чипами.
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text")
    if (!/[,;\n\t]/.test(text)) return
    event.preventDefault()
    push(split(text))
    setDraft("")
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          {tags.map((tag) => (
            <span key={tag} data-part="chip">
              <span data-part="text">{tag}</span>
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
            aria-describedby={`${id}-legend`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onBlur={() => {
              push(split(draft))
              setDraft("")
            }}
          />
        </div>
        <p id={`${id}-legend`} data-part="legend" aria-live="polite">
          {added > 1 ? (
            <span>{pastedText.replace("{count}", String(added))}</span>
          ) : (
            <>
              <kbd>Enter</kbd>
              <kbd>,</kbd>
              <kbd>;</kbd>
              <span>{legendText}</span>
            </>
          )}
        </p>
      </div>
    </>
  )
}
