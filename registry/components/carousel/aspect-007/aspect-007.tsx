import type { ComponentProps, CSSProperties } from "react"

export type Aspect007Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
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
--vibeui-aspect-007-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-aspect-007-muted:color-mix(in oklab,var(--vibeui-aspect-007-fg) 68%,transparent);
--vibeui-aspect-007-bg:transparent;
--vibeui-aspect-007-line:light-dark(oklch(0.9 0 265),oklch(0.33 0 265));
--vibeui-aspect-007-land:light-dark(oklch(0.96 0.008 110),oklch(0.26 0 250));
--vibeui-aspect-007-park:light-dark(oklch(0.89 0.07 150),oklch(0.36 0.05 155));
--vibeui-aspect-007-water:light-dark(oklch(0.86 0.07 230),oklch(0.38 0.06 235));
--vibeui-aspect-007-road:light-dark(oklch(0.92 0.05 85),oklch(0.45 0.04 85));
--vibeui-aspect-007-border:light-dark(oklch(0.89 0 265),oklch(0.38 0 265));
--vibeui-aspect-007-pin:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-aspect-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-aspect-007-radius:0.875rem;
--vibeui-aspect-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="aspect-007"]{color-scheme:dark}
[data-vibeui-block="aspect-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;box-sizing:border-box;
color:var(--vibeui-aspect-007-fg);font-family:var(--vibeui-aspect-007-font);
}
[data-vibeui-block="aspect-007"] [data-part="frame"]{
position:relative;aspect-ratio:16 / 10;overflow:hidden;
border:1px solid var(--vibeui-aspect-007-border);
border-radius:var(--vibeui-aspect-007-radius);
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="aspect-007"] [data-part="frame"][data-empty="true"]{background:var(--vibeui-aspect-007-bg);}
[data-vibeui-block="aspect-007"] [data-part="frame"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="aspect-007"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
/* Сетка-заглушка: пустая рамка карты должна читаться как карта. Поверх
   тона земли идут парк, река и магистраль — без цвета сетка остаётся
   миллиметровкой, а не картой. */
[data-vibeui-block="aspect-007"] [data-part="grid"]{
position:absolute;inset:0;
background-color:var(--vibeui-aspect-007-land);
background-image:
linear-gradient(var(--vibeui-aspect-007-line) 1px,transparent 1px),
linear-gradient(90deg,var(--vibeui-aspect-007-line) 1px,transparent 1px);
background-size:2.5rem 2.5rem;
}
[data-vibeui-block="aspect-007"] [data-part="park"]{
position:absolute;left:8%;top:14%;width:26%;height:34%;
border-radius:0.5rem;background:var(--vibeui-aspect-007-park);
}
[data-vibeui-block="aspect-007"] [data-part="water"]{
position:absolute;inset:auto 0 0;height:26%;
background:var(--vibeui-aspect-007-water);
clip-path:polygon(0 44%,22% 28%,48% 52%,72% 30%,100% 48%,100% 100%,0 100%);
}
[data-vibeui-block="aspect-007"] [data-part="road"]{
position:absolute;left:-6%;right:-6%;top:56%;height:0.375rem;
background:var(--vibeui-aspect-007-road);
transform:rotate(-6deg);
}
[data-vibeui-block="aspect-007"] [data-part="pin"]{
position:absolute;left:50%;top:50%;width:0.875rem;height:0.875rem;
margin:-0.9375rem 0 0 -0.4375rem;
border:2px solid var(--vibeui-aspect-007-accent);border-radius:9999px 9999px 9999px 0;
transform:rotate(-45deg);background:var(--vibeui-aspect-007-pin);
}
/* Подпись лежит на плашке: под ней теперь река, и на воде текст пропадал бы. */
[data-vibeui-block="aspect-007"] [data-part="hint"]{
position:absolute;left:50%;bottom:0.75rem;transform:translateX(-50%);
max-width:calc(100% - 1.5rem);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.1875rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-aspect-007-pin);
border:1px solid var(--vibeui-aspect-007-border);
font-size:0.75rem;color:var(--vibeui-aspect-007-fg);
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
  image = "",
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
        data-slot="aspect-ratio"
        data-vibeui-block="aspect-007"
        className={className}
        style={palette}
      >
        <div data-part="frame" data-empty={image ? undefined : "true"}>
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" />
          ) : null}
          {src ? (
            <iframe src={src} title={title} loading="lazy" />
          ) : (
            <>
              <span data-part="grid" aria-hidden="true" />
              <span data-part="park" aria-hidden="true" />
              <span data-part="water" aria-hidden="true" />
              <span data-part="road" aria-hidden="true" />
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
