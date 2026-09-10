import type { CSSProperties, ReactNode } from "react"

type Surface014Chapter = {
  /** Поверхность главы. */
  surface: "white" | "graphite" | "orange"
  /** Содержимое главы. */
  content: ReactNode
}

export type Surface014Props = {
  /** Главы с собственными поверхностями. Без них — демонстрационные три. */
  chapters?: Surface014Chapter[]
  className?: string
  style?: CSSProperties
}

// Фон, меняющийся по главам: единая страница проходит белую, графитовую
// и оранжевую поверхности. Для истории продукта и спецпроекта. Каждой
// поверхности соответствует согласованный набор цветов текста и ссылок —
// случайного промежуточного контраста не бывает: смена происходит на
// границе секции, плавность сознательно не добавлена (reduced motion
// и обычный режим ведут себя одинаково). Один источник глав — данные.
const STYLES = `
:where([data-vibeui-block="surface-014"]){
--vibeui-surface-014-accent:#ff5900;
--vibeui-surface-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="surface-014"]{
display:block;min-width:min(100%,16rem);
font-family:var(--vibeui-surface-014-font);
}
[data-vibeui-block="surface-014"] *{box-sizing:border-box}
[data-vibeui-block="surface-014"] [data-part="chapter"]{
--vibeui-surface-014-bg:#ffffff;
--vibeui-surface-014-ink:#000000;
--vibeui-surface-014-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-014-mark:var(--vibeui-surface-014-accent);
background:var(--vibeui-surface-014-bg);color:var(--vibeui-surface-014-ink);
}
[data-vibeui-block="surface-014"] [data-part="chapter"][data-surface="graphite"]{
--vibeui-surface-014-bg:#1a1a1a;
--vibeui-surface-014-ink:#ffffff;
--vibeui-surface-014-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
}
[data-vibeui-block="surface-014"] [data-part="chapter"][data-surface="orange"]{
--vibeui-surface-014-bg:var(--vibeui-surface-014-accent);
--vibeui-surface-014-ink:#000000;
--vibeui-surface-014-muted:color-mix(in oklab,#000000 62%,var(--vibeui-surface-014-accent));
--vibeui-surface-014-mark:#000000;
}
[data-vibeui-block="surface-014"] [data-part="inner"]{
max-width:80rem;margin:0 auto;min-height:22rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1rem;
}
[data-vibeui-block="surface-014"] [data-part="chapter"] h2{
margin:0;max-width:24ch;
font-size:clamp(1.75rem,4.6cqi,3rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="surface-014"] [data-part="chapter"] p{
margin:0;max-width:48ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-014-muted);
}
[data-vibeui-block="surface-014"] [data-part="index"]{
display:inline-flex;align-items:center;gap:0.625rem;
font-size:0.8125rem;font-weight:640;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-014-muted);
}
[data-vibeui-block="surface-014"] [data-part="index"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-014-mark);
}
[data-vibeui-block="surface-014"] a{
color:var(--vibeui-surface-014-ink);
text-decoration-color:var(--vibeui-surface-014-mark);text-underline-offset:0.1875rem;
}
[data-vibeui-block="surface-014"] a:focus-visible{
outline:2px solid var(--vibeui-surface-014-mark);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-014"] [data-part="inner"]{padding:5.5rem 3rem;min-height:26rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-014"] *{animation:none!important;transition:none!important}}
`

const DEMO_CHAPTERS: Surface014Chapter[] = [
  {
    surface: "white",
    content: (
      <>
        <span data-part="index">Глава 01 · Начало</span>
        <h2>История начинается на белом</h2>
        <p>
          Спокойная бумажная поверхность для завязки: контекст, команда,
          проблема. Текст чёрный, акцент точечный.
        </p>
      </>
    ),
  },
  {
    surface: "graphite",
    content: (
      <>
        <span data-part="index">Глава 02 · Работа</span>
        <h2>Глубина — там, где процесс</h2>
        <p>
          Графит меняет настроение раздела: цвета текста и ссылок
          согласованы заранее, промежуточных состояний нет.
        </p>
      </>
    ),
  },
  {
    surface: "orange",
    content: (
      <>
        <span data-part="index">Глава 03 · Результат</span>
        <h2>Финал звучит оранжевым</h2>
        <p>
          Кульминация на фирменной плоскости с чёрной типографикой —
          и страница закрывается на пике.
        </p>
      </>
    ),
  },
]

/** Единая страница из глав с белой, графитовой и оранжевой поверхностями. */
export function Surface014({ chapters = DEMO_CHAPTERS, className, style }: Surface014Props) {
  return (
    <>
      <style href="vibeui-surface-014" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="surface-014" className={className} style={style}>
        {chapters.map((chapter, index) => (
          <section
            data-part="chapter"
            data-surface={chapter.surface === "white" ? undefined : chapter.surface}
            key={index}
          >
            <div data-part="inner">{chapter.content}</div>
          </section>
        ))}
      </div>
    </>
  )
}
