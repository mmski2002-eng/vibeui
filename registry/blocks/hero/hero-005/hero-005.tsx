import type { CSSProperties } from "react"

export type Hero005Props = {
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  appName?: string
  metrics?: { label: string; value: string }[]
  rows?: string[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: текст сверху, под ним снимок продукта во всю ширину, обрезанный
// нижним краем. Снимок нарисован разметкой — окно, боковое меню, плитки и
// строки списка, — поэтому блок не тянет ни одного файла и не устаревает
// вместе с реальным скриншотом. Обрезка сделана маской, а не тенью:
// незаконченное окно читается как «страница продолжается».
const STYLES = `
:where([data-vibeui-block="hero-005"]){
--vibeui-hero-005-bg:transparent;
--vibeui-hero-005-fg:light-dark(oklch(0.2 0.018 265),oklch(0.97 0.003 265));
--vibeui-hero-005-muted:light-dark(oklch(0.52 0.014 265),oklch(0.72 0.012 265));
--vibeui-hero-005-panel:light-dark(oklch(0.99 0.002 265),oklch(0.21 0.018 265));
--vibeui-hero-005-tile:light-dark(oklch(0.955 0.004 265),oklch(0.25 0.018 265));
--vibeui-hero-005-line:light-dark(oklch(0.2 0.018 265 / 13%),oklch(1 0 0 / 15%));
--vibeui-hero-005-accent:light-dark(oklch(0.52 0.13 195),oklch(0.72 0.16 195));
--vibeui-hero-005-accent-fg:light-dark(oklch(0.99 0.005 195),oklch(0.18 0.03 195));
--vibeui-hero-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-005"]{color-scheme:dark}
[data-vibeui-block="hero-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;background:var(--vibeui-hero-005-bg);color:var(--vibeui-hero-005-fg);
font-family:var(--vibeui-hero-005-sans);
}
[data-vibeui-block="hero-005"] *{box-sizing:border-box}
[data-vibeui-block="hero-005"] [data-part="shell"]{max-width:72rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem 0}
[data-vibeui-block="hero-005"] [data-part="copy"]{max-width:40rem;margin:0 auto;text-align:center}
[data-vibeui-block="hero-005"] h1{
margin:0;font-size:clamp(1.875rem,5.6cqi,3.25rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-005"] [data-part="lede"]{
margin:1rem 0 0;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;color:var(--vibeui-hero-005-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-005"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:1.75rem 0 0}
[data-vibeui-block="hero-005"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding:0 1.375rem;border-radius:0.625rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;transition:opacity .16s ease,border-color .16s ease;
}
[data-vibeui-block="hero-005"] [data-part="primary"]{background:var(--vibeui-hero-005-accent);color:var(--vibeui-hero-005-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-005"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-005-line);color:var(--vibeui-hero-005-fg)}
[data-vibeui-block="hero-005"] a:hover{opacity:.88}
[data-vibeui-block="hero-005"] a:focus-visible{outline:2px solid var(--vibeui-hero-005-accent);outline-offset:3px}
[data-vibeui-block="hero-005"] [data-part="shot"]{
margin:2.75rem auto 0;max-width:60rem;width:100%;border:1px solid var(--vibeui-hero-005-line);
border-bottom:0;border-radius:0.875rem 0.875rem 0 0;background:var(--vibeui-hero-005-panel);overflow:hidden;
-webkit-mask-image:linear-gradient(to bottom,black 68%,transparent);mask-image:linear-gradient(to bottom,black 68%,transparent);
}
[data-vibeui-block="hero-005"] [data-part="bar"]{
display:flex;align-items:center;gap:0.375rem;padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-hero-005-line);
}
[data-vibeui-block="hero-005"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-hero-005-line)}
[data-vibeui-block="hero-005"] [data-part="app"]{margin-left:0.5rem;font-size:0.75rem;color:var(--vibeui-hero-005-muted)}
[data-vibeui-block="hero-005"] [data-part="body"]{display:grid;grid-template-columns:1fr;gap:0.875rem;padding:0.875rem;min-height:16rem}
[data-vibeui-block="hero-005"] [data-part="rail"]{display:none;flex-direction:column;gap:0.375rem}
[data-vibeui-block="hero-005"] [data-part="railitem"]{height:0.5rem;border-radius:9999px;background:var(--vibeui-hero-005-tile)}
[data-vibeui-block="hero-005"] [data-part="railitem"]:first-child{background:var(--vibeui-hero-005-accent);opacity:.7}
[data-vibeui-block="hero-005"] [data-part="metrics"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem}
[data-vibeui-block="hero-005"] [data-part="metric"]{border:1px solid var(--vibeui-hero-005-line);border-radius:0.5rem;padding:0.625rem;background:var(--vibeui-hero-005-tile)}
[data-vibeui-block="hero-005"] [data-part="metric"] dt{margin:0;font-size:0.6875rem;color:var(--vibeui-hero-005-muted)}
[data-vibeui-block="hero-005"] [data-part="metric"] dd{margin:0.25rem 0 0;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-005"] [data-part="rows"]{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="hero-005"] [data-part="rows"] li{
display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-hero-005-tile);font-size:0.75rem;color:var(--vibeui-hero-005-muted);
}
[data-vibeui-block="hero-005"] [data-part="pip"]{width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-hero-005-accent)}
@container (min-width: 34rem){
[data-vibeui-block="hero-005"] [data-part="actions"]{flex-direction:row;justify-content:center}
[data-vibeui-block="hero-005"] [data-part="shell"]{padding:5rem 2rem 0}
}
@container (min-width: 52rem){
[data-vibeui-block="hero-005"] [data-part="body"]{grid-template-columns:9rem minmax(0,1fr);min-height:20rem}
[data-vibeui-block="hero-005"] [data-part="rail"]{display:flex}
[data-vibeui-block="hero-005"] [data-part="stack"]{display:grid;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS = [
  { label: "Секций собрано", value: "128" },
  { label: "Среднее время", value: "6 мин" },
  { label: "Правок вручную", value: "0" },
]

const DEFAULT_ROWS = [
  "Секция «Тарифы» установлена в проект",
  "Агент подставил ваши тексты и валюту",
  "Проверка контраста пройдена",
  "Готово к деплою",
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Hero со снимком продукта: текст по центру, под ним обрезанное окно приложения. */
export function Hero005({
  title = "Покажите продукт, а не обещание",
  lede = "Секция открывается снимком интерфейса: посетитель видит, что внутри, ещё до регистрации.",
  primary = { label: "Открыть демо", href: "#" },
  secondary = { label: "Как это работает", href: "#" },
  appName = "vibeui — рабочая область",
  metrics = DEFAULT_METRICS,
  rows = DEFAULT_ROWS,
  accent,
  background = "",
  className,
  style,
}: Hero005Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <h1>{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              <a data-part="primary" href={primary.href}>
                {primary.label}
              </a>
              <a data-part="secondary" href={secondary.href}>
                {secondary.label}
              </a>
            </div>
          </div>

          <div data-part="shot" aria-hidden="true">
            <div data-part="bar">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="app">{appName}</span>
            </div>
            <div data-part="body">
              <div data-part="rail">
                <span data-part="railitem" />
                <span data-part="railitem" />
                <span data-part="railitem" />
                <span data-part="railitem" />
              </div>
              <div data-part="stack">
                <dl data-part="metrics">
                  {metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label} data-part="metric">
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul data-part="rows">
                  {rows.slice(0, 5).map((row) => (
                    <li key={row}>
                      <span data-part="pip" />
                      {row}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
