import type { ComponentProps, CSSProperties } from "react"

export type NotFound008Props = Omit<ComponentProps<"section">, "children"> & {
  url?: string
  code?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет полосы загрузки и кнопки. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Окно браузера, которое так и не загрузилось: в адресной строке битый URL,
// полоса загрузки застряла и подрагивает, контент — серые заглушки с
// бегущим бликом. Под окном объяснение и выход. Узнаваемо с первого взгляда.
const STYLES = `
:where([data-vibeui-block="not-found-008"]){
--vibeui-not-found-008-bg:transparent;
--vibeui-not-found-008-fg:light-dark(oklch(0.2 0.01 260),oklch(0.95 0.005 260));
--vibeui-not-found-008-muted:light-dark(oklch(0.52 0.01 260),oklch(0.72 0.01 260));
--vibeui-not-found-008-line:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 12%));
--vibeui-not-found-008-window:light-dark(oklch(1 0 0),oklch(0.2 0.01 260));
--vibeui-not-found-008-chrome:light-dark(oklch(0.96 0.005 260),oklch(0.25 0.01 260));
--vibeui-not-found-008-skeleton:light-dark(oklch(0.93 0.005 260),oklch(0.3 0.01 260));
--vibeui-not-found-008-accent:light-dark(oklch(0.55 0.2 260),oklch(0.7 0.16 260));
--vibeui-not-found-008-on-accent:oklch(from var(--vibeui-not-found-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-008"]{color-scheme:dark}
[data-vibeui-block="not-found-008"]{display:block;background:var(--vibeui-not-found-008-bg);color:var(--vibeui-not-found-008-fg);font-family:var(--vibeui-not-found-008-font)}
[data-vibeui-block="not-found-008"] [data-part="layout"]{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;max-width:52rem;margin:0 auto;padding:3rem 1.25rem;text-align:center}
[data-vibeui-block="not-found-008"] [data-part="window"]{
width:100%;overflow:hidden;border-radius:0.875rem;background:var(--vibeui-not-found-008-window);text-align:left;
box-shadow:0 0 0 1px var(--vibeui-not-found-008-line),0 2rem 3rem -2rem oklch(0 0 0 / 35%);
}
[data-vibeui-block="not-found-008"] [data-part="chrome"]{display:flex;align-items:center;gap:0.75rem;padding:0.625rem 0.875rem;background:var(--vibeui-not-found-008-chrome);border-bottom:1px solid var(--vibeui-not-found-008-line)}
[data-vibeui-block="not-found-008"] [data-part="dots"]{display:flex;gap:0.375rem}
[data-vibeui-block="not-found-008"] [data-part="dots"] span{width:0.625rem;height:0.625rem;border-radius:50%;background:var(--vibeui-not-found-008-line)}
[data-vibeui-block="not-found-008"] [data-part="address"]{
flex:1;min-width:0;overflow:hidden;padding:0.375rem 0.75rem;border-radius:0.5rem;background:var(--vibeui-not-found-008-window);
font-family:ui-monospace,monospace;font-size:0.75rem;white-space:nowrap;text-overflow:ellipsis;color:var(--vibeui-not-found-008-muted);
}
[data-vibeui-block="not-found-008"] [data-part="address"] mark{background:none;color:oklch(0.6 0.2 25);text-decoration:line-through wavy}
[data-vibeui-block="not-found-008"] [data-part="progress"]{position:relative;height:2px;background:var(--vibeui-not-found-008-line)}
[data-vibeui-block="not-found-008"] [data-part="progress"]::after{
content:"";position:absolute;left:0;top:0;bottom:0;width:4%;background:var(--vibeui-not-found-008-accent);box-shadow:0 0 0.5rem var(--vibeui-not-found-008-accent);
animation:vibeui-not-found-008-stuck 2.2s ease-in-out infinite;
}
@keyframes vibeui-not-found-008-stuck{0%,100%{width:4%}55%{width:9%}70%{width:4%}}
[data-vibeui-block="not-found-008"] [data-part="page"]{display:grid;gap:0.75rem;padding:1.5rem}
[data-vibeui-block="not-found-008"] [data-part="skeleton"]{
height:var(--vibeui-not-found-008-h,0.75rem);width:var(--vibeui-not-found-008-w,100%);border-radius:0.375rem;
background:linear-gradient(90deg,var(--vibeui-not-found-008-skeleton) 0 40%,color-mix(in oklab,var(--vibeui-not-found-008-skeleton) 40%,var(--vibeui-not-found-008-window)) 50%,var(--vibeui-not-found-008-skeleton) 60%) 0 0/300% 100%;
animation:vibeui-not-found-008-shine 1.8s linear infinite;
}
@keyframes vibeui-not-found-008-shine{from{background-position:100% 0}to{background-position:0 0}}
[data-vibeui-block="not-found-008"] [data-part="row"]{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem}
[data-vibeui-block="not-found-008"] [data-part="code"]{margin:2.25rem 0 0;color:var(--vibeui-not-found-008-accent);font-family:ui-monospace,monospace;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="not-found-008"] [data-part="title"]{margin:0.625rem 0 0;font-size:clamp(1.75rem,5cqi,2.5rem);font-weight:750;letter-spacing:-0.03em;text-wrap:balance}
[data-vibeui-block="not-found-008"] [data-part="text"]{margin:0.75rem 0 0;max-width:30rem;color:var(--vibeui-not-found-008-muted);font-size:1rem;line-height:1.55}
[data-vibeui-block="not-found-008"] [data-part="action"]{
display:inline-flex;margin-top:1.5rem;padding:0.75rem 1.25rem;border-radius:0.625rem;background:var(--vibeui-not-found-008-accent);color:var(--vibeui-not-found-008-on-accent);
font-size:0.875rem;font-weight:650;text-decoration:none;transition:transform .2s ease;
}
[data-vibeui-block="not-found-008"] [data-part="action"]:hover{transform:translateY(-1px)}
[data-vibeui-block="not-found-008"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-not-found-008-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-008"] *,[data-vibeui-block="not-found-008"] *::after{animation:none!important;transition:none!important}}
`

const LINES = [
  { h: "1.5rem", w: "55%" },
  { h: "0.75rem", w: "90%" },
  { h: "0.75rem", w: "75%" },
]

export function NotFound008({
  url = "example.com/blog/old-article",
  code = "HTTP 404 · Not Found",
  title = "Страница так и не загрузилась",
  description = "По этому адресу ничего нет: ссылка устарела или в ней опечатка. Попробуйте начать с главной.",
  actionLabel = "Открыть главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: NotFound008Props) {
  const slash = url.lastIndexOf("/")
  const palette = {
    ...(accent ? { "--vibeui-not-found-008-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-008" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-008" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="window" aria-hidden="true">
            <div data-part="chrome">
              <span data-part="dots">
                <span />
                <span />
                <span />
              </span>
              <span data-part="address">
                {slash > 0 ? url.slice(0, slash + 1) : ""}
                <mark>{slash > 0 ? url.slice(slash + 1) : url}</mark>
              </span>
            </div>
            <div data-part="progress" />
            <div data-part="page">
              {LINES.map((line, index) => (
                <span
                  key={index}
                  data-part="skeleton"
                  style={{ "--vibeui-not-found-008-h": line.h, "--vibeui-not-found-008-w": line.w } as CSSProperties}
                />
              ))}
              <div data-part="row">
                {[0, 1, 2].map((index) => (
                  <span key={index} data-part="skeleton" style={{ "--vibeui-not-found-008-h": "4rem" } as CSSProperties} />
                ))}
              </div>
            </div>
          </div>
          <p data-part="code">{code}</p>
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
