"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox021Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  createLabel?: string
  newBadge?: string
  emptyLabel?: string
  defaultValue?: string
  onSelect?: (value: string, created: boolean) => void
  /** Строка итога с выбранным значением; {value} — само значение. */
  selectedText?: string
  /** Подсказка, пока запрос заводит новое значение. */
  createHintText?: string
  /** Подсказка, пока ничего не выбрано. */
  noValueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: создание — это не запасной путь в конце списка, а самый
// вероятный следующий шаг, если справочника ещё не хватает. Строка
// «Создать „…“» стоит первой, поэтому Enter по умолчанию заводит новое
// значение, а не выбирает первое совпадение — существующий вариант нужно
// брать осознанно, стрелкой вниз.
const STYLES = `
:where([data-vibeui-block="combobox-021"]){
--vibeui-combobox-021-bg:transparent;
--vibeui-combobox-021-fg:light-dark(oklch(0.22 0.02 20),oklch(0.94 0.008 20));
--vibeui-combobox-021-muted:color-mix(in oklab,var(--vibeui-combobox-021-fg) 68%,transparent);
--vibeui-combobox-021-border:light-dark(oklch(0.9 0.01 20),oklch(0.35 0.014 20));
--vibeui-combobox-021-field:light-dark(oklch(0.985 0.004 20),oklch(0.27 0.012 20));
--vibeui-combobox-021-active:light-dark(oklch(0.95 0.035 39.8),oklch(0.33 0.045 39.8));
--vibeui-combobox-021-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.76 0.15 39.8));
--vibeui-combobox-021-radius:0.625rem;
--vibeui-combobox-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-021"]{color-scheme:dark}
[data-vibeui-block="combobox-021"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-021-bg);
border:1px solid var(--vibeui-combobox-021-border);
border-radius:calc(var(--vibeui-combobox-021-radius) + 0.25rem);
color:var(--vibeui-combobox-021-fg);
font-family:var(--vibeui-combobox-021-font);
}
[data-vibeui-block="combobox-021"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-021"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-021-border);
border-radius:var(--vibeui-combobox-021-radius);
background:var(--vibeui-combobox-021-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-021"] input::placeholder{color:var(--vibeui-combobox-021-muted)}
[data-vibeui-block="combobox-021"] input:focus-visible{outline:2px solid var(--vibeui-combobox-021-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-021"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:11rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-021-border);
border-radius:var(--vibeui-combobox-021-radius);
}
[data-vibeui-block="combobox-021"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-021"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-021-active)}
[data-vibeui-block="combobox-021"] [data-part="option"][data-create="true"]{
margin-bottom:0.25rem;border-bottom:1px dashed var(--vibeui-combobox-021-border);
padding-bottom:0.35rem;color:var(--vibeui-combobox-021-accent);font-weight:600;
}
[data-vibeui-block="combobox-021"] [data-part="spark"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.15rem;height:1.15rem;border-radius:0.35rem;line-height:1;font-size:0.75rem;
background:var(--vibeui-combobox-021-active);
}
[data-vibeui-block="combobox-021"] [data-part="badge"]{
margin-left:auto;padding:0.05rem 0.35rem;border-radius:999px;
font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
background:var(--vibeui-combobox-021-active);color:var(--vibeui-combobox-021-accent);
}
[data-vibeui-block="combobox-021"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-combobox-021-muted)}
[data-vibeui-block="combobox-021"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-021-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-021"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-021"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Дизайн",
  "Фронтенд",
  "Бэкенд",
  "Аналитика",
  "Поддержка",
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
 * Combobox с созданием значения первой строкой: Enter по умолчанию заводит
 * новую метку из запроса, существующее совпадение нужно выбирать осознанно.
 */
export function Combobox021({
  label = "Метка задачи",
  placeholder = "Найти или создать",
  options = DEFAULT_OPTIONS,
  createLabel = "Создать",
  newBadge = "новая",
  emptyLabel = "Список пуст",
  defaultValue = "",
  onSelect,
  selectedText = "Выбрано: {value}",
  createHintText = "Enter создаст новое значение",
  noValueText = "Ничего не выбрано",
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox021Props) {
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

  const rows = canCreate ? [needle, ...matches] : matches
  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (index: number) => {
    const option = rows[index]
    if (!option) return
    const isNew = canCreate && index === 0

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
      <style href="vibeui-combobox-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-021"
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
          placeholder={value || placeholder}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            rows[active] !== undefined ? `${id}-option-${active}` : undefined
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
          hidden={!open}
          aria-label={label}
          data-part="list"
        >
          {rows.map((option, index) => {
            const isCreateRow = canCreate && index === 0

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
                    <span data-part="spark" aria-hidden="true">
                      ✦
                    </span>
                    {createLabel} «{option}»
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
          {rows.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
        <p data-part="hint" aria-live="polite">
          {value
            ? selectedText.replace("{value}", value)
            : canCreate
              ? createHintText
              : noValueText}
        </p>
      </div>
    </>
  )
}
