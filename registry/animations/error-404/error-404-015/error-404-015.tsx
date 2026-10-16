import type { ComponentProps, CSSProperties } from "react"

export type Error404015Props = Omit<ComponentProps<"section">, "children"> & {
  word?: string
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет хромированных фигур. */
  accent?: string
  /** Пусто — чёрная подложка. */
  background?: string
}

// Невесомость: буквы слова и блестящие фигуры разлетелись по кадру и
// медленно кувыркаются в 3D, каждая вокруг своей оси и со своим периодом.
// Фигуры — радиальные градиенты с бликом, буквы — обычный текст с
// rotate3d, поэтому сцена остаётся читаемой и без WebGL.
const STYLES = `
:where([data-vibeui-block="error-404-015"]){
--vibeui-error-404-015-bg:light-dark(oklch(0.97 0 0),oklch(0.08 0 0));
--vibeui-error-404-015-fg:light-dark(oklch(0.12 0 0),oklch(0.98 0 0));
--vibeui-error-404-015-accent:oklch(0.62 0.2 265);
--vibeui-error-404-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-015"]{color-scheme:dark}
[data-vibeui-block="error-404-015"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;perspective:50rem;
background:var(--vibeui-error-404-015-bg);color:var(--vibeui-error-404-015-fg);font-family:var(--vibeui-error-404-015-font);
}
[data-vibeui-block="error-404-015"] [data-part="float"]{
position:absolute;left:var(--vibeui-error-404-015-x);top:var(--vibeui-error-404-015-y);
animation:vibeui-error-404-015-tumble var(--vibeui-error-404-015-d) linear infinite,vibeui-error-404-015-bob calc(var(--vibeui-error-404-015-d) / 3) ease-in-out infinite alternate;
transform-style:preserve-3d;
}
[data-vibeui-block="error-404-015"] [data-part="letter"]{font-size:clamp(1.5rem,5cqi,2.75rem);font-weight:700}
[data-vibeui-block="error-404-015"] [data-part="shape"]{
width:var(--vibeui-error-404-015-s);aspect-ratio:1;border-radius:var(--vibeui-error-404-015-round);
background:radial-gradient(circle at 30% 25%,oklch(1 0 0) 0 6%,color-mix(in oklab,var(--vibeui-error-404-015-tint) 70%,white) 20%,var(--vibeui-error-404-015-tint) 55%,oklch(0.12 0.02 265));
}
@keyframes vibeui-error-404-015-tumble{to{rotate:var(--vibeui-error-404-015-axis) 360deg}}
@keyframes vibeui-error-404-015-bob{to{translate:0 -1.25rem}}
[data-vibeui-block="error-404-015"] [data-part="center"]{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:1rem}
[data-vibeui-block="error-404-015"] [data-part="code"]{margin:0;font-size:0.8125rem;letter-spacing:0.5em;text-transform:uppercase}
[data-vibeui-block="error-404-015"] [data-part="action"]{
display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border:1px solid color-mix(in oklab,var(--vibeui-error-404-015-fg) 40%,transparent);border-radius:999px;
color:inherit;text-decoration:none;font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;transition:background .2s ease,color .2s ease;
}
[data-vibeui-block="error-404-015"] [data-part="action"]:hover{background:var(--vibeui-error-404-015-fg);color:var(--vibeui-error-404-015-bg)}
[data-vibeui-block="error-404-015"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-015-fg);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-015"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-015"]{width:100%}
`

const SPOTS = [
  ["12%", "18%"],
  ["70%", "10%"],
  ["86%", "44%"],
  ["18%", "70%"],
  ["62%", "78%"],
  ["40%", "12%"],
  ["8%", "44%"],
  ["80%", "70%"],
  ["50%", "86%"],
  ["30%", "34%"],
]
const SHAPES = [
  { size: "22cqi", round: "38%", tint: "var(--vibeui-error-404-015-accent)" },
  { size: "11cqi", round: "50%", tint: "oklch(0.75 0.12 350)" },
  { size: "14cqi", round: "28%", tint: "oklch(0.7 0 0)" },
  { size: "9cqi", round: "50% 50% 12% 50%", tint: "oklch(0.85 0.04 250)" },
]

function spin(index: number) {
  const axes = ["1 1 0", "0 1 1", "1 0 1", "1 1 1", "-1 1 0"]
  return { axis: axes[index % axes.length], duration: `${9 + (index % 5) * 2.5}s` }
}

export function Error404015({
  word = "ERROR",
  code = "Ошибка 404",
  actionLabel = "На главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: Error404015Props) {
  const letters = `${word}404`.split("")
  const palette = {
    ...(accent ? { "--vibeui-error-404-015-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-015-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-015" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-015"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        {SHAPES.map((shape, index) => {
          const [x, y] = SPOTS[(index * 3 + 1) % SPOTS.length]
          const motion = spin(index + 2)
          return (
            <span
              key={`shape-${index}`}
              data-part="float"
              aria-hidden="true"
              style={
                {
                  "--vibeui-error-404-015-x": x,
                  "--vibeui-error-404-015-y": y,
                  "--vibeui-error-404-015-d": motion.duration,
                  "--vibeui-error-404-015-axis": motion.axis,
                } as CSSProperties
              }
            >
              <span
                data-part="shape"
                style={
                  {
                    "--vibeui-error-404-015-s": shape.size,
                    "--vibeui-error-404-015-round": shape.round,
                    "--vibeui-error-404-015-tint": shape.tint,
                  } as CSSProperties
                }
              />
            </span>
          )
        })}
        {letters.map((letter, index) => {
          const [x, y] = SPOTS[index % SPOTS.length]
          const motion = spin(index)
          return (
            <span
              key={`letter-${index}`}
              data-part="float"
              aria-hidden="true"
              style={
                {
                  "--vibeui-error-404-015-x": x,
                  "--vibeui-error-404-015-y": y,
                  "--vibeui-error-404-015-d": motion.duration,
                  "--vibeui-error-404-015-axis": motion.axis,
                } as CSSProperties
              }
            >
              <span data-part="letter">{letter}</span>
            </span>
          )
        })}
        <div data-part="center">
          <h1 data-part="code">{code}</h1>
          <a data-part="action" href={actionHref}>
            {actionLabel} →
          </a>
        </div>
      </section>
    </>
  )
}
