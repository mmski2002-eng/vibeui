import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Accordion007 } from "@/registry/components/accordion/accordion-007/accordion-007"

type Faq007Item = {
  question: string
  answer: string
}

type Faq007Group = {
  label: string
  items: Faq007Item[]
}

export type Faq007Props = {
  eyebrow?: string
  title?: string
  /** Подпись чипа «показать всё». */
  allLabel?: string
  /** До четырёх категорий: правила фильтра написаны заранее. */
  groups?: Faq007Group[]
  /** Имя группы радио: на странице с двумя блоками должно различаться. */
  id?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Фильтр по категориям на радио-кнопках: выбранный чип прячет чужие вопросы
// правилами :checked ~, поэтому клиентского JS нет вовсе. Раскладка считается
// от собственной ширины блока (container queries), а не от ширины окна.
// Составной блок: вопросы каждой категории — свой accordion-007 с меткой
// группы, блоку остаются чипы и заголовок.
const STYLES = `
:where([data-vibeui-block="faq-007"]){
--vibeui-faq-007-bg:transparent;
--vibeui-faq-007-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-007-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-007-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-faq-007-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-007-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-faq-007-on-accent:oklch(from var(--vibeui-faq-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-007"]{color-scheme:dark}
[data-vibeui-block="faq-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-007-bg);color:var(--vibeui-faq-007-ink);
font-family:var(--vibeui-faq-007-font);
}
[data-vibeui-block="faq-007"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-007"] [data-part="heading"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-007"] [data-part="radio"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;
}
[data-vibeui-block="faq-007"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 1.5rem;
}
[data-vibeui-block="faq-007"] [data-part="chip"]{
display:inline-flex;align-items:center;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-faq-007-border);border-radius:999px;
color:var(--vibeui-faq-007-muted);font-size:0.8125rem;font-weight:600;cursor:pointer;
transition:border-color var(--vibeui-faq-007-dur-2) ease,background var(--vibeui-faq-007-dur-2) ease,color var(--vibeui-faq-007-dur-2) ease;
}
[data-vibeui-block="faq-007"] [data-part="chip"]:hover{
border-color:color-mix(in oklab,var(--vibeui-faq-007-accent) 45%,var(--vibeui-faq-007-border));
color:var(--vibeui-faq-007-ink);
}
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(1):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(1),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(2),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(3),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(4),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="chips"] [data-part="chip"]:nth-of-type(5){
background:var(--vibeui-faq-007-accent-fill);border-color:var(--vibeui-faq-007-accent-fill);
color:var(--vibeui-faq-007-on-accent);
}
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(1):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(1),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(2),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(3),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(4),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):focus-visible ~ [data-part="chips"] [data-part="chip"]:nth-of-type(5){
outline:2px solid var(--vibeui-faq-007-accent);outline-offset:2px;
}
/* Каждая категория — свой accordion-007 с меткой группы справа; выбранный
   чип прячет чужие группы целиком. */
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="list"] > [data-group]:not([data-group="1"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="list"] > [data-group]:not([data-group="2"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="list"] > [data-group]:not([data-group="3"]),
[data-vibeui-block="faq-007"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="list"] > [data-group]:not([data-group="4"]){
display:none;
}
[data-vibeui-block="faq-007"] [data-part="list"]{display:grid;gap:0.625rem}
[data-vibeui-block="faq-007"] [data-part="list"] > [data-group]{width:100%;max-width:none}
@container (min-width: 40rem){
[data-vibeui-block="faq-007"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Faq007Group[] = [
  {
    label: "Установка",
    items: [
      {
        question: "Как компонент попадает в мой проект?",
        answer:
          "Командой установки из карточки или ссылкой из Copy for AI: файл скачивается из registry и ложится в components/vibeui. Никакой сборки и настройки — это обычный файл проекта.",
      },
      {
        question: "Нужен ли Tailwind или библиотека компонентов?",
        answer:
          "Нет. Стили лежат в самом файле обычным CSS с собственными переменными, поэтому блок работает в любом React-проекте независимо от вашей системы стилей.",
      },
    ],
  },
  {
    label: "Оплата",
    items: [
      {
        question: "Сколько стоит использование блоков?",
        answer:
          "Каталог открыт: берите блоки и в личные, и в коммерческие проекты. Если появятся платные наборы, они будут помечены отдельно ещё до установки.",
      },
      {
        question: "Нужна ли подписка, чтобы блок продолжал работать?",
        answer:
          "Нет. После установки файл принадлежит вашему проекту и ни к чему не подключается. Обновление — это просто установка новой версии поверх.",
      },
    ],
  },
  {
    label: "Лицензия",
    items: [
      {
        question: "Можно ли использовать блоки в клиентских проектах?",
        answer:
          "Да, без ограничений: файл после установки — часть вашего проекта, его можно менять, переименовывать и передавать заказчику вместе с сайтом.",
      },
      {
        question: "Нужно ли указывать авторство?",
        answer:
          "Нет, ссылка на каталог не обязательна. Мы будем рады упоминанию, но лицензия его не требует.",
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

/** Вопросы с фильтром-чипами: радио-CSS без JS, списки — accordion-007. */
export function Faq007({
  eyebrow = "Вопросы",
  title = "Ответы по каждой части сделки",
  allLabel = "Все",
  groups = DEFAULT_GROUPS,
  id = "vibeui-faq-007",
  marker = "plus",
  background = "",
  accent,
  className,
  style,
}: Faq007Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-faq-007-accent": accent,
          "--vibeui-faq-007-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-faq-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const visibleGroups = groups.slice(0, 4)

  return (
    <>
      <style href="vibeui-faq-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-007"
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
          <div data-part="filter">
            <input
              data-part="radio"
              type="radio"
              name={id}
              id={`${id}-all`}
              defaultChecked
            />
            {visibleGroups.map((group, index) => (
              <input
                key={group.label}
                data-part="radio"
                type="radio"
                name={id}
                id={`${id}-group-${index + 1}`}
              />
            ))}
            <nav data-part="chips" aria-label="Категории вопросов">
              <label data-part="chip" htmlFor={`${id}-all`}>
                {allLabel}
              </label>
              {visibleGroups.map((group, index) => (
                <label
                  key={group.label}
                  data-part="chip"
                  htmlFor={`${id}-group-${index + 1}`}
                >
                  {group.label}
                </label>
              ))}
            </nav>
            <div data-part="list">
              {visibleGroups.map((group, groupIndex) => (
                <Accordion007
                  marker={marker}
                  key={group.label}
                  data-group={String(groupIndex + 1)}
                  items={group.items.map((item) => ({
                    title: item.question,
                    body: item.answer,
                    badge: group.label,
                  }))}
                  badge
                  accent={accent}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
