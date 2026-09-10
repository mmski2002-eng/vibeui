import type { CSSProperties, ReactNode } from "react"

type Layout006Article = {
  title: string
  note: string
  tag: string
  href: string
}

export type Layout006Props = {
  /** Своя сетка вместо демонстрационной. */
  children?: ReactNode
  heading?: string
  /** Ведущий материал. */
  lead?: Layout006Article & { lede: string }
  /** Материалы сетки: первые два крупнее, остальные — заметки. */
  articles?: Layout006Article[]
  asideTitle?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Редакционная сетка: крупный ведущий материал, асимметричные карточки и
// узкая колонка коротких заметок. Визуальный ритм создаётся размером
// материалов, а не анимацией. Порядок чтения совпадает с DOM: ведущий
// материал первый на любой ширине. Обычная вертикальная прокрутка. Фото —
// CSS-заглушки с фиксированной пропорцией; реальные изображения передаёт
// проект. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-006"]){
--vibeui-layout-006-bg:#ffffff;
--vibeui-layout-006-ink:#000000;
--vibeui-layout-006-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-006-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-layout-006-panel:#f2f2f2;
--vibeui-layout-006-accent:#ff5900;
--vibeui-layout-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-006"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-006-bg);color:var(--vibeui-layout-006-ink);
font-family:var(--vibeui-layout-006-font);
}
[data-vibeui-block="layout-006"] *{box-sizing:border-box}
[data-vibeui-block="layout-006"] [data-part="shell"]{
max-width:84rem;margin:0 auto;padding:2rem 1rem 3rem;
display:flex;flex-direction:column;gap:1.5rem;
}
[data-vibeui-block="layout-006"] [data-part="heading"]{
margin:0;padding-bottom:0.875rem;border-bottom:3px solid var(--vibeui-layout-006-ink);
font-size:clamp(1.5rem,3.6cqi,2.25rem);letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="layout-006"] [data-part="grid"]{
display:grid;gap:1.5rem;
}
[data-vibeui-block="layout-006"] [data-part="tag"]{
font-size:0.75rem;font-weight:660;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-layout-006-accent);
}
[data-vibeui-block="layout-006"] [data-part="photo"]{
aspect-ratio:16/9;margin-bottom:0.625rem;
background:linear-gradient(155deg,#1a1a1a 0%,#3d3a35 100%);
}
[data-vibeui-block="layout-006"] [data-part="photo"][data-look="paper"]{
background:linear-gradient(155deg,#e8e6e1 0%,#cfccc4 100%);
}
[data-vibeui-block="layout-006"] [data-part="lead"]{
display:flex;flex-direction:column;gap:0.5rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="layout-006"] [data-part="lead"] h2{
margin:0;font-size:clamp(1.5rem,3.4cqi,2.375rem);line-height:1.1;
letter-spacing:-0.02em;font-weight:700;
transition:color .16s ease;
}
[data-vibeui-block="layout-006"] [data-part="lead"]:hover h2{color:var(--vibeui-layout-006-accent)}
[data-vibeui-block="layout-006"] [data-part="lead"] p{
margin:0;max-width:56ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-layout-006-muted);
}
[data-vibeui-block="layout-006"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.375rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="layout-006"] [data-part="card"] h3{
margin:0;font-size:1.1875rem;line-height:1.25;letter-spacing:-0.015em;font-weight:660;
transition:color .16s ease;
}
[data-vibeui-block="layout-006"] [data-part="card"]:hover h3{color:var(--vibeui-layout-006-accent)}
[data-vibeui-block="layout-006"] [data-part="card"] p{
margin:0;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-layout-006-muted);
}
[data-vibeui-block="layout-006"] [data-part="aside"]{
display:flex;flex-direction:column;
border-top:3px solid var(--vibeui-layout-006-ink);
}
[data-vibeui-block="layout-006"] [data-part="aside"] h2{
margin:0;padding:0.75rem 0 0.25rem;
font-size:0.8125rem;font-weight:680;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="layout-006"] [data-part="brief"]{
display:flex;flex-direction:column;gap:0.25rem;
padding:0.875rem 0;border-bottom:1px solid var(--vibeui-layout-006-line);
color:inherit;text-decoration:none;
}
[data-vibeui-block="layout-006"] [data-part="brief"]:last-child{border-bottom:0}
[data-vibeui-block="layout-006"] [data-part="brief"] h3{
margin:0;font-size:1rem;line-height:1.35;font-weight:600;
transition:color .16s ease;
}
[data-vibeui-block="layout-006"] [data-part="brief"]:hover h3{color:var(--vibeui-layout-006-accent)}
[data-vibeui-block="layout-006"] [data-part="brief"] span{
font-size:0.8125rem;color:var(--vibeui-layout-006-muted);
}
[data-vibeui-block="layout-006"] a:focus-visible{
outline:2px solid var(--vibeui-layout-006-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="layout-006"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="layout-006"] [data-part="grid"]{
grid-template-columns:minmax(0,7fr) minmax(0,5fr) 16rem;
grid-template-rows:auto auto;
}
[data-vibeui-block="layout-006"] [data-part="lead"]{grid-row:1/3}
[data-vibeui-block="layout-006"] [data-part="aside"]{grid-column:3;grid-row:1/3}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEAD = {
  title: "Как малые студии выигрывают у больших агентств",
  lede: "Пять команд из регионов рассказали, как берут проекты федерального масштаба: процессы, цены и то, о чём обычно молчат.",
  note: "",
  tag: "Главное",
  href: "#lead",
}

const DEFAULT_ARTICLES: Layout006Article[] = [
  {
    title: "Дизайн-система за месяц: опыт «Атласа»",
    note: "От аудита до первых собранных страниц.",
    tag: "Практика",
    href: "#a1",
  },
  {
    title: "Интервью: арт-директор о найме без портфолио",
    note: "Что смотреть вместо красивых картинок.",
    tag: "Люди",
    href: "#a2",
  },
]

const DEFAULT_BRIEFS: Layout006Article[] = [
  { title: "Вышел отчёт о зарплатах в дизайне", note: "12 минут", tag: "", href: "#b1" },
  { title: "Конференция «Сетка» объявила программу", note: "3 минуты", tag: "", href: "#b2" },
  { title: "Обновление типографики в вебе: что нового", note: "8 минут", tag: "", href: "#b3" },
  { title: "Опрос: инструменты команд в 2026", note: "5 минут", tag: "", href: "#b4" },
]

/** Редакционная сетка: ведущий материал, асимметричные карточки и колонка заметок. */
export function Layout006({
  children,
  heading = "Журнал",
  lead = DEFAULT_LEAD,
  articles = DEFAULT_ARTICLES,
  asideTitle = "Коротко",
  accent,
  className,
  style,
}: Layout006Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-006" className={className} style={palette}>
        <div data-part="shell">
          <h1 data-part="heading">{heading}</h1>
          {children ?? (
            <div data-part="grid">
              <a data-part="lead" href={lead.href}>
                <span data-part="photo" aria-hidden="true" />
                <span data-part="tag">{lead.tag}</span>
                <h2>{lead.title}</h2>
                <p>{lead.lede}</p>
              </a>
              {articles.map((article, index) => (
                <a data-part="card" href={article.href} key={article.href}>
                  <span
                    data-part="photo"
                    data-look={index % 2 ? "paper" : undefined}
                    aria-hidden="true"
                  />
                  <span data-part="tag">{article.tag}</span>
                  <h3>{article.title}</h3>
                  <p>{article.note}</p>
                </a>
              ))}
              <aside data-part="aside" aria-label={asideTitle}>
                <h2>{asideTitle}</h2>
                {DEFAULT_BRIEFS.map((brief) => (
                  <a data-part="brief" href={brief.href} key={brief.href}>
                    <h3>{brief.title}</h3>
                    <span>{brief.note}</span>
                  </a>
                ))}
              </aside>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
