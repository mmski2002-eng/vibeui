import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button008Props = ComponentPropsWithoutRef<"button"> & {
  /** Клавиши подсказки. Каждая рисуется отдельной клавишей. */
  keys?: string[]
  accent?: string
}

// Идея компонента: кнопка сразу учит горячей клавише. Справа — настоящие
// клавиши с объёмом (нижняя грань и внутренняя подсветка), а не текстовый
// хвост. На наведении клавиши «нажимаются»: грань уходит, они опускаются.
const STYLES = `
:where([data-vibeui-block="button-008"]){
--vibeui-button-008-bg:oklch(0.98 0.002 265);
--vibeui-button-008-fg:oklch(0.3 0.014 265);
--vibeui-button-008-border:oklch(0.55 0.02 265 / 26%);
--vibeui-button-008-key-bg:oklch(1 0 0);
--vibeui-button-008-key-fg:oklch(0.45 0.015 265);
--vibeui-button-008-key-edge:oklch(0.55 0.02 265 / 34%);
--vibeui-button-008-ring:oklch(0.55 0.02 265 / 60%);
--vibeui-button-008-radius:0.625rem;
--vibeui-button-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="button-008"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.75rem;
height:2.5rem;padding:0 0.5rem 0 0.875rem;
border:1px solid var(--vibeui-button-008-border);border-radius:var(--vibeui-button-008-radius);
font-family:var(--vibeui-button-008-font);font-size:0.875rem;font-weight:500;line-height:1;
background:var(--vibeui-button-008-bg);color:var(--vibeui-button-008-fg);
transition:border-color .18s ease,background-color .18s ease;
}
[data-vibeui-block="button-008"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.1875rem;flex:none}
[data-vibeui-block="button-008"] [data-part="key"]{
min-width:1.375rem;height:1.375rem;padding:0 0.3125rem;border-radius:0.3125rem;
display:inline-flex;align-items:center;justify-content:center;
font-family:var(--vibeui-button-008-mono);font-size:0.6875rem;line-height:1;
color:var(--vibeui-button-008-key-fg);background:var(--vibeui-button-008-key-bg);
box-shadow:0 1px 0 0 var(--vibeui-button-008-key-edge),inset 0 0 0 1px var(--vibeui-button-008-key-edge);
transform:translateY(-1px);
transition:transform .14s ease,box-shadow .14s ease;
}
[data-vibeui-block="button-008"]:hover:not(:disabled){border-color:color-mix(in oklab, var(--vibeui-button-008-fg) 40%, transparent)}
[data-vibeui-block="button-008"]:hover:not(:disabled) [data-part="key"]{transform:translateY(0);box-shadow:inset 0 0 0 1px var(--vibeui-button-008-key-edge)}
[data-vibeui-block="button-008"]:focus-visible{outline:2px solid var(--vibeui-button-008-ring);outline-offset:2px}
[data-vibeui-block="button-008"]:disabled{cursor:not-allowed;opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-008"] *{transition:none!important}}
`

/**
 * Кнопка команды с подсказкой горячей клавиши на объёмных клавишах.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button008({
  keys = ["⌘", "K"],
  accent,
  type = "button",
  className,
  style,
  children = "Быстрый поиск",
  ...props
}: Button008Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-008-key-fg": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-008" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-008"
        className={className}
        style={palette}
      >
        {children}
        <span data-part="keys" aria-hidden="true">
          {keys.map((key) => (
            <kbd data-part="key" key={key}>
              {key}
            </kbd>
          ))}
        </span>
      </button>
    </>
  )
}
