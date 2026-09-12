import type { CSSProperties } from "react"

type Faq008Item = {
  question: string
  answer: string
}

export type Faq008Props = {
  title?: string
  items?: Faq008Item[]
  cardTitle?: string
  cardText?: string
  buttonLabel?: string
  buttonHref?: string
  /** Мелкая строка под кнопкой: когда ждать ответ. */
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Список вопросов и карточка поддержки рядом, а не после списка: тот, кто не
// нашёл ответ, бросает чтение посередине — и кнопка «написать» обязана быть
// в поле зрения именно там. Раскладка считается от собственной ширины блока.
const STYLES = `
:where([data-vibeui-block="faq-008"]){
--vibeui-faq-008-bg:transparent;
--vibeui-faq-008-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-008-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-008-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-008-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-008-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-008-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-faq-008-on-accent:oklch(from var(--vibeui-faq-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-008"]{color-scheme:dark}
[data-vibeui-block="faq-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-008-bg);color:var(--vibeui-faq-008-ink);
font-family:var(--vibeui-faq-008-font);
}
[data-vibeui-block="faq-008"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-008"] [data-part="title"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-008"] [data-part="columns"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="faq-008"] [data-part="list"]{
display:grid;border-top:1px solid var(--vibeui-faq-008-border);
}
[data-vibeui-block="faq-008"] [data-part="item"]{border-bottom:1px solid var(--vibeui-faq-008-border)}
[data-vibeui-block="faq-008"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.75rem;
padding:1.125rem 0.25rem;cursor:pointer;list-style:none;
font-size:1rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-008"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-008"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-008-accent);outline-offset:2px;border-radius:0.375rem;
}
[data-vibeui-block="faq-008"] [data-part="arrow"]{
margin-left:auto;flex:none;align-self:center;
width:0.625rem;height:0.625rem;
border-right:2px solid var(--vibeui-faq-008-accent);
border-bottom:2px solid var(--vibeui-faq-008-accent);
transform:rotate(45deg);transition:transform .18s ease;
}
[data-vibeui-block="faq-008"] [data-part="item"][open] [data-part="arrow"]{transform:rotate(-135deg)}
[data-vibeui-block="faq-008"] [data-part="answer"]{
margin:0;padding:0 0.25rem 1.25rem;max-width:60ch;
color:var(--vibeui-faq-008-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-008"] [data-part="help"]{
padding:1.75rem;border-radius:1.125rem;
border:1px solid color-mix(in oklab,var(--vibeui-faq-008-accent) 25%,var(--vibeui-faq-008-border));
background:color-mix(in oklab,var(--vibeui-faq-008-accent) 10%,var(--vibeui-faq-008-card));
}
[data-vibeui-block="faq-008"] [data-part="help-title"]{
margin:0 0 0.5rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="faq-008"] [data-part="help-text"]{
margin:0 0 1.25rem;color:var(--vibeui-faq-008-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="faq-008"] [data-part="button"]{
display:inline-flex;align-items:center;justify-content:center;
padding:0.6875rem 1.375rem;border-radius:0.625rem;
background:var(--vibeui-faq-008-accent-fill);color:var(--vibeui-faq-008-on-accent);
font-size:0.9375rem;font-weight:700;text-decoration:none;
transition:filter .18s ease,transform .18s ease;
}
[data-vibeui-block="faq-008"] [data-part="button"]:hover{filter:brightness(1.06);transform:translateY(-1px)}
[data-vibeui-block="faq-008"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-faq-008-accent);outline-offset:3px;
}
[data-vibeui-block="faq-008"] [data-part="note"]{
margin:0.75rem 0 0;color:var(--vibeui-faq-008-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 48rem){
[data-vibeui-block="faq-008"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-008"] [data-part="columns"]{grid-template-columns:minmax(0,1fr) 19rem;gap:3rem}
[data-vibeui-block="faq-008"] [data-part="help"]{position:sticky;top:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq008Item[] = [
  {
    question: "Чем блок из каталога лучше сгенерированного с нуля?",
    answer:
      "Блок уже свёрстан, проверен на обеих темах и на узких экранах. Агенту остаётся подставить контент, а не изобретать раскладку — меньше правок, предсказуемый результат.",
  },
  {
    question: "Что получает AI-агент по кнопке Copy for AI?",
    answer:
      "Инструкцию с идентификатором блока, командой установки и списком того, что нельзя менять: анимации, отступы, поведение на узких экранах. Агент ставит настоящий файл, а не пересказ.",
  },
  {
    question: "Блок сломается при обновлении зависимостей проекта?",
    answer:
      "Нет: у блока их нет. Один файл, стили внутри, никаких пакетов — обновлять и синхронизировать нечего.",
  },
  {
    question: "Как поменять цвета под бренд?",
    answer:
      "Все цвета лежат в локальных CSS-переменных в начале файла. Переопределите их — и блок перекрасится, не трогая остальную вёрстку.",
  },
  {
    question: "Можно ли ставить несколько блоков на одну страницу?",
    answer:
      "Да, блоки не знают друг о друге и не конфликтуют: у каждого своя палитра и свой префикс переменных.",
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

/** Аккордеон вопросов и липкая карточка «не нашли — напишите» рядом. */
export function Faq008({
  title = "Вопросы о работе с каталогом",
  items = DEFAULT_ITEMS,
  cardTitle = "Не нашли свой вопрос?",
  cardText = "Напишите нам — разберём ваш случай и добавим ответ в этот список, чтобы следующему было проще.",
  buttonLabel = "Написать в поддержку",
  buttonHref = "#support",
  note = "Отвечаем в течение рабочего дня.",
  background = "",
  accent,
  className,
  style,
}: Faq008Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-008-accent": accent,
          "--vibeui-faq-008-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <div data-part="columns">
            <div data-part="list">
              {items.map((item) => (
                <details key={item.question} data-part="item">
                  <summary data-part="question">
                    <span>{item.question}</span>
                    <span data-part="arrow" aria-hidden="true" />
                  </summary>
                  <p data-part="answer">{item.answer}</p>
                </details>
              ))}
            </div>
            <aside data-part="help" aria-label={cardTitle}>
              <h3 data-part="help-title">{cardTitle}</h3>
              <p data-part="help-text">{cardText}</p>
              <a data-part="button" href={buttonHref}>
                {buttonLabel}
              </a>
              <p data-part="note">{note}</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
