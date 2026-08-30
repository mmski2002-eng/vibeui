"use client"

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea001Props = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "rows"
> & {
  label?: string
  /** Строка под полем: подсказка про формат или горячую клавишу. */
  hint?: string
  /** Максимальная высота в строках. Дальше поле начинает прокручиваться. */
  maxRows?: number
  accent?: string
}

// Идея компонента: поле растёт под текст, но не прыгает и не перерисовывает
// React-дерево. Высоту держит невидимая копия текста в той же ячейке grid —
// обработчик только переписывает data-value обёртки, состояния нет.
const STYLES = `
:where([data-vibeui-block="textarea-001"]){
--vibeui-textarea-001-fg:oklch(0.24 0.016 265);
--vibeui-textarea-001-muted:oklch(0.54 0.014 265);
--vibeui-textarea-001-bg:oklch(1 0 0);
--vibeui-textarea-001-border:oklch(0.87 0.008 265);
--vibeui-textarea-001-accent:oklch(0.55 0.2 262);
--vibeui-textarea-001-radius:0.75rem;
--vibeui-textarea-001-line:1.55;
--vibeui-textarea-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-001"]{
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-textarea-001-font);color:var(--vibeui-textarea-001-fg);
}
[data-vibeui-block="textarea-001"] [data-part="label"]{font-size:0.8125rem;font-weight:500}
/* Поле и его невидимая копия лежат в одной ячейке: высоту задаёт копия. */
[data-vibeui-block="textarea-001"] [data-part="grow"]{
display:grid;
border:1px solid var(--vibeui-textarea-001-border);
border-radius:var(--vibeui-textarea-001-radius);
background:var(--vibeui-textarea-001-bg);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-001"] [data-part="grow"]:focus-within{
border-color:var(--vibeui-textarea-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-001-accent) 22%,transparent);
}
[data-vibeui-block="textarea-001"] [data-part="grow"]::after{
content:attr(data-value) " ";
visibility:hidden;white-space:pre-wrap;word-break:break-word;
}
[data-vibeui-block="textarea-001"] [data-part="grow"] > textarea,
[data-vibeui-block="textarea-001"] [data-part="grow"]::after{
grid-area:1 / 1 / 2 / 2;
padding:0.75rem 0.875rem;
font:inherit;font-size:0.9375rem;line-height:var(--vibeui-textarea-001-line);
}
[data-vibeui-block="textarea-001"] textarea{
margin:0;border:0;outline:none;resize:none;overflow:auto;
background:transparent;color:inherit;
min-height:calc(3 * var(--vibeui-textarea-001-line) * 0.9375rem + 1.5rem);
max-height:calc(var(--vibeui-textarea-001-max-rows,10) * var(--vibeui-textarea-001-line) * 0.9375rem + 1.5rem);
}
[data-vibeui-block="textarea-001"] textarea::placeholder{color:color-mix(in oklab,var(--vibeui-textarea-001-muted) 70%,transparent)}
[data-vibeui-block="textarea-001"] textarea:disabled{cursor:not-allowed}
[data-vibeui-block="textarea-001"]:has(textarea:disabled) [data-part="grow"]{opacity:.55}
[data-vibeui-block="textarea-001"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-textarea-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Текстовое поле, которое растёт под содержимое без пересчёта в React.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea001({
  label = "Что нужно сделать",
  hint = "Одно поле, растёт под текст. Ctrl + Enter — отправить.",
  maxRows = 10,
  accent,
  id,
  className,
  style,
  defaultValue,
  onInput,
  placeholder = "Опишите задачу своими словами",
  ...props
}: Textarea001Props) {
  const palette = {
    "--vibeui-textarea-001-max-rows": maxRows,
    ...(accent ? { "--vibeui-textarea-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="textarea-001"
        className={className}
        style={palette}
      >
        {label ? (
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div data-part="grow" data-value={String(defaultValue ?? "")}>
          <textarea
            {...props}
            id={id}
            rows={3}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onInput={(event) => {
              const grow = event.currentTarget.parentElement

              if (grow) {
                grow.dataset.value = event.currentTarget.value
              }

              onInput?.(event)
            }}
          />
        </div>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}
