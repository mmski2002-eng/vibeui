"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup012Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  /** Стартовое значение поля. */
  defaultValue?: string
  /** Подписи фильтра: выключенного и включённого. */
  filterText?: { off: string; on: string }
  /** Подпись кнопки очистки для чтения вслух. */
  clearLabel?: string
  hint?: string
  onChange?: (value: string) => void
  onFilterChange?: (active: boolean) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: слева не значок, а настоящая кнопка-переключатель фильтра
// — по ней можно нажать, у неё есть состояние aria-pressed и свой цвет во
// включённом виде. Справа — кнопка очистки текста, она устроена как в
// «Icon And Clear»: появляется только при непустом значении и возвращает
// фокус в поле. Обе кнопки независимы друг от друга: очистка текста не
// трогает фильтр, а переключение фильтра не трогает текст.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-012"]){
--vibeui-inputgroup-012-surface:transparent;
--vibeui-inputgroup-012-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-012-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-012-muted:color-mix(in oklab,var(--vibeui-inputgroup-012-fg) 68%,transparent);
--vibeui-inputgroup-012-field:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-inputgroup-012-fixed:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-inputgroup-012-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-012-accent:light-dark(oklch(0.282 0 0),oklch(0.895 0 0));
--vibeui-inputgroup-012-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 255));
--vibeui-inputgroup-012-radius:0.75rem;
--vibeui-inputgroup-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-012"]{color-scheme:dark}
[data-vibeui-block="inputgroup-012"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-012-surface);
border:1px solid var(--vibeui-inputgroup-012-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-012-font);color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-012"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-012"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-012-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-012-radius) 0 0 var(--vibeui-inputgroup-012-radius);
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-012-radius) var(--vibeui-inputgroup-012-radius) 0;
}
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-012"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-012-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-012-accent);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-012-fixed);
color:var(--vibeui-inputgroup-012-muted);
transition:background-color .16s ease,color .16s ease;
}
/* Включённый фильтр красится акцентом — состояние видно без чтения aria. */
[data-vibeui-block="inputgroup-012"] [data-part="filter"][aria-pressed="true"]{
background:var(--vibeui-inputgroup-012-accent);
color:oklch(from var(--vibeui-inputgroup-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"]:hover:not([aria-pressed="true"]){
background:color-mix(in oklab,var(--vibeui-inputgroup-012-accent) 14%,var(--vibeui-inputgroup-012-fixed));
color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] [data-part="filter"] svg{width:0.9375rem;height:0.9375rem;display:block}
[data-vibeui-block="inputgroup-012"] input{
flex:1;min-width:0;padding:0 0.75rem;font-size:0.875rem;
background:var(--vibeui-inputgroup-012-field);
}
/* Своя кнопка очистки уже есть — браузерный крестик у type="search" дал бы
   рядом с ней вторую, с другим значком и другим поведением. */
[data-vibeui-block="inputgroup-012"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="inputgroup-012"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-012-fixed);
color:var(--vibeui-inputgroup-012-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-012"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-012-accent) 14%,var(--vibeui-inputgroup-012-fixed));
color:var(--vibeui-inputgroup-012-fg);
}
[data-vibeui-block="inputgroup-012"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-012"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-012-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-012"] *{animation:none!important;transition:none!important}}
`

const FILTER_TEXT = {
  off: "Только незавершённые",
  on: "Только незавершённые: включено",
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
 * Сцепка «фильтр + поиск + очистка»: слева переключатель с aria-pressed, справа
 * кнопка очистки, которая появляется только вместе с текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup012({
  label = "Поиск по заказам",
  placeholder = "Номер заказа или имя",
  defaultValue = "",
  filterText = FILTER_TEXT,
  clearLabel = "Очистить поле",
  hint = "Фильтр слева ограничивает список отдельно от текста запроса.",
  onChange,
  onFilterChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup012Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [filterActive, setFilterActive] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const push = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  const toggleFilter = () => {
    const next = !filterActive
    setFilterActive(next)
    onFilterChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-012"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <button
            type="button"
            data-part="filter"
            aria-pressed={filterActive}
            aria-label={filterActive ? filterText.on : filterText.off}
            onClick={toggleFilter}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M2.5 3h11l-4 5v4.5l-3 1.5V8L2.5 3Z"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            ref={field}
            id={id}
            type="search"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => push(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label={clearLabel}
              onClick={() => {
                push("")
                field.current?.focus()
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
