import type { ComponentProps, CSSProperties } from "react"

export type Avatar031Props = Omit<ComponentProps<"ul">, "children"> & {
  names?: string[]
  photos?: string[]
  visible?: number
  overlap?: number
  size?: "sm" | "md" | "lg"
}

// Идея компонента: стопка, которая раздвигается и показывает всех. Плотная
// стопка экономит место, но лица в ней наполовину закрыты и по ним не нажать;
// раздвигать её по наведению мало — на клавиатуре наведения нет, поэтому
// раскрытие висит и на :focus-within. Перекрытие задано отрицательным margin в
// долях размера, поэтому одно число управляет и плотностью, и шириной строки, а
// раскрытие — это просто margin, уезжающий в ноль.
const STYLES = `
:where([data-vibeui-block="avatar-031"]){
--vibeui-avatar-031-size:2.5rem;
--vibeui-avatar-031-overlap:55;
--vibeui-avatar-031-surface:light-dark(oklch(1 0 0),oklch(0.19 0.01 265));
--vibeui-avatar-031-accent:light-dark(oklch(0.55 0.2 262),oklch(0.69 0.2 262));
--vibeui-avatar-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-031"]{
display:flex;align-items:center;width:max-content;max-width:100%;
margin:0;padding:0;list-style:none;
font-family:var(--vibeui-avatar-031-font);
}
[data-vibeui-block="avatar-031"] *{box-sizing:border-box}
[data-vibeui-block="avatar-031"] [data-part="cell"]{
margin-left:calc(var(--vibeui-avatar-031-size) * var(--vibeui-avatar-031-overlap) / -100);
transition:margin-left .22s ease;
}
[data-vibeui-block="avatar-031"] [data-part="cell"]:first-child{margin-left:0}
/* Раскрытие и по наведению, и по фокусу: на клавиатуре наведения нет. */
[data-vibeui-block="avatar-031"]:hover [data-part="cell"],
[data-vibeui-block="avatar-031"]:focus-within [data-part="cell"]{
margin-left:0.1875rem;
}
[data-vibeui-block="avatar-031"]:hover [data-part="cell"]:first-child,
[data-vibeui-block="avatar-031"]:focus-within [data-part="cell"]:first-child{margin-left:0}
[data-vibeui-block="avatar-031"] [data-part="face"]{
display:grid;place-items:center;
appearance:none;cursor:pointer;padding:0;border:0;
width:var(--vibeui-avatar-031-size);height:var(--vibeui-avatar-031-size);
border-radius:9999px;
box-shadow:0 0 0 0.125rem var(--vibeui-avatar-031-surface);
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-031-hue,265)),oklch(0.34 0.065 var(--vibeui-avatar-031-hue,265)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-031-hue,265)),oklch(0.88 0.063 var(--vibeui-avatar-031-hue,265)));
font:inherit;font-size:calc(var(--vibeui-avatar-031-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-031"] [data-part="face"]{overflow:hidden}
[data-vibeui-block="avatar-031"] [data-part="face"] img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block}
[data-vibeui-block="avatar-031"] [data-part="face"]:focus-visible{outline:2px solid var(--vibeui-avatar-031-accent);outline-offset:2px}
/* Порядок наложения слева направо: без него стопка читается наоборот. */
[data-vibeui-block="avatar-031"] [data-part="cell"]:nth-child(1){z-index:5}
[data-vibeui-block="avatar-031"] [data-part="cell"]:nth-child(2){z-index:4}
[data-vibeui-block="avatar-031"] [data-part="cell"]:nth-child(3){z-index:3}
[data-vibeui-block="avatar-031"] [data-part="cell"]:nth-child(4){z-index:2}
[data-vibeui-block="avatar-031"] [data-part="cell"]:nth-child(5){z-index:1}
[data-vibeui-block="avatar-031"] [data-part="cell"]{position:relative}
[data-vibeui-block="avatar-031"][data-size="sm"]{--vibeui-avatar-031-size:2rem}
[data-vibeui-block="avatar-031"][data-size="lg"]{--vibeui-avatar-031-size:3.5rem}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-031"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-031"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Ряд аватаров, который раздвигается по наведению и по фокусу с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar031({
  names = [
    "Анна Реброва",
    "Марк Ильин",
    "Мария Гурова",
    "Олег Дроздов",
    "Ирина Ким",
  ],
  photos = [],
  visible = 5,

  overlap = 55,
  size = "md",
  className,
  style,
  ...props
}: Avatar031Props) {
  const palette = {
    "--vibeui-avatar-031-overlap": Math.min(80, Math.max(0, overlap)),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-031" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-031"
        data-size={size}
        className={className}
        style={palette}
      >
        {names
          .slice(0, Math.max(1, Math.min(8, visible)))
          .map((person, index) => (
            <li
              key={person}
              data-part="cell"
              style={
                {
                  "--vibeui-avatar-031-hue": hue(person),
                } as CSSProperties
              }
            >
              {/* Каждое лицо — своя цель: закрытый наполовину кружок не нажать. */}
              <button type="button" data-part="face" aria-label={person}>
                {photos[index] ? (
                  <img src={photos[index]} alt="" />
                ) : (
                  <span aria-hidden="true">{initials(person)}</span>
                )}
              </button>
            </li>
          ))}
      </ul>
    </>
  )
}
