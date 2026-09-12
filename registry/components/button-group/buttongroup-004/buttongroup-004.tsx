"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Buttongroup004Tool = {
  id: string
  label: string
}

export type Buttongroup004Props = Omit<ComponentProps<"div">, "children"> & {
  tools?: Buttongroup004Tool[]
  label?: string
  showLabels?: boolean
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель инструментов ведёт себя как один элемент табуляции.
// Внутрь Tab заходит один раз, дальше по кнопкам ходят стрелки, Home и End —
// это roving tabindex, требование паттерна toolbar из WAI-ARIA. Без него
// панель из восьми значков крадёт восемь нажатий Tab у остальной страницы.
const STYLES = `
:where([data-vibeui-block="buttongroup-004"]){
--vibeui-buttongroup-004-surface:transparent;
--vibeui-buttongroup-004-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-004-muted:color-mix(in oklab,var(--vibeui-buttongroup-004-fg) 68%,transparent);
--vibeui-buttongroup-004-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-004-hover:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-buttongroup-004-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-buttongroup-004-radius:0.75rem;
--vibeui-buttongroup-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-004"]{color-scheme:dark}
[data-vibeui-block="buttongroup-004"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.125rem;
padding:0.25rem;
border:1px solid var(--vibeui-buttongroup-004-border);
border-radius:var(--vibeui-buttongroup-004-radius);
background:var(--vibeui-buttongroup-004-surface);
font-family:var(--vibeui-buttongroup-004-font);
box-shadow:0 1px 2px oklch(0.2 0 265 / 6%);
}
[data-vibeui-block="buttongroup-004"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-004"] [data-part="tool"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0.1875rem;
min-width:2rem;height:2rem;padding:0 0.375rem;
border:0;border-radius:0.5rem;background:transparent;
color:var(--vibeui-buttongroup-004-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-004"][data-labels="on"] [data-part="tool"]{height:2.75rem;min-width:2.75rem}
[data-vibeui-block="buttongroup-004"] [data-part="tool"]:hover{
background:var(--vibeui-buttongroup-004-hover);
color:var(--vibeui-buttongroup-004-fg);
}
[data-vibeui-block="buttongroup-004"] [data-part="tool"]:focus-visible{
outline:2px solid var(--vibeui-buttongroup-004-accent);outline-offset:1px;
color:var(--vibeui-buttongroup-004-fg);
}
[data-vibeui-block="buttongroup-004"] [data-part="tool"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="buttongroup-004"] [data-part="text"]{font-size:0.5625rem;font-weight:600;letter-spacing:0.01em}
[data-vibeui-block="buttongroup-004"] [data-part="divider"]{
width:1px;align-self:stretch;margin:0.25rem 0.25rem;
background:var(--vibeui-buttongroup-004-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TOOLS: Buttongroup004Tool[] = [
  { id: "bold", label: "Жирный" },
  { id: "italic", label: "Курсив" },
  { id: "link", label: "Ссылка" },
  { id: "list", label: "Список" },
  { id: "quote", label: "Цитата" },
  { id: "code", label: "Код" },
]

const ICONS: Record<string, string> = {
  bold: "M6 3.5h5a3.25 3.25 0 0 1 0 6.5H6zM6 10h5.5a3.25 3.25 0 0 1 0 6.5H6z",
  italic: "M10 3.5h5m-7 13h5M12.5 3.5l-2.5 13",
  link: "M9 12a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1M11 8a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1",
  list: "M7 5.5h11M7 10h11M7 14.5h11M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01",
  quote:
    "M8 5.5C5.5 6.8 4.5 8.7 4.5 11v3.5h4V10H6.4c.1-1.3.7-2.3 1.9-3zM17 5.5c-2.5 1.3-3.5 3.2-3.5 5.5v3.5h4V10h-2.1c.1-1.3.7-2.3 1.9-3z",
  code: "M8 6.5 3.5 10 8 13.5M14 6.5 18.5 10 14 13.5",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Панель инструментов с roving tabindex: стрелки, Home и End.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup004({
  tools = DEFAULT_TOOLS,
  label = "Форматирование",
  showLabels = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup004Props) {
  const [active, setActive] = useState(0)
  const bar = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function focusAt(next: number) {
    const buttons =
      bar.current?.querySelectorAll<HTMLButtonElement>('[data-part="tool"]')
    setActive(next)
    buttons?.[next]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = tools.length - 1
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0

    if (step !== 0) {
      event.preventDefault()
      focusAt((active + step + tools.length) % tools.length)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      focusAt(0)
    }

    if (event.key === "End") {
      event.preventDefault()
      focusAt(last)
    }
  }

  return (
    <>
      <style href="vibeui-buttongroup-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={bar}
        data-slot="button-group"
        data-vibeui-block="buttongroup-004"
        data-labels={showLabels ? "on" : "off"}
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={className}
        style={palette}
      >
        {tools.map((tool, index) => (
          <span key={tool.id} style={{ display: "contents" }}>
            {index === 3 ? (
              <span data-part="divider" aria-hidden="true" />
            ) : null}
            <button
              type="button"
              data-part="tool"
              tabIndex={index === active ? 0 : -1}
              aria-label={showLabels ? undefined : tool.label}
              onFocus={() => setActive(index)}
            >
              <svg viewBox="0 0 22 20" fill="none" aria-hidden="true">
                <path
                  d={ICONS[tool.id] ?? ICONS.code}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {showLabels ? <span data-part="text">{tool.label}</span> : null}
            </button>
          </span>
        ))}
      </div>
    </>
  )
}
