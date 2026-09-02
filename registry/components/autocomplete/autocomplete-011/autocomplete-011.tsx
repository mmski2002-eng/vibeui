"use client"

import { useId, useMemo, useState } from "react"
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react"

export type Autocomplete011Person = {
  name: string
  handle: string
  role: string
}

export type Autocomplete011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  people?: Autocomplete011Person[]
  defaultValue?: string
  /** Имя списка для скринридера. */
  listLabel?: string
  /** Строка под полем. */
  hintText?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказка внутри текста. Список появляется не от фокуса, а
// от собаки перед словом — упоминание живёт посреди фразы, и открывать его
// каждый раз при клике в поле значит мешать письму. Аватар — инициалы на
// оттенке из имени: сорок фотографий ради выпадающего списка не грузим.
const STYLES = `
:where([data-vibeui-block="autocomplete-011"]){
--vibeui-autocomplete-011-bg:transparent;
--vibeui-autocomplete-011-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-011-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-autocomplete-011-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-011-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-011-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-011-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-011-radius:0.625rem;
--vibeui-autocomplete-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-011"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-011-bg);
border:1px solid var(--vibeui-autocomplete-011-border);
border-radius:calc(var(--vibeui-autocomplete-011-radius) + 0.25rem);
color:var(--vibeui-autocomplete-011-fg);
font-family:var(--vibeui-autocomplete-011-font);
}
[data-vibeui-block="autocomplete-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-011"] textarea{
box-sizing:border-box;width:100%;min-height:4.5rem;resize:vertical;
padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-autocomplete-011-border);
border-radius:var(--vibeui-autocomplete-011-radius);
background:var(--vibeui-autocomplete-011-field);
color:inherit;font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="autocomplete-011"] textarea::placeholder{color:var(--vibeui-autocomplete-011-muted)}
[data-vibeui-block="autocomplete-011"] textarea:focus-visible{
outline:2px solid var(--vibeui-autocomplete-011-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-011"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:11rem;overflow-y:auto;
border:1px solid var(--vibeui-autocomplete-011-border);
border-radius:var(--vibeui-autocomplete-011-radius);
background:var(--vibeui-autocomplete-011-panel);
}
[data-vibeui-block="autocomplete-011"] [data-part="option"]{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.25rem 0.625rem;
padding:0.375rem 0.5rem;border-radius:0.4375rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-011"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-011-active)}
[data-vibeui-block="autocomplete-011"] [data-part="avatar"]{
grid-row:span 2;display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:oklch(0.9 0.05 var(--vibeui-autocomplete-011-hue,265));
color:oklch(0.35 0.09 var(--vibeui-autocomplete-011-hue,265));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="autocomplete-011"] [data-part="name"]{font-size:0.875rem;line-height:1.2}
[data-vibeui-block="autocomplete-011"] [data-part="handle"]{font-size:0.75rem;color:var(--vibeui-autocomplete-011-muted)}
[data-vibeui-block="autocomplete-011"] [data-part="role"]{
grid-column:3;grid-row:span 2;justify-self:end;
font-size:0.6875rem;color:var(--vibeui-autocomplete-011-muted);
}
[data-vibeui-block="autocomplete-011"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-011-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE: Autocomplete011Person[] = [
  { name: "Анна Петрова", handle: "anna", role: "дизайн" },
  { name: "Марк Ильин", handle: "mark", role: "фронтенд" },
  { name: "Мария Гурова", handle: "masha", role: "продукт" },
  { name: "Олег Дроздов", handle: "oleg", role: "бэкенд" },
  { name: "Ирина Ким", handle: "irina", role: "поддержка" },
]

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
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
 * Упоминания по «@» прямо в тексте: список открывает собака, а не фокус.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete011({
  label = "Комментарий",
  placeholder = "Напишите и позовите коллегу через @",
  people = DEFAULT_PEOPLE,
  defaultValue = "Проверьте макет, пожалуйста, @ma",
  listLabel = "Коллеги",
  hintText = "Список открывается после @ и закрывается на пробеле",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [caret, setCaret] = useState(defaultValue.length)

  // Токен упоминания — от последней собаки до курсора, без пробелов внутри.
  const token = useMemo(() => {
    const before = value.slice(0, caret)
    const at = before.lastIndexOf("@")
    if (at < 0) return null
    const word = before.slice(at + 1)
    if (/\s/.test(word)) return null
    return { at, word }
  }, [caret, value])

  const matches = useMemo(() => {
    if (!token) return []
    const needle = token.word.toLowerCase()
    return people.filter(
      (person) =>
        person.handle.startsWith(needle) ||
        person.name.toLowerCase().includes(needle),
    )
  }, [people, token])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    setCaret(event.target.selectionStart ?? event.target.value.length)
    onChange?.(event.target.value)
  }

  const mention = (handle: string) => {
    if (!token) return
    const next = `${value.slice(0, token.at)}@${handle} ${value.slice(caret)}`
    setValue(next)
    setCaret(token.at + handle.length + 2)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-autocomplete-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-011"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          aria-describedby={`${id}-hint`}
          onChange={update}
          onKeyUp={(event) => setCaret(event.currentTarget.selectionStart ?? 0)}
          onClick={(event) => setCaret(event.currentTarget.selectionStart ?? 0)}
        />
        {matches.length ? (
          <ul role="listbox" aria-label={listLabel} data-part="list">
            {matches.map((person) => (
              <li
                key={person.handle}
                role="option"
                aria-selected="false"
                data-part="option"
                style={
                  {
                    "--vibeui-autocomplete-011-hue": hue(person.name),
                  } as CSSProperties
                }
                onMouseDown={(event) => {
                  event.preventDefault()
                  mention(person.handle)
                }}
              >
                <span data-part="avatar" aria-hidden="true">
                  {initials(person.name)}
                </span>
                <span data-part="name">{person.name}</span>
                <span data-part="role">{person.role}</span>
                <span data-part="handle">@{person.handle}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <span data-part="hint" id={`${id}-hint`}>
          {hintText}
        </span>
      </div>
    </>
  )
}
