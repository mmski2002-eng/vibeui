import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion015,
  type Accordion015Item,
} from "@/registry/components/accordion/accordion-015/accordion-015"

type Faq009Item = Accordion015Item

export type Faq009Props = {
  eyebrow?: string
  title?: string
  items?: Faq009Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  numbered?: boolean
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Нумерованные вопросы: порядковый номер делает список сканируемым.
// Составной блок — список целиком accordion-015 в один столбец, блоку
// остаются заголовок и поля секции.
const STYLES = `[data-vibeui-block="faq-009"] [data-part="heading"]{margin-bottom:2rem}


:where([data-vibeui-block="faq-009"]){
--vibeui-faq-009-bg:transparent;
--vibeui-faq-009-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-009-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-009"]{color-scheme:dark}
[data-vibeui-block="faq-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-009-bg);color:var(--vibeui-faq-009-ink);
font-family:var(--vibeui-faq-009-font);
}
[data-vibeui-block="faq-009"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-009"] [data-part="list"]{width:100%;max-width:none}
@container (min-width: 40rem){
[data-vibeui-block="faq-009"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq009Item[] = [
  {
    question: "С чего начать сборку страницы из блоков?",
    answer:
      "Выберите в каталоге секции под свой сценарий: обложка, преимущества, отзывы, вопросы. Каждую можно посмотреть вживую на обеих темах ещё до установки.",
  },
  {
    question: "Как передать выбранный блок AI-агенту?",
    answer:
      "Кнопка Copy for AI кладёт в буфер готовую инструкцию: идентификатор блока, команду установки и список того, что агент обязан сохранить. Останется вставить её в чат.",
  },
  {
    question: "Что агент не имеет права менять при установке?",
    answer:
      "Анимации, типографику, отступы и поведение на узких экранах — это зафиксировано в инструкции. Контент, ссылки и цвета бренда, наоборот, меняются свободно.",
  },
  {
    question: "Можно ли поменять порядок вопросов?",
    answer:
      "Да, переставьте элементы массива items: номера считаются по порядку сами, руками их проставлять не нужно.",
  },
  {
    question: "Что делать, если нужного блока в каталоге нет?",
    answer:
      "Напишите нам, какой сценарий не закрыт. Частые запросы попадают в план каталога первыми — так здесь появилась половина секций.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Нумерованные вопросы: accordion-015 в один столбец. */
export function Faq009({
  eyebrow = "Как это работает",
  title = "Пять шагов от каталога до готовой страницы",
  items = DEFAULT_ITEMS,
  numbered = true,
  background = "",
  accent,
  className,
  style,
}: Faq009Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <Accordion015
            numbered={numbered}
            data-part="list"
            items={items}
            columns={1}
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
