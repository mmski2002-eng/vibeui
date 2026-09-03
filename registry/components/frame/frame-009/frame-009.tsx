import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame009Props = Omit<ComponentProps<"figure">, "title"> & {
  label?: string
  scale?: string
  caption?: string
  /** Подпись линейки для скринридера: {scale} подставляется значением. */
  scaleLabel?: string
  accent?: string
  /** Пусто — остаётся собственный тон земли; сюда задают свой цвет карты. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр карты с меткой и масштабной линейкой поверх неё —
// стандартная пара элементов любого картографического сервиса. Условная
// сетка улиц заменяет реальную карту: подключать картографический API ради
// превью незачем, а сетка честно читается как заглушка, а не как ошибка
// загрузки. Метка нарисована формой capли через border-radius и transform,
// без иконочного шрифта. Масштаб и подпись метки обёрнуты aria-label —
// сама линейка и «хвост» метки декоративны и не должны звучать дважды.
const STYLES = `
:where([data-vibeui-block="frame-009"]){
--vibeui-frame-009-land:light-dark(oklch(0.94 0.014 145),oklch(0.27 0.016 145));
--vibeui-frame-009-line:light-dark(oklch(0.86 0.012 145),oklch(0.36 0.014 145));
--vibeui-frame-009-border:light-dark(oklch(0.82 0.014 145),oklch(0.44 0.015 145));
--vibeui-frame-009-chip:light-dark(oklch(1 0 0),oklch(0.3 0.01 265));
--vibeui-frame-009-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-009-muted:color-mix(in oklab,var(--vibeui-frame-009-fg) 68%,transparent);
--vibeui-frame-009-accent:light-dark(oklch(0.58 0.19 25),oklch(0.7 0.19 25));
--vibeui-frame-009-radius:0.875rem;
--vibeui-frame-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-009"]{color-scheme:dark}
[data-vibeui-block="frame-009"]{
display:block;margin:0;width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-009-font);color:var(--vibeui-frame-009-fg);
}
[data-vibeui-block="frame-009"] *{box-sizing:border-box}
[data-vibeui-block="frame-009"] [data-part="shell"]{
position:relative;overflow:hidden;
aspect-ratio:4 / 3;width:100%;
background:var(--vibeui-frame-009-land);
border:1px solid var(--vibeui-frame-009-border);
border-radius:var(--vibeui-frame-009-radius);
}
[data-vibeui-block="frame-009"] [data-part="map"]{position:absolute;inset:0}
[data-vibeui-block="frame-009"] [data-part="map"] > *{display:block;width:100%;height:100%}
/* Условная сетка улиц заменяет карту: честная заглушка, а не поддельный снимок. */
[data-vibeui-block="frame-009"] [data-part="grid"]{
position:absolute;inset:0;
background-image:
repeating-linear-gradient(0deg,transparent 0 2.75rem,var(--vibeui-frame-009-line) 2.75rem 2.8125rem),
repeating-linear-gradient(90deg,transparent 0 3.5rem,var(--vibeui-frame-009-line) 3.5rem 2.8125rem);
}
[data-vibeui-block="frame-009"] [data-part="pin"]{
position:absolute;top:42%;left:54%;
display:flex;flex-direction:column;align-items:center;gap:0.3125rem;
transform:translate(-50%,-100%);
}
[data-vibeui-block="frame-009"] [data-part="pin-label"]{
padding:0.1875rem 0.5625rem;border-radius:9999px;
max-width:11rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
background:var(--vibeui-frame-009-chip);
border:1px solid var(--vibeui-frame-009-border);
font-size:0.6875rem;font-weight:600;
box-shadow:0 0.0625rem 0.125rem oklch(0 0 0 / 0.1);
}
/* Метка нарисована каплей: круг со срезанным углом, развёрнутый на 45°. */
[data-vibeui-block="frame-009"] [data-part="pin-glyph"]{
position:relative;flex:none;
width:1.375rem;height:1.375rem;
border-radius:9999px 9999px 9999px 0;
background:var(--vibeui-frame-009-accent);
transform:rotate(-45deg);
box-shadow:0 0.125rem 0.25rem oklch(0 0 0 / 0.25);
}
[data-vibeui-block="frame-009"] [data-part="pin-glyph"]::after{
content:"";position:absolute;top:50%;left:50%;
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-frame-009-chip);
transform:translate(-50%,-50%) rotate(45deg);
}
[data-vibeui-block="frame-009"] [data-part="scale"]{
position:absolute;left:0.75rem;bottom:0.75rem;
display:flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-frame-009-chip);
border:1px solid var(--vibeui-frame-009-border);
box-shadow:0 0.0625rem 0.125rem oklch(0 0 0 / 0.1);
}
[data-vibeui-block="frame-009"] [data-part="scale-bar"]{
display:flex;height:0.375rem;overflow:hidden;
border:1px solid var(--vibeui-frame-009-fg);border-radius:0.125rem;
}
[data-vibeui-block="frame-009"] [data-part="scale-seg"]{width:1rem;height:100%}
[data-vibeui-block="frame-009"] [data-part="scale-seg"][data-tone="dark"]{background:var(--vibeui-frame-009-fg)}
[data-vibeui-block="frame-009"] [data-part="scale-seg"][data-tone="light"]{background:var(--vibeui-frame-009-chip)}
[data-vibeui-block="frame-009"] [data-part="scale-text"]{font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums}
[data-vibeui-block="frame-009"] figcaption{
margin-top:0.625rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-009-muted);text-align:center;
}
@container (max-width: 20rem){
[data-vibeui-block="frame-009"] [data-part="pin-label"]{max-width:7rem;font-size:0.625rem}
[data-vibeui-block="frame-009"] [data-part="scale"]{padding:0.25rem 0.5rem;gap:0.375rem}
[data-vibeui-block="frame-009"] [data-part="scale-seg"]{width:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-009"] *{animation:none!important;transition:none!important}}
`

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
 * Кадр карты с меткой и масштабной линейкой поверх условной сетки улиц.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame009({
  label = "ул. Пушкина, 12",
  scale = "500 м",
  caption = "Точка на карте с масштабной линейкой",
  scaleLabel = "Масштаб: {scale}",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame009Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-009-land": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="map">
            {children ?? <div data-part="grid" aria-hidden="true" />}
          </div>
          <div data-part="pin" aria-label={label}>
            <span data-part="pin-label" aria-hidden="true">
              {label}
            </span>
            <span data-part="pin-glyph" aria-hidden="true" />
          </div>
          <div
            data-part="scale"
            aria-label={scaleLabel.replace("{scale}", scale)}
          >
            <span data-part="scale-bar" aria-hidden="true">
              <span data-part="scale-seg" data-tone="dark" />
              <span data-part="scale-seg" data-tone="light" />
              <span data-part="scale-seg" data-tone="dark" />
            </span>
            <span data-part="scale-text" aria-hidden="true">
              {scale}
            </span>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
