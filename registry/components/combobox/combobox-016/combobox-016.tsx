"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox016Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  maxItems?: number
  onChange?: (values: string[]) => void
  /** Заголовок списка фишек для скринридера. */
  chipsLabel?: string
  /** Подпись кнопки снятия; {item} — название значения. */
  removeText?: string
  /** Подпись на пределе; {max} — сам потолок. */
  fullText?: string
  /** Подпись с остатком; {count} — число, {noun} — слово из itemForms. */
  leftText?: string
  /** Три формы слова для счёта: 1 навык, 2 навыка, 5 навыков. */
  itemForms?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ограничение «не больше пяти» нельзя сообщать после
// отправки формы. Счётчик показывает остаток всё время, а на пределе
// невыбранные варианты становятся disabled — правило видно как состояние
// списка, а не как красный текст постфактум.
const STYLES = `
:where([data-vibeui-block="combobox-016"]){
--vibeui-combobox-016-bg:transparent;
--vibeui-combobox-016-fg:light-dark(oklch(0.22 0.014 145),oklch(0.94 0.006 145));
--vibeui-combobox-016-muted:color-mix(in oklab,var(--vibeui-combobox-016-fg) 68%,transparent);
--vibeui-combobox-016-border:light-dark(oklch(0.9 0.008 145),oklch(0.35 0.012 145));
--vibeui-combobox-016-field:light-dark(oklch(0.985 0.004 145),oklch(0.27 0.012 145));
--vibeui-combobox-016-soft:light-dark(oklch(0.96 0.008 145),oklch(0.31 0.014 145));
--vibeui-combobox-016-accent:light-dark(oklch(0.47 0.11 145),oklch(0.74 0.12 145));
--vibeui-combobox-016-accentsoft:light-dark(oklch(0.93 0.05 145),oklch(0.35 0.05 145));
--vibeui-combobox-016-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.02 145));
--vibeui-combobox-016-warn:light-dark(oklch(0.55 0.13 55),oklch(0.78 0.13 55));
--vibeui-combobox-016-radius:0.625rem;
--vibeui-combobox-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-016"]{color-scheme:dark}
[data-vibeui-block="combobox-016"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-016-bg);
border:1px solid var(--vibeui-combobox-016-border);
border-radius:calc(var(--vibeui-combobox-016-radius) + 0.25rem);
color:var(--vibeui-combobox-016-fg);
font-family:var(--vibeui-combobox-016-font);
}
[data-vibeui-block="combobox-016"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="combobox-016"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-016"] [data-part="counter"]{
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-combobox-016-muted);
}
[data-vibeui-block="combobox-016"][data-full="true"] [data-part="counter"]{color:var(--vibeui-combobox-016-warn)}
[data-vibeui-block="combobox-016"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="combobox-016"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.15rem 0.2rem 0.15rem 0.5rem;border-radius:999px;
background:var(--vibeui-combobox-016-accentsoft);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="combobox-016"] [data-part="drop"]{
appearance:none;cursor:pointer;font:inherit;border:0;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.1rem;height:1.1rem;border-radius:999px;font-size:0.85rem;line-height:1;
}
[data-vibeui-block="combobox-016"] [data-part="drop"]:hover{background:var(--vibeui-combobox-016-field)}
[data-vibeui-block="combobox-016"] [data-part="drop"]:focus-visible{
outline:2px solid var(--vibeui-combobox-016-accent);outline-offset:1px;
}
[data-vibeui-block="combobox-016"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-016-border);
border-radius:var(--vibeui-combobox-016-radius);
background:var(--vibeui-combobox-016-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-016"] input::placeholder{color:var(--vibeui-combobox-016-muted)}
[data-vibeui-block="combobox-016"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-016-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-016"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12rem;overflow:auto;
border:1px solid var(--vibeui-combobox-016-border);
border-radius:var(--vibeui-combobox-016-radius);
}
[data-vibeui-block="combobox-016"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;gap:0.5rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
font-size:0.875rem;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-016"] [data-part="option"]:hover:not(:disabled){background:var(--vibeui-combobox-016-soft)}
[data-vibeui-block="combobox-016"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-016-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-016"] [data-part="option"]:disabled{cursor:not-allowed;color:var(--vibeui-combobox-016-muted)}
[data-vibeui-block="combobox-016"] [data-part="box"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.05rem;height:1.05rem;border-radius:0.3rem;
border:1px solid var(--vibeui-combobox-016-border);
background:var(--vibeui-combobox-016-field);
font-size:0.7rem;line-height:1;color:transparent;
}
[data-vibeui-block="combobox-016"] [data-part="option"][aria-selected="true"] [data-part="box"]{
background:var(--vibeui-combobox-016-accent);border-color:transparent;
color:var(--vibeui-combobox-016-onaccent);
}
[data-vibeui-block="combobox-016"] [data-part="note"]{
margin:0;font-size:0.78rem;color:var(--vibeui-combobox-016-muted);
}
[data-vibeui-block="combobox-016"][data-full="true"] [data-part="note"]{color:var(--vibeui-combobox-016-warn)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-016"] *{animation:none!important;transition:none!important}}
`

const SKILLS = [
  "TypeScript",
  "React",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "Rust",
  "Go",
  "Figma",
]

const ITEM_FORMS = ["навык", "навыка", "навыков"]

/** Три формы слова: русский счёт требует их, английскому хватит двух. */
function pluralize(count: number, forms: string[]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
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
 * Множественный выбор с потолком и счётчиком остатка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox016({
  label = "Навыки в резюме",
  placeholder = "Найти навык",
  options = SKILLS,
  defaultValue = ["TypeScript", "React"],
  maxItems = 5,
  onChange,
  chipsLabel = "Выбранные навыки",
  removeText = "Убрать {item}",
  fullText = "Предел {max}: снимите один навык, чтобы добавить другой",
  leftText = "Можно добавить ещё {count} {noun}",
  itemForms = ITEM_FORMS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox016Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [values, setValues] = useState(defaultValue)

  const full = values.length >= maxItems

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

  const toggle = (option: string) => {
    const next = values.includes(option)
      ? values.filter((entry) => entry !== option)
      : [...values, option]

    if (next.length > maxItems) return

    setValues(next)
    onChange?.(next)
  }

  const left = maxItems - values.length

  const rootRef = useRef<HTMLDivElement | null>(null)

  // Список открыт всегда, поэтому стрелки водят по нему настоящим фокусом:
  // варианты — обычные кнопки, и без клавиатуры роль listbox обещает
  // скринридеру навигацию, которой нет.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const options = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    )

    if (options.length === 0) {
      return
    }

    const current = options.indexOf(document.activeElement as HTMLButtonElement)

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      const next =
        current === -1 ? 0 : (current + step + options.length) % options.length
      options[next].focus()
    } else if (
      current !== -1 &&
      (event.key === "Home" || event.key === "End")
    ) {
      event.preventDefault()
      options[event.key === "Home" ? 0 : options.length - 1].focus()
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      rootRef.current
        ?.querySelector<HTMLInputElement>('[role="combobox"]')
        ?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-combobox-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
        data-vibeui-block="combobox-016"
        data-full={full}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={`${id}-input`}>{label}</label>
          <span data-part="counter">
            {values.length} / {maxItems}
          </span>
        </div>
        {values.length > 0 ? (
          <ul data-part="chips" aria-label={chipsLabel}>
            {values.map((entry) => (
              <li key={entry} data-part="chip">
                {entry}
                <button
                  type="button"
                  data-part="drop"
                  aria-label={removeText.replace("{item}", entry)}
                  onClick={() => toggle(entry)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-note`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          data-part="list"
        >
          {matches.map((option) => {
            const chosen = values.includes(option)

            return (
              <li key={option} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={chosen}
                  disabled={full && !chosen}
                  onClick={() => toggle(option)}
                >
                  <span data-part="box" aria-hidden="true">
                    ✓
                  </span>
                  {option}
                </button>
              </li>
            )
          })}
        </ul>
        <p id={`${id}-note`} data-part="note" aria-live="polite">
          {full
            ? fullText.replace("{max}", String(maxItems))
            : leftText
                .replace("{count}", String(left))
                .replace("{noun}", pluralize(left, itemForms))}
        </p>
      </div>
    </>
  )
}
