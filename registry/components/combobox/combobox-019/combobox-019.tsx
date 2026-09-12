"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox019Option = {
  name: string
  locked?: boolean
  reason?: string
}

export type Combobox019Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: Combobox019Option[]
  defaultValue?: string
  requestLabel?: string
  onSelect?: (value: string) => void
  onRequest?: (value: string) => void
  /** Озвучка закрытого варианта; {item} — название, {reason} — причина. */
  lockedText?: string
  /** Озвучка кнопки запроса; {action} — requestLabel, {item} — название. */
  requestAriaText?: string
  /** Подпись на месте кнопки после отправленного запроса. */
  sentText?: string
  /** Подпись строки итога перед выбранным значением. */
  summaryLabel?: string
  /** Что стоит в итоге, пока ничего не выбрано. */
  emptyValueText?: string
  /** Хвост строки итога; {count} — число закрытых вариантов. */
  lockedCountText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вариант, на который нет прав, нельзя ни прятать, ни
// молча гасить. Спрятанный вариант заставляет человека искать несуществующее,
// а погашенный без объяснения — писать в поддержку. Поэтому строка остаётся
// в списке, рядом стоит причина и кнопка «Запросить доступ», а сам выбор
// заблокирован нативным disabled.
const STYLES = `
:where([data-vibeui-block="combobox-019"]){
--vibeui-combobox-019-bg:transparent;
--vibeui-combobox-019-fg:light-dark(oklch(0.22 0.014 320),oklch(0.94 0.006 320));
--vibeui-combobox-019-muted:color-mix(in oklab,var(--vibeui-combobox-019-fg) 68%,transparent);
--vibeui-combobox-019-faint:light-dark(oklch(0.72 0.01 320),oklch(0.52 0.012 320));
--vibeui-combobox-019-border:light-dark(oklch(0.9 0.008 320),oklch(0.35 0.012 320));
--vibeui-combobox-019-field:light-dark(oklch(0.985 0.004 320),oklch(0.27 0.012 320));
--vibeui-combobox-019-soft:light-dark(oklch(0.96 0.008 320),oklch(0.31 0.014 320));
--vibeui-combobox-019-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-combobox-019-accentsoft:light-dark(oklch(0.94 0 0),oklch(0.36 0 0));
--vibeui-combobox-019-radius:0.625rem;
--vibeui-combobox-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-019"]{color-scheme:dark}
[data-vibeui-block="combobox-019"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-019-bg);
border:1px solid var(--vibeui-combobox-019-border);
border-radius:calc(var(--vibeui-combobox-019-radius) + 0.25rem);
color:var(--vibeui-combobox-019-fg);
font-family:var(--vibeui-combobox-019-font);
}
[data-vibeui-block="combobox-019"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-019"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-019-border);
border-radius:var(--vibeui-combobox-019-radius);
background:var(--vibeui-combobox-019-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-019"] input::placeholder{color:var(--vibeui-combobox-019-muted)}
[data-vibeui-block="combobox-019"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-019"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.15rem;
max-height:14rem;overflow:auto;
border:1px solid var(--vibeui-combobox-019-border);
border-radius:var(--vibeui-combobox-019-radius);
}
[data-vibeui-block="combobox-019"] [data-part="row"]{
display:flex;align-items:center;gap:0.3rem;
}
[data-vibeui-block="combobox-019"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;flex:1 1 auto;min-width:0;
display:flex;flex-direction:column;gap:0.1rem;
box-sizing:border-box;padding:0.35rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-019"] [data-part="option"]:hover:not(:disabled){background:var(--vibeui-combobox-019-soft)}
[data-vibeui-block="combobox-019"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-019"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-019-accentsoft);
}
[data-vibeui-block="combobox-019"] [data-part="option"]:disabled{cursor:not-allowed}
[data-vibeui-block="combobox-019"] [data-part="name"]{
display:flex;align-items:center;gap:0.3rem;
font-size:0.875rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="option"]:disabled [data-part="name"]{color:var(--vibeui-combobox-019-faint)}
[data-vibeui-block="combobox-019"] [data-part="reason"]{
font-size:0.7rem;color:var(--vibeui-combobox-019-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="lock"]{flex:none;font-size:0.75rem}
[data-vibeui-block="combobox-019"] [data-part="ask"]{
appearance:none;cursor:pointer;font:inherit;flex:none;
padding:0.25rem 0.55rem;border-radius:999px;
border:1px solid var(--vibeui-combobox-019-border);
background:transparent;color:var(--vibeui-combobox-019-accent);
font-size:0.7rem;font-weight:700;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-019"] [data-part="ask"]:hover{background:var(--vibeui-combobox-019-accentsoft)}
[data-vibeui-block="combobox-019"] [data-part="ask"]:focus-visible{
outline:2px solid var(--vibeui-combobox-019-accent);outline-offset:2px;
}
[data-vibeui-block="combobox-019"] [data-part="sent"]{
flex:none;font-size:0.7rem;font-weight:700;color:var(--vibeui-combobox-019-muted);white-space:nowrap;
}
[data-vibeui-block="combobox-019"] [data-part="foot"]{
margin:0;font-size:0.78rem;color:var(--vibeui-combobox-019-muted);
}
[data-vibeui-block="combobox-019"] [data-part="foot"] b{color:var(--vibeui-combobox-019-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-019"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-019"] [role="listbox"][hidden]{display:none}

`

const SPACES: Combobox019Option[] = [
  { name: "Продуктовая аналитика" },
  { name: "Маркетинг" },
  {
    name: "Финансы и выручка",
    locked: true,
    reason: "нужен доступ финансового отдела",
  },
  { name: "Поддержка клиентов" },
  {
    name: "Персональные данные",
    locked: true,
    reason: "требуется согласование с безопасностью",
  },
  { name: "Логистика" },
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
 * Выбор, где закрытые варианты видны, объяснены и допускают запрос доступа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox019({
  label = "Рабочее пространство",
  placeholder = "Найти пространство",
  options = SPACES,
  defaultValue = "Маркетинг",
  requestLabel = "Запросить",
  onSelect,
  onRequest,
  lockedText = "{item}: нет доступа, {reason}",
  requestAriaText = "{action} доступ к «{item}»",
  sentText = "Запрошено",
  summaryLabel = "Выбрано",
  emptyValueText = "ничего",
  lockedCountText = "закрыто вариантов: {count}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox019Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [asked, setAsked] = useState<string[]>([])

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) =>
      option.name.toLowerCase().includes(needle),
    )
  }, [query, options])

  const locked = matches.filter((option) => option.locked).length

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
    ...(accent ? { "--vibeui-combobox-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
        data-vibeui-block="combobox-019"
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
            <li key={option.name} role="none">
              <span data-part="row" role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={option.name === value}
                  disabled={option.locked}
                  aria-label={
                    option.locked
                      ? lockedText
                          .replace("{item}", option.name)
                          .replace("{reason}", option.reason ?? "")
                      : option.name
                  }
                  onClick={() => {
                    setValue(option.name)
                    onSelect?.(option.name)
                  }}
                >
                  <span data-part="name">
                    {option.locked ? (
                      <span data-part="lock" aria-hidden="true">
                        🔒
                      </span>
                    ) : null}
                    {option.name}
                  </span>
                  {option.locked && option.reason ? (
                    <span data-part="reason">{option.reason}</span>
                  ) : null}
                </button>
                {option.locked ? (
                  asked.includes(option.name) ? (
                    <span data-part="sent">{sentText}</span>
                  ) : (
                    <button
                      type="button"
                      data-part="ask"
                      aria-label={requestAriaText
                        .replace("{action}", requestLabel)
                        .replace("{item}", option.name)}
                      onClick={() => {
                        setAsked([...asked, option.name])
                        onRequest?.(option.name)
                      }}
                    >
                      {requestLabel}
                    </button>
                  )
                ) : null}
              </span>
            </li>
          ))}
        </ul>
        <p data-part="foot" aria-live="polite">
          {summaryLabel}: <b>{value || emptyValueText}</b>
          {locked > 0
            ? ` · ${lockedCountText.replace("{count}", String(locked))}`
            : ""}
        </p>
      </div>
    </>
  )
}
