import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput006Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "size" | "defaultValue"
> & {
  label?: string
  error?: string
  defaultValue?: string
  example?: string
  accent?: string
}

// Идея компонента: сообщение об ошибке показывает разницу, а не диагноз.
// Рядом стоят два образца — что набрано и что ожидается, — поэтому
// пропущенную цифру видно глазами. Введённое значение при этом остаётся
// в поле: очищать его при ошибке — самый быстрый способ заставить
// человека уйти с формы.
const STYLES = `
:where([data-vibeui-block="phoneinput-006"]){
--vibeui-phoneinput-006-surface:oklch(1 0 0);
--vibeui-phoneinput-006-surface-border:oklch(0.91 0.006 265);
--vibeui-phoneinput-006-fg:oklch(0.24 0.016 265);
--vibeui-phoneinput-006-muted:oklch(0.54 0.014 265);
--vibeui-phoneinput-006-field-border:oklch(0.85 0.01 265);
--vibeui-phoneinput-006-accent:oklch(0.55 0.2 262);
--vibeui-phoneinput-006-error:oklch(0.55 0.2 25);
--vibeui-phoneinput-006-error-soft:oklch(0.96 0.03 25);
--vibeui-phoneinput-006-radius:0.625rem;
--vibeui-phoneinput-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-phoneinput-006-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="phoneinput-006"]{
box-sizing:border-box;width:100%;max-width:23rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-006-surface);
border:1px solid var(--vibeui-phoneinput-006-surface-border);
font-family:var(--vibeui-phoneinput-006-font);color:var(--vibeui-phoneinput-006-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-006"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
transition:color .16s ease;
}
[data-vibeui-block="phoneinput-006"]:has(input[aria-invalid="true"]) label{
color:var(--vibeui-phoneinput-006-error);
}
[data-vibeui-block="phoneinput-006"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-006-fg);
background:var(--vibeui-phoneinput-006-surface);
border:1px solid var(--vibeui-phoneinput-006-field-border);
border-radius:var(--vibeui-phoneinput-006-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-006"] input[aria-invalid="true"]{
border-color:var(--vibeui-phoneinput-006-error);
}
[data-vibeui-block="phoneinput-006"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-006-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-006"] input[aria-invalid="true"]:focus-visible{
border-color:var(--vibeui-phoneinput-006-error);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-006-error) 22%,transparent);
}
[data-vibeui-block="phoneinput-006"] [data-part="error"]{
margin:0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-phoneinput-006-error-soft);
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-phoneinput-006-error);
display:flex;flex-direction:column;gap:0.375rem;
}
/* Две строки образцов выровнены в сетку: подписи «набрано» и «нужно»
   стоят одна под другой, поэтому цифры сравниваются взглядом сверху вниз. */
[data-vibeui-block="phoneinput-006"] [data-part="compare"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.5rem;
align-items:baseline;
}
[data-vibeui-block="phoneinput-006"] [data-part="key"]{
font-size:0.75rem;color:var(--vibeui-phoneinput-006-muted);
}
[data-vibeui-block="phoneinput-006"] samp{
font-family:var(--vibeui-phoneinput-006-mono);font-size:0.8125rem;
color:var(--vibeui-phoneinput-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Телефон в состоянии ошибки: рядом показаны набранное и ожидаемое, а
 * введённое значение не стирается. Один файл, ноль зависимостей.
 */
export function Phoneinput006({
  label = "Телефон",
  error = "Номер не похож на настоящий: после кода +7 должно быть десять цифр, а набрано семь.",
  defaultValue = "+7 999 12-34",
  example = "+7 999 123-45-67",
  accent,
  className,
  style,
  ...props
}: Phoneinput006Props) {
  const id = useId()
  const errorId = `${id}-error`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="phoneinput-006"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          {...props}
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={defaultValue}
          aria-invalid="true"
          aria-describedby={errorId}
        />
        <div data-part="error" id={errorId}>
          <span>{error}</span>
          <span data-part="compare">
            <span data-part="key">набрано</span>
            <samp>{defaultValue}</samp>
            <span data-part="key">нужно</span>
            <samp>{example}</samp>
          </span>
        </div>
      </div>
    </>
  )
}
