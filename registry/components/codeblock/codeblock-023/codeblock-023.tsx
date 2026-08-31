"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Codeblock023Props = {
  title?: string
  label?: string
  doneLabel?: string
  commands?: string[]
  className?: string
  style?: CSSProperties
}

// Идея компонента: последовательность команд, которую можно вставить в
// терминал одним куском. Приглашение $ нарисовано в CSS и не существует в
// тексте, поэтому в буфер уходят только сами команды, готовые к запуску.
const STYLES = `
:where([data-vibeui-block="codeblock-023"]){
--vibeui-codeblock-023-bg:oklch(0.18 0.01 160);
--vibeui-codeblock-023-head:oklch(0.22 0.014 160);
--vibeui-codeblock-023-fg:oklch(0.93 0.008 160);
--vibeui-codeblock-023-muted:oklch(0.66 0.014 160);
--vibeui-codeblock-023-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-023-prompt:oklch(0.78 0.15 150);
--vibeui-codeblock-023-accent:oklch(0.84 0.14 150);
--vibeui-codeblock-023-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-023"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-023-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-023-bg);color:var(--vibeui-codeblock-023-fg);
font-family:var(--vibeui-codeblock-023-font);
}
[data-vibeui-block="codeblock-023"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.4375rem 0.5rem 0.4375rem 0.875rem;
background:var(--vibeui-codeblock-023-head);
border-bottom:1px solid var(--vibeui-codeblock-023-border);
font-size:0.75rem;color:var(--vibeui-codeblock-023-muted);
}
[data-vibeui-block="codeblock-023"] button{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-codeblock-023-border);
background:oklch(1 0 0 / 8%);color:var(--vibeui-codeblock-023-fg);
font-family:inherit;font-size:0.6875rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-023"] button:hover{background:oklch(1 0 0 / 14%)}
[data-vibeui-block="codeblock-023"] button:focus-visible{
outline:2px solid var(--vibeui-codeblock-023-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-023"] button[data-copied="true"]{
color:var(--vibeui-codeblock-023-accent);
border-color:var(--vibeui-codeblock-023-accent);
}
[data-vibeui-block="codeblock-023"] svg{width:0.8125rem;height:0.8125rem;flex:none}
[data-vibeui-block="codeblock-023"] pre{margin:0;padding:0.75rem 0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-023"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-023-mono);
font-size:0.8125rem;line-height:1.75;white-space:pre;
}
/* Приглашение живёт только в CSS: в разметке его нет, поэтому ни выделение
   мышью, ни кнопка копирования не могут утащить $ во вставляемую команду. */
[data-vibeui-block="codeblock-023"] [data-part="row"]{
display:block;position:relative;padding-inline-start:1.125rem;
}
[data-vibeui-block="codeblock-023"] [data-part="row"]::before{
content:"$";position:absolute;left:0;
color:var(--vibeui-codeblock-023-prompt);font-weight:700;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
[data-vibeui-block="codeblock-023"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;
border-top:1px solid var(--vibeui-codeblock-023-border);
font-size:0.6875rem;color:var(--vibeui-codeblock-023-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-023"] *{animation:none!important;transition:none!important}}
`

const COMMANDS = [
  "git clone git@github.com:vibeui/starter.git",
  "cd starter",
  "npm install",
  "npm run dev",
]

/** Список команд с копированием без символа приглашения. */
export function Codeblock023({
  title = "Установка",
  label = "Скопировать без $",
  doneLabel = "Скопировано",
  commands = COMMANDS,
  className,
  style,
}: Codeblock023Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands.join("\n"))
    } catch {
      // Буфер недоступен: отметка «скопировано» была бы обманом.
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <style href="vibeui-codeblock-023" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-023"
        className={className}
        style={style}
      >
        <figcaption data-part="head">
          <span>{title}</span>
          <button
            type="button"
            onClick={copy}
            data-copied={copied || undefined}
            aria-label={`${copied ? doneLabel : label} (строк: ${commands.length})`}
          >
            {copied ? (
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M2 6.5 4.6 9 10 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <rect
                  x="4"
                  y="1.5"
                  width="6.5"
                  height="6.5"
                  rx="1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M8 10.5H3a1.5 1.5 0 0 1-1.5-1.5V4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {copied ? doneLabel : label}
          </button>
        </figcaption>
        <pre>
          <code>
            {commands.map((command) => (
              <span key={command} data-part="row">
                {command}
              </span>
            ))}
          </code>
        </pre>
        <p data-part="foot">
          Приглашение нарисовано стилями: в буфер уходят только команды, строка
          за строкой.
        </p>
      </figure>
    </>
  )
}
