"use client"

import { useId, useMemo, useState } from "react"
import type { CSSProperties } from "react"

type Faq005Item = {
  question: string
  answer: string
  topic: string
}

export type Faq005Props = {
  title?: string
  placeholder?: string
  emptyLabel?: string
  items?: Faq005Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вопросы с поиском по списку. Клиентский компонент — ровно ради поля:
// фильтрация идёт по вопросу, ответу и теме, чтобы «когда привезут» нашло
// раздел про доставку. Число найденного объявляется через aria-live, иначе
// человек со скринридером не узнает, что список под полем поменялся.
const STYLES = `
:where([data-vibeui-block="faq-005"]){
--vibeui-faq-005-bg:oklch(1 0 0);
--vibeui-faq-005-field:oklch(0.98 0.003 240);
--vibeui-faq-005-ink:oklch(0.22 0.014 240);
--vibeui-faq-005-muted:oklch(0.5 0.014 240);
--vibeui-faq-005-border:oklch(0.9 0.006 240);
--vibeui-faq-005-accent:oklch(0.52 0.16 230);
--vibeui-faq-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="faq-005"]{
display:block;background:var(--vibeui-faq-005-bg);color:var(--vibeui-faq-005-ink);
font-family:var(--vibeui-faq-005-font);
}
[data-vibeui-block="faq-005"] [data-part="shell"]{
max-width:56rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-005"] [data-part="title"]{
margin:0;max-width:18ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-005"] [data-part="search"]{position:relative;margin-top:1.5rem}
[data-vibeui-block="faq-005"] [data-part="input"]{
width:100%;height:3rem;padding:0 1rem;
border:1px solid var(--vibeui-faq-005-border);border-radius:0.875rem;
background:var(--vibeui-faq-005-field);color:inherit;font:inherit;font-size:1rem;
transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="faq-005"] [data-part="input"]::placeholder{color:color-mix(in oklab,var(--vibeui-faq-005-muted) 75%,transparent)}
[data-vibeui-block="faq-005"] [data-part="input"]:focus{
outline:none;background:var(--vibeui-faq-005-bg);border-color:var(--vibeui-faq-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-faq-005-accent) 20%,transparent);
}
[data-vibeui-block="faq-005"] [data-part="count"]{
margin:0.625rem 0 0;color:var(--vibeui-faq-005-muted);font-size:0.8125rem;
}
[data-vibeui-block="faq-005"] [data-part="list"]{margin-top:1.5rem}
[data-vibeui-block="faq-005"] [data-part="item"]{
border-bottom:1px solid var(--vibeui-faq-005-border);
}
[data-vibeui-block="faq-005"] [data-part="item"] summary{
cursor:pointer;list-style:none;position:relative;
display:flex;flex-direction:column;gap:0.25rem;
padding:1rem 2rem 1rem 0;
font-size:1rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="faq-005"] [data-part="item"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-005"] [data-part="item"] summary::after{
content:"";position:absolute;right:0.375rem;top:1.3125rem;width:0.5rem;height:0.5rem;
border-right:2px solid var(--vibeui-faq-005-accent);border-bottom:2px solid var(--vibeui-faq-005-accent);
transform:rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="faq-005"] [data-part="item"][open] summary::after{transform:rotate(-135deg)}
[data-vibeui-block="faq-005"] [data-part="item"] summary:focus-visible{outline:2px solid var(--vibeui-faq-005-accent);outline-offset:-2px}
[data-vibeui-block="faq-005"] [data-part="topic"]{
color:var(--vibeui-faq-005-accent);font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="faq-005"] [data-part="answer"]{
margin:0;padding:0 2rem 1.25rem 0;max-width:64ch;
color:var(--vibeui-faq-005-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-005"] [data-part="empty"]{
margin:1.5rem 0 0;padding:1.5rem;border:1px dashed var(--vibeui-faq-005-border);border-radius:1rem;
color:var(--vibeui-faq-005-muted);font-size:0.9375rem;line-height:1.55;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-005"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-005"] [data-part="item"] summary{font-size:1.0625rem;padding-block:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq005Item[] = [
  {
    topic: "Доставка",
    question: "Когда привезут заказ?",
    answer:
      "По городу — на следующий день после оформления, в область — за два-три дня. Курьер звонит утром и называет интервал в два часа.",
  },
  {
    topic: "Доставка",
    question: "Можно ли изменить адрес после оформления?",
    answer:
      "Да, пока заказ не передан курьеру. Напишите в чат — поменяем адрес и время без пересчёта стоимости.",
  },
  {
    topic: "Оплата",
    question: "Какие способы оплаты вы принимаете?",
    answer:
      "Карты, СБП и счёт для юридических лиц. Оплата при получении доступна только для доставки по городу.",
  },
  {
    topic: "Оплата",
    question: "Когда списываются деньги при предзаказе?",
    answer:
      "В момент отгрузки со склада, а не при оформлении. До этого сумма только заморожена на карте.",
  },
  {
    topic: "Возврат",
    question: "Как вернуть товар?",
    answer:
      "Оставьте заявку в личном кабинете, приложите фотографии. Курьер заберёт посылку в удобный день бесплатно.",
  },
  {
    topic: "Аккаунт",
    question: "Как поменять телефон в профиле?",
    answer:
      "В разделе «Профиль» нажмите «Изменить телефон» и подтвердите новый номер кодом из сообщения.",
  },
  {
    topic: "Аккаунт",
    question: "Что делать, если не приходит код подтверждения?",
    answer:
      "Проверьте, не блокирует ли оператор короткие номера. Если через две минуты кода нет, закажите звонок вместо сообщения.",
  },
]

function matches(item: Faq005Item, query: string) {
  const haystack = `${item.question} ${item.answer} ${item.topic}`.toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/** Вопросы с поиском: фильтрация по вопросу, ответу и теме, счётчик — вслух. */
export function Faq005({
  title = "Найдите ответ за десять секунд",
  placeholder = "Например: когда привезут заказ",
  emptyLabel = "Ничего не нашлось. Попробуйте другое слово или напишите в поддержку — ответим в течение часа.",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Faq005Props) {
  const [query, setQuery] = useState("")
  const inputId = useId()

  const found = useMemo(
    () => (query.trim() ? items.filter((item) => matches(item, query)) : items),
    [items, query],
  )

  const palette = {
    ...(accent ? { "--vibeui-faq-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <div data-part="search">
            <input
              data-part="input"
              id={inputId}
              type="search"
              value={query}
              placeholder={placeholder}
              aria-label="Поиск по вопросам"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <p data-part="count" aria-live="polite">
            Показано вопросов: {found.length} из {items.length}
          </p>
          <div data-part="list">
            {found.map((item) => (
              <details key={item.question} data-part="item">
                <summary>
                  <span data-part="topic">{item.topic}</span>
                  {item.question}
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
          {found.length === 0 ? <p data-part="empty">{emptyLabel}</p> : null}
        </div>
      </section>
    </>
  )
}
