import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio002Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: string[]
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: самая простая радиогруппа — только вопрос и варианты,
// без карточек и рамок. Кружок собран из appearance:none и внутренней тени:
// точка внутри не отдельный узел, поэтому она не сдвигается при масштабе
// шрифта и наследует цвет акцента одной переменной.
const STYLES = `
:where([data-vibeui-block="radio-002"]){
--vibeui-radio-002-bg:oklch(1 0 0);
--vibeui-radio-002-fg:oklch(0.23 0.014 265);
--vibeui-radio-002-muted:oklch(0.56 0.014 265);
--vibeui-radio-002-border:oklch(0.9 0.006 265);
--vibeui-radio-002-ring:oklch(0.72 0.012 265);
--vibeui-radio-002-accent:oklch(0.55 0.19 262);
--vibeui-radio-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-002"]{
display:flex;flex-direction:column;
width:100%;max-width:18rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-002-bg);
border:1px solid var(--vibeui-radio-002-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-002-font);color:var(--vibeui-radio-002-fg);
}
/* float + clear: легенда fieldset иначе садится на рамку, а следующие
   flex-дети начинают её обтекать. */
[data-vibeui-block="radio-002"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-002"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="radio-002"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="radio-002"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-002-ring);
background:var(--vibeui-radio-002-bg);
transition:border-color .16s ease,box-shadow .16s ease;
}
/* Точка — внутренняя тень, а не отдельный узел: не съезжает при
   изменении размера шрифта и не требует лишнего span. */
[data-vibeui-block="radio-002"] input:checked{
border-color:var(--vibeui-radio-002-accent);
box-shadow:inset 0 0 0 0.25rem var(--vibeui-radio-002-bg),inset 0 0 0 1rem var(--vibeui-radio-002-accent);
}
[data-vibeui-block="radio-002"] input:hover:not(:checked){border-color:var(--vibeui-radio-002-muted)}
[data-vibeui-block="radio-002"] input:focus-visible{outline:2px solid var(--vibeui-radio-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Электронная почта",
  "Телефонный звонок",
  "Сообщение в мессенджер",
]

/**
 * Простая радиогруппа: вопрос и варианты, точка нарисована внутренней тенью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio002({
  legend = "Как с вами связаться",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-002",
  defaultValue = "Телефонный звонок",
  accent,
  className,
  style,
  ...props
}: Radio002Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-002" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-002"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {options.map((option) => (
            <label key={option} data-part="option">
              <input
                type="radio"
                name={name}
                value={option}
                defaultChecked={option === defaultValue}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
