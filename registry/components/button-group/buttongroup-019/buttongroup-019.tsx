"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup019Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  options?: string[]
  allLabel?: string
  resetLabel?: string
  label?: string
  /** Строка итога, когда не выбрано ничего. */
  allSelectedText?: string
  /** Строка итога при выборе: {count} заменяется числом фильтров. */
  selectedText?: string
  onChange?: (selected: string[]) => void
  /** Пусто — подложки нет, пилюли лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный фильтр, у которого «Все» — не отдельный
// вариант, а состояние пустого выбора. Кнопка слева не хранит своего флага:
// она подсвечена ровно тогда, когда не выбрано ничего, и её нажатие
// очищает набор. Сброс справа отделён от сцепки и выключен, пока сбрасывать
// нечего, — так пользователю не приходится гадать, изменил он что-то или нет.
// Итог выбора объявляется через aria-live, иначе изменение молча уезжает.
const STYLES = `
:where([data-vibeui-block="buttongroup-019"]){
--vibeui-buttongroup-019-surface:transparent;
--vibeui-buttongroup-019-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-019-muted:color-mix(in oklab,var(--vibeui-buttongroup-019-fg) 68%,transparent);
--vibeui-buttongroup-019-border:light-dark(oklch(0.89 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-019-hover:light-dark(oklch(0.96 0.005 265),oklch(0.31 0.012 265));
--vibeui-buttongroup-019-on:light-dark(oklch(0.96 0.035 265),oklch(0.3 0.05 265));
--vibeui-buttongroup-019-accent:light-dark(oklch(0.53 0.16 265),oklch(0.76 0.13 265));
--vibeui-buttongroup-019-radius:0.625rem;
--vibeui-buttongroup-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-019"]{color-scheme:dark}
[data-vibeui-block="buttongroup-019"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:30rem;
font-family:var(--vibeui-buttongroup-019-font);
}
[data-vibeui-block="buttongroup-019"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-019"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
}
[data-vibeui-block="buttongroup-019"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-019"] [data-part="chip"]{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.8125rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-019-border);
background:var(--vibeui-buttongroup-019-surface);
color:var(--vibeui-buttongroup-019-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-019"] [data-part="chip"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-019-radius);
border-end-start-radius:var(--vibeui-buttongroup-019-radius);
}
[data-vibeui-block="buttongroup-019"] [data-part="chip"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-019-radius);
border-end-end-radius:var(--vibeui-buttongroup-019-radius);
}
[data-vibeui-block="buttongroup-019"] [data-part="chip"]:hover{color:var(--vibeui-buttongroup-019-fg)}
[data-vibeui-block="buttongroup-019"] [data-part="chip"][aria-pressed="true"]{
z-index:1;
background:var(--vibeui-buttongroup-019-on);
border-color:var(--vibeui-buttongroup-019-accent);
color:var(--vibeui-buttongroup-019-accent);
}
[data-vibeui-block="buttongroup-019"] [data-part="chip"]:focus-visible{
z-index:2;outline:2px solid var(--vibeui-buttongroup-019-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-019"] [data-part="tick"]{
width:0.875rem;height:0.875rem;
stroke:currentColor;fill:none;stroke-width:2.2;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-019"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.3125rem;
height:2.25rem;padding:0 0.625rem;margin-inline-start:auto;
border:0;border-radius:var(--vibeui-buttongroup-019-radius);
background:transparent;
color:var(--vibeui-buttongroup-019-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="buttongroup-019"] [data-part="reset"]:hover:not(:disabled){
color:var(--vibeui-buttongroup-019-fg);background:var(--vibeui-buttongroup-019-hover);
}
[data-vibeui-block="buttongroup-019"] [data-part="reset"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="buttongroup-019"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-buttongroup-019-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-019"] [data-part="summary"]{
margin:0;color:var(--vibeui-buttongroup-019-muted);
font-size:0.75rem;line-height:1.4;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Дизайн", "Разработка", "Аналитика", "Поддержка"]

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
 * Множественный фильтр, где «Все» — это пустой выбор, а сброс выключен без нужды.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup019({
  options = DEFAULT_OPTIONS,
  allLabel = "Все",
  resetLabel = "Сбросить",
  label = "Направления",
  allSelectedText = "Показаны все направления",
  selectedText = "Выбрано направлений: {count}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup019Props) {
  const [selected, setSelected] = useState<string[]>([])

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-019-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-019"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <div data-part="track" role="group" aria-label={label}>
            <button
              type="button"
              data-part="chip"
              aria-pressed={selected.length === 0}
              onClick={() => apply([])}
            >
              {selected.length === 0 ? (
                <svg data-part="tick" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 13 4.5 4.5L19 7" />
                </svg>
              ) : null}
              {allLabel}
            </button>
            {options.map((option) => {
              const active = selected.includes(option)

              return (
                <button
                  key={option}
                  type="button"
                  data-part="chip"
                  aria-pressed={active}
                  onClick={() =>
                    apply(
                      active
                        ? selected.filter((value) => value !== option)
                        : [...selected, option],
                    )
                  }
                >
                  {option}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            data-part="reset"
            disabled={selected.length === 0}
            onClick={() => apply([])}
          >
            {resetLabel}
          </button>
        </div>
        <p data-part="summary" aria-live="polite">
          {selected.length === 0
            ? allSelectedText
            : selectedText.replace("{count}", String(selected.length))}
        </p>
      </div>
    </>
  )
}
