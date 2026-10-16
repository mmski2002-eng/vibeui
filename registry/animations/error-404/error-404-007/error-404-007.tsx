import type { ComponentProps, CSSProperties } from "react"

export type Error404007Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет полотна. */
  accent?: string
}

// Кричащий плакат: заголовок во весь кадр, а вокруг плавают объёмные
// игрушки — пончик, шар, звезда, капсула, — собранные градиентами CSS.
// Каждая качается по своей траектории и со своим периодом, поэтому
// композиция всё время меняется, но не дёргается.
const STYLES = `
:where([data-vibeui-block="error-404-007"]){
--vibeui-error-404-007-accent:oklch(0.93 0.19 105);
--vibeui-error-404-007-fg:oklch(0.12 0 0);
--vibeui-error-404-007-font:"Arial Narrow","Helvetica Neue Condensed",Impact,ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="error-404-007"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;
background:var(--vibeui-error-404-007-accent);color:var(--vibeui-error-404-007-fg);font-family:var(--vibeui-error-404-007-font);text-align:center;
}
[data-vibeui-block="error-404-007"] [data-part="title"]{
position:relative;z-index:1;margin:0;font-size:clamp(3rem,15cqi,9rem);font-weight:900;line-height:0.86;letter-spacing:-0.03em;text-transform:uppercase;
}
[data-vibeui-block="error-404-007"] [data-part="code"]{position:relative;z-index:1;margin:1rem 0 0;font-family:ui-monospace,monospace;font-size:0.8125rem;letter-spacing:0.2em}
[data-vibeui-block="error-404-007"] [data-part="action"]{
position:relative;z-index:3;display:inline-block;margin-top:1rem;padding:0.75rem 1.25rem;background:var(--vibeui-error-404-007-fg);color:var(--vibeui-error-404-007-accent);
font-family:ui-sans-serif,system-ui,sans-serif;font-weight:700;font-size:0.875rem;text-decoration:none;transition:transform .2s ease;
}
[data-vibeui-block="error-404-007"] [data-part="action"]:hover{transform:rotate(-3deg) scale(1.05)}
[data-vibeui-block="error-404-007"] [data-part="action"]:focus-visible{outline:3px solid var(--vibeui-error-404-007-fg);outline-offset:3px}
[data-vibeui-block="error-404-007"] [data-part="toy"]{
position:absolute;z-index:2;left:var(--vibeui-error-404-007-x);top:var(--vibeui-error-404-007-y);width:var(--vibeui-error-404-007-s);aspect-ratio:1;
animation:vibeui-error-404-007-float var(--vibeui-error-404-007-d) ease-in-out infinite alternate;pointer-events:none;
filter:drop-shadow(0 1rem 1.25rem oklch(0 0 0 / 22%));
}
@keyframes vibeui-error-404-007-float{
from{transform:translate(0,0) rotate(-12deg)}
to{transform:translate(1.25rem,-1.75rem) rotate(14deg)}
}
[data-vibeui-block="error-404-007"] [data-toy="donut"]{
border-radius:50%;background:radial-gradient(circle at 50% 50%,transparent 22%,oklch(0.82 0.1 70) 23%,oklch(0.68 0.13 55) 60%,transparent 61%),radial-gradient(circle at 35% 30%,oklch(0.9 0.08 75),oklch(0.6 0.12 50));
mask:radial-gradient(circle,transparent 22%,#000 23%,#000 68%,transparent 69%);
}
[data-vibeui-block="error-404-007"] [data-toy="ball"]{border-radius:50%;background:radial-gradient(circle at 32% 28%,oklch(0.97 0.03 350),oklch(0.72 0.22 350) 45%,oklch(0.45 0.18 350))}
[data-vibeui-block="error-404-007"] [data-toy="star"]{
background:radial-gradient(circle at 35% 30%,oklch(0.85 0.17 50),oklch(0.62 0.21 35));
clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
}
[data-vibeui-block="error-404-007"] [data-toy="pill"]{
aspect-ratio:2.4;border-radius:999px;background:linear-gradient(90deg,oklch(0.96 0 0) 50%,oklch(0.6 0.2 260) 50%);
box-shadow:inset 0 -0.4rem 0.6rem oklch(0 0 0 / 18%),inset 0 0.3rem 0.4rem oklch(1 0 0 / 70%);
}
[data-vibeui-block="error-404-007"] [data-toy="cube"]{border-radius:22%;background:linear-gradient(135deg,oklch(0.85 0.14 150),oklch(0.55 0.16 160))}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-007"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-007"]{width:100%}
`

const TOYS = [
  { toy: "donut", x: "4%", y: "62%", s: "22%", d: "5.5s" },
  { toy: "ball", x: "78%", y: "6%", s: "13%", d: "4.2s" },
  { toy: "star", x: "70%", y: "64%", s: "16%", d: "6.4s" },
  { toy: "pill", x: "8%", y: "8%", s: "18%", d: "5s" },
  { toy: "cube", x: "46%", y: "78%", s: "9%", d: "3.6s" },
]

export function Error404007({
  title = "Страница не найдена",
  code = "Ошибка 404",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  className,
  style,
  ...props
}: Error404007Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-007"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        {TOYS.map((toy) => (
          <span
            key={toy.toy}
            data-part="toy"
            data-toy={toy.toy}
            aria-hidden="true"
            style={
              {
                "--vibeui-error-404-007-x": toy.x,
                "--vibeui-error-404-007-y": toy.y,
                "--vibeui-error-404-007-s": toy.s,
                "--vibeui-error-404-007-d": toy.d,
              } as CSSProperties
            }
          />
        ))}
        <div>
          <h1 data-part="title">{title}</h1>
          <p data-part="code">{code}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
