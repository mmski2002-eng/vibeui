"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox025Option = {
  name: string
  description: string
}

export type Combobox025Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: Combobox025Option[]
  defaultValue?: string
  emptyLabel?: string
  /** Подпись панели предпросмотра для скринридера. */
  previewLabel?: string
  /** Текст в панели, пока ни одна строка не активна. */
  previewHint?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор и чтение описания — два разных действия, и они не
// должны конкурировать за одно и то же место. Слева список, справа панель
// с описанием варианта под курсором или клавиатурным фокусом — она следует
// за активной строкой, а не только за подтверждённым выбором.
//
// Тема берётся из color-scheme окружения через light-dark(): у списка, поля и
// панели свои пары светлот, а не инверсия светлой ветки.
const STYLES = `
:where([data-vibeui-block="combobox-025"]){
--vibeui-combobox-025-bg:transparent;
--vibeui-combobox-025-fg:light-dark(oklch(0.22 0.02 270),oklch(0.94 0.01 270));
--vibeui-combobox-025-muted:light-dark(oklch(0.53 0.02 270),oklch(0.71 0.016 270));
--vibeui-combobox-025-border:light-dark(oklch(0.9 0.01 270),oklch(0.36 0.016 270));
--vibeui-combobox-025-field:light-dark(oklch(0.985 0.004 270),oklch(0.27 0.014 270));
--vibeui-combobox-025-active:light-dark(oklch(0.95 0.035 270),oklch(0.34 0.045 270));
--vibeui-combobox-025-panel:light-dark(oklch(0.975 0.01 270),oklch(0.29 0.018 270));
--vibeui-combobox-025-accent:light-dark(oklch(0.5 0.15 270),oklch(0.74 0.15 270));
--vibeui-combobox-025-radius:0.625rem;
--vibeui-combobox-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-025"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-025-bg);
border:1px solid var(--vibeui-combobox-025-border);
border-radius:calc(var(--vibeui-combobox-025-radius) + 0.25rem);
color:var(--vibeui-combobox-025-fg);
font-family:var(--vibeui-combobox-025-font);
}
[data-vibeui-block="combobox-025"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-025"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-025-border);
border-radius:var(--vibeui-combobox-025-radius);
background:var(--vibeui-combobox-025-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-025"] input::placeholder{color:var(--vibeui-combobox-025-muted)}
[data-vibeui-block="combobox-025"] input:focus-visible{outline:2px solid var(--vibeui-combobox-025-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-025"] [data-part="body"]{
display:flex;flex-wrap:wrap;gap:0.625rem;align-items:stretch;
}
[data-vibeui-block="combobox-025"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;overflow-y:auto;
flex:1 1 11rem;min-width:9rem;max-height:13rem;
border:1px solid var(--vibeui-combobox-025-border);
border-radius:var(--vibeui-combobox-025-radius);
}
[data-vibeui-block="combobox-025"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-025"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-025-active)}
[data-vibeui-block="combobox-025"] [data-part="check"]{
margin-left:auto;flex:none;font-size:0.85rem;font-weight:700;color:var(--vibeui-combobox-025-accent);
}
[data-vibeui-block="combobox-025"] [data-part="preview"]{
flex:1 1 11rem;min-width:9rem;box-sizing:border-box;padding:0.75rem;
border:1px solid var(--vibeui-combobox-025-border);
border-radius:var(--vibeui-combobox-025-radius);
background:var(--vibeui-combobox-025-panel);
display:flex;flex-direction:column;gap:0.35rem;
}
[data-vibeui-block="combobox-025"] [data-part="previewname"]{font-size:0.9375rem;font-weight:700}
[data-vibeui-block="combobox-025"] [data-part="previewtext"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-combobox-025-muted);
}
[data-vibeui-block="combobox-025"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-025-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Combobox025Option[] = [
  {
    name: "Свободен",
    description:
      "Занятость не отслеживается, встречи можно ставить в любое время без подтверждения.",
  },
  {
    name: "Занят",
    description:
      "Встречи видны в календаре как конфликтующие, новые приглашения требуют подтверждения.",
  },
  {
    name: "Не беспокоить",
    description:
      "Уведомления отключены, входящие встречи автоматически переносятся на ближайшее свободное время.",
  },
  {
    name: "Вне офиса",
    description:
      "Автоответ включён, статус виден коллегам во всех связанных сервисах компании.",
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Combobox с панелью предпросмотра: справа лежит описание варианта под
 * активной строкой, обновляется при наведении и стрелками.
 */
export function Combobox025({
  label = "Статус доступности",
  placeholder = "Найти статус",
  options = DEFAULT_OPTIONS,
  defaultValue = "Свободен",
  emptyLabel = "Ничего не нашлось",
  previewLabel = "Описание варианта",
  previewHint = "Выберите вариант, чтобы увидеть описание",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox025Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.name === defaultValue),
    ),
  )
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) =>
      option.name.toLowerCase().includes(needle),
    )
  }, [options, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-025-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-025-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (option: Combobox025Option) => {
    setValue(option.name)
    onSelect?.(option.name)
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

  const previewOption = matches[active] ?? null

  return (
    <>
      <style href="vibeui-combobox-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-025"
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
          aria-expanded="true"
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
        <div data-part="body">
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            data-part="list"
          >
            {matches.map((option, index) => (
              <li
                key={option.name}
                id={`${id}-option-${index}`}
                role="option"
                data-part="option"
                data-active={index === active}
                aria-selected={option.name === value}
                title={option.name}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  setActive(index)
                  commit(option)
                }}
              >
                {option.name}
                {option.name === value ? (
                  <span data-part="check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </li>
            ))}
            {matches.length === 0 ? (
              <li data-part="empty" role="presentation">
                {emptyLabel}
              </li>
            ) : null}
          </ul>
          <div
            data-part="preview"
            role="region"
            aria-live="polite"
            aria-label={previewLabel}
          >
            {previewOption ? (
              <>
                <span data-part="previewname">{previewOption.name}</span>
                <p data-part="previewtext">{previewOption.description}</p>
              </>
            ) : (
              <p data-part="previewtext">{previewHint}</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
