import type { ComponentProps, CSSProperties } from "react"

export type Images002Photo = {
  label: string
}

export type Images002Props = Omit<ComponentProps<"section">, "children"> & {
  photos?: Images002Photo[]
  accent?: string
  /** Реакция плитки на наведение: увеличение или приподнимание. */
  hover?: "zoom" | "lift"
  /** Плитки появляются по очереди. false — сразу видны все. */
  stagger?: boolean
}

// Идея: сетка плиток-плейсхолдеров, которая при появлении разлетается по
// очереди — каждая плитка масштабируется и проявляется из полупрозрачности
// со своей задержкой (nth-child), волна идёт слева направо, сверху вниз.
// Наведение добавляет второй, независимый отклик: лёгкий zoom или
// приподнимание с тенью — переключается пропом hover. Раскладка — грид от
// собственной ширины через container query, а не от окна.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="images-002"]){
--vibeui-images-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-images-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-images-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-images-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="images-002"]{color-scheme:dark}
[data-vibeui-block="images-002"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
min-width:min(100%,16rem);container-type:inline-size;
color:var(--vibeui-images-002-fg);font-family:var(--vibeui-images-002-font);
}
[data-vibeui-block="images-002"] *{box-sizing:border-box}
[data-vibeui-block="images-002"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(2,1fr);gap:0.625rem;
}
@container (min-width:24rem){
[data-vibeui-block="images-002"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
[data-vibeui-block="images-002"] [data-part="tile"]{
aspect-ratio:1;border-radius:0.75rem;border:1px solid var(--vibeui-images-002-border);
box-shadow:0 1px 2px oklch(0 0 0 / 0.06);
transition:transform 0.25s ease,box-shadow 0.25s ease;
animation:vibeui-images-002-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(1){
animation-delay:0s;
background:linear-gradient(135deg,oklch(0.72 0.15 30),oklch(0.5 0.18 345));
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(2){
animation-delay:0.06s;
background:linear-gradient(135deg,oklch(0.68 0.14 220),oklch(0.38 0.13 255));
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(3){
animation-delay:0.12s;
background:linear-gradient(135deg,oklch(0.76 0.15 145),oklch(0.48 0.12 170));
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(4){
animation-delay:0.18s;
background:linear-gradient(135deg,oklch(0.8 0.12 85),oklch(0.56 0.15 55));
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(5){
animation-delay:0.24s;
background:linear-gradient(135deg,oklch(0.74 0.16 300),oklch(0.46 0.16 320));
}
[data-vibeui-block="images-002"] [data-part="tile"]:nth-child(6){
animation-delay:0.3s;
background:linear-gradient(135deg,oklch(0.78 0.12 195),oklch(0.5 0.11 210));
}
[data-vibeui-block="images-002"][data-stagger="false"] [data-part="tile"]{
animation:none;opacity:1;
}
[data-vibeui-block="images-002"][data-hover="zoom"] [data-part="tile"]:hover{
transform:scale(1.05);
box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-images-002-accent) 55%,transparent),0 0.5rem 1.25rem -0.5rem oklch(0 0 0 / 0.35);
}
[data-vibeui-block="images-002"][data-hover="lift"] [data-part="tile"]:hover{
transform:translateY(-0.3125rem);
box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-images-002-accent) 55%,transparent),0 0.75rem 1.25rem -0.5rem oklch(0 0 0 / 0.35);
}
@keyframes vibeui-images-002-in{
from{opacity:0;transform:scale(0.88) translateY(0.375rem)}
to{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="images-002"] [data-part="tile"]{animation:none;opacity:1;transition:none}
[data-vibeui-block="images-002"] [data-part="tile"]:hover{transform:none;box-shadow:0 1px 2px oklch(0 0 0 / 0.06)}
}
`

const DEFAULT_PHOTOS: Images002Photo[] = [
  { label: "Горы" },
  { label: "Океан" },
  { label: "Лес" },
  { label: "Город" },
  { label: "Пустыня" },
  { label: "Северное сияние" },
]

/**
 * Отзывчивая сетка фотографий: плитки проявляются по очереди при появлении
 * и реагируют на наведение. Один файл, ноль зависимостей, собственная
 * палитра. Раскладка считается от собственной ширины блока.
 */
export function Images002({
  photos = DEFAULT_PHOTOS,
  accent,
  hover = "zoom",
  stagger = true,
  className,
  style,
  ...props
}: Images002Props) {
  const palette = {
    ...(accent ? { "--vibeui-images-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-images-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="images-002"
        data-slot="image-gallery"
        data-hover={hover}
        data-stagger={stagger ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="grid">
          {photos.map((photo) => (
            <span data-part="tile" key={photo.label} role="img" aria-label={photo.label} />
          ))}
        </div>
      </section>
    </>
  )
}
