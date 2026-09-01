import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select023Size = {
  value: string
  label: string
}

export type Select023Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children"
> & {
  label?: string
  sizes?: Select023Size[]
  hint?: string
  accent?: string
}

// Идея компонента: под полем размера всегда живёт одна и та же строка
// совета — она не зависит от выбранного варианта (в отличие от select-005,
// где описание меняется вместе со значением) и не превращается в ошибку
// (в отличие от select-009). Это постоянная памятка, а не реакция на выбор.
const STYLES = `
:where([data-vibeui-block="select-023"]){
--vibeui-select-023-surface:oklch(1 0 0);
--vibeui-select-023-surface-border:oklch(0.91 0.006 265);
--vibeui-select-023-fg:oklch(0.23 0.016 265);
--vibeui-select-023-muted:oklch(0.55 0.014 265);
--vibeui-select-023-field:oklch(0.985 0.002 265);
--vibeui-select-023-border:oklch(0.87 0.008 265);
--vibeui-select-023-accent:oklch(0.55 0.19 262);
--vibeui-select-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-023"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-023-surface);
border:1px solid var(--vibeui-select-023-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-023-font);color:var(--vibeui-select-023-fg);
container-type:inline-size;
}
[data-vibeui-block="select-023"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-023"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-023"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-023-border);border-radius:0.625rem;
background:var(--vibeui-select-023-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-023"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-023-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-023-accent) 22%,transparent);
}
[data-vibeui-block="select-023"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-023-muted);
border-bottom:1.5px solid var(--vibeui-select-023-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-023"] [data-part="hint"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-023-muted);
}
[data-vibeui-block="select-023"] [data-part="hint-mark"]{
flex:none;display:grid;place-items:center;width:1rem;height:1rem;margin-top:0.0625rem;
border-radius:9999px;border:1px solid var(--vibeui-select-023-muted);
font-size:0.625rem;font-weight:700;line-height:1;
}
@container (max-width: 13rem){
[data-vibeui-block="select-023"] [data-part="hint"]{font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Select023Size[] = [
  { value: "s", label: "S — 42-44" },
  { value: "m", label: "M — 46-48" },
  { value: "l", label: "L — 50-52" },
  { value: "xl", label: "XL — 54-56" },
]

/**
 * Select размера с постоянной подсказкой под полем: совет не зависит от
 * выбранного варианта и не меняется при выборе. Один файл, ноль
 * зависимостей, серверный компонент.
 */
export function Select023({
  label = "Размер",
  sizes = DEFAULT_SIZES,
  hint = "Модель приталенная: при сомнении берите размер больше.",
  accent,
  id,
  className,
  style,
  defaultValue,
  ...props
}: Select023Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-023" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="select-023" className={className} style={palette}>
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            {...props}
            id={id}
            defaultValue={defaultValue ?? sizes[0]?.value}
          >
            {sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {hint ? (
          <p data-part="hint">
            <span data-part="hint-mark" aria-hidden="true">
              i
            </span>
            <span>{hint}</span>
          </p>
        ) : null}
      </div>
    </>
  )
}
