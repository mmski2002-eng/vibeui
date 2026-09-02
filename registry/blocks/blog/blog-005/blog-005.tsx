"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Blog005Entry = {
  title: string
  excerpt: string
  topic: string
  date: string
  readingTime: string
  href?: string
}

export type Blog005Props = {
  eyebrow?: string
  title?: string
  allLabel?: string
  entries?: Blog005Entry[]
  emptyLabel?: string
  /** Подпись списка для скринридера: {count} — число видимых записей. */
  countLabel?: string
  /** Подпись группы кнопок-фильтров для скринридера. */
  filtersLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: лента строками, а не плитками. Когда статей много, плитка
// врёт про объём — на экран влезает шесть карточек, и кажется, что архив
// маленький. Строка занимает мало места, показывает дату, рубрику и время
// чтения и позволяет пробежать двадцать заголовков глазами.
//
// Рубрики собираются из самих статей, а не задаются отдельным списком:
// рассинхрон «фильтр есть, статей нет» невозможен по построению. Счётчик
// у каждой рубрики честный — он считает те же записи, что покажет фильтр.
// Список объявлен aria-live="polite": после смены рубрики озвучивается,
// сколько записей осталось, иначе смена фильтра проходит незамеченной.
const STYLES = `
:where([data-vibeui-block="blog-005"]){
--vibeui-blog-005-bg:transparent;
--vibeui-blog-005-soft:light-dark(oklch(0.975 0.004 265),oklch(0.26 0.012 265));
--vibeui-blog-005-fg:light-dark(oklch(0.2 0.014 265),oklch(0.95 0.005 265));
--vibeui-blog-005-muted:light-dark(oklch(0.52 0.014 265),oklch(0.72 0.012 265));
--vibeui-blog-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-blog-005-accent:light-dark(oklch(0.5 0.17 240),oklch(0.76 0.13 240));
--vibeui-blog-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="blog-005"]{
background:var(--vibeui-blog-005-bg);color:var(--vibeui-blog-005-fg);
font-family:var(--vibeui-blog-005-sans);
}
[data-vibeui-block="blog-005"] *{box-sizing:border-box}
[data-vibeui-block="blog-005"] [data-part="frame"]{
max-width:64rem;margin:0 auto;padding:2.75rem 1.25rem;display:grid;gap:1.25rem;
}
[data-vibeui-block="blog-005"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-blog-005-accent);
}
[data-vibeui-block="blog-005"] h2{
margin:0.4375rem 0 0;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.25rem);line-height:1.14;
}
[data-vibeui-block="blog-005"] [data-part="filters"]{
display:flex;flex-wrap:wrap;gap:0.375rem;padding-bottom:0.25rem;
}
[data-vibeui-block="blog-005"] [data-part="chip"]{
appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.4375rem;
height:2.125rem;padding:0 0.8125rem;border-radius:9999px;
border:1px solid var(--vibeui-blog-005-border);background:var(--vibeui-blog-005-soft);
color:var(--vibeui-blog-005-muted);font:inherit;font-size:0.8125rem;font-weight:620;
transition:color .14s ease,border-color .14s ease;
}
[data-vibeui-block="blog-005"] [data-part="chip"][aria-pressed="true"]{
color:var(--vibeui-blog-005-accent);border-color:var(--vibeui-blog-005-accent);
background:color-mix(in oklab,var(--vibeui-blog-005-accent) 10%,transparent);
}
/* Счётчик считает те же записи, что покажет фильтр: рассинхрон невозможен. */
[data-vibeui-block="blog-005"] [data-part="count"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;opacity:.75;
}
[data-vibeui-block="blog-005"] ul{list-style:none;margin:0;padding:0;display:grid}
[data-vibeui-block="blog-005"] li{border-top:1px solid var(--vibeui-blog-005-border)}
[data-vibeui-block="blog-005"] li:last-child{border-bottom:1px solid var(--vibeui-blog-005-border)}
[data-vibeui-block="blog-005"] article{
display:grid;gap:0.3125rem;padding:0.9375rem 0.25rem;position:relative;
transition:background-color .14s ease;
}
[data-vibeui-block="blog-005"] article:hover{background:var(--vibeui-blog-005-soft)}
[data-vibeui-block="blog-005"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-blog-005-muted);
}
[data-vibeui-block="blog-005"] [data-part="topic"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-blog-005-accent) 10%,transparent);
color:var(--vibeui-blog-005-accent);font-weight:640;
}
[data-vibeui-block="blog-005"] time{font-variant-numeric:tabular-nums}
[data-vibeui-block="blog-005"] [data-part="dot"]{opacity:.5}
[data-vibeui-block="blog-005"] h3{margin:0;font-size:1.0625rem;line-height:1.35;font-weight:640;letter-spacing:-0.01em}
[data-vibeui-block="blog-005"] h3 a{color:inherit;text-decoration:none}
[data-vibeui-block="blog-005"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="blog-005"] h3 a:focus-visible{outline:none}
[data-vibeui-block="blog-005"] article:focus-within{outline:2px solid var(--vibeui-blog-005-accent);outline-offset:-2px}
[data-vibeui-block="blog-005"] [data-part="excerpt"]{
margin:0;max-width:70ch;font-size:0.875rem;line-height:1.6;color:var(--vibeui-blog-005-muted);
}
[data-vibeui-block="blog-005"] [data-part="empty"]{
margin:0;padding:2rem 1rem;text-align:center;
border:1px dashed var(--vibeui-blog-005-border);border-radius:1rem;
font-size:0.9375rem;color:var(--vibeui-blog-005-muted);
}
[data-vibeui-block="blog-005"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-blog-005-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="blog-005"] [data-part="frame"]{padding:3.5rem 2rem}
[data-vibeui-block="blog-005"] article{grid-template-columns:9rem 1fr;column-gap:1.5rem;padding:1.125rem 0.5rem}
[data-vibeui-block="blog-005"] [data-part="row"]{flex-direction:column;gap:0.25rem;align-items:flex-start;grid-row:1 / span 2}
[data-vibeui-block="blog-005"] [data-part="dot"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Blog005Entry[] = [
  {
    title: "Контейнерные запросы вместо брейкпоинтов",
    excerpt:
      "Компонент должен знать свою ширину, а не ширину окна. Что это меняет в карточках и куда девать старые медиазапросы.",
    topic: "Вёрстка",
    date: "4 марта 2025",
    readingTime: "11 мин",
  },
  {
    title: "Почему мы отказались от библиотеки иконок",
    excerpt:
      "Двести килобайт ради восьми иконок. Как перешли на инлайновые SVG и что при этом сломалось.",
    topic: "Разработка",
    date: "12 марта 2025",
    readingTime: "7 мин",
  },
  {
    title: "Форма, которую заполняют до конца",
    excerpt:
      "Семь полей вместо восемнадцати и ни одной звёздочки. Что поменяли в заявке и как это отразилось на отказах.",
    topic: "Продукт",
    date: "26 февраля 2025",
    readingTime: "6 мин",
  },
  {
    title: "Фокус, который видно",
    excerpt:
      "Убрали outline — потеряли клавиатуру. Разбор одного правила CSS, из-за которого сайт стал непроходим без мыши.",
    topic: "Доступность",
    date: "19 февраля 2025",
    readingTime: "5 мин",
  },
  {
    title: "Тёмная тема без второго набора цветов",
    excerpt:
      "Как свести палитру к десяти переменным и не поддерживать две темы вручную.",
    topic: "Вёрстка",
    date: "11 февраля 2025",
    readingTime: "9 мин",
  },
  {
    title: "Мы перестали писать сторибуки",
    excerpt:
      "И что поставили вместо них: живые превью прямо в каталоге компонентов.",
    topic: "Разработка",
    date: "3 февраля 2025",
    readingTime: "8 мин",
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

/**
 * Лента статей строками с фильтром по рубрикам и честными счётчиками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Blog005({
  eyebrow = "Архив",
  title = "Все статьи по рубрикам",
  allLabel = "Все",
  entries = DEFAULT_ENTRIES,
  emptyLabel = "В этой рубрике пока пусто. Загляните в соседнюю.",
  countLabel = "{count} статей",
  filtersLabel = "Рубрики",
  background = "",
  accent,
  className,
  style,
}: Blog005Props) {
  const [topic, setTopic] = useState(allLabel)

  const palette = {
    ...(accent ? { "--vibeui-blog-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const topics = [allLabel, ...new Set(entries.map((entry) => entry.topic))]
  const countOf = (name: string) =>
    name === allLabel
      ? entries.length
      : entries.filter((entry) => entry.topic === name).length
  const visible =
    topic === allLabel
      ? entries
      : entries.filter((entry) => entry.topic === topic)

  return (
    <>
      <style href="vibeui-blog-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </header>

          <div data-part="filters" role="group" aria-label={filtersLabel}>
            {topics.map((name) => (
              <button
                key={name}
                type="button"
                data-part="chip"
                aria-pressed={name === topic}
                onClick={() => setTopic(name)}
              >
                {name}
                <span data-part="count">{countOf(name)}</span>
              </button>
            ))}
          </div>

          <div aria-live="polite">
            {visible.length === 0 ? (
              <p data-part="empty">{emptyLabel}</p>
            ) : (
              <ul
                aria-label={countLabel.replace(
                  "{count}",
                  String(visible.length),
                )}
              >
                {visible.map((entry) => (
                  <li key={entry.title}>
                    <article>
                      <p data-part="row">
                        <span data-part="topic">{entry.topic}</span>
                        <time>{entry.date}</time>
                        <span data-part="dot">·</span>
                        <span>{entry.readingTime}</span>
                      </p>
                      <h3>
                        <a href={entry.href ?? "#"}>{entry.title}</a>
                      </h3>
                      <p data-part="excerpt">{entry.excerpt}</p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
