import type { CSSProperties } from "react"

import {
  Accordion001,
  type Accordion001Item,
} from "@/registry/components/accordion/accordion-001/accordion-001"

type Faq004Item = Accordion001Item

export type Faq004Props = {
  eyebrow?: string
  title?: string
  items?: Faq004Item[]
  name?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  marker?: "chevron" | "triangle" | "square" | "plus" | "none"
  openFirst?: boolean
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Согласованный аккордеон без единой строки JS — accordion-001 в режиме
// exclusive: у всех <details> одинаковый атрибут name, и браузер сам
// закрывает предыдущий ответ при открытии следующего. Это ровно тот случай,
// когда одновременное раскрытие вредно — длинные ответы про условия читают
// по одному. Составной блок: ему остаются заголовок и поля секции.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="faq-004"]){
--vibeui-faq-004-bg:transparent;
--vibeui-faq-004-ink:light-dark(oklch(0.21 0.02 60),oklch(0.94 0.008 75));
--vibeui-faq-004-muted:light-dark(oklch(0.48 0.02 60),oklch(0.71 0.015 75));
--vibeui-faq-004-border:light-dark(oklch(0.88 0.014 75),oklch(0.35 0.014 70));
--vibeui-faq-004-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-faq-004-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-faq-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-faq-004-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-004"]{color-scheme:dark}
[data-vibeui-block="faq-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-004-bg);color:var(--vibeui-faq-004-ink);
font-family:var(--vibeui-faq-004-font);
}
[data-vibeui-block="faq-004"] [data-part="shell"]{
max-width:52rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-004"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-faq-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="faq-004"] [data-part="title"]{
margin:0 0 2rem;max-width:18ch;
font-family:var(--vibeui-faq-004-serif);
font-size:clamp(1.75rem,5.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:600;
}
[data-vibeui-block="faq-004"] [data-part="list"]{width:100%;max-width:none}
@container (min-width: 40rem){
[data-vibeui-block="faq-004"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq004Item[] = [
  {
    question: "Кто владеет правами на макеты после сдачи?",
    answer:
      "Вы. Исключительные права переходят заказчику в момент подписания акта, отдельная лицензия не нужна. Исходники в Figma остаются у вас в аккаунте, мы просто теряем доступ.",
  },
  {
    question: "Что если результат не понравится?",
    answer:
      "На первом этапе мы показываем три направления и работаем дальше только с выбранным. Если ни одно не подошло, вы платите за этап и расходитесь без обязательств.",
  },
  {
    question: "Сколько правок входит в стоимость?",
    answer:
      "Правки не считаются штуками — считаются раунды. В каждый этап входит два раунда: замечания собираются списком и вносятся целиком, а не по одной за письмо.",
  },
  {
    question: "Работаете ли вы с разработчиками на стороне клиента?",
    answer:
      "Да, это обычная схема. Мы отдаём макеты, спецификацию состояний и разбор компонентов, а дальше отвечаем на вопросы команды в общем чате до конца сдачи.",
  },
  {
    question: "Как считается срок проекта?",
    answer:
      "От первого рабочего дня после аванса. Дни ожидания вашей обратной связи в срок не входят: если согласование заняло неделю, срок сдвигается на эту неделю.",
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

/** Один открытый ответ: accordion-001 в режиме exclusive, без JS. */
export function Faq004({
  eyebrow = "Условия работы",
  title = "Что спрашивают до подписания договора",
  items = DEFAULT_ITEMS,
  name = "vibeui-faq-004",
  marker = "chevron",
  openFirst = false,
  background = "",
  accent,
  className,
  style,
}: Faq004Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <Accordion001
            defaultOpen={openFirst ? 0 : -1}
            marker={marker}
            data-part="list"
            items={items}
            exclusive
            group={name}
            divider="line"
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
