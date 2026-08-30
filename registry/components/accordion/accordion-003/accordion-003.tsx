import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion003Item = {
  question: string
  answer: string
}

export type Accordion003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion003Item[]
  defaultOpen?: number
  /** Открытым остаётся только один раздел. */
  exclusive?: boolean
  accent?: string
}

// Идея компонента: аккордеон без рамок — только строки и волосяные линии
// между ними. Он не выглядит вставкой на странице и годится там, где список
// вопросов идёт внутри текста. Знак «плюс» превращается в «минус» поворотом
// одной полосы: это читается даже боковым зрением.
const STYLES = `
:where([data-vibeui-block="accordion-003"]){
--vibeui-accordion-003-fg:oklch(0.22 0.014 265);
--vibeui-accordion-003-muted:oklch(0.5 0.014 265);
--vibeui-accordion-003-line:oklch(0.9 0.006 265);
--vibeui-accordion-003-accent:oklch(0.55 0.2 262);
--vibeui-accordion-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-003"]{
display:flex;flex-direction:column;
width:100%;max-width:42rem;box-sizing:border-box;
color:var(--vibeui-accordion-003-fg);font-family:var(--vibeui-accordion-003-font);
border-top:1px solid var(--vibeui-accordion-003-line);
}
[data-vibeui-block="accordion-003"] details{border-bottom:1px solid var(--vibeui-accordion-003-line)}
[data-vibeui-block="accordion-003"] summary{
display:flex;align-items:flex-start;justify-content:space-between;gap:1.25rem;
padding:1rem 0.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.45;
transition:color .16s ease;
}
[data-vibeui-block="accordion-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-003"] summary:hover{color:var(--vibeui-accordion-003-accent)}
[data-vibeui-block="accordion-003"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-003-accent);outline-offset:2px;border-radius:0.375rem}
/* Плюс и минус: горизонтальная полоса на месте, вертикальная складывается. */
[data-vibeui-block="accordion-003"] [data-part="sign"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;margin-top:0.3125rem;
}
[data-vibeui-block="accordion-003"] [data-part="sign"]::before,
[data-vibeui-block="accordion-003"] [data-part="sign"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;
background:var(--vibeui-accordion-003-muted);
transition:transform .2s cubic-bezier(.32,.72,0,1),background-color .16s ease;
}
[data-vibeui-block="accordion-003"] [data-part="sign"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-003"] details[open] [data-part="sign"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-003"] details[open] [data-part="sign"]::before,
[data-vibeui-block="accordion-003"] details[open] [data-part="sign"]::after{background:var(--vibeui-accordion-003-accent)}
[data-vibeui-block="accordion-003"] [data-part="answer"]{
margin:0;padding:0 2.5rem 1.125rem 0.25rem;
font-size:0.875rem;line-height:1.65;color:var(--vibeui-accordion-003-muted);max-width:64ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-003"] summary{padding:1.125rem 0.25rem;font-size:1rem}
[data-vibeui-block="accordion-003"] [data-part="answer"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion003Item[] = [
  {
    question: "Сколько времени занимает подключение?",
    answer:
      "Полчаса на первый проект: домен подключается за пять минут, остальное — наполнение страниц. Переносить существующий сайт дольше, обычно день.",
  },
  {
    question: "Что будет с сайтом, если я перестану платить?",
    answer:
      "Сайт остаётся опубликованным до конца оплаченного периода, дальше переходит в режим только для чтения. Исходники ваши и никуда не деваются.",
  },
  {
    question: "Можно ли работать вдвоём над одним проектом?",
    answer:
      "Да, участники приглашаются по почте и получают роль редактора или читателя. Одновременное редактирование одной страницы не блокируется.",
  },
  {
    question: "Есть ли ограничение по трафику?",
    answer:
      "Мягкое: до ста тысяч просмотров в месяц включено, дальше предупредим и предложим перейти на следующий тариф. Сайт при этом не выключается.",
  },
]

/**
 * Аккордеон без рамок: строки, волосяные линии и знак «плюс».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion003({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  exclusive = false,
  accent,
  className,
  style,
  ...props
}: Accordion003Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-003"
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details
            key={item.question}
            name={exclusive ? "vibeui-accordion-003" : undefined}
            open={index === defaultOpen}
          >
            <summary>
              {item.question}
              <span data-part="sign" aria-hidden="true" />
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
