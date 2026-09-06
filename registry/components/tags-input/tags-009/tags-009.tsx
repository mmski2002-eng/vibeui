"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags009Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  placeholder?: string
  /** Что уже есть в системе: из этого списка выбирают. */
  known?: string[]
  defaultValue?: string[]
  /** Подпись строки создания. {name} — что набрано. */
  createTemplate?: string
  /** Пояснение под полем. */
  hint?: string
  emptyText?: string
  removeTemplate?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: выбор из готовых тегов и создание нового — разные действия,
// и они разделены. Свободный ввод плодит близнецов, запрет на новое упирается
// в первый же случай, которого в списке нет. Здесь совпадения показаны сверху,
// а создание — отдельной строкой внизу, с явным словом «Создать» и самим
// набранным текстом: человек видит, что он заводит новое, а не выбирает
// существующее. Пока список пуст, строка создания единственная — и тогда
// ошибиться уже не в чем.
const STYLES = `
:where([data-vibeui-block="tags-009"]){
--vibeui-tags-009-bg:light-dark(oklch(0.99 0 265),oklch(0.23 0 265));
--vibeui-tags-009-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-tags-009-muted:color-mix(in oklab,var(--vibeui-tags-009-fg) 62%,transparent);
--vibeui-tags-009-border:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-tags-009-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 5%));
--vibeui-tags-009-chip:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 9%));
--vibeui-tags-009-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-tags-009-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-tags-009-new:light-dark(oklch(0.45 0.13 152),oklch(0.82 0.13 152));
--vibeui-tags-009-panel:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-tags-009-shadow:light-dark(oklch(0.2 0 265 / 26%),oklch(0 0 0 / 60%));
--vibeui-tags-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-009"]{color-scheme:dark}
[data-vibeui-block="tags-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-tags-009-font);color:var(--vibeui-tags-009-fg);
}
[data-vibeui-block="tags-009"] *{box-sizing:border-box}
[data-vibeui-block="tags-009"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="tags-009"] [data-part="wrap"]{position:relative}
[data-vibeui-block="tags-009"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3125rem;
padding:0.4375rem 0.5rem;
border:1px solid var(--vibeui-tags-009-border);border-radius:0.625rem;
background:var(--vibeui-tags-009-field);
}
[data-vibeui-block="tags-009"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-009-accent);
outline:2px solid color-mix(in oklab,var(--vibeui-tags-009-accent) 40%,transparent);
outline-offset:1px;
}
[data-vibeui-block="tags-009"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.25rem 0.125rem 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-009-chip);font-size:0.8125rem;max-width:100%;
}
[data-vibeui-block="tags-009"] [data-part="chip"] span{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tags-009"] [data-part="drop"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:0.3125rem;font:inherit;
}
[data-vibeui-block="tags-009"] [data-part="drop"]:hover{background:color-mix(in oklab,currentColor 16%,transparent)}
[data-vibeui-block="tags-009"] input{
flex:1;min-width:6rem;border:0;padding:0.1875rem 0.125rem;
background:transparent;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-009"] input:focus{outline:none}
/* Список лежит поверх страницы: раздвигать содержимое под полем — значит
   двигать всё, на что человек смотрел до того, как начал печатать. */
[data-vibeui-block="tags-009"] [data-part="list"]{
position:absolute;left:0;right:0;top:calc(100% + 0.25rem);z-index:2;
margin:0;padding:0.25rem;list-style:none;
max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-tags-009-border);border-radius:0.625rem;
background:var(--vibeui-tags-009-panel);
box-shadow:0 18px 40px -24px var(--vibeui-tags-009-shadow);
scrollbar-width:thin;scrollbar-color:var(--vibeui-tags-009-border) transparent;
}
[data-vibeui-block="tags-009"] [data-part="option"]{
appearance:none;border:0;cursor:pointer;width:100%;text-align:left;
display:flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.5rem;border-radius:0.4375rem;
background:transparent;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-009"] [data-part="option"]:hover,
[data-vibeui-block="tags-009"] [data-part="option"]:focus-visible{
background:var(--vibeui-tags-009-hover);outline:none;
}
/* Создание отделено чертой и словом: выбрать существующее и завести новое —
   разные поступки, и путать их дорого. */
[data-vibeui-block="tags-009"] [data-part="create"]{
margin-top:0.25rem;padding-top:0.375rem;
border-top:1px solid var(--vibeui-tags-009-border);
}
[data-vibeui-block="tags-009"] [data-part="create"] [data-part="option"]{
color:var(--vibeui-tags-009-new);font-weight:600;
}
[data-vibeui-block="tags-009"] [data-part="plus"]{
flex:none;width:1rem;height:1rem;display:inline-flex;align-items:center;justify-content:center;
border-radius:50%;border:1.5px solid currentColor;font-size:0.625rem;line-height:1;
}
[data-vibeui-block="tags-009"] [data-part="empty"]{
padding:0.375rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-tags-009-muted);
}
[data-vibeui-block="tags-009"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-tags-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_KNOWN = [
  "исследование",
  "интерфейс",
  "инфраструктура",
  "документация",
  "поддержка",
  "продажи",
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
 * Теги с созданием нового: выбор и заведение разделены явной строкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags009({
  title = "Метки задачи",
  placeholder = "Найдите метку или заведите новую",
  known = DEFAULT_KNOWN,
  defaultValue = ["интерфейс"],
  createTemplate = "Создать «{name}»",
  hint = "Совпадения сверху, создание — отдельной строкой внизу.",
  emptyText = "Совпадений нет",
  removeTemplate = "Убрать {name}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tags009Props) {
  const [chosen, setChosen] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState("")
  const [open, setOpen] = useState(false)

  const typed = draft.trim()
  const lower = typed.toLowerCase()

  const matches = known.filter(
    (item) =>
      !chosen.includes(item) &&
      (typed === "" || item.toLowerCase().includes(lower)),
  )

  // Создание предлагается, только когда набранного нет ни среди выбранных,
  // ни среди известных: иначе строка спорит сама с собой.
  const canCreate =
    typed !== "" &&
    !chosen.some((item) => item.toLowerCase() === lower) &&
    !known.some((item) => item.toLowerCase() === lower)

  const add = (name: string) => {
    setChosen((current) =>
      current.includes(name) ? current : [...current, name],
    )
    setDraft("")
    setOpen(false)
  }

  const keys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()

      if (matches.length > 0) {
        add(matches[0])
      } else if (canCreate) {
        add(typed)
      }

      return
    }

    if (event.key === "Escape") {
      setOpen(false)
      return
    }

    if (event.key === "Backspace" && draft === "" && chosen.length > 0) {
      setChosen((current) => current.slice(0, -1))
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-009"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>

        <div data-part="wrap">
          <div data-part="field">
            {chosen.map((name) => (
              <span key={name} data-part="chip">
                <span>{name}</span>
                <button
                  type="button"
                  data-part="drop"
                  aria-label={removeTemplate.replace("{name}", name)}
                  onClick={() =>
                    setChosen((current) =>
                      current.filter((item) => item !== name),
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}

            <input
              type="text"
              autoComplete="off"
              value={draft}
              placeholder={placeholder}
              aria-label={title}
              /* role=combobox: без неё aria-expanded у поля ничего не
                 значит — роль textbox о раскрытии не знает. */
              role="combobox"
              aria-expanded={open}
              aria-controls="vibeui-tags-009-list"
              onChange={(event) => {
                setDraft(event.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                // Закрытие отложено: щелчок по строке списка иначе не успеет
                // сработать — уход фокуса случится раньше.
                window.setTimeout(() => setOpen(false), 120)
              }}
              onKeyDown={keys}
            />
          </div>

          {open && (matches.length > 0 || canCreate || typed !== "") ? (
            <ul data-part="list" id="vibeui-tags-009-list">
              {matches.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    data-part="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => add(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}

              {matches.length === 0 && !canCreate ? (
                <li data-part="empty">{emptyText}</li>
              ) : null}

              {canCreate ? (
                <li data-part="create">
                  <button
                    type="button"
                    data-part="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => add(typed)}
                  >
                    <span data-part="plus" aria-hidden="true">
                      +
                    </span>
                    {createTemplate.replace("{name}", typed)}
                  </button>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
