import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect002Group = {
  label: string
  options: string[]
}

export type Nativeselect002Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "size"
> & {
  label?: string
  hint?: string
  groups?: Nativeselect002Group[]
  accent?: string
}

// Идея компонента: длинный плоский список одинаково называющихся пунктов
// не читается — «Основной» есть и у складов, и у офисов. <optgroup> даёт
// системе заголовки разделов: она сама рисует их некликабельными и сама
// произносит название раздела перед пунктом. Своими силами такое в
// кастомном списке приходится городить ролями и разметкой.
const STYLES = `
:where([data-vibeui-block="nativeselect-002"]){
--vibeui-nativeselect-002-surface:oklch(1 0 0);
--vibeui-nativeselect-002-surface-border:oklch(0.91 0.006 265);
--vibeui-nativeselect-002-fg:oklch(0.24 0.016 265);
--vibeui-nativeselect-002-muted:oklch(0.54 0.014 265);
--vibeui-nativeselect-002-field-border:oklch(0.85 0.01 265);
--vibeui-nativeselect-002-accent:oklch(0.5 0.16 165);
--vibeui-nativeselect-002-radius:0.625rem;
--vibeui-nativeselect-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-002"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-002-surface);
border:1px solid var(--vibeui-nativeselect-002-surface-border);
font-family:var(--vibeui-nativeselect-002-font);color:var(--vibeui-nativeselect-002-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-002"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-002"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="nativeselect-002"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-nativeselect-002-fg);
background:var(--vibeui-nativeselect-002-surface);
border:1px solid var(--vibeui-nativeselect-002-field-border);
border-radius:var(--vibeui-nativeselect-002-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-002"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-002-accent) 22%,transparent);
}
/* Заголовки разделов рисует система, но начертание она берёт отсюда:
   это единственное, на что мы влияем внутри раскрытого списка. */
[data-vibeui-block="nativeselect-002"] optgroup{
font-weight:600;font-style:normal;color:var(--vibeui-nativeselect-002-muted);
}
[data-vibeui-block="nativeselect-002"] option{
font-weight:400;color:var(--vibeui-nativeselect-002-fg);
}
[data-vibeui-block="nativeselect-002"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-002-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-002-muted);
translate:0 -0.1875rem;rotate:45deg;
}
[data-vibeui-block="nativeselect-002"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-nativeselect-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Нативный select с разделами на <optgroup>: заголовки групп рисует и
 * произносит сама система. Один файл, ноль зависимостей.
 */
export function Nativeselect002({
  label = "Куда отгружаем",
  hint = "Внутри разделов адреса отсортированы по загрузке.",
  groups = [
    { label: "Склады", options: ["Основной, Химки", "Резервный, Домодедово"] },
    { label: "Офисы", options: ["Основной, Тверская", "Филиал, Казань"] },
    { label: "Партнёры", options: ["Пункт выдачи «Восток»", "Терминал СДЭК"] },
  ],
  accent,
  className,
  style,
  ...props
}: Nativeselect002Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="nativeselect-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select
            {...props}
            id={id}
            name="destination"
            aria-describedby={hintId}
          >
            {groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
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
