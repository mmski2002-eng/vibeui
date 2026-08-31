import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select002Group = {
  label: string
  options: { value: string; label: string }[]
}

export type Select002Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children"
> & {
  label?: string
  hint?: string
  groups?: Select002Group[]
  placeholder?: string
  accent?: string
}

// Идея компонента: длинный список, разбитый на разделы. Как только вариантов
// больше десятка, плоский перечень заставляет читать всё подряд; optgroup
// делит его на смысловые блоки силами самого браузера — на телефоне это
// системное колесо с заголовками, без единой строки JS.
const STYLES = `
:where([data-vibeui-block="select-002"]){
--vibeui-select-002-surface:oklch(1 0 0);
--vibeui-select-002-surface-border:oklch(0.91 0.006 265);
--vibeui-select-002-fg:oklch(0.23 0.016 265);
--vibeui-select-002-muted:oklch(0.55 0.014 265);
--vibeui-select-002-field:oklch(0.985 0.002 265);
--vibeui-select-002-border:oklch(0.87 0.008 265);
--vibeui-select-002-accent:oklch(0.55 0.19 262);
--vibeui-select-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-002"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-002-surface);
border:1px solid var(--vibeui-select-002-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-002-font);color:var(--vibeui-select-002-fg);
}
[data-vibeui-block="select-002"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-002"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-002"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-002-border);border-radius:0.625rem;
background:var(--vibeui-select-002-field);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.2;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-002"] select:focus{
outline:none;border-color:var(--vibeui-select-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-002-accent) 22%,transparent);
}
/* Заголовок раздела рисует система, но вес и цвет мы всё-таки задаём:
   иначе на десктопе раздел неотличим от варианта. */
[data-vibeui-block="select-002"] optgroup{font-weight:700;color:var(--vibeui-select-002-muted)}
[data-vibeui-block="select-002"] option{font-weight:400;color:var(--vibeui-select-002-fg)}
[data-vibeui-block="select-002"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-002-muted);
border-bottom:1.5px solid var(--vibeui-select-002-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Select002Group[] = [
  {
    label: "Европа",
    options: [
      { value: "berlin", label: "Берлин" },
      { value: "lisbon", label: "Лиссабон" },
      { value: "warsaw", label: "Варшава" },
    ],
  },
  {
    label: "Азия",
    options: [
      { value: "almaty", label: "Алматы" },
      { value: "tbilisi", label: "Тбилиси" },
      { value: "bangkok", label: "Бангкок" },
    ],
  },
  {
    label: "Америка",
    options: [
      { value: "austin", label: "Остин" },
      { value: "toronto", label: "Торонто" },
    ],
  },
]

/**
 * Нативный select с разделами: длинный список поделён на optgroup.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select002({
  label = "Город команды",
  hint = "Разделы совпадают с регионами в договоре.",
  groups = DEFAULT_GROUPS,
  placeholder = "Выберите город",
  accent,
  id,
  className,
  style,
  defaultValue,
  ...props
}: Select002Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-002" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="select-002" className={className} style={palette}>
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            {...props}
            id={id}
            defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
