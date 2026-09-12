"use client"

import { useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Tabs009File = {
  id: string
  label: string
  dirty?: boolean
  text?: string
}

export type Tabs009Props = {
  files?: Tabs009File[]
  defaultId?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись ряда вкладок для скринридера. */
  listLabel?: string
  /** Что скринридер читает вместо точки несохранённого файла. */
  dirtyLabel?: string
  /** Шаблон подписи кнопки закрытия: {label}. */
  closeLabel?: string
  /** Что показать, когда закрыты все вкладки. */
  emptyText?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки редактора — их закрывают. Крестик живёт внутри
// вкладки отдельной кнопкой, поэтому сама вкладка остаётся ролью tab, а закрытие
// не срабатывает по ошибке при переключении. У несохранённого файла крестик
// заменяется точкой, чтобы правки нельзя было потерять одним промахом.
//
// Тема берётся из color-scheme окружения через light-dark(): активная вкладка
// повторяет подложку панели, а неактивные лежат на своей полосе.
const STYLES = `
:where([data-vibeui-block="tabs-009"]){
--vibeui-tabs-009-bg:transparent;
--vibeui-tabs-009-strip:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-tabs-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-tabs-009-muted:color-mix(in oklab,var(--vibeui-tabs-009-fg) 68%,transparent);
--vibeui-tabs-009-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-tabs-009-hover:light-dark(oklch(0.55 0 265 / 9%),oklch(0.85 0 265 / 14%));
--vibeui-tabs-009-dirty:light-dark(oklch(0.33 0 0),oklch(0.912 0 0));
--vibeui-tabs-009-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-tabs-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tabs-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-009"]{color-scheme:dark}
[data-vibeui-block="tabs-009"]{
box-sizing:border-box;width:100%;max-width:30rem;overflow:hidden;
background:var(--vibeui-tabs-009-bg);color:var(--vibeui-tabs-009-fg);
border:1px solid var(--vibeui-tabs-009-border);border-radius:0.75rem;
font-family:var(--vibeui-tabs-009-font);
}
[data-vibeui-block="tabs-009"] [data-part="list"]{
display:flex;gap:1px;overflow-x:auto;scrollbar-width:none;
background:var(--vibeui-tabs-009-strip);
border-bottom:1px solid var(--vibeui-tabs-009-border);
}
[data-vibeui-block="tabs-009"] [data-part="list"]::-webkit-scrollbar{display:none}
[data-vibeui-block="tabs-009"] [data-part="tab"]{
position:relative;
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.5rem 0.5rem 0.5rem 0.75rem;white-space:nowrap;
background:var(--vibeui-tabs-009-strip);color:var(--vibeui-tabs-009-muted);
font-family:var(--vibeui-tabs-009-mono);font-size:0.75rem;
border-top:2px solid transparent;
}
[data-vibeui-block="tabs-009"] [data-part="tab"]:hover{color:var(--vibeui-tabs-009-fg)}
[data-vibeui-block="tabs-009"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-009-accent);outline-offset:-2px}
[data-vibeui-block="tabs-009"] [data-part="tab"][aria-selected="true"]{
background:var(--vibeui-tabs-009-bg);color:var(--vibeui-tabs-009-fg);
border-top-color:var(--vibeui-tabs-009-accent);
}
[data-vibeui-block="tabs-009"] [data-part="close"]{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;flex:none;border-radius:0.25rem;
display:grid;place-items:center;
font:inherit;font-size:0.75rem;line-height:1;color:var(--vibeui-tabs-009-muted);
}
[data-vibeui-block="tabs-009"] [data-part="close"]:hover{background:var(--vibeui-tabs-009-hover);color:var(--vibeui-tabs-009-fg)}
[data-vibeui-block="tabs-009"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-tabs-009-accent);outline-offset:-2px}
/* Несохранённый файл: точка вместо крестика, пока на вкладку не навели. */
[data-vibeui-block="tabs-009"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:999px;background:var(--vibeui-tabs-009-dirty);
}
/* Точка — единственный признак несохранённого файла, а она aria-hidden.
   Подпись рядом с ней озвучивает то же состояние, не занимая места. */
[data-vibeui-block="tabs-009"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="tabs-009"] [data-part="tab"]:hover [data-part="dot"],
[data-vibeui-block="tabs-009"] [data-part="tab"]:focus-within [data-part="dot"]{display:none}
[data-vibeui-block="tabs-009"] [data-part="tab"] [data-part="close"][data-dirty="true"]{display:none}
[data-vibeui-block="tabs-009"] [data-part="tab"]:hover [data-part="close"][data-dirty="true"],
[data-vibeui-block="tabs-009"] [data-part="tab"]:focus-within [data-part="close"][data-dirty="true"]{display:grid}
[data-vibeui-block="tabs-009"] [data-part="panel"]{
padding:0.875rem;font-family:var(--vibeui-tabs-009-mono);font-size:0.75rem;line-height:1.7;
color:var(--vibeui-tabs-009-muted);white-space:pre-wrap;margin:0;
}
[data-vibeui-block="tabs-009"] [data-part="panel"]:focus-visible{outline:2px solid var(--vibeui-tabs-009-accent);outline-offset:-3px;border-radius:0.5rem}
[data-vibeui-block="tabs-009"] [data-part="empty"]{
padding:1.5rem 0.875rem;text-align:center;font-size:0.8125rem;color:var(--vibeui-tabs-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILES: Tabs009File[] = [
  {
    id: "page",
    label: "page.tsx",
    text: "export default function Page() {\n  return <main>Главная</main>\n}",
  },
  {
    id: "layout",
    label: "layout.tsx",
    dirty: true,
    text: "export const metadata = {\n  title: 'Полотно',\n}",
  },
  {
    id: "styles",
    label: "globals.css",
    text: ":root {\n  color-scheme: light;\n}",
  },
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
 * Вкладки редактора с закрытием и меткой несохранённого файла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs009({
  files = DEFAULT_FILES,
  defaultId,
  background = "",
  accent,
  listLabel = "Открытые файлы",
  dirtyLabel = "не сохранён",
  closeLabel = "Закрыть {label}",
  emptyText = "Все вкладки закрыты",
  className,
  style,
  ...props
}: Tabs009Props) {
  const [open, setOpen] = useState(files)
  const [active, setActive] = useState(defaultId ?? files[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const index = Math.max(
    0,
    open.findIndex((file) => file.id === active),
  )

  // Закрытая вкладка отдаёт выбор соседу слева: так фокус остаётся в ряду,
  // а не улетает в начало документа.
  function close(id: string) {
    const position = open.findIndex((file) => file.id === id)
    const rest = open.filter((file) => file.id !== id)

    setOpen(rest)

    if (id === active) {
      setActive(rest[Math.max(position - 1, 0)]?.id)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]

    if (!keys.includes(event.key) || open.length === 0) {
      return
    }

    event.preventDefault()

    const last = open.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowLeft"
            ? (index - 1 + open.length) % open.length
            : (index + 1) % open.length

    setActive(open[next].id)
    listRef.current
      ?.querySelectorAll<HTMLDivElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = open.find((file) => file.id === active)

  return (
    <>
      <style href="vibeui-tabs-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-009"
        className={className}
        style={palette}
      >
        <div
          data-part="list"
          role="tablist"
          aria-label={listLabel}
          ref={listRef}
          onKeyDown={onKeyDown}
        >
          {open.map((file) => (
            <div
              key={file.id}
              data-part="tab"
              role="tab"
              id={`vibeui-tabs-009-${file.id}-tab`}
              aria-selected={file.id === active}
              aria-controls="vibeui-tabs-009-panel"
              tabIndex={file.id === active ? 0 : -1}
              onClick={() => setActive(file.id)}
            >
              {file.label}
              {file.dirty ? (
                <>
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="sr">{dirtyLabel}</span>
                </>
              ) : null}
              <button
                type="button"
                data-part="close"
                data-dirty={file.dirty ? "true" : undefined}
                tabIndex={-1}
                aria-label={closeLabel.replace("{label}", file.label)}
                onClick={(event) => {
                  event.stopPropagation()
                  close(file.id)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {current ? (
          <pre
            data-part="panel"
            role="tabpanel"
            id="vibeui-tabs-009-panel"
            aria-labelledby={`vibeui-tabs-009-${current.id}-tab`}
            tabIndex={0}
          >
            {current.text}
          </pre>
        ) : (
          <p data-part="empty">{emptyText}</p>
        )}
      </div>
    </>
  )
}
