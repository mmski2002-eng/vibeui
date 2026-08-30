import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion002Item = {
  question: string
  answer: string
}

export type Accordion002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion002Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  accent?: string
}

// Идея компонента: каждый раздел — отдельная карточка с собственной рамкой,
// а не строка в общем списке. Открытый раздел приподнимается тенью, поэтому
// видно, что это самостоятельная единица, а не часть сплошного полотна.
// Разделы независимы: в списке карточек взаимное закрытие выглядит поломкой.
const STYLES = `
:where([data-vibeui-block="accordion-002"]){
--vibeui-accordion-002-fg:oklch(0.24 0.016 265);
--vibeui-accordion-002-muted:oklch(0.5 0.014 265);
--vibeui-accordion-002-bg:oklch(1 0 0);
--vibeui-accordion-002-border:oklch(0.9 0.006 265);
--vibeui-accordion-002-accent:oklch(0.55 0.2 262);
--vibeui-accordion-002-radius:0.875rem;
--vibeui-accordion-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:44rem;box-sizing:border-box;
color:var(--vibeui-accordion-002-fg);font-family:var(--vibeui-accordion-002-font);
}
[data-vibeui-block="accordion-002"] details{
border:1px solid var(--vibeui-accordion-002-border);
border-radius:var(--vibeui-accordion-002-radius);
background:var(--vibeui-accordion-002-bg);
transition:border-color .16s ease,box-shadow .18s ease;
}
[data-vibeui-block="accordion-002"] details:hover{border-color:color-mix(in oklab,var(--vibeui-accordion-002-accent) 25%,var(--vibeui-accordion-002-border))}
/* Открытая карточка приподнята: она перестаёт быть строкой списка. */
[data-vibeui-block="accordion-002"] details[open]{
border-color:color-mix(in oklab,var(--vibeui-accordion-002-accent) 40%,var(--vibeui-accordion-002-border));
box-shadow:0 10px 26px -18px oklch(0.2 0.03 265 / 45%);
}
[data-vibeui-block="accordion-002"] summary{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
padding:0.9375rem 1.125rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-002"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-002"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-002-accent);outline-offset:-2px;
border-radius:var(--vibeui-accordion-002-radius);
}
/* Значок в круглой лунке: у карточки собственный угол, значку нужен свой. */
[data-vibeui-block="accordion-002"] [data-part="chevron"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-accordion-002-border) 45%,transparent);
transition:background-color .16s ease;
}
[data-vibeui-block="accordion-002"] [data-part="chevron"]::before{
content:"";width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-002-muted);
border-bottom:1.5px solid var(--vibeui-accordion-002-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .18s ease,border-color .16s ease;
}
[data-vibeui-block="accordion-002"] details[open] [data-part="chevron"]{background:color-mix(in oklab,var(--vibeui-accordion-002-accent) 14%,transparent)}
[data-vibeui-block="accordion-002"] details[open] [data-part="chevron"]::before{
transform:rotate(225deg) translate(-0.0625rem,-0.0625rem);
border-right-color:var(--vibeui-accordion-002-accent);
border-bottom-color:var(--vibeui-accordion-002-accent);
}
[data-vibeui-block="accordion-002"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.0625rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-002-muted);max-width:62ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-002"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-002"] [data-part="answer"]{padding:0 1.375rem 1.25rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion002Item[] = [
  {
    question: "Как устроена оплата?",
    answer:
      "Помесячно или за год. Год дешевле на два месяца, счёт выставляется сразу, отказаться можно в любой момент — остаток вернём пропорционально.",
  },
  {
    question: "Данные в безопасности?",
    answer:
      "Шифрование при передаче и в хранилище, ежедневные резервные копии за последние 30 дней, доступ по ролям. Ключи хранятся отдельно от данных.",
  },
  {
    question: "Какие интеграции поддерживаются?",
    answer:
      "Готовые связки с почтой, платежами и аналитикой. Всё остальное — через веб-хуки и открытый API, ключи выдаются в настройках проекта.",
  },
]

/**
 * Аккордеон из отдельных карточек: открытая приподнимается тенью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion002({
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
  accent,
  className,
  style,
  ...props
}: Accordion002Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-002"
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.question} open={index === defaultOpen}>
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
