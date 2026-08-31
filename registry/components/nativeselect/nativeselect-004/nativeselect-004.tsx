import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect004Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "size" | "multiple"
> & {
  label?: string
  hint?: string
  options?: string[]
  rows?: number
  accent?: string
}

// Идея компонента: множественный select без объяснения не работает — с
// мышью нужен Ctrl, с клавиатуры Shift, и об этом никто не догадывается.
// Поэтому список раскрыт заранее (атрибут size), а под ним стоит строка,
// прямо называющая клавиши. Раскрытый список честнее закрытого: видно,
// что выбирать можно несколько.
const STYLES = `
:where([data-vibeui-block="nativeselect-004"]){
--vibeui-nativeselect-004-surface:oklch(1 0 0);
--vibeui-nativeselect-004-surface-border:oklch(0.91 0.006 265);
--vibeui-nativeselect-004-fg:oklch(0.24 0.016 265);
--vibeui-nativeselect-004-muted:oklch(0.54 0.014 265);
--vibeui-nativeselect-004-field-border:oklch(0.85 0.01 265);
--vibeui-nativeselect-004-accent:oklch(0.55 0.2 262);
--vibeui-nativeselect-004-key-bg:oklch(0.96 0.004 265);
--vibeui-nativeselect-004-radius:0.625rem;
--vibeui-nativeselect-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-004"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-004-surface);
border:1px solid var(--vibeui-nativeselect-004-surface-border);
font-family:var(--vibeui-nativeselect-004-font);color:var(--vibeui-nativeselect-004-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="nativeselect-004"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
/* Раскрытому списку appearance:none не нужен: стрелки у него нет, а
   собственная рамка и скругление задаются напрямую. */
[data-vibeui-block="nativeselect-004"] select{
box-sizing:border-box;width:100%;padding:0.25rem;
font:inherit;font-size:0.9375rem;line-height:1.4;
color:var(--vibeui-nativeselect-004-fg);
background:var(--vibeui-nativeselect-004-surface);
border:1px solid var(--vibeui-nativeselect-004-field-border);
border-radius:var(--vibeui-nativeselect-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-004"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-004-accent) 22%,transparent);
}
[data-vibeui-block="nativeselect-004"] option{
padding:0.3125rem 0.4375rem;border-radius:0.375rem;
}
[data-vibeui-block="nativeselect-004"] option:checked{
background:color-mix(in oklab,var(--vibeui-nativeselect-004-accent) 16%,transparent);
color:var(--vibeui-nativeselect-004-fg);
}
[data-vibeui-block="nativeselect-004"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.5;
color:var(--vibeui-nativeselect-004-muted);
}
[data-vibeui-block="nativeselect-004"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-nativeselect-004-key-bg);
border:1px solid var(--vibeui-nativeselect-004-field-border);
font-family:inherit;font-size:0.75rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Множественный нативный select с раскрытым списком и подсказкой о
 * клавишах выбора. Один файл, ноль зависимостей.
 */
export function Nativeselect004({
  label = "Языки интерфейса",
  hint = "Несколько — с зажатой клавишей, подряд — с Shift.",
  options = [
    "Русский",
    "English",
    "Deutsch",
    "Français",
    "Español",
    "Português",
  ],
  rows = 5,
  accent,
  className,
  style,
  ...props
}: Nativeselect004Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="nativeselect-004"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <select
          {...props}
          id={id}
          name="languages"
          multiple
          size={rows}
          defaultValue={["Русский"]}
          aria-describedby={hintId}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p data-part="hint" id={hintId}>
          <kbd>Ctrl</kbd> / <kbd>⌘</kbd> {hint}
        </p>
      </div>
    </>
  )
}
