import type { CSSProperties } from "react"

type Faq004Item = {
  question: string
  answer: string
}

export type Faq004Props = {
  eyebrow?: string
  title?: string
  items?: Faq004Item[]
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Согласованный аккордеон без единой строки JS: у всех <details> одинаковый
// атрибут name, и браузер сам закрывает предыдущий ответ при открытии
// следующего. Это ровно тот случай, когда одновременное раскрытие вредно —
// длинные ответы про условия читают по одному, сравнивая их между собой.
const STYLES = `
:where([data-vibeui-block="faq-004"]){
--vibeui-faq-004-bg:oklch(0.99 0.006 85);
--vibeui-faq-004-ink:oklch(0.21 0.02 60);
--vibeui-faq-004-muted:oklch(0.48 0.02 60);
--vibeui-faq-004-border:oklch(0.88 0.014 75);
--vibeui-faq-004-accent:oklch(0.5 0.13 55);
--vibeui-faq-004-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-faq-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="faq-004"]{
display:block;background:var(--vibeui-faq-004-bg);color:var(--vibeui-faq-004-ink);
font-family:var(--vibeui-faq-004-font);
}
[data-vibeui-block="faq-004"] [data-part="shell"]{
max-width:52rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-004"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-004"] [data-part="title"]{
margin:0 0 2rem;max-width:18ch;
font-family:var(--vibeui-faq-004-serif);
font-size:clamp(1.75rem,5.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:600;
}
[data-vibeui-block="faq-004"] [data-part="item"]{
border-top:1px solid var(--vibeui-faq-004-border);
}
[data-vibeui-block="faq-004"] [data-part="item"]:last-child{border-bottom:1px solid var(--vibeui-faq-004-border)}
[data-vibeui-block="faq-004"] [data-part="item"] summary{
cursor:pointer;list-style:none;position:relative;
display:flex;align-items:baseline;gap:0.875rem;
padding:1.125rem 2.25rem 1.125rem 0;
font-size:1.0625rem;font-weight:600;line-height:1.35;
transition:color .16s ease;
}
[data-vibeui-block="faq-004"] [data-part="item"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-004"] [data-part="item"] summary:hover{color:var(--vibeui-faq-004-accent)}
[data-vibeui-block="faq-004"] [data-part="item"] summary::after{
content:"";position:absolute;right:0.25rem;top:1.4375rem;
width:0.5rem;height:0.5rem;
border-right:2px solid var(--vibeui-faq-004-accent);border-bottom:2px solid var(--vibeui-faq-004-accent);
transform:rotate(45deg);
transition:transform .2s ease;
}
[data-vibeui-block="faq-004"] [data-part="item"][open] summary::after{transform:rotate(-135deg)}
[data-vibeui-block="faq-004"] [data-part="item"] summary:focus-visible{outline:2px solid var(--vibeui-faq-004-accent);outline-offset:-2px}
[data-vibeui-block="faq-004"] [data-part="num"]{
flex:none;color:var(--vibeui-faq-004-accent);
font-family:var(--vibeui-faq-004-serif);font-size:0.9375rem;font-style:italic;
}
[data-vibeui-block="faq-004"] [data-part="answer"]{
margin:0;padding:0 2.25rem 1.5rem 2.375rem;max-width:62ch;
color:var(--vibeui-faq-004-muted);font-size:1rem;line-height:1.65;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-004"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-004"] [data-part="item"] summary{font-size:1.25rem;padding-block:1.375rem}
[data-vibeui-block="faq-004"] [data-part="answer"]{padding-left:2.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq004Item[] = [
  {
    question: "Кто владеет правами на макеты после сдачи?",
    answer:
      "Вы. Исключительные права переходят заказчику в момент подписания акта, отдельная лицензия не нужна. Исходники в Figma остаются у вас в аккаунте, мы просто теряем доступ.",
  },
  {
    question: "Что если результат не понравится?",
    answer:
      "На первом этапе мы показываем три направления и работаем дальше только с выбранным. Если ни одно не подошло, вы платите за этап и расходитесь без обязательств.",
  },
  {
    question: "Сколько правок входит в стоимость?",
    answer:
      "Правки не считаются штуками — считаются раунды. В каждый этап входит два раунда: замечания собираются списком и вносятся целиком, а не по одной за письмо.",
  },
  {
    question: "Работаете ли вы с разработчиками на стороне клиента?",
    answer:
      "Да, это обычная схема. Мы отдаём макеты, спецификацию состояний и разбор компонентов, а дальше отвечаем на вопросы команды в общем чате до конца сдачи.",
  },
  {
    question: "Как считается срок проекта?",
    answer:
      "От первого рабочего дня после аванса. Дни ожидания вашей обратной связи в срок не входят: если согласование заняло неделю, срок сдвигается на эту неделю.",
  },
]

/** Согласованный аккордеон: одновременно открыт только один ответ, без JS. */
export function Faq004({
  eyebrow = "Условия работы",
  title = "Что спрашивают до подписания договора",
  items = DEFAULT_ITEMS,
  name = "vibeui-faq-004",
  accent,
  className,
  style,
}: Faq004Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {items.map((item, index) => (
            <details key={item.question} data-part="item" name={name}>
              <summary>
                <span data-part="num">{index + 1}</span>
                {item.question}
              </summary>
              <p data-part="answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
