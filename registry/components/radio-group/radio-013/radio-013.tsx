import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio013Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  lowLabel?: string
  highLabel?: string
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: оценка по шкале, а не выбор варианта. Пять кружков с
// цифрой читаются как единая линия, а подписи краёв стоят одной строкой под
// ней — так шкала не нуждается в подписи у каждого деления, только у полюсов.
const STYLES = `
:where([data-vibeui-block="radio-013"]){
--vibeui-radio-013-bg:oklch(1 0 0);
--vibeui-radio-013-fg:oklch(0.22 0.014 265);
--vibeui-radio-013-muted:oklch(0.55 0.014 265);
--vibeui-radio-013-ring:oklch(0.74 0.012 265);
--vibeui-radio-013-border:oklch(0.9 0.006 265);
--vibeui-radio-013-accent:oklch(0.55 0.17 150);
--vibeui-radio-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-013"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-013-bg);
border:1px solid var(--vibeui-radio-013-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-013-font);color:var(--vibeui-radio-013-fg);
}
[data-vibeui-block="radio-013"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-013"] [data-part="scale"]{
clear:both;display:grid;grid-template-columns:repeat(5,1fr);gap:0.375rem;
}
[data-vibeui-block="radio-013"] [data-part="option"]{display:flex;justify-content:center;cursor:pointer}
[data-vibeui-block="radio-013"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-013"] [data-part="num"]{
display:grid;place-items:center;width:2.25rem;height:2.25rem;
border-radius:9999px;border:1.5px solid var(--vibeui-radio-013-ring);
font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-radio-013-fg);
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="radio-013"] [data-part="option"]:has(input:checked) [data-part="num"]{
border-color:var(--vibeui-radio-013-accent);
background:var(--vibeui-radio-013-accent);color:oklch(1 0 0);
}
[data-vibeui-block="radio-013"] [data-part="option"]:has(input:focus-visible) [data-part="num"]{
outline:2px solid var(--vibeui-radio-013-accent);outline-offset:2px;
}
[data-vibeui-block="radio-013"] [data-part="edges"]{
display:flex;justify-content:space-between;gap:0.5rem;
margin-top:0.5rem;font-size:0.6875rem;color:var(--vibeui-radio-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-013"] *{animation:none!important;transition:none!important}}
`

const SCALE = ["1", "2", "3", "4", "5"]

/**
 * Оценка по шкале от 1 до 5 радиокнопками с подписями краёв.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio013({
  legend = "Насколько вы довольны сервисом?",
  lowLabel = "Плохо",
  highLabel = "Отлично",
  name = "vibeui-radio-013",
  defaultValue = "4",
  accent,
  className,
  style,
  ...props
}: Radio013Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-013" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-013"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="scale">
          {SCALE.map((value) => (
            <label key={value} data-part="option">
              <input
                type="radio"
                name={name}
                value={value}
                aria-label={`Оценка ${value} из 5`}
                defaultChecked={value === defaultValue}
              />
              <span data-part="num" aria-hidden="true">
                {value}
              </span>
            </label>
          ))}
        </div>
        <div data-part="edges">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </fieldset>
    </>
  )
}
