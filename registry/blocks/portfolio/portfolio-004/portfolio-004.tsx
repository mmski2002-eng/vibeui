import type { CSSProperties } from "react"

type Portfolio004Work = {
  client: string
  title: string
  summary: string
  /** Что получилось: две-три короткие пары «показатель — значение». */
  results?: { label: string; value: string }[]
  year?: string
  href?: string
  /** Картинка обложки. Пусто — градиентная заглушка из акцента. */
  image?: string
}

export type Portfolio004Props = {
  eyebrow?: string
  title?: string
  works?: Portfolio004Work[]
  linkLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Крупные кейсы лентой: обложка и текст идут парой, чередуя стороны. Формат
// для трёх-четырёх главных работ, когда сетка плиток мельчит, а рассказать
// нужно не только «что», но и «с каким результатом».
//
// Зигзаг делается порядком в гриде, а не флоатами: на узкой ширине пары
// складываются в столбик, и обложка всегда оказывается над своим текстом —
// иначе на телефоне картинка одной работы встаёт над описанием соседней.
const STYLES = `
:where([data-vibeui-block="portfolio-004"]){
--vibeui-portfolio-004-bg:transparent;
--vibeui-portfolio-004-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-004-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-004-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-004-card:light-dark(oklch(0.97 0 0),oklch(0.2 0 0));
--vibeui-portfolio-004-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-portfolio-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-004"]{color-scheme:dark}
[data-vibeui-block="portfolio-004"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-portfolio-004-bg);color:var(--vibeui-portfolio-004-ink);
font-family:var(--vibeui-portfolio-004-font);
}
[data-vibeui-block="portfolio-004"] [data-part="shell"]{max-width:68rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-004"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-portfolio-004-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="portfolio-004"] [data-part="title"]{margin:0 0 2.5rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:22ch}
[data-vibeui-block="portfolio-004"] [data-part="works"]{list-style:none;margin:0;padding:0;display:grid;gap:2.5rem}
[data-vibeui-block="portfolio-004"] [data-part="work"]{display:grid;gap:1.25rem;align-items:center;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="portfolio-004"] [data-part="cover"]{
position:relative;min-inline-size:0;aspect-ratio:16/10;overflow:hidden;border-radius:1.25rem;
border:1px solid var(--vibeui-portfolio-004-border);background:var(--vibeui-portfolio-004-card);
}
[data-vibeui-block="portfolio-004"] [data-part="cover"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Заглушка обложки: без картинки блок обязан выглядеть законченным, иначе
   в каталоге и на пустом проекте видна дыра. */
[data-vibeui-block="portfolio-004"] [data-part="cover"][data-empty="true"]::after{
content:"";position:absolute;inset:0;
background:
  radial-gradient(120% 90% at 15% 15%, color-mix(in oklab, var(--vibeui-portfolio-004-accent) 45%, transparent), transparent 60%),
  radial-gradient(90% 80% at 85% 80%, color-mix(in oklab, var(--vibeui-portfolio-004-accent) 22%, transparent), transparent 65%);
}
[data-vibeui-block="portfolio-004"] [data-part="year"]{
position:absolute;left:0.875rem;top:0.875rem;z-index:1;
padding:0.25rem 0.625rem;border-radius:999px;
background:light-dark(oklch(1 0 0 / 88%),oklch(0.16 0 0 / 82%));
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;
}
[data-vibeui-block="portfolio-004"] [data-part="body"]{min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="portfolio-004"] [data-part="client"]{margin:0;color:var(--vibeui-portfolio-004-muted);font-size:0.8125rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}
[data-vibeui-block="portfolio-004"] [data-part="name"]{margin:0;font-size:clamp(1.25rem,3cqi,1.75rem);line-height:1.2;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="portfolio-004"] [data-part="summary"]{margin:0;max-width:52ch;color:var(--vibeui-portfolio-004-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="portfolio-004"] [data-part="results"]{list-style:none;margin:0.25rem 0 0;padding:0;display:flex;flex-wrap:wrap;gap:1.5rem}
[data-vibeui-block="portfolio-004"] [data-part="value"]{display:block;font-size:1.375rem;line-height:1.1;font-weight:700;color:var(--vibeui-portfolio-004-accent)}
[data-vibeui-block="portfolio-004"] [data-part="label"]{display:block;margin-top:0.25rem;color:var(--vibeui-portfolio-004-muted);font-size:0.8125rem}
[data-vibeui-block="portfolio-004"] [data-part="link"]{
align-self:flex-start;margin-top:0.5rem;color:var(--vibeui-portfolio-004-ink);
font-size:0.9375rem;font-weight:600;text-decoration:none;
border-bottom:2px solid var(--vibeui-portfolio-004-accent);padding-bottom:0.125rem;
}
[data-vibeui-block="portfolio-004"] [data-part="link"]:hover{color:var(--vibeui-portfolio-004-accent)}
@container (min-width: 46rem){
[data-vibeui-block="portfolio-004"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="portfolio-004"] [data-part="works"]{gap:3.5rem}
[data-vibeui-block="portfolio-004"] [data-part="work"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5rem}
/* Чередование сторон: у чётных работ обложка уходит вправо. Порядком в
   гриде, а не направлением флекса — тогда в столбике обложка остаётся
   над своим текстом. */
[data-vibeui-block="portfolio-004"] [data-part="work"]:nth-child(even) [data-part="cover"]{order:2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKS: Portfolio004Work[] = [
  {
    client: "Северный банк",
    title: "Личный кабинет для малого бизнеса",
    summary:
      "Собрали кабинет заново: платежи, счета и налоги в одном месте. Перенесли триста экранов на общую сетку и сократили путь до перевода вдвое.",
    results: [
      { value: "×2", label: "быстрее перевод" },
      { value: "38%", label: "меньше обращений" },
    ],
    year: "2025",
  },
  {
    client: "Кофейня «Полка»",
    title: "Сайт сети и предзаказ",
    summary:
      "Один сайт вместо трёх лендингов: карта точек, меню с остатками и предзаказ через телефон. Запустили за шесть недель.",
    results: [
      { value: "6 недель", label: "от брифа до запуска" },
      { value: "1 400", label: "предзаказов в месяц" },
    ],
    year: "2025",
  },
  {
    client: "Сервис доставки",
    title: "Панель курьерской логистики",
    summary:
      "Диспетчерская, где видно каждый заказ и каждого курьера. Таблица на десять тысяч строк, фильтры и карта в одном экране.",
    results: [
      { value: "10 000", label: "строк без лагов" },
      { value: "−22%", label: "холостых поездок" },
    ],
    year: "2024",
  },
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

/** Крупные кейсы лентой: обложка и текст парой, стороны чередуются. */
export function Portfolio004({
  eyebrow = "Избранные работы",
  title = "Три проекта, о которых стоит рассказать",
  works = DEFAULT_WORKS,
  linkLabel = "Смотреть кейс",
  background = "",
  accent,
  className,
  style,
}: Portfolio004Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>

          <ul data-part="works">
            {works.map((work) => (
              <li key={work.title} data-part="work">
                <div
                  data-part="cover"
                  data-empty={work.image ? undefined : "true"}
                >
                  {work.year ? <span data-part="year">{work.year}</span> : null}
                  {work.image ? (
                    <img src={work.image} alt={work.title} loading="lazy" />
                  ) : null}
                </div>

                <div data-part="body">
                  <p data-part="client">{work.client}</p>
                  <h3 data-part="name">{work.title}</h3>
                  <p data-part="summary">{work.summary}</p>

                  {work.results && work.results.length > 0 ? (
                    <ul data-part="results">
                      {work.results.map((result) => (
                        <li key={result.label}>
                          <span data-part="value">{result.value}</span>
                          <span data-part="label">{result.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <a data-part="link" href={work.href ?? "#"}>
                    {linkLabel}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
