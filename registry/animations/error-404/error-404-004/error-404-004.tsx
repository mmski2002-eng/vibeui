import type { ComponentProps, CSSProperties } from "react"

export type Error404004Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет полотна; цифры берут его же, только темнее. */
  accent?: string
  /** Секунды на один проход бегущей строки. */
  speed?: number
}

// Плакат во весь кадр: гигантские цифры тоном темнее фона, поверх — бегущая
// строка с сообщением и ссылкой домой. Строка продублирована, чтобы шов
// цикла не был виден; при наведении она замирает, и по ссылке легко попасть.
const STYLES = `
:where([data-vibeui-block="error-404-004"]){
--vibeui-error-404-004-accent:oklch(0.66 0.22 35);
--vibeui-error-404-004-digits:oklch(from var(--vibeui-error-404-004-accent) calc(l - 0.1) c h);
--vibeui-error-404-004-fg:oklch(from var(--vibeui-error-404-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-error-404-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="error-404-004"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;
background:var(--vibeui-error-404-004-accent);color:var(--vibeui-error-404-004-fg);font-family:var(--vibeui-error-404-004-font);
}
[data-vibeui-block="error-404-004"] [data-part="digits"]{
position:absolute;inset:0;display:grid;place-items:center;margin:0;
font-size:min(50cqi,23rem);font-weight:700;line-height:1;letter-spacing:-0.06em;color:var(--vibeui-error-404-004-digits);
user-select:none;
}
[data-vibeui-block="error-404-004"] [data-part="rail"]{position:relative;width:100%;overflow:hidden}
[data-vibeui-block="error-404-004"] [data-part="track"]{
display:flex;width:max-content;
animation:vibeui-error-404-004-run var(--vibeui-error-404-004-speed,22s) linear infinite;
}
[data-vibeui-block="error-404-004"] [data-part="rail"]:is(:hover,:focus-within) [data-part="track"]{animation-play-state:paused}
[data-vibeui-block="error-404-004"] [data-part="item"]{
display:flex;align-items:center;gap:1rem;padding-right:2.5rem;white-space:nowrap;
font-size:clamp(1.25rem,3.4cqi,2.25rem);letter-spacing:-0.02em;
}
[data-vibeui-block="error-404-004"] [data-part="action"]{
display:inline-flex;align-items:center;gap:0.5rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="error-404-004"] [data-part="action"]:hover{text-decoration:underline;text-underline-offset:0.2em}
[data-vibeui-block="error-404-004"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:4px}
[data-vibeui-block="error-404-004"] [data-part="arrow"]{
display:inline-grid;place-items:center;width:1.1em;height:1.1em;border:2px solid currentColor;border-radius:50%;font-size:0.7em;
}
@keyframes vibeui-error-404-004-run{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-404-004"] [data-part="track"]{animation:none;justify-content:center;width:auto}
[data-vibeui-block="error-404-004"] [data-part="item"]:not(:first-child){display:none}
}
[data-vibeui-block="error-404-004"]{width:100%}
`

export function Error404004({
  code = "404",
  message = "Исследовать — тоже часть процесса, но вы заблудились.",
  actionLabel = "Вернуться домой",
  actionHref = "/",
  accent,
  speed = 22,
  className,
  style,
  ...props
}: Error404004Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-004-accent": accent } : null),
    "--vibeui-error-404-004-speed": `${speed}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-004"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <h1 data-part="digits">{code}</h1>
        <div data-part="rail">
          <div data-part="track">
            {Array.from({ length: 4 }, (_, index) => (
              <p key={index} data-part="item" aria-hidden={index > 0 || undefined}>
                <span>{message}</span>
                <a data-part="action" href={actionHref} tabIndex={index > 0 ? -1 : undefined}>
                  <span data-part="arrow" aria-hidden="true">
                    ←
                  </span>
                  {actionLabel}
                </a>
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
