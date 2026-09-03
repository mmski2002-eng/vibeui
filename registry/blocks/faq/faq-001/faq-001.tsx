import type { CSSProperties } from "react"

type Faq001Item = {
  question: string
  answer: string
}

export type Faq001Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: Faq001Item[]
  /** Ссылка «остались вопросы» под списком. */
  contactLabel?: string
  contactHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: раскладка в две
// колонки включается от ширины блока, а не окна, поэтому миниатюра каталога
// показывает настоящий дизайн.
//
// Раскрытие держат нативные details/summary: ответ доступен поиску по странице
// (браузер раскрывает найденный раздел) и работает до гидратации. Разделы
// независимы намеренно — на странице вопросов люди открывают несколько сразу.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="faq-001"]){
--vibeui-faq-001-bg:transparent;
--vibeui-faq-001-card:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-faq-001-ink:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-faq-001-muted:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-faq-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-faq-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.74 0.15 265));
--vibeui-faq-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-001"]{color-scheme:dark}
[data-vibeui-block="faq-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-faq-001-bg);color:var(--vibeui-faq-001-ink);
font-family:var(--vibeui-faq-001-sans);
}
[data-vibeui-block="faq-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3.5rem 1.5rem;
display:grid;gap:2rem;
}
[data-vibeui-block="faq-001"] [data-part="intro"]{display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="faq-001"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-faq-001-accent);
}
[data-vibeui-block="faq-001"] [data-part="title"]{
margin:0;max-width:18ch;
font-size:clamp(1.625rem,3.6cqi,2.5rem);line-height:1.1;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="faq-001"] [data-part="description"]{
margin:0;max-width:44ch;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-faq-001-muted);
}
[data-vibeui-block="faq-001"] [data-part="list"]{display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="faq-001"] details{
border:1px solid var(--vibeui-faq-001-border);border-radius:0.875rem;
background:var(--vibeui-faq-001-card);
transition:border-color .16s ease;
}
[data-vibeui-block="faq-001"] details[open]{border-color:color-mix(in oklab,var(--vibeui-faq-001-accent) 35%,var(--vibeui-faq-001-border))}
[data-vibeui-block="faq-001"] summary{
display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;
padding:1rem 1.125rem;cursor:pointer;list-style:none;
font-size:1rem;font-weight:560;line-height:1.4;
}
[data-vibeui-block="faq-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-001"] summary:focus-visible{outline:2px solid var(--vibeui-faq-001-accent);outline-offset:-2px;border-radius:0.875rem}
/* Знак «плюс» из двух полос: вертикальная гаснет при раскрытии. */
[data-vibeui-block="faq-001"] [data-part="sign"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;margin-top:0.3125rem;
}
[data-vibeui-block="faq-001"] [data-part="sign"]::before,
[data-vibeui-block="faq-001"] [data-part="sign"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;margin-top:-0.75px;
background:var(--vibeui-faq-001-muted);
transition:transform .18s ease,opacity .18s ease;
}
[data-vibeui-block="faq-001"] [data-part="sign"]::after{transform:rotate(90deg)}
[data-vibeui-block="faq-001"] details[open] [data-part="sign"]::after{transform:rotate(90deg) scaleX(0);opacity:0}
[data-vibeui-block="faq-001"] details[open] [data-part="sign"]::before{background:var(--vibeui-faq-001-accent)}
[data-vibeui-block="faq-001"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;
font-size:0.9375rem;line-height:1.65;color:var(--vibeui-faq-001-muted);max-width:62ch;
}
[data-vibeui-block="faq-001"] [data-part="contact"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.375rem;
color:var(--vibeui-faq-001-accent);text-decoration:none;font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="faq-001"] [data-part="contact"]:hover{text-decoration:underline}
[data-vibeui-block="faq-001"] [data-part="contact"]:focus-visible{outline:2px solid var(--vibeui-faq-001-accent);outline-offset:3px}
/* От 56rem — вопросы справа, заголовок слева и остаётся на месте. */
@container (min-width: 56rem){
[data-vibeui-block="faq-001"] [data-part="frame"]{
grid-template-columns:22rem 1fr;gap:3rem;padding:5rem 3rem;
}
[data-vibeui-block="faq-001"] [data-part="intro"]{position:sticky;top:2rem;align-self:start}
[data-vibeui-block="faq-001"] [data-part="title"]{font-size:clamp(2rem,2.9cqi,2.75rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq001Item[] = [
  {
    question: "Что я получаю после установки блока?",
    answer:
      "Один файл в вашем проекте — тот же самый, который вы видели в превью. Ни сборки, ни обёрток, ни привязки к нашей теме: блок несёт собственную палитру и работает в любом React-проекте.",
  },
  {
    question: "Агент действительно ставит именно этот компонент?",
    answer:
      "Да. Copy for AI даёт ссылку с инструкцией: идентификатор компонента, команда установки и список того, что нельзя менять. Агент скачивает файл из реестра, а не пересоздаёт похожий по описанию.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Переопределите локальные переменные блока — он встанет в вашу тему, не трогая остальной проект. Менять сам файл не нужно: цвета, радиусы и акценты вынесены в переменные.",
  },
  {
    question: "Нужны ли дополнительные библиотеки?",
    answer:
      "Зависимости объявлены в метаданных каждого блока, и у большинства их ноль: только React. Иконочные библиотеки не требуются — значки нарисованы на CSS.",
  },
  {
    question: "Можно ли использовать блоки в коммерческих проектах?",
    answer:
      "Да. После установки файл принадлежит вашему проекту: правьте, переименовывайте и публикуйте вместе с сайтом.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Секция вопросов и ответов на нативных details: раскрытие без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Faq001({
  eyebrow = "Вопросы",
  title = "Коротко о том, как это работает",
  description = "Если ответа здесь нет — напишите, мы отвечаем в течение рабочего дня.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать свой вопрос",
  contactHref = "#contact",
  background = "",
  accent,
  className,
  style,
}: Faq001Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="intro">
            {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
            <h2 data-part="title">{title}</h2>
            {description ? <p data-part="description">{description}</p> : null}
            {contactLabel ? (
              <a data-part="contact" href={contactHref}>
                {contactLabel}
              </a>
            ) : null}
          </div>
          <div data-part="list">
            {items.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span data-part="sign" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
