"use client"

import { useEffect, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEventHandler,
} from "react"

export type Button061Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onClick"
> & {
  children?: string
  /** Что именно выполняется: строка над таймером. */
  task?: string
  /** Операция идёт. Управляется снаружи: компонент ничего не выполняет. */
  running?: boolean
  /** Секунды, после которых операция считается затянувшейся. */
  slowAfter?: number
  slowHint?: string
  onCancel?: MouseEventHandler<HTMLButtonElement>
  accent?: string
}

// Идея компонента: отмена длительной операции с честным таймером. Кнопка
// «Отменить» рядом с прошедшим временем отвечает на вопрос «оно вообще
// живо?» — а после порога slowAfter плашка меняет тон и добавляет строку
// про задержку, чтобы отмена перестала выглядеть паникой. Время считает
// сам компонент, работу — приложение.
const STYLES = `
:where([data-vibeui-block="button-061"]){
--vibeui-button-061-surface:oklch(1 0 0);
--vibeui-button-061-border:oklch(0.89 0.006 265);
--vibeui-button-061-fg:oklch(0.26 0.02 265);
--vibeui-button-061-muted:oklch(0.56 0.014 265);
--vibeui-button-061-accent:oklch(0.55 0.16 250);
--vibeui-button-061-warn:oklch(0.62 0.15 70);
--vibeui-button-061-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-061-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="button-061"]{
display:flex;align-items:center;gap:0.75rem;box-sizing:border-box;
width:100%;max-width:23rem;padding:0.625rem 0.625rem 0.625rem 0.875rem;
border:1px solid var(--vibeui-button-061-border);border-radius:0.875rem;
background:var(--vibeui-button-061-surface);color:var(--vibeui-button-061-fg);
font-family:var(--vibeui-button-061-font);
transition:border-color .2s ease,background-color .2s ease;
}
[data-vibeui-block="button-061"][data-slow="true"]{
border-color:var(--vibeui-button-061-warn);
background:color-mix(in oklab,var(--vibeui-button-061-warn) 7%,var(--vibeui-button-061-surface));
}
[data-vibeui-block="button-061"] [data-part="spinner"]{
flex:none;width:1.125rem;height:1.125rem;border-radius:50%;
border:2px solid color-mix(in oklab,var(--vibeui-button-061-accent) 25%,transparent);
border-top-color:var(--vibeui-button-061-accent);
animation:vibeui-button-061-spin .9s linear infinite;
}
[data-vibeui-block="button-061"][data-slow="true"] [data-part="spinner"]{
border-color:color-mix(in oklab,var(--vibeui-button-061-warn) 30%,transparent);
border-top-color:var(--vibeui-button-061-warn);
}
[data-vibeui-block="button-061"][data-running="false"] [data-part="spinner"]{
animation:none;border-top-color:var(--vibeui-button-061-muted);
}
@keyframes vibeui-button-061-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="button-061"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0;flex:1}
[data-vibeui-block="button-061"] [data-part="task"]{
font-size:0.875rem;font-weight:650;line-height:1.2;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="button-061"] [data-part="meta"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-button-061-muted);
}
[data-vibeui-block="button-061"] [data-part="clock"]{
font-family:var(--vibeui-button-061-mono);font-variant-numeric:tabular-nums;
letter-spacing:0.02em;
}
[data-vibeui-block="button-061"][data-slow="true"] [data-part="meta"]{color:var(--vibeui-button-061-warn)}
[data-vibeui-block="button-061"] [data-part="cancel"]{
appearance:none;cursor:pointer;flex:none;
height:2.125rem;padding:0 0.875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-button-061-border);
background:transparent;color:var(--vibeui-button-061-fg);
font:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
transition:border-color .16s ease,color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-061"] [data-part="cancel"]:hover:not(:disabled){
border-color:var(--vibeui-button-061-warn);color:var(--vibeui-button-061-warn);
background:color-mix(in oklab,var(--vibeui-button-061-warn) 10%,transparent);
}
[data-vibeui-block="button-061"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-button-061-warn);outline-offset:2px}
[data-vibeui-block="button-061"] [data-part="cancel"]:disabled{cursor:not-allowed;opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-061"] *{animation:none!important;transition:none!important}}
`

function clock(seconds: number) {
  const minutes = Math.floor(seconds / 60)

  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

/**
 * Отмена длительной операции с прошедшим временем и порогом «дольше обычного».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button061({
  children = "Отменить",
  task = "Импортируем 4 210 строк",
  running = true,
  slowAfter = 20,
  slowHint = "дольше обычного",
  onCancel,
  accent,
  className,
  style,
  ...props
}: Button061Props) {
  // В состоянии лежит отметка запуска вместе с числом секунд: сбрасывать
  // счётчик отдельным вызовом из эффекта нельзя, а по паре видно, относится
  // ли прошлое значение к текущему запуску.
  const [tick, setTick] = useState<{ startedAt: number; seconds: number }>({
    startedAt: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!running) return

    const startedAt = Date.now()

    const timer = window.setInterval(() => {
      setTick({
        startedAt,
        seconds: Math.round((Date.now() - startedAt) / 1000),
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  const seconds = running ? tick.seconds : 0

  const slow = running && seconds >= slowAfter

  const palette = {
    ...(accent ? { "--vibeui-button-061-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-061" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-061"
        data-running={String(running)}
        data-slow={String(slow)}
        className={className}
        style={palette}
      >
        <span data-part="spinner" aria-hidden="true" />
        <span data-part="text">
          <span data-part="task">{task}</span>
          <span data-part="meta">
            <span data-part="clock">{clock(seconds)}</span>
            {slow ? <span data-part="slow">· {slowHint}</span> : null}
          </span>
        </span>
        <button
          type="button"
          data-part="cancel"
          disabled={!running}
          onClick={onCancel}
        >
          {children}
        </button>
      </div>
    </>
  )
}
