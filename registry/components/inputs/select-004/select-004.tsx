import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select004Option = {
  value: string
  label: string
}

export type Select004Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "size" | "children" | "multiple"
> & {
  label?: string
  hint?: string
  options?: Select004Option[]
  /** Сколько строк списка видно без прокрутки. */
  rows?: number
  accent?: string
}

// Идея компонента: множественный выбор без выпадающего меню. Нативный
// select[multiple] показывает весь список сразу, поэтому не приходится
// открывать его заново после каждого клика, а состояние выбранных строк
// рисует :checked — самодельный список чекбоксов здесь только мешал бы форме.
const STYLES = `
:where([data-vibeui-block="select-004"]){
--vibeui-select-004-surface:oklch(1 0 0);
--vibeui-select-004-surface-border:oklch(0.91 0.006 265);
--vibeui-select-004-fg:oklch(0.23 0.016 265);
--vibeui-select-004-muted:oklch(0.55 0.014 265);
--vibeui-select-004-field:oklch(0.985 0.002 265);
--vibeui-select-004-border:oklch(0.87 0.008 265);
--vibeui-select-004-accent:oklch(0.55 0.19 285);
--vibeui-select-004-tint:oklch(0.55 0.19 285 / 14%);
--vibeui-select-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-004-surface);
border:1px solid var(--vibeui-select-004-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-004-font);color:var(--vibeui-select-004-fg);
}
[data-vibeui-block="select-004"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-004"] select{
box-sizing:border-box;width:100%;margin:0;padding:0.25rem;
border:1px solid var(--vibeui-select-004-border);border-radius:0.625rem;
background:var(--vibeui-select-004-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="select-004"] select:focus-visible{
outline:2px solid var(--vibeui-select-004-accent);outline-offset:1px;border-color:transparent;
}
/* Выбранная строка красится сама: у select[multiple] :checked работает
   на option, а не только на подсветке системным цветом. */
[data-vibeui-block="select-004"] option{
padding:0.375rem 0.5rem;border-radius:0.375rem;color:inherit;
}
[data-vibeui-block="select-004"] option:checked{
background:var(--vibeui-select-004-tint);
color:var(--vibeui-select-004-accent);font-weight:600;
}
[data-vibeui-block="select-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-004-muted);
}
[data-vibeui-block="select-004"] kbd{
font:inherit;font-size:0.6875rem;padding:0.0625rem 0.3125rem;
border:1px solid var(--vibeui-select-004-border);border-radius:0.25rem;
background:var(--vibeui-select-004-field);
}
`

const DEFAULT_OPTIONS: Select004Option[] = [
  { value: "design", label: "Дизайн" },
  { value: "frontend", label: "Фронтенд" },
  { value: "backend", label: "Бэкенд" },
  { value: "analytics", label: "Аналитика" },
  { value: "content", label: "Контент" },
  { value: "qa", label: "Тестирование" },
]

/**
 * Множественный выбор на нативном select[multiple]: весь список виден сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select004({
  label = "Направления работы",
  hint = "Несколько — с зажатой клавишей",
  options = DEFAULT_OPTIONS,
  rows = 5,
  accent,
  id,
  className,
  style,
  defaultValue = ["frontend", "analytics"],
  ...props
}: Select004Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-004" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="select-004" className={className} style={palette}>
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <select
          {...props}
          id={id}
          multiple
          size={rows}
          defaultValue={defaultValue}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint ? (
          <p data-part="hint">
            {hint} <kbd>Ctrl</kbd> / <kbd>⌘</kbd>
          </p>
        ) : null}
      </div>
    </>
  )
}
