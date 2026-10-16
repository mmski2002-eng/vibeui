import type { ComponentProps, CSSProperties } from "react"

export type Error404019Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  tagline?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет рамки-визира. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Механическое табло: каждая цифра — барабан 0–9, который прокручивается
// несколько оборотов и встаёт на свою цифру кода. Барабаны стартуют с
// задержкой, поэтому код «защёлкивается» слева направо. Потом табло раз в
// несколько секунд перебирает цифры заново.
const STYLES = `
:where([data-vibeui-block="error-404-019"]){
--vibeui-error-404-019-bg:transparent;
--vibeui-error-404-019-fg:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-error-404-019-muted:light-dark(oklch(0.5 0 0),oklch(0.7 0 0));
--vibeui-error-404-019-accent:light-dark(oklch(0.2 0 0 / 30%),oklch(1 0 0 / 30%));
--vibeui-error-404-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-019"]{color-scheme:dark}
[data-vibeui-block="error-404-019"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;box-sizing:border-box;min-height:24rem;padding:3rem 1rem;
background:var(--vibeui-error-404-019-bg);color:var(--vibeui-error-404-019-fg);font-family:var(--vibeui-error-404-019-font);
}
[data-vibeui-block="error-404-019"] [data-part="frame"]{
position:relative;display:flex;gap:0.25rem;padding:1.25rem 1.5rem;
}
[data-vibeui-block="error-404-019"] [data-part="frame"]::before{
content:"";position:absolute;inset:0;border:1px solid var(--vibeui-error-404-019-accent);
mask:linear-gradient(#000 0 0) top left/1rem 1rem no-repeat,linear-gradient(#000 0 0) top right/1rem 1rem no-repeat,linear-gradient(#000 0 0) bottom left/1rem 1rem no-repeat,linear-gradient(#000 0 0) bottom right/1rem 1rem no-repeat;
}
[data-vibeui-block="error-404-019"] [data-part="reel"]{height:1em;overflow:hidden;font-size:clamp(4rem,18cqi,8rem);font-weight:300;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="error-404-019"] [data-part="strip"]{
display:flex;flex-direction:column;
transform:translateY(calc(var(--vibeui-error-404-019-stop) * -1em));
animation:vibeui-error-404-019-spin 6s cubic-bezier(.65,0,.25,1) calc(var(--vibeui-error-404-019-i) * .25s) infinite;
}
@keyframes vibeui-error-404-019-spin{
0%{transform:translateY(calc(var(--vibeui-error-404-019-stop) * -1em))}
40%,100%{transform:translateY(calc((var(--vibeui-error-404-019-stop) + 20) * -1em))}
}
[data-vibeui-block="error-404-019"] [data-part="tagline"]{margin:0;color:var(--vibeui-error-404-019-muted);font-size:0.6875rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase}
[data-vibeui-block="error-404-019"] [data-part="action"]{color:inherit;font-size:0.875rem;text-underline-offset:4px}
[data-vibeui-block="error-404-019"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-019"] [data-part="strip"]{animation:none}}
[data-vibeui-block="error-404-019"]{width:100%}
`

const DIGITS = Array.from({ length: 30 }, (_, index) => index % 10)

export function Error404019({
  code = "404",
  tagline = "Вдохновляй · Создавай · Влияй",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: Error404019Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-019-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-019" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-019"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <h1 data-part="frame" aria-label={code}>
          {code.split("").map((character, index) => {
            const stop = Number.parseInt(character, 10)
            return (
              <span key={index} data-part="reel" aria-hidden="true">
                <span
                  data-part="strip"
                  style={
                    {
                      "--vibeui-error-404-019-stop": Number.isNaN(stop) ? 0 : stop,
                      "--vibeui-error-404-019-i": index,
                    } as CSSProperties
                  }
                >
                  {DIGITS.map((digit, position) => (
                    <span key={position}>{digit}</span>
                  ))}
                </span>
              </span>
            )
          })}
        </h1>
        <p data-part="tagline">{tagline}</p>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
