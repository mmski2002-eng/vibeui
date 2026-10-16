import type { ComponentProps, CSSProperties } from "react"

export type Error404017Props = Omit<ComponentProps<"section">, "children"> & {
  label?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Цвета шаров слева направо; крайние раскачиваются. */
  colors?: string[]
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Колыбель Ньютона «потеряла импульс»: крайние шары по очереди отлетают и
// бьют в ряд. Каждый маятник — нить с шаром, повёрнутая вокруг точки
// подвеса; два ключевых кадра с паузой дают удар без JS и физики.
const STYLES = `
:where([data-vibeui-block="error-404-017"]){
--vibeui-error-404-017-bg:transparent;
--vibeui-error-404-017-fg:light-dark(oklch(0.2 0.02 250),oklch(0.95 0.01 250));
--vibeui-error-404-017-muted:light-dark(oklch(0.55 0.02 250),oklch(0.7 0.02 250));
--vibeui-error-404-017-accent:light-dark(oklch(0.72 0.12 220),oklch(0.78 0.12 220));
--vibeui-error-404-017-string:light-dark(oklch(0.75 0 0),oklch(0.45 0 0));
--vibeui-error-404-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-error-404-017-ball:2.75rem;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-017"]{color-scheme:dark}
[data-vibeui-block="error-404-017"] [data-part="layout"]{
display:grid;gap:2.5rem;align-items:center;box-sizing:border-box;padding:2.5rem 1.25rem;
background:var(--vibeui-error-404-017-bg);color:var(--vibeui-error-404-017-fg);font-family:var(--vibeui-error-404-017-font);
}
[data-vibeui-block="error-404-017"] [data-part="label"]{margin:0;color:var(--vibeui-error-404-017-accent);font-size:0.6875rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase}
[data-vibeui-block="error-404-017"] [data-part="title"]{margin:0.5rem 0 0;font-size:clamp(2rem,6cqi,3.25rem);font-weight:500;line-height:1.05;letter-spacing:-0.02em}
[data-vibeui-block="error-404-017"] [data-part="text"]{margin:0.75rem 0 0;color:var(--vibeui-error-404-017-muted);font-size:0.9375rem}
[data-vibeui-block="error-404-017"] [data-part="action"]{
display:inline-block;margin-top:1.5rem;padding:0.625rem 1rem;background:var(--vibeui-error-404-017-fg);color:light-dark(oklch(1 0 0),oklch(0.15 0 0));
font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;
}
[data-vibeui-block="error-404-017"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-017-accent);outline-offset:3px}
[data-vibeui-block="error-404-017"] [data-part="cradle"]{display:flex;justify-content:center;height:14rem;padding-top:0.5rem;border-top:2px solid var(--vibeui-error-404-017-string)}
[data-vibeui-block="error-404-017"] [data-part="pendulum"]{
position:relative;width:var(--vibeui-error-404-017-ball);height:100%;transform-origin:50% 0;
}
[data-vibeui-block="error-404-017"] [data-part="pendulum"]::before{content:"";position:absolute;left:50%;top:-0.5rem;bottom:var(--vibeui-error-404-017-ball);width:1px;background:var(--vibeui-error-404-017-string)}
[data-vibeui-block="error-404-017"] [data-part="pendulum"]::after{
content:"";position:absolute;left:0;bottom:0;width:100%;aspect-ratio:1;border-radius:50%;
background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-error-404-017-tone) 50%,white),var(--vibeui-error-404-017-tone) 60%);
}
[data-vibeui-block="error-404-017"] [data-part="pendulum"]:first-child{animation:vibeui-error-404-017-left 1.6s ease-in-out infinite}
[data-vibeui-block="error-404-017"] [data-part="pendulum"]:last-child{animation:vibeui-error-404-017-right 1.6s ease-in-out infinite}
@keyframes vibeui-error-404-017-left{0%,50%,100%{rotate:0deg}25%{rotate:32deg}}
@keyframes vibeui-error-404-017-right{0%,50%,100%{rotate:0deg}75%{rotate:-32deg}}
@container (min-width:44rem){
[data-vibeui-block="error-404-017"] [data-part="layout"]{grid-template-columns:1fr 1fr;padding:4rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-017"] *{animation:none!important}}
[data-vibeui-block="error-404-017"]{display:block;background:var(--vibeui-error-404-017-bg)}
[data-vibeui-block="error-404-017"]{width:100%}
`

const COLORS = ["oklch(0.8 0.12 220)", "oklch(0.88 0.15 95)", "oklch(0.72 0.18 50)", "oklch(0.62 0.13 230)", "oklch(0.55 0.12 50)"]

export function Error404017({
  label = "Ошибка 404 — не найдено",
  title = "Эта страница потеряла импульс.",
  description = "Страницы, которую вы ищете, нет или она переехала. Качните колыбель — и возвращайтесь домой.",
  actionLabel = "На главную",
  actionHref = "/",
  colors = COLORS,
  background,
  className,
  style,
  ...props
}: Error404017Props) {
  const palette = {
    ...(background ? { "--vibeui-error-404-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-017" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-017"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <div data-part="layout">
        <div>
          <p data-part="label">{label}</p>
          <h1 data-part="title">{title}</h1>
          <p data-part="text">{description}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        <div data-part="cradle" aria-hidden="true">
          {colors.map((tone, index) => (
            <span
              key={index}
              data-part="pendulum"
              style={{ "--vibeui-error-404-017-tone": tone } as CSSProperties}
            />
          ))}
        </div>
        </div>
      </section>
    </>
  )
}
