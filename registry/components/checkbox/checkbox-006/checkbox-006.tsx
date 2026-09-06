"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox006Row = {
  id: string
  name: string
  meta: string
}

export type Checkbox006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  rows?: Checkbox006Row[]
  defaultValue?: string[]
  /** Полоса действий. {count} — сколько строк выбрано на странице. */
  selectedText?: string
  /** Подпись кнопки, снимающей выбор. */
  clearLabel?: string
  /** Скрытая подпись заголовочного чекбокса. */
  selectAllLabel?: string
  /** Скрытая подпись чекбокса строки. {name} — название строки. */
  selectRowText?: string
  /** Заголовки колонок: название и правая колонка. */
  columnText?: Record<"name" | "meta", string>
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор строк таблицы с полосой действий. Полоса появляется
// только когда что-то выбрано и говорит числом, сколько именно: «применить к
// выбранным» без числа — самый частый способ удалить не то. Заголовочный
// чекбокс отмечает страницу, а не всю базу, и об этом сказано словами.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-006"]){
--vibeui-checkbox-006-surface:transparent;
--vibeui-checkbox-006-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-checkbox-006-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-checkbox-006-muted:color-mix(in oklab,var(--vibeui-checkbox-006-fg) 68%,transparent);
--vibeui-checkbox-006-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-checkbox-006-row:light-dark(oklch(0.97 0 265),oklch(0.31 0 265));
--vibeui-checkbox-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-checkbox-006-mark:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-checkbox-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-006"]{color-scheme:dark}
[data-vibeui-block="checkbox-006"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-checkbox-006-surface);
border:1px solid var(--vibeui-checkbox-006-border);border-radius:0.875rem;
font-family:var(--vibeui-checkbox-006-font);color:var(--vibeui-checkbox-006-fg);
}
/* Полоса действий появляется только с выбором и всегда называет число.
   Замес с фоном строк, а не с белым: иначе на тёмной теме полоса светится. */
[data-vibeui-block="checkbox-006"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.75rem;
background:color-mix(in oklab,var(--vibeui-checkbox-006-accent) 14%,var(--vibeui-checkbox-006-bg));
border-bottom:1px solid var(--vibeui-checkbox-006-border);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="checkbox-006"] [data-part="bar"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-checkbox-006-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="checkbox-006"] [data-part="head"],
[data-vibeui-block="checkbox-006"] [data-part="row"]{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.625rem;
padding:0.5rem 0.75rem;border-bottom:1px solid var(--vibeui-checkbox-006-border);
font-size:0.8125rem;
}
[data-vibeui-block="checkbox-006"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="checkbox-006"] [data-part="row"]:has(input:checked){background:var(--vibeui-checkbox-006-row)}
[data-vibeui-block="checkbox-006"] [data-part="head"]{color:var(--vibeui-checkbox-006-muted);font-size:0.75rem}
[data-vibeui-block="checkbox-006"] input{
appearance:none;flex:none;cursor:pointer;position:relative;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-006-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-006-bg);
}
[data-vibeui-block="checkbox-006"] input:checked,
[data-vibeui-block="checkbox-006"] input:indeterminate{border-color:transparent;background:var(--vibeui-checkbox-006-accent)}
[data-vibeui-block="checkbox-006"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-006-mark);
border-bottom:2px solid var(--vibeui-checkbox-006-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-006"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;
background:var(--vibeui-checkbox-006-mark);border-radius:9999px;
}
[data-vibeui-block="checkbox-006"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-006-accent);outline-offset:2px}
[data-vibeui-block="checkbox-006"] [data-part="name"]{font-weight:600}
[data-vibeui-block="checkbox-006"] [data-part="meta"]{color:var(--vibeui-checkbox-006-muted);font-size:0.75rem;justify-self:end}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Checkbox006Row[] = [
  { id: "1", name: "Акт № 42-118", meta: "12 480 ₽" },
  { id: "2", name: "Акт № 42-119", meta: "8 900 ₽" },
  { id: "3", name: "Счёт № 300", meta: "24 000 ₽" },
  { id: "4", name: "Счёт № 301", meta: "6 200 ₽" },
]

const DEFAULT_COLUMNS: Record<"name" | "meta", string> = {
  name: "Документ",
  meta: "Сумма",
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
 * Выбор строк таблицы: полоса действий с числом выбранного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox006({
  rows = DEFAULT_ROWS,
  defaultValue = [],
  selectedText = "Выбрано на странице: {count}",
  clearLabel = "Снять выбор",
  selectAllLabel = "Выбрать все строки на странице",
  selectRowText = "Выбрать {name}",
  columnText = DEFAULT_COLUMNS,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox006Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const head = useRef<HTMLInputElement>(null)

  const all = value.length === rows.length && rows.length > 0
  const some = value.length > 0 && !all

  useEffect(() => {
    if (head.current) head.current.indeterminate = some
  }, [some])

  const palette = {
    ...(accent ? { "--vibeui-checkbox-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-006"
        className={className}
        style={palette}
      >
        {value.length ? (
          <div data-part="bar" role="status">
            <span>{selectedText.replace("{count}", String(value.length))}</span>
            <button type="button" onClick={() => update([])}>
              {clearLabel}
            </button>
          </div>
        ) : null}
        <div data-part="head">
          <input
            ref={head}
            type="checkbox"
            checked={all}
            aria-label={selectAllLabel}
            onChange={() => update(all ? [] : rows.map((row) => row.id))}
          />
          <span>{columnText.name ?? DEFAULT_COLUMNS.name}</span>
          <span data-part="meta">
            {columnText.meta ?? DEFAULT_COLUMNS.meta}
          </span>
        </div>
        {rows.map((row) => (
          <label key={row.id} data-part="row">
            <input
              type="checkbox"
              checked={value.includes(row.id)}
              aria-label={selectRowText.replace("{name}", row.name)}
              onChange={() =>
                update(
                  value.includes(row.id)
                    ? value.filter((item) => item !== row.id)
                    : [...value, row.id],
                )
              }
            />
            <span data-part="name">{row.name}</span>
            <span data-part="meta">{row.meta}</span>
          </label>
        ))}
      </div>
    </>
  )
}
