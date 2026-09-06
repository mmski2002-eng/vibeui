"use client"

import { useState, type CSSProperties } from "react"

type Portfolio002Work = {
  title: string
  client: string
  tag: string
}

export type Portfolio002Props = {
  eyebrow?: string
  title?: string
  works?: Portfolio002Work[]
  allLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Портфолио с фильтром по тегу: чипы направлений над сеткой карточек.
// Фильтр клиентский, набор чипов выводится из данных, активный объявлен
// через aria-pressed. Карточка — обложка-градиент плюс подпись клиента и
// названия работы. Формат галереи работ с разбивкой по типу проекта.
const STYLES = `
:where([data-vibeui-block="portfolio-002"]){
--vibeui-portfolio-002-bg:transparent;
--vibeui-portfolio-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-002-chip:light-dark(oklch(0.97 0 0),oklch(0.24 0 0));
--vibeui-portfolio-002-card:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-portfolio-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-portfolio-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-portfolio-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-002"]{color-scheme:dark}
[data-vibeui-block="portfolio-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-portfolio-002-bg);color:var(--vibeui-portfolio-002-ink);
font-family:var(--vibeui-portfolio-002-font);
}
[data-vibeui-block="portfolio-002"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-portfolio-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="portfolio-002"] [data-part="title"]{margin:0 0 1.5rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="portfolio-002"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.75rem}
[data-vibeui-block="portfolio-002"] [data-part="chip"]{
appearance:none;cursor:pointer;border:1px solid var(--vibeui-portfolio-002-border);
background:var(--vibeui-portfolio-002-chip);color:inherit;
padding:0.375rem 0.875rem;border-radius:999px;font:inherit;font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="portfolio-002"] [data-part="chip"]:hover{border-color:var(--vibeui-portfolio-002-accent)}
[data-vibeui-block="portfolio-002"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-portfolio-002-accent);color:var(--vibeui-portfolio-002-on-accent);border-color:transparent}
[data-vibeui-block="portfolio-002"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-portfolio-002-accent);outline-offset:2px}
[data-vibeui-block="portfolio-002"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="portfolio-002"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;overflow:hidden;text-decoration:none;color:inherit;
border:1px solid var(--vibeui-portfolio-002-border);border-radius:1rem;background:var(--vibeui-portfolio-002-card);
transition:transform .18s ease,border-color .18s ease;
}
[data-vibeui-block="portfolio-002"] [data-part="card"]:hover{transform:translateY(-3px);border-color:var(--vibeui-portfolio-002-accent)}
[data-vibeui-block="portfolio-002"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-portfolio-002-accent);outline-offset:2px}
[data-vibeui-block="portfolio-002"] [data-part="card"][hidden]{display:none}
[data-vibeui-block="portfolio-002"] [data-part="cover"]{aspect-ratio:3 / 2;background:linear-gradient(150deg,oklch(0.62 0.19 39.8),oklch(0.4 0.14 28))}
[data-vibeui-block="portfolio-002"] [data-part="card"]:nth-child(3n+2) [data-part="cover"]{background:linear-gradient(150deg,oklch(0.58 0.17 55),oklch(0.36 0.12 42))}
[data-vibeui-block="portfolio-002"] [data-part="card"]:nth-child(3n+3) [data-part="cover"]{background:linear-gradient(150deg,oklch(0.5 0.16 25),oklch(0.3 0.1 20))}
[data-vibeui-block="portfolio-002"] [data-part="body"]{padding:1rem 1.125rem}
[data-vibeui-block="portfolio-002"] [data-part="client"]{font-size:0.75rem;font-weight:600;color:var(--vibeui-portfolio-002-accent);letter-spacing:0.02em}
[data-vibeui-block="portfolio-002"] [data-part="work-title"]{margin:0.25rem 0 0;font-size:1rem;font-weight:640;line-height:1.35}
@container (min-width: 40rem){
[data-vibeui-block="portfolio-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="portfolio-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKS: Portfolio002Work[] = [
  { title: "Лендинг платёжного сервиса", client: "Финпилот", tag: "Веб" },
  { title: "Айдентика сети кофеен", client: "Кедр", tag: "Бренд" },
  { title: "Дашборд логистики", client: "Путь", tag: "Продукт" },
  { title: "Промо-сайт запуска лампы", client: "Полдень", tag: "Веб" },
  { title: "Гайдлайн бренда", client: "Штурм", tag: "Бренд" },
  { title: "Приложение доставки", client: "Рано", tag: "Продукт" },
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

/** Портфолио с клиентским фильтром по тегу проекта. */
export function Portfolio002({
  eyebrow = "Портфолио",
  title = "Работы по направлениям",
  works = DEFAULT_WORKS,
  allLabel = "Все",
  background = "",
  accent,
  className,
  style,
}: Portfolio002Props) {
  const tags = Array.from(new Set(works.map((work) => work.tag)))
  const [active, setActive] = useState<string | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-portfolio-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="filters" role="group" aria-label="Фильтр по направлению">
            <button
              type="button"
              data-part="chip"
              aria-pressed={active === null}
              onClick={() => setActive(null)}
            >
              {allLabel}
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                data-part="chip"
                aria-pressed={active === tag}
                onClick={() => setActive(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div data-part="grid">
            {works.map((work) => (
              <a
                key={work.title}
                href="#"
                data-part="card"
                hidden={active !== null && work.tag !== active}
              >
                <span data-part="cover" aria-hidden="true" />
                <span data-part="body">
                  <span data-part="client">{work.client}</span>
                  <span data-part="work-title">{work.title}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
