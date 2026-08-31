import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton002Props = ComponentPropsWithoutRef<"div"> & {
  /** Пропорция медиа-места: карточка держит его до загрузки картинки. */
  ratio?: "16 / 9" | "4 / 3" | "1 / 1"
  label?: string
}

// Идея компонента: заглушка карточки повторяет её каркас целиком — обложку с
// заданной пропорцией, заголовок, две строки текста и ряд кнопок. Место под
// обложку занято через aspect-ratio, поэтому при подстановке картинки высота
// карточки не меняется и соседи по сетке не прыгают.
const STYLES = `
:where([data-vibeui-block="skeleton-002"]){
--vibeui-skeleton-002-bg:oklch(1 0 0);
--vibeui-skeleton-002-border:oklch(0.9 0.006 265);
--vibeui-skeleton-002-base:oklch(0.93 0.005 265);
--vibeui-skeleton-002-shine:oklch(0.97 0.003 265);
--vibeui-skeleton-002-ratio:16 / 9;
}
[data-vibeui-block="skeleton-002"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-skeleton-002-bg);
border:1px solid var(--vibeui-skeleton-002-border);border-radius:1rem;
}
/* Один рецепт заливки на все формы: блик и база не расходятся между частями. */
[data-vibeui-block="skeleton-002"] [data-part="media"],
[data-vibeui-block="skeleton-002"] [data-part="bar"],
[data-vibeui-block="skeleton-002"] [data-part="pill"]{
background:linear-gradient(90deg,
var(--vibeui-skeleton-002-base) 0%,
var(--vibeui-skeleton-002-shine) 50%,
var(--vibeui-skeleton-002-base) 100%) 0 0 / 200% 100%;
animation:vibeui-skeleton-002-sweep 1.4s ease-in-out infinite;
}
/* Место под обложку занято пропорцией: подстановка картинки не двигает сетку. */
[data-vibeui-block="skeleton-002"] [data-part="media"]{
aspect-ratio:var(--vibeui-skeleton-002-ratio);width:100%;
}
[data-vibeui-block="skeleton-002"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0.9375rem 1rem 1.0625rem;
}
[data-vibeui-block="skeleton-002"] [data-part="bar"]{height:0.75rem;border-radius:0.25rem}
[data-vibeui-block="skeleton-002"] [data-part="bar"][data-size="title"]{height:1.0625rem;width:72%;border-radius:0.3125rem}
[data-vibeui-block="skeleton-002"] [data-part="bar"][data-size="short"]{width:54%}
[data-vibeui-block="skeleton-002"] [data-part="actions"]{
display:flex;gap:0.5rem;margin-top:0.25rem;
}
[data-vibeui-block="skeleton-002"] [data-part="pill"]{
height:2rem;border-radius:9999px;flex:1 1 0;
}
[data-vibeui-block="skeleton-002"] [data-part="pill"][data-size="icon"]{flex:none;width:2rem}
@keyframes vibeui-skeleton-002-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-002"] [data-part="media"],
[data-vibeui-block="skeleton-002"] [data-part="bar"],
[data-vibeui-block="skeleton-002"] [data-part="pill"]{background:var(--vibeui-skeleton-002-base)}
}
`

/**
 * Заглушка карточки: обложка с пропорцией, заголовок, текст и кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton002({
  ratio = "16 / 9",
  label = "Карточка загружается",
  className,
  style,
  ...props
}: Skeleton002Props) {
  const palette = {
    "--vibeui-skeleton-002-ratio": ratio,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-002"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="media" />
        <div data-part="body">
          <div data-part="bar" data-size="title" />
          <div data-part="bar" />
          <div data-part="bar" data-size="short" />
          <div data-part="actions">
            <div data-part="pill" />
            <div data-part="pill" data-size="icon" />
          </div>
        </div>
      </div>
    </>
  )
}
