"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  placeholder?: string
  shortcut?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: сочетание клавиш показано прямо в поле и оно же работает.
// Подсказка вида «⌘K», которая ничего не нажимает, — обман; здесь клавиша
// действительно уводит фокус в поле, а Escape очищает и отпускает его.
// Значок сочетания прячется, как только в поле встал курсор: он больше
// не нужен и мешает читать набранное.
const STYLES = `
:where([data-vibeui-block="input-009"]){
--vibeui-input-009-surface:oklch(1 0 0);
--vibeui-input-009-shell:oklch(0.91 0.006 265);
--vibeui-input-009-fg:oklch(0.23 0.014 265);
--vibeui-input-009-muted:oklch(0.55 0.014 265);
--vibeui-input-009-field:oklch(0.98 0.002 265);
--vibeui-input-009-border:oklch(0.89 0.008 265);
--vibeui-input-009-accent:oklch(0.55 0.17 265);
--vibeui-input-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-009"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-009-surface);
border:1px solid var(--vibeui-input-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-009-font);color:var(--vibeui-input-009-fg);
}
[data-vibeui-block="input-009"] *{box-sizing:border-box}
[data-vibeui-block="input-009"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.4375rem 0 0.75rem;
background:var(--vibeui-input-009-field);
border:1px solid var(--vibeui-input-009-border);border-radius:999px;
transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-009"] [data-part="frame"]:focus-within{
background:var(--vibeui-input-009-surface);
border-color:var(--vibeui-input-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-009-accent) 16%,transparent);
}
[data-vibeui-block="input-009"] [data-part="lens"]{flex:none;color:var(--vibeui-input-009-muted)}
[data-vibeui-block="input-009"] [data-part="lens"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="input-009"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-009"] input:focus{outline:none}
/* Клавиша нарисована <kbd>: это ровно тот тег, который значит «нажми». */
[data-vibeui-block="input-009"] kbd{
flex:none;display:inline-flex;align-items:center;gap:0.0625rem;
height:1.375rem;padding:0 0.4375rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-input-009-border);
border-bottom-width:2px;
background:var(--vibeui-input-009-surface);
font-family:inherit;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-input-009-muted);
}
[data-vibeui-block="input-009"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;
width:1.625rem;height:1.625rem;display:grid;place-items:center;
border:0;border-radius:999px;background:transparent;
color:var(--vibeui-input-009-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-009"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-input-009-fg) 8%,transparent);
color:var(--vibeui-input-009-fg);
}
[data-vibeui-block="input-009"] [data-part="clear"]:focus-visible{
outline:2px solid var(--vibeui-input-009-accent);outline-offset:1px;
}
[data-vibeui-block="input-009"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="input-009"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-009-muted);
}
[data-vibeui-block="input-009"] [data-part="note"] kbd{
height:1.125rem;padding:0 0.3125rem;font-size:0.625rem;border-bottom-width:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-009"] *{animation:none!important;transition:none!important}}
`

// Платформа не меняется, поэтому подписка пустая: нужен только снимок.
const watchPlatform = () => () => {}
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform)
const isServer = () => false

/**
 * Поиск с рабочим сочетанием клавиш: подсказка в поле действительно нажимается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input009({
  placeholder = "Поиск по компонентам",
  shortcut = "K",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input009Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState("")
  // Модификатор читается через useSyncExternalStore: на сервере платформы нет,
  // и серверный снимок обязан вернуть то же, что первый клиентский рендер, —
  // иначе гидратация ломается.
  const apple = useSyncExternalStore(watchPlatform, isApple, isServer)

  useEffect(() => {
    const key = shortcut.toLowerCase()

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key) {
        event.preventDefault()
        field.current?.focus()
        field.current?.select()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut])

  const palette = {
    ...(accent ? { "--vibeui-input-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  const push = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-input-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-009"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <span data-part="lens" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={field}
            id={id}
            type="search"
            placeholder={placeholder}
            aria-label={placeholder}
            aria-describedby={`${id}-note`}
            value={value}
            onChange={(event) => push(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                if (value) push("")
                else field.current?.blur()
              }
            }}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label="Очистить запрос"
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
              >
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <kbd aria-hidden="true">
              {apple ? "⌘" : "Ctrl"} {shortcut}
            </kbd>
          )}
        </div>
        <p data-part="note" id={`${id}-note`}>
          Нажмите{" "}
          <kbd>
            {apple ? "⌘" : "Ctrl"} {shortcut}
          </kbd>{" "}
          откуда угодно, <kbd>Esc</kbd> — очистить.
        </p>
      </div>
    </>
  )
}
