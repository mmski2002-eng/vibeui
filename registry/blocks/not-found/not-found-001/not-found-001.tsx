import type { ComponentProps, CSSProperties } from "react"

type NotFound001Link = { label: string; hint: string; href: string }

export type NotFound001Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  badge?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  links?: NotFound001Link[]
  /** Цвет кнопки, бейджа и свечения за кодом. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Аккуратная 404 для продукта: слева огромный код с градиентной заливкой
// на мягком пятне акцента, справа — бейдж, объяснение, две кнопки и короткий
// список разделов. Страница не извиняется, а сразу ведёт дальше.
const STYLES = `
:where([data-vibeui-block="not-found-001"]){
--vibeui-not-found-001-bg:transparent;
--vibeui-not-found-001-fg:light-dark(oklch(0.2 0.01 265),oklch(0.96 0.005 265));
--vibeui-not-found-001-muted:light-dark(oklch(0.5 0.01 265),oklch(0.72 0.01 265));
--vibeui-not-found-001-line:light-dark(oklch(0 0 0 / 9%),oklch(1 0 0 / 11%));
--vibeui-not-found-001-card:light-dark(oklch(1 0 0 / 70%),oklch(1 0 0 / 4%));
--vibeui-not-found-001-accent:light-dark(oklch(0.58 0.2 35),oklch(0.72 0.17 40));
--vibeui-not-found-001-on-accent:oklch(from var(--vibeui-not-found-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-001"]{color-scheme:dark}
[data-vibeui-block="not-found-001"]{
display:block;position:relative;overflow:hidden;
background:var(--vibeui-not-found-001-bg);color:var(--vibeui-not-found-001-fg);font-family:var(--vibeui-not-found-001-font);
background-image:radial-gradient(var(--vibeui-not-found-001-line) 1px,transparent 1px);background-size:1.25rem 1.25rem;
}
[data-vibeui-block="not-found-001"] [data-part="layout"]{
position:relative;display:grid;gap:2.5rem;align-items:center;box-sizing:border-box;max-width:64rem;margin:0 auto;padding:3.5rem 1.5rem;
}
[data-vibeui-block="not-found-001"] [data-part="visual"]{position:relative;display:grid;place-items:center}
[data-vibeui-block="not-found-001"] [data-part="glow"]{
position:absolute;width:70%;aspect-ratio:1;border-radius:50%;filter:blur(3rem);opacity:.35;
background:radial-gradient(circle,var(--vibeui-not-found-001-accent),transparent 70%);
}
[data-vibeui-block="not-found-001"] [data-part="code"]{
position:relative;margin:0;font-size:clamp(6rem,24cqi,12rem);font-weight:800;line-height:0.9;letter-spacing:-0.06em;
background:linear-gradient(180deg,var(--vibeui-not-found-001-fg) 30%,color-mix(in oklab,var(--vibeui-not-found-001-fg) 15%,transparent));
-webkit-background-clip:text;background-clip:text;color:transparent;
}
[data-vibeui-block="not-found-001"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0;padding:0.3125rem 0.75rem;border:1px solid var(--vibeui-not-found-001-line);border-radius:999px;
background:var(--vibeui-not-found-001-card);font-size:0.75rem;font-weight:600;color:var(--vibeui-not-found-001-muted);
}
[data-vibeui-block="not-found-001"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:50%;background:var(--vibeui-not-found-001-accent);
box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-not-found-001-accent) 50%,transparent);
animation:vibeui-not-found-001-pulse 2s ease-out infinite;
}
@keyframes vibeui-not-found-001-pulse{to{box-shadow:0 0 0 0.5rem transparent}}
[data-vibeui-block="not-found-001"] [data-part="title"]{margin:1rem 0 0;font-size:clamp(1.75rem,5cqi,2.5rem);font-weight:700;line-height:1.1;letter-spacing:-0.025em}
[data-vibeui-block="not-found-001"] [data-part="text"]{margin:0.75rem 0 0;max-width:30rem;color:var(--vibeui-not-found-001-muted);font-size:1rem;line-height:1.55}
[data-vibeui-block="not-found-001"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.625rem;margin-top:1.5rem}
[data-vibeui-block="not-found-001"] :is([data-part="primary"],[data-part="secondary"]){
display:inline-flex;align-items:center;min-height:2.5rem;padding:0 1.125rem;border-radius:0.625rem;
font-size:0.875rem;font-weight:600;text-decoration:none;transition:transform .2s ease,border-color .2s ease;
}
[data-vibeui-block="not-found-001"] [data-part="primary"]{background:var(--vibeui-not-found-001-accent);color:var(--vibeui-not-found-001-on-accent)}
[data-vibeui-block="not-found-001"] [data-part="primary"]:hover{transform:translateY(-1px)}
[data-vibeui-block="not-found-001"] [data-part="secondary"]{border:1px solid var(--vibeui-not-found-001-line);background:var(--vibeui-not-found-001-card);color:inherit}
[data-vibeui-block="not-found-001"] [data-part="secondary"]:hover{border-color:color-mix(in oklab,var(--vibeui-not-found-001-fg) 30%,transparent)}
[data-vibeui-block="not-found-001"] [data-part="links"]{display:grid;gap:0.5rem;margin:2rem 0 0;padding:1.25rem 0 0;list-style:none;border-top:1px solid var(--vibeui-not-found-001-line)}
[data-vibeui-block="not-found-001"] [data-part="link"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0.625rem 0.75rem;border-radius:0.625rem;
color:inherit;text-decoration:none;transition:background .2s ease;
}
[data-vibeui-block="not-found-001"] [data-part="link"]:hover{background:var(--vibeui-not-found-001-card)}
[data-vibeui-block="not-found-001"] [data-part="link-label"]{display:block;font-size:0.9375rem;font-weight:600}
[data-vibeui-block="not-found-001"] [data-part="link-hint"]{display:block;margin-top:0.125rem;color:var(--vibeui-not-found-001-muted);font-size:0.8125rem}
[data-vibeui-block="not-found-001"] [data-part="arrow"]{color:var(--vibeui-not-found-001-accent);transition:transform .2s ease}
[data-vibeui-block="not-found-001"] [data-part="link"]:hover [data-part="arrow"]{transform:translateX(0.25rem)}
[data-vibeui-block="not-found-001"] :is([data-part="primary"],[data-part="secondary"],[data-part="link"]):focus-visible{outline:2px solid var(--vibeui-not-found-001-accent);outline-offset:2px}
@container (min-width:46rem){
[data-vibeui-block="not-found-001"] [data-part="layout"]{grid-template-columns:1fr 1.1fr;gap:3.5rem;padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-001"] *{animation:none!important;transition:none!important}}
`

const LINKS: NotFound001Link[] = [
  { label: "Каталог", hint: "Все компоненты и блоки", href: "/components" },
  { label: "Тарифы", hint: "Что входит в подписку", href: "/pricing" },
  { label: "Поддержка", hint: "Напишите нам — поможем", href: "/contact" },
]

export function NotFound001({
  code = "404",
  badge = "Ошибка 404",
  title = "Страница не найдена",
  description = "Такой страницы нет или она переехала. Проверьте адрес или начните с одного из разделов ниже.",
  actionLabel = "На главную",
  actionHref = "/",
  secondaryLabel = "Поиск по сайту",
  secondaryHref = "/search",
  links = LINKS,
  accent,
  background,
  className,
  style,
  ...props
}: NotFound001Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-001-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-001" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-001" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="visual" aria-hidden="true">
            <span data-part="glow" />
            <p data-part="code">{code}</p>
          </div>
          <div>
            <p data-part="badge">
              <span data-part="dot" aria-hidden="true" />
              {badge}
            </p>
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
            <ul data-part="links">
              {links.map((link) => (
                <li key={link.href}>
                  <a data-part="link" href={link.href}>
                    <span>
                      <span data-part="link-label">{link.label}</span>
                      <span data-part="link-hint">{link.hint}</span>
                    </span>
                    <span data-part="arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
