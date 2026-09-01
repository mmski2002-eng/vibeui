"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Togglegroup014Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: одиночный выбор значками, у каждого из которых есть
// собственная всплывающая подсказка. Подсказка — это не title браузера:
// она рисуется span'ом с role="tooltip", связана с кнопкой через
// aria-describedby и появляется по наведению и по фокусу одинаково.
const STYLES = `
:where([data-vibeui-block="togglegroup-014"]){
--vibeui-togglegroup-014-bg:oklch(1 0 0);
--vibeui-togglegroup-014-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-014-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-014-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-014-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-014-accent:oklch(0.6 0.19 40);
--vibeui-togglegroup-014-tip-bg:oklch(0.22 0.014 265);
--vibeui-togglegroup-014-tip-fg:oklch(0.98 0 0);
--vibeui-togglegroup-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-014"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:20rem;padding:1.25rem 0.875rem 0.875rem;
border:1px solid var(--vibeui-togglegroup-014-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-014-bg);color:var(--vibeui-togglegroup-014-fg);
font-family:var(--vibeui-togglegroup-014-font);
}
[data-vibeui-block="togglegroup-014"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-014"] [data-part="group"]{
display:inline-flex;align-self:flex-start;gap:0.25rem;padding:0.1875rem;
border:1px solid var(--vibeui-togglegroup-014-border);border-radius:0.75rem;
background:var(--vibeui-togglegroup-014-surface);
}
[data-vibeui-block="togglegroup-014"] [data-part="item"]{position:relative}
[data-vibeui-block="togglegroup-014"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-togglegroup-014-muted);
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-014"] button svg{width:1.0625rem;height:1.0625rem}
[data-vibeui-block="togglegroup-014"] button:hover{color:var(--vibeui-togglegroup-014-fg)}
[data-vibeui-block="togglegroup-014"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-014-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-014"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-014-bg);color:var(--vibeui-togglegroup-014-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 16%);
}
[data-vibeui-block="togglegroup-014"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;transform:translateX(-50%);
padding:0.3125rem 0.5rem;border-radius:0.375rem;white-space:nowrap;
background:var(--vibeui-togglegroup-014-tip-bg);color:var(--vibeui-togglegroup-014-tip-fg);
font-size:0.6875rem;font-weight:600;line-height:1.2;
pointer-events:none;
}
[data-vibeui-block="togglegroup-014"] [data-part="tip"]::after{
content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);
border:0.25rem solid transparent;border-top-color:var(--vibeui-togglegroup-014-tip-bg);
}
[data-vibeui-block="togglegroup-014"] [data-part="current"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-togglegroup-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-014"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = [
  { id: "low", label: "Низкий", d: "M3 11h10M6 8h4M8 5h.01" },
  { id: "medium", label: "Средний", d: "M3 11h10M5 8h6M8 5h.01" },
  { id: "high", label: "Высокий", d: "M3 11h10M4.5 8h7M6.5 5h3" },
  { id: "urgent", label: "Срочно", d: "M8 3v6M8 12h.01" },
]

/**
 * Одиночный выбор приоритета значками с собственными всплывающими
 * подсказками на hover и фокусе. Один файл, ноль зависимостей.
 */
export function Togglegroup014({
  label = "Приоритет",
  defaultValue = "medium",
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup014Props) {
  const [value, setValue] = useState(defaultValue)
  const [openId, setOpenId] = useState<string | null>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const prefix = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  const focusAt = (index: number) => {
    const last = OPTIONS.length - 1
    const target = index < 0 ? last : index > last ? 0 : index

    items.current[target]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0

    if (step !== 0) {
      event.preventDefault()
      focusAt(index + step)
      return
    }

    if (event.key === "Home") {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === "End") {
      event.preventDefault()
      focusAt(OPTIONS.length - 1)
    } else if (event.key === "Escape" && openId) {
      setOpenId(null)
    }
  }

  const current = OPTIONS.find((option) => option.id === value) ?? OPTIONS[1]

  return (
    <>
      <style href="vibeui-togglegroup-014" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-014"
        className={className}
        style={palette}
      >
        <div data-part="group" role="group" aria-label={label}>
          {OPTIONS.map((option, index) => {
            const tipId = `${prefix}-${option.id}`
            const open = openId === option.id

            return (
              <span key={option.id} data-part="item">
                <button
                  ref={(node) => {
                    items.current[index] = node
                  }}
                  type="button"
                  aria-pressed={value === option.id}
                  aria-label={option.label}
                  aria-describedby={open ? tipId : undefined}
                  tabIndex={value === option.id ? 0 : -1}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  onMouseEnter={() => setOpenId(option.id)}
                  onMouseLeave={() => setOpenId(null)}
                  onFocus={() => setOpenId(option.id)}
                  onBlur={() => setOpenId(null)}
                  onClick={() => {
                    setValue(option.id)
                    onChange?.(option.id)
                  }}
                >
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d={option.d}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {open ? (
                  <span data-part="tip" role="tooltip" id={tipId}>
                    {option.label}
                  </span>
                ) : null}
              </span>
            )
          })}
        </div>
        <p data-part="current" role="status">
          Выбран приоритет: {current.label}.
        </p>
      </section>
    </>
  )
}
