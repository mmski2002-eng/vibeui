"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button021Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  label?: string
  pendingLabel?: string
  errorLabel?: string
  doneLabel?: string
  /** Что делаем по нажатию. Сигнал приходит из внутреннего AbortController. */
  action?: (signal: AbortSignal) => Promise<void>
  accent?: string
}

// Идея компонента: длинное действие, которое может не получиться. Пока запрос
// идёт, кнопка не блокируется, а превращается в «Отмена» и отдаёт AbortSignal;
// после ошибки предлагает повтор и считает попытки. Все четыре подписи лежат
// в одной ячейке grid друг поверх друга, поэтому ширина считается по самой
// длинной из них и не прыгает при смене состояния.
const STYLES = `
:where([data-vibeui-block="button-021"]){
--vibeui-button-021-accent:light-dark(oklch(0.55 0.17 265),oklch(0.63 0.18 265));
--vibeui-button-021-fg:oklch(0.99 0.01 265);
--vibeui-button-021-error:light-dark(oklch(0.55 0.19 25),oklch(0.62 0.2 25));
--vibeui-button-021-done:light-dark(oklch(0.53 0.14 152),oklch(0.6 0.15 152));
--vibeui-button-021-radius:0.625rem;
--vibeui-button-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-021"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;box-sizing:border-box;
border-radius:var(--vibeui-button-021-radius);
background:var(--vibeui-button-021-accent);color:var(--vibeui-button-021-fg);
font-family:var(--vibeui-button-021-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .18s ease,filter .18s ease;
}
[data-vibeui-block="button-021"]:hover{filter:brightness(0.96)}
[data-vibeui-block="button-021"]:focus-visible{outline:2px solid var(--vibeui-button-021-accent);outline-offset:2px}
[data-vibeui-block="button-021"][data-state="error"]{background:var(--vibeui-button-021-error)}
[data-vibeui-block="button-021"][data-state="done"]{background:var(--vibeui-button-021-done)}
/* Подписи стоят друг на друге: ширина берётся по самой длинной. */
[data-vibeui-block="button-021"] [data-part="stack"]{display:grid;align-items:center;justify-items:center}
[data-vibeui-block="button-021"] [data-part="stack"] > span{grid-area:1 / 1;white-space:nowrap}
[data-vibeui-block="button-021"] [data-part="stack"] > span[data-active="false"]{visibility:hidden}
[data-vibeui-block="button-021"] [data-part="count"]{opacity:.75;font-variant-numeric:tabular-nums}
[data-vibeui-block="button-021"] [data-part="spinner"]{
flex:none;width:0.875rem;height:0.875rem;box-sizing:border-box;
border:2px solid oklch(1 0 0 / 40%);border-top-color:currentColor;border-radius:9999px;
animation:vibeui-button-021-spin .7s linear infinite;
}
[data-vibeui-block="button-021"] [data-part="bang"]{
flex:none;width:0.875rem;height:0.875rem;border-radius:9999px;
background:oklch(1 0 0 / 25%);position:relative;
}
[data-vibeui-block="button-021"] [data-part="bang"]::after{
content:"";position:absolute;left:50%;top:0.1875rem;width:2px;height:0.5rem;
margin-left:-1px;border-radius:1px;
background:currentColor;box-shadow:0 0.1875rem 0 currentColor;
}
[data-vibeui-block="button-021"] [data-part="tick"]{
flex:none;width:0.3125rem;height:0.5625rem;margin-bottom:0.125rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
@keyframes vibeui-button-021-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-021"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-021"] [data-part="spinner"]{border-top-color:oklch(1 0 0 / 40%);border-left-color:currentColor}
}
`

type State = "idle" | "pending" | "error" | "done"

/**
 * Кнопка длинного действия с отменой и повтором после ошибки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button021({
  label = "Синхронизировать",
  pendingLabel = "Отмена",
  errorLabel = "Повторить",
  doneLabel = "Готово",
  action,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button021Props) {
  const [state, setState] = useState<State>("idle")
  const [attempt, setAttempt] = useState(0)
  const controller = useRef<AbortController | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tries = useRef(0)

  useEffect(
    () => () => {
      controller.current?.abort()
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  // Витринная заглушка: первая попытка падает, вторая проходит — иначе
  // состояние ошибки на превью никто не увидит.
  const demo = (signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      tries.current += 1
      const fails = tries.current % 2 === 1
      const id = setTimeout(
        () => (fails ? reject(new Error("demo")) : resolve()),
        1500,
      )
      signal.addEventListener("abort", () => {
        clearTimeout(id)
        reject(new Error("aborted"))
      })
    })

  const press = async () => {
    if (state === "pending") {
      controller.current?.abort()
      return
    }

    const local = new AbortController()
    controller.current = local
    setState("pending")

    try {
      await (action ?? demo)(local.signal)
      if (local.signal.aborted) return
      setAttempt(0)
      setState("done")
      timer.current = setTimeout(() => setState("idle"), 2000)
    } catch {
      if (local.signal.aborted) {
        setState("idle")
        return
      }
      setAttempt((value) => value + 1)
      setState("error")
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-button-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-021" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-021"
        data-state={state}
        className={className}
        style={palette}
        aria-busy={state === "pending"}
        onClick={press}
      >
        {state === "pending" ? (
          <span data-part="spinner" aria-hidden="true" />
        ) : null}
        {state === "error" ? (
          <span data-part="bang" aria-hidden="true" />
        ) : null}
        {state === "done" ? <span data-part="tick" aria-hidden="true" /> : null}
        <span data-part="stack" aria-live="polite">
          <span data-active={String(state === "idle")}>{label}</span>
          <span data-active={String(state === "pending")}>{pendingLabel}</span>
          <span data-active={String(state === "error")}>
            {errorLabel}
            {attempt > 1 ? <span data-part="count"> · {attempt}</span> : null}
          </span>
          <span data-active={String(state === "done")}>{doneLabel}</span>
        </span>
      </button>
    </>
  )
}
