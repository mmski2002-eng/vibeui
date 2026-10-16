"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, FormEvent } from "react"

export type Error404012Props = Omit<ComponentProps<"section">, "children"> & {
  /** Строки, которые терминал печатает при открытии. */
  intro?: string[]
  /** Ответ на help. */
  helpText?: string
  /** Ответ на неизвестную команду; команда дописывается в начало. */
  unknownText?: string
  homeHref?: string
  inputLabel?: string
  /** Цвет глаза и приглашения. */
  accent?: string
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
}

// Терминал, который заметил гостя: печатает отчёт посимвольно, а рядом
// глаз в треугольнике следит за курсором. Команды настоящие: help, home,
// clear. home уводит по ссылке, остальное отвечает строкой в лог.
const STYLES = `
:where([data-vibeui-block="error-404-012"]){
--vibeui-error-404-012-bg:light-dark(oklch(0.97 0.01 265),oklch(0.18 0.03 265));
--vibeui-error-404-012-fg:light-dark(oklch(0.22 0.03 265),oklch(0.92 0.01 265));
--vibeui-error-404-012-muted:light-dark(oklch(0.5 0.02 265),oklch(0.65 0.02 265));
--vibeui-error-404-012-accent:light-dark(oklch(0.5 0.15 150),oklch(0.86 0.15 150));
--vibeui-error-404-012-font:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-012"]{color-scheme:dark}
[data-vibeui-block="error-404-012"] [data-part="layout"]{
display:grid;gap:2rem;align-items:center;box-sizing:border-box;min-height:26rem;padding:2rem 1.25rem;
background:var(--vibeui-error-404-012-bg);color:var(--vibeui-error-404-012-fg);font-family:var(--vibeui-error-404-012-font);font-size:0.875rem;
}
[data-vibeui-block="error-404-012"] [data-part="eye"]{width:min(60%,14rem);justify-self:center;overflow:visible}
[data-vibeui-block="error-404-012"] [data-part="eye"] :is(path,circle){fill:none;stroke:var(--vibeui-error-404-012-fg);stroke-width:1}
[data-vibeui-block="error-404-012"] [data-part="pupil"]{
fill:var(--vibeui-error-404-012-fg)!important;stroke:none!important;
transform:translate(var(--vibeui-error-404-012-px,0px),var(--vibeui-error-404-012-py,0px));transition:transform .25s ease-out;
}
[data-vibeui-block="error-404-012"] [data-part="lid"]{
fill:var(--vibeui-error-404-012-bg)!important;stroke:none!important;transform-origin:50% 64%;transform:scaleY(0);
animation:vibeui-error-404-012-blink 5s ease-in-out infinite;
}
@keyframes vibeui-error-404-012-blink{0%,94%,100%{transform:scaleY(0)}97%{transform:scaleY(1)}}
[data-vibeui-block="error-404-012"] [data-part="log"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.25rem;min-height:9rem}
[data-vibeui-block="error-404-012"] [data-part="row"]{white-space:pre-wrap;word-break:break-word}
[data-vibeui-block="error-404-012"] [data-part="row"][data-echo]{color:var(--vibeui-error-404-012-muted)}
[data-vibeui-block="error-404-012"] [data-part="prompt"]{display:flex;gap:0.5rem;align-items:center;margin-top:0.75rem}
[data-vibeui-block="error-404-012"] [data-part="caret"]{color:var(--vibeui-error-404-012-accent)}
[data-vibeui-block="error-404-012"] [data-part="input"]{
flex:1;min-width:0;border:0;padding:0;background:transparent;color:inherit;font:inherit;caret-color:var(--vibeui-error-404-012-accent);
}
[data-vibeui-block="error-404-012"] [data-part="input"]:focus-visible{outline:none;box-shadow:0 1px 0 var(--vibeui-error-404-012-accent)}
@container (min-width:44rem){
[data-vibeui-block="error-404-012"] [data-part="layout"]{grid-template-columns:1fr 16rem;padding:3rem}
[data-vibeui-block="error-404-012"] [data-part="eye"]{order:2;width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-012"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-012"]{display:block;background:var(--vibeui-error-404-012-bg)}
[data-vibeui-block="error-404-012"]{width:100%}
`

type Row = { text: string; echo?: boolean }

export function Error404012({
  intro = ["> МАРШРУТ НЕ НАЙДЕН", "> сканирую /404...", "> результатов: 0", "[ ... ] кто-то наблюдает.", "[ ◉ ] привет. наберите help, если заблудились"],
  helpText = "команды: help — эта подсказка, home — на главную, clear — очистить экран",
  unknownText = ": команда не найдена. Попробуйте help",
  homeHref = "/",
  inputLabel = "Команда терминала",
  accent,
  background,
  className,
  style,
  ...props
}: Error404012Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [typed, setTyped] = useState("")
  const [command, setCommand] = useState("")
  const rootRef = useRef<HTMLElement>(null)
  // Ключ вместо массива: дефолтный массив новый на каждом рендере.
  const script = intro.join("\n")

  useEffect(() => {
    const lines = script.split("\n")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setRows(lines.map((text) => ({ text })))
      return
    }
    let line = 0
    let character = 0
    const timer = window.setInterval(() => {
      if (line >= lines.length) return window.clearInterval(timer)
      character += 1
      setTyped(lines[line].slice(0, character))
      if (character >= lines[line].length) {
        const done = lines[line]
        setRows((current) => [...current, { text: done }])
        setTyped("")
        line += 1
        character = 0
      }
    }, 28)
    return () => window.clearInterval(timer)
  }, [script])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const move = (event: PointerEvent) => {
      const box = root.getBoundingClientRect()
      const x = ((event.clientX - box.left) / box.width - 0.5) * 16
      const y = ((event.clientY - box.top) / box.height - 0.5) * 10
      root.style.setProperty("--vibeui-error-404-012-px", `${x}px`)
      root.style.setProperty("--vibeui-error-404-012-py", `${y}px`)
    }
    root.addEventListener("pointermove", move)
    return () => root.removeEventListener("pointermove", move)
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = command.trim().toLowerCase()
    setCommand("")
    if (!value) return
    if (value === "home") return window.location.assign(homeHref)
    if (value === "clear") return setRows([])
    setRows((current) => [
      ...current,
      { text: `> ${value}`, echo: true },
      { text: value === "help" ? helpText : `${value}${unknownText}` },
    ])
  }

  const palette = {
    ...(accent ? { "--vibeui-error-404-012-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        ref={rootRef}
        data-vibeui-block="error-404-012"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <div data-part="layout">
        <svg data-part="eye" viewBox="0 0 200 180" aria-hidden="true">
          <path d="M100 4 196 176H4Z" />
          <circle cx="100" cy="116" r="30" />
          <circle data-part="pupil" cx="100" cy="116" r="12" />
          <rect data-part="lid" x="66" y="82" width="68" height="68" />
        </svg>
        <div>
          <ol data-part="log" aria-live="polite">
            {rows.map((row, index) => (
              <li key={index} data-part="row" data-echo={row.echo || undefined}>
                {row.text}
              </li>
            ))}
            {typed ? <li data-part="row">{typed}</li> : null}
          </ol>
          <form data-part="prompt" onSubmit={submit}>
            <span data-part="caret" aria-hidden="true">
              &gt;
            </span>
            <input
              data-part="input"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              aria-label={inputLabel}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
        </div>
      </section>
    </>
  )
}
