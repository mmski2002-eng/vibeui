import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Accordion001 } from "@/registry/components/accordion/accordion-001/accordion-001"
import { Accordion007 } from "@/registry/components/accordion/accordion-007/accordion-007"

type Faq010Item = {
  question: string
  answer: string
  /** Частый вопрос: попадает наверх, открыт и помечен бейджем. */
  popular?: boolean
}

export type Faq010Props = {
  title?: string
  badgeLabel?: string
  /** Заголовок над свёрнутой частью списка. */
  restLabel?: string
  items?: Faq010Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Частые вопросы подняты наверх, раскрыты и помечены бейджем: большинству
// хватит первых трёх ответов без единого клика. Остальное свёрнуто ниже и не
// мешает. Раскладка считается от собственной ширины блока, а не окна.
// Составной блок: частые — карточки accordion-007 с бейджем, остальные —
// список accordion-001.
const STYLES = `

:where([data-vibeui-block="faq-010"]){
--vibeui-faq-010-bg:transparent;
--vibeui-faq-010-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-faq-010-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-faq-010-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-faq-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-010"]{color-scheme:dark}
[data-vibeui-block="faq-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-010-bg);color:var(--vibeui-faq-010-ink);
font-family:var(--vibeui-faq-010-font);
}
[data-vibeui-block="faq-010"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="faq-010"] [data-part="heading"]{
margin:0 0 1.75rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-010"] [data-part="popular"]{display:grid;gap:0.75rem;margin:0 0 2rem}
[data-vibeui-block="faq-010"] [data-part="rest-label"]{
margin:0 0 0.875rem;
color:var(--vibeui-faq-010-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-010"] [data-part="rest"]{width:100%;max-width:none}
@container (min-width: 40rem){
[data-vibeui-block="faq-010"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq010Item[] = [
  {
    question: "Сколько стоит каталог?",
    answer:
      "Открытая часть бесплатна и для личных, и для коммерческих проектов. Платные наборы, если появятся, будут помечены отдельно ещё до установки.",
    popular: true,
  },
  {
    question: "Что именно я получаю после установки блока?",
    answer:
      "Один файл в вашем проекте — тот же, что вы видели в превью. Без сборки, обёрток и привязки к нашей теме: у блока своя палитра и ноль зависимостей.",
    popular: true,
  },
  {
    question: "Агент действительно ставит этот компонент, а не похожий?",
    answer:
      "Да. Copy for AI передаёт агенту идентификатор блока и команду установки, поэтому он скачивает настоящий файл из registry, а не пересоздаёт что-то по описанию.",
    popular: true,
  },
  {
    question: "Как перекрасить блок под свой бренд?",
    answer:
      "Переопределите локальные CSS-переменные в начале файла: цвета, акцент и радиусы лежат там. Остальную вёрстку трогать не нужно.",
  },
  {
    question: "Работают ли блоки с тёмной темой?",
    answer:
      "Да, палитра собрана на light-dark(): блок следует за темой страницы автоматически, без отдельной тёмной версии.",
  },
  {
    question: "Можно ли редактировать установленный файл?",
    answer:
      "Нужно: файл принадлежит вашему проекту. Меняйте контент и цвета свободно; раскладку и поведение на узких экранах лучше сохранить.",
  },
  {
    question: "Что делать, если блок отобразился неправильно?",
    answer:
      "Чаще всего у проекта не объявлен color-scheme: light dark на html — без него палитра остаётся светлой. Если дело не в этом, напишите нам и приложите скриншот.",
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

/** Частые вопросы наверху в accordion-007 с бейджем, остальные — accordion-001. */
export function Faq010({
  title = "Ответы, которые ищут чаще всего",
  badgeLabel = "Частый вопрос",
  restLabel = "Остальные вопросы",
  items = DEFAULT_ITEMS,
  marker = "plus",
  background = "",
  accent,
  className,
  style,
}: Faq010Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const popular = items.filter((item) => item.popular)
  const rest = items.filter((item) => !item.popular)

  return (
    <>
      <style href="vibeui-faq-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            accent={accent}
          />
          {popular.length > 0 ? (
            <div data-part="popular">
              {/* Каждый частый вопрос — свой accordion-007, раскрытый сразу:
                  компонент открывает один раздел, а раскрытыми должны быть все. */}
              {popular.map((item) => (
                <Accordion007
                  key={item.question}
                  items={[{ title: item.question, body: item.answer, badge: badgeLabel }]}
                  badge
                  defaultOpen={0}
                  marker="plus"
                  accent={accent}
                />
              ))}
            </div>
          ) : null}
          {rest.length > 0 ? (
            <>
              <h3 data-part="rest-label">{restLabel}</h3>
              <Accordion001
                marker={marker}
                data-part="rest"
                items={rest.map((item) => ({ question: item.question, answer: item.answer }))}
                exclusive={false}
                divider="line"
                accent={accent}
              />
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
