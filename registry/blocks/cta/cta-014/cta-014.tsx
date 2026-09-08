"use client"

import { useRef, useState, type CSSProperties } from "react"

export type Cta014Props = {
  eyebrow?: string
  title?: string
  description?: string
  windowTitle?: string
  command?: string
  copyLabel?: string
  copiedLabel?: string
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Команда установки: терминальная плашка с командой npx и кнопкой
// «Копировать». Единственный клиентский блок категории — clipboard без JS
// не бывает. Плашка тёмная в обеих темах: терминал не бывает светло-серым,
// а команда должна читаться как команда, а не как цитата.
const STYLES = `
:where([data-vibeui-block="cta-014"]){
--vibeui-cta-014-bg:transparent;
--vibeui-cta-014-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-014-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-014-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-cta-014-term-bg:oklch(0.2 0 0);
--vibeui-cta-014-term-head:oklch(0.26 0 0);
--vibeui-cta-014-term-ink:oklch(0.93 0 0);
--vibeui-cta-014-term-muted:oklch(0.65 0 0);
--vibeui-cta-014-term-border:oklch(0.32 0 0);
--vibeui-cta-014-ok:light-dark(oklch(0.55 0.15 150),oklch(0.75 0.15 150));
--vibeui-cta-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-014-mono:ui-monospace,"Cascadia Code","Source Code Pro",Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-014"]{color-scheme:dark}
[data-vibeui-block="cta-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-014-bg);color:var(--vibeui-cta-014-ink);
font-family:var(--vibeui-cta-014-font);
}
[data-vibeui-block="cta-014"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-014"] [data-part="eyebrow"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-014-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="cta-014"] [data-part="title"]{
margin:0 auto 0.875rem;max-width:22ch;
font-size:clamp(1.625rem,5.5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-014"] [data-part="description"]{
margin:0 auto 1.75rem;max-width:48ch;
color:var(--vibeui-cta-014-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-014"] [data-part="terminal"]{
text-align:left;border-radius:0.875rem;overflow:hidden;
border:1px solid var(--vibeui-cta-014-term-border);
background:var(--vibeui-cta-014-term-bg);
}
[data-vibeui-block="cta-014"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.875rem;background:var(--vibeui-cta-014-term-head);
}
[data-vibeui-block="cta-014"] [data-part="dot"]{
width:0.625rem;height:0.625rem;border-radius:999px;
background:var(--vibeui-cta-014-term-muted);opacity:0.55;
}
[data-vibeui-block="cta-014"] [data-part="window-title"]{
margin:0 auto 0 0.25rem;color:var(--vibeui-cta-014-term-muted);
font-size:0.75rem;font-weight:600;letter-spacing:0.04em;
}
[data-vibeui-block="cta-014"] [data-part="copy-button"]{
padding:0.3125rem 0.75rem;border:1px solid var(--vibeui-cta-014-term-border);
border-radius:0.5rem;cursor:pointer;
background:transparent;color:var(--vibeui-cta-014-term-ink);
font:inherit;font-size:0.75rem;font-weight:600;
transition:border-color .15s ease,color .15s ease;
}
[data-vibeui-block="cta-014"] [data-part="copy-button"]:hover{border-color:var(--vibeui-cta-014-accent)}
[data-vibeui-block="cta-014"] [data-part="copy-button"][data-copied="true"]{color:var(--vibeui-cta-014-ok)}
[data-vibeui-block="cta-014"] [data-part="copy-button"]:focus-visible{
outline:2px solid var(--vibeui-cta-014-accent);outline-offset:2px;
}
[data-vibeui-block="cta-014"] [data-part="command"]{
margin:0;padding:1.125rem 1rem;
color:var(--vibeui-cta-014-term-ink);
font-family:var(--vibeui-cta-014-mono);font-size:0.875rem;line-height:1.5;
overflow-x:auto;white-space:nowrap;
}
[data-vibeui-block="cta-014"] [data-part="prompt"]{
color:var(--vibeui-cta-014-accent);user-select:none;margin-right:0.5ch;
}
[data-vibeui-block="cta-014"] [data-part="note"]{
margin:1rem auto 0;max-width:46ch;
color:var(--vibeui-cta-014-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="cta-014"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Терминальная плашка с командой установки и кнопкой копирования. */
export function Cta014({
  eyebrow = "Установка",
  title = "Одна команда — и секция в проекте",
  description = "Никаких аккаунтов и загрузок: команда приносит файл компонента прямо в ваш проект, дальше его дорабатывает ваш AI-агент.",
  windowTitle = "Терминал",
  command = "npx shadcn@latest add @vibeui/cta-014",
  copyLabel = "Копировать",
  copiedLabel = "Скопировано",
  note = "Работает в любом проекте с настроенным shadcn/ui.",
  background = "",
  accent,
  className,
  style,
}: Cta014Props) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  const copyCommand = () => {
    if (!navigator.clipboard) {
      return
    }
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    })
  }

  const palette = {
    ...(accent ? { "--vibeui-cta-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="terminal">
            <div data-part="head">
              <span data-part="dot" aria-hidden="true" />
              <span data-part="dot" aria-hidden="true" />
              <span data-part="dot" aria-hidden="true" />
              <span data-part="window-title">{windowTitle}</span>
              <button
                data-part="copy-button"
                type="button"
                data-copied={copied ? "true" : "false"}
                onClick={copyCommand}
              >
                {copied ? copiedLabel : copyLabel}
              </button>
            </div>
            <pre data-part="command">
              <code>
                <span data-part="prompt" aria-hidden="true">
                  $
                </span>
                {command}
              </code>
            </pre>
          </div>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
