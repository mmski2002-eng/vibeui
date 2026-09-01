"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button017Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  label?: string
  pendingLabel?: string
  doneLabel?: string
  /** Что делаем по нажатию. По умолчанию — задержка для витрины. */
  action?: () => Promise<void>
  accent?: string
}

// Идея компонента: кнопка отправки, которую нельзя нажать дважды. Повторный
// клик по «Отправить» — самая частая причина дублей в базе, поэтому кнопка
// блокируется на время работы и объявляет ход дела через aria-live. Ширина
// зафиксирована по самой длинной подписи: смена текста не должна её дёргать.
const STYLES = `
:where([data-vibeui-block="button-017"]){
--vibeui-button-017-accent:oklch(0.55 0.17 265);
--vibeui-button-017-fg:oklch(0.99 0.01 265);
--vibeui-button-017-done:oklch(0.55 0.15 152);
--vibeui-button-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-017"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
/* Ширина по самой длинной подписи: смена текста не дёргает раскладку. */
min-width:10.5rem;height:2.5rem;padding:0 1rem;box-sizing:border-box;
border-radius:0.625rem;
background:var(--vibeui-button-017-accent);color:var(--vibeui-button-017-fg);
font-family:var(--vibeui-button-017-font);font-size:0.875rem;font-weight:650;line-height:1;
}
[data-vibeui-block="button-017"]:hover:not(:disabled){filter:brightness(0.96)}
[data-vibeui-block="button-017"]:focus-visible{outline:2px solid var(--vibeui-button-017-accent);outline-offset:2px}
[data-vibeui-block="button-017"]:disabled{cursor:progress;opacity:.85}
[data-vibeui-block="button-017"][data-state="done"]{background:var(--vibeui-button-017-done);cursor:default;opacity:1}
[data-vibeui-block="button-017"] [data-part="spinner"]{
flex:none;width:0.875rem;height:0.875rem;box-sizing:border-box;
border:2px solid oklch(1 0 0 / 45%);border-top-color:currentColor;border-radius:9999px;
animation:vibeui-button-017-spin .7s linear infinite;
}
@keyframes vibeui-button-017-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="button-017"] [data-part="tick"]{
flex:none;width:0.3125rem;height:0.5625rem;margin-bottom:0.125rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-017"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-017"] [data-part="spinner"]{border-top-color:oklch(1 0 0 / 45%);border-left-color:currentColor}
}
`

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 1400))

/**
 * Кнопка отправки, которую нельзя нажать дважды.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button017({
  label = "Отправить заявку",
  pendingLabel = "Отправляем…",
  doneLabel = "Отправлено",
  action = wait,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button017Props) {
  const [state, setState] = useState<"idle" | "pending" | "done">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const palette = {
    ...(accent ? { "--vibeui-button-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  const run = async () => {
    if (state !== "idle") return
    setState("pending")
    await action()
    setState("done")
    timer.current = setTimeout(() => setState("idle"), 2200)
  }

  return (
    <>
      <style href="vibeui-button-017" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-017"
        data-state={state}
        className={className}
        style={palette}
        disabled={state === "pending"}
        aria-busy={state === "pending"}
        onClick={run}
      >
        {state === "pending" ? (
          <span data-part="spinner" aria-hidden="true" />
        ) : null}
        {state === "done" ? <span data-part="tick" aria-hidden="true" /> : null}
        <span aria-live="polite">
          {state === "pending"
            ? pendingLabel
            : state === "done"
              ? doneLabel
              : label}
        </span>
      </button>
    </>
  )
}
