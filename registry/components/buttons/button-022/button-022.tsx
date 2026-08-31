"use client"

import { useEffect, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Button022Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  label?: string
  holdingLabel?: string
  doneLabel?: string
  /** Сколько держать до подтверждения, мс. */
  hold?: number
  onConfirm?: () => void
  danger?: string
}

// Идея компонента: подтверждение удержанием. Вместо второго клика или
// модального окна кнопку нужно продержать нажатой: заливка ползёт слева
// направо ровно столько, сколько задано в hold, и действие срабатывает
// только в конце. Отпустил раньше — заливка откатывается, ничего не
// произошло. Работает и с клавиатуры: удержание пробела или Enter.
const STYLES = `
:where([data-vibeui-block="button-022"]){
--vibeui-button-022-danger:oklch(0.55 0.19 25);
--vibeui-button-022-fg:oklch(0.99 0.01 25);
--vibeui-button-022-done:oklch(0.53 0.14 152);
--vibeui-button-022-hold:1200ms;
--vibeui-button-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-022"]{
appearance:none;border:0;cursor:pointer;position:relative;overflow:hidden;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:13.5rem;height:2.75rem;padding:0 1.25rem;box-sizing:border-box;
border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-button-022-danger) 22%,oklch(0.16 0.02 25));
color:var(--vibeui-button-022-fg);
font-family:var(--vibeui-button-022-font);font-size:0.875rem;font-weight:650;line-height:1;
touch-action:none;-webkit-user-select:none;user-select:none;
}
[data-vibeui-block="button-022"]:focus-visible{outline:2px solid var(--vibeui-button-022-danger);outline-offset:2px}
/* Заливка едет ровно hold миллисекунд: время удержания видно глазами. */
[data-vibeui-block="button-022"] [data-part="fill"]{
position:absolute;inset:0;transform:scaleX(0);transform-origin:left center;
background:var(--vibeui-button-022-danger);
transition:transform .18s ease-out;
}
[data-vibeui-block="button-022"][data-state="holding"] [data-part="fill"]{
transform:scaleX(1);transition:transform var(--vibeui-button-022-hold) linear;
}
[data-vibeui-block="button-022"][data-state="done"] [data-part="fill"]{
transform:scaleX(1);background:var(--vibeui-button-022-done);transition:none;
}
[data-vibeui-block="button-022"] [data-part="label"]{position:relative;display:inline-flex;align-items:center;gap:0.5rem}
[data-vibeui-block="button-022"] [data-part="lock"]{
flex:none;width:0.6875rem;height:0.5625rem;box-sizing:border-box;position:relative;
border:2px solid currentColor;border-radius:0.125rem;margin-top:0.25rem;
}
[data-vibeui-block="button-022"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;bottom:100%;width:0.5rem;height:0.375rem;
margin-left:-0.25rem;box-sizing:border-box;
border:2px solid currentColor;border-bottom:0;border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="button-022"] [data-part="tick"]{
flex:none;width:0.3125rem;height:0.5625rem;margin-bottom:0.125rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-022"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-022"][data-state="holding"] [data-part="fill"]{transform:scaleX(1)}
}
`

type State = "idle" | "holding" | "done"

/**
 * Кнопка, которая подтверждает действие удержанием, а не вторым кликом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button022({
  label = "Держите, чтобы удалить",
  holdingLabel = "Не отпускайте…",
  doneLabel = "Удалено",
  hold = 1200,
  onConfirm,
  danger,
  type = "button",
  className,
  style,
  ...props
}: Button022Props) {
  const [state, setState] = useState<State>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
      if (reset.current) clearTimeout(reset.current)
    },
    [],
  )

  const start = () => {
    if (state !== "idle") return
    setState("holding")
    timer.current = setTimeout(() => {
      setState("done")
      onConfirm?.()
      reset.current = setTimeout(() => setState("idle"), 1600)
    }, hold)
  }

  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    setState((current) => (current === "holding" ? "idle" : current))
  }

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return
    event.preventDefault()
    if (event.repeat) return
    start()
  }

  const keyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return
    stop()
  }

  const palette = {
    "--vibeui-button-022-hold": `${hold}ms`,
    ...(danger ? { "--vibeui-button-022-danger": danger } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-022" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-022"
        data-state={state}
        className={className}
        style={palette}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={keyDown}
        onKeyUp={keyUp}
      >
        <span data-part="fill" aria-hidden="true" />
        <span data-part="label">
          {state === "done" ? (
            <span data-part="tick" aria-hidden="true" />
          ) : (
            <span data-part="lock" aria-hidden="true" />
          )}
          <span aria-live="polite">
            {state === "holding"
              ? holdingLabel
              : state === "done"
                ? doneLabel
                : label}
          </span>
        </span>
      </button>
    </>
  )
}
