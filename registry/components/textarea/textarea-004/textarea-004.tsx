"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  hint?: string
  accent?: string
}

// Идея компонента: панель форматирования над обычным textarea. Богатый
// редактор здесь не нужен — люди пишут в markdown, а кнопки просто
// оборачивают выделение символами. Обёртка сделана через setRangeText:
// он сохраняет историю отмены браузера, чего не делает прямая запись
// в value, и возвращает выделение на место, чтобы можно было жать дальше.
const STYLES = `
:where([data-vibeui-block="textarea-004"]){
--vibeui-textarea-004-bg:oklch(1 0 0);
--vibeui-textarea-004-fg:oklch(0.22 0.014 265);
--vibeui-textarea-004-muted:oklch(0.55 0.014 265);
--vibeui-textarea-004-border:oklch(0.9 0.006 265);
--vibeui-textarea-004-field:oklch(0.985 0.002 265);
--vibeui-textarea-004-bar:oklch(0.97 0.003 265);
--vibeui-textarea-004-accent:oklch(0.55 0.19 262);
--vibeui-textarea-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-textarea-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="textarea-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-004-bg);
border:1px solid var(--vibeui-textarea-004-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-004-font);color:var(--vibeui-textarea-004-fg);
}
[data-vibeui-block="textarea-004"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="textarea-004"] [data-part="shell"]{
display:flex;flex-direction:column;
border:1px solid var(--vibeui-textarea-004-border);border-radius:0.625rem;overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-004"] [data-part="shell"]:focus-within{
border-color:var(--vibeui-textarea-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-004-accent) 18%,transparent);
}
/* Панель — настоящая toolbar с ролью: кнопки объявляются группой, а не
   набором случайных кнопок над полем. */
[data-vibeui-block="textarea-004"] [data-part="toolbar"]{
display:flex;align-items:center;gap:0.125rem;
padding:0.25rem;background:var(--vibeui-textarea-004-bar);
border-bottom:1px solid var(--vibeui-textarea-004-border);
}
[data-vibeui-block="textarea-004"] button{
appearance:none;cursor:pointer;flex:none;
min-width:1.75rem;height:1.75rem;padding:0 0.375rem;
border:0;border-radius:0.375rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="textarea-004"] button:hover{background:color-mix(in oklab,var(--vibeui-textarea-004-accent) 12%,transparent)}
[data-vibeui-block="textarea-004"] button:focus-visible{outline:2px solid var(--vibeui-textarea-004-accent);outline-offset:-2px}
[data-vibeui-block="textarea-004"] [data-part="bold"]{font-weight:800}
[data-vibeui-block="textarea-004"] [data-part="italic"]{font-style:italic;font-family:Georgia,"Times New Roman",serif}
[data-vibeui-block="textarea-004"] [data-part="code"]{font-family:var(--vibeui-textarea-004-mono);font-size:0.75rem}
[data-vibeui-block="textarea-004"] [data-part="sep"]{
width:1px;height:1rem;margin:0 0.25rem;flex:none;
background:var(--vibeui-textarea-004-border);
}
[data-vibeui-block="textarea-004"] textarea{
box-sizing:border-box;width:100%;min-height:6rem;resize:vertical;
margin:0;padding:0.625rem 0.75rem;border:0;
background:var(--vibeui-textarea-004-field);color:inherit;
font:inherit;font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="textarea-004"] textarea:focus{outline:none}
[data-vibeui-block="textarea-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-textarea-004-muted);
}
[data-vibeui-block="textarea-004"] code{
font-family:var(--vibeui-textarea-004-mono);font-size:0.6875rem;
padding:0.0625rem 0.25rem;border-radius:0.25rem;
background:var(--vibeui-textarea-004-bar);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-004"] *{animation:none!important;transition:none!important}}
`

const TOOLS = [
  { part: "bold", wrap: "**", caption: "B", title: "Полужирный" },
  { part: "italic", wrap: "_", caption: "I", title: "Курсив" },
  { part: "code", wrap: "`", caption: "</>", title: "Код" },
]

const START =
  "Компонент ставится **одной командой** и не тянет зависимости.\nВнутри — обычный `textarea`."

/**
 * Поле с панелью форматирования: кнопки оборачивают выделение через setRangeText.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea004({
  label = "Описание релиза",
  placeholder = "Что изменилось в этой версии",
  hint = "Поддерживается разметка markdown",
  accent,
  className,
  style,
  ...props
}: Textarea004Props) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(START)

  const wrap = (marks: string) => {
    const element = field.current
    if (!element) {
      return
    }
    const { selectionStart, selectionEnd } = element
    // setRangeText, а не сборка новой строки: так браузер сохраняет
    // собственную историю отмены и Ctrl+Z продолжает работать.
    element.setRangeText(marks, selectionEnd, selectionEnd, "end")
    element.setRangeText(marks, selectionStart, selectionStart, "start")
    element.setSelectionRange(
      selectionStart + marks.length,
      selectionEnd + marks.length,
    )
    element.focus()
    setValue(element.value)
  }

  const prefixLines = (marks: string) => {
    const element = field.current
    if (!element) {
      return
    }
    const start =
      element.value.lastIndexOf("\n", element.selectionStart - 1) + 1
    element.setRangeText(marks, start, start, "end")
    element.focus()
    setValue(element.value)
  }

  const palette = {
    ...(accent ? { "--vibeui-textarea-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-004"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="shell">
          <div data-part="toolbar" role="toolbar" aria-label="Форматирование">
            {TOOLS.map((tool) => (
              <button
                key={tool.part}
                type="button"
                data-part={tool.part}
                title={tool.title}
                aria-label={tool.title}
                onClick={() => wrap(tool.wrap)}
              >
                {tool.caption}
              </button>
            ))}
            <span data-part="sep" aria-hidden="true" />
            <button
              type="button"
              data-part="list"
              title="Маркированный список"
              aria-label="Маркированный список"
              onClick={() => prefixLines("- ")}
            >
              •—
            </button>
          </div>
          <textarea
            id={id}
            ref={field}
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <p data-part="hint">
          {hint}: <code>**жирный**</code>, <code>_курсив_</code>
        </p>
      </div>
    </>
  )
}
