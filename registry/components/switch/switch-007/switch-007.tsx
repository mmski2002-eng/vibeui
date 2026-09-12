import type { ComponentProps, CSSProperties } from "react"

export type Switch007Size = "sm" | "md" | "lg"

export type Switch007Props = Omit<ComponentProps<"fieldset">, "children"> & {
  legend?: string
  /** Какой размер показан включённым — остальные остаются выключенными. */
  checkedSize?: Switch007Size
  /** Подписи размеров: компонент несёт русские, проект подставляет свои. */
  sizeLabels?: Record<Switch007Size, string>
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: размерная шкала одного переключателя. Все три размера
// собраны из одной переменной --vibeui-switch-007-unit: ширина, высота,
// бегунок и его сдвиг считаются от неё через calc, поэтому новый размер —
// это одна строка, а не копия всего блока правил.
const STYLES = `
:where([data-vibeui-block="switch-007"]){
--vibeui-switch-007-bg:transparent;
--vibeui-switch-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-switch-007-muted:color-mix(in oklab,var(--vibeui-switch-007-fg) 68%,transparent);
--vibeui-switch-007-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-switch-007-track:light-dark(oklch(0.88 0 265),oklch(0.43 0 265));
--vibeui-switch-007-thumb:light-dark(oklch(1 0 0),oklch(0.93 0 265));
--vibeui-switch-007-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-switch-007-unit:1.5rem;
--vibeui-switch-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-007"]{color-scheme:dark}
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
[data-vibeui-block="switch-007"] input:checked{background:var(--vibeui-switch-007-accent);color:oklch(from var(--vibeui-switch-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="switch-007"] input:focus-visible{outline:2px solid var(--vibeui-switch-007-accent);outline-offset:2px}
[data-vibeui-block="switch-007"] [data-part="thumb"]{
position:absolute;left:0.125rem;top:0.125rem;
width:calc(var(--vibeui-switch-007-unit) - 0.25rem);
height:calc(var(--vibeui-switch-007-unit) - 0.25rem);
border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-007-thumb);
box-shadow:0 1px 2px oklch(0.2 0 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-007"] input:checked + [data-part="thumb"]{
transform:translateX(calc(var(--vibeui-switch-007-unit) * 0.85));
}
/* Ползунок на включённом треке: контраст к чернильному акценту, а не белый на белом. */
[data-vibeui-block="switch-007"] input:checked + [data-part="thumb"],[data-vibeui-block="switch-007"] input:checked ~ [data-part="thumb"]{background:oklch(from var(--vibeui-switch-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-007"] *{animation:none!important;transition:none!important}}
`

const SIZES: { value: Switch007Size; unit: string }[] = [
  { value: "sm", unit: "18px" },
  { value: "md", unit: "24px" },
  { value: "lg", unit: "30px" },
]

const SIZE_LABEL: Record<Switch007Size, string> = {
  sm: "Компактный",
  md: "Обычный",
  lg: "Крупный",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Размерная шкала переключателя: sm, md и lg от одной CSS-переменной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch007({
  legend = "Размер переключателя",
  checkedSize = "md",
  sizeLabels = SIZE_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch007Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="switch"
        data-vibeui-block="switch-007"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {SIZES.map((size) => (
            <label key={size.value} data-part="row" data-size={size.value}>
              <span data-part="name">
                {sizeLabels[size.value] ?? SIZE_LABEL[size.value]}{" "}
                <span data-part="code">{size.unit}</span>
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
