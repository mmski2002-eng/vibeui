import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Skeleton006Props = ComponentPropsWithoutRef<"div"> & {
  /** Число строк в каждом абзаце: длина списка задаёт число абзацев. */
  paragraphs?: number[]
  label?: string
}

// Идея компонента: абзац-заглушка нарисован одним элементом, а не пачкой
// полос. Строки вырезаны повторяющейся маской, поэтому их число меняется
// одной переменной, а интерлиньяж по определению совпадает с будущим текстом.
// Недописанная последняя строка — накладка цвета подложки поверх маски:
// внутрь маски её положить нельзя, она сама была бы вырезана.
const STYLES = `
:where([data-vibeui-block="skeleton-006"]){
--vibeui-skeleton-006-bg:oklch(1 0 0);
--vibeui-skeleton-006-border:oklch(0.9 0.006 265);
--vibeui-skeleton-006-base:oklch(0.93 0.005 265);
--vibeui-skeleton-006-shine:oklch(0.97 0.003 265);
--vibeui-skeleton-006-line:0.6875rem;
--vibeui-skeleton-006-step:1.375rem;
--vibeui-skeleton-006-lines:3;
--vibeui-skeleton-006-tail:32%;
}
[data-vibeui-block="skeleton-006"]{
display:flex;flex-direction:column;gap:1.125rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1.125rem 1.25rem;
background:var(--vibeui-skeleton-006-bg);
border:1px solid var(--vibeui-skeleton-006-border);border-radius:1rem;
}
[data-vibeui-block="skeleton-006"] [data-part="para"]{position:relative}
/* Строки вырезаны маской: их число — одна переменная, а не количество узлов. */
[data-vibeui-block="skeleton-006"] [data-part="lines"]{
display:block;
height:calc(var(--vibeui-skeleton-006-lines) * var(--vibeui-skeleton-006-step) - (var(--vibeui-skeleton-006-step) - var(--vibeui-skeleton-006-line)));
background:linear-gradient(90deg,
var(--vibeui-skeleton-006-base) 0%,
var(--vibeui-skeleton-006-shine) 50%,
var(--vibeui-skeleton-006-base) 100%) 0 0 / 200% 100%;
mask:repeating-linear-gradient(
to bottom,
#000 0 var(--vibeui-skeleton-006-line),
transparent var(--vibeui-skeleton-006-line) var(--vibeui-skeleton-006-step));
animation:vibeui-skeleton-006-sweep 1.6s ease-in-out infinite;
}
/* Хвост последней строки: накладка подложки поверх — маска съела бы ребёнка. */
[data-vibeui-block="skeleton-006"] [data-part="cut"]{
position:absolute;right:0;bottom:0;
width:var(--vibeui-skeleton-006-tail);height:var(--vibeui-skeleton-006-line);
background:var(--vibeui-skeleton-006-bg);
}
@keyframes vibeui-skeleton-006-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="skeleton-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="skeleton-006"] [data-part="lines"]{background:var(--vibeui-skeleton-006-base)}
}
`

const TAILS = ["34%", "18%", "47%", "26%", "39%"]

/**
 * Заглушка абзацев: строки вырезаны повторяющейся маской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton006({
  paragraphs = [3, 4, 2],
  label = "Текст загружается",
  className,
  style,
  ...props
}: Skeleton006Props) {
  return (
    <>
      <style href="vibeui-skeleton-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="skeleton-006"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        {paragraphs.map((lines, index) => (
          <div
            key={index}
            data-part="para"
            style={
              {
                "--vibeui-skeleton-006-lines": Math.max(1, lines),
                "--vibeui-skeleton-006-tail": TAILS[index % TAILS.length],
              } as CSSProperties
            }
          >
            <span data-part="lines" />
            <span data-part="cut" />
          </div>
        ))}
      </div>
    </>
  )
}
