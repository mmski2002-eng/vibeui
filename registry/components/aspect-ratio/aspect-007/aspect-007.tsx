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
  /** Пусто — подложки нет, рамка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: рамка для чужого встраиваемого содержимого — карты,
// презентации, таблицы. Пока src не передан, кадр остаётся заглушкой с
// сеткой: чужой iframe грузится по клику, а не при открытии страницы, и
// пустая рамка не должна выглядеть поломкой. У iframe стоит loading="lazy"
// и title — без него скринридер называет вставку «frame».
//
// Тема берётся из color-scheme окружения через light-dark(): рамка темнеет
// вместе со страницей и по умолчанию не выкладывает под себя плашку.
const STYLES = `
:where([data-vibeui-block="aspect-007"]){
--vibeui-aspect-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-aspect-007-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-aspect-007-bg:transparent;
--vibeui-aspect-007-line:light-dark(oklch(0.9 0.008 265),oklch(0.33 0.012 265));
--vibeui-aspect-007-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-aspect-007-pin:light-dark(oklch(1 0 0),oklch(0.26 0.014 265));
--vibeui-aspect-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
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
transform:rotate(-45deg);background:var(--vibeui-aspect-007-pin);
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
 * Рамка для встраиваемого содержимого: заглушка до загрузки iframe.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect007({
  title = "Карта проезда к студии",
  src,
  source = "Источник: OpenStreetMap",
  background = "",
  accent,
  className,
  style,
  ...props
}: Aspect007Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-aspect-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
