import type { ComponentProps, CSSProperties } from "react"

export type Skeleton001Shape = "text" | "avatar" | "block"

export type Skeleton001Props = ComponentProps<"div"> & {
  shape?: Skeleton001Shape
  /** Сколько строк рисовать в форме text. Последняя всегда короче. */
  lines?: number
  /** Подпись для скринридера: что именно грузится. */
  label?: string
}

// Идея компонента: заглушка повторяет метрику будущего текста, а не рисует
// серые прямоугольники наугад. Высота строки и промежутки те же, что у
// абзаца, поэтому при появлении данных страница не прыгает.
//
// Тема берётся из color-scheme окружения через light-dark(): заглушка темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="skeleton-001"]){
--vibeui-skeleton-001-base:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-skeleton-001-shine:light-dark(oklch(0.97 0 265),oklch(0.39 0 265));
--vibeui-skeleton-001-radius:0.375rem;
--vibeui-skeleton-001-line:1rem;
--vibeui-skeleton-001-gap:0.625rem;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="skeleton-001"]{color-scheme:dark}
[data-vibeui-block="skeleton-001"]{
display:flex;flex-direction:column;gap:var(--vibeui-skeleton-001-gap);
width:100%;
}
[data-vibeui-block="skeleton-001"] [data-part="bar"]{
height:var(--vibeui-skeleton-001-line);
border-radius:var(--vibeui-skeleton-001-radius);
background:
linear-gradient(90deg,var(--vibeui-skeleton-001-base) 0%,var(--vibeui-skeleton-001-shine) 50%,var(--vibeui-skeleton-001-base) 100%)
0 0 / 200% 100%;
animation:vibeui-skeleton-001-sweep 1.4s ease-in-out infinite;
}
/* Последняя строка короче: так абзац-заглушка читается как текст. */
[data-vibeui-block="skeleton-001"] [data-part="bar"]:last-child{width:62%}
[data-vibeui-block="skeleton-001"][data-shape="avatar"]{flex-direction:row;align-items:center;gap:0.75rem}
[data-vibeui-block="skeleton-001"][data-shape="avatar"] [data-part="circle"]{
width:2.5rem;height:2.5rem;flex:none;border-radius:9999px;
background:
linear-gradient(90deg,var(--vibeui-skeleton-001-base) 0%,var(--vibeui-skeleton-001-shine) 50%,var(--vibeui-skeleton-001-base) 100%)
0 0 / 200% 100%;
animation:vibeui-skeleton-001-sweep 1.4s ease-in-out infinite;
}
[data-vibeui-block="skeleton-001"][data-shape="avatar"] [data-part="stack"]{
display:flex;flex-direction:column;gap:0.5rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="skeleton-001"][data-shape="avatar"] [data-part="bar"]:first-child{width:45%}
[data-vibeui-block="skeleton-001"][data-shape="block"] [data-part="bar"]{
height:auto;aspect-ratio:16 / 9;width:100%;
border-radius:0.75rem;
}
@keyframes vibeui-skeleton-001-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-001"] [data-part="bar"],
[data-vibeui-block="skeleton-001"] [data-part="circle"]{background:var(--vibeui-skeleton-001-base)}
}
`

/**
 * Заглушка загрузки, повторяющая метрику будущего содержимого.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton001({
  shape = "text",
  lines = 3,
  label = "Загружается",
  className,
  style,
  ...props
}: Skeleton001Props) {
  const count = shape === "text" ? Math.max(1, lines) : 2

  return (
    <>
      <style href="vibeui-skeleton-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="skeleton"
        data-vibeui-block="skeleton-001"
        data-shape={shape}
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        {shape === "avatar" ? (
          <>
            <div data-part="circle" />
            <div data-part="stack">
              <div data-part="bar" />
              <div data-part="bar" />
            </div>
          </>
        ) : shape === "block" ? (
          <div data-part="bar" />
        ) : (
          Array.from({ length: count }, (_, index) => (
            <div key={index} data-part="bar" />
          ))
        )}
      </div>
    </>
  )
}
