import type { CSSProperties } from "react"

export type Comments001Comment = {
  author: string
  /** Относительное время: «2 ч назад». */
  time: string
  text: string
  votes: number
  /** Один уровень вложенности: ответы под комментарием. */
  replies?: Comments001Comment[]
}

export type Comments001Props = {
  title?: string
  comments?: Comments001Comment[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Полноширинная секция-тред: собственная палитра --vibeui-comments-001-*,
// шрифт и keyframes живут здесь, а не в globals.css проекта. Селектор в
// :where() — нулевая специфичность, любой класс или inline style
// переопределяет значение.
//
// container-type делает секцию собственным query-контейнером: отступы и
// раскладка считаются от её ширины, а не от ширины окна, поэтому тред
// одинаков и на странице, и в масштабированной миниатюре каталога. Правила
// ширины живут в @container, а не в Tailwind-вариантах, чтобы блок не зависел
// от версии Tailwind в чужом проекте.
const STYLES = `
:where([data-vibeui-block="comments-001"]){
--vibeui-comments-001-bg:transparent;
--vibeui-comments-001-fg:light-dark(oklch(0.24 0.012 265),oklch(0.96 0.004 265));
--vibeui-comments-001-muted:light-dark(oklch(0.52 0.016 265),oklch(0.72 0.02 265));
--vibeui-comments-001-border:light-dark(oklch(0.9 0.006 265),oklch(1 0 0 / 12%));
--vibeui-comments-001-card:light-dark(oklch(0.99 0.002 265),oklch(0.25 0.01 265));
--vibeui-comments-001-accent:light-dark(oklch(0.55 0.2 264),oklch(0.72 0.16 264));
--vibeui-comments-001-accent-fg:light-dark(oklch(0.99 0.004 266),oklch(0.18 0.02 266));
--vibeui-comments-001-av-fg:oklch(0.99 0.01 265);
--vibeui-comments-001-av-0:light-dark(oklch(0.6 0.19 25),oklch(0.68 0.17 25));
--vibeui-comments-001-av-1:light-dark(oklch(0.62 0.16 145),oklch(0.7 0.15 145));
--vibeui-comments-001-av-2:light-dark(oklch(0.58 0.19 265),oklch(0.68 0.16 265));
--vibeui-comments-001-av-3:light-dark(oklch(0.64 0.16 55),oklch(0.72 0.15 55));
--vibeui-comments-001-av-4:light-dark(oklch(0.58 0.19 330),oklch(0.68 0.16 330));
--vibeui-comments-001-av-5:light-dark(oklch(0.58 0.13 200),oklch(0.7 0.13 200));
--vibeui-comments-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comments-001"]{color-scheme:dark}
[data-vibeui-block="comments-001"]{
display:block;box-sizing:border-box;width:100%;margin:0;
min-width:min(100%,18rem);
container-type:inline-size;
background:var(--vibeui-comments-001-bg);
color:var(--vibeui-comments-001-fg);
font-family:var(--vibeui-comments-001-font);
-webkit-font-smoothing:antialiased;
}
[data-vibeui-block="comments-001"] *{box-sizing:border-box}
[data-vibeui-block="comments-001"] [data-part="frame"]{
margin-inline:auto;width:100%;max-width:44rem;
padding:clamp(1.5rem,4cqi,3rem) clamp(1rem,4cqi,2rem);
}
[data-vibeui-block="comments-001"] [data-part="head"]{
display:flex;align-items:baseline;gap:0.5rem;
padding-bottom:1.25rem;margin-bottom:0.5rem;
border-bottom:1px solid var(--vibeui-comments-001-border);
}
[data-vibeui-block="comments-001"] [data-part="title"]{
margin:0;font-size:clamp(1.125rem,2.4cqi,1.5rem);font-weight:650;letter-spacing:-0.02em;
}
[data-vibeui-block="comments-001"] [data-part="count"]{
color:var(--vibeui-comments-001-muted);font-weight:550;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="comments-001"] [data-part="list"],
[data-vibeui-block="comments-001"] [data-part="replies"]{
list-style:none;margin:0;padding:0;
}
[data-vibeui-block="comments-001"] [data-part="item"]{
padding:1.25rem 0;border-bottom:1px solid var(--vibeui-comments-001-border);
}
[data-vibeui-block="comments-001"] [data-part="item"]:last-child{border-bottom:0}
[data-vibeui-block="comments-001"] [data-part="replies"]{
margin-top:1.25rem;margin-left:1.125rem;
padding-left:1.375rem;
border-left:2px solid var(--vibeui-comments-001-border);
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="comments-001"] [data-part="comment"]{
display:flex;gap:0.875rem;align-items:flex-start;
}
[data-vibeui-block="comments-001"] [data-part="avatar"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:9999px;
font-size:0.8125rem;font-weight:650;letter-spacing:0.01em;
color:var(--vibeui-comments-001-av-fg);
background:var(--vibeui-comments-001-av-0);
}
[data-vibeui-block="comments-001"] [data-part="replies"] [data-part="avatar"]{
width:2rem;height:2rem;font-size:0.6875rem;
}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="0"]{background:var(--vibeui-comments-001-av-0)}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="1"]{background:var(--vibeui-comments-001-av-1)}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="2"]{background:var(--vibeui-comments-001-av-2)}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="3"]{background:var(--vibeui-comments-001-av-3)}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="4"]{background:var(--vibeui-comments-001-av-4)}
[data-vibeui-block="comments-001"] [data-part="avatar"][data-av="5"]{background:var(--vibeui-comments-001-av-5)}
[data-vibeui-block="comments-001"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="comments-001"] [data-part="meta"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.25rem;
}
[data-vibeui-block="comments-001"] [data-part="author"]{
font-size:0.875rem;font-weight:600;letter-spacing:-0.01em;
}
[data-vibeui-block="comments-001"] [data-part="time"]{
font-size:0.75rem;color:var(--vibeui-comments-001-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="comments-001"] [data-part="text"]{
margin:0 0 0.625rem;font-size:0.9375rem;line-height:1.55;
color:var(--vibeui-comments-001-fg);overflow-wrap:break-word;
}
[data-vibeui-block="comments-001"] [data-part="votes"]{
display:inline-flex;align-items:center;gap:0.125rem;
padding:0.1875rem;border-radius:9999px;
border:1px solid var(--vibeui-comments-001-border);
background:var(--vibeui-comments-001-card);
}
[data-vibeui-block="comments-001"] [data-part="vote"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border:0;border-radius:9999px;
background:transparent;color:var(--vibeui-comments-001-muted);cursor:pointer;
transition:color .15s ease,background-color .15s ease;
}
[data-vibeui-block="comments-001"] [data-part="vote"] svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="comments-001"] [data-part="vote"]:hover{
color:var(--vibeui-comments-001-accent);
background:color-mix(in oklab,var(--vibeui-comments-001-accent) 12%,transparent);
}
[data-vibeui-block="comments-001"] [data-part="vote"]:focus-visible{
outline:2px solid var(--vibeui-comments-001-accent);outline-offset:2px;
}
[data-vibeui-block="comments-001"] [data-part="score"]{
min-width:1.5rem;text-align:center;font-size:0.8125rem;font-weight:600;
font-variant-numeric:tabular-nums;color:var(--vibeui-comments-001-fg);
}
/* Комментарии и ответы въезжают по очереди при монтировании: чистое время,
   стаггер — задержкой по номеру. Без scroll-driven, чтобы тред оживал сразу
   в поле зрения читателя. */
[data-vibeui-block="comments-001"] [data-part="item"],
[data-vibeui-block="comments-001"] [data-part="reply-item"]{
animation:vibeui-comments-001-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(1){animation-delay:0.04s}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(2){animation-delay:0.14s}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(3){animation-delay:0.24s}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(4){animation-delay:0.34s}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(5){animation-delay:0.44s}
[data-vibeui-block="comments-001"] [data-part="item"]:nth-child(n+6){animation-delay:0.54s}
[data-vibeui-block="comments-001"] [data-part="reply-item"]:nth-child(1){animation-delay:0.4s}
[data-vibeui-block="comments-001"] [data-part="reply-item"]:nth-child(2){animation-delay:0.5s}
[data-vibeui-block="comments-001"] [data-part="reply-item"]:nth-child(n+3){animation-delay:0.6s}
@container (min-width:34rem){
[data-vibeui-block="comments-001"] [data-part="comment"]{gap:1rem}
[data-vibeui-block="comments-001"] [data-part="text"]{font-size:0.9688rem}
}
@keyframes vibeui-comments-001-rise{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="comments-001"] *{animation:none!important;transition:none!important}
}
`

const CHEVRON_UP = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 10l4-4 4 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CHEVRON_DOWN = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const DEFAULT_COMMENTS: Comments001Comment[] = [
  {
    author: "Марина Ковалёва",
    time: "2 ч назад",
    text: "Обновление огонь. Новый режим фокуса реально убрал половину лишних кликов, за неделю привыкла и назад уже не хочется. Осталось бы ещё горячие клавиши настраивать.",
    votes: 42,
    replies: [
      {
        author: "Дмитрий Орлов",
        time: "1 ч назад",
        text: "Плюсую про горячие клавиши. Ещё бы экспорт настроек между устройствами — держу два рабочих места.",
        votes: 12,
      },
      {
        author: "Product Team",
        time: "48 мин назад",
        text: "Кастомные шорткаты уже в работе, целимся в следующий минорный релиз. Спасибо за фидбек!",
        votes: 9,
      },
    ],
  },
  {
    author: "Алексей Смирнов",
    time: "4 ч назад",
    text: "В целом хорошо, но на большом проекте боковая панель подтормаживает при переключении разделов. Заметно на списках от пары тысяч элементов.",
    votes: 27,
    replies: [
      {
        author: "Елена Титова",
        time: "3 ч назад",
        text: "Тоже ловлю лаги на длинных списках. Помогает свернуть неактивные группы, но это костыль.",
        votes: 6,
      },
    ],
  },
  {
    author: "Игорь Волков",
    time: "6 ч назад",
    text: "Тёмная тема наконец-то нормальная — контраст выправили, глаза вечером не режет. Мелочь, а пользуюсь каждый день.",
    votes: 18,
  },
  {
    author: "Наталья Белова",
    time: "8 ч назад",
    text: "Было бы здорово вернуть компактный вид карточек. После редизайна на ноутбуке помещается заметно меньше строк.",
    votes: 11,
  },
]

function initialsOf(author: string): string {
  const parts = author.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Детерминированный цвет аватара: сумма кодов имени по кругу из шести. */
function avatarIndex(author: string): number {
  let sum = 0

  for (let index = 0; index < author.length; index += 1) {
    sum += author.charCodeAt(index)
  }

  return sum % 6
}

function countAll(comments: Comments001Comment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countAll(comment.replies ?? []),
    0,
  )
}

function CommentCard({ comment }: { comment: Comments001Comment }) {
  return (
    <article data-part="comment">
      <div
        data-part="avatar"
        data-av={avatarIndex(comment.author)}
        aria-hidden="true"
      >
        {initialsOf(comment.author)}
      </div>
      <div data-part="body">
        <div data-part="meta">
          <span data-part="author">{comment.author}</span>
          <span data-part="time">{comment.time}</span>
        </div>
        <p data-part="text">{comment.text}</p>
        <div
          data-part="votes"
          role="group"
          aria-label={`Оценка: ${comment.votes}`}
        >
          <button type="button" data-part="vote" aria-label="За">
            {CHEVRON_UP}
          </button>
          <span data-part="score">{comment.votes}</span>
          <button type="button" data-part="vote" aria-label="Против">
            {CHEVRON_DOWN}
          </button>
        </div>
      </div>
    </article>
  )
}

/**
 * Секция-тред комментариев: аватары с инициалами, ответы одним уровнем и
 * голосование. Один файл, ноль зависимостей, собственная палитра, анимация
 * появления на чистом CSS.
 */
export function Comments001({
  title = "Комментарии",
  comments = DEFAULT_COMMENTS,
  accent,
  background = "",
  className,
  style,
}: Comments001Props) {
  const palette = {
    ...(accent ? { "--vibeui-comments-001-accent": accent } : null),
    ...(background ? { "--vibeui-comments-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const total = countAll(comments)

  return (
    <section
      data-vibeui-block="comments-001"
      data-slot="comments"
      className={className}
      style={palette}
    >
      <style href="vibeui-comments-001" precedence="medium">
        {STYLES}
      </style>
      <div data-part="frame">
        <header data-part="head">
          <h2 data-part="title">{title}</h2>
          <span data-part="count">· {total}</span>
        </header>
        <ol data-part="list">
          {comments.map((comment, index) => (
            <li data-part="item" key={`${comment.author}-${index}`}>
              <CommentCard comment={comment} />
              {comment.replies && comment.replies.length > 0 ? (
                <ol data-part="replies">
                  {comment.replies.map((reply, replyIndex) => (
                    <li
                      data-part="reply-item"
                      key={`${reply.author}-${replyIndex}`}
                    >
                      <CommentCard comment={reply} />
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
