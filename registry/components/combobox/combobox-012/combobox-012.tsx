"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  FormEvent,
  KeyboardEvent,
} from "react"

export type Combobox012Option = {
  value: string
  label: string
}

export type Combobox012Props = Omit<
  ComponentProps<"form">,
  "children" | "onSubmit"
> & {
  label?: string
  name?: string
  placeholder?: string
  options?: Combobox012Option[]
  submitLabel?: string
  /** Строка отправленного. {name} — имя поля, {value} — ушедший код. */
  payloadText?: string
  /** Строка под формой, пока ничего не отправлено. */
  idleText?: string
  onSubmitValue?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: рисованный список не умеет отправляться сам. Значение
// живёт в скрытом input с настоящим name, поэтому форма уходит обычным
// submit и работает с FormData, Server Action и без JS-обвязки. Человек
// видит подпись, а на сервер уезжает код — это разные строки, и путать их
// нельзя.
const STYLES = `
:where([data-vibeui-block="combobox-012"]){
--vibeui-combobox-012-bg:transparent;
--vibeui-combobox-012-fg:light-dark(oklch(0.23 0.02 130),oklch(0.94 0.008 130));
--vibeui-combobox-012-muted:color-mix(in oklab,var(--vibeui-combobox-012-fg) 68%,transparent);
--vibeui-combobox-012-border:light-dark(oklch(0.9 0.01 130),oklch(0.38 0.016 130));
--vibeui-combobox-012-field:light-dark(oklch(0.985 0.005 130),oklch(0.3 0.014 130));
--vibeui-combobox-012-active:light-dark(oklch(0.95 0 0),oklch(0.37 0 0));
--vibeui-combobox-012-accent:light-dark(oklch(0.27 0 0),oklch(0.905 0 0));
--vibeui-combobox-012-onaccent:light-dark(oklch(1 0 0),oklch(0.2 0.03 130));
--vibeui-combobox-012-radius:0.625rem;
--vibeui-combobox-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-combobox-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-012"]{color-scheme:dark}
[data-vibeui-block="combobox-012"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-012-bg);
border:1px solid var(--vibeui-combobox-012-border);
border-radius:calc(var(--vibeui-combobox-012-radius) + 0.25rem);
color:var(--vibeui-combobox-012-fg);
font-family:var(--vibeui-combobox-012-font);
}
[data-vibeui-block="combobox-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-012"] input[type="text"]{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-012-border);
border-radius:var(--vibeui-combobox-012-radius);
background:var(--vibeui-combobox-012-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-012"] input[type="text"]::placeholder{color:var(--vibeui-combobox-012-muted)}
[data-vibeui-block="combobox-012"] input[type="text"]:focus-visible{outline:2px solid var(--vibeui-combobox-012-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-012"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:9rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-012-border);
border-radius:var(--vibeui-combobox-012-radius);
}
[data-vibeui-block="combobox-012"] [data-part="option"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-012"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-012-active)}
[data-vibeui-block="combobox-012"] [data-part="option"][aria-selected="true"]{font-weight:650}
[data-vibeui-block="combobox-012"] [data-part="code"]{
font-family:var(--vibeui-combobox-012-mono);font-size:0.7rem;
color:var(--vibeui-combobox-012-muted);
}
[data-vibeui-block="combobox-012"] [data-part="row"]{display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="combobox-012"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.25rem 1rem;border-radius:var(--vibeui-combobox-012-radius);
background:var(--vibeui-combobox-012-accent);color:oklch(from var(--vibeui-combobox-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="combobox-012"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="combobox-012"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-combobox-012-accent);outline-offset:2px}
[data-vibeui-block="combobox-012"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="combobox-012"] [data-part="payload"]{
margin:0;padding:0.4rem 0.55rem;border-radius:0.5rem;
background:var(--vibeui-combobox-012-field);
border:1px dashed var(--vibeui-combobox-012-border);
font-family:var(--vibeui-combobox-012-mono);font-size:0.72rem;
color:var(--vibeui-combobox-012-muted);
overflow-x:auto;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-012"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-012"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_OPTIONS: Combobox012Option[] = [
  { value: "dhl-express", label: "DHL Express" },
  { value: "cdek-pvz", label: "СДЭК до пункта выдачи" },
  { value: "cdek-door", label: "СДЭК до двери" },
  { value: "post-ru", label: "Почта России" },
  { value: "pickup", label: "Самовывоз со склада" },
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
 * Combobox в форме: видимая подпись и скрытый input с настоящим name,
 * поэтому форма отправляется обычным submit и попадает в FormData.
 */
export function Combobox012({
  label = "Способ доставки",
  name = "delivery",
  placeholder = "Найти способ",
  options = DEFAULT_OPTIONS,
  submitLabel = "Отправить",
  payloadText = "FormData: {name}={value}",
  idleText = "Форма ещё не отправлена",
  onSubmitValue,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox012Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Combobox012Option | null>(null)
  const [active, setActive] = useState(0)
  const [sent, setSent] = useState("")
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(needle),
    )
  }, [options, query])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: Combobox012Option) => {
    setSelected(option)
    setQuery("")
    setActive(0)
    setSent("")
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
    const data = new FormData(event.currentTarget)
    const value = String(data.get(name) ?? "")
    setSent(value)
    onSubmitValue?.(value)
  }

  return (
    <>
      <style href="vibeui-combobox-012" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-012"
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
        onSubmit={onSubmit}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input type="hidden" name={name} value={selected?.value ?? ""} />
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={selected?.label ?? placeholder}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
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
          hidden={!open}
          aria-label={label}
          data-part="list"
        >
          {matches.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={option.value === selected?.value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(option)
              }}
            >
              {option.label}
              <span data-part="code">{option.value}</span>
            </li>
          ))}
        </ul>
        <div data-part="row">
          <button type="submit" data-part="submit" disabled={!selected}>
            {submitLabel}
          </button>
          <span data-part="code">
            {name}={selected?.value || "—"}
          </span>
        </div>
        <p data-part="payload" aria-live="polite">
          {sent
            ? payloadText.replace("{name}", name).replace("{value}", sent)
            : idleText}
        </p>
      </form>
    </>
  )
}
