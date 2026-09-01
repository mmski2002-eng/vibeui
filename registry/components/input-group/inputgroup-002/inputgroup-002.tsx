import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup002Country = {
  code: string
  title: string
}

export type Inputgroup002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  label?: string
  countries?: Inputgroup002Country[]
  hint?: string
  accent?: string
}

// Идея компонента: слева нативный select с кодом страны, справа номер, и обе
// половины делят одну рамку. Select именно нативный — от него бесплатно
// достаются клавиатура, поиск по букве и системное колесо на телефоне.
// Ширина select не резиновая: она задана в ch, чтобы номер не прыгал при
// смене страны. Код и номер уходят двумя полями формы — склеивать их должен
// сервер, он же знает формат.
const STYLES = `
:where([data-vibeui-block="inputgroup-002"]){
--vibeui-inputgroup-002-surface:oklch(1 0 0);
--vibeui-inputgroup-002-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-002-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-002-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-002-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-002-fixed:oklch(0.965 0.003 265);
--vibeui-inputgroup-002-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-002-accent:oklch(0.53 0.16 200);
--vibeui-inputgroup-002-radius:0.75rem;
--vibeui-inputgroup-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-002"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-002-surface);
border:1px solid var(--vibeui-inputgroup-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-002-font);color:var(--vibeui-inputgroup-002-fg);
}
[data-vibeui-block="inputgroup-002"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-002"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-002"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-002-border);
border-radius:0;margin-left:-1px;font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="inputgroup-002"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-002-radius) 0 0 var(--vibeui-inputgroup-002-radius);
}
[data-vibeui-block="inputgroup-002"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-002-radius) var(--vibeui-inputgroup-002-radius) 0;
}
[data-vibeui-block="inputgroup-002"] [data-part="group"] > *:focus{
z-index:1;outline:2px solid var(--vibeui-inputgroup-002-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-002-accent);
}
/* Ширина в ch: код страны меняется, а номер не должен ездить. */
[data-vibeui-block="inputgroup-002"] select{
appearance:none;flex:none;width:7.5ch;padding:0 1.375rem 0 0.75rem;cursor:pointer;
background:var(--vibeui-inputgroup-002-fixed);
font-variant-numeric:tabular-nums;font-weight:600;
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.9rem) 50%,calc(100% - 0.6rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-002"] input{
flex:1;min-width:0;padding:0 0.875rem;
background:var(--vibeui-inputgroup-002-field);
font-variant-numeric:tabular-nums;letter-spacing:0.02em;
}
[data-vibeui-block="inputgroup-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-002"] *{animation:none!important;transition:none!important}}
`

const COUNTRIES: Inputgroup002Country[] = [
  { code: "+7", title: "Россия" },
  { code: "+375", title: "Беларусь" },
  { code: "+77", title: "Казахстан" },
  { code: "+995", title: "Грузия" },
]

/**
 * Сцепка «код страны + номер»: нативный select слева, номер справа, рамка одна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup002({
  name = "phone",
  label = "Телефон для связи",
  countries = COUNTRIES,
  hint = "Код страны и номер уходят двумя полями — склеит их сервер.",
  accent,
  className,
  style,
  ...props
}: Inputgroup002Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-002"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-number`}>{label}</label>
        <div data-part="group">
          <select
            name={`${name}-code`}
            aria-label="Код страны"
            defaultValue={countries[0]?.code}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>
          <input
            id={`${name}-number`}
            name={name}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="999 000-00-00"
            aria-describedby={`${name}-hint`}
          />
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
