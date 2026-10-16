import type { ComponentProps, CSSProperties } from "react"

export type NotFound006Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  signal?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет кнопки и индикатора связи. */
  accent?: string
  /** Пусто — песочная подложка. */
  background?: string
}

// Телефон, который потерял связь: в корпусе с «островком» вместо экрана —
// телевизионный шум и надпись «Нет сигнала», в статус-баре пустые палочки
// связи. Рядом крупный заголовок и кнопка. Шум — два повторяющихся
// градиента, сдвигаемых ступенькой; картинок нет.
const STYLES = `
:where([data-vibeui-block="not-found-006"]){
--vibeui-not-found-006-bg:light-dark(oklch(0.9 0.025 85),oklch(0.2 0.015 85));
--vibeui-not-found-006-fg:light-dark(oklch(0.18 0.02 85),oklch(0.96 0.01 85));
--vibeui-not-found-006-muted:light-dark(oklch(0.42 0.03 85),oklch(0.74 0.02 85));
--vibeui-not-found-006-body:oklch(0.16 0 0);
--vibeui-not-found-006-accent:light-dark(oklch(0.2 0.02 85),oklch(0.92 0.06 95));
--vibeui-not-found-006-on-accent:oklch(from var(--vibeui-not-found-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-006"]{color-scheme:dark}
[data-vibeui-block="not-found-006"]{display:block;overflow:hidden;background:var(--vibeui-not-found-006-bg);color:var(--vibeui-not-found-006-fg);font-family:var(--vibeui-not-found-006-font)}
[data-vibeui-block="not-found-006"] [data-part="layout"]{display:grid;gap:2.5rem;align-items:center;justify-items:center;box-sizing:border-box;max-width:60rem;margin:0 auto;padding:3rem 1.5rem;text-align:center}
[data-vibeui-block="not-found-006"] [data-part="phone"]{
position:relative;box-sizing:border-box;width:13rem;aspect-ratio:9/19;padding:0.5rem;border-radius:2.25rem;background:var(--vibeui-not-found-006-body);
box-shadow:inset 0 0 0 2px oklch(1 0 0 / 12%),0 2.5rem 4rem -2rem oklch(0 0 0 / 55%),0 0 0 1px oklch(0 0 0 / 30%);rotate:-6deg;
transition:rotate .5s cubic-bezier(.3,1.4,.5,1);
}
[data-vibeui-block="not-found-006"]:hover [data-part="phone"]{rotate:0deg}
[data-vibeui-block="not-found-006"] [data-part="screen"]{position:relative;display:grid;place-items:center;height:100%;overflow:hidden;border-radius:1.75rem;background:oklch(0.3 0 0)}
[data-vibeui-block="not-found-006"] [data-part="screen"]::before{
content:"";position:absolute;inset:-50%;opacity:.55;
background:repeating-radial-gradient(circle at 31% 47%,oklch(1 0 0) 0 0.5px,transparent 0.5px 2px),repeating-radial-gradient(circle at 73% 21%,oklch(0 0 0) 0 0.5px,transparent 0.5px 1.5px);
animation:vibeui-not-found-006-static .25s steps(3) infinite;
}
[data-vibeui-block="not-found-006"] [data-part="screen"]::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 2px,oklch(0 0 0 / 25%) 2px 3px)}
@keyframes vibeui-not-found-006-static{33%{transform:translate(-4%,3%)}66%{transform:translate(3%,-5%)}}
[data-vibeui-block="not-found-006"] [data-part="island"]{position:absolute;z-index:2;top:0.875rem;left:50%;width:4.5rem;height:1.25rem;translate:-50% 0;border-radius:999px;background:var(--vibeui-not-found-006-body)}
[data-vibeui-block="not-found-006"] [data-part="bars"]{position:absolute;z-index:2;top:1.125rem;right:1.25rem;display:flex;align-items:flex-end;gap:2px}
[data-vibeui-block="not-found-006"] [data-part="bar"]{width:3px;border-radius:1px;background:oklch(1 0 0 / 30%)}
[data-vibeui-block="not-found-006"] [data-part="badge"]{
position:relative;z-index:1;padding:0.5rem 0.875rem;border-radius:0.5rem;background:oklch(0 0 0 / 70%);color:oklch(0.97 0 0);
font-family:ui-monospace,monospace;font-size:0.6875rem;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="not-found-006"] [data-part="code"]{margin:0;color:var(--vibeui-not-found-006-muted);font-size:0.8125rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase}
[data-vibeui-block="not-found-006"] [data-part="title"]{margin:0.75rem 0 0;font-size:clamp(2rem,6cqi,3.25rem);font-weight:800;line-height:1;letter-spacing:-0.04em;text-wrap:balance}
[data-vibeui-block="not-found-006"] [data-part="text"]{margin:1rem 0 0;max-width:26rem;color:var(--vibeui-not-found-006-muted);font-size:1rem;line-height:1.55}
[data-vibeui-block="not-found-006"] [data-part="action"]{
display:inline-flex;margin-top:1.75rem;padding:0.875rem 1.5rem;border-radius:999px;background:var(--vibeui-not-found-006-accent);color:var(--vibeui-not-found-006-on-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:transform .2s ease;
}
[data-vibeui-block="not-found-006"] [data-part="action"]:hover{transform:translateY(-2px)}
[data-vibeui-block="not-found-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-not-found-006-fg);outline-offset:3px}
@container (min-width:44rem){
[data-vibeui-block="not-found-006"] [data-part="layout"]{grid-template-columns:auto 1fr;gap:4.5rem;padding:4rem 3rem;text-align:left;justify-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-006"] *,[data-vibeui-block="not-found-006"] *::before{animation:none!important;transition:none!important}}
`

export function NotFound006({
  code = "Ошибка 404",
  title = "Связь с этой страницей потеряна",
  description = "Мы искали её на всех частотах, но она не отвечает. Вернитесь на главную — там приём отличный.",
  signal = "Нет сигнала",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: NotFound006Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-006-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-006-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-006" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-006" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="phone" aria-hidden="true">
            <span data-part="island" />
            <span data-part="bars">
              {[4, 6, 8, 10].map((height) => (
                <span key={height} data-part="bar" style={{ height }} />
              ))}
            </span>
            <div data-part="screen">
              <span data-part="badge">{signal}</span>
            </div>
          </div>
          <div>
            <p data-part="code">{code}</p>
            <h1 data-part="title">{title}</h1>
            <p data-part="text">{description}</p>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
