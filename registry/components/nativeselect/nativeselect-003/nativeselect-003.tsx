import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect003Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "size" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  accent?: string
}

// Идея компонента: у select нет placeholder, поэтому первый пункт всегда
// выглядит выбранным — и человек проматывает поле, ничего не выбрав.
// Заглушка сделана пунктом с пустым value, который disabled и hidden:
// он показан в закрытом поле, но недоступен в списке. Пока выбран он,
// select:required:invalid красит текст приглушённым — состояние «пусто»
// видно без единой строчки скрипта.
const STYLES = `
:where([data-vibeui-block="nativeselect-003"]){
--vibeui-nativeselect-003-surface:oklch(1 0 0);
--vibeui-nativeselect-003-surface-border:oklch(0.91 0.006 265);
--vibeui-nativeselect-003-fg:oklch(0.24 0.016 265);
--vibeui-nativeselect-003-muted:oklch(0.58 0.014 265);
--vibeui-nativeselect-003-field-border:oklch(0.85 0.01 265);
--vibeui-nativeselect-003-accent:oklch(0.55 0.2 262);
--vibeui-nativeselect-003-required:oklch(0.58 0.19 25);
--vibeui-nativeselect-003-radius:0.625rem;
--vibeui-nativeselect-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-003"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-003-surface);
border:1px solid var(--vibeui-nativeselect-003-surface-border);
font-family:var(--vibeui-nativeselect-003-font);color:var(--vibeui-nativeselect-003-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-003"] label{
display:inline-flex;align-items:baseline;gap:0.25rem;
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-003"] [data-part="star"]{
color:var(--vibeui-nativeselect-003-required);line-height:1;
}
[data-vibeui-block="nativeselect-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="nativeselect-003"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="nativeselect-003"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-nativeselect-003-fg);
background:var(--vibeui-nativeselect-003-surface);
border:1px solid var(--vibeui-nativeselect-003-field-border);
border-radius:var(--vibeui-nativeselect-003-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease,color .16s ease;
}
/* Пока выбран пустой пункт, поле не проходит required — на этом и
   держится приглушённый цвет заглушки. Отдельного класса не нужно. */
[data-vibeui-block="nativeselect-003"] select:required:invalid{
color:var(--vibeui-nativeselect-003-muted);
}
[data-vibeui-block="nativeselect-003"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-003-accent) 22%,transparent);
}
[data-vibeui-block="nativeselect-003"] option{color:var(--vibeui-nativeselect-003-fg)}
[data-vibeui-block="nativeselect-003"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-003-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-003-muted);
translate:0 -0.1875rem;rotate:45deg;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Нативный select с заглушкой вместо placeholder и обязательным выбором:
 * пустое состояние видно по цвету через :required:invalid. Один файл,
 * ноль зависимостей.
 */
export function Nativeselect003({
  label = "Причина возврата",
  placeholder = "Выберите причину",
  options = [
    "Не подошёл размер",
    "Пришло не то, что заказывали",
    "Товар с браком",
    "Передумал",
  ],
  accent,
  className,
  style,
  ...props
}: Nativeselect003Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-003" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="nativeselect-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label}
          <span data-part="star" aria-hidden="true">
            *
          </span>
          <span data-part="sr">, обязательное поле</span>
        </label>
        <div data-part="field">
          <select {...props} id={id} name="reason" required defaultValue="">
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </div>
      </div>
    </>
  )
}
