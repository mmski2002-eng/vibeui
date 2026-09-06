import type { CSSProperties } from "react"

type People003Leader = {
  name: string
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
const STYLES = `
:where([data-vibeui-block="people-003"]){
--vibeui-people-003-bg:transparent;
--vibeui-people-003-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-003-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-003-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-003-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-people-003-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0 0 0 / 80%));
--vibeui-people-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
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
[data-vibeui-block="people-003"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-people-003-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="people-003"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="people-003"] [data-part="row"]{display:grid;gap:1.25rem}
[data-vibeui-block="people-003"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:1.25rem;margin:0;
padding:2rem;border:1px solid var(--vibeui-people-003-border);border-radius:1.25rem;
background:var(--vibeui-people-003-card);
transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;
}
[data-vibeui-block="people-003"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-people-003-accent) 40%,var(--vibeui-people-003-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-people-003-shadow);
}
[data-vibeui-block="people-003"] [data-part="person"]{
display:flex;align-items:center;gap:1rem;order:-1;
}
[data-vibeui-block="people-003"] [data-part="avatar"]{
width:4rem;height:4rem;flex:none;border-radius:999px;display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-people-003-accent) 12%,var(--vibeui-people-003-card));
color:var(--vibeui-people-003-accent);
font-size:1.25rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="people-003"] [data-part="who"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="people-003"] [data-part="name"]{font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="people-003"] [data-part="role"]{color:var(--vibeui-people-003-muted);font-size:0.875rem;line-height:1.4}
[data-vibeui-block="people-003"] [data-part="quote"]{
margin:0;padding-left:1rem;
border-left:2px solid color-mix(in oklab,var(--vibeui-people-003-accent) 55%,var(--vibeui-people-003-border));
font-size:1rem;line-height:1.65;
}
[data-vibeui-block="people-003"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="people-003"] [data-part="quote"]::after{content:"»"}
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
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
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="row">
            {leaders.map((leader) => (
              <figure key={leader.name} data-part="card">
                <blockquote data-part="quote">{leader.quote}</blockquote>
                <figcaption data-part="person">
                  <span data-part="avatar" aria-hidden="true">
                    {initials(leader.name)}
                  </span>
                  <span data-part="who">
                    <span data-part="name">{leader.name}</span>
                    <span data-part="role">{leader.role}</span>
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
