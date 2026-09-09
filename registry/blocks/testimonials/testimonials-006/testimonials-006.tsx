import type { CSSProperties } from "react"

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
const STYLES = `
:where([data-vibeui-block="testimonials-006"]){
--vibeui-testimonials-006-bg:light-dark(oklch(0.985 0 275),oklch(0.21 0 275));
--vibeui-testimonials-006-card:light-dark(oklch(1 0 0),oklch(0.26 0 275));
--vibeui-testimonials-006-ink:light-dark(oklch(0.22 0 275),oklch(0.97 0 275));
--vibeui-testimonials-006-muted:light-dark(oklch(0.5 0 275),oklch(0.76 0 275));
--vibeui-testimonials-006-border:light-dark(oklch(0.9 0 275),oklch(0.34 0 275));
--vibeui-testimonials-006-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.78 0.15 39.8));
--vibeui-testimonials-006-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0.05 39.8));
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
[data-vibeui-block="testimonials-006"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.03em;font-weight:720;
}
[data-vibeui-block="testimonials-006"] [data-part="text"]{
margin:0.75rem 0 2rem;max-width:54ch;
color:var(--vibeui-testimonials-006-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-gap:1rem}
[data-vibeui-block="testimonials-006"] [data-part="card"]{
break-inside:avoid;margin:0 0 1rem;
padding:1.375rem;border:1px solid var(--vibeui-testimonials-006-border);border-radius:1.125rem;
background:var(--vibeui-testimonials-006-card);
}
[data-vibeui-block="testimonials-006"] [data-part="card"][data-highlight="true"]{
border-color:color-mix(in oklab,var(--vibeui-testimonials-006-accent) 55%,transparent);
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-testimonials-006-accent) 12%,var(--vibeui-testimonials-006-card)),var(--vibeui-testimonials-006-card));
}
[data-vibeui-block="testimonials-006"] [data-part="quote"]{
margin:0 0 1rem;font-size:0.9375rem;line-height:1.65;
}
[data-vibeui-block="testimonials-006"] [data-part="author"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="testimonials-006"] [data-part="avatar"]{
position:relative;width:2rem;height:2rem;flex:none;border-radius:999px;
display:grid;place-items:center;color:var(--vibeui-testimonials-006-accent-fg);
font-size:0.6875rem;font-weight:760;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="testimonials-006"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-testimonials-006-accent);}
[data-vibeui-block="testimonials-006"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="testimonials-006"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:620}
[data-vibeui-block="testimonials-006"] [data-part="role"]{display:block;color:var(--vibeui-testimonials-006-muted);font-size:0.75rem;line-height:1.35}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-006"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-count:2}
}
@container (min-width: 62rem){
[data-vibeui-block="testimonials-006"] [data-part="wall"]{column-count:3;column-gap:1.25rem}
[data-vibeui-block="testimonials-006"] [data-part="card"]{margin-bottom:1.25rem}
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
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{description}</p>
          <div data-part="wall">
            {items.map((item) => (
              <figure
                key={item.name}
                data-part="card"
                data-highlight={item.highlight ? "true" : undefined}
              >
                <blockquote data-part="quote">{item.quote}</blockquote>
                <figcaption data-part="author">
                  <span
                    data-part="avatar"
                    data-empty={item.image ? undefined : "true"}
                    aria-hidden="true"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    {initials(item.name)}
                  </span>
                  <span>
                    <span data-part="name">{item.name}</span>
                    <span data-part="role">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
