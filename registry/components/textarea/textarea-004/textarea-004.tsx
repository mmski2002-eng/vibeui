"use client"

import { Fragment, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  hint?: string
  /** Текст, с которого поле начинает жизнь. */
  defaultValue?: string
  /** Подписи кнопок панели: bold, italic, code, list. */
  toolText?: Record<string, string>
  /** Название панели для скринридера. */
  toolbarLabel?: string
  /** Примеры разметки в строке под полем. */
  examples?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель форматирования над обычным textarea. Богатый
// редактор здесь не нужен — люди пишут в markdown, а кнопки просто
// оборачивают выделение символами. Обёртка сделана через setRangeText:
// он сохраняет историю отмены браузера, чего не делает прямая запись
// в value, и возвращает выделение на место, чтобы можно было жать дальше.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="textarea-004"]){
--vibeui-textarea-004-bg:transparent;
--vibeui-textarea-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-textarea-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-textarea-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-textarea-004-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-textarea-004-bar:light-dark(oklch(0.97 0.003 265),oklch(0.3 0.013 265));
--vibeui-textarea-004-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.16 262));
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
  { part: "bold", wrap: "**", caption: "B" },
  { part: "italic", wrap: "_", caption: "I" },
  { part: "code", wrap: "`", caption: "</>" },
]

const TOOL_TEXT: Record<string, string> = {
  bold: "Полужирный",
  italic: "Курсив",
  code: "Код",
  list: "Маркированный список",
}

const EXAMPLES = ["**жирный**", "_курсив_"]

const START =
  "Компонент ставится **одной командой** и не тянет зависимости.\nВнутри — обычный `textarea`."

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
 * Поле с панелью форматирования: кнопки оборачивают выделение через setRangeText.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea004({
  label = "Описание релиза",
  placeholder = "Что изменилось в этой версии",
  hint = "Поддерживается разметка markdown",
  defaultValue = START,
  toolText = TOOL_TEXT,
  toolbarLabel = "Форматирование",
  examples = EXAMPLES,
  background = "",
  accent,
  className,
  style,
  ...props
}: Textarea004Props) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(defaultValue)

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
    ...(background
      ? {
          "--vibeui-textarea-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          <div data-part="toolbar" role="toolbar" aria-label={toolbarLabel}>
            {TOOLS.map((tool) => {
              const title = toolText[tool.part] ?? TOOL_TEXT[tool.part]

              return (
                <button
                  key={tool.part}
                  type="button"
                  data-part={tool.part}
                  title={title}
                  aria-label={title}
                  onClick={() => wrap(tool.wrap)}
                >
                  {tool.caption}
                </button>
              )
            })}
            <span data-part="sep" aria-hidden="true" />
            <button
              type="button"
              data-part="list"
              title={toolText.list ?? TOOL_TEXT.list}
              aria-label={toolText.list ?? TOOL_TEXT.list}
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
          {hint}:{" "}
          {examples.map((example, index) => (
            <Fragment key={example}>
              {index > 0 ? ", " : null}
              <code>{example}</code>
            </Fragment>
          ))}
        </p>
      </div>
    </>
  )
}
