import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput005Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "size"
> & {
  label?: string
  example?: string
  note?: string
  accent?: string
}

// Идея компонента: вместо жёсткой маски — показанный образец. Поле
// принимает что угодно, а под ним стоит пример в моноширинном начертании,
// помеченный <samp>: это образец, а не введённое значение. Так номер из
// буфера с любыми скобками и дефисами вставляется без борьбы с полем,
// а человек всё равно видит, какой вид мы ждём.
const STYLES = `
:where([data-vibeui-block="phoneinput-005"]){
--vibeui-phoneinput-005-surface:oklch(1 0 0);
--vibeui-phoneinput-005-surface-border:oklch(0.91 0.006 265);
--vibeui-phoneinput-005-fg:oklch(0.24 0.016 265);
--vibeui-phoneinput-005-muted:oklch(0.54 0.014 265);
--vibeui-phoneinput-005-sample-bg:oklch(0.96 0.004 265);
--vibeui-phoneinput-005-field-border:oklch(0.85 0.01 265);
--vibeui-phoneinput-005-accent:oklch(0.55 0.2 262);
--vibeui-phoneinput-005-radius:0.625rem;
--vibeui-phoneinput-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-phoneinput-005-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="phoneinput-005"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-005-surface);
border:1px solid var(--vibeui-phoneinput-005-surface-border);
font-family:var(--vibeui-phoneinput-005-font);color:var(--vibeui-phoneinput-005-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-005"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-005"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-005-fg);
background:var(--vibeui-phoneinput-005-surface);
border:1px solid var(--vibeui-phoneinput-005-field-border);
border-radius:var(--vibeui-phoneinput-005-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-005"] input::placeholder{color:var(--vibeui-phoneinput-005-muted)}
[data-vibeui-block="phoneinput-005"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-005-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-005"] [data-part="format"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin:0;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-phoneinput-005-muted);
}
/* Образец набран моноширинным и лежит в подложке: так его не спутать с
   уже введённым значением и не прочитать как подпись. */
[data-vibeui-block="phoneinput-005"] samp{
padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-phoneinput-005-sample-bg);
font-family:var(--vibeui-phoneinput-005-mono);font-size:0.8125rem;
color:var(--vibeui-phoneinput-005-fg);white-space:nowrap;
}
[data-vibeui-block="phoneinput-005"] [data-part="note"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Телефон с показанным образцом формата вместо жёсткой маски: поле
 * принимает любой вид записи. Один файл, ноль зависимостей.
 */
export function Phoneinput005({
  label = "Телефон для связи",
  example = "+7 999 123-45-67",
  note = "Скобки, дефисы и пробелы можно оставить — приведём к одному виду при отправке.",
  accent,
  className,
  style,
  ...props
}: Phoneinput005Props) {
  const id = useId()
  const formatId = `${id}-format`
  const noteId = `${id}-note`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="phoneinput-005"
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
          placeholder={example}
          aria-describedby={`${formatId} ${noteId}`}
        />
        <p data-part="format" id={formatId}>
          Например: <samp>{example}</samp>
        </p>
        <p data-part="note" id={noteId}>
          {note}
        </p>
      </div>
    </>
  )
}
