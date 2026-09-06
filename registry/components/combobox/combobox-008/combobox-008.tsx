"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox008Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  suggestions?: string[]
  loadingLabel?: string
  emptyLabel?: string
  /** Пояснение под сообщением о пустой выдаче. */
  emptyHint?: string
  delay?: number
  defaultQuery?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: два состояния, которые обычно забывают. Пока список едет,
// на его месте стоят полосы-заглушки той же высоты — панель не прыгает.
// Когда не нашлось ничего, пусто не остаётся пустым: под сообщением лежат
// готовые запросы, по которым точно что-то есть.
const STYLES = `
:where([data-vibeui-block="combobox-008"]){
--vibeui-combobox-008-bg:transparent;
--vibeui-combobox-008-fg:light-dark(oklch(0.23 0.02 350),oklch(0.94 0.008 350));
--vibeui-combobox-008-muted:color-mix(in oklab,var(--vibeui-combobox-008-fg) 68%,transparent);
--vibeui-combobox-008-border:light-dark(oklch(0.9 0.01 350),oklch(0.38 0.016 350));
--vibeui-combobox-008-field:light-dark(oklch(0.985 0.005 350),oklch(0.3 0.014 350));
--vibeui-combobox-008-active:light-dark(oklch(0.95 0.035 350),oklch(0.37 0.04 350));
--vibeui-combobox-008-accent:light-dark(oklch(0.55 0.17 350),oklch(0.76 0.15 350));
--vibeui-combobox-008-radius:0.625rem;
--vibeui-combobox-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-008"]{color-scheme:dark}
[data-vibeui-block="combobox-008"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-008-bg);
border:1px solid var(--vibeui-combobox-008-border);
border-radius:calc(var(--vibeui-combobox-008-radius) + 0.25rem);
color:var(--vibeui-combobox-008-fg);
font-family:var(--vibeui-combobox-008-font);
}
[data-vibeui-block="combobox-008"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-008"] [data-part="field"]{position:relative;display:flex;align-items:center}
[data-vibeui-block="combobox-008"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 2.25rem 0 0.75rem;
border:1px solid var(--vibeui-combobox-008-border);
border-radius:var(--vibeui-combobox-008-radius);
background:var(--vibeui-combobox-008-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-008"] input::placeholder{color:var(--vibeui-combobox-008-muted)}
[data-vibeui-block="combobox-008"] input:focus-visible{outline:2px solid var(--vibeui-combobox-008-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-008"] [data-part="spinner"]{
position:absolute;right:0.75rem;width:0.9rem;height:0.9rem;border-radius:999px;
border:2px solid var(--vibeui-combobox-008-active);
border-top-color:var(--vibeui-combobox-008-accent);
animation:vibeui-combobox-008-spin .7s linear infinite;
}
@keyframes vibeui-combobox-008-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="combobox-008"] [data-part="panel"]{
padding:0.25rem;min-height:6.5rem;
border:1px solid var(--vibeui-combobox-008-border);
border-radius:var(--vibeui-combobox-008-radius);
}
[data-vibeui-block="combobox-008"] [data-part="list"]{margin:0;padding:0;list-style:none;max-height:9rem;overflow-y:auto}
[data-vibeui-block="combobox-008"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-008"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-008-active)}
[data-vibeui-block="combobox-008"] [data-part="skeleton"]{display:flex;flex-direction:column;gap:0.4rem;padding:0.35rem 0.5rem}
[data-vibeui-block="combobox-008"] [data-part="skeleton"] span{
height:0.8rem;border-radius:999px;
background:linear-gradient(90deg,var(--vibeui-combobox-008-active),var(--vibeui-combobox-008-field),var(--vibeui-combobox-008-active));
background-size:200% 100%;
animation:vibeui-combobox-008-shine 1.2s ease-in-out infinite;
}
[data-vibeui-block="combobox-008"] [data-part="skeleton"] span:nth-child(2){width:78%}
[data-vibeui-block="combobox-008"] [data-part="skeleton"] span:nth-child(3){width:56%}
@keyframes vibeui-combobox-008-shine{to{background-position:-200% 0}}
[data-vibeui-block="combobox-008"] [data-part="empty"]{display:flex;flex-direction:column;gap:0.45rem;padding:0.5rem}
[data-vibeui-block="combobox-008"] [data-part="emptytitle"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-008"] [data-part="emptyhint"]{margin:0;font-size:0.75rem;color:var(--vibeui-combobox-008-muted)}
[data-vibeui-block="combobox-008"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:0.3rem}
[data-vibeui-block="combobox-008"] [data-part="chip"]{
appearance:none;cursor:pointer;height:1.6rem;padding:0 0.6rem;border-radius:999px;
border:1px solid var(--vibeui-combobox-008-border);
background:var(--vibeui-combobox-008-field);
color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="combobox-008"] [data-part="chip"]:hover{background:var(--vibeui-combobox-008-active)}
[data-vibeui-block="combobox-008"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-combobox-008-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-008"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-008"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS = [
  "Прага",
  "Прато",
  "Провиденс",
  "Пуэбла",
  "Портленд",
  "Пусан",
  "Познань",
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
 * Combobox с состоянием загрузки и содержательной пустотой: полосы-заглушки
 * вместо прыгающей панели, готовые запросы вместо «ничего не найдено».
 */
export function Combobox008({
  label = "Город",
  placeholder = "Начните вводить",
  options = DEFAULT_OPTIONS,
  suggestions = ["Прага", "Пусан", "Портленд"],
  loadingLabel = "Ищем совпадения",
  emptyLabel = "Ничего не нашлось",
  emptyHint = "Проверьте раскладку или попробуйте один из запросов ниже.",
  delay = 600,
  defaultQuery = "",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox008Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const [ready, setReady] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  // Ожидание не хранится состоянием, а выводится: пока показанный запрос
  // не догнал набранный, список считается едущим. Эффект только ставит
  // таймер, а setState живёт в его колбэке — синхронный setState в теле
  // эффекта устроил бы каскад рендеров.
  const loading = query.trim() !== "" && query !== ready

  useEffect(() => {
    if (query === ready) return

    const timer = setTimeout(() => setReady(query), query.trim() ? delay : 0)

    return () => clearTimeout(timer)
  }, [delay, query, ready])

  const rows = useMemo(() => {
    const needle = ready.trim().toLowerCase()
    if (!needle) return []
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, ready])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery(option)
    setReady(option)
    onSelect?.(option)
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
      if (rows[active]) commit(rows[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
    }
  }

  const showEmpty = !loading && query.trim() !== "" && rows.length === 0

  return (
    <>
      <style href="vibeui-combobox-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-008"
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
        <div data-part="field">
          <input
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={placeholder}
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-busy={loading}
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
          {loading ? <span data-part="spinner" aria-hidden="true" /> : null}
        </div>
        <div data-part="panel">
          {loading ? (
            <div data-part="skeleton" role="status" aria-label={loadingLabel}>
              <span />
              <span />
              <span />
            </div>
          ) : null}
          {showEmpty ? (
            <div data-part="empty">
              <strong data-part="emptytitle">{emptyLabel}</strong>
              <p data-part="emptyhint">{emptyHint}</p>
              <div data-part="chips">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    data-part="chip"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            data-part="list"
            hidden={!open || loading || showEmpty}
          >
            {rows.map((option, index) => (
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
        </div>
      </div>
    </>
  )
}
