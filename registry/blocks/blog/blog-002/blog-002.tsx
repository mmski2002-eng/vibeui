import type { CSSProperties } from "react"

export type Blog002Section = {
  id: string
  heading: string
  paragraphs: string[]
  callout?: string
}

export type Blog002Props = {
  topic?: string
  title?: string
  lede?: string
  author?: string
  role?: string
  date?: string
  readingTime?: string
  tocTitle?: string
  sections?: Blog002Section[]
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: длинный текст, в котором не теряешься. Оглавление собрано из
// тех же заголовков, что и статья, и залипает сбоку на широком экране —
// читатель всегда видит, где он и сколько осталось. На узком блоке
// оглавление уезжает наверх и сворачивается в <details>: липкая колонка на
// телефоне съедает половину экрана.
//
// Заголовки несут id и scroll-margin-top, иначе после перехода по якорю
// строка прилипает к верхней кромке окна и читается наполовину. Ширина
// текста ограничена в ch, а не в пикселях: мера строки должна зависеть от
// размера шрифта, а не от разрешения.
const STYLES = `
:where([data-vibeui-block="blog-002"]){
--vibeui-blog-002-bg:transparent;
--vibeui-blog-002-soft:light-dark(oklch(0.975 0.004 265),oklch(0.255 0.012 265));
--vibeui-blog-002-fg:light-dark(oklch(0.2 0.014 265),oklch(0.95 0.005 265));
--vibeui-blog-002-muted:light-dark(oklch(0.5 0.014 265),oklch(0.71 0.012 265));
--vibeui-blog-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-blog-002-accent:light-dark(oklch(0.5 0.17 268),oklch(0.75 0.14 268));
--vibeui-blog-002-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 268));
--vibeui-blog-002-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-blog-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="blog-002"]{
background:var(--vibeui-blog-002-bg);color:var(--vibeui-blog-002-fg);
font-family:var(--vibeui-blog-002-sans);
}
[data-vibeui-block="blog-002"] *{box-sizing:border-box}
[data-vibeui-block="blog-002"] [data-part="frame"]{
max-width:72rem;margin:0 auto;padding:2.5rem 1.25rem 3rem;display:grid;gap:1.75rem;
}
[data-vibeui-block="blog-002"] [data-part="head"]{display:grid;gap:0.75rem;max-width:36rem}
[data-vibeui-block="blog-002"] [data-part="topic"]{
justify-self:start;padding:0.1875rem 0.5625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-blog-002-accent) 10%,transparent);
color:var(--vibeui-blog-002-accent);
font-size:0.6875rem;font-weight:660;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="blog-002"] h2{
margin:0;font-family:var(--vibeui-blog-002-serif);font-weight:600;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.12;letter-spacing:-0.02em;
}
[data-vibeui-block="blog-002"] [data-part="lede"]{
margin:0;font-size:1.0625rem;line-height:1.65;color:var(--vibeui-blog-002-muted);
}
[data-vibeui-block="blog-002"] [data-part="byline"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
padding-top:0.75rem;border-top:1px solid var(--vibeui-blog-002-border);
font-size:0.8125rem;color:var(--vibeui-blog-002-muted);
}
[data-vibeui-block="blog-002"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:9999px;
background:var(--vibeui-blog-002-accent);color:var(--vibeui-blog-002-on-accent);
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="blog-002"] [data-part="author"]{color:var(--vibeui-blog-002-fg);font-weight:640}
[data-vibeui-block="blog-002"] [data-part="dot"]{opacity:.5}
/* Оглавление на узком блоке сворачивается: липкая колонка съела бы экран. */
[data-vibeui-block="blog-002"] [data-part="toc"]{
align-self:start;padding:0.875rem 1rem;border-radius:0.9375rem;
border:1px solid var(--vibeui-blog-002-border);background:var(--vibeui-blog-002-soft);
}
[data-vibeui-block="blog-002"] summary{
list-style:none;cursor:pointer;display:flex;align-items:center;gap:0.4375rem;
font-size:0.6875rem;font-weight:680;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-blog-002-muted);
}
[data-vibeui-block="blog-002"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="blog-002"] [data-part="caret"]{
margin-left:auto;width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="blog-002"] details[open] [data-part="caret"]{transform:rotate(-135deg)}
[data-vibeui-block="blog-002"] ol{list-style:none;margin:0.75rem 0 0;padding:0;display:grid;gap:0.375rem;counter-reset:vibeui-toc}
[data-vibeui-block="blog-002"] ol a{
display:flex;gap:0.5rem;text-decoration:none;color:var(--vibeui-blog-002-muted);
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="blog-002"] ol a::before{
counter-increment:vibeui-toc;content:counter(vibeui-toc);
flex:none;width:1.125rem;font-variant-numeric:tabular-nums;
color:color-mix(in oklab,var(--vibeui-blog-002-accent) 70%,var(--vibeui-blog-002-muted));
font-weight:700;
}
[data-vibeui-block="blog-002"] ol a:hover{color:var(--vibeui-blog-002-accent)}
[data-vibeui-block="blog-002"] [data-part="article"]{max-width:38rem}
/* scroll-margin-top: без него якорь прилипает к кромке и режет строку. */
[data-vibeui-block="blog-002"] h3{
margin:1.75rem 0 0.625rem;scroll-margin-top:1.5rem;
font-family:var(--vibeui-blog-002-serif);font-weight:600;
font-size:1.3125rem;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="blog-002"] [data-part="article"] section:first-of-type h3{margin-top:0}
[data-vibeui-block="blog-002"] p{margin:0 0 0.875rem;font-size:1rem;line-height:1.75;max-width:68ch}
[data-vibeui-block="blog-002"] [data-part="callout"]{
margin:1rem 0 0.875rem;padding:0.875rem 1rem;border-radius:0.875rem;
border-left:3px solid var(--vibeui-blog-002-accent);
background:var(--vibeui-blog-002-soft);
font-size:0.9375rem;line-height:1.65;color:var(--vibeui-blog-002-fg);
}
[data-vibeui-block="blog-002"] a:focus-visible,
[data-vibeui-block="blog-002"] summary:focus-visible{outline:2px solid var(--vibeui-blog-002-accent);outline-offset:2px;border-radius:0.25rem}
@container (min-width: 52rem){
[data-vibeui-block="blog-002"] [data-part="frame"]{
padding:3.5rem 2rem 4rem;grid-template-columns:1fr 15rem;column-gap:3rem;align-items:start;
}
[data-vibeui-block="blog-002"] [data-part="head"]{grid-column:1;max-width:38rem}
[data-vibeui-block="blog-002"] [data-part="toc"]{grid-column:2;grid-row:1 / span 2;position:sticky;top:1.5rem}
[data-vibeui-block="blog-002"] [data-part="article"]{grid-column:1}
[data-vibeui-block="blog-002"] summary{pointer-events:none}
[data-vibeui-block="blog-002"] [data-part="caret"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Blog002Section[] = [
  {
    id: "blog-002-why",
    heading: "Почему брейкпоинты подводят",
    paragraphs: [
      "Медиазапрос знает только ширину окна. Карточка, которая на странице занимает треть, а в модальном окне — всю ширину, получает один и тот же набор правил и в обоих местах выглядит компромиссом.",
      "Мы долго лечили это классами-модификаторами: карточка узнавала о своём окружении из пропса. Каждое новое место требовало нового модификатора, и к сороковому компоненту разобраться в них было уже нельзя.",
    ],
  },
  {
    id: "blog-002-how",
    heading: "Как устроен контейнерный запрос",
    paragraphs: [
      "Элемент объявляет себя контейнером через container-type: inline-size, и его потомки получают доступ к его ширине. Дальше всё как в медиазапросе, только точка отсчёта — не окно, а ближайший контейнер.",
      "Важная тонкость: правило внутри @container не действует на сам контейнер. Раскладку приходится класть на внутреннюю обёртку, иначе запрос молча не срабатывает, и это ловят только глазами.",
    ],
    callout:
      "Единица cqi считает процент от ширины контейнера. С ней размер заголовка перестаёт зависеть от разрешения экрана и начинает зависеть от места, в которое поставили блок.",
  },
  {
    id: "blog-002-result",
    heading: "Что изменилось в проекте",
    paragraphs: [
      "Из компонентов ушли пропсы вроде compact и wide: карточка сама выбирает раскладку. Витрина каталога перестала врать — миниатюра показывает ровно то, что читатель увидит на своей странице.",
      "Медиазапросы остались там, где им и место: печать, тёмная тема и отступы самой страницы. Всё, что касается компонента, теперь считается от компонента.",
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

/**
 * Страница статьи с липким оглавлением и сворачиваемым списком на узком блоке.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Blog002({
  topic = "Вёрстка",
  title = "Контейнерные запросы вместо брейкпоинтов",
  lede = "Компонент должен знать свою ширину, а не ширину окна. Разбираем, что это меняет в вёрстке карточек и куда девать старые медиазапросы.",
  author = "Кирилл Дёмин",
  role = "фронтенд-разработчик",
  date = "4 марта 2025",
  readingTime = "11 минут",
  tocTitle = "В статье",
  sections = DEFAULT_SECTIONS,
  background = "",
  accent,
  className,
  style,
}: Blog002Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-002" precedence="medium">
        {STYLES}
      </style>
      <article
        data-vibeui-block="blog-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header data-part="head">
            <span data-part="topic">{topic}</span>
            <h2>{title}</h2>
            <p data-part="lede">{lede}</p>
            <p data-part="byline">
              <span data-part="avatar" aria-hidden="true">
                {author.slice(0, 1)}
              </span>
              <span data-part="author">{author}</span>
              <span>{role}</span>
              <span data-part="dot">·</span>
              <time>{date}</time>
              <span data-part="dot">·</span>
              <span>{readingTime}</span>
            </p>
          </header>

          <details data-part="toc" open>
            <summary>
              {tocTitle}
              <span data-part="caret" aria-hidden="true" />
            </summary>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </details>

          <div data-part="article">
            {sections.map((section) => (
              <section key={section.id}>
                <h3 id={section.id}>{section.heading}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.callout ? (
                  <p data-part="callout">{section.callout}</p>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
