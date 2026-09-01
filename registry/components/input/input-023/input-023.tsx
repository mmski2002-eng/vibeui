"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Input023Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  storageKey?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: подсказки из истории набора уже есть (input-012) — они
// фильтруются по вводу и живут только в состоянии компонента. Здесь другая
// история — то, что реально отправляли, а не то, что печатали: запись
// попадает в список по Enter, хранится в localStorage между сеансами,
// список открывается только стрелкой вниз и показывает последние значения
// целиком, без фильтра по набранному тексту, а очищается сразу весь одной
// кнопкой, а не по одной записи.
const STYLES = `
:where([data-vibeui-block="input-023"]){
--vibeui-input-023-surface:oklch(1 0 0);
--vibeui-input-023-shell:oklch(0.91 0.006 265);
--vibeui-input-023-fg:oklch(0.23 0.014 265);
--vibeui-input-023-muted:oklch(0.56 0.014 265);
--vibeui-input-023-field:oklch(0.985 0.002 265);
--vibeui-input-023-border:oklch(0.88 0.008 265);
--vibeui-input-023-accent:oklch(0.55 0.17 265);
--vibeui-input-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-023"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-023-surface);
border:1px solid var(--vibeui-input-023-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-023-font);color:var(--vibeui-input-023-fg);
}
[data-vibeui-block="input-023"] *{box-sizing:border-box}
[data-vibeui-block="input-023"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-023"] [data-part="shell"]{position:relative}
[data-vibeui-block="input-023"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-023-field);
border:1px solid var(--vibeui-input-023-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-023"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-023-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-023-accent) 18%,transparent);
}
[data-vibeui-block="input-023"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-023"] input:focus{outline:none}
[data-vibeui-block="input-023"] [data-part="list"]{
position:absolute;z-index:2;top:calc(100% + 0.375rem);left:0;right:0;
margin:0;padding:0.25rem;display:flex;flex-direction:column;
background:var(--vibeui-input-023-surface);
border:1px solid var(--vibeui-input-023-border);border-radius:0.75rem;
box-shadow:0 14px 30px -14px color-mix(in oklab,var(--vibeui-input-023-fg) 45%,transparent);
}
[data-vibeui-block="input-023"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;
text-align:left;cursor:pointer;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="input-023"] [data-part="option"][data-active="1"]{
background:color-mix(in oklab,var(--vibeui-input-023-accent) 12%,transparent);
}
[data-vibeui-block="input-023"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-input-023-accent);outline-offset:-2px;
}
[data-vibeui-block="input-023"] [data-part="option"] svg{
flex:none;width:0.875rem;height:0.875rem;display:block;color:var(--vibeui-input-023-muted);
}
[data-vibeui-block="input-023"] [data-part="clear"]{
appearance:none;cursor:pointer;width:100%;margin-top:0.125rem;
padding:0.375rem 0.5rem;border:0;border-top:1px solid var(--vibeui-input-023-border);
border-radius:0;background:none;color:var(--vibeui-input-023-muted);
font:inherit;font-size:0.75rem;font-weight:600;text-align:left;
}
[data-vibeui-block="input-023"] [data-part="clear"]:hover{color:var(--vibeui-input-023-fg)}
[data-vibeui-block="input-023"] [data-part="clear"]:focus-visible{
outline:2px solid var(--vibeui-input-023-accent);outline-offset:-2px;
}
[data-vibeui-block="input-023"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-023-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-023"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле с историей отправленных значений: сохраняется в localStorage по
 * Enter, открывается стрелкой вниз, показывает последние значения целиком
 * и чистится одной кнопкой. Один файл, ноль зависимостей.
 */
export function Input023({
  label = "Тема письма",
  placeholder = "О чём письмо",
  defaultValue = "",
  storageKey = "vibeui-input-023-history",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input023Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  // Ленивый инициализатор, а не эффект: на сервере window нет, поэтому
  // чтение уходит в ветку typeof window — а на видимую часть первого рендера
  // это не влияет, список раскрывается только по действию пользователя.
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return []

    try {
      const raw = window.localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      // localStorage бывает недоступен (приватный режим, запрет доступа) —
      // тогда история просто не показывается.
      return []
    }
  })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-input-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  const remember = (entry: string) => {
    const trimmed = entry.trim()
    if (!trimmed) return

    setHistory((was) => {
      const next = [trimmed, ...was.filter((item) => item !== trimmed)].slice(
        0,
        8,
      )
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // см. выше
      }
      return next
    })
  }

  const apply = (entry: string) => {
    setValue(entry)
    setOpen(false)
    onChange?.(entry)
    field.current?.focus()
  }

  const clearHistory = () => {
    setHistory([])
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // см. выше
    }
    field.current?.focus()
  }

  const shown = open && history.length > 0

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!shown) {
      if (event.key === "ArrowDown" && history.length > 0) {
        event.preventDefault()
        setActive(0)
        setOpen(true)
      } else if (event.key === "Enter") {
        remember(value)
      }
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => (index + 1) % history.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => (index - 1 + history.length) % history.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      apply(history[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <>
      <style href="vibeui-input-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-023"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div
          data-part="shell"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpen(false)
          }}
        >
          <div data-part="frame">
            <input
              ref={field}
              id={id}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-expanded={shown}
              aria-controls={`${id}-list`}
              aria-describedby={`${id}-note`}
              placeholder={placeholder}
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                onChange?.(event.target.value)
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          {shown ? (
            <div
              data-part="list"
              id={`${id}-list`}
              role="listbox"
              aria-label="Последние значения"
            >
              {history.map((entry, index) => (
                <button
                  key={entry}
                  type="button"
                  data-part="option"
                  role="option"
                  data-active={index === active ? "1" : "0"}
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => apply(entry)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
                  </svg>
                  {entry}
                </button>
              ))}
              <button type="button" data-part="clear" onClick={clearHistory}>
                Очистить историю
              </button>
            </div>
          ) : null}
        </div>
        <p data-part="note" id={`${id}-note`}>
          Стрелка вниз — последние значения, Enter сохраняет и подставляет
          выбранное.
        </p>
      </div>
    </>
  )
}
