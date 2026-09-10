import type { CSSProperties, ReactNode } from "react"

type Layout010Chapter = {
  label: string
  href: string
}

export type Layout010Props = {
  /** Свой материал вместо демонстрационного. */
  children?: ReactNode
  kicker?: string
  title?: string
  meta?: string
  /** Оглавление материала. */
  chapters?: Layout010Chapter[]
  chaptersLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Длинное чтение: спокойная колонка текста около 42rem, крупный заголовок,
// оглавление раскрытием, выразительные изображения, цитата и боковые
// заметки, идущие в потоке рядом со своим фрагментом. Прокрутка
// естественная; индикатор прогресса чтения при желании добавляет
// scrollspy принимающего проекта — каркас не тащит собственный.
// Якоря глав работают без анимации. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-010"]){
--vibeui-layout-010-bg:#ffffff;
--vibeui-layout-010-ink:#000000;
--vibeui-layout-010-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-010-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-010-panel:#f2f2f2;
--vibeui-layout-010-accent:#ff5900;
--vibeui-layout-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-010"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-010-bg);color:var(--vibeui-layout-010-ink);
font-family:var(--vibeui-layout-010-font);
}
[data-vibeui-block="layout-010"] *{box-sizing:border-box}
[data-vibeui-block="layout-010"] [data-part="shell"]{
max-width:42rem;margin:0 auto;padding:3rem 1rem 4rem;
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="layout-010"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-layout-010-accent);
}
[data-vibeui-block="layout-010"] [data-part="title"]{
margin:0;font-size:clamp(2rem,5.5cqi,3.25rem);line-height:1.08;
letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="layout-010"] [data-part="meta"]{
margin:0;font-size:0.9375rem;color:var(--vibeui-layout-010-muted);
padding-bottom:1rem;border-bottom:1px solid var(--vibeui-layout-010-line);
}
[data-vibeui-block="layout-010"] [data-part="chapters"]{
border:1px solid var(--vibeui-layout-010-line);
}
[data-vibeui-block="layout-010"] [data-part="chapters"] summary{
list-style:none;cursor:pointer;user-select:none;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.75rem 1rem;font-size:0.9375rem;font-weight:620;
}
[data-vibeui-block="layout-010"] [data-part="chapters"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="layout-010"] [data-part="chapters"] summary::after{
content:"";width:0.4375rem;height:0.4375rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="layout-010"] [data-part="chapters"][open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="layout-010"] [data-part="chapters"] nav{
display:flex;flex-direction:column;padding:0 1rem 0.75rem;
}
[data-vibeui-block="layout-010"] [data-part="chapters"] a{
padding:0.375rem 0;color:var(--vibeui-layout-010-muted);text-decoration:none;
font-size:0.9375rem;
transition:color .16s ease;
}
[data-vibeui-block="layout-010"] [data-part="chapters"] a:hover{color:var(--vibeui-layout-010-accent)}
[data-vibeui-block="layout-010"] [data-part="body"]{
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="layout-010"] [data-part="body"] h2{
margin:1rem 0 0;font-size:1.5rem;letter-spacing:-0.015em;font-weight:660;
scroll-margin-top:2rem;
}
[data-vibeui-block="layout-010"] [data-part="body"] p{
margin:0;font-size:1.0625rem;line-height:1.75;
color:color-mix(in oklab,#000000 84%,#ffffff);
}
[data-vibeui-block="layout-010"] [data-part="figure"]{
margin:0.5rem -1rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="layout-010"] [data-part="figure"] [data-part="image"]{
aspect-ratio:16/9;
background:linear-gradient(150deg,#2b3036 0%,#5a6169 48%,#93887a 100%);
}
[data-vibeui-block="layout-010"] [data-part="figure"] figcaption{
padding:0 1rem;font-size:0.8125rem;color:var(--vibeui-layout-010-muted);
}
[data-vibeui-block="layout-010"] [data-part="quote"]{
margin:0.75rem 0;padding:0.25rem 0 0.25rem 1.25rem;
border-left:3px solid var(--vibeui-layout-010-accent);
}
[data-vibeui-block="layout-010"] [data-part="quote"] p{
font-size:1.25rem;line-height:1.5;font-weight:560;letter-spacing:-0.01em;
color:var(--vibeui-layout-010-ink);
}
[data-vibeui-block="layout-010"] [data-part="quote"] cite{
display:block;margin-top:0.5rem;font-style:normal;
font-size:0.875rem;color:var(--vibeui-layout-010-muted);
}
[data-vibeui-block="layout-010"] [data-part="aside"]{
background:var(--vibeui-layout-010-panel);padding:1rem 1.25rem;
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="layout-010"] [data-part="aside"] strong{
font-size:0.875rem;font-weight:660;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="layout-010"] [data-part="aside"] p{
font-size:0.9375rem;line-height:1.6;color:var(--vibeui-layout-010-muted);
}
[data-vibeui-block="layout-010"] a:focus-visible,
[data-vibeui-block="layout-010"] summary:focus-visible{
outline:2px solid var(--vibeui-layout-010-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="layout-010"] [data-part="shell"]{padding:4rem 0 5rem}
[data-vibeui-block="layout-010"] [data-part="figure"]{margin:0.5rem -3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHAPTERS: Layout010Chapter[] = [
  { label: "Почему строка не шире 75 знаков", href: "#width" },
  { label: "Воздух и интерлиньяж", href: "#air" },
  { label: "Изображения в тексте", href: "#images" },
]

function DemoBody() {
  return (
    <>
      <p>
        Лонгрид держится на трёх вещах: спокойной колонке, честном
        интерлиньяже и редких, но крупных изображениях. Всё остальное —
        украшения, которые легко пережить.
      </p>
      <h2 id="width">Почему строка не шире 75 знаков</h2>
      <p>
        Глазу нужно возвращаться к началу строки без усилия. Колонка в 42rem
        с кеглем 17 пикселей даёт около семидесяти знаков — комфортная длина
        для кириллицы, проверенная веками книжной вёрстки.
      </p>
      <div data-part="aside">
        <strong>Заметка на полях</strong>
        <p>
          На узком экране боковые заметки встают в поток рядом со своим
          фрагментом — а не прячутся и не уезжают в конец.
        </p>
      </div>
      <h2 id="air">Воздух и интерлиньяж</h2>
      <p>
        Интерлиньяж 1,75 оставляет строкам воздух, а отступы между абзацами
        держат ритм. Читатель не замечает вёрстку — и это лучший комплимент.
      </p>
      <blockquote data-part="quote">
        <p>
          «Хорошая типографика невидима: замечают только плохую».
        </p>
        <cite>— из редакционного гайда</cite>
      </blockquote>
      <figure data-part="figure">
        <div data-part="image" role="img" aria-label="Разворот книги на столе" />
        <figcaption>Изображения выходят за колонку, но не ломают чтение.</figcaption>
      </figure>
      <h2 id="images">Изображения в тексте</h2>
      <p>
        Крупный кадр дышит шире колонки текста — это выделяет его, не
        превращая страницу в галерею. Подпись остаётся у кадра.
      </p>
    </>
  )
}

/** Каркас лонгрида: спокойная колонка, оглавление, цитаты и заметки в потоке. */
export function Layout010({
  children,
  kicker = "Исследование",
  title = "Как читается длинный текст",
  meta = "Ольга Ветрова · 14 минут чтения · 8 сентября 2026",
  chapters = DEFAULT_CHAPTERS,
  chaptersLabel = "Содержание",
  accent,
  className,
  style,
}: Layout010Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-010" precedence="medium">
        {STYLES}
      </style>
      <article data-vibeui-block="layout-010" className={className} style={palette}>
        <div data-part="shell">
          <p data-part="kicker">{kicker}</p>
          <h1 data-part="title">{title}</h1>
          <p data-part="meta">{meta}</p>
          {chapters.length > 0 ? (
            <details data-part="chapters" open>
              <summary>{chaptersLabel}</summary>
              <nav aria-label={chaptersLabel}>
                {chapters.map((chapter) => (
                  <a key={chapter.href} href={chapter.href}>
                    {chapter.label}
                  </a>
                ))}
              </nav>
            </details>
          ) : null}
          <div data-part="body">{children ?? <DemoBody />}</div>
        </div>
      </article>
    </>
  )
}
