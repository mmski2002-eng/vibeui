import type { CSSProperties } from "react"

type Blog015Link = {
  title: string
  note: string
  source: string
  href?: string
}

export type Blog015Props = {
  eyebrow?: string
  title?: string
  links?: Blog015Link[]
  subscribeTitle?: string
  subscribeNote?: string
  subscribeLabel?: string
  subscribeHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Дайджест недели: нумерованный список из пяти ссылок с комментарием и
// источником, снизу плашка подписки. Номера рисует CSS-счётчик — порядок
// в разметке и на экране один и тот же, а комментарий обязателен: ссылка
// без объяснения, зачем её открывать, в дайджесте не живёт.
const STYLES = `
:where([data-vibeui-block="blog-015"]){
--vibeui-blog-015-bg:transparent;
--vibeui-blog-015-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-015-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-015-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-015-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-blog-015-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-blog-015-fill-ink:oklch(0.15 0 0);
--vibeui-blog-015-tint:color-mix(in oklab,var(--vibeui-blog-015-accent) 10%,light-dark(oklch(1 0 0),oklch(0.22 0 0)));
--vibeui-blog-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-blog-015-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-015"]{color-scheme:dark}
[data-vibeui-block="blog-015"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-015-bg);color:var(--vibeui-blog-015-ink);
font-family:var(--vibeui-blog-015-font);
}
[data-vibeui-block="blog-015"] [data-part="shell"]{
max-width:46rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-015"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-015-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-015"] [data-part="title"]{
margin:0 0 1.75rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-015"] [data-part="list"]{
margin:0 0 2rem;padding:0;list-style:none;counter-reset:vibeui-blog-015;
display:flex;flex-direction:column;
}
[data-vibeui-block="blog-015"] [data-part="entry"]{
counter-increment:vibeui-blog-015;
display:grid;grid-template-columns:auto minmax(0,1fr);gap:0.375rem 1rem;
padding:1.125rem 0;border-top:1px solid var(--vibeui-blog-015-border);
}
[data-vibeui-block="blog-015"] [data-part="entry"]:first-child{border-top:0;padding-top:0}
[data-vibeui-block="blog-015"] [data-part="entry"]::before{
content:counter(vibeui-blog-015,decimal-leading-zero);
grid-row:1/span 3;
font-size:1.375rem;line-height:1.2;font-weight:800;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
color:var(--vibeui-blog-015-accent);
}
[data-vibeui-block="blog-015"] [data-part="entry-link"]{
color:inherit;text-decoration:none;
font-size:1.0625rem;font-weight:700;line-height:1.35;letter-spacing:-0.01em;
transition:color var(--vibeui-blog-015-dur-2) ease;
}
[data-vibeui-block="blog-015"] [data-part="entry-link"]:hover{color:var(--vibeui-blog-015-accent)}
[data-vibeui-block="blog-015"] [data-part="entry-link"]:focus-visible{
outline:2px solid var(--vibeui-blog-015-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="blog-015"] [data-part="note"]{
margin:0;color:var(--vibeui-blog-015-muted);font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="blog-015"] [data-part="source"]{
color:var(--vibeui-blog-015-muted);font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="blog-015"] [data-part="subscribe"]{
display:flex;flex-direction:column;gap:0.75rem;
padding:1.5rem;border-radius:1.125rem;
background:var(--vibeui-blog-015-tint);
border:1px solid color-mix(in oklab,var(--vibeui-blog-015-accent) 24%,var(--vibeui-blog-015-border));
}
[data-vibeui-block="blog-015"] [data-part="subscribe-title"]{
margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="blog-015"] [data-part="subscribe-note"]{
margin:0;color:var(--vibeui-blog-015-muted);font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="blog-015"] [data-part="subscribe-link"]{
align-self:flex-start;
padding:0.625rem 1.25rem;border-radius:999px;
background:var(--vibeui-blog-015-fill);color:var(--vibeui-blog-015-fill-ink);
text-decoration:none;font-size:0.875rem;font-weight:700;
transition:filter var(--vibeui-blog-015-dur-2) ease;
}
[data-vibeui-block="blog-015"] [data-part="subscribe-link"]:hover{filter:brightness(1.06)}
[data-vibeui-block="blog-015"] [data-part="subscribe-link"]:focus-visible{
outline:2px solid var(--vibeui-blog-015-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-015"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="blog-015"] [data-part="subscribe"]{
flex-direction:row;align-items:center;gap:1.25rem;padding:1.5rem 1.75rem;
}
[data-vibeui-block="blog-015"] [data-part="subscribe-text"]{flex:1 1 auto;display:grid;gap:0.25rem}
[data-vibeui-block="blog-015"] [data-part="subscribe-link"]{align-self:center;flex:none;white-space:nowrap}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Blog015Link[] = [
  {
    title: "Отдайте вёрстку агенту",
    note: "Главный текст недели: как «Copy for AI» превращает выбранный блок в готовую секцию чужого проекта.",
    source: "Журнал VibeUI",
  },
  {
    title: "Container queries в бою",
    note: "Блок меряет собственную ширину, а не окно, — и превью каталога перестаёт врать про мобильную вёрстку.",
    source: "Журнал VibeUI",
  },
  {
    title: "Один оранжевый на всю библиотеку",
    note: "Почему бренд держится на единственном акценте и как нейтрали не дают полутора тысячам блоков спорить.",
    source: "Журнал VibeUI",
  },
  {
    title: "Каталог без базы данных",
    note: "Registry как единственный источник истины: данные лежат в коде, и это осознанное решение, а не долг.",
    source: "Журнал VibeUI",
  },
  {
    title: "Фокус, который видно",
    note: "Проверяем блоки клавиатурой: где кольцо фокуса честное, а где секцию нельзя пройти без мыши.",
    source: "Журнал VibeUI",
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

/** Дайджест недели: пять нумерованных ссылок с комментариями и плашка подписки. */
export function Blog015({
  eyebrow = "Выпуск №21",
  title = "Дайджест недели",
  links = DEFAULT_LINKS,
  subscribeTitle = "Дайджест почтой каждую пятницу",
  subscribeNote = "Пять ссылок с комментариями: что читать и зачем. Без воды и повторов.",
  subscribeLabel = "Подписаться",
  subscribeHref = "#",
  background = "",
  accent,
  className,
  style,
}: Blog015Props) {
  const palette = {
    ...(accent
      ? { "--vibeui-blog-015-accent": accent, "--vibeui-blog-015-fill": accent }
      : null),
    ...(background
      ? {
          "--vibeui-blog-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="list">
            {links.map((link) => (
              <li key={link.title} data-part="entry">
                <a data-part="entry-link" href={link.href ?? "#"}>
                  {link.title}
                </a>
                <p data-part="note">{link.note}</p>
                <span data-part="source">{link.source}</span>
              </li>
            ))}
          </ol>
          <div data-part="subscribe">
            <div data-part="subscribe-text">
              <h3 data-part="subscribe-title">{subscribeTitle}</h3>
              <p data-part="subscribe-note">{subscribeNote}</p>
            </div>
            <a data-part="subscribe-link" href={subscribeHref}>
              {subscribeLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
