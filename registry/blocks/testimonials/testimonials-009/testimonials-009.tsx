import type { CSSProperties } from "react"

type Testimonials009Item = {
  name: string
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
const STYLES = `
:where([data-vibeui-block="testimonials-009"]){
--vibeui-testimonials-009-bg:transparent;
--vibeui-testimonials-009-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-009-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-009-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-009-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-009-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
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
[data-vibeui-block="testimonials-009"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-testimonials-009-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-009"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-009"] [data-part="wall"]{
columns:1;column-gap:1rem;
}
[data-vibeui-block="testimonials-009"] [data-part="post"]{
break-inside:avoid;margin:0 0 1rem;
padding:1.25rem;border:1px solid var(--vibeui-testimonials-009-border);border-radius:1rem;
background:var(--vibeui-testimonials-009-card);
}
[data-vibeui-block="testimonials-009"] [data-part="post-head"]{
display:flex;align-items:center;gap:0.625rem;margin-bottom:0.75rem;
}
[data-vibeui-block="testimonials-009"] [data-part="avatar"]{
width:2.25rem;height:2.25rem;flex:none;border-radius:999px;
display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-testimonials-009-accent) 14%,var(--vibeui-testimonials-009-card));
color:var(--vibeui-testimonials-009-accent);
font-size:0.75rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="testimonials-009"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="testimonials-009"] [data-part="name"]{font-size:0.875rem;font-weight:640}
[data-vibeui-block="testimonials-009"] [data-part="handle"]{color:var(--vibeui-testimonials-009-muted);font-size:0.75rem}
[data-vibeui-block="testimonials-009"] [data-part="text"]{
margin:0;font-size:0.9375rem;line-height:1.55;overflow-wrap:break-word;
}
[data-vibeui-block="testimonials-009"] [data-part="post-foot"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.875rem;
color:var(--vibeui-testimonials-009-muted);font-size:0.75rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="testimonials-009"] [data-part="heart"]{
width:0.875rem;height:0.875rem;flex:none;
color:var(--vibeui-testimonials-009-accent);
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

function formatLikes(likes: number) {
  return new Intl.NumberFormat("ru-RU").format(likes)
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
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="wall">
            {items.map((item) => (
              <article key={item.handle} data-part="post">
                <header data-part="post-head">
                  <span data-part="avatar" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                  <span data-part="who">
                    <span data-part="name">{item.name}</span>
                    <span data-part="handle">{item.handle}</span>
                  </span>
                </header>
                <p data-part="text">{item.text}</p>
                <footer data-part="post-foot">
                  <svg
                    data-part="heart"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21s-6.7-4.3-9.3-8.1C.6 9.9 1.6 5.9 4.9 4.6c2-.8 4.3-.2 5.8 1.4l1.3 1.3 1.3-1.3c1.5-1.6 3.8-2.2 5.8-1.4 3.3 1.3 4.3 5.3 2.2 8.3C18.7 16.7 12 21 12 21Z" />
                  </svg>
                  <span aria-label={`Отметок «нравится»: ${item.likes}`}>
                    {formatLikes(item.likes)}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
