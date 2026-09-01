"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea005Person = {
  handle: string
  name: string
  role: string
}

export type Textarea005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  people?: Textarea005Person[]
  accent?: string
}

// Идея компонента: упоминания по «@» прямо в обычном textarea. Список
// открывается только когда «@» стоит в начале слова и после него нет
// пробела — иначе подсказка выскакивала бы на каждом почтовом адресе.
// Выбор подставляет ник на место набранного куска и возвращает каретку
// за него, чтобы можно было продолжать печатать не глядя.
const STYLES = `
:where([data-vibeui-block="textarea-005"]){
--vibeui-textarea-005-bg:oklch(1 0 0);
--vibeui-textarea-005-fg:oklch(0.22 0.014 265);
--vibeui-textarea-005-muted:oklch(0.55 0.014 265);
--vibeui-textarea-005-border:oklch(0.9 0.006 265);
--vibeui-textarea-005-field:oklch(0.985 0.002 265);
--vibeui-textarea-005-accent:oklch(0.55 0.19 262);
--vibeui-textarea-005-tint:oklch(0.55 0.19 262 / 10%);
--vibeui-textarea-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-005-bg);
border:1px solid var(--vibeui-textarea-005-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-005-font);color:var(--vibeui-textarea-005-fg);
}
[data-vibeui-block="textarea-005"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-005"] [data-part="field"]{position:relative}
[data-vibeui-block="textarea-005"] textarea{
box-sizing:border-box;width:100%;min-height:5.5rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-textarea-005-border);border-radius:0.625rem;
background:var(--vibeui-textarea-005-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.55;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-005"] textarea:focus{
outline:none;border-color:var(--vibeui-textarea-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-005-accent) 18%,transparent);
}
/* Список висит под полем, а не над кареткой: попасть точно под курсор в
   textarea нельзя без измерения текста, а промах туда хуже, чем честная
   привязка к нижнему краю поля. */
[data-vibeui-block="textarea-005"] [data-part="menu"]{
position:absolute;left:0;right:0;top:calc(100% + 0.25rem);z-index:2;
margin:0;padding:0.25rem;list-style:none;
border:1px solid var(--vibeui-textarea-005-border);border-radius:0.625rem;
background:var(--vibeui-textarea-005-bg);
box-shadow:0 8px 24px oklch(0.2 0.02 265 / 14%);
animation:vibeui-textarea-005-in .14s ease-out;
}
@keyframes vibeui-textarea-005-in{from{opacity:0;transform:translateY(-0.25rem)}to{opacity:1;transform:none}}
[data-vibeui-block="textarea-005"] [data-part="item"]{
display:flex;width:100%;align-items:center;gap:0.5rem;
padding:0.375rem 0.5rem;border:0;border-radius:0.375rem;
background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;
}
[data-vibeui-block="textarea-005"] [data-part="item"]:hover,
[data-vibeui-block="textarea-005"] [data-part="item"]:focus-visible{
background:var(--vibeui-textarea-005-tint);outline:none;
}
[data-vibeui-block="textarea-005"] [data-part="avatar"]{
display:grid;place-items:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-textarea-005-tint);color:var(--vibeui-textarea-005-accent);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="textarea-005"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="textarea-005"] [data-part="name"]{font-size:0.8125rem;font-weight:600;line-height:1.2}
[data-vibeui-block="textarea-005"] [data-part="role"]{font-size:0.6875rem;color:var(--vibeui-textarea-005-muted)}
[data-vibeui-block="textarea-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-textarea-005-muted);
}
[data-vibeui-block="textarea-005"] [data-part="hint"] b{color:var(--vibeui-textarea-005-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE: Textarea005Person[] = [
  { handle: "anna", name: "Анна Летова", role: "дизайн" },
  { handle: "artem", name: "Артём Гуляев", role: "фронтенд" },
  { handle: "dasha", name: "Даша Ким", role: "аналитика" },
  { handle: "max", name: "Максим Орлов", role: "продукт" },
]

/**
 * Поле с упоминаниями по «@»: список фильтруется по набранному нику.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea005({
  label = "Комментарий к задаче",
  placeholder = "Наберите @, чтобы позвать коллегу",
  people = DEFAULT_PEOPLE,
  accent,
  className,
  style,
  ...props
}: Textarea005Props) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(
    "Готово к ревью, посмотрите, пожалуйста, @",
  )
  const [query, setQuery] = useState<string | null>("")

  const matches =
    query === null
      ? []
      : people.filter((person) => person.handle.startsWith(query.toLowerCase()))

  const scan = (element: HTMLTextAreaElement) => {
    const before = element.value.slice(0, element.selectionStart)
    // «@» считается началом упоминания только в начале слова: иначе
    // подсказка лезла бы в каждый почтовый адрес.
    const found = before.match(/(?:^|\s)@([\p{L}\w-]*)$/u)
    setQuery(found ? found[1] : null)
  }

  const insert = (handle: string) => {
    const element = field.current
    if (!element || query === null) {
      return
    }
    const caret = element.selectionStart
    element.setRangeText(handle + " ", caret - query.length, caret, "end")
    element.focus()
    setValue(element.value)
    setQuery(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-textarea-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-005"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="field">
          <textarea
            id={id}
            ref={field}
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              setValue(event.target.value)
              scan(event.target)
            }}
            onClick={(event) => scan(event.currentTarget)}
            onKeyUp={(event) => scan(event.currentTarget)}
            onBlur={() => setQuery(null)}
          />
          {matches.length > 0 ? (
            <ul data-part="menu">
              {matches.map((person) => (
                <li key={person.handle}>
                  <button
                    type="button"
                    data-part="item"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insert(person.handle)}
                  >
                    <span data-part="avatar" aria-hidden="true">
                      {person.name.slice(0, 1)}
                    </span>
                    <span data-part="who">
                      <span data-part="name">{person.name}</span>
                      <span data-part="role">
                        @{person.handle} · {person.role}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p data-part="hint">
          Символ <b>@</b> открывает список коллег
        </p>
      </div>
    </>
  )
}
