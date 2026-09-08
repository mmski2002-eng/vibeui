import type { ComponentProps, CSSProperties } from "react"

export type Aspect002Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  /** Фотография кадра. Без неё остаётся нарисованная подложка. */
  image?: string
  title?: string
  /** Длительность ролика: «12:04». Показывается плашкой в углу. */
  duration?: string
  /** Ссылка на видео. Кадр становится ссылкой целиком. */
  href?: string
  /** Подпись ссылки для скринридера: {title} подставляется названием ролика. */
  watchLabel?: string
  /** Подпись ссылки, когда названия нет. */
  watchFallbackLabel?: string
  accent?: string
}

// Идея компонента: превью видео 16:9 с кнопкой воспроизведения по центру.
// Сам ролик не грузится: тяжёлый iframe плеера подключают по клику, а до
// клика на его месте стоит лёгкий кадр. Треугольник нарисован границами —
// иконочная библиотека ради одного знака не нужна.
//
// Кадр намеренно тёмный в обеих темах: это постер ролика, а не панель
// интерфейса. Светлеть вместе со страницей ему нечем — под ним стоит
// обложка, и светлая заливка сделала бы подпись нечитаемой.
const STYLES = `
:where([data-vibeui-block="aspect-002"]){
--vibeui-aspect-002-bg:oklch(0.28 0 265);
--vibeui-aspect-002-fg:oklch(0.98 0 265);
--vibeui-aspect-002-accent:oklch(0.62 0.2 25);
--vibeui-aspect-002-radius:0.875rem;
--vibeui-aspect-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="aspect-002"] > img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="aspect-002"]{
position:relative;display:block;width:100%;box-sizing:border-box;overflow:hidden;
aspect-ratio:16 / 9;border-radius:var(--vibeui-aspect-002-radius);
background:
radial-gradient(120% 100% at 20% 0%,oklch(0.42 0.06 265),transparent 60%),
var(--vibeui-aspect-002-bg);
color:var(--vibeui-aspect-002-fg);font-family:var(--vibeui-aspect-002-font);
text-decoration:none;
}
[data-vibeui-block="aspect-002"] > img,
[data-vibeui-block="aspect-002"] > video,
[data-vibeui-block="aspect-002"] > iframe{
position:absolute;inset:0;width:100%;height:100%;border:0;object-fit:cover;
}
/* Кнопка воспроизведения: круг с треугольником из границ. */
[data-vibeui-block="aspect-002"] [data-part="play"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
display:flex;align-items:center;justify-content:center;
width:3.5rem;height:3.5rem;border-radius:9999px;
background:var(--vibeui-aspect-002-accent);
box-shadow:0 10px 30px -12px oklch(0.15 0 265 / 70%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="aspect-002"]:hover [data-part="play"]{transform:translate(-50%,-50%) scale(1.06)}
[data-vibeui-block="aspect-002"] [data-part="play"]::before{
content:"";margin-left:0.25rem;
border-style:solid;border-width:0.5rem 0 0.5rem 0.8125rem;
border-color:transparent transparent transparent var(--vibeui-aspect-002-fg);
}
[data-vibeui-block="aspect-002"] [data-part="title"]{
position:absolute;left:0;right:0;bottom:0;padding:1.75rem 1rem 0.875rem;
font-size:0.875rem;font-weight:600;line-height:1.35;
background:linear-gradient(to top,oklch(0.15 0 265 / 75%),transparent);
}
[data-vibeui-block="aspect-002"] [data-part="duration"]{
position:absolute;right:0.625rem;top:0.625rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
background:oklch(0.15 0 265 / 70%);
font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="aspect-002"]:focus-visible{outline:2px solid var(--vibeui-aspect-002-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="aspect-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="aspect-002"]:hover [data-part="play"]{transform:translate(-50%,-50%)}
}
`

/**
 * Превью видео 16:9: лёгкий кадр вместо тяжёлого плеера до клика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect002({
  title = "Как собрать лендинг за вечер",
  image = "",
  duration = "12:04",
  href = "#",
  watchLabel = "Смотреть: {title}",
  watchFallbackLabel = "Смотреть видео",
  accent,
  className,
  style,
  ...props
}: Aspect002Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const content = (
    <>
      <span data-part="play" aria-hidden="true" />
      {duration ? <span data-part="duration">{duration}</span> : null}
      {title ? <span data-part="title">{title}</span> : null}
    </>
  )

  return (
    <>
      <style href="vibeui-aspect-002" precedence="medium">
        {STYLES}
      </style>
      {href ? (
        <a
          data-slot="aspect-ratio"
          data-vibeui-block="aspect-002"
          data-empty={image ? "false" : "true"}
          href={href}
          className={className}
          style={palette}
          aria-label={
            title ? watchLabel.replace("{title}", title) : watchFallbackLabel
          }
        >
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" />
          ) : null}
          {content}
        </a>
      ) : (
        <div
          {...props}
          data-vibeui-block="aspect-002"
          className={className}
          style={palette}
        >
          {content}
        </div>
      )}
    </>
  )
}
