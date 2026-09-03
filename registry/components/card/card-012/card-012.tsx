import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Card012Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  title?: string
  description?: string
  /** Соотношение сторон кадра. Место под медиа резервируется до загрузки. */
  ratio?: "16/9" | "4/3" | "1/1" | "3/2"
  /** Плашка поверх кадра: раздел, тип материала. */
  badge?: string
  /** Подпись в углу кадра: длительность, число слайдов, вес. */
  duration?: string
  meta?: ReactNode
  /** Содержимое кадра: <img>, <video>. Пусто — рисуется градиент-заглушка. */
  media?: ReactNode
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кадр сверху с жёстким соотношением сторон. Место под
// картинку резервируется через aspect-ratio ещё до её загрузки, поэтому
// текст под кадром не прыгает, а в сетке все карточки одной высоты.
// Плашка и длительность лежат поверх кадра на затемнении, а не рядом с ним.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-012"]){
--vibeui-card-012-bg:transparent;
--vibeui-card-012-fg:light-dark(oklch(0.22 0.015 265),oklch(0.94 0.006 265));
--vibeui-card-012-muted:color-mix(in oklab,var(--vibeui-card-012-fg) 68%,transparent);
--vibeui-card-012-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-card-012-accent:light-dark(oklch(0.58 0.19 25),oklch(0.7 0.17 25));
--vibeui-card-012-frame-from:light-dark(oklch(0.93 0.03 60),oklch(0.36 0.04 60));
--vibeui-card-012-frame-to:light-dark(oklch(0.86 0.05 25),oklch(0.29 0.05 25));
--vibeui-card-012-badge-bg:light-dark(oklch(1 0 0 / 92%),oklch(0.24 0.015 265 / 90%));
--vibeui-card-012-badge-fg:light-dark(oklch(0.22 0.015 265),oklch(0.95 0.006 265));
--vibeui-card-012-scrim:light-dark(oklch(0.2 0.02 265 / 78%),oklch(0.12 0.015 265 / 84%));
--vibeui-card-012-scrim-fg:oklch(0.99 0 0);
--vibeui-card-012-radius:0.9375rem;
--vibeui-card-012-ratio:16 / 9;
--vibeui-card-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-012"]{color-scheme:dark}
[data-vibeui-block="card-012"]{
display:flex;flex-direction:column;overflow:hidden;
width:100%;max-width:23rem;box-sizing:border-box;
background:var(--vibeui-card-012-bg);color:var(--vibeui-card-012-fg);
border:1px solid var(--vibeui-card-012-border);
border-radius:var(--vibeui-card-012-radius);
font-family:var(--vibeui-card-012-font);
}
[data-vibeui-block="card-012"][data-ratio="4/3"]{--vibeui-card-012-ratio:4 / 3}
[data-vibeui-block="card-012"][data-ratio="1/1"]{--vibeui-card-012-ratio:1 / 1}
[data-vibeui-block="card-012"][data-ratio="3/2"]{--vibeui-card-012-ratio:3 / 2}
/* Кадр держит пропорцию сам: место под картинку есть до её загрузки. */
[data-vibeui-block="card-012"] [data-part="frame"]{
position:relative;aspect-ratio:var(--vibeui-card-012-ratio);
background:
radial-gradient(110% 80% at 20% 0%,color-mix(in oklab,var(--vibeui-card-012-accent) 40%,transparent),transparent 65%),
linear-gradient(155deg,var(--vibeui-card-012-frame-from),var(--vibeui-card-012-frame-to));
}
[data-vibeui-block="card-012"] [data-part="frame"] img,
[data-vibeui-block="card-012"] [data-part="frame"] video{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="card-012"] [data-part="badge"]{
position:absolute;inset-block-start:0.625rem;inset-inline-start:0.625rem;
display:inline-flex;align-items:center;height:1.375rem;padding:0 0.5rem;
border-radius:9999px;background:var(--vibeui-card-012-badge-bg);
color:var(--vibeui-card-012-badge-fg);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="card-012"] [data-part="duration"]{
position:absolute;inset-block-end:0.625rem;inset-inline-end:0.625rem;
display:inline-flex;align-items:center;height:1.25rem;padding:0 0.4375rem;
border-radius:0.375rem;background:var(--vibeui-card-012-scrim);
color:var(--vibeui-card-012-scrim-fg);font-size:0.6875rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-012"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="card-012"] [data-part="title"]{
margin:0;font-size:1rem;font-weight:640;line-height:1.35;letter-spacing:-0.01em;
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
[data-vibeui-block="card-012"] [data-part="description"]{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-card-012-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
[data-vibeui-block="card-012"] [data-part="meta"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.125rem;
font-size:0.75rem;color:var(--vibeui-card-012-muted);
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Карточка с кадром сверху и фиксированным соотношением сторон.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card012({
  title = "Сборка каталога на container queries",
  description = "Разбираем, почему карточка обязана считать раскладку от своей ширины.",
  ratio = "16/9",
  badge = "Видео",
  duration = "12:40",
  meta = "Опубликовано вчера",
  media,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card012Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-012" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-012"
        data-ratio={ratio}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {media}
          {badge ? <span data-part="badge">{badge}</span> : null}
          {duration ? <span data-part="duration">{duration}</span> : null}
        </div>
        <div data-part="body">
          <h3 data-part="title">{title}</h3>
          {description ? <p data-part="description">{description}</p> : null}
          {meta ? <p data-part="meta">{meta}</p> : null}
        </div>
      </article>
    </>
  )
}
