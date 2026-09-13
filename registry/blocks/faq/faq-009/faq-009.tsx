import type { CSSProperties } from "react"

type Faq009Item = {
  question: string
  answer: string
}

export type Faq009Props = {
  eyebrow?: string
  title?: string
  items?: Faq009Item[]
  /** Префикс якорных id: у каждого вопроса будет id вида «faq-q-1». */
  idPrefix?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Нумерованные вопросы с якорями: крупный порядковый номер делает список
// сканируемым, а id на каждом details позволяет ссылаться на конкретный
// ответ из письма или чата поддержки. Раскладка считается от собственной
// ширины блока (container queries), а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="faq-009"]){
--vibeui-faq-009-bg:transparent;
--vibeui-faq-009-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-009-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-009-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-009-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-009"]{color-scheme:dark}
[data-vibeui-block="faq-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-009-bg);color:var(--vibeui-faq-009-ink);
font-family:var(--vibeui-faq-009-font);
}
[data-vibeui-block="faq-009"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-009"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-009-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-009"] [data-part="title"]{
margin:0 0 2rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-009"] [data-part="list"]{display:grid;border-top:1px solid var(--vibeui-faq-009-border)}
[data-vibeui-block="faq-009"] [data-part="item"]{
border-bottom:1px solid var(--vibeui-faq-009-border);
/* Якорный переход не должен прятать вопрос под фиксированной шапкой сайта. */
scroll-margin-top:6rem;
}
[data-vibeui-block="faq-009"] [data-part="question"]{
display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:baseline;gap:1rem;
padding:1.25rem 0.25rem;cursor:pointer;list-style:none;
font-size:1rem;font-weight:640;line-height:1.4;
}
[data-vibeui-block="faq-009"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="faq-009"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-faq-009-accent);outline-offset:2px;border-radius:0.375rem;
}
[data-vibeui-block="faq-009"] [data-part="number"]{
color:var(--vibeui-faq-009-accent);
font-size:clamp(1.375rem,4cqi,1.875rem);font-weight:800;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;line-height:1;
}
[data-vibeui-block="faq-009"] [data-part="sign"]{
align-self:center;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-faq-009-muted);
transition:transform var(--vibeui-faq-009-dur-2) ease,color var(--vibeui-faq-009-dur-2) ease;
}
[data-vibeui-block="faq-009"] [data-part="sign"]::before,
[data-vibeui-block="faq-009"] [data-part="sign"]::after{
content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;
}
[data-vibeui-block="faq-009"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="faq-009"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="faq-009"] [data-part="item"][open] [data-part="sign"]{
transform:rotate(45deg);color:var(--vibeui-faq-009-accent);
}
[data-vibeui-block="faq-009"] [data-part="answer"]{
margin:0;padding:0 0.25rem 1.375rem;max-width:60ch;
color:var(--vibeui-faq-009-muted);font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-009"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-009"] [data-part="question"]{gap:1.5rem;padding:1.5rem 0.25rem}
[data-vibeui-block="faq-009"] [data-part="answer"]{padding-left:3.4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq009Item[] = [
  {
    question: "С чего начать сборку страницы из блоков?",
    answer:
      "Выберите в каталоге секции под свой сценарий: обложка, преимущества, отзывы, вопросы. Каждую можно посмотреть вживую на обеих темах ещё до установки.",
  },
  {
    question: "Как передать выбранный блок AI-агенту?",
    answer:
      "Кнопка Copy for AI кладёт в буфер готовую инструкцию: идентификатор блока, команду установки и список того, что агент обязан сохранить. Останется вставить её в чат.",
  },
  {
    question: "Что агент не имеет права менять при установке?",
    answer:
      "Анимации, типографику, отступы и поведение на узких экранах — это зафиксировано в инструкции. Контент, ссылки и цвета бренда, наоборот, меняются свободно.",
  },
  {
    question: "Как сослаться на конкретный ответ из этого списка?",
    answer:
      "У каждого вопроса есть якорный id: добавьте его к адресу страницы через решётку, и браузер прокрутит точно к нужному вопросу.",
  },
  {
    question: "Что делать, если нужного блока в каталоге нет?",
    answer:
      "Напишите нам, какой сценарий не закрыт. Частые запросы попадают в план каталога первыми — так здесь появилась половина секций.",
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

/** Нумерованные вопросы с якорными id на каждом ответе. */
export function Faq009({
  eyebrow = "Как это работает",
  title = "Пять шагов от каталога до готовой страницы",
  items = DEFAULT_ITEMS,
  idPrefix = "faq-q",
  background = "",
  accent,
  className,
  style,
}: Faq009Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="list">
            {items.map((item, index) => (
              <details
                key={item.question}
                data-part="item"
                id={`${idPrefix}-${index + 1}`}
              >
                <summary data-part="question">
                  <span data-part="number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.question}</span>
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
