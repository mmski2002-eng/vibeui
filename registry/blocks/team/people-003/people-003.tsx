import type { CSSProperties } from "react"
import { Card051 } from "@/registry/components/card/card-051/card-051"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type People003Leader = {
  name: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  role: string
  quote: string
}

export type People003Props = {
  eyebrow?: string
  title?: string
  leaders?: People003Leader[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Ряд руководителей: три крупные карточки, у каждого — прямая речь. Цитата
// здесь важнее регалий: должность говорит, кем человек работает, а цитата —
// как он думает. Инициалы вместо фотографий: стоковые лица в разделе
// «Команда» подрывают доверие быстрее, чем их отсутствие.
const STYLES = `[data-vibeui-block="people-003"] [data-part="heading"]{margin-bottom:2rem}
[data-vibeui-block="people-003"] [data-part="card"]{margin:0}

:where([data-vibeui-block="people-003"]){
--vibeui-people-003-bg:transparent;
--vibeui-people-003-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-003-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-003-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-003-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-people-003-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
--vibeui-people-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-people-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-003"]{color-scheme:dark}
[data-vibeui-block="people-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-003-bg);color:var(--vibeui-people-003-ink);
font-family:var(--vibeui-people-003-font);
}
[data-vibeui-block="people-003"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-003"] [data-part="row"]{display:grid;gap:1.25rem}
@container (min-width: 48rem){
[data-vibeui-block="people-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="people-003"] [data-part="row"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEADERS: People003Leader[] = [
  {
    name: "Алексей Громов",
    role: "Основатель и продукт",
    quote:
      "Мы не продаём компоненты — мы продаём вечер, за который маркетолог собирает страницу без разработчика.",
  },
  {
    name: "Вера Лапина",
    role: "Руководитель дизайна",
    quote:
      "Каждый блок обязан выдержать чужой бренд: поменяли акцент и тексты — и он всё ещё выглядит спроектированным.",
  },
  {
    name: "Марат Гареев",
    role: "Технический директор",
    quote:
      "Один файл и ноль зависимостей — не ограничение, а обещание: через год проект соберётся точно так же.",
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

/** Ряд руководителей: три крупные карточки с прямой речью каждого. */
export function People003({
  eyebrow = "Руководство",
  title = "Кто отвечает за то, что вы скачиваете",
  leaders = DEFAULT_LEADERS,
  background = "",
  accent,
  className,
  style,
}: People003Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-people-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-003"
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
          <div data-part="row">
            {leaders.map((leader) => (
              <Card051 key={leader.name} data-part="card" name={leader.name} quote={leader.quote} image={leader.image} role={leader.role} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
