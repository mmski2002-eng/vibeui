"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox020Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  headChars?: number
  tailChars?: number
  onSelect?: (value: string) => void
  /** Что стоит в поле значения, пока ничего не выбрано. */
  emptyValueText?: string
  /** Строка на месте пустого списка. */
  emptyText?: string
  /** Полная строка снизу, пока ничего не выбрано. */
  noValueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в узкой колонке — сайдбар, ячейка таблицы, боковая
// панель — длинные значения обрезаются, и обрезать их надо по-разному.
// В списке читают с начала, поэтому строки гаснут многоточием справа.
// А у выбранного значения важен хвост: имя файла, окончание пути, номер
// версии, — поэтому оно режется по середине и сохраняет оба конца.
const STYLES = `
:where([data-vibeui-block="combobox-020"]){
--vibeui-combobox-020-bg:transparent;
--vibeui-combobox-020-fg:light-dark(oklch(0.22 0.014 175),oklch(0.94 0.006 175));
--vibeui-combobox-020-muted:color-mix(in oklab,var(--vibeui-combobox-020-fg) 68%,transparent);
--vibeui-combobox-020-border:light-dark(oklch(0.9 0.008 175),oklch(0.35 0.012 175));
--vibeui-combobox-020-field:light-dark(oklch(0.985 0.004 175),oklch(0.27 0.012 175));
--vibeui-combobox-020-soft:light-dark(oklch(0.96 0.008 175),oklch(0.31 0.014 175));
--vibeui-combobox-020-accent:light-dark(oklch(0.47 0.1 175),oklch(0.74 0.1 175));
--vibeui-combobox-020-accentsoft:light-dark(oklch(0.93 0.045 175),oklch(0.34 0.045 175));
--vibeui-combobox-020-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.02 175));
--vibeui-combobox-020-radius:0.55rem;
--vibeui-combobox-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-combobox-020-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-020"]{color-scheme:dark}
[data-vibeui-block="combobox-020"]{
display:flex;flex-direction:column;gap:0.35rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-combobox-020-bg);
border:1px solid var(--vibeui-combobox-020-border);
border-radius:calc(var(--vibeui-combobox-020-radius) + 0.25rem);
color:var(--vibeui-combobox-020-fg);
font-family:var(--vibeui-combobox-020-font);
}
[data-vibeui-block="combobox-020"] label{font-size:0.75rem;font-weight:600}
[data-vibeui-block="combobox-020"] input{
box-sizing:border-box;width:100%;height:2.2rem;padding:0 0.5rem;
border:1px solid var(--vibeui-combobox-020-border);
border-radius:var(--vibeui-combobox-020-radius);
background:var(--vibeui-combobox-020-field);
color:inherit;font:inherit;font-size:0.8125rem;
text-overflow:ellipsis;
}
[data-vibeui-block="combobox-020"] input::placeholder{color:var(--vibeui-combobox-020-muted)}
[data-vibeui-block="combobox-020"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-020-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-020"] [data-part="value"]{
display:flex;align-items:center;gap:0.3rem;
box-sizing:border-box;width:100%;min-height:2rem;padding:0.3rem 0.5rem;
border-radius:var(--vibeui-combobox-020-radius);
background:var(--vibeui-combobox-020-accentsoft);
font-family:var(--vibeui-combobox-020-mono);font-size:0.75rem;
}
[data-vibeui-block="combobox-020"] [data-part="short"]{
min-width:0;white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="combobox-020"] [data-part="list"]{
margin:0;padding:0.15rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:11rem;overflow-y:auto;overflow-x:hidden;
border:1px solid var(--vibeui-combobox-020-border);
border-radius:var(--vibeui-combobox-020-radius);
}
[data-vibeui-block="combobox-020"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:block;box-sizing:border-box;padding:0.35rem 0.45rem;
border:0;border-radius:0.4rem;background:transparent;color:inherit;text-align:left;
font-family:var(--vibeui-combobox-020-mono);font-size:0.75rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-020"] [data-part="option"]:hover{background:var(--vibeui-combobox-020-soft)}
[data-vibeui-block="combobox-020"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-020-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-020"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-020-accent);color:var(--vibeui-combobox-020-onaccent);
}
[data-vibeui-block="combobox-020"] [data-part="full"]{
margin:0;font-size:0.68rem;line-height:1.35;color:var(--vibeui-combobox-020-muted);
overflow-wrap:anywhere;
}
[data-vibeui-block="combobox-020"] [data-part="empty"]{
margin:0;padding:0.5rem 0.45rem;font-size:0.75rem;color:var(--vibeui-combobox-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-020"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-020"] [role="listbox"][hidden]{display:none}

`

const BRANCHES = [
  "feature/checkout-address-validation",
  "feature/payment-provider-migration",
  "release/2026.04.1-hotfix-invoices",
  "bugfix/cart-total-rounding-error",
  "chore/update-typescript-and-eslint",
  "experiment/new-onboarding-funnel-v3",
]

/** Обрезка по середине: сохраняет начало и хвост, а не только начало. */
function shorten(text: string, head: number, tail: number) {
  if (text.length <= head + tail + 1) return text

  return `${text.slice(0, head)}…${tail > 0 ? text.slice(-tail) : ""}`
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
 * Выбор в узкой колонке: список режется справа, значение — по середине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox020({
  label = "Ветка",
  placeholder = "Фильтр",
  options = BRANCHES,
  defaultValue = "release/2026.04.1-hotfix-invoices",
  headChars = 14,
  tailChars = 10,
  onSelect,
  emptyValueText = "не выбрана",
  emptyText = "Нет совпадений",
  noValueText = "Ветка не выбрана",
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox020Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

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

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
        data-vibeui-block="combobox-020"
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          // Уход фокуса за пределы поля закрывает список; переход внутрь
          // (поле → кнопка очистки) оставляет его открытым. Нажатие по строке
          // списка фокус тоже уводит, но список должен дожить до выбора.
          if (pressingList.current) {
            return
          }

          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false)
          }
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
          }
        }}
        onPointerDownCapture={(event) => {
          // Гасить нажатие нельзя: часть строк выбирается на mousedown, и
          // preventDefault отменил бы сам выбор. Держим флаг и не закрываем
          // список, пока кнопка мыши не отпущена.
          if ((event.target as HTMLElement).closest('[role="listbox"]')) {
            pressingList.current = true
            return
          }

          setOpen(true)
        }}
        onPointerUpCapture={() => {
          pressingList.current = false
        }}
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <p data-part="value">
          <span data-part="short" title={value}>
            {value ? shorten(value, headChars, tailChars) : emptyValueText}
          </span>
        </p>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          hidden={!open}
          aria-label={label}
          data-part="list"
        >
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">{emptyText}</p>
            </li>
          ) : (
            matches.map((option) => (
              <li key={option} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={option === value}
                  aria-label={option}
                  title={option}
                  onClick={() => {
                    setValue(option)
                    onSelect?.(option)
                  }}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
        <p data-part="full" aria-live="polite">
          {value || noValueText}
        </p>
      </div>
    </>
  )
}
