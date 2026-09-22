import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion001,
  type Accordion001Item,
  type Accordion001Marker,
} from "@/registry/components/accordion/accordion-001/accordion-001"
import { Badge001 } from "@/registry/components/badge/badge-001/badge-001"
import {
  Button016,
  type Button016Props,
} from "@/registry/components/button/button-016/button-016"

export type Faq024Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: Accordion001Item[]
  contactLabel?: string
  contactHref?: string
  /** Значок раздела аккордеона — ручка accordion-001, проброшенная наверх. */
  marker?: Accordion001Marker
  /** Первый вопрос открыт сразу. */
  openFirst?: boolean
  /** Контур или заливка кнопки «задать вопрос» — ручка button-016. */
  buttonTone?: Button016Props["tone"]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Составной блок: секция FAQ собрана из компонентов каталога, а не
// нарисована заново. Плашка над заголовком — badge-001, «задать вопрос» —
// кнопка-ссылка button-016, список вопросов — accordion-001 на нативных
// details/summary без JS. Блок владеет только раскладкой и своим текстом:
// две колонки от 56rem, слева заголовок, справа аккордеон. Компонентам он
// передаёт пропсы (accent), их палитру и поведение не трогает — иначе блок
// ломался бы при правке компонента.
const STYLES = `
:where([data-vibeui-block="faq-024"]){
--vibeui-faq-024-bg:transparent;
--vibeui-faq-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-024-muted:color-mix(in oklab,var(--vibeui-faq-024-fg) 60%,transparent);
--vibeui-faq-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-024"]{color-scheme:dark}
:where([data-vibeui-block="faq-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-024"]{
box-sizing:border-box;padding:5rem 0;
background:var(--vibeui-faq-024-bg);color:var(--vibeui-faq-024-fg);
font-family:var(--vibeui-faq-024-font);font-size:1rem;line-height:1.5;
}
[data-vibeui-block="faq-024"] *{box-sizing:border-box}
[data-vibeui-block="faq-024"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:0 1.25rem;
display:grid;gap:2.5rem;align-items:start;
}
[data-vibeui-block="faq-024"] [data-part="intro"]{display:grid;gap:1rem;justify-items:start}
/* Аккордеон меряет собственную ширину и в узкой колонке сам ужимается;
   блоку остаётся отдать ему всю правую колонку. */
[data-vibeui-block="faq-024"] [data-part="list"]{width:100%;max-width:none}
@container (min-width: 56rem){
[data-vibeui-block="faq-024"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-024"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё тёмный фон при tone="auto" получил
 * бы светлую ветку light-dark() и тёмный текст: схема смотрит на окружение,
 * а не на цвет фона. Части внутри следуют схеме секции.
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

const DEFAULT_ITEMS: Accordion001Item[] = [
  {
    question: "Что именно я получаю после установки?",
    answer:
      "Файлы компонентов в вашем проекте — те же, что вы видели в превью. Ни сборки, ни обёрток, ни привязки к нашей теме.",
  },
  {
    question: "Блок собран из других компонентов — их тоже нужно ставить?",
    answer:
      "Нет, отдельно ничего ставить не надо: команда установки блока приносит и его части. В проекте появятся три файла рядом.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Каждый компонент несёт собственную палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
  },
  {
    question: "Можно ли заменить аккордеон на другой?",
    answer:
      "Да: блок передаёт списку только вопросы и акцент. Поставьте любой аккордеон каталога с теми же пропсами — раскладка не изменится.",
  },
]

/**
 * FAQ из компонентов каталога: badge-001 над заголовком, button-016 для
 * «задать вопрос», accordion-001 в правой колонке. Ставится одной командой
 * вместе со своими частями.
 */
export function Faq024({
  eyebrow = "Вопросы",
  title = "Спрашивают перед установкой",
  lede = "Коротко о том, что приезжает в проект и как это подружить с вашей темой. Не нашли ответ — напишите.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать вопрос",
  contactHref = "#",
  marker = "plus",
  openFirst = true,
  buttonTone = "neutral",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Faq024Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-024-bg": background,
          colorScheme: tone === "auto" ? schemeForBackground(background) : undefined,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-024" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-024"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="intro">
            {eyebrow ? (
              <Badge001 tone="info" size="sm">
                {eyebrow}
              </Badge001>
            ) : null}
            <Heading001
              data-part="heading"
              title={title}
              lede={lede}
              size="lg"
              accent={accent}
            />
            {contactLabel ? (
              <Button016
  size="lg"
                label={contactLabel}
                href={contactHref}
                external={false}
                tone={buttonTone}
                accent={accent}
              />
            ) : null}
          </div>
          <Accordion001
            data-part="list"
            items={items}
            marker={marker}
            divider="line"
            defaultOpen={openFirst ? 0 : -1}
            group="vibeui-faq-024"
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
