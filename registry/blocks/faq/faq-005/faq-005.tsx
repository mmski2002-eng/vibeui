"use client"

import { useMemo, useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"
import type { CSSProperties } from "react"

import { Accordion007 } from "@/registry/components/accordion/accordion-007/accordion-007"
import { Input004 } from "@/registry/components/input/input-004/input-004"

type Faq005Item = {
  question: string
  answer: string
  topic: string
}

export type Faq005Props = {
  title?: string
  placeholder?: string
  emptyLabel?: string
  /** Подпись поля поиска для скринридера: видимой подписи нет. */
  searchLabel?: string
  /** Счётчик найденного. {found} — сколько показано, {total} — всего. */
  countText?: string
  items?: Faq005Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  showTopic?: boolean
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вопросы с поиском по списку. Составной блок: поле — input-004, список —
// accordion-007 с темой в плашке справа. Клиентский компонент — ровно ради
// фильтрации: она идёт по вопросу, ответу и теме, чтобы «когда привезут»
// нашло раздел про доставку. Число найденного объявляется через aria-live,
// иначе человек со скринридером не узнает, что список под полем поменялся.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `[data-vibeui-block="faq-005"] [data-part="search"]{margin-top:1.5rem}

:where([data-vibeui-block="faq-005"]){
--vibeui-faq-005-bg:transparent;
--vibeui-faq-005-ink:light-dark(oklch(0.22 0 240),oklch(0.95 0 240));
--vibeui-faq-005-muted:light-dark(oklch(0.5 0 240),oklch(0.72 0 240));
--vibeui-faq-005-border:light-dark(oklch(0.9 0 240),oklch(0.36 0 240));
--vibeui-faq-005-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-faq-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-005-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-005"]{color-scheme:dark}
[data-vibeui-block="faq-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-005-bg);color:var(--vibeui-faq-005-ink);
font-family:var(--vibeui-faq-005-font);
}
[data-vibeui-block="faq-005"] [data-part="shell"]{
max-width:56rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-005"] [data-part="heading"]{
margin:0;max-width:18ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
/* Поле и список — компоненты, им отдаётся вся ширина колонки. */
[data-vibeui-block="faq-005"] [data-part="search"]{margin-top:1.5rem;max-width:none}
[data-vibeui-block="faq-005"] [data-part="count"]{
margin:0.625rem 0 0;color:var(--vibeui-faq-005-muted);font-size:0.8125rem;
}
[data-vibeui-block="faq-005"] [data-part="list"]{margin-top:1.5rem;width:100%;max-width:none}
[data-vibeui-block="faq-005"] [data-part="empty"]{
margin:1.5rem 0 0;padding:1.5rem;border:1px dashed var(--vibeui-faq-005-border);border-radius:1rem;
color:var(--vibeui-faq-005-muted);font-size:0.9375rem;line-height:1.55;
}
@container (min-width: 40rem){
[data-vibeui-block="faq-005"] [data-part="shell"]{padding:4.5rem 2rem}
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

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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

/** Вопросы с поиском: поле input-004, список accordion-007, счётчик — вслух. */
export function Faq005({
  title = "Найдите ответ за десять секунд",
  placeholder = "Например: когда привезут заказ",
  emptyLabel = "Ничего не нашлось. Попробуйте другое слово или напишите в поддержку — ответим в течение часа.",
  searchLabel = "Поиск по вопросам",
  countText = "Показано вопросов: {found} из {total}",
  items = DEFAULT_ITEMS,
  showTopic = true,
  marker = "chevron",
  background = "",
  accent,
  className,
  style,
}: Faq005Props) {
  const [query, setQuery] = useState("")

  const found = useMemo(
    () => (query.trim() ? items.filter((item) => matches(item, query)) : items),
    [items, query],
  )

  const palette = {
    ...(accent ? { "--vibeui-faq-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          <Heading001
            data-part="heading"
            title={title}
            accent={accent}
          />
          <Input004
            data-part="search"
            label={searchLabel}
            placeholder={placeholder}
            shortcut=""
            defaultValue=""
            text={{ idle: "", searching: "" }}
            onChange={setQuery}
            accent={accent}
          />
          <p data-part="count" aria-live="polite">
            {countText
              .replace("{found}", String(found.length))
              .replace("{total}", String(items.length))}
          </p>
          {found.length > 0 ? (
            <Accordion007
              marker={marker}
              badge={showTopic}
              data-part="list"
              items={found.map((item) => ({
                title: item.question,
                body: item.answer,
                badge: item.topic,
              }))}
              accent={accent}
            />
          ) : null}
          {found.length === 0 ? <p data-part="empty">{emptyLabel}</p> : null}
        </div>
      </section>
    </>
  )
}
