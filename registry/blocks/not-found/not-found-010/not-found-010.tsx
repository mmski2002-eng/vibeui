import type { ComponentProps, CSSProperties } from "react"

type NotFound010Step = { label: string; href: string }

export type NotFound010Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  /** Ступени лестницы сверху вниз: каждая — ссылка на раздел. */
  steps?: NotFound010Step[]
  /** Цвет нижней ступени-404 и шарика. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Лестница, по которой человек спустился не туда: ступени — разделы сайта
// (по ним можно подняться обратно), а внизу, на последней ступени, лежит
// 404, на которой подпрыгивает шарик — «вы здесь».
// Ступени сдвинуты лесенкой через переменную индекса, без абсолютной вёрстки.
const STYLES = `
:where([data-vibeui-block="not-found-010"]){
--vibeui-not-found-010-bg:transparent;
--vibeui-not-found-010-fg:light-dark(oklch(0.18 0.01 250),oklch(0.95 0.005 250));
--vibeui-not-found-010-muted:light-dark(oklch(0.5 0.01 250),oklch(0.72 0.01 250));
--vibeui-not-found-010-step:light-dark(oklch(0.95 0.005 250),oklch(0.24 0.01 250));
--vibeui-not-found-010-edge:light-dark(oklch(0.86 0.01 250),oklch(0.34 0.01 250));
--vibeui-not-found-010-accent:light-dark(oklch(0.58 0.2 265),oklch(0.7 0.16 265));
--vibeui-not-found-010-on-accent:oklch(from var(--vibeui-not-found-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-not-found-010-shift:clamp(1.5rem,7cqi,4rem);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-010"]{color-scheme:dark}
[data-vibeui-block="not-found-010"]{display:block;background:var(--vibeui-not-found-010-bg);color:var(--vibeui-not-found-010-fg);font-family:var(--vibeui-not-found-010-font)}
[data-vibeui-block="not-found-010"] [data-part="layout"]{display:grid;gap:2.5rem;align-items:center;box-sizing:border-box;max-width:62rem;margin:0 auto;padding:3.5rem 1.5rem}
[data-vibeui-block="not-found-010"] [data-part="code"]{margin:0;color:var(--vibeui-not-found-010-accent);font-size:0.8125rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase}
[data-vibeui-block="not-found-010"] [data-part="title"]{margin:0.75rem 0 0;font-size:clamp(2rem,6cqi,3.25rem);font-weight:800;line-height:1.02;letter-spacing:-0.04em;text-wrap:balance}
[data-vibeui-block="not-found-010"] [data-part="text"]{margin:1rem 0 0;max-width:26rem;color:var(--vibeui-not-found-010-muted);font-size:1rem;line-height:1.55}
[data-vibeui-block="not-found-010"] [data-part="stairs-frame"]{position:relative}
[data-vibeui-block="not-found-010"] [data-part="stairs"]{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}
[data-vibeui-block="not-found-010"] [data-part="step"]{margin-left:calc(var(--vibeui-not-found-010-i) * var(--vibeui-not-found-010-shift))}
[data-vibeui-block="not-found-010"] [data-part="tread"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;box-sizing:border-box;height:3.25rem;padding:0 1rem;
background:var(--vibeui-not-found-010-step);box-shadow:inset 0 -3px 0 var(--vibeui-not-found-010-edge);border-radius:0.5rem 0.5rem 0 0;
color:inherit;font-size:0.9375rem;font-weight:600;text-decoration:none;transition:background .2s ease,translate .2s ease;
}
[data-vibeui-block="not-found-010"] a[data-part="tread"]:hover{translate:0 -3px;background:color-mix(in oklab,var(--vibeui-not-found-010-accent) 10%,var(--vibeui-not-found-010-step))}
[data-vibeui-block="not-found-010"] a[data-part="tread"]::after{content:"↑";color:var(--vibeui-not-found-010-muted)}
[data-vibeui-block="not-found-010"] a[data-part="tread"]:focus-visible{outline:2px solid var(--vibeui-not-found-010-accent);outline-offset:2px}
[data-vibeui-block="not-found-010"] [data-part="tread"][data-bottom]{
background:var(--vibeui-not-found-010-accent);color:var(--vibeui-not-found-010-on-accent);box-shadow:none;font-size:1.375rem;font-weight:900;letter-spacing:0.08em;
}
[data-vibeui-block="not-found-010"] [data-part="ball"]{
width:1rem;height:1rem;border-radius:50%;background:var(--vibeui-not-found-010-on-accent);
animation:vibeui-not-found-010-bounce .9s cubic-bezier(.3,0,.7,1) infinite alternate;
}
@keyframes vibeui-not-found-010-bounce{from{translate:0 0.5rem}to{translate:0 -0.75rem}}
@container (min-width:44rem){
[data-vibeui-block="not-found-010"] [data-part="layout"]{grid-template-columns:1fr 1.15fr;gap:4rem;padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-010"] *{animation:none!important;transition:none!important}}
`

const STEPS: NotFound010Step[] = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/components" },
  { label: "Тарифы", href: "/pricing" },
  { label: "Контакты", href: "/contact" },
]

export function NotFound010({
  code = "Ошибка 404",
  title = "Вы спустились чуть ниже, чем нужно",
  description = "Этой страницы нет — вы на самой нижней ступеньке. Поднимитесь по любой из них обратно.",
  steps = STEPS,
  accent,
  background,
  className,
  style,
  ...props
}: NotFound010Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-010-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-010-bg": background } : null),
    ...style,
  } as CSSProperties
  const visible = steps.slice(0, 4)

  return (
    <>
      <style href="vibeui-not-found-010" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-010" className={className} style={palette}>
        <div data-part="layout">
          <div>
            <p data-part="code">{code}</p>
            <h1 data-part="title">{title}</h1>
            <p data-part="text">{description}</p>
          </div>
          <nav data-part="stairs-frame" aria-label={title}>
            <ol data-part="stairs">
              {visible.map((step, index) => (
                <li key={step.href} data-part="step" style={{ "--vibeui-not-found-010-i": index } as CSSProperties}>
                  <a data-part="tread" href={step.href}>
                    {step.label}
                  </a>
                </li>
              ))}
              <li data-part="step" style={{ "--vibeui-not-found-010-i": visible.length } as CSSProperties}>
                <span data-part="tread" data-bottom="">
                  404
                  <span data-part="ball" aria-hidden="true" />
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </section>
    </>
  )
}
