import type { CSSProperties } from "react"
import { Card031 } from "@/registry/components/card/card-031/card-031"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Testimonials009Item = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  handle: string
  text: string
  likes: number
}

export type Testimonials009Props = {
  eyebrow?: string
  title?: string
  items?: Testimonials009Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Стена постов в стиле соцсети: аватар-инициалы, ник, текст, лайки.
// Пост выглядит честнее полированной цитаты — его писали не для лендинга.
// Masonry собрана на CSS columns с break-inside:avoid: посты разной длины
// ложатся плотно без единой строки JS и без измерения высот.
const STYLES = `[data-vibeui-block="testimonials-009"] [data-part="heading"]{margin-bottom:2rem}
[data-vibeui-block="testimonials-009"] [data-part="post"]{margin:0 0 1rem}

:where([data-vibeui-block="testimonials-009"]){
--vibeui-testimonials-009-bg:transparent;
--vibeui-testimonials-009-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-009-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-009-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-009-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-009-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-009"]{color-scheme:dark}
[data-vibeui-block="testimonials-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-009-bg);color:var(--vibeui-testimonials-009-ink);
font-family:var(--vibeui-testimonials-009-font);
}
[data-vibeui-block="testimonials-009"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-009"] [data-part="wall"]{
columns:1;column-gap:1rem;
}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-009"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-009"] [data-part="wall"]{columns:2}
}
@container (min-width: 64rem){
[data-vibeui-block="testimonials-009"] [data-part="wall"]{columns:3}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials009Item[] = [
  {
    name: "Анна Ковалёва",
    handle: "@akovaleva",
    text: "Собрала лендинг курса за вечер. Выбрала блоки в каталоге, скинула агенту — он поставил всё сам. Утром поправила тексты и запустила рекламу.",
    likes: 214,
  },
  {
    name: "Игорь Демидов",
    handle: "@idemidov",
    text: "Компоненты приходят обычными файлами в проект. Ничего не ломается при обновлении, потому что обновлять нечего.",
    likes: 187,
  },
  {
    name: "Пётр Ляхов",
    handle: "@plyakhov",
    text: "Впервые агент не изобрёл свою версию секции, а поставил ровно ту, что я выбрал. Инструкция для ИИ в комплекте решает.",
    likes: 342,
  },
  {
    name: "Мария Соболева",
    handle: "@msoboleva",
    text: "Два дня — и страница кампании в проде вместе с текстами. Успели к дате запуска, чего не случалось три года.",
    likes: 96,
  },
  {
    name: "Дмитрий Хан",
    handle: "@dkhan",
    text: "Дизайнер у нас один, а проектов пять. Библиотека закрыла рутину и оставила ему время на то, ради чего его нанимали. Секции совпадают с превью один в один, спорить стало не о чем.",
    likes: 158,
  },
  {
    name: "Ольга Титова",
    handle: "@otitova",
    text: "Взяли три блока — ноль новых зависимостей. Лучшая часть.",
    likes: 421,
  },
  {
    name: "Павел Гусев",
    handle: "@pgusev",
    text: "Переопределили переменные бренда за час, и секции легли в существующий сайт без конфликтов стилей.",
    likes: 133,
  },
  {
    name: "Ирина Белова",
    handle: "@ibelova",
    text: "Раньше спорили о вёрстке. Теперь спорим только о текстах — и это прогресс.",
    likes: 267,
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

/** Стена отзывов в стиле постов соцсети: ник, текст, лайки, masonry на CSS columns. */
export function Testimonials009({
  eyebrow = "Отзывы",
  title = "Что пишут о нас в сети",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials009Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-009"
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
          <div data-part="wall">
            {items.map((item) => (
              <Card031 key={item.handle} data-part="post" handle={item.handle} name={item.name} image={item.image} text={item.text} likes={item.likes} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
