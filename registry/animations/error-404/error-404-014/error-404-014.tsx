import type { ComponentProps, CSSProperties } from "react"

export type Error404014Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет цифр. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
  /** Сколько вертикальных срезов; больше — тоньше рябь. */
  slices?: number
}

// Цифры, нарезанные на вертикальные полосы: каждая полоса — тот же текст,
// обрезанный clip-path, и каждая едет вверх-вниз со своей фазой. Вместе это
// бегущая волна, как помеха на развёртке. Под полосами — штриховка-растр.
const STYLES = `
:where([data-vibeui-block="error-404-014"]){
--vibeui-error-404-014-bg:transparent;
--vibeui-error-404-014-fg:light-dark(oklch(0.12 0 0),oklch(0.96 0 0));
--vibeui-error-404-014-line:light-dark(oklch(0.12 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-error-404-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-014"]{color-scheme:dark}
[data-vibeui-block="error-404-014"]{
position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;
background:var(--vibeui-error-404-014-bg);color:var(--vibeui-error-404-014-fg);font-family:var(--vibeui-error-404-014-font);
background-image:repeating-linear-gradient(90deg,var(--vibeui-error-404-014-line) 0 1px,transparent 1px calc(100% / var(--vibeui-error-404-014-n)));
}
[data-vibeui-block="error-404-014"] [data-part="code"]{position:relative;display:grid;margin:0;font-size:min(42cqi,22rem);font-weight:900;line-height:0.9;letter-spacing:-0.06em}
[data-vibeui-block="error-404-014"] [data-part="ghost"]{visibility:hidden}
[data-vibeui-block="error-404-014"] [data-part="slice"]{
position:absolute;inset:0;
clip-path:inset(0 calc(100% - (var(--vibeui-error-404-014-i) + 1) * 100% / var(--vibeui-error-404-014-n)) 0 calc(var(--vibeui-error-404-014-i) * 100% / var(--vibeui-error-404-014-n)));
animation:vibeui-error-404-014-wave 2.4s ease-in-out calc(var(--vibeui-error-404-014-i) * -0.09s) infinite;
}
@keyframes vibeui-error-404-014-wave{0%,100%{transform:translateY(-4%) scaleY(1.04)}50%{transform:translateY(4%) scaleY(.96)}}
[data-vibeui-block="error-404-014"] [data-part="action"]{
position:relative;padding:0.5rem 1rem;border:1px solid currentColor;color:inherit;text-decoration:none;font-size:0.8125rem;letter-spacing:0.08em;text-transform:uppercase;
background:var(--vibeui-error-404-014-bg);transition:background .2s ease,color .2s ease;
}
[data-vibeui-block="error-404-014"] [data-part="action"]:hover{background:var(--vibeui-error-404-014-fg);color:light-dark(oklch(1 0 0),oklch(0.12 0 0))}
[data-vibeui-block="error-404-014"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-014"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-014"]{width:100%}
`

export function Error404014({
  code = "404",
  actionLabel = "На главную",
  actionHref = "/",
  accent,
  background,
  slices = 36,
  className,
  style,
  ...props
}: Error404014Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-014-fg": accent } : null),
    ...(background ? { "--vibeui-error-404-014-bg": background } : null),
    "--vibeui-error-404-014-n": slices,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-014" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-014"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <h1 data-part="code" aria-label={code}>
          <span data-part="ghost" aria-hidden="true">
            {code}
          </span>
          {Array.from({ length: slices }, (_, index) => (
            <span
              key={index}
              data-part="slice"
              aria-hidden="true"
              style={{ "--vibeui-error-404-014-i": index } as CSSProperties}
            >
              {code}
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
