import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion001,
  type Accordion001Item,
} from "@/registry/components/accordion/accordion-001/accordion-001"
import { Button077 } from "@/registry/components/button/button-077/button-077"

type Faq014Item = Accordion001Item

export type Faq014Props = {
  title?: string
  items?: Faq014Item[]
  linkLabel?: string
  linkHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мини-FAQ для конца лендинга: три главных вопроса и ссылка на полную
// страницу. Компактность намеренная — перед призывом к действию человек
// снимает последние сомнения, а не читает справочник. Раскладка считается
// от собственной ширины блока (container queries), а не от ширины окна.
// Составной блок: список — accordion-001, ссылка — button-077.
const STYLES = `[data-vibeui-block="faq-014"] [data-part="heading"]{margin-bottom:1.25rem}

[data-vibeui-block="faq-014"] [data-part="more"]{margin-top:1.25rem}

:where([data-vibeui-block="faq-014"]){
--vibeui-faq-014-bg:transparent;
--vibeui-faq-014-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-014-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-014-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-014-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-014-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-014"]{color-scheme:dark}
[data-vibeui-block="faq-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-014-bg);color:var(--vibeui-faq-014-ink);
font-family:var(--vibeui-faq-014-font);
}
[data-vibeui-block="faq-014"] [data-part="shell"]{max-width:40rem;margin:0 auto;padding:2.5rem 1.25rem}
[data-vibeui-block="faq-014"] [data-part="list"]{width:100%;max-width:none}
[data-vibeui-block="faq-014"] [data-part="more"]{margin-top:1.25rem}
@container (min-width: 36rem){
[data-vibeui-block="faq-014"] [data-part="shell"]{padding:3.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq014Item[] = [
  {
    question: "Это бесплатно?",
    answer:
      "Да, открытая часть каталога бесплатна, включая коммерческие проекты. Платные наборы будут помечены отдельно.",
  },
  {
    question: "Нужно ли уметь программировать?",
    answer:
      "Нет: выбираете блок, копируете инструкцию для AI — агент сам ставит компонент в проект.",
  },
  {
    question: "Что я получаю после установки?",
    answer:
      "Один файл в вашем проекте без зависимостей. Он ваш: меняйте контент и цвета, деплойте куда угодно.",
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

/** Мини-FAQ для конца лендинга: accordion-001 и ссылка button-077. */
export function Faq014({
  title = "Остались вопросы?",
  items = DEFAULT_ITEMS,
  linkLabel = "Все вопросы и ответы",
  linkHref = "#faq",
  marker = "plus",
  background = "",
  accent,
  className,
  style,
}: Faq014Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            size="sm"
            accent={accent}
          />
          <Accordion001
            marker={marker}
            data-part="list"
            items={items}
            exclusive={false}
            divider="line"
            accent={accent}
          />
          <Button077
            data-part="more"
            label={linkLabel}
            href={linkHref}
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
