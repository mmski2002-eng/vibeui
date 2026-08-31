import type { CSSProperties } from "react"

export type Hero008Props = {
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  logosTitle?: string
  logos?: string[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: доказательство внизу. Текст занимает верх, а нижнюю треть держит
// полоса клиентов, отбитая линией. Логотипы — текстовые начертания, а не
// картинки: чужие файлы в блок не входят, а wordmark из системного шрифта
// читается на любом фоне и не мылится на ретине. Полоса не бесконечная лента,
// а сетка: в узком блоке она честно переносится, а не уезжает за край.
const STYLES = `
:where([data-vibeui-block="hero-008"]){
--vibeui-hero-008-bg:oklch(1 0 0);
--vibeui-hero-008-fg:oklch(0.19 0.01 250);
--vibeui-hero-008-muted:oklch(0.52 0.012 250);
--vibeui-hero-008-line:oklch(0.9 0.006 250);
--vibeui-hero-008-soft:oklch(0.97 0.004 250);
--vibeui-hero-008-accent:oklch(0.5 0.19 265);
--vibeui-hero-008-accent-fg:oklch(0.99 0 0);
--vibeui-hero-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-008"]{
box-sizing:border-box;background:var(--vibeui-hero-008-bg);color:var(--vibeui-hero-008-fg);
font-family:var(--vibeui-hero-008-sans);
}
[data-vibeui-block="hero-008"] *{box-sizing:border-box}
[data-vibeui-block="hero-008"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem 0;text-align:center}
[data-vibeui-block="hero-008"] h1{
margin:0;font-size:clamp(1.875rem,6cqi,3.5rem);line-height:1.06;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-008"] [data-part="lede"]{
margin:1.125rem auto 0;max-width:36rem;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-008-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-008"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:1.875rem auto 0;max-width:20rem}
[data-vibeui-block="hero-008"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding:0 1.375rem;border-radius:9999px;
font-size:0.9375rem;font-weight:600;text-decoration:none;transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="hero-008"] [data-part="primary"]{background:var(--vibeui-hero-008-accent);color:var(--vibeui-hero-008-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-008"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-008-accent) 86%,black)}
[data-vibeui-block="hero-008"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-008-line);color:var(--vibeui-hero-008-fg)}
[data-vibeui-block="hero-008"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-008-fg)}
[data-vibeui-block="hero-008"] a:focus-visible{outline:2px solid var(--vibeui-hero-008-accent);outline-offset:3px}
[data-vibeui-block="hero-008"] [data-part="proof"]{margin-top:3rem;border-top:1px solid var(--vibeui-hero-008-line);background:var(--vibeui-hero-008-soft)}
[data-vibeui-block="hero-008"] [data-part="proofinner"]{max-width:64rem;width:100%;margin:0 auto;padding:1.75rem 1.25rem}
[data-vibeui-block="hero-008"] [data-part="prooftitle"]{
margin:0 0 1.125rem;text-align:center;font-size:0.6875rem;font-weight:650;letter-spacing:0.16em;text-transform:uppercase;
color:var(--vibeui-hero-008-muted);
}
[data-vibeui-block="hero-008"] [data-part="logos"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.5rem;
}
[data-vibeui-block="hero-008"] [data-part="logos"] li{
display:flex;align-items:center;justify-content:center;gap:0.4375rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;color:var(--vibeui-hero-008-fg);opacity:.62;
transition:opacity .16s ease;
}
[data-vibeui-block="hero-008"] [data-part="logos"] li:hover{opacity:1}
[data-vibeui-block="hero-008"] [data-part="mark"]{
width:1.125rem;height:1.125rem;border-radius:0.3125rem;background:currentColor;
-webkit-mask-image:conic-gradient(from 45deg,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
mask-image:conic-gradient(from 45deg,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
}
@container (min-width: 34rem){
[data-vibeui-block="hero-008"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-008"] [data-part="shell"]{padding:5.5rem 2rem 0}
[data-vibeui-block="hero-008"] [data-part="logos"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-008"] [data-part="logos"]{grid-template-columns:repeat(6,minmax(0,1fr))}
[data-vibeui-block="hero-008"] [data-part="proofinner"]{padding:2.25rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOGOS = ["Контур", "Литера", "Оптика", "Тандем", "Ясно", "Верста"]

/** Hero с полосой логотипов клиентов внизу: текст сверху, доказательство под линией. */
export function Hero008({
  title = "Страницы, которым доверяют отделы маркетинга",
  lede = "Секции переживают редизайн бренда: тексты, цвета и типографика вынесены в пропсы, вёрстка остаётся на месте.",
  primary = { label: "Собрать страницу", href: "#" },
  secondary = { label: "Поговорить с нами", href: "#" },
  logosTitle = "С нами работают",
  logos = DEFAULT_LOGOS,
  accent,
  className,
  style,
}: Hero008Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
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

        <div data-part="proof">
          <div data-part="proofinner">
            <h2 data-part="prooftitle">{logosTitle}</h2>
            <ul data-part="logos">
              {logos.slice(0, 6).map((logo) => (
                <li key={logo}>
                  <span data-part="mark" aria-hidden="true" />
                  {logo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
