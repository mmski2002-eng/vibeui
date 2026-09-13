import type { CSSProperties } from "react"

type Portfolio006Work = {
  title: string
  kind: string
  href?: string
  image?: string
}

export type Portfolio006Props = {
  eyebrow?: string
  title?: string
  /** Главная работа: занимает крупную плитку слева. */
  feature?: Portfolio006Work & { summary?: string }
  /** Остальные работы: мелкие плитки рядом. */
  works?: Portfolio006Work[]
  moreLabel?: string
  moreHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна главная работа крупно и три мелких рядом. Формат для портфолио, где
// есть очевидный флагман: равная сетка уравнивает его с проходными работами,
// а здесь иерархия задана размером плитки.
//
// Соотношение сторон у плиток фиксировано, поэтому сетка не рассыпается от
// разной высоты картинок, а без картинки плитка показывает градиентную
// заглушку — блок обязан выглядеть законченным на пустом проекте.
const STYLES = `
:where([data-vibeui-block="portfolio-006"]){
--vibeui-portfolio-006-bg:transparent;
--vibeui-portfolio-006-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-006-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-006-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-006-card:light-dark(oklch(0.97 0 0),oklch(0.2 0 0));
--vibeui-portfolio-006-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-portfolio-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-portfolio-006-dur-4:340ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-006"]{color-scheme:dark}
[data-vibeui-block="portfolio-006"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-portfolio-006-bg);color:var(--vibeui-portfolio-006-ink);
font-family:var(--vibeui-portfolio-006-font);
}
[data-vibeui-block="portfolio-006"] [data-part="shell"]{max-width:68rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-006"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:2rem}
[data-vibeui-block="portfolio-006"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-portfolio-006-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="portfolio-006"] [data-part="title"]{margin:0;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:20ch}
[data-vibeui-block="portfolio-006"] [data-part="more"]{
color:var(--vibeui-portfolio-006-ink);font-size:0.9375rem;font-weight:600;text-decoration:none;
border-bottom:2px solid var(--vibeui-portfolio-006-accent);padding-bottom:0.125rem;
}
[data-vibeui-block="portfolio-006"] [data-part="more"]:hover{color:var(--vibeui-portfolio-006-accent)}
[data-vibeui-block="portfolio-006"] [data-part="grid"]{list-style:none;margin:0;padding:0;display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="portfolio-006"] [data-part="tile"]{min-inline-size:0}
[data-vibeui-block="portfolio-006"] [data-part="link"]{
display:flex;flex-direction:column;gap:0.75rem;height:100%;
color:inherit;text-decoration:none;border-radius:1rem;
}
[data-vibeui-block="portfolio-006"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-portfolio-006-accent);outline-offset:4px}
[data-vibeui-block="portfolio-006"] [data-part="frame"]{
position:relative;overflow:hidden;border-radius:1rem;aspect-ratio:4/3;
border:1px solid var(--vibeui-portfolio-006-border);background:var(--vibeui-portfolio-006-card);
}
[data-vibeui-block="portfolio-006"] [data-part="tile"][data-feature="true"] [data-part="frame"]{aspect-ratio:4/3}
[data-vibeui-block="portfolio-006"] [data-part="frame"] img{display:block;width:100%;height:100%;object-fit:cover;transition:transform var(--vibeui-portfolio-006-dur-4) ease}
[data-vibeui-block="portfolio-006"] [data-part="link"]:hover [data-part="frame"] img{transform:scale(1.03)}
/* Заглушка обложки: работа без картинки не должна оставлять дыру. */
[data-vibeui-block="portfolio-006"] [data-part="frame"][data-empty="true"]::after{
content:"";position:absolute;inset:0;
background:
  radial-gradient(110% 85% at 20% 20%, color-mix(in oklab, var(--vibeui-portfolio-006-accent) 42%, transparent), transparent 62%),
  radial-gradient(95% 75% at 80% 85%, color-mix(in oklab, var(--vibeui-portfolio-006-accent) 20%, transparent), transparent 68%);
}
[data-vibeui-block="portfolio-006"] [data-part="caption"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem}
[data-vibeui-block="portfolio-006"] [data-part="name"]{margin:0;font-size:1.0625rem;font-weight:600;line-height:1.3}
[data-vibeui-block="portfolio-006"] [data-part="tile"][data-feature="true"] [data-part="name"]{font-size:clamp(1.25rem,3cqi,1.5rem)}
[data-vibeui-block="portfolio-006"] [data-part="kind"]{color:var(--vibeui-portfolio-006-muted);font-size:0.8125rem}
[data-vibeui-block="portfolio-006"] [data-part="summary"]{margin:0;max-width:46ch;color:var(--vibeui-portfolio-006-muted);font-size:0.9375rem;line-height:1.55}
@container (min-width: 46rem){
[data-vibeui-block="portfolio-006"] [data-part="shell"]{padding:4rem 2rem}
/* Главная работа занимает две колонки и три строки — ровно столько,
   сколько занимают три мелкие плитки в правой колонке. Иначе третья
   мелкая работа уезжает под главную и ломает симметрию. */
[data-vibeui-block="portfolio-006"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="portfolio-006"] [data-part="tile"][data-feature="true"]{grid-column:span 2;grid-row:span 3}
[data-vibeui-block="portfolio-006"] [data-part="tile"]:not([data-feature="true"]) [data-part="frame"]{aspect-ratio:16/10}
[data-vibeui-block="portfolio-006"] [data-part="tile"][data-feature="true"] [data-part="frame"]{aspect-ratio:auto;height:100%;min-height:20rem}
[data-vibeui-block="portfolio-006"] [data-part="tile"][data-feature="true"] [data-part="link"]{height:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FEATURE = {
  title: "Личный кабинет для малого бизнеса",
  kind: "Продукт · 2025",
  summary:
    "Платежи, счета и налоги в одном месте. Триста экранов на общей сетке, путь до перевода вдвое короче.",
}

const DEFAULT_WORKS: Portfolio006Work[] = [
  { title: "Сайт сети кофеен", kind: "Сайт · 2025" },
  { title: "Панель логистики", kind: "Интерфейс · 2024" },
  { title: "Айдентика фермы", kind: "Бренд · 2024" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Одна главная работа крупной плиткой и три мелких рядом. */
export function Portfolio006({
  eyebrow = "Портфолио",
  title = "Работы",
  feature = DEFAULT_FEATURE,
  works = DEFAULT_WORKS,
  moreLabel = "Все работы",
  moreHref = "#",
  background = "",
  accent,
  className,
  style,
}: Portfolio006Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <div>
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
            </div>
            {moreLabel ? (
              <a data-part="more" href={moreHref}>
                {moreLabel}
              </a>
            ) : null}
          </div>

          <ul data-part="grid">
            {feature ? (
              <li data-part="tile" data-feature="true">
                <a data-part="link" href={feature.href ?? "#"}>
                  <div
                    data-part="frame"
                    data-empty={feature.image ? undefined : "true"}
                  >
                    {feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div data-part="caption">
                    <h3 data-part="name">{feature.title}</h3>
                    <span data-part="kind">{feature.kind}</span>
                  </div>
                  {feature.summary ? (
                    <p data-part="summary">{feature.summary}</p>
                  ) : null}
                </a>
              </li>
            ) : null}

            {works.map((work) => (
              <li key={work.title} data-part="tile">
                <a data-part="link" href={work.href ?? "#"}>
                  <div
                    data-part="frame"
                    data-empty={work.image ? undefined : "true"}
                  >
                    {work.image ? (
                      <img src={work.image} alt={work.title} loading="lazy" />
                    ) : null}
                  </div>
                  <div data-part="caption">
                    <h3 data-part="name">{work.title}</h3>
                    <span data-part="kind">{work.kind}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
