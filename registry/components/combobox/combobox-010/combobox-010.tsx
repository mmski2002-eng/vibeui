"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  FormEvent,
  KeyboardEvent,
} from "react"

export type Combobox010Props = Omit<
  ComponentProps<"form">,
  "children" | "onSubmit"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  errorText?: string
  hintText?: string
  submitLabel?: string
  onSubmitValue?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: обязательный выбор с честной ошибкой. Ошибка появляется
// не на каждое нажатие, а только после отправки: ругаться на человека, пока
// он ещё заполняет форму, — худшее, что может сделать поле. Сообщение
// связано с полем через aria-describedby и живёт в role="alert", поэтому
// скринридер узнаёт о нём без перевода фокуса.
const STYLES = `
:where([data-vibeui-block="combobox-010"]){
--vibeui-combobox-010-bg:transparent;
--vibeui-combobox-010-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-combobox-010-muted:color-mix(in oklab,var(--vibeui-combobox-010-fg) 68%,transparent);
--vibeui-combobox-010-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-combobox-010-field:light-dark(oklch(0.985 0 265),oklch(0.3 0 265));
--vibeui-combobox-010-active:light-dark(oklch(0.95 0 265),oklch(0.36 0 265));
--vibeui-combobox-010-accent:light-dark(oklch(0.52 0.15 265),oklch(0.72 0.14 265));
--vibeui-combobox-010-onaccent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-combobox-010-danger:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.18 25));
--vibeui-combobox-010-dangerbg:light-dark(oklch(0.96 0.03 25),oklch(0.32 0.06 25));
--vibeui-combobox-010-ondanger:light-dark(oklch(1 0 0),oklch(0.2 0.04 25));
--vibeui-combobox-010-radius:0.625rem;
--vibeui-combobox-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-010"]{color-scheme:dark}
[data-vibeui-block="combobox-010"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-010-bg);
border:1px solid var(--vibeui-combobox-010-border);
border-radius:calc(var(--vibeui-combobox-010-radius) + 0.25rem);
color:var(--vibeui-combobox-010-fg);
font-family:var(--vibeui-combobox-010-font);
}
[data-vibeui-block="combobox-010"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-010"] label span{color:var(--vibeui-combobox-010-danger)}
[data-vibeui-block="combobox-010"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-010-border);
border-radius:var(--vibeui-combobox-010-radius);
background:var(--vibeui-combobox-010-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-010"] input::placeholder{color:var(--vibeui-combobox-010-muted)}
[data-vibeui-block="combobox-010"] input:focus-visible{outline:2px solid var(--vibeui-combobox-010-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-010"] input[aria-invalid="true"]{
border-color:var(--vibeui-combobox-010-danger);background:var(--vibeui-combobox-010-dangerbg);
}
[data-vibeui-block="combobox-010"] input[aria-invalid="true"]:focus-visible{outline-color:var(--vibeui-combobox-010-danger)}
[data-vibeui-block="combobox-010"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:9rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-010-border);
border-radius:var(--vibeui-combobox-010-radius);
}
[data-vibeui-block="combobox-010"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-010"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-010-active)}
[data-vibeui-block="combobox-010"] [data-part="option"][aria-selected="true"]{font-weight:650;color:var(--vibeui-combobox-010-accent)}
[data-vibeui-block="combobox-010"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-combobox-010-muted)}
[data-vibeui-block="combobox-010"] [data-part="error"]{
display:flex;align-items:center;gap:0.4rem;margin:0;
font-size:0.75rem;font-weight:600;color:var(--vibeui-combobox-010-danger);
}
[data-vibeui-block="combobox-010"] [data-part="error"]::before{
content:"!";display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;border-radius:999px;font-size:0.7rem;
background:var(--vibeui-combobox-010-danger);color:var(--vibeui-combobox-010-ondanger);
}
[data-vibeui-block="combobox-010"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.25rem 1rem;border-radius:var(--vibeui-combobox-010-radius);
background:var(--vibeui-combobox-010-accent);color:var(--vibeui-combobox-010-onaccent);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="combobox-010"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="combobox-010"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-combobox-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Наличными курьеру",
  "Картой онлайн",
  "Счёт для компании",
  "Рассрочка",
  "Криптовалютой",
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
 * Combobox с обязательным выбором: ошибка показывается после отправки,
 * связана с полем через aria-describedby и снимается выбором значения.
 */
export function Combobox010({
  label = "Способ оплаты",
  placeholder = "Выберите из списка",
  options = DEFAULT_OPTIONS,
  errorText = "Выберите способ оплаты из списка",
  hintText = "Свой вариант вписать нельзя",
  submitLabel = "Оформить",
  onSubmitValue,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox010Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    setInvalid(false)
    inputRef.current?.focus()
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
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
      // Enter в поле выбирает строку, а не отправляет форму: иначе половина
      // людей отправит форму, промахнувшись мимо списка.
      event.preventDefault()
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!value) {
      setInvalid(true)
      inputRef.current?.focus()
      return
    }

    setInvalid(false)
    onSubmitValue?.(value)
  }

  return (
    <>
      <style href="vibeui-combobox-010" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-010"
        className={className}
        style={palette}
        onSubmit={onSubmit}
        noValidate
      >
        <label htmlFor={`${id}-input`}>
          {label} <span aria-hidden="true">*</span>
        </label>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          required
          placeholder={value || placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-required="true"
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
          aria-activedescendant={
            matches[active] ? `${id}-option-${active}` : undefined
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
          {matches.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={option === value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(option)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
        {invalid ? (
          <p data-part="error" id={`${id}-error`} role="alert">
            {errorText}
          </p>
        ) : (
          <p data-part="hint" id={`${id}-hint`}>
            {hintText}
          </p>
        )}
        <button type="submit" data-part="submit">
          {submitLabel}
        </button>
      </form>
    </>
  )
}
