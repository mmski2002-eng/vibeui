import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup025Props = Omit<ComponentProps<"div">, "children"> & {
  level?: number
  minLevel?: number
  maxLevel?: number
  label?: string
  /** Подпись кнопки приближения: компонент несёт русскую. */
  zoomInLabel?: string
  /** Подпись кнопки отдаления. */
  zoomOutLabel?: string
  /** Подпись кнопки геолокации. */
  locateLabel?: string
  /** Шаблон скрытого текста об уровне: {level} и {max} подставляются. */
  levelTemplate?: string
  accent?: string
}

// Идея компонента: плавающая колонка управления картой. Группа лежит поверх
// подложки, поэтому у неё есть собственная светлая заливка и тень: без них
// значки растворяются в любом снимке. Внутри два блока — зум и «моё
// положение» — разделены зазором, а не линией: разный смысл нельзя ставить
// вплотную, иначе палец промахивается мимо цели. Текущий уровень зума
// показан вертикальной шкалой из делений между «плюсом» и «минусом»: это
// не отдельный элемент, а ячейка той же сцепки.
const STYLES = `
:where([data-vibeui-block="buttongroup-025"]){
--vibeui-buttongroup-025-map:light-dark(oklch(0.93 0.02 150),oklch(0.3 0.024 155));
--vibeui-buttongroup-025-road:light-dark(oklch(0.99 0.004 150),oklch(0.42 0.016 155));
--vibeui-buttongroup-025-surface:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-buttongroup-025-fg:light-dark(oklch(0.26 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-025-muted:color-mix(in oklab,var(--vibeui-buttongroup-025-fg) 68%,transparent);
--vibeui-buttongroup-025-border:light-dark(oklch(0.9 0.006 265),oklch(0.41 0.012 265));
--vibeui-buttongroup-025-hover:light-dark(oklch(0.965 0.005 265),oklch(0.34 0.014 265));
--vibeui-buttongroup-025-tick:light-dark(oklch(0.88 0.008 265),oklch(0.46 0.012 265));
--vibeui-buttongroup-025-accent:light-dark(oklch(0.55 0.16 250),oklch(0.76 0.14 250));
--vibeui-buttongroup-025-radius:0.625rem;
--vibeui-buttongroup-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-025"]{color-scheme:dark}
[data-vibeui-block="buttongroup-025"]{
box-sizing:border-box;position:relative;
display:flex;align-items:flex-start;justify-content:flex-end;
width:100%;max-width:20rem;min-height:12rem;padding:0.75rem;
border-radius:1rem;overflow:hidden;
background:
linear-gradient(115deg,transparent 46%,var(--vibeui-buttongroup-025-road) 46% 49%,transparent 49%),
linear-gradient(20deg,transparent 62%,var(--vibeui-buttongroup-025-road) 62% 65%,transparent 65%),
var(--vibeui-buttongroup-025-map);
font-family:var(--vibeui-buttongroup-025-font);
}
[data-vibeui-block="buttongroup-025"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-025"] [data-part="rail"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="buttongroup-025"] [data-part="stack"]{
display:flex;flex-direction:column;isolation:isolate;
border-radius:var(--vibeui-buttongroup-025-radius);
background:var(--vibeui-buttongroup-025-surface);
box-shadow:0 1px 2px oklch(0.2 0.03 265 / 20%),0 6px 16px oklch(0.2 0.03 265 / 14%);
}
[data-vibeui-block="buttongroup-025"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-025-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-025"] [data-part="stack"] button + button{
border-block-start:1px solid var(--vibeui-buttongroup-025-border);
}
[data-vibeui-block="buttongroup-025"] svg{
width:1.0625rem;height:1.0625rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-025"] button:hover:not(:disabled){
background:var(--vibeui-buttongroup-025-hover);color:var(--vibeui-buttongroup-025-fg);
}
[data-vibeui-block="buttongroup-025"] button:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="buttongroup-025"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-025-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-025"] [data-part="stack"] :first-child{
border-start-start-radius:var(--vibeui-buttongroup-025-radius);
border-start-end-radius:var(--vibeui-buttongroup-025-radius);
}
[data-vibeui-block="buttongroup-025"] [data-part="stack"] :last-child{
border-end-start-radius:var(--vibeui-buttongroup-025-radius);
border-end-end-radius:var(--vibeui-buttongroup-025-radius);
}
/* Шкала уровня — ячейка сцепки, а не подпись сбоку. */
[data-vibeui-block="buttongroup-025"] [data-part="scale"]{
display:flex;flex-direction:column-reverse;align-items:center;justify-content:center;gap:2px;
padding:0.375rem 0;
border-block:1px solid var(--vibeui-buttongroup-025-border);
}
[data-vibeui-block="buttongroup-025"] [data-part="tick"]{
width:0.875rem;height:2px;border-radius:1px;
background:var(--vibeui-buttongroup-025-tick);
}
[data-vibeui-block="buttongroup-025"] [data-tick="on"]{background:var(--vibeui-buttongroup-025-accent)}
[data-vibeui-block="buttongroup-025"] [data-part="level"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-025"] *{animation:none!important;transition:none!important}}
`

/**
 * Плавающая колонка зума карты: сцепка со шкалой уровня и кнопкой геолокации.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup025({
  level = 4,
  minLevel = 1,
  maxLevel = 6,
  label = "Управление картой",
  zoomInLabel = "Приблизить",
  zoomOutLabel = "Отдалить",
  locateLabel = "Показать моё положение",
  levelTemplate = "Уровень приближения {level} из {max}",
  accent,
  className,
  style,
  ...props
}: Buttongroup025Props) {
  const current = Math.min(maxLevel, Math.max(minLevel, level))
  const levelText = levelTemplate
    .replace("{level}", String(current))
    .replace("{max}", String(maxLevel))
  const ticks = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, offset) => minLevel + offset,
  )

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-025"
        className={className}
        style={palette}
      >
        <div data-part="rail" role="group" aria-label={label}>
          <div data-part="stack">
            <button
              type="button"
              disabled={current === maxLevel}
              aria-label={zoomInLabel}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div data-part="scale">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  data-part="tick"
                  data-tick={tick <= current ? "on" : "off"}
                  aria-hidden="true"
                />
              ))}
              <span data-part="level">{levelText}</span>
            </div>
            <button
              type="button"
              disabled={current === minLevel}
              aria-label={zoomOutLabel}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
          <div data-part="stack">
            <button type="button" aria-label={locateLabel}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
