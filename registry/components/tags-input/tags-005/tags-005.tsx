"use client"

import { useId, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Tags005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string[]
  accent?: string
}

// Идея компонента: тег заканчивается там, где человек поставил разделитель.
// Enter, запятая и точка с запятой делают одно и то же, потому что все три
// привычки встречаются одинаково часто, и заставлять переучиваться незачем.
// Вставка из буфера разбирается тем же правилом: список адресов, скопированный
// из письма, превращается в готовые чипы за одну вставку, а не в один
// гигантский тег со всем текстом внутри.
const STYLES = `
:where([data-vibeui-block="tags-005"]){
--vibeui-tags-005-surface:oklch(1 0 0);
--vibeui-tags-005-field:oklch(1 0 0);
--vibeui-tags-005-shell:oklch(0.9 0.006 265);
--vibeui-tags-005-fg:oklch(0.23 0.014 265);
--vibeui-tags-005-muted:oklch(0.55 0.014 265);
--vibeui-tags-005-border:oklch(0.88 0.008 265);
--vibeui-tags-005-chip:oklch(0.55 0.15 145 / 14%);
--vibeui-tags-005-accent:oklch(0.48 0.15 145);
--vibeui-tags-005-key:oklch(0.96 0.004 265);
--vibeui-tags-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tags-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
box-shadow:0 0 0 2px oklch(0.48 0.15 145 / 18%);
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
 * Теги по Enter, запятой и точке с запятой, со вставкой целого списка из буфера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags005({
  label = "Кому отправить",
  defaultValue = ["anna@example.com"],
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
            placeholder="Введите или вставьте список…"
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
            <span>Из вставки добавлено сразу {added} адресов</span>
          ) : (
            <>
              <kbd>Enter</kbd>
              <kbd>,</kbd>
              <kbd>;</kbd>
              <span>заканчивают тег, вставка списка разбирается целиком</span>
            </>
          )}
        </p>
      </div>
    </>
  )
}
