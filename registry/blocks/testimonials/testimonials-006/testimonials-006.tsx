import type { CSSProperties } from "react"
import { Card029 } from "@/registry/components/card/card-029/card-029"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"


type Testimonials006Item = {
  quote: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  name: string
  role: string
  highlight?: boolean
}

export type Testimonials006Props = {
  title?: string
  description?: string
  items?: Testimonials006Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Стена отзывов колонками разной высоты. Сделана на CSS columns: карточки
// сами укладываются встык, разной длины, без единой строки JS и без
// подсчёта высот. Ровная сетка заставила бы подрезать цитаты под общий
// размер — а именно длина отзыва и есть признак того, что он настоящий.
const STYLES = `[data-vibeui-block="testimonials-006"] [data-part="heading"]{margin-bottom:2rem}
[data-vibeui-block="testimonials-006"] [data-part="card"]{margin:0 0 1rem}

:where([data-vibeui-block="testimonials-006"]){
--vibeui-testimonials-006-bg:light-dark(oklch(0.985 0 275),oklch(0.21 0 275));
--vibeui-testimonials-006-card:light-dark(oklch(1 0 0),oklch(0.26 0 275));
--vibeui-testimonials-006-ink:light-dark(oklch(0.22 0 275),oklch(0.97 0 275));
--vibeui-testimonials-006-muted:light-dark(oklch(0.5 0 275),oklch(0.76 0 275));
--vibeui-testimonials-006-border:light-dark(oklch(0.9 0 275),oklch(0.34 0 275));
--vibeui-testimonials-006-accent:light-dark(oklch(0.287 0 0),oklch(0.91 0 0));
--vibeui-testimonials-006-accent-fg:oklch(from var(--vibeui-testimonials-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-006"]{color-scheme:dark}
[data-vibeui-block="testimonials-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-006-bg);color:var(--vibeui-testimonials-006-ink);
font-family:var(--vibeui-testimonials-006-font);
}
[data-vibeui-block="testimonials-006"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-gap:1rem}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-006"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-count:2}
}
@container (min-width: 62rem){
[data-vibeui-block="testimonials-006"] [data-part="card"]{margin-bottom:1.25rem}
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-count:3;column-gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials006Item[] = [
  {
    quote:
      "Раньше каждый лендинг начинался с пустого файла и заканчивался спором о кнопке.",
    name: "Анна Ковалёва",
    role: "Маркетинг, «Северный путь»",
  },
  {
    quote:
      "Три месяца назад мы держали два набора компонентов: один для сайта, другой для приложения. Каждый релиз кто-нибудь забывал перенести правку, и половина работы уходила на сверку. Сейчас библиотека одна, и споров о том, какая версия кнопки правильная, просто не осталось.",
    name: "Игорь Демидов",
    role: "Технический директор, Sturm",
    highlight: true,
  },
  {
    quote:
      "Секции ставятся в проект копированием файла. Это звучит скучно ровно до первого обновления библиотеки в соседнем проекте.",
    name: "Пётр Ляхов",
    role: "Фронтенд-разработчик",
  },
  {
    quote:
      "У нас один дизайнер на пять продуктов. Он наконец занимается тем, чего не сделает шаблон.",
    name: "Дмитрий Хан",
    role: "Основатель студии «Плот»",
  },
  {
    quote:
      "Запускаем курс каждую неделю. Посадочная страница перестала быть узким местом: её собирает методист, а не очередь в дизайн-отделе. За квартал вышло семнадцать страниц, и ни одна не потребовала верстальщика.",
    name: "Мария Соболева",
    role: "Продюсер образовательных программ",
  },
  {
    quote:
      "Взяли три блока и не получили сорок мегабайт чужих зависимостей. Для нас это решило вопрос.",
    name: "Ольга Титова",
    role: "Инженер, финтех",
  },
  {
    quote:
      "Документация написана так, будто её писал тот, кто потом это поддерживает. Редкость.",
    name: "Кирилл Асеев",
    role: "Тимлид",
  },
  {
    quote:
      "Клиенты правят свои сайты сами и не звонят нам по субботам. Этого достаточно, чтобы остаться.",
    name: "Елена Ремизова",
    role: "Директор по продукту, «Артель»",
    highlight: true,
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Стена отзывов колонками разной высоты: длина цитаты остаётся как есть. */
export function Testimonials006({
  title = "Живая стена отзывов",
  description = "Мы не подрезали цитаты под одинаковый размер. Короткое осталось коротким, длинное — длинным: так видно, кому было что сказать.",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Testimonials006Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            lede={description}
            ledeWidth={54}
            accent={accent}
          />
          <div data-part="wall">
            {items.map((item) => (
              <Card029 key={item.name} data-part="card" name={item.name} highlight={item.highlight} quote={item.quote} image={item.image} role={item.role} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
