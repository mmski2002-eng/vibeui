import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion001,
  type Accordion001Item,
} from "@/registry/components/accordion/accordion-001/accordion-001"
import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Card024 } from "@/registry/components/card/card-024/card-024"

type Faq008Item = Accordion001Item

export type Faq008Props = {
  title?: string
  items?: Faq008Item[]
  cardTitle?: string
  cardText?: string
  buttonLabel?: string
  buttonHref?: string
  /** Мелкая строка под кнопкой: когда ждать ответ. */
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  tint?: "neutral" | "accent"
  buttonTone?: "neutral" | "accent"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Список вопросов и карточка поддержки рядом, а не после списка: тот, кто не
// нашёл ответ, бросает чтение посередине — и кнопка «написать» обязана быть
// в поле зрения именно там. Раскладка считается от собственной ширины блока.
// Составной блок: список — accordion-001, карточка — card-024, кнопка в
// ней — button-016.
const STYLES = `

:where([data-vibeui-block="faq-008"]){
--vibeui-faq-008-bg:transparent;
--vibeui-faq-008-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-faq-008-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-008-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-008-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-008-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-008-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-faq-008-on-accent:oklch(from var(--vibeui-faq-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-008-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-008"]{color-scheme:dark}
[data-vibeui-block="faq-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-008-bg);color:var(--vibeui-faq-008-ink);
font-family:var(--vibeui-faq-008-font);
}
[data-vibeui-block="faq-008"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-008"] [data-part="heading"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-008"] [data-part="columns"]{display:grid;gap:2rem;align-items:start}
/* Список — accordion-001, кнопка — button-016: им отдаётся ширина колонки. */
[data-vibeui-block="faq-008"] [data-part="list"]{width:100%;max-width:none}
@container (min-width: 48rem){
[data-vibeui-block="faq-008"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-008"] [data-part="columns"]{grid-template-columns:minmax(0,1fr) 19rem;gap:3rem}
[data-vibeui-block="faq-008"] [data-part="help"]{position:sticky;top:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq008Item[] = [
  {
    question: "Чем блок из каталога лучше сгенерированного с нуля?",
    answer:
      "Блок уже свёрстан, проверен на обеих темах и на узких экранах. Агенту остаётся подставить контент, а не изобретать раскладку — меньше правок, предсказуемый результат.",
  },
  {
    question: "Что получает AI-агент по кнопке Copy for AI?",
    answer:
      "Инструкцию с идентификатором блока, командой установки и списком того, что нельзя менять: анимации, отступы, поведение на узких экранах. Агент ставит настоящий файл, а не пересказ.",
  },
  {
    question: "Блок сломается при обновлении зависимостей проекта?",
    answer:
      "Нет: у блока их нет. Один файл, стили внутри, никаких пакетов — обновлять и синхронизировать нечего.",
  },
  {
    question: "Как поменять цвета под бренд?",
    answer:
      "Все цвета лежат в локальных CSS-переменных в начале файла. Переопределите их — и блок перекрасится, не трогая остальную вёрстку.",
  },
  {
    question: "Можно ли ставить несколько блоков на одну страницу?",
    answer:
      "Да, блоки не знают друг о друге и не конфликтуют: у каждого своя палитра и свой префикс переменных.",
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

/** accordion-001 и липкая карточка «не нашли — напишите» с button-016 рядом. */
export function Faq008({
  title = "Вопросы о работе с каталогом",
  items = DEFAULT_ITEMS,
  cardTitle = "Не нашли свой вопрос?",
  cardText = "Напишите нам — разберём ваш случай и добавим ответ в этот список, чтобы следующему было проще.",
  buttonLabel = "Написать в поддержку",
  buttonHref = "#support",
  note = "Отвечаем в течение рабочего дня.",
  tint = "accent",
  buttonTone = "accent",
  background = "",
  accent,
  className,
  style,
}: Faq008Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-008-accent": accent,
          "--vibeui-faq-008-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            accent={accent}
          />
          <div data-part="columns">
            <Accordion001
              data-part="list"
              items={items}
              exclusive={false}
              marker="chevron"
              divider="line"
              accent={accent}
            />
            <Card024
              tint={tint}
              data-part="help"
              title={cardTitle}
              text={cardText}
              note={note}
              accent={accent}
              background={background || undefined}
            >
              <Button016
                tone={buttonTone}
                label={buttonLabel}
                href={buttonHref}
                external={false}
                size="lg"
                accent={accent}
              />
            </Card024>
          </div>
        </div>
      </section>
    </>
  )
}
