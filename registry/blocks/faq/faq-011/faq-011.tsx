import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import {
  Accordion001,
  type Accordion001Item,
} from "@/registry/components/accordion/accordion-001/accordion-001"

type Faq011Item = Accordion001Item

type Faq011Group = {
  label: string
  description?: string
  items: Faq011Item[]
}

export type Faq011Props = {
  eyebrow?: string
  title?: string
  groups?: Faq011Group[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Двухуровневая структура: заголовок раздела слева, его вопросы справа.
// Разделы видны все сразу — человек прыгает к своей теме глазами, без
// вкладок и фильтров. Раскладка считается от собственной ширины блока.
// Составной блок: вопросы каждого раздела — свой accordion-001.
const STYLES = `[data-vibeui-block="faq-011"] [data-part="heading"]{margin-bottom:2.5rem}


:where([data-vibeui-block="faq-011"]){
--vibeui-faq-011-bg:transparent;
--vibeui-faq-011-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-011-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-011-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-011-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-011"]{color-scheme:dark}
[data-vibeui-block="faq-011"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-011-bg);color:var(--vibeui-faq-011-ink);
font-family:var(--vibeui-faq-011-font);
}
[data-vibeui-block="faq-011"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-011"] [data-part="group"]{
display:grid;gap:1rem;
padding:2rem 0;border-top:1px solid var(--vibeui-faq-011-border);
}
[data-vibeui-block="faq-011"] [data-part="group"]:last-of-type{border-bottom:1px solid var(--vibeui-faq-011-border)}
[data-vibeui-block="faq-011"] [data-part="group-label"]{
margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="faq-011"] [data-part="group-count"]{
color:var(--vibeui-faq-011-accent);font-size:0.8125rem;font-weight:700;margin-left:0.5rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="faq-011"] [data-part="group-note"]{
margin:0.375rem 0 0;color:var(--vibeui-faq-011-muted);font-size:0.875rem;line-height:1.5;max-width:26ch;
}
[data-vibeui-block="faq-011"] [data-part="group-list"]{width:100%;max-width:none}
@container (min-width: 44rem){
[data-vibeui-block="faq-011"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-011"] [data-part="group"]{grid-template-columns:15rem minmax(0,1fr);gap:3rem;padding:2.5rem 0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Faq011Group[] = [
  {
    label: "Оплата",
    description: "Тарифы, счета и что входит в бесплатную часть.",
    items: [
      {
        question: "Открытая часть каталога действительно бесплатна?",
        answer:
          "Да, включая коммерческое использование. Мы зарабатываем на платных наборах и услугах, а не на базовых блоках.",
      },
      {
        question: "Появятся ли платные блоки задним числом?",
        answer:
          "Нет. Установленный файл остаётся вашим навсегда; менять условия для уже скачанного мы не можем технически — блок ни к чему не подключён.",
      },
    ],
  },
  {
    label: "Установка",
    description: "Как блок попадает в проект и что для этого нужно.",
    items: [
      {
        question: "Какая команда ставит блок в проект?",
        answer:
          "Команда установки shadcn с адресом блока из карточки. Файл скачивается из registry и ложится в components/vibeui вашего проекта.",
      },
      {
        question: "Что нужно от проекта, чтобы блок заработал?",
        answer:
          "Только React. Стили внутри файла, зависимостей нет, к Tailwind и нашей теме блок не привязан.",
      },
      {
        question: "Можно ли обойтись без CLI?",
        answer:
          "Да: скопируйте исходник блока вручную в свой проект — это тот же файл, что ставит команда.",
      },
    ],
  },
  {
    label: "Лицензия",
    description: "Права на файлы после установки.",
    items: [
      {
        question: "Кому принадлежит установленный блок?",
        answer:
          "Вашему проекту. Меняйте, переименовывайте, продавайте вместе с сайтом — ограничений нет.",
      },
      {
        question: "Можно ли выкладывать проекты с блоками в открытый код?",
        answer:
          "Да. Блок становится обычным файлом вашего репозитория и наследует ту лицензию, которую вы выберете для проекта.",
      },
    ],
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

/** Вопросы по разделам: заголовок темы слева, accordion-001 справа. */
export function Faq011({
  eyebrow = "База знаний",
  title = "Вопросы по разделам",
  groups = DEFAULT_GROUPS,
  marker = "chevron",
  background = "",
  accent,
  className,
  style,
}: Faq011Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-011"
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
          {groups.map((group) => (
            <div key={group.label} data-part="group">
              <div>
                <h3 data-part="group-label">
                  {group.label}
                  <span data-part="group-count" aria-hidden="true">
                    {group.items.length}
                  </span>
                </h3>
                {group.description ? (
                  <p data-part="group-note">{group.description}</p>
                ) : null}
              </div>
              <Accordion001
                marker={marker}
                data-part="group-list"
                items={group.items}
                exclusive={false}
                divider="line"
                accent={accent}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
