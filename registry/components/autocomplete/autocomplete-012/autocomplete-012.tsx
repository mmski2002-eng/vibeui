"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ChangeEvent, ComponentProps, CSSProperties } from "react"

export type Autocomplete012Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  /** Строка о найденном совпадении. {match} выделяется жирным. */
  matchHint?: string
  /** Строка, пока совпадения нет. */
  idleHint?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле само дописывает совпадение и выделяет дописанное —
// как адресная строка браузера. Следующая буква заменяет выделение, поэтому
// набор не ломается; удаление подсказку не включает, иначе стереть лишнее
// становится невозможно. Выделение ставится после отрисовки: до неё в поле
// ещё старое значение.
const STYLES = `
:where([data-vibeui-block="autocomplete-012"]){
--vibeui-autocomplete-012-bg:transparent;
--vibeui-autocomplete-012-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-012-muted:color-mix(in oklab,var(--vibeui-autocomplete-012-fg) 68%,transparent);
--vibeui-autocomplete-012-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-012-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-012-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-autocomplete-012-radius:0.625rem;
--vibeui-autocomplete-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-012"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-012-bg);
border:1px solid var(--vibeui-autocomplete-012-border);
border-radius:calc(var(--vibeui-autocomplete-012-radius) + 0.25rem);
color:var(--vibeui-autocomplete-012-fg);
font-family:var(--vibeui-autocomplete-012-font);
}
[data-vibeui-block="autocomplete-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-012"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-012-border);
border-radius:var(--vibeui-autocomplete-012-radius);
background:var(--vibeui-autocomplete-012-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-012"] input::placeholder{color:var(--vibeui-autocomplete-012-muted)}
[data-vibeui-block="autocomplete-012"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-012-accent);outline-offset:1px;border-color:transparent;
}
/* Дописанный хвост выделен цветом поля, а не системным синим: так видно,
   что это подсказка, а не выделенный вручную текст. */
[data-vibeui-block="autocomplete-012"] input::selection{
background:color-mix(in oklab,var(--vibeui-autocomplete-012-accent) 22%,transparent);
color:var(--vibeui-autocomplete-012-fg);
}
[data-vibeui-block="autocomplete-012"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-012-muted)}
[data-vibeui-block="autocomplete-012"] [data-part="hint"] b{color:var(--vibeui-autocomplete-012-fg);font-weight:600}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-012"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "docs.example.com",
  "dashboard.example.com",
  "design.example.com",
  "status.example.com",
  "support.example.com",
]

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
 * Поле дописывает совпадение и выделяет хвост, как адресная строка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete012({
  label = "Адрес",
  placeholder = "Начните вводить",
  options = DEFAULT_OPTIONS,
  defaultValue = "",
  matchHint = "Совпадение {match} — оно подставится с выделенным хвостом",
  idleHint = "Поле дописывает совпадение и выделяет дописанное",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete012Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const pending = useRef<[number, number] | null>(null)
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const range = pending.current
    if (!range) return
    pending.current = null
    inputRef.current?.setSelectionRange(range[0], range[1])
  }, [value])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.value
    const deleting = typed.length < value.length
    const match = deleting
      ? undefined
      : options.find(
          (option) =>
            typed && option.toLowerCase().startsWith(typed.toLowerCase()),
        )

    if (match && match !== typed) {
      pending.current = [typed.length, match.length]
      setValue(match)
      onChange?.(match)
      return
    }

    setValue(typed)
    onChange?.(typed)
  }

  const rest = options.find(
    (option) => value && option.toLowerCase().startsWith(value.toLowerCase()),
  )
  const [beforeMatch, afterMatch = ""] = matchHint.split("{match}")

  return (
    <>
      <style href="vibeui-autocomplete-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-012"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          aria-autocomplete="inline"
          onChange={update}
        />
        <span data-part="hint">
          {rest ? (
            <>
              {beforeMatch}
              <b>{rest}</b>
              {afterMatch}
            </>
          ) : (
            idleHint
          )}
        </span>
      </div>
    </>
  )
}
