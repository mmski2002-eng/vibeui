import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion015,
  type Accordion015Item,
} from "@/registry/components/accordion/accordion-015/accordion-015"

type Faq002Item = Accordion015Item

export type Faq002Props = {
  title?: string
  description?: string
  items?: Faq002Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  numbered?: boolean
  columns?: 1 | 2 | 3
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Составной блок: вопросы в две колонки — accordion-015 с нумерацией,
// блок владеет заголовком, подводкой и полями секции. Компоненту уходят
// только items и accent.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="faq-002"]){
--vibeui-faq-002-bg:transparent;
--vibeui-faq-002-ink:light-dark(oklch(0.22 0 255),oklch(0.95 0 255));
--vibeui-faq-002-muted:light-dark(oklch(0.5 0 255),oklch(0.72 0 255));
--vibeui-faq-002-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-faq-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-002"]{color-scheme:dark}
[data-vibeui-block="faq-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-002-bg);color:var(--vibeui-faq-002-ink);
font-family:var(--vibeui-faq-002-font);
}
[data-vibeui-block="faq-002"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:3rem 1.25rem;
}
/* Карточки в колонки — accordion-015: сам решает, когда сворачиваться в
   одну, блоку остаётся отдать ему всю ширину. */
[data-vibeui-block="faq-002"] [data-part="list"]{margin-top:2rem;width:100%;max-width:none}
@container (min-width: 44rem){
[data-vibeui-block="faq-002"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-002"] [data-part="list"]{margin-top:2.5rem}
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

/** Вопросы в две колонки из accordion-015: ставится одной командой с ним. */
export function Faq002({
  title = "Вопросы, которые задают до оплаты",
  description = "Собрали то, о чём чаще всего спрашивают в чате поддержки. Если вашего вопроса тут нет — напишите, мы добавим.",
  items = DEFAULT_ITEMS,
  numbered = true,
  columns = 2,
  background = "",
  accent,
  className,
  style,
}: Faq002Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          <Heading001
            data-part="heading"
            title={title}
            lede={description}
            ledeWidth={60}
            accent={accent}
          />
          <Accordion015
            columns={columns}
            numbered={numbered}
            data-part="list"
            items={items}
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
