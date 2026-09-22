import type { CSSProperties } from "react"
import { Card043 } from "@/registry/components/card/card-043/card-043"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Testimonials012Quote = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  quote: string
  name: string
  role: string
}

type Testimonials012Segment = {
  label: string
  items: Testimonials012Quote[]
}

export type Testimonials012Props = {
  eyebrow?: string
  title?: string
  segments?: Testimonials012Segment[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отзывы, разложенные по сегментам аудитории. Стартап и агентство хвалят
// продукт за разное, и посетитель ищет отзыв «про таких, как я». Табы
// собраны на radio-инпутах и :has() — переключение работает без строчки
// JS, компонент остаётся серверным. Поддержано до четырёх сегментов.
const STYLES = `[data-vibeui-block="testimonials-012"] [data-part="heading"]{margin-bottom:1.75rem}
[data-vibeui-block="testimonials-012"] [data-part="card"]{margin:0}

:where([data-vibeui-block="testimonials-012"]){
--vibeui-testimonials-012-bg:transparent;
--vibeui-testimonials-012-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-012-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-012-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-012-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-012-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-012-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-testimonials-012-accent-ink:oklch(from var(--vibeui-testimonials-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-testimonials-012-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-012"]{color-scheme:dark}
[data-vibeui-block="testimonials-012"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-012-bg);color:var(--vibeui-testimonials-012-ink);
font-family:var(--vibeui-testimonials-012-font);
}
[data-vibeui-block="testimonials-012"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-012"] [data-part="tablist"]{
display:inline-flex;flex-wrap:wrap;gap:0.25rem;margin:0 0 1.5rem;
padding:0.25rem;border:1px solid var(--vibeui-testimonials-012-border);border-radius:999px;
background:color-mix(in oklab,var(--vibeui-testimonials-012-accent) 6%,var(--vibeui-testimonials-012-card));
}
[data-vibeui-block="testimonials-012"] [data-part="tab"]{
position:relative;display:inline-flex;align-items:center;
padding:0.4375rem 1rem;border-radius:999px;cursor:pointer;
color:var(--vibeui-testimonials-012-muted);
font-size:0.875rem;font-weight:640;line-height:1;white-space:nowrap;
transition:color var(--vibeui-testimonials-012-dur-2) ease,background-color var(--vibeui-testimonials-012-dur-2) ease;
}
[data-vibeui-block="testimonials-012"] [data-part="tab"] input{
position:absolute;inset:0;margin:0;opacity:0;cursor:inherit;
}
[data-vibeui-block="testimonials-012"] [data-part="tab"]:hover{color:var(--vibeui-testimonials-012-ink)}
[data-vibeui-block="testimonials-012"] [data-part="tab"]:has(input:checked){
background:var(--vibeui-testimonials-012-accent-fill);
color:var(--vibeui-testimonials-012-accent-ink);
}
[data-vibeui-block="testimonials-012"] [data-part="tab"]:has(input:focus-visible){
outline:2px solid var(--vibeui-testimonials-012-accent);outline-offset:2px;
}
[data-vibeui-block="testimonials-012"] [data-part="panel"]{display:none;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="testimonials-012"]:has([data-part="tab"] input[value="0"]:checked) [data-part="panel"][data-index="0"],
[data-vibeui-block="testimonials-012"]:has([data-part="tab"] input[value="1"]:checked) [data-part="panel"][data-index="1"],
[data-vibeui-block="testimonials-012"]:has([data-part="tab"] input[value="2"]:checked) [data-part="panel"][data-index="2"],
[data-vibeui-block="testimonials-012"]:has([data-part="tab"] input[value="3"]:checked) [data-part="panel"][data-index="3"]{display:grid}
@container (min-width: 44rem){
[data-vibeui-block="testimonials-012"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-012"] [data-part="panel"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SEGMENTS: Testimonials012Segment[] = [
  {
    label: "Стартапы",
    items: [
      {
        quote:
          "Нас двое, дизайнера нет. Выбрали блоки, отдали агенту — лендинг для инвесторов был готов к утренней встрече.",
        name: "Павел Гусев",
        role: "Сооснователь, Remark",
      },
      {
        quote:
          "Считали каждый день до запуска. Библиотека сэкономила нам недели: страница выглядит так, будто над ней работала студия.",
        name: "Мария Соболева",
        role: "CEO, «Слой»",
      },
    ],
  },
  {
    label: "Агентства",
    items: [
      {
        quote:
          "Пять проектов в месяц на одного дизайнера. Рутину закрыли блоками, дизайнеру осталась работа, ради которой его нанимали.",
        name: "Дмитрий Хан",
        role: "Основатель студии «Плот»",
      },
      {
        quote:
          "Клиент видит превью и получает ровно его. Исчезла самая дорогая фраза в нашей смете — «на сайте выглядит иначе».",
        name: "Ирина Белова",
        role: "Аккаунт-директор, «Верстак»",
      },
    ],
  },
  {
    label: "Продуктовые команды",
    items: [
      {
        quote:
          "Маркетинг собирает посадочные без очереди к фронтендерам. Разработка впервые за год занимается продуктом, а не лендингами.",
        name: "Игорь Демидов",
        role: "Технический директор, Sturm",
      },
      {
        quote:
          "Блоки пришли файлами в репозиторий, ноль новых зависимостей. Наш аудит безопасности прошёл их за один день.",
        name: "Ольга Титова",
        role: "Инженер, финтех",
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

/** Отзывы по сегментам аудитории: CSS-табы на radio-инпутах, без JS. */
export function Testimonials012({
  eyebrow = "Отзывы",
  title = "Каждый хвалит за своё",
  segments = DEFAULT_SEGMENTS,
  background = "",
  accent,
  className,
  style,
}: Testimonials012Props) {
  const visibleSegments = segments.slice(0, 4)
  const palette = {
    ...(accent ? { "--vibeui-testimonials-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-012"
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
          <fieldset data-part="tablist" aria-label="Сегменты отзывов">
            {visibleSegments.map((segment, index) => (
              <label key={segment.label} data-part="tab">
                <input
                  type="radio"
                  name="vibeui-testimonials-012-segment"
                  value={index}
                  defaultChecked={index === 0}
                />
                {segment.label}
              </label>
            ))}
          </fieldset>
          {visibleSegments.map((segment, index) => (
            <div key={segment.label} data-part="panel" data-index={index}>
              {segment.items.map((item) => (
                <Card043 key={item.name} data-part="card" name={item.name} quote={item.quote} image={item.image} role={item.role} accent={accent} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
