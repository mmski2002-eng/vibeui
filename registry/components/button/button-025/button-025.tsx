"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button025Props = Omit<ComponentProps<"button">, "children"> & {
  label?: string
  /** Сочетание: «mod» — Cmd на macOS и Ctrl на остальных. Например «mod+s». */
  combo?: string
  onAction?: () => void
  accent?: string
}

// Идея компонента: кнопка сама держит своё сочетание клавиш. Она не просто
// рисует подсказку, а вешает слушатель на window, разбирает combo вида
// «mod+s», подставляет ⌘ на macOS и Ctrl на остальных системах и подсвечивает
// себя при срабатывании — чтобы было видно, что нажатие ушло именно сюда.
// Пока фокус в поле ввода, сочетание не перехватывается.
const STYLES = `
:where([data-vibeui-block="button-025"]){
--vibeui-button-025-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-025-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-025-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-025-radius:0.625rem;
--vibeui-button-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-025-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-025"]{color-scheme:dark}
[data-vibeui-block="button-025"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.75rem;
height:2.5rem;padding:0 0.5rem 0 1rem;box-sizing:border-box;
border-radius:var(--vibeui-button-025-radius);
background:var(--vibeui-button-025-accent);color:var(--vibeui-button-025-fg);
font-family:var(--vibeui-button-025-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:filter .16s ease,box-shadow .24s ease;
}
[data-vibeui-block="button-025"]:hover{filter:var(--vibeui-button-025-hover-filter)}
[data-vibeui-block="button-025"]:focus-visible{outline:2px solid var(--vibeui-button-025-accent);outline-offset:2px}
/* Вспышка: видно, что сочетание сработало именно на этой кнопке. */
[data-vibeui-block="button-025"][data-flash="true"]{
animation:vibeui-button-025-flash .45s ease-out;
}
[data-vibeui-block="button-025"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.1875rem}
[data-vibeui-block="button-025"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.375rem;height:1.5rem;padding:0 0.3125rem;box-sizing:border-box;
border-radius:0.375rem;
background:oklch(1 0 0 / 18%);
box-shadow:inset 0 0 0 1px oklch(1 0 0 / 22%);
font-family:var(--vibeui-button-025-mono);font-size:0.75rem;font-weight:600;line-height:1;
color:inherit;
}
@keyframes vibeui-button-025-flash{
0%{box-shadow:0 0 0 0 oklch(1 0 0 / 55%)}
100%{box-shadow:0 0 0 0.75rem oklch(1 0 0 / 0%)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-025"],[data-vibeui-block="button-025"] *{animation:none!important;transition:none!important}}
`

const MAC_KEYS: Record<string, string> = {
  mod: "⌘",
  shift: "⇧",
  alt: "⌥",
  ctrl: "⌃",
}

const PC_KEYS: Record<string, string> = {
  mod: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  ctrl: "Ctrl",
}

const subscribe = () => () => {}

const isMac = () => /mac|iphone|ipad/i.test(navigator.userAgent)

function parts(combo: string) {
  return combo
    .toLowerCase()
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * Кнопка, которая сама слушает своё сочетание клавиш и показывает его в kbd.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button025({
  label = "Сохранить черновик",
  combo = "mod+s",
  onAction,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button025Props) {
  // Платформа читается через useSyncExternalStore: на сервере снимок всегда
  // false, поэтому разметка совпадает и гидратация не падает, а после неё
  // клавиши перерисовываются под систему.
  const mac = useSyncExternalStore(subscribe, isMac, () => false)
  const [flash, setFlash] = useState(false)
  const handler = useRef(onAction)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    handler.current = onAction
  }, [onAction])

  useEffect(() => {
    const keys = parts(combo)
    const main = keys[keys.length - 1] ?? ""

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return
      }

      const mod = mac ? event.metaKey : event.ctrlKey
      if (keys.includes("mod") !== mod) return
      if (keys.includes("shift") !== event.shiftKey) return
      if (keys.includes("alt") !== event.altKey) return
      if (event.key.toLowerCase() !== main) return

      event.preventDefault()
      handler.current?.()
      setFlash(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setFlash(false), 450)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [combo, mac])

  const palette = {
    ...(accent ? { "--vibeui-button-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  const map = mac ? MAC_KEYS : PC_KEYS
  const shown = parts(combo).map((part) => map[part] ?? part.toUpperCase())

  return (
    <>
      <style href="vibeui-button-025" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-025"
        data-flash={String(flash)}
        className={className}
        style={palette}
        aria-keyshortcuts={parts(combo)
          .map((part) => (part === "mod" ? (mac ? "Meta" : "Control") : part))
          .join("+")}
        onClick={() => handler.current?.()}
      >
        {label}
        <span data-part="keys" aria-hidden="true">
          {shown.map((key) => (
            <kbd key={key}>{key}</kbd>
          ))}
        </span>
      </button>
    </>
  )
}
