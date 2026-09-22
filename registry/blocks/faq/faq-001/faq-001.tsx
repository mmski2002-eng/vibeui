import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion002,
  type Accordion002Item,
} from "@/registry/components/accordion/accordion-002/accordion-002"
import { Button077 } from "@/registry/components/button/button-077/button-077"

type Faq001Item = Accordion002Item

export type Faq001Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: Faq001Item[]
  /** Ссылка «остались вопросы» под списком. */
  contactLabel?: string
  contactHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  elevation?: "lift" | "ring" | "flat"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: раскладка в две
// колонки включается от ширины блока, а не окна, поэтому миниатюра каталога
// показывает настоящий дизайн.
//
// Составной блок: список вопросов — accordion-002 (карточки на нативных
// details, разделы независимы: на странице вопросов открывают несколько
// сразу), ссылка «задать вопрос» — button-077. Блок владеет раскладкой и
// заголовком, частям передаёт только пропсы.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `[data-vibeui-block="faq-001"] [data-part="contact"]{margin-top:0.375rem}

:where([data-vibeui-block="faq-001"]){
--vibeui-faq-001-bg:transparent;
--vibeui-faq-001-ink:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-faq-001-muted:light-dark(oklch(0.5 0 265),oklch(0.72 0 265));
--vibeui-faq-001-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-faq-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-001"]{color-scheme:dark}
[data-vibeui-block="faq-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-faq-001-bg);color:var(--vibeui-faq-001-ink);
font-family:var(--vibeui-faq-001-sans);
}
[data-vibeui-block="faq-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3.5rem 1.5rem;
display:grid;gap:2rem;
}
[data-vibeui-block="faq-001"] [data-part="intro"]{display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem}
[data-vibeui-block="faq-001"] [data-part="contact"]{margin-top:0.375rem}
/* Карточки аккордеона получают всю правую колонку. */
[data-vibeui-block="faq-001"] [data-part="list"]{width:100%;max-width:none}
/* От 56rem — вопросы справа, заголовок слева и остаётся на месте. */
@container (min-width: 56rem){
[data-vibeui-block="faq-001"] [data-part="frame"]{
grid-template-columns:22rem 1fr;gap:3rem;padding:5rem 3rem;
}
[data-vibeui-block="faq-001"] [data-part="intro"]{position:sticky;top:2rem;align-self:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq001Item[] = [
  {
    question: "Что я получаю после установки блока?",
    answer:
      "Один файл в вашем проекте — тот же самый, который вы видели в превью. Ни сборки, ни обёрток, ни привязки к нашей теме: блок несёт собственную палитру и работает в любом React-проекте.",
  },
  {
    question: "Агент действительно ставит именно этот компонент?",
    answer:
      "Да. Copy for AI даёт ссылку с инструкцией: идентификатор компонента, команда установки и список того, что нельзя менять. Агент скачивает файл из реестра, а не пересоздаёт похожий по описанию.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Переопределите локальные переменные блока — он встанет в вашу тему, не трогая остальной проект. Менять сам файл не нужно: цвета, радиусы и акценты вынесены в переменные.",
  },
  {
    question: "Нужны ли дополнительные библиотеки?",
    answer:
      "Зависимости объявлены в метаданных каждого блока, и у большинства их ноль: только React. Иконочные библиотеки не требуются — значки нарисованы на CSS.",
  },
  {
    question: "Можно ли использовать блоки в коммерческих проектах?",
    answer:
      "Да. После установки файл принадлежит вашему проекту: правьте, переименовывайте и публикуйте вместе с сайтом.",
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

/**
 * Секция вопросов и ответов из компонентов каталога: accordion-002 и
 * button-077. Ставится одной командой вместе со своими частями.
 */
export function Faq001({
  eyebrow = "Вопросы",
  title = "Коротко о том, как это работает",
  description = "Если ответа здесь нет — напишите, мы отвечаем в течение рабочего дня.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать свой вопрос",
  contactHref = "#contact",
  marker = "plus",
  elevation = "ring",
  background = "",
  accent,
  className,
  style,
}: Faq001Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="intro">
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              accent={accent}
            />
            {contactLabel ? (
              <Button077
                data-part="contact"
                label={contactLabel}
                href={contactHref}
                accent={accent}
              />
            ) : null}
          </div>
          <Accordion002
            elevation={elevation}
            marker={marker}
            data-part="list"
            items={items}
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
