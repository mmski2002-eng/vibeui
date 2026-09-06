import type { CSSProperties } from "react"

export type BlogAnim001Post = {
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  /** CSS-градиент обложки. Пусто — берётся из пресетов по индексу. */
  gradient?: string
}

export type BlogAnim001Props = {
  eyebrow?: string
  title?: string
  description?: string
  posts?: BlogAnim001Post[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Полноширинная секция «блог-индекс»: палитра, шрифт и keyframes живут здесь,
// а не в globals.css проекта. container-type делает секцию собственным
// query-контейнером — число колонок сетки считается от ширины блока, а не окна,
// поэтому раскладка одинакова и на странице, и в масштабированной миниатюре.
// Селектор в :where() имеет нулевую специфичность, любой inline style
// пользователя переопределяет значение.
const STYLES = `
:where([data-vibeui-block="blog-anim-001"]){
--vibeui-blog-anim-001-bg:transparent;
--vibeui-blog-anim-001-fg:light-dark(oklch(0.2 0 266),oklch(0.97 0 266));
--vibeui-blog-anim-001-muted:light-dark(oklch(0.52 0 266),oklch(0.72 0 266));
--vibeui-blog-anim-001-border:light-dark(oklch(0.16 0 266 / 12%),oklch(1 0 0 / 14%));
--vibeui-blog-anim-001-card:light-dark(oklch(1 0 0),oklch(0.22 0 266));
--vibeui-blog-anim-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-blog-anim-001-accent-fg:light-dark(oklch(0.99 0 266),oklch(0.17 0 266));
--vibeui-blog-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-anim-001"]{color-scheme:dark}
[data-vibeui-block="blog-anim-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);margin:0;
container-type:inline-size;
background:var(--vibeui-blog-anim-001-bg);
color:var(--vibeui-blog-anim-001-fg);
font-family:var(--vibeui-blog-anim-001-font);
}
[data-vibeui-block="blog-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="blog-anim-001"] [data-part="inner"]{
max-width:75rem;margin:0 auto;
padding:clamp(2.5rem,6cqi,5rem) clamp(1.25rem,4cqi,3rem);
}
[data-vibeui-block="blog-anim-001"] [data-part="header"]{
max-width:42rem;margin:0 0 clamp(1.75rem,4cqi,2.75rem);
}
[data-vibeui-block="blog-anim-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.8125rem;font-weight:600;letter-spacing:0.02em;
color:var(--vibeui-blog-anim-001-accent);
}
[data-vibeui-block="blog-anim-001"] [data-part="eyebrow"]::before{
content:"";width:1.25rem;height:1px;background:var(--vibeui-blog-anim-001-accent);
}
[data-vibeui-block="blog-anim-001"] [data-part="title"]{
margin:0;font-size:clamp(1.75rem,4.5cqi,2.75rem);line-height:1.08;
font-weight:680;letter-spacing:-0.02em;text-wrap:balance;
}
[data-vibeui-block="blog-anim-001"] [data-part="lead"]{
margin:0.75rem 0 0;font-size:clamp(1rem,1.6cqi,1.15rem);line-height:1.55;
color:var(--vibeui-blog-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="blog-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:clamp(1.25rem,2.5cqi,1.75rem);
}
@container (min-width:38rem){
[data-vibeui-block="blog-anim-001"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
}
@container (min-width:60rem){
[data-vibeui-block="blog-anim-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
[data-vibeui-block="blog-anim-001"] [data-part="card"]{
display:flex;flex-direction:column;overflow:hidden;
border-radius:1rem;border:1px solid var(--vibeui-blog-anim-001-border);
background:var(--vibeui-blog-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.04);
transition:transform .25s ease,box-shadow .25s ease;
animation:vibeui-blog-anim-001-rise .6s cubic-bezier(0.16,1,0.3,1) both;
}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(1){animation-delay:0ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(2){animation-delay:70ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(3){animation-delay:140ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(4){animation-delay:210ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(5){animation-delay:280ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:nth-child(6){animation-delay:350ms}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:hover{
transform:translateY(-3px);
box-shadow:0 18px 40px -22px oklch(0 0 0 / 0.35);
}
[data-vibeui-block="blog-anim-001"] [data-part="thumb"]{
position:relative;width:100%;aspect-ratio:16/10;
border-bottom:1px solid var(--vibeui-blog-anim-001-border);
}
[data-vibeui-block="blog-anim-001"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.625rem;flex:1;
padding:clamp(1rem,1.5cqi,1.25rem);
}
[data-vibeui-block="blog-anim-001"] [data-part="tag"]{
align-self:flex-start;display:inline-flex;align-items:center;
padding:0.1875rem 0.5625rem;border-radius:9999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-blog-anim-001-accent);
background:color-mix(in oklab,var(--vibeui-blog-anim-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-blog-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="blog-anim-001"] [data-part="ctitle"]{
margin:0;font-size:clamp(1.05rem,1.8cqi,1.2rem);line-height:1.25;
font-weight:640;letter-spacing:-0.01em;text-wrap:balance;
}
[data-vibeui-block="blog-anim-001"] [data-part="excerpt"]{
margin:0;font-size:0.9rem;line-height:1.5;
color:var(--vibeui-blog-anim-001-muted);
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="blog-anim-001"] [data-part="foot"]{
display:flex;align-items:center;gap:0.625rem;margin-top:auto;padding-top:0.375rem;
}
[data-vibeui-block="blog-anim-001"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.875rem;height:1.875rem;border-radius:9999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.01em;
color:var(--vibeui-blog-anim-001-accent-fg);
background:var(--vibeui-blog-anim-001-accent);
}
[data-vibeui-block="blog-anim-001"] [data-part="byline"]{
display:flex;flex-direction:column;min-width:0;
}
[data-vibeui-block="blog-anim-001"] [data-part="author"]{
font-size:0.8125rem;font-weight:600;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="blog-anim-001"] [data-part="sub"]{
font-size:0.75rem;line-height:1.3;color:var(--vibeui-blog-anim-001-muted);
font-variant-numeric:tabular-nums;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@keyframes vibeui-blog-anim-001-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="blog-anim-001"] [data-part="card"]{animation:none}
[data-vibeui-block="blog-anim-001"] [data-part="card"]:hover{transform:none}
}
`

// Пресеты обложек: чистый CSS-градиент, ноль внешних картинок. Циклятся по
// индексу карточки, если у поста не задан собственный gradient.
const GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6 55%,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#22d3ee 55%,#14b8a6)",
  "linear-gradient(135deg,#f97316,#f43f5e 55%,#a855f7)",
  "linear-gradient(135deg,#10b981,#84cc16 55%,#eab308)",
]

const DEFAULT_POSTS: BlogAnim001Post[] = [
  {
    category: "Продукт",
    title: "Как мы сократили время сборки вдвое",
    excerpt:
      "Перешли на инкрементальные артефакты и кеш зависимостей — рассказываем, что дало основной выигрыш и где были тупики.",
    author: "Мария Лопес",
    date: "12 авг 2026",
    readTime: "6 мин чтения",
  },
  {
    category: "Дизайн",
    title: "Система токенов, которая пережила три редизайна",
    excerpt:
      "Три уровня токенов: примитив, семантика, компонент. Почему такое разделение спасает при смене бренда.",
    author: "Алекс Пак",
    date: "5 авг 2026",
    readTime: "8 мин чтения",
  },
  {
    category: "Инженерия",
    title: "Server Components на практике: год спустя",
    excerpt:
      "Что реально изменилось в архитектуре, где границы клиента и сервера проходят удачно, а где мы ошиблись.",
    author: "Сара Чен",
    date: "28 июл 2026",
    readTime: "11 мин чтения",
  },
  {
    category: "Продукт",
    title: "Онбординг без единого модального окна",
    excerpt:
      "Отказались от туров и попапов в пользу пустых состояний с подсказками — метрики активации выросли на 23%.",
    author: "Йонас Вебер",
    date: "19 июл 2026",
    readTime: "5 мин чтения",
  },
  {
    category: "Инженерия",
    title: "Наблюдаемость для команды из пяти человек",
    excerpt:
      "Минимальный стек трейсинга и логов, который не требует отдельного SRE и окупается на первом же инциденте.",
    author: "Нина Ковач",
    date: "9 июл 2026",
    readTime: "7 мин чтения",
  },
  {
    category: "Дизайн",
    title: "Анимации, которые не мешают работать",
    excerpt:
      "Правила движения интерфейса: длительность, кривые и обязательный prefers-reduced-motion в каждом компоненте.",
    author: "Дмитрий Соколов",
    date: "1 июл 2026",
    readTime: "4 мин чтения",
  },
]

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Инициалы автора: первые буквы первого и последнего слова имени.
 */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "•"
  }

  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""

  return (first + last).toUpperCase()
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Секция «блог-индекс»: заголовок раздела и сетка карточек статей.
 * Один файл, ноль зависимостей, собственная палитра. Число колонок реагирует
 * на ширину блока через @container, карточки въезжают со стаггером на CSS.
 */
export function BlogAnim001({
  eyebrow = "Из блога",
  title = "Последние статьи",
  description = "Заметки команды о продукте, дизайне и инженерии — коротко и по делу.",
  posts = DEFAULT_POSTS,
  accent,
  background = "",
  className,
  style,
}: BlogAnim001Props) {
  const rootStyle = {
    ...(accent ? { "--vibeui-blog-anim-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-anim-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <section
      data-vibeui-block="blog-anim-001"
      data-slot="blog-index"
      className={cx(className)}
      style={rootStyle}
    >
      <style href="vibeui-blog-anim-001" precedence="medium">
        {STYLES}
      </style>

      <div data-part="inner">
        <header data-part="header">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          {title ? <h2 data-part="title">{title}</h2> : null}
          {description ? <p data-part="lead">{description}</p> : null}
        </header>

        <div data-part="grid">
          {posts.map((post, index) => (
            <article data-part="card" key={`${post.title}-${index}`}>
              <div
                data-part="thumb"
                aria-hidden="true"
                style={{
                  background: post.gradient ?? GRADIENTS[index % GRADIENTS.length],
                }}
              />
              <div data-part="body">
                <span data-part="tag">{post.category}</span>
                <h3 data-part="ctitle">{post.title}</h3>
                <p data-part="excerpt">{post.excerpt}</p>
                <div data-part="foot">
                  <span data-part="avatar" aria-hidden="true">
                    {initialsOf(post.author)}
                  </span>
                  <span data-part="byline">
                    <span data-part="author">{post.author}</span>
                    <span data-part="sub">
                      {post.date} · {post.readTime}
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
