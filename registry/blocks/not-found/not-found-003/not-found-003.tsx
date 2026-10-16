import type { ComponentProps, CSSProperties } from "react"

export type NotFound003Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет кольца-нуля. */
  accent?: string
  /** Пусто — тёплая светлая подложка. */
  background?: string
}

// Ноль выпал из кода: между двумя четвёрками — пустое место с пунктирным
// контуром, а сам ноль-кольцо лежит ниже, на «полу», с мягкой тенью и
// слегка покачивается. Наведение на блок возвращает его на место пружиной —
// маленькая награда за любопытство.
const STYLES = `
:where([data-vibeui-block="not-found-003"]){
--vibeui-not-found-003-bg:light-dark(oklch(0.965 0.012 75),oklch(0.17 0.01 75));
--vibeui-not-found-003-fg:light-dark(oklch(0.16 0.01 75),oklch(0.96 0.01 75));
--vibeui-not-found-003-muted:light-dark(oklch(0.48 0.02 75),oklch(0.72 0.02 75));
--vibeui-not-found-003-accent:light-dark(oklch(0.64 0.19 45),oklch(0.74 0.16 50));
--vibeui-not-found-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-not-found-003-size:clamp(5rem,20cqi,10rem);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-003"]{color-scheme:dark}
[data-vibeui-block="not-found-003"]{display:block;background:var(--vibeui-not-found-003-bg);color:var(--vibeui-not-found-003-fg);font-family:var(--vibeui-not-found-003-font)}
[data-vibeui-block="not-found-003"] [data-part="layout"]{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;padding:3.5rem 1.5rem 4rem;text-align:center}
[data-vibeui-block="not-found-003"] [data-part="code"]{
position:relative;display:flex;align-items:center;margin:0;font-size:var(--vibeui-not-found-003-size);font-weight:800;line-height:1;letter-spacing:-0.04em;
}
[data-vibeui-block="not-found-003"] [data-part="gap"]{
width:0.62em;height:0.78em;margin:0 0.06em;border:2px dashed color-mix(in oklab,var(--vibeui-not-found-003-fg) 25%,transparent);border-radius:999px;box-sizing:border-box;
}
[data-vibeui-block="not-found-003"] [data-part="ring"]{
position:absolute;left:50%;top:50%;width:0.62em;height:0.78em;margin:-0.39em 0 0 -0.31em;box-sizing:border-box;border-radius:999px;
border:0.15em solid var(--vibeui-not-found-003-accent);
transform:translate(0.05em,0.9em) rotate(80deg);
transition:transform .7s cubic-bezier(.3,1.5,.5,1);
animation:vibeui-not-found-003-rock 3.5s ease-in-out infinite;
}
[data-vibeui-block="not-found-003"] [data-part="shadow"]{
position:absolute;left:50%;top:50%;width:0.9em;height:0.12em;margin-left:-0.45em;border-radius:50%;
background:radial-gradient(closest-side,oklch(0 0 0 / 28%),transparent);transform:translateY(1.25em);transition:opacity .4s ease;
}
[data-vibeui-block="not-found-003"]:hover [data-part="ring"]{transform:none;animation:none}
[data-vibeui-block="not-found-003"]:hover [data-part="shadow"]{opacity:0}
@keyframes vibeui-not-found-003-rock{50%{rotate:-6deg}}
[data-vibeui-block="not-found-003"] [data-part="title"]{margin:calc(var(--vibeui-not-found-003-size) * 0.85) 0 0;font-size:clamp(1.5rem,4.4cqi,2.25rem);font-weight:750;letter-spacing:-0.025em}
[data-vibeui-block="not-found-003"] [data-part="text"]{margin:0.75rem 0 0;max-width:28rem;color:var(--vibeui-not-found-003-muted);font-size:1rem;line-height:1.55;text-wrap:pretty}
[data-vibeui-block="not-found-003"] [data-part="action"]{
display:inline-flex;align-items:center;gap:0.5rem;margin-top:1.5rem;padding:0.75rem 1.25rem;border-radius:999px;
background:var(--vibeui-not-found-003-fg);color:var(--vibeui-not-found-003-bg);font-size:0.875rem;font-weight:650;text-decoration:none;transition:transform .2s ease;
}
[data-vibeui-block="not-found-003"] [data-part="action"]:hover{transform:translateY(-2px)}
[data-vibeui-block="not-found-003"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-not-found-003-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-003"] *{animation:none!important;transition:none!important}}
`

export function NotFound003({
  title = "Кажется, у нас кое-что выпало",
  description = "Страница, которую вы ищете, потерялась по дороге. Наведите курсор — мы попробуем всё собрать, а пока загляните на главную.",
  actionLabel = "На главную →",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: NotFound003Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-003-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-003" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-003" className={className} style={palette}>
        <div data-part="layout">
          <p data-part="code" aria-label="404">
            <span aria-hidden="true">4</span>
            <span data-part="gap" aria-hidden="true" />
            <span aria-hidden="true">4</span>
            <span data-part="shadow" aria-hidden="true" />
            <span data-part="ring" aria-hidden="true" />
          </p>
          <h1 data-part="title">{title}</h1>
          <p data-part="text">{description}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
