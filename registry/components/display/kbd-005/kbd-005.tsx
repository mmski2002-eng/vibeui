"use client"

import { useSyncExternalStore } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Kbd005Platform = "auto" | "mac" | "windows"

export type Kbd005Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  platform?: Kbd005Platform
  action?: string
  letter?: string
}

// Идея компонента: одно сочетание, разное написание. На macOS модификатор
// пишется знаком ⌘, на Windows и Linux — словом Ctrl, и подсказка с чужим
// знаком читается как ошибка. Платформа определяется после гидрации, а не
// при рендере: сервер не знает системы клиента, и попытка угадать даёт
// рассинхрон разметки. До определения показывается вариант с Ctrl —
// он понятен на любой системе, в отличие от ⌘.
const STYLES = `
:where([data-vibeui-block="kbd-005"]){
--vibeui-kbd-005-surface:oklch(1 0 0);
--vibeui-kbd-005-fg:oklch(0.24 0.014 265);
--vibeui-kbd-005-muted:oklch(0.55 0.014 265);
--vibeui-kbd-005-border:oklch(0.88 0.008 265);
--vibeui-kbd-005-key:oklch(0.975 0.003 265);
--vibeui-kbd-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: клавиши и подпись тёмные. */
[data-vibeui-block="kbd-005"]{
display:inline-flex;align-items:center;justify-content:space-between;gap:1.25rem;
box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-kbd-005-surface);
border:1px solid var(--vibeui-kbd-005-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-005-font);color:var(--vibeui-kbd-005-fg);
font-size:0.8125rem;
}
[data-vibeui-block="kbd-005"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="kbd-005"] [data-part="action"]{font-weight:650}
[data-vibeui-block="kbd-005"] [data-part="system"]{font-size:0.6875rem;color:var(--vibeui-kbd-005-muted)}
[data-vibeui-block="kbd-005"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.25rem;flex:none}
[data-vibeui-block="kbd-005"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.625rem;height:1.625rem;padding:0 0.4375rem;box-sizing:border-box;
background:var(--vibeui-kbd-005-key);
border:1px solid var(--vibeui-kbd-005-border);border-bottom-width:2px;
border-radius:0.4375rem;
font-family:inherit;font-size:0.75rem;font-weight:650;line-height:1;
}
/* Знак ⌘ шире буквы: на Mac клавиша модификатора получает свою ширину. */
[data-vibeui-block="kbd-005"][data-system="mac"] kbd:first-child{min-width:1.875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-005"] *{animation:none!important;transition:none!important}}
`

const subscribe = () => () => {}
const serverSystem = (): "mac" | "windows" => "windows"

function detect(): "mac" | "windows" {
  if (typeof navigator === "undefined") {
    return "windows"
  }

  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "mac" : "windows"
}

/**
 * Платформозависимое сочетание: ⌘ на macOS, Ctrl на остальных системах.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd005({
  platform = "auto",
  action = "Открыть поиск",
  letter = "K",
  className,
  style,
  ...props
}: Kbd005Props) {
  // Систему знает только клиент. useSyncExternalStore отдаёт серверу
  // «windows», а после гидрации — настоящее значение: разметка сервера и
  // клиента совпадают, и состояние не досылается эффектом.
  const detected = useSyncExternalStore(subscribe, detect, serverSystem)

  const system = platform === "auto" ? detected : platform
  const modifier = system === "mac" ? "⌘" : "Ctrl"

  return (
    <>
      <style href="vibeui-kbd-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kbd-005"
        data-system={system}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="text">
          <span data-part="action">{action}</span>
          <span data-part="system">
            {system === "mac" ? "macOS" : "Windows и Linux"}
          </span>
        </span>
        <span data-part="keys">
          <kbd>{modifier}</kbd>
          <kbd>{letter}</kbd>
        </span>
      </div>
    </>
  )
}
