import type { CSSProperties } from "react"

type Faq002Item = {
  question: string
  answer: string
}

export type Faq002Props = {
  title?: string
  description?: string
  items?: Faq002Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вопросы в две колонки. Колонки собраны через CSS columns, а не через
// grid: так порядок вопросов остаётся вертикальным — читают сверху вниз
// левую колонку, потом правую, и нумерация не путается. break-inside
// запрещает разрывать карточку между колонками.
const STYLES = `
:where([data-vibeui-block="faq-002"]){
--vibeui-faq-002-bg:oklch(1 0 0);
--vibeui-faq-002-card:oklch(0.98 0.004 255);
--vibeui-faq-002-ink:oklch(0.22 0.014 255);
--vibeui-faq-002-muted:oklch(0.5 0.014 255);
--vibeui-faq-002-border:oklch(0.91 0.006 255);
--vibeui-faq-002-accent:oklch(0.5 0.17 262);
--vibeui-faq-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="faq-002"]{
display:block;background:var(--vibeui-faq-002-bg);color:var(--vibeui-faq-002-ink);
font-family:var(--vibeui-faq-002-font);
}
[data-vibeui-block="faq-002"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-002"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-002"] [data-part="text"]{
margin:0.75rem 0 0;max-width:60ch;color:var(--vibeui-faq-002-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="faq-002"] [data-part="list"]{
margin-top:2rem;column-gap:1.5rem;
}
[data-vibeui-block="faq-002"] [data-part="item"]{
break-inside:avoid;margin:0 0 0.75rem;
border:1px solid var(--vibeui-faq-002-border);border-radius:1rem;
background:var(--vibeui-faq-002-card);
}
[data-vibeui-block="faq-002"] [data-part="item"] summary{
cursor:pointer;list-style:none;
display:flex;align-items:flex-start;gap:0.75rem;
padding:1rem 1.125rem;
font-size:1rem;font-weight:620;line-height:1.4;
}
[data-vibeui-block="faq-002"] [data-part="item"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-002"] [data-part="item"] summary::after{
content:"";flex:none;width:0.75rem;height:0.75rem;margin-left:auto;margin-top:0.3125rem;
border-right:2px solid var(--vibeui-faq-002-accent);border-bottom:2px solid var(--vibeui-faq-002-accent);
transform:rotate(45deg);transform-origin:60% 60%;
transition:transform .18s ease;
}
[data-vibeui-block="faq-002"] [data-part="item"][open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="faq-002"] [data-part="item"] summary:focus-visible{outline:2px solid var(--vibeui-faq-002-accent);outline-offset:-2px;border-radius:1rem}
[data-vibeui-block="faq-002"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;max-width:56ch;
color:var(--vibeui-faq-002-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-002"] [data-part="index"]{
flex:none;min-width:1.5rem;color:var(--vibeui-faq-002-accent);
font-variant-numeric:tabular-nums;font-size:0.8125rem;font-weight:700;padding-top:0.1875rem;
}
@container (min-width: 44rem){
[data-vibeui-block="faq-002"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-002"] [data-part="list"]{column-count:2;margin-top:2.5rem}
[data-vibeui-block="faq-002"] [data-part="item"]{margin-bottom:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq002Item[] = [
  {
    question: "Как быстро подключают тариф?",
    answer:
      "Сразу после оплаты: доступ открывается автоматически, ждать менеджера не нужно.",
  },
  {
    question: "Можно ли перенести данные из другой системы?",
    answer:
      "Да. Импорт понимает выгрузки в CSV и XLSX, а для больших баз мы делаем перенос руками бесплатно.",
  },
  {
    question: "Что происходит после окончания оплаченного периода?",
    answer:
      "Аккаунт переходит в режим чтения. Данные хранятся ещё год, удалить их можно только вручную.",
  },
  {
    question: "Есть ли ограничение по числу сотрудников?",
    answer:
      "На стартовом тарифе — пять человек, дальше место докупается по одному, без перехода на другой тариф.",
  },
  {
    question: "Как устроена техподдержка?",
    answer:
      "Пишете в чат из интерфейса. Отвечаем в рабочие часы за пятнадцать минут, ночью — утром следующего дня.",
  },
  {
    question: "Вы работаете с самозанятыми?",
    answer:
      "Да, договор и закрывающие документы формируются автоматически в личном кабинете.",
  },
]

/** Вопросы в две колонки: порядок вертикальный, карточки не рвутся. */
export function Faq002({
  title = "Вопросы, которые задают до оплаты",
  description = "Собрали то, о чём чаще всего спрашивают в чате поддержки. Если вашего вопроса тут нет — напишите, мы добавим.",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Faq002Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{description}</p>
          <div data-part="list">
            {items.map((item, index) => (
              <details key={item.question} data-part="item">
                <summary>
                  <span data-part="index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.question}
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
