import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch014Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "size"
> & {
  label?: string
  description?: string
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: значки живут в самой дорожке, а не едут вместе с
// бегунком. Слева — засечка выключения, справа — галочка включения; обе
// нарисованы на месте и всегда видны, но активная сторона высвечивается
// цветом, а бегунок просто указывает на неё, наезжая на противоположный знак.
const STYLES = `
:where([data-vibeui-block="switch-014"]){
--vibeui-switch-014-bg:transparent;
--vibeui-switch-014-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-014-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-switch-014-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-014-track:light-dark(oklch(0.72 0.02 265),oklch(0.46 0.018 265));
--vibeui-switch-014-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-014-accent:light-dark(oklch(0.55 0.16 155),oklch(0.62 0.15 155));
--vibeui-switch-014-mark:light-dark(oklch(1 0 0 / 55%),oklch(1 0 0 / 45%));
--vibeui-switch-014-mark-active:light-dark(oklch(1 0 0 / 95%),oklch(1 0 0 / 90%));
--vibeui-switch-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-014"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-014-bg);
border:1px solid var(--vibeui-switch-014-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-014-font);color:var(--vibeui-switch-014-fg);
cursor:pointer;
}
[data-vibeui-block="switch-014"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="switch-014"] [data-part="title"]{font-size:0.9375rem;line-height:1.3}
[data-vibeui-block="switch-014"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-014-muted)}
[data-vibeui-block="switch-014"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-014"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:3.5rem;height:1.875rem;border-radius:9999px;
background:var(--vibeui-switch-014-track);cursor:inherit;
transition:background-color .2s ease;
}
[data-vibeui-block="switch-014"] input:checked{background:var(--vibeui-switch-014-accent)}
[data-vibeui-block="switch-014"] input:focus-visible{outline:2px solid var(--vibeui-switch-014-accent);outline-offset:2px}
/* Знаки закреплены в торцах дорожки и никуда не едут — сдвигается только
   бегунок поверх них. */
[data-vibeui-block="switch-014"] [data-part="off-mark"],
[data-vibeui-block="switch-014"] [data-part="on-mark"]{
position:absolute;top:0;bottom:0;display:flex;align-items:center;pointer-events:none;
color:var(--vibeui-switch-014-mark);
transition:color .2s ease;
}
[data-vibeui-block="switch-014"] [data-part="off-mark"]{left:0.4375rem}
[data-vibeui-block="switch-014"] [data-part="on-mark"]{right:0.4375rem}
[data-vibeui-block="switch-014"] input:not(:checked) ~ [data-part="off-mark"]{color:var(--vibeui-switch-014-mark-active)}
[data-vibeui-block="switch-014"] input:checked ~ [data-part="on-mark"]{color:var(--vibeui-switch-014-mark-active)}
/* Засечка выключения: короткий горизонтальный штрих. */
[data-vibeui-block="switch-014"] [data-part="off-mark"]::before{
content:"";width:0.5rem;height:1.5px;border-radius:1px;background:currentColor;
}
/* Галочка включения: угол квадрата, повёрнутый на 45°. */
[data-vibeui-block="switch-014"] [data-part="on-mark"]::before{
content:"";width:0.375rem;height:0.625rem;margin-top:-0.0625rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="switch-014"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.5rem;height:1.5rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-014-thumb);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 30%);
transition:transform .2s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-014"] input:checked + [data-part="off-mark"] + [data-part="on-mark"] + [data-part="thumb"]{transform:translateX(1.625rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-014"] *{animation:none!important;transition:none!important}}
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
 * Переключатель со значками в торцах дорожки: засечка и галочка стоят на
 * месте, бегунок просто указывает на активную сторону.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch014({
  label = "Автовоспроизведение",
  description = "Следующее видео начинается без нажатия.",
  background = "",
  accent,
  defaultChecked = true,
  className,
  style,
  ...props
}: Switch014Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-014" precedence="medium">
        {STYLES}
      </style>
      <label
        data-vibeui-block="switch-014"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{label}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        <span data-part="track">
          <input
            {...props}
            type="checkbox"
            role="switch"
            defaultChecked={defaultChecked}
          />
          <span data-part="off-mark" aria-hidden="true" />
          <span data-part="on-mark" aria-hidden="true" />
          <span data-part="thumb" aria-hidden="true" />
        </span>
      </label>
    </>
  )
}
