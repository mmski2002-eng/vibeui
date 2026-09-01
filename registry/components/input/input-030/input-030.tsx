"use client"

import { useId, useMemo, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Input030Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  addresses?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: история отправленных значений уже есть (input-023), но
// там список не фильтруется — показывает всё подряд. Здесь наоборот: список
// живёт под полем, пока идёт набор, и на каждый символ сужается до совпадений
// по подстроке, а совпавший кусок в каждом варианте подсвечен жирным — так
// видно, почему адрес попал в подсказки, а не только что попал.
const STYLES = `
:where([data-vibeui-block="input-030"]){
--vibeui-input-030-surface:oklch(1 0 0);
--vibeui-input-030-shell:oklch(0.91 0.006 265);
--vibeui-input-030-fg:oklch(0.23 0.014 265);
--vibeui-input-030-muted:oklch(0.56 0.014 265);
--vibeui-input-030-field:oklch(0.985 0.002 265);
--vibeui-input-030-border:oklch(0.88 0.008 265);
--vibeui-input-030-accent:oklch(0.55 0.15 145);
--vibeui-input-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-030"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-030-surface);
border:1px solid var(--vibeui-input-030-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-030-font);color:var(--vibeui-input-030-fg);
}
[data-vibeui-block="input-030"] *{box-sizing:border-box}
[data-vibeui-block="input-030"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-030"] [data-part="shell"]{position:relative}
[data-vibeui-block="input-030"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-030-field);
border:1px solid var(--vibeui-input-030-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-030"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-030-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-030-accent) 18%,transparent);
}
[data-vibeui-block="input-030"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-030"] input:focus{outline:none}
[data-vibeui-block="input-030"] [data-part="list"]{
position:absolute;z-index:2;top:calc(100% + 0.375rem);left:0;right:0;
margin:0;padding:0.25rem;display:flex;flex-direction:column;
background:var(--vibeui-input-030-surface);
border:1px solid var(--vibeui-input-030-border);border-radius:0.75rem;
box-shadow:0 14px 30px -14px color-mix(in oklab,var(--vibeui-input-030-fg) 45%,transparent);
}
[data-vibeui-block="input-030"] [data-part="option"]{
display:block;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;line-height:1.35;
text-align:left;cursor:pointer;
}
[data-vibeui-block="input-030"] [data-part="option"] b{
color:var(--vibeui-input-030-accent);font-weight:700;
}
[data-vibeui-block="input-030"] [data-part="option"][data-active="1"]{
background:color-mix(in oklab,var(--vibeui-input-030-accent) 12%,transparent);
}
[data-vibeui-block="input-030"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-input-030-accent);outline-offset:-2px;
}
[data-vibeui-block="input-030"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-030-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-030"] *{animation:none!important;transition:none!important}}
`

const ADDRESSES = [
  "г. Москва, ул. Тверская, д. 1",
  "г. Москва, ул. Тверская, д. 12, стр. 2",
  "г. Москва, Ленинский проспект, д. 90",
  "г. Санкт-Петербург, Невский проспект, д. 28",
  "г. Санкт-Петербург, ул. Марата, д. 15",
  "г. Казань, ул. Баумана, д. 5",
  "г. Екатеринбург, ул. Малышева, д. 51",
  "г. Новосибирск, Красный проспект, д. 22",
]

function highlight(text: string, query: string) {
  const at = text.toLowerCase().indexOf(query.toLowerCase())
  if (at < 0) return text

  return (
    <>
      {text.slice(0, at)}
      <b>{text.slice(at, at + query.length)}</b>
      {text.slice(at + query.length)}
    </>
  )
}

/**
 * Поле адреса с подсказками под полем: список сужается на каждый символ по
 * совпадению подстроки, совпавший кусок подсвечен жирным. Один файл, ноль
 * зависимостей.
 */
export function Input030({
  label = "Адрес доставки",
  placeholder = "Начните вводить город или улицу",
  defaultValue = "",
  addresses = ADDRESSES,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input030Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-input-030-accent": accent } : null),
    ...style,
  } as CSSProperties

  const query = value.trim()
  const matches = useMemo(() => {
    if (query.length < 2) return []
    const needle = query.toLowerCase()
    return addresses
      .filter((address) => address.toLowerCase().includes(needle))
      .slice(0, 5)
  }, [addresses, query])

  const shown = open && matches.length > 0

  const commit = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const apply = (address: string) => {
    commit(address)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!shown) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => (index + 1) % matches.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => (index - 1 + matches.length) % matches.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      apply(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <>
      <style href="vibeui-input-030" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-030"
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
              id={id}
              type="text"
              role="combobox"
              autoComplete="off"
              placeholder={placeholder}
              aria-expanded={shown}
              aria-controls={`${id}-list`}
              aria-describedby={`${id}-note`}
              value={value}
              onChange={(event) => {
                commit(event.target.value)
                setActive(0)
                setOpen(true)
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          {shown ? (
            <div
              data-part="list"
              id={`${id}-list`}
              role="listbox"
              aria-label="Подходящие адреса"
            >
              {matches.map((address, index) => (
                <button
                  key={address}
                  type="button"
                  data-part="option"
                  role="option"
                  data-active={index === active ? "1" : "0"}
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => apply(address)}
                >
                  {highlight(address, query)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <p data-part="note" id={`${id}-note`}>
          От двух символов — подсказки ниже по мере ввода.
        </p>
      </div>
    </>
  )
}
