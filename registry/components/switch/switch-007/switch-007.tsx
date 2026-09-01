import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch007Size = "sm" | "md" | "lg"

export type Switch007Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  legend?: string
  /** Какой размер показан включённым — остальные остаются выключенными. */
  checkedSize?: Switch007Size
  accent?: string
}

// Идея компонента: размерная шкала одного переключателя. Все три размера
// собраны из одной переменной --vibeui-switch-007-unit: ширина, высота,
// бегунок и его сдвиг считаются от неё через calc, поэтому новый размер —
// это одна строка, а не копия всего блока правил.
const STYLES = `
:where([data-vibeui-block="switch-007"]){
--vibeui-switch-007-bg:oklch(1 0 0);
--vibeui-switch-007-fg:oklch(0.22 0.014 265);
--vibeui-switch-007-muted:oklch(0.55 0.014 265);
--vibeui-switch-007-border:oklch(0.91 0.006 265);
--vibeui-switch-007-track:oklch(0.88 0.008 265);
--vibeui-switch-007-thumb:oklch(1 0 0);
--vibeui-switch-007-accent:oklch(0.55 0.19 300);
--vibeui-switch-007-unit:1.5rem;
--vibeui-switch-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-007"]{
display:flex;flex-direction:column;
width:100%;max-width:19rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-switch-007-bg);
border:1px solid var(--vibeui-switch-007-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-007-font);color:var(--vibeui-switch-007-fg);
}
[data-vibeui-block="switch-007"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-switch-007-muted);
}
[data-vibeui-block="switch-007"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="switch-007"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;cursor:pointer;
}
[data-vibeui-block="switch-007"] [data-part="name"]{font-size:0.875rem}
[data-vibeui-block="switch-007"] [data-part="code"]{
font-size:0.75rem;color:var(--vibeui-switch-007-muted);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Единственная переменная задаёт весь размер: ширина 1.85 высоты, бегунок
   на 4 пикселя меньше, сдвиг равен разнице ширины и бегунка. */
[data-vibeui-block="switch-007"] [data-part="row"][data-size="sm"]{--vibeui-switch-007-unit:1.125rem}
[data-vibeui-block="switch-007"] [data-part="row"][data-size="md"]{--vibeui-switch-007-unit:1.5rem}
[data-vibeui-block="switch-007"] [data-part="row"][data-size="lg"]{--vibeui-switch-007-unit:1.875rem}
[data-vibeui-block="switch-007"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-007"] input{
appearance:none;-webkit-appearance:none;margin:0;
height:var(--vibeui-switch-007-unit);
width:calc(var(--vibeui-switch-007-unit) * 1.85);
border-radius:9999px;background:var(--vibeui-switch-007-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-007"] input:checked{background:var(--vibeui-switch-007-accent)}
[data-vibeui-block="switch-007"] input:focus-visible{outline:2px solid var(--vibeui-switch-007-accent);outline-offset:2px}
[data-vibeui-block="switch-007"] [data-part="thumb"]{
position:absolute;left:0.125rem;top:0.125rem;
width:calc(var(--vibeui-switch-007-unit) - 0.25rem);
height:calc(var(--vibeui-switch-007-unit) - 0.25rem);
border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-007-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-007"] input:checked + [data-part="thumb"]{
transform:translateX(calc(var(--vibeui-switch-007-unit) * 0.85));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-007"] *{animation:none!important;transition:none!important}}
`

const SIZES: { value: Switch007Size; name: string; unit: string }[] = [
  { value: "sm", name: "Компактный", unit: "18px" },
  { value: "md", name: "Обычный", unit: "24px" },
  { value: "lg", name: "Крупный", unit: "30px" },
]

/**
 * Размерная шкала переключателя: sm, md и lg от одной CSS-переменной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch007({
  legend = "Размер переключателя",
  checkedSize = "md",
  accent,
  className,
  style,
  ...props
}: Switch007Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="switch-007"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {SIZES.map((size) => (
            <label key={size.value} data-part="row" data-size={size.value}>
              <span data-part="name">
                {size.name} <span data-part="code">{size.unit}</span>
              </span>
              <span data-part="track">
                <input
                  type="checkbox"
                  role="switch"
                  name={`size-${size.value}`}
                  defaultChecked={size.value === checkedSize}
                />
                <span data-part="thumb" aria-hidden="true" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
