"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Input012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  history?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: подсказки берутся из того, что человек уже вводил, и
// каждую можно убрать из истории — это главное отличие от списка «популярных
// значений», которым подстановку обычно подменяют. Список — combobox: поле
// остаётся полем, стрелки ходят по подсказкам, Enter подставляет активную,
// Escape закрывает список, не стирая набранное.
const STYLES = `
:where([data-vibeui-block="input-012"]){
--vibeui-input-012-surface:oklch(1 0 0);
--vibeui-input-012-shell:oklch(0.91 0.006 265);
--vibeui-input-012-fg:oklch(0.23 0.014 265);
--vibeui-input-012-muted:oklch(0.56 0.014 265);
--vibeui-input-012-field:oklch(0.985 0.002 265);
--vibeui-input-012-border:oklch(0.88 0.008 265);
--vibeui-input-012-accent:oklch(0.55 0.17 265);
--vibeui-input-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-012"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-012-surface);
border:1px solid var(--vibeui-input-012-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-012-font);color:var(--vibeui-input-012-fg);
}
[data-vibeui-block="input-012"] *{box-sizing:border-box}
[data-vibeui-block="input-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-012"] [data-part="shell"]{position:relative}
[data-vibeui-block="input-012"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-012-field);
border:1px solid var(--vibeui-input-012-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-012"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-012-accent) 18%,transparent);
}
[data-vibeui-block="input-012"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-012"] input:focus{outline:none}
[data-vibeui-block="input-012"] [data-part="list"]{
position:absolute;z-index:2;top:calc(100% + 0.375rem);left:0;right:0;
margin:0;padding:0.25rem;display:flex;flex-direction:column;
background:var(--vibeui-input-012-surface);
border:1px solid var(--vibeui-input-012-border);border-radius:0.75rem;
box-shadow:0 14px 30px -14px color-mix(in oklab,var(--vibeui-input-012-fg) 45%,transparent);
}
[data-vibeui-block="input-012"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;border-radius:0.5rem;
}
[data-vibeui-block="input-012"] [data-part="row"][data-active="1"]{
background:color-mix(in oklab,var(--vibeui-input-012-accent) 12%,transparent);
}
[data-vibeui-block="input-012"] [data-part="pick"]{
flex:1;min-width:0;display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border:0;border-radius:0.5rem;background:none;
color:inherit;font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="input-012"] [data-part="pick"] svg{
flex:none;width:0.875rem;height:0.875rem;display:block;color:var(--vibeui-input-012-muted);
}
[data-vibeui-block="input-012"] [data-part="pick"] mark{
background:none;color:var(--vibeui-input-012-accent);font-weight:650;
}
/* Забыть значение — часть подстановки: без этого история копит мусор,
   который нечем убрать. */
[data-vibeui-block="input-012"] [data-part="drop"]{
appearance:none;flex:none;cursor:pointer;
width:1.5rem;height:1.5rem;margin-right:0.25rem;
display:grid;place-items:center;border:0;border-radius:999px;
background:transparent;color:var(--vibeui-input-012-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-012"] [data-part="drop"]:hover{
background:color-mix(in oklab,var(--vibeui-input-012-fg) 10%,transparent);
color:var(--vibeui-input-012-fg);
}
[data-vibeui-block="input-012"] [data-part="drop"]:focus-visible,
[data-vibeui-block="input-012"] [data-part="pick"]:focus-visible{
outline:2px solid var(--vibeui-input-012-accent);outline-offset:-2px;
}
[data-vibeui-block="input-012"] [data-part="drop"] svg{width:0.75rem;height:0.75rem;display:block}
[data-vibeui-block="input-012"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-012-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-012"] *{animation:none!important;transition:none!important}}
`

const HISTORY = [
  "Москва, Тверская 12",
  "Москва, Ленинский проспект 90",
  "Санкт-Петербург, Невский 28",
  "Казань, Баумана 44",
]

function mark(text: string, query: string) {
  const at = text.toLowerCase().indexOf(query.toLowerCase())
  if (!query || at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  )
}

/**
 * Поле с автоподстановкой из истории ввода: подсказку можно выбрать или забыть.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input012({
  label = "Адрес доставки",
  history = HISTORY,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input012Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState("Мос")
  const [saved, setSaved] = useState(history)
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-input-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  const found = saved.filter((entry) =>
    entry.toLowerCase().includes(value.trim().toLowerCase()),
  )
  const shown = open && found.length > 0

  const apply = (entry: string) => {
    setValue(entry)
    setOpen(false)
    onChange?.(entry)
    field.current?.focus()
  }

  const forget = (entry: string) => {
    setSaved((was) => was.filter((item) => item !== entry))
    setActive(0)
    field.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!shown) {
      if (event.key === "ArrowDown") setOpen(true)
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => (index + 1) % found.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => (index - 1 + found.length) % found.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      apply(found[Math.min(active, found.length - 1)])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <>
      <style href="vibeui-input-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-012"
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
              placeholder="Город, улица, дом"
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setActive(0)
                setOpen(true)
                onChange?.(event.target.value)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
            />
          </div>
          {shown ? (
            <div
              data-part="list"
              id={`${id}-list`}
              role="listbox"
              aria-label="Из истории"
            >
              {found.map((entry, index) => (
                <div
                  key={entry}
                  data-part="row"
                  data-active={index === active ? "1" : "0"}
                >
                  <button
                    type="button"
                    data-part="pick"
                    role="option"
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
                    {mark(entry, value.trim())}
                  </button>
                  <button
                    type="button"
                    data-part="drop"
                    aria-label={`Забыть «${entry}»`}
                    onClick={() => forget(entry)}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m3 3 6 6M9 3l-6 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <p data-part="note" id={`${id}-note`}>
          Стрелки — по подсказкам, Enter — подставить, крестик — забыть
          значение.
        </p>
      </div>
    </>
  )
}
