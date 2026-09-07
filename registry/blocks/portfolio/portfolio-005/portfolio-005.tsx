import type { CSSProperties } from "react"

type Portfolio005Row = {
  title: string
  kind: string
  client?: string
  year?: string
  href?: string
}

export type Portfolio005Props = {
  eyebrow?: string
  title?: string
  lead?: string
  rows?: Portfolio005Row[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Список работ строками: год, клиент, название, тип. Формат редакторского
// портфолио — когда работ много и важнее охват, а не картинки: тридцать
// строк читаются за десять секунд, тридцать плиток не читаются вовсе.
//
// Вся строка — ссылка, поэтому цель нажатия во всю ширину, а не в размер
// названия. Разделители — границы соседних строк, чтобы у первой и
// последней не висело лишней линии.
const STYLES = `
:where([data-vibeui-block="portfolio-005"]){
--vibeui-portfolio-005-bg:transparent;
--vibeui-portfolio-005-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-005-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-005-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-005-hover:light-dark(oklch(0.97 0 0),oklch(0.22 0 0));
--vibeui-portfolio-005-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-portfolio-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-005"]{color-scheme:dark}
[data-vibeui-block="portfolio-005"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-portfolio-005-bg);color:var(--vibeui-portfolio-005-ink);
font-family:var(--vibeui-portfolio-005-font);
}
[data-vibeui-block="portfolio-005"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-005"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-portfolio-005-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="portfolio-005"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:22ch}
[data-vibeui-block="portfolio-005"] [data-part="lead"]{margin:0 0 2rem;max-width:54ch;color:var(--vibeui-portfolio-005-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="portfolio-005"] [data-part="rows"]{list-style:none;margin:0;padding:0;border-top:1px solid var(--vibeui-portfolio-005-border)}
[data-vibeui-block="portfolio-005"] [data-part="row"]{border-bottom:1px solid var(--vibeui-portfolio-005-border)}
[data-vibeui-block="portfolio-005"] [data-part="link"]{
display:grid;gap:0.25rem 1.5rem;align-items:baseline;
grid-template-columns:minmax(0,1fr) auto;
padding:1rem 0.75rem;margin:0 -0.75rem;border-radius:0.75rem;
color:inherit;text-decoration:none;transition:background-color .18s ease,color .18s ease;
}
[data-vibeui-block="portfolio-005"] [data-part="link"]:hover,
[data-vibeui-block="portfolio-005"] [data-part="link"]:focus-visible{background:var(--vibeui-portfolio-005-hover)}
[data-vibeui-block="portfolio-005"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-portfolio-005-accent);outline-offset:2px}
[data-vibeui-block="portfolio-005"] [data-part="name"]{min-inline-size:0;font-size:clamp(1.0625rem,2.6cqi,1.375rem);font-weight:600;line-height:1.3}
[data-vibeui-block="portfolio-005"] [data-part="link"]:hover [data-part="name"]{color:var(--vibeui-portfolio-005-accent)}
[data-vibeui-block="portfolio-005"] [data-part="meta"]{
grid-column:1;display:flex;flex-wrap:wrap;gap:0.5rem;
color:var(--vibeui-portfolio-005-muted);font-size:0.875rem;
}
[data-vibeui-block="portfolio-005"] [data-part="dot"]{color:var(--vibeui-portfolio-005-border)}
[data-vibeui-block="portfolio-005"] [data-part="year"]{
grid-column:2;grid-row:1;color:var(--vibeui-portfolio-005-muted);
font-size:0.875rem;font-variant-numeric:tabular-nums;
}
@container (min-width: 44rem){
[data-vibeui-block="portfolio-005"] [data-part="shell"]{padding:4rem 2rem}
/* На широкой строке метаданные встают в свою колонку рядом с названием,
   а не под ним: список читается таблицей, ради чего он и нужен. */
[data-vibeui-block="portfolio-005"] [data-part="link"]{grid-template-columns:minmax(0,1fr) minmax(0,14rem) 4rem;padding:1.125rem 0.75rem}
[data-vibeui-block="portfolio-005"] [data-part="meta"]{grid-column:2;grid-row:1}
[data-vibeui-block="portfolio-005"] [data-part="year"]{grid-column:3;text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Portfolio005Row[] = [
  {
    title: "Личный кабинет для малого бизнеса",
    kind: "Продукт",
    client: "Северный банк",
    year: "2025",
  },
  {
    title: "Сайт сети кофеен и предзаказ",
    kind: "Сайт",
    client: "Полка",
    year: "2025",
  },
  {
    title: "Панель курьерской логистики",
    kind: "Интерфейс",
    client: "Сервис доставки",
    year: "2024",
  },
  {
    title: "Айдентика и упаковка",
    kind: "Бренд",
    client: "Ферма «Луг»",
    year: "2024",
  },
  {
    title: "Медиа о городской архитектуре",
    kind: "Издание",
    client: "Собственный проект",
    year: "2023",
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

/** Список работ строками: название, тип, клиент и год. */
export function Portfolio005({
  eyebrow = "Работы",
  title = "Что я делал",
  lead = "Продукты, сайты и айдентика за последние три года. Нажмите строку, чтобы открыть кейс.",
  rows = DEFAULT_ROWS,
  background = "",
  accent,
  className,
  style,
}: Portfolio005Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lead ? <p data-part="lead">{lead}</p> : null}

          <ul data-part="rows">
            {rows.map((row) => (
              <li key={row.title} data-part="row">
                <a data-part="link" href={row.href ?? "#"}>
                  <span data-part="name">{row.title}</span>
                  <span data-part="meta">
                    <span>{row.kind}</span>
                    {row.client ? (
                      <>
                        <span data-part="dot" aria-hidden="true">
                          ·
                        </span>
                        <span>{row.client}</span>
                      </>
                    ) : null}
                  </span>
                  {row.year ? <span data-part="year">{row.year}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
