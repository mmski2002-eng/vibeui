import type { CSSProperties } from "react"

export type Cta005Props = {
  eyebrow?: string
  title?: string
  description?: string
  bullets?: string[]
  actionLabel?: string
  actionHref?: string
  noteLabel?: string
  imageSrc?: string
  imageAlt?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с картинкой сбоку. Место под картинку держит соотношение сторон,
// поэтому раскладка не прыгает, пока изображение грузится. Если imageSrc не
// передан, в том же месте рисуется нарисованная CSS-заглушка: блок обязан
// выглядеть законченным без единого внешнего файла.
const STYLES = `
:where([data-vibeui-block="cta-005"]){
--vibeui-cta-005-bg:oklch(1 0 0);
--vibeui-cta-005-ink:oklch(0.2 0.015 210);
--vibeui-cta-005-muted:oklch(0.5 0.015 210);
--vibeui-cta-005-border:oklch(0.9 0.008 210);
--vibeui-cta-005-accent:oklch(0.55 0.14 195);
--vibeui-cta-005-accent-fg:oklch(0.16 0.04 195);
--vibeui-cta-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="cta-005"]{
display:block;background:var(--vibeui-cta-005-bg);color:var(--vibeui-cta-005-ink);
font-family:var(--vibeui-cta-005-font);
}
[data-vibeui-block="cta-005"] [data-part="shell"]{
display:grid;gap:1.75rem;align-items:center;
max-width:74rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="cta-005"] [data-part="eyebrow"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-005-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="cta-005"] [data-part="title"]{
margin:0;max-width:17ch;
font-size:clamp(1.75rem,5.6cqi,2.875rem);line-height:1.08;letter-spacing:-0.03em;font-weight:720;
}
[data-vibeui-block="cta-005"] [data-part="text"]{
margin:0.875rem 0 0;max-width:50ch;
color:var(--vibeui-cta-005-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-005"] [data-part="bullets"]{
margin:1.25rem 0 0;padding:0;list-style:none;display:grid;gap:0.5rem;
font-size:0.9375rem;
}
[data-vibeui-block="cta-005"] [data-part="bullets"] li{display:flex;align-items:flex-start;gap:0.5rem;line-height:1.45}
[data-vibeui-block="cta-005"] [data-part="bullets"] li::before{
content:"";flex:none;width:1rem;height:1rem;margin-top:0.1875rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-cta-005-accent) 22%,transparent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-cta-005-accent);
}
[data-vibeui-block="cta-005"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;margin-top:1.75rem}
[data-vibeui-block="cta-005"] [data-part="action"]{
display:inline-flex;align-items:center;height:2.875rem;padding:0 1.375rem;border-radius:0.75rem;
background:var(--vibeui-cta-005-accent);color:var(--vibeui-cta-005-accent-fg);
text-decoration:none;font-size:0.9375rem;font-weight:660;
transition:background-color .18s ease;
}
[data-vibeui-block="cta-005"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-cta-005-accent) 85%,black)}
[data-vibeui-block="cta-005"] [data-part="note"]{margin:0;color:var(--vibeui-cta-005-muted);font-size:0.8125rem}
[data-vibeui-block="cta-005"] [data-part="media"]{
position:relative;aspect-ratio:4 / 3;border-radius:1.25rem;overflow:hidden;
border:1px solid var(--vibeui-cta-005-border);
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-cta-005-accent) 26%,white),oklch(0.96 0.01 210));
}
[data-vibeui-block="cta-005"] [data-part="media"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="cta-005"] [data-part="mock"]{position:absolute;inset:0}
[data-vibeui-block="cta-005"] [data-part="mock"]::before{
content:"";position:absolute;left:8%;right:22%;top:14%;height:34%;border-radius:0.875rem;
background:oklch(1 0 0 / 78%);
box-shadow:0 18px 40px -24px oklch(0.2 0.04 210 / 60%);
}
[data-vibeui-block="cta-005"] [data-part="mock"]::after{
content:"";position:absolute;left:26%;right:8%;bottom:16%;height:42%;border-radius:0.875rem;
background:linear-gradient(140deg,var(--vibeui-cta-005-accent),color-mix(in oklab,var(--vibeui-cta-005-accent) 40%,white));
box-shadow:0 22px 46px -22px oklch(0.2 0.04 210 / 60%);
}
[data-vibeui-block="cta-005"] a:focus-visible{outline:2px solid var(--vibeui-cta-005-accent);outline-offset:3px}
@container (min-width: 46rem){
[data-vibeui-block="cta-005"] [data-part="shell"]{grid-template-columns:1fr 1fr;gap:3.5rem;padding:5rem 2.5rem}
[data-vibeui-block="cta-005"] [data-part="media"]{aspect-ratio:5 / 4}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BULLETS = [
  "Замер и смета в день обращения",
  "Материалы со склада, без ожидания поставки",
  "Гарантия на монтаж три года",
]

/** Призыв с картинкой сбоку: место под изображение держит соотношение сторон. */
export function Cta005({
  eyebrow = "Ремонт кухни",
  title = "Приезжаем на замер завтра, начинаем в понедельник",
  description = "Показываем смету до начала работ и не меняем её по ходу. Если сроки уезжают по нашей вине, платим неустойку за каждый день.",
  bullets = DEFAULT_BULLETS,
  actionLabel = "Вызвать замерщика",
  actionHref = "#measure",
  noteLabel = "Работаем по Москве и области",
  imageSrc,
  imageAlt = "Собранная кухня после ремонта",
  accent,
  className,
  style,
}: Cta005Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="main">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="text">{description}</p>
            <ul data-part="bullets">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div data-part="actions">
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
              <p data-part="note">{noteLabel}</p>
            </div>
          </div>
          <div data-part="media">
            {imageSrc ? (
              <img src={imageSrc} alt={imageAlt} />
            ) : (
              <span data-part="mock" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
