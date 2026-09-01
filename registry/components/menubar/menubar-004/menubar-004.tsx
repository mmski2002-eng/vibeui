"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Menubar004Toggle = {
  id: string
  label: string
  keys?: string
}

export type Menubar004Choice = {
  id: string
  label: string
}

export type Menubar004Props = {
  toggles?: Menubar004Toggle[]
  choices?: Menubar004Choice[]
  defaultOn?: string[]
  defaultChoice?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: меню «Вид», в котором пункты не запускают действие, а держат
// состояние. Переключатели помечены role="menuitemcheckbox", взаимоисключающие
// варианты — role="menuitemradio"; галочка и точка стоят в отдельной колонке,
// поэтому подписи выровнены независимо от того, включён пункт или нет.
const STYLES = `
:where([data-vibeui-block="menubar-004"]){
--vibeui-menubar-004-bg:oklch(1 0 0);
--vibeui-menubar-004-fg:oklch(0.24 0.014 265);
--vibeui-menubar-004-muted:oklch(0.58 0.014 265);
--vibeui-menubar-004-border:oklch(0.9 0.006 265);
--vibeui-menubar-004-hover:oklch(0.55 0.02 265 / 10%);
--vibeui-menubar-004-accent:oklch(0.55 0.2 262);
--vibeui-menubar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menubar-004"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.25rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-menubar-004-bg);color:var(--vibeui-menubar-004-fg);
border:1px solid var(--vibeui-menubar-004-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-004-font);
}
[data-vibeui-block="menubar-004"] [data-part="slot"]{position:relative}
[data-vibeui-block="menubar-004"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;
}
[data-vibeui-block="menubar-004"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-004-hover)}
[data-vibeui-block="menubar-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-004-accent);outline-offset:-2px}
[data-vibeui-block="menubar-004"] [data-part="slot"]:has([data-part="menu"]:popover-open) [data-part="trigger"]{background:var(--vibeui-menubar-004-hover)}
[data-vibeui-block="menubar-004"] [data-part="menu"]{
position:fixed;inset:auto;margin:0;
min-width:14rem;padding:0.25rem;box-sizing:border-box;
background:var(--vibeui-menubar-004-bg);color:var(--vibeui-menubar-004-fg);
border:1px solid var(--vibeui-menubar-004-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-004-font);
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
}
@supports (anchor-name: --a){
[data-vibeui-block="menubar-004"] [data-part="trigger"]{anchor-name:var(--vibeui-menubar-004-anchor)}
[data-vibeui-block="menubar-004"] [data-part="menu"]{
position-anchor:var(--vibeui-menubar-004-anchor);
position-area:bottom span-right;margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Колонка отметки фиксированной ширины: подписи не разъезжаются при включении. */
[data-vibeui-block="menubar-004"] [data-part="item"]{
display:grid;grid-template-columns:1rem 1fr auto;align-items:center;gap:0.5rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-004"] [data-part="item"]:hover{background:var(--vibeui-menubar-004-hover)}
[data-vibeui-block="menubar-004"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-004-accent);outline-offset:-2px}
[data-vibeui-block="menubar-004"] [data-part="mark"]{
width:1rem;height:1rem;display:grid;place-items:center;
font-size:0.75rem;line-height:1;color:var(--vibeui-menubar-004-accent);
}
[data-vibeui-block="menubar-004"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-menubar-004-muted)}
[data-vibeui-block="menubar-004"] [data-part="group"]{
padding:0.375rem 0.5rem 0.1875rem;font-size:0.6875rem;letter-spacing:0.04em;
text-transform:uppercase;color:var(--vibeui-menubar-004-muted);
}
[data-vibeui-block="menubar-004"] [data-part="rule"]{
height:1px;margin:0.25rem 0.375rem;background:var(--vibeui-menubar-004-border);
}
[data-vibeui-block="menubar-004"] [data-part="state"]{
margin-left:auto;padding-right:0.375rem;font-size:0.6875rem;color:var(--vibeui-menubar-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TOGGLES: Menubar004Toggle[] = [
  { id: "grid", label: "Сетка", keys: "⌘'" },
  { id: "rulers", label: "Линейки", keys: "⌘R" },
  { id: "outlines", label: "Контуры блоков" },
]

const DEFAULT_CHOICES: Menubar004Choice[] = [
  { id: "compact", label: "Компактная" },
  { id: "cozy", label: "Обычная" },
  { id: "wide", label: "Просторная" },
]

/**
 * Меню с пунктами-переключателями и взаимоисключающими вариантами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar004({
  toggles = DEFAULT_TOGGLES,
  choices = DEFAULT_CHOICES,
  defaultOn = ["grid"],
  defaultChoice = "cozy",
  accent,
  className,
  style,
}: Menubar004Props) {
  const [on, setOn] = useState<string[]>(defaultOn)
  const [choice, setChoice] = useState(defaultChoice)

  const palette = {
    ...(accent ? { "--vibeui-menubar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const anchor = {
    "--vibeui-menubar-004-anchor": "--vibeui-menubar-004-view",
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-004"
        role="menubar"
        aria-label="Меню приложения"
        className={className}
        style={palette}
      >
        <span data-part="slot" style={anchor}>
          <button
            type="button"
            data-part="trigger"
            role="menuitem"
            aria-haspopup="menu"
            popoverTarget="vibeui-menubar-004-menu"
          >
            Вид
          </button>
          <div
            id="vibeui-menubar-004-menu"
            data-part="menu"
            popover="auto"
            role="menu"
            aria-label="Вид"
          >
            <p data-part="group">Показывать</p>
            {toggles.map((toggle) => {
              const checked = on.includes(toggle.id)

              return (
                <button
                  key={toggle.id}
                  type="button"
                  data-part="item"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  onClick={() =>
                    setOn((current) =>
                      checked
                        ? current.filter((id) => id !== toggle.id)
                        : [...current, toggle.id],
                    )
                  }
                >
                  <span data-part="mark" aria-hidden="true">
                    {checked ? "✓" : ""}
                  </span>
                  <span>{toggle.label}</span>
                  {toggle.keys ? (
                    <span data-part="keys">{toggle.keys}</span>
                  ) : null}
                </button>
              )
            })}
            <div data-part="rule" />
            <p data-part="group">Плотность</p>
            {choices.map((option) => (
              <button
                key={option.id}
                type="button"
                data-part="item"
                role="menuitemradio"
                aria-checked={choice === option.id}
                onClick={() => setChoice(option.id)}
              >
                <span data-part="mark" aria-hidden="true">
                  {choice === option.id ? "●" : ""}
                </span>
                <span>{option.label}</span>
                <span />
              </button>
            ))}
          </div>
        </span>
        <span data-part="state">
          включено: {on.length} ·{" "}
          {choices.find((it) => it.id === choice)?.label}
        </span>
      </div>
    </>
  )
}
