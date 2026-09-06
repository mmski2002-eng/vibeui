import type { CSSProperties } from "react"

export type Features017Props = {
  eyebrow?: string
  title?: string
  lede?: string
  leadTitle?: string
  leadText?: string
  metricValue?: string
  metricLabel?: string
  commandTitle?: string
  command?: string
  commandNote?: string
  checksTitle?: string
  checks?: string[]
  aiTitle?: string
  aiText?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: bento — плитки разного размера в одной сетке. Смысл не в
// декоре: размер плитки и есть иерархия. Крупная плитка держит главную мысль
// и показывает её нарисованной схемой страницы, мелкие добавляют по одному
// факту — число, команду установки, список того, что внутри, и абзац про
// инструкцию для агента. Ни одной серой заглушки: если плитке нечего сказать,
// её убирают, а не заполняют «Lorem».
//
// Сетка строится container-запросами от ширины блока: один столбец на узкой
// ширине, два от 40rem и четыре от 64rem, где крупная плитка занимает два
// столбца и две строки.
//
// Тема берётся из color-scheme окружения через light-dark(): по умолчанию
// секция светлая, в тёмном контексте плитка светлее фона.
const STYLES = `
:where([data-vibeui-block="features-017"]){
--vibeui-features-017-bg:transparent;
--vibeui-features-017-tile:light-dark(oklch(0.99 0 265),oklch(0.24 0 265));
--vibeui-features-017-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-features-017-muted:light-dark(oklch(0.51 0 265),oklch(0.72 0 265));
--vibeui-features-017-line:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-features-017-accent:light-dark(oklch(0.55 0.16 268),oklch(0.75 0.14 268));
--vibeui-features-017-soft:color-mix(in oklab,var(--vibeui-features-017-accent) 12%,transparent);
--vibeui-features-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-features-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-017"]{color-scheme:dark}
[data-vibeui-block="features-017"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-017-bg);color:var(--vibeui-features-017-fg);
font-family:var(--vibeui-features-017-font);
}
[data-vibeui-block="features-017"] *{box-sizing:border-box}
[data-vibeui-block="features-017"] [data-part="frame"]{max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-017"] [data-part="head"]{max-width:40rem;margin:0 0 2rem}
[data-vibeui-block="features-017"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.8125rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-017-accent);
}
[data-vibeui-block="features-017"] h2{
margin:0;font-size:clamp(1.625rem,4.4cqi,2.75rem);line-height:1.1;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-017"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(1rem,1.4cqi,1.125rem);line-height:1.55;
color:var(--vibeui-features-017-muted);text-wrap:pretty;
}
[data-vibeui-block="features-017"] [data-part="grid"]{
display:grid;grid-template-columns:minmax(0,1fr);gap:1rem;
}
[data-vibeui-block="features-017"] [data-part="tile"]{
min-width:0;display:flex;flex-direction:column;
padding:1.5rem;border:1px solid var(--vibeui-features-017-line);border-radius:1.25rem;
background:var(--vibeui-features-017-tile);
}
[data-vibeui-block="features-017"] h3{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="features-017"] [data-part="tile"] p{
margin:0.625rem 0 0;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-features-017-muted);text-wrap:pretty;
}
[data-vibeui-block="features-017"] [data-tile="lead"] h3{font-size:clamp(1.25rem,2.4cqi,1.75rem)}
[data-vibeui-block="features-017"] [data-part="sketch"]{
margin-top:1.5rem;flex:1;display:flex;flex-direction:column;gap:0.625rem;justify-content:flex-end;
min-height:9rem;padding:1rem;border-radius:0.875rem;
background:var(--vibeui-features-017-soft);
}
[data-vibeui-block="features-017"] [data-part="row"]{
display:flex;gap:0.5rem;
}
[data-vibeui-block="features-017"] [data-part="bar"]{
height:0.75rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-features-017-accent) 32%,transparent);
}
[data-vibeui-block="features-017"] [data-part="bar"][data-len="sm"]{width:18%}
[data-vibeui-block="features-017"] [data-part="bar"][data-len="md"]{width:38%}
[data-vibeui-block="features-017"] [data-part="bar"][data-len="lg"]{width:62%}
[data-vibeui-block="features-017"] [data-part="block"]{
flex:1;min-height:3.25rem;border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-features-017-accent) 20%,transparent);
}
[data-vibeui-block="features-017"] [data-part="block"][data-tone="strong"]{
background:color-mix(in oklab,var(--vibeui-features-017-accent) 55%,transparent);
}
[data-vibeui-block="features-017"] [data-tile="metric"]{justify-content:center}
[data-vibeui-block="features-017"] [data-tile="metric"] strong{
display:block;font-size:clamp(2.25rem,5.2cqi,3.25rem);line-height:1;letter-spacing:-0.04em;
font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-features-017-accent);
}
[data-vibeui-block="features-017"] [data-tile="command"]{
border-color:color-mix(in oklab,var(--vibeui-features-017-accent) 35%,var(--vibeui-features-017-line));
background:var(--vibeui-features-017-soft);
}
[data-vibeui-block="features-017"] code{
display:block;margin-top:1rem;padding:0.75rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-features-017-tile);border:1px solid var(--vibeui-features-017-line);
font-family:var(--vibeui-features-017-mono);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-features-017-fg);overflow-x:auto;
}
[data-vibeui-block="features-017"] ul{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="features-017"] li{
display:flex;align-items:flex-start;gap:0.5rem;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="features-017"] [data-part="tick"]{flex:0 0 auto;margin-top:0.1875rem;color:var(--vibeui-features-017-accent)}
[data-vibeui-block="features-017"] [data-part="glyph"]{
display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;margin-bottom:0.875rem;
border-radius:0.75rem;background:var(--vibeui-features-017-soft);color:var(--vibeui-features-017-accent);
}
@container (min-width: 40rem){
[data-vibeui-block="features-017"] [data-part="frame"]{padding:5rem 2rem}
[data-vibeui-block="features-017"] [data-part="head"]{margin-bottom:2.5rem}
[data-vibeui-block="features-017"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="features-017"] [data-tile="lead"]{grid-column:span 2}
[data-vibeui-block="features-017"] [data-part="tile"]{padding:1.75rem}
}
@container (min-width: 64rem){
[data-vibeui-block="features-017"] [data-part="frame"]{padding:6rem 3rem}
[data-vibeui-block="features-017"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="features-017"] [data-tile="lead"]{grid-column:span 2;grid-row:span 2}
[data-vibeui-block="features-017"] [data-part="tile"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHECKS = [
  "Один файл на секцию",
  "Своя палитра внутри блока",
  "Раскладка от ширины блока",
]

/** Bento-сетка возможностей: крупная плитка с главной мыслью и четыре мелкие. */
export function Features017({
  eyebrow = "Как это устроено",
  title = "Библиотека, из которой страница собирается за вечер",
  lede = "Каждая плитка — отдельный ответ на вопрос «а что я получу». Размер плитки показывает, что здесь главное.",
  leadTitle = "Готовые секции вместо вёрстки с нуля",
  leadText = "Первый экран, возможности, тарифы, отзывы и подвал уже собраны и согласованы между собой. Вы выбираете композицию, а не рисуете её заново под каждый проект.",
  metricValue = "1 657",
  metricLabel = "секций и компонентов в каталоге",
  commandTitle = "Ставится одной командой",
  command = "npx shadcn@latest add features-017",
  commandNote = "Файл остаётся в вашем репозитории.",
  checksTitle = "Что внутри",
  checks = DEFAULT_CHECKS,
  aiTitle = "Инструкция для агента",
  aiText = "Агент получает список того, что нельзя ломать, и не пересобирает секцию по-своему.",
  accent,
  className,
  style,
}: Features017Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-017"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <div data-part="grid">
            <article data-part="tile" data-tile="lead">
              <h3>{leadTitle}</h3>
              <p>{leadText}</p>

              <div data-part="sketch" aria-hidden="true">
                <div data-part="row">
                  <span data-part="bar" data-len="md" />
                  <span data-part="bar" data-len="sm" />
                </div>
                <div data-part="row">
                  <span data-part="block" data-tone="strong" />
                  <span data-part="block" />
                  <span data-part="block" />
                </div>
                <div data-part="row">
                  <span data-part="bar" data-len="lg" />
                </div>
              </div>
            </article>

            <article data-part="tile" data-tile="metric">
              <strong>{metricValue}</strong>
              <p>{metricLabel}</p>
            </article>

            <article data-part="tile" data-tile="command">
              <h3>{commandTitle}</h3>
              <code>{command}</code>
              <p>{commandNote}</p>
            </article>

            <article data-part="tile" data-tile="checks">
              <h3>{checksTitle}</h3>
              <ul>
                {checks.slice(0, 4).map((check) => (
                  <li key={check}>
                    <span data-part="tick" aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        width="12"
                        height="12"
                        fill="none"
                      >
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {check}
                  </li>
                ))}
              </ul>
            </article>

            <article data-part="tile" data-tile="ai">
              <span data-part="glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M12 3.5 13.7 8.3 18.5 10 13.7 11.7 12 16.5 10.3 11.7 5.5 10 10.3 8.3zM18 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3>{aiTitle}</h3>
              <p>{aiText}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
