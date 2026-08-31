import type { CSSProperties } from "react"

type Testimonials003Metric = {
  value: string
  caption: string
}

export type Testimonials003Props = {
  quote?: string
  name?: string
  role?: string
  company?: string
  metrics?: Testimonials003Metric[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна крупная цитата вместо стены карточек. Приём работает, когда есть
// действительно сильный отзыв: его набирают засечным шрифтом, дают ему всю
// ширину и подпирают проверяемыми цифрами. Кавычка нарисована фоновым
// знаком и намеренно обрезана сверху — она подложка, а не украшение.
const STYLES = `
:where([data-vibeui-block="testimonials-003"]){
--vibeui-testimonials-003-bg:oklch(0.97 0.008 90);
--vibeui-testimonials-003-ink:oklch(0.2 0.02 70);
--vibeui-testimonials-003-muted:oklch(0.47 0.02 70);
--vibeui-testimonials-003-border:oklch(0.87 0.016 80);
--vibeui-testimonials-003-accent:oklch(0.5 0.13 45);
--vibeui-testimonials-003-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-testimonials-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="testimonials-003"]{
display:block;position:relative;overflow:hidden;
background:var(--vibeui-testimonials-003-bg);color:var(--vibeui-testimonials-003-ink);
font-family:var(--vibeui-testimonials-003-font);
}
[data-vibeui-block="testimonials-003"] [data-part="shell"]{
position:relative;z-index:1;
max-width:60rem;margin:0 auto;padding:3.25rem 1.25rem;
}
[data-vibeui-block="testimonials-003"] [data-part="glyph"]{
position:absolute;left:0.5rem;top:-1.5rem;z-index:0;
color:color-mix(in oklab,var(--vibeui-testimonials-003-accent) 16%,transparent);
font-family:var(--vibeui-testimonials-003-serif);
font-size:16rem;line-height:1;pointer-events:none;user-select:none;
}
[data-vibeui-block="testimonials-003"] [data-part="figure"]{margin:0}
[data-vibeui-block="testimonials-003"] [data-part="quote"]{
margin:0;
font-family:var(--vibeui-testimonials-003-serif);
font-size:clamp(1.375rem,4.4cqi,2.25rem);line-height:1.28;letter-spacing:-0.015em;font-weight:500;
text-wrap:balance;
}
[data-vibeui-block="testimonials-003"] [data-part="author"]{
display:flex;align-items:center;gap:0.875rem;margin-top:2rem;
}
[data-vibeui-block="testimonials-003"] [data-part="avatar"]{
width:3rem;height:3rem;flex:none;border-radius:999px;
display:grid;place-items:center;
background:var(--vibeui-testimonials-003-accent);color:oklch(0.99 0 0);
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="testimonials-003"] [data-part="name"]{display:block;font-size:1rem;font-weight:660}
[data-vibeui-block="testimonials-003"] [data-part="role"]{display:block;color:var(--vibeui-testimonials-003-muted);font-size:0.875rem;line-height:1.4}
[data-vibeui-block="testimonials-003"] [data-part="company"]{
margin-left:auto;padding-left:1rem;border-left:1px solid var(--vibeui-testimonials-003-border);
color:var(--vibeui-testimonials-003-muted);
font-size:0.8125rem;font-weight:640;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-003"] [data-part="metrics"]{
display:grid;gap:1.25rem;margin:2.25rem 0 0;padding:1.5rem 0 0;
border-top:1px solid var(--vibeui-testimonials-003-border);
}
[data-vibeui-block="testimonials-003"] [data-part="metric"] dt{
font-size:clamp(1.5rem,3.6cqi,2rem);line-height:1;letter-spacing:-0.03em;font-weight:730;
color:var(--vibeui-testimonials-003-accent);
}
[data-vibeui-block="testimonials-003"] [data-part="metric"] dd{
margin:0.375rem 0 0;color:var(--vibeui-testimonials-003-muted);font-size:0.875rem;line-height:1.45;max-width:26ch;
}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-003"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="testimonials-003"] [data-part="metrics"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS: Testimonials003Metric[] = [
  { value: "4 дня", caption: "вместо трёх недель на выпуск посадочной" },
  { value: "−62 %", caption: "времени дизайнера на типовые экраны" },
  { value: "17", caption: "страниц собрано за первый квартал" },
]

/** Одна крупная цитата: засечный набор, автор и три проверяемые цифры. */
export function Testimonials003({
  quote = "Мы перестали спорить о том, как должна выглядеть очередная страница. Спорим теперь о том, что на ней написано, — и это единственный спор, который приносит деньги.",
  name = "Елена Ремизова",
  role = "Директор по продукту",
  company = "Артель",
  metrics = DEFAULT_METRICS,
  accent,
  className,
  style,
}: Testimonials003Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-003"
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          “
        </span>
        <div data-part="shell">
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="author">
              <span data-part="avatar" aria-hidden="true">
                ЕР
              </span>
              <span>
                <span data-part="name">{name}</span>
                <span data-part="role">{role}</span>
              </span>
              <span data-part="company">{company}</span>
            </figcaption>
          </figure>
          <dl data-part="metrics">
            {metrics.map((metric) => (
              <div key={metric.caption} data-part="metric">
                <dt>{metric.value}</dt>
                <dd>{metric.caption}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
