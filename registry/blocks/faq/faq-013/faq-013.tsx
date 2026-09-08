import type { CSSProperties } from "react"

type Faq013Item = {
  question: string
  answer: string
}

export type Faq013Props = {
  title?: string
  items?: Faq013Item[]
  formTitle?: string
  placeholder?: string
  buttonLabel?: string
  /** Мелкая строка под формой: куда уйдёт вопрос и когда ждать ответ. */
  formHint?: string
  /** Адрес обработчика формы. По умолчанию «#» — подставьте свой. */
  formAction?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Аккордеон плюс форма «задать свой вопрос» внизу: тот, кто дочитал список
// до конца и не нашёл ответ, получает выход прямо здесь, а не ссылку на
// другую страницу. Форма — чистая разметка без обработчика: адрес приёма
// подставляется пропом formAction. Раскладка считается от ширины блока.
const STYLES = `
:where([data-vibeui-block="faq-013"]){
--vibeui-faq-013-bg:transparent;
--vibeui-faq-013-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-013-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-013-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-013-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-013-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-013-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-faq-013-on-accent:oklch(0.15 0.02 39.8);
--vibeui-faq-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-013"]{color-scheme:dark}
[data-vibeui-block="faq-013"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-013-bg);color:var(--vibeui-faq-013-ink);
font-family:var(--vibeui-faq-013-font);
}
[data-vibeui-block="faq-013"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-013"] [data-part="title"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-013"] [data-part="list"]{
display:grid;margin:0 0 2rem;border-top:1px solid var(--vibeui-faq-013-border);
}
[data-vibeui-block="faq-013"] [data-part="item"]{border-bottom:1px solid var(--vibeui-faq-013-border)}
[data-vibeui-block="faq-013"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.75rem;
padding:1.125rem 0.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-013"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-013"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-013-accent);outline-offset:2px;border-radius:0.375rem;
}
[data-vibeui-block="faq-013"] [data-part="sign"]{
margin-left:auto;flex:none;align-self:center;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-faq-013-accent);
transition:transform .18s ease;
}
[data-vibeui-block="faq-013"] [data-part="sign"]::before,
[data-vibeui-block="faq-013"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-013"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-013"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-013"] [data-part="item"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="faq-013"] [data-part="answer"]{
margin:0;padding:0 0.25rem 1.25rem;max-width:60ch;
color:var(--vibeui-faq-013-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-013"] [data-part="ask"]{
padding:1.5rem;border-radius:1rem;
border:1px solid color-mix(in oklab,var(--vibeui-faq-013-accent) 25%,var(--vibeui-faq-013-border));
background:color-mix(in oklab,var(--vibeui-faq-013-accent) 8%,var(--vibeui-faq-013-card));
}
[data-vibeui-block="faq-013"] [data-part="ask-title"]{
margin:0 0 0.875rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="faq-013"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:0.625rem}
[data-vibeui-block="faq-013"] [data-part="input"]{
flex:1 1 14rem;min-width:0;
padding:0.6875rem 0.875rem;border:1px solid var(--vibeui-faq-013-border);border-radius:0.625rem;
background:var(--vibeui-faq-013-card);color:var(--vibeui-faq-013-ink);
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="faq-013"] [data-part="input"]::placeholder{color:var(--vibeui-faq-013-muted)}
[data-vibeui-block="faq-013"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-faq-013-accent);outline-offset:1px;
}
[data-vibeui-block="faq-013"] [data-part="submit"]{
flex:none;cursor:pointer;border:none;
padding:0.6875rem 1.375rem;border-radius:0.625rem;
background:var(--vibeui-faq-013-accent-fill);color:var(--vibeui-faq-013-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;
transition:filter .18s ease;
}
[data-vibeui-block="faq-013"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="faq-013"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-faq-013-accent);outline-offset:3px;
}
[data-vibeui-block="faq-013"] [data-part="hint"]{
margin:0.75rem 0 0;color:var(--vibeui-faq-013-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-013"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-013"] [data-part="question"]{font-size:1rem}
[data-vibeui-block="faq-013"] [data-part="ask"]{padding:1.75rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq013Item[] = [
  {
    question: "Как быстро агент собирает страницу из блоков?",
    answer:
      "Секция ставится за одну команду, страница из пяти-шести секций собирается за один сеанс работы с агентом — большую часть времени занимает ваш контент, а не вёрстка.",
  },
  {
    question: "Нужно ли уметь программировать?",
    answer:
      "Нет. Достаточно выбрать блоки в каталоге и передать инструкции агенту. Код появляется в проекте готовым, править его руками не обязательно.",
  },
  {
    question:
      "Что будет, если попросить агента «сделать похожее» без каталога?",
    answer:
      "Агент сгенерирует секцию заново, и результат каждый раз разный: плывут отступы, ломается мобильная вёрстка. Инструкция из каталога ставит проверенный файл — итог предсказуем.",
  },
  {
    question: "Блоки совместимы между собой?",
    answer:
      "Да, каждый живёт в своих стилях и не влияет на соседей. Любые секции каталога можно ставить на одну страницу в любом порядке.",
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

/** Аккордеон вопросов с формой «задать свой вопрос» внизу. */
export function Faq013({
  title = "Спрашивают перед стартом",
  items = DEFAULT_ITEMS,
  formTitle = "Не нашли ответа? Задайте свой вопрос",
  placeholder = "Например: подойдёт ли каталог для интернет-магазина?",
  buttonLabel = "Отправить",
  formHint = "Вопрос попадёт команде каталога. Отвечаем на почту в течение рабочего дня.",
  formAction = "#",
  background = "",
  accent,
  className,
  style,
}: Faq013Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-013-accent": accent,
          "--vibeui-faq-013-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <div data-part="list">
            {items.map((item) => (
              <details key={item.question} data-part="item">
                <summary data-part="question">
                  <span>{item.question}</span>
                  <span data-part="sign" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
          <form data-part="ask" action={formAction} method="get">
            <h3 data-part="ask-title">{formTitle}</h3>
            <div data-part="row">
              <input
                data-part="input"
                type="text"
                name="question"
                required
                placeholder={placeholder}
                aria-label={formTitle}
              />
              <button data-part="submit" type="submit">
                {buttonLabel}
              </button>
            </div>
            <p data-part="hint">{formHint}</p>
          </form>
        </div>
      </section>
    </>
  )
}
