"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  placeholder?: string
  shortcut?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-input-009-surface:transparent;
/* Клавиша и поле в фокусе поднимаются над подложкой, поэтому их цвет
   непрозрачный и живёт отдельно от surface. */
--vibeui-input-009-panel:light-dark(oklch(1 0 0),oklch(0.31 0 265));
--vibeui-input-009-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-009-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-009-muted:color-mix(in oklab,var(--vibeui-input-009-fg) 68%,transparent);
--vibeui-input-009-field:light-dark(oklch(0.98 0 265),oklch(0.26 0 265));
--vibeui-input-009-border:light-dark(oklch(0.89 0 265),oklch(0.42 0 265));
--vibeui-input-009-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-input-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-009"]{color-scheme:dark}
[data-vibeui-block="input-009"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;
font-family:var(--vibeui-input-009-font);color:var(--vibeui-input-009-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-009"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-009-surface);
border:1px solid var(--vibeui-input-009-shell);border-radius:0.875rem;
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
background:var(--vibeui-input-009-panel);
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
/* У поля своя кнопка очистки — вебкитовская встала бы второй рядом с ней. */
[data-vibeui-block="input-009"] input::-webkit-search-cancel-button{display:none}
/* Клавиша нарисована <kbd>: это ровно тот тег, который значит «нажми». */
[data-vibeui-block="input-009"] kbd{
flex:none;display:inline-flex;align-items:center;gap:0.0625rem;
height:1.375rem;padding:0 0.4375rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-input-009-border);
border-bottom-width:2px;
background:var(--vibeui-input-009-panel);
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

const TEXT = {
  clear: "Очистить запрос",
  escape: "Esc",
  hint: "Нажмите {key} откуда угодно, {esc} — очистить.",
}

// Платформа не меняется, поэтому подписка пустая: нужен только снимок.
const watchPlatform = () => () => {}
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform)
const isServer = () => false

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поиск с рабочим сочетанием клавиш: подсказка в поле действительно нажимается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input009({
  placeholder = "Поиск по компонентам",
  shortcut = "K",
  text,
  background = "",
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

  const copy = { ...TEXT, ...text }
  const combo = `${apple ? "⌘" : "Ctrl"} ${shortcut}`

  const palette = {
    ...(accent ? { "--vibeui-input-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="input"
        data-vibeui-block="input-009"
        data-surface={background ? "on" : undefined}
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
              aria-label={copy.clear}
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
            <kbd aria-hidden="true">{combo}</kbd>
          )}
        </div>
        <p data-part="note" id={`${id}-note`}>
          {copy.hint.split(/(\{key\}|\{esc\})/).map((part, index) => {
            if (part === "{key}") return <kbd key={index}>{combo}</kbd>
            if (part === "{esc}") return <kbd key={index}>{copy.escape}</kbd>
            return part
          })}
        </p>
      </div>
    </>
  )
}
