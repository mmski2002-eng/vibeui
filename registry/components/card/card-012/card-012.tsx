import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Card012Props = Omit<
  ComponentPropsWithoutRef<"article">,
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
  accent?: string
}

// Идея компонента: кадр сверху с жёстким соотношением сторон. Место под
// картинку резервируется через aspect-ratio ещё до её загрузки, поэтому
// текст под кадром не прыгает, а в сетке все карточки одной высоты.
// Плашка и длительность лежат поверх кадра на затемнении, а не рядом с ним.
const STYLES = `
:where([data-vibeui-block="card-012"]){
--vibeui-card-012-bg:oklch(1 0 0);
--vibeui-card-012-fg:oklch(0.22 0.015 265);
--vibeui-card-012-muted:oklch(0.55 0.013 265);
--vibeui-card-012-border:oklch(0.91 0.006 265);
--vibeui-card-012-accent:oklch(0.58 0.19 25);
--vibeui-card-012-radius:0.9375rem;
--vibeui-card-012-ratio:16 / 9;
--vibeui-card-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
linear-gradient(155deg,oklch(0.93 0.03 60),oklch(0.86 0.05 25));
}
[data-vibeui-block="card-012"] [data-part="frame"] img,
[data-vibeui-block="card-012"] [data-part="frame"] video{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="card-012"] [data-part="badge"]{
position:absolute;inset-block-start:0.625rem;inset-inline-start:0.625rem;
display:inline-flex;align-items:center;height:1.375rem;padding:0 0.5rem;
border-radius:9999px;background:oklch(1 0 0 / 92%);
color:var(--vibeui-card-012-fg);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="card-012"] [data-part="duration"]{
position:absolute;inset-block-end:0.625rem;inset-inline-end:0.625rem;
display:inline-flex;align-items:center;height:1.25rem;padding:0 0.4375rem;
border-radius:0.375rem;background:oklch(0.2 0.02 265 / 78%);
color:oklch(0.99 0 0);font-size:0.6875rem;font-weight:600;
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
  accent,
  className,
  style,
  ...props
}: Card012Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-012" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
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
