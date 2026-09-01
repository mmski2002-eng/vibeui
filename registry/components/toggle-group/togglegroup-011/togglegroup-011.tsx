"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Togglegroup011Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: одиночный выбор, но выравнивание вертикальное — align-items
// самой сцены, а не text-align абзаца. Карточка внутри сцены держит свою
// высоту содержимым, поэтому "растянуть" — это отдельное, четвёртое состояние,
// а не просто "прижать к какому-то краю".
const STYLES = `
:where([data-vibeui-block="togglegroup-011"]){
--vibeui-togglegroup-011-bg:oklch(1 0 0);
--vibeui-togglegroup-011-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-011-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-011-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-011-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-011-accent:oklch(0.56 0.16 255);
--vibeui-togglegroup-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-011"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:22rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-011-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-011-bg);color:var(--vibeui-togglegroup-011-fg);
font-family:var(--vibeui-togglegroup-011-font);
}
[data-vibeui-block="togglegroup-011"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-011"] [data-part="group"]{
display:inline-flex;align-self:flex-start;gap:0.1875rem;padding:0.1875rem;
border:1px solid var(--vibeui-togglegroup-011-border);border-radius:0.625rem;
background:var(--vibeui-togglegroup-011-surface);
}
[data-vibeui-block="togglegroup-011"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-togglegroup-011-muted);
transition:background-color .15s ease,color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="togglegroup-011"] button svg{width:1rem;height:1rem}
[data-vibeui-block="togglegroup-011"] button:hover{color:var(--vibeui-togglegroup-011-fg)}
[data-vibeui-block="togglegroup-011"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-011-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-011"] button[aria-pressed="true"]{
background:var(--vibeui-togglegroup-011-bg);color:var(--vibeui-togglegroup-011-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 16%);
}
[data-vibeui-block="togglegroup-011"] [data-part="stage"]{
display:flex;height:7rem;padding:0.75rem;border-radius:0.625rem;
background:var(--vibeui-togglegroup-011-surface);
}
[data-vibeui-block="togglegroup-011"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-togglegroup-011-border);
background:var(--vibeui-togglegroup-011-bg);
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="togglegroup-011"][data-align="top"] [data-part="stage"]{align-items:flex-start}
[data-vibeui-block="togglegroup-011"][data-align="middle"] [data-part="stage"]{align-items:center}
[data-vibeui-block="togglegroup-011"][data-align="bottom"] [data-part="stage"]{align-items:flex-end}
[data-vibeui-block="togglegroup-011"][data-align="stretch"] [data-part="stage"]{align-items:stretch}
[data-vibeui-block="togglegroup-011"][data-align="stretch"] [data-part="chip"]{align-items:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-011"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = [
  { id: "top", label: "По верхнему краю", d: "M2.5 3h11M4.5 5.5h7v7h-7z" },
  { id: "middle", label: "По центру", d: "M2.5 8h11M4.5 4.5h7v7h-7z" },
  { id: "bottom", label: "По нижнему краю", d: "M2.5 13h11M4.5 3.5h7v7h-7z" },
  {
    id: "stretch",
    label: "Растянуть",
    d: "M4.5 3h7M4.5 13h7M4.5 3v10M11.5 3v10",
  },
]

/**
 * Одиночный выбор вертикального выравнивания с roving tabindex: сцена
 * меняет align-items сразу. Один файл, ноль зависимостей.
 */
export function Togglegroup011({
  label = "Вертикальное выравнивание",
  defaultValue = "middle",
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup011Props) {
  const [value, setValue] = useState(defaultValue)
  const items = useRef<(HTMLButtonElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-011-accent": accent } : null),
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
    }

    if (event.key === "End") {
      event.preventDefault()
      focusAt(OPTIONS.length - 1)
    }
  }

  return (
    <>
      <style href="vibeui-togglegroup-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-011"
        data-align={value}
        className={className}
        style={palette}
      >
        <div data-part="group" role="group" aria-label={label}>
          {OPTIONS.map((option, index) => (
            <button
              key={option.id}
              ref={(node) => {
                items.current[index] = node
              }}
              type="button"
              aria-pressed={value === option.id}
              aria-label={option.label}
              title={option.label}
              tabIndex={value === option.id ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, index)}
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
          ))}
        </div>
        <div data-part="stage">
          <span data-part="chip">Карточка</span>
        </div>
      </section>
    </>
  )
}
