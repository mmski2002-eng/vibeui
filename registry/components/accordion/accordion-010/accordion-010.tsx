import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion010Item = {
  question: string
  answer: string
}

export type Accordion010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion010Item[]
  defaultOpen?: number
  /** Нумеровать вопросы. Номер помогает ссылаться на пункт в переписке. */
  numbered?: boolean
  accent?: string
}

// Идея компонента: на широкой раскладке вопрос остаётся в левой колонке, а
// ответ раскрывается в правой — строка не разрывается по вертикали, и глаз
// не теряет вопрос, к которому относится длинный ответ. В узкой колонке блок
// сам складывается в обычный список. Ширина считается от блока, не от окна.
const STYLES = `
:where([data-vibeui-block="accordion-010"]){
--vibeui-accordion-010-fg:oklch(0.22 0.014 265);
--vibeui-accordion-010-muted:oklch(0.5 0.014 265);
--vibeui-accordion-010-line:oklch(0.91 0.006 265);
--vibeui-accordion-010-accent:oklch(0.55 0.2 262);
--vibeui-accordion-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-010"]{
display:flex;flex-direction:column;
width:100%;max-width:56rem;box-sizing:border-box;
color:var(--vibeui-accordion-010-fg);font-family:var(--vibeui-accordion-010-font);
border-top:1px solid var(--vibeui-accordion-010-line);
}
[data-vibeui-block="accordion-010"] details{border-bottom:1px solid var(--vibeui-accordion-010-line)}
[data-vibeui-block="accordion-010"] summary{
display:flex;align-items:flex-start;gap:0.75rem;
padding:1rem 0.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.45;
transition:color .16s ease;
}
[data-vibeui-block="accordion-010"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-010"] summary:hover{color:var(--vibeui-accordion-010-accent)}
[data-vibeui-block="accordion-010"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-010-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="accordion-010"] [data-part="number"]{
flex:none;width:1.5rem;
font-size:0.75rem;font-weight:650;line-height:1.6;
color:var(--vibeui-accordion-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="accordion-010"] details[open] [data-part="number"]{color:var(--vibeui-accordion-010-accent)}
[data-vibeui-block="accordion-010"] [data-part="question"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="accordion-010"] [data-part="chevron"]{
flex:none;margin-top:0.375rem;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-010-muted);
border-bottom:1.5px solid var(--vibeui-accordion-010-muted);
transform:rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="accordion-010"] details[open] [data-part="chevron"]{transform:rotate(225deg)}
[data-vibeui-block="accordion-010"] [data-part="answer"]{
margin:0;padding:0 0.25rem 1.125rem 2.25rem;
font-size:0.875rem;line-height:1.7;color:var(--vibeui-accordion-010-muted);max-width:64ch;
}
/* Широкая раскладка: вопрос слева, ответ в правой колонке той же строки. */
@container (min-width: 44rem){
[data-vibeui-block="accordion-010"] details{
display:grid;grid-template-columns:20rem 1fr;column-gap:2.5rem;align-items:start;
}
[data-vibeui-block="accordion-010"] summary{padding:1.25rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-010"] [data-part="answer"]{
padding:1.25rem 0.25rem 1.25rem 0;font-size:0.9375rem;
}
[data-vibeui-block="accordion-010"] details:not([open]) [data-part="answer"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion010Item[] = [
  {
    question: "Чем это отличается от обычной библиотеки компонентов?",
    answer:
      "Библиотека даёт пакет, который живёт в node_modules и обновляется вместе со всем проектом. Здесь компонент приходит одним файлом и становится вашим: его можно править, переименовывать и публиковать вместе с сайтом. Взамен он не обновляется сам — новая версия ставится той же командой.",
  },
  {
    question: "Почему у каждого компонента своя палитра, а не токены темы?",
    answer:
      "Компонент должен выглядеть в вашем проекте так же, как в превью, а токены у всех разные: bg-primary в одном проекте синий, в другом чёрный. Локальные переменные --vibeui-* дают предсказуемый вид сразу и позволяют переопределить цвета одной строкой, когда это нужно.",
  },
  {
    question: "Что именно получает ИИ-агент по ссылке Copy for AI?",
    answer:
      "Текстовую инструкцию: идентификатор компонента, команду установки, адрес файла, список того, что нельзя менять, и того, что можно. Агент скачивает файл из реестра вместо того, чтобы сочинять похожий по описанию — ради этого инструкция и существует.",
  },
]

/**
 * Аккордеон в две колонки: вопрос слева, ответ справа на широкой раскладке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion010({
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
  numbered = true,
  accent,
  className,
  style,
  ...props
}: Accordion010Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-010"
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.question} open={index === defaultOpen}>
            <summary>
              {numbered ? (
                <span data-part="number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span data-part="question">{item.question}</span>
              <span data-part="chevron" aria-hidden="true" />
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
