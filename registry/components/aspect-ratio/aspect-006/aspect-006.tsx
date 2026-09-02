import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Aspect006Tile = {
  label: string
  hue?: number
}

export type Aspect006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  tiles?: Aspect006Tile[]
  /** Сколько кадров показывать сверх главного: остальные сворачиваются в счётчик. */
  visible?: number
  moreLabel?: string
}

// Идея компонента: коллаж из кадров разного размера. Соотношение задаётся не
// каждой плитке, а всей сетке: главный кадр занимает две колонки и две строки,
// мелкие — по одной, и вся композиция держит 3:2. Хвост сворачивается в
// счётчик на последней плитке — коллаж не должен расти бесконечно.
//
// Заливка плиток строится из оттенка и читается в обеих темах; из
// фиксированных цветов остаётся только рамка, и она следует color-scheme
// окружения через light-dark(). Своей подложки у коллажа нет.
const STYLES = `
:where([data-vibeui-block="aspect-006"]){
--vibeui-aspect-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-aspect-006-fg:oklch(0.99 0.003 265);
--vibeui-aspect-006-radius:0.875rem;
--vibeui-aspect-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="aspect-006"]{display:block;width:100%;box-sizing:border-box;font-family:var(--vibeui-aspect-006-font)}
/* Соотношение держит сетка целиком, а не каждая плитка отдельно. */
/* Раскладка живёт на внутренней рамке, а не на корне: контейнерный запрос
   применяется к потомкам контейнера, но не к нему самому. */
[data-vibeui-block="aspect-006"] [data-part="grid"]{
display:grid;gap:0.5rem;
grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,1fr);
width:100%;box-sizing:border-box;aspect-ratio:3 / 2;
}
[data-vibeui-block="aspect-006"] [data-part="tile"]{
position:relative;overflow:hidden;border-radius:var(--vibeui-aspect-006-radius);
border:1px solid var(--vibeui-aspect-006-border);
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.88 0.07 var(--vibeui-aspect-006-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.78 0.09 var(--vibeui-aspect-006-hue,250)),oklch(0.52 0.11 var(--vibeui-aspect-006-hue,250)));
}
[data-vibeui-block="aspect-006"] [data-part="tile"]:first-child{grid-column:span 2;grid-row:span 2}
[data-vibeui-block="aspect-006"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="aspect-006"] [data-part="label"]{
position:absolute;left:0.5rem;bottom:0.5rem;
padding:0.125rem 0.4375rem;border-radius:0.3125rem;
background:oklch(0.18 0.02 265 / 55%);color:var(--vibeui-aspect-006-fg);
font-size:0.6875rem;font-weight:600;
}
/* Счётчик на последней плитке: коллаж не растёт бесконечно. */
[data-vibeui-block="aspect-006"] [data-part="more"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
background:oklch(0.18 0.02 265 / 55%);color:var(--vibeui-aspect-006-fg);
font-size:1rem;font-weight:650;font-variant-numeric:tabular-nums;
}
/* В узкой колонке коллаж превращается в две колонки и три строки. */
@container (max-width: 26rem){
[data-vibeui-block="aspect-006"] [data-part="grid"]{grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);aspect-ratio:3 / 4}
[data-vibeui-block="aspect-006"] [data-part="tile"]:first-child{grid-column:span 2;grid-row:span 2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TILES: Aspect006Tile[] = [
  { label: "Главная", hue: 250 },
  { label: "Услуги", hue: 30 },
  { label: "О студии", hue: 150 },
  { label: "Контакты", hue: 300 },
  { label: "Блог", hue: 90 },
  { label: "Портфолио", hue: 200 },
]

/**
 * Коллаж кадров: соотношение держит сетка, хвост сворачивается в счётчик.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect006({
  tiles = DEFAULT_TILES,
  visible = 5,
  moreLabel = "+",
  className,
  style,
  ...props
}: Aspect006Props) {
  const shown = tiles.slice(0, Math.max(3, visible))
  const rest = tiles.length - shown.length

  return (
    <>
      <style href="vibeui-aspect-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="aspect-006"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="grid">
          {shown.map((tile, index) => {
            const last = index === shown.length - 1

            return (
              <div
                key={tile.label}
                data-part="tile"
                style={
                  {
                    "--vibeui-aspect-006-hue": tile.hue ?? 250,
                  } as CSSProperties
                }
              >
                <span data-part="label">{tile.label}</span>
                {last && rest > 0 ? (
                  <span data-part="more">
                    {moreLabel}
                    {rest}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
