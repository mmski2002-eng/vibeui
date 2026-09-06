import type { CSSProperties } from "react"

type Faq012Item = {
  question: string
  answer: string
}

export type Faq012Props = {
  eyebrow?: string
  title?: string
  items?: Faq012Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Все ответы открыты сразу: без аккордеона текст индексируется, читается
// по диагонали и находится Ctrl+F без единого клика. Микроразметка
// schema.org/FAQPage даёт поисковику структуру вопрос-ответ. Раскладка
// считается от собственной ширины блока (container queries).
const STYLES = `
:where([data-vibeui-block="faq-012"]){
--vibeui-faq-012-bg:transparent;
--vibeui-faq-012-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-012-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-012-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-012-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-012-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-012"]{color-scheme:dark}
[data-vibeui-block="faq-012"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-012-bg);color:var(--vibeui-faq-012-ink);
font-family:var(--vibeui-faq-012-font);
}
[data-vibeui-block="faq-012"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-012"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-012-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-012"] [data-part="title"]{
margin:0 0 2rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-012"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="faq-012"] [data-part="card"]{
min-inline-size:0;
padding:1.375rem 1.5rem;border:1px solid var(--vibeui-faq-012-border);border-radius:1rem;
background:var(--vibeui-faq-012-card);
}
[data-vibeui-block="faq-012"] [data-part="question"]{
margin:0 0 0.625rem;
padding-left:0.875rem;position:relative;
font-size:1rem;font-weight:700;line-height:1.4;letter-spacing:-0.01em;
}
[data-vibeui-block="faq-012"] [data-part="question"]::before{
content:"";position:absolute;left:0;top:0.2em;bottom:0.2em;width:3px;border-radius:2px;
background:var(--vibeui-faq-012-accent);
}
[data-vibeui-block="faq-012"] [data-part="answer"]{
margin:0;color:var(--vibeui-faq-012-muted);font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-012"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-012"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 62rem){
[data-vibeui-block="faq-012"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq012Item[] = [
  {
    question: "Что такое VibeUI?",
    answer:
      "Каталог готовых секций для сайтов, рассчитанный на работу с AI-агентом: выбираете дизайн, копируете инструкцию — агент ставит настоящий компонент в проект.",
  },
  {
    question: "Чем блок отличается от шаблона?",
    answer:
      "Шаблон диктует весь сайт, блок — одну секцию. Блоки комбинируются в любом порядке и не знают друг о друге: у каждого своя палитра и свои стили.",
  },
  {
    question: "Какие технологии нужны в проекте?",
    answer:
      "Только React. Стили лежат в самом файле обычным CSS, зависимости не нужны, Tailwind не обязателен.",
  },
  {
    question: "Как блок попадает в проект?",
    answer:
      "Командой установки из карточки блока или через инструкцию Copy for AI. Файл скачивается из registry и становится обычным файлом вашего репозитория.",
  },
  {
    question: "Поддерживается ли тёмная тема?",
    answer:
      "Да, палитра каждого блока собрана на light-dark() и следует за темой страницы. Отдельной тёмной версии не нужно.",
  },
  {
    question: "Что можно менять после установки?",
    answer:
      "Контент, ссылки и цвета бренда — свободно. Раскладку, анимации и поведение на узких экранах стоит сохранить: они и есть дизайн блока.",
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

/** Сетка вопрос-ответ без аккордеона: всё открыто, всё индексируется. */
export function Faq012({
  eyebrow = "Вопросы и ответы",
  title = "Всё о каталоге на одном экране",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Faq012Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-012"
        className={className}
        style={palette}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {items.map((item) => (
              <article
                key={item.question}
                data-part="card"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3 data-part="question" itemProp="name">
                  {item.question}
                </h3>
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p data-part="answer" itemProp="text">
                    {item.answer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
