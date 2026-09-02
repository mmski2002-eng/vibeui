import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Popover005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  /** Палитра меток: каждый цвет — отдельная радиокнопка с подписью. */
  swatches?: { name: string; value: string }[]
  /** Имя выбранного по умолчанию цвета. */
  selected?: string
  /** Пояснение под сеткой. */
  hint?: string
  accent?: string
  /** Подложка панели и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: выбор цвета метки, где цвет — это radio, а не div с
// обработчиком. Кружки нарисованы из спрятанных радиокнопок, поэтому выбор
// работает стрелками, попадает в форму и не требует ни строчки JS.
const STYLES = `
:where([data-vibeui-block="popover-005"]){
--vibeui-popover-005-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-005-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-005-muted:light-dark(oklch(0.54 0.014 265),oklch(0.71 0.012 265));
--vibeui-popover-005-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-popover-005-swatch:oklch(0.6 0.17 255);
--vibeui-popover-005-edge:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 18%));
--vibeui-popover-005-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="popover-005"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-005-font);color:var(--vibeui-popover-005-fg);
}
[data-vibeui-block="popover-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem 0 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-popover-005-border);
background:var(--vibeui-popover-005-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
anchor-name:--vibeui-popover-005-anchor;
}
[data-vibeui-block="popover-005"] [data-part="chip"]{
width:1rem;height:1rem;border-radius:0.3125rem;flex:none;
box-shadow:inset 0 0 0 1px var(--vibeui-popover-005-edge);
}
[data-vibeui-block="popover-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-005-accent);outline-offset:2px}
/* Раскладка панели — только под :popover-open, иначе display перебьёт
   собственный display:none браузера и панель не закроется никогда. */
[data-vibeui-block="popover-005"] [data-part="panel"]{
position:fixed;margin:0;padding:0.75rem;
width:min(14.5rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-005-border);border-radius:0.875rem;
background:var(--vibeui-popover-005-bg);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-005-shadow);
position-anchor:--vibeui-popover-005-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
[data-vibeui-block="popover-005"] [data-part="panel"]:popover-open{display:flex;flex-direction:column;gap:0.625rem}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-005"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0}
}
[data-vibeui-block="popover-005"] fieldset{margin:0;padding:0;border:0;min-width:0}
[data-vibeui-block="popover-005"] legend{
padding:0;margin-bottom:0.5rem;float:left;width:100%;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-popover-005-muted);
}
/* legend с float:left ломает поток следующих детей — обязательный clear. */
[data-vibeui-block="popover-005"] [data-part="grid"]{
clear:both;display:grid;grid-template-columns:repeat(5,1fr);gap:0.375rem;
}
[data-vibeui-block="popover-005"] [data-part="swatch"]{
position:relative;display:block;cursor:pointer;
aspect-ratio:1;border-radius:0.5rem;
background:var(--vibeui-popover-005-swatch);
box-shadow:inset 0 0 0 1px var(--vibeui-popover-005-edge);
transition:transform .14s ease;
}
[data-vibeui-block="popover-005"] [data-part="swatch"]:hover{transform:scale(1.08)}
[data-vibeui-block="popover-005"] [data-part="swatch"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);border:0;
}
/* Выбранный кружок обведён кольцом того же цвета: :has() вместо класса. */
[data-vibeui-block="popover-005"] [data-part="swatch"]:has(input:checked){
box-shadow:inset 0 0 0 1px var(--vibeui-popover-005-edge),0 0 0 2px var(--vibeui-popover-005-bg),0 0 0 4px var(--vibeui-popover-005-swatch);
}
[data-vibeui-block="popover-005"] [data-part="swatch"]:has(input:focus-visible){outline:2px solid var(--vibeui-popover-005-accent);outline-offset:3px}
[data-vibeui-block="popover-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="popover-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-popover-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SWATCHES = [
  { name: "Графит", value: "oklch(0.45 0.02 265)" },
  { name: "Синий", value: "oklch(0.6 0.17 255)" },
  { name: "Бирюзовый", value: "oklch(0.7 0.13 195)" },
  { name: "Зелёный", value: "oklch(0.68 0.16 150)" },
  { name: "Жёлтый", value: "oklch(0.83 0.15 90)" },
  { name: "Оранжевый", value: "oklch(0.7 0.17 55)" },
  { name: "Красный", value: "oklch(0.62 0.2 25)" },
  { name: "Розовый", value: "oklch(0.68 0.18 350)" },
  { name: "Фиолетовый", value: "oklch(0.58 0.19 300)" },
  { name: "Лавандовый", value: "oklch(0.75 0.09 290)" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поповер выбора цвета метки: сетка кружков на спрятанных радиокнопках.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover005({
  label = "Цвет метки",
  swatches = DEFAULT_SWATCHES,
  selected = "Синий",
  hint = "Цвет применится ко всем задачам с этой меткой.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover005Props) {
  const id = useId().replace(/:/g, "")
  const current =
    swatches.find((swatch) => swatch.name === selected) ?? swatches[0]
  const palette = {
    ...(accent ? { "--vibeui-popover-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="popover-005"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          <span
            data-part="chip"
            style={{ background: current?.value }}
            aria-hidden="true"
          />
          {label}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={label}
        >
          <fieldset>
            <legend>{label}</legend>
            <div data-part="grid">
              {swatches.map((swatch) => (
                <label
                  data-part="swatch"
                  key={swatch.name}
                  title={swatch.name}
                  style={
                    {
                      "--vibeui-popover-005-swatch": swatch.value,
                    } as CSSProperties
                  }
                >
                  <input
                    type="radio"
                    name={`${id}-color`}
                    value={swatch.name}
                    defaultChecked={swatch.name === current?.name}
                  />
                  <span data-part="sr">{swatch.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p data-part="hint">{hint}</p>
        </div>
      </div>
    </>
  )
}
