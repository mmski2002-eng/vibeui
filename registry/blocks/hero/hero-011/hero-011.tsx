import type { CSSProperties } from "react"

export type Hero011Props = {
  kicker?: string
  title?: string
  titleAccent?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  meta?: string[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: фон и есть дизайн. Сетка нарисована двумя repeating-linear-
// gradient и погашена radial-маской к краям — линии не упираются в границу
// секции, а растворяются. Поверх — два цветных пятна на разных углах.
// Всё это фон одного элемента: ни одного лишнего слоя в разметке, ничего
// не перехватывает клики, и картинка не участвует в потоке.
const STYLES = `
:where([data-vibeui-block="hero-011"]){
--vibeui-hero-011-bg:oklch(0.15 0.02 275);
--vibeui-hero-011-fg:oklch(0.98 0.003 275);
--vibeui-hero-011-muted:oklch(0.72 0.014 275);
--vibeui-hero-011-line:oklch(1 0 0 / 7%);
--vibeui-hero-011-edge:oklch(1 0 0 / 16%);
--vibeui-hero-011-accent:oklch(0.7 0.19 30);
--vibeui-hero-011-accent-fg:oklch(0.16 0.03 30);
--vibeui-hero-011-cool:oklch(0.55 0.2 275);
--vibeui-hero-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-011"]{
box-sizing:border-box;position:relative;isolation:isolate;overflow:hidden;
background:var(--vibeui-hero-011-bg);color:var(--vibeui-hero-011-fg);font-family:var(--vibeui-hero-011-sans);
}
[data-vibeui-block="hero-011"] *{box-sizing:border-box}
[data-vibeui-block="hero-011"]::before{
content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;
background:
repeating-linear-gradient(to right,var(--vibeui-hero-011-line) 0 1px,transparent 1px 4rem),
repeating-linear-gradient(to bottom,var(--vibeui-hero-011-line) 0 1px,transparent 1px 4rem);
-webkit-mask-image:radial-gradient(120% 90% at 50% 0%,black,transparent 72%);
mask-image:radial-gradient(120% 90% at 50% 0%,black,transparent 72%);
}
[data-vibeui-block="hero-011"]::after{
content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
background:
radial-gradient(45% 45% at 22% 8%,color-mix(in oklab,var(--vibeui-hero-011-accent) 34%,transparent),transparent 70%),
radial-gradient(50% 50% at 84% 26%,color-mix(in oklab,var(--vibeui-hero-011-cool) 40%,transparent),transparent 72%);
}
[data-vibeui-block="hero-011"] [data-part="shell"]{
position:relative;max-width:54rem;width:100%;margin:0 auto;padding:4rem 1.25rem;text-align:center;
}
[data-vibeui-block="hero-011"] [data-part="kicker"]{
display:inline-block;margin:0 0 1.25rem;padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-hero-011-edge);background:oklch(1 0 0 / 5%);
font-size:0.75rem;font-weight:600;color:var(--vibeui-hero-011-muted);
}
[data-vibeui-block="hero-011"] h1{
margin:0;font-size:clamp(2rem,7cqi,4rem);line-height:1.02;letter-spacing:-0.04em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-011"] h1 span{
background:linear-gradient(100deg,var(--vibeui-hero-011-accent),var(--vibeui-hero-011-cool));
-webkit-background-clip:text;background-clip:text;color:transparent;
}
[data-vibeui-block="hero-011"] [data-part="lede"]{
margin:1.25rem auto 0;max-width:34rem;font-size:clamp(0.9375rem,1.5cqi,1.125rem);line-height:1.6;
color:var(--vibeui-hero-011-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-011"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:2rem auto 0;max-width:20rem}
[data-vibeui-block="hero-011"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.875rem;padding:0 1.5rem;border-radius:0.75rem;
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease,border-color .16s ease;
}
[data-vibeui-block="hero-011"] [data-part="primary"]{
background:var(--vibeui-hero-011-accent);color:var(--vibeui-hero-011-accent-fg);border:1px solid transparent;
box-shadow:0 0 2.5rem color-mix(in oklab,var(--vibeui-hero-011-accent) 30%,transparent);
}
[data-vibeui-block="hero-011"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-011-edge);color:var(--vibeui-hero-011-fg);background:oklch(1 0 0 / 4%)}
[data-vibeui-block="hero-011"] a:hover{opacity:.88}
[data-vibeui-block="hero-011"] a:focus-visible{outline:2px solid var(--vibeui-hero-011-accent);outline-offset:3px}
[data-vibeui-block="hero-011"] [data-part="meta"]{
list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.5rem;margin:2rem 0 0;padding:0;
font-size:0.75rem;color:var(--vibeui-hero-011-muted);
}
[data-vibeui-block="hero-011"] [data-part="meta"] li{display:flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="hero-011"] [data-part="dot"]{width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-hero-011-accent)}
@container (min-width: 34rem){
[data-vibeui-block="hero-011"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-011"] [data-part="shell"]{padding:6.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_META = [
  "Ноль зависимостей",
  "Своя палитра",
  "Container queries",
  "Reduced motion",
]

/** Hero на фоновом градиенте и сетке: линии гасятся маской, поверх — два цветных пятна. */
export function Hero011({
  kicker = "Версия 2.0 уже в каталоге",
  title = "Фон, который делает",
  titleAccent = "половину работы",
  lede = "Сетка и свечение нарисованы градиентами на самой секции — ни картинок, ни лишних слоёв в разметке.",
  primary = { label: "Забрать секцию", href: "#" },
  secondary = { label: "Читать документацию", href: "#" },
  meta = DEFAULT_META,
  accent,
  className,
  style,
}: Hero011Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {kicker ? <p data-part="kicker">{kicker}</p> : null}
          <h1>
            {title} {titleAccent ? <span>{titleAccent}</span> : null}
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            <a data-part="primary" href={primary.href}>
              {primary.label}
            </a>
            <a data-part="secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
          {meta.length > 0 ? (
            <ul data-part="meta">
              {meta.slice(0, 4).map((item) => (
                <li key={item}>
                  <span data-part="dot" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
