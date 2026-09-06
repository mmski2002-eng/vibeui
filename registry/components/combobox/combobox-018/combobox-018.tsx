"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox018Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  /** Остаток на складе по каждому варианту: проверка «спрашивает» его. */
  stock?: Record<string, number>
  delay?: number
  defaultValue?: string
  onSelect?: (value: string, available: boolean) => void
  /** Строка статуса, пока идёт проверка. */
  checkingText?: string
  /** Строка удачной проверки; {count} — остаток, {noun} — слово из unitForms. */
  okText?: string
  /** Строка отказа. */
  badText?: string
  /** Строка, пока ничего не выбрано. */
  idleText?: string
  /** Три формы слова для счёта: 1 штука, 2 штуки, 5 штук. */
  unitForms?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вариант может быть в списке и всё равно не подойти —
// склад пуст, домен занят, лицензия кончилась. Поэтому выбор здесь не
// финал, а начало проверки: после нажатия строка статуса уходит в
// «проверяем», а потом отвечает числом или отказом. Пока идёт проверка,
// значение уже выбрано — форму не блокируем, но и «готово» не говорим.
const STYLES = `
:where([data-vibeui-block="combobox-018"]){
--vibeui-combobox-018-bg:transparent;
--vibeui-combobox-018-fg:light-dark(oklch(0.22 0 240),oklch(0.94 0 240));
--vibeui-combobox-018-muted:color-mix(in oklab,var(--vibeui-combobox-018-fg) 68%,transparent);
--vibeui-combobox-018-border:light-dark(oklch(0.9 0 240),oklch(0.35 0 240));
--vibeui-combobox-018-field:light-dark(oklch(0.985 0 240),oklch(0.27 0 240));
--vibeui-combobox-018-soft:light-dark(oklch(0.96 0 240),oklch(0.31 0 240));
--vibeui-combobox-018-accent:light-dark(oklch(0.5 0.13 240),oklch(0.72 0.13 240));
--vibeui-combobox-018-accentsoft:light-dark(oklch(0.94 0.04 240),oklch(0.36 0.06 240));
--vibeui-combobox-018-ok:light-dark(oklch(0.5 0.11 150),oklch(0.76 0.12 150));
--vibeui-combobox-018-bad:light-dark(oklch(0.55 0.18 25),oklch(0.72 0.16 25));
--vibeui-combobox-018-radius:0.625rem;
--vibeui-combobox-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-018"]{color-scheme:dark}
[data-vibeui-block="combobox-018"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-018-bg);
border:1px solid var(--vibeui-combobox-018-border);
border-radius:calc(var(--vibeui-combobox-018-radius) + 0.25rem);
color:var(--vibeui-combobox-018-fg);
font-family:var(--vibeui-combobox-018-font);
}
[data-vibeui-block="combobox-018"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-018"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-018-border);
border-radius:var(--vibeui-combobox-018-radius);
background:var(--vibeui-combobox-018-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-018"] input::placeholder{color:var(--vibeui-combobox-018-muted)}
[data-vibeui-block="combobox-018"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-018-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-018"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12rem;overflow:auto;
border:1px solid var(--vibeui-combobox-018-border);
border-radius:var(--vibeui-combobox-018-radius);
}
[data-vibeui-block="combobox-018"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
font-size:0.875rem;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-018"] [data-part="option"]:hover{background:var(--vibeui-combobox-018-soft)}
[data-vibeui-block="combobox-018"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-018-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-018"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-018-accentsoft);font-weight:600;
}
[data-vibeui-block="combobox-018"] [data-part="status"]{
display:flex;align-items:center;gap:0.4rem;margin:0;min-height:1.4rem;
font-size:0.8rem;color:var(--vibeui-combobox-018-muted);
}
[data-vibeui-block="combobox-018"] [data-part="status"][data-state="ok"]{color:var(--vibeui-combobox-018-ok)}
[data-vibeui-block="combobox-018"] [data-part="status"][data-state="bad"]{color:var(--vibeui-combobox-018-bad)}
[data-vibeui-block="combobox-018"] [data-part="spin"]{
flex:none;width:0.85rem;height:0.85rem;border-radius:50%;
border:2px solid var(--vibeui-combobox-018-border);
border-top-color:var(--vibeui-combobox-018-accent);
animation:vibeui-combobox-018-spin .7s linear infinite;
}
[data-vibeui-block="combobox-018"] [data-part="dot"]{
flex:none;width:0.55rem;height:0.55rem;border-radius:50%;background:currentColor;
}
@keyframes vibeui-combobox-018-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-018"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-018"] [role="listbox"][hidden]{display:none}

`

const WAREHOUSES = [
  "Склад Москва · South Gate",
  "Склад Санкт-Петербург · Пулково",
  "Склад Казань · Технополис",
  "Склад Екатеринбург · Кольцово",
  "Склад Новосибирск · Толмачёво",
]

const STOCK: Record<string, number> = {
  "Склад Москва · South Gate": 42,
  "Склад Санкт-Петербург · Пулково": 7,
  "Склад Казань · Технополис": 0,
  "Склад Екатеринбург · Кольцово": 15,
  "Склад Новосибирск · Толмачёво": 0,
}

const UNIT_FORMS = ["штука", "штуки", "штук"]

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
 * Выбор с асинхронной проверкой значения после нажатия.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox018({
  label = "Склад отгрузки",
  placeholder = "Найти склад",
  options = WAREHOUSES,
  stock = STOCK,
  delay = 700,
  defaultValue = "Склад Казань · Технополис",
  onSelect,
  checkingText = "Проверяем остаток на складе…",
  okText = "На складе {count} {noun}",
  badText = "Нет в наличии — выберите другой склад",
  idleText = "Выберите склад, чтобы проверить остаток",
  unitForms = UNIT_FORMS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox018Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [checked, setChecked] = useState<{
    value: string
    status: "ok" | "bad"
  } | null>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

  // Проверка живёт в эффекте с очисткой: быстрый перебор вариантов не должен
  // оставлять хвост из старых ответов, побеждает последний выбор. В состоянии
  // лежит только ответ вместе со значением, для которого он получен, —
  // «проверяется» и «пусто» выводятся из пропсов, а не досылаются эффектом.
  useEffect(() => {
    if (!value) return

    const timer = setTimeout(() => {
      const left = stock[value] ?? 0

      setChecked({ value, status: left > 0 ? "ok" : "bad" })
      onSelect?.(value, left > 0)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, stock, onSelect])

  const state = !value
    ? "idle"
    : checked?.value === value
      ? checked.status
      : "checking"

  const left = stock[value] ?? 0

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
    ...(accent ? { "--vibeui-combobox-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
        data-vibeui-block="combobox-018"
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
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-status`}
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
          {matches.map((option) => (
            <li key={option} role="none">
              <button
                type="button"
                role="option"
                data-part="option"
                aria-selected={option === value}
                onClick={() => setValue(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        <p
          id={`${id}-status`}
          data-part="status"
          data-state={state}
          aria-live="polite"
        >
          {state === "checking" ? (
            <>
              <span data-part="spin" aria-hidden="true" />
              {checkingText}
            </>
          ) : state === "ok" ? (
            <>
              <span data-part="dot" aria-hidden="true" />
              {okText
                .replace("{count}", String(left))
                .replace("{noun}", pluralize(left, unitForms))}
            </>
          ) : state === "bad" ? (
            <>
              <span data-part="dot" aria-hidden="true" />
              {badText}
            </>
          ) : (
            idleText
          )}
        </p>
      </div>
    </>
  )
}
