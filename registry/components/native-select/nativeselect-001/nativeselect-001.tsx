import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect001Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "size"
> & {
  label?: string
  hint?: string
  options?: string[]
  accent?: string
}

// Идея компонента: список остаётся системным, а нашего — только оболочка.
// appearance:none снимает штатную стрелку платформы, вместо неё рисуется
// своя из двух граней; сам выпадающий список рисует операционная система,
// поэтому на телефоне он открывается привычным колесом и не ломается
// при масштабировании страницы.
const STYLES = `
:where([data-vibeui-block="nativeselect-001"]){
--vibeui-nativeselect-001-surface:oklch(1 0 0);
--vibeui-nativeselect-001-surface-border:oklch(0.91 0.006 265);
--vibeui-nativeselect-001-fg:oklch(0.24 0.016 265);
--vibeui-nativeselect-001-muted:oklch(0.54 0.014 265);
--vibeui-nativeselect-001-field-border:oklch(0.85 0.01 265);
--vibeui-nativeselect-001-accent:oklch(0.55 0.2 262);
--vibeui-nativeselect-001-radius:0.625rem;
--vibeui-nativeselect-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-001"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-001-surface);
border:1px solid var(--vibeui-nativeselect-001-surface-border);
font-family:var(--vibeui-nativeselect-001-font);color:var(--vibeui-nativeselect-001-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-001"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-001"] [data-part="field"]{
position:relative;display:flex;
}
[data-vibeui-block="nativeselect-001"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-nativeselect-001-fg);
background:var(--vibeui-nativeselect-001-surface);
border:1px solid var(--vibeui-nativeselect-001-field-border);
border-radius:var(--vibeui-nativeselect-001-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-001"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-001-accent) 22%,transparent);
}
/* Стрелка — две грани квадрата, повёрнутые на 45°. Клики она не ловит:
   pointer-events:none оставляет всю площадь поля самому select. */
[data-vibeui-block="nativeselect-001"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-001-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-001-muted);
translate:0 -0.1875rem;rotate:45deg;
transition:border-color .16s ease;
}
[data-vibeui-block="nativeselect-001"] [data-part="field"]:has(select:focus-visible) [data-part="arrow"]{
border-color:var(--vibeui-nativeselect-001-accent);
}
[data-vibeui-block="nativeselect-001"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-nativeselect-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Нативный select с подписью и собственной стрелкой: оболочка наша,
 * выпадающий список системный. Один файл, ноль зависимостей.
 */
export function Nativeselect001({
  label = "Часовой пояс",
  hint = "По нему считаются напоминания и отчёты.",
  options = [
    "Москва, UTC+3",
    "Екатеринбург, UTC+5",
    "Новосибирск, UTC+7",
    "Владивосток, UTC+10",
  ],
  accent,
  className,
  style,
  ...props
}: Nativeselect001Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="nativeselect-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select {...props} id={id} name="timezone" aria-describedby={hintId}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </div>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
