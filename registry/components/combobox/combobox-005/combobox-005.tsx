"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  /** Подпись строки создания. {query} — то, что набрано в поле. */
  createLabel?: string
  newBadge?: string
  /** Подпись выбранного под списком. {value} — выбранное значение. */
  selectedText?: string
  /** Подпись под списком, пока ничего не выбрано. */
  emptyText?: string
  defaultValue?: string
  onSelect?: (value: string, created: boolean) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список закрытый ровно до тех пор, пока в нём есть нужное.
// Строка «Создать» живёт последней и появляется только при непустом запросе
// без точного совпадения — она полноценный option, поэтому берётся стрелками
// и Enter, а не отдельной кнопкой мимо клавиатуры.
const STYLES = `
:where([data-vibeui-block="combobox-005"]){
--vibeui-combobox-005-bg:transparent;
--vibeui-combobox-005-fg:light-dark(oklch(0.22 0.02 150),oklch(0.94 0.008 150));
--vibeui-combobox-005-muted:light-dark(oklch(0.52 0.02 150),oklch(0.7 0.016 150));
--vibeui-combobox-005-border:light-dark(oklch(0.9 0.01 150),oklch(0.37 0.016 150));
--vibeui-combobox-005-field:light-dark(oklch(0.985 0.005 150),oklch(0.3 0.014 150));
--vibeui-combobox-005-active:light-dark(oklch(0.95 0.04 150),oklch(0.36 0.045 150));
--vibeui-combobox-005-accent:light-dark(oklch(0.5 0.13 150),oklch(0.78 0.14 150));
--vibeui-combobox-005-radius:0.625rem;
--vibeui-combobox-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-005-bg);
border:1px solid var(--vibeui-combobox-005-border);
border-radius:calc(var(--vibeui-combobox-005-radius) + 0.25rem);
color:var(--vibeui-combobox-005-fg);
font-family:var(--vibeui-combobox-005-font);
}
[data-vibeui-block="combobox-005"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-005"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-005-border);
border-radius:var(--vibeui-combobox-005-radius);
background:var(--vibeui-combobox-005-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-005"] input::placeholder{color:var(--vibeui-combobox-005-muted)}
[data-vibeui-block="combobox-005"] input:focus-visible{outline:2px solid var(--vibeui-combobox-005-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-005"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:11rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-005-border);
border-radius:var(--vibeui-combobox-005-radius);
}
[data-vibeui-block="combobox-005"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-005"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-005-active)}
[data-vibeui-block="combobox-005"] [data-part="option"][data-create="true"]{
margin-top:0.25rem;border-top:1px dashed var(--vibeui-combobox-005-border);
padding-top:0.35rem;color:var(--vibeui-combobox-005-accent);font-weight:600;
}
[data-vibeui-block="combobox-005"] [data-part="plus"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.15rem;height:1.15rem;border-radius:0.35rem;line-height:1;font-size:0.8rem;
background:var(--vibeui-combobox-005-active);
}
[data-vibeui-block="combobox-005"] [data-part="badge"]{
margin-left:auto;padding:0.05rem 0.35rem;border-radius:999px;
font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
background:var(--vibeui-combobox-005-active);color:var(--vibeui-combobox-005-accent);
}
[data-vibeui-block="combobox-005"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-combobox-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Баг",
  "Улучшение",
  "Документация",
  "Регресс",
  "Техдолг",
]

/**
 * Ветка темы для заданного фона: светлая плашка иначе досталась бы тексту
 * тёмной ветки, потому что light-dark() смотрит на color-scheme, а не на цвет.
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
 * Combobox с созданием значения: последняя строка списка заводит новую
 * метку прямо из запроса и сразу её выбирает.
 */
export function Combobox005({
  label = "Метка задачи",
  placeholder = "Найти или создать",
  options = DEFAULT_OPTIONS,
  createLabel = "Создать «{query}»",
  newBadge = "новая",
  selectedText = "Выбрано: {value}",
  emptyText = "Ничего не выбрано",
  defaultValue = "",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox005Props) {
  const id = useId()
  const [known, setKnown] = useState(options)
  const [created, setCreated] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const needle = query.trim()

  const matches = useMemo(() => {
    const lower = needle.toLowerCase()
    if (!lower) return known
    return known.filter((option) => option.toLowerCase().includes(lower))
  }, [known, needle])

  const canCreate =
    needle.length > 0 &&
    !known.some((option) => option.toLowerCase() === needle.toLowerCase())

  const rows = canCreate ? [...matches, needle] : matches
  const palette = {
    ...(accent ? { "--vibeui-combobox-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (index: number) => {
    const option = rows[index]
    if (!option) return
    const isNew = canCreate && index === rows.length - 1

    if (isNew) {
      setKnown((previous) => [...previous, option])
      setCreated((previous) => [...previous, option])
    }

    setValue(option)
    setQuery("")
    setActive(0)
    onSelect?.(option, isNew)
  }

  const move = (delta: number) => {
    if (!rows.length) return
    const next = (active + delta + rows.length) % rows.length
    setActive(next)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      commit(active)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-005"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={value || placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            rows[active] ? `${id}-option-${active}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {rows.map((option, index) => {
            const isCreateRow = canCreate && index === rows.length - 1

            return (
              <li
                key={isCreateRow ? `${id}-create` : option}
                id={`${id}-option-${index}`}
                role="option"
                data-part="option"
                data-create={isCreateRow}
                data-active={index === active}
                aria-selected={!isCreateRow && option === value}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  commit(index)
                }}
              >
                {isCreateRow ? (
                  <>
                    <span data-part="plus" aria-hidden="true">
                      +
                    </span>
                    {createLabel.replace("{query}", option)}
                  </>
                ) : (
                  <>
                    {option}
                    {created.includes(option) ? (
                      <span data-part="badge">{newBadge}</span>
                    ) : null}
                  </>
                )}
              </li>
            )
          })}
        </ul>
        <p data-part="hint" aria-live="polite">
          {value ? selectedText.replace("{value}", value) : emptyText}
        </p>
      </div>
    </>
  )
}
