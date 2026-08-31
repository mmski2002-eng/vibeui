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
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки редактора — их закрывают. Крестик живёт внутри
// вкладки отдельной кнопкой, поэтому сама вкладка остаётся ролью tab, а закрытие
// не срабатывает по ошибке при переключении. У несохранённого файла крестик
// заменяется точкой, чтобы правки нельзя было потерять одним промахом.
const STYLES = `
:where([data-vibeui-block="tabs-009"]){
--vibeui-tabs-009-bg:oklch(1 0 0);
--vibeui-tabs-009-strip:oklch(0.96 0.003 265);
--vibeui-tabs-009-fg:oklch(0.22 0.014 265);
--vibeui-tabs-009-muted:oklch(0.55 0.014 265);
--vibeui-tabs-009-border:oklch(0.91 0.006 265);
--vibeui-tabs-009-hover:oklch(0.55 0.02 265 / 9%);
--vibeui-tabs-009-dirty:oklch(0.72 0.15 75);
--vibeui-tabs-009-accent:oklch(0.55 0.2 262);
--vibeui-tabs-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tabs-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
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
 * Вкладки редактора с закрытием и меткой несохранённого файла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs009({
  files = DEFAULT_FILES,
  defaultId,
  accent,
  className,
  style,
}: Tabs009Props) {
  const [open, setOpen] = useState(files)
  const [active, setActive] = useState(defaultId ?? files[0]?.id)
  const listRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-tabs-009-accent": accent } : null),
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
      <div data-vibeui-block="tabs-009" className={className} style={palette}>
        <div
          data-part="list"
          role="tablist"
          aria-label="Открытые файлы"
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
              {file.dirty ? <span data-part="dot" aria-hidden="true" /> : null}
              <button
                type="button"
                data-part="close"
                data-dirty={file.dirty ? "true" : undefined}
                tabIndex={-1}
                aria-label={`Закрыть ${file.label}`}
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
          <p data-part="empty">Все вкладки закрыты</p>
        )}
      </div>
    </>
  )
}
