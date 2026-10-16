import type { ComponentProps, CSSProperties } from "react"

export type NotFound004Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Основной цвет лепестков; второй цвет выводится из него сдвигом тона. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Матовое стекло поверх цветка: шесть градиентных лепестков медленно
// вращаются под карточкой, а backdrop-filter размывает их в мягкое сияние.
// Карточка — спокойная, с антиквой; цвет и движение живут только за ней.
const STYLES = `
:where([data-vibeui-block="not-found-004"]){
--vibeui-not-found-004-bg:transparent;
--vibeui-not-found-004-fg:light-dark(oklch(0.22 0.05 270),oklch(0.96 0.01 270));
--vibeui-not-found-004-muted:light-dark(oklch(0.48 0.03 270),oklch(0.76 0.02 270));
--vibeui-not-found-004-glass:light-dark(oklch(1 0 0 / 55%),oklch(0.2 0.02 270 / 50%));
--vibeui-not-found-004-edge:light-dark(oklch(1 0 0 / 80%),oklch(1 0 0 / 14%));
--vibeui-not-found-004-accent:light-dark(oklch(0.62 0.2 290),oklch(0.66 0.18 290));
--vibeui-not-found-004-second:oklch(from var(--vibeui-not-found-004-accent) l c calc(h - 70));
--vibeui-not-found-004-serif:ui-serif,Georgia,Cambria,"Times New Roman",serif;
--vibeui-not-found-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-004"]{color-scheme:dark}
[data-vibeui-block="not-found-004"]{display:block;overflow:hidden;background:var(--vibeui-not-found-004-bg);color:var(--vibeui-not-found-004-fg);font-family:var(--vibeui-not-found-004-sans)}
[data-vibeui-block="not-found-004"] [data-part="layout"]{position:relative;display:grid;place-items:center;box-sizing:border-box;min-height:30rem;padding:3rem 1.25rem}
[data-vibeui-block="not-found-004"] [data-part="flower"]{position:absolute;width:min(92cqi,30rem);aspect-ratio:1;animation:vibeui-not-found-004-turn 40s linear infinite}
[data-vibeui-block="not-found-004"] [data-part="petal"]{
position:absolute;left:30%;top:0;width:40%;height:50%;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;transform-origin:50% 100%;
transform:rotate(calc(var(--vibeui-not-found-004-i) * 60deg));
background:linear-gradient(180deg,var(--vibeui-not-found-004-accent),var(--vibeui-not-found-004-second));opacity:.55;
}
@keyframes vibeui-not-found-004-turn{to{rotate:360deg}}
[data-vibeui-block="not-found-004"] [data-part="card"]{
position:relative;box-sizing:border-box;width:min(100%,30rem);padding:2.5rem 2rem;border-radius:1.5rem;text-align:center;
background:var(--vibeui-not-found-004-glass);-webkit-backdrop-filter:blur(2.5rem) saturate(1.4);backdrop-filter:blur(2.5rem) saturate(1.4);
box-shadow:inset 0 1px 0 var(--vibeui-not-found-004-edge),0 0 0 1px color-mix(in oklab,var(--vibeui-not-found-004-fg) 8%,transparent),0 2rem 4rem -2rem oklch(0.2 0.1 280 / 45%);
}
[data-vibeui-block="not-found-004"] [data-part="code"]{
display:inline-block;margin:0;padding:0.25rem 0.75rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-not-found-004-accent) 14%,transparent);
color:var(--vibeui-not-found-004-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;
}
[data-vibeui-block="not-found-004"] [data-part="title"]{margin:1rem 0 0;font-family:var(--vibeui-not-found-004-serif);font-size:clamp(2rem,6cqi,2.75rem);font-weight:400;line-height:1.08;letter-spacing:-0.01em}
[data-vibeui-block="not-found-004"] [data-part="text"]{margin:0.875rem 0 0;color:var(--vibeui-not-found-004-muted);font-size:0.9375rem;line-height:1.6;text-wrap:pretty}
[data-vibeui-block="not-found-004"] [data-part="actions"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.625rem;margin-top:1.75rem}
[data-vibeui-block="not-found-004"] :is([data-part="primary"],[data-part="secondary"]){
display:inline-flex;align-items:center;min-height:2.625rem;padding:0 1.25rem;border-radius:999px;font-size:0.875rem;font-weight:600;text-decoration:none;
transition:transform .2s ease,box-shadow .2s ease;
}
[data-vibeui-block="not-found-004"] [data-part="primary"]{background:var(--vibeui-not-found-004-fg);color:light-dark(oklch(1 0 0),oklch(0.15 0.02 270))}
[data-vibeui-block="not-found-004"] [data-part="primary"]:hover{transform:translateY(-1px);box-shadow:0 0.5rem 1.25rem -0.5rem oklch(0 0 0 / 40%)}
[data-vibeui-block="not-found-004"] [data-part="secondary"]{color:inherit;box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-not-found-004-fg) 20%,transparent)}
[data-vibeui-block="not-found-004"] :is([data-part="primary"],[data-part="secondary"]):focus-visible{outline:2px solid var(--vibeui-not-found-004-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-004"] *{animation:none!important;transition:none!important}}
`

export function NotFound004({
  code = "404",
  title = "Эта страница расцвела где-то в другом месте",
  description = "Мы не нашли то, что вы искали. Возможно, ссылка устарела — вернитесь на главную или напишите нам.",
  actionLabel = "На главную",
  actionHref = "/",
  secondaryLabel = "Написать нам",
  secondaryHref = "/contact",
  accent,
  background,
  className,
  style,
  ...props
}: NotFound004Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-004-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-004" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-004" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="flower" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} data-part="petal" style={{ "--vibeui-not-found-004-i": index } as CSSProperties} />
            ))}
          </div>
          <div data-part="card">
            <p data-part="code">{code}</p>
            <h1 data-part="title">{title}</h1>
            <p data-part="text">{description}</p>
            <div data-part="actions">
              <a data-part="primary" href={actionHref}>
                {actionLabel}
              </a>
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
