import type { ComponentProps, CSSProperties } from "react"

export type Error404010Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет цифр. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
  /** Секунды на полный оборот каждой цифры. */
  speed?: number
}

// Цифры-перевёртыши: у каждой две стороны — гротеск и каллиграфия, — и они
// по очереди переворачиваются вокруг вертикальной оси, как таблички на
// вокзальном табло. Задержка по индексу пускает волну слева направо.
const STYLES = `
:where([data-vibeui-block="error-404-010"]){
--vibeui-error-404-010-bg:transparent;
--vibeui-error-404-010-fg:light-dark(oklch(0.3 0 0),oklch(0.92 0 0));
--vibeui-error-404-010-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-error-404-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-error-404-010-script:"Old English Text MT","Goudy Text MT","Palatino Linotype",Palatino,ui-serif,Georgia,serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-010"]{color-scheme:dark}
[data-vibeui-block="error-404-010"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3rem;box-sizing:border-box;min-height:26rem;padding:3rem 1rem;
background:var(--vibeui-error-404-010-bg);color:var(--vibeui-error-404-010-fg);font-family:var(--vibeui-error-404-010-sans);
}
[data-vibeui-block="error-404-010"] [data-part="code"]{display:flex;margin:0;perspective:60rem;font-size:clamp(5rem,26cqi,12rem);line-height:1}
[data-vibeui-block="error-404-010"] [data-part="digit"]{
position:relative;display:inline-grid;transform-style:preserve-3d;
animation:vibeui-error-404-010-flip var(--vibeui-error-404-010-speed,6s) cubic-bezier(.7,0,.3,1) var(--vibeui-error-404-010-delay) infinite;
}
[data-vibeui-block="error-404-010"] [data-part="face"]{grid-area:1/1;backface-visibility:hidden;text-align:center}
[data-vibeui-block="error-404-010"] [data-face="sans"]{font-weight:600;letter-spacing:-0.04em}
[data-vibeui-block="error-404-010"] [data-face="script"]{font-family:var(--vibeui-error-404-010-script);font-style:italic;font-weight:400;transform:rotateY(180deg)}
@keyframes vibeui-error-404-010-flip{0%,35%{transform:rotateY(0)}50%,85%{transform:rotateY(180deg)}100%{transform:rotateY(360deg)}}
[data-vibeui-block="error-404-010"] [data-part="action"]{
display:inline-flex;align-items:center;gap:0.5rem;color:var(--vibeui-error-404-010-muted);font-size:0.6875rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;
}
[data-vibeui-block="error-404-010"] [data-part="action"]::before{content:"";width:0.5rem;height:0.5rem;background:currentColor;transition:transform .3s ease}
[data-vibeui-block="error-404-010"] [data-part="action"]:hover::before{transform:rotate(45deg)}
[data-vibeui-block="error-404-010"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:4px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-010"] *,[data-vibeui-block="error-404-010"] *::before{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-010"]{width:100%}
`

export function Error404010({
  code = "404",
  actionLabel = "Смотреть избранные работы",
  actionHref = "/",
  accent,
  background,
  speed = 6,
  className,
  style,
  ...props
}: Error404010Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-010-fg": accent } : null),
    ...(background ? { "--vibeui-error-404-010-bg": background } : null),
    "--vibeui-error-404-010-speed": `${speed}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-010"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <h1 data-part="code" aria-label={code}>
          {code.split("").map((digit, index) => (
            <span
              key={index}
              data-part="digit"
              aria-hidden="true"
              style={{ "--vibeui-error-404-010-delay": `${index * 0.35}s` } as CSSProperties}
            >
              <span data-part="face" data-face="sans">
                {digit}
              </span>
              <span data-part="face" data-face="script">
                {digit}
              </span>
            </span>
          ))}
        </h1>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
