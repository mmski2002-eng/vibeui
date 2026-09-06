"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup030Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  onApply?: (value: string) => void
  onClear?: () => void
  hint?: string
  /** Текст кнопки очистки. */
  clearLabel?: string
  /** Текст кнопки применения. */
  applyLabel?: string
  /** Шаблон строки статуса; {value} подставляет применённое значение. */
  appliedText?: string
  /** Текст статуса, когда ничего не применено. */
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const APPLIED_TEXT = "Применено: {value}"

// Идея компонента: у поля два раздельных действия, а не одно совмещённое —
// «Очистить» откатывает черновик в пустую строку сразу, «Применить»
// фиксирует введённое значение как есть. Черновик и применённое значение
// не одно и то же: applied показывается отдельной строкой, чтобы было
// видно, отличается ли то, что напечатано, от того, что реально принято.
// Кнопка «Применить» выключена, если черновик совпадает с уже применённым.
const STYLES = `
:where([data-vibeui-block="inputgroup-030"]){
--vibeui-inputgroup-030-surface:transparent;
--vibeui-inputgroup-030-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-inputgroup-030-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-030-muted:color-mix(in oklab,var(--vibeui-inputgroup-030-fg) 68%,transparent);
--vibeui-inputgroup-030-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-030-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-030-border:light-dark(oklch(0.86 0 265),oklch(0.42 0 265));
--vibeui-inputgroup-030-accent:light-dark(oklch(0.55 0.15 265),oklch(0.77 0.13 265));
--vibeui-inputgroup-030-radius:0.75rem;
--vibeui-inputgroup-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-030"]{color-scheme:dark}
[data-vibeui-block="inputgroup-030"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:25rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-030-surface);
border:1px solid var(--vibeui-inputgroup-030-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-030-font);color:var(--vibeui-inputgroup-030-fg);
}
[data-vibeui-block="inputgroup-030"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-030"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-030"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-030"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-030-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-030"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-030-radius) 0 0 var(--vibeui-inputgroup-030-radius);
}
[data-vibeui-block="inputgroup-030"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-030-radius) var(--vibeui-inputgroup-030-radius) 0;
}
[data-vibeui-block="inputgroup-030"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-030"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-030-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-030-accent);
}
[data-vibeui-block="inputgroup-030"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-030-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-030"] [data-part="clear"],
[data-vibeui-block="inputgroup-030"] [data-part="apply"]{
appearance:none;flex:none;cursor:pointer;padding:0 0.875rem;
background:var(--vibeui-inputgroup-030-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="inputgroup-030"] [data-part="clear"]:not(:disabled):hover,
[data-vibeui-block="inputgroup-030"] [data-part="apply"]:not(:disabled):hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-030-accent) 14%,var(--vibeui-inputgroup-030-fixed));
}
[data-vibeui-block="inputgroup-030"] [data-part="clear"]:disabled,
[data-vibeui-block="inputgroup-030"] [data-part="apply"]:disabled{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="inputgroup-030"] [data-part="apply"]{
color:var(--vibeui-inputgroup-030-accent);
}
[data-vibeui-block="inputgroup-030"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-030-muted);
}
[data-vibeui-block="inputgroup-030"] [data-part="status"] b{
font-weight:650;color:var(--vibeui-inputgroup-030-fg);
}
[data-vibeui-block="inputgroup-030"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-030-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-030"] *{transition:none!important}}
`

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
 * Сцепка «поле + очистить + применить»: черновик и применённое значение —
 * разные состояния, «Очистить» откатывает черновик в пустую строку,
 * «Применить» выключено, пока черновик совпадает с уже принятым.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup030({
  name = "filter",
  label = "Фильтр по артикулу",
  placeholder = "Например, ART-1024",
  defaultValue = "",
  onApply,
  onClear,
  hint = "«Применить» фиксирует введённый текст, «Очистить» сразу сбрасывает поле в пустое значение.",
  clearLabel = "Очистить",
  applyLabel = "Применить",
  appliedText = APPLIED_TEXT,
  emptyText = "Фильтр не применён",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup030Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = useState(defaultValue)
  const [applied, setApplied] = useState(defaultValue)
  const [appliedBefore, appliedAfter = ""] = appliedText.split("{value}")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-030-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const clear = () => {
    setDraft("")
    setApplied("")
    onClear?.()
    field.current?.focus()
  }

  const apply = () => {
    setApplied(draft)
    onApply?.(draft)
  }

  return (
    <>
      <style href="vibeui-inputgroup-030" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-030"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={draft}
            aria-describedby={`${id}-status ${id}-hint`}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                apply()
              }
            }}
          />
          <button
            type="button"
            data-part="clear"
            disabled={draft === "" && applied === ""}
            onClick={clear}
          >
            {clearLabel}
          </button>
          <button
            type="button"
            data-part="apply"
            disabled={draft === applied}
            onClick={apply}
          >
            {applyLabel}
          </button>
        </div>
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          {applied ? (
            <>
              {appliedBefore}
              <b>{applied}</b>
              {appliedAfter}
            </>
          ) : (
            emptyText
          )}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
