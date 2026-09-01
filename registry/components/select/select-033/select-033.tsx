import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select033Option = {
  value: string
  label: string
}

export type Select033Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  name?: string
  options?: Select033Option[]
  defaultValue?: string
  maxWidthCh?: number
  accent?: string
}

// Идея компонента: ширина поля считается от самого длинного варианта в
// символах (ch), а не берётся фиксированной или "на всю ширину родителя".
// Короткий список — короткое поле, без лишнего пустого пространства
// справа от текста и без обрезания длинных вариантов многоточием.
const STYLES = `
:where([data-vibeui-block="select-033"]){
--vibeui-select-033-surface:oklch(1 0 0);
--vibeui-select-033-surface-border:oklch(0.91 0.006 265);
--vibeui-select-033-fg:oklch(0.22 0.014 265);
--vibeui-select-033-muted:oklch(0.55 0.014 265);
--vibeui-select-033-field:oklch(0.985 0.002 265);
--vibeui-select-033-border:oklch(0.87 0.008 265);
--vibeui-select-033-accent:oklch(0.55 0.19 262);
--vibeui-select-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-033"]{
display:inline-flex;flex-direction:column;gap:0.375rem;
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-033-surface);
border:1px solid var(--vibeui-select-033-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-033-font);color:var(--vibeui-select-033-fg);
}
[data-vibeui-block="select-033"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-033"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-033"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;margin:0;height:2.75rem;
width:min(100%,calc(var(--vibeui-select-033-content-width,10ch) + 3rem));
max-width:100%;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-033-border);border-radius:0.625rem;
background:var(--vibeui-select-033-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-033"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-033-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-033-accent) 22%,transparent);
}
[data-vibeui-block="select-033"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-033-muted);
border-bottom:1.5px solid var(--vibeui-select-033-muted);
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-033"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select033Option[] = [
  { value: "ru", label: "Россия" },
  { value: "kz", label: "Казахстан" },
  { value: "am", label: "Армения" },
  { value: "uz", label: "Узбекистан" },
]

/**
 * Select, чья ширина рассчитана от самого длинного варианта в символах, а
 * не задана фиксированной или растянута на всю ширину контейнера. Один
 * файл, ноль зависимостей, серверный компонент — расчёт не требует JS в
 * браузере.
 */
export function Select033({
  label = "Страна",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  maxWidthCh = 28,
  accent,
  id,
  className,
  style,
  ...props
}: Select033Props) {
  const longest = options.reduce(
    (max, option) => Math.max(max, option.label.length),
    0,
  )
  const contentWidth = Math.min(Math.max(longest, 4), maxWidthCh)

  const palette = {
    "--vibeui-select-033-content-width": `${contentWidth}ch`,
    ...(accent ? { "--vibeui-select-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-033" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-033"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select id={id} name={name} defaultValue={defaultValue}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}
