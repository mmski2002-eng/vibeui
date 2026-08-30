import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion001Item = {
  question: string
  answer: string
}

export type Accordion001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion001Item[]
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  accent?: string
}

// Идея компонента: аккордеон без единой строки JS. Раскрытие держат нативные
// details/summary, взаимное исключение — атрибут name на details. Отсюда
// бесплатные клавиатура, поиск по странице и работа до гидратации.
const STYLES = `
:where([data-vibeui-block="accordion-001"]){
--vibeui-accordion-001-fg:oklch(0.24 0.016 265);
--vibeui-accordion-001-muted:oklch(0.5 0.014 265);
--vibeui-accordion-001-bg:oklch(1 0 0);
--vibeui-accordion-001-border:oklch(0.9 0.006 265);
--vibeui-accordion-001-accent:oklch(0.55 0.2 262);
--vibeui-accordion-001-radius:0.75rem;
--vibeui-accordion-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-001"]{
display:flex;flex-direction:column;width:100%;max-width:44rem;box-sizing:border-box;
border:1px solid var(--vibeui-accordion-001-border);
border-radius:var(--vibeui-accordion-001-radius);
background:var(--vibeui-accordion-001-bg);color:var(--vibeui-accordion-001-fg);
font-family:var(--vibeui-accordion-001-font);overflow:hidden;
}
[data-vibeui-block="accordion-001"] details + details{border-top:1px solid var(--vibeui-accordion-001-border)}
[data-vibeui-block="accordion-001"] summary{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
padding:0.9375rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:500;line-height:1.4;
transition:color .16s ease;
}
[data-vibeui-block="accordion-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-001"] summary:hover{color:var(--vibeui-accordion-001-accent)}
[data-vibeui-block="accordion-001"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-001-accent);outline-offset:-2px;
}
/* Значок — две грани квадрата; поворачивается вместе с открытием раздела. */
[data-vibeui-block="accordion-001"] [data-part="chevron"]{
width:0.4375rem;height:0.4375rem;flex:none;margin-right:0.25rem;
border-right:1.5px solid var(--vibeui-accordion-001-muted);
border-bottom:1.5px solid var(--vibeui-accordion-001-muted);
transform:rotate(45deg) translate(-0.125rem,-0.125rem);
transition:transform .18s ease,border-color .16s ease;
}
[data-vibeui-block="accordion-001"] details[open] [data-part="chevron"]{
transform:rotate(225deg) translate(-0.125rem,-0.125rem);
border-right-color:var(--vibeui-accordion-001-accent);
border-bottom-color:var(--vibeui-accordion-001-accent);
}
[data-vibeui-block="accordion-001"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.0625rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-001-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-001"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-001"] [data-part="answer"]{padding:0 1.375rem 1.25rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion001Item[] = [
  {
    question: "Что именно я получаю после установки?",
    answer:
      "Один файл компонента в вашем проекте. Тот же самый, который вы видели в превью: ни сборки, ни обёрток, ни привязки к нашей теме.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Компонент несёт собственную палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
  },
  {
    question: "Нужно ли ставить дополнительные библиотеки?",
    answer:
      "Нет. Зависимости объявлены в метаданных каждого компонента, и у большинства их ноль: только React.",
  },
]

/**
 * Аккордеон на нативных details/summary: раскрытие без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion001({
  items = DEFAULT_ITEMS,
  exclusive = true,
  defaultOpen = 0,
  accent,
  className,
  style,
  ...props
}: Accordion001Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-001"
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details
            key={item.question}
            name={exclusive ? "vibeui-accordion-001" : undefined}
            open={index === defaultOpen}
          >
            <summary>
              {item.question}
              <span data-part="chevron" aria-hidden="true" />
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
