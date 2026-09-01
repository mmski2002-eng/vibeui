"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEventHandler,
} from "react"

export type Button060Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onClick"
> & {
  children?: string
  /** Сколько объектов попадёт под фильтр: число живёт в бейдже. */
  count?: number
  defaultActive?: boolean
  onToggle?: (active: boolean) => void
  onClear?: MouseEventHandler<HTMLButtonElement>
  accent?: string
}

// Идея компонента: фильтр-чип из двух кнопок в одном пятне. Левая включает
// фильтр и несёт число совпадений, правая сбрасывает его — вложить кнопку
// в кнопку нельзя, поэтому они соседи под общим скруглением. Сброс
// появляется только у включённого фильтра: у выключенного сбрасывать нечего.
const STYLES = `
:where([data-vibeui-block="button-060"]){
--vibeui-button-060-surface:oklch(1 0 0);
--vibeui-button-060-border:oklch(0.88 0.006 265);
--vibeui-button-060-fg:oklch(0.28 0.02 265);
--vibeui-button-060-accent:oklch(0.5 0.16 285);
--vibeui-button-060-accent-fg:oklch(0.99 0.01 285);
--vibeui-button-060-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-060"]{
display:inline-flex;align-items:stretch;box-sizing:border-box;overflow:hidden;
height:2.25rem;border-radius:9999px;
border:1px solid var(--vibeui-button-060-border);
background:var(--vibeui-button-060-surface);color:var(--vibeui-button-060-fg);
font-family:var(--vibeui-button-060-font);
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-060"][data-active="true"]{
background:var(--vibeui-button-060-accent);color:var(--vibeui-button-060-accent-fg);
border-color:var(--vibeui-button-060-accent);
}
[data-vibeui-block="button-060"] button{
appearance:none;border:0;background:transparent;cursor:pointer;color:inherit;
display:inline-flex;align-items:center;gap:0.4375rem;
font:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="button-060"] [data-part="chip"]{padding:0 0.5rem 0 0.875rem}
[data-vibeui-block="button-060"] [data-part="chip"]:hover{background:oklch(0.5 0.02 265 / 8%)}
[data-vibeui-block="button-060"] button:focus-visible{outline:2px solid var(--vibeui-button-060-accent);outline-offset:-3px;border-radius:9999px}
[data-vibeui-block="button-060"][data-active="true"] button:focus-visible{outline-color:var(--vibeui-button-060-accent-fg)}
/* Бейдж числа: у выключенного фильтра он приглушён, у включённого — вывернут. */
[data-vibeui-block="button-060"] [data-part="count"]{
min-width:1.375rem;padding:0.1875rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-button-060-accent) 12%,transparent);
color:var(--vibeui-button-060-accent);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;text-align:center;
}
[data-vibeui-block="button-060"][data-active="true"] [data-part="count"]{
background:oklch(1 0 0 / 22%);color:var(--vibeui-button-060-accent-fg);
}
[data-vibeui-block="button-060"] [data-part="clear"]{
padding:0 0.75rem 0 0.5rem;
box-shadow:inset 1px 0 0 0 oklch(1 0 0 / 30%);
}
[data-vibeui-block="button-060"] [data-part="clear"]:hover{background:oklch(0 0 0 / 12%)}
[data-vibeui-block="button-060"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="button-060"] [data-part="cross"]::before,
[data-vibeui-block="button-060"] [data-part="cross"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.625rem;height:1.5px;
margin:-0.75px 0 0 -0.3125rem;background:currentColor;border-radius:1px;
}
[data-vibeui-block="button-060"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="button-060"] [data-part="cross"]::after{transform:rotate(-45deg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-060"] *{animation:none!important;transition:none!important}}
`

/**
 * Фильтр-чип с числом совпадений и отдельной кнопкой сброса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button060({
  children = "В работе",
  count = 24,
  defaultActive = true,
  onToggle,
  onClear,
  accent,
  className,
  style,
  ...props
}: Button060Props) {
  const [active, setActive] = useState(defaultActive)

  const palette = {
    ...(accent ? { "--vibeui-button-060-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-060" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-060"
        data-active={String(active)}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="chip"
          aria-pressed={active}
          onClick={() => {
            const next = !active

            setActive(next)
            onToggle?.(next)
          }}
        >
          {children}
          <span data-part="count">{count}</span>
        </button>
        {active ? (
          <button
            type="button"
            data-part="clear"
            aria-label={`Сбросить фильтр «${children}»`}
            onClick={(event) => {
              setActive(false)
              onClear?.(event)
            }}
          >
            <span data-part="cross" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </>
  )
}
