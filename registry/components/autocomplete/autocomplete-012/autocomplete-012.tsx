"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react"

export type Autocomplete012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: поле само дописывает совпадение и выделяет дописанное —
// как адресная строка браузера. Следующая буква заменяет выделение, поэтому
// набор не ломается; удаление подсказку не включает, иначе стереть лишнее
// становится невозможно. Выделение ставится после отрисовки: до неё в поле
// ещё старое значение.
const STYLES = `
:where([data-vibeui-block="autocomplete-012"]){
--vibeui-autocomplete-012-bg:oklch(1 0 0);
--vibeui-autocomplete-012-fg:oklch(0.22 0.014 265);
--vibeui-autocomplete-012-muted:oklch(0.52 0.014 265);
--vibeui-autocomplete-012-border:oklch(0.9 0.006 265);
--vibeui-autocomplete-012-field:oklch(0.985 0.002 265);
--vibeui-autocomplete-012-accent:oklch(0.55 0.17 265);
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
 * Поле дописывает совпадение и выделяет хвост, как адресная строка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete012({
  label = "Адрес",
  placeholder = "Начните вводить",
  options = DEFAULT_OPTIONS,
  defaultValue = "d",
  onChange,
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

  return (
    <>
      <style href="vibeui-autocomplete-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
              Совпадение <b>{rest}</b> — оно подставится с выделенным хвостом
            </>
          ) : (
            "Поле дописывает совпадение и выделяет дописанное"
          )}
        </span>
      </div>
    </>
  )
}
