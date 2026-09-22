import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion001,
  type Accordion001Item,
} from "@/registry/components/accordion/accordion-001/accordion-001"
import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Card024 } from "@/registry/components/card/card-024/card-024"
import { Input001 } from "@/registry/components/input/input-001/input-001"

type Faq013Item = Accordion001Item

export type Faq013Props = {
  title?: string
  items?: Faq013Item[]
  formTitle?: string
  placeholder?: string
  buttonLabel?: string
  /** Мелкая строка под формой: куда уйдёт вопрос и когда ждать ответ. */
  formHint?: string
  /** Адрес обработчика формы. По умолчанию «#» — подставьте свой. */
  formAction?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  tint?: "neutral" | "accent"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Аккордеон плюс форма «задать свой вопрос» внизу: тот, кто дочитал список
// до конца и не нашёл ответ, получает выход прямо здесь, а не ссылку на
// другую страницу. Форма — чистая разметка без обработчика: адрес приёма
// подставляется пропом formAction. Раскладка считается от ширины блока.
// Составной блок: список — accordion-001, плашка формы — card-024, в её
// слоте поле input-001 и кнопка button-001; сама <form> остаётся у блока.
const STYLES = `[data-vibeui-block="faq-013"] [data-part="list"]{margin:0 0 2rem}

:where([data-vibeui-block="faq-013"]){
--vibeui-faq-013-bg:transparent;
--vibeui-faq-013-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-013-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-013-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-013-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-013-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-013-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-faq-013-on-accent:oklch(from var(--vibeui-faq-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-013-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-013"]{color-scheme:dark}
[data-vibeui-block="faq-013"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-013-bg);color:var(--vibeui-faq-013-ink);
font-family:var(--vibeui-faq-013-font);
}
[data-vibeui-block="faq-013"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-013"] [data-part="heading"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-013"] [data-part="list"]{width:100%;max-width:none}
/* Форма в слоте карточки card-024 занимает всю её ширину. */
[data-vibeui-block="faq-013"] [data-part="ask"]{margin-top:2rem}
[data-vibeui-block="faq-013"] [data-part="row"]{display:flex;flex-wrap:wrap;align-items:flex-start;gap:0.625rem;width:100%}
/* Поле растягивается на остаток строки: у input-001 нет своей ширины. */
[data-vibeui-block="faq-013"] [data-part="row"] > [data-vibeui-block="input-001"]{flex:1 1 14rem;min-width:0}
@container (min-width: 40rem){
[data-vibeui-block="faq-013"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq013Item[] = [
  {
    question: "Как быстро агент собирает страницу из блоков?",
    answer:
      "Секция ставится за одну команду, страница из пяти-шести секций собирается за один сеанс работы с агентом — большую часть времени занимает ваш контент, а не вёрстка.",
  },
  {
    question: "Нужно ли уметь программировать?",
    answer:
      "Нет. Достаточно выбрать блоки в каталоге и передать инструкции агенту. Код появляется в проекте готовым, править его руками не обязательно.",
  },
  {
    question:
      "Что будет, если попросить агента «сделать похожее» без каталога?",
    answer:
      "Агент сгенерирует секцию заново, и результат каждый раз разный: плывут отступы, ломается мобильная вёрстка. Инструкция из каталога ставит проверенный файл — итог предсказуем.",
  },
  {
    question: "Блоки совместимы между собой?",
    answer:
      "Да, каждый живёт в своих стилях и не влияет на соседей. Любые секции каталога можно ставить на одну страницу в любом порядке.",
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

/** accordion-001 с формой «задать свой вопрос» из input-001 и button-001. */
export function Faq013({
  title = "Спрашивают перед стартом",
  items = DEFAULT_ITEMS,
  formTitle = "Не нашли ответа? Задайте свой вопрос",
  placeholder = "Например: подойдёт ли каталог для интернет-магазина?",
  buttonLabel = "Отправить",
  formHint = "Вопрос попадёт команде каталога. Отвечаем на почту в течение рабочего дня.",
  formAction = "#",
  tint = "accent",
  background = "",
  accent,
  className,
  style,
}: Faq013Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-013-accent": accent,
          "--vibeui-faq-013-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            accent={accent}
          />
          <Accordion001
            data-part="list"
            items={items}
            exclusive={false}
            marker="plus"
            divider="line"
            accent={accent}
          />
          <Card024
            tint={tint}
            data-part="ask"
            title={formTitle}
            text=""
            note={formHint}
            accent={accent}
            background={background || undefined}
          >
            <form data-part="row" action={formAction} method="get">
              {/* Плавающая подпись поля и есть подсказка-пример: placeholder
                  у input-001 нет намеренно, он пропадает вместе с контекстом. */}
              <Input001
                name="question"
                required
                label={placeholder}
                accent={accent}
              />
              <Button001 type="submit" accent={accent}>
                {buttonLabel}
              </Button001>
            </form>
          </Card024>
        </div>
      </section>
    </>
  )
}
