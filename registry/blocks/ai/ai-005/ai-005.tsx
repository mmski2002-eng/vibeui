import type { CSSProperties } from "react"

export type Ai005Source = {
  index: number
  title: string
  site: string
  quote: string
  href?: string
}

export type Ai005Props = {
  title?: string
  question?: string
  paragraphs?: string[]
  sources?: Ai005Source[]
  sourcesTitle?: string
  disclaimer?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: ответ, за который можно спросить «откуда». Номера сносок стоят
// прямо в абзаце и оформлены как <sup><a>: клик уводит к карточке источника,
// а скринридер читает ссылку «источник 1» из aria-label, а не голую цифру.
// Каждый источник несёт не только заголовок и домен, но и цитату — именно
// тот фрагмент, на который опирался ответ; без цитаты проверка сводится к
// «откройте и поищите сами». Раскладка источников в две колонки включается
// от собственной ширины блока.
const STYLES = `
:where([data-vibeui-block="ai-005"]){
--vibeui-ai-005-bg:oklch(1 0 0);
--vibeui-ai-005-soft:oklch(0.975 0.004 265);
--vibeui-ai-005-fg:oklch(0.22 0.014 265);
--vibeui-ai-005-muted:oklch(0.53 0.014 265);
--vibeui-ai-005-border:oklch(0.91 0.006 265);
--vibeui-ai-005-accent:oklch(0.52 0.16 232);
--vibeui-ai-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-005"]{
background:var(--vibeui-ai-005-bg);color:var(--vibeui-ai-005-fg);
font-family:var(--vibeui-ai-005-sans);
border:1px solid var(--vibeui-ai-005-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-005"] *{box-sizing:border-box}
[data-vibeui-block="ai-005"] [data-part="shell"]{padding:1.25rem 1.25rem 1.375rem;display:grid;gap:1rem}
[data-vibeui-block="ai-005"] [data-part="head"]{display:flex;align-items:flex-start;gap:0.625rem}
[data-vibeui-block="ai-005"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.625rem;
background:var(--vibeui-ai-005-accent);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="ai-005"] h2{margin:0;font-size:0.875rem;font-weight:680}
[data-vibeui-block="ai-005"] [data-part="question"]{
margin:0.125rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-ai-005-muted);
}
[data-vibeui-block="ai-005"] [data-part="answer"] p{
margin:0 0 0.625rem;max-width:70ch;font-size:0.9375rem;line-height:1.7;
}
[data-vibeui-block="ai-005"] [data-part="answer"] p:last-child{margin-bottom:0}
/* Сноска в тексте: маленькая, но с полноценной областью нажатия. */
[data-vibeui-block="ai-005"] sup a{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.0625rem;height:1.0625rem;margin-left:0.125rem;padding:0 0.1875rem;
border-radius:0.3125rem;text-decoration:none;
background:color-mix(in oklab,var(--vibeui-ai-005-accent) 14%,transparent);
color:var(--vibeui-ai-005-accent);
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="ai-005"] sup a:hover{background:color-mix(in oklab,var(--vibeui-ai-005-accent) 26%,transparent)}
[data-vibeui-block="ai-005"] h3{
margin:0 0 0.625rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-005-muted);
}
[data-vibeui-block="ai-005"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="ai-005"] li{
display:grid;grid-template-columns:1.25rem 1fr;gap:0.5rem;
padding:0.6875rem 0.8125rem;border-radius:0.875rem;
border:1px solid var(--vibeui-ai-005-border);background:var(--vibeui-ai-005-soft);
scroll-margin-top:1rem;
}
[data-vibeui-block="ai-005"] li:target{border-color:var(--vibeui-ai-005-accent)}
[data-vibeui-block="ai-005"] [data-part="num"]{
font-size:0.6875rem;font-weight:700;color:var(--vibeui-ai-005-accent);line-height:1.5;
}
[data-vibeui-block="ai-005"] [data-part="src-title"]{margin:0;font-size:0.8125rem;font-weight:620;line-height:1.4}
[data-vibeui-block="ai-005"] [data-part="src-title"] a{color:inherit;text-decoration:none}
[data-vibeui-block="ai-005"] [data-part="src-title"] a:hover{text-decoration:underline}
[data-vibeui-block="ai-005"] [data-part="site"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-ai-005-muted);
}
/* Цитата — тот самый фрагмент: без неё проверка сводится к «поищите сами». */
[data-vibeui-block="ai-005"] blockquote{
margin:0.4375rem 0 0;padding-left:0.5625rem;
border-left:2px solid var(--vibeui-ai-005-border);
font-size:0.75rem;line-height:1.55;color:var(--vibeui-ai-005-muted);
}
[data-vibeui-block="ai-005"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-ai-005-muted);
}
[data-vibeui-block="ai-005"] a:focus-visible,
[data-vibeui-block="ai-005"] :focus-visible{outline:2px solid var(--vibeui-ai-005-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="ai-005"] [data-part="shell"]{padding:1.5rem 1.75rem 1.75rem}
[data-vibeui-block="ai-005"] ol{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARAGRAPHS = [
  "Container queries считают раскладку от ширины родителя, а не окна, поэтому один и тот же блок в узкой колонке каталога и на широкой странице выглядит по-разному без единой медиазапроса[1].",
  "Поддержка в браузерах полная с 2023 года, отдельного полифила для продакшена уже не нужно[2]. Для контейнера обязательно объявить container-type: inline-size, иначе запрос молча не сработает[3].",
]

const DEFAULT_SOURCES: Ai005Source[] = [
  {
    index: 1,
    title: "CSS Container Queries — MDN",
    site: "developer.mozilla.org",
    quote:
      "Контейнерные запросы позволяют применять стили в зависимости от размера ближайшего предка-контейнера.",
  },
  {
    index: 2,
    title: "Container queries — Baseline 2023",
    site: "web.dev",
    quote:
      "Возможность доступна во всех основных браузерах и входит в Baseline с февраля 2023 года.",
  },
  {
    index: 3,
    title: "Спецификация CSS Containment Module Level 3",
    site: "w3.org",
    quote:
      "Элемент становится контейнером запроса только после объявления container-type со значением inline-size или size.",
  },
]

/**
 * Ответ ассистента со сносками и карточками источников с цитатами.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai005({
  title = "Ответ с источниками",
  question = "Чем container queries отличаются от медиазапросов?",
  paragraphs = DEFAULT_PARAGRAPHS,
  sources = DEFAULT_SOURCES,
  sourcesTitle = "Источники",
  disclaimer = "Ответ собран по трём страницам. Проверьте цитаты перед публикацией.",
  accent,
  className,
  style,
}: Ai005Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const withFootnotes = (text: string) =>
    text.split(/(\[\d+\])/g).map((piece, position) => {
      const match = piece.match(/^\[(\d+)\]$/)
      if (!match) return piece
      return (
        <sup key={`${position}-${piece}`}>
          <a
            href={`#ai-005-source-${match[1]}`}
            aria-label={`Источник ${match[1]}`}
          >
            {match[1]}
          </a>
        </sup>
      )
    })

  return (
    <>
      <style href="vibeui-ai-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <span data-part="mark" aria-hidden="true">
              AI
            </span>
            <div>
              <h2>{title}</h2>
              <p data-part="question">{question}</p>
            </div>
          </header>

          <div data-part="answer">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{withFootnotes(paragraph)}</p>
            ))}
          </div>

          <div>
            <h3>{sourcesTitle}</h3>
            <ol>
              {sources.map((source) => (
                <li key={source.index} id={`ai-005-source-${source.index}`}>
                  <span data-part="num" aria-hidden="true">
                    {source.index}
                  </span>
                  <div>
                    <p data-part="src-title">
                      {source.href ? (
                        <a href={source.href}>{source.title}</a>
                      ) : (
                        source.title
                      )}
                      <span data-part="site">{source.site}</span>
                    </p>
                    <blockquote>{source.quote}</blockquote>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p data-part="note">{disclaimer}</p>
        </div>
      </section>
    </>
  )
}
