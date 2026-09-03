import type { ComponentProps, CSSProperties } from "react"

export type Skeleton006Props = ComponentProps<"div"> & {
  /** Число строк в каждом абзаце: длина списка задаёт число абзацев. */
  paragraphs?: number[]
  label?: string
  /** Подложка абзацев. Пусто — собственная подложка компонента. */
  background?: string
}

// Идея компонента: абзац-заглушка нарисован одним элементом, а не пачкой
// полос. Строки вырезаны повторяющейся маской, поэтому их число меняется
// одной переменной, а интерлиньяж по определению совпадает с будущим текстом.
// Недописанная последняя строка — накладка цвета подложки поверх маски:
// внутрь маски её положить нельзя, она сама была бы вырезана. Поэтому у
// компонента, в отличие от соседей, подложка непрозрачная: накладке нужно
// чем-то закрашивать хвост. Обе ветки light-dark() у неё свои.
const STYLES = `
:where([data-vibeui-block="skeleton-006"]){
--vibeui-skeleton-006-bg:light-dark(oklch(1 0 0),oklch(0.22 0.011 265));
--vibeui-skeleton-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-skeleton-006-base:light-dark(oklch(0.93 0.005 265),oklch(0.3 0.012 265));
--vibeui-skeleton-006-shine:light-dark(oklch(0.97 0.003 265),oklch(0.39 0.016 265));
--vibeui-skeleton-006-line:0.6875rem;
--vibeui-skeleton-006-step:1.375rem;
--vibeui-skeleton-006-lines:3;
--vibeui-skeleton-006-tail:32%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="skeleton-006"]{color-scheme:dark}
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы полосам
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
 * Заглушка абзацев: строки вырезаны повторяющейся маской.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Skeleton006({
  paragraphs = [3, 4, 2],
  label = "Текст загружается",
  background = "",
  className,
  style,
  ...props
}: Skeleton006Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-skeleton-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-skeleton-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="skeleton"
        data-vibeui-block="skeleton-006"
        role="status"
        aria-busy="true"
        aria-label={label}
        className={className}
        style={palette}
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
