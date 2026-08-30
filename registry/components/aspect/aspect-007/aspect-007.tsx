import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Aspect007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  /** Адрес встраиваемого документа: карта, таблица, презентация. */
  src?: string
  /** Подпись под кадром: что именно встроено и откуда. */
  source?: string
  accent?: string
}

// Идея компонента: рамка для чужого встраиваемого содержимого — карты,
// презентации, таблицы. Пока src не передан, кадр остаётся заглушкой с
// сеткой: чужой iframe грузится по клику, а не при открытии страницы, и
// пустая рамка не должна выглядеть поломкой. У iframe стоит loading="lazy"
// и title — без него скринридер называет вставку «frame».
const STYLES = `
:where([data-vibeui-block="aspect-007"]){
--vibeui-aspect-007-fg:oklch(0.24 0.014 265);
--vibeui-aspect-007-muted:oklch(0.52 0.014 265);
--vibeui-aspect-007-bg:oklch(0.965 0.005 265);
--vibeui-aspect-007-line:oklch(0.9 0.008 265);
--vibeui-aspect-007-border:oklch(0.89 0.006 265);
--vibeui-aspect-007-accent:oklch(0.55 0.2 262);
--vibeui-aspect-007-radius:0.875rem;
--vibeui-aspect-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="aspect-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;box-sizing:border-box;
color:var(--vibeui-aspect-007-fg);font-family:var(--vibeui-aspect-007-font);
}
[data-vibeui-block="aspect-007"] [data-part="frame"]{
position:relative;aspect-ratio:16 / 10;overflow:hidden;
border:1px solid var(--vibeui-aspect-007-border);
border-radius:var(--vibeui-aspect-007-radius);
background:var(--vibeui-aspect-007-bg);
}
[data-vibeui-block="aspect-007"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
/* Сетка-заглушка: пустая рамка карты должна читаться как карта. */
[data-vibeui-block="aspect-007"] [data-part="grid"]{
position:absolute;inset:0;
background-image:
linear-gradient(var(--vibeui-aspect-007-line) 1px,transparent 1px),
linear-gradient(90deg,var(--vibeui-aspect-007-line) 1px,transparent 1px);
background-size:2.5rem 2.5rem;
}
[data-vibeui-block="aspect-007"] [data-part="pin"]{
position:absolute;left:50%;top:50%;width:0.875rem;height:0.875rem;
margin:-0.9375rem 0 0 -0.4375rem;
border:2px solid var(--vibeui-aspect-007-accent);border-radius:9999px 9999px 9999px 0;
transform:rotate(-45deg);background:oklch(1 0 0);
}
[data-vibeui-block="aspect-007"] [data-part="hint"]{
position:absolute;left:0;right:0;bottom:0.75rem;text-align:center;
font-size:0.75rem;color:var(--vibeui-aspect-007-muted);
}
[data-vibeui-block="aspect-007"] [data-part="source"]{
font-size:0.75rem;color:var(--vibeui-aspect-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Рамка для встраиваемого содержимого: заглушка до загрузки iframe.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect007({
  title = "Карта проезда к студии",
  src,
  source = "Источник: OpenStreetMap",
  accent,
  className,
  style,
  ...props
}: Aspect007Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="aspect-007"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {src ? (
            <iframe src={src} title={title} loading="lazy" />
          ) : (
            <>
              <span data-part="grid" aria-hidden="true" />
              <span data-part="pin" aria-hidden="true" />
              <span data-part="hint">{title}</span>
            </>
          )}
        </div>
        {source ? <figcaption data-part="source">{source}</figcaption> : null}
      </figure>
    </>
  )
}
