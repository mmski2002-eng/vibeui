import type { ComponentProps, CSSProperties } from "react"

export type Error404002Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет самолётиков. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
  /** Сколько самолётиков в небе. */
  planes?: number
}

// Небо из бумажных самолётиков: каждый летит своим курсом и со своей
// скоростью, поэтому стая не повторяется глазом. Курс и задержка задаются
// переменными на элементе, движение — один @keyframes на всех. Без JS.
const STYLES = `
:where([data-vibeui-block="error-404-002"]){
--vibeui-error-404-002-bg:light-dark(oklch(0.96 0 0),oklch(0.18 0 0));
--vibeui-error-404-002-fg:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-error-404-002-muted:light-dark(oklch(0.55 0 0),oklch(0.68 0 0));
--vibeui-error-404-002-accent:light-dark(oklch(0.72 0 0),oklch(0.5 0 0));
--vibeui-error-404-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-002"]{color-scheme:dark}
[data-vibeui-block="error-404-002"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1.25rem;
background:var(--vibeui-error-404-002-bg);color:var(--vibeui-error-404-002-fg);font-family:var(--vibeui-error-404-002-font);
}
[data-vibeui-block="error-404-002"] [data-part="sky"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="error-404-002"] [data-part="plane"]{
position:absolute;left:var(--vibeui-error-404-002-x);top:var(--vibeui-error-404-002-y);width:1.5rem;height:1.5rem;
color:var(--vibeui-error-404-002-accent);
animation:vibeui-error-404-002-fly var(--vibeui-error-404-002-d) linear var(--vibeui-error-404-002-delay) infinite;
}
@keyframes vibeui-error-404-002-fly{
0%{transform:translate(-30cqw,12cqh) rotate(var(--vibeui-error-404-002-r));opacity:0}
10%{opacity:1}
90%{opacity:1}
100%{transform:translate(60cqw,-30cqh) rotate(var(--vibeui-error-404-002-r));opacity:0}
}
[data-vibeui-block="error-404-002"]{container-type:size}
[data-vibeui-block="error-404-002"] [data-part="copy"]{position:relative;text-align:left}
[data-vibeui-block="error-404-002"] [data-part="code"]{margin:0;font-size:1.25rem;font-weight:500}
[data-vibeui-block="error-404-002"] [data-part="title"]{margin:0.125rem 0 0;font-size:1.5rem;font-weight:400;color:var(--vibeui-error-404-002-muted)}
[data-vibeui-block="error-404-002"] [data-part="action"]{
display:inline-block;margin-top:1rem;color:inherit;font-size:0.8125rem;text-underline-offset:3px;
}
[data-vibeui-block="error-404-002"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-404-002"] [data-part="plane"]{animation:none;transform:rotate(var(--vibeui-error-404-002-r))}
}
[data-vibeui-block="error-404-002"]{width:100%}
`

function Plane() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 3 3 10.5l6.5 2.5L12 20l2.6-5.6L21 3Zm-11 9.6 8.4-7.3-6.1 9-1-.3-1.3-1.4Z" />
    </svg>
  )
}

// Детерминированный разброс: один и тот же кадр на сервере и в браузере.
function course(index: number) {
  const seed = Math.sin(index * 12.9898) * 43758.5453
  const random = seed - Math.floor(seed)
  return {
    x: `${(index * 37) % 100}%`,
    y: `${(index * 53 + 20) % 100}%`,
    duration: `${9 + random * 9}s`,
    delay: `${-random * 18}s`,
    rotate: `${-25 + random * 20}deg`,
  }
}

export function Error404002({
  code = "404",
  title = "Потерялись в полёте?",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  background,
  planes = 14,
  className,
  style,
  ...props
}: Error404002Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-002-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-002"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <div data-part="sky" aria-hidden="true">
          {Array.from({ length: planes }, (_, index) => {
            const flight = course(index)
            return (
              <span
                key={index}
                data-part="plane"
                style={
                  {
                    "--vibeui-error-404-002-x": flight.x,
                    "--vibeui-error-404-002-y": flight.y,
                    "--vibeui-error-404-002-d": flight.duration,
                    "--vibeui-error-404-002-delay": flight.delay,
                    "--vibeui-error-404-002-r": flight.rotate,
                  } as CSSProperties
                }
              >
                <Plane />
              </span>
            )
          })}
        </div>
        <div data-part="copy">
          <p data-part="code">{code}</p>
          <h1 data-part="title">{title}</h1>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
