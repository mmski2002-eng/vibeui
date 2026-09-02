import type { ComponentProps, CSSProperties } from "react"

export type Avatar037Props = Omit<ComponentProps<"span">, "children"> & {
  /** Идентификатор: имя, почта, адрес кошелька — что угодно постоянное. */
  seed?: string
  name?: string
  size?: "sm" | "md" | "lg"
  shape?: "circle" | "square"
}

// Идея компонента: запасной аватар без инициалов. Две буквы годятся, пока у
// человека есть имя; у почты, номера и адреса кошелька его нет, и в списке
// получается стена одинаковых «@». Здесь из идентификатора считается узор:
// сетка 5×5, зеркальная по вертикали, — он детерминирован, различим боковым
// зрением и никогда не совпадает с чужим при разном seed.
const STYLES = `
:where([data-vibeui-block="avatar-037"]){
--vibeui-avatar-037-size:2.5rem;
--vibeui-avatar-037-hue:250;
--vibeui-avatar-037-bg:light-dark(oklch(0.95 0.02 var(--vibeui-avatar-037-hue)),oklch(0.26 0.02 var(--vibeui-avatar-037-hue)));
--vibeui-avatar-037-ink:light-dark(oklch(0.55 0.15 var(--vibeui-avatar-037-hue)),oklch(0.72 0.14 var(--vibeui-avatar-037-hue)));
--vibeui-avatar-037-radius:9999px;
}
[data-vibeui-block="avatar-037"]{
position:relative;display:inline-flex;flex:none;
width:var(--vibeui-avatar-037-size);height:var(--vibeui-avatar-037-size);
vertical-align:middle;
}
[data-vibeui-block="avatar-037"][data-size="sm"]{--vibeui-avatar-037-size:2rem}
[data-vibeui-block="avatar-037"][data-size="lg"]{--vibeui-avatar-037-size:3.5rem}
[data-vibeui-block="avatar-037"][data-shape="square"]{--vibeui-avatar-037-radius:0.75rem}
[data-vibeui-block="avatar-037"] svg{
width:100%;height:100%;display:block;
border-radius:var(--vibeui-avatar-037-radius);
background:var(--vibeui-avatar-037-bg);
}
[data-vibeui-block="avatar-037"] rect{fill:var(--vibeui-avatar-037-ink)}
/* Имя для скринридера: узор он не прочитает, а подпись нужна. */
[data-vibeui-block="avatar-037"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-037"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-037"] *{animation:none!important;transition:none!important}}
`

/**
 * Хеш идентификатора: FNV-1a. Тот же алгоритм, что у остальных аватаров
 * категории, — один человек получает один оттенок во всех компонентах.
 */
function hashOf(seed: string): number {
  let hash = 2166136261

  for (const symbol of seed) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

/**
 * Узор 5×5, зеркальный по вертикали: считаются только три левых столбца,
 * правые повторяют их отражением. Симметричная фигура читается как знак,
 * а несимметричная — как шум.
 */
function cellsOf(hash: number): boolean[][] {
  const rows: boolean[][] = []
  let bits = hash

  for (let row = 0; row < 5; row += 1) {
    const half: boolean[] = []

    for (let column = 0; column < 3; column += 1) {
      half.push((bits & 1) === 1)
      bits = Math.imul(bits >>> 1, 2246822519) >>> 0
    }

    rows.push([...half, half[1], half[0]])
  }

  return rows
}

/**
 * Генеративный аватар: узор считается из идентификатора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar037({
  seed = "anna@vibeui.ru",
  name = "Анна Реброва",
  size = "md",
  shape = "circle",
  className,
  style,
  ...props
}: Avatar037Props) {
  const hash = hashOf(seed)
  const palette = {
    "--vibeui-avatar-037-hue": (hash % 12) * 30,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-037" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-037"
        data-size={size}
        data-shape={shape}
        className={className}
        style={palette}
      >
        {/* Поле вокруг сетки: без него круглая маска срезает крайние клетки
            и узор читается как обрезанный. */}
        <svg viewBox="-1 -1 7 7" aria-hidden="true">
          {cellsOf(hash).map((row, y) =>
            row.map((filled, x) =>
              filled ? (
                <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
              ) : null,
            ),
          )}
        </svg>
        <span data-part="name">{name}</span>
      </span>
    </>
  )
}
