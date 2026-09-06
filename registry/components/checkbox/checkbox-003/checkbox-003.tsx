"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox003Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  items?: string[]
  defaultValue?: string[]
  /** Подпись родительского чекбокса. */
  allLabel?: string
  /** Строка счётчика. {selected} — отмечено, {total} — всего пунктов. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: родительский чекбокс с промежуточным состоянием. Когда
// отмечена часть детей, родитель не «выключен» и не «включён» — он показывает
// черту. Это состояние нельзя задать атрибутом в разметке: indeterminate
// живёт только в DOM, поэтому его ставит эффект.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-003"]){
--vibeui-checkbox-003-surface:transparent;
--vibeui-checkbox-003-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-checkbox-003-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-checkbox-003-muted:color-mix(in oklab,var(--vibeui-checkbox-003-fg) 68%,transparent);
--vibeui-checkbox-003-border:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-checkbox-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-checkbox-003-mark:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-checkbox-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-003"]{color-scheme:dark}
[data-vibeui-block="checkbox-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:18rem;box-sizing:border-box;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-checkbox-003-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-003-surface);
font-family:var(--vibeui-checkbox-003-font);color:var(--vibeui-checkbox-003-fg);
}
/* legend у fieldset садится на рамку и обрезается — float возвращает
   его в поток обычной строкой. */
[data-vibeui-block="checkbox-003"] legend{float:left;width:100%;padding:0;margin-bottom:0.25rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="checkbox-003"] label{
display:flex;align-items:center;gap:0.625rem;
min-height:2rem;font-size:0.875rem;cursor:pointer;
}
/* Дети со сдвигом: иерархия видна отступом, а не только порядком. */
[data-vibeui-block="checkbox-003"] [data-part="child"]{padding-left:1.75rem}
[data-vibeui-block="checkbox-003"] input{
appearance:none;flex:none;cursor:pointer;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-003-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-003-bg);position:relative;
}
[data-vibeui-block="checkbox-003"] input:checked,
[data-vibeui-block="checkbox-003"] input:indeterminate{
border-color:transparent;background:var(--vibeui-checkbox-003-accent);
}
/* Галочка у отмеченного, черта у промежуточного — разные фигуры. */
[data-vibeui-block="checkbox-003"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-003-mark);
border-bottom:2px solid var(--vibeui-checkbox-003-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-003"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;
background:var(--vibeui-checkbox-003-mark);border-radius:9999px;
}
[data-vibeui-block="checkbox-003"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-003-accent);outline-offset:2px}
[data-vibeui-block="checkbox-003"] [data-part="count"]{margin-top:0.25rem;font-size:0.75rem;color:var(--vibeui-checkbox-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Каталог компонентов",
  "Страница компонента",
  "Инструкция для агента",
  "Тёмная тема",
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
 * Родительский чекбокс с промежуточным состоянием и группой детей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox003({
  legend = "Что перенести в проект",
  items = DEFAULT_ITEMS,
  defaultValue = ["Каталог компонентов", "Тёмная тема"],
  allLabel = "Выбрать всё",
  countText = "Отмечено {selected} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox003Props) {
  const id = useId()
  const [value, setValue] = useState<string[]>(defaultValue)
  const parent = useRef<HTMLInputElement>(null)

  const all = value.length === items.length
  const some = value.length > 0 && !all

  // indeterminate нельзя выставить атрибутом: это свойство DOM-узла.
  useEffect(() => {
    if (parent.current) parent.current.indeterminate = some
  }, [some])

  const palette = {
    ...(accent ? { "--vibeui-checkbox-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const count = countText
    .replace("{selected}", String(value.length))
    .replace("{total}", String(items.length))

  return (
    <>
      <style href="vibeui-checkbox-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <label>
          <input
            ref={parent}
            type="checkbox"
            checked={all}
            aria-controls={`${id}-group`}
            onChange={() => update(all ? [] : [...items])}
          />
          {allLabel}
        </label>
        <div id={`${id}-group`}>
          {items.map((item) => (
            <label key={item} data-part="child">
              <input
                type="checkbox"
                checked={value.includes(item)}
                onChange={() =>
                  update(
                    value.includes(item)
                      ? value.filter((entry) => entry !== item)
                      : [...value, item],
                  )
                }
              />
              {item}
            </label>
          ))}
        </div>
        <span data-part="count">{count}</span>
      </fieldset>
    </>
  )
}
