import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  extensionLabel?: string
  extensionPlaceholder?: string
  accent?: string
}

// Идея компонента: добавочный — отдельное значение, а не хвост номера.
// Он живёт в своём поле с autoComplete="tel-extension", поэтому браузер
// не подставляет его в основной номер и не путает автозаполнение.
// Ширина добавочного фиксирована и мала: она сама говорит, что там
// три-четыре цифры, а не второй телефон.
const STYLES = `
:where([data-vibeui-block="phoneinput-007"]){
--vibeui-phoneinput-007-surface:oklch(1 0 0);
--vibeui-phoneinput-007-surface-border:oklch(0.91 0.006 265);
--vibeui-phoneinput-007-fg:oklch(0.24 0.016 265);
--vibeui-phoneinput-007-muted:oklch(0.54 0.014 265);
--vibeui-phoneinput-007-field-border:oklch(0.85 0.01 265);
--vibeui-phoneinput-007-accent:oklch(0.55 0.2 262);
--vibeui-phoneinput-007-radius:0.625rem;
--vibeui-phoneinput-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="phoneinput-007"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-007-surface);
border:1px solid var(--vibeui-phoneinput-007-surface-border);
font-family:var(--vibeui-phoneinput-007-font);color:var(--vibeui-phoneinput-007-fg);
}
/* Раскладка лежит на оболочке, а не на корне: правило внутри @container
   действует только на потомков контейнера. */
[data-vibeui-block="phoneinput-007"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.375rem;min-width:0;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"]{flex:none}
[data-vibeui-block="phoneinput-007"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"] label{
font-weight:500;color:var(--vibeui-phoneinput-007-muted);
}
[data-vibeui-block="phoneinput-007"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-007-fg);
background:var(--vibeui-phoneinput-007-surface);
border:1px solid var(--vibeui-phoneinput-007-field-border);
border-radius:var(--vibeui-phoneinput-007-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-007"] input::placeholder{color:var(--vibeui-phoneinput-007-muted)}
[data-vibeui-block="phoneinput-007"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-007-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-007"] [data-part="hint"]{
margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-007-muted);
}
@container (min-width: 20rem){
[data-vibeui-block="phoneinput-007"] [data-part="shell"]{
flex-direction:row;align-items:flex-end;gap:0.5rem;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"]{width:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Телефон с отдельным полем добавочного: два значения, два поля, разные
 * подсказки автозаполнения. Один файл, ноль зависимостей.
 */
export function Phoneinput007({
  label = "Рабочий телефон",
  extensionLabel = "Добавочный",
  extensionPlaceholder = "1234",
  accent,
  className,
  style,
  ...props
}: Phoneinput007Props) {
  const id = useId()
  const extensionId = `${id}-extension`
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="phoneinput-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="cell" data-role="number">
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 495 123-45-67"
              aria-describedby={hintId}
            />
          </div>
          <div data-part="cell" data-role="extension">
            <label htmlFor={extensionId}>{extensionLabel}</label>
            <input
              id={extensionId}
              name="extension"
              type="text"
              inputMode="numeric"
              autoComplete="tel-extension"
              placeholder={extensionPlaceholder}
            />
          </div>
        </div>
        <p data-part="hint" id={hintId}>
          Добавочный необязателен: без него позвоним на общий номер.
        </p>
      </div>
    </>
  )
}
