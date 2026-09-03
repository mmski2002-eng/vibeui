"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox014Option = { name: string; hint?: string; src?: string }

export type Combobox014Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: Combobox014Option[]
  defaultValue?: string
  onSelect?: (value: string) => void
  /** Строка на месте пустого списка. */
  emptyText?: string
  /** Подпись строки итога перед выбранным вариантом. */
  pickedLabel?: string
  /** Что стоит в итоге, пока ничего не выбрано. */
  emptyValueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: когда варианты различаются внешним видом — шаблон письма,
// тема оформления, обложка, — текстовая строка бесполезна. Здесь у каждого
// варианта есть картинка, а если ссылки нет, вместо неё рисуется свой
// градиент с инициалами: оттенок считается из названия, поэтому вариант
// всегда узнаётся по одному и тому же пятну.
const STYLES = `
:where([data-vibeui-block="combobox-014"]){
--vibeui-combobox-014-bg:transparent;
--vibeui-combobox-014-fg:light-dark(oklch(0.22 0.014 285),oklch(0.94 0.006 285));
--vibeui-combobox-014-muted:color-mix(in oklab,var(--vibeui-combobox-014-fg) 68%,transparent);
--vibeui-combobox-014-border:light-dark(oklch(0.9 0.008 285),oklch(0.35 0.012 285));
--vibeui-combobox-014-field:light-dark(oklch(0.985 0.004 285),oklch(0.27 0.012 285));
--vibeui-combobox-014-soft:light-dark(oklch(0.96 0.008 285),oklch(0.31 0.014 285));
--vibeui-combobox-014-accent:light-dark(oklch(0.5 0.13 285),oklch(0.72 0.13 285));
--vibeui-combobox-014-accentsoft:light-dark(oklch(0.94 0.04 285),oklch(0.36 0.06 285));
--vibeui-combobox-014-radius:0.625rem;
--vibeui-combobox-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-014"]{color-scheme:dark}
[data-vibeui-block="combobox-014"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-014-bg);
border:1px solid var(--vibeui-combobox-014-border);
border-radius:calc(var(--vibeui-combobox-014-radius) + 0.25rem);
color:var(--vibeui-combobox-014-fg);
font-family:var(--vibeui-combobox-014-font);
}
[data-vibeui-block="combobox-014"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-014"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-014-border);
border-radius:var(--vibeui-combobox-014-radius);
background:var(--vibeui-combobox-014-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-014"] input::placeholder{color:var(--vibeui-combobox-014-muted)}
[data-vibeui-block="combobox-014"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-014-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-014"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.15rem;
max-height:14rem;overflow:auto;
border:1px solid var(--vibeui-combobox-014-border);
border-radius:var(--vibeui-combobox-014-radius);
}
[data-vibeui-block="combobox-014"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:2.4rem 1fr;align-items:center;gap:0.55rem;
box-sizing:border-box;padding:0.35rem 0.4rem;
border:0;border-radius:0.5rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-014"] [data-part="option"]:hover{background:var(--vibeui-combobox-014-soft)}
[data-vibeui-block="combobox-014"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-014-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-014"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-014-accentsoft);
}
[data-vibeui-block="combobox-014"] [data-part="thumb"]{
display:flex;align-items:center;justify-content:center;
width:2.4rem;height:2.4rem;border-radius:0.45rem;overflow:hidden;flex:none;
background:linear-gradient(140deg,
oklch(0.86 0.09 var(--vibeui-combobox-014-hue,250)),
oklch(0.62 0.13 calc(var(--vibeui-combobox-014-hue,250) + 40)));
color:oklch(0.99 0.01 var(--vibeui-combobox-014-hue,250));
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="combobox-014"] [data-part="thumb"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="combobox-014"] [data-part="body"]{min-width:0;display:flex;flex-direction:column}
[data-vibeui-block="combobox-014"] [data-part="name"]{
font-size:0.875rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-014"] [data-part="hint"]{
font-size:0.72rem;color:var(--vibeui-combobox-014-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-014"] [data-part="empty"]{
margin:0;padding:0.6rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-014-muted);
}
[data-vibeui-block="combobox-014"] [data-part="picked"]{
display:flex;align-items:center;gap:0.5rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-combobox-014-border);
font-size:0.8rem;color:var(--vibeui-combobox-014-muted);
}
[data-vibeui-block="combobox-014"] [data-part="picked"] b{color:var(--vibeui-combobox-014-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-014"] *{animation:none!important;transition:none!important}}
`

const TEMPLATES: Combobox014Option[] = [
  { name: "Приветственное письмо", hint: "Онбординг · 3 блока" },
  { name: "Брошенная корзина", hint: "Продажи · 2 блока" },
  { name: "Ежемесячный дайджест", hint: "Контент · 6 блоков" },
  { name: "Подтверждение заказа", hint: "Транзакционное · 1 блок" },
  { name: "Возврат клиента", hint: "Реактивация · 4 блока" },
  { name: "Отчёт по проекту", hint: "Внутреннее · 5 блоков" },
]

/** Детерминированный оттенок из названия: вариант всегда одного цвета. */
function hueOf(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
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
 * Выбор варианта с картинкой: превью слева, название и подпись справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox014({
  label = "Шаблон письма",
  placeholder = "Найти шаблон",
  options = TEMPLATES,
  defaultValue = "Брошенная корзина",
  onSelect,
  emptyText = "Шаблон не найден",
  pickedLabel = "Выбран шаблон",
  emptyValueText = "не выбран",
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox014Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) =>
      option.name.toLowerCase().includes(needle),
    )
  }, [query, options])

  const picked = options.find((option) => option.name === value)

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
    ...(accent ? { "--vibeui-combobox-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
        data-vibeui-block="combobox-014"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">{emptyText}</p>
            </li>
          ) : (
            matches.map((option) => (
              <li key={option.name} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={option.name === value}
                  onClick={() => {
                    setValue(option.name)
                    onSelect?.(option.name)
                  }}
                >
                  <span
                    data-part="thumb"
                    style={
                      {
                        "--vibeui-combobox-014-hue": hueOf(option.name),
                      } as CSSProperties
                    }
                  >
                    {option.src ? (
                      <img src={option.src} alt="" />
                    ) : (
                      <span aria-hidden="true">{initialsOf(option.name)}</span>
                    )}
                  </span>
                  <span data-part="body">
                    <span data-part="name">{option.name}</span>
                    {option.hint ? (
                      <span data-part="hint">{option.hint}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p data-part="picked" aria-live="polite">
          {pickedLabel}: <b>{picked?.name ?? emptyValueText}</b>
        </p>
      </div>
    </>
  )
}
