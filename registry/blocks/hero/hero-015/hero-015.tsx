import type { CSSProperties } from "react"

export type Hero015Props = {
  studio?: string
  title?: string
  lede?: string
  link?: { label: string; href: string }
  index?: { label: string; value: string }[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: минимум средств. Ни кнопок, ни карточек, ни градиентов —
// крупный serif-заголовок на бумажном фоне, одна подчёркнутая ссылка и
// выходные данные мелким кеглем внизу. Единственный акцент — подчёркивание,
// которое растёт из нуля на hover через background-size, а не через border:
// так линия остаётся на месте и не сдвигает текст.
const STYLES = `
:where([data-vibeui-block="hero-015"]){
--vibeui-hero-015-bg:oklch(0.97 0.008 80);
--vibeui-hero-015-fg:oklch(0.18 0.012 70);
--vibeui-hero-015-muted:oklch(0.48 0.014 70);
--vibeui-hero-015-line:oklch(0.85 0.012 70);
--vibeui-hero-015-accent:oklch(0.5 0.13 25);
--vibeui-hero-015-serif:ui-serif,Georgia,"Iowan Old Style","Times New Roman",serif;
--vibeui-hero-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-015"]{
box-sizing:border-box;background:var(--vibeui-hero-015-bg);color:var(--vibeui-hero-015-fg);
font-family:var(--vibeui-hero-015-sans);
}
[data-vibeui-block="hero-015"] *{box-sizing:border-box}
[data-vibeui-block="hero-015"] [data-part="shell"]{max-width:58rem;width:100%;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="hero-015"] [data-part="studio"]{
margin:0 0 3rem;padding-bottom:1rem;border-bottom:1px solid var(--vibeui-hero-015-line);
font-size:0.75rem;font-weight:650;letter-spacing:0.18em;text-transform:uppercase;color:var(--vibeui-hero-015-muted);
}
[data-vibeui-block="hero-015"] h1{
margin:0;font-family:var(--vibeui-hero-015-serif);font-weight:400;
font-size:clamp(2.25rem,8.5cqi,5rem);line-height:1.02;letter-spacing:-0.035em;text-wrap:balance;
}
[data-vibeui-block="hero-015"] h1 em{font-style:italic;color:var(--vibeui-hero-015-accent)}
[data-vibeui-block="hero-015"] [data-part="lede"]{
margin:2rem 0 0;max-width:32rem;font-size:clamp(0.9375rem,1.5cqi,1.125rem);line-height:1.65;
color:var(--vibeui-hero-015-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-015"] a{
display:inline-block;margin:2rem 0 0;padding-bottom:0.125rem;
font-size:1rem;font-weight:600;color:var(--vibeui-hero-015-fg);text-decoration:none;
background-image:linear-gradient(var(--vibeui-hero-015-accent),var(--vibeui-hero-015-accent));
background-repeat:no-repeat;background-position:0 100%;background-size:0 1px;
transition:background-size .24s ease,color .16s ease;
}
[data-vibeui-block="hero-015"] a::after{content:" →"}
[data-vibeui-block="hero-015"] a:hover{background-size:100% 1px;color:var(--vibeui-hero-015-accent)}
[data-vibeui-block="hero-015"] a:focus-visible{outline:2px solid var(--vibeui-hero-015-accent);outline-offset:4px}
[data-vibeui-block="hero-015"] dl{
display:grid;grid-template-columns:1fr;gap:0.75rem 2rem;margin:4rem 0 0;padding-top:1.25rem;
border-top:1px solid var(--vibeui-hero-015-line);font-size:0.8125rem;
}
[data-vibeui-block="hero-015"] [data-part="row"]{display:flex;justify-content:space-between;gap:1rem}
[data-vibeui-block="hero-015"] dt{margin:0;color:var(--vibeui-hero-015-muted)}
[data-vibeui-block="hero-015"] dd{margin:0;font-weight:600}
@container (min-width: 34rem){
[data-vibeui-block="hero-015"] [data-part="shell"]{padding:6rem 2rem}
[data-vibeui-block="hero-015"] dl{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="hero-015"] [data-part="row"]{flex-direction:column;gap:0.25rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-015"] [data-part="shell"]{padding:8rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INDEX = [
  { label: "Основано", value: "2021" },
  { label: "Проектов", value: "48" },
  { label: "Города", value: "Москва, Тбилиси" },
]

/** Минималистичный текстовый hero: крупный serif, одна ссылка и выходные данные. */
export function Hero015({
  studio = "Студия «Верста»",
  title = "Мы делаем интерфейсы, которые",
  lede = "Никаких скриншотов и градиентов на первом экране. Только то, чем занимаемся, и адрес, по которому нас можно застать.",
  link = { label: "Смотреть работы", href: "#" },
  index = DEFAULT_INDEX,
  accent,
  className,
  style,
}: Hero015Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {studio ? <p data-part="studio">{studio}</p> : null}
          <h1>
            {title} <em>не нужно объяснять</em>
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <a href={link.href}>{link.label}</a>

          {index.length > 0 ? (
            <dl>
              {index.slice(0, 3).map((entry) => (
                <div key={entry.label} data-part="row">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
    </>
  )
}
