import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Portfolio001Work = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  category: string
  span?: "tall" | "wide"
}

export type Portfolio001Props = {
  eyebrow?: string
  title?: string
  works?: Portfolio001Work[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Портфолио masonry-сеткой: плитки работ разной высоты и ширины, обложка —
// тёплый CSS-градиент с номером и подписью. Плитки tall/wide растягиваются
// на две ячейки через grid-row/column. Формат витрины работ студии; вместо
// стоковых фото — брендовые градиентные обложки.
const STYLES = `[data-vibeui-block="portfolio-001"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="portfolio-001"]){
--vibeui-portfolio-001-bg:transparent;
--vibeui-portfolio-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-001-tile-ink:oklch(0.98 0 0);
--vibeui-portfolio-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-portfolio-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-portfolio-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-001"]{color-scheme:dark}
[data-vibeui-block="portfolio-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-portfolio-001-bg);color:var(--vibeui-portfolio-001-ink);
font-family:var(--vibeui-portfolio-001-font);
}
[data-vibeui-block="portfolio-001"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-001"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);grid-auto-rows:12rem}
[data-vibeui-block="portfolio-001"] [data-part="tile"]{
position:relative;display:flex;flex-direction:column;justify-content:flex-end;
padding:1.25rem;border-radius:1rem;overflow:hidden;text-decoration:none;
color:var(--vibeui-portfolio-001-tile-ink);min-inline-size:0;
transition:transform var(--vibeui-portfolio-001-dur-2) ease;
}
[data-vibeui-block="portfolio-001"] [data-part="tile"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="portfolio-001"] [data-part="tile"]:hover{transform:translateY(-3px)}
[data-vibeui-block="portfolio-001"] [data-part="tile"]:focus-visible{outline:2px solid var(--vibeui-portfolio-001-accent);outline-offset:3px}
/* Обложка — тёплый градиент, оттенок сдвигается по индексу через nth-child. */
[data-vibeui-block="portfolio-001"] [data-part="tile"]{background:linear-gradient(150deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.4 0.14 30))}
[data-vibeui-block="portfolio-001"] [data-part="tile"]:nth-child(3n+2){background:linear-gradient(150deg,oklch(0.58 0.17 55),oklch(0.36 0 0))}
[data-vibeui-block="portfolio-001"] [data-part="tile"]:nth-child(3n+3){background:linear-gradient(150deg,oklch(0.5 0.16 25),oklch(0.3 0.1 20))}
[data-vibeui-block="portfolio-001"] [data-part="tile"]::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,oklch(0 0 0 / 45%));}
[data-vibeui-block="portfolio-001"] [data-part="cat"]{position:relative;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;opacity:.9}
[data-vibeui-block="portfolio-001"] [data-part="work-title"]{position:relative;margin:0.25rem 0 0;font-size:1.125rem;font-weight:700;line-height:1.2}
@container (min-width: 40rem){
[data-vibeui-block="portfolio-001"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="portfolio-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="portfolio-001"] [data-part="tile"][data-span="tall"]{grid-row:span 2}
[data-vibeui-block="portfolio-001"] [data-part="tile"][data-span="wide"]{grid-column:span 2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKS: Portfolio001Work[] = [
  { title: "Лендинг для финтех-стартапа", category: "Веб", span: "tall" },
  { title: "Ребрендинг сети кофеен", category: "Айдентика" },
  { title: "Дашборд аналитики", category: "Продукт" },
  { title: "Промо-сайт запуска", category: "Веб", span: "wide" },
  { title: "Упаковка линейки чая", category: "Печать" },
  { title: "Мобильное приложение доставки", category: "Продукт" },
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

/** Портфолио masonry-сеткой: плитки работ с градиентными обложками. */
export function Portfolio001({
  eyebrow = "Портфолио",
  title = "Избранные работы",
  works = DEFAULT_WORKS,
  background = "",
  accent,
  className,
  style,
}: Portfolio001Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <div data-part="grid">
            {works.map((work) => (
              <a
                key={work.title}
                href="#"
                data-part="tile"
                data-empty={work.image ? undefined : "true"}
                data-span={work.span}
              >
                {work.image ? (
                  <img
                    src={work.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <span data-part="cat">{work.category}</span>
                <span data-part="work-title">{work.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
